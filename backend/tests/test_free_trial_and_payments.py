import tempfile
import os
import uuid
from datetime import datetime, timezone, timedelta
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.main import app
from backend.db.base import Base
from backend.db.session import get_db
from backend.models.user import User
from backend.models.session import SessionModel
from backend.models.payment import PaymentOrder
from backend.models.enums import UserRole, UserStatus
from backend.services.payment_service import (
    PLANS,
    get_user_subscription_status,
    start_free_trial,
)


@pytest.fixture(scope="function")
def db_engine():
    tmp = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
    tmp.close()
    db_url = f"sqlite:///{tmp.name}"

    engine = create_engine(db_url, connect_args={"check_same_thread": False})
    import backend.models.user  # noqa
    import backend.models.session  # noqa
    import backend.models.payment  # noqa
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


def create_test_user_and_token(db_session, email="trialuser@truemarriage.in", is_premium=False):
    user = User(
        id=f"user_{uuid.uuid4().hex[:12]}",
        email=email,
        full_name="Trial Test User",
        role=UserRole.USER,
        status=UserStatus.ACTIVE,
        is_email_verified=True,
        is_premium=is_premium,
        premium_until=(datetime.now(timezone.utc) + timedelta(days=30)) if is_premium else None,
    )
    db_session.add(user)
    db_session.commit()

    token_val = f"session_token_{uuid.uuid4().hex}"
    session_obj = SessionModel(
        id=f"sess_{uuid.uuid4().hex[:12]}",
        user_id=user.id,
        session_token_hash=token_val,
        expires_at=datetime.now(timezone.utc) + timedelta(days=7),
    )
    db_session.add(session_obj)
    db_session.commit()

    return user, token_val


def test_plans_contain_30_day_free_trial(client):
    """Test that public pricing plans endpoint reports 30-day trial metadata."""
    res = client.get("/api/v1/payments/plans")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    plan = data["plans"]["premium_monthly"]
    assert plan["amount"] == 299
    assert plan["trial_days"] == 30
    assert "30-day free trial" in plan["description"].lower()


def test_start_free_trial_direct_activation(db_session):
    """Test start_free_trial function activates 30 days of PRO."""
    user, _ = create_test_user_and_token(db_session, "direct_trial@truemarriage.in", is_premium=False)
    assert user.is_premium is False

    success, msg, data = start_free_trial(db=db_session, user=user)
    assert success is True
    assert "30-day Free Trial" in msg
    assert user.is_premium is True
    assert user.premium_until is not None
    assert data["is_in_trial"] is True
    assert data["trial_days"] == 30

    # Verify order recorded
    order = db_session.query(PaymentOrder).filter(PaymentOrder.user_id == user.id).first()
    assert order is not None
    assert order.status == "COMPLETED"
    assert order.amount == 0
    assert order.payment_method == "FREE_TRIAL_30_DAYS"


def test_subscription_status_reports_trial(db_session):
    """Test get_user_subscription_status detects trial window."""
    user, _ = create_test_user_and_token(db_session, "status_trial@truemarriage.in", is_premium=False)
    start_free_trial(db=db_session, user=user)

    status = get_user_subscription_status(db=db_session, user=user)
    assert status["is_premium"] is True
    assert status["is_in_trial"] is True
    assert status["trial_days"] == 30
    assert status["days_left_in_trial"] >= 29
    assert status["first_charge_amount"] == 299
    assert status["first_charge_date"] is not None
