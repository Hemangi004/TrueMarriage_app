import uuid
from datetime import datetime
from typing import Optional, Any
from sqlalchemy import String, DateTime, ForeignKey, JSON, Text, Boolean, Enum as SQLEnum, func, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.db.base import Base
from backend.models.enums import ProfileModerationStatus


class BiodataProfileModel(Base):
    """
    Biodata Profile Model linked to User account via user_id foreign key.
    Stores complete biodata payload, publishing status, and administrative moderation fields.
    """
    __tablename__ = "biodata_profiles"

    id: Mapped[str] = mapped_column(
        String(64), primary_key=True, default=lambda: f"TRUE-{uuid.uuid4().hex[:8].upper()}"
    )
    user_id: Mapped[Optional[str]] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True
    )

    # SEO Unique URL Slug
    slug: Mapped[Optional[str]] = mapped_column(
        String(255), unique=True, index=True, nullable=True
    )

    # Privacy & Password Protection
    is_password_protected: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )
    passcode_hash: Mapped[Optional[str]] = mapped_column(
        String(255), nullable=True
    )
    hide_contact_details: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )

    # Completion Status
    is_completed: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False, index=True
    )

    # Moderation Status
    status: Mapped[str] = mapped_column(
        String(32), default="DRAFT", nullable=False
    )
    moderation_status: Mapped[ProfileModerationStatus] = mapped_column(
        SQLEnum(ProfileModerationStatus), default=ProfileModerationStatus.DRAFT, server_default="DRAFT", nullable=False, index=True
    )


    # Moderation Audit Metadata
    reviewed_by: Mapped[Optional[str]] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True
    )
    reviewed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    rejection_reason: Mapped[Optional[str]] = mapped_column(
        Text, nullable=True
    )

    # Payload & Timestamps
    profile_data: Mapped[dict] = mapped_column(
        JSON, nullable=False, default=dict
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )
    submitted_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    published_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # Relationships
    user: Mapped[Optional["User"]] = relationship("User", foreign_keys=[user_id], back_populates="biodata")
    reviewer: Mapped[Optional["User"]] = relationship("User", foreign_keys=[reviewed_by])

    __table_args__ = (
        Index("ix_biodata_mod_status_created", "moderation_status", "created_at"),
        Index("ix_biodata_mod_status_published", "moderation_status", "published_at"),
    )
