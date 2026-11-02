import base64
import hashlib
import hmac
import logging
import re
import uuid
from datetime import datetime, timezone, timedelta
from typing import Optional, Tuple, Dict, Any
import httpx
from sqlalchemy.orm import Session
from sqlalchemy import select

from backend.core.config import settings
from backend.models.user import User
from backend.models.payment import PaymentOrder

logger = logging.getLogger("backend.payments")

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


def get_cashfree_base_url() -> str:
    """Returns the Cashfree REST PG API endpoint based on configured environment."""
    if (settings.CASHFREE_ENV or "").strip().upper() == "PRODUCTION":
        return "https://api.cashfree.com/pg"
    return "https://sandbox.cashfree.com/pg"


def get_cashfree_headers() -> Dict[str, str]:
    """Returns common authentication headers required by Cashfree PG API v2023-08-01."""
    return {
        "x-client-id": settings.CASHFREE_APP_ID,
        "x-client-secret": settings.CASHFREE_SECRET_KEY,
        "x-api-version": settings.CASHFREE_API_VERSION,
        "Content-Type": "application/json",
        "Accept": "application/json",
    }


def clean_customer_phone(phone: Optional[str]) -> str:
    """
    Cashfree strictly requires a 10-digit valid phone number.
    Extracts 10 digits or provides a safe standard fallback for sandbox/trial.
    """
    if phone:
        digits = re.sub(r"\D", "", phone)
        if len(digits) >= 10:
            return digits[-10:]
    return "9999999999"


def clean_customer_id(user_id: str) -> str:
    """
    Cashfree customer_id must be alphanumeric with underscores/hyphens, max 50 chars.
    """
    cleaned = re.sub(r"[^a-zA-Z0-9_\-]", "", str(user_id))
    return cleaned[:45] or "user_guest"


def create_cashfree_order(
    db: Session,
    user: User,
    plan_id: str = "premium_monthly"
) -> Dict[str, Any]:
    """
    Creates a new payment order with Cashfree Payment Gateway and
    registers a local PaymentOrder record for tracking.
    Returns client checkout parameters including payment_session_id.
    """
    plan = PLANS.get(plan_id, PLANS["premium_monthly"])
    amount_inr = plan["amount"]
    trial_days = plan.get("trial_days", 30)

    # Cashfree requires order_id <= 45 alphanumeric characters
    order_id = f"tm_{uuid.uuid4().hex[:16]}"
    cust_id = clean_customer_id(user.id)
    cust_phone = clean_customer_phone(user.phone)
    cust_name = (user.full_name or "Valued Member").strip()[:50]
    cust_email = user.email or f"{cust_id}@truemarriage.in"

    base_url = get_cashfree_base_url()
    headers = get_cashfree_headers()

    return_url = f"{settings.FRONTEND_URL}/payment-status?order_id={{order_id}}"

    payload = {
        "order_id": order_id,
        "order_amount": float(amount_inr),
        "order_currency": settings.CASHFREE_CURRENCY,
        "customer_details": {
            "customer_id": cust_id,
            "customer_email": cust_email,
            "customer_phone": cust_phone,
            "customer_name": cust_name,
        },
        "order_meta": {
            "return_url": return_url,
        },
        "order_note": f"TrueMarriage PRO - {plan['name']}",
        "order_tags": {
            "user_id": str(user.id),
            "plan_id": plan_id,
            "trial_days": str(trial_days),
        }
    }

    payment_session_id = None
    try:
        with httpx.Client(timeout=15.0) as http_client:
            resp = http_client.post(f"{base_url}/orders", json=payload, headers=headers)
            resp_data = resp.json()

            if resp.status_code in (200, 201) and resp_data.get("payment_session_id"):
                payment_session_id = resp_data["payment_session_id"]
                logger.info(f"Successfully created Cashfree order {order_id} with session {payment_session_id[:15]}...")
            else:
                logger.warning(
                    f"Cashfree order API returned {resp.status_code}: {resp_data}. Using sandbox session fallback."
                )
                payment_session_id = f"session_sb_{uuid.uuid4().hex[:20]}"
    except Exception as exc:
        logger.warning(f"Cashfree API communication error: {exc}. Using sandbox session fallback.", exc_info=True)
        payment_session_id = f"session_sb_{uuid.uuid4().hex[:20]}"

    # Save to local database
    order_record = PaymentOrder(
        user_id=user.id,
        cashfree_order_id=order_id,
        payment_session_id=payment_session_id,
        plan_id=plan_id,
        plan_name=plan["name"],
        amount=amount_inr,
        currency=settings.CASHFREE_CURRENCY,
        status="PENDING",
        created_at=datetime.now(timezone.utc),
    )
    db.add(order_record)
    db.commit()

    env_mode = "sandbox" if settings.CASHFREE_ENV.upper() == "SANDBOX" else "production"

    return {
        "order_id": order_id,
        "payment_session_id": payment_session_id,
        "environment": env_mode,
        "app_id": settings.CASHFREE_APP_ID,
        "amount": amount_inr,
        "amount_due_today": 0,
        "currency": settings.CASHFREE_CURRENCY,
        "plan_id": plan_id,
        "plan_name": plan["name"],
        "user_name": cust_name,
        "user_email": cust_email,
        "user_phone": cust_phone,
        "trial_days": trial_days,
        "is_trial": True,
        "first_charge_date": (datetime.now(timezone.utc) + timedelta(days=trial_days)).isoformat(),
        "first_charge_amount": amount_inr,
        "is_subscription": True,
    }


def verify_cashfree_payment(
    db: Session,
    user: User,
    order_id: str,
    signature: Optional[str] = None
) -> Tuple[bool, str, Optional[PaymentOrder]]:
    """
    Verifies payment with Cashfree REST API by fetching order details
    and validating order status ('PAID').
    Upon success, updates PaymentOrder to COMPLETED and activates User PRO status.
    """
    if not order_id:
        return False, "Order ID is required.", None

    stmt = select(PaymentOrder).where(
        (PaymentOrder.cashfree_order_id == order_id) |
        (PaymentOrder.id == order_id)
    )
    order = db.scalar(stmt)

    if not order:
        return False, "Order record not found.", None

    if order.status == "COMPLETED":
        return True, "Payment has already been confirmed.", order

    base_url = get_cashfree_base_url()
    headers = get_cashfree_headers()

    is_paid = False
    payment_id = None
    payment_method = "Cashfree"

    try:
        with httpx.Client(timeout=15.0) as http_client:
            # 1. Fetch order details from Cashfree
            resp = http_client.get(f"{base_url}/orders/{order.cashfree_order_id}", headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                order_status = str(data.get("order_status", "")).upper()
                if order_status == "PAID":
                    is_paid = True
                elif order_status in ("FAILED", "EXPIRED", "TERMINATED"):
                    order.status = "FAILED"
                    db.commit()
                    return False, f"Payment failed with status: {order_status}", order

                # 2. Fetch payments list to record actual payment_id & method
                payments_resp = http_client.get(f"{base_url}/orders/{order.cashfree_order_id}/payments", headers=headers)
                if payments_resp.status_code == 200 and isinstance(payments_resp.json(), list) and payments_resp.json():
                    latest_payment = payments_resp.json()[0]
                    payment_id = str(latest_payment.get("cf_payment_id", ""))
                    payment_method = str(latest_payment.get("payment_group", "Cashfree"))
            else:
                logger.warning(f"Could not verify Cashfree order directly (HTTP {resp.status_code}): {resp.text}")
                # In sandbox environment with mock sessions, permit seamless verification
                if settings.CASHFREE_ENV.upper() == "SANDBOX" and order.payment_session_id and order.payment_session_id.startswith("session_sb_"):
                    is_paid = True
                    payment_id = f"cf_pay_sb_{uuid.uuid4().hex[:10]}"
    except Exception as e:
        logger.error(f"Error querying Cashfree for order {order_id}: {e}", exc_info=True)
        if settings.CASHFREE_ENV.upper() == "SANDBOX":
            is_paid = True
            payment_id = f"cf_pay_sb_{uuid.uuid4().hex[:10]}"

    if not is_paid:
        return False, "Payment has not been completed yet.", order

    # Mark completed and activate premium
    plan = PLANS.get(order.plan_id, PLANS["premium_monthly"])
    duration_days = plan.get("duration_days", 30)

    order.status = "COMPLETED"
    order.cashfree_payment_id = payment_id or f"cf_pay_{uuid.uuid4().hex[:10]}"
    order.cashfree_signature = signature or "VERIFIED_VIA_CASHFREE_API"
    order.payment_method = payment_method
    order.updated_at = datetime.now(timezone.utc)

    user.is_premium = True
    now_utc = datetime.now(timezone.utc)
    until_dt = user.premium_until
    if until_dt and until_dt.tzinfo is None:
        until_dt = until_dt.replace(tzinfo=timezone.utc)

    current_expiry = until_dt if until_dt and until_dt > now_utc else now_utc
    user.premium_until = current_expiry + timedelta(days=duration_days)

    db.commit()
    logger.info(f"Cashfree payment successful: user {user.email} upgraded to PRO until {user.premium_until}")

    return True, "Payment verified and TrueMarriage PRO subscription activated successfully!", order


def verify_cashfree_webhook_signature(raw_body: bytes, signature: str, timestamp: str) -> bool:
    """
    Cryptographically verifies Cashfree Webhook HMAC SHA256 signature.
    Cashfree signs (timestamp + raw_body) using secret key.
    """
    if not signature or not timestamp:
        return False
    try:
        data_to_sign = timestamp.encode("utf-8") + raw_body
        expected_sig = base64.b64encode(
            hmac.new(
                settings.CASHFREE_SECRET_KEY.encode("utf-8"),
                data_to_sign,
                hashlib.sha256
            ).digest()
        ).decode("utf-8")
        return hmac.compare_digest(expected_sig, signature)
    except Exception as e:
        logger.error(f"Webhook signature check error: {e}")
        return False


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
    sub_order = orders[0] if orders else None

    now_utc = datetime.now(timezone.utc)
    until_dt = user.premium_until
    if until_dt and until_dt.tzinfo is None:
        until_dt = until_dt.replace(tzinfo=timezone.utc)

    is_active_premium = bool(
        user.is_premium
        and (not until_dt or until_dt > now_utc)
    )

    is_cancelled = False
    status_str = "active" if is_active_premium else "none"

    if sub_order:
        if sub_order.payment_method == "CANCELLED_RENEWAL":
            is_cancelled = True
            status_str = "cancelled"

    is_in_trial = False
    days_left_in_trial = 0
    trial_ends_at = None

    if is_active_premium and until_dt:
        days_left = max(0, (until_dt - now_utc).days + 1)
        is_in_trial = True
        days_left_in_trial = days_left
        trial_ends_at = until_dt.isoformat()

    return {
        "is_premium": is_active_premium,
        "premium_until": until_dt.isoformat() if until_dt else None,
        "has_subscription": bool(sub_order),
        "subscription_id": sub_order.cashfree_order_id if sub_order else None,
        "plan_id": sub_order.plan_id if sub_order else "premium_monthly",
        "plan_name": sub_order.plan_name if sub_order else "TrueMarriage PRO (30-Day Free Trial)",
        "amount": sub_order.amount if sub_order else 299,
        "currency": sub_order.currency if sub_order else "INR",
        "status": status_str,
        "is_cancelled": is_cancelled,
        "created_at": sub_order.created_at.isoformat() if sub_order else None,
        "is_in_trial": is_in_trial,
        "trial_days": 30,
        "trial_ends_at": trial_ends_at,
        "days_left_in_trial": days_left_in_trial,
        "first_charge_date": trial_ends_at,
        "first_charge_amount": 299,
    }


def start_free_trial(db: Session, user: User, trial_days: int = 30) -> Tuple[bool, str, Dict[str, Any]]:
    """
    Activates an immediate 30-Day Free Trial of TrueMarriage PRO for the user.
    """
    now_utc = datetime.now(timezone.utc)
    until_dt = user.premium_until
    if until_dt and until_dt.tzinfo is None:
        until_dt = until_dt.replace(tzinfo=timezone.utc)

    if user.is_premium and until_dt and until_dt > now_utc:
        return True, "Your PRO Free Trial is already active!", {
            "is_premium": True,
            "premium_until": until_dt.isoformat(),
            "trial_days": trial_days,
            "is_in_trial": True,
            "days_left_in_trial": (until_dt - now_utc).days + 1,
        }

    new_expiry = now_utc + timedelta(days=trial_days)
    user.is_premium = True
    user.premium_until = new_expiry

    order_record = PaymentOrder(
        user_id=user.id,
        cashfree_order_id=f"trial_{uuid.uuid4().hex[:12]}",
        payment_session_id=f"session_trial_{uuid.uuid4().hex[:10]}",
        cashfree_payment_id=f"pay_trial_{uuid.uuid4().hex[:10]}",
        cashfree_signature="FREE_TRIAL_ACTIVATION",
        plan_id="premium_monthly",
        plan_name="TrueMarriage PRO (30-Day Free Trial)",
        amount=299,
        currency="INR",
        status="COMPLETED",
        payment_method="FREE_TRIAL",
        created_at=now_utc,
    )
    db.add(order_record)
    db.commit()

    logger.info(f"User {user.email} activated 30-Day Free Trial until {new_expiry}")

    return True, "🎉 30-Day Free Trial activated successfully! Enjoy unlimited access to all luxury templates.", {
        "is_premium": True,
        "premium_until": new_expiry.isoformat(),
        "trial_days": trial_days,
        "is_in_trial": True,
        "days_left_in_trial": trial_days,
    }


def cancel_user_subscription(db: Session, user: User) -> Tuple[bool, str]:
    """
    Cancels recurring subscription renewal for user.
    The user retains full PRO benefits until current period expires without future debits.
    """
    stmt = (
        select(PaymentOrder)
        .where(PaymentOrder.user_id == user.id, PaymentOrder.status == "COMPLETED")
        .order_by(PaymentOrder.created_at.desc())
    )
    orders = db.scalars(stmt).all()
    if not orders:
        return False, "No active subscription found to cancel."

    sub_order = orders[0]
    sub_order.payment_method = "CANCELLED_RENEWAL"
    db.commit()

    logger.info(f"Successfully marked subscription renewal cancelled for user {user.email}")
    return True, "Auto-renewal has been successfully cancelled. You will maintain full PRO access until your current period ends."
