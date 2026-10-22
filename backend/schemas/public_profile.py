from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, Field, ConfigDict
from backend.schemas.admin import PaginationMetadata


class ContactDetails(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    phone: Optional[str] = None
    contact_to: Optional[str] = None
    email: Optional[str] = None
    contact_person: Optional[str] = None
    relation: Optional[str] = None


class PublicProfileListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    id: str
    slug: Optional[str] = None
    display_name: str = "Anonymous Candidate"
    gender: Optional[str] = None
    age: Optional[int] = None
    height: Optional[str] = None
    religion: Optional[str] = None
    caste: Optional[str] = None
    mother_tongue: Optional[str] = None
    marital_status: Optional[str] = None
    education: Optional[str] = None
    college: Optional[str] = None
    occupation: Optional[str] = None
    company: Optional[str] = None
    annual_income: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    native_place: Optional[str] = None
    family_type: Optional[str] = None
    family_values: Optional[str] = None
    father_name: Optional[str] = None
    father_occupation: Optional[str] = None
    mother_name: Optional[str] = None
    mother_occupation: Optional[str] = None
    siblings: Optional[str] = None
    diet: Optional[str] = None
    smoking: Optional[str] = None
    drinking: Optional[str] = None
    fitness: Optional[str] = None
    travel: Optional[str] = None
    personality: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    about_me: Optional[str] = None
    partner_expectations: Optional[str] = None
    marriage_timeline: Optional[str] = None
    profile_picture_url: Optional[str] = None
    original_profile_picture_url: Optional[str] = None
    photo_filter: Optional[str] = None
    additional_photos: Optional[List[str]] = None
    published_at: Optional[Any] = None
    is_password_protected: bool = False
    hide_contact_details: bool = False
    phone: Optional[str] = None
    contact_number: Optional[str] = None
    contact_to: Optional[str] = None
    contactTo: Optional[str] = None
    contact_details: Optional[ContactDetails] = None


class PublicProfileDetailResponse(PublicProfileListItem):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    is_locked: bool = False


class PaginatedPublicProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    success: bool = True
    data: List[PublicProfileListItem] = []
    pagination: PaginationMetadata


class VerifyPasscodeRequest(BaseModel):
    passcode: str = Field(..., min_length=1, max_length=32)


class UpdateProfileSettingsRequest(BaseModel):
    slug: Optional[str] = None
    is_password_protected: Optional[bool] = None
    passcode: Optional[str] = None
    hide_contact_details: Optional[bool] = None


class TrackViewRequest(BaseModel):
    source: Optional[str] = "direct"  # "qr_scan", "direct", "search", "social"


class VisitorLogItem(BaseModel):
    id: str
    visitor_name: Optional[str] = None
    source: str
    visited_at: datetime
    ip_address: Optional[str] = None


class ProfileAnalyticsResponse(BaseModel):
    success: bool = True
    profile_id: str
    slug: Optional[str] = None
    total_views: int = 0
    unique_visitors: int = 0
    qr_scans: int = 0
    direct_views: int = 0
    search_views: int = 0
    recent_visitors: List[VisitorLogItem] = []

