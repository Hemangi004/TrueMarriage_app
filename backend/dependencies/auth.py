from typing import Optional, Tuple
from datetime import datetime, timezone
from fastapi import Request, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from backend.core.config import settings
from backend.core.security import decode_access_token
from backend.db.session import get_db
from backend.models.user import User
from backend.models.session import SessionModel
from backend.models.enums import UserStatus
from backend.services.session_service import get_active_session_by_token


def extract_credentials_from_request(request: Request) -> Tuple[Optional[str], str]:
    """
    Extracts authentication credential from Authorization header or HttpOnly session cookie.
    Authorization header takes precedence if explicitly provided by client.
    Returns (credential_str, auth_type) where auth_type is 'jwt', 'session_bearer', or 'cookie'.
    """
    # 1. Primary for API/Mobile: Bearer Authorization Header (Takes precedence if provided)
    auth_header = request.headers.get("authorization")
    if auth_header and auth_header.lower().startswith("bearer "):
        raw_token = auth_header[7:].strip()
        if raw_token.count(".") == 2:  # Standard 3-part JWT structure
            return raw_token, "jwt"
        return raw_token, "session_bearer"

    # 2. Secondary for Web: HttpOnly Session Cookie
    cookie_token = request.cookies.get(settings.SESSION_COOKIE_NAME)
    if cookie_token:
        return cookie_token, "cookie"

    return None, "none"


def extract_session_token_from_request(request: Request) -> Optional[str]:
    """Legacy helper maintained for backward compatibility."""
    token, _ = extract_credentials_from_request(request)
    return token


def get_current_session(
    request: Request,
    db: Session = Depends(get_db)
) -> SessionModel:
    """
    FastAPI dependency that extracts and validates the current active session.
    Supports HttpOnly Cookies and Revocable JWT access tokens.
    For JWT tokens, checks payload signature AND validates that the associated session_id ('sid')
    remains ACTIVE in the database (enabling instant server revocation).
    """
    token_val, auth_type = extract_credentials_from_request(request)
    if not token_val:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"success": False, "message": "Authentication required. Session cookie or bearer token missing."}
        )

    if auth_type == "jwt":
        payload = decode_access_token(token_val)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={"success": False, "message": "JWT token is invalid or expired."}
            )
        
        session_id = payload.get("sid")
        user_id = payload.get("sub")
        if not session_id or not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={"success": False, "message": "Malformed JWT payload structure."}
            )

        # Real-Time Revocation Check against DB
        stmt = select(SessionModel).where(
            SessionModel.id == session_id,
            SessionModel.user_id == user_id,
            SessionModel.is_active == True,
            SessionModel.revoked_at.is_(None),
            SessionModel.expires_at > datetime.now(timezone.utc)
        )
        session_record = db.scalar(stmt)
        if not session_record:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={"success": False, "message": "Session has been revoked or expired. Please sign in again."}
            )
        return session_record

    # Web Cookie or Bearer Raw Session Token
    session_record = get_active_session_by_token(db, token_val)
    if not session_record:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"success": False, "message": "Session expired or invalid. Please login again."}
        )

    return session_record


def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
) -> User:
    """
    FastAPI dependency that returns the authenticated, active User.
    Verifies that user account remains ACTIVE and is_email_verified = True.
    """
    session_record = get_current_session(request=request, db=db)
    user = session_record.user

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"success": False, "message": "Associated user account not found."}
        )

    if user.status == UserStatus.PENDING_VERIFICATION or not user.is_email_verified:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"success": False, "message": "Email address not verified. Please complete verification before authenticating."}
        )

    if user.status != UserStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"success": False, "message": f"Account cannot authenticate due to current status: {user.status.value}"}
        )

    return user


def get_optional_current_user(
    request: Request,
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    FastAPI dependency that returns the authenticated User if session/token exists and is valid, or None.
    """
    try:
        session_record = get_current_session(request=request, db=db)
        if session_record and session_record.user and session_record.user.status == UserStatus.ACTIVE:
            return session_record.user
    except Exception:
        pass
    return None
