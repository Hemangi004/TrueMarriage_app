import uuid
from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, ConfigDict, Field


class CategoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    slug: str
    icon: str = "✨"
    description: Optional[str] = None
    is_active: bool = True
    display_order: int = 0


class CategoryCreate(BaseModel):
    id: Optional[str] = None
    name: str
    slug: Optional[str] = None
    icon: str = "✨"
    description: Optional[str] = None
    is_active: bool = True
    display_order: int = 0


class TemplateVersionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    template_id: str
    version: int
    layout_json: Dict[str, Any]
    change_summary: Optional[str] = None
    created_by: Optional[str] = None
    created_at: datetime


class TemplateListResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    slug: str
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    status: str = "PUBLISHED"
    pricing_type: str = "FREE"
    is_luxury: bool = False
    badge: Optional[str] = None
    preview_icon: str = "📄"
    default_accent: str = "#B45309"
    default_bg: str = "#FFFFFF"
    font_family: str = "Playfair Display"
    layout_json: Optional[Dict[str, Any]] = None
    version: int = 1
    categories: List[CategoryResponse] = []
    created_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class TemplateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    slug: str
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    status: str = "PUBLISHED"
    pricing_type: str = "FREE"
    is_luxury: bool = False
    badge: Optional[str] = None
    preview_icon: str = "📄"
    default_accent: str = "#B45309"
    default_bg: str = "#FFFFFF"
    font_family: str = "Playfair Display"
    layout_json: Dict[str, Any]
    version: int = 1
    categories: List[CategoryResponse] = []
    created_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class TemplateCreate(BaseModel):
    id: Optional[str] = None
    name: str
    slug: Optional[str] = None
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    status: str = "DRAFT"
    pricing_type: str = "FREE"
    is_luxury: bool = False
    badge: Optional[str] = None
    preview_icon: str = "📄"
    default_accent: str = "#B45309"
    default_bg: str = "#FFFFFF"
    font_family: str = "Playfair Display"
    layout_json: Optional[Dict[str, Any]] = None
    category_ids: List[str] = []


class TemplateUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    status: Optional[str] = None
    pricing_type: Optional[str] = None
    is_luxury: Optional[bool] = None
    badge: Optional[str] = None
    preview_icon: Optional[str] = None
    default_accent: Optional[str] = None
    default_bg: Optional[str] = None
    font_family: Optional[str] = None
    layout_json: Optional[Dict[str, Any]] = None
    category_ids: Optional[List[str]] = None
    change_summary: Optional[str] = None


class FavoriteToggleInput(BaseModel):
    template_id: str
