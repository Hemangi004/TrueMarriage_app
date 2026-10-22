"""
Unit & Integration Tests for Google OAuth ID Token Verification (Mobile & Web) Endpoint.
Covers POST /api/v1/auth/google/verify.
"""
import pytest
import tempfile
import os
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker

from backend.main import app
from backend.db.base import Base
from backend.db.session import get_db
from backend.models.user import User, UserAuthIdentity
from backend.models.session import SessionModel
from backend.models.enums import UserRole, UserStatus, AuthProvider
from backend.core.config import settings


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

    orig_id = settings.GOOGLE_CLIENT_ID
    orig_secret = settings.GOOGLE_CLIENT_SECRET
    orig_android_id = settings.GOOGLE_ANDROID_CLIENT_ID

    settings.GOOGLE_CLIENT_ID = "dummy_web_client_12345.apps.googleusercontent.com"
    settings.GOOGLE_CLIENT_SECRET = "dummy_client_secret_99999"
    settings.GOOGLE_ANDROID_CLIENT_ID = "dummy_android_client_67890.apps.googleusercontent.com"

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app, raise_server_exceptions=False) as c:
        yield c
    app.dependency_overrides.clear()
    settings.GOOGLE_CLIENT_ID = orig_id
    settings.GOOGLE_CLIENT_SECRET = orig_secret
    settings.GOOGLE_ANDROID_CLIENT_ID = orig_android_id


def test_google_verify_missing_token_returns_422(client):
    """Test POST /api/v1/auth/google/verify rejects empty or missing payload."""
    res = client.post("/api/v1/auth/google/verify", json={})
    assert res.status_code == 422

    res_short = client.post("/api/v1/auth/google/verify", json={"id_token": "abc"})
    assert res_short.status_code == 422


def test_google_verify_invalid_token_returns_401(client):
    """Test POST /api/v1/auth/google/verify returns 401 when token verification fails."""
    with patch("backend.services.google_auth_service.verify_google_id_token", return_value=(False, None, "Invalid Google token signature")):
        res = client.post("/api/v1/auth/google/verify", json={"id_token": "invalid_jwt_token_here_12345"})
        assert res.status_code == 401
        data = res.json()
        assert data["detail"]["success"] is False
        assert "Invalid Google token" in data["detail"]["message"]


def test_google_verify_creates_new_user_and_session(client, db_engine):
    """Test POST /api/v1/auth/google/verify successfully registers a new Google user and issues session."""
    mock_claims = {
        "sub": "google-mobile-sub-112233",
        "email": "mobile.user@example.com",
        "email_verified": True,
        "name": "Ananya Mobile",
        "aud": "dummy_web_client_12345.apps.googleusercontent.com",
        "iss": "https://accounts.google.com"
    }

    with patch("backend.services.google_auth_service.verify_google_id_token", return_value=(True, mock_claims, None)):
        res = client.post("/api/v1/auth/google/verify", json={"id_token": "valid_mock_google_id_token_12345"})
        assert res.status_code == 200
        data = res.json()
        assert data["success"] is True
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert data["user"]["email"] == "mobile.user@example.com"
        assert data["user"]["full_name"] == "Ananya Mobile"
        assert data["user"]["role"] == "USER"
        assert data["user"]["status"] == "ACTIVE"
        assert data["user"]["is_email_verified"] is True

        # Check session cookie
        assert "truemarriage_session" in res.cookies

        # Verify database record
        SessionLocal = sessionmaker(bind=db_engine)
        db = SessionLocal()
        user = db.scalar(select(User).where(User.email == "mobile.user@example.com"))
        assert user is not None
        assert user.status == UserStatus.ACTIVE
        assert user.role == UserRole.USER
        assert user.is_email_verified is True

        # Verify Google identity record
        ident = db.scalar(select(UserAuthIdentity).where(UserAuthIdentity.user_id == user.id))
        assert ident is not None
        assert ident.provider == AuthProvider.GOOGLE
        assert ident.provider_user_id == "google-mobile-sub-112233"
        db.close()


def test_google_verify_links_to_existing_user(client, db_engine):
    """Test POST /api/v1/auth/google/verify links Google identity to pre-existing user without duplication."""
    SessionLocal = sessionmaker(bind=db_engine)
    db = SessionLocal()
    existing = User(
        id="existing-pre-user-id",
        email="preexisting@example.com",
        full_name="Pre Existing",
        password_hash="some_hash",
        role=UserRole.USER,
        status=UserStatus.PENDING_VERIFICATION,
        is_email_verified=False,
    )
    db.add(existing)
    db.commit()
    db.close()

    mock_claims = {
        "sub": "google-mobile-existing-9988",
        "email": "preexisting@example.com",
        "email_verified": True,
        "name": "Pre Existing",
        "aud": "dummy_android_client_67890.apps.googleusercontent.com",
        "iss": "https://accounts.google.com"
    }

    with patch("backend.services.google_auth_service.verify_google_id_token", return_value=(True, mock_claims, None)):
        res = client.post("/api/v1/auth/google/verify", json={"id_token": "valid_android_google_id_token_12345"})
        assert res.status_code == 200
        data = res.json()
        assert data["success"] is True
        assert data["user"]["email"] == "preexisting@example.com"
        assert data["user"]["status"] == "ACTIVE"

        # Verify user was updated in DB
        db = SessionLocal()
        users = list(db.scalars(select(User).where(User.email == "preexisting@example.com")).all())
        assert len(users) == 1
        assert users[0].status == UserStatus.ACTIVE
        assert users[0].is_email_verified is True

        # Verify identity linked
        ident = db.scalar(select(UserAuthIdentity).where(UserAuthIdentity.user_id == users[0].id))
        assert ident is not None
        assert ident.provider == AuthProvider.GOOGLE
        assert ident.provider_user_id == "google-mobile-existing-9988"
        db.close()


def test_google_verify_rejects_blocked_user(client, db_engine):
    """Test POST /api/v1/auth/google/verify returns 403 when user status is BLOCKED."""
    SessionLocal = sessionmaker(bind=db_engine)
    db = SessionLocal()
    blocked_user = User(
        id="blocked-user-id",
        email="blocked@example.com",
        full_name="Blocked User",
        role=UserRole.USER,
        status=UserStatus.BLOCKED,
        is_email_verified=True,
    )
    db.add(blocked_user)
    db.commit()
    db.close()

    mock_claims = {
        "sub": "google-sub-blocked-000",
        "email": "blocked@example.com",
        "email_verified": True,
        "name": "Blocked User",
    }

    with patch("backend.services.google_auth_service.verify_google_id_token", return_value=(True, mock_claims, None)):
        res = client.post("/api/v1/auth/google/verify", json={"id_token": "blocked_token_12345"})
        assert res.status_code == 403
        data = res.json()
        assert "blocked" in data["detail"]["message"].lower()
