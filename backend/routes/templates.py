import re
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import select, or_, and_

from backend.db.session import get_db
from backend.models.user import User
from backend.models.template import Template, Category, Favorite, TemplateCategory
from backend.schemas.template import TemplateResponse, TemplateListResponse, CategoryResponse, FavoriteToggleInput
from backend.dependencies.auth import get_optional_current_user, get_current_user

router = APIRouter(prefix="/templates", tags=["Templates Public"])


@router.get("/categories", response_model=List[CategoryResponse])
def get_public_categories(db: Session = Depends(get_db)):
    """Fetch active categories for filter pills."""
    stmt = select(Category).where(Category.is_active.is_(True)).order_by(Category.display_order)
    return db.scalars(stmt).all()


@router.get("", response_model=List[TemplateListResponse])
def search_public_templates(
    search: Optional[str] = Query(None, description="Search term in template name or description"),
    category: Optional[str] = Query(None, description="Category slug or ID"),
    pricing_type: Optional[str] = Query(None, description="FREE or PREMIUM"),
    is_luxury: Optional[bool] = Query(None, description="Filter luxury templates"),
    include_layout: bool = Query(False, description="Whether to include full layout_json in list response"),
    db: Session = Depends(get_db)
):
    """Search & filter published templates for public gallery."""
    stmt = select(Template).where(Template.status == "PUBLISHED")

    if pricing_type and isinstance(pricing_type, str) and pricing_type.upper() not in ("ALL", ""):
        stmt = stmt.where(Template.pricing_type == pricing_type.upper())

    if is_luxury is not None:
        stmt = stmt.where(Template.is_luxury == is_luxury)

    if search and isinstance(search, str) and search.strip():
        search_pattern = f"%{search.strip()}%"
        stmt = stmt.where(
            or_(
                Template.name.ilike(search_pattern),
                Template.description.ilike(search_pattern),
                Template.badge.ilike(search_pattern)
            )
        )

    if category and category.lower() != "all":
        cat_lower = category.lower().strip()
        slug_targets = [cat_lower]
        keyword_targets = [cat_lower]

        if cat_lower in ("royal", "heritage", "royal & heritage", "royal-heritage"):
            slug_targets.extend(["royal", "heritage"])
            keyword_targets.extend(["royal", "royale", "raj", "darbar", "heritage", "imperial", "maharaja", "regal", "sovereign"])
        elif cat_lower in ("minimalist", "minimal"):
            slug_targets.extend(["minimalist", "minimal"])
            keyword_targets.extend(["minimal", "clean", "minimalist"])
        elif cat_lower == "traditional":
            keyword_targets.extend(["tradition", "hindu", "shehnai", "vivah"])
        elif cat_lower == "floral":
            keyword_targets.extend(["bloom", "flora", "flower", "rose", "gulab", "petal", "lotus"])
        elif cat_lower == "modern":
            keyword_targets.extend(["modern", "contemporary"])
        elif cat_lower == "luxury":
            keyword_targets.extend(["luxury", "luxe", "opulence", "gold", "velvet", "sovereign"])

        conditions = [
            Category.slug.in_(slug_targets),
            Category.id.in_(slug_targets),
        ]
        for kw in keyword_targets:
            conditions.append(Template.name.ilike(f"%{kw}%"))
            conditions.append(Template.badge.ilike(f"%{kw}%"))

        if cat_lower == "luxury":
            conditions.append(Template.is_luxury.is_(True))

        stmt = stmt.outerjoin(TemplateCategory).outerjoin(Category).where(or_(*conditions))

    stmt = stmt.order_by(Template.created_at.desc())
    templates = db.scalars(stmt).unique().all()

    # Deduplicate by template name so gallery never displays duplicate cards
    seen_names = set()
    deduped_templates = []
    for t in templates:
        norm_name = (t.name or "").strip().lower()
        if norm_name:
            if norm_name in seen_names:
                continue
            seen_names.add(norm_name)
        deduped_templates.append(t)
    templates = deduped_templates

    if not include_layout:
        result = []
        for t in templates:
            result.append(
                TemplateListResponse(
                    id=t.id,
                    name=t.name,
                    slug=t.slug,
                    description=t.description,
                    thumbnail_url=t.thumbnail_url,
                    status=t.status,
                    pricing_type=t.pricing_type,
                    is_luxury=t.is_luxury,
                    badge=t.badge,
                    preview_icon=t.preview_icon,
                    default_accent=t.default_accent,
                    default_bg=t.default_bg,
                    font_family=t.font_family,
                    layout_json=None,
                    version=t.version,
                    categories=[CategoryResponse.model_validate(c) for c in t.categories],
                    created_by=t.created_by,
                    created_at=t.created_at,
                    updated_at=t.updated_at
                )
            )
        return result

    return templates


@router.get("/{template_id}", response_model=TemplateResponse)
def get_template_detail(template_id: str, db: Session = Depends(get_db)):
    """Fetch detail and layout JSON of a specific template."""
    stmt = select(Template).where(
        or_(Template.id == template_id, Template.slug == template_id)
    )
    tpl = db.scalar(stmt)
    if not tpl:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")
    return tpl


@router.post("/favorite")
def toggle_template_favorite(
    payload: FavoriteToggleInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Toggle template bookmark/favorite status for authenticated user."""
    stmt = select(Favorite).where(
        Favorite.user_id == current_user.id,
        Favorite.template_id == payload.template_id
    )
    fav = db.scalar(stmt)

    if fav:
        db.delete(fav)
        db.commit()
        return {"success": True, "favorited": False, "message": "Removed from favorites"}
    else:
        new_fav = Favorite(user_id=current_user.id, template_id=payload.template_id)
        db.add(new_fav)
        db.commit()
        return {"success": True, "favorited": True, "message": "Added to favorites"}
