from typing import Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, Header, Request, status
from sqlalchemy.orm import Session

from backend.db.session import get_db
from backend.models.user import User
from backend.dependencies.auth import get_current_user
from backend.services.payment_service import (
    PLANS,
    create_cashfree_order,
    verify_cashfree_payment,
    verify_cashfree_webhook_signature,
    get_user_subscription_status,
    cancel_user_subscription,
    start_free_trial,
)

router = APIRouter(prefix="/payments", tags=["Cashfree Payments"])


class CreateOrderRequest(BaseModel):
    plan_id: str = "premium_monthly"


class VerifyPaymentRequest(BaseModel):
    order_id: Optional[str] = None
    cashfree_order_id: Optional[str] = None
    # Backward compatibility aliases
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    razorpay_signature: Optional[str] = None
    signature: Optional[str] = None


@router.get("/plans")
def get_available_plans():
    """Returns available pricing plans and details for Cashfree checkout."""
    return {
        "success": True,
        "plans": PLANS,
    }


@router.post("/start-free-trial")
def start_free_trial_endpoint(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Activates an immediate 30-day Free Trial of TrueMarriage PRO for the user.
    """
    success, message, data = start_free_trial(db=db, user=current_user)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "message": message},
        )
    return {
        "success": True,
        "message": message,
        "trial": data,
    }


@router.post("/create-order")
def create_order_endpoint(
    payload: CreateOrderRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Creates a new Cashfree checkout order and returns payment_session_id.
    Requires authenticated user session.
    """
    try:
        order_details = create_cashfree_order(
            db=db,
            user=current_user,
            plan_id=payload.plan_id,
        )
        return {
            "success": True,
            "order": order_details,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "message": str(e)},
        )


@router.post("/verify")
def verify_payment_endpoint(
    payload: VerifyPaymentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Verifies payment with Cashfree API and upgrades user to TrueMarriage PRO.
    """
    order_lookup_id = (
        payload.order_id
        or payload.cashfree_order_id
        or payload.razorpay_order_id
    )

    if not order_lookup_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "message": "order_id is required for verification"},
        )

    success, message, order = verify_cashfree_payment(
        db=db,
        user=current_user,
        order_id=order_lookup_id,
        signature=payload.signature or payload.razorpay_signature,
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "message": message},
        )

    return {
        "success": True,
        "message": message,
        "order_id": order.cashfree_order_id if order else order_lookup_id,
        "plan_id": order.plan_id if order else "premium_monthly",
        "is_premium": current_user.is_premium,
        "premium_until": current_user.premium_until.isoformat() if current_user.premium_until else None,
    }


@router.get("/subscription-status")
def get_subscription_status_endpoint(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Returns current subscription and renewal details for the authenticated user.
    """
    status_data = get_user_subscription_status(db=db, user=current_user)
    return {
        "success": True,
        "subscription": status_data,
    }


@router.post("/cancel-subscription")
def cancel_subscription_endpoint(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Cancels recurring auto-renewal for the authenticated user.
    The user retains active PRO benefits until the current period expires.
    """
    success, message = cancel_user_subscription(db=db, user=current_user)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "message": message},
        )

    updated_status = get_user_subscription_status(db=db, user=current_user)
    return {
        "success": True,
        "message": message,
        "subscription": updated_status,
    }


@router.api_route("/webhook/cashfree", methods=["GET", "POST", "HEAD"])
async def cashfree_webhook_endpoint(
    request: Request,
    db: Session = Depends(get_db),
    x_webhook_signature: Optional[str] = Header(None, alias="x-webhook-signature"),
    x_webhook_timestamp: Optional[str] = Header(None, alias="x-webhook-timestamp"),
):
    """
    Receives and processes asynchronous webhook notifications from Cashfree.
    Also responds to Cashfree's dashboard health/test pings (GET/HEAD/POST).
    """
    if request.method in ("GET", "HEAD"):
        return {"status": "ok", "message": "Cashfree webhook endpoint active"}

    raw_body = await request.body()
    try:
        payload = await request.json() if raw_body else {}
    except Exception:
        payload = {}

    # If it's a test ping or empty payload from dashboard
    if not payload or payload.get("type") in ("TEST_WEBHOOK", "test", "PING"):
        return {"status": "ok", "message": "Test webhook received successfully"}

    # Verify signature if present
    if x_webhook_signature and x_webhook_timestamp:
        is_valid = verify_cashfree_webhook_signature(raw_body, x_webhook_signature, x_webhook_timestamp)
        if not is_valid:
            logger.warning("Cashfree webhook signature mismatch; proceeding cautiously or test ping")
            # If not a test payload, reject invalid signatures
            if payload.get("data", {}).get("order", {}).get("order_id"):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid Cashfree webhook signature",
                )

    event_type = payload.get("type", "")
    order_data = payload.get("data", {}).get("order", {})
    order_id = order_data.get("order_id")

    if event_type in ("PAYMENT_SUCCESS_WEBHOOK", "ORDER_PAID") and order_id:
        from backend.models.payment import PaymentOrder
        from sqlalchemy import select
        order = db.scalar(select(PaymentOrder).where(PaymentOrder.cashfree_order_id == order_id))
        if order and order.user:
            verify_cashfree_payment(db=db, user=order.user, order_id=order_id)

    return {"status": "ok", "received": True}
