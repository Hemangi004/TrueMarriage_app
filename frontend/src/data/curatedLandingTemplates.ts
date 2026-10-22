// Curated 10 Featured Templates for Landing Page
// Handpicked from Template Gallery catalog with diverse layout arrangements:
// - Center-Photo Layouts (#01 Alveria, #02 Prerna)
// - Left-Photo Layouts (#03 Traditional 2.0, #04 Sneh, #05 Nivaan)
// - Right-Photo Layouts (#06 The Golden Legacy, #07 Orlienne, #08 Majestic Heritage)
// - Minimalist & Text-Only Layouts (#09 Pure Details, #10 Minimal)

export const CURATED_LANDING_10_TEMPLATES: any[] = [
  {
    "id": "tpl_763d18c0",
    "name": "Alveria",
    "slug": "alveria",
    "pricing_type": "FREE",
    "badge": "#01",
    "dummy_index": 0,
    "thumbnail_image": "",
    "thumbnail_url": "",
    "default_bg": "#FFFFFF",
    "font_family": "Playfair Display",
    "preview_icon": "✨",
    "categories": [
      {
        "id": "floral",
        "name": "Floral",
        "slug": "floral",
        "icon": "🌸",
        "description": "Soft floral accents, vintage borders and pastel palettes.",
        "is_active": true,
        "display_order": 4
      },
      {
        "id": "luxury",
        "name": "Luxury",
        "slug": "luxury",
        "icon": "👑",
        "description": "Royal parchment, gold leaf borders & premium typography.",
        "is_active": true,
        "display_order": 3
      },
      {
        "id": "modern",
        "name": "Modern",
        "slug": "modern",
        "icon": "✨",
        "description": "Clean, minimal, modern aesthetic for contemporary profiles.",
        "is_active": true,
        "display_order": 2
      }
    ],
    "layout_json": {
      "page": {
        "width": 794,
        "height": 1123,
        "background": "#FFFFFF",
        "backgroundType": "image",
        "backgroundImage": "/static/backgrounds/bg_tpl_763d18c0.png",
        "backgroundFit": "cover",
        "backgroundLocked": true,
        "padding": 40,
        "safeArea": {
          "top": 55,
          "right": 40,
          "bottom": 55,
          "left": 40
        },
        "fontFamily": "Playfair Display",
        "selectedDummyIndex": 6
      },
      "elements": [
        {
          "id": "header_shloka",
          "type": "text",
          "content": "॥ श्री गणेशाय नमः ॥",
          "fieldBinding": "pageHeader.deity",
          "x": 100,
          "y": 50,
          "width": 594,
          "height": 28,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "bold",
            "color": "#8B0000",
            "textAlign": "center",
            "fontFamily": "serif"
          }
        },
        {
          "id": "heading_personal",
          "type": "text",
          "content": "वैयक्तिक माहिती",
          "x": 107,
          "y": 221,
          "width": 594,
          "height": 27,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "bold",
            "color": "#1E293B",
            "textAlign": "center",
            "fontFamily": "serif"
          }
        },
        {
          "id": "f_name",
          "type": "text",
          "content": "नाव",
          "x": 138,
          "y": 261,
          "width": 220,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_name",
          "type": "text",
          "content": ": {{personalDetails.fullName}}",
          "fieldBinding": "personalDetails.fullName",
          "x": 358,
          "y": 261,
          "width": 440,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "600",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_dob",
          "type": "text",
          "content": "जन्म तारीख",
          "x": 138,
          "y": 281,
          "width": 220,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_dob",
          "type": "text",
          "content": ": {{personalDetails.dateOfBirth}}",
          "fieldBinding": "personalDetails.dateOfBirth",
          "x": 358,
          "y": 281,
          "width": 440,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_tob",
          "type": "text",
          "content": "जन्म वेळ",
          "x": 138,
          "y": 301,
          "width": 220,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_tob",
          "type": "text",
          "content": ": {{personalDetails.timeOfBirth}}",
          "fieldBinding": "personalDetails.timeOfBirth",
          "x": 358,
          "y": 301,
          "width": 440,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_pob",
          "type": "text",
          "content": "जन्म स्थळ",
          "x": 138,
          "y": 341,
          "width": 220,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_pob",
          "type": "text",
          "content": ": {{personalDetails.placeOfBirth}}",
          "fieldBinding": "personalDetails.placeOfBirth",
          "x": 358,
          "y": 341,
          "width": 440,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_rel",
          "type": "text",
          "content": "धर्म",
          "x": 138,
          "y": 361,
          "width": 220,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_rel",
          "type": "text",
          "content": ": {{personalDetails.religion}}",
          "fieldBinding": "personalDetails.religion",
          "x": 358,
          "y": 361,
          "width": 440,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_caste",
          "type": "text",
          "content": "जात",
          "x": 138,
          "y": 381,
          "width": 220,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_caste",
          "type": "text",
          "content": ": {{personalDetails.caste}}",
          "fieldBinding": "personalDetails.caste",
          "x": 358,
          "y": 381,
          "width": 440,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_kul",
          "type": "text",
          "content": "कुलदैवत",
          "x": 138,
          "y": 401,
          "width": 220,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_kul",
          "type": "text",
          "content": ": {{personalDetails.kuldevata}}",
          "fieldBinding": "personalDetails.kuldevata",
          "x": 358,
          "y": 401,
          "width": 440,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_gotra",
          "type": "text",
          "content": "गोत्र",
          "x": 138,
          "y": 441,
          "width": 220,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_gotra",
          "type": "text",
          "content": ": {{personalDetails.gotra}}",
          "fieldBinding": "personalDetails.gotra",
          "x": 358,
          "y": 441,
          "width": 440,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_rashi",
          "type": "text",
          "content": "राशी",
          "x": 138,
          "y": 461,
          "width": 220,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_rashi",
          "type": "text",
          "content": ": {{personalDetails.rashi}}",
          "fieldBinding": "personalDetails.rashi",
          "x": 358,
          "y": 461,
          "width": 440,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_nakshatra",
          "type": "text",
          "content": "नक्षत्र",
          "x": 138,
          "y": 481,
          "width": 220,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_nakshatra",
          "type": "text",
          "content": ": {{personalDetails.nakshatra}}",
          "fieldBinding": "personalDetails.nakshatra",
          "x": 358,
          "y": 481,
          "width": 440,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_gan",
          "type": "text",
          "content": "गण",
          "x": 138,
          "y": 501,
          "width": 220,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_gan",
          "type": "text",
          "content": ": {{personalDetails.gan}}",
          "fieldBinding": "personalDetails.gan",
          "x": 358,
          "y": 501,
          "width": 440,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_nadi",
          "type": "text",
          "content": "नाडी",
          "x": 138,
          "y": 541,
          "width": 220,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_nadi",
          "type": "text",
          "content": ": {{personalDetails.nadi}}",
          "fieldBinding": "personalDetails.nadi",
          "x": 358,
          "y": 541,
          "width": 440,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_height",
          "type": "text",
          "content": "उंची",
          "x": 138,
          "y": 561,
          "width": 220,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_height",
          "type": "text",
          "content": ": {{personalDetails.height}}",
          "fieldBinding": "personalDetails.height",
          "x": 358,
          "y": 561,
          "width": 440,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_complexion",
          "type": "text",
          "content": "वर्ण",
          "x": 138,
          "y": 581,
          "width": 220,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_complexion",
          "type": "text",
          "content": ": {{personalDetails.complexion}}",
          "fieldBinding": "personalDetails.complexion",
          "x": 358,
          "y": 581,
          "width": 440,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_blood",
          "type": "text",
          "content": "रक्तगट",
          "x": 138,
          "y": 601,
          "width": 220,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_blood",
          "type": "text",
          "content": ": {{personalDetails.bloodGroup}}",
          "fieldBinding": "personalDetails.bloodGroup",
          "x": 358,
          "y": 601,
          "width": 440,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_edu",
          "type": "text",
          "content": "शिक्षण",
          "x": 138,
          "y": 641,
          "width": 220,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_edu",
          "type": "text",
          "content": ": {{educationOccupation.education}}",
          "fieldBinding": "educationOccupation.education",
          "x": 358,
          "y": 641,
          "width": 440,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_occ",
          "type": "text",
          "content": "नोकरी/व्यवसाय",
          "x": 138,
          "y": 661,
          "width": 220,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_occ",
          "type": "text",
          "content": ": {{educationOccupation.occupation}}",
          "fieldBinding": "educationOccupation.occupation",
          "x": 358,
          "y": 661,
          "width": 440,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_income",
          "type": "text",
          "content": "वेतन/उत्पन्न",
          "x": 138,
          "y": 681,
          "width": 220,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_income",
          "type": "text",
          "content": ": {{educationOccupation.annualIncome}}",
          "fieldBinding": "educationOccupation.annualIncome",
          "x": 358,
          "y": 681,
          "width": 440,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "heading_family",
          "type": "text",
          "content": "कौटुंबिक माहिती",
          "x": 100,
          "y": 720,
          "width": 594,
          "height": 27,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "bold",
            "color": "#1E293B",
            "textAlign": "center",
            "fontFamily": "serif"
          }
        },
        {
          "id": "f_fname",
          "type": "text",
          "content": "वडिलांचे नाव",
          "x": 138,
          "y": 761,
          "width": 220,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_fname",
          "type": "text",
          "content": ": {{familyDetails.fatherName}}",
          "fieldBinding": "familyDetails.fatherName",
          "x": 358,
          "y": 761,
          "width": 440,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_focc",
          "type": "text",
          "content": "वडिलांचा व्यवसाय",
          "x": 138,
          "y": 781,
          "width": 220,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_focc",
          "type": "text",
          "content": ": {{familyDetails.fatherOccupation}}",
          "fieldBinding": "familyDetails.fatherOccupation",
          "x": 358,
          "y": 781,
          "width": 440,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_mname",
          "type": "text",
          "content": "आईचे नाव",
          "x": 138,
          "y": 821,
          "width": 220,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_mname",
          "type": "text",
          "content": ": {{familyDetails.motherName}}",
          "fieldBinding": "familyDetails.motherName",
          "x": 358,
          "y": 821,
          "width": 440,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_sis",
          "type": "text",
          "content": "बहीण",
          "x": 138,
          "y": 841,
          "width": 220,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_sis",
          "type": "text",
          "content": ": {{familyDetails.sisters}}",
          "fieldBinding": "familyDetails.sisters",
          "x": 358,
          "y": 841,
          "width": 440,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_bro",
          "type": "text",
          "content": "भाऊ",
          "x": 138,
          "y": 861,
          "width": 220,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_bro",
          "type": "text",
          "content": ": {{familyDetails.brothers}}",
          "fieldBinding": "familyDetails.brothers",
          "x": 358,
          "y": 861,
          "width": 440,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_mama",
          "type": "text",
          "content": "मामा",
          "x": 138,
          "y": 881,
          "width": 220,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_mama",
          "type": "text",
          "content": ": {{familyDetails.maternalUncle}}",
          "fieldBinding": "familyDetails.maternalUncle",
          "x": 358,
          "y": 881,
          "width": 440,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_relatives",
          "type": "text",
          "content": "नातेसंबंध",
          "x": 138,
          "y": 921,
          "width": 220,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_relatives",
          "type": "text",
          "content": ": {{familyDetails.relations}}",
          "fieldBinding": "familyDetails.relations",
          "x": 358,
          "y": 921,
          "width": 440,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "heading_contact",
          "type": "text",
          "content": "संपर्क",
          "x": 92,
          "y": 960,
          "width": 594,
          "height": 27,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "bold",
            "color": "#1E293B",
            "textAlign": "center",
            "fontFamily": "serif"
          }
        },
        {
          "id": "f_address",
          "type": "text",
          "content": "पत्ता",
          "x": 138,
          "y": 1001,
          "width": 220,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_address",
          "type": "text",
          "content": ": {{contactDetails.residenceAddress}}",
          "fieldBinding": "contactDetails.residenceAddress",
          "x": 358,
          "y": 1001,
          "width": 440,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_phone",
          "type": "text",
          "content": "मो.नं.",
          "x": 137,
          "y": 1020,
          "width": 220,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_phone",
          "type": "text",
          "content": ": {{contactDetails.primaryContact}}",
          "fieldBinding": "contactDetails.primaryContact",
          "x": 353,
          "y": 1020,
          "width": 440,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "el_1787649890740_102",
          "type": "image",
          "content": "/sample_profiles/rahul.webp",
          "fieldBinding": "personalDetails.photoUrl",
          "shapeType": "circle",
          "x": 331,
          "y": 80,
          "width": 133,
          "height": 144,
          "zIndex": 59,
          "rotation": 0,
          "style": {
            "color": "#B45309",
            "textAlign": "left",
            "fontFamily": "Playfair Display",
            "borderRadius": "50%",
            "objectFit": "cover"
          }
        },
        {
          "id": "el_1787649930380_111",
          "type": "decoration",
          "decorationKey": "om",
          "x": 374,
          "y": 0,
          "width": 47,
          "height": 54,
          "zIndex": 60,
          "rotation": 0,
          "style": {
            "color": "#B45309",
            "textAlign": "left",
            "fontFamily": "Playfair Display",
            "borderRadius": "0px",
            "objectFit": "cover"
          }
        }
      ]
    }
  },
  {
    "id": "tpl_330c571c",
    "name": "Prerna",
    "slug": "prerna",
    "pricing_type": "FREE",
    "badge": "#02",
    "dummy_index": 1,
    "thumbnail_image": "",
    "thumbnail_url": "",
    "default_bg": "#FFFFFF",
    "font_family": "Playfair Display",
    "preview_icon": "🌸",
    "categories": [
      {
        "id": "traditional",
        "name": "Traditional",
        "slug": "traditional",
        "icon": "🚩",
        "description": "Classic Indian traditional designs with sacred motifs and shlokas.",
        "is_active": true,
        "display_order": 1
      }
    ],
    "layout_json": {
      "page": {
        "width": 794,
        "height": 1123,
        "background": "#FFFFFF",
        "backgroundType": "image",
        "backgroundImage": "/static/backgrounds/bg_tpl_330c571c.jpg",
        "backgroundFit": "cover",
        "backgroundLocked": true,
        "padding": 40,
        "safeArea": {
          "top": 55,
          "right": 40,
          "bottom": 55,
          "left": 40
        },
        "fontFamily": "Playfair Display"
      },
      "elements": [
        {
          "id": "header_shloka",
          "type": "text",
          "content": "॥ श्री गणेशाय नमः ॥",
          "fieldBinding": "pageHeader.deity",
          "x": 102,
          "y": 22,
          "width": 568,
          "height": 28,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#8B0000",
            "textAlign": "center",
            "fontFamily": "serif"
          }
        },
        {
          "id": "heading_personal",
          "type": "text",
          "content": "वैयक्तिक माहिती",
          "x": 113,
          "y": 235,
          "width": 568,
          "height": 28,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#1E293B",
            "textAlign": "center",
            "fontFamily": "serif"
          }
        },
        {
          "id": "f_name",
          "type": "text",
          "content": "नाव",
          "x": 113,
          "y": 270,
          "width": 194,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_name",
          "type": "text",
          "content": ": {{personalDetails.fullName}}",
          "fieldBinding": "personalDetails.fullName",
          "x": 338,
          "y": 270,
          "width": 414,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "600",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_dob",
          "type": "text",
          "content": "जन्म तारीख",
          "x": 113,
          "y": 295,
          "width": 194,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_dob",
          "type": "text",
          "content": ": {{personalDetails.dateOfBirth}}",
          "fieldBinding": "personalDetails.dateOfBirth",
          "x": 338,
          "y": 295,
          "width": 414,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_tob",
          "type": "text",
          "content": "जन्म वेळ",
          "x": 113,
          "y": 320,
          "width": 194,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_tob",
          "type": "text",
          "content": ": {{personalDetails.timeOfBirth}}",
          "fieldBinding": "personalDetails.timeOfBirth",
          "x": 338,
          "y": 320,
          "width": 414,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_pob",
          "type": "text",
          "content": "जन्म स्थळ",
          "x": 113,
          "y": 345,
          "width": 194,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_pob",
          "type": "text",
          "content": ": {{personalDetails.placeOfBirth}}",
          "fieldBinding": "personalDetails.placeOfBirth",
          "x": 338,
          "y": 345,
          "width": 414,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_rel",
          "type": "text",
          "content": "धर्म",
          "x": 113,
          "y": 370,
          "width": 194,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_rel",
          "type": "text",
          "content": ": {{personalDetails.religion}}",
          "fieldBinding": "personalDetails.religion",
          "x": 338,
          "y": 370,
          "width": 414,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_caste",
          "type": "text",
          "content": "जात",
          "x": 113,
          "y": 395,
          "width": 194,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_caste",
          "type": "text",
          "content": ": {{personalDetails.caste}}",
          "fieldBinding": "personalDetails.caste",
          "x": 338,
          "y": 395,
          "width": 414,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_kul",
          "type": "text",
          "content": "कुलदैवत",
          "x": 113,
          "y": 420,
          "width": 194,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_kul",
          "type": "text",
          "content": ": {{personalDetails.kuldevata}}",
          "fieldBinding": "personalDetails.kuldevata",
          "x": 338,
          "y": 420,
          "width": 414,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_gotra",
          "type": "text",
          "content": "गोत्र",
          "x": 113,
          "y": 445,
          "width": 194,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_gotra",
          "type": "text",
          "content": ": {{personalDetails.gotra}}",
          "fieldBinding": "personalDetails.gotra",
          "x": 338,
          "y": 445,
          "width": 414,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_rashi",
          "type": "text",
          "content": "राशी",
          "x": 113,
          "y": 470,
          "width": 194,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_rashi",
          "type": "text",
          "content": ": {{personalDetails.rashi}}",
          "fieldBinding": "personalDetails.rashi",
          "x": 338,
          "y": 470,
          "width": 414,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_nakshatra",
          "type": "text",
          "content": "नक्षत्र",
          "x": 113,
          "y": 495,
          "width": 194,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_nakshatra",
          "type": "text",
          "content": ": {{personalDetails.nakshatra}}",
          "fieldBinding": "personalDetails.nakshatra",
          "x": 338,
          "y": 495,
          "width": 414,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_gan",
          "type": "text",
          "content": "गण",
          "x": 113,
          "y": 520,
          "width": 194,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_gan",
          "type": "text",
          "content": ": {{personalDetails.gan}}",
          "fieldBinding": "personalDetails.gan",
          "x": 338,
          "y": 520,
          "width": 414,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_nadi",
          "type": "text",
          "content": "नाडी",
          "x": 113,
          "y": 545,
          "width": 194,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_nadi",
          "type": "text",
          "content": ": {{personalDetails.nadi}}",
          "fieldBinding": "personalDetails.nadi",
          "x": 338,
          "y": 545,
          "width": 414,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_height",
          "type": "text",
          "content": "उंची",
          "x": 113,
          "y": 570,
          "width": 194,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_height",
          "type": "text",
          "content": ": {{personalDetails.height}}",
          "fieldBinding": "personalDetails.height",
          "x": 338,
          "y": 570,
          "width": 414,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_complexion",
          "type": "text",
          "content": "वर्ण",
          "x": 113,
          "y": 595,
          "width": 194,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_complexion",
          "type": "text",
          "content": ": {{personalDetails.complexion}}",
          "fieldBinding": "personalDetails.complexion",
          "x": 338,
          "y": 595,
          "width": 414,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_blood",
          "type": "text",
          "content": "रक्तगट",
          "x": 113,
          "y": 620,
          "width": 194,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_blood",
          "type": "text",
          "content": ": {{personalDetails.bloodGroup}}",
          "fieldBinding": "personalDetails.bloodGroup",
          "x": 338,
          "y": 620,
          "width": 414,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_edu",
          "type": "text",
          "content": "शिक्षण",
          "x": 113,
          "y": 645,
          "width": 194,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_edu",
          "type": "text",
          "content": ": {{educationOccupation.education}}",
          "fieldBinding": "educationOccupation.education",
          "x": 338,
          "y": 645,
          "width": 414,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_occ",
          "type": "text",
          "content": "नोकरी/व्यवसाय",
          "x": 113,
          "y": 670,
          "width": 194,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_occ",
          "type": "text",
          "content": ": {{educationOccupation.occupation}}",
          "fieldBinding": "educationOccupation.occupation",
          "x": 338,
          "y": 670,
          "width": 414,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_income",
          "type": "text",
          "content": "वेतन/उत्पन्न",
          "x": 113,
          "y": 695,
          "width": 194,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_income",
          "type": "text",
          "content": ": {{educationOccupation.annualIncome}}",
          "fieldBinding": "educationOccupation.annualIncome",
          "x": 338,
          "y": 695,
          "width": 414,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "heading_family",
          "type": "text",
          "content": "कौटुंबिक माहिती",
          "x": 102,
          "y": 737,
          "width": 568,
          "height": 28,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#1E293B",
            "textAlign": "center",
            "fontFamily": "serif"
          }
        },
        {
          "id": "f_fname",
          "type": "text",
          "content": "वडिलांचे नाव",
          "x": 113,
          "y": 775,
          "width": 194,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_fname",
          "type": "text",
          "content": ": {{familyDetails.fatherName}}",
          "fieldBinding": "familyDetails.fatherName",
          "x": 338,
          "y": 775,
          "width": 414,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_focc",
          "type": "text",
          "content": "वडिलांचा व्यवसाय",
          "x": 113,
          "y": 800,
          "width": 194,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_focc",
          "type": "text",
          "content": ": {{familyDetails.fatherOccupation}}",
          "fieldBinding": "familyDetails.fatherOccupation",
          "x": 338,
          "y": 800,
          "width": 414,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_mname",
          "type": "text",
          "content": "आईचे नाव",
          "x": 113,
          "y": 825,
          "width": 194,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_mname",
          "type": "text",
          "content": ": {{familyDetails.motherName}}",
          "fieldBinding": "familyDetails.motherName",
          "x": 338,
          "y": 825,
          "width": 414,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_sis",
          "type": "text",
          "content": "बहीण",
          "x": 113,
          "y": 850,
          "width": 194,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_sis",
          "type": "text",
          "content": ": {{familyDetails.sisters}}",
          "fieldBinding": "familyDetails.sisters",
          "x": 338,
          "y": 850,
          "width": 414,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_bro",
          "type": "text",
          "content": "भाऊ",
          "x": 113,
          "y": 875,
          "width": 194,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_bro",
          "type": "text",
          "content": ": {{familyDetails.brothers}}",
          "fieldBinding": "familyDetails.brothers",
          "x": 338,
          "y": 875,
          "width": 414,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_mama",
          "type": "text",
          "content": "मामा",
          "x": 113,
          "y": 900,
          "width": 194,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_mama",
          "type": "text",
          "content": ": {{familyDetails.maternalUncle}}",
          "fieldBinding": "familyDetails.maternalUncle",
          "x": 338,
          "y": 900,
          "width": 414,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_relatives",
          "type": "text",
          "content": "नातेसंबंध",
          "x": 113,
          "y": 925,
          "width": 194,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_relatives",
          "type": "text",
          "content": ": {{familyDetails.relations}}",
          "fieldBinding": "familyDetails.relations",
          "x": 338,
          "y": 925,
          "width": 414,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "heading_contact",
          "type": "text",
          "content": "संपर्क",
          "x": 113,
          "y": 967,
          "width": 568,
          "height": 28,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#1E293B",
            "textAlign": "center",
            "fontFamily": "serif"
          }
        },
        {
          "id": "f_address",
          "type": "text",
          "content": "पत्ता",
          "x": 113,
          "y": 1005,
          "width": 194,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_address",
          "type": "text",
          "content": ": {{contactDetails.residenceAddress}}",
          "fieldBinding": "contactDetails.residenceAddress",
          "x": 338,
          "y": 1018,
          "width": 311,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_phone",
          "type": "text",
          "content": "मो.नं.",
          "x": 113,
          "y": 1066,
          "width": 194,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_phone",
          "type": "text",
          "content": ": {{contactDetails.primaryContact}}",
          "fieldBinding": "contactDetails.primaryContact",
          "x": 338,
          "y": 1062,
          "width": 414,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "el_1787534477505_35",
          "type": "image",
          "shapeType": "circle",
          "x": 300,
          "y": 51,
          "width": 170,
          "height": 160,
          "zIndex": 60,
          "rotation": 0,
          "style": {
            "color": "#B45309",
            "textAlign": "left",
            "fontFamily": "Playfair Display",
            "borderRadius": "50%",
            "objectFit": "cover"
          },
          "content": "/sample_profiles/priya.webp",
          "fieldBinding": "personalDetails.photoUrl"
        }
      ]
    }
  },
  {
    "id": "tpl_bb5247ec",
    "name": "Traditional2.0",
    "slug": "traditional20",
    "pricing_type": "FREE",
    "badge": "#03",
    "dummy_index": 2,
    "thumbnail_image": "",
    "thumbnail_url": "",
    "default_bg": "#FFFFFF",
    "font_family": "Playfair Display",
    "preview_icon": "🏛️",
    "categories": [
      {
        "id": "traditional",
        "name": "Traditional",
        "slug": "traditional",
        "icon": "🚩",
        "description": "Classic Indian traditional designs with sacred motifs and shlokas.",
        "is_active": true,
        "display_order": 1
      }
    ],
    "layout_json": {
      "page": {
        "width": 794,
        "height": 1123,
        "background": "#FFFFFF",
        "backgroundType": "image",
        "backgroundImage": "/static/backgrounds/bg_tpl_bb5247ec.jpg",
        "backgroundFit": "cover",
        "backgroundLocked": true,
        "padding": 40,
        "safeArea": {
          "top": 55,
          "right": 40,
          "bottom": 55,
          "left": 40
        },
        "fontFamily": "Playfair Display",
        "selectedDummyIndex": 2
      },
      "elements": [
        {
          "id": "v_name",
          "type": "text",
          "content": ": {{personalDetails.fullName}}",
          "fieldBinding": "personalDetails.fullName",
          "x": 280,
          "y": 151,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 26,
            "fontWeight": "600",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "f_dob",
          "type": "text",
          "content": "जन्म तारीख",
          "x": 279,
          "y": 200,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "v_dob",
          "type": "text",
          "content": ": {{personalDetails.dateOfBirth}}",
          "fieldBinding": "personalDetails.dateOfBirth",
          "x": 429,
          "y": 200,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "f_tob",
          "type": "text",
          "content": "जन्म वेळ",
          "x": 279,
          "y": 230,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "v_tob",
          "type": "text",
          "content": ": {{personalDetails.timeOfBirth}}",
          "fieldBinding": "personalDetails.timeOfBirth",
          "x": 429,
          "y": 230,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "f_pob",
          "type": "text",
          "content": "जन्म स्थळ",
          "x": 279,
          "y": 260,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "v_pob",
          "type": "text",
          "content": ": {{personalDetails.placeOfBirth}}",
          "fieldBinding": "personalDetails.placeOfBirth",
          "x": 429,
          "y": 260,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "f_rel",
          "type": "text",
          "content": "धर्म",
          "x": 279,
          "y": 295,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "v_rel",
          "type": "text",
          "content": ": {{personalDetails.religion}}",
          "fieldBinding": "personalDetails.religion",
          "x": 419,
          "y": 295,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "f_caste",
          "type": "text",
          "content": "जात",
          "x": 279,
          "y": 330,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "v_caste",
          "type": "text",
          "content": ": {{personalDetails.caste}}",
          "fieldBinding": "personalDetails.caste",
          "x": 419,
          "y": 330,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "f_kul",
          "type": "text",
          "content": "कुलदैवत",
          "x": 279,
          "y": 360,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "v_kul",
          "type": "text",
          "content": ": {{personalDetails.kuldevata}}",
          "fieldBinding": "personalDetails.kuldevata",
          "x": 419,
          "y": 360,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "f_gotra",
          "type": "text",
          "content": "गोत्र",
          "x": 279,
          "y": 392,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "v_gotra",
          "type": "text",
          "content": ": {{personalDetails.gotra}}",
          "fieldBinding": "personalDetails.gotra",
          "x": 419,
          "y": 392,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "f_rashi",
          "type": "text",
          "content": "राशी",
          "x": 279,
          "y": 420,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "v_rashi",
          "type": "text",
          "content": ": {{personalDetails.rashi}}",
          "fieldBinding": "personalDetails.rashi",
          "x": 419,
          "y": 420,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "f_height",
          "type": "text",
          "content": "उंची",
          "x": 279,
          "y": 452,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "v_height",
          "type": "text",
          "content": ": {{personalDetails.height}}",
          "fieldBinding": "personalDetails.height",
          "x": 419,
          "y": 452,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "f_complexion",
          "type": "text",
          "content": "वर्ण",
          "x": 279,
          "y": 480,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "v_complexion",
          "type": "text",
          "content": ": {{personalDetails.complexion}}",
          "fieldBinding": "personalDetails.complexion",
          "x": 419,
          "y": 480,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "f_blood",
          "type": "text",
          "content": "रक्तगट",
          "x": 279,
          "y": 510,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "v_blood",
          "type": "text",
          "content": ": {{personalDetails.bloodGroup}}",
          "fieldBinding": "personalDetails.bloodGroup",
          "x": 419,
          "y": 510,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "f_edu",
          "type": "text",
          "content": "शिक्षण",
          "x": 279,
          "y": 540,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "v_edu",
          "type": "text",
          "content": ": {{educationOccupation.education}}",
          "fieldBinding": "educationOccupation.education",
          "x": 410,
          "y": 551,
          "width": 290,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "f_occ",
          "type": "text",
          "content": "नोकरी/व्यवसाय",
          "x": 279,
          "y": 600,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "v_occ",
          "type": "text",
          "content": ": {{educationOccupation.occupation}}",
          "fieldBinding": "educationOccupation.occupation",
          "x": 410,
          "y": 600,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "f_income",
          "type": "text",
          "content": "वेतन/उत्पन्न",
          "x": 279,
          "y": 640,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "v_income",
          "type": "text",
          "content": ": {{educationOccupation.annualIncome}}",
          "fieldBinding": "educationOccupation.annualIncome",
          "x": 419,
          "y": 640,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "f_fname",
          "type": "text",
          "content": "वडिलांचे नाव",
          "x": 279,
          "y": 680,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "v_fname",
          "type": "text",
          "content": ": {{familyDetails.fatherName}}",
          "fieldBinding": "familyDetails.fatherName",
          "x": 410,
          "y": 680,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "f_focc",
          "type": "text",
          "content": "वडिलांचा व्यवसाय",
          "x": 279,
          "y": 720,
          "width": 131,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "v_focc",
          "type": "text",
          "content": ": {{familyDetails.fatherOccupation}}",
          "fieldBinding": "familyDetails.fatherOccupation",
          "x": 410,
          "y": 720,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "f_mname",
          "type": "text",
          "content": "आईचे नाव",
          "x": 279,
          "y": 769,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "v_mname",
          "type": "text",
          "content": ": {{familyDetails.motherName}}",
          "fieldBinding": "familyDetails.motherName",
          "x": 419,
          "y": 769,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "f_sis",
          "type": "text",
          "content": "बहीण",
          "x": 279,
          "y": 800,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "v_sis",
          "type": "text",
          "content": ": {{familyDetails.sisters}}",
          "fieldBinding": "familyDetails.sisters",
          "x": 419,
          "y": 800,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "f_bro",
          "type": "text",
          "content": "भाऊ",
          "x": 279,
          "y": 840,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "v_bro",
          "type": "text",
          "content": ": {{familyDetails.brothers}}",
          "fieldBinding": "familyDetails.brothers",
          "x": 419,
          "y": 840,
          "width": 309,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "f_address",
          "type": "text",
          "content": "पत्ता",
          "x": 220,
          "y": 900,
          "width": 230,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "v_address",
          "type": "text",
          "content": ": {{contactDetails.residenceAddress}}",
          "fieldBinding": "contactDetails.residenceAddress",
          "x": 400,
          "y": 900,
          "width": 315,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "f_phone",
          "type": "text",
          "content": "मो.नं.",
          "x": 220,
          "y": 940,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "v_phone",
          "type": "text",
          "content": ": {{contactDetails.primaryContact}}",
          "fieldBinding": "contactDetails.primaryContact",
          "x": 400,
          "y": 940,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#e0aeae",
            "textAlign": "left"
          }
        },
        {
          "id": "el_1788170752082_82",
          "type": "image",
          "content": "/sample_profiles/vikram.webp",
          "fieldBinding": "personalDetails.photoUrl",
          "shapeType": "rounded",
          "x": 100,
          "y": 151,
          "width": 165,
          "height": 261,
          "zIndex": 45,
          "rotation": 0,
          "style": {
            "color": "#B45309",
            "textAlign": "left",
            "fontFamily": "Playfair Display",
            "borderRadius": "8px",
            "objectFit": "cover"
          }
        }
      ]
    }
  },
  {
    "id": "tpl_eaa5d733",
    "name": "Sneh",
    "slug": "sneh",
    "pricing_type": "FREE",
    "badge": "#04",
    "dummy_index": 3,
    "thumbnail_image": "",
    "thumbnail_url": "",
    "default_bg": "#FFFFFF",
    "font_family": "Playfair Display",
    "preview_icon": "💖",
    "categories": [
      {
        "id": "traditional",
        "name": "Traditional",
        "slug": "traditional",
        "icon": "🚩",
        "description": "Classic Indian traditional designs with sacred motifs and shlokas.",
        "is_active": true,
        "display_order": 1
      }
    ],
    "layout_json": {
      "page": {
        "width": 794,
        "height": 1123,
        "background": "#FFFFFF",
        "backgroundType": "image",
        "backgroundImage": "/static/backgrounds/bg_tpl_eaa5d733.png",
        "backgroundFit": "cover",
        "backgroundLocked": true,
        "padding": 40,
        "safeArea": {
          "top": 55,
          "right": 40,
          "bottom": 55,
          "left": 40
        },
        "fontFamily": "Playfair Display",
        "selectedDummyIndex": 2
      },
      "elements": [
        {
          "id": "header_shloka",
          "type": "text",
          "content": "॥ श्री गणेशाय नमः ॥",
          "fieldBinding": "pageHeader.deity",
          "x": 109,
          "y": 100,
          "width": 559,
          "height": 28,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#8B0000",
            "textAlign": "center",
            "fontFamily": "serif"
          }
        },
        {
          "id": "heading_personal",
          "type": "text",
          "content": "वैयक्तिक माहिती",
          "x": 144,
          "y": 180,
          "width": 559,
          "height": 28,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#1E293B",
            "textAlign": "center",
            "fontFamily": "serif"
          }
        },
        {
          "id": "f_name",
          "type": "text",
          "content": "नाव",
          "x": 200,
          "y": 214,
          "width": 185,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_name",
          "type": "text",
          "content": ": {{personalDetails.fullName}}",
          "fieldBinding": "personalDetails.fullName",
          "x": 424,
          "y": 214,
          "width": 405,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "600",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_dob",
          "type": "text",
          "content": "जन्म तारीख",
          "x": 200,
          "y": 239,
          "width": 185,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_dob",
          "type": "text",
          "content": ": {{personalDetails.dateOfBirth}}",
          "fieldBinding": "personalDetails.dateOfBirth",
          "x": 424,
          "y": 239,
          "width": 405,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_tob",
          "type": "text",
          "content": "जन्म वेळ",
          "x": 200,
          "y": 264,
          "width": 185,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_tob",
          "type": "text",
          "content": ": {{personalDetails.timeOfBirth}}",
          "fieldBinding": "personalDetails.timeOfBirth",
          "x": 424,
          "y": 264,
          "width": 405,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_pob",
          "type": "text",
          "content": "जन्म स्थळ",
          "x": 200,
          "y": 289,
          "width": 185,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_pob",
          "type": "text",
          "content": ": {{personalDetails.placeOfBirth}}",
          "fieldBinding": "personalDetails.placeOfBirth",
          "x": 424,
          "y": 289,
          "width": 405,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_rel",
          "type": "text",
          "content": "धर्म",
          "x": 200,
          "y": 314,
          "width": 185,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_rel",
          "type": "text",
          "content": ": {{personalDetails.religion}}",
          "fieldBinding": "personalDetails.religion",
          "x": 424,
          "y": 314,
          "width": 405,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_caste",
          "type": "text",
          "content": "जात",
          "x": 200,
          "y": 339,
          "width": 185,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_caste",
          "type": "text",
          "content": ": {{personalDetails.caste}}",
          "fieldBinding": "personalDetails.caste",
          "x": 424,
          "y": 339,
          "width": 405,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_kul",
          "type": "text",
          "content": "कुलदैवत",
          "x": 200,
          "y": 364,
          "width": 185,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_kul",
          "type": "text",
          "content": ": {{personalDetails.kuldevata}}",
          "fieldBinding": "personalDetails.kuldevata",
          "x": 424,
          "y": 364,
          "width": 405,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_gotra",
          "type": "text",
          "content": "गोत्र",
          "x": 200,
          "y": 389,
          "width": 185,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_gotra",
          "type": "text",
          "content": ": {{personalDetails.gotra}}",
          "fieldBinding": "personalDetails.gotra",
          "x": 424,
          "y": 389,
          "width": 405,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_rashi",
          "type": "text",
          "content": "राशी",
          "x": 200,
          "y": 414,
          "width": 185,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_rashi",
          "type": "text",
          "content": ": {{personalDetails.rashi}}",
          "fieldBinding": "personalDetails.rashi",
          "x": 424,
          "y": 414,
          "width": 405,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_nakshatra",
          "type": "text",
          "content": "नक्षत्र",
          "x": 200,
          "y": 439,
          "width": 185,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_nakshatra",
          "type": "text",
          "content": ": {{personalDetails.nakshatra}}",
          "fieldBinding": "personalDetails.nakshatra",
          "x": 424,
          "y": 439,
          "width": 405,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_gan",
          "type": "text",
          "content": "गण",
          "x": 200,
          "y": 464,
          "width": 185,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_gan",
          "type": "text",
          "content": ": {{personalDetails.gan}}",
          "fieldBinding": "personalDetails.gan",
          "x": 424,
          "y": 464,
          "width": 405,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_nadi",
          "type": "text",
          "content": "नाडी",
          "x": 200,
          "y": 489,
          "width": 185,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_nadi",
          "type": "text",
          "content": ": {{personalDetails.nadi}}",
          "fieldBinding": "personalDetails.nadi",
          "x": 424,
          "y": 489,
          "width": 405,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_height",
          "type": "text",
          "content": "उंची",
          "x": 200,
          "y": 514,
          "width": 185,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_height",
          "type": "text",
          "content": ": {{personalDetails.height}}",
          "fieldBinding": "personalDetails.height",
          "x": 424,
          "y": 514,
          "width": 405,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_complexion",
          "type": "text",
          "content": "वर्ण",
          "x": 200,
          "y": 539,
          "width": 185,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_complexion",
          "type": "text",
          "content": ": {{personalDetails.complexion}}",
          "fieldBinding": "personalDetails.complexion",
          "x": 424,
          "y": 539,
          "width": 405,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_blood",
          "type": "text",
          "content": "रक्तगट",
          "x": 200,
          "y": 564,
          "width": 185,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_blood",
          "type": "text",
          "content": ": {{personalDetails.bloodGroup}}",
          "fieldBinding": "personalDetails.bloodGroup",
          "x": 424,
          "y": 564,
          "width": 405,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_edu",
          "type": "text",
          "content": "शिक्षण",
          "x": 200,
          "y": 589,
          "width": 185,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_edu",
          "type": "text",
          "content": ": {{educationOccupation.education}}",
          "fieldBinding": "educationOccupation.education",
          "x": 424,
          "y": 600,
          "width": 280,
          "height": 26,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_occ",
          "type": "text",
          "content": "नोकरी/व्यवसाय",
          "x": 200,
          "y": 648,
          "width": 185,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_occ",
          "type": "text",
          "content": ": {{educationOccupation.occupation}}",
          "fieldBinding": "educationOccupation.occupation",
          "x": 424,
          "y": 648,
          "width": 405,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_income",
          "type": "text",
          "content": "वेतन/उत्पन्न",
          "x": 200,
          "y": 669,
          "width": 185,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_income",
          "type": "text",
          "content": ": {{educationOccupation.annualIncome}}",
          "fieldBinding": "educationOccupation.annualIncome",
          "x": 424,
          "y": 669,
          "width": 405,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "heading_family",
          "type": "text",
          "content": "कौटुंबिक माहिती",
          "x": 166,
          "y": 699,
          "width": 559,
          "height": 28,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#1E293B",
            "textAlign": "center",
            "fontFamily": "serif"
          }
        },
        {
          "id": "f_fname",
          "type": "text",
          "content": "वडिलांचे नाव",
          "x": 200,
          "y": 738,
          "width": 185,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_fname",
          "type": "text",
          "content": ": {{familyDetails.fatherName}}",
          "fieldBinding": "familyDetails.fatherName",
          "x": 424,
          "y": 738,
          "width": 405,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_focc",
          "type": "text",
          "content": "वडिलांचा व्यवसाय",
          "x": 200,
          "y": 763,
          "width": 185,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_focc",
          "type": "text",
          "content": ": {{familyDetails.fatherOccupation}}",
          "fieldBinding": "familyDetails.fatherOccupation",
          "x": 424,
          "y": 763,
          "width": 405,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_mname",
          "type": "text",
          "content": "आईचे नाव",
          "x": 200,
          "y": 788,
          "width": 185,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_mname",
          "type": "text",
          "content": ": {{familyDetails.motherName}}",
          "fieldBinding": "familyDetails.motherName",
          "x": 424,
          "y": 788,
          "width": 405,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_sis",
          "type": "text",
          "content": "बहीण",
          "x": 200,
          "y": 813,
          "width": 185,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_sis",
          "type": "text",
          "content": ": {{familyDetails.sisters}}",
          "fieldBinding": "familyDetails.sisters",
          "x": 424,
          "y": 813,
          "width": 405,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_bro",
          "type": "text",
          "content": "भाऊ",
          "x": 200,
          "y": 838,
          "width": 185,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_bro",
          "type": "text",
          "content": ": {{familyDetails.brothers}}",
          "fieldBinding": "familyDetails.brothers",
          "x": 424,
          "y": 838,
          "width": 394,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "heading_contact",
          "type": "text",
          "content": "संपर्क",
          "x": 168,
          "y": 858,
          "width": 559,
          "height": 28,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#1E293B",
            "textAlign": "center",
            "fontFamily": "serif"
          }
        },
        {
          "id": "f_address",
          "type": "text",
          "content": "पत्ता",
          "x": 202,
          "y": 907,
          "width": 185,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_address",
          "type": "text",
          "content": ": {{contactDetails.residenceAddress}}",
          "fieldBinding": "contactDetails.residenceAddress",
          "x": 426,
          "y": 917,
          "width": 356,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_phone",
          "type": "text",
          "content": "मो.नं.",
          "x": 202,
          "y": 959,
          "width": 185,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_phone",
          "type": "text",
          "content": ": {{contactDetails.primaryContact}}",
          "fieldBinding": "contactDetails.primaryContact",
          "x": 426,
          "y": 959,
          "width": 405,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "el_1787537369158_300",
          "type": "decoration",
          "decorationKey": "om",
          "x": 340,
          "y": 40,
          "width": 62,
          "height": 64,
          "zIndex": 59,
          "rotation": 0,
          "style": {
            "color": "#B45309",
            "textAlign": "left",
            "fontFamily": "Playfair Display",
            "borderRadius": "0px",
            "objectFit": "cover"
          }
        },
        {
          "id": "el_1787537375030_499",
          "type": "image",
          "shapeType": "rounded",
          "x": 40,
          "y": 214,
          "width": 143,
          "height": 223,
          "zIndex": 60,
          "rotation": 0,
          "style": {
            "color": "#B45309",
            "textAlign": "left",
            "fontFamily": "Playfair Display",
            "borderRadius": "8px",
            "objectFit": "cover"
          },
          "content": "/sample_profiles/sunita.webp",
          "fieldBinding": "personalDetails.photoUrl"
        }
      ]
    }
  },
  {
    "id": "tpl_f33718cb",
    "name": "Nivaan",
    "slug": "nivaan",
    "pricing_type": "FREE",
    "badge": "#05",
    "dummy_index": 4,
    "thumbnail_image": "",
    "thumbnail_url": "",
    "default_bg": "#FFFFFF",
    "font_family": "Playfair Display",
    "preview_icon": "🪔",
    "categories": [
      {
        "id": "modern",
        "name": "Modern",
        "slug": "modern",
        "icon": "✨",
        "description": "Clean, minimal, modern aesthetic for contemporary profiles.",
        "is_active": true,
        "display_order": 2
      }
    ],
    "layout_json": {
      "page": {
        "width": 794,
        "height": 1123,
        "background": "#FFFFFF",
        "backgroundType": "image",
        "backgroundImage": "/static/backgrounds/bg_tpl_f33718cb.jpg",
        "backgroundFit": "cover",
        "backgroundLocked": true,
        "padding": 40,
        "safeArea": {
          "top": 55,
          "right": 40,
          "bottom": 55,
          "left": 40
        },
        "fontFamily": "Playfair Display"
      },
      "elements": [
        {
          "id": "header_shloka",
          "type": "text",
          "content": "॥ श्री गणेशाय नमः ॥",
          "fieldBinding": "pageHeader.deity",
          "x": 80,
          "y": 80,
          "width": 594,
          "height": 28,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "bold",
            "color": "#8B0000",
            "textAlign": "center",
            "fontFamily": "serif"
          }
        },
        {
          "id": "f_name",
          "type": "text",
          "content": "नाव",
          "x": 280,
          "y": 147,
          "width": 184,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_name",
          "type": "text",
          "content": ": {{personalDetails.fullName}}",
          "fieldBinding": "personalDetails.fullName",
          "x": 440,
          "y": 147,
          "width": 194,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "600",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_dob",
          "type": "text",
          "content": "जन्म तारीख",
          "x": 278,
          "y": 178,
          "width": 184,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_dob",
          "type": "text",
          "content": ": {{personalDetails.dateOfBirth}}",
          "fieldBinding": "personalDetails.dateOfBirth",
          "x": 440,
          "y": 178,
          "width": 205,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_tob",
          "type": "text",
          "content": "जन्म वेळ",
          "x": 278,
          "y": 207,
          "width": 184,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_tob",
          "type": "text",
          "content": ": {{personalDetails.timeOfBirth}}",
          "fieldBinding": "personalDetails.timeOfBirth",
          "x": 440,
          "y": 207,
          "width": 89,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_pob",
          "type": "text",
          "content": "जन्म स्थळ",
          "x": 278,
          "y": 239,
          "width": 184,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_pob",
          "type": "text",
          "content": ": {{personalDetails.placeOfBirth}}",
          "fieldBinding": "personalDetails.placeOfBirth",
          "x": 440,
          "y": 239,
          "width": 250,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_rel",
          "type": "text",
          "content": "धर्म",
          "x": 278,
          "y": 274,
          "width": 89,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_rel",
          "type": "text",
          "content": ": {{personalDetails.religion}}",
          "fieldBinding": "personalDetails.religion",
          "x": 440,
          "y": 275,
          "width": 215,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_caste",
          "type": "text",
          "content": "जात",
          "x": 104,
          "y": 360,
          "width": 89,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_caste",
          "type": "text",
          "content": ": {{personalDetails.caste}}",
          "fieldBinding": "personalDetails.caste",
          "x": 240,
          "y": 360,
          "width": 215,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_kul",
          "type": "text",
          "content": "कुलदैवत",
          "x": 104,
          "y": 400,
          "width": 89,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_kul",
          "type": "text",
          "content": ": {{personalDetails.kuldevata}}",
          "fieldBinding": "personalDetails.kuldevata",
          "x": 240,
          "y": 400,
          "width": 215,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_gotra",
          "type": "text",
          "content": "गोत्र",
          "x": 104,
          "y": 441,
          "width": 89,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_gotra",
          "type": "text",
          "content": ": {{personalDetails.gotra}}",
          "fieldBinding": "personalDetails.gotra",
          "x": 240,
          "y": 441,
          "width": 215,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_rashi",
          "type": "text",
          "content": "राशी",
          "x": 110,
          "y": 488,
          "width": 89,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_rashi",
          "type": "text",
          "content": ": {{personalDetails.rashi}}",
          "fieldBinding": "personalDetails.rashi",
          "x": 240,
          "y": 488,
          "width": 215,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_nakshatra",
          "type": "text",
          "content": "नक्षत्र",
          "x": 440,
          "y": 360,
          "width": 184,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_nakshatra",
          "type": "text",
          "content": ": {{personalDetails.nakshatra}}",
          "fieldBinding": "personalDetails.nakshatra",
          "x": 600,
          "y": 360,
          "width": 161,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_nadi",
          "type": "text",
          "content": "नाडी",
          "x": 440,
          "y": 400,
          "width": 184,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_nadi",
          "type": "text",
          "content": ": {{personalDetails.nadi}}",
          "fieldBinding": "personalDetails.nadi",
          "x": 600,
          "y": 400,
          "width": 161,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_height",
          "type": "text",
          "content": "उंची",
          "x": 440,
          "y": 441,
          "width": 184,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_height",
          "type": "text",
          "content": ": {{personalDetails.height}}",
          "fieldBinding": "personalDetails.height",
          "x": 600,
          "y": 441,
          "width": 161,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_complexion",
          "type": "text",
          "content": "वर्ण",
          "x": 440,
          "y": 488,
          "width": 184,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_complexion",
          "type": "text",
          "content": ": {{personalDetails.complexion}}",
          "fieldBinding": "personalDetails.complexion",
          "x": 600,
          "y": 488,
          "width": 161,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_blood",
          "type": "text",
          "content": "रक्तगट",
          "x": 278,
          "y": 311,
          "width": 184,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_blood",
          "type": "text",
          "content": ": {{personalDetails.bloodGroup}}",
          "fieldBinding": "personalDetails.bloodGroup",
          "x": 440,
          "y": 311,
          "width": 404,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_edu",
          "type": "text",
          "content": "शिक्षण",
          "x": 104,
          "y": 553,
          "width": 184,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_edu",
          "type": "text",
          "content": ": {{educationOccupation.education}}",
          "fieldBinding": "educationOccupation.education",
          "x": 324,
          "y": 553,
          "width": 404,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_occ",
          "type": "text",
          "content": "नोकरी/व्यवसाय",
          "x": 104,
          "y": 587,
          "width": 184,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_occ",
          "type": "text",
          "content": ": {{educationOccupation.occupation}}",
          "fieldBinding": "educationOccupation.occupation",
          "x": 324,
          "y": 591,
          "width": 404,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_income",
          "type": "text",
          "content": "वेतन/उत्पन्न",
          "x": 104,
          "y": 623,
          "width": 184,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_income",
          "type": "text",
          "content": ": {{educationOccupation.annualIncome}}",
          "fieldBinding": "educationOccupation.annualIncome",
          "x": 324,
          "y": 627,
          "width": 404,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "heading_family",
          "type": "text",
          "content": "कौटुंबिक माहिती",
          "x": -117,
          "y": 673,
          "width": 558,
          "height": 28,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#042c6c",
            "textAlign": "center",
            "fontFamily": "serif"
          }
        },
        {
          "id": "f_fname",
          "type": "text",
          "content": "वडिलांचे नाव",
          "x": 104,
          "y": 706,
          "width": 184,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_fname",
          "type": "text",
          "content": ": {{familyDetails.fatherName}}",
          "fieldBinding": "familyDetails.fatherName",
          "x": 340,
          "y": 707,
          "width": 404,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_focc",
          "type": "text",
          "content": "वडिलांचा व्यवसाय",
          "x": 104,
          "y": 746,
          "width": 184,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_focc",
          "type": "text",
          "content": ": {{familyDetails.fatherOccupation}}",
          "fieldBinding": "familyDetails.fatherOccupation",
          "x": 340,
          "y": 747,
          "width": 404,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_mname",
          "type": "text",
          "content": "आईचे नाव",
          "x": 104,
          "y": 786,
          "width": 184,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_mname",
          "type": "text",
          "content": ": {{familyDetails.motherName}}",
          "fieldBinding": "familyDetails.motherName",
          "x": 340,
          "y": 787,
          "width": 404,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_sis",
          "type": "text",
          "content": "बहीण",
          "x": 104,
          "y": 820,
          "width": 184,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_sis",
          "type": "text",
          "content": ": {{familyDetails.sisters}}",
          "fieldBinding": "familyDetails.sisters",
          "x": 340,
          "y": 827,
          "width": 404,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_bro",
          "type": "text",
          "content": "भाऊ",
          "x": 104,
          "y": 866,
          "width": 184,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_bro",
          "type": "text",
          "content": ": {{familyDetails.brothers}}",
          "fieldBinding": "familyDetails.brothers",
          "x": 340,
          "y": 867,
          "width": 404,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "heading_contact",
          "type": "text",
          "content": "संपर्क",
          "x": -113,
          "y": 920,
          "width": 558,
          "height": 28,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#042c6c",
            "textAlign": "center",
            "fontFamily": "serif"
          }
        },
        {
          "id": "f_address",
          "type": "text",
          "content": "पत्ता",
          "x": 104,
          "y": 960,
          "width": 127,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_address",
          "type": "text",
          "content": ": {{contactDetails.residenceAddress}}",
          "fieldBinding": "contactDetails.residenceAddress",
          "x": 340,
          "y": 948,
          "width": 404,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_phone",
          "type": "text",
          "content": "मो.नं.",
          "x": 104,
          "y": 1009,
          "width": 184,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_phone",
          "type": "text",
          "content": ": {{contactDetails.primaryContact}}",
          "fieldBinding": "contactDetails.primaryContact",
          "x": 331,
          "y": 1000,
          "width": 404,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#042c6c",
            "textAlign": "left"
          }
        },
        {
          "id": "el_1787537215934_175",
          "type": "image",
          "shapeType": "rounded",
          "x": 60,
          "y": 141,
          "width": 197,
          "height": 201,
          "zIndex": 59,
          "rotation": 0,
          "style": {
            "color": "#B45309",
            "textAlign": "left",
            "fontFamily": "Playfair Display",
            "borderRadius": "12px",
            "objectFit": "cover"
          },
          "content": "/sample_profiles/akash.webp",
          "fieldBinding": "personalDetails.photoUrl"
        },
        {
          "id": "el_1787537225023_2",
          "type": "decoration",
          "decorationKey": "om",
          "x": 340,
          "y": 11,
          "width": 64,
          "height": 61,
          "zIndex": 60,
          "rotation": 0,
          "style": {
            "color": "#B45309",
            "textAlign": "left",
            "fontFamily": "Playfair Display",
            "borderRadius": "0px",
            "objectFit": "cover"
          }
        }
      ]
    }
  },
  {
    "id": "tpl_8f9df818",
    "name": "The Golden Legacy",
    "slug": "the-golden-legacy",
    "pricing_type": "PREMIUM",
    "badge": "#06",
    "dummy_index": 5,
    "thumbnail_image": "",
    "thumbnail_url": "",
    "default_bg": "#FFFFFF",
    "font_family": "Playfair Display",
    "preview_icon": "👑",
    "categories": [
      {
        "id": "luxury",
        "name": "Luxury",
        "slug": "luxury",
        "icon": "👑",
        "description": "Royal parchment, gold leaf borders & premium typography.",
        "is_active": true,
        "display_order": 3
      },
      {
        "id": "royal",
        "name": "Royal & Heritage",
        "slug": "royal",
        "icon": "⚜️",
        "description": "Grand maharajah heritage styling with ornate frames.",
        "is_active": true,
        "display_order": 5
      }
    ],
    "layout_json": {
      "page": {
        "width": 794,
        "height": 1123,
        "background": "#FFFFFF",
        "backgroundType": "image",
        "backgroundImage": "/static/backgrounds/bg_tpl_8f9df818.png",
        "backgroundFit": "cover",
        "backgroundLocked": true,
        "padding": 40,
        "safeArea": {
          "top": 55,
          "right": 40,
          "bottom": 55,
          "left": 40
        },
        "fontFamily": "Playfair Display"
      },
      "elements": [
        {
          "id": "header_shloka",
          "type": "text",
          "content": "॥ श्री गणेशाय नमः ॥",
          "fieldBinding": "pageHeader.deity",
          "x": 123,
          "y": 60,
          "width": 548,
          "height": 28,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#b18c8c",
            "textAlign": "center",
            "fontFamily": "serif"
          }
        },
        {
          "id": "heading_personal",
          "type": "text",
          "content": "वैयक्तिक माहिती",
          "x": 100,
          "y": 128,
          "width": 548,
          "height": 28,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#b18c8c",
            "textAlign": "center",
            "fontFamily": "serif"
          }
        },
        {
          "id": "f_name",
          "type": "text",
          "content": "नाव",
          "x": 100,
          "y": 168,
          "width": 174,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_name",
          "type": "text",
          "content": ": {{personalDetails.fullName}}",
          "fieldBinding": "personalDetails.fullName",
          "x": 340,
          "y": 168,
          "width": 394,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "600",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_dob",
          "type": "text",
          "content": "जन्म तारीख",
          "x": 100,
          "y": 188,
          "width": 174,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_dob",
          "type": "text",
          "content": ": {{personalDetails.dateOfBirth}}",
          "fieldBinding": "personalDetails.dateOfBirth",
          "x": 340,
          "y": 188,
          "width": 394,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_tob",
          "type": "text",
          "content": "जन्म वेळ",
          "x": 100,
          "y": 228,
          "width": 174,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_tob",
          "type": "text",
          "content": ": {{personalDetails.timeOfBirth}}",
          "fieldBinding": "personalDetails.timeOfBirth",
          "x": 340,
          "y": 228,
          "width": 394,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_pob",
          "type": "text",
          "content": "जन्म स्थळ",
          "x": 100,
          "y": 248,
          "width": 174,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_pob",
          "type": "text",
          "content": ": {{personalDetails.placeOfBirth}}",
          "fieldBinding": "personalDetails.placeOfBirth",
          "x": 340,
          "y": 248,
          "width": 394,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_rel",
          "type": "text",
          "content": "धर्म",
          "x": 100,
          "y": 268,
          "width": 174,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_rel",
          "type": "text",
          "content": ": {{personalDetails.religion}}",
          "fieldBinding": "personalDetails.religion",
          "x": 340,
          "y": 268,
          "width": 394,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_caste",
          "type": "text",
          "content": "जात",
          "x": 100,
          "y": 288,
          "width": 174,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_caste",
          "type": "text",
          "content": ": {{personalDetails.caste}}",
          "fieldBinding": "personalDetails.caste",
          "x": 340,
          "y": 288,
          "width": 394,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_kul",
          "type": "text",
          "content": "कुलदैवत",
          "x": 100,
          "y": 328,
          "width": 174,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_kul",
          "type": "text",
          "content": ": {{personalDetails.kuldevata}}",
          "fieldBinding": "personalDetails.kuldevata",
          "x": 340,
          "y": 328,
          "width": 394,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_gotra",
          "type": "text",
          "content": "गोत्र",
          "x": 100,
          "y": 348,
          "width": 174,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_gotra",
          "type": "text",
          "content": ": {{personalDetails.gotra}}",
          "fieldBinding": "personalDetails.gotra",
          "x": 340,
          "y": 348,
          "width": 394,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_rashi",
          "type": "text",
          "content": "राशी",
          "x": 100,
          "y": 368,
          "width": 174,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_rashi",
          "type": "text",
          "content": ": {{personalDetails.rashi}}",
          "fieldBinding": "personalDetails.rashi",
          "x": 340,
          "y": 368,
          "width": 394,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_nakshatra",
          "type": "text",
          "content": "नक्षत्र",
          "x": 100,
          "y": 388,
          "width": 174,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_nakshatra",
          "type": "text",
          "content": ": {{personalDetails.nakshatra}}",
          "fieldBinding": "personalDetails.nakshatra",
          "x": 340,
          "y": 388,
          "width": 394,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_gan",
          "type": "text",
          "content": "गण",
          "x": 100,
          "y": 428,
          "width": 174,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_gan",
          "type": "text",
          "content": ": {{personalDetails.gan}}",
          "fieldBinding": "personalDetails.gan",
          "x": 340,
          "y": 428,
          "width": 394,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_nadi",
          "type": "text",
          "content": "नाडी",
          "x": 100,
          "y": 448,
          "width": 174,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_nadi",
          "type": "text",
          "content": ": {{personalDetails.nadi}}",
          "fieldBinding": "personalDetails.nadi",
          "x": 340,
          "y": 448,
          "width": 394,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_height",
          "type": "text",
          "content": "उंची",
          "x": 100,
          "y": 468,
          "width": 174,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_height",
          "type": "text",
          "content": ": {{personalDetails.height}}",
          "fieldBinding": "personalDetails.height",
          "x": 340,
          "y": 468,
          "width": 394,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_complexion",
          "type": "text",
          "content": "वर्ण",
          "x": 100,
          "y": 488,
          "width": 174,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_complexion",
          "type": "text",
          "content": ": {{personalDetails.complexion}}",
          "fieldBinding": "personalDetails.complexion",
          "x": 340,
          "y": 488,
          "width": 394,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_blood",
          "type": "text",
          "content": "रक्तगट",
          "x": 100,
          "y": 528,
          "width": 174,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_blood",
          "type": "text",
          "content": ": {{personalDetails.bloodGroup}}",
          "fieldBinding": "personalDetails.bloodGroup",
          "x": 340,
          "y": 528,
          "width": 394,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_edu",
          "type": "text",
          "content": "शिक्षण",
          "x": 100,
          "y": 548,
          "width": 174,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_edu",
          "type": "text",
          "content": ": {{educationOccupation.education}}",
          "fieldBinding": "educationOccupation.education",
          "x": 340,
          "y": 548,
          "width": 394,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_occ",
          "type": "text",
          "content": "नोकरी/व्यवसाय",
          "x": 100,
          "y": 568,
          "width": 174,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_occ",
          "type": "text",
          "content": ": {{educationOccupation.occupation}}",
          "fieldBinding": "educationOccupation.occupation",
          "x": 340,
          "y": 568,
          "width": 394,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_income",
          "type": "text",
          "content": "वेतन/उत्पन्न",
          "x": 100,
          "y": 588,
          "width": 174,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_income",
          "type": "text",
          "content": ": {{educationOccupation.annualIncome}}",
          "fieldBinding": "educationOccupation.annualIncome",
          "x": 340,
          "y": 588,
          "width": 394,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "heading_family",
          "type": "text",
          "content": "कौटुंबिक माहिती",
          "x": 80,
          "y": 628,
          "width": 548,
          "height": 28,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#b18c8c",
            "textAlign": "center",
            "fontFamily": "serif"
          }
        },
        {
          "id": "f_fname",
          "type": "text",
          "content": "वडिलांचे नाव",
          "x": 100,
          "y": 668,
          "width": 174,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_fname",
          "type": "text",
          "content": ": {{familyDetails.fatherName}}",
          "fieldBinding": "familyDetails.fatherName",
          "x": 340,
          "y": 668,
          "width": 394,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_focc",
          "type": "text",
          "content": "वडिलांचा व्यवसाय",
          "x": 100,
          "y": 708,
          "width": 213,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_focc",
          "type": "text",
          "content": ": {{familyDetails.fatherOccupation}}",
          "fieldBinding": "familyDetails.fatherOccupation",
          "x": 340,
          "y": 708,
          "width": 394,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_mname",
          "type": "text",
          "content": "आईचे नाव",
          "x": 100,
          "y": 728,
          "width": 174,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_mname",
          "type": "text",
          "content": ": {{familyDetails.motherName}}",
          "fieldBinding": "familyDetails.motherName",
          "x": 340,
          "y": 728,
          "width": 394,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_sis",
          "type": "text",
          "content": "बहीण",
          "x": 100,
          "y": 748,
          "width": 174,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_sis",
          "type": "text",
          "content": ": {{familyDetails.sisters}}",
          "fieldBinding": "familyDetails.sisters",
          "x": 340,
          "y": 748,
          "width": 394,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_bro",
          "type": "text",
          "content": "भाऊ",
          "x": 100,
          "y": 768,
          "width": 174,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_bro",
          "type": "text",
          "content": ": {{familyDetails.brothers}}",
          "fieldBinding": "familyDetails.brothers",
          "x": 340,
          "y": 768,
          "width": 394,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_mama",
          "type": "text",
          "content": "मामा",
          "x": 100,
          "y": 808,
          "width": 174,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_mama",
          "type": "text",
          "content": ": {{familyDetails.maternalUncle}}",
          "fieldBinding": "familyDetails.maternalUncle",
          "x": 340,
          "y": 808,
          "width": 394,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_relatives",
          "type": "text",
          "content": "नातेसंबंध",
          "x": 100,
          "y": 828,
          "width": 174,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_relatives",
          "type": "text",
          "content": ": {{familyDetails.relations}}",
          "fieldBinding": "familyDetails.relations",
          "x": 340,
          "y": 828,
          "width": 394,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "heading_contact",
          "type": "text",
          "content": "संपर्क",
          "x": 80,
          "y": 868,
          "width": 548,
          "height": 28,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#b18c8c",
            "textAlign": "center",
            "fontFamily": "serif"
          }
        },
        {
          "id": "f_address",
          "type": "text",
          "content": "पत्ता",
          "x": 100,
          "y": 908,
          "width": 174,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_address",
          "type": "text",
          "content": ": {{contactDetails.residenceAddress}}",
          "fieldBinding": "contactDetails.residenceAddress",
          "x": 340,
          "y": 908,
          "width": 394,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "f_phone",
          "type": "text",
          "content": "मो.नं.",
          "x": 100,
          "y": 968,
          "width": 174,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "v_phone",
          "type": "text",
          "content": ": {{contactDetails.primaryContact}}",
          "fieldBinding": "contactDetails.primaryContact",
          "x": 340,
          "y": 967,
          "width": 394,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#b18c8c",
            "textAlign": "left"
          }
        },
        {
          "id": "el_1787532142070_690",
          "type": "decoration",
          "decorationKey": "om",
          "x": 370,
          "y": 0,
          "width": 54,
          "height": 63,
          "zIndex": 59,
          "rotation": 0,
          "style": {
            "color": "#B45309",
            "textAlign": "left",
            "fontFamily": "Playfair Display",
            "borderRadius": "0px",
            "objectFit": "cover"
          }
        },
        {
          "id": "el_1787532147584_324",
          "type": "image",
          "shapeType": "rounded",
          "x": 572,
          "y": 168,
          "width": 168,
          "height": 246,
          "zIndex": 60,
          "rotation": 0,
          "style": {
            "color": "#B45309",
            "textAlign": "left",
            "fontFamily": "Playfair Display",
            "borderRadius": "8px",
            "objectFit": "cover"
          },
          "content": "/sample_profiles/pooja.webp",
          "fieldBinding": "personalDetails.photoUrl"
        }
      ]
    }
  },
  {
    "id": "tpl_90411229",
    "name": "Orlienne",
    "slug": "orlienne",
    "pricing_type": "PREMIUM",
    "badge": "#07",
    "dummy_index": 6,
    "thumbnail_image": "",
    "thumbnail_url": "",
    "default_bg": "#FFFFFF",
    "font_family": "Playfair Display",
    "preview_icon": "🛡️",
    "categories": [
      {
        "id": "luxury",
        "name": "Luxury",
        "slug": "luxury",
        "icon": "👑",
        "description": "Royal parchment, gold leaf borders & premium typography.",
        "is_active": true,
        "display_order": 3
      },
      {
        "id": "modern",
        "name": "Modern",
        "slug": "modern",
        "icon": "✨",
        "description": "Clean, minimal, modern aesthetic for contemporary profiles.",
        "is_active": true,
        "display_order": 2
      }
    ],
    "layout_json": {
      "page": {
        "width": 794,
        "height": 1123,
        "background": "#FFFFFF",
        "backgroundType": "image",
        "backgroundImage": "/static/backgrounds/bg_tpl_90411229.jpg",
        "backgroundFit": "cover",
        "backgroundLocked": true,
        "padding": 40,
        "safeArea": {
          "top": 55,
          "right": 40,
          "bottom": 55,
          "left": 40
        },
        "fontFamily": "Playfair Display",
        "selectedDummyIndex": 8
      },
      "elements": [
        {
          "id": "header_shloka",
          "type": "text",
          "content": "॥ श्री गणेशाय नमः ॥",
          "fieldBinding": "pageHeader.deity",
          "x": 101,
          "y": 80,
          "width": 594,
          "height": 28,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#d4f099",
            "textAlign": "center",
            "fontFamily": "serif"
          }
        },
        {
          "id": "heading_personal",
          "type": "text",
          "content": "वैयक्तिक माहिती",
          "x": -120,
          "y": 140,
          "width": 594,
          "height": 28,
          "zIndex": 2,
          "style": {
            "fontSize": 22,
            "fontWeight": "bold",
            "color": "#cce29c",
            "textAlign": "center",
            "fontFamily": "serif"
          }
        },
        {
          "id": "f_name",
          "type": "text",
          "content": "नाव",
          "x": 90,
          "y": 185,
          "width": 220,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "v_name",
          "type": "text",
          "content": ": {{personalDetails.fullName}}",
          "fieldBinding": "personalDetails.fullName",
          "x": 278,
          "y": 185,
          "width": 440,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "600",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "f_dob",
          "type": "text",
          "content": "जन्म तारीख",
          "x": 90,
          "y": 210,
          "width": 220,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "v_dob",
          "type": "text",
          "content": ": {{personalDetails.dateOfBirth}}",
          "fieldBinding": "personalDetails.dateOfBirth",
          "x": 278,
          "y": 210,
          "width": 440,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "f_tob",
          "type": "text",
          "content": "जन्म वेळ",
          "x": 90,
          "y": 235,
          "width": 220,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "v_tob",
          "type": "text",
          "content": ": {{personalDetails.timeOfBirth}}",
          "fieldBinding": "personalDetails.timeOfBirth",
          "x": 278,
          "y": 235,
          "width": 440,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "f_pob",
          "type": "text",
          "content": "जन्म स्थळ",
          "x": 90,
          "y": 260,
          "width": 220,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "v_pob",
          "type": "text",
          "content": ": {{personalDetails.placeOfBirth}}",
          "fieldBinding": "personalDetails.placeOfBirth",
          "x": 278,
          "y": 260,
          "width": 440,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "f_rel",
          "type": "text",
          "content": "धर्म",
          "x": 90,
          "y": 285,
          "width": 220,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "v_rel",
          "type": "text",
          "content": ": {{personalDetails.religion}}",
          "fieldBinding": "personalDetails.religion",
          "x": 278,
          "y": 285,
          "width": 440,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "f_caste",
          "type": "text",
          "content": "जात",
          "x": 90,
          "y": 310,
          "width": 220,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "v_caste",
          "type": "text",
          "content": ": {{personalDetails.caste}}",
          "fieldBinding": "personalDetails.caste",
          "x": 278,
          "y": 310,
          "width": 440,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "f_kul",
          "type": "text",
          "content": "कुलदैवत",
          "x": 90,
          "y": 335,
          "width": 220,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "v_kul",
          "type": "text",
          "content": ": {{personalDetails.kuldevata}}",
          "fieldBinding": "personalDetails.kuldevata",
          "x": 278,
          "y": 335,
          "width": 314,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "f_gotra",
          "type": "text",
          "content": "गोत्र",
          "x": 90,
          "y": 360,
          "width": 220,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "v_gotra",
          "type": "text",
          "content": ": {{personalDetails.gotra}}",
          "fieldBinding": "personalDetails.gotra",
          "x": 278,
          "y": 360,
          "width": 440,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "f_rashi",
          "type": "text",
          "content": "राशी",
          "x": 90,
          "y": 385,
          "width": 220,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "v_rashi",
          "type": "text",
          "content": ": {{personalDetails.rashi}}",
          "fieldBinding": "personalDetails.rashi",
          "x": 278,
          "y": 385,
          "width": 440,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "f_nakshatra",
          "type": "text",
          "content": "नक्षत्र",
          "x": 90,
          "y": 410,
          "width": 220,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "v_nakshatra",
          "type": "text",
          "content": ": {{personalDetails.nakshatra}}",
          "fieldBinding": "personalDetails.nakshatra",
          "x": 278,
          "y": 410,
          "width": 440,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "f_gan",
          "type": "text",
          "content": "गण",
          "x": 90,
          "y": 435,
          "width": 220,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "v_gan",
          "type": "text",
          "content": ": {{personalDetails.gan}}",
          "fieldBinding": "personalDetails.gan",
          "x": 278,
          "y": 435,
          "width": 440,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "f_nadi",
          "type": "text",
          "content": "नाडी",
          "x": 90,
          "y": 460,
          "width": 220,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "v_nadi",
          "type": "text",
          "content": ": {{personalDetails.nadi}}",
          "fieldBinding": "personalDetails.nadi",
          "x": 278,
          "y": 460,
          "width": 440,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "f_height",
          "type": "text",
          "content": "उंची",
          "x": 90,
          "y": 485,
          "width": 220,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "v_height",
          "type": "text",
          "content": ": {{personalDetails.height}}",
          "fieldBinding": "personalDetails.height",
          "x": 278,
          "y": 485,
          "width": 440,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "f_complexion",
          "type": "text",
          "content": "वर्ण",
          "x": 90,
          "y": 510,
          "width": 220,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "v_complexion",
          "type": "text",
          "content": ": {{personalDetails.complexion}}",
          "fieldBinding": "personalDetails.complexion",
          "x": 278,
          "y": 510,
          "width": 440,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "f_blood",
          "type": "text",
          "content": "रक्तगट",
          "x": 90,
          "y": 535,
          "width": 220,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "v_blood",
          "type": "text",
          "content": ": {{personalDetails.bloodGroup}}",
          "fieldBinding": "personalDetails.bloodGroup",
          "x": 278,
          "y": 535,
          "width": 440,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "f_edu",
          "type": "text",
          "content": "शिक्षण",
          "x": 90,
          "y": 560,
          "width": 220,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "v_edu",
          "type": "text",
          "content": ": {{educationOccupation.education}}",
          "fieldBinding": "educationOccupation.education",
          "x": 278,
          "y": 560,
          "width": 440,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "f_occ",
          "type": "text",
          "content": "नोकरी/व्यवसाय",
          "x": 90,
          "y": 585,
          "width": 220,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "v_occ",
          "type": "text",
          "content": ": {{educationOccupation.occupation}}",
          "fieldBinding": "educationOccupation.occupation",
          "x": 278,
          "y": 585,
          "width": 440,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "f_income",
          "type": "text",
          "content": "वेतन/उत्पन्न",
          "x": 90,
          "y": 610,
          "width": 220,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "v_income",
          "type": "text",
          "content": ": {{educationOccupation.annualIncome}}",
          "fieldBinding": "educationOccupation.annualIncome",
          "x": 278,
          "y": 610,
          "width": 440,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "heading_family",
          "type": "text",
          "content": "कौटुंबिक माहिती",
          "x": -129,
          "y": 651,
          "width": 594,
          "height": 28,
          "zIndex": 2,
          "style": {
            "fontSize": 22,
            "fontWeight": "bold",
            "color": "#cce29c",
            "textAlign": "center",
            "fontFamily": "serif"
          }
        },
        {
          "id": "f_fname",
          "type": "text",
          "content": "वडिलांचे नाव",
          "x": 90,
          "y": 690,
          "width": 220,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "v_fname",
          "type": "text",
          "content": ": {{familyDetails.fatherName}}",
          "fieldBinding": "familyDetails.fatherName",
          "x": 278,
          "y": 690,
          "width": 440,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "f_focc",
          "type": "text",
          "content": "वडिलांचा व्यवसाय",
          "x": 90,
          "y": 715,
          "width": 220,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "v_focc",
          "type": "text",
          "content": ": {{familyDetails.fatherOccupation}}",
          "fieldBinding": "familyDetails.fatherOccupation",
          "x": 278,
          "y": 715,
          "width": 440,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "f_mname",
          "type": "text",
          "content": "आईचे नाव",
          "x": 90,
          "y": 740,
          "width": 220,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "v_mname",
          "type": "text",
          "content": ": {{familyDetails.motherName}}",
          "fieldBinding": "familyDetails.motherName",
          "x": 278,
          "y": 740,
          "width": 440,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "f_sis",
          "type": "text",
          "content": "बहीण",
          "x": 90,
          "y": 765,
          "width": 220,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "v_sis",
          "type": "text",
          "content": ": {{familyDetails.sisters}}",
          "fieldBinding": "familyDetails.sisters",
          "x": 278,
          "y": 765,
          "width": 440,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "f_bro",
          "type": "text",
          "content": "भाऊ",
          "x": 90,
          "y": 790,
          "width": 220,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "v_bro",
          "type": "text",
          "content": ": {{familyDetails.brothers}}",
          "fieldBinding": "familyDetails.brothers",
          "x": 278,
          "y": 790,
          "width": 440,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "heading_contact",
          "type": "text",
          "content": "संपर्क",
          "x": -130,
          "y": 860,
          "width": 594,
          "height": 28,
          "zIndex": 2,
          "style": {
            "fontSize": 22,
            "fontWeight": "bold",
            "color": "#cce29c",
            "textAlign": "center",
            "fontFamily": "serif"
          }
        },
        {
          "id": "f_address",
          "type": "text",
          "content": "पत्ता",
          "x": 90,
          "y": 907,
          "width": 220,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "v_address",
          "type": "text",
          "content": ": {{contactDetails.residenceAddress}}",
          "fieldBinding": "contactDetails.residenceAddress",
          "x": 278,
          "y": 925,
          "width": 440,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "f_phone",
          "type": "text",
          "content": "मो.नं.",
          "x": 90,
          "y": 974,
          "width": 220,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "v_phone",
          "type": "text",
          "content": ": {{contactDetails.primaryContact}}",
          "fieldBinding": "contactDetails.primaryContact",
          "x": 277,
          "y": 973,
          "width": 440,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#d4f099",
            "textAlign": "left"
          }
        },
        {
          "id": "el_1787550068793_950",
          "type": "decoration",
          "decorationKey": "om",
          "x": 375,
          "y": 11,
          "width": 44,
          "height": 64,
          "zIndex": 59,
          "rotation": 0,
          "style": {
            "color": "#B45309",
            "textAlign": "left",
            "fontFamily": "Playfair Display",
            "borderRadius": "0px",
            "objectFit": "cover"
          }
        },
        {
          "id": "el_1787550074228_502",
          "type": "image",
          "shapeType": "rounded",
          "x": 560,
          "y": 185,
          "width": 178,
          "height": 231,
          "zIndex": 60,
          "rotation": 0,
          "style": {
            "color": "#B45309",
            "textAlign": "left",
            "fontFamily": "Playfair Display",
            "borderRadius": "8px",
            "objectFit": "cover"
          },
          "content": "/sample_profiles/arjun.webp",
          "fieldBinding": "personalDetails.photoUrl"
        }
      ]
    }
  },
  {
    "id": "tpl_b15a6ded",
    "name": "Majestic Heritage",
    "slug": "majestic-heritage",
    "pricing_type": "PREMIUM",
    "badge": "#08",
    "dummy_index": 7,
    "thumbnail_image": "",
    "thumbnail_url": "",
    "default_bg": "#FFFFFF",
    "font_family": "Playfair Display",
    "preview_icon": "🏰",
    "categories": [
      {
        "id": "royal",
        "name": "Royal & Heritage",
        "slug": "royal",
        "icon": "⚜️",
        "description": "Grand maharajah heritage styling with ornate frames.",
        "is_active": true,
        "display_order": 5
      },
      {
        "id": "traditional",
        "name": "Traditional",
        "slug": "traditional",
        "icon": "🚩",
        "description": "Classic Indian traditional designs with sacred motifs and shlokas.",
        "is_active": true,
        "display_order": 1
      }
    ],
    "layout_json": {
      "page": {
        "width": 794,
        "height": 1123,
        "background": "#FFFFFF",
        "backgroundType": "image",
        "backgroundImage": "/static/backgrounds/bg_tpl_b15a6ded.jpg",
        "backgroundFit": "cover",
        "backgroundLocked": true,
        "padding": 40,
        "safeArea": {
          "top": 55,
          "right": 40,
          "bottom": 55,
          "left": 40
        },
        "fontFamily": "Playfair Display"
      },
      "elements": [
        {
          "id": "header_shloka",
          "type": "text",
          "content": "॥ श्री गणेशाय नमः ॥",
          "fieldBinding": "pageHeader.deity",
          "x": 140,
          "y": 60,
          "width": 546,
          "height": 28,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#ffdb9e",
            "textAlign": "center",
            "fontFamily": "serif"
          }
        },
        {
          "id": "f_name",
          "type": "text",
          "content": "नाव",
          "x": 115,
          "y": 148,
          "width": 172,
          "height": 29,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "v_name",
          "type": "text",
          "content": ": {{personalDetails.fullName}}",
          "fieldBinding": "personalDetails.fullName",
          "x": 335,
          "y": 153,
          "width": 392,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "600",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "f_dob",
          "type": "text",
          "content": "जन्म तारीख",
          "x": 115,
          "y": 178,
          "width": 172,
          "height": 29,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "v_dob",
          "type": "text",
          "content": ": {{personalDetails.dateOfBirth}}",
          "fieldBinding": "personalDetails.dateOfBirth",
          "x": 335,
          "y": 190,
          "width": 392,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "f_tob",
          "type": "text",
          "content": "जन्म वेळ",
          "x": 115,
          "y": 204,
          "width": 172,
          "height": 29,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "v_tob",
          "type": "text",
          "content": ": {{personalDetails.timeOfBirth}}",
          "fieldBinding": "personalDetails.timeOfBirth",
          "x": 335,
          "y": 215,
          "width": 392,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "f_pob",
          "type": "text",
          "content": "जन्म स्थळ",
          "x": 115,
          "y": 227,
          "width": 172,
          "height": 29,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "v_pob",
          "type": "text",
          "content": ": {{personalDetails.placeOfBirth}}",
          "fieldBinding": "personalDetails.placeOfBirth",
          "x": 335,
          "y": 236,
          "width": 392,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "f_rel",
          "type": "text",
          "content": "धर्म",
          "x": 115,
          "y": 256,
          "width": 172,
          "height": 29,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "v_rel",
          "type": "text",
          "content": ": {{personalDetails.religion}}",
          "fieldBinding": "personalDetails.religion",
          "x": 335,
          "y": 262,
          "width": 392,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "f_caste",
          "type": "text",
          "content": "जात",
          "x": 115,
          "y": 284,
          "width": 172,
          "height": 29,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "v_caste",
          "type": "text",
          "content": ": {{personalDetails.caste}}",
          "fieldBinding": "personalDetails.caste",
          "x": 335,
          "y": 284,
          "width": 392,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "f_kul",
          "type": "text",
          "content": "कुलदैवत",
          "x": 115,
          "y": 328,
          "width": 172,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "v_kul",
          "type": "text",
          "content": ": {{personalDetails.kuldevata}}",
          "fieldBinding": "personalDetails.kuldevata",
          "x": 335,
          "y": 329,
          "width": 392,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "f_gotra",
          "type": "text",
          "content": "गोत्र",
          "x": 115,
          "y": 348,
          "width": 172,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "v_gotra",
          "type": "text",
          "content": ": {{personalDetails.gotra}}",
          "fieldBinding": "personalDetails.gotra",
          "x": 335,
          "y": 349,
          "width": 392,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "f_rashi",
          "type": "text",
          "content": "राशी",
          "x": 115,
          "y": 368,
          "width": 172,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "v_rashi",
          "type": "text",
          "content": ": {{personalDetails.rashi}}",
          "fieldBinding": "personalDetails.rashi",
          "x": 335,
          "y": 369,
          "width": 392,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "f_nakshatra",
          "type": "text",
          "content": "नक्षत्र",
          "x": 115,
          "y": 388,
          "width": 172,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "v_nakshatra",
          "type": "text",
          "content": ": {{personalDetails.nakshatra}}",
          "fieldBinding": "personalDetails.nakshatra",
          "x": 335,
          "y": 389,
          "width": 392,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "f_gan",
          "type": "text",
          "content": "गण",
          "x": 115,
          "y": 428,
          "width": 172,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "v_gan",
          "type": "text",
          "content": ": {{personalDetails.gan}}",
          "fieldBinding": "personalDetails.gan",
          "x": 335,
          "y": 429,
          "width": 392,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "f_nadi",
          "type": "text",
          "content": "नाडी",
          "x": 115,
          "y": 448,
          "width": 172,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "v_nadi",
          "type": "text",
          "content": ": {{personalDetails.nadi}}",
          "fieldBinding": "personalDetails.nadi",
          "x": 335,
          "y": 449,
          "width": 392,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "f_height",
          "type": "text",
          "content": "उंची",
          "x": 115,
          "y": 468,
          "width": 172,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "v_height",
          "type": "text",
          "content": ": {{personalDetails.height}}",
          "fieldBinding": "personalDetails.height",
          "x": 335,
          "y": 469,
          "width": 392,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "f_complexion",
          "type": "text",
          "content": "वर्ण",
          "x": 115,
          "y": 488,
          "width": 172,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "v_complexion",
          "type": "text",
          "content": ": {{personalDetails.complexion}}",
          "fieldBinding": "personalDetails.complexion",
          "x": 335,
          "y": 489,
          "width": 392,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "f_blood",
          "type": "text",
          "content": "रक्तगट",
          "x": 115,
          "y": 528,
          "width": 172,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "v_blood",
          "type": "text",
          "content": ": {{personalDetails.bloodGroup}}",
          "fieldBinding": "personalDetails.bloodGroup",
          "x": 335,
          "y": 529,
          "width": 392,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "f_edu",
          "type": "text",
          "content": "शिक्षण",
          "x": 115,
          "y": 548,
          "width": 172,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "v_edu",
          "type": "text",
          "content": ": {{educationOccupation.education}}",
          "fieldBinding": "educationOccupation.education",
          "x": 335,
          "y": 549,
          "width": 392,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "f_occ",
          "type": "text",
          "content": "नोकरी/व्यवसाय",
          "x": 115,
          "y": 568,
          "width": 172,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "v_occ",
          "type": "text",
          "content": ": {{educationOccupation.occupation}}",
          "fieldBinding": "educationOccupation.occupation",
          "x": 335,
          "y": 569,
          "width": 392,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "f_income",
          "type": "text",
          "content": "वेतन/उत्पन्न",
          "x": 115,
          "y": 588,
          "width": 172,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "v_income",
          "type": "text",
          "content": ": {{educationOccupation.annualIncome}}",
          "fieldBinding": "educationOccupation.annualIncome",
          "x": 335,
          "y": 589,
          "width": 392,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "heading_family",
          "type": "text",
          "content": "कौटुंबिक माहिती",
          "x": 115,
          "y": 617,
          "width": 546,
          "height": 28,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#ffdb9e",
            "textAlign": "center",
            "fontFamily": "serif"
          }
        },
        {
          "id": "f_fname",
          "type": "text",
          "content": "वडिलांचे नाव",
          "x": 115,
          "y": 659,
          "width": 172,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "v_fname",
          "type": "text",
          "content": ": {{familyDetails.fatherName}}",
          "fieldBinding": "familyDetails.fatherName",
          "x": 335,
          "y": 662,
          "width": 392,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "f_focc",
          "type": "text",
          "content": "वडिलांचा व्यवसाय",
          "x": 115,
          "y": 691,
          "width": 196,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "v_focc",
          "type": "text",
          "content": ": {{familyDetails.fatherOccupation}}",
          "fieldBinding": "familyDetails.fatherOccupation",
          "x": 335,
          "y": 690,
          "width": 392,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "f_mname",
          "type": "text",
          "content": "आईचे नाव",
          "x": 115,
          "y": 718,
          "width": 172,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "v_mname",
          "type": "text",
          "content": ": {{familyDetails.motherName}}",
          "fieldBinding": "familyDetails.motherName",
          "x": 335,
          "y": 719,
          "width": 392,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "f_sis",
          "type": "text",
          "content": "बहीण",
          "x": 115,
          "y": 741,
          "width": 172,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "v_sis",
          "type": "text",
          "content": ": {{familyDetails.sisters}}",
          "fieldBinding": "familyDetails.sisters",
          "x": 335,
          "y": 742,
          "width": 392,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "f_bro",
          "type": "text",
          "content": "भाऊ",
          "x": 115,
          "y": 768,
          "width": 172,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "v_bro",
          "type": "text",
          "content": ": {{familyDetails.brothers}}",
          "fieldBinding": "familyDetails.brothers",
          "x": 335,
          "y": 769,
          "width": 392,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "f_mama",
          "type": "text",
          "content": "मामा",
          "x": 115,
          "y": 797,
          "width": 172,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "v_mama",
          "type": "text",
          "content": ": {{familyDetails.maternalUncle}}",
          "fieldBinding": "familyDetails.maternalUncle",
          "x": 335,
          "y": 798,
          "width": 392,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "f_relatives",
          "type": "text",
          "content": "नातेसंबंध",
          "x": 115,
          "y": 817,
          "width": 172,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "v_relatives",
          "type": "text",
          "content": ": {{familyDetails.relations}}",
          "fieldBinding": "familyDetails.relations",
          "x": 335,
          "y": 818,
          "width": 392,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "heading_contact",
          "type": "text",
          "content": "संपर्क",
          "x": 115,
          "y": 865,
          "width": 546,
          "height": 28,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#ffdb9e",
            "textAlign": "center",
            "fontFamily": "serif"
          }
        },
        {
          "id": "f_address",
          "type": "text",
          "content": "पत्ता",
          "x": 115,
          "y": 908,
          "width": 172,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "v_address",
          "type": "text",
          "content": ": {{contactDetails.residenceAddress}}",
          "fieldBinding": "contactDetails.residenceAddress",
          "x": 335,
          "y": 917,
          "width": 351,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "f_phone",
          "type": "text",
          "content": "मो.नं.",
          "x": 115,
          "y": 957,
          "width": 172,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "bold",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "v_phone",
          "type": "text",
          "content": ": {{contactDetails.primaryContact}}",
          "fieldBinding": "contactDetails.primaryContact",
          "x": 335,
          "y": 958,
          "width": 392,
          "height": 22,
          "zIndex": 2,
          "style": {
            "fontSize": 19,
            "fontWeight": "500",
            "color": "#ffdb9e",
            "textAlign": "left"
          }
        },
        {
          "id": "el_1787532535389_385",
          "type": "decoration",
          "decorationKey": "om",
          "x": 372,
          "y": 0,
          "width": 50,
          "height": 60,
          "zIndex": 59,
          "rotation": 0,
          "style": {
            "color": "#B45309",
            "textAlign": "left",
            "fontFamily": "Playfair Display",
            "borderRadius": "0px",
            "objectFit": "cover"
          }
        },
        {
          "id": "el_1787532545548_12",
          "type": "image",
          "shapeType": "rounded",
          "x": 540,
          "y": 153,
          "width": 184,
          "height": 221,
          "zIndex": 60,
          "rotation": 0,
          "style": {
            "color": "#B45309",
            "textAlign": "left",
            "fontFamily": "Playfair Display",
            "borderRadius": "8px",
            "objectFit": "cover"
          },
          "content": "/sample_profiles/lakshmi.webp",
          "fieldBinding": "personalDetails.photoUrl"
        }
      ]
    }
  },
  {
    "id": "tpl_ffd40008",
    "name": "Pure Details",
    "slug": "new-royal-biodata",
    "pricing_type": "FREE",
    "badge": "#09",
    "dummy_index": 8,
    "thumbnail_image": "",
    "thumbnail_url": "",
    "default_bg": "#FFFFFF",
    "font_family": "Playfair Display",
    "preview_icon": "📄",
    "categories": [
      {
        "id": "royal",
        "name": "Royal & Heritage",
        "slug": "royal",
        "icon": "⚜️",
        "description": "Grand maharajah heritage styling with ornate frames.",
        "is_active": true,
        "display_order": 5
      }
    ],
    "layout_json": {
      "page": {
        "width": 794,
        "height": 1123,
        "background": "#FFFFFF",
        "backgroundType": "color",
        "backgroundFit": "cover",
        "backgroundLocked": true,
        "padding": 40,
        "safeArea": {
          "top": 55,
          "right": 40,
          "bottom": 55,
          "left": 40
        },
        "fontFamily": "Playfair Display",
        "selectedDummyIndex": 0
      },
      "elements": [
        {
          "id": "header_shloka",
          "type": "text",
          "content": "॥ श्री गणेशाय नमः ॥",
          "fieldBinding": "pageHeader.deity",
          "x": 110,
          "y": 80,
          "width": 167,
          "height": 28,
          "zIndex": 2,
          "style": {
            "fontSize": 17,
            "fontWeight": "bold",
            "color": "#8B0000",
            "textAlign": "center",
            "fontFamily": "serif"
          }
        },
        {
          "id": "heading_personal",
          "type": "text",
          "content": "— वैयक्तिक माहिती —",
          "x": 110,
          "y": 148,
          "width": 161,
          "height": 26,
          "zIndex": 2,
          "style": {
            "fontSize": 16,
            "fontWeight": "bold",
            "color": "#1E293B",
            "textAlign": "center",
            "fontFamily": "serif"
          }
        },
        {
          "id": "f_name",
          "type": "text",
          "content": "नाव",
          "x": 110,
          "y": 175,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_name",
          "type": "text",
          "content": ": {{personalDetails.fullName}}",
          "fieldBinding": "personalDetails.fullName",
          "x": 275,
          "y": 175,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "600",
            "color": "#1E293B",
            "textAlign": "left"
          }
        },
        {
          "id": "f_dob",
          "type": "text",
          "content": "जन्म तारीख",
          "x": 110,
          "y": 198,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_dob",
          "type": "text",
          "content": ": {{personalDetails.dateOfBirth}}",
          "fieldBinding": "personalDetails.dateOfBirth",
          "x": 275,
          "y": 198,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_tob",
          "type": "text",
          "content": "जन्म वेळ",
          "x": 110,
          "y": 221,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_tob",
          "type": "text",
          "content": ": {{personalDetails.timeOfBirth}}",
          "fieldBinding": "personalDetails.timeOfBirth",
          "x": 275,
          "y": 221,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_pob",
          "type": "text",
          "content": "जन्म स्थळ",
          "x": 110,
          "y": 244,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_pob",
          "type": "text",
          "content": ": {{personalDetails.placeOfBirth}}",
          "fieldBinding": "personalDetails.placeOfBirth",
          "x": 275,
          "y": 244,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_rel",
          "type": "text",
          "content": "धर्म",
          "x": 110,
          "y": 267,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_rel",
          "type": "text",
          "content": ": {{personalDetails.religion}}",
          "fieldBinding": "personalDetails.religion",
          "x": 275,
          "y": 267,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_caste",
          "type": "text",
          "content": "जात",
          "x": 110,
          "y": 290,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_caste",
          "type": "text",
          "content": ": {{personalDetails.caste}}",
          "fieldBinding": "personalDetails.caste",
          "x": 275,
          "y": 290,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_kul",
          "type": "text",
          "content": "कुलदैवत",
          "x": 110,
          "y": 313,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_kul",
          "type": "text",
          "content": ": {{personalDetails.kuldevata}}",
          "fieldBinding": "personalDetails.kuldevata",
          "x": 275,
          "y": 313,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_gotra",
          "type": "text",
          "content": "गोत्र",
          "x": 110,
          "y": 336,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_gotra",
          "type": "text",
          "content": ": {{personalDetails.gotra}}",
          "fieldBinding": "personalDetails.gotra",
          "x": 275,
          "y": 336,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_rashi",
          "type": "text",
          "content": "राशी",
          "x": 110,
          "y": 359,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_rashi",
          "type": "text",
          "content": ": {{personalDetails.rashi}}",
          "fieldBinding": "personalDetails.rashi",
          "x": 275,
          "y": 359,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_nakshatra",
          "type": "text",
          "content": "नक्षत्र",
          "x": 110,
          "y": 382,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_nakshatra",
          "type": "text",
          "content": ": {{personalDetails.nakshatra}}",
          "fieldBinding": "personalDetails.nakshatra",
          "x": 275,
          "y": 382,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_gan",
          "type": "text",
          "content": "गण",
          "x": 110,
          "y": 405,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_gan",
          "type": "text",
          "content": ": {{personalDetails.gan}}",
          "fieldBinding": "personalDetails.gan",
          "x": 275,
          "y": 405,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_nadi",
          "type": "text",
          "content": "नाडी",
          "x": 110,
          "y": 428,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_nadi",
          "type": "text",
          "content": ": {{personalDetails.nadi}}",
          "fieldBinding": "personalDetails.nadi",
          "x": 275,
          "y": 428,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_height",
          "type": "text",
          "content": "उंची",
          "x": 110,
          "y": 451,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_height",
          "type": "text",
          "content": ": {{personalDetails.height}}",
          "fieldBinding": "personalDetails.height",
          "x": 275,
          "y": 451,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_complexion",
          "type": "text",
          "content": "वर्ण",
          "x": 110,
          "y": 474,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_complexion",
          "type": "text",
          "content": ": {{personalDetails.complexion}}",
          "fieldBinding": "personalDetails.complexion",
          "x": 275,
          "y": 474,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_blood",
          "type": "text",
          "content": "रक्तगट",
          "x": 110,
          "y": 497,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_blood",
          "type": "text",
          "content": ": {{personalDetails.bloodGroup}}",
          "fieldBinding": "personalDetails.bloodGroup",
          "x": 275,
          "y": 497,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_edu",
          "type": "text",
          "content": "शिक्षण",
          "x": 110,
          "y": 520,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_edu",
          "type": "text",
          "content": ": {{educationOccupation.education}}",
          "fieldBinding": "educationOccupation.education",
          "x": 275,
          "y": 520,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_occ",
          "type": "text",
          "content": "नोकरी/व्यवसाय",
          "x": 110,
          "y": 543,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_occ",
          "type": "text",
          "content": ": {{educationOccupation.occupation}}",
          "fieldBinding": "educationOccupation.occupation",
          "x": 275,
          "y": 543,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_income",
          "type": "text",
          "content": "वेतन/उत्पन्न",
          "x": 110,
          "y": 566,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_income",
          "type": "text",
          "content": ": {{educationOccupation.annualIncome}}",
          "fieldBinding": "educationOccupation.annualIncome",
          "x": 275,
          "y": 566,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "heading_family",
          "type": "text",
          "content": "— कौटुंबिक माहिती —",
          "x": 110,
          "y": 611,
          "width": 149,
          "height": 26,
          "zIndex": 2,
          "style": {
            "fontSize": 16,
            "fontWeight": "bold",
            "color": "#1E293B",
            "textAlign": "center",
            "fontFamily": "serif"
          }
        },
        {
          "id": "f_fname",
          "type": "text",
          "content": "वडिलांचे नाव",
          "x": 110,
          "y": 639,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_fname",
          "type": "text",
          "content": ": {{familyDetails.fatherName}}",
          "fieldBinding": "familyDetails.fatherName",
          "x": 275,
          "y": 639,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_focc",
          "type": "text",
          "content": "वडिलांचा व्यवसाय",
          "x": 110,
          "y": 662,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_focc",
          "type": "text",
          "content": ": {{familyDetails.fatherOccupation}}",
          "fieldBinding": "familyDetails.fatherOccupation",
          "x": 275,
          "y": 662,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_mname",
          "type": "text",
          "content": "आईचे नाव",
          "x": 110,
          "y": 685,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_mname",
          "type": "text",
          "content": ": {{familyDetails.motherName}}",
          "fieldBinding": "familyDetails.motherName",
          "x": 275,
          "y": 685,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_sis",
          "type": "text",
          "content": "बहीण",
          "x": 110,
          "y": 708,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_sis",
          "type": "text",
          "content": ": {{familyDetails.sisters}}",
          "fieldBinding": "familyDetails.sisters",
          "x": 275,
          "y": 708,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_bro",
          "type": "text",
          "content": "भाऊ",
          "x": 110,
          "y": 731,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_bro",
          "type": "text",
          "content": ": {{familyDetails.brothers}}",
          "fieldBinding": "familyDetails.brothers",
          "x": 275,
          "y": 731,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_mama",
          "type": "text",
          "content": "मामा",
          "x": 110,
          "y": 754,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_mama",
          "type": "text",
          "content": ": {{familyDetails.maternalUncle}}",
          "fieldBinding": "familyDetails.maternalUncle",
          "x": 275,
          "y": 754,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_relatives",
          "type": "text",
          "content": "नातेसंबंध",
          "x": 110,
          "y": 777,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_relatives",
          "type": "text",
          "content": ": {{familyDetails.relations}}",
          "fieldBinding": "familyDetails.relations",
          "x": 275,
          "y": 777,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "heading_contact",
          "type": "text",
          "content": "— संपर्क —",
          "x": 110,
          "y": 811,
          "width": 158,
          "height": 26,
          "zIndex": 2,
          "style": {
            "fontSize": 16,
            "fontWeight": "bold",
            "color": "#1E293B",
            "textAlign": "center",
            "fontFamily": "serif"
          }
        },
        {
          "id": "f_address",
          "type": "text",
          "content": "पत्ता",
          "x": 110,
          "y": 843,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_address",
          "type": "text",
          "content": ": {{contactDetails.residenceAddress}}",
          "fieldBinding": "contactDetails.residenceAddress",
          "x": 275,
          "y": 843,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_phone",
          "type": "text",
          "content": "मो.नं.",
          "x": 110,
          "y": 866,
          "width": 155,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_phone",
          "type": "text",
          "content": ": {{contactDetails.primaryContact}}",
          "fieldBinding": "contactDetails.primaryContact",
          "x": 275,
          "y": 866,
          "width": 410,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 13,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        }
      ]
    }
  },
  {
    "id": "tpl_3995806b",
    "name": "Minimal",
    "slug": "minimal",
    "pricing_type": "FREE",
    "badge": "#10",
    "dummy_index": 9,
    "thumbnail_image": "",
    "thumbnail_url": "",
    "default_bg": "#FFFFFF",
    "font_family": "Playfair Display",
    "preview_icon": "🌿",
    "categories": [
      {
        "id": "modern",
        "name": "Modern",
        "slug": "modern",
        "icon": "✨",
        "description": "Clean, minimal, modern aesthetic for contemporary profiles.",
        "is_active": true,
        "display_order": 2
      }
    ],
    "layout_json": {
      "page": {
        "width": 794,
        "height": 1123,
        "background": "#FFFFFF",
        "backgroundType": "image",
        "backgroundImage": "/static/backgrounds/bg_tpl_3995806b.jpg",
        "backgroundFit": "cover",
        "backgroundLocked": true,
        "padding": 40,
        "safeArea": {
          "top": 55,
          "right": 40,
          "bottom": 55,
          "left": 40
        },
        "fontFamily": "Playfair Display",
        "selectedDummyIndex": 3
      },
      "elements": [
        {
          "id": "header_shloka",
          "type": "text",
          "content": "॥ श्री गणेशाय नमः ॥",
          "fieldBinding": "pageHeader.deity",
          "x": 100,
          "y": 129,
          "width": 594,
          "height": 28,
          "zIndex": 2,
          "style": {
            "fontSize": 17,
            "fontWeight": "bold",
            "color": "#8B0000",
            "textAlign": "center",
            "fontFamily": "serif"
          }
        },
        {
          "id": "heading_personal",
          "type": "text",
          "content": "— वैयक्तिक माहिती —",
          "x": 81,
          "y": 191,
          "width": 632,
          "height": 26,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "bold",
            "color": "#1E293B",
            "textAlign": "center",
            "fontFamily": "serif"
          }
        },
        {
          "id": "f_name",
          "type": "text",
          "content": "नाव",
          "x": 119,
          "y": 226,
          "width": 193,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_name",
          "type": "text",
          "content": ": {{personalDetails.fullName}}",
          "fieldBinding": "personalDetails.fullName",
          "x": 297,
          "y": 226,
          "width": 448,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "600",
            "color": "#1E293B",
            "textAlign": "left"
          }
        },
        {
          "id": "f_dob",
          "type": "text",
          "content": "जन्म तारीख",
          "x": 119,
          "y": 249,
          "width": 193,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_dob",
          "type": "text",
          "content": ": {{personalDetails.dateOfBirth}}",
          "fieldBinding": "personalDetails.dateOfBirth",
          "x": 297,
          "y": 249,
          "width": 448,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_tob",
          "type": "text",
          "content": "जन्म वेळ",
          "x": 119,
          "y": 272,
          "width": 193,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_tob",
          "type": "text",
          "content": ": {{personalDetails.timeOfBirth}}",
          "fieldBinding": "personalDetails.timeOfBirth",
          "x": 297,
          "y": 272,
          "width": 448,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_pob",
          "type": "text",
          "content": "जन्म स्थळ",
          "x": 119,
          "y": 295,
          "width": 193,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_pob",
          "type": "text",
          "content": ": {{personalDetails.placeOfBirth}}",
          "fieldBinding": "personalDetails.placeOfBirth",
          "x": 297,
          "y": 295,
          "width": 448,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_rel",
          "type": "text",
          "content": "धर्म",
          "x": 119,
          "y": 318,
          "width": 193,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_rel",
          "type": "text",
          "content": ": {{personalDetails.religion}}",
          "fieldBinding": "personalDetails.religion",
          "x": 297,
          "y": 318,
          "width": 448,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_caste",
          "type": "text",
          "content": "जात",
          "x": 119,
          "y": 341,
          "width": 193,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_caste",
          "type": "text",
          "content": ": {{personalDetails.caste}}",
          "fieldBinding": "personalDetails.caste",
          "x": 297,
          "y": 341,
          "width": 448,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_kul",
          "type": "text",
          "content": "कुलदैवत",
          "x": 119,
          "y": 364,
          "width": 193,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_kul",
          "type": "text",
          "content": ": {{personalDetails.kuldevata}}",
          "fieldBinding": "personalDetails.kuldevata",
          "x": 297,
          "y": 364,
          "width": 448,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_rashi",
          "type": "text",
          "content": "राशी",
          "x": 119,
          "y": 394,
          "width": 193,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_rashi",
          "type": "text",
          "content": ": {{personalDetails.rashi}}",
          "fieldBinding": "personalDetails.rashi",
          "x": 297,
          "y": 394,
          "width": 448,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_nakshatra",
          "type": "text",
          "content": "नक्षत्र",
          "x": 119,
          "y": 417,
          "width": 193,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_nakshatra",
          "type": "text",
          "content": ": {{personalDetails.nakshatra}}",
          "fieldBinding": "personalDetails.nakshatra",
          "x": 297,
          "y": 417,
          "width": 448,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_gan",
          "type": "text",
          "content": "गण",
          "x": 119,
          "y": 440,
          "width": 193,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_gan",
          "type": "text",
          "content": ": {{personalDetails.gan}}",
          "fieldBinding": "personalDetails.gan",
          "x": 297,
          "y": 440,
          "width": 448,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_height",
          "type": "text",
          "content": "उंची",
          "x": 119,
          "y": 481,
          "width": 193,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_height",
          "type": "text",
          "content": ": {{personalDetails.height}}",
          "fieldBinding": "personalDetails.height",
          "x": 297,
          "y": 481,
          "width": 448,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_complexion",
          "type": "text",
          "content": "वर्ण",
          "x": 119,
          "y": 504,
          "width": 193,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_complexion",
          "type": "text",
          "content": ": {{personalDetails.complexion}}",
          "fieldBinding": "personalDetails.complexion",
          "x": 297,
          "y": 504,
          "width": 448,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_blood",
          "type": "text",
          "content": "रक्तगट",
          "x": 119,
          "y": 527,
          "width": 193,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_blood",
          "type": "text",
          "content": ": {{personalDetails.bloodGroup}}",
          "fieldBinding": "personalDetails.bloodGroup",
          "x": 297,
          "y": 527,
          "width": 448,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_edu",
          "type": "text",
          "content": "शिक्षण",
          "x": 119,
          "y": 550,
          "width": 193,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_edu",
          "type": "text",
          "content": ": {{educationOccupation.education}}",
          "fieldBinding": "educationOccupation.education",
          "x": 297,
          "y": 550,
          "width": 448,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_occ",
          "type": "text",
          "content": "नोकरी/व्यवसाय",
          "x": 119,
          "y": 573,
          "width": 193,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_occ",
          "type": "text",
          "content": ": {{educationOccupation.occupation}}",
          "fieldBinding": "educationOccupation.occupation",
          "x": 297,
          "y": 573,
          "width": 448,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_income",
          "type": "text",
          "content": "वेतन/उत्पन्न",
          "x": 119,
          "y": 596,
          "width": 193,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_income",
          "type": "text",
          "content": ": {{educationOccupation.annualIncome}}",
          "fieldBinding": "educationOccupation.annualIncome",
          "x": 297,
          "y": 596,
          "width": 448,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "heading_family",
          "type": "text",
          "content": "— कौटुंबिक माहिती —",
          "x": 109,
          "y": 628,
          "width": 632,
          "height": 26,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "bold",
            "color": "#1E293B",
            "textAlign": "center",
            "fontFamily": "serif"
          }
        },
        {
          "id": "f_fname",
          "type": "text",
          "content": "वडिलांचे नाव",
          "x": 119,
          "y": 658,
          "width": 193,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_fname",
          "type": "text",
          "content": ": {{familyDetails.fatherName}}",
          "fieldBinding": "familyDetails.fatherName",
          "x": 297,
          "y": 658,
          "width": 448,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_focc",
          "type": "text",
          "content": "वडिलांचा व्यवसाय",
          "x": 119,
          "y": 681,
          "width": 193,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_focc",
          "type": "text",
          "content": ": {{familyDetails.fatherOccupation}}",
          "fieldBinding": "familyDetails.fatherOccupation",
          "x": 297,
          "y": 681,
          "width": 448,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_mname",
          "type": "text",
          "content": "आईचे नाव",
          "x": 119,
          "y": 704,
          "width": 193,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_mname",
          "type": "text",
          "content": ": {{familyDetails.motherName}}",
          "fieldBinding": "familyDetails.motherName",
          "x": 297,
          "y": 704,
          "width": 448,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_sis",
          "type": "text",
          "content": "बहीण",
          "x": 119,
          "y": 727,
          "width": 193,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_sis",
          "type": "text",
          "content": ": {{familyDetails.sisters}}",
          "fieldBinding": "familyDetails.sisters",
          "x": 297,
          "y": 727,
          "width": 448,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_bro",
          "type": "text",
          "content": "भाऊ",
          "x": 119,
          "y": 750,
          "width": 193,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_bro",
          "type": "text",
          "content": ": {{familyDetails.brothers}}",
          "fieldBinding": "familyDetails.brothers",
          "x": 297,
          "y": 750,
          "width": 448,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "heading_contact",
          "type": "text",
          "content": "— संपर्क —",
          "x": 109,
          "y": 809,
          "width": 632,
          "height": 26,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "bold",
            "color": "#1E293B",
            "textAlign": "center",
            "fontFamily": "serif"
          }
        },
        {
          "id": "f_address",
          "type": "text",
          "content": "पत्ता",
          "x": 119,
          "y": 839,
          "width": 193,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_address",
          "type": "text",
          "content": ": {{contactDetails.residenceAddress}}",
          "fieldBinding": "contactDetails.residenceAddress",
          "x": 297,
          "y": 839,
          "width": 448,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "f_phone",
          "type": "text",
          "content": "मो.नं.",
          "x": 119,
          "y": 862,
          "width": 193,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "bold",
            "color": "#0F172A",
            "textAlign": "left"
          }
        },
        {
          "id": "v_phone",
          "type": "text",
          "content": ": {{contactDetails.primaryContact}}",
          "fieldBinding": "contactDetails.primaryContact",
          "x": 297,
          "y": 862,
          "width": 448,
          "height": 21,
          "zIndex": 2,
          "style": {
            "fontSize": 18,
            "fontWeight": "500",
            "color": "#334155",
            "textAlign": "left"
          }
        },
        {
          "id": "el_1788167459955_244",
          "type": "decoration",
          "decorationKey": "om",
          "x": 361,
          "y": 60,
          "width": 72,
          "height": 66,
          "zIndex": 55,
          "rotation": 0,
          "style": {
            "color": "#B45309",
            "textAlign": "left",
            "fontFamily": "Playfair Display",
            "borderRadius": "0px",
            "objectFit": "cover"
          }
        },
        {
          "id": "el_1788167469253_308",
          "type": "image",
          "content": "/sample_profiles/megha.webp",
          "fieldBinding": "personalDetails.photoUrl",
          "shapeType": "rounded",
          "x": 520,
          "y": 226,
          "width": 199,
          "height": 276,
          "zIndex": 56,
          "rotation": 0,
          "style": {
            "color": "#B45309",
            "textAlign": "left",
            "fontFamily": "Playfair Display",
            "borderRadius": "8px",
            "objectFit": "cover"
          }
        }
      ]
    }
  }
];
