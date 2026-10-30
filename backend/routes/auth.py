from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Depends, Request, Response, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from backend.core.config import settings
from backend.core.security import verify_password
from backend.db.session import get_db
from backend.models.user import User
from backend.models.enums import UserStatus
from backend.schemas.user import (
    DisableAccountInput,
    DeleteAccountInput,
    UserRegisterInput,
    UserLoginInput,
    ForgotPasswordInput,
    PasswordResetInput,
    RegistrationResponse,
    UserResponse,
    GoogleVerifyTokenInput,
    GoogleAuthResponse
)
from backend.schemas.otp import OTPVerifyInput
from backend.services.registration_service import register_user, verify_registration_completion
from backend.services.password_reset_service import initiate_password_reset, complete_password_reset
from backend.services.session_service import create_session, revoke_session_by_token
from backend.dependencies.auth import get_current_user, extract_session_token_from_request


router = APIRouter(prefix="/auth", tags=["Authentication & Sessions"])


@router.post("/register", response_model=RegistrationResponse, status_code=status.HTTP_201_CREATED)
def register(
    payload: UserRegisterInput,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Registers a new user account with EMAIL + PASSWORD.
    """
    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")

    success, message, user = register_user(
        db=db,
        payload=payload,
        ip_address=client_ip,
        user_agent=user_agent
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "message": message, "email": payload.email}
        )

    return RegistrationResponse(
        success=True,
        message=message,
        email=payload.email,
        status=UserStatus.PENDING_VERIFICATION,
        requires_otp=True
    )


@router.post("/register/verify", response_model=RegistrationResponse)
def verify_registration(
    payload: OTPVerifyInput,
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):
    """
    Verifies the registration OTP code, activates the PENDING_VERIFICATION user account,
    and issues an authenticated server-side session cookie.
    """
    success, message, user = verify_registration_completion(
        db=db,
        target_email=payload.target,
        otp_code=payload.code
    )

    if not success or not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "message": message, "email": payload.target}
        )

    # Issue server-side session cookie upon successful verification
    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    session_record, raw_token = create_session(db, user.id, client_ip, user_agent)

    response.set_cookie(
        key=settings.SESSION_COOKIE_NAME,
        value=raw_token,
        max_age=settings.SESSION_EXPIRE_HOURS * 3600,
        httponly=settings.SESSION_COOKIE_HTTPONLY,
        secure=settings.SESSION_COOKIE_SECURE,
        samesite=settings.SESSION_COOKIE_SAMESITE,
        path="/"
    )

    return RegistrationResponse(
        success=True,
        message=message,
        email=payload.target,
        status=UserStatus.ACTIVE,
        requires_otp=False
    )


@router.post("/login", response_model=UserResponse)
def login(
    payload: UserLoginInput,
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):
    """
    Authenticates user with email + password and issues a server-side session HttpOnly cookie.
    1. Validates email and verifies bcrypt password hash.
    2. Enforces ACTIVE status and email verification.
    3. Creates server-side session record.
    4. Sets HttpOnly, Secure, SameSite session cookie.
    """
    normalized_email = payload.email.strip().lower()

    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    request_id = getattr(request.state, "request_id", None)

    # Look up user by normalized email
    stmt = select(User).where(User.email == normalized_email)
    user = db.scalar(stmt)

    if not user or not user.password_hash or not verify_password(payload.password, user.password_hash):
        from backend.services.security_log_service import log_security_event
        log_security_event(
            db=db,
            event_type="LOGIN_FAILED",
            severity="WARNING",
            user_id=user.id if user else None,
            ip_address=client_ip,
            user_agent=user_agent,
            endpoint="/auth/login",
            method="POST",
            status_code=401,
            request_id=request_id,
            details={"attempted_email": normalized_email, "reason": "Invalid credentials"}
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"success": False, "message": "Invalid email address or password."}
        )

    # Check account status
    if user.status == UserStatus.PENDING_VERIFICATION or not user.is_email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"success": False, "message": "Email address not verified. Please complete email verification before logging in."}
        )

    if user.status == UserStatus.DEACTIVATED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"success": False, "message": "This account has been deactivated. Please contact support."}
        )

    if user.status == UserStatus.BLOCKED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"success": False, "message": "This account has been suspended."}
        )

    # Update last login timestamp
    user.last_login_at = datetime.now(timezone.utc)
    db.commit()

    # Create Server-Side Session
    session_record, raw_token = create_session(
        db=db,
        user_id=user.id,
        ip_address=client_ip,
        user_agent=user_agent
    )

    # Set HttpOnly Session Cookie
    response.set_cookie(
        key=settings.SESSION_COOKIE_NAME,
        value=raw_token,
        max_age=settings.SESSION_EXPIRE_HOURS * 3600,
        httponly=settings.SESSION_COOKIE_HTTPONLY,
        secure=settings.SESSION_COOKIE_SECURE,
        samesite=settings.SESSION_COOKIE_SAMESITE,
        path="/"
    )

    # Log Security Success Event
    from backend.services.security_log_service import log_security_event
    log_security_event(
        db=db,
        event_type="LOGIN_SUCCESS",
        severity="INFO",
        user_id=user.id,
        session_id=session_record.id,
        ip_address=client_ip,
        user_agent=user_agent,
        endpoint="/auth/login",
        method="POST",
        status_code=200,
        request_id=request_id,
        details={"email": normalized_email, "auth_method": "PASSWORD"}
    )

    setattr(user, "token", raw_token)
    setattr(user, "access_token", raw_token)
    has_profile = bool(user.biodata)
    is_completed = bool(user.biodata and getattr(user.biodata, "is_completed", False))
    setattr(user, "has_profile", has_profile)
    setattr(user, "is_profile_completed", is_completed)
    setattr(user, "profile_id", user.biodata.id if user.biodata else None)
    return user


@router.post("/token")
def issue_jwt_token(
    payload: UserLoginInput,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Issues a revocable JWT Bearer Token for API & Mobile Clients.
    Binds JWT payload to active session in database so token can be instantly revoked on server.
    """
    from backend.core.security import create_access_token
    normalized_email = payload.email.strip().lower()
    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    request_id = getattr(request.state, "request_id", None)

    stmt = select(User).where(User.email == normalized_email)
    user = db.scalar(stmt)

    if not user or not user.password_hash or not verify_password(payload.password, user.password_hash):
        from backend.services.security_log_service import log_security_event
        log_security_event(
            db=db,
            event_type="JWT_TOKEN_FAILED",
            severity="WARNING",
            user_id=user.id if user else None,
            ip_address=client_ip,
            user_agent=user_agent,
            endpoint="/auth/token",
            method="POST",
            status_code=401,
            request_id=request_id,
            details={"attempted_email": normalized_email, "reason": "Invalid credentials"}
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"success": False, "message": "Invalid email address or password."}
        )

    if user.status != UserStatus.ACTIVE or not user.is_email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"success": False, "message": "Account must be active and verified to obtain API tokens."}
        )

    # Create server session to bind JWT
    session_record, raw_token = create_session(db, user.id, client_ip, user_agent)
    
    # Create 60-minute JWT token bound to session_id
    access_token = create_access_token(
        user_id=user.id,
        session_id=session_record.id,
        role=user.role.value,
        expires_minutes=60
    )

    from backend.services.security_log_service import log_security_event
    log_security_event(
        db=db,
        event_type="JWT_TOKEN_ISSUED",
        severity="INFO",
        user_id=user.id,
        session_id=session_record.id,
        ip_address=client_ip,
        user_agent=user_agent,
        endpoint="/auth/token",
        method="POST",
        status_code=200,
        request_id=request_id,
        details={"email": normalized_email, "auth_method": "JWT"}
    )

    return {
        "success": True,
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": 3600,
        "session_id": session_record.id
    }


@router.get("/me", response_model=UserResponse)
def get_me(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Returns profile details for the currently authenticated active user.
    Session token is read automatically from the HttpOnly cookie.
    """
    token_val = extract_session_token_from_request(request)
    if token_val:
        setattr(current_user, "token", token_val)
        setattr(current_user, "access_token", token_val)
    has_profile = bool(current_user.biodata)
    is_completed = bool(current_user.biodata and getattr(current_user.biodata, "is_completed", False))
    is_active_premium = False
    if current_user.is_premium:
        if not current_user.premium_until:
            is_active_premium = True
        else:
            until_dt = current_user.premium_until
            if until_dt.tzinfo is None:
                until_dt = until_dt.replace(tzinfo=timezone.utc)
            is_active_premium = until_dt > datetime.now(timezone.utc)

    is_cancelled = False
    if is_active_premium:
        from backend.models.payment import PaymentOrder
        sub_stmt = (
            select(PaymentOrder)
            .where(PaymentOrder.user_id == current_user.id, PaymentOrder.status == "COMPLETED")
            .order_by(PaymentOrder.created_at.desc())
        )
        sub_order = db.scalar(sub_stmt)
        if sub_order and sub_order.payment_method == "CANCELLED_RENEWAL":
            is_cancelled = True

    setattr(current_user, "has_profile", has_profile)
    setattr(current_user, "is_profile_completed", is_completed)
    setattr(current_user, "is_premium", is_active_premium)
    setattr(current_user, "is_subscription_cancelled", is_cancelled)
    setattr(current_user, "subscription_status", "cancelled" if is_cancelled else ("active" if is_active_premium else "none"))
    setattr(current_user, "profile_id", current_user.biodata.id if current_user.biodata else None)
    return current_user


@router.get("/protected-test")
def protected_test(current_user: User = Depends(get_current_user)):
    """
    Protected test endpoint proving authentication dependency enforcement.
    Returns safe payload only for authenticated active users.
    """
    return {
        "success": True,
        "authenticated": True,
        "user_id": current_user.id,
        "email": current_user.email
    }



@router.post("/logout")
def logout(
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):
    """
    Revokes the current server-side session in the database and clears the HttpOnly cookie.
    Supports revoking both HttpOnly session cookies and JWT Bearer token sessions.
    """
    from backend.dependencies.auth import extract_credentials_from_request
    from backend.core.security import decode_access_token
    from backend.services.session_service import revoke_session_by_id

    token_val, auth_type = extract_credentials_from_request(request)
    if token_val:
        if auth_type == "jwt":
            payload = decode_access_token(token_val)
            if payload and payload.get("sid"):
                revoke_session_by_id(db, payload.get("sid"))
        else:
            revoke_session_by_token(db, token_val)

    # Clear HttpOnly Session Cookie
    response.delete_cookie(
        key=settings.SESSION_COOKIE_NAME,
        path="/",
        httponly=settings.SESSION_COOKIE_HTTPONLY,
        secure=settings.SESSION_COOKIE_SECURE,
        samesite=settings.SESSION_COOKIE_SAMESITE
    )

    return {
        "success": True,
        "message": "Logged out successfully."
    }


@router.post("/password/forgot")
def forgot_password(
    payload: ForgotPasswordInput,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Initiates password reset process for an account.
    Returns a generic success message to prevent user enumeration.
    Dispatches real email OTP with purpose = PASSWORD_RESET for eligible accounts.
    """
    try:
        client_ip = request.client.host if request.client else None
        user_agent = request.headers.get("user-agent")

        success, message = initiate_password_reset(
            db=db,
            email=payload.email,
            ip_address=client_ip,
            user_agent=user_agent
        )

        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"success": False, "message": message}
            )

        return {
            "success": True,
            "message": message
        }
    except HTTPException:
        raise
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f"Error in forgot_password: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"success": False, "message": "Failed to process password reset request. Please try again later."}
        )


@router.post("/password/reset")
def reset_password(
    payload: PasswordResetInput,
    db: Session = Depends(get_db)
):
    """
    Verifies PASSWORD_RESET OTP, updates user password hash with bcrypt,
    and revokes ALL active sessions across all devices.
    """
    success, message = complete_password_reset(
        db=db,
        email=payload.email,
        code=payload.code,
        new_password=payload.new_password
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "message": message, "email": payload.email}
        )

    return {
        "success": True,
        "message": message
    }


# --- Google OAuth 2.0 Endpoints ---

import urllib.parse


def _is_allowed_origin(url_str: str) -> bool:
    """Verifies that a redirect candidate belongs to configured origins or safe domains."""
    if not url_str:
        return False
    try:
        parsed = urllib.parse.urlparse(url_str)
        if not parsed.scheme or not parsed.netloc:
            return False
        netloc = parsed.netloc.lower()
        if any(blocked in netloc for blocked in ["google.com", "googleusercontent.com"]):
            return False
        candidate_root = f"{parsed.scheme}://{parsed.netloc}".rstrip("/").lower()
        allowed_roots = [settings.FRONTEND_URL.rstrip("/").lower()]
        for origin in settings.CORS_ORIGINS:
            if origin:
                allowed_roots.append(origin.rstrip("/").lower())
        if candidate_root in allowed_roots:
            return True
        # Allow trusted localhost / truemarriage subdomains in development/production
        if netloc in ("localhost", "127.0.0.1") or netloc.startswith("localhost:") or netloc.startswith("127.0.0.1:"):
            return True
        if netloc == "truemarriage.in" or netloc.endswith(".truemarriage.in"):
            return True
        return False
    except Exception:
        return False


def _get_frontend_base_url(request: Request, state: Optional[str] = None) -> str:
    """Helper to resolve the frontend base URL safely from signed state, request origin/referer, or settings."""
    from backend.services.google_auth_service import extract_return_origin_from_state

    # 1. Primary: Extract return origin securely embedded inside verified state token
    if state:
        origin_from_state = extract_return_origin_from_state(state)
        if origin_from_state and _is_allowed_origin(origin_from_state):
            return origin_from_state.rstrip("/")

    # 2. Secondary: Check request origin or referer header
    fallback = (settings.FRONTEND_URL or "https://truemarriage.in").rstrip("/")
    referer = request.headers.get("origin") or request.headers.get("referer")
    if referer and _is_allowed_origin(referer):
        parsed = urllib.parse.urlparse(referer)
        return f"{parsed.scheme}://{parsed.netloc}".rstrip("/")

    return fallback


@router.get("/google")
async def google_auth_initiate(
    request: Request,
    redirect: bool = True,
    return_url: Optional[str] = None
):
    """
    Initiates Google OAuth 2.0 flow:
    1. Embeds client origin safely into cryptographically signed CSRF state token.
    2. Stores state in a short-lived HttpOnly cookie.
    3. Redirects browser to Google's consent screen (or returns auth URL if redirect=False).
    """
    from fastapi.responses import RedirectResponse
    import urllib.parse
    from backend.services.google_auth_service import generate_oauth_state, get_google_auth_url

    has_client_id = bool(settings.GOOGLE_CLIENT_ID and settings.GOOGLE_CLIENT_ID.strip())
    has_client_secret = bool(settings.GOOGLE_CLIENT_SECRET and settings.GOOGLE_CLIENT_SECRET.strip())

    if not has_client_id or not has_client_secret:
        err_param = urllib.parse.quote_plus("Google OAuth is not configured on the backend. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in backend/.env.")
        frontend_base = _get_frontend_base_url(request)
        return RedirectResponse(url=f"{frontend_base}?oauth_error={err_param}", status_code=status.HTTP_307_TEMPORARY_REDIRECT)

    # Determine caller return origin
    caller_origin = None
    if return_url and _is_allowed_origin(return_url):
        caller_origin = return_url.rstrip("/")
    else:
        req_origin = request.headers.get("origin") or request.headers.get("referer")
        if req_origin and _is_allowed_origin(req_origin):
            parsed = urllib.parse.urlparse(req_origin)
            caller_origin = f"{parsed.scheme}://{parsed.netloc}".rstrip("/")

    state = generate_oauth_state(return_origin=caller_origin)
    auth_url = get_google_auth_url(state)

    if not redirect:
        return {"success": True, "auth_url": auth_url, "state": state}

    redirect_response = RedirectResponse(url=auth_url, status_code=status.HTTP_307_TEMPORARY_REDIRECT)
    # Set short-lived state cookie for CSRF verification (10 minutes)
    redirect_response.set_cookie(
        key="truemarriage_oauth_state",
        value=state,
        max_age=600,
        httponly=True,
        secure=settings.SESSION_COOKIE_SECURE,
        samesite="lax",
        path="/"
    )
    return redirect_response


@router.get("/google/callback")
async def google_auth_callback(
    request: Request,
    response: Response,
    code: Optional[str] = None,
    state: Optional[str] = None,
    error: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Google OAuth 2.0 Callback:
    1. Validates CSRF state against cookie or cryptographic HMAC signature.
    2. Exchanges authorization code for Google access token.
    3. Retrieves verified profile from Google userinfo.
    4. Authenticates or creates local User with verified email.
    5. Sets server-side session HttpOnly cookie and redirects to frontend application.
    """
    from fastapi.responses import RedirectResponse
    import urllib.parse
    from backend.services.google_auth_service import (
        verify_oauth_state,
        exchange_google_code_for_token,
        fetch_google_userinfo,
        authenticate_or_create_google_user
    )

    frontend_base = _get_frontend_base_url(request, state=state)

    # Handle user cancellation / Google error
    if error:
        err_param = urllib.parse.quote_plus(f"Google sign-in was cancelled: {error}")
        return RedirectResponse(url=f"{frontend_base}?oauth_error={err_param}", status_code=status.HTTP_307_TEMPORARY_REDIRECT)

    if not code or not state:
        err_param = urllib.parse.quote_plus("Missing code or state from Google authorization response.")
        return RedirectResponse(url=f"{frontend_base}?oauth_error={err_param}", status_code=status.HTTP_307_TEMPORARY_REDIRECT)

    # Verify CSRF state token: cookie match OR cryptographic signature fallback
    cookie_state = request.cookies.get("truemarriage_oauth_state")
    cookie_valid = bool(cookie_state and cookie_state == state)
    crypto_valid = verify_oauth_state(state) if state else False

    if not (cookie_valid or crypto_valid):
        err_param = urllib.parse.quote_plus("Invalid OAuth state. Potential CSRF attempt or session expired.")
        return RedirectResponse(url=f"{frontend_base}?oauth_error={err_param}", status_code=status.HTTP_307_TEMPORARY_REDIRECT)

    # Exchange code for access token
    token_ok, access_token, token_err = await exchange_google_code_for_token(code)
    if not token_ok or not access_token:
        err_param = urllib.parse.quote_plus(token_err or "Failed to exchange authorization code with Google.")
        return RedirectResponse(url=f"{frontend_base}?oauth_error={err_param}", status_code=status.HTTP_307_TEMPORARY_REDIRECT)

    # Fetch verified userinfo
    info_ok, userinfo, info_err = await fetch_google_userinfo(access_token)
    if not info_ok or not userinfo:
        err_param = urllib.parse.quote_plus(info_err or "Failed to retrieve verified profile from Google.")
        return RedirectResponse(url=f"{frontend_base}?oauth_error={err_param}", status_code=status.HTTP_307_TEMPORARY_REDIRECT)

    # Authenticate or create user & issue session
    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")

    auth_ok, auth_msg, user, raw_session_token = authenticate_or_create_google_user(
        db=db,
        userinfo=userinfo,
        ip_address=client_ip,
        user_agent=user_agent
    )

    if not auth_ok or not raw_session_token:
        err_param = urllib.parse.quote_plus(auth_msg or "Authentication failed.")
        return RedirectResponse(url=f"{frontend_base}?oauth_error={err_param}", status_code=status.HTTP_307_TEMPORARY_REDIRECT)

    # Success: Set HttpOnly session cookie AND pass token in redirect for mobile / cross-site environments
    encoded_token = urllib.parse.quote_plus(raw_session_token)
    success_redirect = RedirectResponse(
        url=f"{frontend_base}?oauth_success=true&token={encoded_token}",
        status_code=status.HTTP_307_TEMPORARY_REDIRECT
    )

    success_redirect.set_cookie(
        key=settings.SESSION_COOKIE_NAME,
        value=raw_session_token,
        max_age=settings.SESSION_EXPIRE_HOURS * 3600,
        httponly=settings.SESSION_COOKIE_HTTPONLY,
        secure=settings.SESSION_COOKIE_SECURE,
        samesite=settings.SESSION_COOKIE_SAMESITE,
        path="/"
    )
    success_redirect.delete_cookie(key="truemarriage_oauth_state", path="/")

    return success_redirect


@router.post("/google/verify", response_model=GoogleAuthResponse)
async def google_auth_verify_token(
    payload: GoogleVerifyTokenInput,
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):
    """
    Direct Google OAuth 2.0 ID Token Verification (Mobile & Web SDK):
    1. Cryptographically verifies Google ID Token signature against Google's public JWKS.
    2. Validates issuer, expiration, and authorized audience (Web and Android Client IDs).
    3. Validates email verification.
    4. Authenticates or creates local User with verified email.
    5. Links Google identity in user_auth_identities.
    6. Issues server-side session and returns raw Bearer session token + sets HttpOnly cookie.
    """
    from backend.services.google_auth_service import verify_google_id_token, authenticate_or_create_google_user
    from backend.schemas.user import UserResponse

    token_ok, claims, verify_err = verify_google_id_token(payload.id_token)
    if not token_ok or not claims:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"success": False, "message": verify_err or "Invalid or unverified Google token."}
        )

    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")

    auth_ok, auth_msg, user, raw_session_token = authenticate_or_create_google_user(
        db=db,
        userinfo=claims,
        ip_address=client_ip,
        user_agent=user_agent
    )

    if not auth_ok or not user or not raw_session_token:
        msg = auth_msg or "Google authentication failed."
        if "blocked" in msg.lower() or "deactivated" in msg.lower():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={"success": False, "message": msg}
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "message": msg}
        )

    # Set HttpOnly session cookie on the response
    response.set_cookie(
        key=settings.SESSION_COOKIE_NAME,
        value=raw_session_token,
        max_age=settings.SESSION_EXPIRE_HOURS * 3600,
        httponly=settings.SESSION_COOKIE_HTTPONLY,
        secure=settings.SESSION_COOKIE_SECURE,
        samesite=settings.SESSION_COOKIE_SAMESITE,
        path="/"
    )

    setattr(user, "access_token", raw_session_token)
    setattr(user, "token", raw_session_token)
    has_profile = bool(user.biodata)
    is_completed = bool(user.biodata and getattr(user.biodata, "is_completed", False))
    setattr(user, "has_profile", has_profile)
    setattr(user, "is_profile_completed", is_completed)
    setattr(user, "profile_id", user.biodata.id if user.biodata else None)

    return GoogleAuthResponse(
        success=True,
        message="Google authentication successful.",
        access_token=raw_session_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )





@router.post("/account/disable")
def disable_current_user_account(
    payload: DisableAccountInput,
    request: Request,
    response: Response,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Allows an authenticated user to disable (deactivate) their own account.
    Requires password verification and explicit confirmation.
    Hides active profile, revokes all sessions, and logs user out.
    """
    from sqlalchemy import select as sa_select
    from backend.models.enums import ProfileModerationStatus
    from backend.models.biodata import BiodataProfileModel
    from backend.services.security_log_service import log_security_event
    from backend.services.session_service import revoke_all_user_sessions

    if not payload.confirmation:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "message": "Explicit confirmation is required to disable account."}
        )

    # Verification: Verify password if user has password set
    if current_user.password_hash:
        if not payload.password or not verify_password(payload.password, current_user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={"success": False, "message": "Incorrect password. Verification failed."}
            )

    client_ip = request.client.host if request.client else "Unknown"
    user_agent = request.headers.get("user-agent", "")

    # 1. Update user status to DEACTIVATED
    current_user.status = UserStatus.DEACTIVATED

    # 2. Hide biodata profile from public discovery if present
    bio = db.scalar(sa_select(BiodataProfileModel).where(BiodataProfileModel.user_id == current_user.id))
    if bio:
        bio.moderation_status = ProfileModerationStatus.DRAFT

    # 3. Revoke all active sessions
    revoke_all_user_sessions(db, current_user.id)

    # 4. Log security event
    log_security_event(
        db=db,
        event_type="ACCOUNT_DISABLED",
        severity="MEDIUM",
        user_id=current_user.id,
        ip_address=client_ip,
        user_agent=user_agent,
        endpoint="/auth/account/disable",
        method="POST",
        status_code=200,
        details={"reason": payload.reason or "User self-disabled account"}
    )

    db.commit()

    # 5. Clear cookie
    response.delete_cookie(
        key=settings.SESSION_COOKIE_NAME,
        path="/",
        httponly=settings.SESSION_COOKIE_HTTPONLY,
        secure=settings.SESSION_COOKIE_SECURE,
        samesite=settings.SESSION_COOKIE_SAMESITE
    )

    return {
        "success": True,
        "message": "Your account has been temporarily disabled. You have been signed out."
    }


@router.post("/account/delete")
def delete_current_user_account(
    payload: DeleteAccountInput,
    request: Request,
    response: Response,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Allows an authenticated user to permanently delete their account and associated data.
    Requires password verification and confirmation text 'DELETE'.
    """
    from sqlalchemy import select as sa_select, update as sa_update, delete as sa_delete
    from backend.services.security_log_service import log_security_event
    from backend.services.session_service import revoke_all_user_sessions
    from backend.models.biodata import BiodataProfileModel
    from backend.models.interest import InterestModel
    from backend.models.shortlist import ShortlistModel
    from backend.models.profile_analytics import ProfileAnalyticsModel
    from backend.models.match_insight import MatchInsightModel
    from backend.models.notification import NotificationModel
    from backend.models.premium_interest import PremiumInterestEvent

    if not payload.confirmation:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "message": "Confirmation is required to delete account."}
        )

    if payload.confirm_text and payload.confirm_text.strip().upper() != "DELETE":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "message": "Please type DELETE to confirm account deletion."}
        )

    # Verification: Verify password if user has password set
    if current_user.password_hash:
        if not payload.password or not verify_password(payload.password, current_user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={"success": False, "message": "Incorrect password. Verification failed."}
            )

    user_id = current_user.id
    user_email = current_user.email
    client_ip = request.client.host if request.client else "Unknown"
    user_agent = request.headers.get("user-agent", "")

    # 1. Clean up biodata profile and its dependent references
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

    # 3. Revoke all active sessions
    revoke_all_user_sessions(db, user_id)

    # 4. Log security event
    log_security_event(
        db=db,
        event_type="ACCOUNT_DELETED",
        severity="HIGH",
        user_id=user_id,
        ip_address=client_ip,
        user_agent=user_agent,
        endpoint="/auth/account/delete",
        method="POST",
        status_code=200,
        details={"email": user_email, "action": "USER_SELF_DELETE", "reason": payload.reason}
    )

    # 5. Delete the user
    db.delete(current_user)
    db.commit()

    # 6. Clear cookie
    response.delete_cookie(
        key=settings.SESSION_COOKIE_NAME,
        path="/",
        httponly=settings.SESSION_COOKIE_HTTPONLY,
        secure=settings.SESSION_COOKIE_SECURE,
        samesite=settings.SESSION_COOKIE_SAMESITE
    )

    return {
        "success": True,
        "message": "Your account and all associated data have been permanently deleted."
    }
