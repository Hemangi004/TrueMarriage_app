"""
Database initialization module for TrueMarriage Matrimonial Backend.
Ensures all SQLAlchemy ORM models are registered and their corresponding
database tables are created/migrated automatically on application startup.
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

import logging
from sqlalchemy import inspect
from backend.db.session import engine
from backend.db.base import Base
# Import all ORM models to register with Base.metadata
import backend.models  # noqa: F401

logger = logging.getLogger(__name__)


def init_db() -> None:
    """
    Initializes database schema for all registered SQLAlchemy models.
    Safe for existing databases: create_all does not overwrite or drop existing tables.
    Also attempts Alembic migration synchronization if Alembic configuration is present.
    """
    logger.info("Initializing database schema...")
    print("[INIT_DB] Initializing database tables with SQLAlchemy metadata...")
    
    # 1. Ensure all model tables exist via SQLAlchemy metadata
    Base.metadata.create_all(bind=engine)

    # 2. Synchronize Alembic migration state if alembic is available
    try:
        from alembic.config import Config
        from alembic import command
        import os

        alembic_ini_path = "alembic.ini"
        if not os.path.exists(alembic_ini_path):
            alembic_ini_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "alembic.ini")

        if os.path.exists(alembic_ini_path):
            alembic_cfg = Config(alembic_ini_path)
            try:
                command.upgrade(alembic_cfg, "head")
                print("[INIT_DB] Alembic migrations applied successfully.")
            except Exception as e:
                logger.warning(f"Alembic upgrade warning: {e}. Stamping database to head.")
                command.stamp(alembic_cfg, "head")
                print("[INIT_DB] Stamped database to Alembic head revision.")
    except Exception as err:
        logger.warning(f"Alembic synchronization skipped: {err}")

    # Ensure user_id in premium_interest_events is NULLABLE for guest click support
    try:
        import sqlalchemy as sa
        with engine.connect() as conn:
            conn.execute(sa.text("ALTER TABLE premium_interest_events MODIFY user_id VARCHAR(36) NULL;"))
            conn.commit()
    except Exception:
        pass

    # Ensure otp_codes, security_logs, and notifications have expanded string types for compatibility
    try:
        import sqlalchemy as sa
        with engine.connect() as conn:
            conn.execute(sa.text("ALTER TABLE otp_codes MODIFY purpose VARCHAR(64) NOT NULL;"))
            conn.execute(sa.text("ALTER TABLE otp_codes MODIFY type VARCHAR(64) NOT NULL;"))
            conn.execute(sa.text("ALTER TABLE otp_codes MODIFY user_agent VARCHAR(512) NULL;"))
            conn.execute(sa.text("ALTER TABLE security_logs MODIFY user_agent VARCHAR(512) NULL;"))
            conn.execute(sa.text("ALTER TABLE notifications MODIFY type VARCHAR(64) NOT NULL;"))
            try:
                conn.execute(sa.text("ALTER TABLE notifications ADD COLUMN image_url TEXT NULL;"))
            except Exception:
                pass
            conn.commit()
    except Exception:
        pass

    # Ensure is_completed column exists on biodata_profiles and backfill existing published profiles
    try:
        import sqlalchemy as sa
        inspector = inspect(engine)
        if "biodata_profiles" in inspector.get_table_names():
            columns = [c["name"] for c in inspector.get_columns("biodata_profiles")]
            if "is_completed" not in columns:
                with engine.connect() as conn:
                    conn.execute(sa.text("ALTER TABLE biodata_profiles ADD COLUMN is_completed BOOLEAN NOT NULL DEFAULT 0;"))
                    try:
                        conn.execute(sa.text("CREATE INDEX ix_biodata_profiles_is_completed ON biodata_profiles(is_completed);"))
                    except Exception:
                        pass
                    # Backfill existing published profiles as completed
                    conn.execute(sa.text("UPDATE biodata_profiles SET is_completed = 1 WHERE status = 'PUBLISHED';"))
                    conn.commit()
                    print("[INIT_DB] Added is_completed column to biodata_profiles and backfilled existing profiles.")
    except Exception as e:
        logger.warning(f"Could not auto-migrate is_completed column on biodata_profiles: {e}")

    # Verify tables
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"[INIT_DB] Database initialization complete. Active tables: {tables}")
    logger.info(f"Database initialization complete. Active tables: {tables}")

    _seed_default_templates()
    _seed_default_admin()


def _seed_default_admin() -> None:
    """Seeds default SuperAdmin user if not present."""
    import uuid
    from backend.db.session import SessionLocal
    from backend.models.user import User, UserAuthIdentity
    from backend.models.enums import UserRole, UserStatus, AuthProvider
    from backend.core.security import get_password_hash

    db = SessionLocal()
    admin_accounts = [
        ("temp@admin.com", "admin123", "Temp Admin"),
        ("temporarymatrimony@gmail.com", "admin123", "TrueMarriage Admin"),
    ]
    try:
        for admin_email, raw_pwd, full_name in admin_accounts:
            existing = db.query(User).filter(User.email == admin_email).first()
            if not existing:
                admin_user = User(
                    id=str(uuid.uuid4()),
                    email=admin_email,
                    full_name=full_name,
                    password_hash=get_password_hash(raw_pwd),
                    role=UserRole.ADMIN,
                    status=UserStatus.ACTIVE,
                    is_email_verified=True,
                )
                db.add(admin_user)
                db.flush()
                identity = UserAuthIdentity(
                    id=str(uuid.uuid4()),
                    user_id=admin_user.id,
                    provider=AuthProvider.LOCAL,
                    provider_user_id=admin_email,
                )
                db.add(identity)
                db.commit()
                print(f"[INIT_DB] Admin user '{admin_email}' seeded successfully.")
            else:
                existing.role = UserRole.ADMIN
                existing.status = UserStatus.ACTIVE
                existing.is_email_verified = True
                existing.password_hash = get_password_hash(raw_pwd)
                db.commit()
    except Exception as e:
        db.rollback()
        print(f"[INIT_DB ERROR] Failed to seed default admin: {e}")
    finally:
        db.close()


def _seed_default_templates() -> None:
    """Seeds default categories and initial template library if empty."""
    from sqlalchemy import select
    from backend.db.session import SessionLocal
    from backend.models.template import Category, Template, TemplateCategory

    db = SessionLocal()
    try:
        categories_data = [
            Category(id="traditional", name="Traditional", slug="traditional", icon="🚩", description="Classic Indian traditional designs with sacred motifs and shlokas.", display_order=1),
            Category(id="modern", name="Modern", slug="modern", icon="✨", description="Clean, minimal, modern aesthetic for contemporary profiles.", display_order=2),
            Category(id="luxury", name="Luxury", slug="luxury", icon="👑", description="Royal parchment, gold leaf borders & premium typography.", display_order=3),
            Category(id="floral", name="Floral", slug="floral", icon="🌸", description="Soft floral accents, vintage borders and pastel palettes.", display_order=4),
            Category(id="royal", name="Royal & Heritage", slug="royal", icon="⚜️", description="Grand maharajah heritage styling with ornate frames.", display_order=5),
            Category(id="minimalist", name="Minimalist", slug="minimalist", icon="✨", description="Clean, simple and modern minimalist layouts.", display_order=6),
        ]
        for c in categories_data:
            existing = db.scalar(select(Category).where(Category.id == c.id))
            if not existing:
                db.add(c)
        db.commit()

        # Check if templates table is empty
        if not db.scalar(select(Template)):
            print("[INIT_DB] Seeding initial standard templates...")
            templates_data = [
                {
                    "id": "trad_red_mandala",
                    "name": "Red Royal Mandala",
                    "slug": "red-royal-mandala",
                    "description": "Vibrant maroon & gold mandala border with Sanskrit shloka header.",
                    "thumbnail_url": "/templates/red_mandala.png",
                    "status": "PUBLISHED",
                    "pricing_type": "FREE",
                    "is_luxury": False,
                    "badge": "Traditional Ganesha",
                    "preview_icon": "🚩",
                    "default_accent": "#8B0000",
                    "default_bg": "#FFFDF5",
                    "font_family": "Playfair Display",
                    "categories": ["traditional", "royal"],
                    "layout_json": {
                        "page": {"width": 794, "height": 1123, "background": "#FFFDF5", "padding": 32, "fontFamily": "Playfair Display"},
                        "elements": [
                            {"id": "title", "type": "text", "content": "॥ श्री गणेशाय नमः ॥", "x": 50, "y": 40, "width": 694, "height": 40, "zIndex": 1, "style": {"fontSize": 20, "fontWeight": "bold", "color": "#8B0000", "textAlign": "center"}},
                            {"id": "name", "type": "text", "content": "{{personalDetails.fullName}}", "x": 50, "y": 90, "width": 694, "height": 50, "zIndex": 2, "style": {"fontSize": 32, "fontWeight": "bold", "color": "#1A1A1A", "textAlign": "center"}}
                        ]
                    }
                },
                {
                    "id": "modern_minimal_gold",
                    "name": "Modern Minimalist Gold",
                    "slug": "modern-minimalist-gold",
                    "description": "Sleek contemporary layout with subtle gold divider accents.",
                    "thumbnail_url": "/templates/pink_vintage_lotus.png",
                    "status": "PUBLISHED",
                    "pricing_type": "FREE",
                    "is_luxury": False,
                    "badge": "Modern",
                    "preview_icon": "✨",
                    "default_accent": "#D97706",
                    "default_bg": "#FFFFFF",
                    "font_family": "Inter",
                    "categories": ["modern"],
                    "layout_json": {
                        "page": {"width": 794, "height": 1123, "background": "#FFFFFF", "padding": 32, "fontFamily": "Inter"},
                        "elements": [
                            {"id": "name", "type": "text", "content": "{{personalDetails.fullName}}", "x": 50, "y": 60, "width": 694, "height": 48, "zIndex": 1, "style": {"fontSize": 28, "fontWeight": "bold", "color": "#1E293B", "textAlign": "center"}},
                            {"id": "role", "type": "text", "content": "{{educationOccupation.occupation}}", "x": 50, "y": 115, "width": 694, "height": 28, "zIndex": 1, "style": {"fontSize": 16, "color": "#D97706", "textAlign": "center"}}
                        ]
                    }
                }
            ]

            for t_info in templates_data:
                cat_ids = t_info.pop("categories")
                tpl = Template(**t_info)
                db.add(tpl)
                db.flush()
                for c_id in cat_ids:
                    db.add(TemplateCategory(template_id=tpl.id, category_id=c_id))
            db.commit()

        # Ensure all existing templates have category mappings in template_categories
        templates = db.query(Template).all()
        added_mappings = 0
        for t in templates:
            existing_links = set(db.scalars(
                select(TemplateCategory.category_id).where(TemplateCategory.template_id == t.id)
            ).all())

            name = (t.name or "").lower()
            slug = (t.slug or "").lower()
            desc = (t.description or "").lower()
            combined = f"{name} {slug} {desc}"

            cats = set()

            # FLORAL
            if any(k in combined for k in ["bloom", "floral", "flora", "flower", "rose", "gulab", "petal", "jasmine", "gardenia", "lotus", "mehfil", "blossom"]):
                cats.add("floral")

            # ROYAL & HERITAGE
            if any(k in combined for k in ["royal", "royale", "raj", "darbar", "imperial", "maharaja", "majestic", "mughal", "crest", "crown", "regal", "sovereign", "shehnai", "legacy", "heritage", "vivah", "swarna"]):
                cats.add("royal")

            # LUXURY
            if t.is_luxury or any(k in combined for k in ["luxury", "luxe", "opulence", "sovereign", "imperial", "crest", "crown", "gold", "golden", "velvet", "pearl", "aurevane", "elysienne", "marovelle", "orlienne", "velmora", "elaris", "calviera", "rajwada", "regal"]):
                cats.add("luxury")

            # MODERN
            if any(k in combined for k in ["modern", "minimal", "calviera", "elaris", "aurevane", "elysienne", "marovelle", "orlienne", "velmora", "virelia", "alveria", "elegance", "plain", "charm", "grace", "aabha", "aarohi", "komal", "nivaan", "saumil", "sparsh"]):
                cats.add("modern")

            # TRADITIONAL
            if any(k in combined for k in ["traditional", "hindu", "shehnai", "vivah", "darbar", "rajvansh", "rajmahal", "rajtilak", "mughal", "milan", "heritage", "aarambh", "sukoon", "saanjh", "anmol", "astitva", "saumya", "utsav", "prerna", "madhur", "sneh", "manas"]):
                cats.add("traditional")

            if not cats:
                if t.pricing_type == "PREMIUM":
                    cats.add("royal")
                    cats.add("luxury")
                else:
                    cats.add("traditional")
                    cats.add("modern")

            if t.id in ("tpl_763d18c0", "tpl_3ebb20a1"):
                cats.add("floral")
                cats.add("luxury")

            for c_id in cats:
                if c_id not in existing_links:
                    db.add(TemplateCategory(template_id=t.id, category_id=c_id))
                    added_mappings += 1

        if added_mappings > 0:
            db.commit()
            print(f"[INIT_DB] Synced {added_mappings} missing template-category mappings.")

        # Ensure duplicate template instances are archived so only canonical versions appear in gallery
        dup_tpl = db.scalar(select(Template).where(Template.id == "tpl_f23adecb"))
        if dup_tpl and dup_tpl.status == "PUBLISHED":
            dup_tpl.status = "ARCHIVED"
            db.commit()
            print("[INIT_DB] Archived duplicate template tpl_f23adecb.")
    except Exception as e:
        db.rollback()
        print(f"[INIT_DB ERROR] Failed to seed/sync templates: {e}")
    finally:
        db.close()



if __name__ == "__main__":
    init_db()
