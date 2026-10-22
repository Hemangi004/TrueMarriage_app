import sys
import os
import io
import re
import json
import base64
import argparse
import urllib.request
from pathlib import Path
from typing import Dict, Optional, Tuple

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

try:
    from PIL import Image, ImageDraw, ImageFont, ImageOps
except ImportError:
    print("⚠️ Pillow (PIL) is not installed in this Python environment.")
    print("   To install it, run: pip install Pillow")
    print("   Skipping thumbnail generation (thumbnails already exist in frontend/public/thumbnails).")
    import sys
    sys.exit(0)
from sqlalchemy import select
from backend.db.session import SessionLocal
from backend.models.template import Template

STATIC_THUMBNAILS_DIR = PROJECT_ROOT / 'backend' / 'static' / 'thumbnails'
STATIC_THUMBNAILS_DIR.mkdir(parents=True, exist_ok=True)
STATIC_BACKGROUNDS_DIR = PROJECT_ROOT / 'backend' / 'static' / 'backgrounds'
STATIC_BACKGROUNDS_DIR.mkdir(parents=True, exist_ok=True)
FRONTEND_PUBLIC_DIR = PROJECT_ROOT / 'frontend' / 'public'
FRONTEND_THUMBNAILS_DIR = FRONTEND_PUBLIC_DIR / 'thumbnails'
FRONTEND_THUMBNAILS_DIR.mkdir(parents=True, exist_ok=True)

# Native A4 dimensions (794 x 1123 @ 96 DPI)
A4_WIDTH = 794
A4_HEIGHT = 1123
THUMB_WIDTH = 397
THUMB_HEIGHT = 561

SAMPLE_DATA_EN: Dict[str, str] = {
    'pageHeader.deity': '|| Shri Ganeshay Namah: ||',
    'pageHeader.deityIcon': '🌸',
    'personalDetails.fullName': 'Hemangi Kayarkar',
    'personalDetails.gender': 'Female',
    'personalDetails.dateOfBirth': '10 December 1998',
    'personalDetails.timeOfBirth': '11:15 AM',
    'personalDetails.placeOfBirth': 'Pune, Maharashtra',
    'personalDetails.religion': 'Hindu',
    'personalDetails.caste': 'Brahmin',
    'personalDetails.kuldaivat': 'Shri Khandoba (Jejuri)',
    'personalDetails.kuldevata': 'Shri Khandoba (Jejuri)',
    'personalDetails.gotra': 'Vashishta',
    'personalDetails.rashi': 'Kanya (Virgo)',
    'personalDetails.nakshatra': 'Chitra',
    'personalDetails.gan': 'Dev',
    'personalDetails.nadi': 'Madhya',
    'personalDetails.height': "5' 6\" (168 cm)",
    'personalDetails.weight': '58 kg',
    'personalDetails.complexion': 'Very Fair',
    'personalDetails.bloodGroup': 'B+',
    'personalDetails.maritalStatus': 'Never Married',
    'personalDetails.motherTongue': 'Marathi',
    'educationOccupation.education': 'M.Des in User Experience (NID Ahmedabad)',
    'educationOccupation.occupation': 'Software Developer',
    'educationOccupation.companyName': 'Microsoft India',
    'educationOccupation.annualIncome': '₹ 12 LPA',
    'educationOccupation.workLocation': 'Pune, India',
    'familyDetails.fatherName': 'Sanjay Kayarkar',
    'familyDetails.fatherOccupation': 'Private Job',
    'familyDetails.motherName': 'Mukta Kayarkar',
    'familyDetails.motherOccupation': 'Homemaker',
    'familyDetails.brothers': '1 Brother (Unmarried, Software Developer)',
    'familyDetails.sisters': 'None',
    'familyDetails.nativePlace': 'Nagpur, Maharashtra',
    'familyDetails.maternalUncle': 'Anil Deshmukh (Sangli)',
    'familyDetails.relations': 'Patil, Shinde, Jadhav families',
    'contactDetails.primaryContact': '+91 98765 00000',
    'contactDetails.secondaryContact': '+91 98989 12345',
    'contactDetails.mobileNumber': '+91 98765 00000',
    'contactDetails.email': 'hemangi.kayarkar@example.com',
    'contactDetails.residenceAddress': 'Flat 12, Ganesh Nagar, Pune - 411001',
}

SAMPLE_DATA_MR: Dict[str, str] = {
    'pageHeader.deity': '॥ श्री गणेशाय नमः ॥',
    'pageHeader.deityIcon': '🌸',
    'personalDetails.fullName': 'हेमांगी संजय कायर्कर',
    'personalDetails.gender': 'स्त्री',
    'personalDetails.dateOfBirth': '10 डिसेंबर 1997',
    'personalDetails.timeOfBirth': 'सकाळी 10:15',
    'personalDetails.placeOfBirth': 'पुणे, महाराष्ट्र',
    'personalDetails.religion': 'हिंदू',
    'personalDetails.caste': 'ब्राह्मण',
    'personalDetails.kuldaivat': 'श्री खंडोबा (जेजुरी)',
    'personalDetails.kuldevata': 'श्री खंडोबा (जेजुरी)',
    'personalDetails.gotra': 'वशिष्ठ',
    'personalDetails.rashi': 'कन्या (Virgo)',
    'personalDetails.nakshatra': 'चित्रा',
    'personalDetails.gan': 'देव',
    'personalDetails.nadi': 'मध्य',
    'personalDetails.height': "5' 6\" (168 cm)",
    'personalDetails.weight': '56 kg',
    'personalDetails.complexion': 'गोरा (Very Fair)',
    'personalDetails.bloodGroup': 'B+',
    'personalDetails.maritalStatus': 'अविवाहित',
    'personalDetails.motherTongue': 'मराठी',
    'educationOccupation.education': 'M.Des (UX Design)',
    'educationOccupation.occupation': 'Software Developer',
    'educationOccupation.companyName': 'Microsoft India',
    'educationOccupation.annualIncome': '₹ 14 लाख / वर्ष',
    'educationOccupation.workLocation': 'पुणे',
    'familyDetails.fatherName': 'संजय कायर्कर',
    'familyDetails.fatherOccupation': 'खाजगी नोकरी',
    'familyDetails.motherName': 'मुक्ता कायर्कर',
    'familyDetails.motherOccupation': 'गृहिणी',
    'familyDetails.brothers': '1 भाऊ (अविवाहित)',
    'familyDetails.sisters': 'नाही',
    'familyDetails.nativePlace': 'पुणे, महाराष्ट्र',
    'familyDetails.maternalUncle': 'अनिल देशमुख (सांगली)',
    'familyDetails.relations': 'पाटील, शिंदे, जाधव घराणे',
    'contactDetails.primaryContact': '+91 98765 00000',
    'contactDetails.secondaryContact': '+91 98989 12345',
    'contactDetails.email': 'hemangi.kayarkar@example.com',
    'contactDetails.residenceAddress': 'फ्लॅट 12, गणेश नगर, पुणे - 411001',
}

FONT_CACHE: Dict[Tuple[str, int], ImageFont.FreeTypeFont] = {}

def get_font(font_family: str, size: int, bold: bool = False, is_indic: bool = False) -> ImageFont.ImageFont:
    size = max(10, min(72, int(size)))
    cache_key = (f"{font_family}_{bold}_{is_indic}", size)
    if cache_key in FONT_CACHE:
        return FONT_CACHE[cache_key]

    indic_candidates = [
        r"C:\Windows\Fonts\Nirmala.ttc",
        r"C:\Windows\Fonts\mangal.ttf",
        r"C:\Windows\Fonts\aparaj.ttf",
        "/usr/share/fonts/opentype/noto/NotoSansDevanagari-Bold.ttf" if bold else "/usr/share/fonts/opentype/noto/NotoSansDevanagari-Regular.ttf",
        "/usr/share/fonts/truetype/noto/NotoSansDevanagari-Bold.ttf" if bold else "/usr/share/fonts/truetype/noto/NotoSansDevanagari-Regular.ttf",
        "/usr/share/fonts/truetype/lohit-devanagari/Lohit-Devanagari.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSerifBold.ttf" if bold else "/usr/share/fonts/truetype/freefont/FreeSerif.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]

    latin_bold_candidates = [
        r"C:\Windows\Fonts\arialbd.ttf",
        r"C:\Windows\Fonts\georgiab.ttf",
        r"C:\Windows\Fonts\calibrib.ttf",
        r"C:\Windows\Fonts\segoeuib.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf",
    ]

    latin_regular_candidates = [
        r"C:\Windows\Fonts\arial.ttf",
        r"C:\Windows\Fonts\calibri.ttf",
        r"C:\Windows\Fonts\georgia.ttf",
        r"C:\Windows\Fonts\segoeui.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSans.ttf",
    ]

    candidates = indic_candidates if is_indic else (latin_bold_candidates if bold else latin_regular_candidates)

    for p in candidates:
        if os.path.exists(p):
            try:
                font = ImageFont.truetype(p, size)
                FONT_CACHE[cache_key] = font
                return font
            except Exception:
                continue

    try:
        font = ImageFont.load_default()
        return font
    except Exception:
        return None

def clean_int(val, default=0) -> int:
    if val is None:
        return default
    s = str(val).replace('px', '').replace('%', '').strip()
    try:
        return int(float(s))
    except Exception:
        return default

def parse_color(color_str: Optional[str], default=(50, 50, 50, 255)) -> tuple:
    if not color_str:
        return default
    c = str(color_str).strip().lower()
    if c.startswith('rgba'):
        m = re.findall(r'[0-9]+', c)
        if len(m) >= 3:
            r, g, b = int(m[0]), int(m[1]), int(m[2])
            a = int(float(m[3]) * 255) if len(m) >= 4 else 255
            return (r, g, b, a)
    if c.startswith('rgb'):
        m = re.findall(r'[0-9]+', c)
        if len(m) >= 3:
            return (int(m[0]), int(m[1]), int(m[2]), 255)
    if c.startswith('#'):
        c = c.lstrip('#')
        if len(c) == 3:
            c = ''.join([x * 2 for x in c])
        if len(c) == 6:
            return (int(c[0:2], 16), int(c[2:4], 16), int(c[4:6], 16), 255)
        if len(c) == 8:
            return (int(c[0:2], 16), int(c[2:4], 16), int(c[4:6], 16), int(c[6:8], 16))
    return default

def get_image_luminance(im: Image.Image, box: Optional[Tuple[int, int, int, int]] = None) -> float:
    try:
        crop = im.crop(box) if box else im
        small = crop.resize((32, 32), Image.Resampling.BOX).convert('L')
        pixels = list(small.getdata())
        return sum(pixels) / max(1, len(pixels))
    except Exception:
        return 128.0

def load_image_asset(path_or_url: str) -> Optional[Image.Image]:
    if not path_or_url:
        return None

    # Base64
    if path_or_url.startswith('data:image/'):
        try:
            raw_b64 = path_or_url.split(',', 1)[1] if ',' in path_or_url else path_or_url
            return Image.open(io.BytesIO(base64.b64decode(raw_b64))).convert('RGBA')
        except Exception:
            return None

    # Check local filesystem locations
    clean_p = path_or_url.lstrip('/')
    candidates = [
        FRONTEND_PUBLIC_DIR / clean_p,
        PROJECT_ROOT / 'backend' / clean_p,
        PROJECT_ROOT / 'backend' / 'static' / clean_p.replace('static/', ''),
        PROJECT_ROOT / clean_p,
        STATIC_BACKGROUNDS_DIR / clean_p.replace('static/backgrounds/', ''),
    ]
    for c in candidates:
        if c.exists() and c.is_file():
            try:
                return Image.open(c).convert('RGBA')
            except Exception:
                pass

    # Remote URL or truemarriage.in fallback
    fetch_url = path_or_url
    if not fetch_url.startswith(('http://', 'https://')):
        fetch_url = 'https://truemarriage.in/' + clean_p

    try:
        req = urllib.request.Request(fetch_url, headers={'User-Agent': 'Mozilla/5.0'})
        content = urllib.request.urlopen(req, timeout=8).read()
        loaded = Image.open(io.BytesIO(content)).convert('RGBA')
        # Cache locally if it is a background
        if 'background' in clean_p:
            save_name = Path(clean_p).name
            (STATIC_BACKGROUNDS_DIR / save_name).write_bytes(content)
        return loaded
    except Exception:
        return None

SAMPLE_PORTRAIT: Optional[Image.Image] = None

def get_sample_portrait() -> Image.Image:
    global SAMPLE_PORTRAIT
    if SAMPLE_PORTRAIT is not None:
        return SAMPLE_PORTRAIT

    for candidate in [
        FRONTEND_PUBLIC_DIR / 'images' / 'sample_candidate_modal.jpg',
        FRONTEND_PUBLIC_DIR / 'images' / 'hero_bride.jpg',
        FRONTEND_PUBLIC_DIR / 'images' / 'hero_bride_2.jpg',
        FRONTEND_PUBLIC_DIR / 'images' / 'hero_groom.jpg',
    ]:
        if candidate.exists():
            try:
                SAMPLE_PORTRAIT = Image.open(candidate).convert('RGBA')
                return SAMPLE_PORTRAIT
            except Exception:
                pass

    try:
        url = 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80'
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        SAMPLE_PORTRAIT = Image.open(io.BytesIO(urllib.request.urlopen(req, timeout=5).read())).convert('RGBA')
        return SAMPLE_PORTRAIT
    except Exception:
        pass

    im = Image.new('RGBA', (200, 200), (245, 230, 215, 255))
    SAMPLE_PORTRAIT = im
    return SAMPLE_PORTRAIT

def render_template_canvas(template: Template) -> Image.Image:
    layout = template.layout_json or {}
    page = layout.get('page', {}) if isinstance(layout, dict) else {}
    elements = layout.get('elements', []) if isinstance(layout, dict) else []

    # 1. Base Canvas
    bg_hex = page.get('background') or template.default_bg or '#FFFFFF'
    canvas = Image.new('RGBA', (A4_WIDTH, A4_HEIGHT), parse_color(bg_hex, (255, 255, 255, 255)))

    # 2. Background Image
    bg_spec = page.get('backgroundImage') or page.get('background_image') or ''
    if bg_spec:
        bg_loaded = load_image_asset(bg_spec)
        if bg_loaded:
            bg_scaled = bg_loaded.resize((A4_WIDTH, A4_HEIGHT), Image.Resampling.LANCZOS)
            canvas = Image.alpha_composite(canvas, bg_scaled)

    # Detect language of template (Devanagari vs English)
    has_indic = False
    for el in elements:
        c = el.get('content') or ''
        if any(ord(ch) > 127 for ch in c):
            has_indic = True
            break
    sample_dict = SAMPLE_DATA_MR if has_indic else SAMPLE_DATA_EN

    # Overall canvas brightness for fallback contrast
    avg_bg_lum = get_image_luminance(canvas)
    is_dark_canvas = avg_bg_lum < 115

    # 3. Draw Elements Overlay
    overlay = Image.new('RGBA', (A4_WIDTH, A4_HEIGHT), (255, 255, 255, 0))
    draw = ImageDraw.Draw(overlay)

    sorted_elements = sorted(elements, key=lambda el: el.get('zIndex', 1))

    for el in sorted_elements:
        el_type = el.get('type', 'text')
        x = clean_int(el.get('x', 0))
        y = clean_int(el.get('y', 0))
        w = max(4, clean_int(el.get('width', 100)))
        h = max(4, clean_int(el.get('height', 24)))
        binding = el.get('fieldBinding')
        content = el.get('content')
        style = el.get('style') or {}

        # --- Photo Frame Element ---
        if el_type == 'image' or binding == 'personalDetails.photoUrl' or 'photo' in str(el.get('id', '')).lower():
            portrait = None
            if content and isinstance(content, str) and content.startswith(('http', 'data:', '/')):
                portrait = load_image_asset(content)
            if not portrait:
                portrait = get_sample_portrait()

            radius_raw = str(el.get('borderRadius') or style.get('borderRadius', 8))
            is_circle = '50%' in radius_raw or el.get('shapeType') == 'circle'
            rad = min(w, h) // 2 if is_circle else clean_int(radius_raw, 8)

            p_fit = ImageOps.fit(portrait, (w, h), method=Image.Resampling.LANCZOS)

            mask = Image.new('L', (w, h), 0)
            md = ImageDraw.Draw(mask)
            if is_circle:
                md.ellipse([0, 0, w, h], fill=255)
            else:
                md.rounded_rectangle([0, 0, w, h], radius=rad, fill=255)

            overlay.paste(p_fit, (x, y), mask)

            border_c = parse_color(el.get('borderColor') or style.get('borderColor') or '#D4AF37', (212, 175, 55, 255))
            border_w = max(1, clean_int(el.get('borderWidth') or style.get('borderWidth', 2), 2))
            if is_circle:
                draw.ellipse([x, y, x + w, y + h], outline=border_c, width=border_w)
            else:
                draw.rounded_rectangle([x, y, x + w, y + h], radius=rad, outline=border_c, width=border_w)

        # --- Divider Element ---
        elif el_type == 'divider':
            line_c = parse_color(el.get('color') or style.get('color') or '#D4AF37', (212, 175, 55, 180))
            line_w = max(1, clean_int(el.get('height', 1)))
            draw.line([x, y + h // 2, x + w, y + h // 2], fill=line_c, width=line_w)

        # --- Shape Element ---
        elif el_type == 'shape':
            bg_c = parse_color(el.get('backgroundColor') or style.get('backgroundColor'), (255, 255, 255, 80))
            brd_c = parse_color(el.get('borderColor') or style.get('borderColor'), (212, 175, 55, 120))
            brd_w = max(1, clean_int(el.get('borderWidth') or style.get('borderWidth', 1)))
            rad = clean_int(el.get('borderRadius') or style.get('borderRadius', 4))
            draw.rounded_rectangle([x, y, x + w, y + h], radius=rad, fill=bg_c, outline=brd_c, width=brd_w)

        # --- Text Element ---
        else:
            text = sample_dict.get(binding, content or '')
            if not text:
                continue
            for k, v in sample_dict.items():
                text = text.replace(f"{{{{{k}}}}}", v)

            raw_col_str = el.get('color') or style.get('color')
            if is_dark_canvas:
                if not raw_col_str or raw_col_str in ['#1E293B', '#000000', '#111827', '#0F172A', '#333333']:
                    text_color = (255, 248, 235, 255)
                else:
                    text_color = parse_color(raw_col_str, (255, 248, 235, 255))
            else:
                if not raw_col_str or raw_col_str in ['#FFFFFF', '#F8FAFC']:
                    text_color = (30, 41, 59, 255)
                else:
                    text_color = parse_color(raw_col_str, (30, 41, 59, 255))

            fs = clean_int(el.get('fontSize') or style.get('fontSize'), 14)
            is_bold = el.get('fontWeight') in ['bold', 700, '700', '800'] or style.get('fontWeight') in ['bold', '700', '800']
            font_family = str(el.get('fontFamily') or style.get('fontFamily') or page.get('fontFamily') or '')

            is_dev = any(ord(ch) > 127 for ch in text)
            font = get_font(font_family, fs, bold=is_bold, is_indic=is_dev)

            align = el.get('textAlign') or style.get('textAlign') or 'left'
            if align == 'center':
                draw.text((x + w // 2, y + h // 2), text, fill=text_color, font=font, anchor='mm')
            elif align == 'right':
                draw.text((x + w - 2, y + h // 2), text, fill=text_color, font=font, anchor='rm')
            else:
                draw.text((x + 2, y + h // 2), text, fill=text_color, font=font, anchor='lm')

    final_canvas = Image.alpha_composite(canvas, overlay).convert('RGB')
    return final_canvas

def render_template_thumbnail(template: Template, output_path: Path):
    canvas_img = render_template_canvas(template)
    thumb = canvas_img.resize((THUMB_WIDTH, THUMB_HEIGHT), Image.Resampling.LANCZOS)
    thumb.save(output_path, 'WEBP', quality=92, method=6)
    frontend_target = FRONTEND_THUMBNAILS_DIR / output_path.name
    try:
        thumb.save(frontend_target, 'WEBP', quality=92, method=6)
    except Exception:
        pass

def generate_all_template_thumbnails(force: bool = False, db_session = None) -> int:
    close_db = False
    if db_session is None:
        db = SessionLocal()
        close_db = True
    else:
        db = db_session

    count_updated = 0
    try:
        stmt = select(Template)
        templates = db.scalars(stmt).all()
        for tpl in templates:
            file_name = f"{tpl.id}.webp"
            target_path = STATIC_THUMBNAILS_DIR / file_name
            target_url = f"/static/thumbnails/{file_name}"

            if not force and target_path.exists() and tpl.thumbnail_url == target_url and target_path.stat().st_size > 15000:
                continue

            try:
                render_template_thumbnail(tpl, target_path)
                tpl.thumbnail_url = target_url
                count_updated += 1
                print(f"  [THUMBNAILS] Rendered {tpl.id} ({tpl.name})")
            except Exception as err:
                print(f"  [THUMBNAILS] Error rendering {tpl.id}: {err}")

        if count_updated > 0:
            db.commit()
    finally:
        if close_db:
            db.close()

    return count_updated

def sync_and_generate_from_remote_api() -> int:
    url = 'https://truemarriage.in/api/v1/templates?include_layout=true'
    print(f"Fetching all templates from production API ({url})...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        resp = urllib.request.urlopen(req, timeout=15)
        templates_data = json.loads(resp.read().decode())
    except Exception as e:
        print(f"Failed to fetch templates from remote: {e}")
        return 0

    count = 0
    for item in templates_data:
        tid = item.get('id')
        name = item.get('name')
        layout = item.get('layout_json')
        if not tid or not layout:
            continue

        target_path = STATIC_THUMBNAILS_DIR / f"{tid}.webp"
        tpl_stub = Template(
            id=tid,
            name=name,
            default_bg=item.get('default_bg', '#FFFFFF'),
            layout_json=layout
        )
        try:
            render_template_thumbnail(tpl_stub, target_path)
            count += 1
            print(f"  [SYNC] Generated thumbnail for {tid} ({name})")
        except Exception as e:
            print(f"  [SYNC] Error rendering {tid}: {e}")

    return count

def main():
    parser = argparse.ArgumentParser(description='Generate template thumbnail preview images.')
    parser.add_argument('--force', action='store_true', help='Force regenerate all thumbnails')
    parser.add_argument('--sync-remote', action='store_true', help='Also sync and generate all thumbnails from production catalog')
    args = parser.parse_args()

    print(f"Checking & generating template thumbnails (force={args.force})...")
    count = generate_all_template_thumbnails(force=args.force)
    print(f"DB thumbnails generated: {count}")

    if args.sync_remote or count <= 8:
        print("Syncing & generating thumbnails for all catalog templates...")
        remote_count = sync_and_generate_from_remote_api()
        print(f"Complete catalog thumbnails generated: {remote_count}")

if __name__ == '__main__':
    main()
