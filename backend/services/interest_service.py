"""
Interest Service — handles the full interest lifecycle.

Duplicate prevention semantics (service-layer enforced):
  - ACTIVE statuses: PENDING, ACCEPTED, MATCHED
  - Only one ACTIVE interest may exist per (sender_user_id, receiver_user_id) pair.
  - DECLINED and WITHDRAWN are HISTORICAL and do NOT block re-sending.
  - There is NO database UniqueConstraint on (sender_user_id, receiver_user_id)
    because SQLite cannot apply a conditional unique constraint scoped to
    specific statuses. The service layer enforces this instead.

Reciprocal interest (MATCHED) semantics:
  - When B sends interest to A and A already has a PENDING interest toward B,
    both interests are updated to MATCHED simultaneously.
  - This creates a clear "mutual connection" state for both parties.
  - No new interest record is created; the existing PENDING record for A→B
    is updated to MATCHED, and the new B→A record is created as MATCHED.

Privacy: extract_public_profile_dict() from discovery_service is reused.
No email, phone, password, session, or moderation data is exposed.
"""
import math
from datetime import datetime, timezone
from typing import Optional, Tuple, Dict, Any, List
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, func, desc, or_, case

from backend.models.user import User
from backend.models.biodata import BiodataProfileModel
from backend.models.interest import InterestModel
from backend.models.enums import InterestStatus, ProfileModerationStatus, UserStatus, NotificationType
from backend.services.discovery_service import extract_public_profile_dict
from backend.services.notification_service import create_notification


# ── Helpers ────────────────────────────────────────────────────────────────


def _active_statuses() -> List[InterestStatus]:
    return [InterestStatus.PENDING, InterestStatus.ACCEPTED, InterestStatus.MATCHED]


def _find_active_interest(db: Session, sender_user_id: str, receiver_user_id: str) -> Optional[InterestModel]:
    """Find an existing ACTIVE (PENDING/ACCEPTED/MATCHED) interest from sender to receiver."""
    return db.scalar(
        select(InterestModel)
        .where(InterestModel.sender_user_id == sender_user_id)
        .where(InterestModel.receiver_user_id == receiver_user_id)
        .where(InterestModel.status.in_(_active_statuses()))
    )


def _build_profile_summary(profile: Optional[BiodataProfileModel]) -> Optional[Dict[str, Any]]:
    """Build a safe public profile summary from a BiodataProfileModel."""
    if not profile:
        return None
    try:
        raw = extract_public_profile_dict(profile)
        # Only return the whitelisted subset used in interest/shortlist responses
        return {
            "id": raw.get("id", profile.id),
            "slug": raw.get("slug", getattr(profile, "slug", None)),
            "user_id": getattr(profile, "user_id", None),
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
            "slug": getattr(profile, "slug", None),
            "user_id": getattr(profile, "user_id", None),
            "display_name": "Candidate",
            "gender": None,
            "age": None,
            "city": None,
            "state": None,
            "education": None,
            "occupation": None,
            "profile_picture_url": None,
        }


def _load_interest_with_profiles(db: Session, interest_id: str) -> Optional[InterestModel]:
    return db.scalar(
        select(InterestModel)
        .where(InterestModel.id == interest_id)
        .options(
            joinedload(InterestModel.sender),
            joinedload(InterestModel.receiver),
            joinedload(InterestModel.sender_profile).joinedload(BiodataProfileModel.user),
            joinedload(InterestModel.receiver_profile).joinedload(BiodataProfileModel.user),
        )
    )


def _interest_to_dict(interest: InterestModel, perspective_user_id: str) -> Dict[str, Any]:
    """
    Serialize an interest from the perspective of a specific user.
    'profile' is always the OTHER party's profile.
    """
    if interest.sender_user_id == perspective_user_id:
        other_profile = interest.receiver_profile
    else:
        other_profile = interest.sender_profile

    return {
        "id": interest.id,
        "status": interest.status,
        "created_at": interest.created_at,
        "updated_at": interest.updated_at,
        "responded_at": interest.responded_at,
        "sender_user_id": interest.sender_user_id,
        "receiver_user_id": interest.receiver_user_id,
        "sender_profile_id": interest.sender_profile_id,
        "receiver_profile_id": interest.receiver_profile_id,
        "profile": _build_profile_summary(other_profile),
    }


# ── Send Interest ───────────────────────────────────────────────────────────


def send_interest(
    db: Session,
    sender: User,
    target_profile_id: str,
) -> Tuple[bool, int, str, Optional[Dict[str, Any]]]:
    """
    Send an interest to a target profile.
    Returns (success, http_status, message, interest_dict).
    """
    # 1. Sender must be ACTIVE
    if sender.status != UserStatus.ACTIVE:
        return False, 403, "Your account is not active.", None

    # 2. Load target profile (by id, user_id, or slug)
    target_profile = db.scalar(
        select(BiodataProfileModel)
        .where(
            or_(
                BiodataProfileModel.id == target_profile_id,
                BiodataProfileModel.user_id == target_profile_id,
                BiodataProfileModel.slug == target_profile_id,
            )
        )
        .options(joinedload(BiodataProfileModel.user))
    )
    if not target_profile:
        return False, 404, "Profile not found.", None

    if not target_profile.user_id:
        return False, 400, "This profile does not have an active user account associated.", None

    # 3. Cannot send to self
    if target_profile.user_id == sender.id:
        return False, 400, "You cannot send interest to your own profile.", None

    # 4. Target user must be ACTIVE
    target_user = target_profile.user
    if not target_user or target_user.status != UserStatus.ACTIVE:
        return False, 400, "The profile owner's account is not active.", None

    # Target profile must be APPROVED
    if target_profile.moderation_status != ProfileModerationStatus.APPROVED:
        return False, 403, "Cannot send interest to an unapproved profile.", None

    # 5. Check for existing ACTIVE interest (sender → receiver)
    existing = _find_active_interest(db, sender.id, target_profile.user_id)
    if existing:
        # Return safe info about the existing state instead of creating a duplicate
        existing_with_profiles = _load_interest_with_profiles(db, existing.id)
        return True, 200, f"Interest already exists with status: {existing.status.value}", \
            _interest_to_dict(existing_with_profiles, sender.id)

    # 6. Detect sender's own profile for sender_profile_id & display names
    sender_profile = db.scalar(
        select(BiodataProfileModel)
        .where(BiodataProfileModel.user_id == sender.id)
        .order_by(
            case((BiodataProfileModel.moderation_status == ProfileModerationStatus.APPROVED, 1), else_=2),
            desc(BiodataProfileModel.updated_at)
        )
    )

    sender_name = None
    if sender_profile and sender_profile.profile_data and isinstance(sender_profile.profile_data, dict):
        sender_name = sender_profile.profile_data.get("fullName") or sender_profile.profile_data.get("name")
    if not sender_name:
        sender_name = sender.full_name
    if not sender_name:
        sender_name = "Someone"

    target_name = None
    if target_profile and target_profile.profile_data and isinstance(target_profile.profile_data, dict):
        target_name = target_profile.profile_data.get("fullName") or target_profile.profile_data.get("name")
    if not target_name and target_user:
        target_name = target_user.full_name
    if not target_name:
        target_name = "a candidate"

    sender_pic = None
    if sender_profile and sender_profile.profile_data:
        p_data = sender_profile.profile_data
        if isinstance(p_data, dict):
            pic = p_data.get("profilePictureUrl") or p_data.get("photoUrl") or p_data.get("photo")
            if pic and not pic.startswith("data:") and len(pic) <= 2048:
                sender_pic = pic

    target_pic = None
    if target_profile and target_profile.profile_data:
        t_data = target_profile.profile_data
        if isinstance(t_data, dict):
            pic = t_data.get("profilePictureUrl") or t_data.get("photoUrl") or t_data.get("photo")
            if pic and not pic.startswith("data:") and len(pic) <= 2048:
                target_pic = pic

    # 7. Check for reciprocal pending interest (receiver → sender already PENDING)
    reciprocal = db.scalar(
        select(InterestModel)
        .where(InterestModel.sender_user_id == target_profile.user_id)
        .where(InterestModel.receiver_user_id == sender.id)
        .where(InterestModel.status == InterestStatus.PENDING)
    )

    now = datetime.now(timezone.utc)

    if reciprocal:
        # MATCHED: update reciprocal to MATCHED and create new MATCHED record
        reciprocal.status = InterestStatus.MATCHED
        reciprocal.updated_at = now
        reciprocal.responded_at = now

        new_interest = InterestModel(
            sender_user_id=sender.id,
            receiver_user_id=target_profile.user_id,
            sender_profile_id=sender_profile.id if sender_profile else None,
            receiver_profile_id=target_profile.id,
            status=InterestStatus.MATCHED,
            responded_at=now,
        )
        db.add(new_interest)
        db.flush()

        # Notifications for MUTUAL INTEREST — both parties
        create_notification(
            db, sender.id,
            NotificationType.MUTUAL_INTEREST,
            "Mutual Interest! 🎉",
            f"You and {target_name} have expressed mutual interest!",
            related_entity_id=new_interest.id,
            image_url=target_pic,
        )
        create_notification(
            db, target_profile.user_id,
            NotificationType.MUTUAL_INTEREST,
            "Mutual Interest! 🎉",
            f"You and {sender_name} have expressed mutual interest!",
            related_entity_id=reciprocal.id,
            image_url=sender_pic,
        )
        db.commit()

        result = _load_interest_with_profiles(db, new_interest.id)
        return True, 201, "Mutual interest established!", _interest_to_dict(result, sender.id)

    # 8. Normal: create PENDING interest
    new_interest = InterestModel(
        sender_user_id=sender.id,
        receiver_user_id=target_profile.user_id,
        sender_profile_id=sender_profile.id if sender_profile else None,
        receiver_profile_id=target_profile.id,
        status=InterestStatus.PENDING,
    )
    db.add(new_interest)
    db.flush()

    # 9. Notify recipient
    create_notification(
        db, target_profile.user_id,
        NotificationType.INTEREST_RECEIVED,
        "New Interest Received 💌",
        f"{sender_name} has expressed interest in your profile!",
        related_entity_id=new_interest.id,
        image_url=sender_pic,
    )
    db.commit()

    result = _load_interest_with_profiles(db, new_interest.id)
    return True, 201, "Interest sent successfully.", _interest_to_dict(result, sender.id)


# ── Withdraw Interest ────────────────────────────────────────────────────────


def withdraw_interest(
    db: Session,
    interest_id: str,
    current_user: User,
) -> Tuple[bool, int, str, Optional[Dict[str, Any]]]:
    """Sender withdraws a PENDING interest."""
    interest = _load_interest_with_profiles(db, interest_id)
    if not interest:
        return False, 404, "Interest not found.", None

    if interest.sender_user_id != current_user.id:
        return False, 403, "Only the sender can withdraw an interest.", None

    if interest.status != InterestStatus.PENDING:
        return False, 400, f"Only PENDING interests can be withdrawn. Current status: {interest.status.value}", None

    now = datetime.now(timezone.utc)
    interest.status = InterestStatus.WITHDRAWN
    interest.updated_at = now
    interest.responded_at = now

    # Notify recipient that interest was withdrawn
    create_notification(
        db, interest.receiver_user_id,
        NotificationType.INTEREST_WITHDRAWN,
        "Interest Withdrawn",
        f"An interest sent to your profile has been withdrawn.",
        related_entity_id=interest.id,
    )
    db.commit()

    return True, 200, "Interest withdrawn.", _interest_to_dict(interest, current_user.id)


# ── Accept Interest ──────────────────────────────────────────────────────────


def accept_interest(
    db: Session,
    interest_id: str,
    current_user: User,
) -> Tuple[bool, int, str, Optional[Dict[str, Any]]]:
    """Receiver accepts a PENDING interest."""
    interest = _load_interest_with_profiles(db, interest_id)
    if not interest:
        return False, 404, "Interest not found.", None

    if interest.receiver_user_id != current_user.id:
        return False, 403, "Only the recipient can accept an interest.", None

    if interest.status != InterestStatus.PENDING:
        return False, 400, f"Only PENDING interests can be accepted. Current status: {interest.status.value}", None

    # Verify both parties still active
    if interest.sender and interest.sender.status != UserStatus.ACTIVE:
        return False, 400, "The interest sender's account is no longer active.", None

    now = datetime.now(timezone.utc)
    interest.status = InterestStatus.ACCEPTED
    interest.updated_at = now
    interest.responded_at = now

    receiver_profile = db.scalar(
        select(BiodataProfileModel)
        .where(BiodataProfileModel.user_id == current_user.id)
        .order_by(
            case((BiodataProfileModel.moderation_status == ProfileModerationStatus.APPROVED, 1), else_=2),
            desc(BiodataProfileModel.updated_at)
        )
    )
    receiver_pic = None
    if receiver_profile and receiver_profile.profile_data and isinstance(receiver_profile.profile_data, dict):
        pic = (
            receiver_profile.profile_data.get("profilePictureUrl")
            or receiver_profile.profile_data.get("photoUrl")
            or receiver_profile.profile_data.get("photo")
        )
        if pic and not pic.startswith("data:") and len(pic) <= 2048:
            receiver_pic = pic

    receiver_name = None
    if receiver_profile and receiver_profile.profile_data and isinstance(receiver_profile.profile_data, dict):
        receiver_name = receiver_profile.profile_data.get("fullName") or receiver_profile.profile_data.get("name")
    if not receiver_name:
        receiver_name = current_user.full_name
    if not receiver_name:
        receiver_name = "Candidate"

    # Notify sender
    create_notification(
        db, interest.sender_user_id,
        NotificationType.INTEREST_ACCEPTED,
        "Interest Accepted! 💚",
        f"Your interest has been accepted by {receiver_name}! A connection has been established.",
        related_entity_id=interest.id,
        image_url=receiver_pic,
    )
    db.commit()

    return True, 200, "Interest accepted.", _interest_to_dict(interest, current_user.id)


# ── Decline Interest ─────────────────────────────────────────────────────────


def decline_interest(
    db: Session,
    interest_id: str,
    current_user: User,
) -> Tuple[bool, int, str, Optional[Dict[str, Any]]]:
    """Receiver declines a PENDING interest."""
    interest = _load_interest_with_profiles(db, interest_id)
    if not interest:
        return False, 404, "Interest not found.", None

    if interest.receiver_user_id != current_user.id:
        return False, 403, "Only the recipient can decline an interest.", None

    if interest.status != InterestStatus.PENDING:
        return False, 400, f"Only PENDING interests can be declined. Current status: {interest.status.value}", None

    now = datetime.now(timezone.utc)
    interest.status = InterestStatus.DECLINED
    interest.updated_at = now
    interest.responded_at = now

    # Notify sender
    create_notification(
        db, interest.sender_user_id,
        NotificationType.INTEREST_DECLINED,
        "Interest Update",
        f"Your interest was not accepted at this time.",
        related_entity_id=interest.id,
    )
    db.commit()

    return True, 200, "Interest declined.", _interest_to_dict(interest, current_user.id)


# ── List Sent Interests ──────────────────────────────────────────────────────


def list_sent_interests(
    db: Session,
    user_id: str,
    page: int = 1,
    page_size: int = 20,
    status_filter: Optional[str] = None,
) -> Dict[str, Any]:
    stmt = (
        select(InterestModel)
        .where(InterestModel.sender_user_id == user_id)
        .options(
            joinedload(InterestModel.receiver_profile).joinedload(BiodataProfileModel.user),
        )
        .order_by(desc(InterestModel.created_at))
    )
    if status_filter:
        try:
            s = InterestStatus(status_filter.upper())
            stmt = stmt.where(InterestModel.status == s)
        except ValueError:
            pass

    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    offset = (page - 1) * page_size
    interests = list(db.scalars(stmt.offset(offset).limit(page_size)).all())
    total_pages = math.ceil(total / page_size) if total > 0 else 0

    return {
        "data": [_interest_to_dict(i, user_id) for i in interests],
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
    }


# ── List Received Interests ──────────────────────────────────────────────────


def list_received_interests(
    db: Session,
    user_id: str,
    page: int = 1,
    page_size: int = 20,
    status_filter: Optional[str] = None,
) -> Dict[str, Any]:
    stmt = (
        select(InterestModel)
        .where(InterestModel.receiver_user_id == user_id)
        .options(
            joinedload(InterestModel.sender_profile).joinedload(BiodataProfileModel.user),
        )
        .order_by(desc(InterestModel.created_at))
    )
    if status_filter:
        try:
            s = InterestStatus(status_filter.upper())
            stmt = stmt.where(InterestModel.status == s)
        except ValueError:
            pass

    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    offset = (page - 1) * page_size
    interests = list(db.scalars(stmt.offset(offset).limit(page_size)).all())
    total_pages = math.ceil(total / page_size) if total > 0 else 0

    return {
        "data": [_interest_to_dict(i, user_id) for i in interests],
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
    }
