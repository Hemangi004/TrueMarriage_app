from fastapi import Request, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from backend.core.config import settings


class OriginValidationMiddleware(BaseHTTPMiddleware):
    """
    Lightweight CSRF/Origin Validation Middleware for state-changing HTTP requests.
    Inspects the Origin header on POST, PUT, PATCH, and DELETE requests.
    Validates that the Origin matches an explicitly configured allowed origin in settings.CORS_ORIGINS.
    """
    async def dispatch(self, request: Request, call_next):
        if request.method in ["POST", "PUT", "PATCH", "DELETE"]:
            origin = request.headers.get("origin")
            if origin:
                normalized_origin = origin.rstrip("/")
                allowed_origins = [o.rstrip("/") for o in settings.CORS_ORIGINS] + [
                    "https://truemarriage.in",
                    "https://www.truemarriage.in",
                    "http://truemarriage.in",
                    "http://www.truemarriage.in",
                ]
                is_allowed = normalized_origin in allowed_origins or (
                    normalized_origin.endswith(".truemarriage.in")
                    or normalized_origin == "https://truemarriage.in"
                )
                if not is_allowed and settings.APP_ENV != "production":
                    if normalized_origin.startswith("http://localhost:") or normalized_origin.startswith("http://127.0.0.1:"):
                        is_allowed = True

                if not is_allowed:
                    client_ip = request.client.host if request.client else "Unknown"
                    user_agent = request.headers.get("user-agent", "")
                    request_id = getattr(request.state, "request_id", None)
                    
                    try:
                        from backend.db.session import SessionLocal
                        from backend.services.security_log_service import log_security_event
                        db = SessionLocal()
                        log_security_event(
                            db=db,
                            event_type="CSRF_VIOLATION",
                            severity="HIGH",
                            ip_address=client_ip,
                            user_agent=user_agent,
                            endpoint=request.url.path,
                            method=request.method,
                            status_code=403,
                            request_id=request_id,
                            details={"untrusted_origin": origin, "message": "Origin header not in allowed whitelist"}
                        )
                        db.close()
                    except Exception:
                        pass

                    return JSONResponse(
                        status_code=status.HTTP_403_FORBIDDEN,
                        content={
                            "success": False,
                            "message": "Security Violation: Request origin is untrusted."
                        }
                    )

        response = await call_next(request)
        return response
