import json
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status, Request
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.models.user import User
from backend.models.enums import UserRole, UserStatus
from backend.dependencies.authorization import require_admin
from backend.schemas.admin import (
    AdminUserDetailResponse,
    PaginatedUserListResponse,
    PaginationMetadata,
    StatusActionRequest,
)
from backend.services.admin_user_service import (
    list_users_paginated,
    get_user_by_id,
    change_user_status,
)

router = APIRouter(prefix="/admin/users", tags=["Admin User Management"])


def extract_profile_picture(biodata) -> Optional[str]:
    if not biodata or not biodata.profile_data:
        return None
    b_data = biodata.profile_data
    if isinstance(b_data, str):
        try:
            b_data = json.loads(b_data)
        except Exception:
            return None
    if not isinstance(b_data, dict):
        return None
    pic = b_data.get("profilePictureUrl") or b_data.get("photoUrl") or b_data.get("image") or b_data.get("photo")
    if not pic and b_data.get("photos"):
        photos_val = b_data.get("photos")
        if isinstance(photos_val, list) and len(photos_val) > 0:
            first = photos_val[0]
            if isinstance(first, str):
                pic = first
            elif isinstance(first, dict):
                pic = first.get("url") or first.get("photoUrl")
    if pic and str(pic).strip():
        return str(pic).strip()
    return None


@router.get("", response_model=PaginatedUserListResponse)
def list_admin_users(
    page: int = Query(1, ge=1, description="Page index (>= 1)"),
    page_size: int = Query(20, ge=1, le=100, description="Page size (1 - 100)"),
    search: Optional[str] = Query(None, description="Search term for email or full name"),
    status_filter: Optional[UserStatus] = Query(None, alias="status", description="Filter by UserStatus"),
    role_filter: Optional[UserRole] = Query(None, alias="role", description="Filter by UserRole"),
    is_email_verified: Optional[bool] = Query(None, description="Filter by email verification status"),
    sort_by: str = Query("created_at", description="Sort field"),
    sort_order: str = Query("desc", description="Sort direction (asc or desc)"),
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Retrieves a paginated list of user accounts with search, status/role filtering, and safe sorting.
    Enforces require_admin dependency.
    """
    try:
        users, total_count, total_pages = list_users_paginated(
            db=db,
            page=page,
            page_size=page_size,
            search=search,
            status_filter=status_filter,
            role_filter=role_filter,
            is_email_verified_filter=is_email_verified,
            sort_by=sort_by,
            sort_order=sort_order
        )

        user_list = []
        for u in users:
            bio = u.biodata
            b_data = bio.profile_data if bio and bio.profile_data else {}
            b_name = (b_data.get("fullName") or b_data.get("name")) if bio else None
            user_list.append(AdminUserDetailResponse(
                id=u.id,
                email=u.email,
                full_name=u.full_name,
                role=u.role,
                status=u.status,
                is_email_verified=u.is_email_verified,
                phone=u.phone,
                is_phone_verified=u.is_phone_verified,
                profile_id=bio.id if bio else None,
                profile_picture_url=extract_profile_picture(bio),
                biodata_name=b_name,
                biodata_slug=bio.slug if bio else None,
                created_at=u.created_at,
                updated_at=u.updated_at,
                last_login_at=u.last_login_at,
            ))

        return PaginatedUserListResponse(
            success=True,
            data=user_list,
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


@router.get("/{user_id}", response_model=AdminUserDetailResponse)
def get_admin_user_detail(
    user_id: str,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Retrieves administrative details for a specific user ID.
    Enforces require_admin dependency.
    """
    target_user = get_user_by_id(db, user_id)
    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"success": False, "message": "User not found."}
        )
    bio = target_user.biodata
    b_data = bio.profile_data if bio and bio.profile_data else {}
    if isinstance(b_data, str):
        try:
            b_data = json.loads(b_data)
        except Exception:
            b_data = {}
    if not isinstance(b_data, dict):
        b_data = {}

    b_name = (b_data.get("fullName") or b_data.get("name")) if bio else None

    # Extract all uploaded gallery/profile photos
    gallery_raw = b_data.get("galleryPictures") or b_data.get("photos") or []
    if isinstance(gallery_raw, str):
        gallery_list = [gallery_raw]
    elif isinstance(gallery_raw, list):
        gallery_list = [str(g) for g in gallery_raw if g]
    else:
        gallery_list = []

    fam_photo = b_data.get("familyPhotoUrl")
    if fam_photo and str(fam_photo) not in gallery_list:
        gallery_list.append(str(fam_photo))

    return AdminUserDetailResponse(
        id=target_user.id,
        email=target_user.email,
        full_name=target_user.full_name,
        role=target_user.role,
        status=target_user.status,
        is_email_verified=target_user.is_email_verified,
        phone=target_user.phone,
        is_phone_verified=target_user.is_phone_verified,
        profile_id=bio.id if bio else None,
        profile_picture_url=extract_profile_picture(bio),
        gallery_pictures=gallery_list if gallery_list else None,
        biodata_name=b_name,
        biodata_slug=bio.slug if bio else None,
        profile_data=b_data if b_data else None,
        created_at=target_user.created_at,
        updated_at=target_user.updated_at,
        last_login_at=target_user.last_login_at,
    )


@router.patch("/{user_id}/status")
def update_user_status_patch(
    user_id: str,
    payload: StatusActionRequest,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Updates status for target user (BLOCK, UNBLOCK, ACTIVATE, DEACTIVATE).
    Enforces admin self-protection and session revocation.
    """
    success, message, target_user = change_user_status(
        db=db,
        admin_user_id=current_admin.id,
        target_user_id=user_id,
        new_status=payload.status,
        reason=payload.reason
    )

    if not success:
        status_code = status.HTTP_404_NOT_FOUND if "not found" in message.lower() else status.HTTP_400_BAD_REQUEST
        raise HTTPException(
            status_code=status_code,
            detail={"success": False, "message": message}
        )

    return {
        "success": True,
        "message": message,
        "data": AdminUserDetailResponse.model_validate(target_user)
    }


@router.post("/{user_id}/block")
def block_user_account(
    user_id: str,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Blocks target user account and immediately revokes all active sessions.
    """
    return update_user_status_patch(user_id, StatusActionRequest(status=UserStatus.BLOCKED), current_admin, db)


@router.post("/{user_id}/unblock")
def unblock_user_account(
    user_id: str,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Unblocks target user account (transitions status to ACTIVE).
    """
    return update_user_status_patch(user_id, StatusActionRequest(status=UserStatus.ACTIVE), current_admin, db)


@router.post("/{user_id}/activate")
def activate_user_account(
    user_id: str,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Activates target user account.
    """
    return update_user_status_patch(user_id, StatusActionRequest(status=UserStatus.ACTIVE), current_admin, db)


@router.post("/{user_id}/deactivate")
def deactivate_user_account(
    user_id: str,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Deactivates target user account and immediately revokes all active sessions.
    """
    return update_user_status_patch(user_id, StatusActionRequest(status=UserStatus.DEACTIVATED), current_admin, db)


@router.delete("/{user_id}")
def delete_admin_user_account(
    user_id: str,
    request: Request,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Admin route: Permanently deletes a user account and their associated profile/sessions.
    """
    from sqlalchemy import select as sa_select, update as sa_update, delete as sa_delete
    from backend.services.security_log_service import log_security_event
    from backend.models.biodata import BiodataProfileModel
    from backend.models.interest import InterestModel
    from backend.models.shortlist import ShortlistModel
    from backend.models.profile_analytics import ProfileAnalyticsModel
    from backend.models.match_insight import MatchInsightModel
    from backend.models.notification import NotificationModel
    from backend.models.premium_interest import PremiumInterestEvent

    if current_admin.id == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "message": "Cannot delete your own admin account."}
        )

    target_user = db.scalar(sa_select(User).where(User.id == user_id))
    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"success": False, "message": "User not found."}
        )

    client_ip = request.client.host if request.client else "Unknown"
    user_agent = request.headers.get("user-agent", "")
    target_email = target_user.email
    target_role = str(target_user.role.value) if target_user.role else "USER"

    # 1. Clean up associated biodata profile and its dependent references if profile exists
    bio = db.scalar(sa_select(BiodataProfileModel).where(BiodataProfileModel.user_id == user_id))
    if bio:
        bio_id = bio.id
        db.execute(
            sa_update(InterestModel)
            .where(InterestModel.sender_profile_id == bio_id)
            .values(sender_profile_id=None)
        )
        db.execute(
            sa_update(InterestModel)
            .where(InterestModel.receiver_profile_id == bio_id)
            .values(receiver_profile_id=None)
        )
        db.execute(sa_delete(ShortlistModel).where(ShortlistModel.profile_id == bio_id))
        db.execute(sa_delete(ProfileAnalyticsModel).where(ProfileAnalyticsModel.profile_id == bio_id))
        db.execute(sa_delete(MatchInsightModel).where(MatchInsightModel.candidate_profile_id == bio_id))
        db.execute(
            sa_update(NotificationModel)
            .where(NotificationModel.related_entity_id == bio_id)
            .values(related_entity_id=None)
        )
        db.delete(bio)
        db.flush()

    # 2. Clean up user-level references across relational tables
    db.execute(
        sa_delete(InterestModel).where(
            (InterestModel.sender_user_id == user_id) | (InterestModel.receiver_user_id == user_id)
        )
    )
    db.execute(sa_delete(ShortlistModel).where(ShortlistModel.user_id == user_id))
    db.execute(sa_delete(MatchInsightModel).where(MatchInsightModel.user_id == user_id))
    db.execute(sa_delete(NotificationModel).where(NotificationModel.user_id == user_id))
    db.execute(
        sa_update(ProfileAnalyticsModel)
        .where(ProfileAnalyticsModel.visitor_user_id == user_id)
        .values(visitor_user_id=None)
    )
    db.execute(sa_delete(PremiumInterestEvent).where(PremiumInterestEvent.user_id == user_id))
    db.execute(
        sa_update(BiodataProfileModel)
        .where(BiodataProfileModel.reviewed_by == user_id)
        .values(reviewed_by=None)
    )

    log_security_event(
        db=db,
        event_type="ACCOUNT_DELETED",
        severity="HIGH",
        user_id=current_admin.id,
        target_user_id=user_id,
        ip_address=client_ip,
        user_agent=user_agent,
        endpoint=f"/admin/users/{user_id}",
        method="DELETE",
        status_code=200,
        details={"email": target_email, "role": target_role, "action": "ADMIN_HARD_DELETE"}
    )

    db.delete(target_user)
    db.commit()

    return {"success": True, "message": f"User {user_id} and associated biodata profile permanently deleted."}


