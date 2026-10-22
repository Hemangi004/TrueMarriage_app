"""
GDPR Compliance Data Rights Engine.
Handles Right to Access (User Data Export) and Right to be Forgotten (Account Erasure & Anonymization).
Retains anonymized audit telemetry required for legal and security compliance.
"""
import uuid
import logging
from datetime import datetime, timezone
from typing import Tuple, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select

from backend.models.user import User, UserAuthIdentity
from backend.models.biodata import BiodataProfileModel
from backend.models.interest import InterestModel
from backend.models.shortlist import ShortlistModel
from backend.models.notification import NotificationModel
from backend.models.session import SessionModel
from backend.models.security_log import SecurityLog
from backend.models.enums import UserStatus
from backend.services.session_service import revoke_all_user_sessions
from backend.services.security_log_service import log_security_event

logger = logging.getLogger(__name__)


def export_user_data(db: Session, user: User) -> Dict[str, Any]:
    """
    Exports complete personal data package for authenticated user (GDPR Right to Access).
    """
    # 1. User Core Account Metadata
    account_data = {
        "user_id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role.value,
        "status": user.status.value,
        "is_email_verified": user.is_email_verified,
        "created_at": user.created_at.isoformat() if user.created_at else None,
        "last_login_at": user.last_login_at.isoformat() if user.last_login_at else None,
    }

    # 2. Linked Auth Identities
    ident_stmt = select(UserAuthIdentity).where(UserAuthIdentity.user_id == user.id)
    identities = db.scalars(ident_stmt).all()
    auth_identities = [
        {"provider": ident.provider.value, "linked_at": ident.created_at.isoformat() if ident.created_at else None}
        for ident in identities
    ]

    # 3. Biodata Profile
    biodata_stmt = select(BiodataProfileModel).where(BiodataProfileModel.user_id == user.id)
    biodata_profile = db.scalar(biodata_stmt)
    biodata_payload = biodata_profile.raw_data if biodata_profile else None

    # 4. Interactions (Interests & Shortlists)
    interests_sent = db.scalars(select(InterestModel).where(InterestModel.sender_user_id == user.id)).all()
    interests_received = db.scalars(select(InterestModel).where(InterestModel.receiver_user_id == user.id)).all()
    shortlists = db.scalars(select(ShortlistModel).where(ShortlistModel.user_id == user.id)).all()

    # 5. Security Logs Stream
    user_logs = db.scalars(
        select(SecurityLog)
        .where(SecurityLog.user_id == user.id)
        .order_by(SecurityLog.created_at.desc())
        .limit(50)
    ).all()

    log_records = [
        {
            "event_type": log.event_type,
            "severity": log.severity,
            "timestamp": log.created_at.isoformat() if log.created_at else None,
            "ip_address": log.ip_address,
            "endpoint": log.endpoint
        }
        for log in user_logs
    ]

    return {
        "export_metadata": {
            "gdpr_compliance": "Article 15 - Right of Access",
            "exported_at": datetime.now(timezone.utc).isoformat(),
            "export_id": f"GDPR-EXP-{uuid.uuid4().hex[:8].upper()}"
        },
        "account": account_data,
        "auth_identities": auth_identities,
        "biodata_profile": biodata_payload,
        "interests": {
            "sent_count": len(interests_sent),
            "received_count": len(interests_received)
        },
        "shortlists_count": len(shortlists),
        "security_audit_history": log_records
    }


def execute_gdpr_erasure(
    db: Session,
    user: User,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None
) -> Tuple[bool, str]:
    """
    Executes GDPR Article 17 Right to be Forgotten:
    1. Revokes all active user sessions & tokens.
    2. Anonymizes User model PII (email, name, password hash).
    3. Anonymizes BiodataProfileModel PII fields.
    4. Logs compliant audit record with anonymized references.
    """
    try:
        old_user_id = user.id
        anonymized_tag = uuid.uuid4().hex[:10]
        
        # 1. Revoke all active sessions
        revoke_all_user_sessions(db, old_user_id)

        # 2. Anonymize User model
        user.email = f"anonymized_{anonymized_tag}@gdpr.invalid"
        user.full_name = "Anonymized User"
        user.password_hash = None
        user.phone = None
        user.status = UserStatus.DEACTIVATED
        user.is_email_verified = False

        # 3. Anonymize BiodataProfileModel
        biodata_stmt = select(BiodataProfileModel).where(BiodataProfileModel.user_id == old_user_id)
        biodata = db.scalar(biodata_stmt)
        if biodata:
            biodata.raw_data = {"status": "ANONYMIZED_UNDER_GDPR", "anonymized_at": datetime.now(timezone.utc).isoformat()}

        db.commit()

        # 4. Record compliance log
        log_security_event(
            db=db,
            event_type="GDPR_ERASURE",
            severity="HIGH",
            user_id=old_user_id,
            ip_address=ip_address,
            user_agent=user_agent,
            endpoint="/auth/gdpr/erasure",
            details={"action": "RIGHT_TO_BE_FORGOTTEN", "anonymized_id": f"ANON-{anonymized_tag}"}
        )

        return True, "Account data successfully erased and anonymized in compliance with GDPR Article 17."
    except Exception as e:
        db.rollback()
        logger.error(f"GDPR erasure failed: {e}")
        return False, f"GDPR erasure operation failed: {str(e)}"
