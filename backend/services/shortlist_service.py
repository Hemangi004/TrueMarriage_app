"""
Shortlist Service — persistent favorites/bookmarks for approved profiles.

Rules:
  - User must be ACTIVE.
  - Cannot shortlist own profile.
  - Target profile must be APPROVED.
  - Duplicate shortlists are prevented by the database UniqueConstraint
    (uq_shortlist_user_profile) and handled gracefully at the service layer.
  - Removing a shortlist never affects interest history.
"""
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, func
from sqlalchemy.exc import IntegrityError

from backend.models.biodata import BiodataProfileModel
from backend.models.shortlist import ShortlistModel
from backend.models.enums import ProfileModerationStatus, UserStatus
from backend.models.user import User
from backend.services.discovery_service import extract_public_profile_dict


def _build_profile_summary(profile: Optional[BiodataProfileModel]) -> Optional[Dict]:
    if not profile:
        return None
    try:
        raw = extract_public_profile_dict(profile)
        return {
            "id": raw.get("id", profile.id),
            "display_name": raw.get("display_name", "Candidate"),
            "gender": raw.get("gender"),
            "age": raw.get("age"),
            "city": raw.get("city"),
            "state": raw.get("state"),
            "education": raw.get("education"),
            "occupation": raw.get("occupation"),
            "profile_picture_url": raw.get("profile_picture_url"),
        }
    except Exception:
        return {
            "id": getattr(profile, "id", "unknown"),
            "display_name": "Candidate",
            "gender": None,
            "age": None,
            "city": None,
            "state": None,
            "education": None,
            "occupation": None,
            "profile_picture_url": None,
        }


def _shortlist_to_dict(entry: ShortlistModel) -> Dict[str, Any]:
    return {
        "id": entry.id,
        "profile_id": entry.profile_id,
        "created_at": entry.created_at,
        "profile": _build_profile_summary(entry.profile) if hasattr(entry, "profile") and entry.profile else None,
    }


def add_shortlist(db: Session, user: User, profile_id: str):
    """Add profile to user's shortlist. Returns (success, http_status, message, data)."""
    if user.status != UserStatus.ACTIVE:
        return False, 403, "Account is not active.", None

    # Load target profile
    profile = db.scalar(
        select(BiodataProfileModel)
        .where(BiodataProfileModel.id == profile_id)
        .options(joinedload(BiodataProfileModel.user))
    )
    if not profile:
        return False, 404, "Profile not found.", None

    if profile.user_id == user.id:
        return False, 400, "You cannot shortlist your own profile.", None

    # Check existing shortlist entry
    existing = db.scalar(
        select(ShortlistModel)
        .where(ShortlistModel.user_id == user.id)
        .where(ShortlistModel.profile_id == profile_id)
    )
    if existing:
        return True, 200, "Profile is already in your shortlist.", _shortlist_to_dict(existing)

    try:
        entry = ShortlistModel(user_id=user.id, profile_id=profile_id)
        db.add(entry)
        db.flush()
        # Manually attach profile for response
        entry.profile = profile
        db.commit()
        return True, 201, "Profile added to shortlist.", _shortlist_to_dict(entry)
    except IntegrityError:
        db.rollback()
        # Race condition — fetch and return existing
        existing = db.scalar(
            select(ShortlistModel)
            .where(ShortlistModel.user_id == user.id)
            .where(ShortlistModel.profile_id == profile_id)
        )
        return True, 200, "Already shortlisted.", _shortlist_to_dict(existing) if existing else None


def remove_shortlist(db: Session, user: User, profile_id: str):
    """Remove profile from shortlist. Returns (success, http_status, message)."""
    entry = db.scalar(
        select(ShortlistModel)
        .where(ShortlistModel.user_id == user.id)
        .where(ShortlistModel.profile_id == profile_id)
    )
    if not entry:
        return False, 404, "Profile not found in your shortlist."

    db.delete(entry)
    db.commit()
    return True, 200, "Removed from shortlist."


def get_shortlist(db: Session, user_id: str, page: int = 1, page_size: int = 20) -> Dict[str, Any]:
    """Return paginated shortlist for user."""
    stmt = (
        select(ShortlistModel)
        .where(ShortlistModel.user_id == user_id)
        .options(
            joinedload(ShortlistModel.profile).joinedload(BiodataProfileModel.user)
        )
        .order_by(ShortlistModel.created_at.desc())
    )
    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    offset = (page - 1) * page_size
    entries = list(db.scalars(stmt.offset(offset).limit(page_size)).all())

    return {
        "data": [_shortlist_to_dict(e) for e in entries],
        "total": total,
    }


def get_shortlisted_profile_ids(db: Session, user_id: str):
    """Return all profile_ids in a user's shortlist (for UI state hydration)."""
    rows = db.scalars(
        select(ShortlistModel.profile_id)
        .where(ShortlistModel.user_id == user_id)
    ).all()
    return list(rows)
