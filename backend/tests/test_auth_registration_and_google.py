"""
Integration Tests for Registration Contract Fixes and Google OAuth 2.0 Flow.
"""
import pytest
import tempfile
import os
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker

from backend.main import app
from backend.db.base import Base
from backend.db.session import get_db
from backend.models.user import User, UserAuthIdentity
from backend.models.session import SessionModel
from backend.models.enums import UserRole, UserStatus, AuthProvider


@pytest.fixture(scope="function")
def db_engine():
    tmp = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
    tmp.close()
    db_url = f"sqlite:///{tmp.name}"

    engine = create_engine(db_url, connect_args={"check_same_thread": False})
    import backend.models.user  # noqa
    import backend.models.otp  # noqa
    import backend.models.session  # noqa
    import backend.models.biodata  # noqa
    import backend.models.setting  # noqa
    import backend.models.audit_log  # noqa
    import backend.models.interest  # noqa
    import backend.models.shortlist  # noqa
    import backend.models.notification  # noqa
    Base.metadata.create_all(bind=engine)
    yield engine
    engine.dispose()
    try:
        os.unlink(tmp.name)
    except Exception:
        pass


@pytest.fixture(scope="function")
def client(db_engine):
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=db_engine)

    def override_get_db():
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

    from backend.core.config import settings
    orig_id = settings.GOOGLE_CLIENT_ID
    orig_secret = settings.GOOGLE_CLIENT_SECRET
    settings.GOOGLE_CLIENT_ID = "dummy_client_id_12345.apps.googleusercontent.com"
    settings.GOOGLE_CLIENT_SECRET = "dummy_client_secret_99999"

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app, raise_server_exceptions=True) as c:
        yield c
    app.dependency_overrides.clear()
    settings.GOOGLE_CLIENT_ID = orig_id
    settings.GOOGLE_CLIENT_SECRET = orig_secret


# ============================================================================
# PROBLEM 1: REGISTRATION CONTRACT & VALIDATION TESTS
# ============================================================================

def test_registration_success_with_valid_contract(client, db_engine):
    """Test valid registration payload matching backend UserRegisterInput."""
    with patch("backend.services.registration_service.send_and_store_otp", return_value=(True, "OTP sent")):
        payload = {
            "name": "Ananya Roy",
            "email": "ananya.roy@gmail.com",
            "password": "SecurePassword123!",
            "password_confirmation": "SecurePassword123!"
        }
        res = client.post("/api/v1/auth/register", json=payload)
        assert res.status_code == 201, f"Expected 201, got {res.status_code}: {res.text}"
        data = res.json()
        assert data["success"] is True
        assert data["email"] == "ananya.roy@gmail.com"
        assert data["status"] == "PENDING_VERIFICATION"
        assert data["requires_otp"] is True

        # Check DB
        SessionLocal = sessionmaker(bind=db_engine)
        db = SessionLocal()
        user = db.scalar(select(User).where(User.email == "ananya.roy@gmail.com"))
        assert user is not None
        assert user.full_name == "Ananya Roy"
        assert user.status == UserStatus.PENDING_VERIFICATION
        assert user.role == UserRole.USER
        db.close()


def test_registration_fails_on_password_mismatch(client):
    """Test 422 on password confirmation mismatch."""
    payload = {
        "name": "Ananya Roy",
        "email": "ananya.mismatch@example.com",
        "password": "SecurePassword123!",
        "password_confirmation": "DifferentPassword123!"
    }
    res = client.post("/api/v1/auth/register", json=payload)
    assert res.status_code == 422


def test_registration_fails_on_short_password(client):
    """Test 422 when password is less than 8 characters."""
    payload = {
        "name": "Ananya Roy",
        "email": "ananya.short@example.com",
        "password": "short",
        "password_confirmation": "short"
    }
    res = client.post("/api/v1/auth/register", json=payload)
    assert res.status_code == 422


def test_registration_fails_on_invalid_email(client):
    """Test 422 when email format is invalid."""
    payload = {
        "name": "Ananya Roy",
        "email": "not-an-email",
        "password": "SecurePassword123!",
        "password_confirmation": "SecurePassword123!"
    }
    res = client.post("/api/v1/auth/register", json=payload)
    assert res.status_code == 422


def test_registration_fails_on_empty_name(client):
    """Test 422 when name is whitespace or empty."""
    payload = {
        "name": "   ",
        "email": "ananya.noname@example.com",
        "password": "SecurePassword123!",
        "password_confirmation": "SecurePassword123!"
    }
    res = client.post("/api/v1/auth/register", json=payload)
    assert res.status_code == 422


def test_registration_fails_on_numeric_name(client):
    """Test 422 when name contains numeric characters."""
    payload = {
        "name": "123456999",
        "email": "ananya.numeric@example.com",
        "password": "SecurePassword123!",
        "password_confirmation": "SecurePassword123!"
    }
    res = client.post("/api/v1/auth/register", json=payload)
    assert res.status_code == 422


def test_registration_fails_on_special_characters_in_name(client):
    """Test 422 when name contains special characters."""
    payload = {
        "name": "Priya@#$ Sharma!",
        "email": "priya.special@example.com",
        "password": "SecurePassword123!",
        "password_confirmation": "SecurePassword123!"
    }
    res = client.post("/api/v1/auth/register", json=payload)
    assert res.status_code == 422


def test_registration_fails_on_disposable_email(client):
    """Test 422 when unallowed or temporary email addresses are used."""
    for unallowed_email in ["giyic82383@kolsea.com", "fake.user@mailinator.com", "temp@10minutemail.com", "burner@yopmail.com", "random@unknowncustomdomain.xyz"]:
        payload = {
            "name": "Priya Sharma",
            "email": unallowed_email,
            "password": "SecurePassword123!",
            "password_confirmation": "SecurePassword123!"
        }
        res = client.post("/api/v1/auth/register", json=payload)
        assert res.status_code == 422, f"Expected 422 for {unallowed_email}, got {res.status_code}: {res.text}"
        assert "Only standard email providers are allowed" in res.text


# ============================================================================
# PROBLEM 2: GOOGLE OAUTH 2.0 TESTS
# ============================================================================

def test_google_auth_unconfigured_redirects_with_error(client):
    """Test that GET /api/v1/auth/google redirects with error when credentials are not configured."""
    from backend.core.config import settings
    orig_id = settings.GOOGLE_CLIENT_ID
    settings.GOOGLE_CLIENT_ID = None
    try:
        res = client.get("/api/v1/auth/google", follow_redirects=False)
        assert res.status_code == 307
        assert "oauth_error" in res.headers.get("location", "")
    finally:
        settings.GOOGLE_CLIENT_ID = orig_id


def test_google_auth_initiate_generates_url_and_cookie(client):
    """Test GET /api/v1/auth/google sets CSRF cookie and initiates redirect."""
    res = client.get("/api/v1/auth/google", follow_redirects=False)
    assert res.status_code == 307
    location = res.headers.get("location")
    assert location is not None
    assert "accounts.google.com" in location
    assert "response_type=code" in location
    assert "scope=openid+email+profile" in location or "scope=openid%20email%20profile" in location
    assert "truemarriage_oauth_state" in res.cookies


def test_google_auth_initiate_json_endpoint(client):
    """Test GET /api/v1/auth/google?redirect=false returns auth_url JSON."""
    res = client.get("/api/v1/auth/google?redirect=false")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "auth_url" in data
    assert "state" in data


def test_google_auth_callback_fails_on_invalid_state(client):
    """Test callback rejects invalid or missing CSRF state."""
    # Call without state cookie
    res = client.get("/api/v1/auth/google/callback?code=fake_code&state=fake_state", follow_redirects=False)
    assert res.status_code == 307 or res.status_code == 302
    assert "oauth_error" in res.headers.get("location", "")


def test_google_auth_callback_fails_on_user_cancellation(client):
    """Test callback handles user cancellation cleanly."""
    res = client.get("/api/v1/auth/google/callback?error=access_denied", follow_redirects=False)
    assert res.status_code == 307 or res.status_code == 302
    assert "oauth_error" in res.headers.get("location", "")


@pytest.mark.anyio
async def test_google_auth_callback_creates_new_user_and_session(client, db_engine):
    """Test successful Google OAuth callback creates new verified USER and session cookie."""
    mock_userinfo = {
        "sub": "google-1092837465",
        "email": "google.user@example.com",
        "email_verified": True,
        "name": "Rohan Gupta",
        "picture": "https://lh3.googleusercontent.com/a/photo.jpg"
    }

    with patch("backend.services.google_auth_service.exchange_google_code_for_token", new=AsyncMock(return_value=(True, "mock_access_token", None))), \
         patch("backend.services.google_auth_service.fetch_google_userinfo", new=AsyncMock(return_value=(True, mock_userinfo, None))):
        
        # Step 1: Initiate to get state & cookie
        init_res = client.get("/api/v1/auth/google", follow_redirects=False)
        state = init_res.cookies.get("truemarriage_oauth_state")
        assert state is not None

        # Step 2: Callback with valid state & code
        callback_res = client.get(
            f"/api/v1/auth/google/callback?code=valid_code&state={state}",
            cookies={"truemarriage_oauth_state": state},
            follow_redirects=False
        )

        assert callback_res.status_code == 307
        assert "oauth_success=true" in callback_res.headers.get("location", "")
        assert "truemarriage_session" in callback_res.cookies

        # Step 3: Verify DB state
        SessionLocal = sessionmaker(bind=db_engine)
        db = SessionLocal()
        user = db.scalar(select(User).where(User.email == "google.user@example.com"))
        assert user is not None
        assert user.full_name == "Rohan Gupta"
        assert user.role == UserRole.USER  # Strict USER role
        assert user.status == UserStatus.ACTIVE  # Google verified
        assert user.is_email_verified is True
        assert user.password_hash is None

        # Verify Google identity linked
        ident = db.scalar(select(UserAuthIdentity).where(UserAuthIdentity.user_id == user.id))
        assert ident is not None
        assert ident.provider == AuthProvider.GOOGLE
        assert ident.provider_user_id == "google-1092837465"
        db.close()


@pytest.mark.anyio
async def test_google_auth_links_to_existing_user(client, db_engine):
    """Test Google OAuth links to existing normal user without creating duplicate."""
    # Pre-create user
    SessionLocal = sessionmaker(bind=db_engine)
    db = SessionLocal()
    import hashlib
    existing = User(
        id="existing-user-uuid",
        email="existing.user@example.com",
        full_name="Existing Name",
        password_hash=hashlib.sha256(b"pass").hexdigest(),
        role=UserRole.USER,
        status=UserStatus.PENDING_VERIFICATION,
        is_email_verified=False,
    )
    db.add(existing)
    db.commit()
    db.close()

    mock_userinfo = {
        "sub": "google-999888777",
        "email": "existing.user@example.com",
        "email_verified": True,
        "name": "Existing Name",
    }

    with patch("backend.services.google_auth_service.exchange_google_code_for_token", new=AsyncMock(return_value=(True, "mock_access_token", None))), \
         patch("backend.services.google_auth_service.fetch_google_userinfo", new=AsyncMock(return_value=(True, mock_userinfo, None))):
        
        init_res = client.get("/api/v1/auth/google", follow_redirects=False)
        state = init_res.cookies.get("truemarriage_oauth_state")

        callback_res = client.get(
            f"/api/v1/auth/google/callback?code=valid_code&state={state}",
            cookies={"truemarriage_oauth_state": state},
            follow_redirects=False
        )

        assert callback_res.status_code == 307
        assert "oauth_success=true" in callback_res.headers.get("location", "")

        # Verify user was updated & activated
        db = SessionLocal()
        all_users = list(db.scalars(select(User).where(User.email == "existing.user@example.com")).all())
        assert len(all_users) == 1, "Duplicate user created!"
        u = all_users[0]
        assert u.status == UserStatus.ACTIVE
        assert u.is_email_verified is True

        # Verify identity linked
        ident = db.scalar(select(UserAuthIdentity).where(UserAuthIdentity.user_id == u.id))
        assert ident is not None
        assert ident.provider == AuthProvider.GOOGLE
        db.close()


def test_registration_fails_on_weak_passwords(client):
    """Test 422 when password lacks length, uppercase, lowercase, number, or special character."""
    weak_passwords = [
        "12345678",        # only digits
        "password",        # only lowercase
        "PASSWORD",        # only uppercase
        "Password12",      # missing special char
        "Pass@1",          # too short (< 8 chars)
        "nocaps123@!",     # missing uppercase
        "NOLOWERS123@!",   # missing lowercase
        "NoDigitsHere@!",  # missing digits
    ]
    for weak_pass in weak_passwords:
        payload = {
            "name": "Priya Sharma",
            "email": "priya.secure@example.com",
            "password": weak_pass,
            "password_confirmation": weak_pass
        }
        res = client.post("/api/v1/auth/register", json=payload)
        assert res.status_code == 422, f"Weak password '{weak_pass}' was unexpectedly accepted!"


def test_registration_fails_on_name_over_50_chars(client):
    """Test 422 when name exceeds 50 characters (e.g. 5,000 chars pasted)."""
    payload = {
        "name": "A" * 51,
        "email": "toolong.name@example.com",
        "password": "StrongPassword123!",
        "password_confirmation": "StrongPassword123!"
    }
    res = client.post("/api/v1/auth/register", json=payload)
    assert res.status_code == 422
    assert "Full Name cannot exceed 50 characters" in res.text

    payload_5000 = {
        "name": "A" * 5000,
        "email": "toolong5000.name@example.com",
        "password": "StrongPassword123!",
        "password_confirmation": "StrongPassword123!"
    }
    res_5000 = client.post("/api/v1/auth/register", json=payload_5000)
    assert res_5000.status_code == 422
    assert "Full Name cannot exceed 50 characters" in res_5000.text


def test_biodata_character_limit_enforcement():
    from backend.routes.biodata import validate_biodata_lengths
    from fastapi import HTTPException

    # Valid payload
    validate_biodata_lengths({
        "name": "Aarav Sharma",
        "professionalSummary": "Short bio",
        "otherPreferences": "Short expectations"
    })

    # Name exceeds 50
    with pytest.raises(HTTPException) as exc:
        validate_biodata_lengths({"name": "A" * 51})
    assert exc.value.status_code == 400
    assert "Full Name cannot exceed 50 characters" in exc.value.detail

    # Name 5000 chars
    with pytest.raises(HTTPException) as exc:
        validate_biodata_lengths({"name": "A" * 5000})
    assert exc.value.status_code == 400
    assert "Full Name cannot exceed 50 characters" in exc.value.detail

    # Bio exceeds 500
    with pytest.raises(HTTPException) as exc:
        validate_biodata_lengths({"professionalSummary": "B" * 501})
    assert exc.value.status_code == 400
    assert "500 characters" in exc.value.detail

    # Expectations exceeds 500
    with pytest.raises(HTTPException) as exc:
        validate_biodata_lengths({"otherPreferences": "C" * 501})
    assert exc.value.status_code == 400
    assert "500 characters" in exc.value.detail

