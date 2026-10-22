import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey, UniqueConstraint, Index, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.db.base import Base


class ShortlistModel(Base):
    """
    Persistent shortlist (favorites) entry: a user bookmarks an approved profile.
    Duplicate shortlist entries for the same (user_id, profile_id) are prevented
    by a database UniqueConstraint. Unlike interests, shortlists have no lifecycle
    states — they are simply present or absent.
    """
    __tablename__ = "shortlists"

    id: Mapped[str] = mapped_column(
        String(64), primary_key=True, default=lambda: f"SL-{uuid.uuid4().hex[:10].upper()}"
    )
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    profile_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("biodata_profiles.id", ondelete="CASCADE"), nullable=False, index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    user: Mapped["User"] = relationship("User", foreign_keys=[user_id])
    profile: Mapped["BiodataProfileModel"] = relationship(
        "BiodataProfileModel", foreign_keys=[profile_id]
    )

    __table_args__ = (
        UniqueConstraint("user_id", "profile_id", name="uq_shortlist_user_profile"),
        Index("ix_shortlist_user_created", "user_id", "created_at"),
    )
