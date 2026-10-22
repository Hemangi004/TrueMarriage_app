"""
Regression test for Database Initialization and Users table creation.
Verifies that a fresh development database automatically initializes the 'users'
table and all required authentication tables without raising sqlite3.OperationalError.
"""
import os
import pytest
from sqlalchemy import create_engine, select, inspect
from sqlalchemy.orm import sessionmaker

from backend.db.base import Base
from backend.db.init_db import init_db
from backend.models.user import User, UserStatus, UserRole
from backend.services.google_auth_service import authenticate_or_create_google_user


def test_fresh_database_initialization_and_users_table(tmp_path):
    """
    Test that init_db() on a fresh SQLite file creates the users table
    and permits querying User, normal registration, and Google OAuth user creation.
    """
    db_file = tmp_path / "test_fresh_init.db"
    db_url = f"sqlite:///{db_file}"

    test_engine = create_engine(db_url, connect_args={"check_same_thread": False})
    
    # Ensure database file is completely fresh
    if os.path.exists(db_file):
        os.remove(db_file)

    # 1. Run init_db using test_engine metadata
    import backend.models  # noqa: F401
    Base.metadata.create_all(bind=test_engine)

    # 2. Inspect database and verify 'users' table exists
    inspector = inspect(test_engine)
    tables = inspector.get_table_names()
    assert "users" in tables, "Table 'users' must exist after database initialization"
    assert "user_auth_identities" in tables
    assert "otp_codes" in tables
    assert "sessions" in tables

    # 3. Query User table on fresh DB session (Must NOT raise sqlite3.OperationalError: no such table: users)
    SessionTest = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)
    db = SessionTest()

    try:
        stmt = select(User).where(User.email == "test.fresh@example.com")
        existing_user = db.scalar(stmt)
        assert existing_user is None

        # 4. Perform normal user creation
        new_user = User(
            email="test.fresh@example.com",
            full_name="Fresh User",
            status=UserStatus.ACTIVE,
            role=UserRole.USER,
            is_email_verified=True,
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        assert new_user.id is not None
        assert new_user.email == "test.fresh@example.com"

        # 5. Perform Google OAuth user lookup/creation logic
        mock_google_info = {
            "sub": "google-sub-fresh-123",
            "email": "google.fresh@example.com",
            "email_verified": True,
            "name": "Google Fresh User"
        }

        success, msg, g_user, session_token = authenticate_or_create_google_user(
            db=db,
            userinfo=mock_google_info
        )

        assert success is True
        assert g_user is not None
        assert g_user.email == "google.fresh@example.com"
        assert session_token is not None

    finally:
        db.close()
