from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.models.user import User
from backend.dependencies.auth import get_current_user
from backend.schemas.interactions import ShortlistRequest, ShortlistResponse, PaginatedShortlistResponse
from backend.services.shortlist_service import (
    add_shortlist, remove_shortlist, get_shortlist, get_shortlisted_profile_ids
)

router = APIRouter(prefix="/shortlists", tags=["Shortlists"])


@router.post("")
def add_to_shortlist(
    response: Response,
    body: ShortlistRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add an approved profile to the current user's shortlist."""
    success, http_status, message, data = add_shortlist(db, current_user, body.profile_id)
    if not success:
        raise HTTPException(status_code=http_status, detail={"success": False, "message": message})
    response.status_code = http_status
    return {"success": True, "message": message, "data": data}


@router.delete("/{profile_id}")
def remove_from_shortlist(
    profile_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Remove a profile from the current user's shortlist."""
    success, http_status, message = remove_shortlist(db, current_user, profile_id)
    if not success:
        raise HTTPException(status_code=http_status, detail={"success": False, "message": message})
    return {"success": True, "message": message}


@router.get("", response_model=PaginatedShortlistResponse)
def list_shortlist(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get the current user's shortlisted profiles."""
    result = get_shortlist(db, current_user.id, page=page, page_size=page_size)
    return PaginatedShortlistResponse(success=True, **result)


@router.get("/ids")
def list_shortlisted_ids(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all profile IDs in the user's shortlist (for UI state hydration)."""
    ids = get_shortlisted_profile_ids(db, current_user.id)
    return {"success": True, "data": ids}
