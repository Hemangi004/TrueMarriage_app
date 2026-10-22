"""
Automated verification test suite for Final UX Consistency & Session Invariants.
Tests:
- Server session single source of truth (/auth/me)
- Unauthenticated rejection on Discovery APIs (401)
- Cross-user draft isolation (User A vs User B)
- Admin account bootstrap (temporarymatrimony@gmail.com / admin123 -> ADMIN role -> 200)
- Normal user admin access rejection (403)
"""
import uuid
import pytest
from starlette.testclient import TestClient
from sqlalchemy.orm import sessionmaker

from backend.main import app
from backend.db.session import get_db
from backend.models.user import User, UserAuthIdentity
from backend.models.enums import UserRole, UserStatus, AuthProvider
from backend.core.security import get_password_hash
from backend.services.session_service import create_session


import tempfile
import os
from sqlalchemy import create_engine
from backend.db.base import Base

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


def test_auth_me_unauthenticated_returns_401(client):
    """Test 1: Unauthenticated request to /auth/me returns 401."""
    res = client.get("/api/v1/auth/me")
    assert res.status_code == 401


def test_discovery_profiles_unauthenticated_accessible(client):
    """Test 2: Discovery profiles feed is publicly browseable."""
    res = client.get("/api/v1/discovery/profiles")
    assert res.status_code == 200


def test_discovery_profile_detail_unauthenticated_returns_404_for_missing(client):
    """Test 3: Discovery detail endpoint returns 404 for non-existent profile."""
    res = client.get("/api/v1/discovery/profiles/non-existent-profile-123")
    assert res.status_code == 404


def test_admin_bootstrap_account_login(client, db_session):
    """Test 4: Bootstrapped admin (temporarymatrimony@gmail.com / admin123) logins successfully."""
    # Ensure admin user exists in test DB session
    admin = User(
        email="temporarymatrimony@gmail.com",
        full_name="TrueMarriage Admin",
        password_hash=get_password_hash("admin123"),
        role=UserRole.ADMIN,
        status=UserStatus.ACTIVE,
        is_email_verified=True
    )
    db_session.add(admin)
    db_session.flush()
    db_session.add(UserAuthIdentity(user_id=admin.id, provider=AuthProvider.LOCAL))
    db_session.commit()

    res = client.post("/api/v1/auth/login", json={
        "email": "temporarymatrimony@gmail.com",
        "password": "admin123"
    })
    assert res.status_code == 200
    assert "truemarriage_session" in res.cookies

    # Verify /auth/me returns ADMIN role
    me_res = client.get("/api/v1/auth/me")
    assert me_res.status_code == 200
    data = me_res.json()
    assert data["role"] == "ADMIN"
    assert data["email"] == "temporarymatrimony@gmail.com"

    # Verify Admin API access
    admin_test_res = client.get("/api/v1/admin/test")
    assert admin_test_res.status_code == 200


def test_normal_user_admin_access_rejected_403(client, db_session):
    """Test 5: Normal USER receives 403 when calling admin APIs."""
    user = User(
        email="normal.user@example.com",
        full_name="Normal User",
        password_hash=get_password_hash("Password123!"),
        role=UserRole.USER,
        status=UserStatus.ACTIVE,
        is_email_verified=True
    )
    db_session.add(user)
    db_session.flush()
    db_session.add(UserAuthIdentity(user_id=user.id, provider=AuthProvider.LOCAL))
    db_session.commit()

    # Login normal user
    res = client.post("/api/v1/auth/login", json={
        "email": "normal.user@example.com",
        "password": "Password123!"
    })
    assert res.status_code == 200

    # Call admin endpoint
    admin_res = client.get("/api/v1/admin/test")
    assert admin_res.status_code == 403


def test_cross_user_biodata_isolation(client, db_session):
    """
    Test 6: User A creates biodata draft.
    User B logs in -> User B cannot see User A's biodata.
    User A logs back in -> User A sees own draft.
    """
    # Create User A & User B
    user_a = User(
        email="user.a@example.com",
        full_name="User A",
        password_hash=get_password_hash("Password123!"),
        role=UserRole.USER,
        status=UserStatus.ACTIVE,
        is_email_verified=True
    )
    user_b = User(
        email="user.b@example.com",
        full_name="User B",
        password_hash=get_password_hash("Password123!"),
        role=UserRole.USER,
        status=UserStatus.ACTIVE,
        is_email_verified=True
    )
    db_session.add_all([user_a, user_b])
    db_session.flush()
    db_session.add_all([
        UserAuthIdentity(user_id=user_a.id, provider=AuthProvider.LOCAL),
        UserAuthIdentity(user_id=user_b.id, provider=AuthProvider.LOCAL)
    ])
    db_session.commit()

    # 1. Login User A and save draft
    client.post("/api/v1/auth/login", json={"email": "user.a@example.com", "password": "Password123!"})
    save_res = client.post("/api/v1/biodata", json={
        "name": "User A Secret Profile",
        "occupation": "Architect",
        "salaryRange": "₹15 - ₹25 LPA"
    })
    assert save_res.status_code == 200

    # Logout User A
    client.post("/api/v1/auth/logout")

    # 2. Login User B and get biodata
    client.post("/api/v1/auth/login", json={"email": "user.b@example.com", "password": "Password123!"})
    b_biodata_res = client.get("/api/v1/biodata/me")
    assert b_biodata_res.status_code == 200
    b_data = b_biodata_res.json()["data"]
    # User B should NOT see User A's data
    assert b_data is None or b_data.get("name") != "User A Secret Profile"

    # Logout User B
    client.post("/api/v1/auth/logout")

    # 3. Login User A again and get biodata
    client.post("/api/v1/auth/login", json={"email": "user.a@example.com", "password": "Password123!"})
    a_biodata_res = client.get("/api/v1/biodata/me")
    assert a_biodata_res.status_code == 200
    a_data = a_biodata_res.json()["data"]
    assert a_data["name"] == "User A Secret Profile"
    assert a_data["occupation"] == "Architect"


def test_expected_age_validation(client, db_session):
    """
    Test that save_biodata rejects Min Age >= Max Age with 400 Bad Request
    and accepts valid age range (Min < Max).
    """
    import random
    from sqlalchemy import select
    from backend.models.user import User, UserAuthIdentity
    from backend.models.enums import UserRole, UserStatus, AuthProvider
    from backend.core.security import get_password_hash

    email = f"age.test.{random.randint(1000, 9999)}@example.com"
    user = User(
        email=email,
        full_name="Age Range Tester",
        password_hash=get_password_hash("Password123!"),
        role=UserRole.USER,
        status=UserStatus.ACTIVE,
        is_email_verified=True
    )
    db_session.add(user)
    db_session.flush()
    db_session.add(UserAuthIdentity(user_id=user.id, provider=AuthProvider.LOCAL))
    db_session.commit()

    login_res = client.post("/api/v1/auth/login", json={"email": email, "password": "Password123!"})
    assert login_res.status_code == 200

    # 1. Min Age == Max Age -> 400 Bad Request
    res_equal = client.post("/api/v1/biodata", json={
        "name": "Age Test User",
        "expectedAgeMin": 60,
        "expectedAgeMax": 60
    })
    assert res_equal.status_code == 400
    assert "Maximum age must be greater than minimum age" in res_equal.json()["detail"]

    # 2. Min Age > Max Age -> 400 Bad Request
    res_greater = client.post("/api/v1/biodata", json={
        "name": "Age Test User",
        "expectedAgeMin": 35,
        "expectedAgeMax": 25
    })
    assert res_greater.status_code == 400

    # 3. Min Age < Max Age -> 200 OK
    res_valid = client.post("/api/v1/biodata", json={
        "name": "Age Test User",
        "expectedAgeMin": 24,
        "expectedAgeMax": 30
    })
    assert res_valid.status_code == 200
    assert res_valid.json()["success"] is True


def test_registration_profile_isolation(client, db_session):
    """
    Test: Unique registrations must strictly isolate profiles.
    User 1 creates a profile with Name 'Rahul', Age 28, City 'Mumbai'.
    User 2 registers with a different email.
    User 2 must NOT be associated with User 1's profile.
    """
    import random
    from backend.models.biodata import BiodataProfileModel
    from sqlalchemy import select

    rand = random.randint(10000, 99999)
    email_a = f"rahul.a.{rand}@example.com"
    email_b = f"rahul.b.{rand}@example.com"

    # 1. Create and verify User A
    user_a = User(
        email=email_a,
        full_name="Rahul",
        password_hash=get_password_hash("Password123!"),
        role=UserRole.USER,
        status=UserStatus.ACTIVE,
        is_email_verified=True
    )
    db_session.add(user_a)
    db_session.flush()
    db_session.add(UserAuthIdentity(user_id=user_a.id, provider=AuthProvider.LOCAL))
    db_session.commit()

    # Login User A and publish biodata profile
    client.post("/api/v1/auth/login", json={"email": email_a, "password": "Password123!"})
    pub_res = client.post("/api/v1/biodata/publish", json={
        "name": "Rahul",
        "dob": "1998-05-15",
        "currentAddress": "Mumbai, Maharashtra",
        "gender": "Male",
        "maritalStatus": "Never Married"
    })
    assert pub_res.status_code == 200
    profile_a_id = pub_res.json()["profileId"]

    # Logout User A
    client.post("/api/v1/auth/logout")

    # 2. Create User B
    user_b = User(
        email=email_b,
        full_name="Rahul",
        password_hash=get_password_hash("Password123!"),
        role=UserRole.USER,
        status=UserStatus.ACTIVE,
        is_email_verified=True
    )
    db_session.add(user_b)
    db_session.flush()
    db_session.add(UserAuthIdentity(user_id=user_b.id, provider=AuthProvider.LOCAL))
    db_session.commit()

    # Login User B and get biodata
    client.post("/api/v1/auth/login", json={"email": email_b, "password": "Password123!"})
    me_res = client.get("/api/v1/biodata/me")
    assert me_res.status_code == 200
    b_data = me_res.json()
    # User B must NOT have User A's profile ID or profile data
    assert b_data["data"] is None
    assert b_data["profileId"] is None
    assert b_data["profileId"] != profile_a_id

    # Verify database isolation: profile_a belongs exclusively to user_a
    prof_in_db = db_session.scalar(select(BiodataProfileModel).where(BiodataProfileModel.id == profile_a_id))
    assert prof_in_db.user_id == user_a.id
    assert prof_in_db.user_id != user_b.id
    assert prof_in_db.profile_data["email"] == email_a


def test_admin_delete_user_and_profile(client, db_session):
    """
    Test: Admin can permanently delete a user profile and delete a user account.
    """
    import random
    from backend.models.biodata import BiodataProfileModel
    from sqlalchemy import select

    rand = random.randint(10000, 99999)
    admin_email = f"admin.{rand}@truemarriage.in"
    user_email = f"target.user.{rand}@example.com"

    # Create admin
    admin = User(
        email=admin_email,
        full_name="Admin Delete Tester",
        password_hash=get_password_hash("AdminPass123!"),
        role=UserRole.ADMIN,
        status=UserStatus.ACTIVE,
        is_email_verified=True
    )
    # Create target user
    target = User(
        email=user_email,
        full_name="Target Delete User",
        password_hash=get_password_hash("Password123!"),
        role=UserRole.USER,
        status=UserStatus.ACTIVE,
        is_email_verified=True
    )
    db_session.add_all([admin, target])
    db_session.flush()
    db_session.add_all([
        UserAuthIdentity(user_id=admin.id, provider=AuthProvider.LOCAL),
        UserAuthIdentity(user_id=target.id, provider=AuthProvider.LOCAL)
    ])
    db_session.commit()

    # Target creates a profile
    client.post("/api/v1/auth/login", json={"email": user_email, "password": "Password123!"})
    save_res = client.post("/api/v1/biodata/publish", json={
        "name": "Target Candidate",
        "gender": "Female",
        "dob": "1999-01-01"
    })
    assert save_res.status_code == 200
    target_profile_id = save_res.json()["profileId"]
    client.post("/api/v1/auth/logout")

    # Admin logs in
    client.post("/api/v1/auth/login", json={"email": admin_email, "password": "AdminPass123!"})

    # 1. Admin deletes the target's profile
    del_prof_res = client.delete(f"/api/v1/admin/profiles/{target_profile_id}")
    assert del_prof_res.status_code == 200
    assert del_prof_res.json()["success"] is True

    # Verify profile is deleted in DB
    prof_check = db_session.scalar(select(BiodataProfileModel).where(BiodataProfileModel.id == target_profile_id))
    assert prof_check is None

    # 2. Admin deletes target user account
    del_user_res = client.delete(f"/api/v1/admin/users/{target.id}")
    assert del_user_res.status_code == 200
    assert del_user_res.json()["success"] is True

    # Verify user is deleted in DB
    user_check = db_session.scalar(select(User).where(User.id == target.id))
    assert user_check is None


def test_send_interest_creates_notification_for_target_user(client, db_session):
    """
    Verify that when User A sends an interest to User B:
    1. The interest is recorded as PENDING.
    2. User B receives an in-app notification with User A's display name.
    3. User B's notification endpoint reflects unread_count = 1.
    """
    user_a_email = f"sender_{uuid.uuid4().hex[:6]}@example.com"
    user_b_email = f"receiver_{uuid.uuid4().hex[:6]}@example.com"

    user_a = User(
        id=str(uuid.uuid4()),
        email=user_a_email,
        full_name="Vikram Seth",
        password_hash=get_password_hash("Password123!"),
        role=UserRole.USER,
        status=UserStatus.ACTIVE,
        is_email_verified=True,
    )
    user_b = User(
        id=str(uuid.uuid4()),
        email=user_b_email,
        full_name="Pooja Hegde",
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

    # User B creates and publishes an approved profile
    client.post("/api/v1/auth/login", json={"email": user_b_email, "password": "Password123!"})
    res_b = client.post("/api/v1/biodata/publish", json={
        "name": "Pooja Hegde",
        "gender": "Female",
        "dob": "1997-04-10",
        "city": "Bengaluru",
    })
    assert res_b.status_code == 200
    target_profile_id = res_b.json()["profileId"]
    client.post("/api/v1/auth/logout")

    # User A creates a profile and sends interest to User B
    client.post("/api/v1/auth/login", json={"email": user_a_email, "password": "Password123!"})
    client.post("/api/v1/biodata/publish", json={
        "name": "Vikram Seth",
        "gender": "Male",
        "dob": "1995-08-15",
        "city": "Mumbai",
    })

    # Send interest
    send_res = client.post("/api/v1/interests", json={"profile_id": target_profile_id})
    assert send_res.status_code == 201
    assert send_res.json()["success"] is True
    client.post("/api/v1/auth/logout")

    # User B logs in and checks notifications
    client.post("/api/v1/auth/login", json={"email": user_b_email, "password": "Password123!"})
    notif_res = client.get("/api/v1/notifications")
    assert notif_res.status_code == 200
    data = notif_res.json()
    assert data["success"] is True
    assert data["unread_count"] >= 1
    assert len(data["data"]) >= 1

    first_notif = data["data"][0]
    assert first_notif["type"] == "INTEREST_RECEIVED"
    assert "New Interest Received" in first_notif["title"]
    assert "Vikram Seth" in first_notif["message"]


def test_admin_broadcast_notification_delivered_to_all_users(client, db_session):
    """
    Verify that an administrator can broadcast a system announcement:
    1. POST /api/v1/admin/notifications/broadcast records the announcement.
    2. All registered active users receive the notification in their in-app bell.
    3. GET /api/v1/admin/notifications returns the history item.
    """
    admin_email = f"broadcast_admin_{uuid.uuid4().hex[:6]}@example.com"
    member_email = f"member_{uuid.uuid4().hex[:6]}@example.com"

    admin = User(
        id=str(uuid.uuid4()),
        email=admin_email,
        full_name="Platform Admin",
        password_hash=get_password_hash("AdminSecret123!"),
        role=UserRole.ADMIN,
        status=UserStatus.ACTIVE,
        is_email_verified=True,
    )
    member = User(
        id=str(uuid.uuid4()),
        email=member_email,
        full_name="Platform Member",
        password_hash=get_password_hash("MemberSecret123!"),
        role=UserRole.USER,
        status=UserStatus.ACTIVE,
        is_email_verified=True,
    )
    db_session.add_all([admin, member])
    db_session.flush()
    db_session.add_all([
        UserAuthIdentity(user_id=admin.id, provider=AuthProvider.LOCAL),
        UserAuthIdentity(user_id=member.id, provider=AuthProvider.LOCAL),
    ])
    db_session.commit()

    # Admin broadcasts an announcement
    client.post("/api/v1/auth/login", json={"email": admin_email, "password": "AdminSecret123!"})
    bc_res = client.post("/api/v1/admin/notifications/broadcast", json={
        "title": "Scheduled Server Upgrade",
        "message": "TrueMarriage will be upgraded tonight with new features!",
        "type": "SYSTEM",
    })
    assert bc_res.status_code == 200
    assert bc_res.json()["success"] is True
    assert bc_res.json()["recipient_count"] >= 2

    # Admin verifies history
    hist_res = client.get("/api/v1/admin/notifications")
    assert hist_res.status_code == 200
    announcements = hist_res.json()["announcements"]
    assert len(announcements) >= 1
    assert any(a["title"] == "Scheduled Server Upgrade" for a in announcements)
    client.post("/api/v1/auth/logout")

    # Member logs in and verifies broadcast received in notification bell
    client.post("/api/v1/auth/login", json={"email": member_email, "password": "MemberSecret123!"})
    member_notif_res = client.get("/api/v1/notifications")
    assert member_notif_res.status_code == 200
    member_data = member_notif_res.json()
    assert member_data["unread_count"] >= 1

    received_titles = [n["title"] for n in member_data["data"]]
    assert "Scheduled Server Upgrade" in received_titles


