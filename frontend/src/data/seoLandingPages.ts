export interface SeoFaqItem {
  question: string;
  answer: string;
}

export interface SeoReasonItem {
  title: string;
  description: string;
  icon?: string;
}

export interface SeoStepItem {
  stepNumber: number;
  title: string;
  description: string;
}

export interface SeoFieldSample {
  label: string;
  value: string;
  category: 'personal' | 'education_career' | 'family' | 'horoscope' | 'contact';
}

export interface SeoSampleProfile {
  name: string;
  title: string;
  photoUrl?: string;
  fields: SeoFieldSample[];
}

export interface SeoLandingPageData {
  slug: string;
  category: 'maker' | 'format' | 'language' | 'religion' | 'guide';
  primaryKeyword: string;
  title: string;
  description: string;
  canonicalPath: string;
  h1: string;
  nativeH1?: string;
  nativeScript?: string;
  subheading: string;
  badge: string;
  themeColor: string;
  ctaText?: string;
  previewCtaText?: string;
  boyTabLabel?: string;
  girlTabLabel?: string;
  whySection: {
    heading: string;
    intro: string;
    reasons: SeoReasonItem[];
  };
  howSection: {
    heading: string;
    intro: string;
    workflowSteps: SeoStepItem[];
    keyElementsToInclude: string[];
    dosAndDonts: {
      dos: string[];
      donts: string[];
    };
    terminologyGlossary?: { term: string; meaning: string; native?: string }[];
  };
  whereSection: {
    heading: string;
    intro: string;
    useCases: { title: string; description: string }[];
    downloadAndShareDetails: string;
  };
  sampleBiodatas: {
    boySample?: SeoSampleProfile;
    girlSample?: SeoSampleProfile;
    primarySample?: SeoSampleProfile;
  };
  faqs: SeoFaqItem[];
  relatedSlugs: string[];
}

export const SEO_LANDING_PAGES: Record<string, SeoLandingPageData> = {
  "free-marriage-biodata-maker": {
    "slug": "free-marriage-biodata-maker",
    "category": "maker",
    "primaryKeyword": "Free marriage biodata maker",
    "title": "Free Marriage Biodata Maker Online — Create & Download PDF | TrueMarriage",
    "description": "Create an Indian marriage biodata online for free. Choose from 100+ royal, modern, and traditional layouts. Download an unwatermarked A4 PDF in minutes.",
    "canonicalPath": "/biodata/free-marriage-biodata-maker",
    "h1": "Free Marriage Biodata Maker Online",
    "subheading": "Build a clean, high-resolution matrimonial biodata in minutes. Handcrafted Indian layouts, balanced typography, and free PDF download without watermark tricks or paywalls.",
    "badge": "100% Free PDF • Zero Watermarks",
    "themeColor": "#F01472",
    "whySection": {
      "heading": "Why Families Use an Online Marriage Biodata Maker",
      "intro": "When parents and prospective in-laws exchange marriage proposals, the biodata is their first look at the candidate’s education, upbringing, and family background. Drafting one in Word or PowerPoint usually creates misaligned tables, awkward margins on phones, and blurry photos.",
      "reasons": [
        {
          "title": "Clear First Impressions",
          "description": "A neat, well-spaced biodata shows care and respect toward the other family. It makes basic facts easy to scan without confusion."
        },
        {
          "title": "Zero Hidden Paywalls or Watermarks",
          "description": "Most biodata websites let you enter all your details and then demand ₹499 to remove large watermarks. TrueMarriage exports clean, unbranded PDFs for free."
        },
        {
          "title": "Built for Indian Matrimonial Traditions",
          "description": "Includes dedicated sections for gotra, maternal roots (mama ji), kuldaivat, horoscope parameters, and sibling marital status."
        },
        {
          "title": "Crisp on WhatsApp & In Print",
          "description": "Vector text stays sharp on smartphone screens, does not compress into blurry artifacts when sent on WhatsApp, and prints cleanly on standard A4 paper."
        }
      ]
    },
    "howSection": {
      "heading": "How to Create Your Marriage Biodata",
      "intro": "Follow this simple 5-step process to build a print-ready biodata in under 5 minutes.",
      "workflowSteps": [
        {
          "stepNumber": 1,
          "title": "Open the Maker",
          "description": "Open the TrueMarriage editor in your browser on your phone or laptop."
        },
        {
          "stepNumber": 2,
          "title": "Enter Your Details",
          "description": "Type your personal, academic, job, family, and astrological information into organized boxes."
        },
        {
          "stepNumber": 3,
          "title": "Choose a Layout",
          "description": "Pick from royal gold archways, traditional vermillion, floral, or modern clean designs."
        },
        {
          "stepNumber": 4,
          "title": "Check the Live Preview",
          "description": "Review font contrast, photo alignment, and spelling of names and gotras in real time."
        },
        {
          "stepNumber": 5,
          "title": "Download Free PDF",
          "description": "Save your high-resolution A4 PDF straight to your device, ready to share on WhatsApp."
        }
      ],
      "keyElementsToInclude": [
        "Full name and recent portrait photo with clean lighting",
        "Date, exact time, and city of birth (for horoscope verification)",
        "Height, education degree, college, and current job title",
        "Father’s and mother’s occupations and ancestral town",
        "Brothers and sisters with their education and marital status",
        "Gotra, Kuldevi, or community details (if observed by your family)",
        "Parent or guardian phone number and residential city"
      ],
      "dosAndDonts": {
        "dos": [
          "Use a warm, natural portrait with good lighting instead of a cropped wedding guest picture.",
          "Double-check birth time and place with your birth chart or hospital record.",
          "Mention your highest degree and job designation clearly."
        ],
        "donts": [
          "Do not use selfies with dark sunglasses, party filters, or tilted angles.",
          "Do not share full home door numbers or sensitive IDs on initial circulation.",
          "Avoid writing long paragraphs of partner demands—keep preferences polite and open."
        ]
      }
    },
    "whereSection": {
      "heading": "Where to Share Your Marriage Biodata",
      "intro": "Once your PDF is downloaded, you can circulate it through standard family channels:",
      "useCases": [
        {
          "title": "Direct WhatsApp Sharing",
          "description": "Forward the lightweight vector PDF to prospective families and elders without image compression."
        },
        {
          "title": "Samaj & Community Sammelans",
          "description": "Print on 120gsm bond paper for regional community matchmaking meets."
        },
        {
          "title": "Family Pandits & Astrologers",
          "description": "Share accurate birth coordinates for Guna Milan and horoscope matching."
        },
        {
          "title": "First Home Visit",
          "description": "Keep 2-3 printed copies ready to hand to visiting family members alongside tea."
        }
      ],
      "downloadAndShareDetails": "All files export in standard international A4 format (210 x 297 mm) with embedded vector fonts."
    },
    "sampleBiodatas": {
      "boySample": {
        "name": "Aarav Sharma",
        "title": "Senior Software Engineer • M.Tech (IIT Bombay)",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "14 November 1996 (29 Years)",
            "category": "personal"
          },
          {
            "label": "Height",
            "value": "5 ft 11 in (180 cm)",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "B.Tech + M.Tech in Computer Science, IIT Bombay",
            "category": "education_career"
          },
          {
            "label": "Occupation",
            "value": "Senior Software Engineer at Oracle, Bangalore",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "Dr. Rakesh Sharma (Chief Medical Officer, Retd.)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Mrs. Sunita Sharma (Homemaker)",
            "category": "family"
          },
          {
            "label": "Gotra",
            "value": "Bharadwaja | Manglik: No",
            "category": "horoscope"
          },
          {
            "label": "Contact",
            "value": "+91 98765 43210 (Father) • Bangalore / Jaipur",
            "category": "contact"
          }
        ]
      },
      "girlSample": {
        "name": "Ananya Deshmukh",
        "title": "Chartered Accountant • Senior Financial Analyst",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "22 August 1998 (27 Years)",
            "category": "personal"
          },
          {
            "label": "Height",
            "value": "5 ft 5 in (165 cm)",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "B.Com (Hons), Chartered Accountant (ICAI)",
            "category": "education_career"
          },
          {
            "label": "Occupation",
            "value": "Senior Financial Analyst at Deloitte, Mumbai",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "Shri Milind Deshmukh (Businessman, Real Estate)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Mrs. Vandana Deshmukh (M.A., Educator)",
            "category": "family"
          },
          {
            "label": "Gotra",
            "value": "Kashyap | Rashi: Kanya | Nakshatra: Hasta",
            "category": "horoscope"
          },
          {
            "label": "Contact",
            "value": "+91 98220 12345 (Parents) • Pune / Mumbai",
            "category": "contact"
          }
        ]
      }
    },
    "faqs": [
      {
        "question": "Is TrueMarriage really free to download?",
        "answer": "Yes. You can customize any template, edit fonts, upload photos, and download the full A4 PDF with zero watermarks for free."
      },
      {
        "question": "Can I edit my biodata later if my job or city changes?",
        "answer": "Yes. Your draft stays in your browser so you can return, update your designation or phone number, and export a fresh copy anytime."
      },
      {
        "question": "Does this work on my mobile phone?",
        "answer": "Yes. TrueMarriage works directly inside Chrome and Safari on Android and iPhone with no app installation needed."
      }
    ],
    "relatedSlugs": [
      "free-biodata-maker-online",
      "create-marriage-biodata-online",
      "marriage-biodata-format-for-boy-and-girl",
      "free-marriage-biodata-pdf",
      "how-to-make-biodata-for-marriage-online"
    ]
  },
  "free-biodata-maker-online": {
    "slug": "free-biodata-maker-online",
    "category": "maker",
    "primaryKeyword": "Free biodata maker online",
    "title": "Free Biodata Maker Online — Easy Marriage Biodata Generator | TrueMarriage",
    "description": "Create an Indian marriage biodata directly in your browser. Clean margins, automatic photo framing, and instant PDF download with no software setup.",
    "canonicalPath": "/biodata/free-biodata-maker-online",
    "h1": "Free Biodata Maker Online for Marriage",
    "subheading": "No messy Word documents or shifting tables. Build a balanced, culturally appropriate marriage biodata online directly in your mobile or desktop browser.",
    "badge": "Browser-Based • Instant PDF Download",
    "themeColor": "#7C3AED",
    "whySection": {
      "heading": "Why an Online Biodata Tool Beats Word or Photoshop",
      "intro": "Drafting a matrimonial profile in Microsoft Word or Canva often takes hours. Adding a picture pushes text onto a blank second page, fonts display differently on Android and iPhone, and phone viewers often see broken lines.",
      "reasons": [
        {
          "title": "Automated Page Fit",
          "description": "Our layout engine balances your text, headings, and photo so everything fits comfortably on a single A4 page without manual tweaking."
        },
        {
          "title": "Built for Indian Matrimonial Details",
          "description": "Standard graphic tools do not have ready-made fields for Gotra, Nakshatra, Kula Deivam, and maternal relatives. TrueMarriage has them organized natively."
        },
        {
          "title": "Simple Photo Cropping",
          "description": "Crop and center your photo inside ornamental temple arches or clean oval frames without needing photo editing software."
        },
        {
          "title": "Auto-Saved Drafts",
          "description": "Start on your phone during a commute and finish on your laptop at home. Your progress stays saved in your browser."
        }
      ]
    },
    "howSection": {
      "heading": "How to Build Your Biodata Online",
      "intro": "Creating your profile takes about 3 to 4 minutes in our guided browser editor.",
      "workflowSteps": [
        {
          "stepNumber": 1,
          "title": "Launch the Editor",
          "description": "Open truemarriage.in on your phone, tablet, or PC browser."
        },
        {
          "stepNumber": 2,
          "title": "Fill in Your Information",
          "description": "Add your degrees, company, family members, and astrology details in clean input fields."
        },
        {
          "stepNumber": 3,
          "title": "Pick a Design Style",
          "description": "Choose between royal temple motifs, traditional maroons, or modern neutral borders."
        },
        {
          "stepNumber": 4,
          "title": "Review in Real Time",
          "description": "Watch your real biodata update as you type, making it easy to spot typos."
        },
        {
          "stepNumber": 5,
          "title": "Export Your PDF",
          "description": "Download an unwatermarked, high-resolution A4 PDF ready to forward on WhatsApp."
        }
      ],
      "keyElementsToInclude": [
        "Basic Details: Name, age, height, and marital status",
        "Education & Career: Degree, university, job title, and employer",
        "Family Lineage: Native place, father, mother, and siblings",
        "Horoscope Data: Gotra, Rashi, Nakshatra, and Manglik status (if observed)",
        "Contact: Parent or candidate phone number and current city"
      ],
      "dosAndDonts": {
        "dos": [
          "Choose an easy-to-read font size so grandparents can read it without squinting.",
          "Check phone numbers carefully so interested families can reach you.",
          "Keep descriptions modest, polite, and honest."
        ],
        "donts": [
          "Do not use harsh neon colors or busy background patterns that make text unreadable.",
          "Leave optional fields blank if they do not apply—they disappear automatically.",
          "Do not use low-resolution screenshots of passport photos."
        ]
      }
    },
    "whereSection": {
      "heading": "Where to Use Your Online Marriage Biodata",
      "intro": "Everything runs 100% in your browser. Once exported, use your biodata here:",
      "useCases": [
        {
          "title": "Direct Mobile Sharing",
          "description": "Save the PDF directly to your phone’s download folder and send it on WhatsApp or email."
        },
        {
          "title": "Family Review",
          "description": "Show the draft to your parents and elders before circulating it to prospective families."
        },
        {
          "title": "High-Quality Printing",
          "description": "Print crisp color copies at any local stationery shop or home printer."
        }
      ],
      "downloadAndShareDetails": "All files are exported as vector PDFs with embedded fonts, keeping file sizes under 1MB for fast WhatsApp sending."
    },
    "sampleBiodatas": {
      "primarySample": {
        "name": "Rohan Mehra",
        "title": "Lead Product Manager • MBA (IIM Lucknow)",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "18 October 1995 (30 Years)",
            "category": "personal"
          },
          {
            "label": "Height",
            "value": "6 ft 0 in (183 cm)",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "B.Tech (NIT Trichy), MBA (IIM Lucknow)",
            "category": "education_career"
          },
          {
            "label": "Career",
            "value": "Lead Product Manager at FinTech Firm, Gurgaon",
            "category": "education_career"
          },
          {
            "label": "Family",
            "value": "Father: GM (PSU Retd.); Mother: School Principal",
            "category": "family"
          },
          {
            "label": "Astrology",
            "value": "Vashishta Gotra • Non-Manglik",
            "category": "horoscope"
          },
          {
            "label": "Contact",
            "value": "+91 99887 76655 • New Delhi / Gurgaon",
            "category": "contact"
          }
        ]
      },
      "boySample": {
        "name": "Rohan Mehra",
        "title": "Lead Product Manager • MBA (IIM Lucknow)",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "18 October 1995 (30 Years)",
            "category": "personal"
          },
          {
            "label": "Height",
            "value": "6 ft 0 in (183 cm)",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "B.Tech (NIT Trichy), MBA (IIM Lucknow)",
            "category": "education_career"
          },
          {
            "label": "Career",
            "value": "Lead Product Manager at FinTech Firm, Gurgaon",
            "category": "education_career"
          },
          {
            "label": "Family",
            "value": "Father: GM (PSU Retd.); Mother: School Principal",
            "category": "family"
          },
          {
            "label": "Astrology",
            "value": "Vashishta Gotra • Non-Manglik",
            "category": "horoscope"
          },
          {
            "label": "Contact",
            "value": "+91 99887 76655 • New Delhi / Gurgaon",
            "category": "contact"
          }
        ]
      },
      "girlSample": {
        "name": "Ananya Deshmukh",
        "title": "Chartered Accountant & Senior Financial Analyst • B.Com, ACA",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "22 August 1998 (27 Years) • 08:20 AM",
            "category": "personal"
          },
          {
            "label": "Height",
            "value": "5 ft 5 in (165 cm) • Fair Complexion",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "B.Com (Hons) HR College, Chartered Accountant (ICAI)",
            "category": "education_career"
          },
          {
            "label": "Occupation",
            "value": "Senior Financial Analyst at Deloitte, Mumbai • ₹24 LPA",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "Shri Milind Deshmukh (Businessman, Real Estate)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Mrs. Vandana Deshmukh (M.A., Educator)",
            "category": "family"
          },
          {
            "label": "Gotra",
            "value": "Kashyap | Rashi: Kanya | Nakshatra: Hasta",
            "category": "horoscope"
          },
          {
            "label": "Contact",
            "value": "+91 98220 12345 (Parents) • Pune / Mumbai",
            "category": "contact"
          }
        ]
      }
    },
    "faqs": [
      {
        "question": "Can I make my biodata on my smartphone?",
        "answer": "Yes. TrueMarriage is designed mobile-first. You can type, preview, and download your PDF straight from your phone."
      },
      {
        "question": "Will there be a surprise fee at the end?",
        "answer": "No. TrueMarriage allows you to pick your layout and download an unwatermarked PDF completely free."
      },
      {
        "question": "Can I hide the horoscope section if we do not follow astrology?",
        "answer": "Yes. Any field you leave blank is automatically hidden from the finished PDF."
      }
    ],
    "relatedSlugs": [
      "free-marriage-biodata-maker",
      "create-marriage-biodata-online",
      "make-marriage-biodata-online",
      "free-marriage-biodata-pdf"
    ]
  },
  "create-marriage-biodata-online": {
    "slug": "create-marriage-biodata-online",
    "category": "maker",
    "primaryKeyword": "Create marriage biodata online",
    "title": "Create Marriage Biodata Online in 5 Minutes — TrueMarriage",
    "description": "Step-by-step tool to create marriage biodatas online. Select traditional or contemporary Indian layouts, enter family details, and download free PDF.",
    "canonicalPath": "/biodata/create-marriage-biodata-online",
    "h1": "Create Marriage Biodata Online in 5 Minutes",
    "subheading": "A practical, respectful way to present your education, career, and family background to prospective matrimonial alliances.",
    "badge": "Quick & Simple • 5-Minute Setup",
    "themeColor": "#DB2777",
    "whySection": {
      "heading": "Why Create a Marriage Biodata Online",
      "intro": "Arranged marriage introductions move faster when basic facts are presented clearly. A well-organized online biodata helps prospective families review your education, work, and family background without awkward back-and-forth phone calls.",
      "reasons": [
        {
          "title": "Saves Time and Frustration",
          "description": "Our pre-built templates align margins, titles, and photos automatically so you do not have to fight with table borders."
        },
        {
          "title": "Tailored to Your Community",
          "description": "Whether your family needs detailed Kundali matching fields or a clean, career-first profile, you can customize sections with one tap."
        },
        {
          "title": "Quick Updates Anytime",
          "description": "Changed companies or moved cities? Update your information in a few seconds and download a fresh copy immediately."
        }
      ]
    },
    "howSection": {
      "heading": "How to Create Your Biodata Online",
      "intro": "Use this 5-step checklist to put together a clean matrimonial profile:",
      "workflowSteps": [
        {
          "stepNumber": 1,
          "title": "Open the TrueMarriage Editor",
          "description": "Go to truemarriage.in on your phone or laptop."
        },
        {
          "stepNumber": 2,
          "title": "Enter Your Information",
          "description": "Fill in your education, current job, parents’ details, and ancestral roots."
        },
        {
          "stepNumber": 3,
          "title": "Add a Portrait Photo",
          "description": "Upload a clear, smiling picture. Use our crop tool to frame your face neatly."
        },
        {
          "stepNumber": 4,
          "title": "Pick Your Color Theme",
          "description": "Choose from auspicious red, royal navy, emerald green, or warm gold palettes."
        },
        {
          "stepNumber": 5,
          "title": "Download Your PDF",
          "description": "Save your high-resolution A4 document ready for WhatsApp or printing."
        }
      ],
      "keyElementsToInclude": [
        "Full legal name, birth date, birth time, and birthplace",
        "Degrees, colleges attended, current company, and work city",
        "Father and mother occupations, sibling names and marital status",
        "Gotra, community, and horoscope data (optional)",
        "Family contact person and reachable mobile number"
      ],
      "dosAndDonts": {
        "dos": [
          "List your highest educational qualification clearly at the top.",
          "State sibling marital status plainly (for example: \"Elder brother married, lives in Pune\").",
          "Check spellings of native villages, gotras, and family names."
        ],
        "donts": [
          "Do not share confidential government ID numbers (PAN, Aadhaar).",
          "Do not write long essays—bullet points are much easier for elders to read.",
          "Do not use low-contrast text that strains older eyes."
        ]
      }
    },
    "whereSection": {
      "heading": "Where to Download and Share Your Biodata",
      "intro": "Your biodata is created entirely in the browser and ready to circulate across family touchpoints:",
      "useCases": [
        {
          "title": "Save to Mobile or Cloud",
          "description": "Save directly to Google Drive, iCloud, or your phone’s downloads folder."
        },
        {
          "title": "WhatsApp Family Groups",
          "description": "Share directly with relatives, mediators, and prospective parents."
        },
        {
          "title": "Paper Printing",
          "description": "Print clean A4 copies for elders who prefer reading physical documents."
        }
      ],
      "downloadAndShareDetails": "Files export as standard A4 PDFs (210 x 297 mm) that maintain crystal-clear text on all screens."
    },
    "sampleBiodatas": {
      "primarySample": {
        "name": "Priyanka Kulkarni",
        "title": "Architect • M.Arch (CEPT University)",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "12 January 1997 (28 Years)",
            "category": "personal"
          },
          {
            "label": "Height",
            "value": "5 ft 6 in (168 cm)",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "B.Arch (Pune University), M.Arch (CEPT)",
            "category": "education_career"
          },
          {
            "label": "Profession",
            "value": "Associate Landscape Architect, Mumbai",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "Shri Suresh Kulkarni (Civil Engineer, PWD Retd.)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Mrs. Rekha Kulkarni (High School Principal)",
            "category": "family"
          },
          {
            "label": "Kundali",
            "value": "Kashyap Gotra • Kanya Rashi • Chitra Nakshatra",
            "category": "horoscope"
          },
          {
            "label": "Contact",
            "value": "+91 97654 32109 • Pune / Mumbai",
            "category": "contact"
          }
        ]
      },
      "girlSample": {
        "name": "Priyanka Kulkarni",
        "title": "Architect • M.Arch (CEPT University)",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "12 January 1997 (28 Years)",
            "category": "personal"
          },
          {
            "label": "Height",
            "value": "5 ft 6 in (168 cm)",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "B.Arch (Pune University), M.Arch (CEPT)",
            "category": "education_career"
          },
          {
            "label": "Profession",
            "value": "Associate Landscape Architect, Mumbai",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "Shri Suresh Kulkarni (Civil Engineer, PWD Retd.)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Mrs. Rekha Kulkarni (High School Principal)",
            "category": "family"
          },
          {
            "label": "Kundali",
            "value": "Kashyap Gotra • Kanya Rashi • Chitra Nakshatra",
            "category": "horoscope"
          },
          {
            "label": "Contact",
            "value": "+91 97654 32109 • Pune / Mumbai",
            "category": "contact"
          }
        ]
      },
      "boySample": {
        "name": "Aarav Sharma",
        "title": "Software Engineer • M.Tech (IIT Bombay)",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "14 November 1996 (29 Years) • 07:15 AM",
            "category": "personal"
          },
          {
            "label": "Height",
            "value": "5 ft 11 in (180 cm) • Athletic",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "B.Tech + M.Tech in Computer Science, IIT Bombay",
            "category": "education_career"
          },
          {
            "label": "Occupation",
            "value": "Senior Software Engineer at Oracle, Bangalore • ₹30 LPA",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "Dr. Rakesh Sharma (Chief Medical Officer, Retd.)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Mrs. Sunita Sharma (Homemaker)",
            "category": "family"
          },
          {
            "label": "Gotra",
            "value": "Bharadwaja | Manglik: No",
            "category": "horoscope"
          },
          {
            "label": "Contact",
            "value": "+91 98765 43210 (Father) • Bangalore, Karnataka",
            "category": "contact"
          }
        ]
      }
    },
    "faqs": [
      {
        "question": "How long does it take to make a biodata?",
        "answer": "Most people finish filling their details and downloading their PDF in 4 to 6 minutes."
      },
      {
        "question": "Can I write my biodata in regional languages?",
        "answer": "Yes. TrueMarriage includes phonetic typing for Hindi, Marathi, Gujarati, Tamil, Telugu, Kannada, Bengali, and more."
      }
    ],
    "relatedSlugs": [
      "free-marriage-biodata-maker",
      "make-marriage-biodata-online",
      "online-marriage-biodata-maker",
      "marriage-biodata-format-for-boy-and-girl"
    ]
  },
  "make-marriage-biodata-online": {
    "slug": "make-marriage-biodata-online",
    "category": "maker",
    "primaryKeyword": "Make marriage biodata online",
    "title": "Make Marriage Biodata Online — Fast, Beautiful & Free | TrueMarriage",
    "description": "Looking to make a marriage biodata online? Design a neat matrimonial profile with photo, family background, and horoscope. Instant free PDF.",
    "canonicalPath": "/biodata/make-marriage-biodata-online",
    "h1": "Make Marriage Biodata Online with Ease",
    "subheading": "Present your qualifications, personal background, and family roots with clarity and dignity—no graphic design skills needed.",
    "badge": "Fast & Intuitive • No Designer Needed",
    "themeColor": "#E11D48",
    "whySection": {
      "heading": "Why Making Your Biodata Online is Practical",
      "intro": "When parents and matchmakers review biodatas, neat formatting and easy-to-read text make an immediate positive impression. Trying to build one in a basic word processor usually leads to awkward line wraps and misplaced images.",
      "reasons": [
        {
          "title": "Structured for Marriage Conversations",
          "description": "Sections are organized logically: Personal Info, Education & Job, Family Background, and Horoscope."
        },
        {
          "title": "Looks Great on Every Phone",
          "description": "Our PDF engine generates vector files that open crisply on Android and iPhone screens without text distortion."
        },
        {
          "title": "Traditional and Modern Aesthetics",
          "description": "Choose from classic temple arch borders to minimalist layouts to suit your family’s preferences."
        }
      ]
    },
    "howSection": {
      "heading": "How to Make Your Biodata Step by Step",
      "intro": "Follow these simple steps to build your matrimonial profile:",
      "workflowSteps": [
        {
          "stepNumber": 1,
          "title": "Open TrueMarriage",
          "description": "Launch the online editor on your phone or laptop."
        },
        {
          "stepNumber": 2,
          "title": "Add Personal Information",
          "description": "Enter your birth date, height, education degree, and job position."
        },
        {
          "stepNumber": 3,
          "title": "Add Family Roots",
          "description": "List parents’ occupations, siblings, and ancestral town."
        },
        {
          "stepNumber": 4,
          "title": "Upload Photo & Horoscope",
          "description": "Add a portrait and toggle horoscope fields if your family observes them."
        },
        {
          "stepNumber": 5,
          "title": "Download Your PDF",
          "description": "Review the rendered preview and download your free PDF."
        }
      ],
      "keyElementsToInclude": [
        "Full name and recent well-lit portrait photo",
        "Academic qualifications and current job title",
        "Father, mother, and sibling details",
        "Astrological parameters (Gotra, Manglik, Rashi)",
        "Residential city and family contact numbers"
      ],
      "dosAndDonts": {
        "dos": [
          "Keep text concise and check for spelling errors.",
          "Provide clear parent or candidate contact numbers.",
          "Pick an accent color that looks warm and readable."
        ],
        "donts": [
          "Do not use dimly lit photos or party pictures.",
          "Avoid exaggerated salary numbers or false career claims.",
          "Do not use blurry camera photos of old paper biodatas."
        ]
      }
    },
    "whereSection": {
      "heading": "Where to Use Your Biodata",
      "intro": "Your downloaded PDF can be used across conventional matrimonial touchpoints:",
      "useCases": [
        {
          "title": "WhatsApp Family Chats",
          "description": "Send the PDF directly for fast, high-clarity viewing on phones."
        },
        {
          "title": "Matrimonial Portals",
          "description": "Attach the PDF to your matrimonial profile as an official family document."
        },
        {
          "title": "Family Visits",
          "description": "Print copies on matte paper for visiting relatives and elders."
        }
      ],
      "downloadAndShareDetails": "Exported in standard A4 PDF format with embedded fonts for universal viewing."
    },
    "sampleBiodatas": {
      "primarySample": {
        "name": "Kabir Sengupta",
        "title": "Vice President, Equity Research • CFA Charterholder",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "05 September 1994 (31 Years)",
            "category": "personal"
          },
          {
            "label": "Height",
            "value": "5 ft 10 in (178 cm)",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "B.Sc Economics (St. Xavier's), M.Sc Finance",
            "category": "education_career"
          },
          {
            "label": "Career",
            "value": "Vice President, Equity Research at Barclays, Mumbai",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "Dr. Debabrata Sengupta (Professor of Physics)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Mrs. Mahua Sengupta (Classical Vocalist)",
            "category": "family"
          },
          {
            "label": "Gotra",
            "value": "Sandilya | Rashi: Kanya",
            "category": "horoscope"
          },
          {
            "label": "Contact",
            "value": "+91 98300 45678 • South Kolkata / Mumbai",
            "category": "contact"
          }
        ]
      },
      "boySample": {
        "name": "Kabir Sengupta",
        "title": "Vice President, Equity Research • CFA Charterholder",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "05 September 1994 (31 Years)",
            "category": "personal"
          },
          {
            "label": "Height",
            "value": "5 ft 10 in (178 cm)",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "B.Sc Economics (St. Xavier's), M.Sc Finance",
            "category": "education_career"
          },
          {
            "label": "Career",
            "value": "Vice President, Equity Research at Barclays, Mumbai",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "Dr. Debabrata Sengupta (Professor of Physics)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Mrs. Mahua Sengupta (Classical Vocalist)",
            "category": "family"
          },
          {
            "label": "Gotra",
            "value": "Sandilya | Rashi: Kanya",
            "category": "horoscope"
          },
          {
            "label": "Contact",
            "value": "+91 98300 45678 • South Kolkata / Mumbai",
            "category": "contact"
          }
        ]
      },
      "girlSample": {
        "name": "Ananya Deshmukh",
        "title": "Chartered Accountant & Senior Financial Analyst • B.Com, ACA",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "22 August 1998 (27 Years) • 08:20 AM",
            "category": "personal"
          },
          {
            "label": "Height",
            "value": "5 ft 5 in (165 cm) • Fair Complexion",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "B.Com (Hons) HR College, Chartered Accountant (ICAI)",
            "category": "education_career"
          },
          {
            "label": "Occupation",
            "value": "Senior Financial Analyst at Deloitte, Mumbai • ₹24 LPA",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "Shri Milind Deshmukh (Businessman, Real Estate)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Mrs. Vandana Deshmukh (M.A., Educator)",
            "category": "family"
          },
          {
            "label": "Gotra",
            "value": "Kashyap | Rashi: Kanya | Nakshatra: Hasta",
            "category": "horoscope"
          },
          {
            "label": "Contact",
            "value": "+91 98220 12345 (Parents) • Pune / Mumbai",
            "category": "contact"
          }
        ]
      }
    },
    "faqs": [
      {
        "question": "Do I need to create an account before seeing templates?",
        "answer": "No. You can browse all 100+ templates and test formatting before creating an account."
      },
      {
        "question": "Will my downloaded PDF have watermarks?",
        "answer": "Never. TrueMarriage exports clean, watermark-free PDFs."
      }
    ],
    "relatedSlugs": [
      "create-marriage-biodata-online",
      "free-marriage-biodata-maker",
      "online-marriage-biodata-maker",
      "free-marriage-biodata-pdf"
    ]
  },
  "online-marriage-biodata-maker": {
    "slug": "online-marriage-biodata-maker",
    "category": "maker",
    "primaryKeyword": "Online marriage biodata maker",
    "title": "Online Marriage Biodata Maker — Elegant Matrimonial PDF Creator | TrueMarriage",
    "description": "Create matrimonial biodatas online with 100+ themes, regional languages, horoscope fields, and instant free PDF download with zero watermarks.",
    "canonicalPath": "/biodata/online-marriage-biodata-maker",
    "h1": "Online Marriage Biodata Maker",
    "subheading": "A simple digital editor built to create culturally authentic, clean matrimonial biodatas in minutes.",
    "badge": "100+ Designer Templates • Instant PDF",
    "themeColor": "#BE123C",
    "whySection": {
      "heading": "Why Use an Online Biodata Creator",
      "intro": "Hiring local computer typing shops or struggling with desktop word processors is slow, expensive, and often results in outdated designs. An online creator gives you complete control over your family’s presentation.",
      "reasons": [
        {
          "title": "Professionally Balanced Layouts",
          "description": "Layouts are built with proper spacing, clear dividers, and cultural symbols designed specifically for Indian marriages."
        },
        {
          "title": "No Software to Install",
          "description": "Runs directly inside your browser on phones, tablets, or laptops without downloading apps or plugins."
        },
        {
          "title": "Multilingual Support",
          "description": "Easily switch between English and regional languages like Hindi, Marathi, Gujarati, Tamil, Telugu, and Bengali."
        }
      ]
    },
    "howSection": {
      "heading": "How the Online Creator Works",
      "intro": "Our editor guides you through each section step by step:",
      "workflowSteps": [
        {
          "stepNumber": 1,
          "title": "Select a Template",
          "description": "Choose an aesthetic that matches your family’s tone."
        },
        {
          "stepNumber": 2,
          "title": "Enter Candidate Details",
          "description": "Fill in your education, profession, height, and date of birth."
        },
        {
          "stepNumber": 3,
          "title": "Add Family & Horoscope Info",
          "description": "Add parents, siblings, native place, gotra, and astrology parameters."
        },
        {
          "stepNumber": 4,
          "title": "Adjust Visual Accents",
          "description": "Select your preferred accent colors, border styles, and fonts."
        },
        {
          "stepNumber": 5,
          "title": "Download Clean PDF",
          "description": "Save your print-ready document in seconds."
        }
      ],
      "keyElementsToInclude": [
        "Full name, date and time of birth, and height",
        "College degrees, current job title, and employer",
        "Family roots, native place, and parents’ professions",
        "Astrological parameters: Gotra, Kuldevi, Nakshatra, Manglik status",
        "Family contact telephone numbers and location"
      ],
      "dosAndDonts": {
        "dos": [
          "Choose an accent color that complements your photo.",
          "Double-check telephone numbers to avoid missed calls from interested families.",
          "Ensure college and company names are spelled correctly."
        ],
        "donts": [
          "Do not squeeze too much unnecessary text into a single page.",
          "Do not use informal nicknames as the main header name.",
          "Do not use blurry, low-resolution photos."
        ]
      }
    },
    "whereSection": {
      "heading": "Where to Use the Generated Biodata",
      "intro": "Your biodata can be shared across all typical matchmaking avenues:",
      "useCases": [
        {
          "title": "Works on Any Device",
          "description": "Opens cleanly on iPhones, Android phones, tablets, and laptops."
        },
        {
          "title": "Instant Messaging",
          "description": "Forward directly to relatives, astrologers, and mediators on WhatsApp or email."
        }
      ],
      "downloadAndShareDetails": "Exports in standard A4 PDF format with embedded fonts for reliable display everywhere."
    },
    "sampleBiodatas": {
      "primarySample": {
        "name": "Siddharth Varma",
        "title": "Senior Data Scientist • M.S. (Columbia University)",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "29 July 1996 (29 Years)",
            "category": "personal"
          },
          {
            "label": "Height",
            "value": "5 ft 11 in (180 cm)",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "B.Tech (BITS Pilani), M.S. Data Science (Columbia)",
            "category": "education_career"
          },
          {
            "label": "Profession",
            "value": "Senior Data Scientist at Microsoft, Hyderabad",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "Shri Anand Varma (Executive Director, BHEL)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Mrs. Neeta Varma (M.Sc., Homemaker)",
            "category": "family"
          },
          {
            "label": "Astrology",
            "value": "Garg Gotra • Non-Manglik",
            "category": "horoscope"
          },
          {
            "label": "Contact",
            "value": "+91 98490 12345 • Hyderabad / Bangalore",
            "category": "contact"
          }
        ]
      },
      "boySample": {
        "name": "Siddharth Varma",
        "title": "Senior Data Scientist • M.S. (Columbia University)",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "29 July 1996 (29 Years)",
            "category": "personal"
          },
          {
            "label": "Height",
            "value": "5 ft 11 in (180 cm)",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "B.Tech (BITS Pilani), M.S. Data Science (Columbia)",
            "category": "education_career"
          },
          {
            "label": "Profession",
            "value": "Senior Data Scientist at Microsoft, Hyderabad",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "Shri Anand Varma (Executive Director, BHEL)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Mrs. Neeta Varma (M.Sc., Homemaker)",
            "category": "family"
          },
          {
            "label": "Astrology",
            "value": "Garg Gotra • Non-Manglik",
            "category": "horoscope"
          },
          {
            "label": "Contact",
            "value": "+91 98490 12345 • Hyderabad / Bangalore",
            "category": "contact"
          }
        ]
      },
      "girlSample": {
        "name": "Ananya Deshmukh",
        "title": "Chartered Accountant & Senior Financial Analyst • B.Com, ACA",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "22 August 1998 (27 Years) • 08:20 AM",
            "category": "personal"
          },
          {
            "label": "Height",
            "value": "5 ft 5 in (165 cm) • Fair Complexion",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "B.Com (Hons) HR College, Chartered Accountant (ICAI)",
            "category": "education_career"
          },
          {
            "label": "Occupation",
            "value": "Senior Financial Analyst at Deloitte, Mumbai • ₹24 LPA",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "Shri Milind Deshmukh (Businessman, Real Estate)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Mrs. Vandana Deshmukh (M.A., Educator)",
            "category": "family"
          },
          {
            "label": "Gotra",
            "value": "Kashyap | Rashi: Kanya | Nakshatra: Hasta",
            "category": "horoscope"
          },
          {
            "label": "Contact",
            "value": "+91 98220 12345 (Parents) • Pune / Mumbai",
            "category": "contact"
          }
        ]
      }
    },
    "faqs": [
      {
        "question": "Can I change templates after typing my details?",
        "answer": "Yes. Your entered information stays intact when you switch between different template designs."
      },
      {
        "question": "Is my personal data kept secure?",
        "answer": "Yes. TrueMarriage uses encryption and never sells or broadcasts your contact details to third parties."
      }
    ],
    "relatedSlugs": [
      "free-marriage-biodata-maker",
      "free-biodata-maker-online",
      "free-marriage-biodata-pdf",
      "how-to-make-biodata-for-marriage-online"
    ]
  },
  "free-marriage-biodata-maker-without-registration": {
    "slug": "free-marriage-biodata-maker-without-registration",
    "category": "maker",
    "primaryKeyword": "Free marriage biodata maker without registration",
    "title": "Free Marriage Biodata Maker Without Registration | TrueMarriage",
    "description": "Create and preview your marriage biodata instantly without long signup forms. Fast, private matrimonial biodata generator with free PDF export.",
    "canonicalPath": "/biodata/free-marriage-biodata-maker-without-registration",
    "h1": "Free Marriage Biodata Maker (Instant Guest Access)",
    "subheading": "Draft, customize, and preview your marriage biodata right away without filling out exhaustive questionnaires or receiving sales calls.",
    "badge": "Instant Access • Zero Telemarketing",
    "themeColor": "#059669",
    "whySection": {
      "heading": "Why Families Prefer Making Biodatas Without Registration",
      "intro": "Many matrimonial websites make you sit through a 20-minute questionnaire asking for salary slips and personal IDs before you can even see a template. TrueMarriage lets you start creating right away.",
      "reasons": [
        {
          "title": "Immediate Template Access",
          "description": "Jump straight into designing your biodata without needing to create accounts or passwords first."
        },
        {
          "title": "Zero Telemarketing Calls",
          "description": "Commercial portals often take your phone number just to call you repeatedly with VIP membership pitches. We never do outbound sales calls."
        },
        {
          "title": "Freedom to Experiment",
          "description": "Try different templates, fonts, and photos freely until you are completely happy with how it looks."
        }
      ]
    },
    "howSection": {
      "heading": "How TrueMarriage Keeps Biodata Creation Simple",
      "intro": "You have full guest access to draft your profile first. When you are ready to export, a quick phone verification safely preserves your draft.",
      "workflowSteps": [
        {
          "stepNumber": 1,
          "title": "Open the Studio",
          "description": "Start directly on our template selection screen without upfront forms."
        },
        {
          "stepNumber": 2,
          "title": "Enter Your Information",
          "description": "Type your personal, education, family, and astrological details."
        },
        {
          "stepNumber": 3,
          "title": "Customize the Layout",
          "description": "Pick your preferred colors, borders, and fonts while previewing in real time."
        },
        {
          "stepNumber": 4,
          "title": "Quick Verification",
          "description": "Complete a quick one-step verification to preserve your draft and download the PDF."
        },
        {
          "stepNumber": 5,
          "title": "Share Your Biodata",
          "description": "Forward your clean, unwatermarked PDF to prospective families."
        }
      ],
      "keyElementsToInclude": [
        "Personal Details: Name, age, height, and location",
        "Degrees, university, and current job role",
        "Parents’ occupations and sibling details",
        "Horoscope & Kundali information (optional)",
        "Family contact telephone number"
      ],
      "dosAndDonts": {
        "dos": [
          "Use the live preview to verify spelling and layout before exporting.",
          "Keep an original copy of your downloaded PDF in cloud storage for easy sharing.",
          "Keep family contact numbers up to date."
        ],
        "donts": [
          "Do not put sensitive financial or banking details on a matrimonial biodata.",
          "Do not settle for services that paste watermarks across your finished document."
        ]
      }
    },
    "whereSection": {
      "heading": "Where to Share Your Biodata",
      "intro": "Your finished PDF is ready to circulate across trusted family circles:",
      "useCases": [
        {
          "title": "WhatsApp Direct Exchange",
          "description": "Send directly to relatives and prospective in-laws on WhatsApp."
        },
        {
          "title": "Matrimonial Meets",
          "description": "Print copies for community sammelans or family visits."
        }
      ],
      "downloadAndShareDetails": "All files export as standard A4 PDFs with crisp vector fonts and zero watermarks."
    },
    "sampleBiodatas": {
      "primarySample": {
        "name": "Gaurav Khandelwal",
        "title": "Senior Financial Consultant • B.Com (Hons), CA",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "15 December 1995 (30 Years)",
            "category": "personal"
          },
          {
            "label": "Height",
            "value": "5 ft 10 in (178 cm)",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "B.Com (Hons) SRCC Delhi, Chartered Accountant (ICAI)",
            "category": "education_career"
          },
          {
            "label": "Profession",
            "value": "Senior Consultant at EY, Gurgaon",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "Shri R. P. Khandelwal (Proprietor, Textiles Trading)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Mrs. Sunita Khandelwal (Homemaker)",
            "category": "family"
          },
          {
            "label": "Gotra",
            "value": "Goyal Gotra • Manglik: No",
            "category": "horoscope"
          },
          {
            "label": "Contact",
            "value": "+91 98110 54321 • New Delhi / Jaipur",
            "category": "contact"
          }
        ]
      },
      "boySample": {
        "name": "Gaurav Khandelwal",
        "title": "Senior Financial Consultant • B.Com (Hons), CA",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "15 December 1995 (30 Years)",
            "category": "personal"
          },
          {
            "label": "Height",
            "value": "5 ft 10 in (178 cm)",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "B.Com (Hons) SRCC Delhi, Chartered Accountant (ICAI)",
            "category": "education_career"
          },
          {
            "label": "Profession",
            "value": "Senior Consultant at EY, Gurgaon",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "Shri R. P. Khandelwal (Proprietor, Textiles Trading)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Mrs. Sunita Khandelwal (Homemaker)",
            "category": "family"
          },
          {
            "label": "Gotra",
            "value": "Goyal Gotra • Manglik: No",
            "category": "horoscope"
          },
          {
            "label": "Contact",
            "value": "+91 98110 54321 • New Delhi / Jaipur",
            "category": "contact"
          }
        ]
      },
      "girlSample": {
        "name": "Ananya Deshmukh",
        "title": "Chartered Accountant & Senior Financial Analyst • B.Com, ACA",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "22 August 1998 (27 Years) • 08:20 AM",
            "category": "personal"
          },
          {
            "label": "Height",
            "value": "5 ft 5 in (165 cm) • Fair Complexion",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "B.Com (Hons) HR College, Chartered Accountant (ICAI)",
            "category": "education_career"
          },
          {
            "label": "Occupation",
            "value": "Senior Financial Analyst at Deloitte, Mumbai • ₹24 LPA",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "Shri Milind Deshmukh (Businessman, Real Estate)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Mrs. Vandana Deshmukh (M.A., Educator)",
            "category": "family"
          },
          {
            "label": "Gotra",
            "value": "Kashyap | Rashi: Kanya | Nakshatra: Hasta",
            "category": "horoscope"
          },
          {
            "label": "Contact",
            "value": "+91 98220 12345 (Parents) • Pune / Mumbai",
            "category": "contact"
          }
        ]
      }
    },
    "faqs": [
      {
        "question": "Can I download the PDF without paying?",
        "answer": "Yes! TrueMarriage allows you to download your full A4 PDF with zero watermarks completely free."
      },
      {
        "question": "Do you share my phone number with telemarketers?",
        "answer": "Never. TrueMarriage does not run telemarketing operations or sell candidate information to third parties."
      }
    ],
    "relatedSlugs": [
      "free-marriage-biodata-maker",
      "free-biodata-maker-online",
      "free-marriage-biodata-pdf",
      "how-to-make-biodata-for-marriage-online"
    ]
  },
  "free-marriage-biodata-maker-online-india": {
    "slug": "free-marriage-biodata-maker-online-india",
    "category": "maker",
    "primaryKeyword": "Free marriage biodata maker online India",
    "title": "Free Marriage Biodata Maker Online India — 100+ Indian Formats | TrueMarriage",
    "description": "Free marriage biodata maker tailored for Indian families. Designed for Hindu, Muslim, Sikh, Jain & Christian traditions in 13 languages. Free PDF download.",
    "canonicalPath": "/biodata/free-marriage-biodata-maker-online-india",
    "h1": "Free Marriage Biodata Maker Online India",
    "subheading": "Built specifically for Indian families. Auspicious religious headers, regional language options, and authentic cultural formatting.",
    "badge": "Made for India • 13 Regional Languages",
    "themeColor": "#C026D3",
    "whySection": {
      "heading": "Why Indian Families Use Specialized Biodatas",
      "intro": "In India, marriage brings two families together. A matrimonial biodata must present family roots, education, native place, and cultural values with clarity and respect.",
      "reasons": [
        {
          "title": "Tailored Across Indian Communities",
          "description": "From North Indian Gotra and Kundali sections to South Indian Nakshatram and Kula Deivam, our formats reflect regional traditions."
        },
        {
          "title": "Auspicious Cultural Symbols",
          "description": "Include sacred symbols like Ganesha, Swastik, Om, Kalash, Bismillah (786), Khanda, Jinendra, or the Holy Cross at the header."
        },
        {
          "title": "13 Regional Languages",
          "description": "Draft biodatas in Hindi, Marathi, Gujarati, Tamil, Telugu, Kannada, Bengali, and more with simple phonetic typing."
        }
      ]
    },
    "howSection": {
      "heading": "How to Create Your Biodata Online",
      "intro": "Follow this simple process tailored for Indian matchmaking traditions:",
      "workflowSteps": [
        {
          "stepNumber": 1,
          "title": "Open the Studio",
          "description": "Open TrueMarriage on your phone or laptop."
        },
        {
          "stepNumber": 2,
          "title": "Choose Cultural Style",
          "description": "Select your preferred religious header and regional template layout."
        },
        {
          "stepNumber": 3,
          "title": "Enter Information",
          "description": "Fill in your education, career, paternal and maternal family backgrounds, and horoscope."
        },
        {
          "stepNumber": 4,
          "title": "Select Language",
          "description": "Draft in English or your native mother tongue."
        },
        {
          "stepNumber": 5,
          "title": "Download A4 PDF",
          "description": "Export a vector PDF ready for WhatsApp sharing or physical printing."
        }
      ],
      "keyElementsToInclude": [
        "Name, date of birth, birth time, and birth city",
        "Degrees, college name, employer, and job designation",
        "Parents’ details and maternal uncle background (Mama Ji)",
        "Gotra, Kuldevi, community, and Manglik status",
        "Ancestral village / native town and current city"
      ],
      "dosAndDonts": {
        "dos": [
          "State your native place (ancestral village) clearly.",
          "Mention sibling marital status clearly (for example: \"Elder sister married in Pune\").",
          "Verify your birth time from an official birth chart or hospital record."
        ],
        "donts": [
          "Do not use job resume formats with technical skill lists.",
          "Specify vegetarian or dietary preferences if important to your family.",
          "Avoid overly casual photos with sunglasses or party backgrounds."
        ]
      }
    },
    "whereSection": {
      "heading": "Where Indian Families Circulate Marriage Biodatas",
      "intro": "Matrimonial biodatas circulate through trusted family channels:",
      "useCases": [
        {
          "title": "Family WhatsApp Groups",
          "description": "Shared among relatives, aunts, and elders for initial introductions."
        },
        {
          "title": "Community Sammelans & Sabhas",
          "description": "Submitted at regional community matchmaking conventions."
        },
        {
          "title": "Pandit Consultations",
          "description": "Handed to family pandits for Guna Milan and horoscope matching."
        },
        {
          "title": "In-Person Home Meetings",
          "description": "Printed in color on quality paper to hand to visiting prospective in-laws."
        }
      ],
      "downloadAndShareDetails": "Download in standard A4 format (210 x 297 mm), completely free and without watermarks."
    },
    "sampleBiodatas": {
      "primarySample": {
        "name": "Aditya Rajawat",
        "title": "Assistant Commissioner • IRS (Civil Services)",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "11 October 1993 (32 Years)",
            "category": "personal"
          },
          {
            "label": "Height",
            "value": "5 ft 11 in (180 cm)",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "B.Tech (IIT Delhi), UPSC CSE 2019",
            "category": "education_career"
          },
          {
            "label": "Profession",
            "value": "Assistant Commissioner, Indian Revenue Service (IRS)",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "Brigadier Surendra Singh Rajawat (Indian Army, Retd.)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Mrs. Pratibha Rajawat (Homemaker)",
            "category": "family"
          },
          {
            "label": "Culture & Gotra",
            "value": "Kachwaha Rajput • Gotra: Manav • Non-Manglik",
            "category": "horoscope"
          },
          {
            "label": "Contact",
            "value": "+91 94140 12345 • Jaipur / New Delhi",
            "category": "contact"
          }
        ]
      },
      "boySample": {
        "name": "Aditya Rajawat",
        "title": "Assistant Commissioner • IRS (Civil Services)",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "11 October 1993 (32 Years)",
            "category": "personal"
          },
          {
            "label": "Height",
            "value": "5 ft 11 in (180 cm)",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "B.Tech (IIT Delhi), UPSC CSE 2019",
            "category": "education_career"
          },
          {
            "label": "Profession",
            "value": "Assistant Commissioner, Indian Revenue Service (IRS)",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "Brigadier Surendra Singh Rajawat (Indian Army, Retd.)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Mrs. Pratibha Rajawat (Homemaker)",
            "category": "family"
          },
          {
            "label": "Culture & Gotra",
            "value": "Kachwaha Rajput • Gotra: Manav • Non-Manglik",
            "category": "horoscope"
          },
          {
            "label": "Contact",
            "value": "+91 94140 12345 • Jaipur / New Delhi",
            "category": "contact"
          }
        ]
      },
      "girlSample": {
        "name": "Ananya Deshmukh",
        "title": "Chartered Accountant & Senior Financial Analyst • B.Com, ACA",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "22 August 1998 (27 Years) • 08:20 AM",
            "category": "personal"
          },
          {
            "label": "Height",
            "value": "5 ft 5 in (165 cm) • Fair Complexion",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "B.Com (Hons) HR College, Chartered Accountant (ICAI)",
            "category": "education_career"
          },
          {
            "label": "Occupation",
            "value": "Senior Financial Analyst at Deloitte, Mumbai • ₹24 LPA",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "Shri Milind Deshmukh (Businessman, Real Estate)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Mrs. Vandana Deshmukh (M.A., Educator)",
            "category": "family"
          },
          {
            "label": "Gotra",
            "value": "Kashyap | Rashi: Kanya | Nakshatra: Hasta",
            "category": "horoscope"
          },
          {
            "label": "Contact",
            "value": "+91 98220 12345 (Parents) • Pune / Mumbai",
            "category": "contact"
          }
        ]
      }
    },
    "faqs": [
      {
        "question": "Does TrueMarriage support Indian horoscope fields?",
        "answer": "Yes. Our templates support Gotra, Rashi, Nakshatra, Charan, Gana, Nadi, Kuldevi, and Manglik status."
      },
      {
        "question": "Can I write in Hindi or Marathi fonts?",
        "answer": "Yes. TrueMarriage includes built-in Devanagari typography and phonetic typing."
      }
    ],
    "relatedSlugs": [
      "free-marriage-biodata-maker",
      "hindu-marriage-biodata",
      "marriage-biodata-format-for-boy-and-girl",
      "marriage-biodata-in-hindi",
      "marriage-biodata-in-marathi"
    ]
  },
  "marriage-biodata-format-for-boy-and-girl": {
    "slug": "marriage-biodata-format-for-boy-and-girl",
    "category": "format",
    "primaryKeyword": "marriage biodata format for boy and girl",
    "title": "Marriage Biodata Format for Boy & Girl | Free PDF Templates",
    "description": "Compare marriage biodata formats for boys and girls. Choose curated modern and traditional layouts, fill your details, and download a clean PDF.",
    "canonicalPath": "/biodata/marriage-biodata-format-for-boy-and-girl",
    "h1": "Marriage Biodata Format for Boy & Girl",
    "subheading": "Well-organized layouts tailored for bride and groom profiles. Balanced sections for personal values, education, career, and family background.",
    "badge": "Boy & Girl Formats",
    "themeColor": "#4338CA",
    "ctaText": "Create Free Biodata PDF",
    "previewCtaText": "View Sample Formats",
    "boyTabLabel": "Groom Format (Boy)",
    "girlTabLabel": "Bride Format (Girl)",
    "whySection": {
      "heading": "Why Boys and Girls Need Thoughtfully Structured Biodata Formats",
      "intro": "A matrimonial biodata is not a corporate resume. It is a family introduction. Prospective matches and their parents evaluate different details first when reviewing profiles for boys and girls. Having a format designed for each perspective ensures the right questions get answered immediately without awkward back-and-forth.",
      "reasons": [
        {
          "title": "Clarity on Career and Relocation for Grooms",
          "description": "For boys, prospective families look closely at education, current employer, job location, and future settlement plans (such as willingness to relocate or living arrangements with parents). A structured format places career facts right below personal details so families see stability upfront."
        },
        {
          "title": "Privacy and Respectful Presentation for Brides",
          "description": "For girls, privacy and tone matter immensely. Our bride templates highlight education, creative interests, and personal values while giving families control over contact numbers (such as providing a parent's contact instead of a direct mobile number) to prevent unsolicited calls."
        },
        {
          "title": "Separate Horoscopic and Family Balance",
          "description": "Whether matching kundalis or keeping it simple, the format clearly separates astrological facts (Gotra, Nakshatra, Manglik status) from family details (parents' professions, siblings, native place), making it easy to scan by both elders and the candidate."
        },
        {
          "title": "Cleaner Reads Than Messy Word Documents",
          "description": "Families read biodatas on small smartphone screens over WhatsApp. A structured two-column or clean card format prevents the awkward line wraps, broken tables, and missing fonts typical of shared Word files."
        }
      ]
    },
    "howSection": {
      "heading": "How to Choose and Fill Your Biodata Format",
      "intro": "Creating a personalized boy or girl marriage biodata takes under five minutes on TrueMarriage.",
      "workflowSteps": [
        {
          "stepNumber": 1,
          "title": "Select the Matching Layout",
          "description": "Pick a format accent suited for your family's style—classic regal motifs, modern minimalist borders, or traditional saffron and marigold headers."
        },
        {
          "stepNumber": 2,
          "title": "Fill Personal and Professional Details",
          "description": "Enter full name, birth date and time, height, highest qualification, university, job title, company, and annual package (optional)."
        },
        {
          "stepNumber": 3,
          "title": "Add Family Roots and Astrological Data",
          "description": "Add father's and mother's occupations, sibling counts, native place (Maternal/Paternal), plus Gotra and Rashi if horoscopes are observed."
        },
        {
          "stepNumber": 4,
          "title": "Download High-Resolution PDF",
          "description": "Review your instant preview, make quick corrections, and export an print-ready PDF ready for WhatsApp sharing or physical prints."
        }
      ],
      "keyElementsToInclude": [
        "Full Name & Date / Time / Place of Birth",
        "Height, Complexion & Physical Fitness",
        "Education (Degree, College/University)",
        "Occupation (Company Name, Designation, Annual CTC)",
        "Work City & Long-term Settlement Plans",
        "Gotra, Kuldevi, Nakshatra, Manglik Status",
        "Father & Mother Occupation, Paternal Native Place",
        "Brothers and Sisters (Married / Studying)"
      ],
      "dosAndDonts": {
        "dos": [
          "Mention exact time and city of birth if your community checks horoscopes.",
          "Use clear, honest designations and location details.",
          "List whether siblings are elder or younger, and if married.",
          "Proofread spellings of college names, companies, and native towns.",
          "Include a high-resolution, recent portrait with natural lighting."
        ],
        "donts": [
          "Do not copy-paste raw resume bullet points with jargon.",
          "Do not share PAN, Aadhaar, or sensitive financial account numbers.",
          "Avoid group photos, sunglasses, or heavily edited selfie filters.",
          "Do not leave contact numbers without specifying whose phone it is."
        ]
      }
    },
    "whereSection": {
      "heading": "Where and How to Share Your Biodata",
      "intro": "A matrimonial biodata should be shared thoughtfully across secure, trusted family touchpoints.",
      "useCases": [
        {
          "title": "WhatsApp Family Groups and Mediators",
          "description": "PDF files retain exact spacing, fonts, and clean margins when opened across Android and iPhone."
        },
        {
          "title": "Matrimonial Portals and Matchmakers",
          "description": "Upload your PDF directly to Shaadi, BharatMatrimony, or community trust bureaus."
        },
        {
          "title": "First Family Meetings (Rishta Baithak)",
          "description": "Print 2 to 3 color copies on 100 GSM paper for elders to review during home visits."
        }
      ],
      "downloadAndShareDetails": "All generated files are saved in standard international A4 format (210 x 297 mm), 300 DPI vector quality without watermarks."
    },
    "sampleBiodatas": {
      "boySample": {
        "name": "Rahul Verma",
        "title": "Senior Product Designer • B.Des, NID Ahmedabad",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "14 September 1996 (29 Years) • 07:15 AM",
            "category": "personal"
          },
          {
            "label": "Height",
            "value": "5 ft 11 in (180 cm) • Athletic",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "Bachelor of Design, National Institute of Design (NID)",
            "category": "education_career"
          },
          {
            "label": "Occupation",
            "value": "Product Design Lead, Swiggy Bangalore • ₹28 LPA",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "Mr. Satish Verma (Chief Engineer, PWD - Retd.)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Mrs. Rekha Verma (M.A., School Principal)",
            "category": "family"
          },
          {
            "label": "Horoscope",
            "value": "Gotra: Vashishta • Rashi: Kanya • Manglik: No",
            "category": "horoscope"
          },
          {
            "label": "Contact",
            "value": "+91 98765 12340 (Father) • Bangalore / Lucknow",
            "category": "contact"
          }
        ]
      },
      "girlSample": {
        "name": "Pooja Iyer",
        "title": "Chartered Accountant & Assistant Director • B.Com, ACA",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "28 March 1998 (28 Years) • 09:30 AM",
            "category": "personal"
          },
          {
            "label": "Height",
            "value": "5 ft 5 in (165 cm) • Classical Vocalist",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "B.Com (Hons), Chartered Accountant (ICAI All-India Rank)",
            "category": "education_career"
          },
          {
            "label": "Occupation",
            "value": "Assistant Director, KPMG Mumbai • ₹25 LPA",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "Mr. K. R. Iyer (General Manager, RBI - Retd.)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Mrs. Meenakshi Iyer (M.Sc., Educator)",
            "category": "family"
          },
          {
            "label": "Horoscope",
            "value": "Gotra: Kashyapa • Nakshatra: Rohini • Manglik: No",
            "category": "horoscope"
          },
          {
            "label": "Contact",
            "value": "+91 98200 45678 (Parents) • Chembur, Mumbai",
            "category": "contact"
          }
        ]
      }
    },
    "faqs": [
      {
        "question": "What is the main difference between a boy's and girl's matrimonial biodata?",
        "answer": "While both cover personal, educational, and family details, groom profiles typically emphasize job stability, location, and settlement plans, while bride profiles often emphasize educational background, personal interests, and list a parent's contact to safeguard personal privacy."
      },
      {
        "question": "Can I make biodata for both boy and girl using the same template on TrueMarriage?",
        "answer": "Yes. All templates on TrueMarriage are flexible. You can switch field titles, customize astrology sections, and select color themes suited for either brides or grooms."
      },
      {
        "question": "Should annual salary (CTC) be mentioned on the biodata?",
        "answer": "It is optional. Many families prefer mentioning just the profession and company, sharing salary figures later during private discussions. TrueMarriage lets you hide or display salary with a single checkbox."
      },
      {
        "question": "Is photo mandatory in a marriage biodata format?",
        "answer": "Most families expect a clear, professional portrait. However, TrueMarriage supports both formats—with photo or without photo—depending on your community custom or personal comfort."
      }
    ],
    "relatedSlugs": [
      "free-marriage-biodata-maker",
      "free-marriage-biodata-pdf",
      "how-to-make-biodata-for-marriage-online",
      "marriage-biodata-maker-free-download"
    ]
  },
  "free-marriage-biodata-pdf": {
    "slug": "free-marriage-biodata-pdf",
    "category": "format",
    "primaryKeyword": "free marriage biodata pdf",
    "title": "Free Marriage Biodata PDF Download | Print-Ready Templates",
    "description": "Create and download free marriage biodata PDF instantly. Perfectly aligned A4 pages, no font distortions on WhatsApp, zero watermarks.",
    "canonicalPath": "/biodata/free-marriage-biodata-pdf",
    "h1": "Free Marriage Biodata PDF Maker",
    "subheading": "Build a print-ready, high-resolution matrimonial PDF in minutes. Formats that look clean on mobile screens and crisp on color printers.",
    "badge": "Instant PDF Export",
    "themeColor": "#059669",
    "ctaText": "Create Free Biodata PDF",
    "previewCtaText": "View Sample Formats",
    "boyTabLabel": "Groom Format (Boy)",
    "girlTabLabel": "Bride Format (Girl)",
    "whySection": {
      "heading": "Why PDF Is the Only Format You Should Share for Matrimony",
      "intro": "When sending a marriage profile to a prospective match, first impressions matter. Sending a raw Word (.docx) file or a screenshot frequently backfires. Here is why families across India prefer PDF documents.",
      "reasons": [
        {
          "title": "Layout Never Breaks Across Devices",
          "description": "A Word file created on a PC looks completely displaced when opened on a smartphone. Tables spill over, photos shrink, and Hindi or Marathi fonts turn into unreadable boxes. A PDF locks formatting so every phone sees exact typography and margins."
        },
        {
          "title": "Cannot Be Accidentally Edited or Altered",
          "description": "When forwarded through marriage brokers or extended relatives, text in Word files can get unintentionally edited. A PDF protects your personal details as a read-only document."
        },
        {
          "title": "Crisp 300 DPI Printing for Formal Home Visits",
          "description": "TrueMarriage renders vector typography and crisp photo borders. When printed on an A4 sheet for a home meeting, there are no pixelated text artifacts or blurred borders."
        },
        {
          "title": "Lightweight File Size for Quick WhatsApp Sharing",
          "description": "Our PDFs are optimized under 500 KB, downloading instantly even on spotty mobile network connections without losing photo clarity."
        }
      ]
    },
    "howSection": {
      "heading": "How to Generate Your Marriage Biodata PDF for Free",
      "intro": "No software installation, no sign-up barricades. Follow these simple steps.",
      "workflowSteps": [
        {
          "stepNumber": 1,
          "title": "Choose an A4 Matrimonial Layout",
          "description": "Select from single-page modern, traditional framed, or two-column executive layouts."
        },
        {
          "stepNumber": 2,
          "title": "Fill in Your Family and Personal Profile",
          "description": "Type your basic details, educational degrees, career credentials, horoscope data, and family contacts."
        },
        {
          "stepNumber": 3,
          "title": "Upload Your Photograph",
          "description": "Add a high-resolution photo. Crop and position it directly within our circular or rectangular frames."
        },
        {
          "stepNumber": 4,
          "title": "Click Download PDF",
          "description": "Your browser renders and downloads a clean, unwatermarked PDF document ready to forward."
        }
      ],
      "keyElementsToInclude": [
        "Full Name & Clean Professional Photograph",
        "Birth Date, Exact Birth Time, City of Birth",
        "Height, Blood Group, Physical Status",
        "Graduation & Post-Graduation Colleges",
        "Employer, Work Designation & Current City",
        "Horoscope Details (Gotra, Manglik, Nakshatra)",
        "Parents' Occupations & Native Roots",
        "Siblings & Extended Family Overview"
      ],
      "dosAndDonts": {
        "dos": [
          "Keep the document strictly to 1 or 2 pages for easy scanning.",
          "Check phone numbers twice before generating the final PDF.",
          "Use high quality portrait images rather than low-light group crops.",
          "Keep file name clean, e.g., Biodata_Rahul_Sharma.pdf."
        ],
        "donts": [
          "Do not send Word docs (.docx) that require specialized viewer apps.",
          "Do not photograph a printed paper with your phone to share as an image.",
          "Do not use low-resolution thumbnail photos that appear blurred in print.",
          "Avoid adding confidential identification documents like Aadhaar."
        ]
      }
    },
    "whereSection": {
      "heading": "Where to Use Your Marriage Biodata PDF",
      "intro": "A matrimonial biodata should be shared thoughtfully across secure, trusted family touchpoints.",
      "useCases": [
        {
          "title": "Direct WhatsApp Sharing",
          "description": "Send directly to matches, prospective in-laws, or family elders."
        },
        {
          "title": "Community Samaj WhatsApp Groups",
          "description": "Forward to caste or community matrimony coordinators and trusts."
        },
        {
          "title": "Color Printouts for In-Person Rishta Talks",
          "description": "Print physical copies to keep ready when guests visit your home."
        }
      ],
      "downloadAndShareDetails": "All generated files are saved in standard international A4 format (210 x 297 mm), 300 DPI vector quality without watermarks."
    },
    "sampleBiodatas": {
      "boySample": {
        "name": "Rahul Verma",
        "title": "Senior Product Designer • B.Des, NID Ahmedabad",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "14 September 1996 (29 Years) • 07:15 AM",
            "category": "personal"
          },
          {
            "label": "Height",
            "value": "5 ft 11 in (180 cm) • Athletic",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "Bachelor of Design, National Institute of Design (NID)",
            "category": "education_career"
          },
          {
            "label": "Occupation",
            "value": "Product Design Lead, Swiggy Bangalore • ₹28 LPA",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "Mr. Satish Verma (Chief Engineer, PWD - Retd.)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Mrs. Rekha Verma (M.A., School Principal)",
            "category": "family"
          },
          {
            "label": "Horoscope",
            "value": "Gotra: Vashishta • Rashi: Kanya • Manglik: No",
            "category": "horoscope"
          },
          {
            "label": "Contact",
            "value": "+91 98765 12340 (Father) • Bangalore / Lucknow",
            "category": "contact"
          }
        ]
      },
      "girlSample": {
        "name": "Pooja Iyer",
        "title": "Chartered Accountant & Assistant Director • B.Com, ACA",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "28 March 1998 (28 Years) • 09:30 AM",
            "category": "personal"
          },
          {
            "label": "Height",
            "value": "5 ft 5 in (165 cm) • Classical Vocalist",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "B.Com (Hons), Chartered Accountant (ICAI All-India Rank)",
            "category": "education_career"
          },
          {
            "label": "Occupation",
            "value": "Assistant Director, KPMG Mumbai • ₹25 LPA",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "Mr. K. R. Iyer (General Manager, RBI - Retd.)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Mrs. Meenakshi Iyer (M.Sc., Educator)",
            "category": "family"
          },
          {
            "label": "Horoscope",
            "value": "Gotra: Kashyapa • Nakshatra: Rohini • Manglik: No",
            "category": "horoscope"
          },
          {
            "label": "Contact",
            "value": "+91 98200 45678 (Parents) • Chembur, Mumbai",
            "category": "contact"
          }
        ]
      }
    },
    "faqs": [
      {
        "question": "Is the PDF download on TrueMarriage completely free?",
        "answer": "Yes. You can generate, preview, and download your marriage biodata PDF without paying any fee or signing up for a subscription."
      },
      {
        "question": "Will there be a watermark on the downloaded PDF?",
        "answer": "No. TrueMarriage produces clean, professional PDFs without watermark stamps, so your profile looks dignified when sent to families."
      },
      {
        "question": "Can I edit the PDF after downloading?",
        "answer": "PDFs are read-only to preserve styling. However, your data is retained in your browser session, so you can update details on TrueMarriage and generate a new PDF in seconds."
      },
      {
        "question": "What size is the generated PDF?",
        "answer": "The PDF is formatted to standard international A4 dimensions (210 x 297 mm), making it suitable for both digital viewing and standard home or shop printing."
      }
    ],
    "relatedSlugs": [
      "free-marriage-biodata-maker",
      "free-marriage-biodata-pdf",
      "how-to-make-biodata-for-marriage-online",
      "marriage-biodata-maker-free-download"
    ]
  },
  "marriage-biodata-maker-free-download": {
    "slug": "marriage-biodata-maker-free-download",
    "category": "format",
    "primaryKeyword": "marriage biodata maker free download",
    "title": "Marriage Biodata Maker Free Download | Clean PDF Generator",
    "description": "Free download marriage biodata maker. Select modern Indian themes, enter details, preview live, and download high-resolution PDF without charges.",
    "canonicalPath": "/biodata/marriage-biodata-maker-free-download",
    "h1": "Marriage Biodata Maker Free Download",
    "subheading": "Instant high-resolution PDF downloads without hidden fees, email requirements, or watermarks. The quickest way to create an authentic matrimonial profile.",
    "badge": "100% Free Download",
    "themeColor": "#D97706",
    "ctaText": "Create Free Biodata PDF",
    "previewCtaText": "View Sample Formats",
    "boyTabLabel": "Groom Format (Boy)",
    "girlTabLabel": "Bride Format (Girl)",
    "whySection": {
      "heading": "Why Indian Families Choose TrueMarriage for Biodata Downloads",
      "intro": "Most online biodata makers lure users by promising a \"free maker,\" only to ask for Rs. 199 or mandatory phone registration on the final download step. TrueMarriage was built to be transparent, clean, and genuinely free.",
      "reasons": [
        {
          "title": "Zero Hidden Paywalls at Download",
          "description": "You fill in your details, click download, and get your PDF file immediately. No payment gateway redirects, no surprise debit card prompts, and no bait-and-switch tactics."
        },
        {
          "title": "No Watermarks or Promo Branding",
          "description": "Your biodata represents your family's dignity. We do not plaster our logo or promo website URLs across your downloaded document."
        },
        {
          "title": "Authentic Regional and Community Fields",
          "description": "Whether you need Kuldevi, Gotra, Maternal Uncle (Mama) details, or Church membership fields, our templates include authentic options suited for your heritage."
        },
        {
          "title": "Direct Mobile Browser Compatibility",
          "description": "Works effortlessly on mobile Chrome and Safari. You don't need a laptop or expensive desktop software to generate a spotless profile."
        }
      ]
    },
    "howSection": {
      "heading": "Four Quick Steps to Download Your Marriage Biodata",
      "intro": "Follow this straightforward process to create and download your profile right now.",
      "workflowSteps": [
        {
          "stepNumber": 1,
          "title": "Pick a Design Template",
          "description": "Browse through royal traditional borders, subtle florals, or sleek minimalist cards."
        },
        {
          "stepNumber": 2,
          "title": "Fill in Your Information",
          "description": "Add your personal measurements, education, profession, family background, and horoscope facts."
        },
        {
          "stepNumber": 3,
          "title": "Check Real-Time Live Preview",
          "description": "See exactly how your biodata will look on paper before clicking the download button."
        },
        {
          "stepNumber": 4,
          "title": "Instant PDF Download",
          "description": "Click Download PDF to save the unwatermarked file directly to your phone or computer storage."
        }
      ],
      "keyElementsToInclude": [
        "Full Name & Caste / Sub-caste / Gotra",
        "Date, Time and Exact Place of Birth",
        "Height, Weight, Blood Group",
        "Education (Degrees, Universities attended)",
        "Occupation, Company, Annual Income & Job City",
        "Astrology (Rashi, Nakshatra, Charan, Manglik status)",
        "Father's Occupation & Mother's Occupation",
        "Brothers & Sisters (Marital status & work)"
      ],
      "dosAndDonts": {
        "dos": [
          "Ensure your photo is sharp and focused on your face.",
          "Mention your degree clearly rather than vague acronyms.",
          "Specify the town or district for your native place.",
          "Download and view the PDF on your phone before sending to others."
        ],
        "donts": [
          "Do not pay third-party sites charging Rs. 100-300 for basic PDF downloads.",
          "Do not write paragraphs of text; keep points scannable.",
          "Avoid outdated mobile numbers that are no longer active.",
          "Do not use cropped party photos or selfie-stick angles."
        ]
      }
    },
    "whereSection": {
      "heading": "Ideal Channels for Distributing Your Biodata",
      "intro": "A matrimonial biodata should be shared thoughtfully across secure, trusted family touchpoints.",
      "useCases": [
        {
          "title": "Family WhatsApp Exchanges",
          "description": "Directly attach the PDF in chat with relatives and family friends."
        },
        {
          "title": "Community Matrimony Melas",
          "description": "Carry clean printed copies to community meetups and parichay sammelans."
        },
        {
          "title": "Matchmaking Portals & Intermediaries",
          "description": "Provide the PDF to traditional family matchmakers and marriage consultants."
        }
      ],
      "downloadAndShareDetails": "All generated files are saved in standard international A4 format (210 x 297 mm), 300 DPI vector quality without watermarks."
    },
    "sampleBiodatas": {
      "boySample": {
        "name": "Rahul Verma",
        "title": "Senior Product Designer • B.Des, NID Ahmedabad",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "14 September 1996 (29 Years) • 07:15 AM",
            "category": "personal"
          },
          {
            "label": "Height",
            "value": "5 ft 11 in (180 cm) • Athletic",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "Bachelor of Design, National Institute of Design (NID)",
            "category": "education_career"
          },
          {
            "label": "Occupation",
            "value": "Product Design Lead, Swiggy Bangalore • ₹28 LPA",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "Mr. Satish Verma (Chief Engineer, PWD - Retd.)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Mrs. Rekha Verma (M.A., School Principal)",
            "category": "family"
          },
          {
            "label": "Horoscope",
            "value": "Gotra: Vashishta • Rashi: Kanya • Manglik: No",
            "category": "horoscope"
          },
          {
            "label": "Contact",
            "value": "+91 98765 12340 (Father) • Bangalore / Lucknow",
            "category": "contact"
          }
        ]
      },
      "girlSample": {
        "name": "Pooja Iyer",
        "title": "Chartered Accountant & Assistant Director • B.Com, ACA",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "28 March 1998 (28 Years) • 09:30 AM",
            "category": "personal"
          },
          {
            "label": "Height",
            "value": "5 ft 5 in (165 cm) • Classical Vocalist",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "B.Com (Hons), Chartered Accountant (ICAI All-India Rank)",
            "category": "education_career"
          },
          {
            "label": "Occupation",
            "value": "Assistant Director, KPMG Mumbai • ₹25 LPA",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "Mr. K. R. Iyer (General Manager, RBI - Retd.)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Mrs. Meenakshi Iyer (M.Sc., Educator)",
            "category": "family"
          },
          {
            "label": "Horoscope",
            "value": "Gotra: Kashyapa • Nakshatra: Rohini • Manglik: No",
            "category": "horoscope"
          },
          {
            "label": "Contact",
            "value": "+91 98200 45678 (Parents) • Chembur, Mumbai",
            "category": "contact"
          }
        ]
      }
    },
    "faqs": [
      {
        "question": "How do I download the biodata on my mobile phone?",
        "answer": "Fill in your details in our form, click the \"Download PDF\" button, and your browser will automatically save the PDF into your Downloads folder or Files app."
      },
      {
        "question": "Do I need to install any mobile app?",
        "answer": "No. TrueMarriage runs completely inside your mobile or desktop browser. No app store downloads or APK installations are needed."
      },
      {
        "question": "Can I download the biodata in regional languages?",
        "answer": "Yes. We provide complete dedicated templates in Hindi, Marathi, Gujarati, Tamil, Telugu, Kannada, and Bengali."
      },
      {
        "question": "How many times can I download my biodata?",
        "answer": "Unlimited times. You can edit your details, try different layouts, and download as many PDF versions as you like without restrictions."
      }
    ],
    "relatedSlugs": [
      "free-marriage-biodata-maker",
      "free-marriage-biodata-pdf",
      "how-to-make-biodata-for-marriage-online",
      "marriage-biodata-maker-free-download"
    ]
  },
  "how-to-make-biodata-for-marriage-online": {
    "slug": "how-to-make-biodata-for-marriage-online",
    "category": "guide",
    "primaryKeyword": "how to make biodata for marriage online",
    "title": "How to Make Biodata for Marriage Online | Step-by-Step Guide",
    "description": "Complete step-by-step guide on how to make a marriage biodata online. Learn essential fields, proper photo selection, family details, and tips.",
    "canonicalPath": "/biodata/how-to-make-biodata-for-marriage-online",
    "h1": "How to Make Biodata for Marriage Online",
    "subheading": "A practical, step-by-step handbook for creating a dignified Indian matrimonial biodata that highlights your accomplishments, values, and family background.",
    "badge": "Complete Practical Guide",
    "themeColor": "#6366F1",
    "ctaText": "Create Free Biodata PDF",
    "previewCtaText": "View Sample Formats",
    "boyTabLabel": "Groom Format (Boy)",
    "girlTabLabel": "Bride Format (Girl)",
    "whySection": {
      "heading": "Why Making Your Biodata Online Is Faster and More Reliable",
      "intro": "Drafting a marriage biodata manually in Microsoft Word or scanning a handwritten piece of paper frequently leads to awkward formatting, missing details, and embarrassment. Creating it online with structured fields eliminates these mistakes.",
      "reasons": [
        {
          "title": "Guaranteed Completeness of Essential Information",
          "description": "Online generators provide dedicated fields for every standard matrimonial category—from height and education to gotra and mama's surname—so you never accidentally omit details elders care about."
        },
        {
          "title": "Professional Visual Standards Without Graphic Design Skills",
          "description": "You don't need Photoshop or desktop publishing skills. Our layouts balance font sizes, line spacing, margins, and borders automatically."
        },
        {
          "title": "Quick Updates Whenever Circumstances Change",
          "description": "Switched jobs? Relocated to a new city? Updating an online profile takes 30 seconds rather than redesigning an entire Word document from scratch."
        },
        {
          "title": "Instant Digital Sharing on WhatsApp",
          "description": "Generate a clean PDF ready to share in family WhatsApp groups within minutes of meeting a prospective match."
        }
      ]
    },
    "howSection": {
      "heading": "Step-by-Step Walkthrough: Making Your Biodata Online",
      "intro": "Follow this step-by-step path to build a balanced, polished profile from start to finish.",
      "workflowSteps": [
        {
          "stepNumber": 1,
          "title": "Gather Your Key Facts Before You Begin",
          "description": "Collect your exact birth time (from your birth certificate or janam patri), height in feet/inches, degree names, company details, and parents' native village."
        },
        {
          "stepNumber": 2,
          "title": "Select the Right Design Style",
          "description": "Choose a layout that matches your family ethos—modern minimalist for cosmopolitan families or ornate traditional borders for community-focused households."
        },
        {
          "stepNumber": 3,
          "title": "Fill Information in Order of Importance",
          "description": "Start with personal overview, move to education and career, fill horoscope details if relevant, and detail parents, siblings, and contact persons."
        },
        {
          "stepNumber": 4,
          "title": "Add a High-Quality Portrait Photo",
          "description": "Upload a clear, front-facing photograph taken in good natural light with a neat background."
        },
        {
          "stepNumber": 5,
          "title": "Proofread and Export PDF",
          "description": "Review every spelling and phone number in live preview mode, then download your unwatermarked PDF."
        }
      ],
      "keyElementsToInclude": [
        "Personal Identity: Full Name, Date of Birth, Height, Complexion",
        "Academic Credentials: Graduation / Post-Graduation details",
        "Career Details: Organization Name, Designation, Work Location, Annual CTC",
        "Horoscope: Gotra, Nakshatra, Manglik status, Birth Time and City",
        "Family Background: Father's & Mother's Occupation, Native Place",
        "Siblings: Elder / Younger brothers and sisters with marital status",
        "Contact Details: Father's Phone, Groom's Mobile, Home Address"
      ],
      "dosAndDonts": {
        "dos": [
          "Be transparent and honest about education and employment.",
          "Specify the city where you are currently living versus your native place.",
          "Have family elders review the drafted profile before sharing externally.",
          "Keep file names professional, avoiding generic names like \"biodata_final_v2.pdf\"."
        ],
        "donts": [
          "Do not exaggerate job titles or educational credentials.",
          "Avoid lengthy paragraphs about childhood hobbies or broad philosophies.",
          "Do not upload cropped group photos or awkward selfie angles.",
          "Do not skip phone numbers for primary family representatives."
        ]
      }
    },
    "whereSection": {
      "heading": "Effective Ways to Distribute Your Matrimonial Profile",
      "intro": "A matrimonial biodata should be shared thoughtfully across secure, trusted family touchpoints.",
      "useCases": [
        {
          "title": "WhatsApp Direct Messages",
          "description": "Send with a polite introductory note from the candidate or parent."
        },
        {
          "title": "Matrimonial Portals",
          "description": "Attach to verified profiles on major matchmaking websites."
        },
        {
          "title": "Printed Folders for Formal Introductions",
          "description": "Keep cleanly printed copies ready for traditional home visits and family introductions."
        }
      ],
      "downloadAndShareDetails": "All generated files are saved in standard international A4 format (210 x 297 mm), 300 DPI vector quality without watermarks."
    },
    "sampleBiodatas": {
      "boySample": {
        "name": "Rahul Verma",
        "title": "Senior Product Designer • B.Des, NID Ahmedabad",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "14 September 1996 (29 Years) • 07:15 AM",
            "category": "personal"
          },
          {
            "label": "Height",
            "value": "5 ft 11 in (180 cm) • Athletic",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "Bachelor of Design, National Institute of Design (NID)",
            "category": "education_career"
          },
          {
            "label": "Occupation",
            "value": "Product Design Lead, Swiggy Bangalore • ₹28 LPA",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "Mr. Satish Verma (Chief Engineer, PWD - Retd.)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Mrs. Rekha Verma (M.A., School Principal)",
            "category": "family"
          },
          {
            "label": "Horoscope",
            "value": "Gotra: Vashishta • Rashi: Kanya • Manglik: No",
            "category": "horoscope"
          },
          {
            "label": "Contact",
            "value": "+91 98765 12340 (Father) • Bangalore / Lucknow",
            "category": "contact"
          }
        ]
      },
      "girlSample": {
        "name": "Pooja Iyer",
        "title": "Chartered Accountant & Assistant Director • B.Com, ACA",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "28 March 1998 (28 Years) • 09:30 AM",
            "category": "personal"
          },
          {
            "label": "Height",
            "value": "5 ft 5 in (165 cm) • Classical Vocalist",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "B.Com (Hons), Chartered Accountant (ICAI All-India Rank)",
            "category": "education_career"
          },
          {
            "label": "Occupation",
            "value": "Assistant Director, KPMG Mumbai • ₹25 LPA",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "Mr. K. R. Iyer (General Manager, RBI - Retd.)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Mrs. Meenakshi Iyer (M.Sc., Educator)",
            "category": "family"
          },
          {
            "label": "Horoscope",
            "value": "Gotra: Kashyapa • Nakshatra: Rohini • Manglik: No",
            "category": "horoscope"
          },
          {
            "label": "Contact",
            "value": "+91 98200 45678 (Parents) • Chembur, Mumbai",
            "category": "contact"
          }
        ]
      }
    },
    "faqs": [
      {
        "question": "What are the most critical fields in an Indian marriage biodata?",
        "answer": "The five critical pillars are: 1. Personal Overview (Name, Birth Date/Time, Height), 2. Education & Career, 3. Astrological facts (Gotra, Nakshatra, Manglik status), 4. Family background (Parents, Siblings, Native place), and 5. Contact information."
      },
      {
        "question": "How should I choose a good photo for my marriage biodata?",
        "answer": "Select a recent, clear portrait photo with natural lighting, a clean background, and modest, tasteful attire. Avoid dark lighting, sunglasses, or group pictures where you must crop others out."
      },
      {
        "question": "Can I make a biodata if my family does not follow astrology or horoscopes?",
        "answer": "Yes. TrueMarriage makes astrological fields completely optional. If left blank, sections automatically adjust so there are no empty gaps on your final document."
      },
      {
        "question": "Is it safe to make a marriage biodata online?",
        "answer": "Yes. TrueMarriage processes your information locally in your browser. We do not store or sell your sensitive family data to commercial marketing brokers."
      }
    ],
    "relatedSlugs": [
      "free-marriage-biodata-maker",
      "free-marriage-biodata-pdf",
      "how-to-make-biodata-for-marriage-online",
      "marriage-biodata-maker-free-download"
    ]
  },
  "marriage-biodata-in-hindi": {
    "slug": "marriage-biodata-in-hindi",
    "category": "language",
    "primaryKeyword": "marriage biodata in hindi",
    "title": "विवाह बायोडाटा मेकर हिंदी में | फ्री शादी बायोडाटा फॉर्मेट PDF",
    "description": "हिंदी में सुंदर विवाह बायोडाटा ऑनलाइन बनाएं। पारंपरिक और आधुनिक देवनागरी टेम्पलेट्स, कुंडली विवरण, गोत्र और परिवार परिचय। बिना किसी शुल्क के PDF डाउनलोड करें।",
    "canonicalPath": "/biodata/marriage-biodata-in-hindi",
    "h1": "हिंदी में विवाह बायोडाटा बनाएं",
    "nativeScript": "॥ श्री गणेशाय नमः ॥",
    "subheading": "पारंपरिक मांगलिक प्रतीक, देवनागरी फॉन्ट और सुव्यवस्थित प्रारूप के साथ अपनी मातृभाषा में शादी का परिचय पत्र तैयार करें।",
    "badge": "हिंदी विवाह परिचय पत्र",
    "themeColor": "#DC2626",
    "ctaText": "मुफ्त हिंदी बायोडाटा बनाएं",
    "previewCtaText": "हिंदी टेम्पलेट्स देखें",
    "boyTabLabel": "वर (लड़का) बायोडाटा",
    "girlTabLabel": "वधू (लड़की) बायोडाटा",
    "whySection": {
      "heading": "हिंदी में विवाह बायोडाटा बनाना क्यों आवश्यक है?",
      "intro": "विवाह केवल दो व्यक्तियों का नहीं, बल्कि दो परिवारों का मिलन होता है। उत्तर और मध्य भारत के अधिकांश परिवारों में बड़े-बुजुर्ग हिंदी में लिखा हुआ परिचय पत्र अधिक सहजता और आदर से पढ़ते हैं। मातृभाषा में तैयार किया गया बायोडाटा पारिवारिक मर्यादा और अपनी संस्कृति के प्रति सम्मान दर्शाता है।",
      "reasons": [
        {
          "title": "परिवार के बुजुर्गों के लिए पढ़ने में सहज",
          "description": "घर के दादा-दादी और वरिष्ठ सदस्य अंग्रेजी की तुलना में देवनागरी लिपि में विवरण आसानी से समझ लेते हैं। इससे रिश्ते की पहली बातचीत में कोई भ्रम नहीं रहता।"
        },
        {
          "title": "पारंपरिक एवं ज्योतिषीय शब्दों की स्पष्टता",
          "description": "गोत्र, ननिहाल (मामा का गोत्र), कुलदेवी, मांगलिक स्थिति, राशि और नक्षत्र जैसे शब्द हिंदी में ही अपना वास्तविक और सटीक अर्थ प्रकट करते हैं।"
        },
        {
          "title": "मांगलिक और सांस्कृतिक गरिमा",
          "description": "॥ श्री गणेशाय नमः ॥, ॐ, या स्वास्तिक जैसे पवित्र प्रतीकों के साथ तैयार हिंदी बायोडाटा मांगलिक उत्सव और शुचिता का वातावरण बनाता है।"
        },
        {
          "title": "व्हाट्सएप पर बिना फॉन्ट टूटे साफ दिखेगा",
          "description": "ट्रूमैरिज का शुद्ध यूनिकोड देवनागरी फॉर्मेट किसी भी स्मार्टफोन पर बिना फॉन्ट बिगड़े बिल्कुल स्पष्ट और सुंदर दिखाई देता है।"
        }
      ]
    },
    "howSection": {
      "heading": "हिंदी में विवाह बायोडाटा कैसे तैयार करें?",
      "intro": "ट्रूमैरिज पर मात्र 5 मिनट में अपना संपूर्ण हिंदी विवाह बायोडाटा बनाएं:",
      "workflowSteps": [
        {
          "stepNumber": 1,
          "title": "मनपसंद हिंदी टेम्पलेट चुनें",
          "description": "पारंपरिक कलश, स्वास्तिक या आधुनिक बॉर्डर वाले सुंदर देवनागरी डिजाइन में से अपना पसंदीदा प्रारूप चुनें।"
        },
        {
          "stepNumber": 2,
          "title": "व्यक्तिगत एवं शैक्षिक विवरण दर्ज करें",
          "description": "पूरा नाम, जन्म तिथि, जन्म समय, जन्म स्थान, कद, शैक्षणिक योग्यता और वर्तमान नौकरी या व्यवसाय का विवरण भरें।"
        },
        {
          "stepNumber": 3,
          "title": "पारिवारिक और कुंडली का विवरण जोड़ें",
          "description": "पिताजी एवं माताजी का व्यवसाय, भाई-बहनों की स्थिति, ननिहाल का विवरण, गोत्र, राशि और संपर्क सूत्र जोड़ें।"
        },
        {
          "stepNumber": 4,
          "title": "मुफ्त PDF डाउनलोड करें",
          "description": "स्क्रीन पर लाइव प्रिव्यू देखकर सब जांचें और तुरंत हाई-क्वालिटी प्रिंट-रेडी PDF डाउनलोड करें।"
        }
      ],
      "keyElementsToInclude": [
        "पूरा नाम एवं सुंदर पासपोर्ट साइज फोटो",
        "जन्म तिथि, जन्म समय एवं जन्म स्थान",
        "ऊंचाई (कद), रंग-रूप एवं रक्त समूह",
        "उच्चतम शिक्षा (डिग्री एवं कॉलेज)",
        "व्यवसाय / नौकरी, कंपनी का नाम, पद एवं वार्षिक आय",
        "गोत्र, ननिहाल गोत्र, मांगलिक स्थिति, राशि व नक्षत्र",
        "पिताजी का नाम व व्यवसाय, माताजी का नाम व परिचय",
        "भाई एवं बहनों का विवरण (विवाहित / अध्ययनरत)"
      ],
      "dosAndDonts": {
        "dos": [
          "जन्म समय और स्थान का विवरण जन्म-पत्री या अस्पताल प्रमाण पत्र से देखकर सही भरें।",
          "मातृभाषा में लिखते समय मात्राओं और वर्तनी (स्पेलिंग) की जांच अवश्य करें।",
          "पारिवारिक पृष्ठभूमि में पैतृक गांव व जिले का नाम स्पष्ट लिखें।",
          "साफ और शालीन पोशाक वाली हालिया फोटो ही लगाएं।"
        ],
        "donts": [
          "धुंधली या चश्मे/धूप के चश्मे वाली सेल्फी फोटो न लगाएं।",
          "अधूरे फोन नंबर या बिना कोड वाले नंबर न लिखें।",
          "शिक्षा या वेतन के बारे में कोई भ्रामक जानकारी न दें।",
          "आधार कार्ड या बैंक खाते जैसी गोपनीय जानकारी कभी न जोड़ें।"
        ]
      }
    },
    "whereSection": {
      "heading": "हिंदी बायोडाटा कहां और कैसे साझा करें?",
      "intro": "विवाह केवल दो व्यक्तियों का नहीं, बल्कि दो परिवारों का मिलन होता है। उत्तर और मध्य भारत के अधिकांश परिवारों में बड़े-बुजुर्ग हिंदी में लिखा हुआ परिचय पत्र अधिक सहजता और आदर से पढ़ते हैं। मातृभाषा में तैयार किया गया बायोडाटा पारिवारिक मर्यादा और अपनी संस्कृति के प्रति सम्मान दर्शाता है।",
      "useCases": [
        {
          "title": "पारिवारिक व्हाट्सएप ग्रुप व रिश्तेदार",
          "description": "पीडीएफ फाइल किसी भी फोन पर बिना लाइन टूटे बिल्कुल वैसी ही खुलती है जैसी आपने बनाई है।"
        },
        {
          "title": "समाज के विवाह परिचय सम्मेलन",
          "description": "सम्मेलन में जमा करने के लिए इसकी 3-4 रंगीन प्रिंट प्रतियां निकाल कर ले जाएं।"
        },
        {
          "title": "घर पर होने वाली पहली पारिवारिक मुलाकात",
          "description": "जब मेहमान घर आएं, तो सम्मानपूर्वक उनके हाथ में साफ-सुथरा प्रिंटेड बायोडाटा दें।"
        }
      ],
      "downloadAndShareDetails": "डाउनलोड किया गया पीडीएफ मानक अंतरराष्ट्रीय A4 आकार (210 x 297 मिमी) में होता है, जो किसी भी प्रिंटर और व्हाट्सएप पर बिल्कुल स्पष्ट खुलता है।"
    },
    "sampleBiodatas": {
      "boySample": {
        "name": "आदित्य शर्मा",
        "title": "सॉफ्टवेयर इंजीनियर • बी.टेक (आईआईटी दिल्ली)",
        "fields": [
          {
            "label": "जन्म विवरण",
            "value": "14 नवंबर 1996 (आयु: 29 वर्ष) • सुबह 08:30 बजे",
            "category": "personal"
          },
          {
            "label": "कद एवं वर्ण",
            "value": "5 फुट 10 इंच • गोरा वर्ण • रक्त समूह B+",
            "category": "personal"
          },
          {
            "label": "शिक्षा",
            "value": "बी.टेक (कंप्यूटर साइंस), आईआईटी दिल्ली",
            "category": "education_career"
          },
          {
            "label": "व्यवसाय व आय",
            "value": "सीनियर सॉफ्टवेयर इंजीनियर, गूगल बेंगलुरु • ₹32 लाख/वर्ष",
            "category": "education_career"
          },
          {
            "label": "पिताजी",
            "value": "श्री रमेश शर्मा (मुख्य प्रबंधक, भारतीय स्टेट बैंक - से.नि.)",
            "category": "family"
          },
          {
            "label": "माताजी",
            "value": "श्रीमती सुनीता शर्मा (गृहिणी)",
            "category": "family"
          },
          {
            "label": "गोत्र व ननिहाल",
            "value": "गोत्र: भारद्वाज • ननिहाल: कश्यप • कुलदेवी: शाकंभरी माता",
            "category": "horoscope"
          },
          {
            "label": "कुंडली विवरण",
            "value": "मांगलिक: नहीं • राशि: धनु • नक्षत्र: मूल (चरण 2)",
            "category": "horoscope"
          },
          {
            "label": "संपर्क सूत्र",
            "value": "+91 98765 43210 (पिताजी) • जयपुर, राजस्थान",
            "category": "contact"
          }
        ]
      },
      "girlSample": {
        "name": "अनन्या मिश्रा",
        "title": "चार्टर्ड अकाउंटेंट (CA) • सीनियर फाइनेंशियल एनालिस्ट",
        "fields": [
          {
            "label": "जन्म विवरण",
            "value": "22 अगस्त 1998 (आयु: 27 वर्ष) • शाम 06:15 बजे",
            "category": "personal"
          },
          {
            "label": "कद एवं स्वभाव",
            "value": "5 फुट 5 इंच • शालीन एवं परिवार-प्रिय",
            "category": "personal"
          },
          {
            "label": "शिक्षा",
            "value": "बी.कॉम (ऑनर्स), सीए (ICAI 2021)",
            "category": "education_career"
          },
          {
            "label": "व्यवसाय",
            "value": "फाइनेंशियल कंसलटेंट, डेलॉइट गुरुग्राम",
            "category": "education_career"
          },
          {
            "label": "पिताजी",
            "value": "श्री दिनेश मिश्रा (अधिवक्ता, उच्च न्यायालय)",
            "category": "family"
          },
          {
            "label": "माताजी",
            "value": "श्रीमती प्रतिभा मिश्रा (एम.ए. हिंदी, शिक्षिका)",
            "category": "family"
          },
          {
            "label": "गोत्र व ननिहाल",
            "value": "गोत्र: पराशर • ननिहाल: वशिष्ठ • मूल: प्रयागराज",
            "category": "horoscope"
          },
          {
            "label": "कुंडली विवरण",
            "value": "मांगलिक: नहीं • राशि: कन्या • नक्षत्र: हस्त",
            "category": "horoscope"
          },
          {
            "label": "संपर्क सूत्र",
            "value": "+91 98112 34567 (अभिभावक) • दिल्ली-एनसीआर",
            "category": "contact"
          }
        ]
      }
    },
    "faqs": [
      {
        "question": "क्या ट्रूमैरिज पर हिंदी बायोडाटा बनाना पूरी तरह मुफ्त है?",
        "answer": "हाँ, आप बिना किसी शुल्क या छुपाए गए चार्ज के अपना पूरा हिंदी बायोडाटा तैयार कर सकते हैं और डाउनलोड कर सकते हैं।"
      },
      {
        "question": "क्या मुझे हिंदी में टाइप करने के लिए अलग कीबोर्ड चाहिए?",
        "answer": "नहीं, आप अपने मोबाइल या कंप्यूटर के सामान्य कीबोर्ड से हिंग्लिश (जैसे: Rahul Sharma -> राहुल शर्मा) टाइप कर सकते हैं, या सीधे देवनागरी में लिख सकते हैं।"
      },
      {
        "question": "क्या डाउनलोड किए गए हिंदी पीडीएफ पर कोई वॉटरमार्क रहेगा?",
        "answer": "बिल्कुल नहीं। ट्रूमैरिज का पीडीएफ पूर्णतः स्वच्छ और बिना किसी वॉटरमार्क के होता है।"
      },
      {
        "question": "क्या इसमें ननिहाल (मामा का गोत्र) जोड़ने का विकल्प है?",
        "answer": "हाँ, हमारे हिंदी प्रारूपों में पैतृक गोत्र, ननिहाल का गोत्र और कुलदेवी का विशेष स्थान दिया गया है।"
      }
    ],
    "relatedSlugs": [
      "free-marriage-biodata-maker",
      "free-marriage-biodata-pdf",
      "marriage-biodata-format-for-boy-and-girl",
      "hindu-marriage-biodata"
    ]
  },
  "marriage-biodata-in-marathi": {
    "slug": "marriage-biodata-in-marathi",
    "category": "language",
    "primaryKeyword": "marriage biodata in marathi",
    "title": "मराठी विवाह बायोडेटा मेकर | मोफत लग्न बायोडेटा फॉरमॅट PDF",
    "description": "मराठीत सुंदर लग्न बायोडेटा ऑनलाइन बनवा. श्री गणेशाय नमः, कुलदैवत, राशी, नक्षत्र, ननिहाळ आणि कौटुंबिक माहितीसह परिपूर्ण देवनागरी फॉरमॅट मोफत डाऊनलोड करा.",
    "canonicalPath": "/biodata/marriage-biodata-in-marathi",
    "h1": "मराठीत विवाह बायोडेटा तयार करा",
    "nativeScript": "॥ श्री गणेशाय नमः ॥",
    "subheading": "महाराष्ट्रीयन संस्कृती आणि परंपरेला साजेसा, कुलदैवत, गोत्र, पत्रिका आणि कौटुंबिक माहितीने परिपूर्ण विवाह परिचय पत्र.",
    "badge": "मराठी विवाह परिचय पत्र",
    "themeColor": "#E11D48",
    "ctaText": "मोफत मराठी बायोडेटा बनवा",
    "previewCtaText": "मराठी नमुने पहा",
    "boyTabLabel": "वर (मुलगा) बायोडेटा",
    "girlTabLabel": "वधू (मुलगी) बायोडेटा",
    "whySection": {
      "heading": "मराठीत लग्न बायोडेटा बनवणे का महत्त्वाचे आहे?",
      "intro": "महाराष्ट्रामध्ये लग्नाची बोलणी करताना घरचे ज्येष्ठ मंडळी आणि नातेवाईक मराठीतील बायोडेटा वाचण्यास प्राधान्य देतात. पत्रिका जुळवणे, कुलदैवत, देवक, गोत्र आणि मामाचे कुल यासारख्या गोष्टी मराठी भाषेतच योग्य आणि आदरयुक्त पद्धतीने मांडता येतात.",
      "reasons": [
        {
          "title": "घरातील वडीलधाऱ्या मंडळींना वाचण्यास सोपे",
          "description": "घरातील आजी-आजोबा आणि ज्येष्ठ नातेवाईकांना इंग्रजीपेक्षा मराठीतील मजकूर अधिक आत्मीयतेने आणि सहजतेने समजतो."
        },
        {
          "title": "महाराष्ट्रीयन परंपरेतील महत्त्वाच्या नोंदी",
          "description": "कुलदैवत, मूळ गाव, नानिहाळ (मामाचे आडनाव व गाव), रक्तगट आणि देवक यासारख्या आवश्यक नोंदी अचूक मांडता येतात."
        },
        {
          "title": "पत्रिका व गुणमिलनासाठी अचूक माहिती",
          "description": "जन्मवेळ, जन्मठिकाण, नक्षत्र, चरण, रास आणि नाडी यासारखा पत्रिकेचा तपशील मराठीत अगदी स्पष्ट राहतो."
        },
        {
          "title": "व्हॉट्सअ‍ॅपवर फॉन्ट न बिघडता दिसतो",
          "description": "ट्रूमॅरेजचा उच्च दर्जाचा युनिकोड मराठी फॉरमॅट कोणत्याही मोबाईलवर अगदी व्यवस्थित आणि सुबक दिसतो."
        }
      ]
    },
    "howSection": {
      "heading": "मराठीत विवाह बायोडेटा कसा तयार करावा?",
      "intro": "फक्त काही मिनिटांत खालील सोप्या टप्प्यांचा वापर करून तुमचा बायोडेटा तयार करा:",
      "workflowSteps": [
        {
          "stepNumber": 1,
          "title": "पसंतीचा मराठी नमुना निवडा",
          "description": "पारंपरिक शिवकालीन किंवा आधुनिक डिझाइनमधील देखणा मराठी फॉरमॅट निवडा."
        },
        {
          "stepNumber": 2,
          "title": "वैयक्तिक व शैक्षणिक माहिती भरा",
          "description": "पूर्ण नाव, जन्मतारीख, जन्मवेळ, जन्मस्थान, उंची, शिक्षण आणि नोकरी/व्यवसायाचा तपशील नोंदवा."
        },
        {
          "stepNumber": 3,
          "title": "कौटुंबिक व पत्रिकेची माहिती जोडा",
          "description": "वडिलांचे नाव, आईचे नाव, भावंडांची माहिती, कुलदैवत, गोत्र, रास आणि मामाचे घराणे जोडा."
        },
        {
          "stepNumber": 4,
          "title": "मोफत PDF डाऊनलोड करा",
          "description": "थेट स्क्रीनवर खात्री करा आणि एका क्लिकवर स्वच्छ, वॉटरमार्क नसलेली PDF डाऊनलोड करा."
        }
      ],
      "keyElementsToInclude": [
        "पूर्ण नाव व पासपोर्ट साईज फोटो",
        "जन्मतारीख, जन्मवेळ व अचूक जन्मस्थळ",
        "उंची, वर्ण व रक्तगट",
        "शिक्षण (पदवी, कॉलेजचे नाव)",
        "नोकरी/व्यवसाय, कंपनीचे नाव, पद, पगार व कार्यक्षेत्र",
        "रास, नक्षत्र, चरण, गोत्र, नाडी व मंगळ",
        "कुलदैवत व मूळ गाव",
        "वडिलांचे व आईचे नाव व व्यवसाय"
      ],
      "dosAndDonts": {
        "dos": [
          "पत्रिका जुळवण्यासाठी जन्मवेळ अचूक (सकाळ/संध्याकाळ नमूद करून) लिहा.",
          "मूळ गाव व सध्याचा राहता पत्ता दोन्ही स्पष्टपणे लिहा.",
          "मामाचे आडनाव आणि गाव अवश्य नमूद करा, महाराष्ट्रात याला फार महत्त्व असते.",
          "नेहमी ताजी आणि प्रसन्न मुद्रेतील छायाचित्र वापरा."
        ],
        "donts": [
          "अस्पष्ट किंवा सेल्फी घेतलेला फोटो वापरू नका.",
          "माहिती खूप दाटीवाटीने लिहू नका; मुद्देसूदपणा ठेवा.",
          "शिक्षणाविषयी किंवा पगाराविषयी चुकीची माहिती लिहू नका.",
          "आधार कार्ड क्रमांक किंवा बँक खात्याचा तपशील कधीही टाकू नका."
        ]
      }
    },
    "whereSection": {
      "heading": "मराठी बायोडेटा कुठे व कसा वापरावा?",
      "intro": "महाराष्ट्रामध्ये लग्नाची बोलणी करताना घरचे ज्येष्ठ मंडळी आणि नातेवाईक मराठीतील बायोडेटा वाचण्यास प्राधान्य देतात. पत्रिका जुळवणे, कुलदैवत, देवक, गोत्र आणि मामाचे कुल यासारख्या गोष्टी मराठी भाषेतच योग्य आणि आदरयुक्त पद्धतीने मांडता येतात.",
      "useCases": [
        {
          "title": "नातेवाईक आणि व्हॉट्सअ‍ॅप ग्रुप्स",
          "description": "मोबाईलवर वाचताना कोणतीही ओळ तुटत नाही आणि आकार बदलत नाही."
        },
        {
          "title": "वधू-वर सूचक मंडळे व मेळावे",
          "description": "संस्थेत नोंदणी करताना सुबक प्रिंट प्रत सोबत जोडा."
        },
        {
          "title": "कांदे-पोहे किंवा घरगुती पहिली भेट",
          "description": "पाहुणे घरी आल्यावर आदराने पाहण्यासाठी हातामध्ये छापील प्रत द्या."
        }
      ],
      "downloadAndShareDetails": "डाऊनलोड केलेली PDF फाईल आंतरराष्ट्रीय A4 आकारात (210 x 297 मिमी) असून कोणत्याही प्रिंटरवर तसेच व्हॉट्सअ‍ॅपवर स्पष्ट दिसते."
    },
    "sampleBiodatas": {
      "boySample": {
        "name": "रोहन मिलिंद देशपांडे",
        "title": "प्रॉडक्ट डिझायनर • बी.ई. (पुणे विद्यापीठ), एम.डीईएस",
        "fields": [
          {
            "label": "जन्म तपशील",
            "value": "18 ऑक्टोबर 1995 (वय: 30 वर्षे) • सकाळी 06:45",
            "category": "personal"
          },
          {
            "label": "उंची व रक्तगट",
            "value": "5 फूट 11 इंच • देखणा वर्ण • रक्तगट: O+",
            "category": "personal"
          },
          {
            "label": "शिक्षण",
            "value": "बी.ई. (मेकॅनिकल), एम.डीईएस (आयआयटी बॉम्बे)",
            "category": "education_career"
          },
          {
            "label": "नोकरी व उत्पन्न",
            "value": "प्रॉडक्ट लीड, टाटा कन्सल्टन्सी सर्व्हिसेस, पुणे • ₹26 लाख/वर्ष",
            "category": "education_career"
          },
          {
            "label": "वडिलांचे नाव",
            "value": "श्री. मिलिंद देशपांडे (सेवानिवृत्त क्लास-1 शासकीय अधिकारी)",
            "category": "family"
          },
          {
            "label": "आईचे नाव",
            "value": "सौ. शुभांगी देशपांडे (गृहिणी)",
            "category": "family"
          },
          {
            "label": "कुलदैवत व मूळ गाव",
            "value": "कुलदैवत: महालक्ष्मी (कोल्हापूर) • मूळ गाव: सातारा",
            "category": "horoscope"
          },
          {
            "label": "पत्रिका तपशील",
            "value": "रास: सिंह • नक्षत्र: मघा • नाडी: अंत्य • मंगळ: नाही",
            "category": "horoscope"
          },
          {
            "label": "मामाचे घराणे",
            "value": "जोशी (पुणे) • संपर्क: +91 98220 12345 (वडील)",
            "category": "contact"
          }
        ]
      },
      "girlSample": {
        "name": "सायली अविनाश जोशी",
        "title": "सॉफ्टवेअर आर्किटेक्ट • एम.एस. (कॉम्प्युटर सायन्स)",
        "fields": [
          {
            "label": "जन्म तपशील",
            "value": "05 मे 1997 (वय: 28 वर्षे) • दुपारी 02:30",
            "category": "personal"
          },
          {
            "label": "उंची व स्वभाव",
            "value": "5 फूट 4 इंच • शांत, सुस्वभावी आणि वाचनाची आवड",
            "category": "personal"
          },
          {
            "label": "शिक्षण",
            "value": "बी.ई. (आयटी, सीओईपी पुणे), एम.एस.",
            "category": "education_career"
          },
          {
            "label": "नोकरी",
            "value": "टेक्नॉलॉजी कन्सल्टंट, इन्फोसिस हिंजवडी पुणे",
            "category": "education_career"
          },
          {
            "label": "वडिलांचे नाव",
            "value": "श्री. अविनाश जोशी (व्यावसायिक, बांधकाम क्षेत्र)",
            "category": "family"
          },
          {
            "label": "आईचे नाव",
            "value": "सौ. मनीषा जोशी (एम.ए. संगीत, शिक्षिका)",
            "category": "family"
          },
          {
            "label": "कुलदैवत व पत्रिका",
            "value": "कुलदैवत: काळभैरव • रास: मेष • नक्षत्र: भरणी • गोत्र: वत्स",
            "category": "horoscope"
          },
          {
            "label": "मामाचे घराणे",
            "value": "कुलकर्णी (नाशिक) • भाऊ: 1 लहान (इंजिनिअरिंग शिक्षण)",
            "category": "family"
          },
          {
            "label": "संपर्क पत्ता",
            "value": "+91 98231 98765 (पालक) • कोथरूड, पुणे",
            "category": "contact"
          }
        ]
      }
    },
    "faqs": [
      {
        "question": "ट्रूमॅरेजवर मराठी बायोडेटा बनवण्यासाठी पैसे लागतात का?",
        "answer": "नाही, ट्रूमॅरेजवर मराठी बायोडेटा पूर्णपणे मोफत तयार करता येतो आणि डाऊनलोड करता येतो."
      },
      {
        "question": "माझ्या मोबाईलमध्ये मराठी कीबोर्ड नसेल तर कसे टाईप करावे?",
        "answer": "तुम्ही इंग्रजी अक्षरांमध्ये (जसे ki: Ramesh Patil -> रमेश पाटील) टाईप करू शकता, आमची प्रणाली ते मराठीत रूपांतरित करण्यास मदत करते."
      },
      {
        "question": "बायोडेटावर वॉटरमार्क येतो का?",
        "answer": "नाही, डाऊनलोड होणाऱ्या PDF वर कोणताही वॉटरमार्क किंवा जाहिरात नसते."
      },
      {
        "question": "यामध्ये कुलदैवत आणि मामाचे गाव लिहिता येते का?",
        "answer": "होय, महाराष्ट्रातील पद्धतीनुसार कुलदैवत, देवक, मूळ गाव आणि मामाचे घराणे लिहिण्यासाठी स्वतंत्र रकाने दिलेले आहेत."
      }
    ],
    "relatedSlugs": [
      "free-marriage-biodata-maker",
      "free-marriage-biodata-pdf",
      "marriage-biodata-format-for-boy-and-girl",
      "hindu-marriage-biodata"
    ]
  },
  "gujarati-marriage-biodata": {
    "slug": "gujarati-marriage-biodata",
    "category": "language",
    "primaryKeyword": "gujarati marriage biodata",
    "title": "ગુજરાતી લગ્ન બાયોડેટા મેકર | ફ્રી મેરેજ બાયોડેટા PDF ફોર્મેટ",
    "description": "ગુજરાતીમાં લગ્ન માટે બાયોડેટા બનાવો. શ્રી ગણેશાય નમઃ, મોસાળની વિગત, ગોત્ર, કુંડળી અને પરિવારની માહિતી સાથે પ્રીમિયમ ગુજરાતી બાયોડેટા ફોર્મેટ ફ્રી ડાઉનલોડ કરો.",
    "canonicalPath": "/biodata/gujarati-marriage-biodata",
    "h1": "ગુજરાતીમાં લગ્ન બાયોડેટા બનાવો",
    "nativeScript": "॥ શ્રી ગણેશાય નમઃ ॥",
    "subheading": "સંસ્કારી પરંપરા, મોસાળની વિગત, કુંડળી અને વ્યવસાયિક સિદ્ધિઓ સાથે તમારી માતૃભાષામાં પરિચય પત્ર તૈયાર કરો.",
    "badge": "ગુજરાતી લગ્ન પરિચય પત્ર",
    "themeColor": "#D97706",
    "ctaText": "મફત ગુજરાતી બાયોડેટા બનાવો",
    "previewCtaText": "ગુજરાતી ટેમ્પલેટ્સ જુઓ",
    "boyTabLabel": "વર (છોકરો) બાયોડેટા",
    "girlTabLabel": "કન્યા (છોકરી) બાયોડેટા",
    "whySection": {
      "heading": "શા માટે ગુજરાતીમાં લગ્ન બાયોડેટા બનાવવો જોઈએ?",
      "intro": "ગુજરાતી પરિવારોમાં સંબંધની શરૂઆત વડીલો દ્વારા બાયોડેટાના વાંચનથી થાય છે. માતૃભાષામાં લખાયેલો બાયોડેટા પરિવારના સંસ્કાર, મોસાળ પક્ષનું માન અને વ્યવહારિક પારદર્શિતા દર્શાવે છે.",
      "reasons": [
        {
          "title": "કુટુંબના વડીલો માટે વાંચવામાં સરળ",
          "description": "ઘરના દાદા-દાદી અને વડીલો ગુજરાતી લિપિમાં લખેલી માહિતી વધારે રસપૂર્વક અને સહેલાઈથી સમજી શકે છે."
        },
        {
          "title": "મોસાળ પક્ષ અને વતનની સ્પષ્ટતા",
          "description": "ગુજરાતી સંસ્કૃતિમાં મોસાળ (મામાનું કુટુંબ) અને મૂળ વતનનું વિશેષ મહત્વ છે, જે ગુજરાતી ફોર્મેટમાં ખૂબ જ સરસ રીતે ગોઠવી શકાય છે."
        },
        {
          "title": "કુંડળી અને ગોત્રની સચોટ વિગત",
          "description": "જન્મ સમય, જન્મ સ્થળ, રાશિ, નક્ષત્ર અને ગોત્ર જેવી જ્યોતિષીય વિગતો માતૃભાષામાં સ્પષ્ટ દેખાય છે."
        },
        {
          "title": "વોટ્સએપ પર એકદમ ચોખ્ખો દેખાવ",
          "description": "ટ્રુમેરેજનું ગુજરાતી યુનિકોડ ફોર્મેટ ફોન્ટ બગડ્યા વગર કોઈપણ મોબાઇલમાં સુંદર રીતે ખુલે છે."
        }
      ]
    },
    "howSection": {
      "heading": "ગુજરાતીમાં લગ્ન બાયોડેટા કેવી રીતે બનાવવો?",
      "intro": "માત્ર ૫ મિનિટમાં નીચેના સરળ પગલાં અનુસરીને તમારો બાયોડેટા તૈયાર કરો:",
      "workflowSteps": [
        {
          "stepNumber": 1,
          "title": "મનપસંદ ગુજરાતી ડિઝાઇન પસંદ કરો",
          "description": "શ્રી ગણેશાય નમઃ સાથે પરંપરાગત અથવા આધુનિક બોર્ડરવાળી સુંદર ડિઝાઇન પસંદ કરો."
        },
        {
          "stepNumber": 2,
          "title": "વ્યક્તિગત અને અભ્યાસની વિગતો ભરો",
          "description": "પૂરું નામ, જન્મ તારીખ, જન્મ સમય, ઊંચાઈ, અભ્યાસ અને વર્તમાન વ્યવસાયની વિગત લખો."
        },
        {
          "stepNumber": 3,
          "title": "પરિવાર અને મોસાળની માહિતી ઉમેરો",
          "description": "પિતા-માતાનો વ્યવસાય, ભાઈ-બહેનની વિગત, મૂળ વતન અને મોસાળ પક્ષની અટક અને ગામ ઉમેરો."
        },
        {
          "stepNumber": 4,
          "title": "મફત PDF ડાઉનલોડ કરો",
          "description": "લાઇવ પ્રીવ્યૂમાં બધું ચકાસી લો અને એક જ ક્લિકમાં પ્રિન્ટ માટે યોગ્ય PDF સેવ કરો."
        }
      ],
      "keyElementsToInclude": [
        "પૂરું નામ અને સારો પાસપોર્ટ સાઇઝ ફોટો",
        "જન્મ તારીખ, જન્મ સમય અને જન્મ સ્થળ",
        "ઊંચાઈ, રંગ અને બ્લડ ગ્રૂપ",
        "અભ્યાસ (ડિગ્રી અને કોલેજનું નામ)",
        "નોકરી / વ્યવસાય, કંપનીનું નામ અને વાર્ષિક આવક",
        "રાશિ, નક્ષત્ર, ગોત્ર અને કુંડળી વિગત",
        "પિતા-માતાનું નામ અને વ્યવસાય",
        "ભાઈ-બહેનની વિગત (પરણિત / અપરણિત)"
      ],
      "dosAndDonts": {
        "dos": [
          "જન્મ સમય સચોટ લખો જેથી કુંડળી મેળવવામાં સરળતા રહે.",
          "મૂળ વતન અને મોસાળનું ગામ ચોક્કસ દર્શાવો.",
          "ડિગ્રી અને નોકરીનું પદ સ્પષ્ટ અને સાચું લખો.",
          "હાલનો તાજો અને સ્પષ્ટ ચહેરો દેખાય તેવો ફોટો રાખો."
        ],
        "donts": [
          "ઝાંખો કે ગ્રૂપમાંથી ક્રોપ કરેલો ફોટો ન વાપરો.",
          "અધૂરા કે બંધ રહેતા ફોન નંબર ન આપો.",
          "માહિતી ખૂબ ગીચ ન બનાવો; યોગ્ય અંતર રાખો.",
          "આધાર કાર્ડ કે બેંક જેવી અંગત માહિતી ક્યારેય ન લખો."
        ]
      }
    },
    "whereSection": {
      "heading": "ગુજરાતી બાયોડેટા ક્યાં અને કેવી રીતે મોકલવો?",
      "intro": "ગુજરાતી પરિવારોમાં સંબંધની શરૂઆત વડીલો દ્વારા બાયોડેટાના વાંચનથી થાય છે. માતૃભાષામાં લખાયેલો બાયોડેટા પરિવારના સંસ્કાર, મોસાળ પક્ષનું માન અને વ્યવહારિક પારદર્શિતા દર્શાવે છે.",
      "useCases": [
        {
          "title": "સગાં-સંબંધીઓ અને વોટ્સએપ ગ્રૂપ",
          "description": "પીડીએફ ફોર્મેટ કોઈપણ ફોનમાં એકદમ પરફેક્ટ દેખાય છે."
        },
        {
          "title": "જ્ઞાતિ સંસ્થાઓ અને પરિચય સંમેલન",
          "description": "સમાજના સંમેલનમાં આપવા માટે તેની કલર પ્રિન્ટ સાથે રાખો."
        },
        {
          "title": "ઘરે રૂબરૂ મુલાકાત વખતે",
          "description": "મહેમાનો ઘરે આવે ત્યારે આદરપૂર્વક હાથમાં આપવા માટે યોગ્ય પ્રિન્ટ."
        }
      ],
      "downloadAndShareDetails": "ડાઉનલોડ કરેલ પીડીએફ સ્ટાન્ડર્ડ A4 સાઇઝ (210 x 297 mm) માં ઉપલબ્ધ થાય છે, જે કોઈપણ પ્રિન્ટર અને વોટ્સએપ પર એકદમ ચોખ્ખી દેખાય છે."
    },
    "sampleBiodatas": {
      "boySample": {
        "name": "પાર્થ રાજેશભાઈ પટેલ",
        "title": "બિઝનેસ ઓનર અને એમ.બી.એ. (ફાઇનાન્સ)",
        "fields": [
          {
            "label": "જન્મ વિગત",
            "value": "12 ડિસેમ્બર 1995 (ઉંમર: 30 વર્ષ) • સવારે 09:15",
            "category": "personal"
          },
          {
            "label": "ઊંચાઈ અને વજન",
            "value": "5 ફૂટ 10 ઇંચ • 72 કિગ્રા • બ્લડ ગ્રૂપ: B+",
            "category": "personal"
          },
          {
            "label": "અભ્યાસ",
            "value": "બી.કોમ (ગુજરાત યુનિવર્સિટી), એમ.બી.એ. (નિર્મા)",
            "category": "education_career"
          },
          {
            "label": "વ્યવસાય",
            "value": "ટેક્સટાઇલ મેન્યુફેક્ચરિંગ બિઝનેસ, સુરત / અમદાવાદ",
            "category": "education_career"
          },
          {
            "label": "પિતાશ્રી",
            "value": "શ્રી રાજેશભાઈ પટેલ (ઉદ્યોગપતિ)",
            "category": "family"
          },
          {
            "label": "માતાશ્રી",
            "value": "શ્રીમતી ગીતાબેન પટેલ (ગૃહિણી)",
            "category": "family"
          },
          {
            "label": "મૂળ વતન અને મોસાળ",
            "value": "મૂળ વતન: ઊંઝા (મહેસાણા) • મોસાળ: અમીન (આણંદ)",
            "category": "horoscope"
          },
          {
            "label": "કુંડળી વિગત",
            "value": "રાશિ: મિથુન • નક્ષત્ર: પુનર્વસુ • ગોત્ર: કશ્યપ • માંગલિક: ના",
            "category": "horoscope"
          },
          {
            "label": "સંપર્ક નંબર",
            "value": "+91 98980 54321 (પિતાશ્રી) • બોડકદેવ, અમદાવાદ",
            "category": "contact"
          }
        ]
      },
      "girlSample": {
        "name": "દિશા સુરેશભાઈ શાહ",
        "title": "આર્કિટેક્ટ અને ઇન્ટિરિયર ડિઝાઇનર • બી.આર્ક",
        "fields": [
          {
            "label": "જન્મ વિગત",
            "value": "28 ફેબ્રુઆરી 1998 (ઉંમર: 27 વર્ષ) • બપોરે 01:20",
            "category": "personal"
          },
          {
            "label": "ઊંચાઈ અને શોખ",
            "value": "5 ફૂટ 5 ઇંચ • પેઇન્ટિંગ, ક્લાસિકલ સંગીત અને વાંચન",
            "category": "personal"
          },
          {
            "label": "અભ્યાસ",
            "value": "બેચલર ઓફ આર્કિટેક્ચર (CEPT યુનિવર્સિટી, અમદાવાદ)",
            "category": "education_career"
          },
          {
            "label": "નોકરી",
            "value": "સીનિયર આર્કિટેક્ટ, અર્બન સ્પેસ સ્ટુડિયો, વડોદરા",
            "category": "education_career"
          },
          {
            "label": "પિતાશ્રી",
            "value": "શ્રી સુરેશભાઈ શાહ (ચાર્ટર્ડ એકાઉન્ટન્ટ)",
            "category": "family"
          },
          {
            "label": "માતાશ્રી",
            "value": "શ્રીમતી ભાવનાબેન શાહ (એમ.એસસી., પ્રોફેસર)",
            "category": "family"
          },
          {
            "label": "મૂળ વતન અને મોસાળ",
            "value": "મૂળ વતન: પાટણ • મોસાળ: પરીખ (નડિયાદ)",
            "category": "horoscope"
          },
          {
            "label": "કુંડળી વિગત",
            "value": "રાશિ: કુંભ • નક્ષત્ર: શતભિષા • માંગલિક: ના",
            "category": "horoscope"
          },
          {
            "label": "સંપર્ક સરનામું",
            "value": "+91 98250 87654 (વાલી) • અલકાપુરી, વડોદરા",
            "category": "contact"
          }
        ]
      }
    },
    "faqs": [
      {
        "question": "શું ટ્રુમેરેજ પર ગુજરાતી બાયોડેટા બનાવવો એકદમ ફ્રી છે?",
        "answer": "હા, તમે કોઈપણ ચાર્જ વગર સંપૂર્ણ ગુજરાતી બાયોડેટા બનાવી અને PDF ડાઉનલોડ કરી શકો છો."
      },
      {
        "question": "શું ડાઉનલોડ કરેલા બાયોડેટા પર કોઈ વોટરમાર્ક આવે છે?",
        "answer": "ના, ટ્રુમેરેજ દ્વારા ડાઉનલોડ થતી PDF પર કોઈ પણ પ્રકારનો વોટરમાર્ક હોતો નથી."
      },
      {
        "question": "ગુજરાતીમાં ટાઈપ કેવી રીતે કરવું?",
        "answer": "તમે તમારા સાદા કીબોર્ડથી અંગ્રેજીમાં લખીને પણ ગુજરાતી કરી શકો છો અથવા ગુજરાતી કીબોર્ડ વાપરી શકો છો."
      },
      {
        "question": "શું મોસાળ અને વતનની વિગત અલગથી લખી શકાય?",
        "answer": "હા, ગુજરાતી ટેમ્પલેટમાં મોસાળ પક્ષ અને મૂળ વતન માટે ખાસ વિગતો રાખવામાં આવી છે."
      }
    ],
    "relatedSlugs": [
      "free-marriage-biodata-maker",
      "free-marriage-biodata-pdf",
      "marriage-biodata-format-for-boy-and-girl",
      "hindu-marriage-biodata"
    ]
  },
  "tamil-marriage-biodata": {
    "slug": "tamil-marriage-biodata",
    "category": "language",
    "primaryKeyword": "tamil marriage biodata",
    "title": "தமிழ் திருமண பயோடேட்டா மேக்கர் | இலவச PDF மாதிரி",
    "description": "தமிழில் அழகான திருமண வரன் விபரம் (பயோடேட்டா) ஆன்லைனில் உருவாக்குங்கள். சுபமஸ்து, ஜாதகம், ராசி, நட்சத்திரம் மற்றும் குடும்ப விபரங்களுடன் இலவச PDF பதிவிறக்கம்.",
    "canonicalPath": "/biodata/tamil-marriage-biodata",
    "h1": "தமிழில் திருமண வரன் விபரம் (பயோடேட்டா) உருவாக்குங்கள்",
    "nativeScript": "|| சுபமஸ்து ||",
    "subheading": "பாரம்பரிய மங்கள அடையாளங்கள், ஜாதகக் குறிப்புகள், குலதெய்வம் மற்றும் குடும்பப் பெருமையுடன் தாய்மொழியில் வரன் விபரம் தயார் செய்யுங்கள்.",
    "badge": "தமிழ் திருமண வரன் விபரம்",
    "themeColor": "#B91C1C",
    "ctaText": "இலவச தமிழ் பயோடேட்டா உருவாக்குக",
    "previewCtaText": "தமிழ் டெம்ப்ளேட்டுகளைக் காண்க",
    "boyTabLabel": "மணமகன் (ஆண்) பயோடேட்டா",
    "girlTabLabel": "மணமகள் (பெண்) பயோடேட்டா",
    "whySection": {
      "heading": "ஏன் தமிழில் திருமண வரன் விபரம் உருவாக்க வேண்டும்?",
      "intro": "தமிழ் கலாச்சாரத்தில் திருமணம் என்பது இரு மனங்களின் சங்கமம் மட்டுமல்ல, இரு குடும்பங்களின் இணைப்பாகும். குடும்பப் பெரியவர்கள் மற்றும் உறவினர்கள் தாய்மொழியான தமிழில் உள்ள வரன் விபரங்களை எளிமையாகவும் மரியாதையுடனும் வாசித்து அறிந்துகொள்கிறார்கள்.",
      "reasons": [
        {
          "title": "குடும்பப் பெரியவர்கள் எளிதாகப் புரிந்துகொள்ள",
          "description": "வீட்டில் உள்ள முதியவர்கள் ஆங்கிலத்தை விட தமிழிலேயே வரனின் விபரங்களை மிகத் தெளிவாகவும் ஆர்வத்துடனும் வாசிக்க முடியும்."
        },
        {
          "title": "ஜாதகக் குறிப்புகளின் துல்லியம்",
          "description": "ராசி, நட்சத்திரம், லக்னம், திசை இருப்பு, பாதம் மற்றும் குலதெய்வம் போன்ற ஆன்மீகத் தகவல்கள் தமிழில் மிகவும் துல்லியமாகப் பொருந்தும்."
        },
        {
          "title": "பாரம்பரியம் மற்றும் கலாச்சார மரியாதை",
          "description": "சுபமஸ்து, பிள்ளையார் சுழி மற்றும் பாரம்பரிய மங்களச் சின்னங்களுடன் கூடிய வடிவம் குடும்ப கௌரவத்தை வெளிப்படுத்துகிறது."
        },
        {
          "title": "வாட்ஸ்அப்பில் எழுத்து மாறாமல் தெரியும்",
          "description": "ட்ரூமேரேஜ் யூனிகோட் தமிழ் தட்டச்சு எந்தவொரு ஸ்மார்ட்போனிலும் எழுத்துக்கள் உடையாமல் அழகாகத் தோன்றும்."
        }
      ]
    },
    "howSection": {
      "heading": "தமிழில் திருமண பயோடேட்டா உருவாக்குவது எப்படி?",
      "intro": "ஐந்து நிமிடங்களில் உங்கள் தமிழ் வரன் விபரக் குறிப்பைத் தயார் செய்யுங்கள்:",
      "workflowSteps": [
        {
          "stepNumber": 1,
          "title": "விருப்பமான தமிழ் டெம்ப்ளேட்டைத் தேர்வு செய்யுங்கள்",
          "description": "பாரம்பரிய கோவில் கோபுரம் அல்லது நவீன விளிம்புகள் கொண்ட நேர்த்தியான வடிவமைப்பைத் தேர்ந்தெடுக்கவும்."
        },
        {
          "stepNumber": 2,
          "title": "சுய விபரம் மற்றும் கல்வித் தகுதியை உள்ளிடவும்",
          "description": "முழுப் பெயர், பிறந்த தேதி, பிறந்த நேரம், பிறந்த ஊர், உயரம், கல்வி மற்றும் தற்போதைய வேலை விபரங்களை நிரப்பவும்."
        },
        {
          "stepNumber": 3,
          "title": "குடும்பம் மற்றும் ஜாதகத் தகவல்களைச் சேர்க்கவும்",
          "description": "பெற்றோர் விபரம், உடன்பிறப்புகள், குலதெய்வம், பூர்வீகம், ராசி, நட்சத்திரம் மற்றும் தொடர்பு எண்களை உள்ளிடவும்."
        },
        {
          "stepNumber": 4,
          "title": "இலவச PDF பதிவிறக்கம் செய்யுங்கள்",
          "description": "திரையில் மாதிரியைச் சரிபார்த்து உடனே அச்சுக்கு ஏற்ற உயர்தர PDF கோப்பை இலவசமாகப் பதிவிறக்கவும்."
        }
      ],
      "keyElementsToInclude": [
        "முழுப் பெயர் மற்றும் தெளிவான புகைப்படம்",
        "பிறந்த தேதி, சரியான நேரம் மற்றும் பிறந்த இடம்",
        "உயரம், நிறம் மற்றும் இரத்த வகை",
        "கல்வித் தகுதி (பட்டப்படிப்பு மற்றும் கல்லூரி)",
        "வேலை, நிறுவனத்தின் பெயர், பதவி மற்றும் ஆண்டு வருமானம்",
        "ராசி, நட்சத்திரம், லக்னம், பாதம் மற்றும் குலதெய்வம்",
        "தந்தை மற்றும் தாயாரின் பெயர், தொழில் விபரம்",
        "உடன்பிறப்புகள் (திருமணமானவர் / பயில்பவர்)"
      ],
      "dosAndDonts": {
        "dos": [
          "ஜாதகக் குறிப்புகளுக்குப் பிறந்த நேரத்தைத் துல்லியமாகக் குறிப்பிடவும்.",
          "குலதெய்வம் மற்றும் பூர்வீக ஊரைத் தெளிவாக எழுதவும்.",
          "கல்வி மற்றும் பணியிடத் தகவல்களை உண்மையுடன் பதிவு செய்யவும்.",
          "சமீபத்தில் எடுக்கப்பட்ட தெளிவான முகத்தோற்றப் புகைப்படத்தைப் பயன்படுத்தவும்."
        ],
        "donts": [
          "மங்கலான அல்லது செல்ஃபி புகைப்படங்களைப் பயன்படுத்த வேண்டாம்.",
          "தவறான அல்லது பயன்பாட்டில் இல்லாத தொலைபேசி எண்களைத் தர வேண்டாம்.",
          "விபரங்களை நெருக்கமில்லாமல் தெளிவாக வரிசைப்படுத்தவும்.",
          "ஆதார் எண் போன்ற ரகசிய ஆவண எண்களை ஒருபோதும் சேர்க்க வேண்டாம்."
        ]
      }
    },
    "whereSection": {
      "heading": "தமிழ் பயோடேட்டாவை எங்கு பகிரலாம்?",
      "intro": "தமிழ் கலாச்சாரத்தில் திருமணம் என்பது இரு மனங்களின் சங்கமம் மட்டுமல்ல, இரு குடும்பங்களின் இணைப்பாகும். குடும்பப் பெரியவர்கள் மற்றும் உறவினர்கள் தாய்மொழியான தமிழில் உள்ள வரன் விபரங்களை எளிமையாகவும் மரியாதையுடனும் வாசித்து அறிந்துகொள்கிறார்கள்.",
      "useCases": [
        {
          "title": "வாட்ஸ்அப் மற்றும் குடும்ப உறவினர்கள்",
          "description": "எந்த போனிலும் வடிவம் மாறாமல் நேர்த்தியாகத் தோன்றும் PDF."
        },
        {
          "title": "சமுதாய வரன் அறிமுகக் கூட்டங்கள்",
          "description": "சுயவரம் அல்லது சமுதாய அமைப்புகளில் சமர்ப்பிக்க வண்ண அச்சுப் பிரதி."
        },
        {
          "title": "நேரடி வரன் பார்க்கும் நிகழ்வுகள்",
          "description": "வீட்டிற்கு வரும் வரன் வீட்டாரிடம் மரியாதையுடன் வழங்க அச்சிட்ட நகல்."
        }
      ],
      "downloadAndShareDetails": "பதிவிறக்கம் செய்யப்படும் PDF சர்வதேச A4 அளவில் (210 x 297 மிமீ) தயாராகிறது. எந்தவொரு பிரிண்டரிலும் வாட்ஸ்அப்பிலும் தெளிவாகத் தோன்றும்."
    },
    "sampleBiodatas": {
      "boySample": {
        "name": "கார்த்திக் சுப்ரமணியன் (Karthik Subramanian)",
        "title": "சீனியர் ப்ராடக்ட் மேனேஜர் • பி.டெக் (IIT மெட்ராஸ்), MBA",
        "fields": [
          {
            "label": "பிறந்த தேதி / நேரம்",
            "value": "14 ஏப்ரல் 1996 (வயது: 29) • காலை 07:15 மணி",
            "category": "personal"
          },
          {
            "label": "உயரம் மற்றும் நிறம்",
            "value": "5 அடி 11 அங்குலம் • மாநிறம் • ரத்த வகை: A+",
            "category": "personal"
          },
          {
            "label": "கல்வித் தகுதி",
            "value": "பி.டெக் (IIT மெட்ராஸ்), MBA (IIM பெங்களூர்)",
            "category": "education_career"
          },
          {
            "label": "தொழில் மற்றும் வருமானம்",
            "value": "சீனியர் ப்ராடக்ட் மேனேஜர், அமேசான் சென்னை • ₹36 லட்சம்/ஆண்டு",
            "category": "education_career"
          },
          {
            "label": "தந்தை",
            "value": "திரு. K. சுப்ரமணியன் (பொறியாளர், பொதுப்பணித்துறை - ஓய்வு)",
            "category": "family"
          },
          {
            "label": "தாயார்",
            "value": "திருமதி. லக்ஷ்மி சுப்ரமணியன் (ஆசிரியை)",
            "category": "family"
          },
          {
            "label": "ராசி மற்றும் நட்சத்திரம்",
            "value": "மீனம் ராசி • உத்திரட்டாதி நட்சத்திரம் (பாதம் 3)",
            "category": "horoscope"
          },
          {
            "label": "குலதெய்வம் & பூர்வீகம்",
            "value": "குலதெய்வம்: அருள்மிகு வைத்தியநாத சுவாமி • சொந்த ஊர்: தஞ்சாவூர்",
            "category": "horoscope"
          },
          {
            "label": "தொடர்பு எண்",
            "value": "+91 94440 12345 (தந்தை) • அடையாறு, சென்னை",
            "category": "contact"
          }
        ]
      },
      "girlSample": {
        "name": "தீபிகா ராமச்சந்திரன் (Deepika Ramachandran)",
        "title": "மருத்துவர் (MD General Medicine) • MBBS, MD",
        "fields": [
          {
            "label": "பிறந்த தேதி / நேரம்",
            "value": "19 செப்டம்பர் 1998 (வயது: 27) • மாலை 05:40 மணி",
            "category": "personal"
          },
          {
            "label": "உயரம் மற்றும் குணநலன்",
            "value": "5 அடி 4 அங்குலம் • அமைதியான நற்குணம், கர்நாடக இசை ஆர்வம்",
            "category": "personal"
          },
          {
            "label": "கல்வித் தகுதி",
            "value": "MBBS, MD (மெட்ராஸ் மெடிக்கல் காலேஜ், சென்னை)",
            "category": "education_career"
          },
          {
            "label": "தற்போதைய பணி",
            "value": "உதவி பேராசிரியர் மற்றும் மருத்துவர், அப்பல்லோ மருத்துவமனை",
            "category": "education_career"
          },
          {
            "label": "தந்தை",
            "value": "டாக்டர் N. ராமச்சந்திரன் (மூத்த அறுவை சிகிச்சை நிபுணர்)",
            "category": "family"
          },
          {
            "label": "தாயார்",
            "value": "திருமதி. மீனா ராமச்சந்திரன் (M.Sc., இல்லத்தரசி)",
            "category": "family"
          },
          {
            "label": "ஜாதக விபரம்",
            "value": "ரிஷபம் ராசி • ரோகிணி நட்சத்திரம் • லக்னம்: கன்னி • தோஷம்: இல்லை",
            "category": "horoscope"
          },
          {
            "label": "குலதெய்வம் & பூர்வீகம்",
            "value": "குலதெய்வம்: ஸ்ரீ வரதராஜ பெருமாள் • சொந்த ஊர்: திருச்சி",
            "category": "horoscope"
          },
          {
            "label": "தொடர்பு முகவரி",
            "value": "+91 98401 56789 (பெற்றோர்) • அண்ணா நகர், சென்னை",
            "category": "contact"
          }
        ]
      }
    },
    "faqs": [
      {
        "question": "ட்ரூமேரேஜில் தமிழ் பயோடேட்டா உருவாக்குவது இலவசமா?",
        "answer": "ஆம், நீங்கள் எந்தவொரு கட்டணமும் இன்றி முழுமையான தமிழ் பயோடேட்டாவை இலவசமாக உருவாக்கி PDF பதிவிறக்கம் செய்து கொள்ளலாம்."
      },
      {
        "question": "பதிவிறக்கம் செய்யப்படும் PDF-ல் வாட்டர்மார்க் இருக்குமா?",
        "answer": "இல்லை, ட்ரூமேரேஜ் வழங்கும் PDF கோப்பில் எந்தவொரு வாட்டர்மார்க்கோ விளம்பரங்களோ இருக்காது."
      },
      {
        "question": "தமிழில் தட்டச்சு செய்வது எப்படி?",
        "answer": "நீங்கள் ஆங்கில எழுத்துக்களில் தட்டச்சு செய்தாலே (எ.கா: Karthik -> கார்த்திக்) தானாகத் தமிழில் மாற்றிக்கொள்ளும் வசதியைப் பயன்படுத்தலாம்."
      },
      {
        "question": "இதில் குலதெய்வம் மற்றும் ஜாதகம் குறிப்பிட இடமுண்டா?",
        "answer": "ஆம், தமிழ் பாரம்பரியப்படி குலதெய்வம், ராசி, நட்சத்திரம் மற்றும் பாதம் போன்றவற்றை உள்ளிட பிரத்யேகப் பகுதிகள் உள்ளன."
      }
    ],
    "relatedSlugs": [
      "free-marriage-biodata-maker",
      "free-marriage-biodata-pdf",
      "marriage-biodata-format-for-boy-and-girl",
      "hindu-marriage-biodata"
    ]
  },
  "telugu-marriage-biodata": {
    "slug": "telugu-marriage-biodata",
    "category": "language",
    "primaryKeyword": "telugu marriage biodata",
    "title": "తెలుగు వివాహ బయోడేటా మేకర్ | ఉచిత పెళ్లి బయోడేటా PDF ఫార్మాట్",
    "description": "తెలుగులో అందమైన పెళ్లి బయోడేటా ఆన్‌లైన్‌లో సృష్టించండి. శుభమస్తు, జాతకం, గోత్రం, రాశి, నక్షత్రం మరియు కుటుంబ వివరాలతో ఉచిత PDF డౌన్‌లోడ్ చేసుకోండి.",
    "canonicalPath": "/biodata/telugu-marriage-biodata",
    "h1": "తెలుగులో వివాహ బయోడేటా తయారు చేయండి",
    "nativeScript": "|| శుభమస్తు ||",
    "subheading": "శుభప్రదమైన చిహ్నాలు, జాతక చక్రం, గోత్రం మరియు కుటుంబ గౌరవాన్ని ప్రతిబింబించేలా మీ మాతృభాషలో పరిచయ పత్రం రూపొందించండి.",
    "badge": "తెలుగు పెళ్లి పరిచయ పత్రం",
    "themeColor": "#C026D3",
    "ctaText": "ఉచిత తెలుగు బయోడేటా సృష్టించండి",
    "previewCtaText": "తెలుగు టెంప్లేట్లు చూడండి",
    "boyTabLabel": "వరుడు (అబ్బాయి) బయోడేటా",
    "girlTabLabel": "వధువు (అమ్మాయి) బయోడేటా",
    "whySection": {
      "heading": "తెలుగులో వివాహ బయోడేటా ఎందుకు రూపొందించాలి?",
      "intro": "తెలుగు సంస్కృతిలో పెళ్లి అనేది రెండు పవిత్ర కుటుంబాల కలయిక. ఇంటి పెద్దలు, బంధువులు తమ మాతృభాష అయిన తెలుగులో ఉన్న బయోడేటాను ఎంతో గౌరవంతో మరియు సులభంగా చదువుకోగలరు.",
      "reasons": [
        {
          "title": "ఇంటి పెద్దలకు చదవడానికి ఎంతో సులభం",
          "description": "తల్లిదండ్రులు మరియు పెద్దవారు ఇంగ్లీష్ కంటే తెలుగు లిపిలో ఉన్న వివరాలను నిస్సందేహంగా మరియు స్పష్టంగా అర్థం చేసుకోగలరు."
        },
        {
          "title": "జాతకం మరియు గోత్రం వివరాల స్పష్టత",
          "description": "గోత్రం, రాశి, నక్షత్రం, పాదం, లగ్నం మరియు కులదైవం వంటి ఆధ్యాత్మిక వివరాలు తెలుగులోనే సరైన అర్థాన్ని ఇస్తాయి."
        },
        {
          "title": "తెలుగు సంప్రదాయ గౌరవం",
          "description": "శుభమస్తు, స్వస్తిక్ వంటి మంగళకరమైన చిహ్నాలతో రూపొందించిన బయోడేటా కుటుంబ సాంప్రదాయాన్ని తెలియజేస్తుంది."
        },
        {
          "title": "వాట్సాప్‌లో ఫాంట్ చెదిరిపోకుండా కనిపిస్తుంది",
          "description": "ట్రూమ్యారేజ్ అందించే యూనికోడ్ తెలుగు ఫాంట్ ఏ మొబైల్‌లోనైనా అందంగా మరియు అక్షరాలు చెదరకుండా కనిపిస్తుంది."
        }
      ]
    },
    "howSection": {
      "heading": "తెలుగులో వివాహ బయోడేటా ఎలా తయారు చేయాలి?",
      "intro": "కేవలం 5 నిమిషాల్లో ఈ క్రింది సులభమైన దశల ద్వారా మీ బయోడేటాను పూర్తి చేయండి:",
      "workflowSteps": [
        {
          "stepNumber": 1,
          "title": "నచ్చిన తెలుగు డిజైన్‌ను ఎంచుకోండి",
          "description": "సంప్రదాయ బోర్డర్లు లేదా ఆధునిక హంగులతో కూడిన అందమైన తెలుగు ఫార్మాట్‌ను ఎంపిక చేసుకోండి."
        },
        {
          "stepNumber": 2,
          "title": "వ్యక్తిగత మరియు విద్యా వివరాలు నమోదు చేయండి",
          "description": "పూర్తి పేరు, పుట్టిన తేదీ, పుట్టిన సమయం, పుట్టిన ఊరు, ఎత్తు, విద్య మరియు ప్రస్తుత ఉద్యోగ వివరాలను పూరించండి."
        },
        {
          "stepNumber": 3,
          "title": "కుటుంబం మరియు జాతక వివరాలు చేర్చండి",
          "description": "తల్లిదండ్రుల వివరాలు, తోబుట్టువులు, గోత్రం, రాశి, నక్షత్రం మరియు సంప్రదింపు నంబర్లను నమోదు చేయండి."
        },
        {
          "stepNumber": 4,
          "title": "ఉచిత PDF డౌన్‌లోడ్ చేసుకోండి",
          "description": "లైవ్ ప్రివ్యూ చూసి అంతా సరిచూసుకున్న తర్వాత ప్రింట్‌కు అనువైన స్వచ్ఛమైన PDFని ఉచితంగా పొందండి."
        }
      ],
      "keyElementsToInclude": [
        "పూర్తి పేరు మరియు స్పష్టమైన పాస్‌పోర్ట్ సైజ్ ఫోటో",
        "పుట్టిన తేదీ, ఖచ్చితమైన సమయం మరియు జన్మస్థలం",
        "ఎత్తు, వర్ణం మరియు రక్త వర్గం",
        "విద్యార్హత (డిగ్రీ మరియు కాలేజీ పేరు)",
        "ఉద్యోగం / వ్యాపారం, కంపెనీ పేరు, హోదా మరియు వార్షికాదాయం",
        "గోత్రం, రాశి, నక్షత్రం, పాదం మరియు మాంగళిక వివరాలు",
        "తండ్రి మరియు తల్లి పేర్లు, వారి వృత్తి",
        "తోబుట్టువులు (వివాహితులు / చదువుకుంటున్నవారు)"
      ],
      "dosAndDonts": {
        "dos": [
          "జాతక చక్రం పొంతన కోసం పుట్టిన సమయాన్ని ఖచ్చితంగా పేర్కొనండి.",
          "స్వగ్రామం మరియు ప్రస్తుత నివాసం రెండూ స్పష్టంగా రాయండి.",
          "చదువు మరియు ఉద్యోగ సమాచారాన్ని నిజాయితీగా నమోదు చేయండి.",
          "ఇటీవల తీయించుకున్న హుందాతనమైన ఫోటోను మాత్రమే ఉపయోగించండి."
        ],
        "donts": [
          "మసకబారిన లేదా సెల్ఫీ ఫోటోలను పెట్టవద్దు.",
          "పనిచేయని లేదా తప్పు ఫోన్ నంబర్లను ఇవ్వకండి.",
          "అంశాలను క్రిక్కిరిసిగా కాకుండా విడివిడిగా అమర్చండి.",
          "ఆధార్ లేదా బ్యాంక్ వివరాలు లాంటి గోప్యతా సమాచారాన్ని రాయకండి."
        ]
      }
    },
    "whereSection": {
      "heading": "తెలుగు బయోడేటాను ఎక్కడ పంచుకోవచ్చు?",
      "intro": "తెలుగు సంస్కృతిలో పెళ్లి అనేది రెండు పవిత్ర కుటుంబాల కలయిక. ఇంటి పెద్దలు, బంధువులు తమ మాతృభాష అయిన తెలుగులో ఉన్న బయోడేటాను ఎంతో గౌరవంతో మరియు సులభంగా చదువుకోగలరు.",
      "useCases": [
        {
          "title": "వాట్సాప్ మరియు కుటుంబ సభ్యులు",
          "description": "ఎలాంటి మొబైల్‌లోనైనా లేఅవుట్ చెదరకుండా కనిపించే PDF ఫైల్."
        },
        {
          "title": "కుల సంఘాలు మరియు పరిచయ వేదికలు",
          "description": "సమ్మేళనాలలో సమర్పించడానికి దీని రంగు ప్రింట్ కాపీలను ఉపయోగించండి."
        },
        {
          "title": "ఇంటి వద్ద మొదటి ముఖాముఖి భేటీ",
          "description": "పెళ్లి చూపుల సమయంలో పెద్దల చేతికి ఇచ్చేందుకు చక్కని ప్రింటెడ్ కాపీ."
        }
      ],
      "downloadAndShareDetails": "డౌన్‌లోడ్ చేయబడిన PDF అంతర్జాతీయ A4 పరిమాణంలో (210 x 297 మి.మీ) అందుబాటులో ఉంటుంది. ఏ ప్రింటర్ మరియు వాట్సాప్‌లోనైనా స్పష్టంగా కనిపిస్తుంది."
    },
    "sampleBiodatas": {
      "boySample": {
        "name": "వెంకట్ ప్రశాంత్ వర్మ (Venkat Prashanth Varma)",
        "title": "క్లౌడ్ ఆర్కిటెక్ట్ • బి.టెక్ (NIT వరంగల్), M.S.",
        "fields": [
          {
            "label": "జన్మ వివరాలు",
            "value": "19 అక్టోబర్ 1995 (వయస్సు: 30 ఏళ్లు) • ఉదయం 08:20 గంటలకు",
            "category": "personal"
          },
          {
            "label": "ఎత్తు మరియు రంగు",
            "value": "5 అడుగుల 11 అంగుళాలు • తెల్లని మేనిఛాయ • బ్లడ్ గ్రూప్: B+",
            "category": "personal"
          },
          {
            "label": "విద్యార్హత",
            "value": "బి.టెక్ (కంప్యూటర్ సైన్స్, NIT వరంగల్), M.S. (USA)",
            "category": "education_career"
          },
          {
            "label": "ఉద్యోగం మరియు ఆదాయం",
            "value": "సీనియర్ క్లౌడ్ ఆర్కిటెక్ట్, మైక్రోసాఫ్ట్ హైదరాబాద్ • ₹34 లక్షలు/సంవత్సరం",
            "category": "education_career"
          },
          {
            "label": "తండ్రిగారి పేరు",
            "value": "శ్రీ రాంబాబు వర్మ (ప్రభుత్వ గెజిటెడ్ అధికారి - విశ్రాంత)",
            "category": "family"
          },
          {
            "label": "తల్లిగారి పేరు",
            "value": "శ్రీమతి ప్రభావతి (గృహిణి)",
            "category": "family"
          },
          {
            "label": "గోత్రం మరియు జాతకం",
            "value": "గోత్రం: కౌండిన్యస • రాశి: కన్య • నక్షత్రం: హస్త • పాదం: 2",
            "category": "horoscope"
          },
          {
            "label": "స్వగ్రామం & మూలాలు",
            "value": "స్వగ్రామం: భీమవరం, పశ్చిమ గోదావరి జిల్లా • కులదైవం: సత్యనారాయణ స్వామి",
            "category": "horoscope"
          },
          {
            "label": "సంప్రదింపు నంబరు",
            "value": "+91 98490 23456 (తండ్రిగారు) • మాదాపూర్, హైదరాబాద్",
            "category": "contact"
          }
        ]
      },
      "girlSample": {
        "name": "శ్రావ్య చౌదరి (Sravya Chowdary)",
        "title": "డేటా సైంటిస్ట్ • బి.టెక్, M.Tech (బిట్స్ పిలాని)",
        "fields": [
          {
            "label": "జన్మ వివరాలు",
            "value": "15 జూలై 1998 (వయస్సు: 27 ఏళ్లు) • సాయంత్రం 04:45 గంటలకు",
            "category": "personal"
          },
          {
            "label": "ఎత్తు మరియు నైపుణ్యాలు",
            "value": "5 అడుగుల 5 అంగుళాలు • సున్నిత మనస్కురాలు, వీణ మరియు నృత్యం",
            "category": "personal"
          },
          {
            "label": "విద్యార్హత",
            "value": "బి.టెక్, M.Tech (డేటా అనలిటిక్స్, బిట్స్ పిలాని)",
            "category": "education_career"
          },
          {
            "label": "ప్రస్తుత ఉద్యోగం",
            "value": "లీడ్ డేటా సైంటిస్ట్, గూగుల్ హైదరాబాద్",
            "category": "education_career"
          },
          {
            "label": "తండ్రిగారి పేరు",
            "value": "శ్రీ మోహన్ రావు చౌదరి (వ్యాపారవేత్త, ఫార్మా రంగం)",
            "category": "family"
          },
          {
            "label": "తల్లిగారి పేరు",
            "value": "శ్రీమతి పద్మావతి (M.Sc., కళాశాల లెక్చరర్)",
            "category": "family"
          },
          {
            "label": "గోత్రం & నక్షత్రం",
            "value": "గోత్రం: వల్లూట్ల • రాశి: మీనం • నక్షత్రం: రేవతి • మాంగళిక: లేదు",
            "category": "horoscope"
          },
          {
            "label": "స్వగ్రామం & మేనమామ",
            "value": "స్వగ్రామం: గుంటూరు • మేనమామ: యలమంచిలి (విజయవాడ)",
            "category": "horoscope"
          },
          {
            "label": "సంప్రదింపు చిరునామా",
            "value": "+91 99891 87654 (తల్లిదండ్రులు) • జూబ్లీహిల్స్, హైదరాబాద్",
            "category": "contact"
          }
        ]
      }
    },
    "faqs": [
      {
        "question": "ట్రూమ్యారేజ్‌లో తెలుగు బయోడేటా తయారు చేయడం ఉచితమేనా?",
        "answer": "అవును, మీరు ఎటువంటి రుసుము చెల్లించకుండా పూర్తి తెలుగు బయోడేటాను ఉచితంగా తయారు చేసుకుని PDF డౌన్‌లోడ్ చేసుకోవచ్చు."
      },
      {
        "question": "డౌన్‌లోడ్ చేసిన PDF పై వాటర్‌మార్క్ ఉంటుందా?",
        "answer": "ఉండదు, ట్రూమ్యారేజ్ అందించే PDF పై ఎటువంటి వాటర్‌మార్క్ లేదా ప్రకటనలు ఉండవు."
      },
      {
        "question": "తెలుగులో టైప్ చేయడం ఎలా?",
        "answer": "మీరు సాధారణ ఇంగ్లీష్ కీబోర్డుతో టైప్ చేసినా (ఉదా: Suresh -> సురేష్) సులువుగా తెలుగులోకి మార్చుకోవచ్చు."
      },
      {
        "question": "ఇందులో గోత్రం మరియు జాతక వివరాలు నమోదు చేయవచ్చా?",
        "answer": "ఖచ్చితంగా, గోత్రం, రాశి, నక్షత్రం, పాదం మరియు మేనమామ వివరాల కోసం ప్రత్యేక విభాగాలు ఉన్నాయి."
      }
    ],
    "relatedSlugs": [
      "free-marriage-biodata-maker",
      "free-marriage-biodata-pdf",
      "marriage-biodata-format-for-boy-and-girl",
      "hindu-marriage-biodata"
    ]
  },
  "kannada-marriage-biodata": {
    "slug": "kannada-marriage-biodata",
    "category": "language",
    "primaryKeyword": "kannada marriage biodata",
    "title": "ಕನ್ನಡ ಮದುವೆ ಬಯೋಡೇಟಾ ಮೇಕರ್ | ಉಚಿತ ಮ್ಯಾರೇಜ್ ಬಯೋಡೇಟಾ PDF",
    "description": "ಕನ್ನಡದಲ್ಲಿ ಆಕರ್ಷಕ ಮದುವೆ ಬಯೋಡೇಟಾ ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ರಚಿಸಿ. ಶುಭಮಸ್ತು, ಜಾತಕ, ಗೋತ್ರ, ರಾಶಿ, ನಕ್ಷತ್ರ ಮತ್ತು ಕುಟುಂಬದ ವಿವರಗಳೊಂದಿಗೆ ಉಚಿತ PDF ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.",
    "canonicalPath": "/biodata/kannada-marriage-biodata",
    "h1": "ಕನ್ನಡದಲ್ಲಿ ಮದುವೆ ಬಯೋಡೇಟಾ ರಚಿಸಿ",
    "nativeScript": "|| ಶುಭಮಸ್ತು ||",
    "subheading": "ಮಂಗಳಕರ ಚಿಹ್ನೆಗಳು, ಜಾತಕ ವಿವರ, ಗೋತ್ರ ಮತ್ತು ಕೌಟುಂಬಿಕ ಹಿನ್ನೆಲೆಯನ್ನು ಒಳಗೊಂಡ ನಿಮ್ಮದೇ ಮಾತೃಭಾಷೆಯ ಪರಿಪೂರ್ಣ ಪರಿಚಯ ಪತ್ರ.",
    "badge": "ಕನ್ನಡ ವಿವಾಹ ಪರಿಚಯ ಪತ್ರ",
    "themeColor": "#D97706",
    "ctaText": "ಉಚಿತ ಕನ್ನಡ ಬಯೋಡೇಟಾ ರಚಿಸಿ",
    "previewCtaText": "ಕನ್ನಡ ಮಾದರಿಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
    "boyTabLabel": "ವರ (ಹುಡುಗ) ಬಯೋಡೇಟಾ",
    "girlTabLabel": "ವಧು (ಹುಡುಗಿ) ಬಯೋಡೇಟಾ",
    "whySection": {
      "heading": "ಕನ್ನಡದಲ್ಲಿ ಮದುವೆ ಬಯೋಡೇಟಾ ಮಾಡುವುದು ಏಕೆ ಮುಖ್ಯ?",
      "intro": "ಕನ್ನಡ ನಾಡಿನ ಸಂಪ್ರದಾಯದಲ್ಲಿ ಮದುವೆಯ ಮಾತುಕತೆಗೆ ಹಿರಿಯರು ಹೆಚ್ಚಿನ ಮಹತ್ವ ನೀಡುತ್ತಾರೆ. ಆಂಗ್ಲ ಭಾಷೆಗಿಂತ ನಮ್ಮದೇ ಕನ್ನಡದಲ್ಲಿ ಸಿದ್ಧಪಡಿಸಿದ ಬಯೋಡೇಟಾವನ್ನು ಮನೆಯ ಹಿರಿಯರು ಮತ್ತು ಬಂಧುಗಳು ಬಹಳ ಸುಲಭವಾಗಿ ಮತ್ತು ಪ್ರೀತಿಯಿಂದ ಓದಿ ಅರ್ಥೈಸಿಕೊಳ್ಳುತ್ತಾರೆ.",
      "reasons": [
        {
          "title": "ಮನೆಯ ಹಿರಿಯರಿಗೆ ಓದಲು ಸುಲಭ",
          "description": "ಅಜ್ಜ-ಅಜ್ಜಿಯರು ಹಾಗೂ ಹಿರಿಯ ಬಂಧುಗಳು ಕನ್ನಡ ಲಿಪಿಯಲ್ಲಿರುವ ವಿವರಗಳನ್ನು ಯಾವುದೇ ಗೊಂದಲವಿಲ್ಲದೆ ಸ್ಪಷ್ಟವಾಗಿ ತಿಳಿಯಬಹುದು."
        },
        {
          "title": "ಜಾತಕ ಮತ್ತು ಗೋತ್ರದ ನಿಖರತೆ",
          "description": "ಗೋತ್ರ, ರಾಶಿ, ನಕ್ಷತ್ರ, ಪಾದ, ಗಣ ಮತ್ತು ಕುಲದೈವದ ವಿವರಗಳು ಕನ್ನಡ ಭಾಷೆಯಲ್ಲೇ ಸೂಕ್ತವಾಗಿ ಮತ್ತು ಅರ್ಥಪೂರ್ಣವಾಗಿ ಮೂಡಿಬರುತ್ತವೆ."
        },
        {
          "title": "ಕನ್ನಡ ಸಂಸ್ಕೃತಿಯ ಗಾಂಭೀರ್ಯ",
          "description": "ಶುಭಮಸ್ತು ಮತ್ತು ಸಾಂಪ್ರದಾಯಿಕ ವಿನ್ಯಾಸದೊಂದಿಗೆ ರೂಪಿಸಿದ ಬಯೋಡೇಟಾವು ಕುಟುಂಬದ ಸಂಸ್ಕಾರ ಮತ್ತು ಮೌಲ್ಯಗಳನ್ನು ಬಿಂಬಿಸುತ್ತದೆ."
        },
        {
          "title": "ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಅಕ್ಷರಗಳು ಬದಲಾಗದೆ ಮೂಡುತ್ತವೆ",
          "description": "ಟ್ರೂಮ್ಯಾರೇಜ್‌ನ ಯುನಿಕೋಡ್ ಕನ್ನಡ ವಿನ್ಯಾಸವು ಯಾವುದೇ ಸ್ಮಾರ್ಟ್‌ಫೋನ್‌ನಲ್ಲಿ ಅಕ್ಷರಗಳು ಒಡೆಯದೆ ಅತ್ಯಂತ ಸುಂದರವಾಗಿ ಕಾಣಿಸುತ್ತದೆ."
        }
      ]
    },
    "howSection": {
      "heading": "ಕನ್ನಡದಲ್ಲಿ ಮದುವೆ ಬಯೋಡೇಟಾ ಸಿದ್ಧಪಡಿಸುವುದು ಹೇಗೆ?",
      "intro": "ಕೇವಲ 5 ನಿಮಿಷಗಳಲ್ಲಿ ಕೆಳಗಿನ ಸರಳ ಹಂತಗಳ ಮೂಲಕ ನಿಮ್ಮ ಬಯೋಡೇಟಾ ಸಿದ್ಧಪಡಿಸಿ:",
      "workflowSteps": [
        {
          "stepNumber": 1,
          "title": "ಇಷ್ಟವಾದ ಕನ್ನಡ ವಿನ್ಯಾಸವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
          "description": "ಸಾಂಪ್ರದಾಯಿಕ ಬಾರ್ಡರ್ ಅಥವಾ ಆಧುನಿಕ ಶೈಲಿಯ ಸುಂದರ ಕನ್ನಡ ಟೆಂಪ್ಲೇಟ್‌ಗಳಲ್ಲಿ ಒಂದನ್ನು ಆರಿಸಿಕೊಳ್ಳಿ."
        },
        {
          "stepNumber": 2,
          "title": "ವೈಯಕ್ತಿಕ ಮತ್ತು ಶೈಕ್ಷಣಿಕ ಮಾಹಿತಿ ನಮೂದಿಸಿ",
          "description": "ಪೂರ್ಣ ಹೆಸರು, ಹುಟ್ಟಿದ ದಿನಾಂಕ, ಸಮಯ, ಹುಟ್ಟಿದ ಸ್ಥಳ, ಎತ್ತರ, ಶಿಕ್ಷಣ ಮತ್ತು ಉದ್ಯೋಗದ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ."
        },
        {
          "stepNumber": 3,
          "title": "ಕುಟುಂಬ ಮತ್ತು ಜಾತಕದ ವಿವರ ಸೇರಿಸಿ",
          "description": "ತಂದೆ-ತಾಯಿಯ ಹೆಸರು, ಸಹೋದರ-ಸಹೋದರಿಯರು, ಗೋತ್ರ, ರಾಶಿ, ನಕ್ಷತ್ರ ಮತ್ತು ಸಂಪರ್ಕ ಸಂಖ್ಯೆಗಳನ್ನು ದಾಖಲಿಸಿ."
        },
        {
          "stepNumber": 4,
          "title": "ಉಚಿತ PDF ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
          "description": "ಲೈವ್ ಪ್ರಿವ್ಯೂನಲ್ಲಿ ಪರಿಶೀಲಿಸಿ, ಒಂದೇ ಕ್ಲಿಕ್‌ನಲ್ಲಿ ಮುದ್ರಣಕ್ಕೆ ಸಿದ್ಧವಾದ ಉತ್ತಮ ಗುಣಮಟ್ಟದ PDF ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ."
        }
      ],
      "keyElementsToInclude": [
        "ಪೂರ್ಣ ಹೆಸರು ಮತ್ತು ಸ್ಪಷ್ಟ ಪಾಸ್‌ಪೋರ್ಟ್ ಗಾತ್ರದ ಫೋಟೋ",
        "ಹುಟ್ಟಿದ ದಿನಾಂಕ, ನಿಖರ ಸಮಯ ಮತ್ತು ಹುಟ್ಟಿದ ಊರು",
        "ಎತ್ತರ, ಮೈಬಣ್ಣ ಮತ್ತು ರಕ್ತದ ಗುಂಪು",
        "ವಿದ್ಯಾರ್ಹತೆ (ಪದವಿ ಮತ್ತು ಕಾಲೇಜಿನ ಹೆಸರು)",
        "ಉದ್ಯೋಗ / ಹುದ್ದೆ, ಕಂಪನಿಯ ಹೆಸರು ಮತ್ತು ವಾರ್ಷಿಕ ಆದಾಯ",
        "ರಾಶಿ, ನಕ್ಷತ್ರ, ಪಾದ, ಗೋತ್ರ ಮತ್ತು ಮಾಂಗಲ್ಯ ದೋಷ ವಿವರ",
        "ತಂದೆ ಮತ್ತು ತಾಯಿಯ ಹೆಸರು ಹಾಗೂ ಅವರ ವೃತ್ತಿ",
        "ಸಹೋದರರು ಮತ್ತು ಸಹೋದರಿಯರು (ವಿವಾಹಿತ / ಕಲಿಯುತ್ತಿರುವವರು)"
      ],
      "dosAndDonts": {
        "dos": [
          "ಜಾತಕ ಕೂಲಂಕಷವಾಗಿ ನೋಡಲು ಹುಟ್ಟಿದ ಸಮಯವನ್ನು ನಿಖರವಾಗಿ ಬರೆಯಿರಿ.",
          "ಮೂಲ ಊರು ಮತ್ತು ಪ್ರಸ್ತುತ ವಾಸಿಸುವ ವಿಳಾಸ ಎರಡನ್ನೂ ಸ್ಪಷ್ಟವಾಗಿ ನಮೂದಿಸಿ.",
          "ಶಿಕ್ಷಣ ಮತ್ತು ನೌಕರಿಯ ಕುರಿತು ಸತ್ಯವಾದ ಮಾಹಿತಿಯನ್ನು ನೀಡಿ.",
          "ಇತ್ತೀಚೆಗೆ ತೆಗೆಸಿದ ಸ್ಪಷ್ಟವಾದ ಭಾವಚಿತ್ರವನ್ನೇ ಬಳಸಿ."
        ],
        "donts": [
          "ಮಬ್ಬಾದ ಅಥವಾ ಸೆಲ್ಫಿ ಫೋಟೋಗಳನ್ನು ಹಾಕಬೇಡಿ.",
          "ಚಾಲ್ತಿಯಲ್ಲಿಲ್ಲದ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಗಳನ್ನು ನೀಡಬೇಡಿ.",
          "ಮಾಹಿತಿಯನ್ನು ಗೋಜಲು ಮಾಡದೆ ಅಂತರವಿಟ್ಟು ಜೋಡಿಸಿ.",
          "ಆಧಾರ್ ಸಂಖ್ಯೆಯಂತಹ ಖಾಸಗಿ ದಾಖಲೆಗಳನ್ನು ನಮೂದಿಸಬೇಡಿ."
        ]
      }
    },
    "whereSection": {
      "heading": "ಕನ್ನಡ ಬಯೋಡೇಟಾವನ್ನು ಎಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಬಹುದು?",
      "intro": "ಕನ್ನಡ ನಾಡಿನ ಸಂಪ್ರದಾಯದಲ್ಲಿ ಮದುವೆಯ ಮಾತುಕತೆಗೆ ಹಿರಿಯರು ಹೆಚ್ಚಿನ ಮಹತ್ವ ನೀಡುತ್ತಾರೆ. ಆಂಗ್ಲ ಭಾಷೆಗಿಂತ ನಮ್ಮದೇ ಕನ್ನಡದಲ್ಲಿ ಸಿದ್ಧಪಡಿಸಿದ ಬಯೋಡೇಟಾವನ್ನು ಮನೆಯ ಹಿರಿಯರು ಮತ್ತು ಬಂಧುಗಳು ಬಹಳ ಸುಲಭವಾಗಿ ಮತ್ತು ಪ್ರೀತಿಯಿಂದ ಓದಿ ಅರ್ಥೈಸಿಕೊಳ್ಳುತ್ತಾರೆ.",
      "useCases": [
        {
          "title": "ವಾಟ್ಸಾಪ್ ಮತ್ತು ಕುಟುಂಬದ ಹಿರಿಯರು",
          "description": "ಯಾವುದೇ ಫೋನ್‌ನಲ್ಲೂ ಲೇಔಟ್ ಬದಲಾಗದೆ ಸ್ಪಷ್ಟವಾಗಿ ಕಾಣುವ PDF."
        },
        {
          "title": "ಸಮಾಜದ ವಧು-ವರ ವೇದಿಕೆಗಳು",
          "description": "ಸಮ್ಮೇಳನಗಳಲ್ಲಿ ನೀಡಲು ಇದರ ಬಣ್ಣದ ಮುದ್ರಿತ ಪ್ರತಿಯನ್ನು ಒಯ್ಯಿರಿ."
        },
        {
          "title": "ಮನೆಗೆ ಬರುವ ಅತಿಥಿಗಳ ಮೊದಲ ಭೇಟಿ",
          "description": "ಮನೆಗೆ ಬರುವ ಸಂಬಂಧಿಕರ ಕೈಗೆ ಗೌರವಪೂರ್ವಕವಾಗಿ ನೀಡಲು ಸೂಕ್ತ ಪ್ರಿಂಟ್."
        }
      ],
      "downloadAndShareDetails": "ಡೌನ್‌ಲೋಡ್ ಮಾಡಿದ PDF ಅಂತರರಾಷ್ಟ್ರೀಯ A4 ಗಾತ್ರದಲ್ಲಿ (210 x 297 ಮಿಮೀ) ಲಭ್ಯವಿದ್ದು, ಯಾವುದೇ ಪ್ರಿಂಟರ್ ಮತ್ತು ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಸ್ಪಷ್ಟವಾಗಿ ಕಾಣುತ್ತದೆ."
    },
    "sampleBiodatas": {
      "boySample": {
        "name": "ಚೇತನ್ ಕುಮಾರ್ ಹೆಗಡೆ (Chetan Kumar Hegde)",
        "title": "ಸೀನಿಯರ್ ಸಾಫ್ಟ್‌ವೇರ್ ಆರ್ಕಿಟೆಕ್ಟ್ • ಬಿ.ಇ. (RVCE ಬೆಂಗಳೂರು), M.Tech",
        "fields": [
          {
            "label": "ಹುಟ್ಟಿದ ವಿವರ",
            "value": "08 ನವೆಂಬರ್ 1995 (ವಯಸ್ಸು: 30 ವರ್ಷ) • ಬೆಳಿಗ್ಗೆ 07:40",
            "category": "personal"
          },
          {
            "label": "ಎತ್ತರ ಮತ್ತು ಮೈಬಣ್ಣ",
            "value": "5 ಅಡಿ 11 ಇಂಚು • ಗೌರವರ್ಣ • ರಕ್ತದ ಗುಂಪು: O+",
            "category": "personal"
          },
          {
            "label": "ವಿದ್ಯಾರ್ಹತೆ",
            "value": "ಬಿ.ಇ. (ಕಂಪ್ಯೂಟರ್ ಸೈನ್ಸ್, RV ಕಾಲೇಜು), M.Tech (IIT ಮದ್ರಾಸ್)",
            "category": "education_career"
          },
          {
            "label": "ಉದ್ಯೋಗ ಮತ್ತು ವಾರ್ಷಿಕ ವೇತನ",
            "value": "ಸೀನಿಯರ್ ಇಂಜಿನಿಯರಿಂಗ್ ಮ್ಯಾನೇಜರ್, ಬೆಂಗಳೂರು • ₹33 ಲಕ್ಷ/ವರ್ಷ",
            "category": "education_career"
          },
          {
            "label": "ತಂದೆಯವರ ಹೆಸರು",
            "value": "ಶ್ರೀ ಕೃಷ್ಣಮೂರ್ತಿ ಹೆಗಡೆ (ಬ್ಯಾಂಕ್ ಅಧಿಕಾರಿ - ನಿವೃತ್ತ)",
            "category": "family"
          },
          {
            "label": "ತಾಯಿಯವರ ಹೆಸರು",
            "value": "ಶ್ರೀಮತಿ ಶಾರದಾ ಹೆಗಡೆ (ಗೃಹಿಣಿ)",
            "category": "family"
          },
          {
            "label": "ಗೋತ್ರ ಮತ್ತು ಜಾತಕ",
            "value": "ಗೋತ್ರ: ವಿಶ್ವಾಮಿತ್ರ • ರಾಶಿ: ವೃಷಭ • ನಕ್ಷತ್ರ: ರೋಹಿಣಿ • ಮಾಂಗಲ್ಯ: ಇಲ್ಲ",
            "category": "horoscope"
          },
          {
            "label": "ಮೂಲ ಊರು & ಕುಲದೈವ",
            "value": "ಮೂಲ ಊರು: ಶಿರಸಿ (ಉತ್ತರ ಕನ್ನಡ) • ಕುಲದೈವ: ಮಾರಿಕಾಂಬಾ ದೇವಿ",
            "category": "horoscope"
          },
          {
            "label": "ಸಂಪರ್ಕ ಸಂಖ್ಯೆ",
            "value": "+91 98450 12345 (ತಂದೆ) • ಜಯನಗರ, ಬೆಂಗಳೂರು",
            "category": "contact"
          }
        ]
      },
      "girlSample": {
        "name": "ಕಾವ್ಯ ರಾವ್ (Kavya Rao)",
        "title": "ಸಿಎ (ಚಾರ್ಟರ್ಡ್ ಅಕೌಂಟೆಂಟ್) • ಬಿ.ಕಾಂ, FCA",
        "fields": [
          {
            "label": "ಹುಟ್ಟಿದ ವಿವರ",
            "value": "24 ಜನವರಿ 1998 (ವಯಸ್ಸು: 27 ವರ್ಷ) • ಮಧ್ಯಾಹ್ನ 01:15",
            "category": "personal"
          },
          {
            "label": "ಎತ್ತರ ಮತ್ತು ಆಸಕ್ತಿಗಳು",
            "value": "5 ಅಡಿ 4 ಇಂಚು • ಸರಳ ವ್ಯಕ್ತಿತ್ವ, ಕರ್ನಾಟಕ ಶಾಸ್ತ್ರೀಯ ಸಂಗೀತ ಮತ್ತು ಯೋಗ",
            "category": "personal"
          },
          {
            "label": "ವಿದ್ಯಾರ್ಹತೆ",
            "value": "ಬಿ.ಕಾಂ (ಮೌಂಟ್ ಕಾರ್ಮೆಲ್ ಕಾಲೇಜು), ಚಾರ್ಟರ್ಡ್ ಅಕೌಂಟೆಂಟ್ (ICAI)",
            "category": "education_career"
          },
          {
            "label": "ಪ್ರಸ್ತುತ ವೃತ್ತಿ",
            "value": "ಅಸೋಸಿಯೇಟ್ ಡೈರೆಕ್ಟರ್, ಅರ್ನ್ಸ್ಟ್ & ಯಂಗ್ (EY) ಬೆಂಗಳೂರು",
            "category": "education_career"
          },
          {
            "label": "ತಂದೆಯವರ ಹೆಸರು",
            "value": "ಶ್ರೀ ಪ್ರಭಾಕರ್ ರಾವ್ (ಉದ್ಯಮಿ)",
            "category": "family"
          },
          {
            "label": "ತಾಯಿಯವರ ಹೆಸರು",
            "value": "ಶ್ರೀಮತಿ ಸುಧಾ ರಾವ್ (M.A., ಉಪನ್ಯಾಸಕಿ)",
            "category": "family"
          },
          {
            "label": "ಗೋತ್ರ ಮತ್ತು ರಾಶಿ",
            "value": "ಗೋತ್ರ: ಭಾರದ್ವಾಜ • ರಾಶಿ: ತುಲಾ • ನಕ್ಷತ್ರ: ಸ್ವಾತಿ • ಪಾದ: 3",
            "category": "horoscope"
          },
          {
            "label": "ಮೂಲ ಮನೆತನ",
            "value": "ಮೂಲ: ಮಂಗಳೂರು / ಉಡುಪಿ • ತಾಯಿಯ ಮನೆತನ: ಶೆಣೈ (ಕುಂದಾಪುರ)",
            "category": "horoscope"
          },
          {
            "label": "ಸಂಪರ್ಕ ವಿಳಾಸ",
            "value": "+91 98451 98765 (ಪೋಷಕರು) • ಮಲ್ಲೇಶ್ವರಂ, ಬೆಂಗಳೂರು",
            "category": "contact"
          }
        ]
      }
    },
    "faqs": [
      {
        "question": "ಟ್ರೂಮ್ಯಾರೇಜ್‌ನಲ್ಲಿ ಕನ್ನಡ ಬಯೋಡೇಟಾ ಮಾಡುವುದು ಉಚಿತವೇ?",
        "answer": "ಹೌದು, ನೀವು ಯಾವುದೇ ಶುಲ್ಕವಿಲ್ಲದೆ ಸಂಪೂರ್ಣ ಕನ್ನಡ ಬಯೋಡೇಟಾವನ್ನು ಉಚಿತವಾಗಿ ರಚಿಸಿ PDF ಡೌನ್‌ಲೋಡ್ ಮಾಡಿಕೊಳ್ಳಬಹುದು."
      },
      {
        "question": "ಡೌನ್‌ಲೋಡ್ ಮಾಡಿದ PDF ಮೇಲೆ ವಾಟರ್‌ಮಾರ್ಕ್ ಇರುತ್ತದೆಯೇ?",
        "answer": "ಇಲ್ಲ, ಟ್ರೂಮ್ಯಾರೇಜ್ ನೀಡುವ PDF ನಲ್ಲಿ ಯಾವುದೇ ವಾಟರ್‌ಮಾರ್ಕ್ ಅಥವಾ ಅನಗತ್ಯ ಜಾಹೀರಾತು ಇರುವುದಿಲ್ಲ."
      },
      {
        "question": "ಕನ್ನಡದಲ್ಲಿ ಬರೆಯುವುದು ಹೇಗೆ?",
        "answer": "ನಿಮ್ಮ ಸಾಮಾನ್ಯ ಇಂಗ್ಲಿಷ್ ಕೀಬೋರ್ಡ್ ಬಳಸಿ (ಉದಾ: Ramesh -> ರಮೇಶ್) ಸುಲಭವಾಗಿ ಕನ್ನಡಕ್ಕೆ ಪರಿವರ್ತಿಸಿಕೊಳ್ಳಬಹುದು."
      },
      {
        "question": "ಇದರಲ್ಲಿ ಗೋತ್ರ ಮತ್ತು ಜಾತಕ ಬರೆಯಲು ಸ್ಥಳವಿದೆಯೇ?",
        "answer": "ಖಂಡಿತವಾಗಿ, ಗೋತ್ರ, ಕುಲದೈವ, ರಾಶಿ, ನಕ್ಷತ್ರ ಮತ್ತು ಪಾದಗಳನ್ನು ನಮೂದಿಸಲು ಪ್ರತ್ಯೇಕ ಕಾಲಮ್‌ಗಳಿವೆ."
      }
    ],
    "relatedSlugs": [
      "free-marriage-biodata-maker",
      "free-marriage-biodata-pdf",
      "marriage-biodata-format-for-boy-and-girl",
      "hindu-marriage-biodata"
    ]
  },
  "bengali-marriage-biodata": {
    "slug": "bengali-marriage-biodata",
    "category": "language",
    "primaryKeyword": "bengali marriage biodata",
    "title": "বাংলা বিবাহ বায়োডাটা মেকার | পাত্র-পাত্রীর বিয়ের বায়োডাটা PDF",
    "description": "অনলাইনে বাংলায় সুন্দর বিয়ের বায়োডাটা (পাত্র-পাত্রীর পরিচয়পত্র) তৈরি করুন। শ্রী শ্রী প্রজাপতয়ে নমঃ, রাশি, নক্ষত্র, গোত্র এবং পারিবারিক পরিচয় সহ ফ্রি PDF ডাউনলোড করুন।",
    "canonicalPath": "/biodata/bengali-marriage-biodata",
    "h1": "বাংলায় বিয়ের বায়োডাটা তৈরি করুন",
    "nativeScript": "|| শ্রী শ্রী প্রজাপতয়ে নমঃ ||",
    "subheading": "ঐতিহ্যবাহী প্রজাপতি ও স্বস্তিক প্রতীক, রাশিচক্র, গোত্র এবং পারিবারিক ঐতিহ্যের সাথে মাতৃভাষায় তৈরি করুন পাত্র-পাত্রীর পূর্ণাঙ্গ পরিচয়পত্র।",
    "badge": "বাঙালি পাত্র-পাত্রী বায়োডাটা",
    "themeColor": "#BE123C",
    "ctaText": "বিনামূল্যে বায়োডাটা তৈরি করুন",
    "previewCtaText": "বাংলা টেমপ্লেট দেখুন",
    "boyTabLabel": "বর (পাত্র) বায়োডাটা",
    "girlTabLabel": "কনে (পাত্রী) বায়োডাটা",
    "whySection": {
      "heading": "কেন বাংলায় বিয়ের বায়োডাটা তৈরি করা প্রয়োজন?",
      "intro": "বাঙালি সংস্কৃতিতে বিয়ে কেবল দুটি মনের মিলন নয়, দুটি পরিবারের আত্মীয়তার বন্ধন। পরিবারের প্রবীণ সদস্য এবং আত্মীয়স্বজনরা মাতৃভাষা বাংলায় লেখা পাত্র বা পাত্রীর পরিচয়পত্র অত্যন্ত শ্রদ্ধা ও সহজে অনুধাবন করতে পারেন।",
      "reasons": [
        {
          "title": "পরিবারের প্রবীণদের সহজে পড়ার উপযোগী",
          "description": "দাদু-ঠাকুমা এবং বয়োজ্যেষ্ঠ আত্মীয়রা ইংরেজির চেয়ে বাংলা হরফে লেখা তথ্যাদি কোনো অস্পষ্টতা ছাড়াই পরিষ্কার বুঝতে পারেন।"
        },
        {
          "title": "কোষ্ঠী ও জ্যোতিষীয় তথ্যের নির্ভুলতা",
          "description": "গোত্র, রাশি, নক্ষত্র, গণ, নাড়ী এবং মামার বাড়ির পদবীর মতো গুরুত্বপূর্ণ বিষয়গুলো বাংলায় নিখুঁতভাবে প্রকাশ পায়।"
        },
        {
          "title": "বাঙালি সংস্কৃতির ঐতিহ্য ও মর্যাদা",
          "description": "শ্রী শ্রী প্রজাপতয়ে নমঃ এবং শঙ্খ-কলস চিহ্নের সমন্বয়ে তৈরি বায়োডাটা শুভ বিবাহের পবিত্রতা বৃদ্ধি করে।"
        },
        {
          "title": "হোয়াটসঅ্যাপে ফন্ট না ভেঙে স্পষ্ট প্রদর্শন",
          "description": "ট্রুম্যারেজের ইউনিকোড বাংলা ফরম্যাট যেকোনো স্মার্টফোনে ফন্ট না ভেঙে সম্পূর্ণ নিখুঁতভাবে প্রদর্শিত হয়।"
        }
      ]
    },
    "howSection": {
      "heading": "কীভাবে বাংলায় বিয়ের বায়োডাটা তৈরি করবেন?",
      "intro": "মাত্র ৫ মিনিটে নিচের সহজ ধাপগুলো অনুসরণ করে আপনার বায়োডাটা তৈরি করুন:",
      "workflowSteps": [
        {
          "stepNumber": 1,
          "title": "পছন্দের বাংলা ডিজাইন বেছে নিন",
          "description": "ঐতিহ্যবাহী আলপনা বর্ডার অথবা আধুনিক মার্জিত বাংলা ডিজাইনের মধ্য থেকে একটি নির্বাচন করুন।"
        },
        {
          "stepNumber": 2,
          "title": "ব্যক্তিগত ও শিক্ষাগত তথ্য প্রদান করুন",
          "description": "পুরো নাম, জন্ম তারিখ, সঠিক সময়, জন্মস্থান, উচ্চতা, শিক্ষাগত যোগ্যতা এবং বর্তমান পেশার বিবরণ লিখুন।"
        },
        {
          "stepNumber": 3,
          "title": "পারিবারিক ও জ্যোতিষীয় বিবরণ যোগ করুন",
          "description": "বাবা-মায়ের পেশা, ভাই-বোনের তথ্য, গোত্র, রাশি, আদি বাসস্থান এবং যোগাযোগের নম্বর যুক্ত করুন।"
        },
        {
          "stepNumber": 4,
          "title": "বিনামূল্যে PDF ডাউনলোড করুন",
          "description": "স্ক্রিনে সরাসরি প্রিভিউ দেখে যাচাই করুন এবং এক ক্লিকে প্রিন্ট-রেডি পরিষ্কার PDF ফাইল সংগ্রহ করুন।"
        }
      ],
      "keyElementsToInclude": [
        "পুরো নাম এবং সুন্দর পাসপোর্ট সাইজ ছবি",
        "জন্ম তারিখ, সঠিক জন্ম সময় এবং জন্মস্থান",
        "উচ্চতা, গায়ের রং এবং রক্তের গ্রুপ",
        "শিক্ষাগত যোগ্যতা (ডিগ্রি ও কলেজের নাম)",
        "পেশা / চাকরি, কোম্পানির নাম, পদবী ও বাৎসরিক আয়",
        "গোত্র, রাশি, নক্ষত্র, গণ এবং মাঙ্গলিক বিবরণ",
        "পিতার নাম ও পেশা, মাতার পরিচয়",
        "ভাই ও বোনের বিবরণ (বিবাহিত / পাঠরত)"
      ],
      "dosAndDonts": {
        "dos": [
          "কোষ্ঠী বিচারের সুবিধার জন্য জন্ম সময় হাসপাতালের রেকর্ড দেখে নিখুঁত লিখুন।",
          "আদি বাসস্থান এবং বর্তমান ঠিকানা উভয়ই পরিষ্কারভাবে উল্লেখ করুন।",
          "শিক্ষাগত যোগ্যতা এবং পদবী সম্পর্কে সঠিক তথ্য দিন।",
          "সম্প্রতি তোলা স্পষ্ট ও মার্জিত পোশাকের ছবি ব্যবহার করুন।"
        ],
        "donts": [
          "অস্পষ্ট, সেলফি বা সানগ্লাস পরা ছবি ব্যবহার করবেন না।",
          "ভুল বা সংযোগ বিচ্ছিন্ন ফোন নম্বর দেবেন না।",
          "তথ্য অতিরিক্ত জটিল বা ঘিঞ্জি না করে পরিচ্ছন্ন রাখুন।",
          "আধার কার্ড বা ব্যাংকের মতো সংবেদনশীল তথ্য কখনোই যুক্ত করবেন না।"
        ]
      }
    },
    "whereSection": {
      "heading": "বাংলা বায়োডাটা কোথায় ব্যবহার করবেন?",
      "intro": "বাঙালি সংস্কৃতিতে বিয়ে কেবল দুটি মনের মিলন নয়, দুটি পরিবারের আত্মীয়তার বন্ধন। পরিবারের প্রবীণ সদস্য এবং আত্মীয়স্বজনরা মাতৃভাষা বাংলায় লেখা পাত্র বা পাত্রীর পরিচয়পত্র অত্যন্ত শ্রদ্ধা ও সহজে অনুধাবন করতে পারেন।",
      "useCases": [
        {
          "title": "হোয়াটসঅ্যাপ ও পারিবারিক আত্মীয়স্বজন",
          "description": "যেকোনো মোবাইলে অবিকল একই ফরম্যাটে খোলা যাবে এমন PDF।"
        },
        {
          "title": "ম্যাট্রিমোনিয়াল ঘটক ও পরিচয় সভা",
          "description": "বিবাহের ঘটক বা সম্মিলনীতে জমা দেওয়ার জন্য রঙিন প্রিন্ট কপি।"
        },
        {
          "title": "পাত্র-পাত্রী দেখার প্রথম ঘরোয়া বৈঠক",
          "description": "অতিথিরা যখন বাড়িতে আসবেন, তাদের হাতে শ্রদ্ধার সাথে তুলে দেওয়ার মতো প্রিন্ট।"
        }
      ],
      "downloadAndShareDetails": "ডাউনলোড করা PDF ফাইলটি আন্তর্জাতিক মানসম্পন্ন A4 সাইজে (২১০ x ২৯৭ মিমি) প্রস্তুত হয়, যা যেকোনো প্রিন্টার ও হোয়াটসঅ্যাপে নিখুঁতভাবে প্রদর্শিত হয়।"
    },
    "sampleBiodatas": {
      "boySample": {
        "name": "শুভ্রনীল বন্দ্যোপাধ্যায় (Subhranil Banerjee)",
        "title": "ডেটা ইঞ্জিনিয়ারিং লিড • বি.টেক (যাদবপুর বিশ্ববিদ্যালয়), এম.টেক",
        "fields": [
          {
            "label": "জন্ম বিবরণ",
            "value": "১২ অক্টোবর ১৯৯৫ (বয়স: ৩০ বছর) • সকাল ০৭:৩০ মিনিট",
            "category": "personal"
          },
          {
            "label": "উচ্চতা ও রক্তের গ্রুপ",
            "value": "৫ ফুট ১০ ইঞ্চি • ফর্সা • রক্তের গ্রুপ: B+",
            "category": "personal"
          },
          {
            "label": "শিক্ষাগত যোগ্যতা",
            "value": "বি.টেক (কম্পিউটার সায়েন্স, যাদবপুর বিশ্ববিদ্যালয়)",
            "category": "education_career"
          },
          {
            "label": "পেশা ও বার্ষিক আয়",
            "value": "টেক লিড, কগনিজেন্ট কলকাতা / বেঙ্গালুরু • ₹২৮ লাখ/বছর",
            "category": "education_career"
          },
          {
            "label": "পিতার নাম",
            "value": "শ্রী প্রবীর বন্দ্যোপাধ্যায় (অবসরপ্রাপ্ত অতিরিক্ত সচিব, পশ্চিমবঙ্গ সরকার)",
            "category": "family"
          },
          {
            "label": "মাতার নাম",
            "value": "শ্রীমতী মালবিকা বন্দ্যোপাধ্যায় (গৃহিণী)",
            "category": "family"
          },
          {
            "label": "গোত্র ও রাশিচক্র",
            "value": "গোত্র: শাণ্ডিল্য • রাশি: মিথুন • নক্ষত্র: আর্দ্রা • মাঙ্গলিক: না",
            "category": "horoscope"
          },
          {
            "label": "আদি নিবাস ও ঠিকানা",
            "value": "আদি নিবাস: নবদ্বীপ (নদিয়া) • বর্তমান নিবাস: সল্টলেক, কলকাতা",
            "category": "horoscope"
          },
          {
            "label": "যোগাযোগের নম্বর",
            "value": "+91 98300 12345 (পিতা) • সেক্টর ৩, সল্টলেক, কলকাতা",
            "category": "contact"
          }
        ]
      },
      "girlSample": {
        "name": "সঞ্চারী মুখোপাধ্যায় (Sanchari Mukherjee)",
        "title": "সহকারী অধ্যাপিকা (ইংরেজি সাহিত্য) • এম.এ., পিএইচ.ডি.",
        "fields": [
          {
            "label": "জন্ম বিবরণ",
            "value": "১৮ মে ১৯৯৭ (বয়স: ২৮ বছর) • বিকেল ০৪:১৫ মিনিট",
            "category": "personal"
          },
          {
            "label": "উচ্চতা ও ব্যক্তিত্ব",
            "value": "৫ ফুট ৫ ইঞ্চি • সংস্কৃতিমনস্ক, রবীন্দ্রসঙ্গীত ও আবৃত্তিতে পারদর্শী",
            "category": "personal"
          },
          {
            "label": "শিক্ষাগত যোগ্যতা",
            "value": "বি.এ., এম.এ. (প্রেসিডেন্সি বিশ্ববিদ্যালয়), পিএইচ.ডি. (কলকাতা বিশ্ববিদ্যালয়)",
            "category": "education_career"
          },
          {
            "label": "বর্তমান পেশা",
            "value": "সহকারী অধ্যাপিকা, সরকারি মহাবিদ্যালয়, কলকাতা",
            "category": "education_career"
          },
          {
            "label": "পিতার নাম",
            "value": "ড. সুব্রত মুখোপাধ্যায় (চিকিৎসক - শিশু বিশেষজ্ঞ)",
            "category": "family"
          },
          {
            "label": "মাতার নাম",
            "value": "শ্রীমতী অনসূয়া মুখোপাধ্যায় (এম.এসসি., প্রধান শিক্ষিকা)",
            "category": "family"
          },
          {
            "label": "গোত্র ও যোটক বিবরণ",
            "value": "গোত্র: ভরদ্বাজ • রাশি: কন্যা • নক্ষত্র: চিত্রা • গণ: দেবগণ",
            "category": "horoscope"
          },
          {
            "label": "মামার বাড়ি ও আদি নিবাস",
            "value": "মামার বাড়ির পদবী: চট্টোপাধ্যায় (বালিগঞ্জ) • আদি নিবাস: চন্দননগর",
            "category": "horoscope"
          },
          {
            "label": "যোগাযোগের ঠিকানা",
            "value": "+91 98310 98765 (অভিভাবক) • গড়িয়াহাট, দক্ষিণ কলকাতা",
            "category": "contact"
          }
        ]
      }
    },
    "faqs": [
      {
        "question": "ট্রুম্যারেজে কি বাংলা বায়োডাটা তৈরি সম্পূর্ণ ফ্রি?",
        "answer": "হ্যাঁ, আপনি কোনো প্রকার খরচ বা লুকানো চার্জ ছাড়াই সম্পূর্ণ বাংলা বায়োডাটা তৈরি এবং PDF ডাউনলোড করতে পারেন।"
      },
      {
        "question": "ডাউনলোড করা PDF-এ কি কোনো ওয়াটারমার্ক থাকবে?",
        "answer": "না, ট্রুম্যারেজের বায়োডাটা সম্পূর্ণ পরিষ্কার এবং এতে কোনো ওয়াটারমার্ক বা বিজ্ঞাপন থাকে না।"
      },
      {
        "question": "বাংলায় কীভাবে লিখব?",
        "answer": "আপনি সাধারণ ইংরেজি কীবোর্ড দিয়ে টাইপ করেও (যেমন: Rahul -> রাহুল) সহজে বাংলা লিখতে পারেন।"
      },
      {
        "question": "এতে কি মামার বাড়ি ও গোত্রের তথ্য লেখার জায়গা আছে?",
        "answer": "হ্যাঁ, বাঙালি রীতি অনুযায়ী গোত্র, মামার বাড়ির পদবী এবং আদি নিবাসীর জন্য আলাদা ঘর রাখা হয়েছে।"
      }
    ],
    "relatedSlugs": [
      "free-marriage-biodata-maker",
      "free-marriage-biodata-pdf",
      "marriage-biodata-format-for-boy-and-girl",
      "hindu-marriage-biodata"
    ]
  },
  "hindu-marriage-biodata": {
    "slug": "hindu-marriage-biodata",
    "category": "religion",
    "primaryKeyword": "hindu marriage biodata",
    "title": "Hindu Marriage Biodata Maker | Kundali, Gotra & Traditional Formats",
    "description": "Create an authentic Hindu marriage biodata online. Dedicated sections for Kundali matching, Gotra, Nakshatra, Kuldevi, and family roots. Free PDF download.",
    "canonicalPath": "/biodata/hindu-marriage-biodata",
    "h1": "Hindu Marriage Biodata Maker",
    "nativeScript": "॥ श्री गणेशाय नमः ॥",
    "subheading": "Respectful matrimonial formats tailored for Hindu traditions. Structured sections for Guna Milan, Gotra, Kuldevi, education, and family background.",
    "badge": "Traditional Hindu Matrimony",
    "themeColor": "#E11D48",
    "ctaText": "Create Hindu Biodata Free",
    "previewCtaText": "View Hindu Formats",
    "boyTabLabel": "Groom (Boy) Biodata",
    "girlTabLabel": "Bride (Girl) Biodata",
    "whySection": {
      "heading": "Why Hindu Matrimonial Introductions Require Specific Cultural Fields",
      "intro": "In Hindu matchmaking, marriage is viewed as a sacred union (Vivaha Samskara) between two families. Beyond education and career, elders and family astrologers verify spiritual compatibility, ancestral lineage, and family gotra before formal talks proceed.",
      "reasons": [
        {
          "title": "Kundali and Guna Milan Verification",
          "description": "Birth details (exact time, date, and city) are required to generate Janam Kundali for Ashtakoota Guna Milan (36 Gunas), Manglik dosha checks, and Nadi compatibility."
        },
        {
          "title": "Gotra Exogamy and Lineage Respect",
          "description": "Most Hindu communities prohibit same-gotra marriages (Sagotra). Our templates provide dedicated fields for self-gotra and maternal uncle (mama) gotra to verify lineage upfront."
        },
        {
          "title": "Kuldevi and Ancestral Roots (Paitrik Gaon)",
          "description": "Listing your family's Kuldevi/Kuldevta and ancestral town gives elders immediate clarity about family customs and deity worship rituals."
        },
        {
          "title": "Auspicious First Impression",
          "description": "Profiles featuring sacred headers like ॥ श्री गणेशाय नमः ॥ and auspicious borders resonate deeply with traditional Hindu families."
        }
      ]
    },
    "howSection": {
      "heading": "How to Create a Hindu Marriage Biodata",
      "intro": "Generate a complete Hindu matrimonial profile in four simple steps:",
      "workflowSteps": [
        {
          "stepNumber": 1,
          "title": "Select an Auspicious Design",
          "description": "Pick a theme featuring sacred temple borders, deep crimson hues, or elegant gold accents."
        },
        {
          "stepNumber": 2,
          "title": "Enter Personal & Horoscope Data",
          "description": "Fill in your name, birth date, exact birth time, birth city, height, gotra, rashi, nakshatra, charan, and Manglik status."
        },
        {
          "stepNumber": 3,
          "title": "Add Education, Profession & Family Details",
          "description": "Include degree, current employer, work city, parents' professions, siblings, and paternal ancestral village."
        },
        {
          "stepNumber": 4,
          "title": "Download Clean Print-Ready PDF",
          "description": "Review all spellings in live preview and export an unwatermarked A4 PDF ready for WhatsApp or family meetings."
        }
      ],
      "keyElementsToInclude": [
        "Full Name & Auspicious Header (॥ श्री गणेशाय नमः ॥)",
        "Date of Birth, Accurate Birth Time & Birth City",
        "Height, Blood Group & Physical Demeanor",
        "Education: Highest Degree & Prestigious University",
        "Occupation: Company, Job Title, Work Location & Package",
        "Horoscope: Gotra, Rashi, Nakshatra, Charan & Manglik Status",
        "Kuldevi / Kuldevta & Native District",
        "Father & Mother Background (Occupation & Roots)"
      ],
      "dosAndDonts": {
        "dos": [
          "Verify your birth time from an official birth record or original Janam Patri.",
          "Clearly specify if Manglik (Anshik / Full / Non-Manglik).",
          "Include native village or district name for family background checks.",
          "Attach a recent, dignified photo in traditional or smart casual attire."
        ],
        "donts": [
          "Do not omit Gotra if your community strictly observes gotra exogamy.",
          "Avoid heavily filtered party selfies or cropped group photos.",
          "Do not provide incomplete phone numbers without contact person's name.",
          "Avoid uploading PAN or bank documents."
        ]
      }
    },
    "whereSection": {
      "heading": "Where to Share Your Hindu Marriage Biodata",
      "intro": "Share with prospective families and community matrimonial bureaus with complete confidence.",
      "useCases": [
        {
          "title": "Family WhatsApp Exchanges & Relatives",
          "description": "PDF format ensures layout and sacred headers remain intact on every smartphone."
        },
        {
          "title": "Samaj Matrimonial Sammelans",
          "description": "Take 3-4 clean color printouts for community matchmaking gatherings."
        },
        {
          "title": "In-Person Home Visits (Rishta Baithak)",
          "description": "Present a crisp printed copy to visiting elders during formal introductions."
        }
      ],
      "downloadAndShareDetails": "All generated files are saved in standard international A4 format (210 x 297 mm), 300 DPI vector quality without watermarks."
    },
    "sampleBiodatas": {
      "boySample": {
        "name": "Aarav Shastri",
        "title": "Senior Systems Architect • B.Tech (IIT Kanpur)",
        "fields": [
          {
            "label": "Birth Details",
            "value": "16 November 1995 (30 Yrs) • 06:45 AM, Varanasi",
            "category": "personal"
          },
          {
            "label": "Height & Physique",
            "value": "5 ft 11 in • Athletic • Blood Group B+",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "B.Tech in Computer Science, IIT Kanpur",
            "category": "education_career"
          },
          {
            "label": "Profession & Package",
            "value": "Senior Systems Architect, Adobe Noida • ₹32 LPA",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "Prof. Ramakant Shastri (Dean, Faculty of Arts, BHU)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Mrs. Vidya Shastri (M.A. Sanskrit, Homemaker)",
            "category": "family"
          },
          {
            "label": "Gotra & Kuldevi",
            "value": "Gotra: Sandilya • Kuldevi: Vindhyavasini Devi • Native: Mirzapur",
            "category": "horoscope"
          },
          {
            "label": "Astrology",
            "value": "Rashi: Vrishabha • Nakshatra: Rohini • Manglik: No",
            "category": "horoscope"
          },
          {
            "label": "Family Contact",
            "value": "+91 94150 12345 (Father) • Varanasi / Noida",
            "category": "contact"
          }
        ]
      },
      "girlSample": {
        "name": "Priyanka Sharma",
        "title": "Assistant Professor (Biotechnology) • Ph.D.",
        "fields": [
          {
            "label": "Birth Details",
            "value": "24 July 1997 (28 Yrs) • 02:15 PM, Lucknow",
            "category": "personal"
          },
          {
            "label": "Height & Demeanor",
            "value": "5 ft 5 in • Pleasant personality, Classical Kathak artist",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "M.Sc., Ph.D. in Biotechnology (Lucknow University)",
            "category": "education_career"
          },
          {
            "label": "Profession",
            "value": "Assistant Professor, Central University • ₹18 LPA",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "Dr. K. N. Sharma (Director, Agriculture Dept. - Retd.)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Mrs. Saroj Sharma (M.Sc., Botanist)",
            "category": "family"
          },
          {
            "label": "Gotra & Mama Gotra",
            "value": "Gotra: Bharadwaj • Mama Gotra: Vatsa (Kanpur)",
            "category": "horoscope"
          },
          {
            "label": "Astrology",
            "value": "Rashi: Kanya • Nakshatra: Hasta • Manglik: No",
            "category": "horoscope"
          },
          {
            "label": "Guardian Contact",
            "value": "+91 94520 67890 (Parents) • Gomti Nagar, Lucknow",
            "category": "contact"
          }
        ]
      }
    },
    "faqs": [
      {
        "question": "Can I make a Hindu biodata without astrological details if our family does not believe in Kundalis?",
        "answer": "Yes. All astrological fields on TrueMarriage are completely optional. If left blank, the horoscope section neatly disappears without leaving awkward empty gaps."
      },
      {
        "question": "How do I add maternal uncle's (Mama's) Gotra?",
        "answer": "Our Hindu templates include a dedicated Mama Gotra field under the Family Details section, which is particularly useful for North and Central Indian communities."
      },
      {
        "question": "Is the Hindu biodata download completely free?",
        "answer": "Yes. You can customize, preview, and download your unwatermarked Hindu marriage biodata PDF for free without payment or mandatory sign-ups."
      },
      {
        "question": "What auspicious header options are available?",
        "answer": "You can select from ॥ श्री गणेशाय नमः ॥, ॥ ॐ ॥, ॥ श्री महालक्ष्मी प्रसन्न ॥, ॥ ॐ नमः शिवाय ॥, or enter your custom family ishta devta mantra."
      }
    ],
    "relatedSlugs": [
      "free-marriage-biodata-maker",
      "marriage-biodata-format-for-boy-and-girl",
      "free-marriage-biodata-pdf",
      "how-to-make-biodata-for-marriage-online"
    ]
  },
  "muslim-marriage-biodata": {
    "slug": "muslim-marriage-biodata",
    "category": "religion",
    "primaryKeyword": "muslim marriage biodata",
    "title": "Muslim Marriage Biodata Maker | Nikah Profile PDF Templates",
    "description": "Create an authentic Muslim marriage biodata (Nikah profile) online. Fields for Maslak, Namaz, Quran, education, family values, and Wali contact. Free PDF download.",
    "canonicalPath": "/biodata/muslim-marriage-biodata",
    "h1": "Muslim Marriage Biodata Maker (Nikah Profile)",
    "nativeScript": "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ",
    "subheading": "Dignified Islamic matrimonial formats for brides and grooms. Clean sections for Deen, Maslak, education, profession, family background, and Wali details.",
    "badge": "Islamic Matrimonial Profile",
    "themeColor": "#047857",
    "ctaText": "Create Nikah Biodata Free",
    "previewCtaText": "View Nikah Templates",
    "boyTabLabel": "Groom (Boy) Nikah Profile",
    "girlTabLabel": "Bride (Girl) Nikah Profile",
    "whySection": {
      "heading": "Why an Islamic Nikah Profile Requires Thoughtful Framing",
      "intro": "In Islam, marriage (Nikah) is half of one's deen (faith). A Muslim marriage biodata should balance religious practice, moral character (Akhlaq), educational achievements, and family modesty. Presenting these details clearly prevents misunderstandings and fosters respectful family proposals.",
      "reasons": [
        {
          "title": "Clarity on Religious Practice (Deen & Ibadah)",
          "description": "Families value knowing a candidate's commitment to daily prayers (5 times Namaz), Quran recitation, Fasting in Ramadan, and Halal lifestyle choices."
        },
        {
          "title": "Maslak and Jurisprudence Understanding",
          "description": "Listing sect or school of thought (Sunni Hanafi, Shafi, Ahl-e-Hadith, Shia, etc.) helps both families ensure compatibility in religious customs and fiqh."
        },
        {
          "title": "Respect for Islamic Modesty (Haya)",
          "description": "Templates for Muslim brides honor modesty and privacy, allowing hijab / abaya preferences to be highlighted and routing contact strictly through the father or guardian (Wali)."
        },
        {
          "title": "Clean Presentation with Islamic Calligraphy",
          "description": "Features elegant Bismillah calligraphy (بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ) and refined geometric arch borders that reflect Islamic heritage."
        }
      ]
    },
    "howSection": {
      "heading": "How to Build Your Muslim Marriage Biodata",
      "intro": "Complete your Nikah proposal document in four simple steps:",
      "workflowSteps": [
        {
          "stepNumber": 1,
          "title": "Choose an Islamic Motif Layout",
          "description": "Select an emerald green, royal gold, or midnight navy template with Islamic arches and Bismillah header."
        },
        {
          "stepNumber": 2,
          "title": "Enter Personal & Religious Credentials",
          "description": "Fill in full name, birth date, height, complex, religious practice (Namaz, Roza, Quran), Maslak, and dietary lifestyle."
        },
        {
          "stepNumber": 3,
          "title": "Add Education, Career & Family Lineage",
          "description": "Detail secular and Islamic education (e.g., Alim/Hafiz if applicable), current job, family roots, parents' details, and siblings."
        },
        {
          "stepNumber": 4,
          "title": "Download Unwatermarked PDF",
          "description": "Generate a high-resolution, unwatermarked PDF file ready to forward to prospective families and rishta coordinators."
        }
      ],
      "keyElementsToInclude": [
        "Full Name & Bismillah Header",
        "Date of Birth, Age & Height",
        "Religious Commitment: Namaz (5 times), Fasting, Quran",
        "Maslak / Sect (Hanafi, Shafi, Salafi, etc.)",
        "Highest Qualification & University",
        "Occupation: Designation, Employer Name, Annual Income & City",
        "Father's Name & Profession, Mother's Background",
        "Brothers & Sisters (Marital status & occupations)"
      ],
      "dosAndDonts": {
        "dos": [
          "Be completely transparent about religious practice and Maslak.",
          "Clarify whether the bride prefers to continue working after marriage.",
          "Provide the Wali's contact clearly to maintain Islamic etiquette.",
          "Keep the file concise, respectful, and dignified."
        ],
        "donts": [
          "Do not exaggerate income, educational credentials, or property details.",
          "Avoid casual social media selfies with filters.",
          "Do not leave out sibling or family roots information.",
          "Avoid sharing private identification papers like passports or Aadhaar."
        ]
      }
    },
    "whereSection": {
      "heading": "Where to Share Your Muslim Matrimonial Profile",
      "intro": "Share with prospective families and community matrimonial bureaus with complete confidence.",
      "useCases": [
        {
          "title": "Family WhatsApp Exchanges & Rishta Aunty Networks",
          "description": "Locked PDF format prevents accidental edits and opens cleanly on all phones."
        },
        {
          "title": "Community Nikah Bureaus & Mosques",
          "description": "Submit clean printed or digital copies to trusted local community matchmakers."
        },
        {
          "title": "Formal Family Tea Meetings",
          "description": "Keep cleanly printed copies ready for the groom or bride's family visit."
        }
      ],
      "downloadAndShareDetails": "All generated files are saved in standard international A4 format (210 x 297 mm), 300 DPI vector quality without watermarks."
    },
    "sampleBiodatas": {
      "boySample": {
        "name": "Syed Farhan Ali",
        "title": "Senior Software Architect • B.Tech (AMU), M.S.",
        "fields": [
          {
            "label": "Age & Height",
            "value": "29 Years (Born 15 Oct 1996) • 5 ft 10 in",
            "category": "personal"
          },
          {
            "label": "Religious Practice",
            "value": "Namaz: 5 times daily, Fasting in Ramadan, Quran recitation regular",
            "category": "personal"
          },
          {
            "label": "Maslak / Sect",
            "value": "Sunni Hanafi (Respectful of all Islamic traditions)",
            "category": "horoscope"
          },
          {
            "label": "Education",
            "value": "B.Tech (Computer Engineering, AMU Aligarh), M.S.",
            "category": "education_career"
          },
          {
            "label": "Profession & Income",
            "value": "Lead Cloud Engineer, Cisco Bangalore • ₹29 LPA",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "Syed Anwar Ali (Executive Engineer, Irrigation Dept. - Retd.)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Mrs. Shaheen Begum (Homemaker, M.A. Urdu)",
            "category": "family"
          },
          {
            "label": "Ancestral Roots",
            "value": "Aligarh / Hyderabad • Siblings: 1 elder brother (Married)",
            "category": "family"
          },
          {
            "label": "Wali Contact",
            "value": "+91 98370 12345 (Father / Elder Brother) • Bangalore",
            "category": "contact"
          }
        ]
      },
      "girlSample": {
        "name": "Zainab Fatima",
        "title": "Data Scientist & AI Researcher • M.Tech (Jamia Millia)",
        "fields": [
          {
            "label": "Age & Height",
            "value": "26 Years (Born 12 Aug 1999) • 5 ft 4 in",
            "category": "personal"
          },
          {
            "label": "Religious Practice",
            "value": "Observes Hijab, 5 times Namaz, Tajweed-certified Quran recitation",
            "category": "personal"
          },
          {
            "label": "Maslak / Values",
            "value": "Sunni Hanafi • Strong moral values and simple lifestyle",
            "category": "horoscope"
          },
          {
            "label": "Education",
            "value": "B.Tech + M.Tech in Computer Science (Jamia Millia Islamia)",
            "category": "education_career"
          },
          {
            "label": "Current Profession",
            "value": "Data Scientist at IBM Delhi • Career continuing post-marriage",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "Mohammad Tariq Qureshi (Businessman, Export)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Mrs. Asma Parveen (B.Sc., Educator)",
            "category": "family"
          },
          {
            "label": "Nanihal Background",
            "value": "Respected Siddiqui family of Bareilly / Moradabad",
            "category": "family"
          },
          {
            "label": "Wali Contact",
            "value": "+91 98100 54321 (Father) • Zakir Nagar, New Delhi",
            "category": "contact"
          }
        ]
      }
    },
    "faqs": [
      {
        "question": "Can I create a Muslim biodata without uploading a photo?",
        "answer": "Yes. In accordance with Islamic modesty and privacy preferences, TrueMarriage supports photo-free layouts that look complete, elegant, and balanced."
      },
      {
        "question": "Is Bismillah included at the top of the biodata?",
        "answer": "Yes. All our Muslim matrimonial templates feature authentic Arabic calligraphy of Bismillah (بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ) at the header."
      },
      {
        "question": "Can I mention both secular and Islamic education?",
        "answer": "Yes. You can list both degrees (e.g., B.Tech / MBA) and religious credentials (e.g., Hafiz-e-Quran / Alim / Tajweed)."
      },
      {
        "question": "Is the Nikah biodata download completely free?",
        "answer": "Yes. TrueMarriage allows you to design and download your Muslim marriage biodata PDF for free without watermarks."
      }
    ],
    "relatedSlugs": [
      "free-marriage-biodata-maker",
      "marriage-biodata-format-for-boy-and-girl",
      "free-marriage-biodata-pdf",
      "how-to-make-biodata-for-marriage-online"
    ]
  },
  "christian-marriage-biodata": {
    "slug": "christian-marriage-biodata",
    "category": "religion",
    "primaryKeyword": "christian marriage biodata",
    "title": "Christian Marriage Biodata Maker | Church & Parish Profile PDF",
    "description": "Create an elegant Christian marriage biodata online. Dedicated sections for Denomination, Parish Church, Diocese, Baptism, education, and family. Free PDF.",
    "canonicalPath": "/biodata/christian-marriage-biodata",
    "h1": "Christian Marriage Biodata Maker",
    "nativeScript": "✝ In God's Grace ✝",
    "subheading": "Faith-centered matrimonial formats for Christian brides and grooms. Clean sections for Church parish, Diocese, Christian values, education, and family roots.",
    "badge": "Christian Matrimony Profile",
    "themeColor": "#1D4ED8",
    "ctaText": "Create Christian Biodata Free",
    "previewCtaText": "View Christian Formats",
    "boyTabLabel": "Groom (Boy) Biodata",
    "girlTabLabel": "Bride (Girl) Biodata",
    "whySection": {
      "heading": "Why Christian Families Value Church and Parish Information",
      "intro": "In Christian marriage traditions across India—from Kerala and Goa to Tamil Nadu, Mumbai, and the Northeast—holy matrimony is a sacred sacrament celebrated within the Church. Prospective families seek clarity on denomination, baptismal faith, parish involvement, and family heritage.",
      "reasons": [
        {
          "title": "Clarity on Denomination and Rite",
          "description": "Whether Roman Catholic (Latin / Syro-Malabar / Syro-Malankara), CSI, CNI, Mar Thoma, Jacobite, Orthodox, or Protestant/Evangelical, denomination alignment is essential for church marriage protocols."
        },
        {
          "title": "Parish Church and Diocese Affiliation",
          "description": "Specifying your local home parish (Idavaka / Church name) and Diocese helps elders confirm family standing and pastoral references with ease."
        },
        {
          "title": "Christian Faith & Church Ministries",
          "description": "Highlighting baptism, confirmation, choir participation, Sunday school teaching, or youth fellowship demonstrates active Christian living."
        },
        {
          "title": "Refined Visual Presentation with Cross Motifs",
          "description": "Designed with graceful cross headers, soft navy and gold palettes, and tasteful typography suited for formal family sharing."
        }
      ]
    },
    "howSection": {
      "heading": "How to Create a Christian Marriage Biodata",
      "intro": "Craft your parish-ready profile in four simple steps:",
      "workflowSteps": [
        {
          "stepNumber": 1,
          "title": "Select an Elegant Christian Layout",
          "description": "Pick a theme with subtle cross emblems, royal navy framing, or minimalist pearl-white styling."
        },
        {
          "stepNumber": 2,
          "title": "Enter Personal & Church Details",
          "description": "Add your full baptismal name, date of birth, height, denomination, home parish, diocese, and faith milestones."
        },
        {
          "stepNumber": 3,
          "title": "Add Professional & Family Heritage",
          "description": "Include educational qualifications, current job role, parents' details, ancestral family house name (Tharavadu / Family name), and siblings."
        },
        {
          "stepNumber": 4,
          "title": "Download High-Resolution PDF",
          "description": "Export your clean, unwatermarked PDF document for WhatsApp sharing or pastoral record keeping."
        }
      ],
      "keyElementsToInclude": [
        "Full Name & Baptismal Name",
        "Date of Birth, Age & Height",
        "Denomination (Roman Catholic, CSI, Mar Thoma, Orthodox, etc.)",
        "Home Parish Church & Diocese",
        "Highest Educational Qualification & University",
        "Profession, Designation, Employer & Current Work City",
        "Ancestral Family Name (Tharavadu / Clan name)",
        "Father's Profession & Mother's Maiden Family"
      ],
      "dosAndDonts": {
        "dos": [
          "Mention your baptismal name alongside your legal name if customary.",
          "Specify your exact parish church name and diocese.",
          "Include your ancestral family house name (Tharavadu) if from Kerala or Mangalore.",
          "Use a pleasant, dignified recent photograph."
        ],
        "donts": [
          "Do not omit denomination or assume it is obvious.",
          "Avoid overly casual selfie photos taken in low light.",
          "Do not leave out sibling occupations or marital status.",
          "Avoid adding confidential financial identification numbers."
        ]
      }
    },
    "whereSection": {
      "heading": "Where to Share Your Christian Biodata",
      "intro": "Share with prospective families and community matrimonial bureaus with complete confidence.",
      "useCases": [
        {
          "title": "WhatsApp Family Connections",
          "description": "Directly forward the pristine PDF file to relatives and prospective matches."
        },
        {
          "title": "Parish Matrimonial Desks",
          "description": "Submit copies to church marriage bureaus and parish bulletin coordinators."
        },
        {
          "title": "Family Home Meetings",
          "description": "Have color printed copies ready when families meet for formal introductions."
        }
      ],
      "downloadAndShareDetails": "All generated files are saved in standard international A4 format (210 x 297 mm), 300 DPI vector quality without watermarks."
    },
    "sampleBiodatas": {
      "boySample": {
        "name": "Kevin Joseph Mathew",
        "title": "Senior Product Manager • B.Tech (NIT Calicut), MBA",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "14 May 1995 (30 Years) • 5 ft 11 in",
            "category": "personal"
          },
          {
            "label": "Denomination & Parish",
            "value": "Roman Catholic (Syro-Malabar) • St. Thomas Forane Church",
            "category": "personal"
          },
          {
            "label": "Diocese",
            "value": "Archdiocese of Ernakulam-Angamaly",
            "category": "horoscope"
          },
          {
            "label": "Faith Life",
            "value": "Baptized, Confirmed • Active in Parish Youth Ministry & Choir",
            "category": "horoscope"
          },
          {
            "label": "Education",
            "value": "B.Tech Mechanical (NIT Calicut), MBA (IIM Kozhikode)",
            "category": "education_career"
          },
          {
            "label": "Profession",
            "value": "Senior Product Manager, Microsoft Hyderabad • ₹33 LPA",
            "category": "education_career"
          },
          {
            "label": "Family House Name",
            "value": "Thekkedathu House, Pala, Kottayam (Ancestral roots)",
            "category": "family"
          },
          {
            "label": "Father & Mother",
            "value": "Mr. Joseph Mathew (Retd. Bank Manager) & Mrs. Mary Joseph (Teacher)",
            "category": "family"
          },
          {
            "label": "Contact Numbers",
            "value": "+91 94470 12345 (Father) • Kochi / Hyderabad",
            "category": "contact"
          }
        ]
      },
      "girlSample": {
        "name": "Dr. Rachel Ann Fernandes",
        "title": "Pediatrician (MD Pediatrics) • MBBS, MD",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "21 Nov 1997 (28 Years) • 5 ft 5 in",
            "category": "personal"
          },
          {
            "label": "Denomination & Parish",
            "value": "Roman Catholic (Latin Rite) • Our Lady of Mount Carmel Church",
            "category": "personal"
          },
          {
            "label": "Diocese",
            "value": "Archdiocese of Bombay • Bandra West",
            "category": "horoscope"
          },
          {
            "label": "Faith & Character",
            "value": "Practicing Catholic • Sunday school instructor • Warm personality",
            "category": "horoscope"
          },
          {
            "label": "Education",
            "value": "MBBS (Seth GS Medical College - KEM Hospital), MD Pediatrics",
            "category": "education_career"
          },
          {
            "label": "Profession",
            "value": "Consultant Pediatrician, Lilavati Hospital Mumbai",
            "category": "education_career"
          },
          {
            "label": "Father & Mother",
            "value": "Dr. Anthony Fernandes (Surgeon) & Mrs. Celine Fernandes (Counselor)",
            "category": "family"
          },
          {
            "label": "Maternal Family",
            "value": "D’Souza family of Aldona, Goa",
            "category": "family"
          },
          {
            "label": "Parents Contact",
            "value": "+91 98201 23456 (Parents) • Bandra West, Mumbai",
            "category": "contact"
          }
        ]
      }
    },
    "faqs": [
      {
        "question": "Can I mention both my baptismal name and official name?",
        "answer": "Yes. You can write your official name and mention your baptismal name in brackets or under personal details."
      },
      {
        "question": "Is there space for Tharavadu / Family house name?",
        "answer": "Yes. Our Christian templates include dedicated fields for ancestral family name and maternal family roots, ideal for Catholic, Orthodox, and Mar Thoma families."
      },
      {
        "question": "Are cross emblems included on the document?",
        "answer": "Yes. You can choose templates with subtle cross emblems (✝) or select a clean modern layout without religious iconography."
      },
      {
        "question": "Is the PDF download free of charge?",
        "answer": "Yes. TrueMarriage provides free, unwatermarked PDF downloads for Christian marriage biodatas."
      }
    ],
    "relatedSlugs": [
      "free-marriage-biodata-maker",
      "marriage-biodata-format-for-boy-and-girl",
      "free-marriage-biodata-pdf",
      "how-to-make-biodata-for-marriage-online"
    ]
  },
  "sikh-marriage-biodata": {
    "slug": "sikh-marriage-biodata",
    "category": "religion",
    "primaryKeyword": "sikh marriage biodata",
    "title": "Sikh Marriage Biodata Maker | Anand Karaj Profile Templates",
    "description": "Create a Sikh marriage biodata for Anand Karaj. Dedicated sections for Amritdhari/Keshdhari status, Turban, Gotra/Clan, Nanake, and family roots. Free PDF.",
    "canonicalPath": "/biodata/sikh-marriage-biodata",
    "h1": "Sikh Marriage Biodata Maker (Anand Karaj Profile)",
    "nativeScript": "ੴ ਸਤਿਗੁਰ ਪ੍ਰਸਾਦਿ",
    "subheading": "Respectful Punjabi & Sikh matrimonial formats. Structured sections for Amritdhari status, Turban/Kesh, Gotra/Clan, Nanake-Dade roots, and family values.",
    "badge": "Anand Karaj Matrimony",
    "themeColor": "#D97706",
    "ctaText": "Create Sikh Biodata Free",
    "previewCtaText": "View Sikh Formats",
    "boyTabLabel": "Groom (Boy) Biodata",
    "girlTabLabel": "Bride (Girl) Biodata",
    "whySection": {
      "heading": "Why Sikh Families Look for Specific Cultural Details in Biodata",
      "intro": "Anand Karaj (the Sikh marriage ceremony) unites two souls in spiritual partnership before Sri Guru Granth Sahib Ji. Sikh families in Punjab and across the global diaspora prioritize religious lifestyle (Sikhi saroop), ancestral heritage (Dade and Nanake roots), and educational accomplishments.",
      "reasons": [
        {
          "title": "Sikhi Saroop & Lifestyle Transparency",
          "description": "Families seek upfront clarity on whether the groom is Turban-wearing (Pagg / Dastar), Keshdhari, Amritdhari, or clean-shaven (Trimmed), ensuring mutual comfort and spiritual compatibility."
        },
        {
          "title": "Both Dade and Nanake Lineage",
          "description": "Punjabi Sikh traditions value knowing both paternal roots (Dade - father's village and gotra) and maternal roots (Nanake - mother's ancestral village and gotra)."
        },
        {
          "title": "Education & Global Settlement Plans",
          "description": "With significant diaspora presence in Canada, UK, USA, Australia, and India, clear details on PR/citizenship status or relocation willingness help avoid future relocation dilemmas."
        },
        {
          "title": "Sacred Ik Onkar Header & Royal Punjabi Themes",
          "description": "Adorned with ੴ (Ik Onkar) calligraphy, royal saffron, and navy accents that reflect Sikh pride and family respect."
        }
      ]
    },
    "howSection": {
      "heading": "How to Create a Sikh Marriage Biodata",
      "intro": "Create an Anand Karaj matrimonial profile in four straightforward steps:",
      "workflowSteps": [
        {
          "stepNumber": 1,
          "title": "Select a Royal Sikh Motif",
          "description": "Choose an elegant layout featuring the Ik Onkar header, royal blue, or warm saffron gold borders."
        },
        {
          "stepNumber": 2,
          "title": "Enter Identity & Sikhi Details",
          "description": "Fill in full name, birth date, height, turban/Keshdhari status, gotra/clan, and personal lifestyle."
        },
        {
          "stepNumber": 3,
          "title": "Add Dade & Nanake Family Roots",
          "description": "Include education, profession, father's village and gotra, mother's village (Nanake), and siblings' marital status."
        },
        {
          "stepNumber": 4,
          "title": "Download Clean A4 PDF",
          "description": "Check your live preview and export a high-resolution, unwatermarked PDF ready for WhatsApp or family distribution."
        }
      ],
      "keyElementsToInclude": [
        "Full Name & Ik Onkar Header (ੴ)",
        "Date of Birth, Age & Height in feet/inches",
        "Sikhi Identity: Turban / Dastar, Keshdhari, Amritdhari, or Trimmed",
        "Education: Degrees, College & University",
        "Occupation: Company, Role, Annual Income & Work City / Country",
        "Immigration Status: Citizen / PR / Work Visa (if abroad)",
        "Gotra / Clan & Ancestral Village (Dade Pind)",
        "Mother's Maiden Gotra & Maternal Village (Nanake Pind)"
      ],
      "dosAndDonts": {
        "dos": [
          "Be completely clear about turban and beard status (Keshdhari / Trimmed).",
          "Mention both paternal village (Dade) and maternal village (Nanake).",
          "Specify current country of residence and visa/citizenship status if living abroad.",
          "Include a high-resolution, recent photo in formal or traditional attire."
        ],
        "donts": [
          "Do not mislead prospective matches regarding religious lifestyle or habits.",
          "Avoid group pictures where others have to be cropped out.",
          "Do not omit sibling marriage status.",
          "Avoid sharing personal identity card numbers."
        ]
      }
    },
    "whereSection": {
      "heading": "Where to Share Your Sikh Matrimonial Profile",
      "intro": "Share with prospective families and community matrimonial bureaus with complete confidence.",
      "useCases": [
        {
          "title": "Family WhatsApp Exchanges & Mediators (Vichole)",
          "description": "PDF preserves fonts and layout perfectly across Indian and international phone networks."
        },
        {
          "title": "Gurdwara Matrimonial Bureaus",
          "description": "Provide printed copies to local Gurdwara marriage coordinators."
        },
        {
          "title": "First Family Meetings (Roka / Milni talks)",
          "description": "Keep cleanly printed copies ready for visiting family elders."
        }
      ],
      "downloadAndShareDetails": "All generated files are saved in standard international A4 format (210 x 297 mm), 300 DPI vector quality without watermarks."
    },
    "sampleBiodatas": {
      "boySample": {
        "name": "Gurpreet Singh Sandhu",
        "title": "Senior Software Architect • B.Tech (PEC Chandigarh)",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "20 August 1995 (30 Years) • Height: 6 ft 0 in",
            "category": "personal"
          },
          {
            "label": "Sikhi Saroop",
            "value": "Turban-wearing (Pagg / Dastar), Keshdhari, Non-smoker, Vegetarian",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "B.Tech in Computer Science, PEC Chandigarh",
            "category": "education_career"
          },
          {
            "label": "Profession & Package",
            "value": "Staff Engineer, Amazon Gurugram • ₹35 LPA",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "S. Harbhajan Singh Sandhu (Chief Engineer, Punjab Irrigation - Retd.)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Sdn. Manjeet Kaur Sandhu (M.A., Retd. Principal)",
            "category": "family"
          },
          {
            "label": "Dade Pind & Gotra",
            "value": "Paternal Gotra: Sandhu • Pind: Patti, Tarn Taran, Punjab",
            "category": "horoscope"
          },
          {
            "label": "Nanake Pind & Gotra",
            "value": "Maternal Gotra: Dhillon • Pind: Butala, Amritsar",
            "category": "horoscope"
          },
          {
            "label": "Family Contact",
            "value": "+91 98140 12345 (Father) • Sector 34, Chandigarh",
            "category": "contact"
          }
        ]
      },
      "girlSample": {
        "name": "Jasleen Kaur Grewal",
        "title": "Chartered Accountant • B.Com (Hons), ACA",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "15 May 1998 (27 Years) • Height: 5 ft 6 in",
            "category": "personal"
          },
          {
            "label": "Religious Values",
            "value": "Sehajdhari Sikh • Regular Nitnem • Family-oriented and humble",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "B.Com (Hons) Shri Ram College of Commerce (SRCC), ICAI",
            "category": "education_career"
          },
          {
            "label": "Profession",
            "value": "Senior Financial Consultant, PwC Gurugram • ₹22 LPA",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "S. Kanwaljit Singh Grewal (Industrialist, Textiles)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Sdn. Gurmeet Kaur Grewal (M.Sc., Homemaker)",
            "category": "family"
          },
          {
            "label": "Dade Pind & Gotra",
            "value": "Paternal Gotra: Grewal • Ancestral Pind: Narangwal, Ludhiana",
            "category": "horoscope"
          },
          {
            "label": "Nanake Pind & Gotra",
            "value": "Maternal Gotra: Gill • Pind: Moga",
            "category": "horoscope"
          },
          {
            "label": "Parents Contact",
            "value": "+91 98720 98765 (Parents) • Model Town, Ludhiana",
            "category": "contact"
          }
        ]
      }
    },
    "faqs": [
      {
        "question": "Can I specify whether the groom ties a turban (Pagg)?",
        "answer": "Yes. Our Sikh templates include dedicated options for Turban-wearing (Pagg / Dastar), Keshdhari, Amritdhari, or Clean-shaven, ensuring complete transparency."
      },
      {
        "question": "Are both Dade and Nanake fields available?",
        "answer": "Yes. You can list both paternal family village & gotra (Dade) and maternal family village & gotra (Nanake)."
      },
      {
        "question": "Is the Ik Onkar symbol included?",
        "answer": "Yes. Authentic Ik Onkar (ੴ) calligraphy is featured prominently at the top of our Sikh templates."
      },
      {
        "question": "Is it completely free to download?",
        "answer": "Yes. TrueMarriage provides free PDF downloads with no watermarks and no hidden fees."
      }
    ],
    "relatedSlugs": [
      "free-marriage-biodata-maker",
      "marriage-biodata-format-for-boy-and-girl",
      "free-marriage-biodata-pdf",
      "how-to-make-biodata-for-marriage-online"
    ]
  },
  "jain-marriage-biodata": {
    "slug": "jain-marriage-biodata",
    "category": "religion",
    "primaryKeyword": "jain marriage biodata",
    "title": "Jain Marriage Biodata Maker | Shwetambar & Digambar Formats",
    "description": "Create an authentic Jain marriage biodata online. Dedicated sections for Sect (Shwetambar/Digambar), Gotra, 4-Gotra verification, food habits, and family. Free PDF.",
    "canonicalPath": "/biodata/jain-marriage-biodata",
    "h1": "Jain Marriage Biodata Maker",
    "nativeScript": "॥ ॐ श्री पार्श्वनाथाय नमः ॥",
    "subheading": "Respectful matrimonial formats tailored for Jain families. Dedicated sections for Sect, Gotra rules, strict vegetarian lifestyle, education, and family roots.",
    "badge": "Jain Matrimonial Profile",
    "themeColor": "#EA580C",
    "ctaText": "Create Jain Biodata Free",
    "previewCtaText": "View Jain Formats",
    "boyTabLabel": "Groom (Boy) Biodata",
    "girlTabLabel": "Bride (Girl) Biodata",
    "whySection": {
      "heading": "Why Jain Families Rely on Dedicated Community Matrimonial Formats",
      "intro": "In Jain community matchmaking, families seek alignment in philosophical values, Ahimsa dietary practices, community sects, and four-gotra lineage verification. A tailored Jain biodata communicates these traditions respectfully from the very first introduction.",
      "reasons": [
        {
          "title": "Sect & Sampradaya Alignment",
          "description": "Clear distinction between Digambar (Bispanthi, Terapanthi) and Shwetambar (Murtipujak, Sthanakvasi, Terapanthi) ensures religious harmony between the families."
        },
        {
          "title": "Four Gotra Verification (Char Gotra Pariksha)",
          "description": "Traditional Jain families verify four ancestral gotras—Self (Pita), Mother (Mata/Mama), Paternal Grandmother (Dadi), and Maternal Grandmother (Nani)—to avoid consanguinity."
        },
        {
          "title": "Dietary Lifestyle and Ahimsa Values",
          "description": "Highlighting strict vegetarianism, Chauvihar (eating before sunset), or avoidance of root vegetables (Kandmool) reflects commitment to Jain ethics."
        },
        {
          "title": "Auspicious Namokar Mantra Headers",
          "description": "Adorned with sacred Jain symbols—॥ ॐ श्री पार्श्वनाथाय नमः ॥ or the Jain symbol of Ahimsa—in royal gold and subtle vermilion borders."
        }
      ]
    },
    "howSection": {
      "heading": "How to Create a Jain Marriage Biodata",
      "intro": "Build a complete Jain matrimonial profile in four simple steps:",
      "workflowSteps": [
        {
          "stepNumber": 1,
          "title": "Select an Auspicious Jain Design",
          "description": "Choose an elegant design featuring the Ahimsa hand motif or sacred Namokar mantra headers."
        },
        {
          "stepNumber": 2,
          "title": "Enter Personal & Sect Information",
          "description": "Add full name, birth details, height, sect (Digambar / Shwetambar), gotra, and dietary preferences."
        },
        {
          "stepNumber": 3,
          "title": "Add Education, Business & Family Heritage",
          "description": "Detail education, family business/profession, parents' background, maternal uncle (Mama) details, and ancestral town."
        },
        {
          "stepNumber": 4,
          "title": "Download Free High-Res PDF",
          "description": "Review all names in live preview and export an unwatermarked A4 PDF ready for family sharing."
        }
      ],
      "keyElementsToInclude": [
        "Full Name & Sacred Header (॥ ॐ अर्हं नमः ॥)",
        "Date of Birth, Exact Birth Time & Place of Birth",
        "Height, Blood Group & Physical Demeanor",
        "Sect: Digambar / Shwetambar & Sub-sect (Terapanthi, Murtipujak, etc.)",
        "Gotra (Paternal) & Maternal Uncle's Gotra (Mosal / Nanihal)",
        "Education: Highest Qualifications & Universities",
        "Occupation: Family Business / Professional Job, Turnover & City",
        "Native Place (Mool Gaon) & Current City of Residence"
      ],
      "dosAndDonts": {
        "dos": [
          "State your sect and sub-sect clearly to avoid denominational confusion.",
          "Mention your native place (Mool Gaon) and Mama's surname.",
          "Be transparent about dietary practices and lifestyle preferences.",
          "Use a crisp, recent photograph in formal or traditional attire."
        ],
        "donts": [
          "Do not omit Gotra details if your community checks four gotras.",
          "Avoid casual cropped group photos or selfie pictures.",
          "Do not leave out siblings' marital status.",
          "Avoid adding confidential financial account or ID numbers."
        ]
      }
    },
    "whereSection": {
      "heading": "Where to Share Your Jain Matrimonial Profile",
      "intro": "Share with prospective families and community matrimonial bureaus with complete confidence.",
      "useCases": [
        {
          "title": "Family WhatsApp Exchanges & Relatives",
          "description": "Clean PDF layout opens immaculately on all mobile screens."
        },
        {
          "title": "Jain Samaj Yuvak-Yuvati Parichay Sammelans",
          "description": "Carry 3-4 printed copies for community matrimonial conventions."
        },
        {
          "title": "Formal Family Introductions at Home",
          "description": "Hand a crisp color printout to visiting guests during initial rishta talks."
        }
      ],
      "downloadAndShareDetails": "All generated files are saved in standard international A4 format (210 x 297 mm), 300 DPI vector quality without watermarks."
    },
    "sampleBiodatas": {
      "boySample": {
        "name": "Rishabh Kumar Jain",
        "title": "Fintech Co-Founder & Director • B.Tech, MBA",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "12 January 1995 (31 Years) • Height: 5 ft 10 in",
            "category": "personal"
          },
          {
            "label": "Sect & Sampradaya",
            "value": "Digambar Jain (Bispanthi) • Pure Vegetarian, Chauvihar preferred",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "B.Tech (NIT Jaipur), MBA in Finance (SPJIMR Mumbai)",
            "category": "education_career"
          },
          {
            "label": "Profession",
            "value": "Co-Founder & Director, Fintech Platform, Mumbai • ₹40 LPA",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "Shri Ashok Kumar Jain (Jewellery Manufacturer & Merchant)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Mrs. Anita Jain (Homemaker, Religious and Social Worker)",
            "category": "family"
          },
          {
            "label": "Four Gotras",
            "value": "Self: Kasliwal • Mama: Patni • Dadi: Sethi • Nani: Godha",
            "category": "horoscope"
          },
          {
            "label": "Mool Gaon",
            "value": "Mool Gaon: Sanganer, Jaipur • Current: Marine Drive, Mumbai",
            "category": "family"
          },
          {
            "label": "Family Contact",
            "value": "+91 98290 12345 (Father) • Mumbai / Jaipur",
            "category": "contact"
          }
        ]
      },
      "girlSample": {
        "name": "Riddhi Shwetambar Shah",
        "title": "Senior UI/UX Designer & Architect • B.Arch",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "09 April 1998 (28 Years) • Height: 5 ft 4 in",
            "category": "personal"
          },
          {
            "label": "Sect & Lifestyle",
            "value": "Shwetambar Murtipujak • Strict Vegetarian, respects Jain ethics",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "Bachelor of Architecture, CEPT University Ahmedabad",
            "category": "education_career"
          },
          {
            "label": "Profession",
            "value": "Design Lead, International Design Studio, Ahmedabad • ₹20 LPA",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "Shri Mahendra Shah (Chartered Accountant & Financial Advisor)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Mrs. Rekha Shah (M.A., Educator)",
            "category": "family"
          },
          {
            "label": "Gotra & Mosal",
            "value": "Paternal Gotra: Doshi • Mosal (Mama): Mehta (Bhavnagar)",
            "category": "horoscope"
          },
          {
            "label": "Mool Gaon",
            "value": "Palitana / Bhavnagar • Living in Navrangpura, Ahmedabad",
            "category": "family"
          },
          {
            "label": "Parents Contact",
            "value": "+91 98250 12345 (Parents) • Ahmedabad, Gujarat",
            "category": "contact"
          }
        ]
      }
    },
    "faqs": [
      {
        "question": "Can I mention both Digambar and Shwetambar sects?",
        "answer": "Yes. You can select your exact sect and sub-sect (such as Digambar Terapanthi or Shwetambar Murtipujak) from our options."
      },
      {
        "question": "Is there space to list maternal uncle (Mosal / Nanihal) gotra?",
        "answer": "Yes. Our Jain templates provide specific fields for Mama's surname, gotra, and native town to facilitate traditional four-gotra verification."
      },
      {
        "question": "Can dietary preferences like Chauvihar or vegetarianism be highlighted?",
        "answer": "Yes. You can note your lifestyle preferences under personal values."
      },
      {
        "question": "Is the Jain biodata download free?",
        "answer": "Yes. You can create, preview, and download your Jain marriage biodata PDF for free with no watermarks."
      }
    ],
    "relatedSlugs": [
      "free-marriage-biodata-maker",
      "marriage-biodata-format-for-boy-and-girl",
      "free-marriage-biodata-pdf",
      "how-to-make-biodata-for-marriage-online"
    ]
  },
  "buddhist-marriage-biodata": {
    "slug": "buddhist-marriage-biodata",
    "category": "religion",
    "primaryKeyword": "buddhist marriage biodata",
    "title": "Buddhist Marriage Biodata Maker | Ambedkarite & Navayana Formats",
    "description": "Create a dignified Buddhist marriage biodata online. Dedicated sections for Trisharan & Panchsheel, educational honors, social values, and family. Free PDF.",
    "canonicalPath": "/biodata/buddhist-marriage-biodata",
    "h1": "Buddhist Marriage Biodata Maker",
    "nativeScript": "॥ जय भीम ॥ नमो बुद्धाय ॥",
    "subheading": "Progressive, dignified matrimonial formats reflecting Buddhist philosophy. Clean sections for Panchsheel values, education, career, and family roots.",
    "badge": "Buddhist Matrimonial Profile",
    "themeColor": "#2563EB",
    "ctaText": "Create Buddhist Biodata Free",
    "previewCtaText": "View Buddhist Formats",
    "boyTabLabel": "Groom (Boy) Biodata",
    "girlTabLabel": "Bride (Girl) Biodata",
    "whySection": {
      "heading": "Why Buddhist Families Value Progressive, Value-Driven Matrimonial Formats",
      "intro": "Buddhist matrimonial traditions—particularly within the Ambedkarite and Navayana communities—are built upon principles of equality (Samata), education (Pradnya), and moral conduct (Sheel). Families seek matrimonial profiles that focus on intellectual accomplishments, ethical values, and social contribution rather than outdated dogma.",
      "reasons": [
        {
          "title": "Focus on Education and Professional Merit",
          "description": "Guided by Dr. B.R. Ambedkar's message of \"Educate, Agitate, Organize,\" families prioritize higher education, competitive achievements, and career stability."
        },
        {
          "title": "Observance of Trisharan and Panchsheel",
          "description": "Highlighting commitment to Buddhist precepts (Trisharan, Panchsheel, and Buddha Dhamma principles) reflects moral integrity and simple living."
        },
        {
          "title": "Freedom from Superstitions and Dowry",
          "description": "Buddhist biodatas avoid superstitious horoscope rituals, focusing instead on mutual respect, intellectual compatibility, and progressive family culture."
        },
        {
          "title": "Sacred Buddhist Symbols",
          "description": "Adorned with the Dhamma Chakra (Wheel of Law), lotus motifs, and the inspiring header ॥ जय भीम ॥ नमो बुद्धाय ॥."
        }
      ]
    },
    "howSection": {
      "heading": "How to Create a Buddhist Marriage Biodata",
      "intro": "Build your progressive matrimonial profile in four simple steps:",
      "workflowSteps": [
        {
          "stepNumber": 1,
          "title": "Choose a Dignified Buddhist Layout",
          "description": "Select a clean design with the Dhamma Chakra emblem, royal blue borders, or minimalist white styling."
        },
        {
          "stepNumber": 2,
          "title": "Enter Personal & Educational Credentials",
          "description": "Add full name, date of birth, height, educational degrees, university honors, and current profession."
        },
        {
          "stepNumber": 3,
          "title": "Add Family Roots & Social Commitment",
          "description": "Detail parents' occupations, siblings, native place/district, and involvement in community or social work."
        },
        {
          "stepNumber": 4,
          "title": "Download Free High-Res PDF",
          "description": "Preview your biodata and export a clean, unwatermarked PDF ready for immediate sharing."
        }
      ],
      "keyElementsToInclude": [
        "Full Name & Header (॥ जय भीम ॥ नमो बुद्धाय ॥)",
        "Date of Birth, Age & Height in feet/inches",
        "Education: Higher Degrees, Prestigious Colleges & Honors",
        "Occupation: Designation, Organization / Govt. Service & Work City",
        "Personal Values: Trisharan, Panchsheel & Social Commitment",
        "Native Place (Mool Gaon) & District",
        "Father's Profession & Mother's Background",
        "Brothers & Sisters (Education, Profession & Marital status)"
      ],
      "dosAndDonts": {
        "dos": [
          "Highlight educational milestones, degrees, and competitive exam achievements.",
          "State your native place and current working city clearly.",
          "Mention your involvement in social, cultural, or community welfare if active.",
          "Attach a clear, professional recent photograph."
        ],
        "donts": [
          "Do not include unverified horoscope or superstitious astrological claims.",
          "Avoid low-resolution selfies or casual cropped party pictures.",
          "Do not omit sibling education or career facts.",
          "Avoid sharing personal financial or government ID numbers."
        ]
      }
    },
    "whereSection": {
      "heading": "Where to Share Your Buddhist Matrimonial Profile",
      "intro": "Share with prospective families and community matrimonial bureaus with complete confidence.",
      "useCases": [
        {
          "title": "Family WhatsApp Exchanges & Relatives",
          "description": "Pristine PDF document opens cleanly across all Android and iOS smartphones."
        },
        {
          "title": "Buddhist Matrimonial Melas & Sammelans",
          "description": "Keep 3-4 printed copies ready for community parichay sammelans."
        },
        {
          "title": "In-Person Family Introductions",
          "description": "Hand a crisp color printout to visiting family members during home meetings."
        }
      ],
      "downloadAndShareDetails": "All generated files are saved in standard international A4 format (210 x 297 mm), 300 DPI vector quality without watermarks."
    },
    "sampleBiodatas": {
      "boySample": {
        "name": "Rahul Siddharth Kamble",
        "title": "Deputy General Manager (Civil Engineering) • B.E., M.Tech",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "14 April 1995 (30 Years) • Height: 5 ft 10 in",
            "category": "personal"
          },
          {
            "label": "Faith & Principles",
            "value": "Ambedkarite Buddhist (Navayana) • Follows Trisharan & Panchsheel",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "B.E. Civil (COEP Pune), M.Tech in Structural Engineering (IIT Bombay)",
            "category": "education_career"
          },
          {
            "label": "Profession",
            "value": "Deputy General Manager, Metro Rail Corporation • Class-1 Officer",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "Shri Siddharth Kamble (Retd. Executive Magistrate, Govt. of Maharashtra)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Mrs. Prabhavati Kamble (M.A. Sociology, Social Worker)",
            "category": "family"
          },
          {
            "label": "Native Roots",
            "value": "Mool Gaon: Kolhapur • Current: Baner, Pune",
            "category": "family"
          },
          {
            "label": "Social Values",
            "value": "Committed to social equality, scientific temperament, anti-dowry",
            "category": "horoscope"
          },
          {
            "label": "Primary Contact",
            "value": "+91 98220 54321 (Father / Candidate) • Pune, Maharashtra",
            "category": "contact"
          }
        ]
      },
      "girlSample": {
        "name": "Pradnya Gautami Meshram",
        "title": "Assistant Commissioner (State Tax) • M.Sc., Civil Services",
        "fields": [
          {
            "label": "Date of Birth",
            "value": "06 December 1997 (28 Years) • Height: 5 ft 5 in",
            "category": "personal"
          },
          {
            "label": "Philosophy",
            "value": "Buddhist • Dedicated to education, social upliftment & Panchsheel",
            "category": "personal"
          },
          {
            "label": "Education",
            "value": "M.Sc. Physics (Gold Medalist), Qualified State Civil Services Exam",
            "category": "education_career"
          },
          {
            "label": "Profession",
            "value": "Assistant Commissioner (State Tax), Finance Dept.",
            "category": "education_career"
          },
          {
            "label": "Father",
            "value": "Dr. Gautam Meshram (Professor & HOD, Govt. Medical College)",
            "category": "family"
          },
          {
            "label": "Mother",
            "value": "Mrs. Sujata Meshram (M.Ed., High School Vice-Principal)",
            "category": "family"
          },
          {
            "label": "Native District",
            "value": "Nagpur / Chandrapur • Current: Civil Lines, Nagpur",
            "category": "family"
          },
          {
            "label": "Family Values",
            "value": "Progressive, educated, simple Buddhist wedding ceremony",
            "category": "horoscope"
          },
          {
            "label": "Guardian Contact",
            "value": "+91 94221 87654 (Parents) • Nagpur, Maharashtra",
            "category": "contact"
          }
        ]
      }
    },
    "faqs": [
      {
        "question": "Is the Dhamma Chakra emblem included in the template?",
        "answer": "Yes. Our Buddhist templates feature the sacred Dhamma Chakra emblem and the header ॥ जय भीम ॥ नमो बुद्धाय ॥."
      },
      {
        "question": "Are superstitious or astrological fields removed?",
        "answer": "Yes. TrueMarriage Buddhist templates do not include horoscope, gun milan, or caste rituals, focusing entirely on educational, professional, and family merits."
      },
      {
        "question": "Can I highlight government service or competitive exam achievements?",
        "answer": "Yes. Dedicated sections allow you to clearly state government postings (UPSC, MPSC, Banking, PSU) or private sector accomplishments."
      },
      {
        "question": "Is the Buddhist biodata download free?",
        "answer": "Yes. You can generate and download your unwatermarked Buddhist marriage biodata PDF for free."
      }
    ],
    "relatedSlugs": [
      "free-marriage-biodata-maker",
      "marriage-biodata-format-for-boy-and-girl",
      "free-marriage-biodata-pdf",
      "how-to-make-biodata-for-marriage-online"
    ]
  }
};

export const ALL_SEO_SLUGS: string[] = Object.keys(SEO_LANDING_PAGES);
