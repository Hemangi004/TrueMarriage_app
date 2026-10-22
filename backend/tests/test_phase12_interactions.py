import pytest
import tempfile
import os
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker

from backend.main import app
from backend.db.base import Base
from backend.db.session import get_db
from backend.models.user import User
from backend.models.biodata import BiodataProfileModel
from backend.models.notification import NotificationModel
from backend.models.shortlist import ShortlistModel
from backend.models.interest import InterestModel
from backend.models.enums import (
    UserRole, UserStatus, ProfileModerationStatus, InterestStatus, NotificationType
)

# ── Test DB Setup ────────────────────────────────────────────────────────────

@pytest.fixture(scope="function")
def db_engine():
    # Use file-based SQLite so in-memory schema is accessible across threads
    tmp = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
    tmp.close()
    db_url = f"sqlite:///{tmp.name}"

    engine = create_engine(db_url, connect_args={"check_same_thread": False})
    # Import ALL models to register all tables before create_all
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


# ── Fixture Helpers ──────────────────────────────────────────────────────────


def make_user(db, email, name="Test User", role=UserRole.USER, status=UserStatus.ACTIVE, verified=True):
    import uuid, hashlib
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
    return user


def make_session(db, user_id):
    import uuid, hashlib
    from backend.models.session import SessionModel
    from datetime import datetime, timezone, timedelta
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
    return raw_token


def make_profile(db, user_id, status=ProfileModerationStatus.APPROVED, profile_data=None):
    import uuid
    data = profile_data or {
        "fullName": "Test Candidate",
        "gender": "Female",
        "dob": "1995-05-15",
        "occupation": "Engineer",
        "education": "B.Tech",
        "currentCity": "Mumbai",
    }
    profile = BiodataProfileModel(
        id=f"TRUE-{uuid.uuid4().hex[:8].upper()}",
        user_id=user_id,
        moderation_status=status,
        profile_data=data,
    )
    db.add(profile)
    db.flush()
    return profile


def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


# ────────────────────────────────────────────────────────────────────────────
# TEST 1 — Unauthenticated send interest → 401
# ────────────────────────────────────────────────────────────────────────────
def test_01_unauthenticated_send_interest(client, db_session):
    r = client.post("/api/v1/interests", json={"profile_id": "TRUE-NONEXIST1"})
    assert r.status_code == 401, f"Expected 401, got {r.status_code}: {r.text}"


# ────────────────────────────────────────────────────────────────────────────
# TEST 2 — Authenticated user sends interest to approved profile → 201
# ────────────────────────────────────────────────────────────────────────────
def test_02_send_interest_to_approved_profile(client, db_session):
    user_a = make_user(db_session, "a@test.com", "User A")
    user_b = make_user(db_session, "b@test.com", "User B")
    profile_b = make_profile(db_session, user_b.id)
    db_session.commit()

    token_a = make_session(db_session, user_a.id)
    db_session.commit()

    r = client.post("/api/v1/interests", json={"profile_id": profile_b.id}, headers=auth_headers(token_a))
    assert r.status_code == 201, f"Expected 201, got {r.status_code}: {r.text}"
    data = r.json()
    assert data["data"]["status"] == "PENDING"


# ────────────────────────────────────────────────────────────────────────────
# TEST 3 — Send interest to own profile → 400
# ────────────────────────────────────────────────────────────────────────────
def test_03_send_interest_to_own_profile(client, db_session):
    user_a = make_user(db_session, "a@test.com", "User A")
    profile_a = make_profile(db_session, user_a.id)
    db_session.commit()

    token_a = make_session(db_session, user_a.id)
    db_session.commit()

    r = client.post("/api/v1/interests", json={"profile_id": profile_a.id}, headers=auth_headers(token_a))
    assert r.status_code == 400, f"Expected 400, got {r.status_code}: {r.text}"


# ────────────────────────────────────────────────────────────────────────────
# TEST 4 — Send interest to DRAFT profile → 403
# ────────────────────────────────────────────────────────────────────────────
def test_04_send_interest_to_draft_profile(client, db_session):
    user_a = make_user(db_session, "a@test.com")
    user_b = make_user(db_session, "b@test.com")
    profile_b = make_profile(db_session, user_b.id, status=ProfileModerationStatus.DRAFT)
    db_session.commit()

    token_a = make_session(db_session, user_a.id)
    db_session.commit()

    r = client.post("/api/v1/interests", json={"profile_id": profile_b.id}, headers=auth_headers(token_a))
    assert r.status_code == 403, f"Expected 403, got {r.status_code}: {r.text}"


# ────────────────────────────────────────────────────────────────────────────
# TEST 5 — Send interest to SUBMITTED profile → 403
# ────────────────────────────────────────────────────────────────────────────
def test_05_send_interest_to_submitted_profile(client, db_session):
    user_a = make_user(db_session, "a@test.com")
    user_b = make_user(db_session, "b@test.com")
    profile_b = make_profile(db_session, user_b.id, status=ProfileModerationStatus.SUBMITTED)
    db_session.commit()

    token_a = make_session(db_session, user_a.id)
    db_session.commit()

    r = client.post("/api/v1/interests", json={"profile_id": profile_b.id}, headers=auth_headers(token_a))
    assert r.status_code == 403, f"Expected 403, got {r.status_code}: {r.text}"


# ────────────────────────────────────────────────────────────────────────────
# TEST 6 — Send interest to REJECTED profile → 403
# ────────────────────────────────────────────────────────────────────────────
def test_06_send_interest_to_rejected_profile(client, db_session):
    user_a = make_user(db_session, "a@test.com")
    user_b = make_user(db_session, "b@test.com")
    profile_b = make_profile(db_session, user_b.id, status=ProfileModerationStatus.REJECTED)
    db_session.commit()

    token_a = make_session(db_session, user_a.id)
    db_session.commit()

    r = client.post("/api/v1/interests", json={"profile_id": profile_b.id}, headers=auth_headers(token_a))
    assert r.status_code == 403, f"Expected 403, got {r.status_code}: {r.text}"


# ────────────────────────────────────────────────────────────────────────────
# TEST 7 — Send interest to APPROVED profile → 201
# ────────────────────────────────────────────────────────────────────────────
def test_07_send_interest_to_approved_profile(client, db_session):
    user_a = make_user(db_session, "a@test.com")
    user_b = make_user(db_session, "b@test.com")
    profile_b = make_profile(db_session, user_b.id, status=ProfileModerationStatus.APPROVED)
    db_session.commit()

    token_a = make_session(db_session, user_a.id)
    db_session.commit()

    r = client.post("/api/v1/interests", json={"profile_id": profile_b.id}, headers=auth_headers(token_a))
    assert r.status_code == 201, f"Expected 201, got {r.status_code}: {r.text}"


# ────────────────────────────────────────────────────────────────────────────
# TEST 8 — Duplicate interest returns existing state safely (200)
# ────────────────────────────────────────────────────────────────────────────
def test_08_duplicate_interest_returns_existing(client, db_session):
    user_a = make_user(db_session, "a@test.com")
    user_b = make_user(db_session, "b@test.com")
    profile_b = make_profile(db_session, user_b.id)
    db_session.commit()

    token_a = make_session(db_session, user_a.id)
    db_session.commit()

    r1 = client.post("/api/v1/interests", json={"profile_id": profile_b.id}, headers=auth_headers(token_a))
    assert r1.status_code == 201

    r2 = client.post("/api/v1/interests", json={"profile_id": profile_b.id}, headers=auth_headers(token_a))
    assert r2.status_code == 200, f"Expected 200 (existing state), got {r2.status_code}: {r2.text}"
    assert r2.json()["data"]["status"] == "PENDING"


# ────────────────────────────────────────────────────────────────────────────
# TEST 9 — Sender withdraws PENDING interest → WITHDRAWN
# ────────────────────────────────────────────────────────────────────────────
def test_09_sender_withdraws_pending(client, db_session):
    user_a = make_user(db_session, "a@test.com")
    user_b = make_user(db_session, "b@test.com")
    profile_b = make_profile(db_session, user_b.id)
    db_session.commit()

    token_a = make_session(db_session, user_a.id)
    db_session.commit()

    r = client.post("/api/v1/interests", json={"profile_id": profile_b.id}, headers=auth_headers(token_a))
    interest_id = r.json()["data"]["id"]

    r_w = client.post(f"/api/v1/interests/{interest_id}/withdraw", headers=auth_headers(token_a))
    assert r_w.status_code == 200, f"Expected 200, got {r_w.status_code}: {r_w.text}"
    assert r_w.json()["data"]["status"] == "WITHDRAWN"


# ────────────────────────────────────────────────────────────────────────────
# TEST 10 — Receiver cannot withdraw sender's interest → 403
# ────────────────────────────────────────────────────────────────────────────
def test_10_receiver_cannot_withdraw(client, db_session):
    user_a = make_user(db_session, "a@test.com")
    user_b = make_user(db_session, "b@test.com")
    profile_b = make_profile(db_session, user_b.id)
    db_session.commit()

    token_a = make_session(db_session, user_a.id)
    token_b = make_session(db_session, user_b.id)
    db_session.commit()

    r = client.post("/api/v1/interests", json={"profile_id": profile_b.id}, headers=auth_headers(token_a))
    interest_id = r.json()["data"]["id"]

    r_w = client.post(f"/api/v1/interests/{interest_id}/withdraw", headers=auth_headers(token_b))
    assert r_w.status_code == 403, f"Expected 403, got {r_w.status_code}: {r_w.text}"


# ────────────────────────────────────────────────────────────────────────────
# TEST 11 — Receiver accepts pending interest → ACCEPTED
# ────────────────────────────────────────────────────────────────────────────
def test_11_receiver_accepts_interest(client, db_session):
    user_a = make_user(db_session, "a@test.com")
    user_b = make_user(db_session, "b@test.com")
    profile_b = make_profile(db_session, user_b.id)
    db_session.commit()

    token_a = make_session(db_session, user_a.id)
    token_b = make_session(db_session, user_b.id)
    db_session.commit()

    r = client.post("/api/v1/interests", json={"profile_id": profile_b.id}, headers=auth_headers(token_a))
    interest_id = r.json()["data"]["id"]

    r_a = client.post(f"/api/v1/interests/{interest_id}/accept", headers=auth_headers(token_b))
    assert r_a.status_code == 200, f"Expected 200, got {r_a.status_code}: {r_a.text}"
    assert r_a.json()["data"]["status"] == "ACCEPTED"


# ────────────────────────────────────────────────────────────────────────────
# TEST 12 — Sender cannot accept own sent interest → 403
# ────────────────────────────────────────────────────────────────────────────
def test_12_sender_cannot_accept_own_interest(client, db_session):
    user_a = make_user(db_session, "a@test.com")
    user_b = make_user(db_session, "b@test.com")
    profile_b = make_profile(db_session, user_b.id)
    db_session.commit()

    token_a = make_session(db_session, user_a.id)
    db_session.commit()

    r = client.post("/api/v1/interests", json={"profile_id": profile_b.id}, headers=auth_headers(token_a))
    interest_id = r.json()["data"]["id"]

    r_a = client.post(f"/api/v1/interests/{interest_id}/accept", headers=auth_headers(token_a))
    assert r_a.status_code == 403, f"Expected 403, got {r_a.status_code}: {r_a.text}"


# ────────────────────────────────────────────────────────────────────────────
# TEST 13 — Receiver declines interest → DECLINED
# ────────────────────────────────────────────────────────────────────────────
def test_13_receiver_declines_interest(client, db_session):
    user_a = make_user(db_session, "a@test.com")
    user_b = make_user(db_session, "b@test.com")
    profile_b = make_profile(db_session, user_b.id)
    db_session.commit()

    token_a = make_session(db_session, user_a.id)
    token_b = make_session(db_session, user_b.id)
    db_session.commit()

    r = client.post("/api/v1/interests", json={"profile_id": profile_b.id}, headers=auth_headers(token_a))
    interest_id = r.json()["data"]["id"]

    r_d = client.post(f"/api/v1/interests/{interest_id}/decline", headers=auth_headers(token_b))
    assert r_d.status_code == 200, f"Expected 200, got {r_d.status_code}: {r_d.text}"
    assert r_d.json()["data"]["status"] == "DECLINED"


# ────────────────────────────────────────────────────────────────────────────
# TEST 14 — Sender cannot decline own sent interest → 403
# ────────────────────────────────────────────────────────────────────────────
def test_14_sender_cannot_decline_own_interest(client, db_session):
    user_a = make_user(db_session, "a@test.com")
    user_b = make_user(db_session, "b@test.com")
    profile_b = make_profile(db_session, user_b.id)
    db_session.commit()

    token_a = make_session(db_session, user_a.id)
    db_session.commit()

    r = client.post("/api/v1/interests", json={"profile_id": profile_b.id}, headers=auth_headers(token_a))
    interest_id = r.json()["data"]["id"]

    r_d = client.post(f"/api/v1/interests/{interest_id}/decline", headers=auth_headers(token_a))
    assert r_d.status_code == 403, f"Expected 403, got {r_d.status_code}: {r_d.text}"


# ────────────────────────────────────────────────────────────────────────────
# TEST 15 — Reciprocal interest → MATCHED
# A → B = PENDING, then B → A = both become MATCHED
# ────────────────────────────────────────────────────────────────────────────
def test_15_reciprocal_interest_becomes_matched(client, db_session):
    user_a = make_user(db_session, "a@test.com", "User A")
    user_b = make_user(db_session, "b@test.com", "User B")
    profile_a = make_profile(db_session, user_a.id)
    profile_b = make_profile(db_session, user_b.id)
    db_session.commit()

    token_a = make_session(db_session, user_a.id)
    token_b = make_session(db_session, user_b.id)
    db_session.commit()

    # A sends to B
    r_ab = client.post("/api/v1/interests", json={"profile_id": profile_b.id}, headers=auth_headers(token_a))
    assert r_ab.status_code == 201
    interest_ab_id = r_ab.json()["data"]["id"]
    assert r_ab.json()["data"]["status"] == "PENDING"

    # B sends to A (reciprocal)
    r_ba = client.post("/api/v1/interests", json={"profile_id": profile_a.id}, headers=auth_headers(token_b))
    assert r_ba.status_code == 201, f"Expected 201, got {r_ba.status_code}: {r_ba.text}"
    assert r_ba.json()["data"]["status"] == "MATCHED"

    # Verify original A→B interest is also MATCHED in the DB
    db_session.expire_all()
    original = db_session.scalar(select(InterestModel).where(InterestModel.id == interest_ab_id))
    assert original is not None
    assert original.status == InterestStatus.MATCHED, f"A→B interest should be MATCHED, got {original.status}"


# ────────────────────────────────────────────────────────────────────────────
# TEST 16 — User shortlists approved profile → 201
# ────────────────────────────────────────────────────────────────────────────
def test_16_shortlist_approved_profile(client, db_session):
    user_a = make_user(db_session, "a@test.com")
    user_b = make_user(db_session, "b@test.com")
    profile_b = make_profile(db_session, user_b.id)
    db_session.commit()

    token_a = make_session(db_session, user_a.id)
    db_session.commit()

    r = client.post("/api/v1/shortlists", json={"profile_id": profile_b.id}, headers=auth_headers(token_a))
    assert r.status_code == 201, f"Expected 201, got {r.status_code}: {r.text}"


# ────────────────────────────────────────────────────────────────────────────
# TEST 17 — Duplicate shortlist → 200 (returns existing)
# ────────────────────────────────────────────────────────────────────────────
def test_17_duplicate_shortlist_returns_200(client, db_session):
    user_a = make_user(db_session, "a@test.com")
    user_b = make_user(db_session, "b@test.com")
    profile_b = make_profile(db_session, user_b.id)
    db_session.commit()

    token_a = make_session(db_session, user_a.id)
    db_session.commit()

    client.post("/api/v1/shortlists", json={"profile_id": profile_b.id}, headers=auth_headers(token_a))
    r2 = client.post("/api/v1/shortlists", json={"profile_id": profile_b.id}, headers=auth_headers(token_a))
    assert r2.status_code == 200, f"Expected 200, got {r2.status_code}: {r2.text}"


# ────────────────────────────────────────────────────────────────────────────
# TEST 18 — User shortlists own profile → 400
# ────────────────────────────────────────────────────────────────────────────
def test_18_shortlist_own_profile_rejected(client, db_session):
    user_a = make_user(db_session, "a@test.com")
    profile_a = make_profile(db_session, user_a.id)
    db_session.commit()

    token_a = make_session(db_session, user_a.id)
    db_session.commit()

    r = client.post("/api/v1/shortlists", json={"profile_id": profile_a.id}, headers=auth_headers(token_a))
    assert r.status_code == 400, f"Expected 400, got {r.status_code}: {r.text}"


# ────────────────────────────────────────────────────────────────────────────
# TEST 19 — Remove from shortlist → 200
# ────────────────────────────────────────────────────────────────────────────
def test_19_remove_shortlist(client, db_session):
    user_a = make_user(db_session, "a@test.com")
    user_b = make_user(db_session, "b@test.com")
    profile_b = make_profile(db_session, user_b.id)
    db_session.commit()

    token_a = make_session(db_session, user_a.id)
    db_session.commit()

    client.post("/api/v1/shortlists", json={"profile_id": profile_b.id}, headers=auth_headers(token_a))
    r = client.delete(f"/api/v1/shortlists/{profile_b.id}", headers=auth_headers(token_a))
    assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text}"

    # Verify it's gone from DB
    db_session.expire_all()
    entry = db_session.scalar(
        select(ShortlistModel)
        .where(ShortlistModel.user_id == user_a.id)
        .where(ShortlistModel.profile_id == profile_b.id)
    )
    assert entry is None


# ────────────────────────────────────────────────────────────────────────────
# TEST 20 — Shortlist persists in DB (not just in memory)
# ────────────────────────────────────────────────────────────────────────────
def test_20_shortlist_persists_in_db(client, db_session):
    user_a = make_user(db_session, "a@test.com")
    user_b = make_user(db_session, "b@test.com")
    profile_b = make_profile(db_session, user_b.id)
    db_session.commit()

    token_a = make_session(db_session, user_a.id)
    db_session.commit()

    r = client.post("/api/v1/shortlists", json={"profile_id": profile_b.id}, headers=auth_headers(token_a))
    assert r.status_code == 201

    db_session.expire_all()
    entry = db_session.scalar(
        select(ShortlistModel)
        .where(ShortlistModel.user_id == user_a.id)
        .where(ShortlistModel.profile_id == profile_b.id)
    )
    assert entry is not None, "Shortlist entry not found in DB"
    assert entry.profile_id == profile_b.id


# ────────────────────────────────────────────────────────────────────────────
# TEST 21 — A sends interest → B receives INTEREST_RECEIVED notification
# ────────────────────────────────────────────────────────────────────────────
def test_21_interest_creates_notification(client, db_session):
    user_a = make_user(db_session, "a@test.com", "User A")
    user_b = make_user(db_session, "b@test.com", "User B")
    profile_b = make_profile(db_session, user_b.id)
    db_session.commit()

    token_a = make_session(db_session, user_a.id)
    token_b = make_session(db_session, user_b.id)
    db_session.commit()

    client.post("/api/v1/interests", json={"profile_id": profile_b.id}, headers=auth_headers(token_a))

    db_session.expire_all()
    notif = db_session.scalar(
        select(NotificationModel)
        .where(NotificationModel.user_id == user_b.id)
        .where(NotificationModel.type == NotificationType.INTEREST_RECEIVED)
    )
    assert notif is not None, "INTEREST_RECEIVED notification not found for recipient"
    assert notif.is_read == False


# ────────────────────────────────────────────────────────────────────────────
# TEST 22 — B accepts → A receives INTEREST_ACCEPTED notification
# ────────────────────────────────────────────────────────────────────────────
def test_22_accept_creates_notification(client, db_session):
    user_a = make_user(db_session, "a@test.com")
    user_b = make_user(db_session, "b@test.com")
    profile_b = make_profile(db_session, user_b.id)
    db_session.commit()

    token_a = make_session(db_session, user_a.id)
    token_b = make_session(db_session, user_b.id)
    db_session.commit()

    r = client.post("/api/v1/interests", json={"profile_id": profile_b.id}, headers=auth_headers(token_a))
    interest_id = r.json()["data"]["id"]
    client.post(f"/api/v1/interests/{interest_id}/accept", headers=auth_headers(token_b))

    db_session.expire_all()
    notif = db_session.scalar(
        select(NotificationModel)
        .where(NotificationModel.user_id == user_a.id)
        .where(NotificationModel.type == NotificationType.INTEREST_ACCEPTED)
    )
    assert notif is not None, "INTEREST_ACCEPTED notification not found for sender"


# ────────────────────────────────────────────────────────────────────────────
# TEST 23 — B declines → A receives INTEREST_DECLINED notification
# ────────────────────────────────────────────────────────────────────────────
def test_23_decline_creates_notification(client, db_session):
    user_a = make_user(db_session, "a@test.com")
    user_b = make_user(db_session, "b@test.com")
    profile_b = make_profile(db_session, user_b.id)
    db_session.commit()

    token_a = make_session(db_session, user_a.id)
    token_b = make_session(db_session, user_b.id)
    db_session.commit()

    r = client.post("/api/v1/interests", json={"profile_id": profile_b.id}, headers=auth_headers(token_a))
    interest_id = r.json()["data"]["id"]
    client.post(f"/api/v1/interests/{interest_id}/decline", headers=auth_headers(token_b))

    db_session.expire_all()
    notif = db_session.scalar(
        select(NotificationModel)
        .where(NotificationModel.user_id == user_a.id)
        .where(NotificationModel.type == NotificationType.INTEREST_DECLINED)
    )
    assert notif is not None, "INTEREST_DECLINED notification not found for sender"


# ────────────────────────────────────────────────────────────────────────────
# TEST 24 — User can only access own notifications
# ────────────────────────────────────────────────────────────────────────────
def test_24_user_can_only_access_own_notifications(client, db_session):
    user_a = make_user(db_session, "a@test.com", "User A")
    user_b = make_user(db_session, "b@test.com", "User B")
    profile_b = make_profile(db_session, user_b.id)
    db_session.commit()

    token_a = make_session(db_session, user_a.id)
    token_b = make_session(db_session, user_b.id)
    db_session.commit()

    # A sends interest, creating a notification for B
    client.post("/api/v1/interests", json={"profile_id": profile_b.id}, headers=auth_headers(token_a))

    # A fetches notifications — should be empty (A got no notification yet)
    r_a = client.get("/api/v1/notifications", headers=auth_headers(token_a))
    assert r_a.status_code == 200
    # A has no notifications at this point
    assert r_a.json()["total"] == 0

    # B fetches notifications — should see the INTEREST_RECEIVED
    r_b = client.get("/api/v1/notifications", headers=auth_headers(token_b))
    assert r_b.status_code == 200
    assert r_b.json()["total"] == 1
    assert r_b.json()["data"][0]["type"] == "INTEREST_RECEIVED"


# ────────────────────────────────────────────────────────────────────────────
# TEST 25 — Mark notification as read
# ────────────────────────────────────────────────────────────────────────────
def test_25_mark_notification_read(client, db_session):
    user_a = make_user(db_session, "a@test.com")
    user_b = make_user(db_session, "b@test.com")
    profile_b = make_profile(db_session, user_b.id)
    db_session.commit()

    token_a = make_session(db_session, user_a.id)
    token_b = make_session(db_session, user_b.id)
    db_session.commit()

    client.post("/api/v1/interests", json={"profile_id": profile_b.id}, headers=auth_headers(token_a))

    r_notifs = client.get("/api/v1/notifications", headers=auth_headers(token_b))
    notif_id = r_notifs.json()["data"][0]["id"]

    r_read = client.patch(f"/api/v1/notifications/{notif_id}/read", headers=auth_headers(token_b))
    assert r_read.status_code == 200

    # Verify is_read in DB
    db_session.expire_all()
    notif = db_session.scalar(select(NotificationModel).where(NotificationModel.id == notif_id))
    assert notif.is_read == True


# ────────────────────────────────────────────────────────────────────────────
# TEST 26 — Approved target can receive interest
# ────────────────────────────────────────────────────────────────────────────
def test_26_approved_profile_can_receive_interest(client, db_session):
    user_a = make_user(db_session, "a@test.com")
    user_b = make_user(db_session, "b@test.com")
    profile_b = make_profile(db_session, user_b.id, status=ProfileModerationStatus.APPROVED)
    db_session.commit()

    token_a = make_session(db_session, user_a.id)
    db_session.commit()

    r = client.post("/api/v1/interests", json={"profile_id": profile_b.id}, headers=auth_headers(token_a))
    assert r.status_code == 201


# ────────────────────────────────────────────────────────────────────────────
# TEST 27 — Approved profile becomes SUBMITTED → new interest blocked
# ────────────────────────────────────────────────────────────────────────────
def test_27_unapproved_profile_blocks_new_interest(client, db_session):
    user_a = make_user(db_session, "a@test.com")
    user_b = make_user(db_session, "b@test.com")
    profile_b = make_profile(db_session, user_b.id, status=ProfileModerationStatus.APPROVED)
    db_session.commit()

    # Now demote to SUBMITTED (simulating profile edit)
    profile_b.moderation_status = ProfileModerationStatus.SUBMITTED
    db_session.commit()

    token_a = make_session(db_session, user_a.id)
    db_session.commit()

    r = client.post("/api/v1/interests", json={"profile_id": profile_b.id}, headers=auth_headers(token_a))
    assert r.status_code == 403, f"Expected 403, got {r.status_code}: {r.text}"


# ────────────────────────────────────────────────────────────────────────────
# TEST 28 — Private moderation information never exposed in interest response
# ────────────────────────────────────────────────────────────────────────────
def test_28_no_private_data_in_interest_response(client, db_session):
    user_a = make_user(db_session, "a@test.com")
    user_b = make_user(db_session, "b@test.com")
    profile_b = make_profile(db_session, user_b.id)
    db_session.commit()

    token_a = make_session(db_session, user_a.id)
    db_session.commit()

    r = client.post("/api/v1/interests", json={"profile_id": profile_b.id}, headers=auth_headers(token_a))
    assert r.status_code in (200, 201)
    body = r.text.lower()

    FORBIDDEN_FIELDS = [
        "password", "email", "phone", "otp", "token", "hash",
        "smtp", "secret", "rejection_reason", "reviewed_by",
        "moderation_status", "session"
    ]
    for field in FORBIDDEN_FIELDS:
        assert field not in body, f"Private field '{field}' found in interest response!"


# ────────────────────────────────────────────────────────────────────────────
# TEST 29 — Inspect sent interests list — no private data
# ────────────────────────────────────────────────────────────────────────────
def test_29_no_private_data_in_sent_interests(client, db_session):
    user_a = make_user(db_session, "a@test.com")
    user_b = make_user(db_session, "b@test.com")
    profile_b = make_profile(db_session, user_b.id)
    db_session.commit()

    token_a = make_session(db_session, user_a.id)
    db_session.commit()

    client.post("/api/v1/interests", json={"profile_id": profile_b.id}, headers=auth_headers(token_a))
    r = client.get("/api/v1/interests/sent", headers=auth_headers(token_a))
    assert r.status_code == 200
    body = r.text.lower()

    FORBIDDEN_FIELDS = ["password", "otp", "token_hash", "smtp", "secret", "rejection_reason", "reviewed_by"]
    for field in FORBIDDEN_FIELDS:
        assert field not in body, f"Private field '{field}' found in sent interests response!"


# ────────────────────────────────────────────────────────────────────────────
# TEST 30 — Shortlist response has no private data
# ────────────────────────────────────────────────────────────────────────────
def test_30_no_private_data_in_shortlist_response(client, db_session):
    user_a = make_user(db_session, "a@test.com")
    user_b = make_user(db_session, "b@test.com")
    profile_b = make_profile(db_session, user_b.id)
    db_session.commit()

    token_a = make_session(db_session, user_a.id)
    db_session.commit()

    client.post("/api/v1/shortlists", json={"profile_id": profile_b.id}, headers=auth_headers(token_a))
    r = client.get("/api/v1/shortlists", headers=auth_headers(token_a))
    assert r.status_code == 200
    body = r.text.lower()

    FORBIDDEN_FIELDS = ["password", "otp", "token_hash", "smtp", "secret", "rejection_reason", "reviewed_by"]
    for field in FORBIDDEN_FIELDS:
        assert field not in body, f"Private field '{field}' found in shortlist response!"
