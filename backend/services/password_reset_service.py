import logging
from typing import Tuple, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select
from backend.models.user import User
from backend.models.enums import UserStatus, OTPPurpose
from backend.core.security import get_password_hash
from backend.services.otp_service import send_and_store_otp, verify_otp_attempt
from backend.services.session_service import revoke_all_user_sessions

logger = logging.getLogger(__name__)

GENERIC_FORGOT_PASSWORD_MESSAGE = (
    "If an account exists for this email address, a password reset code has been sent."
)


def initiate_password_reset(
    db: Session,
    email: str,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None
) -> Tuple[bool, str]:
    """
    Initiates password reset process for an account:
    1. Normalizes email.
    2. Checks account eligibility.
    3. To prevent email enumeration, returns generic message if account not found.
    4. Dispatches real email OTP with purpose = PASSWORD_RESET for eligible accounts.
    """
    normalized_email = email.strip().lower()

    stmt = select(User).where(User.email == normalized_email)
    user = db.scalar(stmt)

    # Eligible accounts (ACTIVE or PENDING_VERIFICATION)
    if user and user.status in (UserStatus.ACTIVE, UserStatus.PENDING_VERIFICATION):
        success, msg = send_and_store_otp(
            db=db,
            target_email=normalized_email,
            purpose=OTPPurpose.PASSWORD_RESET,
            ip_address=ip_address,
            user_agent=user_agent,
            user_id=user.id
        )
        if not success:
            if "wait" in msg.lower():
                return False, msg
            logger.error(f"Failed to dispatch password reset OTP to {normalized_email}: {msg}")
            return False, msg or "Failed to send reset code email. Please try again later."

    # Always return generic message to prevent account enumeration
    return True, GENERIC_FORGOT_PASSWORD_MESSAGE


def complete_password_reset(
    db: Session,
    email: str,
    code: str,
    new_password: str
) -> Tuple[bool, str]:
    """
    Completes password reset after OTP verification:
    1. Verifies OTP code with purpose = PASSWORD_RESET.
    2. Hashes new password with bcrypt.
    3. Revokes all active server-side sessions across all devices.
    """
    normalized_email = email.strip().lower()

    # 1. Verify OTP with purpose = PASSWORD_RESET
    otp_verified, otp_message = verify_otp_attempt(
        db=db,
        target_email=normalized_email,
        provided_code=code,
        purpose=OTPPurpose.PASSWORD_RESET
    )

    if not otp_verified:
        return False, otp_message

    # 2. Find eligible user
    stmt = select(User).where(User.email == normalized_email)
    user = db.scalar(stmt)

    if not user:
        return False, "Associated user account not found."

    if user.status in (UserStatus.BLOCKED, UserStatus.DEACTIVATED):
        return False, f"Password reset cannot be completed because this account is {user.status.value.lower()}."

    # 3. Update password hash securely & activate account / verify email
    user.password_hash = get_password_hash(new_password)
    user.is_email_verified = True
    if user.status == UserStatus.PENDING_VERIFICATION:
        user.status = UserStatus.ACTIVE
    db.flush()

    # 4. Revoke ALL active sessions for this user across all devices
    revoke_all_user_sessions(db, user.id)

    db.commit()
    return True, "Password has been reset successfully. Please log in with your new password."
