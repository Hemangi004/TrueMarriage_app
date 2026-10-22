import uuid
from datetime import datetime
from typing import Optional, Any, Dict
from sqlalchemy import String, DateTime, ForeignKey, JSON, func, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.db.base import Base


class AdminAuditLog(Base):
    """
    Administrative Audit Log model for recording security-sensitive configuration changes.
    Never records plain secret credentials, passwords, or tokens.
    """
    __tablename__ = "admin_audit_logs"

    id: Mapped[str] = mapped_column(
        String(64), primary_key=True, default=lambda: f"AUDIT-{uuid.uuid4().hex[:10].upper()}"
    )
    admin_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    action: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    target_type: Mapped[str] = mapped_column(String(64), nullable=False)
    target_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    details: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False, index=True
    )

    admin: Mapped["User"] = relationship("User", foreign_keys=[admin_id])

    __table_args__ = (
        Index("ix_admin_audit_created_action", "created_at", "action"),
    )
