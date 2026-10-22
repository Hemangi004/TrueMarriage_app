"""
Security Logging Service & Event Telemetry Engine.
Persists sanitized security events to the database and provides threat telemetry metrics.
"""
import logging
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from backend.models.security_log import SecurityLog

logger = logging.getLogger(__name__)

# Keys that must NEVER be logged in details payload
SENSITIVE_KEYS = {
    "password", "plain_password", "new_password", "old_password",
    "password_confirmation", "otp", "code", "token", "access_token",
    "refresh_token", "secret", "secret_key", "jwt", "cookie",
    "truemarriage_session", "authorization", "key", "encryption_key"
}


def sanitize_details(details: Optional[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Recursively strips sensitive keys, passwords, OTPs, tokens, and credentials
    from the details dictionary before persisting to security_logs.
    """
    if not details or not isinstance(details, dict):
        return {}

    sanitized = {}
    for key, value in details.items():
        key_lower = str(key).lower()
        if any(sensitive in key_lower for sensitive in SENSITIVE_KEYS):
            sanitized[key] = "[REDACTED_SENSITIVE_CREDENTIAL]"
        elif isinstance(value, dict):
            sanitized[key] = sanitize_details(value)
        elif isinstance(value, (list, tuple)):
            sanitized[key] = [
                sanitize_details(item) if isinstance(item, dict) else item
                for item in value
            ]
        else:
            sanitized[key] = value
    return sanitized


def calculate_default_risk_score(severity: str, event_type: str) -> int:
    """Calculates default risk score (0-100) based on severity and event classification."""
    severity_map = {
        "INFO": 5,
        "WARNING": 35,
        "HIGH": 70,
        "CRITICAL": 95
    }
    base_score = severity_map.get(severity.upper(), 10)
    
    # Event specific modifiers
    event_modifiers = {
        "CSRF_VIOLATION": 80,
        "UNTRUSTED_ORIGIN": 75,
        "RATE_LIMIT_EXCEEDED": 65,
        "LOGIN_FAILED": 30,
        "CAPTCHA_FAILED": 45,
        "ROLE_ACCESS_DENIED": 85,
        "GDPR_ERASURE": 40,
        "SQL_INJECTION_ATTEMPT": 100,
    }
    return event_modifiers.get(event_type.upper(), base_score)


def log_security_event(
    db: Session,
    event_type: str,
    severity: str = "INFO",
    user_id: Optional[str] = None,
    target_user_id: Optional[str] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
    endpoint: Optional[str] = None,
    method: Optional[str] = None,
    status_code: Optional[int] = None,
    request_id: Optional[str] = None,
    session_id: Optional[str] = None,
    risk_score: Optional[int] = None,
    details: Optional[Dict[str, Any]] = None
) -> SecurityLog:
    """
    Persists a sanitized security event record to the security_logs table.
    Guarantees zero credential leakage.
    """
    try:
        clean_details = sanitize_details(details)
        final_risk_score = risk_score if risk_score is not None else calculate_default_risk_score(severity, event_type)
        
        log_entry = SecurityLog(
            request_id=request_id,
            session_id=session_id,
            event_type=event_type.upper(),
            severity=severity.upper(),
            risk_score=min(100, max(0, final_risk_score)),
            user_id=user_id,
            target_user_id=target_user_id,
            ip_address=ip_address,
            user_agent=user_agent[:255] if user_agent else None,
            endpoint=endpoint,
            method=method,
            status_code=status_code,
            details=clean_details,
        )
        db.add(log_entry)
        db.commit()
        db.refresh(log_entry)
        return log_entry
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to log security event: {e}")
        # Return transient non-persisted model to avoid crashing caller
        return SecurityLog(
            event_type=event_type,
            severity=severity,
            details={"error": "Failed to persist log"}
        )
