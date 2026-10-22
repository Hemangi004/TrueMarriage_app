from datetime import datetime, timezone
from backend.db.session import SessionLocal
from backend.models.biodata import BiodataProfileModel
from backend.models.enums import ProfileModerationStatus

def approve_all():
    db = SessionLocal()
    try:
        profiles = db.query(BiodataProfileModel).all()
        for p in profiles:
            p.status = "PUBLISHED"
            p.moderation_status = ProfileModerationStatus.APPROVED
            p.published_at = p.published_at or datetime.now(timezone.utc)
            p.reviewed_at = datetime.now(timezone.utc)
        db.commit()
        print(f"Successfully approved and published all {len(profiles)} profiles in the database!")
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    approve_all()
