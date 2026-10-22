import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select, desc

from backend.db.session import get_db
from backend.models.user import User
from backend.models.enums import UserStatus, NotificationType
from backend.models.notification import NotificationModel, BroadcastAnnouncementModel
from backend.dependencies.authorization import require_admin

router = APIRouter(prefix="/admin/notifications", tags=["Admin Notifications"])


class BroadcastRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    message: str = Field(..., min_length=1)
    type: str = Field(default="SYSTEM", max_length=64)


@router.get("")
def list_broadcast_announcements(
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """
    Returns broadcast announcements history for the admin dashboard.
    """
    stmt = (
        select(BroadcastAnnouncementModel)
        .order_by(desc(BroadcastAnnouncementModel.created_at))
        .limit(100)
    )
    records = list(db.scalars(stmt).all())

    announcements = []
    for r in records:
        date_str = r.created_at.strftime("%Y-%m-%d %H:%M") if r.created_at else ""
        announcements.append({
            "id": r.id,
            "title": r.title,
            "message": r.message,
            "type": r.type,
            "date": date_str,
            "created_at": r.created_at.isoformat() if r.created_at else None,
        })

    return {
        "success": True,
        "announcements": announcements,
    }


@router.post("/broadcast")
def broadcast_notification(
    body: BroadcastRequest,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """
    Broadcasts an announcement platform-wide:
    1. Records the broadcast in broadcast_announcements.
    2. Delivers an in-app notification to all active users.
    """
    now = datetime.now(timezone.utc)
    clean_title = body.title.strip()
    clean_message = body.message.strip()
    clean_type = body.type.strip().upper() if body.type else "SYSTEM"

    # 1. Create Broadcast Announcement record
    announcement = BroadcastAnnouncementModel(
        id=f"BC-{uuid.uuid4().hex[:8].upper()}",
        title=clean_title,
        message=clean_message,
        type=clean_type,
        created_by=current_admin.id,
        created_at=now,
    )
    db.add(announcement)
    db.flush()

    # 2. Determine NotificationType enum
    if clean_type in NotificationType.__members__:
        notif_type = NotificationType[clean_type]
    elif clean_type in ("PROMOTION", "FEATURE", "SYSTEM"):
        notif_type = NotificationType[clean_type]
    else:
        notif_type = NotificationType.ADMIN_BROADCAST

    # 3. Find all active users
    active_users = list(
        db.scalars(
            select(User.id).where(User.status == UserStatus.ACTIVE)
        ).all()
    )

    # 4. Insert notification for all active users
    for user_id in active_users:
        notif = NotificationModel(
            id=f"NOTIF-{uuid.uuid4().hex[:8].upper()}",
            user_id=user_id,
            type=notif_type,
            title=clean_title,
            message=clean_message,
            related_entity_id=announcement.id,
            is_read=False,
            created_at=now,
        )
        db.add(notif)

    db.commit()

    return {
        "success": True,
        "message": f"Broadcast sent successfully to {len(active_users)} registered user(s).",
        "announcement_id": announcement.id,
        "recipient_count": len(active_users),
    }
