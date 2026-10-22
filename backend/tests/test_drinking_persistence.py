import pytest
from backend.models.user import User, UserRole, UserStatus
from backend.models.biodata import BiodataProfileModel
from backend.core.security import get_password_hash, create_access_token
from backend.tests.test_final_ux_consistency import db_engine, client

def test_drinking_preference_save_and_retrieve(client, db_engine):
    from sqlalchemy.orm import sessionmaker
    SessionLocal = sessionmaker(bind=db_engine)
    db = SessionLocal()

    user = User(
        email="drinking_test@example.com",
        full_name="Drinking Tester",
        password_hash=get_password_hash("Password123!"),
        role=UserRole.USER,
        status=UserStatus.ACTIVE,
        is_email_verified=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    login_res = client.post("/api/v1/auth/login", json={"email": "drinking_test@example.com", "password": "Password123!"})
    assert login_res.status_code == 200

    # 1. First save with 'Never'
    payload1 = {
        "name": "Drinking Tester",
        "gender": "Male",
        "dob": "1995-05-15",
        "drinking": "Never",
        "smoking": "Never",
        "diet": "Vegetarian",
    }
    r1 = client.post("/api/biodata", json=payload1)
    assert r1.status_code == 200, f"r1 failed: {r1.text}"

    # 2. Update to 'Socially'
    payload2 = {
        **payload1,
        "drinking": "Socially",
    }
    r2 = client.post("/api/biodata", json=payload2)
    assert r2.status_code == 200, f"r2 failed: {r2.text}"
    assert r2.json()["profileData"]["drinking"] == "Socially"

    # 3. Fetch via /api/biodata/me
    r3 = client.get("/api/biodata/me")
    assert r3.status_code == 200, f"r3 failed: {r3.text}"
    data = r3.json()["data"]
    assert data["drinking"] == "Socially", f"Expected Socially but got: {data.get('drinking')}"
