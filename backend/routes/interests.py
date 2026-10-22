from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.models.user import User
from backend.dependencies.auth import get_current_user
from backend.schemas.interactions import (
    SendInterestRequest, InterestResponse, PaginatedInterestResponse
)
from backend.services.interest_service import (
    send_interest, withdraw_interest, accept_interest,
    decline_interest, list_sent_interests, list_received_interests,
)

router = APIRouter(prefix="/interests", tags=["Interests"])


@router.post("")
def send_interest_endpoint(
    response: Response,
    body: SendInterestRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Send interest to an approved profile."""
    success, http_status, message, data = send_interest(db, current_user, body.profile_id)
    if not success:
        raise HTTPException(status_code=http_status, detail={"success": False, "message": message})
    response.status_code = http_status
    return {"success": True, "message": message, "data": data}


@router.get("/sent", response_model=PaginatedInterestResponse)
def list_sent(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None, description="Filter by status (PENDING, ACCEPTED, DECLINED, WITHDRAWN, MATCHED)"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List interests sent by the authenticated user."""
    result = list_sent_interests(db, current_user.id, page=page, page_size=page_size, status_filter=status)
    return PaginatedInterestResponse(success=True, **result)


@router.get("/received", response_model=PaginatedInterestResponse)
def list_received(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None, description="Filter by status"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List interests received by the authenticated user."""
    result = list_received_interests(db, current_user.id, page=page, page_size=page_size, status_filter=status)
    return PaginatedInterestResponse(success=True, **result)


@router.post("/{interest_id}/withdraw")
def withdraw(
    interest_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Sender withdraws a PENDING interest."""
    success, http_status, message, data = withdraw_interest(db, interest_id, current_user)
    if not success:
        raise HTTPException(status_code=http_status, detail={"success": False, "message": message})
    return {"success": True, "message": message, "data": data}


@router.post("/{interest_id}/accept")
def accept(
    interest_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Recipient accepts a PENDING interest."""
    success, http_status, message, data = accept_interest(db, interest_id, current_user)
    if not success:
        raise HTTPException(status_code=http_status, detail={"success": False, "message": message})
    return {"success": True, "message": message, "data": data}


@router.post("/{interest_id}/decline")
def decline(
    interest_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Recipient declines a PENDING interest."""
    success, http_status, message, data = decline_interest(db, interest_id, current_user)
    if not success:
        raise HTTPException(status_code=http_status, detail={"success": False, "message": message})
    return {"success": True, "message": message, "data": data}
