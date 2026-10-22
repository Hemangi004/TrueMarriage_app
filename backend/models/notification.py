import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, DateTime, Boolean, Text, ForeignKey, Enum as SQLEnum, Index, func
from sqlalchemy.dialects.mysql import LONGTEXT
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.db.base import Base
from backend.models.enums import NotificationType


class NotificationModel(Base):
    """
    User notification record.
    Notifications are created server-side only; users cannot create their own.
    A user may only access their own notifications (enforced by the route/service).
    Sensitive data is never stored in notification payloads.
    """
    __tablename__ = "notifications"

    id: Mapped[str] = mapped_column(
        String(64), primary_key=True, default=lambda: f"NOTIF-{uuid.uuid4().hex[:8].upper()}"
    )
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    type: Mapped[NotificationType] = mapped_column(
        SQLEnum(NotificationType), nullable=False, index=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    related_entity_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(Text().with_variant(LONGTEXT, "mysql"), nullable=True)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    user: Mapped["User"] = relationship("User", foreign_keys=[user_id])

    __table_args__ = (
        Index("ix_notifications_user_read", "user_id", "is_read"),
        Index("ix_notifications_created_at", "created_at"),
    )


class BroadcastAnnouncementModel(Base):
    """
    Platform-wide broadcast announcement created by administrators.
    Archived for audit and displayed to all active users.
    """
    __tablename__ = "broadcast_announcements"

    id: Mapped[str] = mapped_column(
        String(64), primary_key=True, default=lambda: f"BC-{uuid.uuid4().hex[:8].upper()}"
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    type: Mapped[str] = mapped_column(String(64), default="SYSTEM", nullable=False)
    created_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    __table_args__ = (
        Index("ix_broadcast_announcements_created_at", "created_at"),
    )

