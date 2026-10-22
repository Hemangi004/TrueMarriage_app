import re
import uuid
import base64
from pathlib import Path
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Body, Query
from sqlalchemy.orm import Session
from sqlalchemy import select, or_

from backend.db.session import get_db
from backend.models.user import User
from backend.models.template import Template, Category, TemplateCategory, TemplateVersion
from backend.schemas.template import (
    TemplateResponse, TemplateListResponse, TemplateCreate, TemplateUpdate, CategoryResponse, CategoryCreate, TemplateVersionResponse
)
from backend.dependencies.authorization import require_admin

THUMBNAILS_DIR = Path(__file__).resolve().parent.parent / "static" / "thumbnails"
THUMBNAILS_DIR.mkdir(parents=True, exist_ok=True)

router = APIRouter(prefix="/admin", tags=["Templates Admin"])


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    return re.sub(r'[\s_-]+', '-', text)


@router.get("/templates", response_model=List[TemplateListResponse])
def admin_list_templates(
    include_layout: bool = Query(False, description="Include full layout_json in list response"),
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """List all templates (including DRAFT & ARCHIVED) for Admin Management."""
    stmt = select(Template).order_by(Template.created_at.desc())
    templates = db.scalars(stmt).unique().all()
    if not include_layout:
        return [
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
            for t in templates
        ]
    return templates


@router.post("/templates", response_model=TemplateResponse)
def admin_create_template(
    payload: TemplateCreate,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Create new template draft with initial layout JSON."""
    tpl_id = payload.id or f"tpl_{uuid.uuid4().hex[:8]}"
    slug = payload.slug or slugify(payload.name) or tpl_id

    # Check existing slug
    if db.scalar(select(Template).where(Template.slug == slug)):
        slug = f"{slug}-{uuid.uuid4().hex[:4]}"

    default_layout = payload.layout_json or {
        "page": {"width": 794, "height": 1123, "background": payload.default_bg, "padding": 32, "fontFamily": payload.font_family},
        "elements": [
            {
                "id": "header_title",
                "type": "text",
                "content": "{{personalDetails.fullName}}",
                "x": 50,
                "y": 60,
                "width": 694,
                "height": 50,
                "zIndex": 2,
                "style": {
                    "fontSize": 28,
                    "fontWeight": "bold",
                    "color": payload.default_accent,
                    "textAlign": "center",
                    "fontFamily": payload.font_family
                }
            }
        ]
    }

    template = Template(
        id=tpl_id,
        name=payload.name,
        slug=slug,
        description=payload.description,
        thumbnail_url=payload.thumbnail_url,
        status=payload.status,
        pricing_type=payload.pricing_type,
        is_luxury=payload.is_luxury,
        badge=payload.badge,
        preview_icon=payload.preview_icon,
        default_accent=payload.default_accent,
        default_bg=payload.default_bg,
        font_family=payload.font_family,
        layout_json=default_layout,
        version=1,
        created_by=current_admin.id
    )

    db.add(template)
    db.flush()

    # Link categories
    if payload.category_ids:
        for c_id in payload.category_ids:
            if db.scalar(select(Category).where(Category.id == c_id)):
                db.add(TemplateCategory(template_id=template.id, category_id=c_id))

    # Log initial version history
    version_entry = TemplateVersion(
        template_id=template.id,
        version=1,
        layout_json=default_layout,
        change_summary="Initial template draft creation",
        created_by=current_admin.id
    )
    db.add(version_entry)

    db.commit()
    db.refresh(template)
    return template


@router.put("/templates/{template_id}", response_model=TemplateResponse)
def admin_update_template(
    template_id: str,
    payload: TemplateUpdate,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Update layout JSON, status, or properties and automatically log version history."""
    stmt = select(Template).where(Template.id == template_id)
    template = db.scalar(stmt)
    if not template:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")

    layout_changed = False
    if payload.layout_json is not None:
        layout_changed = True
        template.layout_json = payload.layout_json
        from sqlalchemy.orm.attributes import flag_modified
        flag_modified(template, "layout_json")
        template.version += 1

    if payload.name is not None:
        template.name = payload.name
    if payload.slug is not None:
        template.slug = payload.slug
    if payload.description is not None:
        template.description = payload.description
    if payload.thumbnail_url is not None:
        template.thumbnail_url = payload.thumbnail_url
    if payload.status is not None:
        template.status = payload.status
    if payload.pricing_type is not None:
        template.pricing_type = payload.pricing_type
    if payload.is_luxury is not None:
        template.is_luxury = payload.is_luxury
    if payload.badge is not None:
        template.badge = payload.badge
    if payload.preview_icon is not None:
        template.preview_icon = payload.preview_icon
    if payload.default_accent is not None:
        template.default_accent = payload.default_accent
    if payload.default_bg is not None:
        template.default_bg = payload.default_bg
    if payload.font_family is not None:
        template.font_family = payload.font_family

    # Update category associations if provided
    if payload.category_ids is not None:
        db.query(TemplateCategory).filter(TemplateCategory.template_id == template.id).delete()
        for c_id in payload.category_ids:
            if db.scalar(select(Category).where(Category.id == c_id)):
                db.add(TemplateCategory(template_id=template.id, category_id=c_id))

    # Log version history if layout changed
    if layout_changed:
        version_entry = TemplateVersion(
            template_id=template.id,
            version=template.version,
            layout_json=template.layout_json,
            change_summary=payload.change_summary or f"Updated to version {template.version}",
            created_by=current_admin.id
        )
        db.add(version_entry)

    db.commit()
    db.refresh(template)
    return template


@router.post("/templates/{template_id}/duplicate", response_model=TemplateResponse)
def admin_duplicate_template(
    template_id: str,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Clone an existing template as a new draft."""
    stmt = select(Template).where(Template.id == template_id)
    source = db.scalar(stmt)
    if not source:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Source template not found")

    new_id = f"tpl_{uuid.uuid4().hex[:8]}"
    new_name = f"{source.name} (Copy)"
    new_slug = f"{source.slug}-copy-{uuid.uuid4().hex[:4]}"

    cloned = Template(
        id=new_id,
        name=new_name,
        slug=new_slug,
        description=source.description,
        thumbnail_url=source.thumbnail_url,
        status="DRAFT",
        pricing_type=source.pricing_type,
        is_luxury=source.is_luxury,
        badge=source.badge,
        preview_icon=source.preview_icon,
        default_accent=source.default_accent,
        default_bg=source.default_bg,
        font_family=source.font_family,
        layout_json=source.layout_json,
        version=1,
        created_by=current_admin.id
    )

    db.add(cloned)
    db.flush()

    # Clone category mappings
    for cat in source.categories:
        db.add(TemplateCategory(template_id=cloned.id, category_id=cat.id))

    db.commit()
    db.refresh(cloned)
    return cloned


@router.delete("/templates/{template_id}")
def admin_delete_template(
    template_id: str,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Delete template."""
    stmt = select(Template).where(Template.id == template_id)
    template = db.scalar(stmt)
    if not template:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")

    db.delete(template)
    db.commit()
    return {"success": True, "message": f"Template '{template.name}' deleted successfully."}


@router.post("/categories", response_model=CategoryResponse)
def admin_create_or_update_category(
    payload: CategoryCreate,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Create or update template category."""
    cat_id = payload.id or slugify(payload.name)
    stmt = select(Category).where(Category.id == cat_id)
    cat = db.scalar(stmt)

    if cat:
        cat.name = payload.name
        cat.icon = payload.icon
        cat.description = payload.description
        cat.is_active = payload.is_active
        cat.display_order = payload.display_order
    else:
        cat = Category(
            id=cat_id,
            name=payload.name,
            slug=payload.slug or slugify(payload.name),
            icon=payload.icon,
            description=payload.description,
            is_active=payload.is_active,
            display_order=payload.display_order
        )
        db.add(cat)

    db.commit()
    db.refresh(cat)
    return cat


@router.get("/templates/{template_id}/versions", response_model=List[TemplateVersionResponse])
def admin_get_template_versions(
    template_id: str,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Fetch version history for rollback/auditing."""
    stmt = select(TemplateVersion).where(
        TemplateVersion.template_id == template_id
    ).order_by(TemplateVersion.version.desc())
    return db.scalars(stmt).all()


@router.post("/templates/{template_id}/thumbnail")
def upload_template_thumbnail(
    template_id: str,
    payload: Dict[str, Any] = Body(...),
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Upload or update base64 pre-rendered thumbnail image for a template."""
    stmt = select(Template).where(Template.id == template_id)
    template = db.scalar(stmt)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    image_data = payload.get("image_data")
    if not image_data:
        raise HTTPException(status_code=400, detail="Missing 'image_data' in request body")

    try:
        # Format can be data:image/webp;base64,... or data:image/png;base64,...
        if "," in image_data:
            image_data = image_data.split(",", 1)[1]
        raw_bytes = base64.b64decode(image_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid base64 image data: {e}")

    file_name = f"{template_id}.webp"
    dest_path = THUMBNAILS_DIR / file_name

    try:
        from PIL import Image
        import io
        img = Image.open(io.BytesIO(raw_bytes))
        w, h = img.size
        # Detect corner padding (content ends before 88% width and height)
        cols, rows = [], []
        step = 2
        for y in range(0, h, step):
            for x in range(0, w, step):
                p = img.getpixel((x, y))[:3]
                if not (p[0] > 248 and p[1] > 248 and p[2] > 248):
                    cols.append(x)
                    rows.append(y)
        if cols and rows:
            min_x, min_y = min(cols), min(rows)
            max_x, max_y = max(cols), max(rows)
            if min_x <= 10 and min_y <= 10 and max_x < int(w * 0.88) and max_y < int(h * 0.88):
                img = img.crop((0, 0, max_x + 1, max_y + 1)).resize((397, 561), Image.Resampling.LANCZOS)
        
        img.save(dest_path, "WEBP", quality=92)
    except Exception:
        with open(dest_path, "wb") as f:
            f.write(raw_bytes)

    thumbnail_url = f"/static/thumbnails/{file_name}"
    template.thumbnail_url = thumbnail_url
    db.commit()

    return {
        "success": True,
        "template_id": template_id,
        "thumbnail_url": thumbnail_url
    }

