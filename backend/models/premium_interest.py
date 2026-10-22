import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, DateTime, ForeignKey, Index, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.db.base import Base


class PremiumInterestEvent(Base):
    """
    Records user interest event when a registered user or anonymous guest user clicks on a Premium action button.
    Used for backend analytics and reporting interest metrics in admin dashboard.
    """
    __tablename__ = "premium_interest_events"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[Optional[str]] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True
    )
    event_type: Mapped[str] = mapped_column(
        String(64), default="PREMIUM_CLICK", nullable=False, index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False, index=True
    )

    user: Mapped[Optional["User"]] = relationship("User", foreign_keys=[user_id])

    __table_args__ = (
        Index("ix_premium_events_type_user", "event_type", "user_id"),
    )
