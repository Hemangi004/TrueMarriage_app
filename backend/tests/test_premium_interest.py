import pytest
import tempfile
import os
import uuid
import hashlib
from datetime import datetime, timezone, timedelta
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.main import app
from backend.db.base import Base
from backend.db.session import get_db
from backend.models.user import User
from backend.models.session import SessionModel
from backend.models.premium_interest import PremiumInterestEvent
from backend.models.enums import UserRole, UserStatus


@pytest.fixture(scope="function")
def db_engine():
    tmp = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
    tmp.close()
    db_url = f"sqlite:///{tmp.name}"

    engine = create_engine(db_url, connect_args={"check_same_thread": False})
    import backend.models.user  # noqa
    import backend.models.session  # noqa
    import backend.models.premium_interest  # noqa
    Base.metadata.create_all(bind=engine)
    yield engine
    engine.dispose()
    try:
        os.unlink(tmp.name)
    except Exception:
        pass


@pytest.fixture(scope="function")
def db_session(db_engine):
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=db_engine)
    session = SessionLocal()
    yield session
    session.close()


@pytest.fixture(scope="function")
def client(db_engine):
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=db_engine)

    def override_get_db():
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app, raise_server_exceptions=True) as c:
        yield c
    app.dependency_overrides.clear()


def make_user(db, email, name="Test User", role=UserRole.USER, status=UserStatus.ACTIVE, verified=True):
    user = User(
        id=str(uuid.uuid4()),
        email=email,
        full_name=name,
        password_hash=hashlib.sha256(b"password123").hexdigest(),
        role=role,
        status=status,
        is_email_verified=verified,
    )
    db.add(user)
    db.flush()
    db.commit()
    return user


def make_session(db, user_id):
    raw_token = str(uuid.uuid4())
    token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
    session = SessionModel(
        id=str(uuid.uuid4()),
        user_id=user_id,
        session_token_hash=token_hash,
        expires_at=datetime.now(timezone.utc) + timedelta(hours=24),
        is_active=True,
    )
    db.add(session)
    db.flush()
    db.commit()
    return raw_token


def test_event_creation_registered_user(client, db_session):
    """Verify an authenticated user can successfully record a PREMIUM_CLICK event."""
    user = make_user(db_session, "user1@example.com", "User One")
    token = make_session(db_session, user.id)

    response = client.post(
        "/api/v1/analytics/premium-click",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 201
    res_data = response.json()
    assert res_data["success"] is True
    assert res_data["requires_login"] is False
    assert res_data["event"]["user_id"] == user.id
    assert res_data["event"]["event_type"] == "PREMIUM_CLICK"

    # Verify database persistence
    db_events = db_session.query(PremiumInterestEvent).filter_by(user_id=user.id).all()
    assert len(db_events) == 1
    assert db_events[0].event_type == "PREMIUM_CLICK"


def test_event_creation_unregistered_guest(client, db_session):
    """Verify an unauthenticated guest can record a click metric and receive requires_login=True."""
    response = client.post("/api/v1/analytics/premium-click")

    assert response.status_code == 201
    res_data = response.json()
    assert res_data["success"] is True
    assert res_data["requires_login"] is True
    assert res_data["event"]["user_id"] is None
    assert res_data["event"]["event_type"] == "PREMIUM_CLICK"

    # Verify database persistence for guest event
    guest_events = db_session.query(PremiumInterestEvent).filter(PremiumInterestEvent.user_id.is_(None)).all()
    assert len(guest_events) == 1


def test_separate_registered_and_unregistered_counting(client, db_session):
    """Verify admin analysis API reports registered_premium_clicks and unregistered_premium_clicks separately."""
    user = make_user(db_session, "member@example.com", "Member User")
    token = make_session(db_session, user.id)

    admin = make_user(db_session, "admin_counts@example.com", "Admin Counts", role=UserRole.ADMIN)
    admin_token = make_session(db_session, admin.id)

    # 2 registered clicks
    client.post("/api/v1/analytics/premium-click", headers={"Authorization": f"Bearer {token}"})
    client.post("/api/v1/analytics/premium-click", headers={"Authorization": f"Bearer {token}"})

    # 3 guest clicks (unauthenticated)
    for _ in range(3):
        client.post("/api/v1/analytics/premium-click")

    analysis_res = client.get(
        "/api/v1/admin/user-analysis",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert analysis_res.status_code == 200
    data = analysis_res.json()
    assert data["registered_premium_clicks"] == 2
    assert data["unregistered_premium_clicks"] == 3
    assert data["total_premium_clicks"] == 5
    assert data["unique_users_clicked_premium"] == 1


def test_percentage_calculation(client, db_session):
    """Verify premium-interest percentage calculation under different registered user totals."""
    admin = make_user(db_session, "admin_pct@example.com", "Admin Pct", role=UserRole.ADMIN)
    admin_token = make_session(db_session, admin.id)

    # 4 registered users total (1 admin + 3 regular)
    u1 = make_user(db_session, "p1@example.com", "P1")
    u2 = make_user(db_session, "p2@example.com", "P2")
    u3 = make_user(db_session, "p3@example.com", "P3")

    t1 = make_session(db_session, u1.id)
    t2 = make_session(db_session, u2.id)

    # 2 out of 4 users clicked -> 50.0%
    client.post("/api/v1/analytics/premium-click", headers={"Authorization": f"Bearer {t1}"})
    client.post("/api/v1/analytics/premium-click", headers={"Authorization": f"Bearer {t2}"})

    analysis_res = client.get(
        "/api/v1/admin/user-analysis",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert analysis_res.status_code == 200
    data = analysis_res.json()
    assert data["total_registered_users"] == 4
    assert data["unique_users_clicked_premium"] == 2
    assert data["premium_interest_percentage"] == 50.0


def test_admin_authorization(client, db_session):
    """Verify 403 for non-admin user accessing admin user analysis endpoint."""
    regular_user = make_user(db_session, "reg_sec@example.com", "Regular User")
    reg_token = make_session(db_session, regular_user.id)

    # Regular user accessing admin user analysis -> 403 Forbidden
    reg_admin_res = client.get(
        "/api/v1/admin/user-analysis",
        headers={"Authorization": f"Bearer {reg_token}"}
    )
    assert reg_admin_res.status_code == 403

    # Unauthenticated access to admin user analysis -> 401 Unauthorized
    unauth_admin_res = client.get("/api/v1/admin/user-analysis")
    assert unauth_admin_res.status_code == 401
