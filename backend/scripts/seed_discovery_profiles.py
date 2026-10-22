import uuid
from datetime import datetime, timezone
from backend.db.session import SessionLocal
from backend.models.user import User
from backend.models.biodata import BiodataProfileModel
from backend.models.enums import UserRole, UserStatus, ProfileModerationStatus
from backend.core.security import get_password_hash

REAL_DISCOVERY_PROFILES = [
    {
        "name": "Priya Deshmukh",
        "email": "priya.deshmukh@truemarriage.in",
        "gender": "Female",
        "dob": "1999-04-12",
        "height": "5' 6\" (168 cm)",
        "city": "Pune",
        "state": "Maharashtra",
        "religion": "Hindu",
        "caste": "Maratha",
        "motherTongue": "Marathi",
        "maritalStatus": "Never Married",
        "education": "M.Des in User Experience (NID)",
        "college": "National Institute of Design (NID)",
        "occupation": "Lead Product Designer (Microsoft)",
        "company": "Microsoft India",
        "annualIncome": "₹ 26 LPA",
        "nativePlace": "Satara, Maharashtra",
        "aboutMe": "A family-oriented design lead who loves blending tech with creativity. I balance a thriving career with simple joys — family Sunday lunches, painting, and soulful music.",
        "partnerExpectations": "Seeking an empathetic, grounded companion who values equality, cherishes family bonds, and has a positive outlook on life.",
        "photoUrl": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80",
        "familyType": "Nuclear Family",
        "familyValues": "Moderate",
        "fatherOccupation": "Retired Chief Engineer (PWD Maharashtra)",
        "motherOccupation": "Professor of English Literature (Fergusson College)",
        "siblings": "1 Younger Brother (Software Engineer at Infosys)",
        "diet": "Vegetarian",
        "smoking": "No",
        "drinking": "No",
        "fitness": "Yoga & Classical Dance (Kathak)",
        "interests": ["Kathak Dance", "Pottery", "Weekend Baking", "Podcasts"],
    },
    {
        "name": "Ananya Iyer",
        "email": "ananya.iyer@truemarriage.in",
        "gender": "Female",
        "dob": "2000-09-18",
        "height": "5' 5\" (165 cm)",
        "city": "Bengaluru",
        "state": "Karnataka",
        "religion": "Hindu",
        "caste": "Iyer",
        "motherTongue": "Tamil / English",
        "maritalStatus": "Never Married",
        "education": "M.S. in Artificial Intelligence (IISc Bangalore)",
        "college": "Indian Institute of Science (IISc)",
        "occupation": "AI Research Scientist (AWS)",
        "company": "Amazon Web Services",
        "annualIncome": "₹ 32 LPA",
        "nativePlace": "Chennai, Tamil Nadu",
        "aboutMe": "An AI researcher who loves exploring both science and spirituality. When I am not training models, you will find me singing Carnatic ragas or tending to my balcony garden.",
        "partnerExpectations": "Looking for a kind, forward-thinking partner with intellectual curiosity, emotional maturity, and a gentle heart.",
        "photoUrl": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
        "familyType": "Nuclear Family",
        "familyValues": "Liberal",
        "fatherOccupation": "Retired Professor of Physics (IIT Madras)",
        "motherOccupation": "Senior Carnatic Music Teacher",
        "siblings": "1 Elder Sister (Doctor in London, Married)",
        "diet": "Vegetarian",
        "smoking": "No",
        "drinking": "No",
        "fitness": "Pilates, Swimming & Carnatic Music",
        "interests": ["Carnatic Vocals", "Astronomy", "Gardening", "Filter Coffee"],
    },
    {
        "name": "Kavya Reddy",
        "email": "kavya.reddy@truemarriage.in",
        "gender": "Female",
        "dob": "1999-07-22",
        "height": "5' 5\" (165 cm)",
        "city": "Hyderabad",
        "state": "Telangana",
        "religion": "Hindu",
        "caste": "Reddy",
        "motherTongue": "Telugu",
        "maritalStatus": "Never Married",
        "education": "B.Com + CA (First Attempt Ranker)",
        "college": "Badruka College of Commerce & ICAI",
        "occupation": "Chartered Accountant (EY)",
        "company": "Ernst & Young",
        "annualIncome": "₹ 24 LPA",
        "nativePlace": "Warangal, Telangana",
        "aboutMe": "Chartered accountant with a passion for classical Telugu literature, badminton, and road trips across southern India. I value integrity, mutual respect, and close-knit family traditions.",
        "partnerExpectations": "Seeking a supportive and joyful companion who values ambition, transparent conversations, and family togetherness.",
        "photoUrl": "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=600&auto=format&fit=crop&q=80",
        "familyType": "Joint Family",
        "familyValues": "Moderate",
        "fatherOccupation": "Senior Advocate (High Court of Telangana)",
        "motherOccupation": "Homemaker & Organic Farming Entrepreneur",
        "siblings": "1 Younger Brother (Pursuing MS in Germany)",
        "diet": "Vegetarian",
        "smoking": "No",
        "drinking": "Socially",
        "fitness": "Badminton, Morning Runs & Cycling",
        "interests": ["Badminton", "Telugu Literature", "Road Trips", "Violin"],
    },
    {
        "name": "Dr. Tanvi Kulkarni",
        "email": "dr.tanvi@truemarriage.in",
        "gender": "Female",
        "dob": "1998-02-14",
        "height": "5' 4\" (163 cm)",
        "city": "Ahmedabad",
        "state": "Gujarat",
        "religion": "Hindu",
        "caste": "Brahmin",
        "motherTongue": "Gujarati / Hindi",
        "maritalStatus": "Never Married",
        "education": "MBBS, MD Dermatology (BJMC)",
        "college": "B.J. Medical College Ahmedabad",
        "occupation": "Dermatologist (Apollo Hospitals)",
        "company": "Apollo Hospitals",
        "annualIncome": "₹ 28 LPA",
        "nativePlace": "Vadodara, Gujarat",
        "aboutMe": "Consultant dermatologist who loves medical research, classical Hindustani music, and preparing gourmet weekend dishes for loved ones.",
        "partnerExpectations": "Seeking a mature, compassionate life partner with strong ethical values, mutual respect, and a warm sense of humor.",
        "photoUrl": "https://images.unsplash.com/photo-1594824813591-91a613589b21?w=600&auto=format&fit=crop&q=80",
        "familyType": "Nuclear Family",
        "familyValues": "Traditional",
        "fatherOccupation": "Civil Surgeon (Gujarat Health Services, Retd.)",
        "motherOccupation": "Principal (Govt. Girls Higher Secondary School)",
        "siblings": "None (Only Child)",
        "diet": "Vegetarian",
        "smoking": "No",
        "drinking": "No",
        "fitness": "Aerobics, Swimming & Weekend Hiking",
        "interests": ["Hindustani Classical", "Culinary Arts", "Medical Volunteering", "Travel"],
    },
    {
        "name": "Rohan Patil",
        "email": "rohan.patil@truemarriage.in",
        "gender": "Male",
        "dob": "1997-11-05",
        "height": "5' 11\" (180 cm)",
        "city": "Mumbai",
        "state": "Maharashtra",
        "religion": "Hindu",
        "caste": "Maratha",
        "motherTongue": "Marathi / Hindi",
        "maritalStatus": "Never Married",
        "education": "B.Tech (COEP), MBA (IIM Lucknow)",
        "college": "College of Engineering Pune & IIM Lucknow",
        "occupation": "Vice President - Investment Banking",
        "company": "Morgan Stanley",
        "annualIncome": "₹ 42 LPA",
        "nativePlace": "Kolhapur, Maharashtra",
        "aboutMe": "Finance professional who enjoys marathon running, indie films, and exploring quiet hill stations. Deeply grounded in family values with an open mindset.",
        "partnerExpectations": "Seeking an ambitious, cheerful partner who values honest communication, mutual growth, and meaningful life moments.",
        "photoUrl": "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=600&auto=format&fit=crop&q=80",
        "familyType": "Nuclear Family",
        "familyValues": "Moderate",
        "fatherOccupation": "Executive Director (State Bank of India, Retd.)",
        "motherOccupation": "Senior Academician (Fergusson College, Retd.)",
        "siblings": "1 Elder Sister (Architect in Pune, Married)",
        "diet": "Non-Vegetarian",
        "smoking": "No",
        "drinking": "Socially",
        "fitness": "Half-Marathon Runner & Strength Training",
        "interests": ["Marathons", "Investing", "Documentaries", "Specialty Coffee"],
    },
    {
        "name": "Aarav Sharma",
        "email": "aarav.sharma@truemarriage.in",
        "gender": "Male",
        "dob": "1996-08-30",
        "height": "6' 0\" (183 cm)",
        "city": "Delhi NCR",
        "state": "Delhi",
        "religion": "Hindu",
        "caste": "Brahmin",
        "motherTongue": "Hindi / Punjabi",
        "maritalStatus": "Never Married",
        "education": "B.Tech Computer Science (IIT Delhi)",
        "college": "Indian Institute of Technology (IIT Delhi)",
        "occupation": "Staff Software Architect (Google)",
        "company": "Google India",
        "annualIncome": "₹ 55 LPA",
        "nativePlace": "Jaipur, Rajasthan",
        "aboutMe": "Tech architect with a love for photography, trekking in Himachal, and acoustic guitar. Warm, optimistic, and deeply respectful of family heritage.",
        "partnerExpectations": "Looking for an educated, empathetic life partner with a bright smile and genuine kindness.",
        "photoUrl": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80",
        "familyType": "Joint Family",
        "familyValues": "Moderate",
        "fatherOccupation": "Chief Town Planner (Delhi Development Authority, Retd.)",
        "motherOccupation": "Professor of Botany (University of Delhi)",
        "siblings": "1 Younger Brother (Investment Analyst in Gurugram)",
        "diet": "Vegetarian",
        "smoking": "No",
        "drinking": "No",
        "fitness": "High Altitude Trekking & Calisthenics",
        "interests": ["Photography", "Acoustic Guitar", "Himalayan Treks", "Tech Blogs"],
    }
]

def seed_discovery_profiles():
    db = SessionLocal()
    try:
        count_added = 0
        for item in REAL_DISCOVERY_PROFILES:
            existing_user = db.query(User).filter(User.email == item["email"]).first()
            if not existing_user:
                user = User(
                    id=f"user_{uuid.uuid4().hex[:12]}",
                    email=item["email"],
                    password_hash=get_password_hash("TrueMarriage@2026"),
                    full_name=item["name"],
                    phone="+91 98" + "".join([str(uuid.uuid4().int % 10) for _ in range(8)]),
                    role=UserRole.USER,
                    status=UserStatus.ACTIVE,
                    is_email_verified=True,
                    is_phone_verified=True,
                )
                db.add(user)
                db.flush()
            else:
                user = existing_user

            existing_bio = db.query(BiodataProfileModel).filter(BiodataProfileModel.user_id == user.id).first()
            profile_data_json = {
                "fullName": item["name"],
                "dob": item["dob"],
                "gender": item["gender"],
                "height": item["height"],
                "currentCity": item["city"],
                "city": item["city"],
                "state": item["state"],
                "religion": item["religion"],
                "caste": item["caste"],
                "motherTongue": item["motherTongue"],
                "maritalStatus": item["maritalStatus"],
                "education": item["education"],
                "college": item.get("college"),
                "occupation": item["occupation"],
                "company": item["company"],
                "annualIncome": item["annualIncome"],
                "nativePlace": item["nativePlace"],
                "aboutMe": item["aboutMe"],
                "partnerExpectations": item["partnerExpectations"],
                "profilePictureUrl": item["photoUrl"],
                "familyType": item["familyType"],
                "familyValues": item["familyValues"],
                "fatherOccupation": item.get("fatherOccupation"),
                "motherOccupation": item.get("motherOccupation"),
                "siblings": item.get("siblings"),
                "diet": item["diet"],
                "smoking": item["smoking"],
                "drinking": item["drinking"],
                "fitness": item["fitness"],
                "interests": item["interests"],
            }

            if not existing_bio:
                bio = BiodataProfileModel(
                    id=f"bio_{uuid.uuid4().hex[:12]}",
                    user_id=user.id,
                    status="PUBLISHED",
                    moderation_status=ProfileModerationStatus.APPROVED,
                    profile_data=profile_data_json,
                    published_at=datetime.now(timezone.utc),
                    created_at=datetime.now(timezone.utc),
                )
                db.add(bio)
                count_added += 1
            else:
                existing_bio.status = "PUBLISHED"
                existing_bio.moderation_status = ProfileModerationStatus.APPROVED
                existing_bio.profile_data = profile_data_json
                existing_bio.published_at = datetime.now(timezone.utc)

        db.commit()
        print(f"Successfully seeded/updated {count_added} discoverable real profiles in TrueMarriage database!")
    except Exception as e:
        db.rollback()
        print(f"Failed to seed discovery profiles: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_discovery_profiles()
