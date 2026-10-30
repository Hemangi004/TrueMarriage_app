import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useBiodata } from "../../context/BiodataContext";
import { useAuth } from "../../context/AuthContext";
import { useI18n } from "../../context/I18nContext";
import { LanguageSelector } from "../common/LanguageSelector";
import { TrueMarriageLogo } from "../common/TrueMarriageLogo";
import { recordPremiumClickApi, recordFreeClickApi } from "../../services/adminUserAnalysisService";
import { SignOutConfirmModal } from "../modals/SignOutConfirmModal";
import { AppFooter } from "../common/AppFooter";
import { UserPillDropdown } from "../common/UserPillDropdown";
import {
  Sparkles,
  Heart,
  Download,
  QrCode,
  Globe,
  Cloud,
  Languages,
  Brain,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Menu,
  X,
  ArrowRight,
  Search,
  Zap,
} from "lucide-react";
import {
  type TemplateItem,
} from "../../services/templateService";
import { CURATED_LANDING_10_TEMPLATES } from "../../data/curatedLandingTemplates";
import {
  BiodataRenderer,
  DEFAULT_FEMALE_SAMPLE,
} from "../rendering/BiodataRenderer";
import { TEN_DUMMY_PROFILES } from "../../utils/dummyBiodataProfiles";
import { TemplatePreviewModal } from "../templates/TemplatePreviewModal";
import { FloatingPetals } from "./FloatingPetals";
import { TypewriterText } from "./TypewriterText";
const TYPEWRITER_WORDS_BY_LANG: Record<string, string[]> = {
  en: ["beautiful", "perfect", "unforgettable", "timeless", "soulful"],
  hi: ["सुंदर", "सच्चा", "खास", "अनमोल", "प्यारा"],
  mr: ["सुंदर", "उत्तम", "अविस्मरणीय", "अनमोल", "खास"],
  gu: ["સુંદર", "ઉત્તમ", "અવિસ્મરણીય", "અનમોલ", "પ્યારા"],
  bn: ["সুন্দর", "নিখুঁত", "অবিস্মরণীয়", "অনন্য", "প্রিয়"],
  ta: ["அழகான", "சிறந்த", "மறக்கமுடியாத", "அன்பான", "உண்மையான"],
  te: ["అందమైన", "సరైన", "మరువలేని", "అమూల్యమైన", "ప్రియమైన"],
  kn: ["ಸುಂದರ", "ಉತ್ತಮ", "ನೆನಪಿನಲ್ಲಿ ಉಳಿಯುವ", "ಅಮೂಲ್ಯ", "ಪ್ರೀತಿಯ"],
  ml: [
    "സുന്ദരമായ",
    "ഉത്തമമായ",
    "ഓർമ്മയിൽ നിൽക്കുന്ന",
    "അമൂല്യമായ",
    "സ്നേഹനിർഭരമായ",
  ],
  pa: ["ਸੋਹਣਾ", "ਸੱਚਾ", "ਖਾਸ", "ਅਣਮੁੱਲਾ", "ਪਿਆਰਾ"],
  or: ["ସୁନ୍ଦର", "ଉତ୍ତମ", "ଅବିସ୍ମରଣୀୟ", "ଅମୂଲ୍ୟ", "ପ୍ରିୟ"],
  as: ["সুন্দৰ", "উত্তম", "অবিস্মৰণীয়", "অনন্য", "মৰমৰ"],
  ur: ["خوبصورت", "بےمثال", "خاص", "انمول", "پیارا"],
};
import { HeroMarriageCardStack } from "./HeroMarriageCardStack";
import { MarriageScenes } from "./MarriageScenes";
// ── Reusable fade-in-up wrapper ─────────────────────────────────────────────
const FadeUp: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
// ── Explore by Community Ticker Bar (Image 1 style - Full Width) ─────────────
const communitiesList = [
  "Hindu",
  "Muslim",
  "Christian",
  "Jain",
  "Sikh",
  "Buddhist",
  "Parsi",
  "Jewish",
  "Marathi",
  "Gujarati",
  "South Indian",
  "Punjabi",
  "Bengali",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Odia",
  "Assamese",
  "Marwari",
  "Rajput",
  "Brahmin",
  "Agarwal",
  "Kayastha",
  "Sindhi",
  "All Communities Welcome",
];
const CommunityExploreBar: React.FC<{ onExploreAll?: () => void }> = ({
  onExploreAll,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className="w-full my-1 relative z-10 select-none">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
        className="w-full overflow-hidden bg-gradient-to-r from-pink-50/95 via-white to-rose-50/95 border-y border-pink-200/90 py-2.5 sm:py-3.5 px-2.5 sm:px-8 backdrop-blur-md shadow-xs flex items-center justify-between"
      >
        {/* ── Left: Botanical Branch & Title ── */}
        <div className="flex items-center shrink-0 z-20 bg-gradient-to-r from-pink-50 via-pink-50/90 to-transparent pr-1.5 sm:pr-4">
          {/* Pink Botanical Leaf SVG */}
          <svg
            width="18"
            height="24"
            viewBox="0 0 24 32"
            fill="none"
            className="mr-1.5 sm:mr-2.5 text-[#F01472] shrink-0"
          >
            <path
              d="M12 30 C12 20 6 12 2 8 C8 8 14 12 14 20"
              stroke="#F01472"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M12 24 C14 18 20 14 22 10 C18 10 14 14 13 20"
              stroke="#F01472"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M12 16 C10 10 6 6 3 2 C8 3 11 8 12 12"
              stroke="#FB7185"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <div className="flex flex-col text-left leading-tight">
            <span className="hidden sm:inline text-[10px] sm:text-[11px] font-[450] text-gray-700 tracking-wide">
              Explore by
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#F01472] tracking-wide">
              Community
            </span>
          </div>
          {/* Vertical Divider */}
          <div className="h-5 sm:h-7 w-px bg-pink-200 ml-2 sm:ml-4 mr-1" />
        </div>
        {/* ── Center: Infinite Scrolling Marquee ── */}
        <div className="relative flex-1 overflow-hidden mx-1.5 sm:mx-3">
          {/* Edge fade masks */}
          <div className="absolute left-0 inset-y-0 w-3 sm:w-10 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 inset-y-0 w-3 sm:w-10 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          <motion.div
            className="flex items-center gap-4 sm:gap-7 whitespace-nowrap"
            animate={{ x: isHovered ? undefined : ["0%", "-50%"] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            {[...communitiesList, ...communitiesList].map((comm, idx) => (
              <div key={idx} className="inline-flex items-center gap-3 sm:gap-6">
                <span className="text-xs sm:text-sm font-[450] text-[#1e1b4b] hover:text-[#F01472] transition-colors cursor-pointer">
                  {comm}
                </span>
                {/* Pink 4-Petal Flower Divider */}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="#F01472"
                  className="opacity-75 shrink-0"
                >
                  <circle cx="8" cy="4" r="2.8" />
                  <circle cx="8" cy="12" r="2.8" />
                  <circle cx="4" cy="8" r="2.8" />
                  <circle cx="12" cy="8" r="2.8" />
                  <circle cx="8" cy="8" r="1.4" fill="#FFE4E6" />
                </svg>
              </div>
            ))}
          </motion.div>
        </div>
        {/* ── Right: All Communities Action Link ── */}
        <div className="flex items-center shrink-0 z-20 pl-1.5 sm:pl-4 bg-gradient-to-l from-rose-50 via-rose-50/90 to-transparent">
          {/* Vertical Divider */}
          <div className="h-5 sm:h-7 w-px bg-pink-200 mr-2 sm:mr-4 ml-0 sm:ml-1" />
          <button
            onClick={onExploreAll}
            className="group inline-flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-[450] text-[#F01472] hover:text-[#C80E5A] hover:translate-x-0.5 transition-all whitespace-nowrap cursor-pointer"
          >
            <span className="hidden sm:inline">All Communities</span>
            <span className="sm:hidden font-medium">All</span>
            <ArrowRight
              size={13}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </div>
  );
};


interface LandingTemplateCardProps {
  tpl: any;
  index: number;
  onPreview: () => void;
}

const LandingTemplateCard: React.FC<LandingTemplateCardProps> = ({
  tpl,
  index,
  onPreview,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.35);

  useEffect(() => {
    if (!cardRef.current) return;
    const updateSize = () => {
      if (cardRef.current) {
        const width = cardRef.current.clientWidth;
        if (width > 0) {
          setScale(width / 794);
        }
      }
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(cardRef.current);
    return () => ro.disconnect();
  }, []);

  const displayIndex = String(index + 1).padStart(2, "0");
  const isPremium = tpl.pricing_type === "PREMIUM";
  const dummyIdx =
    typeof tpl.dummy_index === "number" ? tpl.dummy_index : index;
  const sampleProfile =
    TEN_DUMMY_PROFILES[dummyIdx % TEN_DUMMY_PROFILES.length]?.data ||
    DEFAULT_FEMALE_SAMPLE;

  const resolvedLayout = tpl.layout_json || {
    page: {
      width: 794,
      height: 1123,
      padding: 32,
      background: tpl.default_bg || "#FFFDF5",
      fontFamily: tpl.font_family || "Playfair Display",
    },
    elements: [],
  };

  return (
    <div
      ref={cardRef}
      data-template-card
      className="shrink-0 w-full sm:w-[calc((100%-1.25rem)/2)] md:w-[calc((100%-2*1.25rem)/3)] xl:w-[calc((100%-3*1.25rem)/4)] aspect-[1/1.414] bg-white rounded-2xl sm:rounded-3xl shadow-md hover:shadow-xl border border-pink-100/90 overflow-hidden relative group select-none transition-all duration-300 snap-start cursor-pointer flex items-start justify-center"
      onClick={onPreview}
    >
      {/* Top-Left Badge */}
      <div className="absolute top-3.5 left-3.5 z-20 pointer-events-none">
        <span className="bg-white/95 backdrop-blur-sm text-gray-800 text-xs sm:text-sm font-bold px-3 py-1 rounded-md border border-gray-200/90 shadow-xs">
          #{displayIndex}
        </span>
      </div>

      {/* Top-Right Pricing Badge */}
      <div className="absolute top-3.5 right-3.5 z-20 pointer-events-none">
        <span
          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs ${
            isPremium
              ? "bg-amber-500 text-white"
              : "bg-emerald-500 text-white"
          }`}
        >
          {isPremium ? "PRO" : "FREE"}
        </span>
      </div>

      {/* Dynamic Biodata Canvas Preview */}
      <div className="w-full h-full flex items-start justify-center overflow-hidden pointer-events-none select-none relative group-hover:scale-105 transition-transform duration-500">
        <BiodataRenderer
          layoutJson={resolvedLayout}
          data={sampleProfile}
          scale={scale}
        />
      </div>

      {/* Bottom Name Pill */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-7 z-15 flex items-center justify-between text-white pointer-events-none">
        <div className="flex items-center gap-1.5 text-xs font-medium truncate">
          <span>{tpl.preview_icon || "📄"}</span>
          <span className="truncate">{tpl.name}</span>
        </div>
        <span className="text-[10px] text-pink-200 font-semibold px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-xs">
          {tpl.categories?.[0]?.name || "Modern"}
        </span>
      </div>
    </div>
  );
};

export const LandingPage: React.FC<{
  onOpenLogin?: () => void;
  onOpenRegister?: () => void;
}> = ({ onOpenLogin, onOpenRegister }) => {
  const { goToWizard, goToDiscovery, goToTemplates } = useBiodata();
  const {
    user,
    isAuthenticated,
    logout,
    openLogin,
    openRegister,
    requireAuth,
    openPremiumCheckout,
  } = useAuth();
  const { t, lang } = useI18n();
  const navigate = useNavigate();

  // If already authenticated, redirect away from the landing page
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/discover', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateItem | null>(
    null,
  );
  const [selectedTemplateCategory, setSelectedTemplateCategory] =
    useState<string>("All");
  const displayTemplates = useMemo(() => {
    if (selectedTemplateCategory.toLowerCase() === "all") {
      return CURATED_LANDING_10_TEMPLATES;
    }
    const target = selectedTemplateCategory.toLowerCase();
    return CURATED_LANDING_10_TEMPLATES.filter((tpl) => {
      if (!tpl.categories || !Array.isArray(tpl.categories)) return false;
      return tpl.categories.some((cat: any) => {
        const cSlug = (cat.slug || "").toLowerCase();
        const cId = (cat.id || "").toLowerCase();
        const cName = (cat.name || "").toLowerCase();
        return (
          cSlug === target ||
          cId === target ||
          cName === target ||
          cSlug.includes(target) ||
          target.includes(cSlug) ||
          (target === "royal" &&
            (cSlug.includes("royal") || cName.includes("royal"))) ||
          (target === "traditional" &&
            (cSlug.includes("traditional") || cName.includes("traditional")))
        );
      });
    });
  }, [selectedTemplateCategory]);
  const handleCategoryClick = (categoryLabel: string) => {
    setSelectedTemplateCategory(categoryLabel);
    setCurrentCarouselIndex(0);
    if (carouselContainerRef.current) {
      carouselContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activePricing, setActivePricing] = useState(1);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showFreeTrialModal, setShowFreeTrialModal] = useState(false);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const getCarouselStep = () => {
    if (!carouselContainerRef.current) return 320;
    const container = carouselContainerRef.current;
    const card = container.querySelector("[data-template-card]") as HTMLElement;
    if (!card) return 320;
    const style = window.getComputedStyle(container);
    const gap = parseFloat(style.columnGap || style.gap || "20") || 20;
    return card.offsetWidth + gap;
  };
  // Auto horizontal scroll every 2.5 seconds
  useEffect(() => {
    if (isCarouselHovered) return;
    if (displayTemplates.length <= 1) return;
    const interval = setInterval(() => {
      if (!carouselContainerRef.current) return;
      const container = carouselContainerRef.current;
      const step = getCarouselStep();
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScroll - 10) {
        container.scrollTo({ left: 0, behavior: "smooth" });
        setCurrentCarouselIndex(0);
      } else {
        const nextLeft = container.scrollLeft + step;
        container.scrollTo({ left: nextLeft, behavior: "smooth" });
        setCurrentCarouselIndex(
          (prev) => (prev + 1) % (displayTemplates.length || 1),
        );
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [isCarouselHovered, displayTemplates.length]);
  const scrollCarouselPrev = () => {
    if (!carouselContainerRef.current) return;
    const container = carouselContainerRef.current;
    const step = getCarouselStep();
    const nextLeft = Math.max(0, container.scrollLeft - step);
    container.scrollTo({ left: nextLeft, behavior: "smooth" });
  };
  const scrollCarouselNext = () => {
    if (!carouselContainerRef.current) return;
    const container = carouselContainerRef.current;
    const step = getCarouselStep();
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (container.scrollLeft >= maxScroll - 10) {
      container.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      container.scrollTo({
        left: container.scrollLeft + step,
        behavior: "smooth",
      });
    }
  };
  const handleCarouselScroll = () => {
    if (!carouselContainerRef.current) return;
    const container = carouselContainerRef.current;
    const step = getCarouselStep();
    const maxIdx = Math.max(0, displayTemplates.length - 1);
    const idx = Math.min(
      maxIdx,
      Math.max(0, Math.round(container.scrollLeft / step)),
    );
    setCurrentCarouselIndex(idx);
  };
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const featureGridItems = [
    {
      icon: <Brain size={19} />,
      title: t("AI Content Writing"),
      desc: t(
        "Let AI write your bio, interests, and family intro professionally",
      ),
      iconBg: "bg-[#F5F0FF] text-[#8B5CF6] border border-[#EDE4FF]",
    },
    {
      icon: <Languages size={19} />,
      title: t("Multiple Languages"),
      desc: t(
        "Translate entire biodata into 10+ Indian languages in one click",
      ),
      iconBg: "bg-[#E6FAF7] text-[#0D9488] border border-[#CCF4EE]",
    },
    {
      icon: <Download size={19} />,
      title: t("PDF Download"),
      desc: t("High-res A4 PDF, print-ready with optional password protection"),
      iconBg: "bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]",
    },
    {
      icon: <QrCode size={19} />,
      title: t("QR Code & Sharing"),
      desc: t(
        "Auto-generate QR code that opens online profile; track scans easily",
      ),
      iconBg: "bg-[#ECFDF3] text-[#16A34A] border border-[#D1FADF]",
    },
    {
      icon: <Globe size={19} />,
      title: t("Online Profile URL"),
      desc: t(
        "Unique link like truemarriage.in/profile/your-name —” SEO optimized",
      ),
      iconBg: "bg-[#FFF6ED] text-[#EA580C] border border-[#FFE6D5]",
    },
    {
      icon: <Cloud size={19} />,
      title: t("Cloud Backup"),
      desc: t(
        "All biodata safely stored in cloud —” access anytime from any device",
      ),
      iconBg: "bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]",
    },
  ];
  const freePlanFeatures = [
    t("Create up to 3 Biodatas"),
    t("Access to Free Templates"),
    t("Standard PDF Download (with Watermark)"),
    t("Basic AI Writing Assistance"),
    t("Basic Colors & Fonts"),
    t("Shareable Biodata Profile"),
    t("QR Code Sharing"),
    t("Secure Cloud Saving"),
  ];
  const premiumFeatures = [
    t("Unlimited Biodata Creation"),
    t("50+ Premium Templates"),
    t("HD PDF Download (No Watermark)"),
    t("Full AI Writing & Grammar Helper"),
    t("Custom Colors & Fonts"),
    t("Online Shareable Profile & QR Code"),
    t("All Regional Languages Support"),
    t("Cloud Backup & Priority Support"),
  ];
  const pricingPlans = [
    {
      name: t("Free"),
      price: "₹0",
      period: "",
      borderColor: "border-pink-200/90",
      badge: t("Free"),
      features: freePlanFeatures,
      cta: t("Get Started"),
      subCta: "",
      ctaBg:
        "bg-white hover:bg-pink-50 border-2 border-pink-200/90 text-gray-800 font-semibold shadow-xs",
    },
    {
      name: t("Premium"),
      price: "₹0",
      period: t("for 30 days (then ₹299/mo)"),
      borderColor: "border-[#F01472]",
      badge: t("30-Day Free Trial"),
      features: [
        t("30-Day 100% Free Trial (₹0 Today)"),
        ...premiumFeatures,
      ],
      cta: t("Start 30-Day Free Trial"),
      subCta: t("₹0 charged today • Cancel anytime"),
      ctaBg:
        "bg-gradient-to-r from-[#F01472] to-[#E11D48] text-white hover:brightness-105 shadow-lg shadow-pink-400/40 font-semibold",
    },
  ];
  const navLinks = [
    { label: t("Features"), href: "#features" },
    { label: t("Biodata Maker"), href: "#templates" },
    { label: t("Pricing"), href: "#pricing" },
  ];
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      const navHeight = 88; // fixed navbar height (~h-20 sm:h-24)
      const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };
  return (
    <div className="min-h-screen bg-[#FFFDFE] text-gray-800 overflow-x-hidden font-sans relative">
      {/* ── Floating Background Petals & Sparkling Particles ──────────── */}
      <FloatingPetals />
      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-xs border-b border-pink-100/80"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 sm:h-24 flex items-center justify-between relative">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer group hover:opacity-95 transition-opacity py-1.5"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <TrueMarriageLogo variant="horizontal" size="md" />
          </div>
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2 gap-6">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="text-sm font-[450] text-gray-600 hover:text-[#F01472] transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSelector />
            {isAuthenticated && user ? (
              <>
                <UserPillDropdown />
                <button
                  type="button"
                  onClick={goToDiscovery}
                  className="px-4 py-2 rounded-full text-xs font-[450] text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer flex items-center gap-1"
                >
                  <Search size={13} /> Discover
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    if (openLogin) openLogin();
                    else if (onOpenLogin) onOpenLogin();
                  }}
                  className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-[450] text-white bg-gradient-to-r from-[#F01472] to-[#E11D48] hover:from-[#E00A63] hover:to-[#BE123C] shadow-md shadow-pink-400/30 hover:shadow-lg hover:shadow-pink-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Heart size={14} className="fill-white" />
                  {t("Login")}
                </button>
              </>
            )}
          </div>
          {/* Mobile Actions & Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSelector />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl hover:bg-pink-50 transition-colors cursor-pointer text-gray-700"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 backdrop-blur-md border-b border-pink-100 px-5 pb-4 space-y-1"
            >
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-[450] text-gray-700 hover:bg-pink-50 hover:text-[#F01472] transition-colors cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-2 flex flex-col gap-2">
                {isAuthenticated && user ? (
                  <>
                    <UserPillDropdown
                      className="w-full"
                      pillClassName="w-full justify-between py-2"
                      dropdownClassName="w-full left-0 right-0"
                      align="left"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        goToDiscovery();
                      }}
                      className="w-full py-2.5 rounded-xl text-sm font-[450] bg-slate-100 text-slate-800 cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Search size={14} /> Discover Matches
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (openLogin) openLogin();
                        else if (onOpenLogin) onOpenLogin();
                      }}
                      className="flex-1 py-2.5 rounded-xl text-sm font-[450] text-white bg-gradient-to-r from-[#F01472] to-[#E11D48] shadow-md shadow-pink-400/30 hover:from-[#E00A63] hover:to-[#BE123C] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Heart size={14} className="fill-white" />
                      {t("Login")}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      {/* ── Hero Section (Image 2 style with typing graphics & interactive card stack) ── */}
      <section className="relative pt-20 sm:pt-24 lg:pt-28 pb-12 sm:pb-16 overflow-hidden">
        {/* Soft Radial Ambient Lighting */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-24 w-[520px] h-[520px] bg-gradient-to-br from-pink-200/40 to-rose-100/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-32 w-[420px] h-[420px] bg-gradient-to-tr from-purple-200/30 to-pink-100/30 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-[340px] h-[340px] bg-fuchsia-100/40 rounded-full blur-2xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-6 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Copy & Typing Heading */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Top Pill / Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100/70 border border-pink-200/80 text-[#F01472] text-xs font-[450]"
            >
              <Heart size={13} className="fill-[#F01472]" />
              <span className="tracking-wide text-[11px] font-medium">
                {t("Real People, Real Stories, Real Together")}
              </span>
              <Heart size={13} className="fill-[#F01472]" />
            </motion.div>
            {/* Main Headline with Dynamic Typing Graphics (Strictly font weight <= 475) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-3xl sm:text-4xl lg:text-[54px] font-[450] text-[#1e1b4b] leading-[1.14] sm:leading-[1.12] tracking-tight">
                {t("Your story deserves a")} <br className="hidden sm:inline" />
                {t("partner as")}{" "}
                <TypewriterText
                  words={
                    TYPEWRITER_WORDS_BY_LANG[lang] ||
                    TYPEWRITER_WORDS_BY_LANG.en
                  }
                  lang={lang}
                />{" "}
                <br className="hidden sm:inline" />
                {t("as you.")}
              </h1>
            </motion.div>
            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-gray-500 font-[400] leading-relaxed max-w-xl"
            >
              {t(
                "Thoughtful matchmaking for meaningful relationships. Discover compatible profiles, share your story, and take the first step toward finding your life partner.",
              )}
            </motion.p>
            {/* CTA Buttons (Image 2 style) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 w-full sm:w-auto"
            >
              <button
                onClick={() =>
                  requireAuth(
                    () => goToWizard(),
                    t("Please log in to create your matrimonial biodata.")
                  )
                }
                className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm sm:text-base font-[450] text-white bg-gradient-to-r from-[#F01472] to-[#E11D48] hover:from-[#E00A63] hover:to-[#BE123C] shadow-lg shadow-pink-400/40 hover:shadow-xl hover:shadow-pink-500/50 hover:scale-[1.02] sm:hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer w-full sm:w-auto text-center"
              >
                <Heart size={16} className="fill-white shrink-0" />
                <span>{t("Create My Profile")}</span>
              </button>
              <button
                onClick={() => {
                  sessionStorage.setItem(
                    "tm_post_login_redirect",
                    "/biodata-maker",
                  );
                  requireAuth(() => goToTemplates());
                }}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-sm sm:text-base font-[450] text-gray-700 bg-white/90 backdrop-blur-xs border border-pink-200 hover:border-pink-400 hover:text-[#F01472] hover:shadow-md hover:scale-[1.01] sm:hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer w-full sm:w-auto text-center"
              >
                {t("Explore Matches & Templates")}
              </button>
            </motion.div>
          </div>
          {/* Right: Interactive 3D Marriage Card Scene (Image 2 style) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative py-6 lg:py-0">
            <HeroMarriageCardStack
              onOpenRegister={onOpenRegister}
              onExploreMatches={() => {
                sessionStorage.setItem("tm_post_login_redirect", "/discover");
                requireAuth(() => goToDiscovery());
              }}
            />
          </div>
        </div>
      </section>
      {/* ── Community Explore Ticker Bar (Image 1 style) ────────────────── */}
      <CommunityExploreBar
        onExploreAll={() => {
          sessionStorage.setItem("tm_post_login_redirect", "/biodata-maker");
          requireAuth(() => goToTemplates());
        }}
      />
      {/* ── 4 Themed Rich Scenes (from Image 2) ─────────────────────────── */}
      <MarriageScenes
        onOpenWizard={() => {
          sessionStorage.setItem("tm_post_login_redirect", "/wizard");
          requireAuth(() => goToWizard(), t("Please log in to create your matrimonial biodata."));
        }}
        onOpenRegister={openRegister || onOpenRegister}
        onOpenTemplates={() => {
          sessionStorage.setItem("tm_post_login_redirect", "/biodata-maker");
          requireAuth(() => goToTemplates(), t("Please log in to create your matrimonial biodata."));
        }}
      />
      {/* ── Template Gallery (100+ Handcrafted Templates) ────────────────── */}
      <section
        id="templates"
        className="py-6 sm:py-8 lg:py-10 bg-[#FFFDFE] relative overflow-hidden"
      >
        {/* Ambient Side Doodles & Decorative Accents (Image 2 style) */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 sm:w-48 pointer-events-none opacity-40 select-none z-0">
          <svg
            viewBox="0 0 160 320"
            fill="none"
            className="w-full h-auto text-pink-300"
          >
            <path
              d="M10 40 C40 80, 20 140, 60 180 C90 210, 30 260, 10 300"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <path
              d="M25 90 C35 80, 50 85, 45 100 C40 115, 20 110, 25 90 Z"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              d="M35 120 C50 115, 60 130, 45 140 C30 150, 25 130, 35 120 Z"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <circle cx="70" cy="70" r="3" fill="#F01472" fillOpacity="0.4" />
            <circle cx="85" cy="220" r="2.5" fill="#F01472" fillOpacity="0.3" />
            <path
              d="M75 140 L79 148 L87 152 L79 156 L75 164 L71 156 L63 152 L71 148 Z"
              fill="#F01472"
              fillOpacity="0.25"
            />
          </svg>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 sm:w-48 pointer-events-none opacity-40 select-none z-0">
          <svg
            viewBox="0 0 160 320"
            fill="none"
            className="w-full h-auto text-pink-300"
          >
            <path
              d="M150 50 C110 90, 140 160, 90 200 C60 230, 120 280, 150 310"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <path
              d="M110 90 L113 97 L120 100 L113 103 L110 110 L107 103 L100 100 L107 97 Z"
              fill="#F01472"
              fillOpacity="0.3"
            />
            <path
              d="M90 240 L92 245 L97 247 L92 249 L90 254 L88 249 L83 247 L88 245 Z"
              fill="#F01472"
              fillOpacity="0.25"
            />
            <circle cx="80" cy="130" r="3" fill="#F01472" fillOpacity="0.35" />
          </svg>
        </div>
        <div className="max-w-[1440px] 2xl:max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-10 relative z-10">
          {/* Header Title & Subtitle */}
          <FadeUp className="text-center mb-3 sm:mb-4">
            <h2 className="text-2xl sm:text-3xl font-[450] text-[#1e1b4b] mb-1 tracking-tight">
              {t("100+ Handcrafted Templates")}
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-xs sm:text-[13px] font-[400] leading-normal">
              {t(
                "Beautifully designed biodata templates for every community, culture, and personal style.",
              )}
            </p>
          </FadeUp>
          {/* Filter Pills with Icons (Interactive Category Filters) */}
          <FadeUp
            delay={0.1}
            className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 mb-4 sm:mb-5"
          >
            {[
              { label: "All", icon: "" },
              { label: "Traditional", icon: "🛡️" },
              { label: "Modern", icon: "✨" },
              { label: "Royal", icon: "🏛️" },
              { label: "Floral", icon: "🌸" },
            ].map(({ label, icon }) => {
              const isSelected =
                selectedTemplateCategory.toLowerCase() === label.toLowerCase();
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleCategoryClick(label)}
                  aria-pressed={isSelected}
                  className={`px-4 sm:px-4.5 py-1.5 rounded-full text-xs sm:text-sm font-[450] flex items-center gap-1.5 shadow-2xs select-none transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-[#F01472] text-white shadow-md shadow-pink-300/40 border border-transparent scale-105"
                      : "bg-white text-gray-700 hover:text-[#F01472] hover:border-pink-300 hover:bg-pink-50/50 border border-gray-200/90 active:scale-95"
                  }`}
                >
                  {icon && <span className="text-xs sm:text-sm">{icon}</span>}
                  <span>{t(label)}</span>
                </button>
              );
            })}
          </FadeUp>
          {/* Horizontal Auto-Scrolling Template Carousel (2s Interval, matching screenshot) */}
          <div className="relative w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 z-10">
            {/* Left Arrow Button (dark circle with white chevron) */}
            <button
              onClick={scrollCarouselPrev}
              className="absolute -left-2 sm:left-0 lg:-left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-sm transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Previous Template"
            >
              <ChevronLeft size={26} className="sm:w-7 sm:h-7" />
            </button>
            {/* Right Arrow Button (dark circle with white chevron) */}
            <button
              onClick={scrollCarouselNext}
              className="absolute -right-2 sm:right-0 lg:-right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-sm transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Next Template"
            >
              <ChevronRight size={26} className="sm:w-7 sm:h-7" />
            </button>
            {/* Carousel Track */}
            {displayTemplates.length === 0 ? (
              <div className="text-center py-12 px-4 bg-pink-50/50 rounded-3xl border border-pink-100 my-4">
                <Sparkles className="w-10 h-10 text-[#F01472] mx-auto mb-3 animate-pulse" />
                <h3 className="text-base font-semibold text-gray-800 mb-1">
                  {t("No templates found in this category")}
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  {t(
                    "Try selecting another category or view our complete collection.",
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => handleCategoryClick("All")}
                  className="px-5 py-2 rounded-full bg-[#F01472] text-white text-xs font-semibold hover:bg-[#C80E5A] transition shadow-md cursor-pointer"
                >
                  {t("Show All Templates")}
                </button>
              </div>
            ) : (
              <div
                ref={carouselContainerRef}
                onScroll={handleCarouselScroll}
                onMouseEnter={() => setIsCarouselHovered(true)}
                onMouseLeave={() => setIsCarouselHovered(false)}
                className="flex items-center gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-3 px-1 select-none"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {displayTemplates.slice(0, 10).map((tpl, i) => {
                  const dummyIdx =
                    typeof tpl.dummy_index === "number" ? tpl.dummy_index : i;
                  return (
                    <LandingTemplateCard
                      key={tpl.id || tpl.name + i}
                      tpl={tpl}
                      index={i}
                      onPreview={() =>
                        setPreviewTemplate({
                          ...tpl,
                          selectedDummyIndex: dummyIdx,
                        } as any)
                      }
                    />
                  );
                })}
              </div>
            )}
            {/* Slider Dots at Bottom matching screenshot */}
            {displayTemplates.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-5 sm:mt-6">
                {displayTemplates.slice(0, 10).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (!carouselContainerRef.current) return;
                      const container = carouselContainerRef.current;
                      const step = getCarouselStep();
                      container.scrollTo({
                        left: idx * step,
                        behavior: "smooth",
                      });
                      setCurrentCarouselIndex(idx);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      currentCarouselIndex === idx
                        ? "w-7 bg-[#F01472] shadow-sm shadow-pink-400/50"
                        : "w-2 bg-pink-200 hover:bg-pink-300"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
          {/* View All Button */}
          <FadeUp className="text-center mt-5 sm:mt-6">
            <button
              onClick={() => {
                sessionStorage.setItem("tm_post_login_redirect", "/biodata-maker");
                requireAuth(() => goToTemplates());
              }}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#F01472] hover:bg-[#C80E5A] hover:shadow-lg hover:shadow-pink-400/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shadow-md"
            >
              <span>{t("View All 100+ Templates")}</span>
              <ChevronRight size={15} />
            </button>
          </FadeUp>
        </div>
      </section>
      {/* ── Advanced USPs (Bento Grid) ──────────────────────────────────── */}
      <section id="features" className="pt-16 pb-20 sm:pb-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <FadeUp className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-[450] text-[#1e1b4b] mb-4 tracking-tight">
              {t("Features You Won't")} <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #F01472 0%, #C80E5A 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {t("Find Anywhere Else")}
              </span>
            </h2>
          </FadeUp>
          {/* Featured Spotlight: AI Compatibility Score */}
          <FadeUp delay={0.05} className="mb-6">
            <motion.div
              whileHover={{ scale: 1.01, y: -2 }}
              className="relative bg-[#F2ECFD] rounded-[24px] sm:rounded-3xl p-6 sm:p-8 overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300 shadow-2xs hover:shadow-md border border-white/60"
            >
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#DDD6FE] rounded-full blur-2xl pointer-events-none opacity-80" />
              <div className="flex items-center gap-4 sm:gap-5 relative z-10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white text-[#8B5CF6] shadow-xs border border-white/90 flex items-center justify-center shrink-0">
                  <Brain size={26} />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-100/80 text-[#8B5CF6] text-xs font-semibold mb-1">
                    <Sparkles size={11} />
                    <span>{t("AI Powered")}</span>
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl text-[#1e1b4b]">
                    {t("AI Compatibility Score")}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-0.5 max-w-2xl leading-relaxed">
                    {t(
                      "Compare two biodatas and get an AI-powered match percentage based on shared values, lifestyle, and astrological alignment.",
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          </FadeUp>
          {/* Core Features Grid (3 columns x 2 rows = 6 balanced cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {featureGridItems.map((item, i) => (
              <FadeUp key={item.title} delay={i * 0.05}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl p-5 border border-gray-100/90 shadow-2xs hover:shadow-md transition-all duration-300 flex items-start gap-4 h-full"
                >
                  <div
                    className={`w-11 h-11 rounded-2xl ${item.iconBg} flex items-center justify-center shrink-0 shadow-2xs`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-[475] text-sm text-[#1e1b4b] mb-0.5">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 font-normal leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
      {/* ── Pricing Plans (Light Pink & Pastel Theme) ────────────────────────── */}
      <section
        id="pricing"
        className="py-8 sm:py-10 lg:py-12 min-h-[calc(100vh-4.5rem)] flex flex-col justify-center bg-gradient-to-b from-[#FFF5F8] via-[#FFEAF2] to-[#FFF0F6] relative overflow-hidden text-gray-800"
      >
        {/* Ambient Warm Pastel Glows */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-pink-300/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 w-full">
          <FadeUp className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 bg-pink-100/80 border border-pink-200/90 rounded-full px-3.5 py-1 text-xs font-[450] text-[#F01472] mb-2.5 shadow-2xs">
              <TrendingUp size={12} /> {t("Simple Pricing")}
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-[450] text-[#1e1b4b] mb-2 tracking-tight leading-snug">
              {t("Start Free, Upgrade")} <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #F01472 0%, #C80E5A 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {t("When You're Ready")}
              </span>
            </h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-3xl mx-auto items-stretch">
            {pricingPlans.map((plan, i) => {
              const isSelected = activePricing === i;
              return (
                <FadeUp key={plan.name} delay={i * 0.1} className="h-full">
                  <motion.div
                    whileHover={{ scale: 1.015, y: -3 }}
                    onClick={() => {
                      setActivePricing(i);
                      if (
                        i === 1 ||
                        plan.name === t("Premium") ||
                        plan.name === "Premium"
                      ) {
                        recordPremiumClickApi()
                          .then(() => {
                            setShowFreeTrialModal(true);
                          })
                          .catch(() => {
                            setShowFreeTrialModal(true);
                          });
                      } else {
                        recordFreeClickApi().catch(() => {});
                      }
                    }}
                    className={`relative bg-white/95 backdrop-blur-md border-2 ${
                      isSelected
                        ? "border-[#F01472] shadow-xl shadow-pink-200/60"
                        : "border-pink-200/90 shadow-md"
                    } rounded-3xl p-5 sm:p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full`}
                  >
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#F01472] to-[#E11D48] text-white text-[10px] font-bold px-3.5 py-0.5 rounded-full whitespace-nowrap shadow-md">
                        {plan.badge}
                      </div>
                    )}
                    <div>
                      <div className="text-gray-500 text-xs sm:text-sm font-[450] mb-1">
                        {plan.name}
                      </div>
                      <div className="mb-3">
                        <span className="text-3xl sm:text-[34px] font-[450] text-[#1e1b4b]">
                          {plan.price}
                        </span>
                        <span className="text-gray-400 text-xs sm:text-sm font-[400] ml-1">
                          {plan.period}
                        </span>
                      </div>
                      <div className="space-y-2 my-4">
                        {plan.features.map((f) => (
                          <div
                            key={f}
                            className="flex items-center gap-2 text-gray-700 text-xs sm:text-[13px] font-[400]"
                          >
                            <CheckCircle2
                              size={14}
                              className="text-emerald-500 shrink-0"
                            />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          i === 1 ||
                          plan.name === "Premium" ||
                          plan.name === t("Premium")
                        ) {
                          recordPremiumClickApi().catch(() => {});
                          if (user?.is_premium) {
                            goToTemplates();
                          } else {
                            requireAuth(() => {
                              openPremiumCheckout('premium_monthly');
                            }, t("Please log in to upgrade to Premium."));
                          }
                        } else {
                          recordFreeClickApi().catch(() => {});
                          requireAuth(() => goToWizard());
                        }
                      }}
                      className={`w-full h-12 sm:h-14 py-2 px-4 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 mt-2 ${plan.ctaBg}`}
                    >
                      <span className="text-xs sm:text-sm font-semibold">
                        {plan.cta}
                      </span>
                      {plan.subCta && (
                        <span className="text-[10px] sm:text-[11px] font-normal opacity-80">
                          {plan.subCta}
                        </span>
                      )}
                    </button>
                  </motion.div>
                </FadeUp>
              );
            })}
          </div>
          <FadeUp className="text-center mt-6 sm:mt-8">
            <p className="text-gray-500 text-xs mb-2 font-[400]">
              {t("Secure payments via")}
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
              {["Card Payment", "UPI", "Net Banking"].map((p) => (
                <span
                  key={p}
                  className="bg-white/90 border border-pink-200/80 text-gray-700 text-xs font-[450] px-3 py-1 rounded-full shadow-2xs"
                >
                  {p}
                </span>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>
      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <AppFooter />
      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={Boolean(previewTemplate)}
        onClose={() => setPreviewTemplate(null)}
        onSelectTemplate={(tpl) => {
          localStorage.setItem("selected_template_id", tpl.id);
          sessionStorage.setItem("active_template_id", tpl.id);
          sessionStorage.setItem("is_template_active", "true");
          setPreviewTemplate(null);
          requireAuth(() => {
            window.location.href = `/templates?template=${encodeURIComponent(tpl.id)}&active=true`;
          }, t("Please log in to create your matrimonial biodata."));
        }}
      />
      <SignOutConfirmModal
        isOpen={showSignOutConfirm}
        onClose={() => setShowSignOutConfirm(false)}
        isLoading={isLoggingOut}
        onConfirm={async () => {
          try {
            setIsLoggingOut(true);
            await logout();
            setShowSignOutConfirm(false);
          } finally {
            setIsLoggingOut(false);
          }
        }}
      />
      {/* ── Start the Free Trial Modal ────────────────────────────────────── */}
      <AnimatePresence>
        {showFreeTrialModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setShowFreeTrialModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-900 border border-white/20 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-white overflow-hidden"
            >
              {/* Decorative Background Accents */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#F01472]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />
              <button
                onClick={() => setShowFreeTrialModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X size={18} />
              </button>
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#F01472] to-purple-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-pink-500/30">
                  <Sparkles size={28} />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-bold mb-2">
                  <Zap size={12} /> Special Free Trial Offer
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                  {t("Start the Free Trial")}
                </h3>
                <p className="text-white/70 text-xs sm:text-sm font-normal mb-6 max-w-xs">
                  {t(
                    "Unlock full unlimited access to premium designs, AI writing assistance, and HD downloads for 30 days.",
                  )}
                </p>
                <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 text-left space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs text-white/90 font-medium">
                    <CheckCircle2
                      size={15}
                      className="text-emerald-400 shrink-0"
                    />
                    <span>50+ Premium & Luxury Biodata Templates</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-white/90 font-medium">
                    <CheckCircle2
                      size={15}
                      className="text-emerald-400 shrink-0"
                    />
                    <span>Unlimited Watermark-Free HD PDF Exports</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-white/90 font-medium">
                    <CheckCircle2
                      size={15}
                      className="text-emerald-400 shrink-0"
                    />
                    <span>AI Content Enhancement & Bio Generator</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-white/90 font-medium">
                    <CheckCircle2
                      size={15}
                      className="text-emerald-400 shrink-0"
                    />
                    <span>Custom Branding, Colors & QR Code Profile</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    recordPremiumClickApi()
                      .then(() => {
                        setShowFreeTrialModal(false);
                        requireAuth(() => openPremiumCheckout('premium_monthly'));
                      })
                      .catch(() => {
                        setShowFreeTrialModal(false);
                        requireAuth(() => openPremiumCheckout('premium_monthly'));
                      });
                  }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F01472] to-[#E11D48] hover:opacity-95 text-white font-bold text-sm transition shadow-lg shadow-pink-500/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {t("Start 30-Day Free Trial (₹0 Today)")} <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => {
                    setShowFreeTrialModal(false);
                    requireAuth(() => goToWizard());
                  }}
                  className="w-full mt-2.5 py-2.5 text-xs text-white/50 hover:text-white transition font-medium cursor-pointer"
                >
                  {t("Continue with Free Plan")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
