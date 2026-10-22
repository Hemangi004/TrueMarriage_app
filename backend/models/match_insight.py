import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey, JSON, func, UniqueConstraint, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.db.base import Base


class MatchInsightModel(Base):
    """
    Persisted AI match insights generated between a logged-in user and a candidate profile.
    Saves AI tokens by guaranteeing a single generation per user-candidate pair.
    """
    __tablename__ = "match_insights"

    id: Mapped[str] = mapped_column(
        String(64), primary_key=True, default=lambda: f"MI-{uuid.uuid4().hex[:12].upper()}"
    )
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    candidate_profile_id: Mapped[str] = mapped_column(
        String(64), nullable=False, index=True
    )
    headline: Mapped[str] = mapped_column(
        String(500), nullable=False
    )
    reasons: Mapped[list] = mapped_column(
        JSON, nullable=False, default=list
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationships
    user = relationship("User", foreign_keys=[user_id])

    __table_args__ = (
        UniqueConstraint("user_id", "candidate_profile_id", name="uq_user_candidate_insight"),
        Index("ix_match_insights_user_candidate", "user_id", "candidate_profile_id"),
    )
