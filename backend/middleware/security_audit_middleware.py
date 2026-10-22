"""
Request Tracing & Security Audit Middleware.
Attaches unique request_id (REQ-...) to request context and captures telemetry for failed/forbidden requests.
"""
import uuid
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from backend.db.session import SessionLocal
from backend.services.security_log_service import log_security_event

logger = logging.getLogger(__name__)


class SecurityAuditMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Generate unique request ID
        request_id = f"REQ-{uuid.uuid4().hex[:12].upper()}"
        request.state.request_id = request_id

        response = await call_next(request)

        # Attach X-Request-ID response header
        response.headers["X-Request-ID"] = request_id

        # Audit security-sensitive status codes (401 Unauthorized, 403 Forbidden, 429 Rate Limit)
        if response.status_code in (401, 403, 429):
            client_ip = request.client.host if request.client else "Unknown"
            user_agent = request.headers.get("user-agent", "")
            
            event_type = "UNAUTHORIZED_ACCESS_ATTEMPT"
            severity = "WARNING"
            if response.status_code == 403:
                event_type = "FORBIDDEN_REQUEST"
                severity = "HIGH"
            elif response.status_code == 429:
                event_type = "RATE_LIMIT_EXCEEDED"
                severity = "HIGH"

            db = SessionLocal()
            try:
                log_security_event(
                    db=db,
                    event_type=event_type,
                    severity=severity,
                    ip_address=client_ip,
                    user_agent=user_agent,
                    endpoint=request.url.path,
                    method=request.method,
                    status_code=response.status_code,
                    request_id=request_id,
                    details={"message": f"HTTP {response.status_code} security response triggered."}
                )
            except Exception as err:
                logger.error(f"Failed to record audit middleware log: {err}")
            finally:
                db.close()

        return response
