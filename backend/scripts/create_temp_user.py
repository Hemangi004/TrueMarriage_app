import argparse
import random
import uuid
from datetime import datetime, timezone
from typing import Optional
import requests
from sqlalchemy.orm import Session
from backend.db.session import SessionLocal
from backend.models.user import User, UserAuthIdentity
from backend.models.biodata import BiodataProfileModel
from backend.models.enums import UserRole, UserStatus, AuthProvider, ProfileModerationStatus
from backend.core.security import get_password_hash


def generate_unique_phone(db: Session) -> str:
    while True:
        phone = f"+91 9{random.randint(100000000, 999999999)}"
        if not db.query(User).filter(User.phone == phone).first():
            return phone


def create_or_update_temp_user(
    email: str = "tempuser@truemarriage.com",
    password: str = "TempUser@123",
    full_name: str = "Rahul Sharma",
    gender: str = "Male",
    role: str = "USER",
    phone: Optional[str] = None
) -> dict:
    normalized_email = email.strip().lower()
    user_role = UserRole.ADMIN if role.upper() == "ADMIN" else UserRole.USER
    db: Session = SessionLocal()

    try:
        user = db.query(User).filter(User.email == normalized_email).first()
        is_new = False

        if not user:
            is_new = True
            assigned_phone = phone or generate_unique_phone(db)
            user = User(
                id=f"user_{uuid.uuid4().hex[:12]}",
                email=normalized_email,
                full_name=full_name,
                password_hash=get_password_hash(password),
                role=user_role,
                status=UserStatus.ACTIVE,
                is_email_verified=True,
                phone=assigned_phone,
                is_phone_verified=True,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc)
            )
            db.add(user)
            db.flush()

            identity = UserAuthIdentity(
                id=str(uuid.uuid4()),
                user_id=user.id,
                provider=AuthProvider.LOCAL
            )
            db.add(identity)
        else:
            user.full_name = full_name
            user.password_hash = get_password_hash(password)
            user.role = user_role
            user.status = UserStatus.ACTIVE
            user.is_email_verified = True
            if phone:
                user.phone = phone
            elif not user.phone:
                user.phone = generate_unique_phone(db)
            user.is_phone_verified = True
            user.updated_at = datetime.now(timezone.utc)

            local_id = db.query(UserAuthIdentity).filter(
                UserAuthIdentity.user_id == user.id,
                UserAuthIdentity.provider == AuthProvider.LOCAL
            ).first()
            if not local_id:
                identity = UserAuthIdentity(
                    id=str(uuid.uuid4()),
                    user_id=user.id,
                    provider=AuthProvider.LOCAL
                )
                db.add(identity)

        existing_bio = db.query(BiodataProfileModel).filter(BiodataProfileModel.user_id == user.id).first()
        profile_data = {
            "fullName": full_name,
            "dob": "1998-06-15",
            "gender": gender,
            "height": "5' 10\" (178 cm)" if gender.lower() == "male" else "5' 5\" (165 cm)",
            "currentCity": "Mumbai",
            "city": "Mumbai",
            "state": "Maharashtra",
            "religion": "Hindu",
            "caste": "Brahmin",
            "motherTongue": "Hindi",
            "maritalStatus": "Never Married",
            "education": "B.Tech in Computer Science",
            "college": "IIT Bombay",
            "occupation": "Senior Software Engineer",
            "company": "Tech Corp",
            "annualIncome": "35 LPA",
            "nativePlace": "Jaipur, Rajasthan",
            "aboutMe": "Friendly, ambitious, and grounded person who loves travel, reading, and exploring good coffee spots.",
            "partnerExpectations": "Looking for an understanding, educated, and cheerful partner who values personal growth and family relationships.",
            "profilePictureUrl": (
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80"
                if gender.lower() == "male"
                else "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
            ),
            "familyType": "Nuclear Family",
            "familyValues": "Moderate",
            "fatherOccupation": "Business Owner",
            "motherOccupation": "Homemaker",
            "siblings": "1 Younger Sibling",
            "diet": "Vegetarian",
            "smoking": "No",
            "drinking": "Socially",
            "fitness": "Gym & Running",
            "interests": ["Tech", "Photography", "Travelling", "Badminton"]
        }

        if not existing_bio:
            bio = BiodataProfileModel(
                id=f"bio_{uuid.uuid4().hex[:12]}",
                user_id=user.id,
                slug=f"{normalized_email.split('@')[0]}-{uuid.uuid4().hex[:6]}",
                status="PUBLISHED",
                moderation_status=ProfileModerationStatus.APPROVED,
                profile_data=profile_data,
                published_at=datetime.now(timezone.utc),
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc)
            )
            db.add(bio)
        else:
            existing_bio.status = "PUBLISHED"
            existing_bio.moderation_status = ProfileModerationStatus.APPROVED
            existing_bio.profile_data = profile_data
            existing_bio.published_at = datetime.now(timezone.utc)
            existing_bio.updated_at = datetime.now(timezone.utc)

        db.commit()
        db.refresh(user)

        action_str = "Created new" if is_new else "Updated existing"
        print(f"[{action_str.upper()}] Temp User:")
        print(f"  - User ID:  {user.id}")
        print(f"  - Email:    {user.email}")
        print(f"  - Password: {password}")
        print(f"  - Name:     {user.full_name}")
        print(f"  - Phone:    {user.phone}")
        print(f"  - Role:     {user.role.value}")
        print(f"  - Status:   {user.status.value}")
        print(f"  - Verified: Email={user.is_email_verified}, Phone={user.is_phone_verified}")

        return {
            "id": user.id,
            "email": user.email,
            "password": password,
            "full_name": user.full_name,
            "role": user.role.value,
            "status": user.status.value,
            "is_new": is_new
        }
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()


def test_login(email: str, password: str, base_url: str = "http://localhost:5000"):
    try:
        resp = requests.post(
            f"{base_url}/api/auth/login",
            json={"email": email, "password": password},
            timeout=5
        )
        if resp.status_code == 200:
            print(f"[VERIFIED] Successful login via API: {resp.status_code}")
            return True
        else:
            print(f"[WARNING] API login returned {resp.status_code}: {resp.text}")
            return False
    except Exception as ex:
        print(f"[INFO] Backend API test skipped or unreachable: {ex}")
        return None


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Create or reset a temporary user for TrueMarriage")
    parser.add_argument("--email", default="tempuser@truemarriage.com", help="Email for temp user")
    parser.add_argument("--password", default="TempUser@123", help="Password for temp user")
    parser.add_argument("--name", default="Rahul Sharma", help="Full name")
    parser.add_argument("--gender", default="Male", help="Gender")
    parser.add_argument("--role", default="USER", choices=["USER", "ADMIN"], help="User role")
    parser.add_argument("--phone", default=None, help="Phone number (optional, random generated if omitted)")

    args = parser.parse_args()
    user_info = create_or_update_temp_user(
        email=args.email,
        password=args.password,
        full_name=args.name,
        gender=args.gender,
        role=args.role,
        phone=args.phone
    )
    test_login(args.email, args.password)
