import logging
import uuid
from datetime import datetime, timezone, timedelta
from typing import Optional, Tuple, Dict, Any
import razorpay
from sqlalchemy.orm import Session
from sqlalchemy import select

from backend.core.config import settings
from backend.models.user import User
from backend.models.payment import PaymentOrder

logger = logging.getLogger("backend.payments")

# Initialize Razorpay Client with configured Sandbox or Live keys
client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

# Supported Plans & Pricing (Monthly Recurring Subscription with 30-Day Free Trial)
PLANS = {
    "premium_monthly": {
        "name": "TrueMarriage PRO Monthly Subscription",
        "amount": 299,
        "duration_days": 30,
        "trial_days": 30,
        "billing_period": "monthly",
        "is_subscription": True,
        "description": "Enjoy a 30-day free trial with full access to all 40+ luxury templates, candidate contact unhiding, and high-resolution PDF exports. After 30 days, auto-renews at ₹299/month. Cancel anytime with 1 click before Day 30 to avoid any charges."
    }
}

# Cache plan ID in memory
_CACHED_PLAN_ID: Optional[str] = "plan_TtRDeRhD5C8tDW"


def get_or_create_monthly_plan(amount_inr: int = 299) -> str:
    """
    Finds or creates the Razorpay Monthly Subscription Plan.
    """
    global _CACHED_PLAN_ID
    if _CACHED_PLAN_ID:
        return _CACHED_PLAN_ID

    amount_paise = amount_inr * 100
    try:
        plans_resp = client.plan.all()
        for p in plans_resp.get("items", []):
            if (
                p.get("period") == "monthly"
                and p.get("interval") == 1
                and p.get("item", {}).get("amount") == amount_paise
            ):
                _CACHED_PLAN_ID = p["id"]
                return _CACHED_PLAN_ID

        new_plan = client.plan.create({
            "period": "monthly",
            "interval": 1,
            "item": {
                "name": "TrueMarriage PRO Monthly Subscription",
                "amount": amount_paise,
                "currency": settings.RAZORPAY_CURRENCY,
                "description": "Monthly auto-renewing access to all luxury templates, contact unhiding, and luxury biodatas",
            }
        })
        _CACHED_PLAN_ID = new_plan["id"]
        logger.info(f"Created new Razorpay monthly subscription plan: {_CACHED_PLAN_ID}")
        return _CACHED_PLAN_ID
    except Exception as e:
        logger.error(f"Error fetching/creating Razorpay plan: {e}", exc_info=True)
        return "plan_TtRDeRhD5C8tDW"


def create_razorpay_order(
    db: Session,
    user: User,
    plan_id: str = "premium_monthly"
) -> Dict[str, Any]:
    """
    Creates a new monthly recurring subscription with Razorpay Gateway
    with a 30-day free trial (start_at = 30 days in the future) and
    registers a local PaymentOrder record for tracking.
    """
    plan = PLANS.get(plan_id, PLANS["premium_monthly"])
    amount_inr = plan["amount"]
    amount_paise = amount_inr * 100
    trial_days = plan.get("trial_days", 30)

    # Razorpay Subscriptions API natively supports trial period via future Unix timestamp in start_at
    # User is authorized at checkout (₹0 charge today), and the first ₹299 billing occurs after 30 days
    start_at_dt = datetime.now(timezone.utc) + timedelta(days=trial_days)
    start_at_ts = int(start_at_dt.timestamp())

    rzp_plan_id = get_or_create_monthly_plan(amount_inr)

    sub_payload = {
        "plan_id": rzp_plan_id,
        "total_count": 12,  # 12 monthly billing cycles with auto-debit
        "quantity": 1,
        "customer_notify": 1,
        "start_at": start_at_ts,
        "notes": {
            "user_id": user.id,
            "user_email": user.email,
            "plan_id": plan_id,
            "plan_name": plan["name"],
            "trial_days": str(trial_days),
            "trial_ends_at": start_at_dt.isoformat(),
        }
    }

    sub_id = None
    try:
        rzp_sub = client.subscription.create(data=sub_payload)
        sub_id = rzp_sub["id"]
        logger.info(f"Created Razorpay monthly subscription with {trial_days}-day free trial: {sub_id} for user {user.email}")
    except Exception as e:
        logger.warning(f"Could not create Razorpay subscription ({e}); attempting standard order fallback", exc_info=True)
        # Fallback to standard order if subscription has gateway constraints
        receipt_id = f"rcpt_{uuid.uuid4().hex[:12]}"
        order_payload = {
            "amount": amount_paise,
            "currency": settings.RAZORPAY_CURRENCY,
            "receipt": receipt_id,
            "notes": {
                "user_id": user.id,
                "user_email": user.email,
                "plan_id": plan_id,
                "plan_name": plan["name"],
                "trial_days": str(trial_days),
            }
        }
        rzp_order = client.order.create(data=order_payload)
        sub_id = rzp_order["id"]

    order_record = PaymentOrder(
        user_id=user.id,
        razorpay_order_id=sub_id,
        plan_id=plan_id,
        plan_name=plan["name"],
        amount=amount_inr,
        currency=settings.RAZORPAY_CURRENCY,
        status="PENDING",
        created_at=datetime.now(timezone.utc),
    )
    db.add(order_record)
    db.commit()

    is_sub = sub_id.startswith("sub_")

    return {
        "key_id": settings.RAZORPAY_KEY_ID,
        "subscription_id": sub_id if is_sub else None,
        "order_id": sub_id,
        "amount": amount_paise,
        "amount_due_today": 0,
        "trial_days": trial_days,
        "is_trial": True,
        "first_charge_date": start_at_dt.isoformat(),
        "first_charge_amount": amount_inr,
        "currency": settings.RAZORPAY_CURRENCY,
        "plan_id": plan_id,
        "plan_name": plan["name"],
        "user_name": user.full_name or "Valued Member",
        "user_email": user.email,
        "user_phone": user.phone or "",
        "is_subscription": is_sub,
    }


def verify_razorpay_payment(
    db: Session,
    user: User,
    razorpay_order_id: Optional[str] = None,
    razorpay_subscription_id: Optional[str] = None,
    razorpay_payment_id: str = "",
    razorpay_signature: str = ""
) -> Tuple[bool, str, Optional[PaymentOrder]]:
    """
    Verifies the cryptographic HMAC SHA256 signature generated by Razorpay.
    Supports both recurring subscription signatures and standard order signatures.
    Upon verification, updates PaymentOrder to COMPLETED and activates User premium status.
    """
    lookup_id = razorpay_subscription_id or razorpay_order_id
    if not lookup_id:
        return False, "Order or Subscription ID is required.", None

    stmt = select(PaymentOrder).where(
        (PaymentOrder.razorpay_order_id == lookup_id) |
        (PaymentOrder.razorpay_order_id == razorpay_order_id) |
        (PaymentOrder.razorpay_order_id == razorpay_subscription_id)
    )
    order = db.scalar(stmt)

    if not order:
        return False, "Order record not found.", None

    if order.status == "COMPLETED":
        return True, "Payment has already been confirmed.", order

    verification_passed = False

    # 1. Try subscription payment signature verification if subscription_id is available
    if razorpay_subscription_id or lookup_id.startswith("sub_"):
        sub_id = razorpay_subscription_id or lookup_id
        try:
            client.utility.verify_subscription_payment_signature({
                "razorpay_subscription_id": sub_id,
                "razorpay_payment_id": razorpay_payment_id,
                "razorpay_signature": razorpay_signature,
            })
            verification_passed = True
            logger.info(f"Verified subscription signature for {sub_id} / {razorpay_payment_id}")
        except Exception as err:
            logger.warning(f"Subscription verification failed: {err}; will try standard verification")

    # 2. Fallback to order signature verification
    if not verification_passed:
        ord_id = razorpay_order_id or lookup_id
        try:
            client.utility.verify_payment_signature({
                "razorpay_order_id": ord_id,
                "razorpay_payment_id": razorpay_payment_id,
                "razorpay_signature": razorpay_signature,
            })
            verification_passed = True
            logger.info(f"Verified order signature for {ord_id} / {razorpay_payment_id}")
        except Exception as err:
            logger.error(f"Razorpay signature verification failed: {err}")
            order.status = "FAILED"
            db.commit()
            return False, "Payment signature verification failed.", order

    # Successful verification
    plan = PLANS.get(order.plan_id, PLANS["premium_monthly"])
    duration_days = plan.get("duration_days", 30)

    order.status = "COMPLETED"
    order.razorpay_payment_id = razorpay_payment_id
    order.razorpay_signature = razorpay_signature
    order.updated_at = datetime.now(timezone.utc)

    # Activate user premium
    user.is_premium = True
    now_utc = datetime.now(timezone.utc)
    until_dt = user.premium_until
    if until_dt and until_dt.tzinfo is None:
        until_dt = until_dt.replace(tzinfo=timezone.utc)

    current_expiry = until_dt if until_dt and until_dt > now_utc else now_utc
    user.premium_until = current_expiry + timedelta(days=duration_days)

    db.commit()
    logger.info(f"Subscription payment successful: user {user.email} upgraded to premium until {user.premium_until}")

    return True, "Payment verified and Premium subscription activated successfully!", order


def get_user_subscription_status(db: Session, user: User) -> Dict[str, Any]:
    """
    Returns current subscription status and renewal state for user.
    """
    stmt = (
        select(PaymentOrder)
        .where(PaymentOrder.user_id == user.id, PaymentOrder.status == "COMPLETED")
        .order_by(PaymentOrder.created_at.desc())
    )
    orders = db.scalars(stmt).all()

    # Find the most recent subscription order
    sub_order = next((o for o in orders if o.razorpay_order_id.startswith("sub_")), None)
    if not sub_order and orders:
        sub_order = orders[0]

    now_utc = datetime.now(timezone.utc)
    until_dt = user.premium_until
    if until_dt and until_dt.tzinfo is None:
        until_dt = until_dt.replace(tzinfo=timezone.utc)

    is_active_premium = bool(
        user.is_premium
        and (not until_dt or until_dt > now_utc)
    )

    is_cancelled = False
    rzp_status = "active" if is_active_premium else "none"

    if sub_order and sub_order.razorpay_order_id.startswith("sub_"):
        # Check if local flag recorded cancellation
        if sub_order.payment_method == "CANCELLED_RENEWAL":
            is_cancelled = True
            rzp_status = "cancelled"
        else:
            try:
                rzp_sub = client.subscription.fetch(sub_order.razorpay_order_id)
                status_str = str(rzp_sub.get("status", "")).lower()
                rzp_status = status_str
                if status_str in ("cancelled", "completed", "expired"):
                    is_cancelled = True
            except Exception as e:
                logger.warning(f"Failed to fetch subscription {sub_order.razorpay_order_id} from Razorpay: {e}")

    trial_days = 30
    is_in_trial = False
    trial_ends_at = None
    days_left_in_trial = 0
    first_charge_date = None

    if is_active_premium:
        # Determine trial window from user registration or most recent order
        anchor_dt = sub_order.created_at if sub_order else user.created_at
        if anchor_dt:
            if anchor_dt.tzinfo is None:
                anchor_dt = anchor_dt.replace(tzinfo=timezone.utc)
            trial_end = anchor_dt + timedelta(days=trial_days)
            if now_utc < trial_end:
                is_in_trial = True
                trial_ends_at = trial_end.isoformat()
                first_charge_date = trial_end.isoformat()
                delta = trial_end - now_utc
                days_left_in_trial = max(1, delta.days + (1 if delta.seconds > 0 else 0))

    return {
        "is_premium": is_active_premium,
        "premium_until": user.premium_until.isoformat() if user.premium_until else None,
        "has_subscription": sub_order is not None,
        "subscription_id": sub_order.razorpay_order_id if sub_order else None,
        "plan_id": sub_order.plan_id if sub_order else "premium_monthly",
        "plan_name": sub_order.plan_name if sub_order else "TrueMarriage PRO Monthly Subscription",
        "amount": sub_order.amount if sub_order else 299,
        "currency": sub_order.currency if sub_order else "INR",
        "status": rzp_status,
        "is_cancelled": is_cancelled,
        "created_at": sub_order.created_at.isoformat() if sub_order else None,
        "is_in_trial": is_in_trial,
        "trial_days": trial_days,
        "trial_ends_at": trial_ends_at,
        "days_left_in_trial": days_left_in_trial,
        "first_charge_date": first_charge_date,
        "first_charge_amount": 299,
    }


def start_free_trial(db: Session, user: User) -> Tuple[bool, str, Dict[str, Any]]:
    """
    Directly activates a 30-day Free Trial of TrueMarriage PRO for the user.
    """
    now_utc = datetime.now(timezone.utc)
    until_dt = user.premium_until
    if until_dt and until_dt.tzinfo is None:
        until_dt = until_dt.replace(tzinfo=timezone.utc)

    if user.is_premium and until_dt and until_dt > now_utc:
        return False, "You already have active TrueMarriage PRO membership.", {
            "is_premium": True,
            "premium_until": user.premium_until.isoformat() if user.premium_until else None,
        }

    trial_days = 30
    user.is_premium = True
    user.premium_until = now_utc + timedelta(days=trial_days)

    trial_order = PaymentOrder(
        user_id=user.id,
        razorpay_order_id=f"trial_{uuid.uuid4().hex[:12]}",
        razorpay_payment_id=f"pay_trial_{uuid.uuid4().hex[:10]}",
        plan_id="premium_monthly",
        plan_name="TrueMarriage PRO (30-Day Free Trial)",
        amount=0,
        currency="INR",
        status="COMPLETED",
        payment_method="FREE_TRIAL_30_DAYS",
        created_at=now_utc,
    )
    db.add(trial_order)
    db.commit()
    logger.info(f"User {user.email} activated 30-day free trial until {user.premium_until}")

    return True, "Your 30-day Free Trial of TrueMarriage PRO is now active! Enjoy all luxury templates and full features.", {
        "is_premium": True,
        "premium_until": user.premium_until.isoformat(),
        "trial_days": trial_days,
        "is_in_trial": True,
        "days_left_in_trial": trial_days,
    }


def cancel_user_subscription(db: Session, user: User, cancel_at_cycle_end: bool = True) -> Tuple[bool, str]:
    """
    Cancels recurring subscription via Razorpay API.
    The user retains active PRO benefits until user.premium_until expires.
    """
    stmt = (
        select(PaymentOrder)
        .where(PaymentOrder.user_id == user.id, PaymentOrder.status == "COMPLETED")
        .order_by(PaymentOrder.created_at.desc())
    )
    orders = db.scalars(stmt).all()

    sub_order = next((o for o in orders if o.razorpay_order_id.startswith("sub_")), None)

    if not sub_order:
        # If user has no active sub_ ID, just ensure renewal will not trigger
        return True, "No recurring subscription found. Your subscription will not renew."

    sub_id = sub_order.razorpay_order_id

    # If already marked cancelled locally
    if sub_order.payment_method == "CANCELLED_RENEWAL":
        return True, "Your subscription is already scheduled for cancellation and will not renew."

    try:
        # Request Razorpay to cancel subscription
        # cancel_at_cycle_end = 1 allows user to keep remaining paid days
        client.subscription.cancel(sub_id, data={"cancel_at_cycle_end": 1 if cancel_at_cycle_end else 0})
        sub_order.payment_method = "CANCELLED_RENEWAL"
        sub_order.updated_at = datetime.now(timezone.utc)
        db.commit()
        logger.info(f"Successfully cancelled Razorpay subscription {sub_id} for user {user.email}")
        return True, "Your subscription renewal has been successfully cancelled. You will maintain PRO benefits until your current billing period ends."
    except Exception as err:
        err_msg = str(err)
        logger.warning(f"Subscription cancellation warning for {sub_id}: {err_msg}")
        if "already cancelled" in err_msg.lower() or "not active" in err_msg.lower():
            sub_order.payment_method = "CANCELLED_RENEWAL"
            sub_order.updated_at = datetime.now(timezone.utc)
            db.commit()
            return True, "Your subscription is already cancelled and will not renew."
        return False, f"Could not cancel renewal: {err_msg}"


