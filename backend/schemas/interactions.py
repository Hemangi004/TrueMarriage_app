from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel
from backend.models.enums import InterestStatus


class PublicProfileSummary(BaseModel):
    """Minimal whitelisted public profile summary for interest/shortlist responses."""
    id: str
    slug: Optional[str] = None
    user_id: Optional[str] = None
    display_name: str
    gender: Optional[str] = None
    age: Optional[int] = None
    city: Optional[str] = None
    state: Optional[str] = None
    education: Optional[str] = None
    occupation: Optional[str] = None
    profile_picture_url: Optional[str] = None

    class Config:
        from_attributes = True


class SendInterestRequest(BaseModel):
    profile_id: str


class InterestResponse(BaseModel):
    id: str
    status: InterestStatus
    created_at: datetime
    updated_at: datetime
    responded_at: Optional[datetime] = None
    sender_user_id: Optional[str] = None
    receiver_user_id: Optional[str] = None
    sender_profile_id: Optional[str] = None
    receiver_profile_id: Optional[str] = None
    # The "other" profile from this user's perspective
    profile: Optional[PublicProfileSummary] = None

    class Config:
        from_attributes = True


class PaginatedInterestResponse(BaseModel):
    success: bool = True
    data: List[InterestResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class ShortlistRequest(BaseModel):
    profile_id: str


class ShortlistResponse(BaseModel):
    id: str
    profile_id: str
    created_at: datetime
    profile: Optional[PublicProfileSummary] = None

    class Config:
        from_attributes = True


class PaginatedShortlistResponse(BaseModel):
    success: bool = True
    data: List[ShortlistResponse]
    total: int
