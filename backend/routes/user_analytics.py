from typing import Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.dependencies.auth import get_optional_current_user
from backend.models.user import User
from backend.models.premium_interest import PremiumInterestEvent

router = APIRouter(prefix="/analytics", tags=["User Analytics"])


@router.post("/premium-click", status_code=status.HTTP_201_CREATED)
def record_premium_click(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Records a PREMIUM_CLICK event for either an authenticated user or an unregistered guest user.
    Always records the click metrics in the database. Returns `requires_login: True` if the click
    came from an unregistered guest user so frontend can prompt for login.
    """
    user_id = current_user.id if current_user else None
    requires_login = current_user is None

    event = PremiumInterestEvent(
        user_id=user_id,
        event_type="PREMIUM_CLICK"
    )
    db.add(event)
    db.commit()
    db.refresh(event)

    return {
        "success": True,
        "message": "Premium interest recorded successfully.",
        "requires_login": requires_login,
        "event": {
            "id": event.id,
            "user_id": event.user_id,
            "event_type": event.event_type,
            "created_at": event.created_at.isoformat() if event.created_at else None
        }
    }


@router.post("/free-click", status_code=status.HTTP_201_CREATED)
def record_free_click(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Records a FREE_CLICK event for either an authenticated user or an unregistered guest user
    when they click a Free plan CTA or choose to continue free.
    """
    user_id = current_user.id if current_user else None
    requires_login = current_user is None

    event = PremiumInterestEvent(
        user_id=user_id,
        event_type="FREE_CLICK"
    )
    db.add(event)
    db.commit()
    db.refresh(event)

    return {
        "success": True,
        "message": "Free tier action recorded successfully.",
        "requires_login": requires_login,
        "event": {
            "id": event.id,
            "user_id": event.user_id,
            "event_type": event.event_type,
            "created_at": event.created_at.isoformat() if event.created_at else None
        }
    }
