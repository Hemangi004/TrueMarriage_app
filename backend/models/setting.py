from datetime import datetime
from typing import Optional
from sqlalchemy import String, DateTime, ForeignKey, Text, Boolean, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.db.base import Base


class ApplicationSetting(Base):
    """
    Application Settings table for persistent administrative configuration.
    Stores non-secret application settings backed by an explicit allowlist.
    """
    __tablename__ = "application_settings"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    key: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    value: Mapped[str] = mapped_column(String(255), nullable=False)
    value_type: Mapped[str] = mapped_column(String(32), default="string", nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_editable: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )
    updated_by: Mapped[Optional[str]] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )

    updater: Mapped[Optional["User"]] = relationship("User", foreign_keys=[updated_by])
