import random
import logging
from datetime import datetime, timezone
from typing import Any, Dict, Optional
from fastapi import APIRouter, HTTPException, Request, Depends, status, Body
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import select
from backend.db.session import get_db
from backend.models.user import User
from backend.models.biodata import BiodataProfileModel
from backend.models.enums import ProfileModerationStatus, UserRole
from backend.dependencies.auth import get_current_user
from backend.utils.image_helper import download_and_convert_image_url
from backend.services.photo_verification_service import verify_human_face
from backend.core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/biodata", tags=["Biodata"])


class DeleteBiodataRequest(BaseModel):
    reason: Optional[str] = None
    feedback: Optional[str] = None


@router.post("/verify-photo")
async def verify_profile_photo(
    request: Request
):
    """
    Validates that an uploaded photo contains a real human face before saving.
    Returns face count and validation status.
    """
    try:
        data = await request.json()
        raw_pic = data.get("image") or data.get("profilePictureUrl") or data.get("photoUrl")
        if not raw_pic:
            raise HTTPException(status_code=400, detail="No photo provided for verification.")

        if isinstance(raw_pic, str) and (raw_pic.startswith("http://") or raw_pic.startswith("https://")):
            converted = await download_and_convert_image_url(raw_pic)
            if converted:
                raw_pic = converted

        is_valid, msg, count = verify_human_face(raw_pic)
        if not is_valid:
            raise HTTPException(status_code=400, detail=msg)

        return {
            "success": True,
            "message": "Human face detected and verified successfully.",
            "faceCount": count
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to verify photo: {str(e)}")


@router.get("/me")
def get_my_biodata(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Authenticated route: Fetches current user's profile and moderation status metadata.
    Ownership is authoritatively derived from the session (current_user.id).
    """
    stmt = select(BiodataProfileModel).where(BiodataProfileModel.user_id == current_user.id)
    profile = db.scalar(stmt)

    if not profile:
        return {
            "success": True,
            "data": None,
            "profileId": None,
            "isCompleted": False,
            "moderationStatus": ProfileModerationStatus.DRAFT.value,
            "rejectionReason": None
        }

    p_data = profile.profile_data or {}
    user_name = profile.user.full_name if profile.user else None
    display_name = p_data.get("fullName") or p_data.get("name") or user_name or "profile"
    from backend.services.discovery_service import slugify
    effective_slug = profile.slug or slugify(display_name)

    return {
        "success": True,
        "data": profile.profile_data,
        "profileId": profile.id,
        "isCompleted": getattr(profile, "is_completed", False),
        "slug": effective_slug,
        "moderationStatus": profile.moderation_status.value,
        "rejectionReason": profile.rejection_reason,
        "submittedAt": profile.submitted_at.isoformat() if profile.submitted_at else None,
        "reviewedAt": profile.reviewed_at.isoformat() if profile.reviewed_at else None,
        "publishedAt": profile.published_at.isoformat() if profile.published_at else None,
        "updatedAt": profile.updated_at.isoformat() if profile.updated_at else None
    }


def validate_biodata_lengths(data: dict):
    incoming_name = str(data.get("name") or data.get("fullName") or "").strip()
    if len(incoming_name) > 50:
        raise HTTPException(status_code=400, detail="Full Name cannot exceed 50 characters.")

    bio_val = data.get("professionalSummary") or data.get("aboutMe") or data.get("about") or ""
    if isinstance(bio_val, str) and len(bio_val) > 500:
        raise HTTPException(status_code=400, detail="About Me / Professional Summary cannot exceed 500 characters.")

    exp_val = data.get("otherPreferences") or data.get("partnerPreferences") or ""
    if isinstance(exp_val, str) and len(exp_val) > 500:
        raise HTTPException(status_code=400, detail="Partner Expectations cannot exceed 500 characters.")


def validate_date_of_birth(data: dict):
    dob_val = data.get("dob") or data.get("dateOfBirth") or data.get("date_of_birth")
    if not dob_val or not str(dob_val).strip():
        return

    dob_str = str(dob_val).strip().split("T")[0]
    import re
    # Try parsing YYYY-MM-DD or other standard formats
    parsed_dob = None
    for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%d/%m/%Y", "%Y/%m/%d"):
        try:
            parsed_dob = datetime.strptime(dob_str, fmt).date()
            break
        except ValueError:
            continue

    if not parsed_dob:
        return

    today = datetime.now(timezone.utc).date()
    if parsed_dob >= today:
        raise HTTPException(status_code=400, detail="Date of birth cannot be today or in the future.")

    # Calculate exact age
    age = today.year - parsed_dob.year - ((today.month, today.day) < (parsed_dob.month, parsed_dob.day))
    gender = str(data.get("gender") or "").strip().lower()
    is_male = gender == "male"
    min_legal_age = 21 if is_male else 18

    if age < min_legal_age:
        gender_label = "males is 21" if is_male else "females is 18"
        raise HTTPException(
            status_code=400,
            detail=f"Minimum legal marriage age for {gender_label} years (calculated age: {age} years)."
        )


async def enrich_dual_script_profile_data(data: dict):
    """
    Method 4: Dual-Script Database Storage.
    Populates native Indic script fields (nameNative, fatherNameNative, motherNameNative, maternalUncleNative)
    into profile_data if a non-English language is selected and values are not already explicitly provided.
    """
    target_lang = str(data.get("lang") or "en").lower().strip()
    if target_lang and target_lang != "en":
        from backend.services.indic_transliteration_service import transliterate_indic_name
        name_val = str(data.get("name") or data.get("fullName") or "").strip()
        if name_val and not data.get("nameNative"):
            try:
                data["nameNative"] = await transliterate_indic_name(name_val, target_lang)
            except Exception as e:
                logger.debug(f"Transliteration for candidate name failed: {e}")

        father_val = str(data.get("fatherName") or "").strip()
        if father_val and not data.get("fatherNameNative"):
            try:
                data["fatherNameNative"] = await transliterate_indic_name(father_val, target_lang)
            except Exception as e:
                logger.debug(f"Transliteration for fatherName failed: {e}")

        mother_val = str(data.get("motherName") or "").strip()
        if mother_val and not data.get("motherNameNative"):
            try:
                data["motherNameNative"] = await transliterate_indic_name(mother_val, target_lang)
            except Exception as e:
                logger.debug(f"Transliteration for motherName failed: {e}")

        uncle_val = str(data.get("maternalUncle") or "").strip()
        if uncle_val and not data.get("maternalUncleNative"):
            try:
                data["maternalUncleNative"] = await transliterate_indic_name(uncle_val, target_lang)
            except Exception as e:
                logger.debug(f"Transliteration for maternalUncle failed: {e}")



@router.post("")
async def save_biodata(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Authenticated route: Saves user biodata draft into database using current_user.id as authoritative identity.
    If an existing profile was APPROVED, REJECTED, or CHANGES_REQUESTED, editing returns moderation_status to DRAFT/SUBMITTED.
    """
    try:
        # Admin accounts cannot maintain personal candidate biodata profiles
        user_role_str = str(current_user.role.value if hasattr(current_user.role, "value") else current_user.role).upper()
        if user_role_str == UserRole.ADMIN.value:
            raise HTTPException(status_code=403, detail="Admin accounts cannot maintain candidate biodata profiles.")

        data = await request.json()
        validate_biodata_lengths(data)
        validate_date_of_birth(data)
        now = datetime.now(timezone.utc)
        # Authoritatively enforce user identity and email isolation
        data["email"] = current_user.email
        data["verifiedEmail"] = current_user.email
        data["emailVerified"] = current_user.is_email_verified

        # Prevent cross-account or admin name leakage
        incoming_name = (data.get("name") or data.get("fullName") or "").strip()
        if incoming_name.lower() in ("truemarriage admin", "temp admin", "admin") or not incoming_name:
            data["name"] = current_user.full_name or "Candidate"
            data["fullName"] = current_user.full_name or "Candidate"
        else:
            data["name"] = incoming_name
            data["fullName"] = incoming_name

        # Download & convert any external web image URL to permanent Base64 image data
        raw_pic = data.get("profilePictureUrl") or data.get("photoUrl")
        if raw_pic and isinstance(raw_pic, str) and (raw_pic.startswith("http://") or raw_pic.startswith("https://")):
            converted_pic = await download_and_convert_image_url(raw_pic)
            if converted_pic:
                data["profilePictureUrl"] = converted_pic
                if "photoUrl" in data:
                    data["photoUrl"] = converted_pic
                raw_pic = converted_pic

        # Validate Expected Age Min and Max range
        age_min = data.get("expectedAgeMin")
        age_max = data.get("expectedAgeMax")
        if age_min not in (None, "") and age_max not in (None, ""):
            try:
                num_min = int(age_min)
                num_max = int(age_max)
                if num_min > 0 and num_max > 0 and num_min >= num_max:
                    raise HTTPException(
                        status_code=400,
                        detail="Maximum age must be greater than minimum age."
                    )
            except (ValueError, TypeError):
                pass

        # Check existing user profile
        stmt = select(BiodataProfileModel).where(BiodataProfileModel.user_id == current_user.id)
        profile = db.scalar(stmt)

        # Verify photo has a human face if new or changed
        if raw_pic and isinstance(raw_pic, str) and raw_pic.strip():
            prev_pic = (profile.profile_data or {}).get("profilePictureUrl") if profile else None
            if raw_pic != prev_pic:
                is_valid, msg, _ = verify_human_face(raw_pic)
                if not is_valid:
                    raise HTTPException(status_code=400, detail=msg)

        # Enrich with dual-script transliterations in database profile_data
        await enrich_dual_script_profile_data(data)

        from backend.services.discovery_service import generate_unique_slug
        user_name = current_user.full_name or data.get("fullName") or data.get("name") or "Candidate"

        # Determine is_completed flag
        incoming_completed = data.get("is_completed") or data.get("isCompleted")
        if incoming_completed is not None:
            is_completed_flag = bool(incoming_completed)
        elif profile:
            is_completed_flag = getattr(profile, "is_completed", False)
        else:
            is_completed_flag = False

        if not profile:
            profile_id = f"TRUE-{random.randint(100000, 999999)}"
            effective_slug = generate_unique_slug(db, user_name, current_profile_id=profile_id)
            profile = BiodataProfileModel(
                id=profile_id,
                user_id=current_user.id,
                slug=effective_slug,
                status="PUBLISHED",
                is_completed=is_completed_flag,
                moderation_status=ProfileModerationStatus.APPROVED,
                profile_data=data,
                published_at=now,
            )
            db.add(profile)
        else:
            profile.profile_data = data
            profile.status = "PUBLISHED"
            profile.is_completed = is_completed_flag
            profile.moderation_status = ProfileModerationStatus.APPROVED
            if not profile.slug:
                profile.slug = generate_unique_slug(db, user_name, current_profile_id=profile.id)
            if not profile.published_at:
                profile.published_at = now
            profile.updated_at = now

        from sqlalchemy.orm.attributes import flag_modified
        flag_modified(profile, "profile_data")
        db.commit()
        db.refresh(profile)

        return {
            "success": True,
            "message": "Biodata profile saved successfully",
            "profileId": profile.id,
            "isCompleted": profile.is_completed,
            "profileData": profile.profile_data,
            "moderationStatus": profile.moderation_status.value,
            "timestamp": now.strftime("%I:%M %p")
        }
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to save biodata draft: {str(e)}")


@router.post("/publish")
async def publish_biodata(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Authenticated route: Submits user biodata profile for moderation review.
    Updates moderation_status to SUBMITTED and records submitted_at.
    """
    try:
        # Admin accounts cannot maintain personal candidate biodata profiles
        user_role_str = str(current_user.role.value if hasattr(current_user.role, "value") else current_user.role).upper()
        if user_role_str == UserRole.ADMIN.value:
            raise HTTPException(status_code=403, detail="Admin accounts cannot maintain candidate biodata profiles.")

        data = await request.json()
        validate_biodata_lengths(data)
        validate_date_of_birth(data)
        # Authoritatively enforce user identity and email isolation
        data["email"] = current_user.email
        data["verifiedEmail"] = current_user.email
        data["emailVerified"] = current_user.is_email_verified

        # Prevent cross-account or admin name leakage
        incoming_name = (data.get("name") or data.get("fullName") or "").strip()
        if incoming_name.lower() in ("truemarriage admin", "temp admin", "admin") or not incoming_name:
            data["name"] = current_user.full_name or "Candidate"
            data["fullName"] = current_user.full_name or "Candidate"
        else:
            data["name"] = incoming_name
            data["fullName"] = incoming_name

        now = datetime.now(timezone.utc)

        # Download & convert any external web image URL to permanent Base64 image data
        raw_pic = data.get("profilePictureUrl") or data.get("photoUrl")
        if raw_pic and isinstance(raw_pic, str) and (raw_pic.startswith("http://") or raw_pic.startswith("https://")):
            converted_pic = await download_and_convert_image_url(raw_pic)
            if converted_pic:
                data["profilePictureUrl"] = converted_pic
                if "photoUrl" in data:
                    data["photoUrl"] = converted_pic
                raw_pic = converted_pic

        # Validate Expected Age Min and Max range
        age_min = data.get("expectedAgeMin")
        age_max = data.get("expectedAgeMax")
        if age_min not in (None, "") and age_max not in (None, ""):
            try:
                num_min = int(age_min)
                num_max = int(age_max)
                if num_min > 0 and num_max > 0 and num_min >= num_max:
                    raise HTTPException(
                        status_code=400,
                        detail="Maximum age must be greater than minimum age."
                    )
            except (ValueError, TypeError):
                pass

        stmt = select(BiodataProfileModel).where(BiodataProfileModel.user_id == current_user.id)
        profile = db.scalar(stmt)

        # Verify photo has a human face if new or changed
        if raw_pic and isinstance(raw_pic, str) and raw_pic.strip():
            prev_pic = (profile.profile_data or {}).get("profilePictureUrl") if profile else None
            if raw_pic != prev_pic:
                is_valid, msg, _ = verify_human_face(raw_pic)
                if not is_valid:
                    raise HTTPException(status_code=400, detail=msg)

        # Enrich with dual-script transliterations in database profile_data
        await enrich_dual_script_profile_data(data)

        from backend.services.discovery_service import generate_unique_slug
        user_name = current_user.full_name or data.get("fullName") or data.get("name") or "Candidate"

        if not profile:
            profile_id = f"TRUE-{random.randint(100000, 999999)}"
            effective_slug = generate_unique_slug(db, user_name, current_profile_id=profile_id)
            profile = BiodataProfileModel(
                id=profile_id,
                user_id=current_user.id,
                slug=effective_slug,
                status="PUBLISHED",
                is_completed=True,
                moderation_status=ProfileModerationStatus.APPROVED,
                profile_data=data,
                submitted_at=now,
                published_at=now,
            )
            db.add(profile)
        else:
            profile.profile_data = data
            profile.status = "PUBLISHED"
            profile.is_completed = True
            profile.moderation_status = ProfileModerationStatus.APPROVED
            profile.submitted_at = now
            profile.published_at = now
            profile.updated_at = now
            profile.rejection_reason = None
            if not profile.slug:
                profile.slug = generate_unique_slug(db, user_name, current_profile_id=profile.id)

        from sqlalchemy.orm.attributes import flag_modified
        flag_modified(profile, "profile_data")
        db.commit()
        db.refresh(profile)

        frontend_base = settings.FRONTEND_URL.rstrip("/")
        return {
            "success": True,
            "message": "Biodata profile approved & published successfully",
            "profileId": profile.id,
            "slug": profile.slug,
            "moderationStatus": profile.moderation_status.value,
            "shareableUrl": f"{frontend_base}/profile/{profile.slug or profile.id}"
        }
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to submit profile: {str(e)}")


@router.delete("/me")
def delete_my_biodata(
    payload: Optional[DeleteBiodataRequest] = Body(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Authenticated route: Permanently deletes the current user's biodata profile.
    This action is irreversible.
    """
    stmt = select(BiodataProfileModel).where(BiodataProfileModel.user_id == current_user.id)
    profile = db.scalar(stmt)

    if not profile:
        raise HTTPException(status_code=404, detail="No profile found to delete.")

    profile_id = profile.id
    reason = payload.reason if payload else None
    feedback = payload.feedback if payload else None

    logger.info(
        f"User {current_user.id} ({current_user.email}) deleting profile {profile_id}. "
        f"Reason: {reason}, Feedback: {feedback}"
    )

    try:
        from sqlalchemy import update as sa_update, delete as sa_delete
        from backend.models.interest import InterestModel
        from backend.models.shortlist import ShortlistModel
        from backend.models.profile_analytics import ProfileAnalyticsModel
        from backend.models.match_insight import MatchInsightModel
        from backend.models.notification import NotificationModel

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

        # 6. Detach biodata relationship on current_user if loaded
        if hasattr(current_user, "biodata") and current_user.biodata is not None:
            current_user.biodata = None

        # 7. Delete the profile itself
        db.delete(profile)
        db.commit()

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to delete profile {profile_id}: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"success": False, "message": f"Failed to delete profile: {str(e)}"}
        )

    # 8. Record audit log in an isolated step following successful deletion
    try:
        from backend.services.security_log_service import log_security_event
        log_security_event(
            db=db,
            event_type="PROFILE_DELETED",
            severity="INFO",
            user_id=current_user.id,
            target_user_id=current_user.id,
            details={
                "profile_id": profile_id,
                "reason": reason,
                "feedback": feedback,
            }
        )
    except Exception as log_err:
        logger.warning(f"Could not log security event for profile deletion: {log_err}")

    return {
        "success": True,
        "message": f"Profile {profile_id} permanently deleted.",
        "deletion_reason": reason,
    }


@router.get("/{profile_id}")
def get_biodata(profile_id: str, db: Session = Depends(get_db)):
    """
    Public lookup route for viewing published profiles.
    Enforces Publishing Rule (STEP 16): Profiles MUST be APPROVED by admin to be publicly visible.
    """
    stmt = select(BiodataProfileModel).where(BiodataProfileModel.id == profile_id)
    profile = db.scalar(stmt)

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    return {
        "success": True,
        "data": profile.profile_data,
        "profileId": profile.id,
        "moderationStatus": profile.moderation_status.value if profile.moderation_status else "APPROVED",
        "publishedAt": profile.published_at.isoformat() if profile.published_at else None
    }
