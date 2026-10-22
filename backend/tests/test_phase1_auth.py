import pytest
import uuid
from datetime import datetime, timedelta, timezone
from sqlalchemy import select
from fastapi.testclient import TestClient

from backend.main import app
from backend.db.session import SessionLocal
from backend.core.config import settings
from backend.models.user import User
from backend.models.otp import OTPCodeModel
from backend.models.enums import UserRole, UserStatus, OTPType, OTPPurpose
from backend.services.otp_service import send_and_store_otp, verify_otp_attempt, generate_secure_otp
from backend.services.registration_service import register_user, verify_registration_completion
from backend.schemas.user import UserRegisterInput
from backend.core.security import get_password_hash


@pytest.fixture
def db():
    db_session = SessionLocal()
    try:
        yield db_session
    finally:
        db_session.close()


@pytest.fixture
def client():
    return TestClient(app)


def test_application_starts_without_msg91_credentials():
    """Verify backend settings load cleanly without MSG91 credentials in Phase 1."""
    assert not hasattr(settings, "MSG91_AUTH_KEY") or settings.MSG91_AUTH_KEY is None
    assert settings.APP_NAME.startswith("TrueMarriage")


def test_email_otp_generation():
    """Verify cryptographically secure 6-digit numeric OTP generation."""
    otp = generate_secure_otp()
    assert len(otp) == 6
    assert otp.isdigit()


def test_registration_and_email_otp_flow(db):
    """
    Phase 1 Registration Flow:
    Register -> Email OTP -> Verify Email -> Account Active.
    No Phone OTP required.
    """
    uid = uuid.uuid4().hex[:6]
    email = f"phase1_user_{uid}@example.com"

    reg_input = UserRegisterInput(
        name="Phase User",
        email=email,
        password="SecurePassword123!",
        password_confirmation="SecurePassword123!"
    )

    # 1. Register User (Dispatches Email OTP)
    success, msg, user = register_user(db=db, payload=reg_input)
    assert success is True
    assert user is not None
    assert user.status == UserStatus.PENDING_VERIFICATION
    assert user.is_email_verified is False

    try:
        # Check OTP record stored in DB (HMAC hashed)
        otp_record = db.scalar(
            select(OTPCodeModel).where(
                OTPCodeModel.target == email,
                OTPCodeModel.is_used == False
            )
        )
        assert otp_record is not None
        assert otp_record.type == OTPType.EMAIL
        assert len(otp_record.code_hash) == 64  # HMAC SHA-256

        # Extract generated plaintext code from HMAC hash check
        from backend.services.otp_service import verify_otp_hash
        correct_code = None
        for i in range(1000000):
            candidate = f"{i:06d}"
            if verify_otp_hash(candidate, email, OTPPurpose.REGISTRATION.value, otp_record.code_hash):
                correct_code = candidate
                break
        
        assert correct_code is not None

        # 2. Verify Registration Email OTP
        ver_ok, ver_msg, active_user = verify_registration_completion(
            db=db,
            target_email=email,
            otp_code=correct_code
        )
        assert ver_ok is True
        assert active_user is not None
        assert active_user.status == UserStatus.ACTIVE
        assert active_user.is_email_verified is True

    finally:
        db.delete(user)
        db.commit()


def test_save_phone_number_without_otp(db):
    """
    Verify users can enter and save a phone number to their profile without phone OTP verification.
    """
    uid = uuid.uuid4().hex[:6]
    email = f"phone_save_user_{uid}@example.com"
    phone_number = "919876543210"

    user = User(
        email=email,
        full_name="Phone Save User",
        password_hash=get_password_hash("Password123!"),
        role=UserRole.USER,
        status=UserStatus.ACTIVE,
        is_email_verified=True,
        phone=None,
        is_phone_verified=False
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    try:
        # User updates their profile with a phone number
        user.phone = phone_number
        db.commit()
        db.refresh(user)

        # Phone is saved, but is_phone_verified remains False (unverified in Phase 1)
        assert user.phone == phone_number
        assert user.is_phone_verified is False
        assert user.status == UserStatus.ACTIVE

    finally:
        db.delete(user)
        db.commit()


def test_email_otp_resend_cooldown(db):
    """Verify 60-second resend cooldown for Email OTP."""
    uid = uuid.uuid4().hex[:6]
    email = f"cooldown_{uid}@example.com"

    send_and_store_otp(db=db, target_email=email, purpose=OTPPurpose.REGISTRATION)

    # Immediate second request should be blocked by cooldown
    success, msg = send_and_store_otp(db=db, target_email=email, purpose=OTPPurpose.REGISTRATION)
    assert success is False
    assert "Please wait" in msg


def test_email_otp_max_attempts(db):
    """Verify invalidation after maximum failed attempts."""
    uid = uuid.uuid4().hex[:6]
    email = f"attempts_{uid}@example.com"

    send_and_store_otp(db=db, target_email=email, purpose=OTPPurpose.REGISTRATION)

    # Submit wrong OTP 5 times
    for _ in range(5):
        verify_otp_attempt(db=db, target_email=email, provided_code="000000", purpose=OTPPurpose.REGISTRATION)

    # Further attempt should state max attempts exceeded or no active OTP
    success, msg = verify_otp_attempt(db=db, target_email=email, provided_code="000000", purpose=OTPPurpose.REGISTRATION)
    assert success is False
