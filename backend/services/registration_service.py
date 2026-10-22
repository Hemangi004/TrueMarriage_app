from typing import Tuple, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select
from backend.models.user import User, UserAuthIdentity
from backend.models.enums import UserRole, UserStatus, AuthProvider, OTPPurpose
from backend.schemas.user import UserRegisterInput
from backend.core.security import get_password_hash
from backend.services.otp_service import send_and_store_otp, verify_otp_attempt


def register_user(
    db: Session,
    payload: UserRegisterInput,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None
) -> Tuple[bool, str, Optional[User]]:
    """
    Handles email-based user registration:
    1. Normalizes email and checks account status.
    2. Enforces status checks (ACTIVE -> account exists, BLOCKED/DEACTIVATED -> rejected).
    3. Handles PENDING_VERIFICATION accounts without creating duplicate DB records.
    4. Hashes password securely using bcrypt.
    5. Forces role=USER, status=PENDING_VERIFICATION, is_email_verified=False.
    6. Dispatches real registration OTP.
    7. Rolls back DB transaction if email delivery fails.
    """
    normalized_email = payload.email.strip().lower()

    from backend.utils.disposable_email import is_common_email, COMMON_EMAIL_ERROR_MSG
    if not is_common_email(normalized_email):
        return False, COMMON_EMAIL_ERROR_MSG, None

    # Look up existing user
    stmt = select(User).where(User.email == normalized_email)
    existing_user = db.scalar(stmt)

    if existing_user:
        if existing_user.status == UserStatus.ACTIVE:
            return False, "An account with this email address already exists. Please login instead.", None
        elif existing_user.status == UserStatus.DEACTIVATED:
            return False, "This account has been deactivated. Please contact support.", None
        elif existing_user.status == UserStatus.BLOCKED:
            return False, "Registration cannot be completed for this email address.", None
        elif existing_user.status == UserStatus.PENDING_VERIFICATION:
            # Update password and name for pending verification retry
            existing_user.full_name = payload.name
            existing_user.password_hash = get_password_hash(payload.password)
            db.flush()
            target_user = existing_user
    else:
        # Create new pending user
        target_user = User(
            email=normalized_email,
            full_name=payload.name,
            password_hash=get_password_hash(payload.password),
            role=UserRole.USER,  # Strictly server-enforced
            status=UserStatus.PENDING_VERIFICATION,  # Strictly server-enforced
            is_email_verified=False  # Strictly server-enforced
        )
        db.add(target_user)
        db.flush()

        # Add Local Auth Identity
        identity = UserAuthIdentity(
            user_id=target_user.id,
            provider=AuthProvider.LOCAL
        )
        db.add(identity)
        db.flush()

    # Dispatch Real Email OTP via Phase 4 engine
    otp_sent, otp_message = send_and_store_otp(
        db=db,
        target_email=normalized_email,
        purpose=OTPPurpose.REGISTRATION,
        ip_address=ip_address,
        user_agent=user_agent
    )

    if not otp_sent:
        db.rollback()
        return False, otp_message or "Failed to deliver verification email. Registration cancelled.", None

    db.commit()
    db.refresh(target_user)
    return True, f"Registration initiated. Verification code sent to {normalized_email}", target_user


def verify_registration_completion(
    db: Session,
    target_email: str,
    otp_code: str
) -> Tuple[bool, str, Optional[User]]:
    """
    Verifies registration OTP code and activates the corresponding pending user account.
    1. Verifies OTP purpose is REGISTRATION and code matches HMAC digest.
    2. Finds corresponding PENDING_VERIFICATION user.
    3. Atomically sets is_email_verified = True and status = ACTIVE.
    """
    normalized_email = target_email.strip().lower()

    # 1. Verify OTP using Phase 4 OTP engine
    otp_verified, message = verify_otp_attempt(
        db=db,
        target_email=normalized_email,
        provided_code=otp_code,
        purpose=OTPPurpose.REGISTRATION
    )

    if not otp_verified:
        return False, message, None

    # 2. Find Pending User
    stmt = select(User).where(User.email == normalized_email)
    user = db.scalar(stmt)

    if not user:
        return False, "Associated user account not found. Please register again.", None

    if user.status == UserStatus.ACTIVE and user.is_email_verified:
        return True, "Account is already active.", user

    if user.status != UserStatus.PENDING_VERIFICATION:
        return False, f"Account cannot be activated due to current status: {user.status.value}", None

    # 3. Atomically Activate Account
    user.is_email_verified = True
    user.status = UserStatus.ACTIVE
    db.commit()
    db.refresh(user)

    return True, "Email verified successfully! Your account is now active.", user
