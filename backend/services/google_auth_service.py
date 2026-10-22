"""
Google OAuth 2.0 Service for TrueMarriage Matrimony.

Handles:
1. Google authorization URL generation with CSRF state protection.
2. Token exchange with Google's OAuth2 token endpoint.
3. User info retrieval from Google's OpenID Connect userinfo endpoint.
4. Account lookup, creation, and linking with User and UserAuthIdentity models.
5. Server-side session issuance.
"""
import urllib.parse
import secrets
import logging
from typing import Optional, Tuple, Dict, Any
import httpx
from sqlalchemy.orm import Session
from sqlalchemy import select

from backend.core.config import settings
from backend.models.user import User, UserAuthIdentity
from backend.models.enums import UserRole, UserStatus, AuthProvider
from backend.services.session_service import create_session


import hmac
import hashlib
import time

logger = logging.getLogger(__name__)

GOOGLE_AUTH_BASE_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo"


def log_google_oauth_status():
    """
    Startup diagnostic validator.
    Reports configuration status without exposing credentials.
    """
    has_client_id = bool(settings.GOOGLE_CLIENT_ID and settings.GOOGLE_CLIENT_ID.strip())
    has_client_secret = bool(settings.GOOGLE_CLIENT_SECRET and settings.GOOGLE_CLIENT_SECRET.strip())
    client_id_val = (settings.GOOGLE_CLIENT_ID or "").strip()
    client_id_suffix = f"...{client_id_val[-8:]}" if (has_client_id and len(client_id_val) >= 8) else "NOT_SET"

    print("==================================================")
    print("GOOGLE OAUTH CONFIGURATION DIAGNOSTICS")
    print(f"  GOOGLE_CLIENT_ID Configured    : {has_client_id}")
    print(f"  GOOGLE_CLIENT_SECRET Configured: {has_client_secret}")
    print(f"  GOOGLE_CLIENT_ID Suffix        : {client_id_suffix}")
    print(f"  GOOGLE_REDIRECT_URI            : {settings.GOOGLE_REDIRECT_URI}")
    print(f"  FRONTEND_URL                   : {settings.FRONTEND_URL}")
    print("==================================================")


import base64


def generate_oauth_state(return_origin: Optional[str] = None) -> str:
    """
    Generates a cryptographically signed state token (nonce.timestamp[.b64_origin].signature).
    Supports embedding validated return_origin safely so mobile/web users
    are redirected back to their exact origin (e.g. localhost, LAN IP, or production).
    """
    nonce = secrets.token_urlsafe(24)
    ts = str(int(time.time()))
    if return_origin and return_origin.strip():
        b64_origin = base64.urlsafe_b64encode(return_origin.strip().encode("utf-8")).decode("utf-8").rstrip("=")
        payload = f"{nonce}.{ts}.{b64_origin}"
    else:
        payload = f"{nonce}.{ts}"

    sig = hmac.new(settings.SECRET_KEY.encode("utf-8"), payload.encode("utf-8"), hashlib.sha256).hexdigest()[:16]
    return f"{payload}.{sig}"


def verify_oauth_state(state: str, max_age_seconds: int = 600) -> bool:
    """
    Verifies that the state token was signed by this server and is not expired (default 10 mins).
    Compatible with both standard (nonce.ts.sig) and origin-carrying (nonce.ts.b64_origin.sig) formats.
    """
    if not state or state.count(".") not in (2, 3):
        return False
    try:
        parts = state.split(".")
        if len(parts) == 3:
            nonce, ts_str, sig = parts
            payload = f"{nonce}.{ts_str}"
        else:
            nonce, ts_str, b64_origin, sig = parts
            payload = f"{nonce}.{ts_str}.{b64_origin}"

        expected_sig = hmac.new(settings.SECRET_KEY.encode("utf-8"), payload.encode("utf-8"), hashlib.sha256).hexdigest()[:16]
        if not hmac.compare_digest(sig, expected_sig):
            return False
        ts = int(ts_str)
        now = int(time.time())
        if now - ts > max_age_seconds or ts > now + 60:
            return False
        return True
    except Exception:
        return False


def extract_return_origin_from_state(state: str) -> Optional[str]:
    """
    Safely extracts the return origin from a verified 4-part state token.
    Returns None if state is malformed or does not contain an encoded origin.
    """
    if not state or state.count(".") != 3:
        return None
    try:
        if not verify_oauth_state(state):
            return None
        _, _, b64_origin, _ = state.split(".")
        padding = 4 - (len(b64_origin) % 4)
        if padding != 4:
            b64_origin += "=" * padding
        decoded = base64.urlsafe_b64decode(b64_origin.encode("utf-8")).decode("utf-8").strip()
        return decoded if decoded else None
    except Exception:
        return None


def verify_google_id_token(id_token_str: str) -> Tuple[bool, Optional[Dict[str, Any]], Optional[str]]:
    """
    Cryptographically verifies a Google ID token from mobile (Android/iOS) or web Google Sign-In SDKs.
    Validates token signature against Google's public JWKS certificates, expiration, issuer, and audience.
    Returns (success, claims_dict, error_message).
    """
    if not id_token_str or not str(id_token_str).strip():
        return False, None, "Google ID token is required."

    cleaned_token = str(id_token_str).strip()

    allowed_audiences = []
    if settings.GOOGLE_CLIENT_ID and settings.GOOGLE_CLIENT_ID.strip():
        allowed_audiences.append(settings.GOOGLE_CLIENT_ID.strip())
    if getattr(settings, "GOOGLE_ANDROID_CLIENT_ID", None) and settings.GOOGLE_ANDROID_CLIENT_ID.strip():
        allowed_audiences.append(settings.GOOGLE_ANDROID_CLIENT_ID.strip())

    if not allowed_audiences:
        return False, None, "Google OAuth is not configured on the backend."

    try:
        from google.oauth2 import id_token as google_id_token
        from google.auth.transport import requests as google_requests

        request = google_requests.Request()

        # When a single audience is configured, pass it to verify_oauth2_token.
        # When multiple audiences exist, verify the token and ensure aud/azp matches allowed_audiences.
        verify_aud = allowed_audiences[0] if len(allowed_audiences) == 1 else None
        claims = google_id_token.verify_oauth2_token(
            cleaned_token,
            request,
            audience=verify_aud
        )

        if len(allowed_audiences) > 1:
            token_aud = claims.get("aud")
            token_azp = claims.get("azp")
            if token_aud not in allowed_audiences and token_azp not in allowed_audiences:
                return False, None, f"Token audience '{token_aud}' is not authorized."

        # Validate issuer
        iss = claims.get("iss")
        if iss not in ("accounts.google.com", "https://accounts.google.com"):
            return False, None, f"Invalid token issuer: {iss}"

        # Validate email & email_verified
        email = claims.get("email")
        if not email:
            return False, None, "Google ID token did not contain an email address."

        if not claims.get("email_verified", False):
            return False, None, "Google account email is not verified."

        return True, claims, None
    except ValueError as ve:
        logger.warning(f"Google ID token verification failed: {ve}")
        return False, None, f"Invalid Google token: {str(ve)}"
    except Exception as e:
        logger.error(f"Unexpected error during Google ID token verification: {e}")
        return False, None, f"Failed to verify Google token: {str(e)}"



def get_google_auth_url(state: str) -> str:

    """
    Constructs the Google OAuth 2.0 authorization URL for Web Application clients.
    """
    client_id = (settings.GOOGLE_CLIENT_ID or "").strip()
    params = {
        "client_id": client_id,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "state": state,
        "access_type": "offline",
        "prompt": "select_account",
    }
    return f"{GOOGLE_AUTH_BASE_URL}?{urllib.parse.urlencode(params)}"


async def exchange_google_code_for_token(code: str) -> Tuple[bool, Optional[str], Optional[str]]:
    """
    Exchanges an authorization code for an access token with Google's token endpoint.
    Returns (success, access_token, error_message).
    """
    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
        return False, None, "Google OAuth credentials not configured on backend."

    payload = {
        "code": code,
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code",
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(GOOGLE_TOKEN_URL, data=payload)
            data = response.json()
            if response.status_code != 200:
                error_msg = data.get("error_description") or data.get("error") or "Token exchange failed"
                return False, None, str(error_msg)
            
            access_token = data.get("access_token")
            if not access_token:
                return False, None, "No access token in Google response"
            return True, access_token, None
    except Exception as e:
        return False, None, f"Network error communicating with Google: {str(e)}"


async def fetch_google_userinfo(access_token: str) -> Tuple[bool, Optional[Dict[str, Any]], Optional[str]]:
    """
    Fetches the verified user profile from Google using the access token.
    Returns (success, userinfo_dict, error_message).
    """
    headers = {"Authorization": f"Bearer {access_token}"}
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(GOOGLE_USERINFO_URL, headers=headers)
            if response.status_code != 200:
                return False, None, f"Failed to retrieve user profile from Google (HTTP {response.status_code})"
            data = response.json()
            return True, data, None
    except Exception as e:
        return False, None, f"Network error fetching user profile: {str(e)}"


def authenticate_or_create_google_user(
    db: Session,
    userinfo: Dict[str, Any],
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
) -> Tuple[bool, str, Optional[User], Optional[str]]:
    """
    Processes verified Google profile data:
    1. Validates email exists and is verified by Google.
    2. Finds existing user by normalized email or creates new USER.
    3. Prevents privilege escalation (always maintains role=USER for new users).
    4. Links Google identity in user_auth_identities.
    5. Issues server-side session.
    Returns (success, message, user, raw_session_token).
    """
    raw_email = userinfo.get("email")
    if not raw_email:
        return False, "Google account does not provide an email address.", None, None

    # Google email verification check
    email_verified = userinfo.get("email_verified", False)
    if not email_verified:
        return False, "Google account email is not verified.", None, None

    normalized_email = raw_email.strip().lower()
    google_sub = str(userinfo.get("sub") or "")
    name = (userinfo.get("name") or userinfo.get("given_name") or "TrueMarriage User").strip()

    # Look up existing user by normalized email
    stmt = select(User).where(User.email == normalized_email)
    user = db.scalar(stmt)

    if user:
        # Check account status
        if user.status in (UserStatus.BLOCKED, UserStatus.DEACTIVATED):
            return False, f"Account is {user.status.value.lower()}. Please contact support.", None, None

        # If user was PENDING_VERIFICATION, Google OAuth verifies the email!
        if user.status == UserStatus.PENDING_VERIFICATION or not user.is_email_verified:
            user.is_email_verified = True
            user.status = UserStatus.ACTIVE

        # Update name if previously blank
        if not user.full_name and name:
            user.full_name = name

        # Link Google identity if not already linked
        ident_stmt = select(UserAuthIdentity).where(
            UserAuthIdentity.user_id == user.id,
            UserAuthIdentity.provider == AuthProvider.GOOGLE
        )
        existing_ident = db.scalar(ident_stmt)
        if not existing_ident:
            google_identity = UserAuthIdentity(
                user_id=user.id,
                provider=AuthProvider.GOOGLE,
                provider_user_id=google_sub if google_sub else None
            )
            db.add(google_identity)

        db.commit()
        db.refresh(user)
    else:
        # Create brand new user account
        user = User(
            email=normalized_email,
            full_name=name,
            password_hash=None,  # No local password set
            role=UserRole.USER,  # Strictly server-enforced USER role
            status=UserStatus.ACTIVE,  # Pre-verified by Google
            is_email_verified=True,
        )
        db.add(user)
        db.flush()

        # Add Google Auth Identity
        google_identity = UserAuthIdentity(
            user_id=user.id,
            provider=AuthProvider.GOOGLE,
            provider_user_id=google_sub if google_sub else None
        )
        db.add(google_identity)
        db.commit()
        db.refresh(user)

    # Issue server-side session using Phase 6 session engine
    session_record, raw_session_token = create_session(
        db=db,
        user_id=user.id,
        ip_address=ip_address,
        user_agent=user_agent
    )

    return True, "Google authentication successful.", user, raw_session_token
