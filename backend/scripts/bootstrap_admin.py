"""
Bootstrap script for initializing or updating the default ADMIN account.
Email: temporarymatrimony@gmail.com
Password: admin123
Role: ADMIN
Status: ACTIVE
Is Email Verified: True
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from sqlalchemy import select
from backend.db.session import SessionLocal
from backend.models.user import User, UserAuthIdentity
from backend.models.enums import UserRole, UserStatus, AuthProvider
from backend.core.security import get_password_hash


def bootstrap_admin_account():
    db = SessionLocal()
    admin_accounts = [
        ("temp@admin.com", "admin123", "Temp Admin"),
        ("temporarymatrimony@gmail.com", "admin123", "TrueMarriage Admin"),
    ]

    try:
        for admin_email, raw_password, full_name in admin_accounts:
            stmt = select(User).where(User.email == admin_email)
            user = db.scalar(stmt)

            if user:
                # Promote existing user to ADMIN, set password hash, activate, and verify
                user.role = UserRole.ADMIN
                user.status = UserStatus.ACTIVE
                user.is_email_verified = True
                user.password_hash = get_password_hash(raw_password)

                # Ensure Local AuthIdentity exists
                local_ident_stmt = select(UserAuthIdentity).where(
                    UserAuthIdentity.user_id == user.id,
                    UserAuthIdentity.provider == AuthProvider.LOCAL
                )
                if not db.scalar(local_ident_stmt):
                    db.add(UserAuthIdentity(user_id=user.id, provider=AuthProvider.LOCAL))

                db.commit()
                print(f"[BOOTSTRAP] Admin account '{admin_email}' updated/promoted successfully.")
            else:
                # Create new ADMIN user
                new_admin = User(
                    email=admin_email,
                    full_name=full_name,
                    password_hash=get_password_hash(raw_password),
                    role=UserRole.ADMIN,
                    status=UserStatus.ACTIVE,
                    is_email_verified=True,
                )
                db.add(new_admin)
                db.flush()

                db.add(UserAuthIdentity(user_id=new_admin.id, provider=AuthProvider.LOCAL))
                db.commit()
                print(f"[BOOTSTRAP] Admin account '{admin_email}' created successfully.")
    except Exception as e:
        db.rollback()
        print(f"[BOOTSTRAP ERROR] Failed to bootstrap admin account: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    bootstrap_admin_account()
