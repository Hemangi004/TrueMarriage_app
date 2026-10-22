import uuid
from datetime import datetime, timezone
from typing import Dict, Any, Tuple, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select
from backend.core.config import settings
from backend.db.session import check_db_connection
from backend.models.setting import ApplicationSetting
from backend.models.audit_log import AdminAuditLog

# Explicit Allowlist of Editable Settings and validation rules
ALLOWED_EDITABLE_SETTINGS = {
    "session_expire_hours": {
        "type": int,
        "min": 1,
        "max": 168,
        "description": "Duration in hours before an idle user session expires"
    },
    "otp_expire_minutes": {
        "type": int,
        "min": 1,
        "max": 60,
        "description": "Validity period in minutes for email verification OTP codes"
    },
    "otp_resend_cooldown_seconds": {
        "type": int,
        "min": 10,
        "max": 300,
        "description": "Cooldown period in seconds before a user can request another OTP code"
    },
    "emails_from_name": {
        "type": str,
        "max_length": 100,
        "description": "Display sender name for outgoing platform emails"
    },
    "emails_from_email": {
        "type": str,
        "max_length": 120,
        "description": "Sender email address for platform transactional notifications"
    },
}

FORBIDDEN_SECRET_KEYS = {
    "smtp_password",
    "otp_hash_secret",
    "session_secret_key",
    "database_url",
    "password_hash",
    "session_token_hash",
    "secret_key",
}


def get_setting_value(db: Session, key: str, default_val: Any) -> Tuple[Any, bool]:
    """
    Helper to fetch DB-backed setting override if present, else returns default.
    """
    stmt = select(ApplicationSetting).where(ApplicationSetting.key == key)
    setting_row = db.scalar(stmt)
    if setting_row:
        val_str = setting_row.value
        if setting_row.value_type == "int":
            try:
                return int(val_str), True
            except ValueError:
                pass
        elif setting_row.value_type == "bool":
            return val_str.lower() in ("true", "1", "yes"), True
        return val_str, True
    return default_val, False


def get_admin_settings_summary(db: Session) -> Dict[str, Any]:
    """
    Retrieves safe administrative application settings and real system health indicators.
    Guarantees zero secret credentials or passwords are exposed.
    """
    # Database connection verification
    db_connected = check_db_connection()
    smtp_configured = bool((settings.SMTP_USERNAME or settings.SMTP_USER) and settings.SMTP_PASSWORD)

    # Resolve active configuration (environment baseline + DB overrides)
    sess_expire_h, _ = get_setting_value(db, "session_expire_hours", settings.SESSION_EXPIRE_HOURS)
    otp_expire_m, _ = get_setting_value(db, "otp_expire_minutes", settings.OTP_EXPIRE_MINUTES)
    otp_cooldown_s, _ = get_setting_value(db, "otp_resend_cooldown_seconds", settings.OTP_RESEND_COOLDOWN_SECONDS)
    from_name, _ = get_setting_value(db, "emails_from_name", settings.SMTP_FROM_NAME or settings.EMAILS_FROM_NAME)
    from_email, _ = get_setting_value(db, "emails_from_email", settings.SMTP_FROM_EMAIL or settings.EMAILS_FROM_EMAIL)

    return {
        "application": {
            "app_name": settings.APP_NAME,
            "environment": settings.APP_ENV,
            "debug_mode": settings.DEBUG,
            "api_prefix": settings.API_V1_STR,
        },
        "authentication": {
            "session_expire_hours": sess_expire_h,
            "session_cookie_name": settings.SESSION_COOKIE_NAME,
            "session_cookie_httponly": settings.SESSION_COOKIE_HTTPONLY,
            "session_cookie_secure": settings.SESSION_COOKIE_SECURE,
            "session_cookie_samesite": settings.SESSION_COOKIE_SAMESITE,
            "session_secret_configured": True,  # Metadata only, secret value omitted
        },
        "otp": {
            "expiration_minutes": otp_expire_m,
            "resend_cooldown_seconds": otp_cooldown_s,
            "max_attempts": 3,
            "otp_secret_configured": True,  # Metadata only, secret value omitted
        },
        "email": {
            "smtp_host": settings.SMTP_HOST,
            "smtp_port": settings.SMTP_PORT,
            "emails_from_name": from_name,
            "emails_from_email": from_email,
            "smtp_configured": smtp_configured,
            "smtp_password_configured": bool(settings.SMTP_PASSWORD),  # Metadata only
        },
        "security": {
            "cors_origins": settings.CORS_ORIGINS,
            "database_driver": settings.DATABASE_URL.split(":///")[0] if ":///" in settings.DATABASE_URL else "relational",
        },
        "system_status": {
            "database": "CONNECTED" if db_connected else "UNAVAILABLE",
            "smtp_service": "CONFIGURED" if smtp_configured else "NOT_CONFIGURED",
            "app_status": "OK",
        },
        "editable_allowlist": [
            {
                "key": k,
                "type": v["type"].__name__,
                "description": v["description"],
                "value": get_setting_value(db, k, getattr(settings, k.upper(), None))[0]
            }
            for k, v in ALLOWED_EDITABLE_SETTINGS.items()
        ]
    }


def update_admin_settings(db: Session, admin_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
    """
    Updates non-secret application settings backed by explicit allowlist validation.
    Creates security audit log entries for every modified setting.
    """
    if not updates or not isinstance(updates, dict):
        raise ValueError("Updates payload must be a non-empty dictionary.")

    modified_keys = []

    for key, new_val in updates.items():
        key_lower = key.lower()

        # Reject secrets
        if key_lower in FORBIDDEN_SECRET_KEYS or "secret" in key_lower or "password" in key_lower:
            raise ValueError(f"Setting '{key}' is a secret or read-only credential and cannot be modified via HTTP API.")

        # Reject unapproved keys
        if key_lower not in ALLOWED_EDITABLE_SETTINGS:
            raise ValueError(f"Setting '{key}' is not in the approved editable settings allowlist.")

        rule = ALLOWED_EDITABLE_SETTINGS[key_lower]
        val_type = rule["type"]

        # Validate Value Type & Constraints
        try:
            typed_val = val_type(new_val)
        except (ValueError, TypeError):
            raise ValueError(f"Invalid type for setting '{key}'. Expected {val_type.__name__}.")

        if val_type == int:
            if "min" in rule and typed_val < rule["min"]:
                raise ValueError(f"Setting '{key}' must be >= {rule['min']}.")
            if "max" in rule and typed_val > rule["max"]:
                raise ValueError(f"Setting '{key}' must be <= {rule['max']}.")
        elif val_type == str:
            if "max_length" in rule and len(typed_val) > rule["max_length"]:
                raise ValueError(f"Setting '{key}' length must be <= {rule['max_length']} characters.")

        # Fetch existing setting or create new
        stmt = select(ApplicationSetting).where(ApplicationSetting.key == key_lower)
        setting_row = db.scalar(stmt)
        old_val_str = setting_row.value if setting_row else str(getattr(settings, key_lower.upper(), ""))

        if not setting_row:
            setting_row = ApplicationSetting(
                id=f"SETTING-{uuid.uuid4().hex[:8].upper()}",
                key=key_lower,
                value=str(typed_val),
                value_type=val_type.__name__,
                description=rule["description"],
                is_editable=True,
                updated_by=admin_id
            )
            db.add(setting_row)
        else:
            setting_row.value = str(typed_val)
            setting_row.updated_by = admin_id
            setting_row.updated_at = datetime.now(timezone.utc)

        # Audit Log Entry (NEVER records secret values)
        audit_entry = AdminAuditLog(
            id=f"AUDIT-{uuid.uuid4().hex[:10].upper()}",
            admin_id=admin_id,
            action="UPDATE_SETTING",
            target_type="SETTING",
            target_id=key_lower,
            details={
                "setting_key": key_lower,
                "old_value": old_val_str,
                "new_value": str(typed_val),
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        )
        db.add(audit_entry)
        modified_keys.append(key_lower)

    db.commit()
    return get_admin_settings_summary(db)
