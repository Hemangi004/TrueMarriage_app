"""
Adaptive Risk-Based CAPTCHA Service.
Evaluates risk score dynamically from recent security log telemetry (failed logins, rate limit hits).
Triggers CAPTCHA challenge only when risk score elevates.
Generates HMAC-signed mathematical / SVG challenges.
"""
import hmac
import hashlib
import random
import secrets
from datetime import datetime, timezone, timedelta
from typing import Tuple, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from backend.core.config import settings
from backend.models.security_log import SecurityLog


def evaluate_captcha_requirement(
    db: Session,
    ip_address: str,
    email: Optional[str] = None
) -> Tuple[bool, int, str]:
    """
    Evaluates whether CAPTCHA challenge is required for request context.
    Analyzes failed login attempts, CAPTCHA failures, and high-risk events from ip_address or email
    in the rolling 15-minute window.
    """
    fifteen_mins_ago = datetime.now(timezone.utc) - timedelta(minutes=15)
    
    # Query recent high-risk / failed events from this IP
    ip_failed_count = db.scalar(
        select(func.count(SecurityLog.id)).where(
            SecurityLog.ip_address == ip_address,
            SecurityLog.event_type.in_(["LOGIN_FAILED", "CAPTCHA_FAILED", "CSRF_VIOLATION", "RATE_LIMIT_EXCEEDED"]),
            SecurityLog.created_at >= fifteen_mins_ago
        )
    ) or 0

    # Query recent failed logins for target email if provided
    email_failed_count = 0
    if email:
        target_email_clean = email.strip().lower()
        email_failed_count = db.scalar(
            select(func.count(SecurityLog.id)).where(
                SecurityLog.event_type == "LOGIN_FAILED",
                SecurityLog.created_at >= fifteen_mins_ago,
                or_(
                    SecurityLog.user_id == target_email_clean,
                    SecurityLog.details["attempted_email"].as_string() == target_email_clean
                )
            )
        ) or 0

    total_failures = ip_failed_count + email_failed_count
    risk_score = min(100, total_failures * 25)

    if total_failures >= 3 or risk_score >= 50:
        return True, risk_score, f"Risk score elevated ({risk_score}/100) due to {total_failures} recent security events."

    return False, risk_score, "Low threat score. CAPTCHA not required."


def generate_math_captcha() -> Dict[str, Any]:
    """
    Generates a random math challenge (e.g. "14 + 8 = ?") and HMAC token.
    Valid for 5 minutes.
    """
    num1 = random.randint(3, 20)
    num2 = random.randint(1, 15)
    operator = random.choice(["+", "-"])
    
    if operator == "-":
        if num1 < num2:
            num1, num2 = num2, num1
        answer = num1 - num2
    else:
        answer = num1 + num2

    captcha_id = f"CAP-{secrets.token_hex(8).upper()}"
    expires_at = int((datetime.now(timezone.utc) + timedelta(minutes=5)).timestamp())

    # Sign token payload: captcha_id:answer:expires_at
    message = f"{captcha_id}:{answer}:{expires_at}".encode("utf-8")
    signature = hmac.new(settings.SECRET_KEY.encode("utf-8"), message, hashlib.sha256).hexdigest()

    token = f"{captcha_id}.{expires_at}.{signature}"
    challenge_text = f"{num1} {operator} {num2} = ?"

    # SVG Image generation for visual display
    svg_data = (
        f'<svg width="140" height="40" xmlns="http://www.w3.org/2000/svg">'
        f'<rect width="100%" height="100%" fill="#1e1b4b"/>'
        f'<path d="M10 20 Q 30 5, 60 20 T 130 20" stroke="#4c1d95" stroke-width="2" fill="none"/>'
        f'<text x="50%" y="55%" font-family="monospace" font-size="18" font-weight="bold" fill="#f472b6" dominant-baseline="middle" text-anchor="middle">'
        f'{challenge_text}'
        f'</text></svg>'
    )

    return {
        "captcha_token": token,
        "challenge_text": challenge_text,
        "svg_data": svg_data,
        "expires_in": 300
    }


def verify_captcha_solution(captcha_token: str, user_answer: str) -> Tuple[bool, str]:
    """
    Verifies user's submitted CAPTCHA answer against the signed HMAC token.
    """
    if not captcha_token or not user_answer:
        return False, "CAPTCHA token and answer are required."

    try:
        parts = captcha_token.split(".")
        if len(parts) != 3:
            return False, "Malformed CAPTCHA token format."

        captcha_id, expires_at_str, signature = parts
        expires_at = int(expires_at_str)
        now_ts = int(datetime.now(timezone.utc).timestamp())

        if now_ts > expires_at:
            return False, "CAPTCHA token has expired. Please refresh the challenge."

        clean_answer = str(user_answer).strip()
        message = f"{captcha_id}:{clean_answer}:{expires_at_str}".encode("utf-8")
        expected_sig = hmac.new(settings.SECRET_KEY.encode("utf-8"), message, hashlib.sha256).hexdigest()

        if not hmac.compare_digest(expected_sig, signature):
            return False, "Incorrect CAPTCHA answer. Please try again."

        return True, "CAPTCHA verification successful."
    except Exception as e:
        return False, f"CAPTCHA verification failed: {str(e)}"
