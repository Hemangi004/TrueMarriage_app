from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.db.session import get_db
from backend.models.user import User
from backend.dependencies.auth import get_current_user
from backend.services.payment_service import (
    PLANS,
    create_razorpay_order,
    verify_razorpay_payment,
    get_user_subscription_status,
    cancel_user_subscription,
    start_free_trial,
)

router = APIRouter(prefix="/payments", tags=["Razorpay Payments"])


class CreateOrderRequest(BaseModel):
    plan_id: str = "premium_monthly"


class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: Optional[str] = None
    razorpay_subscription_id: Optional[str] = None
    razorpay_payment_id: str
    razorpay_signature: str


@router.get("/plans")
def get_available_plans():
    """Returns available pricing plans and details for Razorpay checkout."""
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
    Creates a new Razorpay subscription / order and returns client checkout parameters.
    Requires authenticated user session.
    """
    try:
        order_details = create_razorpay_order(
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
    Cryptographically verifies Razorpay payment/subscription signature and upgrades user to Premium.
    """
    success, message, order = verify_razorpay_payment(
        db=db,
        user=current_user,
        razorpay_order_id=payload.razorpay_order_id,
        razorpay_subscription_id=payload.razorpay_subscription_id,
        razorpay_payment_id=payload.razorpay_payment_id,
        razorpay_signature=payload.razorpay_signature,
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "message": message},
        )

    return {
        "success": True,
        "message": message,
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
    Cancels recurring auto-renewal with Razorpay for the authenticated user.
    The user retains active PRO benefits until current period expires.
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

