import hmac
import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Tuple, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select, update
from backend.core.config import settings
from backend.models.enums import OTPType, OTPPurpose
from backend.models.otp import OTPCodeModel
from backend.models.user import User
from backend.services.email_service import send_otp_email


def hash_otp_code(otp_code: str, target: str, purpose: str) -> str:
    """
    Computes HMAC-SHA256 hash of the 6-digit OTP using server-side OTP_HASH_SECRET
    and target+purpose context to prevent brute-force rainbow table attacks.
    """
    normalized_target = target.strip().lower()
    message = f"{normalized_target}:{purpose}:{otp_code.strip()}".encode("utf-8")
    secret_key = settings.OTP_HASH_SECRET.encode("utf-8")
    return hmac.new(secret_key, message, hashlib.sha256).hexdigest()


def verify_otp_hash(provided_code: str, target: str, purpose: str, stored_hash: str) -> bool:
    """
    Performs timing-safe comparison of provided OTP HMAC vs stored digest using hmac.compare_digest.
    """
    computed_hash = hash_otp_code(provided_code, target, purpose)
    return hmac.compare_digest(computed_hash, stored_hash)


def generate_secure_otp() -> str:
    """
    Generates a cryptographically random OTP string using Python's secrets module.
    Length is determined by settings.OTP_LENGTH (default 6).
    """
    return "".join(secrets.choice("0123456789") for _ in range(settings.OTP_LENGTH))


def send_and_store_otp(
    db: Session,
    target_email: str,
    purpose: OTPPurpose = OTPPurpose.REGISTRATION,
    otp_type: OTPType = OTPType.EMAIL,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
    user_id: Optional[str] = None
) -> Tuple[bool, str]:
    """
    1. Checks resend cooldown (60 seconds).
    2. Invalidates previous active OTPs for the same target & purpose.
    3. Generates cryptographically secure 6-digit OTP.
    4. Computes HMAC-SHA256 hash.
    5. Dispatches real email (for EMAIL) or SMS (for PHONE).
    6. Stores OTP hash record ONLY if dispatch succeeds.
    Returns (success: bool, message: str).
    """
    normalized_target = target_email.strip().lower() if "@" in target_email else "".join(c for c in target_email if c.isdigit() or c == '+')
    now = datetime.now(timezone.utc)

    safe_user_agent = user_agent[:250] if user_agent else None
    safe_ip = ip_address[:45] if ip_address else None

    # 1. Check Resend Cooldown (60 seconds)
    stmt = (
        select(OTPCodeModel)
        .where(
            OTPCodeModel.target == normalized_target,
            OTPCodeModel.purpose == purpose,
            OTPCodeModel.is_used == False
        )
        .order_by(OTPCodeModel.created_at.desc())
        .limit(1)
    )
    latest_otp = db.scalar(stmt)

    if latest_otp:
        # Ensure created_at is timezone-aware for calculation
        created_time = latest_otp.created_at
        if created_time.tzinfo is None:
            created_time = created_time.replace(tzinfo=timezone.utc)
            
        elapsed_seconds = (now - created_time).total_seconds()
        if elapsed_seconds < settings.OTP_RESEND_COOLDOWN_SECONDS:
            remaining = int(settings.OTP_RESEND_COOLDOWN_SECONDS - elapsed_seconds)
            from backend.services.security_log_service import log_security_event
            log_security_event(
                db=db,
                event_type="OTP_COOLDOWN_BLOCKED",
                severity="WARNING",
                ip_address=safe_ip,
                user_agent=safe_user_agent,
                endpoint="/auth/otp/send",
                details={"target": normalized_target, "purpose": purpose.value if hasattr(purpose, 'value') else str(purpose), "remaining_seconds": remaining}
            )
            return False, f"Please wait {remaining} seconds before requesting a new OTP code."

    # 2. Invalidate previous active OTPs for this target & purpose
    db.execute(
        update(OTPCodeModel)
        .where(
            OTPCodeModel.target == normalized_target,
            OTPCodeModel.purpose == purpose,
            OTPCodeModel.is_used == False
        )
        .values(is_used=True)
    )

    # 3. Generate secure OTP & compute HMAC hash
    plaintext_otp = generate_secure_otp()
    purpose_str = purpose.value if hasattr(purpose, 'value') else str(purpose)
    code_hash = hash_otp_code(plaintext_otp, normalized_target, purpose_str)
    expires_at = now + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)

    # 4. Dispatch Email OTP Code
    purpose_label = "Account Registration" if purpose == OTPPurpose.REGISTRATION else "Password Reset"
    email_sent, error_msg = send_otp_email(
        target_email=normalized_target,
        otp_code=plaintext_otp,
        purpose_label=purpose_label,
        expire_minutes=settings.OTP_EXPIRE_MINUTES
    )

    if not email_sent:
        db.rollback()
        from backend.services.security_log_service import log_security_event
        log_security_event(
            db=db,
            event_type="OTP_DISPATCH_FAILED",
            severity="HIGH",
            ip_address=safe_ip,
            user_agent=safe_user_agent,
            endpoint="/auth/otp/send",
            details={"target": normalized_target, "purpose": purpose_str, "error": error_msg}
        )
        return False, error_msg or "Failed to deliver OTP email. Please try again."
    message_out = f"Verification code sent successfully to {normalized_target}"

    # 5. Store OTP Record in Database (Never stores plaintext_otp!)
    otp_record = OTPCodeModel(
        target=normalized_target,
        type=OTPType.EMAIL,
        purpose=purpose,
        code_hash=code_hash,
        expires_at=expires_at,
        attempts=0,
        max_attempts=settings.OTP_MAX_ATTEMPTS,
        is_used=False,
        ip_address=safe_ip,
        user_agent=safe_user_agent,
        user_id=user_id
    )
    db.add(otp_record)
    db.commit()

    from backend.services.security_log_service import log_security_event
    log_security_event(
        db=db,
        event_type="OTP_GENERATED",
        severity="INFO",
        ip_address=safe_ip,
        user_agent=safe_user_agent,
        endpoint="/auth/otp/send",
        details={"target": normalized_target, "purpose": purpose_str, "type": "EMAIL", "expires_minutes": settings.OTP_EXPIRE_MINUTES}
    )

    return True, message_out



def verify_otp_attempt(
    db: Session,
    target_email: str,
    provided_code: str,
    purpose: OTPPurpose = OTPPurpose.REGISTRATION,
    current_user: Optional[User] = None
) -> Tuple[bool, str]:
    """
    1. Finds active non-expired OTP record for target & purpose.
    2. Enforces expiration & max attempts.
    3. Performs timing-safe HMAC verification.
    4. Marks as used on success.
    Returns (success: bool, message: str).
    """
    normalized_target = target_email.strip().lower()
    now = datetime.now(timezone.utc)

    stmt = (
        select(OTPCodeModel)
        .where(
            OTPCodeModel.target == normalized_target,
            OTPCodeModel.purpose == purpose,
            OTPCodeModel.is_used == False
        )
        .order_by(OTPCodeModel.created_at.desc())
        .limit(1)
    )
    otp_record = db.scalar(stmt)

    if not otp_record:
        return False, "No active OTP verification request found. Please request a new code."

    # Ensure timezone comparison compatibility
    expires_time = otp_record.expires_at
    if expires_time.tzinfo is None:
        expires_time = expires_time.replace(tzinfo=timezone.utc)

    # Expiration check
    if now >= expires_time:
        otp_record.is_used = True
        db.commit()
        return False, "Verification code has expired. Please request a new code."

    # Max attempts check
    if otp_record.attempts >= otp_record.max_attempts:
        otp_record.is_used = True
        db.commit()
        return False, "Maximum verification attempts exceeded. Please request a new code."

    # Increment attempts
    otp_record.attempts += 1

    # Verify HMAC hash
    is_valid = verify_otp_hash(
        provided_code=provided_code,
        target=normalized_target,
        purpose=purpose.value,
        stored_hash=otp_record.code_hash
    )

    if not is_valid:
        remaining_attempts = otp_record.max_attempts - otp_record.attempts
        if remaining_attempts <= 0:
            otp_record.is_used = True
            db.commit()
            return False, "Maximum verification attempts exceeded. Please request a new code."
        
        db.commit()
        return False, f"Invalid verification code. {remaining_attempts} attempt(s) remaining."

    # Successful verification
    otp_record.is_used = True
    otp_record.used_at = now
    db.commit()

    return True, "Email address verified successfully."
