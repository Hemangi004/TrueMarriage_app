from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.models.user import User
from backend.dependencies.auth import get_current_user, get_optional_current_user
from backend.schemas.public_profile import (
    PublicProfileDetailResponse,
    VerifyPasscodeRequest,
    UpdateProfileSettingsRequest,
    TrackViewRequest,
    ProfileAnalyticsResponse,
)
from backend.services.discovery_service import (
    get_public_profile_by_slug_or_id,
    record_profile_view,
    get_profile_analytics_summary,
    update_profile_privacy_settings,
)

router = APIRouter(prefix="/public/profiles", tags=["Public Profile & QR Analytics"])


@router.get("/{identifier}", response_model=PublicProfileDetailResponse)
def get_public_profile_by_slug(
    identifier: str,
    passcode: Optional[str] = Query(None, description="Optional passcode for protected profiles"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Public Profile Endpoint: Resolves candidates by unique SEO slug or ID.
    Requires authenticated user session to protect member privacy.
    Supports password protection and contact hiding.
    """
    visitor_id = current_user.id
    success, http_status, message, profile_dict, is_locked = get_public_profile_by_slug_or_id(
        db=db,
        identifier=identifier,
        visitor_user_id=visitor_id,
        passcode=passcode
    )

    if not success or not profile_dict:
        raise HTTPException(
            status_code=http_status,
            detail={"success": False, "message": message}
        )

    return PublicProfileDetailResponse.model_validate(profile_dict)


@router.post("/{identifier}/verify-passcode", response_model=PublicProfileDetailResponse)
def verify_profile_passcode(
    identifier: str,
    payload: VerifyPasscodeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Verifies passcode for password-protected profiles and returns full profile data upon success.
    """
    visitor_id = current_user.id if current_user else None
    success, http_status, message, profile_dict, is_locked = get_public_profile_by_slug_or_id(
        db=db,
        identifier=identifier,
        visitor_user_id=visitor_id,
        passcode=payload.passcode
    )

    if not success or is_locked or not profile_dict:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED if is_locked else http_status,
            detail={"success": False, "message": "Incorrect passcode. Access denied." if is_locked else message}
        )

    return PublicProfileDetailResponse.model_validate(profile_dict)


@router.post("/{identifier}/track-view")
def track_profile_view_event(
    identifier: str,
    payload: TrackViewRequest,
    request: Request,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """
    Logs visitor views and QR scan events.
    """
    visitor_id = current_user.id if current_user else None
    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")

    recorded = record_profile_view(
        db=db,
        profile_id=identifier,
        source=payload.source or "direct",
        visitor_user_id=visitor_id,
        ip_address=client_ip,
        user_agent=user_agent
    )

    return {"success": True, "recorded": recorded}


@router.get("/user/my-analytics", response_model=ProfileAnalyticsResponse)
def get_my_profile_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns analytics metrics (views, QR scans, unique visitors, logs) for the logged-in user's profile.
    """
    if not current_user.biodata:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"success": False, "message": "You do not have an active profile yet."}
        )

    analytics = get_profile_analytics_summary(db=db, profile_id=current_user.biodata.id)
    if not analytics:
        return ProfileAnalyticsResponse(
            success=True,
            profile_id=current_user.biodata.id,
            slug=current_user.biodata.slug,
            total_views=0,
            unique_visitors=0,
            qr_scans=0,
            direct_views=0,
            search_views=0,
            recent_visitors=[]
        )

    return ProfileAnalyticsResponse.model_validate(analytics)


@router.put("/user/my-privacy-settings")
def update_my_profile_settings(
    payload: UpdateProfileSettingsRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Updates custom SEO slug, password protection PIN, and contact visibility preferences.
    """
    if not current_user.biodata:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"success": False, "message": "You do not have an active profile yet."}
        )

    success, message, updated_profile = update_profile_privacy_settings(
        db=db,
        profile_id=current_user.biodata.id,
        user_id=current_user.id,
        slug=payload.slug,
        is_password_protected=payload.is_password_protected,
        passcode=payload.passcode,
        hide_contact_details=payload.hide_contact_details
    )

    if not success or not updated_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "message": message}
        )

    return {
        "success": True,
        "message": message,
        "slug": updated_profile.slug,
        "is_password_protected": updated_profile.is_password_protected,
        "hide_contact_details": updated_profile.hide_contact_details
    }
