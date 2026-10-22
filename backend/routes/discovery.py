from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.models.user import User
from backend.dependencies.auth import get_optional_current_user, get_current_user
from backend.schemas.admin import PaginationMetadata
from backend.schemas.public_profile import (
    PublicProfileListItem,
    PublicProfileDetailResponse,
    PaginatedPublicProfileResponse,
)
from backend.services.discovery_service import (
    list_discoverable_profiles,
    get_public_profile_detail,
)

router = APIRouter(prefix="/discovery", tags=["Profile Discovery & Search"])


@router.get("/profiles", response_model=PaginatedPublicProfileResponse)
def search_public_profiles(
    page: int = Query(1, ge=1, description="Page index (>= 1)"),
    page_size: int = Query(20, ge=1, le=50, description="Page size (1 - 50)"),
    search: Optional[str] = Query(None, description="Search by name, occupation, education, or city"),
    gender: Optional[str] = Query(None, description="Filter by gender (Male, Female, etc.)"),
    min_age: Optional[int] = Query(None, ge=18, le=100, description="Minimum age filter (>= 18)"),
    max_age: Optional[int] = Query(None, ge=18, le=100, description="Maximum age filter (<= 100)"),
    location: Optional[str] = Query(None, description="Filter by city, state, or native place"),
    education: Optional[str] = Query(None, description="Filter by education"),
    occupation: Optional[str] = Query(None, description="Filter by occupation / profession"),
    sort_by: str = Query("published_at", description="Sort by field (published_at, created_at)"),
    sort_order: str = Query("desc", description="Sort order (asc or desc)"),
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """
    Discovery API: Returns paginated, searchable, and filtered list of APPROVED profiles.
    Server-side enforces moderation_status == APPROVED. Excludes authenticated user's own profile if signed in.
    """
    try:
        current_user_id = current_user.id if current_user else None
        profiles, total_count, total_pages = list_discoverable_profiles(
            db=db,
            current_user_id=current_user_id,
            page=page,
            page_size=page_size,
            search=search,
            gender=gender,
            min_age=min_age,
            max_age=max_age,
            location=location,
            education=education,
            occupation=occupation,
            sort_by=sort_by,
            sort_order=sort_order
        )

        validated_items = []
        for p in profiles:
            try:
                validated_items.append(PublicProfileListItem.model_validate(p))
            except Exception as item_err:
                import logging
                logging.getLogger("backend.discovery").warning(f"Skipping profile item due to validation mismatch: {item_err}")

        return PaginatedPublicProfileResponse(
            success=True,
            data=validated_items,
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
    except Exception as exc:
        import logging
        logging.getLogger("backend.discovery").error(f"Error fetching discovery profiles: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"success": False, "message": "Failed to load discovery profiles. Please try again."}
        )


@router.get("/profiles/{profile_id}", response_model=PublicProfileDetailResponse)
def get_public_profile(
    profile_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Profile Detail API: Retrieves candidate details.
    Requires authenticated user session to protect candidate privacy.
    Enforces moderation_status == APPROVED.
    """
    current_user_id = current_user.id
    success, http_status, error_msg, profile_data = get_public_profile_detail(db, profile_id, current_user_id)

    if not success or not profile_data:
        raise HTTPException(
            status_code=http_status,
            detail={"success": False, "message": error_msg}
        )

    return PublicProfileDetailResponse.model_validate(profile_data)


@router.get("/profiles/{profile_id}/compatibility")
async def get_profile_compatibility(
    profile_id: str,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns AI-generated compatibility headline and 4 connection reasons comparing
    the authenticated user's interests/values with the candidate's.
    Caches the result into the database so tokens are used at most once per pair.
    """
    from backend.services.match_insight_service import get_or_generate_match_insight
    try:
        result = await get_or_generate_match_insight(db, current_user, profile_id)
        return {
            "success": True,
            "data": result
        }
    except Exception as e:
        import logging
        logging.getLogger("backend.discovery").error(f"Error generating compatibility insight: {e}", exc_info=True)
        return {
            "success": True,
            "data": {
                "headline": "Recommended because you both share family-first values and complementary lifestyles.",
                "reasons": [
                    "Both are family-oriented",
                    "Balanced lifestyle habits",
                    "Complementary career aspirations",
                    "Aligned future life expectations"
                ],
                "source": "error_fallback",
                "cached": False
            }
        }

