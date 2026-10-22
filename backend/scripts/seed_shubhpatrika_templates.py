"""
Seed script: delete all existing templates, then create 8 ShubhPatrika-style
biodata templates inspired by the marriage-biodata-maker screenshots.
"""
import sys, os, json
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db.base import SessionLocal
from models.template import Template, TemplateCategory, TemplateVersion, Favorite

def make_layout(bg_color, accent, heading_color, divider_color):
    PAGE_W, PAGE_H = 794, 1123
    LBL_X, VAL_X = 50, 280
    LBL_W, VAL_W = 220, 420
    ROW_H, FIELD_FS = 28, 11
    LBL_COLOR, VAL_COLOR = "#555555", "#111111"

    def text_el(id_, x, y, w, h, zi, content="", field="", size=11, weight="500", color="#111", align="left"):
        e = {"id": id_, "type": "text", "x": x, "y": y, "width": w, "height": h, "zIndex": zi,
             "style": {"fontSize": size, "fontWeight": weight, "color": color, "textAlign": align, "lineHeight": 1.4}}
        if content: e["content"] = content
        if field: e["fieldBinding"] = field
        return e

    elements = [
        {"id": "border_outer", "type": "shape", "shapeType": "rectangle",
         "x": 18, "y": 18, "width": PAGE_W-36, "height": PAGE_H-36, "zIndex": 0,
         "style": {"backgroundColor": "transparent", "border": f"4px solid {accent}"}},
        {"id": "border_inner", "type": "shape", "shapeType": "rectangle",
         "x": 28, "y": 28, "width": PAGE_W-56, "height": PAGE_H-56, "zIndex": 0,
         "style": {"backgroundColor": "transparent", "border": f"1.5px solid {accent}"}},
        text_el("deity", 0, 42, PAGE_W, 26, 10, content="|| Shri Ganeshay Namah: ||",
                size=14, weight="bold", color=heading_color, align="center"),
        text_el("title", 0, 70, PAGE_W, 24, 10, content="वैयक्तिक माहिती",
                size=13, weight="600", color=heading_color, align="center"),
        {"id": "div_top", "type": "divider", "x": 50, "y": 100, "width": PAGE_W-100, "height": 2, "zIndex": 5,
         "style": {"backgroundColor": divider_color}},
        {"id": "photo", "type": "image", "x": 590, "y": 115, "width": 150, "height": 170, "zIndex": 10,
         "fieldBinding": "personalDetails.photoUrl", "shapeType": "rounded",
         "style": {"objectFit": "cover", "border": f"3px solid {accent}", "borderRadius": "8px", "backgroundColor": "#f0ede8"}},
    ]

    personal = [
        ("नाव","personalDetails.fullName"),("जन्म तारीख","personalDetails.dateOfBirth"),
        ("जन्म वेळ","personalDetails.timeOfBirth"),("जन्म स्थळ","personalDetails.placeOfBirth"),
        ("धर्म","personalDetails.religion"),("जात","personalDetails.caste"),
        ("राशी","personalDetails.rashi"),("नक्षत्र","personalDetails.nakshatra"),
        ("गोत्र","personalDetails.gotra"),("उंची","personalDetails.height"),
        ("वजन","personalDetails.weight"),("रंग","personalDetails.complexion"),
        ("वैवाहिक स्थिती","personalDetails.maritalStatus"),("रक्त गट","personalDetails.bloodGroup"),
    ]
    y0 = 115
    for i,(lbl,fld) in enumerate(personal):
        y = y0+i*ROW_H
        elements += [
            text_el(f"pl{i}",LBL_X,y,LBL_W,ROW_H-2,15,content=lbl,size=FIELD_FS,weight="600",color=LBL_COLOR),
            text_el(f"pc{i}",LBL_X+LBL_W-10,y,20,ROW_H-2,15,content=":",size=FIELD_FS,weight="600",color=LBL_COLOR,align="center"),
            text_el(f"pv{i}",VAL_X,y,VAL_W,ROW_H-2,15,field=fld,size=FIELD_FS,weight="500",color=VAL_COLOR),
        ]

    edu_y = y0+len(personal)*ROW_H+10
    elements += [
        {"id":"div_edu","type":"divider","x":50,"y":edu_y,"width":PAGE_W-100,"height":1.5,"zIndex":5,"style":{"backgroundColor":divider_color}},
        text_el("sec_edu",0,edu_y+4,PAGE_W,24,10,content="शैक्षणिक व व्यावसायिक माहिती",size=12,weight="bold",color=heading_color,align="center"),
    ]
    edu = [("शिक्षण","educationOccupation.education"),("नोकरी/व्यवसाय","educationOccupation.occupation"),
           ("कंपनी","educationOccupation.companyName"),("वेतन/उत्पन्न","educationOccupation.annualIncome"),
           ("कामाचे ठिकाण","educationOccupation.workLocation")]
    for i,(lbl,fld) in enumerate(edu):
        y = edu_y+28+i*ROW_H
        elements += [
            text_el(f"el{i}",LBL_X,y,LBL_W,ROW_H-2,15,content=lbl,size=FIELD_FS,weight="600",color=LBL_COLOR),
            text_el(f"ec{i}",LBL_X+LBL_W-10,y,20,ROW_H-2,15,content=":",size=FIELD_FS,weight="600",color=LBL_COLOR,align="center"),
            text_el(f"ev{i}",VAL_X,y,VAL_W,ROW_H-2,15,field=fld,size=FIELD_FS,weight="500",color=VAL_COLOR),
        ]

    fam_y = edu_y+28+len(edu)*ROW_H+10
    elements += [
        {"id":"div_fam","type":"divider","x":50,"y":fam_y,"width":PAGE_W-100,"height":1.5,"zIndex":5,"style":{"backgroundColor":divider_color}},
        text_el("sec_fam",0,fam_y+4,PAGE_W,24,10,content="कौटुंबिक माहिती",size=12,weight="bold",color=heading_color,align="center"),
    ]
    fam = [("वडिलांचे नाव","familyDetails.fatherName"),("वडिलांचा व्यवसाय","familyDetails.fatherOccupation"),
           ("आईचे नाव","familyDetails.motherName"),("आईचा व्यवसाय","familyDetails.motherOccupation"),
           ("भाऊ","familyDetails.brothers"),("बहिण","familyDetails.sisters"),
           ("कुटुंब प्रकार","familyDetails.familyType"),("मूळ गाव","familyDetails.nativePlace")]
    for i,(lbl,fld) in enumerate(fam):
        y = fam_y+28+i*ROW_H
        elements += [
            text_el(f"fl{i}",LBL_X,y,LBL_W,ROW_H-2,15,content=lbl,size=FIELD_FS,weight="600",color=LBL_COLOR),
            text_el(f"fc{i}",LBL_X+LBL_W-10,y,20,ROW_H-2,15,content=":",size=FIELD_FS,weight="600",color=LBL_COLOR,align="center"),
            text_el(f"fv{i}",VAL_X,y,VAL_W,ROW_H-2,15,field=fld,size=FIELD_FS,weight="500",color=VAL_COLOR),
        ]

    con_y = fam_y+28+len(fam)*ROW_H+10
    elements += [
        {"id":"div_con","type":"divider","x":50,"y":con_y,"width":PAGE_W-100,"height":1.5,"zIndex":5,"style":{"backgroundColor":divider_color}},
        text_el("sec_con",0,con_y+4,PAGE_W,24,10,content="संपर्क",size=12,weight="bold",color=heading_color,align="center"),
        text_el("con_lbl0",LBL_X,con_y+28,LBL_W,ROW_H-2,15,content="दूरध्वनी",size=FIELD_FS,weight="600",color=LBL_COLOR),
        text_el("con_c0",LBL_X+LBL_W-10,con_y+28,20,ROW_H-2,15,content=":",size=FIELD_FS,weight="600",color=LBL_COLOR,align="center"),
        text_el("con_val0",VAL_X,con_y+28,VAL_W,ROW_H-2,15,field="contactDetails.primaryContact",size=FIELD_FS,weight="500",color=VAL_COLOR),
        text_el("con_lbl1",LBL_X,con_y+56,LBL_W,ROW_H-2,15,content="पत्ता",size=FIELD_FS,weight="600",color=LBL_COLOR),
        text_el("con_c1",LBL_X+LBL_W-10,con_y+56,20,ROW_H-2,15,content=":",size=FIELD_FS,weight="600",color=LBL_COLOR,align="center"),
        text_el("con_val1",VAL_X,con_y+56,VAL_W,ROW_H-2,15,field="contactDetails.residenceAddress",size=FIELD_FS,weight="500",color=VAL_COLOR),
    ]

    return {
        "page": {"width":PAGE_W,"height":PAGE_H,"background":bg_color,"backgroundType":"color",
                 "padding":40,"fontFamily":"Noto Sans Devanagari","backgroundLocked":True,
                 "missingDataBehavior":"hide","safeArea":{"top":40,"right":40,"bottom":40,"left":40}},
        "elements": elements
    }

TEMPLATES = [
    {"id":"tpl_purple_floral","name":"Purple Floral Classic","slug":"purple-floral-classic",
     "desc":"Elegant purple floral design with ornate border. Traditional Indian style.",
     "pricing":"FREE","badge":"Popular","icon":"🌸","accent":"#8B2FC9","bg":"#FAF4FF",
     "font":"Noto Sans Devanagari","hc":"#5b21b6","dc":"#8B2FC9"},
    {"id":"tpl_gold_parchment","name":"Gold Parchment Classic","slug":"gold-parchment-classic",
     "desc":"Timeless gold and beige parchment design with decorative corners.",
     "pricing":"FREE","badge":"Traditional","icon":"📜","accent":"#B45309","bg":"#FDF8F0",
     "font":"Noto Sans Devanagari","hc":"#92400E","dc":"#D97706"},
    {"id":"tpl_red_border","name":"Royal Red Border","slug":"royal-red-border",
     "desc":"Bold red border with clean white background. Vibrant matrimonial design.",
     "pricing":"FREE","badge":"Vibrant","icon":"🔴","accent":"#DC2626","bg":"#FFFFFF",
     "font":"Noto Sans Devanagari","hc":"#991B1B","dc":"#DC2626"},
    {"id":"tpl_ornate_elephant","name":"Ornate Elephant Arch","slug":"ornate-elephant-arch",
     "desc":"Premium design with ornate elephant arch border. Traditional Rajasthani style.",
     "pricing":"PREMIUM","badge":"Luxury","icon":"🐘","accent":"#7C3AED","bg":"#FFF8F0",
     "font":"Noto Sans Devanagari","hc":"#5B21B6","dc":"#C4B5FD"},
    {"id":"tpl_dark_purple","name":"Deep Violet Royal","slug":"deep-violet-royal",
     "desc":"Stunning dark purple background with golden accent text. Premium royal design.",
     "pricing":"PREMIUM","badge":"Premium","icon":"👑","accent":"#F59E0B","bg":"#1E0A3C",
     "font":"Noto Sans Devanagari","hc":"#FCD34D","dc":"#F59E0B"},
    {"id":"tpl_dark_olive","name":"Antique Olive Gold","slug":"antique-olive-gold",
     "desc":"Antique olive-gold dark background with golden dot border. Classic Mughal style.",
     "pricing":"PREMIUM","badge":"Antique","icon":"🌿","accent":"#D97706","bg":"#1C1A0E",
     "font":"Noto Sans Devanagari","hc":"#FDE68A","dc":"#F59E0B"},
    {"id":"tpl_teal_fresh","name":"Teal Mint Modern","slug":"teal-mint-modern",
     "desc":"Fresh teal and white design with minimal border. Modern and clean style.",
     "pricing":"FREE","badge":"Modern","icon":"🌊","accent":"#0D9488","bg":"#F0FDFA",
     "font":"Noto Sans Devanagari","hc":"#0F766E","dc":"#14B8A6"},
    {"id":"tpl_mandala_gold","name":"Gold Mandala Luxury","slug":"gold-mandala-luxury",
     "desc":"Luxurious gold mandala parchment with intricate ornamental patterns.",
     "pricing":"PREMIUM","badge":"Best","icon":"✨","accent":"#B45309","bg":"#FFFBEB",
     "font":"Noto Sans Devanagari","hc":"#78350F","dc":"#D97706"},
]

db = SessionLocal()
try:
    print("Deleting all existing templates...")
    db.query(TemplateCategory).delete()
    db.query(TemplateVersion).delete()
    db.query(Favorite).delete()
    db.query(Template).delete()
    db.commit()
    print("All templates deleted.")

    print("Seeding 8 ShubhPatrika templates...")
    for t in TEMPLATES:
        layout = make_layout(t["bg"], t["accent"], t["hc"], t["dc"])
        tpl = Template(
            id=t["id"], name=t["name"], slug=t["slug"], description=t["desc"],
            pricing_type=t["pricing"], is_luxury=(t["pricing"]=="PREMIUM"),
            badge=t["badge"], preview_icon=t["icon"],
            default_accent=t["accent"], default_bg=t["bg"],
            font_family=t["font"], layout_json=layout,
            status="PUBLISHED", version=1,
        )
        db.add(tpl)
        print(f"  Created: {t['name']}")
    db.commit()
    print(f"\nDone! {len(TEMPLATES)} templates created.")
except Exception as e:
    db.rollback()
    print(f"ERROR: {e}")
    import traceback; traceback.print_exc()
finally:
    db.close()
