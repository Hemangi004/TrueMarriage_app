from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.models.user import User
from backend.models.enums import ProfileModerationStatus
from backend.dependencies.authorization import require_admin
from backend.schemas.admin import PaginationMetadata
from backend.schemas.admin_profile import (
    AdminProfileListItemResponse,
    AdminProfileDetailResponse,
    PaginatedProfileListResponse,
    ModerationActionRequest,
)
from backend.services.admin_profile_service import (
    list_profiles_paginated,
    get_admin_profile_detail,
    approve_profile,
    reject_profile,
    request_changes_profile,
)

router = APIRouter(prefix="/admin/profiles", tags=["Admin Profile Moderation"])


@router.get("", response_model=PaginatedProfileListResponse)
def list_admin_profiles(
    page: int = Query(1, ge=1, description="Page index (>= 1)"),
    page_size: int = Query(20, ge=1, le=100, description="Page size (1 - 100)"),
    search: Optional[str] = Query(None, description="Search by name, email, or profile ID"),
    status_filter: Optional[ProfileModerationStatus] = Query(None, alias="status", description="Filter by ProfileModerationStatus"),
    sort_by: str = Query("created_at", description="Sort field (created_at, updated_at, submitted_at, status)"),
    sort_order: str = Query("desc", description="Sort order (asc or desc)"),
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Retrieves a paginated list of user profiles for administrative moderation review.
    Enforces require_admin dependency.
    """
    try:
        profiles, total_count, total_pages = list_profiles_paginated(
            db=db,
            page=page,
            page_size=page_size,
            search=search,
            status_filter=status_filter,
            sort_by=sort_by,
            sort_order=sort_order
        )

        return PaginatedProfileListResponse(
            success=True,
            data=[AdminProfileListItemResponse.model_validate(p) for p in profiles],
            pagination=PaginationMetadata(
                page=page,
                page_size=page_size,
                total=total_count,
                total_pages=total_pages
            )
        )
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"success": False, "message": str(val_err)}
        )


@router.get("/{profile_id}", response_model=AdminProfileDetailResponse)
def get_admin_profile(
    profile_id: str,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Retrieves full administrative detail for a profile including payload and moderation metadata.
    Enforces require_admin dependency.
    """
    detail = get_admin_profile_detail(db, profile_id)
    if not detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"success": False, "message": "Profile not found."}
        )
    return AdminProfileDetailResponse.model_validate(detail)


@router.post("/{profile_id}/approve")
def approve_admin_profile(
    profile_id: str,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Approves a profile for public publishing. Sets reviewed_by strictly to current_admin.id.
    """
    success, message, detail = approve_profile(db, current_admin.id, profile_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND if "not found" in message.lower() else status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "message": message}
        )

    return {
        "success": True,
        "message": message,
        "data": AdminProfileDetailResponse.model_validate(detail)
    }


@router.post("/{profile_id}/reject")
def reject_admin_profile(
    profile_id: str,
    payload: ModerationActionRequest,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Rejects a profile with a required administrative reason.
    """
    if not payload.reason or not payload.reason.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"success": False, "message": "A rejection reason is required."}
        )

    success, message, detail = reject_profile(db, current_admin.id, profile_id, payload.reason)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND if "not found" in message.lower() else status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "message": message}
        )

    return {
        "success": True,
        "message": message,
        "data": AdminProfileDetailResponse.model_validate(detail)
    }


@router.post("/{profile_id}/request-changes")
def request_changes_admin_profile(
    profile_id: str,
    payload: ModerationActionRequest,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Requests changes for a profile with required feedback reason.
    """
    if not payload.reason or not payload.reason.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"success": False, "message": "A feedback reason is required when requesting changes."}
        )

    success, message, detail = request_changes_profile(db, current_admin.id, profile_id, payload.reason)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND if "not found" in message.lower() else status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "message": message}
        )

    return {
        "success": True,
        "message": message,
        "data": AdminProfileDetailResponse.model_validate(detail)
    }


@router.delete("/{profile_id}")
def delete_admin_profile(
    profile_id: str,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Admin route: Permanently hard-deletes a biodata profile by ID.
    This action is irreversible and bypasses any moderation status.
    """
    from sqlalchemy import select as sa_select, update as sa_update, delete as sa_delete
    from backend.models.biodata import BiodataProfileModel
    from backend.models.interest import InterestModel
    from backend.models.shortlist import ShortlistModel
    from backend.models.profile_analytics import ProfileAnalyticsModel
    from backend.models.match_insight import MatchInsightModel
    from backend.models.notification import NotificationModel

    profile = db.scalar(sa_select(BiodataProfileModel).where(BiodataProfileModel.id == profile_id))
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"success": False, "message": "Profile not found."}
        )

    target_user_id = profile.user_id

    try:
        # 1. Nullify foreign key references in interests
        db.execute(
            sa_update(InterestModel)
            .where(InterestModel.sender_profile_id == profile_id)
            .values(sender_profile_id=None)
        )
        db.execute(
            sa_update(InterestModel)
            .where(InterestModel.receiver_profile_id == profile_id)
            .values(receiver_profile_id=None)
        )

        # 2. Delete shortlists referencing this profile
        db.execute(
            sa_delete(ShortlistModel).where(ShortlistModel.profile_id == profile_id)
        )

        # 3. Delete profile analytics referencing this profile
        db.execute(
            sa_delete(ProfileAnalyticsModel).where(ProfileAnalyticsModel.profile_id == profile_id)
        )

        # 4. Delete match insights referencing this candidate profile
        db.execute(
            sa_delete(MatchInsightModel).where(MatchInsightModel.candidate_profile_id == profile_id)
        )

        # 5. Nullify related notifications
        db.execute(
            sa_update(NotificationModel)
            .where(NotificationModel.related_entity_id == profile_id)
            .values(related_entity_id=None)
        )

        # 6. Delete the profile itself
        db.delete(profile)
        db.commit()

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Admin failed to delete profile {profile_id}: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"success": False, "message": f"Failed to delete profile: {str(e)}"}
        )

    # 7. Record security audit log
    try:
        from backend.services.security_log_service import log_security_event
        log_security_event(
            db=db,
            event_type="ADMIN_PROFILE_DELETED",
            severity="WARNING",
            user_id=current_admin.id,
            target_user_id=target_user_id,
            details={
                "profile_id": profile_id,
                "admin_id": current_admin.id,
                "admin_email": current_admin.email,
            }
        )
    except Exception as log_err:
        logger.warning(f"Could not log security event for admin profile deletion: {log_err}")

    return {"success": True, "message": f"Profile {profile_id} permanently deleted by admin."}
