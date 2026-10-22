import math
from datetime import datetime, timezone
from typing import Tuple, List, Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, func, or_, asc, desc
from backend.models.user import User
from backend.models.biodata import BiodataProfileModel
from backend.models.enums import ProfileModerationStatus

ALLOWED_PROFILE_SORT_FIELDS = {
    "created_at": BiodataProfileModel.created_at,
    "updated_at": BiodataProfileModel.updated_at,
    "submitted_at": BiodataProfileModel.submitted_at,
    "status": BiodataProfileModel.moderation_status,
}


def list_profiles_paginated(
    db: Session,
    page: int = 1,
    page_size: int = 20,
    search: Optional[str] = None,
    status_filter: Optional[ProfileModerationStatus] = None,
    sort_by: str = "submitted_at",
    sort_order: str = "desc"
) -> Tuple[List[dict], int, int]:
    """
    Retrieves paginated, searchable, and filtered list of profiles for admin moderation.
    """
    if page < 1:
        raise ValueError("Page index must be >= 1")

    if page_size < 1 or page_size > 100:
        raise ValueError("Page size must be between 1 and 100")

    sort_field = ALLOWED_PROFILE_SORT_FIELDS.get(sort_by.lower(), BiodataProfileModel.created_at)
    sort_func = desc if sort_order.lower() == "desc" else asc

    stmt = select(BiodataProfileModel).outerjoin(User, BiodataProfileModel.user_id == User.id)

    if search and search.strip():
        pattern = f"%{search.strip()}%"
        stmt = stmt.where(
            or_(
                User.email.ilike(pattern),
                User.full_name.ilike(pattern),
                BiodataProfileModel.id.ilike(pattern),
                func.json_extract(BiodataProfileModel.profile_data, "$.fullName").ilike(pattern),
                func.json_extract(BiodataProfileModel.profile_data, "$.name").ilike(pattern)
            )
        )

    if status_filter:
        stmt = stmt.where(BiodataProfileModel.moderation_status == status_filter)

    # Compute Total Count
    count_stmt = select(func.count()).select_from(stmt.subquery())
    total_count = db.scalar(count_stmt) or 0

    # Apply Sorting & Pagination using 2-phase ID pagination
    total_pages = math.ceil(total_count / page_size) if total_count > 0 else 0
    if total_count == 0:
        return [], 0, 0

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

    fetch_stmt = (
        select(BiodataProfileModel)
        .where(BiodataProfileModel.id.in_(page_ids))
        .options(joinedload(BiodataProfileModel.user))
    )
    profile_map = {p.id: p for p in db.scalars(fetch_stmt).unique().all()}
    profiles = [profile_map[pid] for pid in page_ids if pid in profile_map]

    result_data = []
    for p in profiles:
        p_data = p.profile_data or {}
        display_name = p_data.get("fullName") or p_data.get("name") or (p.user.full_name if p.user else "Anonymous Candidate")
        user_email = (p.user.email if p.user else None) or p_data.get("email") or "unregistered@candidate.local"

        result_data.append({
            "id": p.id,
            "user_id": p.user_id or "anonymous",
            "user_full_name": display_name,
            "user_email": user_email,
            "moderation_status": p.moderation_status,
            "submitted_at": p.submitted_at,
            "reviewed_at": p.reviewed_at,
            "reviewed_by": p.reviewed_by,
            "rejection_reason": p.rejection_reason,
            "created_at": p.created_at,
            "updated_at": p.updated_at,
        })

    return result_data, total_count, total_pages


def get_admin_profile_detail(db: Session, profile_id: str) -> Optional[dict]:
    """
    Retrieves full administrative detail for a profile including payload and moderation metadata.
    """
    stmt = select(BiodataProfileModel).where(BiodataProfileModel.id == profile_id).options(
        joinedload(BiodataProfileModel.user),
        joinedload(BiodataProfileModel.reviewer)
    )
    profile = db.scalar(stmt)
    if not profile:
        return None

    return {
        "id": profile.id,
        "user_id": profile.user_id,
        "user_full_name": profile.user.full_name if profile.user else None,
        "user_email": profile.user.email if profile.user else "unknown@example.com",
        "moderation_status": profile.moderation_status,
        "profile_data": profile.profile_data or {},
        "submitted_at": profile.submitted_at,
        "reviewed_at": profile.reviewed_at,
        "reviewed_by": profile.reviewed_by,
        "reviewer_email": profile.reviewer.email if profile.reviewer else None,
        "rejection_reason": profile.rejection_reason,
        "published_at": profile.published_at,
        "created_at": profile.created_at,
        "updated_at": profile.updated_at,
    }


def approve_profile(db: Session, admin_id: str, profile_id: str) -> Tuple[bool, str, Optional[dict]]:
    """
    Approves a profile for public publishing.
    """
    stmt = select(BiodataProfileModel).where(BiodataProfileModel.id == profile_id)
    profile = db.scalar(stmt)
    if not profile:
        return False, "Profile not found.", None

    now = datetime.now(timezone.utc)
    profile.moderation_status = ProfileModerationStatus.APPROVED
    profile.reviewed_by = admin_id
    profile.reviewed_at = now
    profile.published_at = now
    profile.rejection_reason = None
    profile.updated_at = now

    db.commit()
    return True, "Profile approved successfully.", get_admin_profile_detail(db, profile_id)


def reject_profile(db: Session, admin_id: str, profile_id: str, reason: str) -> Tuple[bool, str, Optional[dict]]:
    """
    Rejects a profile with a required administrative reason.
    """
    if not reason or not reason.strip():
        return False, "A rejection reason is required.", None

    stmt = select(BiodataProfileModel).where(BiodataProfileModel.id == profile_id)
    profile = db.scalar(stmt)
    if not profile:
        return False, "Profile not found.", None

    now = datetime.now(timezone.utc)
    profile.moderation_status = ProfileModerationStatus.REJECTED
    profile.reviewed_by = admin_id
    profile.reviewed_at = now
    profile.rejection_reason = reason.strip()
    profile.updated_at = now

    db.commit()
    return True, "Profile rejected with feedback.", get_admin_profile_detail(db, profile_id)


def request_changes_profile(db: Session, admin_id: str, profile_id: str, reason: str) -> Tuple[bool, str, Optional[dict]]:
    """
    Requests changes for a profile with required feedback.
    """
    if not reason or not reason.strip():
        return False, "A feedback reason is required when requesting changes.", None

    stmt = select(BiodataProfileModel).where(BiodataProfileModel.id == profile_id)
    profile = db.scalar(stmt)
    if not profile:
        return False, "Profile not found.", None

    now = datetime.now(timezone.utc)
    profile.moderation_status = ProfileModerationStatus.CHANGES_REQUESTED
    profile.reviewed_by = admin_id
    profile.reviewed_at = now
    profile.rejection_reason = reason.strip()
    profile.updated_at = now

    db.commit()
    return True, "Changes requested successfully.", get_admin_profile_detail(db, profile_id)
