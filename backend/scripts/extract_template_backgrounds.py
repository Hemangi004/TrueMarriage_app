#!/usr/bin/env python3
"""
TrueMarriage Template Background Image Extractor
-----------------------------------------------
Scans all templates in the database. If any template layout_json contains embedded
large base64 image data URIs (e.g. data:image/png;base64,...), it decodes and saves
the image to `backend/static/backgrounds/` as a static file, and replaces the
base64 string in layout_json with the static URL path (`/static/backgrounds/{template_id}.png`).

This reduces layout_json payloads by up to 98% (from 6.5 MB to 2 KB per template).
"""

import sys
import os
import io
import re
import base64
import copy
from pathlib import Path

# Add project root to path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from sqlalchemy import select
from sqlalchemy.orm.attributes import flag_modified
from backend.db.session import SessionLocal
from backend.models.template import Template

STATIC_DIR = PROJECT_ROOT / "backend" / "static"
BACKGROUNDS_DIR = STATIC_DIR / "backgrounds"
BACKGROUNDS_DIR.mkdir(parents=True, exist_ok=True)


def extract_data_url(data_url: str, save_path_prefix: Path) -> str:
    """Decodes data URL, saves to disk, and returns relative static URL."""
    match = re.match(r"^data:image/([a-zA-Z0-9\+\-]+);base64,(.+)$", data_url, re.DOTALL)
    if not match:
        return data_url

    ext = match.group(1).lower()
    if ext == "jpeg":
        ext = "jpg"
    elif ext not in ["png", "jpg", "webp", "svg+xml"]:
        ext = "png"

    if ext == "svg+xml":
        ext = "svg"

    b64_data = match.group(2)
    try:
        binary_data = base64.b64decode(b64_data)
    except Exception as e:
        print(f"  [EXTRACT_ERROR] Failed base64 decode: {e}")
        return data_url

    file_name = f"{save_path_prefix.name}.{ext}"
    out_file = save_path_prefix.parent / file_name
    with open(out_file, "wb") as f:
        f.write(binary_data)

    return f"/static/backgrounds/{file_name}"


def extract_template_backgrounds(db_session=None) -> int:
    """
    Extracts embedded base64 backgrounds and images from all template layout_json
    records in the database.
    """
    close_db = False
    if db_session is None:
        db = SessionLocal()
        close_db = True
    else:
        db = db_session

    updated_count = 0
    total_bytes_saved = 0

    try:
        stmt = select(Template)
        templates = db.scalars(stmt).all()

        for tpl in templates:
            layout = tpl.layout_json
            if not isinstance(layout, dict):
                continue

            modified = False
            page = layout.get("page")

            # Check page backgroundImage
            if isinstance(page, dict):
                bg_img = page.get("backgroundImage")
                if isinstance(bg_img, str) and bg_img.startswith("data:image/"):
                    old_len = len(bg_img)
                    save_prefix = BACKGROUNDS_DIR / f"bg_{tpl.id}"
                    new_url = extract_data_url(bg_img, save_prefix)
                    if new_url != bg_img:
                        page["backgroundImage"] = new_url
                        total_bytes_saved += (old_len - len(new_url))
                        modified = True
                        print(f"  [EXTRACT] Template {tpl.id} ({tpl.name}): extracted background ({old_len} -> {len(new_url)} chars)")

            # Check elements for embedded base64 images
            elements = layout.get("elements")
            if isinstance(elements, list):
                for idx, el in enumerate(elements):
                    if not isinstance(el, dict):
                        continue
                    cnt = el.get("content")
                    if isinstance(cnt, str) and cnt.startswith("data:image/"):
                        old_len = len(cnt)
                        save_prefix = BACKGROUNDS_DIR / f"el_{tpl.id}_{el.get('id', idx)}"
                        new_url = extract_data_url(cnt, save_prefix)
                        if new_url != cnt:
                            el["content"] = new_url
                            total_bytes_saved += (old_len - len(new_url))
                            modified = True

            if modified:
                tpl.layout_json = copy.deepcopy(layout)
                flag_modified(tpl, "layout_json")
                updated_count += 1

        if updated_count > 0:
            db.commit()
            print(f"✅ Extracted base64 assets for {updated_count} templates! Saved ~{total_bytes_saved / (1024*1024):.2f} MB.")
        else:
            print("✨ All template backgrounds are already extracted to static files.")

    finally:
        if close_db:
            db.close()

    return updated_count


def main():
    print("🔍 Checking template backgrounds for embedded base64 assets...")
    count = extract_template_backgrounds()
    print(f"Done. {count} templates updated.")


if __name__ == "__main__":
    main()
