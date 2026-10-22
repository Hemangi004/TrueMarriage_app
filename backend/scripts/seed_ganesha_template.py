import sys, os
sys.path.insert(0, r"c:\Users\kayar\Desktop\New folder\matrimonial_Site")
from backend.db.session import SessionLocal
from backend.models.template import Template, TemplateCategory, TemplateVersion, Favorite

PAGE_W, PAGE_H = 794, 1123

def t(id_, x, y, w, h, zi, content="", field="", size=11, weight="500", color="#222", align="left", italic=False):
    e = {"id": id_, "type": "text", "x": x, "y": y, "width": w, "height": h, "zIndex": zi,
         "style": {"fontSize": size, "fontWeight": weight, "color": color, "textAlign": align,
                   "lineHeight": 1.45, "fontStyle": "italic" if italic else "normal"}}
    if content: e["content"] = content
    if field: e["fieldBinding"] = field
    return e

def div(id_, x, y, w, zi, color="#C8A96E"):
    return {"id": id_, "type": "divider", "x": x, "y": y, "width": w, "height": 1.5, "zIndex": zi,
            "style": {"backgroundColor": color}}

def make_ganesha_template():
    els = []
    BG = "#FEF6E8"
    ACCENT = "#C8A96E"
    HEADING = "#7B3F00"
    LC, VC = "#5C3D11", "#222222"
    LBL_X, VAL_X = 50, 260
    LBL_W, VAL_W = 200, 450
    ROW = 27
    FS = 11

    # Corner decorations (floral scroll)
    for corner_id, cx, cy, rot in [("c_tl",18,18,0),("c_tr",PAGE_W-118,18,90),("c_bl",18,PAGE_H-118,270),("c_br",PAGE_W-118,PAGE_H-118,180)]:
        els.append({"id":corner_id,"type":"decoration","decorationKey":"floral_corner","x":cx,"y":cy,"width":100,"height":100,"zIndex":1,"rotation":rot,"style":{"color":ACCENT,"opacity":0.55}})

    # Outer border
    els.append({"id":"bdr1","type":"shape","shapeType":"rectangle","x":18,"y":18,"width":PAGE_W-36,"height":PAGE_H-36,"zIndex":0,"style":{"backgroundColor":"transparent","border":f"3px solid {ACCENT}"}})
    els.append({"id":"bdr2","type":"shape","shapeType":"rectangle","x":26,"y":26,"width":PAGE_W-52,"height":PAGE_H-52,"zIndex":0,"style":{"backgroundColor":"transparent","border":f"1px solid {ACCENT}","opacity":0.6}})

    # Watermark text (background)
    for i, wx in enumerate([80, 320, 560]):
        for j, wy in enumerate([200, 450, 700, 950]):
            els.append(t(f"wm_{i}_{j}", wx, wy, 200, 50, 1, content="शुभ पत्रिका", size=22, weight="bold", color=ACCENT, align="center", italic=True))

    # Ganesha emoji image area (top center)
    els.append({"id":"ganesha_img","type":"image","x":330,"y":38,"width":134,"height":70,"zIndex":15,
                "fieldBinding":"pageHeader.ganeshaIcon",
                "style":{"objectFit":"contain","backgroundColor":"transparent"}})
    # Fallback: deity text if no image
    els.append(t("deity_text", 0, 42, PAGE_W, 30, 12, content="🙏", size=36, weight="bold", color=HEADING, align="center"))

    # Main heading
    els.append(t("heading1", 0, 88, PAGE_W, 28, 15, content="|| श्री गणेशाय नमः ||", size=16, weight="bold", color=HEADING, align="center"))
    els.append(t("heading2", 0, 116, PAGE_W, 22, 15, content="वैयक्तिक माहिती", size=13, weight="600", color=HEADING, align="center"))
    els.append(div("divh", 60, 142, PAGE_W-120, 15, ACCENT))

    # Photo frame
    els.append({"id":"photo","type":"image","x":600,"y":152,"width":140,"height":165,"zIndex":20,
                "fieldBinding":"personalDetails.photoUrl","shapeType":"rounded",
                "style":{"objectFit":"cover","border":f"2px solid {ACCENT}","borderRadius":"6px","backgroundColor":"#f5e8d0"}})

    # Personal details
    personal = [
        ("नाव","personalDetails.fullName"),
        ("जन्म तारीख","personalDetails.dateOfBirth"),
        ("जन्म वेळ","personalDetails.timeOfBirth"),
        ("जन्म स्थळ","personalDetails.placeOfBirth"),
        ("धर्म","personalDetails.religion"),
        ("जात","personalDetails.caste"),
        ("कुलदेवत","personalDetails.kuldaivat"),
        ("गोत्र","personalDetails.gotra"),
        ("राशी","personalDetails.rashi"),
        ("नक्षत्र","personalDetails.nakshatra"),
        ("गण","personalDetails.gan"),
        ("नाडी","personalDetails.nadi"),
        ("उंची","personalDetails.height"),
        ("वर्ण","personalDetails.complexion"),
        ("रक्तगट","personalDetails.bloodGroup"),
        ("शिक्षण","educationOccupation.education"),
        ("नोकरी/व्यवसाय","educationOccupation.occupation"),
        ("वेतन/उत्पन्न","educationOccupation.annualIncome"),
    ]
    y0 = 152
    for i,(lbl,fld) in enumerate(personal):
        y = y0 + i*ROW
        els += [
            t(f"pl{i}",LBL_X,y,LBL_W,ROW-2,20,content=lbl,size=FS,weight="600",color=LC),
            t(f"pc{i}",LBL_X+LBL_W-2,y,18,ROW-2,20,content=":",size=FS,weight="600",color=LC,align="center"),
            t(f"pv{i}",VAL_X,y,VAL_W,ROW-2,20,field=fld,size=FS,weight="500",color=VC),
        ]

    fam_y = y0 + len(personal)*ROW + 14
    els += [
        div("divfam", 60, fam_y, PAGE_W-120, 15, ACCENT),
        t("sec_fam",0,fam_y+5,PAGE_W,24,15,content="कौटुंबिक माहिती",size=13,weight="bold",color=HEADING,align="center"),
        div("divfam2",60,fam_y+32,PAGE_W-120,15,ACCENT),
    ]
    family = [
        ("वडिलांचे नाव","familyDetails.fatherName"),
        ("वडिलांचा व्यवसाय","familyDetails.fatherOccupation"),
        ("आईचे नाव","familyDetails.motherName"),
        ("बहीण","familyDetails.sisters"),
        ("भाऊ","familyDetails.brothers"),
        ("मामा","familyDetails.mama"),
        ("नातेसंबंध","familyDetails.natesambandh"),
    ]
    for i,(lbl,fld) in enumerate(family):
        y = fam_y+38+i*ROW
        els += [
            t(f"fl{i}",LBL_X,y,LBL_W,ROW-2,20,content=lbl,size=FS,weight="600",color=LC),
            t(f"fc{i}",LBL_X+LBL_W-2,y,18,ROW-2,20,content=":",size=FS,weight="600",color=LC,align="center"),
            t(f"fv{i}",VAL_X,y,VAL_W,ROW-2,20,field=fld,size=FS,weight="500",color=VC),
        ]

    con_y = fam_y+38+len(family)*ROW+14
    els += [
        div("divcon",60,con_y,PAGE_W-120,15,ACCENT),
        t("sec_con",0,con_y+5,PAGE_W,24,15,content="संपर्क",size=13,weight="bold",color=HEADING,align="center"),
        div("divcon2",60,con_y+32,PAGE_W-120,15,ACCENT),
    ]
    contact = [
        ("पत्ता","contactDetails.residenceAddress"),
        ("मो.नं.","contactDetails.primaryContact"),
    ]
    for i,(lbl,fld) in enumerate(contact):
        y=con_y+38+i*ROW
        els += [
            t(f"cl{i}",LBL_X,y,LBL_W,ROW-2,20,content=lbl,size=FS,weight="600",color=LC),
            t(f"cc{i}",LBL_X+LBL_W-2,y,18,ROW-2,20,content=":",size=FS,weight="600",color=LC,align="center"),
            t(f"cv{i}",VAL_X,y,VAL_W,ROW-2,20,field=fld,size=FS,weight="500",color=VC),
        ]

    # Set all watermark opacity
    for el in els:
        if el.get("id","").startswith("wm_"):
            el["style"]["opacity"] = 0.09

    return {
        "page": {"width":PAGE_W,"height":PAGE_H,"background":BG,"backgroundType":"color","padding":40,
                 "fontFamily":"Noto Sans Devanagari","backgroundLocked":True,
                 "missingDataBehavior":"hide","safeArea":{"top":40,"right":40,"bottom":40,"left":40}},
        "elements": els
    }

db = SessionLocal()
try:
    # Remove existing ganesha template if exists
    db.query(TemplateCategory).filter(TemplateCategory.template_id=="tpl_ganesha_traditional").delete()
    db.query(TemplateVersion).filter(TemplateVersion.template_id=="tpl_ganesha_traditional").delete()
    old = db.query(Template).filter(Template.id=="tpl_ganesha_traditional").first()
    if old: db.delete(old)
    db.commit()

    tpl = Template(
        id="tpl_ganesha_traditional",
        name="Ganesha Traditional Marathi",
        slug="ganesha-traditional-marathi",
        description="Classic Marathi matrimonial biodata with Ganesha blessing, floral corner scrolls, and gold decorative borders. Exactly like ShubhPatrika style.",
        pricing_type="PREMIUM",
        is_luxury=True,
        badge="Bestseller",
        preview_icon="🙏",
        default_accent="#C8A96E",
        default_bg="#FEF6E8",
        font_family="Noto Sans Devanagari",
        layout_json=make_ganesha_template(),
        status="PUBLISHED",
        version=1,
    )
    db.add(tpl)
    db.commit()
    print("Ganesha Traditional template created!")
except Exception as e:
    db.rollback()
    print(f"ERROR: {e}")
    import traceback; traceback.print_exc()
finally:
    db.close()
