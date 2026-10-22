"""
Notification Service — creates persistent in-app notifications.

Rules:
  - Notifications are created server-side only.
  - Sensitive data (email, phone, tokens, hashes) is NEVER stored in notifications.
  - A user can only access their own notifications (enforced at the route layer).
"""
import math
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, func, desc, or_, case
from backend.models.notification import NotificationModel
from backend.models.interest import InterestModel
from backend.models.biodata import BiodataProfileModel
from backend.models.user import User
from backend.models.enums import NotificationType, ProfileModerationStatus


def create_notification(
    db: Session,
    user_id: str,
    notification_type: NotificationType,
    title: str,
    message: str,
    related_entity_id: Optional[str] = None,
    image_url: Optional[str] = None,
) -> NotificationModel:
    """Create and persist a notification for a user."""
    # Never persist heavy base64 data URLs in notification table; images are enriched dynamically
    if image_url and (image_url.startswith("data:") or len(image_url) > 2048):
        image_url = None

    notif = NotificationModel(
        user_id=user_id,
        type=notification_type,
        title=title,
        message=message,
        related_entity_id=related_entity_id,
        image_url=image_url,
        is_read=False,
    )
    db.add(notif)
    db.flush()
    return notif


def get_user_notifications(
    db: Session,
    user_id: str,
    page: int = 1,
    page_size: int = 20,
) -> Dict[str, Any]:
    """Return paginated notifications for the given user. Enforces ownership."""
    interest_types = [
        NotificationType.INTEREST_RECEIVED,
        NotificationType.INTEREST_ACCEPTED,
        NotificationType.INTEREST_DECLINED,
        NotificationType.INTEREST_WITHDRAWN,
        NotificationType.MUTUAL_INTEREST,
    ]

    valid_interest_subquery = select(InterestModel.id)
    base_filter = [
        NotificationModel.user_id == user_id,
        or_(
            NotificationModel.type.not_in(interest_types),
            NotificationModel.related_entity_id.is_(None),
            NotificationModel.related_entity_id.in_(valid_interest_subquery),
        ),
    ]

    stmt = (
        select(NotificationModel)
        .where(*base_filter)
        .order_by(desc(NotificationModel.created_at))
    )
    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    unread_count = (
        db.scalar(
            select(func.count())
            .select_from(NotificationModel)
            .where(*base_filter)
            .where(NotificationModel.is_read == False)  # noqa: E712
        )
        or 0
    )

    offset = (page - 1) * page_size
    notifs = list(db.scalars(stmt.offset(offset).limit(page_size)).all())

    # Dynamically enrich message and image_url for notifications
    updated_any = False
    for n in notifs:
        if n.related_entity_id:
            try:
                interest = db.scalar(
                    select(InterestModel)
                    .where(InterestModel.id == n.related_entity_id)
                    .options(
                        joinedload(InterestModel.sender),
                        joinedload(InterestModel.receiver),
                        joinedload(InterestModel.sender_profile),
                        joinedload(InterestModel.receiver_profile),
                    )
                )
                if interest:
                    if n.type == NotificationType.INTEREST_RECEIVED:
                        # For INTEREST_RECEIVED, user_id is the recipient (interest.receiver_user_id).
                        # The user who actually showed interest is interest.sender_user_id!
                        sender_prof = interest.sender_profile
                        if not sender_prof:
                            sender_prof = db.scalar(
                                select(BiodataProfileModel)
                                .where(BiodataProfileModel.user_id == interest.sender_user_id)
                                .order_by(
                                    case((BiodataProfileModel.moderation_status == ProfileModerationStatus.APPROVED, 1), else_=2),
                                    desc(BiodataProfileModel.updated_at)
                                )
                            )
                        sender_name = None
                        if sender_prof and sender_prof.profile_data and isinstance(sender_prof.profile_data, dict):
                            sender_name = sender_prof.profile_data.get("fullName") or sender_prof.profile_data.get("name")
                        if not sender_name and interest.sender:
                            sender_name = interest.sender.full_name
                        if not sender_name:
                            sender_user = db.scalar(select(User).where(User.id == interest.sender_user_id))
                            sender_name = sender_user.full_name if sender_user else None
                        sender_name = sender_name or "Someone"

                        expected_msg = f"{sender_name} has expressed interest in your profile!"
                        if n.message != expected_msg:
                            n.message = expected_msg
                            updated_any = True

                        if sender_prof and sender_prof.profile_data and isinstance(sender_prof.profile_data, dict):
                            pic = sender_prof.profile_data.get("profilePictureUrl") or sender_prof.profile_data.get("photoUrl") or sender_prof.profile_data.get("photo")
                            if pic and not pic.startswith("data:") and len(pic) <= 2048:
                                if n.image_url != pic:
                                    n.image_url = pic
                                    updated_any = True

                    elif n.type == NotificationType.MUTUAL_INTEREST:
                        other_uid = interest.sender_user_id if interest.receiver_user_id == user_id else interest.receiver_user_id
                        other_prof = interest.sender_profile if interest.receiver_user_id == user_id else interest.receiver_profile
                        if not other_prof:
                            other_prof = db.scalar(
                                select(BiodataProfileModel)
                                .where(BiodataProfileModel.user_id == other_uid)
                                .order_by(
                                    case((BiodataProfileModel.moderation_status == ProfileModerationStatus.APPROVED, 1), else_=2),
                                    desc(BiodataProfileModel.updated_at)
                                )
                            )
                        other_name = None
                        if other_prof and other_prof.profile_data and isinstance(other_prof.profile_data, dict):
                            other_name = other_prof.profile_data.get("fullName") or other_prof.profile_data.get("name")
                        if not other_name:
                            other_user = interest.sender if interest.receiver_user_id == user_id else interest.receiver
                            if not other_user:
                                other_user = db.scalar(select(User).where(User.id == other_uid))
                            other_name = other_user.full_name if other_user else None
                        other_name = other_name or "your match"

                        expected_msg = f"You and {other_name} have expressed mutual interest!"
                        if n.message != expected_msg:
                            n.message = expected_msg
                            updated_any = True

                        if other_prof and other_prof.profile_data and isinstance(other_prof.profile_data, dict):
                            pic = other_prof.profile_data.get("profilePictureUrl") or other_prof.profile_data.get("photoUrl") or other_prof.profile_data.get("photo")
                            if pic and not pic.startswith("data:") and len(pic) <= 2048:
                                if n.image_url != pic:
                                    n.image_url = pic
                                    updated_any = True

                    elif n.type == NotificationType.INTEREST_ACCEPTED:
                        recv_prof = interest.receiver_profile
                        if not recv_prof:
                            recv_prof = db.scalar(
                                select(BiodataProfileModel)
                                .where(BiodataProfileModel.user_id == interest.receiver_user_id)
                                .order_by(
                                    case((BiodataProfileModel.moderation_status == ProfileModerationStatus.APPROVED, 1), else_=2),
                                    desc(BiodataProfileModel.updated_at)
                                )
                            )
                        recv_name = None
                        if recv_prof and recv_prof.profile_data and isinstance(recv_prof.profile_data, dict):
                            recv_name = recv_prof.profile_data.get("fullName") or recv_prof.profile_data.get("name")
                        if not recv_name and interest.receiver:
                            recv_name = interest.receiver.full_name
                        if not recv_name:
                            recv_user = db.scalar(select(User).where(User.id == interest.receiver_user_id))
                            recv_name = recv_user.full_name if recv_user else None
                        recv_name = recv_name or "Candidate"

                        expected_msg = f"Your interest has been accepted by {recv_name}! A connection has been established."
                        if recv_name and ("Your interest has been accepted" in n.message):
                            if n.message != expected_msg:
                                n.message = expected_msg
                                updated_any = True

                        if recv_prof and recv_prof.profile_data and isinstance(recv_prof.profile_data, dict):
                            pic = recv_prof.profile_data.get("profilePictureUrl") or recv_prof.profile_data.get("photoUrl") or recv_prof.profile_data.get("photo")
                            if pic and not pic.startswith("data:") and len(pic) <= 2048:
                                if n.image_url != pic:
                                    n.image_url = pic
                                    updated_any = True
            except Exception:
                pass

    if updated_any:
        try:
            db.commit()
        except Exception:
            pass

    total_pages = math.ceil(total / page_size) if total > 0 else 0

    return {
        "data": notifs,
        "total": total,
        "unread_count": unread_count,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
    }


def mark_notification_read(db: Session, notification_id: str, user_id: str) -> bool:
    """Mark a single notification as read. Returns False if not found or not owned."""
    notif = db.scalar(
        select(NotificationModel)
        .where(NotificationModel.id == notification_id)
        .where(NotificationModel.user_id == user_id)
    )
    if not notif:
        return False
    notif.is_read = True
    db.flush()
    return True


def mark_all_notifications_read(db: Session, user_id: str) -> int:
    """Mark all notifications for user as read. Returns count updated."""
    notifs = list(
        db.scalars(
            select(NotificationModel)
            .where(NotificationModel.user_id == user_id)
            .where(NotificationModel.is_read == False)  # noqa: E712
        ).all()
    )
    for n in notifs:
        n.is_read = True
    db.flush()
    return len(notifs)
