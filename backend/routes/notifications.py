from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.models.user import User
from backend.dependencies.auth import get_current_user
from backend.schemas.notifications import NotificationResponse, PaginatedNotificationResponse
from backend.services.notification_service import (
    get_user_notifications, mark_notification_read, mark_all_notifications_read
)

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("", response_model=PaginatedNotificationResponse)
def list_notifications(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get the current user's notifications (paginated, newest first)."""
    result = get_user_notifications(db, current_user.id, page=page, page_size=page_size)
    return PaginatedNotificationResponse(success=True, **result)


@router.patch("/{notification_id}/read")
def mark_read(
    notification_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mark a single notification as read. Enforces ownership."""
    success = mark_notification_read(db, notification_id, current_user.id)
    db.commit()
    if not success:
        raise HTTPException(
            status_code=404,
            detail={"success": False, "message": "Notification not found or access denied."}
        )
    return {"success": True, "message": "Notification marked as read."}


@router.post("/read-all")
def mark_all_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mark all of the current user's notifications as read."""
    count = mark_all_notifications_read(db, current_user.id)
    db.commit()
    return {"success": True, "message": f"{count} notification(s) marked as read."}
