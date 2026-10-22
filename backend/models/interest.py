import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, DateTime, ForeignKey, Enum as SQLEnum, Index, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.db.base import Base
from backend.models.enums import InterestStatus


class InterestModel(Base):
    """
    Matrimonial Interest record.

    Duplicate prevention semantics:
      - No UNIQUE constraint at DB level on (sender_user_id, receiver_user_id)
        because that would wrongly block re-sending after DECLINED or WITHDRAWN.
      - Duplicate protection is enforced by the service layer:
          Only one ACTIVE interest (status IN [PENDING, ACCEPTED, MATCHED]) may
          exist for a given (sender_user_id, receiver_user_id) pair at any time.
          DECLINED and WITHDRAWN records are treated as historical and allow
          a fresh PENDING interest to be created.
      - A partial unique index on (sender_user_id, receiver_user_id) for
        PENDING status is added for performance; business-level validation
        covers ACCEPTED and MATCHED.
    """
    __tablename__ = "interests"

    id: Mapped[str] = mapped_column(
        String(64), primary_key=True, default=lambda: f"INT-{uuid.uuid4().hex[:10].upper()}"
    )

    sender_user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    receiver_user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    sender_profile_id: Mapped[Optional[str]] = mapped_column(
        String(64), ForeignKey("biodata_profiles.id", ondelete="SET NULL"), nullable=True
    )
    receiver_profile_id: Mapped[Optional[str]] = mapped_column(
        String(64), ForeignKey("biodata_profiles.id", ondelete="SET NULL"), nullable=True
    )

    status: Mapped[InterestStatus] = mapped_column(
        SQLEnum(InterestStatus), default=InterestStatus.PENDING, nullable=False, index=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )
    responded_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # Relationships
    sender: Mapped["User"] = relationship("User", foreign_keys=[sender_user_id])
    receiver: Mapped["User"] = relationship("User", foreign_keys=[receiver_user_id])
    sender_profile: Mapped[Optional["BiodataProfileModel"]] = relationship(
        "BiodataProfileModel", foreign_keys=[sender_profile_id]
    )
    receiver_profile: Mapped[Optional["BiodataProfileModel"]] = relationship(
        "BiodataProfileModel", foreign_keys=[receiver_profile_id]
    )

    __table_args__ = (
        # Non-unique index for fast lookups on the pair + status
        Index("ix_interests_sender_receiver", "sender_user_id", "receiver_user_id"),
        Index("ix_interests_sender_status", "sender_user_id", "status"),
        Index("ix_interests_receiver_status", "receiver_user_id", "status"),
        Index("ix_interests_created_at", "created_at"),
    )
