import uuid
import tempfile
import os
import pytest
from starlette.testclient import TestClient
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker

from backend.main import app
from backend.db.base import Base
from backend.db.session import get_db
from backend.models.user import User, UserAuthIdentity
from backend.models.biodata import BiodataProfileModel
from backend.models.enums import UserRole, UserStatus, AuthProvider, ProfileModerationStatus, NotificationType
from backend.models.notification import NotificationModel
from backend.core.security import get_password_hash


@pytest.fixture(scope="function")
def db_engine():
    tmp_path = tempfile.mktemp(suffix=".db")
    db_url = f"sqlite:///{tmp_path}"
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
    if os.path.exists(tmp_path):
        try:
            os.remove(tmp_path)
        except OSError:
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

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app, raise_server_exceptions=True) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def db_session(db_engine):
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=db_engine)
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def test_interest_notification_displays_sender_name_not_recipient_name(client, db_session):
    """
    Test scenario:
    - User B is Gaurav Parise (gauravparise@gmail.com).
    - User A is Pallavi (pallavi@example.com) with profile fullName 'Pallavi'.
    - Pallavi sends interest to Gaurav Parise.
    - When Gaurav Parise fetches his notifications, the notification message MUST display
      'Pallavi has expressed interest in your profile!', NOT 'Gaurav Parise'.
    """
    uid_a = uuid.uuid4().hex[:6]
    uid_b = uuid.uuid4().hex[:6]
    email_a = f"pallavi_{uid_a}@example.com"
    email_b = f"gaurav_{uid_b}@gmail.com"

    # User A: Pallavi (sender)
    user_a = User(
        id=str(uuid.uuid4()),
        email=email_a,
        full_name="Pallavi Shinde",
        password_hash=get_password_hash("Password123!"),
        role=UserRole.USER,
        status=UserStatus.ACTIVE,
        is_email_verified=True,
    )
    # User B: Gaurav Parise (recipient)
    user_b = User(
        id=str(uuid.uuid4()),
        email=email_b,
        full_name="Gaurav Parise",
        password_hash=get_password_hash("Password123!"),
        role=UserRole.USER,
        status=UserStatus.ACTIVE,
        is_email_verified=True,
    )
    db_session.add_all([user_a, user_b])
    db_session.flush()
    db_session.add_all([
        UserAuthIdentity(user_id=user_a.id, provider=AuthProvider.LOCAL),
        UserAuthIdentity(user_id=user_b.id, provider=AuthProvider.LOCAL),
    ])
    db_session.commit()

    # User B (Gaurav Parise) creates and publishes an approved profile
    client.post("/api/v1/auth/login", json={"email": email_b, "password": "Password123!"})
    res_b = client.post("/api/v1/biodata/publish", json={
        "name": "Gaurav Parise",
        "gender": "Male",
        "dob": "1994-06-12",
        "city": "Pune",
    })
    assert res_b.status_code == 200
    target_profile_id = res_b.json()["profileId"]
    client.post("/api/v1/auth/logout")

    # User A (Pallavi) creates profile with fullName = 'Pallavi'
    client.post("/api/v1/auth/login", json={"email": email_a, "password": "Password123!"})
    res_a = client.post("/api/v1/biodata/publish", json={
        "name": "Pallavi",
        "gender": "Female",
        "dob": "1996-09-20",
        "city": "Mumbai",
    })
    assert res_a.status_code == 200
    sender_profile_id = res_a.json()["profileId"]

    # User A (Pallavi) sends interest to User B (Gaurav Parise)
    send_res = client.post("/api/v1/interests", json={"profile_id": target_profile_id})
    assert send_res.status_code == 201
    assert send_res.json()["success"] is True
    client.post("/api/v1/auth/logout")

    # User B (Gaurav Parise) logs into gauravparise@gmail.com and checks notifications
    login_b = client.post("/api/v1/auth/login", json={"email": email_b, "password": "Password123!"})
    assert login_b.status_code == 200

    notif_res = client.get("/api/v1/notifications")
    assert notif_res.status_code == 200
    data = notif_res.json()
    assert data["success"] is True
    assert len(data["data"]) >= 1

    first_notif = data["data"][0]
    assert first_notif["type"] == "INTEREST_RECEIVED"
    # MUST contain Pallavi, MUST NOT contain Gaurav Parise
    assert "Pallavi" in first_notif["message"]
    assert "Gaurav Parise" not in first_notif["message"]
    assert first_notif["message"] == "Pallavi has expressed interest in your profile!"


def test_existing_corrupted_notification_heals_on_fetch(client, db_session):
    """
    Verify that if a notification row in DB was previously stored with the wrong name
    (e.g., 'Gaurav Parise has expressed interest in your profile!'),
    fetching /notifications dynamically corrects it to the actual sender ('Pallavi').
    """
    uid_a = uuid.uuid4().hex[:6]
    uid_b = uuid.uuid4().hex[:6]
    email_a = f"pallavi_heal_{uid_a}@example.com"
    email_b = f"gaurav_heal_{uid_b}@gmail.com"

    user_a = User(
        id=str(uuid.uuid4()),
        email=email_a,
        full_name="Pallavi Shinde",
        password_hash=get_password_hash("Password123!"),
        role=UserRole.USER,
        status=UserStatus.ACTIVE,
        is_email_verified=True,
    )
    user_b = User(
        id=str(uuid.uuid4()),
        email=email_b,
        full_name="Gaurav Parise",
        password_hash=get_password_hash("Password123!"),
        role=UserRole.USER,
        status=UserStatus.ACTIVE,
        is_email_verified=True,
    )
    db_session.add_all([user_a, user_b])
    db_session.flush()
    db_session.add_all([
        UserAuthIdentity(user_id=user_a.id, provider=AuthProvider.LOCAL),
        UserAuthIdentity(user_id=user_b.id, provider=AuthProvider.LOCAL),
    ])
    db_session.commit()

    # User B profile
    client.post("/api/v1/auth/login", json={"email": email_b, "password": "Password123!"})
    res_b = client.post("/api/v1/biodata/publish", json={
        "name": "Gaurav Parise",
        "gender": "Male",
        "dob": "1994-06-12",
        "city": "Pune",
    })
    target_profile_id = res_b.json()["profileId"]
    client.post("/api/v1/auth/logout")

    # User A profile
    client.post("/api/v1/auth/login", json={"email": email_a, "password": "Password123!"})
    res_a = client.post("/api/v1/biodata/publish", json={
        "name": "Pallavi",
        "gender": "Female",
        "dob": "1996-09-20",
        "city": "Mumbai",
    })
    send_res = client.post("/api/v1/interests", json={"profile_id": target_profile_id})
    client.post("/api/v1/auth/logout")

    # Deliberately corrupt the notification row in DB to have 'Gaurav Parise'
    corrupted_notif = db_session.scalar(
        select(NotificationModel)
        .where(NotificationModel.user_id == user_b.id)
        .where(NotificationModel.type == NotificationType.INTEREST_RECEIVED)
    )
    assert corrupted_notif is not None
    corrupted_notif.message = "Gaurav Parise has expressed interest in your profile!"
    db_session.commit()

    # Now Gaurav Parise logs in and fetches notifications
    client.post("/api/v1/auth/login", json={"email": email_b, "password": "Password123!"})
    notif_res = client.get("/api/v1/notifications")
    assert notif_res.status_code == 200
    data = notif_res.json()
    first_notif = data["data"][0]

    # Verify self-healing
    assert first_notif["message"] == "Pallavi has expressed interest in your profile!"
    assert "Gaurav Parise" not in first_notif["message"]
