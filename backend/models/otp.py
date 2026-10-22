import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Boolean, Integer, Enum as SQLEnum, DateTime, ForeignKey, func, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.db.base import Base
from backend.models.enums import OTPType, OTPPurpose


class OTPCodeModel(Base):
    """
    OTP Code Model for secure email (and future phone) OTP verification.
    Stores cryptographically hashed codes (SHA-256) only; never plaintext.
    """
    __tablename__ = "otp_codes"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[Optional[str]] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True
    )
    target: Mapped[str] = mapped_column(
        String(255), nullable=False, index=True
    )
    type: Mapped[OTPType] = mapped_column(
        SQLEnum(OTPType), default=OTPType.EMAIL, nullable=False
    )
    purpose: Mapped[OTPPurpose] = mapped_column(
        SQLEnum(OTPPurpose), nullable=False
    )
    code_hash: Mapped[str] = mapped_column(
        String(255), nullable=False
    )
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, index=True
    )
    attempts: Mapped[int] = mapped_column(
        Integer, default=0, nullable=False
    )
    max_attempts: Mapped[int] = mapped_column(
        Integer, default=3, nullable=False
    )
    is_used: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    used_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    ip_address: Mapped[Optional[str]] = mapped_column(
        String(45), nullable=True
    )
    user_agent: Mapped[Optional[str]] = mapped_column(
        String(255), nullable=True
    )

    user: Mapped[Optional["User"]] = relationship("User", back_populates="otps")

    __table_args__ = (
        Index("ix_otps_target_purpose_used", "target", "purpose", "is_used"),
    )
