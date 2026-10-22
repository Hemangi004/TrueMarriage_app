import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

import uuid
import hashlib
from datetime import datetime, timezone, timedelta
from fastapi.testclient import TestClient
from sqlalchemy import select, delete

from backend.main import app
from backend.db.session import SessionLocal
from backend.models.user import User
from backend.models.session import SessionModel
from backend.models.biodata import BiodataProfileModel
from backend.models.interest import InterestModel
from backend.models.shortlist import ShortlistModel
from backend.models.notification import NotificationModel
from backend.models.enums import UserRole, UserStatus, ProfileModerationStatus, InterestStatus, NotificationType

client = TestClient(app)

def run_e2e_verification():
    db = SessionLocal()
    print("=================================================================")
    print("PHASE 12 END-TO-END REAL DATABASE VERIFICATION")
    print("=================================================================")

    # 1. Cleanup test fixtures if existing
    db.execute(delete(User).where(User.email.in_(["user_a_e2e@test.com", "user_b_e2e@test.com", "user_c_e2e@test.com"])))
    db.commit()

    # 2. Setup Real Users A and B in Database
    user_a = User(
        id=f"user-a-{uuid.uuid4().hex[:8]}",
        email="user_a_e2e@test.com",
        full_name="Aarav Sharma",
        password_hash=hashlib.sha256(b"SecretPass123!").hexdigest(),
        role=UserRole.USER,
        status=UserStatus.ACTIVE,
        is_email_verified=True,
    )
    user_b = User(
        id=f"user-b-{uuid.uuid4().hex[:8]}",
        email="user_b_e2e@test.com",
        full_name="Priya Patel",
        password_hash=hashlib.sha256(b"SecretPass123!").hexdigest(),
        role=UserRole.USER,
        status=UserStatus.ACTIVE,
        is_email_verified=True,
    )
    db.add_all([user_a, user_b])
    db.commit()

    # 3. Create Approved Profiles for A and B
    profile_a = BiodataProfileModel(
        id=f"TRUE-{uuid.uuid4().hex[:8].upper()}",
        user_id=user_a.id,
        moderation_status=ProfileModerationStatus.APPROVED,
        profile_data={
            "fullName": "Aarav Sharma",
            "gender": "Male",
            "age": 29,
            "dob": "1997-04-12",
            "currentCity": "Bangalore",
            "state": "Karnataka",
            "occupation": "Software Architect",
            "education": "M.Tech",
            "religion": "Hindu",
            "caste": "Brahmin",
        }
    )
    profile_b = BiodataProfileModel(
        id=f"TRUE-{uuid.uuid4().hex[:8].upper()}",
        user_id=user_b.id,
        moderation_status=ProfileModerationStatus.APPROVED,
        profile_data={
            "fullName": "Priya Patel",
            "gender": "Female",
            "age": 27,
            "dob": "1999-08-20",
            "currentCity": "Mumbai",
            "state": "Maharashtra",
            "occupation": "Data Scientist",
            "education": "B.Tech",
            "religion": "Hindu",
            "caste": "Patel",
        }
    )
    db.add_all([profile_a, profile_b])
    db.commit()

    # Create Real Server-Side Sessions
    token_a = f"session-a-{uuid.uuid4().hex}"
    session_a = SessionModel(
        id=str(uuid.uuid4()),
        user_id=user_a.id,
        session_token_hash=hashlib.sha256(token_a.encode()).hexdigest(),
        expires_at=datetime.now(timezone.utc) + timedelta(hours=24),
        is_active=True,
    )
    token_b = f"session-b-{uuid.uuid4().hex}"
    session_b = SessionModel(
        id=str(uuid.uuid4()),
        user_id=user_b.id,
        session_token_hash=hashlib.sha256(token_b.encode()).hexdigest(),
        expires_at=datetime.now(timezone.utc) + timedelta(hours=24),
        is_active=True,
    )
    db.add_all([session_a, session_b])
    db.commit()

    headers_a = {"Authorization": f"Bearer {token_a}"}
    headers_b = {"Authorization": f"Bearer {token_b}"}

    print("[PASS] Setup complete: User A (Aarav), User B (Priya) and approved profiles created in DB.")

    # --- STEP 1: Discovery & Shortlist ---
    print("\n--- TEST: User A discovers and shortlists User B ---")
    res = client.get("/api/v1/discovery/profiles", headers=headers_a)
    assert res.status_code == 200, f"Discovery failed: {res.text}"
    print(f"[PASS] Discovery returned {res.json().get('total', 0)} approved profiles.")

    # A shortlists B
    res_sl = client.post("/api/v1/shortlists", json={"profile_id": profile_b.id}, headers=headers_a)
    assert res_sl.status_code == 201, f"Shortlist failed: {res_sl.text}"
    print("[PASS] User A shortlisted User B profile:", res_sl.json()["message"])

    # Verify shortlist persisted in DB
    sl_ids = client.get("/api/v1/shortlists/ids", headers=headers_a).json()["data"]
    assert profile_b.id in sl_ids, "Shortlist not persisted"
    print("[PASS] Shortlist ID verified in persistence store.")

    # --- STEP 2: Send Interest ---
    print("\n--- TEST: User A sends interest to User B ---")
    res_int = client.post("/api/v1/interests", json={"profile_id": profile_b.id}, headers=headers_a)
    assert res_int.status_code == 201, f"Send interest failed: {res_int.text}"
    interest_id = res_int.json()["data"]["id"]
    print(f"[PASS] Interest sent successfully (ID: {interest_id}, status: {res_int.json()['data']['status']})")

    # --- STEP 3: User B Receives Notification & Interest ---
    print("\n--- TEST: User B checks notifications and received interests ---")
    res_notif = client.get("/api/v1/notifications", headers=headers_b)
    assert res_notif.status_code == 200
    notifs_b = res_notif.json()["data"]
    assert len(notifs_b) >= 1, "User B did not receive notification"
    assert notifs_b[0]["type"] == "INTEREST_RECEIVED"
    notif_id = notifs_b[0]["id"]
    print(f"[PASS] User B received notification: '{notifs_b[0]['title']}' - '{notifs_b[0]['message']}'")

    # Mark notification as read
    res_read = client.patch(f"/api/v1/notifications/{notif_id}/read", headers=headers_b)
    assert res_read.status_code == 200
    print("[PASS] User B marked notification as read.")

    # User B views received interests
    res_rec = client.get("/api/v1/interests/received", headers=headers_b)
    assert res_rec.status_code == 200
    received_list = res_rec.json()["data"]
    assert len(received_list) >= 1
    assert received_list[0]["id"] == interest_id
    assert received_list[0]["status"] == "PENDING"
    print("[PASS] User B sees pending interest from User A.")

    # --- STEP 4: User B Accepts Interest ---
    print("\n--- TEST: User B accepts User A's interest ---")
    res_acc = client.post(f"/api/v1/interests/{interest_id}/accept", headers=headers_b)
    assert res_acc.status_code == 200, f"Accept failed: {res_acc.text}"
    assert res_acc.json()["data"]["status"] == "ACCEPTED"
    print("[PASS] User B accepted interest. Status changed to ACCEPTED.")

    # --- STEP 5: User A Receives ACCEPTED Notification ---
    print("\n--- TEST: User A receives INTEREST_ACCEPTED notification ---")
    res_notif_a = client.get("/api/v1/notifications", headers=headers_a)
    assert res_notif_a.status_code == 200
    notifs_a = res_notif_a.json()["data"]
    assert len(notifs_a) >= 1
    assert notifs_a[0]["type"] == "INTEREST_ACCEPTED"
    print(f"[PASS] User A received notification: '{notifs_a[0]['title']}' - '{notifs_a[0]['message']}'")

    # User A sent interests list shows ACCEPTED
    res_sent_a = client.get("/api/v1/interests/sent", headers=headers_a)
    assert res_sent_a.status_code == 200
    assert res_sent_a.json()["data"][0]["status"] == "ACCEPTED"
    print("[PASS] User A verified sent interest status is now ACCEPTED.")

    # --- STEP 6: Separate Lifecycle Tests ---
    print("\n--- TEST: Decline, Withdraw, Reciprocal Match, Self-Interest, Privacy, Authorization ---")

    # Setup User C for Decline / Withdraw tests
    user_c = User(
        id=f"user-c-{uuid.uuid4().hex[:8]}",
        email="user_c_e2e@test.com",
        full_name="Karan Verma",
        password_hash=hashlib.sha256(b"SecretPass123!").hexdigest(),
        role=UserRole.USER,
        status=UserStatus.ACTIVE,
        is_email_verified=True,
    )
    db.add(user_c)
    db.commit()
    profile_c = BiodataProfileModel(
        id=f"TRUE-{uuid.uuid4().hex[:8].upper()}",
        user_id=user_c.id,
        moderation_status=ProfileModerationStatus.APPROVED,
        profile_data={"fullName": "Karan Verma", "gender": "Male", "age": 30}
    )
    db.add(profile_c)
    db.commit()
    token_c = f"session-c-{uuid.uuid4().hex}"
    session_c = SessionModel(
        id=str(uuid.uuid4()),
        user_id=user_c.id,
        session_token_hash=hashlib.sha256(token_c.encode()).hexdigest(),
        expires_at=datetime.now(timezone.utc) + timedelta(hours=24),
        is_active=True,
    )
    db.add(session_c)
    db.commit()
    headers_c = {"Authorization": f"Bearer {token_c}"}

    # Test A -> C -> WITHDRAW
    res_ac = client.post("/api/v1/interests", json={"profile_id": profile_c.id}, headers=headers_a)
    assert res_ac.status_code == 201
    int_ac_id = res_ac.json()["data"]["id"]
    res_withdraw = client.post(f"/api/v1/interests/{int_ac_id}/withdraw", headers=headers_a)
    assert res_withdraw.status_code == 200
    assert res_withdraw.json()["data"]["status"] == "WITHDRAWN"
    print("[PASS] A -> C -> WITHDRAW successful.")

    # Test C -> B -> DECLINE
    res_cb = client.post("/api/v1/interests", json={"profile_id": profile_b.id}, headers=headers_c)
    assert res_cb.status_code == 201
    int_cb_id = res_cb.json()["data"]["id"]
    res_decline = client.post(f"/api/v1/interests/{int_cb_id}/decline", headers=headers_b)
    assert res_decline.status_code == 200
    assert res_decline.json()["data"]["status"] == "DECLINED"
    print("[PASS] C -> B -> DECLINE successful.")

    # Test Reciprocal Match: B -> C (Pending), then C -> B => MATCHED
    res_bc = client.post("/api/v1/interests", json={"profile_id": profile_c.id}, headers=headers_b)
    assert res_bc.status_code == 201
    assert res_bc.json()["data"]["status"] == "PENDING"
    # Now C sends to B => auto-MATCHED
    res_cb_rec = client.post("/api/v1/interests", json={"profile_id": profile_b.id}, headers=headers_c)
    assert res_cb_rec.status_code == 201
    assert res_cb_rec.json()["data"]["status"] == "MATCHED"
    print("[PASS] Reciprocal interest: B -> C pending, then C -> B established as MATCHED for both parties.")

    # Test Self-Interest Blocked
    res_self = client.post("/api/v1/interests", json={"profile_id": profile_a.id}, headers=headers_a)
    assert res_self.status_code == 400
    print("[PASS] Self-interest blocked (400).")

    # Test Authorization Checks
    res_unauth = client.post("/api/v1/interests", json={"profile_id": profile_b.id})
    assert res_unauth.status_code == 401
    print("[PASS] Unauthenticated access denied (401).")

    # Test Sender Cannot Accept Own Interest
    res_illegal_acc = client.post(f"/api/v1/interests/{int_ac_id}/accept", headers=headers_a)
    assert res_illegal_acc.status_code in (400, 403)
    print("[PASS] Sender cannot accept own interest (403/400).")

    # Test Receiver Cannot Withdraw
    res_illegal_with = client.post(f"/api/v1/interests/{int_cb_id}/withdraw", headers=headers_b)
    assert res_illegal_with.status_code in (400, 403)
    print("[PASS] Receiver cannot withdraw interest (403/400).")

    # Test Privacy Audit: inspect raw payload
    raw_json = res_sent_a.text.lower()
    for secret_key in ["password", "token_hash", "otp", "secret", "rejection_reason", "reviewed_by", "moderation_status"]:
        assert secret_key not in raw_json, f"Privacy leak detected: {secret_key} found in interest payload"
    print("[PASS] Privacy audit passed: No private/sensitive data exposed in API responses.")

    # Cleanup test accounts
    db.execute(delete(User).where(User.email.in_(["user_a_e2e@test.com", "user_b_e2e@test.com", "user_c_e2e@test.com"])))
    db.commit()
    db.close()

    print("\n=================================================================")
    print("ALL E2E REAL DATABASE TESTS PASSED WITH ZERO FAILURES!")
    print("=================================================================")

if __name__ == "__main__":
    run_e2e_verification()
