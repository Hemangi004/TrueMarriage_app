import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, DateTime, ForeignKey, Index, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.db.base import Base


class ProfileAnalyticsModel(Base):
    """
    Tracks visitor interactions, view counts, unique visitors, and QR code scan logs.
    """
    __tablename__ = "profile_analytics"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    profile_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("biodata_profiles.id", ondelete="CASCADE"), nullable=False, index=True
    )
    visitor_user_id: Mapped[Optional[str]] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True
    )
    ip_address: Mapped[Optional[str]] = mapped_column(
        String(64), nullable=True
    )
    user_agent: Mapped[Optional[str]] = mapped_column(
        String(255), nullable=True
    )
    source: Mapped[str] = mapped_column(
        String(32), default="direct", nullable=False, index=True  # "qr_scan", "direct", "search", "social"
    )
    visited_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False, index=True
    )

    profile: Mapped["BiodataProfileModel"] = relationship("BiodataProfileModel", foreign_keys=[profile_id])
    visitor: Mapped[Optional["User"]] = relationship("User", foreign_keys=[visitor_user_id])

    __table_args__ = (
        Index("ix_profile_analytics_profile_source", "profile_id", "source"),
        Index("ix_profile_analytics_profile_visited", "profile_id", "visited_at"),
    )
