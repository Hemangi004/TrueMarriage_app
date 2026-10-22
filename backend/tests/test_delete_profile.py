import pytest
from backend.models.user import User, UserRole, UserStatus
from backend.models.biodata import BiodataProfileModel
from backend.models.interest import InterestModel
from backend.models.shortlist import ShortlistModel
from backend.models.enums import InterestStatus
from backend.core.security import get_password_hash
from backend.tests.test_final_ux_consistency import db_engine, client

def test_delete_profile_with_interests_and_shortlists(client, db_engine):
    from sqlalchemy.orm import sessionmaker
    SessionLocal = sessionmaker(bind=db_engine)
    db = SessionLocal()

    # User 1 (will be deleted)
    u1 = User(
        email="u1@example.com",
        full_name="User One",
        password_hash=get_password_hash("Password123!"),
        role=UserRole.USER,
        status=UserStatus.ACTIVE,
        is_email_verified=True,
    )
    # User 2
    u2 = User(
        email="u2@example.com",
        full_name="User Two",
        password_hash=get_password_hash("Password123!"),
        role=UserRole.USER,
        status=UserStatus.ACTIVE,
        is_email_verified=True,
    )
    db.add_all([u1, u2])
    db.commit()
    db.refresh(u1)
    db.refresh(u2)

    # Profile for u1
    p1 = BiodataProfileModel(
        user_id=u1.id,
        profile_data={"name": "User One", "gender": "Male"}
    )
    # Profile for u2
    p2 = BiodataProfileModel(
        user_id=u2.id,
        profile_data={"name": "User Two", "gender": "Female"}
    )
    db.add_all([p1, p2])
    db.commit()
    db.refresh(p1)
    db.refresh(p2)

    # u1 sends interest to u2
    i1 = InterestModel(
        sender_user_id=u1.id,
        receiver_user_id=u2.id,
        sender_profile_id=p1.id,
        receiver_profile_id=p2.id,
        status=InterestStatus.PENDING
    )
    # u2 shortlists u1
    s1 = ShortlistModel(
        user_id=u2.id,
        profile_id=p1.id
    )
    db.add_all([i1, s1])
    db.commit()
    db.close()

    # Login as User 1
    login_res = client.post("/api/v1/auth/login", json={"email": "u1@example.com", "password": "Password123!"})
    assert login_res.status_code == 200

    # Delete profile
    del_res = client.request("DELETE", "/api/v1/biodata/me", json={"reason": "I found a partner"})
    print("DELETE STATUS:", del_res.status_code)
    print("DELETE BODY:", del_res.text)
    assert del_res.status_code == 200


def test_admin_delete_user_and_biodata_in_one_go(client, db_engine):
    from sqlalchemy.orm import sessionmaker
    from sqlalchemy import select
    from backend.models.notification import NotificationModel, NotificationType
    SessionLocal = sessionmaker(bind=db_engine)
    db = SessionLocal()

    # Admin user
    admin = User(
        email="admin_del_test@example.com",
        full_name="Admin Delete Tester",
        password_hash=get_password_hash("AdminPass123!"),
        role=UserRole.ADMIN,
        status=UserStatus.ACTIVE,
        is_email_verified=True,
    )
    # Target user to delete
    victim = User(
        email="victim_user@example.com",
        full_name="Victim User",
        password_hash=get_password_hash("VictimPass123!"),
        role=UserRole.USER,
        status=UserStatus.ACTIVE,
        is_email_verified=True,
    )
    # Another user
    other = User(
        email="other_del_user@example.com",
        full_name="Other User",
        password_hash=get_password_hash("OtherPass123!"),
        role=UserRole.USER,
        status=UserStatus.ACTIVE,
        is_email_verified=True,
    )
    db.add_all([admin, victim, other])
    db.commit()
    db.refresh(admin)
    db.refresh(victim)
    db.refresh(other)

    victim_id = victim.id
    other_id = other.id

    # Profile for victim
    victim_profile = BiodataProfileModel(
        user_id=victim_id,
        profile_data={"fullName": "Victim User", "gender": "Female"}
    )
    other_profile = BiodataProfileModel(
        user_id=other_id,
        profile_data={"fullName": "Other User", "gender": "Male"}
    )
    db.add_all([victim_profile, other_profile])
    db.commit()
    db.refresh(victim_profile)
    db.refresh(other_profile)

    v_prof_id = victim_profile.id
    o_prof_id = other_profile.id

    # Add interest between other and victim
    interest = InterestModel(
        sender_user_id=other_id,
        receiver_user_id=victim_id,
        sender_profile_id=o_prof_id,
        receiver_profile_id=v_prof_id,
        status=InterestStatus.PENDING,
    )
    # Add shortlist
    shortlist = ShortlistModel(
        user_id=other_id,
        profile_id=v_prof_id,
    )
    # Add notification
    notif = NotificationModel(
        user_id=victim_id,
        type=NotificationType.INTEREST_RECEIVED,
        title="New interest",
        message="Someone expressed interest",
        related_entity_id=v_prof_id,
    )
    db.add_all([interest, shortlist, notif])
    db.commit()
    db.close()

    # Login as Admin
    login_res = client.post("/api/v1/auth/login", json={"email": "admin_del_test@example.com", "password": "AdminPass123!"})
    assert login_res.status_code == 200

    # Call Admin Delete User API
    del_res = client.delete(f"/api/v1/admin/users/{victim_id}")
    assert del_res.status_code == 200
    data = del_res.json()
    assert data["success"] is True

    # Verify both User and BiodataProfile are completely gone in one go
    db_verify = SessionLocal()
    deleted_user = db_verify.scalar(select(User).where(User.id == victim_id))
    assert deleted_user is None, "User account should be deleted"

    deleted_bio = db_verify.scalar(select(BiodataProfileModel).where(BiodataProfileModel.id == v_prof_id))
    assert deleted_bio is None, "Biodata profile should be deleted"

    # Verify interest referencing the deleted user is cleaned up
    remaining_interests = db_verify.scalars(
        select(InterestModel).where(
            (InterestModel.sender_user_id == victim_id) | (InterestModel.receiver_user_id == victim_id)
        )
    ).all()
    assert len(remaining_interests) == 0

    # Verify shortlist referencing the deleted profile is cleaned up
    remaining_shortlists = db_verify.scalars(
        select(ShortlistModel).where(ShortlistModel.profile_id == v_prof_id)
    ).all()
    assert len(remaining_shortlists) == 0

    db_verify.close()

