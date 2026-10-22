from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, select
from backend.models.user import User
from backend.models.biodata import BiodataProfileModel
from backend.models.interest import InterestModel
from backend.models.shortlist import ShortlistModel
from backend.models.security_log import SecurityLog
from backend.models.enums import UserStatus, ProfileModerationStatus, InterestStatus, UserRole
from backend.dependencies.authorization import require_admin
from backend.db.session import get_db

router = APIRouter(prefix="/admin", tags=["Admin Analytics & Control"])


@router.get("/test")
def admin_test(current_admin: User = Depends(require_admin)):
    """
    Development & authorization test endpoint for Admin namespace.
    Enforces ADMIN role requirement via require_admin dependency.
    """
    return {
        "success": True,
        "authorized": True,
        "admin_id": current_admin.id,
        "email": current_admin.email,
        "role": current_admin.role.value
    }


from datetime import datetime, timedelta
from backend.models.premium_interest import PremiumInterestEvent

@router.get("/analytics")
def get_admin_analytics(
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin)
):
    """
    Admin Analytics API: Returns aggregated metrics, user growth numbers, profile moderation status breakdown,
    interaction stats, demographic distributions, and premium intent telemetry.
    """
    today = datetime.utcnow().date()

    # 1. User Metrics & Account Health
    total_users = db.scalar(select(func.count(User.id))) or 0
    active_users = db.scalar(select(func.count(User.id)).where(User.status == UserStatus.ACTIVE)) or 0
    pending_users = db.scalar(select(func.count(User.id)).where(User.status == UserStatus.PENDING_VERIFICATION)) or 0
    blocked_users = db.scalar(select(func.count(User.id)).where(User.status == UserStatus.BLOCKED)) or 0
    deactivated_users = db.scalar(select(func.count(User.id)).where(User.status == UserStatus.DEACTIVATED)) or 0
    admin_users = db.scalar(select(func.count(User.id)).where(User.role == UserRole.ADMIN)) or 0
    verified_emails = db.scalar(select(func.count(User.id)).where(User.is_email_verified == True)) or 0

    # 2. Growth Velocity (Daily Signups & Deletions for trailing 14 days)
    start_date = today - timedelta(days=13)
    daily_signups_raw = db.execute(
        select(func.date(User.created_at).label("day"), func.count(User.id).label("cnt"))
        .where(User.created_at >= start_date)
        .group_by(func.date(User.created_at))
    ).all()
    daily_map = {str(row.day): int(row.cnt) for row in daily_signups_raw}

    # Daily account deletions from security logs
    daily_deletions_raw = db.execute(
        select(func.date(SecurityLog.created_at).label("day"), func.count(SecurityLog.id).label("cnt"))
        .where(
            SecurityLog.created_at >= start_date,
            SecurityLog.event_type.in_(["ACCOUNT_DELETED", "GDPR_ERASURE", "USER_DELETED", "ACCOUNT_DELETION", "PROFILE_DELETED"])
        )
        .group_by(func.date(SecurityLog.created_at))
    ).all()
    deletions_map = {str(row.day): int(row.cnt) for row in daily_deletions_raw}

    # Also count deactivated accounts by updated_at date
    deactivated_users_raw = db.execute(
        select(func.date(User.updated_at).label("day"), func.count(User.id).label("cnt"))
        .where(
            User.updated_at >= start_date,
            User.status == UserStatus.DEACTIVATED
        )
        .group_by(func.date(User.updated_at))
    ).all()
    for row in deactivated_users_raw:
        day_key = str(row.day)
        deletions_map[day_key] = max(deletions_map.get(day_key, 0), int(row.cnt))

    growth_velocity = []
    for i in range(14):
        d = start_date + timedelta(days=i)
        d_str = str(d)
        growth_velocity.append({
            "date": d_str,
            "label": d.strftime("%b %d"),
            "count": int(daily_map.get(d_str, 0)),
            "deletions": int(deletions_map.get(d_str, 0)),
        })

    # 3. Profile Moderation Metrics
    total_profiles = db.scalar(select(func.count(BiodataProfileModel.id))) or 0
    approved_profiles = db.scalar(select(func.count(BiodataProfileModel.id)).where(BiodataProfileModel.moderation_status == ProfileModerationStatus.APPROVED)) or 0
    submitted_profiles = db.scalar(select(func.count(BiodataProfileModel.id)).where(BiodataProfileModel.moderation_status == ProfileModerationStatus.SUBMITTED)) or 0
    under_review_profiles = db.scalar(select(func.count(BiodataProfileModel.id)).where(BiodataProfileModel.moderation_status == ProfileModerationStatus.UNDER_REVIEW)) or 0
    rejected_profiles = db.scalar(select(func.count(BiodataProfileModel.id)).where(BiodataProfileModel.moderation_status == ProfileModerationStatus.REJECTED)) or 0
    changes_requested_profiles = db.scalar(select(func.count(BiodataProfileModel.id)).where(BiodataProfileModel.moderation_status == ProfileModerationStatus.CHANGES_REQUESTED)) or 0
    draft_profiles = db.scalar(select(func.count(BiodataProfileModel.id)).where(BiodataProfileModel.moderation_status == ProfileModerationStatus.DRAFT)) or 0

    # 4. Demographic & Community Distributions
    profiles_data = db.scalars(select(BiodataProfileModel.profile_data)).all()
    gender_counts = {"Male": 0, "Female": 0, "Other": 0}
    marital_counts = {"Never Married": 0, "Divorced": 0, "Widowed": 0, "Awaiting Divorce": 0}
    age_brackets = {"18-24": 0, "25-29": 0, "30-34": 0, "35+": 0}
    INDIAN_STATES = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
        "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
        "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
        "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
        "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry", "Chandigarh"
    ]

    CITY_TO_STATE = {
        "nagpur": "Maharashtra", "pune": "Maharashtra", "mumbai": "Maharashtra",
        "thane": "Maharashtra", "nashik": "Maharashtra", "wardha": "Maharashtra",
        "pauni": "Maharashtra", "bhandara": "Maharashtra", "satara": "Maharashtra",
        "kolhapur": "Maharashtra", "solapur": "Maharashtra", "amravati": "Maharashtra",
        "akola": "Maharashtra", "aurangabad": "Maharashtra", "sambhajinagar": "Maharashtra",
        "chandrapur": "Maharashtra", "yavatmal": "Maharashtra", "jalgaon": "Maharashtra",
        "nanded": "Maharashtra", "latur": "Maharashtra", "dhule": "Maharashtra",
        "nipani": "Karnataka", "belgaum": "Karnataka", "belagavi": "Karnataka",
        "bengaluru": "Karnataka", "bangalore": "Karnataka", "hubli": "Karnataka",
        "dharwad": "Karnataka", "mysore": "Karnataka", "mysuru": "Karnataka", "mangalore": "Karnataka",
        "hyderabad": "Telangana", "secunderabad": "Telangana", "warangal": "Telangana",
        "ahmedabad": "Gujarat", "surat": "Gujarat", "vadodara": "Gujarat", "rajkot": "Gujarat",
        "jaipur": "Rajasthan", "jodhpur": "Rajasthan", "udaipur": "Rajasthan", "kota": "Rajasthan",
        "indore": "Madhya Pradesh", "bhopal": "Madhya Pradesh", "gwalior": "Madhya Pradesh", "jabalpur": "Madhya Pradesh",
        "delhi": "Delhi", "new delhi": "Delhi",
        "noida": "Uttar Pradesh", "greater noida": "Uttar Pradesh", "lucknow": "Uttar Pradesh", "kanpur": "Uttar Pradesh", "varanasi": "Uttar Pradesh", "agra": "Uttar Pradesh", "ghaziabad": "Uttar Pradesh",
        "gurgaon": "Haryana", "gurugram": "Haryana", "faridabad": "Haryana",
        "chandigarh": "Punjab", "ludhiana": "Punjab", "amritsar": "Punjab",
        "kolkata": "West Bengal", "howrah": "West Bengal",
        "chennai": "Tamil Nadu", "coimbatore": "Tamil Nadu", "madurai": "Tamil Nadu",
        "kochi": "Kerala", "thiruvananthapuram": "Kerala", "calicut": "Kerala", "kozhikode": "Kerala",
        "patna": "Bihar", "gaya": "Bihar",
        "ranchi": "Jharkhand", "jamshedpur": "Jharkhand",
        "bhubaneswar": "Odisha", "cuttack": "Odisha",
        "raipur": "Chhattisgarh", "bilaspur": "Chhattisgarh",
        "dehradun": "Uttarakhand", "haridwar": "Uttarakhand"
    }

    state_counts = {}

    for p in profiles_data:
        if not isinstance(p, dict):
            continue
        # Gender
        g = str(p.get("gender") or "").capitalize()
        if g in gender_counts:
            gender_counts[g] += 1
        elif g:
            gender_counts["Other"] += 1

        # Marital Status
        ms = str(p.get("maritalStatus") or p.get("marital_status") or "").title()
        if "Never" in ms or "Single" in ms:
            marital_counts["Never Married"] += 1
        elif "Divorce" in ms and "Awaiting" not in ms:
            marital_counts["Divorced"] += 1
        elif "Widow" in ms:
            marital_counts["Widowed"] += 1
        elif "Awaiting" in ms:
            marital_counts["Awaiting Divorce"] += 1

        # Age
        age = None
        if p.get("age"):
            try:
                age = int(p.get("age"))
            except (ValueError, TypeError):
                pass
        elif p.get("dob"):
            try:
                dob_val = str(p.get("dob"))[:10]
                dob_year = int(dob_val.split("-")[0]) if "-" in dob_val else int(dob_val.split("/")[2])
                age = today.year - dob_year
            except Exception:
                pass
        if age:
            if age < 25:
                age_brackets["18-24"] += 1
            elif 25 <= age <= 29:
                age_brackets["25-29"] += 1
            elif 30 <= age <= 34:
                age_brackets["30-34"] += 1
            else:
                age_brackets["35+"] += 1

        # Candidate State Extraction
        fields = [p.get("state"), p.get("nativePlace"), p.get("placeOfBirth"), p.get("currentAddress"), p.get("permanentAddress")]
        matched_state = None
        combined_text = " ".join([str(f) for f in fields if f]).strip()
        if combined_text:
            combined_lower = combined_text.lower()
            for st in INDIAN_STATES:
                if st.lower() in combined_lower:
                    matched_state = st
                    break
            if not matched_state:
                for f in fields:
                    if not f or not isinstance(f, str):
                        continue
                    parts = [part.strip().lower() for part in f.replace(",", " ").replace("-", " ").replace(";", " ").split()]
                    for part in parts:
                        if part in CITY_TO_STATE:
                            matched_state = CITY_TO_STATE[part]
                            break
                    if matched_state:
                        break
        if matched_state:
            state_counts[matched_state] = state_counts.get(matched_state, 0) + 1

    top_locations = sorted(
        [{"name": k, "count": v} for k, v in state_counts.items()],
        key=lambda x: x["count"],
        reverse=True
    )[:6]

    # 5. Engagement & Matchmaking Funnel
    total_interests = db.scalar(select(func.count(InterestModel.id))) or 0
    pending_interests = db.scalar(select(func.count(InterestModel.id)).where(InterestModel.status == InterestStatus.PENDING)) or 0
    matched_interests = db.scalar(select(func.count(InterestModel.id)).where(InterestModel.status == InterestStatus.MATCHED)) or 0
    accepted_interests = db.scalar(select(func.count(InterestModel.id)).where(InterestModel.status == InterestStatus.ACCEPTED)) or 0
    declined_interests = db.scalar(select(func.count(InterestModel.id)).where(InterestModel.status == InterestStatus.DECLINED)) or 0
    total_shortlists = db.scalar(select(func.count(ShortlistModel.id))) or 0
    match_rate = round((accepted_interests + matched_interests) / total_interests * 100, 1) if total_interests > 0 else 0.0

    # 6. Premium Intent & Monetization Telemetry
    total_premium_clicks = db.scalar(select(func.count(PremiumInterestEvent.id))) or 0
    registered_clicks = db.scalar(
        select(func.count(PremiumInterestEvent.id)).where(PremiumInterestEvent.user_id.isnot(None))
    ) or 0
    guest_clicks = total_premium_clicks - registered_clicks
    unique_premium_users = db.scalar(
        select(func.count(func.distinct(PremiumInterestEvent.user_id))).where(PremiumInterestEvent.user_id.isnot(None))
    ) or 0
    premium_intent_rate = round((unique_premium_users / total_users) * 100, 1) if total_users > 0 else 0.0

    return {
        "success": True,
        "users": {
            "total": total_users,
            "active": active_users,
            "pending": pending_users,
            "blocked": blocked_users,
            "deactivated": deactivated_users,
            "admins": admin_users,
            "regular_users": total_users - admin_users,
            "verified_emails": verified_emails,
            "unverified_emails": total_users - verified_emails,
            "email_verification_rate": round((verified_emails / total_users) * 100, 1) if total_users > 0 else 0.0,
        },
        "growth_velocity": growth_velocity,
        "profiles": {
            "total": total_profiles,
            "approved": approved_profiles,
            "submitted": submitted_profiles,
            "under_review": under_review_profiles,
            "rejected": rejected_profiles,
            "changes_requested": changes_requested_profiles,
            "draft": draft_profiles,
            "pending_moderation_total": submitted_profiles + under_review_profiles + changes_requested_profiles,
        },
        "demographics": {
            "gender": gender_counts,
            "marital_status": marital_counts,
            "age_brackets": age_brackets,
            "top_locations": top_locations,
        },
        "engagement_funnel": {
            "total_interests": total_interests,
            "pending": pending_interests,
            "accepted": accepted_interests,
            "matched": matched_interests,
            "declined": declined_interests,
            "total_shortlists": total_shortlists,
            "match_rate": match_rate,
        },
        "premium_telemetry": {
            "total_clicks": total_premium_clicks,
            "registered_clicks": registered_clicks,
            "guest_clicks": guest_clicks,
            "unique_premium_users": unique_premium_users,
            "intent_rate": premium_intent_rate,
        },
        "system": {
            "engine": "Python FastAPI",
            "orm": "SQLAlchemy 2.0",
            "security": "bcrypt 12-rounds + HttpOnly Cookie",
            "status": "Healthy / Operational"
        }
    }


@router.get("/user-analysis")
def get_user_analysis(
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin)
):
    """
    Admin-only User Analysis API: Provides registered user counts, unique registered users who clicked Premium,
    unregistered/guest user Premium clicks, total Premium clicks, interest percentage, and recent events.
    """
    from backend.models.premium_interest import PremiumInterestEvent

    total_users = db.scalar(select(func.count(User.id))) or 0

    # Premium Clicks & Users
    unique_premium_users = db.scalar(
        select(func.count(func.distinct(PremiumInterestEvent.user_id))).where(
            PremiumInterestEvent.event_type == "PREMIUM_CLICK",
            PremiumInterestEvent.user_id.isnot(None)
        )
    ) or 0
    registered_premium_clicks = db.scalar(
        select(func.count(PremiumInterestEvent.id)).where(
            PremiumInterestEvent.event_type == "PREMIUM_CLICK",
            PremiumInterestEvent.user_id.isnot(None)
        )
    ) or 0
    unregistered_premium_clicks = db.scalar(
        select(func.count(PremiumInterestEvent.id)).where(
            PremiumInterestEvent.event_type == "PREMIUM_CLICK",
            PremiumInterestEvent.user_id.is_(None)
        )
    ) or 0
    total_premium_clicks = registered_premium_clicks + unregistered_premium_clicks

    # Free Clicks & Users
    unique_free_users = db.scalar(
        select(func.count(func.distinct(PremiumInterestEvent.user_id))).where(
            PremiumInterestEvent.event_type == "FREE_CLICK",
            PremiumInterestEvent.user_id.isnot(None)
        )
    ) or 0
    registered_free_clicks = db.scalar(
        select(func.count(PremiumInterestEvent.id)).where(
            PremiumInterestEvent.event_type == "FREE_CLICK",
            PremiumInterestEvent.user_id.isnot(None)
        )
    ) or 0
    unregistered_free_clicks = db.scalar(
        select(func.count(PremiumInterestEvent.id)).where(
            PremiumInterestEvent.event_type == "FREE_CLICK",
            PremiumInterestEvent.user_id.is_(None)
        )
    ) or 0
    total_free_clicks = registered_free_clicks + unregistered_free_clicks

    percentage = round((unique_premium_users / total_users) * 100, 2) if total_users > 0 else 0.0

    recent_events_stmt = (
        select(PremiumInterestEvent, User.email, User.full_name)
        .outerjoin(User, PremiumInterestEvent.user_id == User.id)
        .where(PremiumInterestEvent.event_type.in_(["PREMIUM_CLICK", "FREE_CLICK"]))
        .order_by(PremiumInterestEvent.created_at.desc())
        .limit(50)
    )
    results = db.execute(recent_events_stmt).all()

    recent_events = []
    for event, email, full_name in results:
        recent_events.append({
            "id": event.id,
            "user_id": event.user_id,
            "user_email": email if event.user_id else "Unregistered Guest",
            "user_full_name": full_name if event.user_id else "Guest User",
            "is_registered": bool(event.user_id),
            "event_type": event.event_type,
            "created_at": event.created_at.isoformat() if event.created_at else None
        })

    return {
        "success": True,
        "total_registered_users": total_users,
        "unique_users_clicked_premium": unique_premium_users,
        "registered_premium_clicks": registered_premium_clicks,
        "unregistered_premium_clicks": unregistered_premium_clicks,
        "total_premium_clicks": total_premium_clicks,
        "unique_users_clicked_free": unique_free_users,
        "registered_free_clicks": registered_free_clicks,
        "unregistered_free_clicks": unregistered_free_clicks,
        "total_free_clicks": total_free_clicks,
        "premium_interest_percentage": percentage,
        "recent_events": recent_events
    }

