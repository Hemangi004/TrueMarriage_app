import sys
import uuid
from datetime import datetime, timezone
from pathlib import Path

# Ensure project root is in sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from backend.db.session import SessionLocal
from backend.models.user import User
from backend.models.biodata import BiodataProfileModel
from backend.models.enums import UserRole, UserStatus, ProfileModerationStatus
from backend.core.security import get_password_hash

TEST_ACCOUNTS = [
    {
        "email": "razorpay.test@truemarriage.in",
        "password": "Razorpay@2026",
        "name": "Aditya Sharma",
        "phone": "+91 9876543210",
        "slug": "aditya-sharma-senior-architect",
        "gender": "Male",
        "dob": "1997-06-14",
        "age": 29,
        "height": "5' 11\" (180 cm)",
        "weight": "74 kg",
        "bloodGroup": "O+",
        "complexion": "Fair",
        "maritalStatus": "Never Married",
        "motherTongue": "Hindi / English",
        "religion": "Hindu",
        "caste": "Brahmin",
        "subCaste": "Gaur Brahmin",
        "gotra": "Kashyap",
        "rashi": "Virgo (Kanya)",
        "nakshatra": "Hasta",
        "manglik": "No / Anshik",
        "placeOfBirth": "Jaipur, Rajasthan",
        "timeOfBirth": "09:45 AM",
        "city": "Bengaluru",
        "state": "Karnataka",
        "currentAddress": "Indiranagar, Bengaluru, Karnataka - 560038",
        "permanentAddress": "C-42, Malviya Nagar, Jaipur, Rajasthan - 302017",
        "nativePlace": "Jaipur, Rajasthan",
        "education": "B.Tech in Computer Science (IIT Delhi)",
        "college": "Indian Institute of Technology (IIT Delhi)",
        "occupation": "Senior Staff Software Architect",
        "company": "Google India Pvt. Ltd.",
        "annualIncome": "₹ 48 LPA",
        "workLocation": "Bengaluru (Hybrid)",
        "aboutMe": "I work as a Senior Software Architect at Google India, building large-scale distributed cloud systems. Grounded in traditional Indian family values while embracing a modern outlook, I enjoy reading tech & philosophy, playing acoustic guitar on weekends, traveling to mountains, and spending quality time with family.",
        "partnerExpectations": "Looking for an educated, career-minded and warm-hearted life companion who values mutual respect, open communication, and believes in balancing professional aspirations with a joyful family life.",
        "diet": "Vegetarian",
        "smoking": "No",
        "drinking": "No",
        "fitness": "Gym (4 days/week), Badminton & Morning Yoga",
        "interests": ["Acoustic Guitar", "Himalayan Treks", "Tech Blogging", "Weekend Cooking", "Badminton"],
        "photoUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
        "familyType": "Nuclear Family",
        "familyValues": "Moderate / Progressive",
        "fatherName": "Rajendra Sharma",
        "fatherOccupation": "Retired General Manager (State Bank of India)",
        "motherName": "Sunita Sharma",
        "motherOccupation": "Retired Senior Secondary School Principal",
        "siblings": "1 Elder Sister (M.D. Radiologist, Married & Settled in London)",
        "maternalUncle": "Dr. Vinod Mishra (Chief Medical Officer, AIIMS)",
        "contactPerson": "Rajendra Sharma (Father)",
        "contactRelation": "Father",
    },
    {
        "email": "testuser@truemarriage.in",
        "password": "Razorpay@2026",
        "name": "Priya Deshmukh",
        "phone": "+91 9822012345",
        "slug": "priya-deshmukh-product-designer",
        "gender": "Female",
        "dob": "1999-04-12",
        "age": 27,
        "height": "5' 6\" (168 cm)",
        "weight": "55 kg",
        "bloodGroup": "B+",
        "complexion": "Fair",
        "maritalStatus": "Never Married",
        "motherTongue": "Marathi / Hindi / English",
        "religion": "Hindu",
        "caste": "Maratha",
        "subCaste": "96 Kuli Maratha",
        "gotra": "Kaundinya",
        "rashi": "Taurus (Vrishabha)",
        "nakshatra": "Rohini",
        "manglik": "No",
        "placeOfBirth": "Pune, Maharashtra",
        "timeOfBirth": "07:15 AM",
        "city": "Pune",
        "state": "Maharashtra",
        "currentAddress": "Baner, Pune, Maharashtra - 411045",
        "permanentAddress": "Shivaji Nagar, Satara, Maharashtra - 415001",
        "nativePlace": "Satara, Maharashtra",
        "education": "M.Des in User Experience (NID Ahmedabad)",
        "college": "National Institute of Design (NID)",
        "occupation": "Lead Product Designer",
        "company": "Microsoft India",
        "annualIncome": "₹ 28 LPA",
        "workLocation": "Pune / Remote",
        "aboutMe": "A creative design lead who loves blending empathetic design with meaningful technology. Outside my design craft, I love weekend baking, classical Kathak dance, attending art exhibits, and relaxed Sunday family brunches.",
        "partnerExpectations": "Seeking a well-educated, respectful, and supportive partner with good humor, intellectual curiosity, and an appreciation for family traditions.",
        "diet": "Vegetarian",
        "smoking": "No",
        "drinking": "No",
        "fitness": "Kathak Classical Dance & Pilates",
        "interests": ["Kathak Dance", "Pottery", "Weekend Baking", "Audiobooks", "Travel"],
        "photoUrl": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80",
        "familyType": "Nuclear Family",
        "familyValues": "Moderate",
        "fatherName": "Anand Deshmukh",
        "fatherOccupation": "Retired Chief Engineer (PWD Maharashtra)",
        "motherName": "Dr. Manisha Deshmukh",
        "motherOccupation": "Professor of English Literature (Fergusson College)",
        "siblings": "1 Younger Brother (Senior Software Engineer at Infosys)",
        "maternalUncle": "Sanjay Patil (Senior Executive, Tata Motors)",
        "contactPerson": "Anand Deshmukh (Father)",
        "contactRelation": "Father",
    }
]


def create_comprehensive_profile_data(item: dict) -> dict:
    """Builds a rich, dual-structure JSON payload for BiodataProfileModel."""
    return {
        # Top-level flat properties
        "name": item["name"],
        "fullName": item["name"],
        "email": item["email"],
        "contactNumber": item["phone"],
        "phone": item["phone"],
        "publicContactNumber": item["phone"],
        "gender": item["gender"],
        "dob": item["dob"],
        "dateOfBirth": item["dob"],
        "age": item["age"],
        "height": item["height"],
        "weight": item["weight"],
        "bloodGroup": item["bloodGroup"],
        "complexion": item["complexion"],
        "maritalStatus": item["maritalStatus"],
        "motherTongue": item["motherTongue"],
        "languagesKnown": [item["motherTongue"], "English"],
        "religion": item["religion"],
        "caste": item["caste"],
        "subCaste": item.get("subCaste"),
        "gotra": item["gotra"],
        "rashi": item["rashi"],
        "nakshatra": item["nakshatra"],
        "manglik": item.get("manglik", "No"),
        "placeOfBirth": item["placeOfBirth"],
        "timeOfBirth": item["timeOfBirth"],
        "currentCity": item["city"],
        "city": item["city"],
        "state": item["state"],
        "currentAddress": item["currentAddress"],
        "permanentAddress": item["permanentAddress"],
        "nativePlace": item["nativePlace"],
        "education": item["education"],
        "college": item.get("college"),
        "occupation": item["occupation"],
        "company": item["company"],
        "companyName": item["company"],
        "annualIncome": item["annualIncome"],
        "workLocation": item["workLocation"],
        "aboutMe": item["aboutMe"],
        "partnerExpectations": item["partnerExpectations"],
        "diet": item["diet"],
        "smoking": item["smoking"],
        "drinking": item["drinking"],
        "fitness": item["fitness"],
        "interests": item["interests"],
        "hobbies": item["interests"],
        "profilePictureUrl": item["photoUrl"],
        "photoUrl": item["photoUrl"],
        "familyType": item["familyType"],
        "familyValues": item["familyValues"],
        "fatherName": item["fatherName"],
        "fatherOccupation": item["fatherOccupation"],
        "motherName": item["motherName"],
        "motherOccupation": item["motherOccupation"],
        "siblings": item["siblings"],
        "brothers": "None" if "Brother" not in item["siblings"] else "1 Brother",
        "sisters": "None" if "Sister" not in item["siblings"] else "1 Sister",
        "maternalUncle": item.get("maternalUncle"),
        "contactPerson": item["contactPerson"],
        "contactRelation": item["contactRelation"],

        # Nested Structure for BiodataRenderer & Printable Templates
        "pageHeader": {
            "deity": "|| श्री गणेशाय नमः ||",
            "deityIcon": "/symbols/ganesha_golden.png",
        },
        "personalDetails": {
            "fullName": item["name"],
            "gender": item["gender"],
            "dateOfBirth": item["dob"],
            "timeOfBirth": item["timeOfBirth"],
            "placeOfBirth": item["placeOfBirth"],
            "religion": item["religion"],
            "caste": item["caste"],
            "subCaste": item.get("subCaste"),
            "gotra": item["gotra"],
            "rashi": item["rashi"],
            "nakshatra": item["nakshatra"],
            "manglik": item.get("manglik", "No"),
            "height": item["height"],
            "weight": item["weight"],
            "complexion": item["complexion"],
            "bloodGroup": item["bloodGroup"],
            "maritalStatus": item["maritalStatus"],
            "motherTongue": item["motherTongue"],
            "photoUrl": item["photoUrl"],
        },
        "educationOccupation": {
            "education": item["education"],
            "college": item.get("college"),
            "occupation": item["occupation"],
            "companyName": item["company"],
            "annualIncome": item["annualIncome"],
            "workLocation": item["workLocation"],
        },
        "familyDetails": {
            "fatherName": item["fatherName"],
            "fatherOccupation": item["fatherOccupation"],
            "motherName": item["motherName"],
            "motherOccupation": item["motherOccupation"],
            "brothers": "None" if "Brother" not in item["siblings"] else "1 Brother",
            "sisters": "None" if "Sister" not in item["siblings"] else "1 Sister",
            "siblings": item["siblings"],
            "familyType": item["familyType"],
            "familyValues": item["familyValues"],
            "nativePlace": item["nativePlace"],
            "maternalUncle": item.get("maternalUncle"),
            "relations": f"Paternal: {item['nativePlace']} | Maternal: {item.get('maternalUncle')}",
        },
        "contactDetails": {
            "primaryContact": item["phone"],
            "secondaryContact": "+91 9425098765",
            "email": item["email"],
            "residenceAddress": item["currentAddress"],
            "contactPerson": item["contactPerson"],
            "relation": item["contactRelation"],
        },
    }


def seed_test_accounts():
    db = SessionLocal()
    try:
        print("[SEED] Seeding / Updating Razorpay verification test accounts...")
        for item in TEST_ACCOUNTS:
            email = item["email"].lower().strip()
            user = db.query(User).filter(User.email == email).first()

            if not user:
                user = User(
                    id=f"user_{uuid.uuid4().hex[:12]}",
                    email=email,
                    full_name=item["name"],
                    password_hash=get_password_hash(item["password"]),
                    phone=item["phone"],
                    role=UserRole.USER,
                    status=UserStatus.ACTIVE,
                    is_email_verified=True,
                    is_phone_verified=True,
                )
                db.add(user)
                db.flush()
                print(f"[CREATED USER] {email} with verified status.")
            else:
                user.full_name = item["name"]
                user.password_hash = get_password_hash(item["password"])
                user.phone = item["phone"]
                user.role = UserRole.USER
                user.status = UserStatus.ACTIVE
                user.is_email_verified = True
                user.is_phone_verified = True
                print(f"[UPDATED USER] {email} credentials refreshed.")

            # Look up or create BiodataProfileModel
            bio = db.query(BiodataProfileModel).filter(BiodataProfileModel.user_id == user.id).first()
            profile_data_payload = create_comprehensive_profile_data(item)

            if not bio:
                bio = BiodataProfileModel(
                    id=f"bio_{uuid.uuid4().hex[:12]}",
                    user_id=user.id,
                    slug=item["slug"],
                    is_password_protected=False,
                    hide_contact_details=False,
                    is_completed=True,
                    status="PUBLISHED",
                    moderation_status=ProfileModerationStatus.APPROVED,
                    profile_data=profile_data_payload,
                    submitted_at=datetime.now(timezone.utc),
                    published_at=datetime.now(timezone.utc),
                    created_at=datetime.now(timezone.utc),
                )
                db.add(bio)
                print(f"[CREATED BIODATA] for {email} with PUBLISHED & APPROVED status.")
            else:
                bio.slug = item["slug"]
                bio.is_password_protected = False
                bio.hide_contact_details = False
                bio.is_completed = True
                bio.status = "PUBLISHED"
                bio.moderation_status = ProfileModerationStatus.APPROVED
                bio.profile_data = profile_data_payload
                bio.submitted_at = datetime.now(timezone.utc)
                bio.published_at = datetime.now(timezone.utc)
                print(f"[UPDATED BIODATA] for {email} to fully completed & published.")

        db.commit()
        print("[SUCCESS] All test accounts are successfully configured in the database!")
    except Exception as e:
        db.rollback()
        print(f"[ERROR] Failed to seed Razorpay test accounts: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_test_accounts()
