"""
Modern Production HTTP Security Response Headers Middleware.
Applies CSP, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, and Permissions-Policy.
Omits deprecated headers like X-XSS-Protection.
"""
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from backend.core.config import settings


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        # 1. HSTS (Strict-Transport-Security)
        # Enabled strictly when request is over HTTPS or X-Forwarded-Proto is https
        is_https = request.url.scheme == "https" or request.headers.get("x-forwarded-proto") == "https"
        if is_https:
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"

        # 2. Prevent MIME Sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"

        # 3. Clickjacking Protection
        response.headers["X-Frame-Options"] = "DENY"

        # 4. Strict Referrer Policy
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # 5. Restrict Unused Browser Features & Sensors
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=(), payment=()"

        # 6. Content Security Policy (CSP)
        # Allows self resources, inline styles/scripts for SPA frontend, and images
        csp_directives = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com data:; "
            "img-src 'self' data: blob: https:; "
            "connect-src 'self' ws: wss: http: https:; "
            "frame-ancestors 'none'; "
            "object-src 'none';"
        )
        response.headers["Content-Security-Policy"] = csp_directives

        return response
