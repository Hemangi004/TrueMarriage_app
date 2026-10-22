import uuid
from datetime import datetime
from typing import Optional, Dict, Any
from sqlalchemy import String, DateTime, Integer, JSON, func, Index
from sqlalchemy.orm import Mapped, mapped_column
from backend.db.base import Base


class SecurityLog(Base):
    """
    Security Log & Threat Telemetry ORM Model.
    Records real-time security events, auth failures, CSRF breaches, rate limit incidents,
    GDPR actions, and threat activity.
    Strictly sanitized: NEVER contains passwords, OTPs, tokens, cookies, or encryption keys.
    """
    __tablename__ = "security_logs"

    id: Mapped[str] = mapped_column(
        String(64), primary_key=True, default=lambda: f"SECLOG-{uuid.uuid4().hex[:12].upper()}"
    )
    request_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True, index=True)
    session_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True, index=True)
    
    event_type: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    severity: Mapped[str] = mapped_column(String(16), nullable=False, default="INFO", index=True)  # INFO, WARNING, HIGH, CRITICAL
    risk_score: Mapped[int] = mapped_column(Integer, nullable=False, default=0)  # 0 to 100

    user_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True, index=True)
    target_user_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True, index=True)
    
    ip_address: Mapped[Optional[str]] = mapped_column(String(45), nullable=True, index=True)
    user_agent: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    endpoint: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    method: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    status_code: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    
    details: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False, index=True
    )

    __table_args__ = (
        Index("ix_security_logs_created_severity", "created_at", "severity"),
        Index("ix_security_logs_ip_created", "ip_address", "created_at"),
    )
