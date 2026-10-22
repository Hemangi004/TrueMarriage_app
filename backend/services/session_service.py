import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Tuple, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select, update
from backend.core.config import settings
from backend.models.session import SessionModel


def hash_session_token(token: str) -> str:
    """
    Computes SHA-256 hash of a raw session token.
    Only token hashes are stored in database; raw tokens exist exclusively
    in transient memory and the browser's HttpOnly cookie.
    """
    return hashlib.sha256(token.strip().encode("utf-8")).hexdigest()


def create_session(
    db: Session,
    user_id: str,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None
) -> Tuple[SessionModel, str]:
    """
    Creates a new server-side session for a user.
    1. Generates 256-bit cryptographically secure token using secrets.token_urlsafe(32).
    2. Computes SHA-256 hash.
    3. Persists SessionModel with expiration (settings.SESSION_EXPIRE_HOURS).
    Returns (session_model, raw_session_token).
    """
    raw_token = secrets.token_urlsafe(32)
    token_hash = hash_session_token(raw_token)
    expires_at = datetime.now(timezone.utc) + timedelta(hours=settings.SESSION_EXPIRE_HOURS)

    session_record = SessionModel(
        user_id=user_id,
        session_token_hash=token_hash,
        expires_at=expires_at,
        is_active=True,
        ip_address=ip_address,
        user_agent=user_agent
    )

    db.add(session_record)
    db.commit()
    db.refresh(session_record)

    return session_record, raw_token


def get_active_session_by_token(db: Session, raw_token: str) -> Optional[SessionModel]:
    """
    Validates a raw session token against the database session store.
    Enforces active state and expiration timestamp. Updates last_seen_at.
    """
    if not raw_token:
        return None

    token_hash = hash_session_token(raw_token)
    now = datetime.now(timezone.utc)

    stmt = select(SessionModel).where(
        SessionModel.session_token_hash == token_hash,
        SessionModel.is_active == True
    )
    session_record = db.scalar(stmt)

    if not session_record:
        return None

    # Check timezone-aware expiration timestamp
    expires_time = session_record.expires_at
    if expires_time:
        if expires_time.tzinfo is None:
            expires_time = expires_time.replace(tzinfo=timezone.utc)

        if now >= expires_time:
            session_record.is_active = False
            db.commit()
            return None

    # Update last_seen_at timestamp

    session_record.last_seen_at = now
    db.commit()

    return session_record


def revoke_session_by_token(db: Session, raw_token: str) -> bool:
    """
    Revokes/deactivates a specific session by raw token.
    """
    if not raw_token:
        return False

    token_hash = hash_session_token(raw_token)
    now = datetime.now(timezone.utc)

    stmt = select(SessionModel).where(
        SessionModel.session_token_hash == token_hash,
        SessionModel.is_active == True
    )
    session_record = db.scalar(stmt)

    if not session_record:
        return False

    session_record.is_active = False
    session_record.revoked_at = now
    db.commit()

    return True


def revoke_session_by_id(db: Session, session_id: str) -> bool:
    """
    Revokes/deactivates a specific session by its session ID.
    """
    if not session_id:
        return False

    now = datetime.now(timezone.utc)
    stmt = select(SessionModel).where(
        SessionModel.id == session_id,
        SessionModel.is_active == True
    )
    session_record = db.scalar(stmt)

    if not session_record:
        return False

    session_record.is_active = False
    session_record.revoked_at = now
    db.commit()

    return True


def revoke_all_user_sessions(db: Session, user_id: str) -> int:
    """
    Revokes all active sessions for a given user (used for account deactivation,
    password resets, and multi-device logout). Returns number of sessions revoked.
    """
    now = datetime.now(timezone.utc)
    stmt = (
        update(SessionModel)
        .where(
            SessionModel.user_id == user_id,
            SessionModel.is_active == True
        )
        .values(is_active=False, revoked_at=now)
    )
    result = db.execute(stmt)
    db.commit()
    return result.rowcount
