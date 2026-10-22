import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Boolean, Enum as SQLEnum, DateTime, ForeignKey, func, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.db.base import Base
from backend.models.enums import UserRole, UserStatus, AuthProvider


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    email: Mapped[str] = mapped_column(
        String(255), unique=True, index=True, nullable=False
    )
    full_name: Mapped[Optional[str]] = mapped_column(
        String(255), nullable=True
    )
    password_hash: Mapped[Optional[str]] = mapped_column(
        String(255), nullable=True
    )

    role: Mapped[UserRole] = mapped_column(
        SQLEnum(UserRole), default=UserRole.USER, nullable=False
    )
    status: Mapped[UserStatus] = mapped_column(
        SQLEnum(UserStatus), default=UserStatus.PENDING_VERIFICATION, nullable=False
    )
    is_email_verified: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )

    # Future Mobile Authentication Support
    phone: Mapped[Optional[str]] = mapped_column(
        String(20), unique=True, index=True, nullable=True
    )
    is_phone_verified: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )
    last_login_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # Relationships
    identities: Mapped[List["UserAuthIdentity"]] = relationship(
        "UserAuthIdentity", back_populates="user", cascade="all, delete-orphan"
    )
    sessions: Mapped[List["SessionModel"]] = relationship(
        "SessionModel", back_populates="user", cascade="all, delete-orphan"
    )
    otps: Mapped[List["OTPCodeModel"]] = relationship(
        "OTPCodeModel", back_populates="user", cascade="all, delete-orphan"
    )
    biodata: Mapped[Optional["BiodataProfileModel"]] = relationship(
        "BiodataProfileModel", foreign_keys="[BiodataProfileModel.user_id]", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )


    __table_args__ = (
        Index("ix_users_email_status", "email", "status"),
        Index("ix_users_created_at", "created_at"),
        Index("ix_users_role", "role"),
        Index("ix_users_status", "status"),
    )



class UserAuthIdentity(Base):
    """
    Identity mapping allowing a single local User account to support
    both LOCAL password and future GOOGLE OAuth authentication.
    """
    __tablename__ = "user_auth_identities"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    provider: Mapped[AuthProvider] = mapped_column(
        SQLEnum(AuthProvider), nullable=False
    )
    provider_user_id: Mapped[Optional[str]] = mapped_column(
        String(255), nullable=True, index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    user: Mapped["User"] = relationship("User", back_populates="identities")

    __table_args__ = (
        Index("ix_auth_identities_provider_user", "provider", "provider_user_id"),
    )
