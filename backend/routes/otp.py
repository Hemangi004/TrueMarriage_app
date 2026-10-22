from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, Request, status
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.models.user import User
from backend.dependencies.auth import get_optional_current_user
from backend.schemas.otp import OTPRequestInput, OTPVerifyInput, OTPResponse
from backend.services.otp_service import send_and_store_otp, verify_otp_attempt

router = APIRouter(prefix="/auth/otp", tags=["OTP Authentication"])


@router.post("/send", response_model=OTPResponse)
def request_otp(
    payload: OTPRequestInput,
    request: Request,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Generates and dispatches a cryptographically secure 6-digit OTP to target email address or mobile phone.
    Enforces 60-second resend cooldown and invalidates previous active OTPs.
    Plaintext OTP is NEVER returned in API responses or stored in database.
    """
    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")

    success, message = send_and_store_otp(
        db=db,
        target_email=payload.target,
        purpose=payload.purpose,
        otp_type=payload.type,
        ip_address=client_ip,
        user_agent=user_agent,
        user_id=current_user.id if current_user else None
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "message": message, "target": payload.target, "purpose": payload.purpose}
        )

    return OTPResponse(
        success=True,
        message=message,
        target=payload.target,
        purpose=payload.purpose
    )


@router.post("/resend", response_model=OTPResponse)
def resend_otp(
    payload: OTPRequestInput,
    request: Request,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Resends OTP code to the target email address or phone number after validating 60-second cooldown.
    """
    return request_otp(payload=payload, request=request, db=db, current_user=current_user)


@router.post("/verify", response_model=OTPResponse)
def verify_otp(
    payload: OTPVerifyInput,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Verifies user-submitted OTP against HMAC-SHA256 digest using timing-safe comparison.
    Enforces expiration (10 mins) and maximum attempts.
    Updates user.phone and user.is_phone_verified = True for authenticated users upon successful phone verification.
    """
    success, message = verify_otp_attempt(
        db=db,
        target_email=payload.target,
        provided_code=payload.code,
        purpose=payload.purpose,
        current_user=current_user
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "message": message, "target": payload.target, "purpose": payload.purpose}
        )

    return OTPResponse(
        success=True,
        message=message,
        target=payload.target,
        purpose=payload.purpose
    )
