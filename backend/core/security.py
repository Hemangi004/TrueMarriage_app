import uuid
import logging
from datetime import datetime, timezone, timedelta
from typing import Optional, Dict, Any
import bcrypt
import jwt
from backend.core.config import settings

logger = logging.getLogger(__name__)


def get_password_hash(password: str) -> str:
    """
    Hashes a plaintext password using bcrypt with automatic salt generation (12 rounds).
    Plaintext passwords are cut to max 72 bytes to adhere to bcrypt standards and
    NEVER stored in the database or logged.
    """
    pwd_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plaintext password against a bcrypt hash using constant-time checkpw.
    """
    if not plain_password or not hashed_password:
        return False
    try:
        pwd_bytes = plain_password.encode('utf-8')[:72]
        hash_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(pwd_bytes, hash_bytes)
    except Exception:
        return False


# --- JWT Token Management ---

def create_access_token(
    user_id: str,
    session_id: str,
    role: str = "USER",
    expires_minutes: int = 60
) -> str:
    """
    Issues a short-lived JWT access token for API clients.
    Binds the JWT to the server-side session_id ('sid') to allow real-time server revocation.
    """
    now = datetime.now(timezone.utc)
    expire = now + timedelta(minutes=expires_minutes)
    
    payload = {
        "sub": user_id,
        "sid": session_id,
        "role": role,
        "jti": f"JWT-{uuid.uuid4().hex[:12].upper()}",
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
        "iss": "truemarriage_auth_engine"
    }
    
    encoded_jwt = jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm="HS256"
    )
    return encoded_jwt


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decodes and verifies a JWT access token signature and expiration.
    Returns payload dictionary if valid, or None if invalid/expired.
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=["HS256"],
            options={"verify_exp": True, "verify_iss": True},
            issuer="truemarriage_auth_engine"
        )
        return payload
    except jwt.ExpiredSignatureError:
        logger.warning("JWT validation failed: Token signature expired")
        return None
    except jwt.InvalidTokenError as err:
        logger.warning(f"JWT validation failed: {err}")
        return None
    except Exception as err:
        logger.error(f"Unexpected error decoding JWT: {err}")
        return None
