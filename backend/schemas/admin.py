from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from backend.models.enums import UserRole, UserStatus


class AdminUserDetailResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: Optional[str] = None
    role: UserRole
    status: UserStatus
    is_email_verified: bool
    phone: Optional[str] = None
    is_phone_verified: bool = False
    profile_id: Optional[str] = None
    profile_picture_url: Optional[str] = None
    gallery_pictures: Optional[List[str]] = None
    biodata_name: Optional[str] = None
    biodata_slug: Optional[str] = None
    profile_data: Optional[dict] = None
    created_at: datetime
    updated_at: datetime
    last_login_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PaginationMetadata(BaseModel):
    page: int
    page_size: int
    total: int
    total_pages: int


class PaginatedUserListResponse(BaseModel):
    success: bool = True
    data: List[AdminUserDetailResponse]
    pagination: PaginationMetadata


class StatusActionRequest(BaseModel):
    status: UserStatus
    reason: Optional[str] = Field(None, max_length=255, description="Optional administrative reason")
