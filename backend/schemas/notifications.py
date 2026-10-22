from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel
from backend.models.enums import NotificationType


class NotificationResponse(BaseModel):
    id: str
    type: NotificationType
    title: str
    message: str
    related_entity_id: Optional[str] = None
    image_url: Optional[str] = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


class PaginatedNotificationResponse(BaseModel):
    success: bool = True
    data: List[NotificationResponse]
    total: int
    unread_count: int
    page: int
    page_size: int
    total_pages: int
