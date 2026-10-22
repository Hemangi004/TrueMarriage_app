from datetime import datetime
from typing import Optional, List, Any, Dict
from pydantic import BaseModel, EmailStr, Field
from backend.models.enums import ProfileModerationStatus
from backend.schemas.admin import PaginationMetadata


class AdminProfileListItemResponse(BaseModel):
    id: str
    user_id: str
    user_full_name: Optional[str] = None
    user_email: EmailStr
    moderation_status: ProfileModerationStatus
    submitted_at: Optional[datetime] = None
    reviewed_at: Optional[datetime] = None
    reviewed_by: Optional[str] = None
    rejection_reason: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AdminProfileDetailResponse(BaseModel):
    id: str
    user_id: str
    user_full_name: Optional[str] = None
    user_email: EmailStr
    moderation_status: ProfileModerationStatus
    profile_data: Dict[str, Any] = Field(default_factory=dict)
    submitted_at: Optional[datetime] = None
    reviewed_at: Optional[datetime] = None
    reviewed_by: Optional[str] = None
    reviewer_email: Optional[str] = None
    rejection_reason: Optional[str] = None
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PaginatedProfileListResponse(BaseModel):
    success: bool = True
    data: List[AdminProfileListItemResponse]
    pagination: PaginationMetadata


class ModerationActionRequest(BaseModel):
    reason: Optional[str] = Field(None, max_length=1000, description="Moderation feedback or rejection reason")
