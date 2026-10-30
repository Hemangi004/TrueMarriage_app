import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, Integer, DateTime, ForeignKey, Index, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.db.base import Base


class PaymentOrder(Base):
    """
    Stores payment orders created for Razorpay checkout, tracking transaction state
    from initialization through completion or failure.
    """
    __tablename__ = "payment_orders"

    id: Mapped[str] = mapped_column(
        String(64), primary_key=True, default=lambda: f"ORD-{uuid.uuid4().hex[:10].upper()}"
    )
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    razorpay_order_id: Mapped[str] = mapped_column(
        String(64), unique=True, index=True, nullable=False
    )
    razorpay_payment_id: Mapped[Optional[str]] = mapped_column(
        String(64), unique=True, nullable=True, index=True
    )
    razorpay_signature: Mapped[Optional[str]] = mapped_column(
        String(255), nullable=True
    )

    plan_id: Mapped[str] = mapped_column(
        String(64), default="premium_monthly", nullable=False
    )
    plan_name: Mapped[str] = mapped_column(
        String(128), default="Premium Biodata Pass", nullable=False
    )
    amount: Mapped[int] = mapped_column(
        Integer, nullable=False, default=299
    )
    currency: Mapped[str] = mapped_column(
        String(10), default="INR", nullable=False
    )
    status: Mapped[str] = mapped_column(
        String(32), default="PENDING", nullable=False, index=True
    )
    payment_method: Mapped[Optional[str]] = mapped_column(
        String(64), nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    user = relationship("User", foreign_keys=[user_id])

    __table_args__ = (
        Index("ix_payment_orders_user_status", "user_id", "status"),
    )
