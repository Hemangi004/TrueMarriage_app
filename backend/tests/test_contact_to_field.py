import pytest
from backend.models.biodata import BiodataProfileModel
from backend.models.user import User
from backend.models.enums import ProfileModerationStatus, UserRole, UserStatus
from backend.services.discovery_service import extract_public_profile_dict


def test_contact_to_priority_in_public_profile():
    # User with private account phone
    user = User(
        id="user-123",
        email="testuser@example.com",
        phone="9999900000",
        full_name="Rajesh Sharma",
        role=UserRole.USER,
        status=UserStatus.ACTIVE
    )

    # BiodataProfile with contactTo (public contact number) and primary contactNumber
    profile = BiodataProfileModel(
        id="prof-123",
        user_id=user.id,
        user=user,
        slug="rajesh-sharma",
        moderation_status=ProfileModerationStatus.APPROVED,
        is_completed=True,
        hide_contact_details=False,
        profile_data={
            "fullName": "Rajesh Sharma",
            "gender": "Male",
            "age": 28,
            "contactNumber": "9888877777",
            "contactTo": "9123456780",
            "email": "rajesh.public@example.com"
        }
    )

    # When contacts are included and profile.hide_contact_details is False
    data = extract_public_profile_dict(profile, include_contacts=True)

    assert data["contact_to"] == "9123456780"
    assert data["contactTo"] == "9123456780"
    assert data["phone"] == "9123456780"
    assert data["contact_details"]["contact_to"] == "9123456780"
    assert data["contact_details"]["phone"] == "9123456780"
    # Ensure private user.phone is not leaked
    assert data["phone"] != user.phone


def test_contact_to_hidden_when_privacy_enabled():
    user = User(
        id="user-456",
        email="privateuser@example.com",
        phone="9999900000",
        full_name="Pooja Verma",
        role=UserRole.USER,
        status=UserStatus.ACTIVE
    )

    profile = BiodataProfileModel(
        id="prof-456",
        user_id=user.id,
        user=user,
        slug="pooja-verma",
        moderation_status=ProfileModerationStatus.APPROVED,
        is_completed=True,
        hide_contact_details=True,
        profile_data={
            "fullName": "Pooja Verma",
            "gender": "Female",
            "age": 26,
            "contactTo": "9876543210",
        }
    )

    data = extract_public_profile_dict(profile, include_contacts=True)

    assert data["contact_details"] is None
    assert data["contact_to"] is None
    assert data["contactTo"] is None
    assert data["phone"] is None
