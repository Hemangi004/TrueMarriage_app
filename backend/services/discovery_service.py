import math
import re
import json
from datetime import datetime, date, timezone
from typing import Tuple, List, Optional, Dict, Any
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, func, or_, and_, asc, desc
from backend.models.user import User
from backend.models.biodata import BiodataProfileModel
from backend.models.profile_analytics import ProfileAnalyticsModel
from backend.models.enums import ProfileModerationStatus
from backend.core.security import get_password_hash, verify_password


def slugify(text: str) -> str:
    if not text:
        return "profile"
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text.strip('-') or "profile"


def generate_unique_slug(db: Session, base_name: str, current_profile_id: Optional[str] = None) -> str:
    base_slug = slugify(base_name)
    slug = base_slug
    counter = 1

    while True:
        stmt = select(BiodataProfileModel).where(BiodataProfileModel.slug == slug)
        if current_profile_id:
            stmt = stmt.where(BiodataProfileModel.id != current_profile_id)
        existing = db.scalar(stmt)
        if not existing:
            return slug
        counter += 1
        slug = f"{base_slug}-{counter}"


def calculate_age_from_dob(dob_str: Optional[str]) -> Optional[int]:
    """
    Calculates exact age in years from DOB string ('YYYY-MM-DD').
    """
    if not dob_str:
        return None
    try:
        birth_date = datetime.strptime(str(dob_str).split("T")[0], "%Y-%m-%d").date()
        today = date.today()
        return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
    except Exception:
        return None


def extract_public_profile_dict(
    profile: BiodataProfileModel,
    include_contacts: bool = True,
    viewer: Optional[User] = None
) -> Dict[str, Any]:
    """
    Strict Whitelist Extraction: Maps BiodataProfileModel to safe public fields.
    If hide_contact_details is True, contact details are ONLY accessible by
    premium users, admins, or the profile owner. Non-premium viewers receive a locked/masked preview.
    Zero passwords, OTPs, session tokens, or internal secrets exposed!
    """
    import json
    p_data = profile.profile_data or {}
    if isinstance(p_data, str):
        try:
            p_data = json.loads(p_data)
        except Exception:
            p_data = {}
    if not isinstance(p_data, dict):
        p_data = {}

    user_name = profile.user.full_name if profile.user else None
    display_name = p_data.get("fullName") or p_data.get("name") or user_name or "Anonymous Candidate"

    calc_age = calculate_age_from_dob(p_data.get("dob"))
    final_age = calc_age if calc_age is not None else (int(p_data.get("age")) if p_data.get("age") and str(p_data.get("age")).isdigit() else None)

    # Ensure slug exists
    effective_slug = profile.slug or slugify(display_name)

    raw_gender = (
        p_data.get("gender")
        or (p_data.get("personalDetails", {}).get("gender") if isinstance(p_data.get("personalDetails"), dict) else None)
        or p_data.get("sex")
    )
    extracted_gender = None
    if raw_gender:
        rg = str(raw_gender).strip().lower()
        if rg in ["female", "f", "bride", "girl", "woman"]:
            extracted_gender = "Female"
        elif rg in ["male", "m", "groom", "boy", "man"]:
            extracted_gender = "Male"
        else:
            extracted_gender = str(raw_gender).capitalize()

    # Family details extraction
    fam_type = p_data.get("familyType") or p_data.get("family_type")
    if fam_type:
        fam_type_str = "Joint Family" if "joint" in str(fam_type).lower() else "Nuclear Family"
    else:
        fam_type_str = "Nuclear Family"

    fam_vals = p_data.get("familyValues") or p_data.get("family_values")
    if fam_vals:
        fv_clean = str(fam_vals).strip()
        if "trad" in fv_clean.lower():
            fam_vals_str = "Traditional"
        elif "lib" in fv_clean.lower():
            fam_vals_str = "Liberal"
        else:
            fam_vals_str = "Moderate"
    else:
        fam_vals_str = "Moderate"

    # Siblings formatting
    siblings_str = p_data.get("siblings")
    if not siblings_str:
        b_count = p_data.get("brotherCount")
        s_count = p_data.get("sisterCount")
        parts = []
        if b_count is not None and str(b_count).isdigit() and int(b_count) > 0:
            parts.append(f"{b_count} Brother(s)")
        if s_count is not None and str(s_count).isdigit() and int(s_count) > 0:
            parts.append(f"{s_count} Sister(s)")
        if parts:
            siblings_str = ", ".join(parts)
        elif b_count == 0 and s_count == 0:
            siblings_str = "None"

    # Photos
    gallery = p_data.get("galleryPictures") or p_data.get("additionalPhotos") or []
    if not isinstance(gallery, list):
        gallery = []
    gallery = [str(g) for g in gallery if g]

    # Personality & Interests
    personality = p_data.get("personality") or p_data.get("personalityTraits") or p_data.get("skills") or []
    if not isinstance(personality, list):
        personality = [str(personality)] if personality else []
    else:
        personality = [str(p) for p in personality if p]

    interests = p_data.get("interests") or p_data.get("hobbies") or []
    if not isinstance(interests, list):
        interests = [str(interests)] if interests else []
    else:
        interests = [str(i) for i in interests if i]

    public_contact_phone = (
        p_data.get("contactTo")
        or p_data.get("contact_to")
        or p_data.get("publicContactNumber")
    )

    # Determine contact access rights
    is_owner = bool(viewer and profile.user_id == viewer.id)
    is_admin = bool(viewer and getattr(viewer, "role", None) == "ADMIN")
    is_premium = bool(viewer and getattr(viewer, "is_premium_active", False))
    can_access_contacts = is_owner or is_admin or is_premium

    raw_phone = (
        public_contact_phone
        or p_data.get("contactNumber")
        or p_data.get("phone")
        or (profile.user.phone if profile.user else None)
    )

    # Compute masked phone representation for non-premium preview
    masked_phone = None
    if raw_phone:
        clean_digits = re.sub(r"\D", "", str(raw_phone))
        if len(clean_digits) >= 6:
            prefix = clean_digits[:2]
            suffix = clean_digits[-2:]
            masked_phone = f"+91 {prefix}•••• ••{suffix}"
        else:
            masked_phone = "+91 ••••• •••••"

    is_contact_locked = bool(profile.hide_contact_details and not can_access_contacts)

    contact_obj = None
    if include_contacts and not is_contact_locked:
        contact_obj = {
            "phone": raw_phone,
            "contact_to": public_contact_phone,
            "email": p_data.get("email") or (profile.user.email if profile.user else None),
            "contact_person": p_data.get("contactPerson") or p_data.get("guardianName") or user_name,
            "relation": p_data.get("contactRelation") or p_data.get("relation") or "Self/Parent",
        }

    # Mother Tongue / Languages
    mother_tongue = p_data.get("motherTongue")
    if not mother_tongue:
        langs = p_data.get("languagesKnown")
        if isinstance(langs, list) and len(langs) > 0:
            mother_tongue = str(langs[0]) if langs[0] else None
        elif isinstance(langs, str) and langs.strip():
            mother_tongue = langs.split(",")[0].strip()

    # Education & College
    edu_val = p_data.get("education")
    college_val = p_data.get("college")
    edu_list = p_data.get("educationList")
    if isinstance(edu_list, list) and len(edu_list) > 0:
        first_edu = edu_list[0]
        if isinstance(first_edu, dict):
            if not edu_val:
                edu_val = first_edu.get("degree") or first_edu.get("qualification")
            if not college_val:
                college_val = first_edu.get("college") or first_edu.get("university")
        elif isinstance(first_edu, str) and not edu_val:
            edu_val = first_edu

    # Location parsing
    curr_city = p_data.get("currentCity") or p_data.get("city")
    curr_state = p_data.get("state")
    curr_addr = p_data.get("currentAddress")
    if isinstance(curr_addr, str) and curr_addr.strip():
        parts = [p.strip() for p in curr_addr.split(",") if p.strip()]
        if not curr_city and len(parts) > 0:
            curr_city = parts[0]
        if not curr_state and len(parts) > 1:
            curr_state = parts[1]

    return {
        "id": str(profile.id),
        "slug": str(effective_slug),
        "display_name": str(display_name),
        "gender": extracted_gender,
        "age": final_age,
        "height": p_data.get("height") or (f"{p_data.get('heightCm')} cm" if p_data.get("heightCm") else None),
        "religion": p_data.get("religion"),
        "caste": p_data.get("caste"),
        "mother_tongue": mother_tongue,
        "marital_status": p_data.get("maritalStatus"),
        "education": edu_val,
        "college": college_val,
        "occupation": p_data.get("occupation") or p_data.get("designation"),
        "company": p_data.get("company"),
        "annual_income": p_data.get("annualIncome") or p_data.get("salaryRange") or p_data.get("income"),
        "city": curr_city,
        "state": curr_state,
        "native_place": p_data.get("nativePlace"),
        "family_type": fam_type_str,
        "family_values": fam_vals_str,
        "father_name": p_data.get("fatherName") or p_data.get("father_name"),
        "father_occupation": p_data.get("fatherOccupation") or p_data.get("father_occupation"),
        "mother_name": p_data.get("motherName") or p_data.get("mother_name"),
        "mother_occupation": p_data.get("motherOccupation") or p_data.get("mother_occupation"),
        "siblings": siblings_str,
        "diet": p_data.get("diet") or "Vegetarian",
        "smoking": p_data.get("smoking") or "No",
        "drinking": p_data.get("drinking") or "No",
        "fitness": p_data.get("fitness"),
        "travel": p_data.get("travel"),
        "personality": personality,
        "interests": interests,
        "about_me": p_data.get("aboutMe") or p_data.get("professionalSummary"),
        "partner_expectations": p_data.get("partnerExpectations") or p_data.get("otherPreferences") or p_data.get("expectedProfession"),
        "marriage_timeline": p_data.get("marriageTimeline") or "Within 6-12 months",
        "profile_picture_url": p_data.get("profilePictureUrl") or p_data.get("photoUrl") or p_data.get("photo"),
        "original_profile_picture_url": p_data.get("originalProfilePictureUrl"),
        "photo_filter": p_data.get("profilePhotoFilter"),
        "additional_photos": gallery,
        "published_at": profile.published_at or profile.created_at,
        "is_password_protected": bool(profile.is_password_protected),
        "hide_contact_details": bool(profile.hide_contact_details),
        "is_contact_locked": is_contact_locked,
        "masked_phone": masked_phone,
        "contact_to": contact_obj.get("contact_to") if contact_obj else None,
        "contactTo": contact_obj.get("contact_to") if contact_obj else None,
        "phone": contact_obj.get("phone") if contact_obj else None,
        "contact_number": contact_obj.get("phone") if contact_obj else None,
        "contact_details": contact_obj,
    }


def list_discoverable_profiles(
    db: Session,
    current_user_id: Optional[str] = None,
    page: int = 1,
    page_size: int = 20,
    search: Optional[str] = None,
    gender: Optional[str] = None,
    min_age: Optional[int] = None,
    max_age: Optional[int] = None,
    location: Optional[str] = None,
    education: Optional[str] = None,
    occupation: Optional[str] = None,
    sort_by: str = "published_at",
    sort_order: str = "desc"
) -> Tuple[List[Dict[str, Any]], int, int]:
    """
    Queries APPROVED discoverable profiles with parameterized SQL search, filtering, and database pagination.
    Enforces CENTRAL RULES:
    1. Only moderation_status == APPROVED profiles are returned.
    2. Excludes authenticated user's own profile if current_user_id is provided.
    """
    if page < 1:
        raise ValueError("Page index must be >= 1")

    if page_size < 1 or page_size > 50:
        raise ValueError("Page size must be between 1 and 50")

    if min_age is not None and max_age is not None and min_age > max_age:
        raise ValueError("Minimum age cannot be greater than maximum age")

    if min_age is not None and (min_age < 18 or min_age > 100):
        raise ValueError("Min age must be between 18 and 100")

    if max_age is not None and (max_age < 18 or max_age > 100):
        raise ValueError("Max age must be between 18 and 100")

    # Base Query: All active profiles
    stmt = select(BiodataProfileModel).where(BiodataProfileModel.status != "ARCHIVED")

    # STRICT DISCOVERY RULE: If authenticated user has no gender selected in their profile,
    # do NOT show any discovery profiles.
    user_obj = None
    if current_user_id:
        user_profiles = db.scalars(
            select(BiodataProfileModel)
            .where(BiodataProfileModel.user_id == current_user_id)
            .order_by(desc(BiodataProfileModel.updated_at))
        ).all()
        has_user_gender = False
        for up in user_profiles:
            up_data = up.profile_data or {}
            if isinstance(up_data, str):
                try:
                    up_data = json.loads(up_data)
                except Exception:
                    up_data = {}
            if isinstance(up_data, dict):
                g = (
                    up_data.get("gender")
                    or up_data.get("sex")
                    or (up_data.get("personalDetails", {}).get("gender") if isinstance(up_data.get("personalDetails"), dict) else None)
                )
                if g and str(g).strip():
                    has_user_gender = True
                    break
        if not has_user_gender:
            return [], 0, 0

        # Exclude Current User's Own Profile
        stmt = stmt.where(
            or_(
                BiodataProfileModel.user_id.is_(None),
                BiodataProfileModel.user_id != current_user_id
            )
        )
        user_obj = db.get(User, current_user_id)

    is_mysql = False
    try:
        if db.bind and "mysql" in db.bind.dialect.name.lower():
            is_mysql = True
    except Exception:
        pass

    if is_mysql:
        # Candidate profile MUST have gender selected to be discoverable
        gender_field = func.nullif(func.json_unquote(func.json_extract(BiodataProfileModel.profile_data, "$.gender")), "null")
        stmt = stmt.where(gender_field.isnot(None), func.length(func.trim(gender_field)) > 0)
    else:
        # Candidate profile MUST have gender selected to be discoverable
        gender_field = func.json_extract(BiodataProfileModel.profile_data, "$.gender")
        stmt = stmt.where(gender_field.isnot(None), gender_field != "")

    # Search Query
    if search and search.strip():
        pattern = f"%{search.strip()}%"
        stmt = stmt.join(User, BiodataProfileModel.user_id == User.id, isouter=True).where(
            or_(
                User.full_name.ilike(pattern),
                BiodataProfileModel.id.ilike(pattern),
                func.json_extract(BiodataProfileModel.profile_data, "$.fullName").ilike(pattern),
                func.json_extract(BiodataProfileModel.profile_data, "$.occupation").ilike(pattern),
                func.json_extract(BiodataProfileModel.profile_data, "$.education").ilike(pattern),
                func.json_extract(BiodataProfileModel.profile_data, "$.currentCity").ilike(pattern),
            )
        )

    # Structured Filters
    if gender and gender.strip():
        stmt = stmt.where(func.json_extract(BiodataProfileModel.profile_data, "$.gender").ilike(gender.strip()))

    if location and location.strip():
        loc_pattern = f"%{location.strip()}%"
        stmt = stmt.where(
            or_(
                func.json_extract(BiodataProfileModel.profile_data, "$.currentCity").ilike(loc_pattern),
                func.json_extract(BiodataProfileModel.profile_data, "$.nativePlace").ilike(loc_pattern),
                func.json_extract(BiodataProfileModel.profile_data, "$.state").ilike(loc_pattern),
            )
        )

    if education and education.strip():
        stmt = stmt.where(func.json_extract(BiodataProfileModel.profile_data, "$.education").ilike(f"%{education.strip()}%"))

    if occupation and occupation.strip():
        stmt = stmt.where(func.json_extract(BiodataProfileModel.profile_data, "$.occupation").ilike(f"%{occupation.strip()}%"))

    # Compute Total Count Server-Side
    count_stmt = select(func.count()).select_from(stmt.subquery())
    total_count = db.scalar(count_stmt) or 0

    # Sorting
    if sort_by.lower() == "created_at":
        sort_field = BiodataProfileModel.created_at
    else:
        sort_field = BiodataProfileModel.published_at

    sort_func = desc if sort_order.lower() == "desc" else asc
    total_pages = math.ceil(total_count / page_size) if total_count > 0 else 0

    if total_count == 0:
        return [], 0, 0

    # 2-phase pagination: Query primary keys first with order_by & offset/limit
    # This ensures MySQL filesort never buffers large profile_data JSON blobs in memory
    offset = (page - 1) * page_size
    id_stmt = (
        stmt.with_only_columns(BiodataProfileModel.id)
        .order_by(sort_func(sort_field))
        .offset(offset)
        .limit(page_size)
    )
    page_ids = list(db.scalars(id_stmt).all())
    if not page_ids:
        return [], total_count, total_pages

    # Load full profiles for only the current page's IDs
    fetch_stmt = (
        select(BiodataProfileModel)
        .where(BiodataProfileModel.id.in_(page_ids))
        .options(joinedload(BiodataProfileModel.user))
    )
    profile_map = {p.id: p for p in db.scalars(fetch_stmt).unique().all()}
    profiles = [profile_map[pid] for pid in page_ids if pid in profile_map]

    # Post-filter Age range if min_age / max_age specified, and safely exclude current user's profile
    result_data = []
    for p in profiles:
        if current_user_id and p.user_id == current_user_id:
            continue

        p_data = p.profile_data or {}
        if user_obj:
            p_email = p_data.get("email")
            if user_obj.email and p_email and str(p_email).strip().lower() == str(user_obj.email).strip().lower():
                continue
            p_phone = p_data.get("phone") or p_data.get("contactNumber")
            if user_obj.phone and p_phone and str(p_phone).strip() == str(user_obj.phone).strip():
                continue

        extracted = extract_public_profile_dict(p, viewer=user_obj)

        if not extracted.get("gender"):
            continue

        p_age = extracted.get("age")

        if min_age is not None and (p_age is None or p_age < min_age):
            continue
        if max_age is not None and (p_age is None or p_age > max_age):
            continue

        result_data.append(extracted)

    return result_data, total_count, total_pages


def get_public_profile_detail(db: Session, profile_id: str, current_user_id: Optional[str] = None) -> Tuple[bool, int, str, Optional[Dict[str, Any]]]:
    """
    Fetches detailed public profile.
    Only returns 200 OK for ProfileModerationStatus.APPROVED profiles (or if profile owner/admin requested).
    Returns (success, http_status, error_message, profile_dict).
    """
    stmt = select(BiodataProfileModel).where(
        or_(BiodataProfileModel.id == profile_id, BiodataProfileModel.slug == profile_id)
    ).options(joinedload(BiodataProfileModel.user))
    profile = db.scalar(stmt)

    if not profile:
        return False, 404, "Profile not found.", None

    viewer = None
    if current_user_id:
        viewer = db.scalar(select(User).where(User.id == current_user_id))

    return True, 200, "Success", extract_public_profile_dict(profile, include_contacts=True, viewer=viewer)


def get_public_profile_by_slug_or_id(
    db: Session,
    identifier: str,
    visitor_user_id: Optional[str] = None,
    passcode: Optional[str] = None
) -> Tuple[bool, int, str, Optional[Dict[str, Any]], bool]:
    """
    SEO & Public Profile Lookup by Slug or ID.
    Supports password protection:
    If profile is password protected and viewer is not owner and passcode is incorrect,
    returns locked preview: { is_locked: True, display_name, photo_url, slug }.
    Returns (success, http_status, message, profile_dict, is_locked).
    """
    clean_identifier = identifier.lstrip("@").strip().lower()
    stmt = select(BiodataProfileModel).where(
        or_(
            func.lower(BiodataProfileModel.slug) == clean_identifier,
            func.lower(BiodataProfileModel.id) == clean_identifier,
            BiodataProfileModel.slug == identifier,
            BiodataProfileModel.id == identifier,
        )
    ).options(joinedload(BiodataProfileModel.user))
    profile = db.scalar(stmt)

    if not profile:
        # Self-healing fallback: match against candidate name or user full_name
        slug_hyphens_to_space = clean_identifier.replace("-", " ")
        fallback_stmt = select(BiodataProfileModel).join(BiodataProfileModel.user).where(
            or_(
                func.lower(User.full_name) == slug_hyphens_to_space,
                func.replace(func.lower(User.full_name), " ", "-") == clean_identifier,
            )
        ).options(joinedload(BiodataProfileModel.user))
        profile = db.scalar(fallback_stmt)
        if profile:
            if not profile.slug:
                profile.slug = clean_identifier
                try:
                    db.commit()
                except Exception:
                    db.rollback()

    if not profile:
        return False, 404, "Public profile not found.", None, False

    # Check if Password Protected
    is_owner = visitor_user_id and (profile.user_id == visitor_user_id)
    if profile.is_password_protected and not is_owner:
        valid_passcode = False
        if passcode and profile.passcode_hash:
            valid_passcode = verify_password(passcode, profile.passcode_hash)

        if not valid_passcode:
            # Return Locked Limited Preview
            p_data = profile.profile_data or {}
            user_name = profile.user.full_name if profile.user else None
            display_name = p_data.get("fullName") or p_data.get("name") or user_name or "Candidate Profile"

            locked_dict = {
                "id": profile.id,
                "slug": profile.slug or slugify(display_name),
                "display_name": display_name,
                "profile_picture_url": p_data.get("profilePictureUrl") or p_data.get("photoUrl"),
                "is_password_protected": True,
                "is_locked": True,
            }
            return True, 200, "Profile is password protected.", locked_dict, True

    viewer = None
    if visitor_user_id:
        viewer = db.scalar(select(User).where(User.id == visitor_user_id))

    extracted = extract_public_profile_dict(profile, include_contacts=True, viewer=viewer)
    extracted["is_locked"] = False
    return True, 200, "Success", extracted, False


def record_profile_view(
    db: Session,
    profile_id: str,
    source: str = "direct",
    visitor_user_id: Optional[str] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None
) -> bool:
    """
    Logs visitor view / QR scan event in ProfileAnalyticsModel.
    """
    stmt = select(BiodataProfileModel).where(
        or_(BiodataProfileModel.id == profile_id, BiodataProfileModel.slug == profile_id)
    )
    profile = db.scalar(stmt)
    if not profile:
        return False

    # Skip recording owner's own visits
    if visitor_user_id and profile.user_id == visitor_user_id:
        return False

    valid_sources = {"qr_scan", "direct", "search", "social"}
    clean_source = source if source in valid_sources else "direct"

    log_entry = ProfileAnalyticsModel(
        profile_id=profile.id,
        visitor_user_id=visitor_user_id,
        ip_address=ip_address[:64] if ip_address else None,
        user_agent=user_agent[:255] if user_agent else None,
        source=clean_source
    )
    db.add(log_entry)
    db.commit()
    return True


def get_profile_analytics_summary(db: Session, profile_id: str) -> Dict[str, Any]:
    """
    Retrieves visitor stats, unique count, QR scan count, and recent visitor log.
    """
    stmt = select(BiodataProfileModel).where(
        or_(BiodataProfileModel.id == profile_id, BiodataProfileModel.slug == profile_id)
    )
    profile = db.scalar(stmt)
    if not profile:
        return {}

    # Aggregate counts
    total_views = db.scalar(
        select(func.count(ProfileAnalyticsModel.id)).where(ProfileAnalyticsModel.profile_id == profile.id)
    ) or 0

    qr_scans = db.scalar(
        select(func.count(ProfileAnalyticsModel.id)).where(
            ProfileAnalyticsModel.profile_id == profile.id,
            ProfileAnalyticsModel.source == "qr_scan"
        )
    ) or 0

    direct_views = db.scalar(
        select(func.count(ProfileAnalyticsModel.id)).where(
            ProfileAnalyticsModel.profile_id == profile.id,
            ProfileAnalyticsModel.source == "direct"
        )
    ) or 0

    search_views = db.scalar(
        select(func.count(ProfileAnalyticsModel.id)).where(
            ProfileAnalyticsModel.profile_id == profile.id,
            ProfileAnalyticsModel.source == "search"
        )
    ) or 0

    unique_visitors = db.scalar(
        select(func.count(func.distinct(ProfileAnalyticsModel.ip_address))).where(ProfileAnalyticsModel.profile_id == profile.id)
    ) or 0

    # Recent visitors list (top 20)
    recent_logs = list(
        db.scalars(
            select(ProfileAnalyticsModel)
            .where(ProfileAnalyticsModel.profile_id == profile.id)
            .order_by(desc(ProfileAnalyticsModel.visited_at))
            .limit(20)
            .options(joinedload(ProfileAnalyticsModel.visitor))
        ).all()
    )

    visitors_list = []
    for log in recent_logs:
        visitors_list.append({
            "id": log.id,
            "visitor_name": log.visitor.full_name if log.visitor else "Anonymous Visitor",
            "source": log.source,
            "visited_at": log.visited_at,
            "ip_address": log.ip_address,
        })

    p_data = profile.profile_data or {}
    display_name = p_data.get("name") or p_data.get("fullName") or (profile.user.full_name if profile.user else "Candidate")
    effective_slug = profile.slug or slugify(display_name)

    return {
        "success": True,
        "profile_id": profile.id,
        "slug": effective_slug,
        "total_views": total_views,
        "unique_visitors": unique_visitors,
        "qr_scans": qr_scans,
        "direct_views": direct_views,
        "search_views": search_views,
        "recent_visitors": visitors_list
    }


def update_profile_privacy_settings(
    db: Session,
    profile_id: str,
    user_id: str,
    slug: Optional[str] = None,
    is_password_protected: Optional[bool] = None,
    passcode: Optional[str] = None,
    hide_contact_details: Optional[bool] = None
) -> Tuple[bool, str, Optional[BiodataProfileModel]]:
    """
    Updates profile slug, passcode protection, and contact hiding settings.
    """
    stmt = select(BiodataProfileModel).where(
        BiodataProfileModel.id == profile_id,
        BiodataProfileModel.user_id == user_id
    )
    profile = db.scalar(stmt)
    if not profile:
        return False, "Profile not found or access denied.", None

    if slug is not None and slug.strip():
        new_slug = generate_unique_slug(db, slug.strip(), current_profile_id=profile.id)
        profile.slug = new_slug

    if is_password_protected is not None:
        profile.is_password_protected = is_password_protected
        if is_password_protected and passcode:
            profile.passcode_hash = get_password_hash(passcode)
        elif not is_password_protected:
            profile.passcode_hash = None

    if passcode and profile.is_password_protected:
        profile.passcode_hash = get_password_hash(passcode)

    if hide_contact_details is not None:
        profile.hide_contact_details = hide_contact_details

    db.commit()
    db.refresh(profile)
    return True, "Settings updated successfully.", profile

