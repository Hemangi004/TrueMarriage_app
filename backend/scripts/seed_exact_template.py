import sys, os
sys.path.insert(0, r"c:\Users\kayar\Desktop\New folder\matrimonial_Site")
from backend.db.session import SessionLocal
from backend.models.template import Template, TemplateCategory, TemplateVersion, Favorite

PAGE_W, PAGE_H = 794, 1123

def t(id_, x, y, w, h, zi, content="", field="", size=11.5, weight="500", color="#111111", align="left", italic=False):
    e = {"id": id_, "type": "text", "x": x, "y": y, "width": w, "height": h, "zIndex": zi,
         "style": {"fontSize": size, "fontWeight": weight, "color": color, "textAlign": align,
                   "lineHeight": 1.4, "fontStyle": "italic" if italic else "normal"}}
    if content: e["content"] = content
    if field: e["fieldBinding"] = field
    return e

def make_shubhpatrika_exact_template():
    els = []
    BG = "#FAF4E8"
    BORDER_COLOR = "#C5A059"
    HEADING_COLOR = "#000000"
    LBL_COLOR = "#000000"
    VAL_COLOR = "#000000"
    
    # ── Borders & Corners ───────────────────────────────────────────────
    els.append({"id":"bdr_outer","type":"shape","shapeType":"rectangle","x":22,"y":22,"width":PAGE_W-44,"height":PAGE_H-44,"zIndex":0,
                "style":{"backgroundColor":"transparent","border":f"2.5px solid {BORDER_COLOR}"}})
    els.append({"id":"bdr_inner","type":"shape","shapeType":"rectangle","x":30,"y":30,"width":PAGE_W-60,"height":PAGE_H-60,"zIndex":0,
                "style":{"backgroundColor":"transparent","border":f"1px solid {BORDER_COLOR}","opacity":0.7}})

    # 4 Corner Floral Ornaments
    for cid, cx, cy, rot in [("c_tl",20,20,0), ("c_tr",PAGE_W-120,20,90), ("c_bl",20,PAGE_H-120,270), ("c_br",PAGE_W-120,PAGE_H-120,180)]:
        els.append({"id":cid,"type":"decoration","decorationKey":"floral_corner","x":cx,"y":cy,"width":100,"height":100,"zIndex":1,"rotation":rot,
                    "style":{"color":BORDER_COLOR,"opacity":0.45}})

    # Repeating Background Watermark
    for i, wx in enumerate([90, 310, 540]):
        for j, wy in enumerate([180, 420, 660, 900]):
            els.append(t(f"wm_{i}_{j}", wx, wy, 200, 45, 1, content="शुभ पत्रिका", size=24, weight="bold", color=BORDER_COLOR, align="center", italic=True))
    for el in els:
        if el.get("id","").startswith("wm_"):
            el["style"]["opacity"] = 0.08

    # ── Top Header ───────────────────────────────────────────────────────
    # Ganesha Icon
    els.append(t("ganesha_icon", 0, 42, PAGE_W, 36, 10, content="🙏", size=32, weight="bold", color="#B45309", align="center"))
    els.append(t("shloka", 0, 84, PAGE_W, 28, 10, content="|| श्री गणेशाय नमः ||", size=16, weight="bold", color=HEADING_COLOR, align="center"))
    els.append(t("sec1_title", 0, 114, PAGE_W, 24, 10, content="वैयक्तिक माहिती", size=13, weight="bold", color=HEADING_COLOR, align="center"))

    # ── Section 1: Personal Details (Centered Layout matching screenshot) ──
    LBL_X = 110
    LBL_W = 175
    COLON_X = 285
    VAL_X = 305
    VAL_W = 390
    ROW_H = 26
    FS = 11.5

    personal_rows = [
        ("नाव", "personalDetails.fullName"),
        ("जन्म तारीख", "personalDetails.dateOfBirth"),
        ("जन्म वेळ", "personalDetails.timeOfBirth"),
        ("जन्म स्थळ", "personalDetails.placeOfBirth"),
        ("धर्म", "personalDetails.religion"),
        ("जात", "personalDetails.caste"),
        ("कुलदैवत", "personalDetails.kuldaivat"),
        ("गोत्र", "personalDetails.gotra"),
        ("राशी", "personalDetails.rashi"),
        ("नक्षत्र", "personalDetails.nakshatra"),
        ("गण", "personalDetails.gan"),
        ("नाडी", "personalDetails.nadi"),
        ("उंची", "personalDetails.height"),
        ("वर्ण", "personalDetails.complexion"),
        ("रक्तगट", "personalDetails.bloodGroup"),
        ("शिक्षण", "educationOccupation.education"),
        ("नोकरी/व्यवसाय", "educationOccupation.occupation"),
        ("वेतन/उत्पन्न", "educationOccupation.annualIncome"),
    ]

    y0 = 148
    for i, (lbl, fld) in enumerate(personal_rows):
        y = y0 + i * ROW_H
        els.append(t(f"p_lbl_{i}", LBL_X, y, LBL_W, ROW_H-2, 10, content=lbl, size=FS, weight="bold", color=LBL_COLOR))
        els.append(t(f"p_col_{i}", COLON_X, y, 16, ROW_H-2, 10, content=":", size=FS, weight="bold", color=LBL_COLOR, align="center"))
        els.append(t(f"p_val_{i}", VAL_X, y, VAL_W, ROW_H-2, 10, field=fld, size=FS, weight="500", color=VAL_COLOR))

    # ── Section 2: Family Details ─────────────────────────────────────────
    fam_title_y = y0 + len(personal_rows) * ROW_H + 12
    els.append(t("sec2_title", 0, fam_title_y, PAGE_W, 24, 10, content="कौटुंबिक माहिती", size=13, weight="bold", color=HEADING_COLOR, align="center"))

    family_rows = [
        ("वडिलांचे नाव", "familyDetails.fatherName"),
        ("वडिलांचा व्यवसाय", "familyDetails.fatherOccupation"),
        ("आईचे नाव", "familyDetails.motherName"),
        ("बहीण", "familyDetails.sisters"),
        ("भाऊ", "familyDetails.brothers"),
        ("मामा", "familyDetails.mama"),
        ("नातेसंबंध", "familyDetails.natesambandh"),
    ]

    fam_y0 = fam_title_y + 30
    for i, (lbl, fld) in enumerate(family_rows):
        y = fam_y0 + i * ROW_H
        els.append(t(f"f_lbl_{i}", LBL_X, y, LBL_W, ROW_H-2, 10, content=lbl, size=FS, weight="bold", color=LBL_COLOR))
        els.append(t(f"f_col_{i}", COLON_X, y, 16, ROW_H-2, 10, content=":", size=FS, weight="bold", color=LBL_COLOR, align="center"))
        els.append(t(f"f_val_{i}", VAL_X, y, VAL_W, ROW_H-2, 10, field=fld, size=FS, weight="500", color=VAL_COLOR))

    # ── Section 3: Contact Details ────────────────────────────────────────
    con_title_y = fam_y0 + len(family_rows) * ROW_H + 12
    els.append(t("sec3_title", 0, con_title_y, PAGE_W, 24, 10, content="संपर्क", size=13, weight="bold", color=HEADING_COLOR, align="center"))

    contact_rows = [
        ("पत्ता", "contactDetails.residenceAddress"),
        ("मो.नं.", "contactDetails.primaryContact"),
    ]

    con_y0 = con_title_y + 30
    for i, (lbl, fld) in enumerate(contact_rows):
        y = con_y0 + i * ROW_H
        els.append(t(f"c_lbl_{i}", LBL_X, y, LBL_W, ROW_H-2, 10, content=lbl, size=FS, weight="bold", color=LBL_COLOR))
        els.append(t(f"c_col_{i}", COLON_X, y, 16, ROW_H-2, 10, content=":", size=FS, weight="bold", color=LBL_COLOR, align="center"))
        els.append(t(f"c_val_{i}", VAL_X, y, VAL_W, ROW_H-2, 10, field=fld, size=FS, weight="500", color=VAL_COLOR))

    return {
        "page": {
            "width": PAGE_W, "height": PAGE_H, "background": BG, "backgroundType": "color",
            "padding": 40, "fontFamily": "Noto Sans Devanagari", "backgroundLocked": True,
            "missingDataBehavior": "hide", "safeArea": {"top": 40, "right": 40, "bottom": 40, "left": 40}
        },
        "elements": els
    }

db = SessionLocal()
try:
    tpl_id = "tpl_shubhpatrika_marathi_exact"
    db.query(TemplateCategory).filter(TemplateCategory.template_id == tpl_id).delete()
    db.query(TemplateVersion).filter(TemplateVersion.template_id == tpl_id).delete()
    existing = db.query(Template).filter(Template.id == tpl_id).first()
    if existing:
        db.delete(existing)
    db.commit()

    tpl = Template(
        id=tpl_id,
        name="ShubhPatrika Marathi Classic",
        slug="shubhpatrika-marathi-classic",
        description="Exact authentic Marathi matrimonial biodata layout with Ganesha blessing, double gold ornate borders, floral corner scrolls, and complete 3-section structured details.",
        pricing_type="PREMIUM",
        is_luxury=True,
        badge="PRO",
        preview_icon="🙏",
        default_accent="#C5A059",
        default_bg="#FAF4E8",
        font_family="Noto Sans Devanagari",
        layout_json=make_shubhpatrika_exact_template(),
        status="PUBLISHED",
        version=1,
    )
    db.add(tpl)
    db.commit()
    print("Exact ShubhPatrika template seeded successfully!")
except Exception as e:
    db.rollback()
    print(f"Error: {e}")
    import traceback; traceback.print_exc()
finally:
    db.close()
