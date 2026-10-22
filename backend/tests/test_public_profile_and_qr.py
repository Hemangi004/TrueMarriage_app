import pytest
import uuid
import tempfile
import os
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.db.base import Base
from backend.db.session import get_db
from backend.dependencies.auth import get_current_user
from backend.main import app
from backend.models.user import User
from backend.models.biodata import BiodataProfileModel
from backend.models.enums import UserRole, UserStatus, ProfileModerationStatus
from backend.services.discovery_service import (
    generate_unique_slug,
    extract_public_profile_dict,
    get_public_profile_by_slug_or_id,
    record_profile_view,
    get_profile_analytics_summary,
    update_profile_privacy_settings,
    list_discoverable_profiles,
)

# Import all models to register metadata
import backend.models.user  # noqa
import backend.models.otp  # noqa
import backend.models.session  # noqa
import backend.models.biodata  # noqa
import backend.models.setting  # noqa
import backend.models.audit_log  # noqa
import backend.models.interest  # noqa
import backend.models.shortlist  # noqa
import backend.models.notification  # noqa
import backend.models.profile_analytics  # noqa


@pytest.fixture(scope="function")
def db_engine():
    tmp = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
    tmp.close()
    db_url = f"sqlite:///{tmp.name}"

    engine = create_engine(db_url, connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    yield engine
    engine.dispose()
    try:
        os.unlink(tmp.name)
    except Exception:
        pass


@pytest.fixture(scope="function")
def db_session(db_engine):
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=db_engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture(scope="function")
def client(db_engine):
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=db_engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


def test_public_profile_slug_and_analytics_flow(db_session, client):
    # Create User
    user = User(
        id=str(uuid.uuid4()),
        email="virendra@example.com",
        full_name="Virendra Patil",
        role=UserRole.USER,
        status=UserStatus.ACTIVE,
    )
    db_session.add(user)
    db_session.commit()

    # Generate unique slug
    slug = generate_unique_slug(db_session, "Virendra Patil")
    assert slug == "virendra-patil"

    # Create Approved Biodata Profile
    profile = BiodataProfileModel(
        id="TRUE-VP123456",
        user_id=user.id,
        slug=slug,
        moderation_status=ProfileModerationStatus.APPROVED,
        profile_data={
            "fullName": "Virendra Patil",
            "age": 28,
            "gender": "Male",
            "occupation": "Software Engineer",
            "currentCity": "Pune",
            "phone": "+919876543210",
            "email": "virendra@example.com",
        },
        is_password_protected=False,
        hide_contact_details=False,
    )
    db_session.add(profile)
    db_session.commit()

    # 1. Unauthenticated Visitor Lookup -> 401 Unauthorized (Login required!)
    res_unauth = client.get(f"/api/v1/public/profiles/{slug}")
    assert res_unauth.status_code == 401

    # Authenticated Member Lookup by Slug -> 200 OK
    app.dependency_overrides[get_current_user] = lambda: user
    res = client.get(f"/api/v1/public/profiles/{slug}")
    assert res.status_code == 200
    data = res.json()
    assert data["display_name"] == "Virendra Patil"
    assert data["slug"] == "virendra-patil"
    assert data["contact_details"]["phone"] == "+919876543210"

    # 2. Track QR Scan Event
    track_res = client.post(
        f"/api/v1/public/profiles/{slug}/track-view",
        json={"source": "qr_scan"}
    )
    assert track_res.status_code == 200
    assert track_res.json()["success"] is True

    # Track Direct View Event
    client.post(f"/api/v1/public/profiles/{slug}/track-view", json={"source": "direct"})

    # 3. Analytics Check via Service
    analytics = get_profile_analytics_summary(db_session, profile.id)
    assert analytics["total_views"] == 2
    assert analytics["qr_scans"] == 1
    assert analytics["direct_views"] == 1

    # 4. Password Protection Test
    success, msg, updated = update_profile_privacy_settings(
        db_session, profile.id, user.id, is_password_protected=True, passcode="1234"
    )
    assert success is True
    assert updated.is_password_protected is True

    # Another visitor tries to fetch without passcode -> should return locked profile
    viewer_user = User(
        id=str(uuid.uuid4()),
        email="viewer@example.com",
        full_name="Viewer User",
        role=UserRole.USER,
        status=UserStatus.ACTIVE,
    )
    db_session.add(viewer_user)
    db_session.commit()
    app.dependency_overrides[get_current_user] = lambda: viewer_user

    res_locked = client.get(f"/api/v1/public/profiles/{slug}")
    assert res_locked.status_code == 200
    data_locked = res_locked.json()
    assert data_locked["is_locked"] is True

    # Verify Passcode -> should unlock profile
    verify_res = client.post(
        f"/api/v1/public/profiles/{slug}/verify-passcode",
        json={"passcode": "1234"}
    )
    assert verify_res.status_code == 200
    assert verify_res.json()["is_locked"] is False

    # 5. Hide Contact Details Test
    update_profile_privacy_settings(
        db_session, profile.id, user.id, is_password_protected=False, hide_contact_details=True
    )
    res_hidden = client.get(f"/api/v1/public/profiles/{slug}")
    assert res_hidden.status_code == 200
    assert res_hidden.json()["contact_details"] is None


def test_discovery_profiles_without_photo_returned(db_session, client):
    # Viewer User with gender
    viewer = User(
        id=str(uuid.uuid4()),
        email="female.viewer@example.com",
        full_name="Pooja Sharma",
        role=UserRole.USER,
        status=UserStatus.ACTIVE,
    )
    db_session.add(viewer)
    db_session.commit()

    viewer_profile = BiodataProfileModel(
        id="TRUE-POOJA123",
        user_id=viewer.id,
        slug="pooja-sharma",
        moderation_status=ProfileModerationStatus.APPROVED,
        profile_data={
            "fullName": "Pooja Sharma",
            "gender": "Female",
            "age": 26,
        },
    )
    db_session.add(viewer_profile)
    db_session.commit()

    # Candidate profile with NO photo
    candidate_user = User(
        id=str(uuid.uuid4()),
        email="nophoto.candidate@example.com",
        full_name="Rahul Verma",
        role=UserRole.USER,
        status=UserStatus.ACTIVE,
    )
    db_session.add(candidate_user)
    db_session.commit()

    candidate_profile = BiodataProfileModel(
        id="TRUE-RAHUL999",
        user_id=candidate_user.id,
        slug="rahul-verma",
        moderation_status=ProfileModerationStatus.APPROVED,
        profile_data={
            "fullName": "Rahul Verma",
            "gender": "Male",
            "age": 29,
            "currentCity": "Mumbai",
            "occupation": "Financial Analyst",
            # Note: No profilePictureUrl, photoUrl, or photo provided!
        },
    )
    db_session.add(candidate_profile)
    db_session.commit()

    # 1. Direct discovery service check
    profiles, total, pages = list_discoverable_profiles(
        db=db_session,
        current_user_id=viewer.id,
    )
    assert total >= 1
    found = [p for p in profiles if p["id"] == "TRUE-RAHUL999"]
    assert len(found) == 1
    assert found[0]["display_name"] == "Rahul Verma"
    assert found[0]["profile_picture_url"] is None

    # 2. HTTP endpoint check with authenticated user
    app.dependency_overrides[get_current_user] = lambda: viewer
    res = client.get("/api/v1/discovery/profiles")
    assert res.status_code == 200
    res_data = res.json()
    assert res_data["success"] is True
    http_found = [p for p in res_data["data"] if p["id"] == "TRUE-RAHUL999"]
    assert len(http_found) == 1
    assert http_found[0]["profile_picture_url"] is None

