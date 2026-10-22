import sys, os, json
# Run from the parent of backend/ so imports work
sys.path.insert(0, r"c:\Users\kayar\Desktop\New folder\matrimonial_Site")

from backend.db.session import SessionLocal
from backend.models.template import Template, TemplateCategory, TemplateVersion, Favorite

PAGE_W, PAGE_H = 794, 1123
LBL_X, VAL_X = 50, 280
LBL_W, VAL_W = 220, 420
ROW_H, FIELD_FS = 28, 11

def t(id_, x, y, w, h, zi, content="", field="", size=11, weight="500", color="#111", align="left"):
    e = {"id": id_, "type": "text", "x": x, "y": y, "width": w, "height": h, "zIndex": zi,
         "style": {"fontSize": size, "fontWeight": weight, "color": color, "textAlign": align, "lineHeight": 1.4}}
    if content: e["content"] = content
    if field: e["fieldBinding"] = field
    return e

def make_layout(bg, accent, hc, dc):
    LC, VC = "#555555", "#111111"
    els = [
        {"id":"bdr1","type":"shape","shapeType":"rectangle","x":18,"y":18,"width":PAGE_W-36,"height":PAGE_H-36,"zIndex":0,"style":{"backgroundColor":"transparent","border":f"4px solid {accent}"}},
        {"id":"bdr2","type":"shape","shapeType":"rectangle","x":28,"y":28,"width":PAGE_W-56,"height":PAGE_H-56,"zIndex":0,"style":{"backgroundColor":"transparent","border":f"1.5px solid {accent}"}},
        t("deity",0,42,PAGE_W,26,10,content="|| Shri Ganeshay Namah: ||",size=14,weight="bold",color=hc,align="center"),
        t("title",0,70,PAGE_W,24,10,content="वैयक्तिक माहिती",size=13,weight="600",color=hc,align="center"),
        {"id":"div0","type":"divider","x":50,"y":100,"width":PAGE_W-100,"height":2,"zIndex":5,"style":{"backgroundColor":dc}},
        {"id":"photo","type":"image","x":590,"y":115,"width":150,"height":170,"zIndex":10,"fieldBinding":"personalDetails.photoUrl","shapeType":"rounded","style":{"objectFit":"cover","border":f"3px solid {accent}","borderRadius":"8px","backgroundColor":"#f0ede8"}},
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
    y0=115
    for i,(lbl,fld) in enumerate(personal):
        y=y0+i*ROW_H
        els+=[t(f"pl{i}",LBL_X,y,LBL_W,ROW_H-2,15,content=lbl,size=FIELD_FS,weight="600",color=LC),
              t(f"pc{i}",LBL_X+LBL_W-10,y,20,ROW_H-2,15,content=":",size=FIELD_FS,weight="600",color=LC,align="center"),
              t(f"pv{i}",VAL_X,y,VAL_W,ROW_H-2,15,field=fld,size=FIELD_FS,weight="500",color=VC)]

    edu_y=y0+len(personal)*ROW_H+10
    els+=[{"id":"div1","type":"divider","x":50,"y":edu_y,"width":PAGE_W-100,"height":1.5,"zIndex":5,"style":{"backgroundColor":dc}},
          t("sec_edu",0,edu_y+4,PAGE_W,24,10,content="शैक्षणिक व व्यावसायिक माहिती",size=12,weight="bold",color=hc,align="center")]
    edu=[("शिक्षण","educationOccupation.education"),("नोकरी/व्यवसाय","educationOccupation.occupation"),
         ("कंपनी","educationOccupation.companyName"),("वेतन/उत्पन्न","educationOccupation.annualIncome"),("कामाचे ठिकाण","educationOccupation.workLocation")]
    for i,(lbl,fld) in enumerate(edu):
        y=edu_y+28+i*ROW_H
        els+=[t(f"el{i}",LBL_X,y,LBL_W,ROW_H-2,15,content=lbl,size=FIELD_FS,weight="600",color=LC),
              t(f"ec{i}",LBL_X+LBL_W-10,y,20,ROW_H-2,15,content=":",size=FIELD_FS,weight="600",color=LC,align="center"),
              t(f"ev{i}",VAL_X,y,VAL_W,ROW_H-2,15,field=fld,size=FIELD_FS,weight="500",color=VC)]

    fam_y=edu_y+28+len(edu)*ROW_H+10
    els+=[{"id":"div2","type":"divider","x":50,"y":fam_y,"width":PAGE_W-100,"height":1.5,"zIndex":5,"style":{"backgroundColor":dc}},
          t("sec_fam",0,fam_y+4,PAGE_W,24,10,content="कौटुंबिक माहिती",size=12,weight="bold",color=hc,align="center")]
    fam=[("वडिलांचे नाव","familyDetails.fatherName"),("वडिलांचा व्यवसाय","familyDetails.fatherOccupation"),
         ("आईचे नाव","familyDetails.motherName"),("आईचा व्यवसाय","familyDetails.motherOccupation"),
         ("भाऊ","familyDetails.brothers"),("बहिण","familyDetails.sisters"),
         ("कुटुंब प्रकार","familyDetails.familyType"),("मूळ गाव","familyDetails.nativePlace")]
    for i,(lbl,fld) in enumerate(fam):
        y=fam_y+28+i*ROW_H
        els+=[t(f"fl{i}",LBL_X,y,LBL_W,ROW_H-2,15,content=lbl,size=FIELD_FS,weight="600",color=LC),
              t(f"fc{i}",LBL_X+LBL_W-10,y,20,ROW_H-2,15,content=":",size=FIELD_FS,weight="600",color=LC,align="center"),
              t(f"fv{i}",VAL_X,y,VAL_W,ROW_H-2,15,field=fld,size=FIELD_FS,weight="500",color=VC)]

    con_y=fam_y+28+len(fam)*ROW_H+10
    els+=[{"id":"div3","type":"divider","x":50,"y":con_y,"width":PAGE_W-100,"height":1.5,"zIndex":5,"style":{"backgroundColor":dc}},
          t("sec_con",0,con_y+4,PAGE_W,24,10,content="संपर्क",size=12,weight="bold",color=hc,align="center"),
          t("c0l",LBL_X,con_y+28,LBL_W,ROW_H-2,15,content="दूरध्वनी",size=FIELD_FS,weight="600",color=LC),
          t("c0c",LBL_X+LBL_W-10,con_y+28,20,ROW_H-2,15,content=":",size=FIELD_FS,weight="600",color=LC,align="center"),
          t("c0v",VAL_X,con_y+28,VAL_W,ROW_H-2,15,field="contactDetails.primaryContact",size=FIELD_FS,weight="500",color=VC),
          t("c1l",LBL_X,con_y+56,LBL_W,ROW_H-2,15,content="पत्ता",size=FIELD_FS,weight="600",color=LC),
          t("c1c",LBL_X+LBL_W-10,con_y+56,20,ROW_H-2,15,content=":",size=FIELD_FS,weight="600",color=LC,align="center"),
          t("c1v",VAL_X,con_y+56,VAL_W,ROW_H-2,15,field="contactDetails.residenceAddress",size=FIELD_FS,weight="500",color=VC)]

    return {"page":{"width":PAGE_W,"height":PAGE_H,"background":bg,"backgroundType":"color","padding":40,
                    "fontFamily":"Noto Sans Devanagari","backgroundLocked":True,"missingDataBehavior":"hide",
                    "safeArea":{"top":40,"right":40,"bottom":40,"left":40}},"elements":els}

TEMPLATES=[
    {"id":"tpl_purple_floral","name":"Purple Floral Classic","slug":"purple-floral-classic","desc":"Elegant purple floral design with ornate border. Traditional Indian matrimonial style.","pricing":"FREE","badge":"Popular","icon":"🌸","accent":"#8B2FC9","bg":"#FAF4FF","font":"Noto Sans Devanagari","hc":"#5b21b6","dc":"#8B2FC9"},
    {"id":"tpl_gold_parchment","name":"Gold Parchment Classic","slug":"gold-parchment-classic","desc":"Timeless gold and beige parchment design with decorative corners. Perfect for traditional ceremonies.","pricing":"FREE","badge":"Traditional","icon":"📜","accent":"#B45309","bg":"#FDF8F0","font":"Noto Sans Devanagari","hc":"#92400E","dc":"#D97706"},
    {"id":"tpl_red_border","name":"Royal Red Border","slug":"royal-red-border","desc":"Bold red border with clean white background. Vibrant and modern matrimonial design.","pricing":"FREE","badge":"Vibrant","icon":"🔴","accent":"#DC2626","bg":"#FFFFFF","font":"Noto Sans Devanagari","hc":"#991B1B","dc":"#DC2626"},
    {"id":"tpl_ornate_elephant","name":"Ornate Elephant Arch","slug":"ornate-elephant-arch","desc":"Premium design with ornate elephant arch border. Traditional Rajasthani style.","pricing":"PREMIUM","badge":"Luxury","icon":"🐘","accent":"#7C3AED","bg":"#FFF8F0","font":"Noto Sans Devanagari","hc":"#5B21B6","dc":"#C4B5FD"},
    {"id":"tpl_dark_purple","name":"Deep Violet Royal","slug":"deep-violet-royal","desc":"Stunning dark purple background with golden accent text. Premium royal matrimonial design.","pricing":"PREMIUM","badge":"Premium","icon":"👑","accent":"#F59E0B","bg":"#1E0A3C","font":"Noto Sans Devanagari","hc":"#FCD34D","dc":"#F59E0B"},
    {"id":"tpl_dark_olive","name":"Antique Olive Gold","slug":"antique-olive-gold","desc":"Antique olive-gold dark background with golden dot border. Classic Mughal-style matrimonial biodata.","pricing":"PREMIUM","badge":"Antique","icon":"🌿","accent":"#D97706","bg":"#1C1A0E","font":"Noto Sans Devanagari","hc":"#FDE68A","dc":"#F59E0B"},
    {"id":"tpl_teal_fresh","name":"Teal Mint Modern","slug":"teal-mint-modern","desc":"Fresh teal and white design with minimal border. Modern and clean matrimonial biodata style.","pricing":"FREE","badge":"Modern","icon":"🌊","accent":"#0D9488","bg":"#F0FDFA","font":"Noto Sans Devanagari","hc":"#0F766E","dc":"#14B8A6"},
    {"id":"tpl_mandala_gold","name":"Gold Mandala Luxury","slug":"gold-mandala-luxury","desc":"Luxurious gold mandala parchment with intricate ornamental patterns. The most premium Indian design.","pricing":"PREMIUM","badge":"Best","icon":"✨","accent":"#B45309","bg":"#FFFBEB","font":"Noto Sans Devanagari","hc":"#78350F","dc":"#D97706"},
]

db=SessionLocal()
try:
    print("Deleting all existing templates...")
    db.query(TemplateCategory).delete()
    db.query(TemplateVersion).delete()
    db.query(Favorite).delete()
    db.query(Template).delete()
    db.commit()
    print("All templates deleted.")
    for t_def in TEMPLATES:
        layout=make_layout(t_def["bg"],t_def["accent"],t_def["hc"],t_def["dc"])
        tpl=Template(id=t_def["id"],name=t_def["name"],slug=t_def["slug"],description=t_def["desc"],
                     pricing_type=t_def["pricing"],is_luxury=(t_def["pricing"]=="PREMIUM"),
                     badge=t_def["badge"],preview_icon=t_def["icon"],
                     default_accent=t_def["accent"],default_bg=t_def["bg"],
                     font_family=t_def["font"],layout_json=layout,status="PUBLISHED",version=1)
        db.add(tpl)
        print(f"  Created: {t_def['name']}")
    db.commit()
    print(f"\nDone! {len(TEMPLATES)} templates seeded.")
except Exception as e:
    db.rollback()
    print(f"ERROR: {e}")
    import traceback; traceback.print_exc()
finally:
    db.close()
