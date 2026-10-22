import sys
from typing import Optional
from sqlalchemy.orm import Session
from backend.db.session import SessionLocal
from backend.models.user import User, UserAuthIdentity
from backend.models.enums import UserRole, UserStatus, AuthProvider
from backend.core.security import get_password_hash


def promote_or_create_admin(email: str, password: Optional[str] = None) -> User:
    """
    Operator CLI utility for server-side admin creation and promotion.
    Users can NEVER self-promote via public APIs. Admin access requires explicit operator action.
    """
    normalized_email = email.strip().lower()
    db: Session = SessionLocal()

    try:
        user = db.query(User).filter(User.email == normalized_email).first()

        if user:
            user.role = UserRole.ADMIN
            user.status = UserStatus.ACTIVE
            user.is_email_verified = True
            if password:
                user.password_hash = get_password_hash(password)
            db.commit()
            db.refresh(user)
            print(f"[SUCCESS] User '{normalized_email}' promoted to ADMIN role (ID: {user.id}).")
            return user

        if not password:
            password = "AdminDefaultPassword2026!"

        new_admin = User(
            email=normalized_email,
            full_name="System Administrator",
            password_hash=get_password_hash(password),
            role=UserRole.ADMIN,
            status=UserStatus.ACTIVE,
            is_email_verified=True
        )
        db.add(new_admin)
        db.flush()

        identity = UserAuthIdentity(
            user_id=new_admin.id,
            provider=AuthProvider.LOCAL
        )
        db.add(identity)

        db.commit()
        db.refresh(new_admin)
        print(f"[SUCCESS] Created new ADMIN account '{normalized_email}' (ID: {new_admin.id}).")
        return new_admin
    finally:
        db.close()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python -m backend.scripts.create_admin <email> [password]")
        sys.exit(1)

    target_email = sys.argv[1]
    target_pass = sys.argv[2] if len(sys.argv) > 2 else None
    promote_or_create_admin(target_email, target_pass)
