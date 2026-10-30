import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Heart,
  Eye,
  ArrowRight,
  Sparkles,
  Search,
  ChevronRight,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  Check,
  Crown,
} from "lucide-react";
import {
  recordDownloadedTemplate,
  searchTemplatesApi,
  toggleFavoriteApi,
  getTemplateDetailApi,
  type TemplateItem,
} from "../../services/templateService";

import { TemplatePreviewModal } from "./TemplatePreviewModal";
import { ActiveTemplateWorkspace } from "./ActiveTemplateWorkspace";
import { useBiodata } from "../../context/BiodataContext";
import { useAuth } from "../../context/AuthContext";
import { FloatingPetals } from "../landing/FloatingPetals";
import { BiodataRenderer, DEFAULT_FEMALE_SAMPLE } from "../rendering/BiodataRenderer";
import { TEN_DUMMY_PROFILES } from "../../utils/dummyBiodataProfiles";
import { AppFooter } from "../common/AppFooter";
import { DownloadBiodataButton } from "../common/DownloadBiodataButton";


interface TemplateThumbnailCardProps {
  template: TemplateItem;
}

const TemplateThumbnailCard: React.FC<TemplateThumbnailCardProps> = ({
  template,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const [cardScale, setCardScale] = useState<number>(0.28);
  const [fallbackLayout, setFallbackLayout] = useState<any>(template.layout_json);
  const cardRef = useRef<HTMLDivElement>(null);

  const activeLayout = fallbackLayout || template.layout_json;

  // Calculate actual content bounds for exact A4 fit
  const targetW = (activeLayout?.page as any)?.width || 794;
  const baseH = (activeLayout?.page as any)?.height || 1123;
  const elements = activeLayout?.elements || [];
  const maxElBottom = elements.length > 0
    ? Math.max(baseH, ...elements.map((e: any) => (Number(e.y) || 0) + (Number(e.height) || 0)))
    : baseH;
  const targetH = maxElBottom;

  useEffect(() => {
    if (!cardRef.current) return;
    const updateSize = () => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          // Generous inset padding so the A4 sheet floats centered with clean matting like in the reference design
          const paddingX = 22; // 11px margin left & right
          const paddingY = 24; // 12px margin top & bottom
          const availW = Math.max(rect.width - paddingX, 10);
          const availH = Math.max(rect.height - paddingY, 10);
          // Scale to fit BOTH width and height so the entire page is fully visible with safe margins
          const computedScale = Math.min(availW / targetW, availH / targetH);
          setCardScale(computedScale);
        }
      }
    };
    updateSize();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => updateSize());
      ro.observe(cardRef.current);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          updateSize();
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(cardRef.current);
    window.addEventListener("resize", updateSize);
    return () => {
      if (ro) ro.disconnect();
      observer.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, [activeLayout, targetW, targetH]);

  useEffect(() => {
    if (isVisible && !template.layout_json && !fallbackLayout && template.id) {
      getTemplateDetailApi(template.id).then((full) => {
        if (full?.layout_json) {
          setFallbackLayout(full.layout_json);
        }
      });
    }
  }, [isVisible, template.layout_json, fallbackLayout, template.id]);

  // In Template Gallery, always display the preview as saved by the admin
  // (admin-saved thumbnail image or admin's template sample data)
  const adminSampleData =
    (activeLayout?.page as any)?.sampleData ||
    (activeLayout as any)?.sampleData ||
    (typeof (activeLayout?.page as any)?.selectedDummyIndex === "number"
      ? TEN_DUMMY_PROFILES[(activeLayout?.page as any).selectedDummyIndex]?.data
      : null) ||
    DEFAULT_FEMALE_SAMPLE;

  return (
    <div
      ref={cardRef}
      className="w-full h-full flex items-center justify-center p-2 select-none pointer-events-none"
    >
      {isVisible ? (
        activeLayout ? (
          <div
            className="rounded-[3px] shadow-[0_4px_16px_rgba(0,0,0,0.10)] ring-1 ring-black/5 overflow-hidden flex items-start justify-center shrink-0 transition-transform duration-300 group-hover:scale-[1.02]"
            style={{
              width: `${targetW * cardScale}px`,
              height: `${targetH * cardScale}px`,
              backgroundColor:
                (activeLayout?.page as any)?.background ||
                (activeLayout?.page as any)?.backgroundColor ||
                "#FFFFFF",
            }}
          >
            <BiodataRenderer
              data={adminSampleData}
              layoutJson={activeLayout}
              scale={cardScale}
            />
          </div>
        ) : template.thumbnail_url && !imgFailed ? (
          <div className="w-full h-full flex items-center justify-center p-2 select-none pointer-events-none">
            <img
              src={template.thumbnail_url}
              alt={template.name}
              loading="lazy"
              decoding="async"
              onError={() => setImgFailed(true)}
              className="max-w-full max-h-full object-contain rounded-[3px] shadow-[0_4px_16px_rgba(0,0,0,0.10)] ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xl opacity-30">{template.preview_icon || "📄"}</span>
          </div>
        )
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-xl opacity-30">{template.preview_icon || "📄"}</span>
        </div>
      )}
    </div>
  );
};

export const TemplateGallery: React.FC = () => {
  const { isAuthenticated, isLoading, openLogin, user, openPremiumCheckout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      sessionStorage.setItem("tm_post_login_redirect", "/templates");
      openLogin(undefined, "Please log in to create your matrimonial biodata.");
      navigate("/", { replace: true });
    }
  }, [isLoading, isAuthenticated, openLogin, navigate]);

  const { formData } = useBiodata();

  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [pricingFilter, setPricingFilter] = useState<"ALL" | "FREE" | "PREMIUM">("ALL");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showLikedOnly, setShowLikedOnly] = useState<boolean>(false);
  const [favoritesMap, setFavoritesMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("tm_liked_templates");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [previewTemplate, setPreviewTemplate] = useState<TemplateItem | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<TemplateItem | null>(null);

  // Synchronous check to avoid flashing catalog during refresh if an active template was being viewed
  const [isHydratingActive, setIsHydratingActive] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    const paramTemplateId = params.get('template');
    const openActive = params.get('active') === 'true';
    const isTargetActive = openActive || (Boolean(paramTemplateId) && params.get('preview') !== 'true');
    const targetId = paramTemplateId || sessionStorage.getItem('active_template_id') || localStorage.getItem('selected_template_id');
    return Boolean(isTargetActive && targetId);
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };
    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  // Fetch templates catalog
  useEffect(() => {
    loadTemplates();
  }, [activeCategory, pricingFilter]);

  // When directly loading or refreshing on active workspace, seed /templates into history so back button redirects to catalog
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const isTargetActive = params.get('active') === 'true' || (Boolean(params.get('template')) && params.get('preview') !== 'true');
    if (isTargetActive) {
      if (!window.history.state?.seededFromGallery) {
        const currentUrl = window.location.pathname + window.location.search;
        window.history.replaceState({ seededFromGallery: true, isCatalogBase: true }, '', '/templates');
        window.history.pushState({ seededFromGallery: true, isActiveWorkspace: true }, '', currentUrl);
      }
    }
  }, []);

  // Listen to popstate (browser back/forward button) to instantly return to /templates catalog when leaving active template
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const isTargetActive = params.get('active') === 'true' || (Boolean(params.get('template')) && params.get('preview') !== 'true');
      if (!isTargetActive) {
        setActiveTemplate(null);
        sessionStorage.removeItem('active_template_id');
        sessionStorage.removeItem('is_template_active');
        setIsHydratingActive(false);
      }
      if (params.get('preview') !== 'true') {
        setPreviewTemplate(null);
        sessionStorage.removeItem('preview_template_id');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Synchronize state with URL search params (drives active template & preview across navigations)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paramTemplateId = params.get('template');
    const openActive = params.get('active') === 'true';
    const openPreview = params.get('preview') === 'true';
    const isTargetActive = openActive || (Boolean(paramTemplateId) && !openPreview);

    if (!isTargetActive) {
      setActiveTemplate(null);
      sessionStorage.removeItem('active_template_id');
      sessionStorage.removeItem('is_template_active');
      setIsHydratingActive(false);
    } else {
      const targetId = paramTemplateId || sessionStorage.getItem('active_template_id') || localStorage.getItem('selected_template_id');
      if (targetId) {
        if (!activeTemplate || activeTemplate.id !== targetId) {
          getTemplateDetailApi(targetId).then((detail) => {
            if (detail) {
              setActiveTemplate((prev) => (prev?.id === detail.id && prev?.layout_json ? prev : detail));
              sessionStorage.setItem('active_template_id', detail.id);
              sessionStorage.setItem('is_template_active', 'true');
            }
            setIsHydratingActive(false);
          }).catch(() => {
            setIsHydratingActive(false);
          });
        } else {
          setIsHydratingActive(false);
        }
      } else {
        setIsHydratingActive(false);
      }
    }

    if (!openPreview) {
      setPreviewTemplate(null);
      sessionStorage.removeItem('preview_template_id');
    } else if (paramTemplateId && (!previewTemplate || previewTemplate.id !== paramTemplateId)) {
      getTemplateDetailApi(paramTemplateId).then((detail) => {
        if (detail) {
          setPreviewTemplate(detail);
        }
      });
    }
  }, [location.search]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const data = await searchTemplatesApi({
        search: searchQuery || undefined,
        category: activeCategory !== "all" ? activeCategory : undefined,
        pricing_type: pricingFilter !== "ALL" ? pricingFilter : undefined,
        include_layout: true,
      });
      setTemplates(data || []);

      // Check if URL or session specifies an active template
      const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
      const paramTemplateId = params.get("template");
      const openActive = params.get("active") === "true";
      const isTargetActive = openActive || (Boolean(paramTemplateId) && params.get('preview') !== 'true');
      const targetId = isTargetActive
        ? (paramTemplateId || sessionStorage.getItem("active_template_id") || localStorage.getItem("selected_template_id"))
        : null;

      if (targetId && data && data.length > 0) {
        const found = data.find((t: TemplateItem) => t.id === targetId || t.slug === targetId);
        if (found) {
          if (!found.layout_json) {
            getTemplateDetailApi(found.id).then((full) => {
              if (full) setActiveTemplate((prev) => (prev?.layout_json ? prev : full));
              else setActiveTemplate((prev) => prev || found);
            });
          } else {
            setActiveTemplate((prev) => (prev?.layout_json ? prev : found));
          }
        }
      } else if (openActive && data && data.length > 0) {
        // Navigated directly to studio mode without prior selection -> default to first template
        const defaultTpl = data[0];
        getTemplateDetailApi(defaultTpl.id).then((full) => {
          setActiveTemplate((prev) => prev || full || defaultTpl);
          localStorage.setItem("selected_template_id", defaultTpl.id);
          sessionStorage.setItem("active_template_id", defaultTpl.id);
          sessionStorage.setItem("is_template_active", "true");
        });
      }
    } catch (err) {
      console.error("Failed to load templates:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadTemplates();
  };

  const displayedTemplates = useMemo(() => {
    if (!showLikedOnly) return templates;
    return templates.filter((tpl) => Boolean(favoritesMap[tpl.id]));
  }, [templates, showLikedOnly, favoritesMap]);

  const likedCount = useMemo(() => {
    return Object.values(favoritesMap).filter(Boolean).length;
  }, [favoritesMap]);

  const handleToggleFavorite = async (e: React.MouseEvent, templateId: string) => {
    e.stopPropagation();
    const nextState = !favoritesMap[templateId];
    setFavoritesMap((prev) => {
      const updated = { ...prev, [templateId]: nextState };
      try {
        localStorage.setItem("tm_liked_templates", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      const res = await toggleFavoriteApi(templateId);
      if (typeof res.favorited === "boolean" && res.favorited !== nextState) {
        setFavoritesMap((prev) => {
          const updated = { ...prev, [templateId]: res.favorited! };
          try {
            localStorage.setItem("tm_liked_templates", JSON.stringify(updated));
          } catch {}
          return updated;
        });
      }
    } catch {}
  };

  const handleSelectActiveTemplate = async (tpl: TemplateItem) => {
    const isPro = tpl.pricing_type === "PREMIUM" || Boolean(tpl.is_luxury);
    const isUnlocked = Boolean(user?.is_premium || user?.role === "ADMIN");

    if (isPro && !isUnlocked) {
      openPremiumCheckout("premium_monthly", () => {
        handleSelectActiveTemplate(tpl);
      });
      return;
    }

    localStorage.setItem("selected_template_id", tpl.id);
    localStorage.setItem("last_used_template_id", tpl.id);
    localStorage.setItem("last_used_template_name", tpl.name);
    sessionStorage.setItem("active_template_id", tpl.id);
    sessionStorage.setItem("is_template_active", "true");
    recordDownloadedTemplate(tpl.id, tpl.name);
    navigate('/templates?template=' + encodeURIComponent(tpl.id) + '&active=true', {
      state: { seededFromGallery: true, isActiveWorkspace: true },
    });
    if (!tpl.layout_json) {
      const full = await getTemplateDetailApi(tpl.id);
      setActiveTemplate(full || tpl);
    } else {
      setActiveTemplate(tpl);
    }
    setPreviewTemplate(null);
    sessionStorage.removeItem("preview_template_id");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenPreview = async (e: React.MouseEvent, tpl: TemplateItem) => {
    e.stopPropagation();
    sessionStorage.setItem("preview_template_id", tpl.id);
    navigate('/templates?template=' + encodeURIComponent(tpl.id) + '&preview=true');
    if (!tpl.layout_json) {
      const full = await getTemplateDetailApi(tpl.id);
      setPreviewTemplate(full || tpl);
    } else {
      setPreviewTemplate(tpl);
    }
  };

  const handleClosePreview = () => {
    setPreviewTemplate(null);
    sessionStorage.removeItem("preview_template_id");
    if (activeTemplate) {
      navigate('/templates?template=' + encodeURIComponent(activeTemplate.id) + '&active=true');
    } else {
      navigate('/templates');
    }
  };

  // Construct real user data for preview cards
  const userBiodataForPreview = useMemo(() => {
    const hasData = Boolean(
      formData?.name ||
      formData?.dob ||
      formData?.educationList?.length ||
      formData?.occupation ||
      formData?.fatherName ||
      user?.full_name
    );
    if (!hasData) return undefined;

    return {
      ...formData,
      isUserBiodata: true,
      name: formData?.name || user?.full_name || "Candidate",
    };
  }, [formData, user]);

  if (!isAuthenticated && !isLoading) {
    return null;
  }

  // ── Hydrating: show spinner instead of flashing gallery catalog ──
  if (isHydratingActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDFE]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-[3px] border-[#F01472] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading your template…</p>
        </div>
      </div>
    );
  }

  // ── Render Active Workspace If A Template Is Selected ──
  if (activeTemplate) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FFFDFE] font-sans text-gray-800">
        <ActiveTemplateWorkspace
          activeTemplate={activeTemplate}
          allTemplates={templates}
          onSelectTemplate={async (tpl) => {
            localStorage.setItem("selected_template_id", tpl.id);
            sessionStorage.setItem("active_template_id", tpl.id);
            sessionStorage.setItem("is_template_active", "true");
            navigate('/templates?template=' + encodeURIComponent(tpl.id) + '&active=true', {
              replace: true,
              state: { seededFromGallery: true, isActiveWorkspace: true },
            });
            if (!tpl.layout_json) {
              const full = await getTemplateDetailApi(tpl.id);
              setActiveTemplate(full || tpl);
            } else {
              setActiveTemplate(tpl);
            }
          }}
          onBackToCatalog={() => {
            setActiveTemplate(null);
            sessionStorage.removeItem("active_template_id");
            sessionStorage.removeItem("is_template_active");
            navigate('/templates');
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
        <AppFooter />
      </div>
    );
  }

  // ── Render Gallery Catalog View (Original Aesthetic) ──
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDFE] font-sans relative overflow-x-hidden text-gray-800">
      {/* Floating Petals Ambient Background */}
      <FloatingPetals />

      {/* Top Action & Filter Row */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-pink-100/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 relative">

          {/* Center: Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 min-w-[200px] max-w-md mx-auto sm:mx-0 order-3 sm:order-none w-full sm:w-auto"
          >
            <div className="relative flex items-center bg-white border border-pink-200/90 rounded-full shadow-xs p-1 pl-3.5 pr-1 transition-all focus-within:border-[#F01472] focus-within:ring-2 focus-within:ring-pink-200">
              <Search className="text-gray-400 shrink-0 mr-1.5" size={15} />
              <input
                type="text"
                placeholder="Search by style (e.g. Royal, Floral, Minimal)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm text-gray-800 placeholder-gray-400 font-[400] focus:outline-none"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-full bg-[#F01472] hover:bg-[#C80E5A] text-white font-[400] text-xs shadow-xs transition-all cursor-pointer shrink-0"
              >
                Search
              </button>
            </div>
          </form>

          {/* Right Group: Filter Button */}
          <div className="flex items-center gap-2.5 shrink-0 sm:ml-0">
            <div className="relative" ref={filterDropdownRef}>
              <button
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-[450] transition-all cursor-pointer shadow-xs ${
                  pricingFilter !== "ALL" || activeCategory !== "all"
                    ? "bg-[#F01472] text-white shadow-md shadow-pink-300/40"
                    : "bg-white text-gray-700 border border-gray-200/90 hover:border-pink-300 hover:text-[#F01472]"
                }`}
              >
                <SlidersHorizontal size={14} />
                <span>Filter</span>
                {(pricingFilter !== "ALL" || activeCategory !== "all") && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${
                    isFilterOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Filter Popover Dropdown */}
              {isFilterOpen && (
                <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-[calc(100vw-2rem)] max-w-[320px] sm:w-[340px] bg-white rounded-2xl shadow-2xl border border-pink-100/90 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Filter size={15} className="text-[#F01472]" />
                      <span className="font-semibold text-sm text-gray-900">
                        Filter Options
                      </span>
                    </div>
                    {(pricingFilter !== "ALL" || activeCategory !== "all") && (
                      <button
                        onClick={() => {
                          setPricingFilter("ALL");
                          setActiveCategory("all");
                        }}
                        className="text-xs text-[#F01472] hover:underline font-medium cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  {/* Pricing Type Filter */}
                  <div className="mb-3.5">
                    <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                      Pricing
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-50/80 rounded-xl border border-gray-200/80">
                      {(["ALL", "FREE", "PREMIUM"] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setPricingFilter(type)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-medium transition cursor-pointer text-center ${
                            pricingFilter === type
                              ? "bg-white text-[#F01472] shadow-xs font-bold"
                              : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                          }`}
                        >
                          {type === "ALL"
                            ? "All"
                            : type === "FREE"
                            ? "Free"
                            : "Pro"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                      Style Category
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: "all", label: "All Styles" },
                        { id: "traditional", label: "Traditional" },
                        { id: "modern", label: "Modern" },
                        { id: "floral", label: "Floral" },
                        { id: "royal", label: "Royal & Heritage" },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setActiveCategory(cat.id)}
                          className={`py-1.5 px-2.5 rounded-xl text-xs transition cursor-pointer text-left flex items-center justify-between ${
                            activeCategory === cat.id
                              ? "bg-pink-50 text-[#F01472] font-semibold border border-pink-200"
                              : "text-gray-600 hover:bg-gray-50 border border-transparent"
                          }`}
                        >
                          <span className="truncate">{cat.label}</span>
                          {activeCategory === cat.id && (
                            <Check size={12} className="text-[#F01472] shrink-0 ml-1" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Like / Favorites Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setShowLikedOnly(!showLikedOnly)}
              title={showLikedOnly ? "Showing liked templates (click to view all)" : "Show liked templates only"}
              aria-label="Filter by liked templates"
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-[450] transition-all cursor-pointer shadow-xs ${
                showLikedOnly
                  ? "bg-[#F01472] text-white shadow-md shadow-pink-300/40 border border-[#F01472]"
                  : "bg-white text-gray-700 border border-gray-200/90 hover:border-pink-300 hover:text-[#F01472]"
              }`}
            >
              <Heart
                size={14}
                className={showLikedOnly ? "text-white" : likedCount > 0 ? "text-[#F01472]" : "text-gray-500"}
                fill={showLikedOnly || (likedCount > 0 && !showLikedOnly) ? "currentColor" : "none"}
              />
              <span>Liked</span>
              {likedCount > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none ${
                    showLikedOnly ? "bg-white/30 text-white" : "bg-pink-100 text-[#F01472]"
                  }`}
                >
                  {likedCount}
                </span>
              )}
            </button>

            {/* Download Biodata Button */}
            <DownloadBiodataButton variant="header" />
          </div>
        </div>

        {/* Sub-bar: Designs count indicator */}
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex justify-end">
          {!loading && (
            <span className="text-xs text-gray-400 font-[400]">
              {showLikedOnly
                ? `${displayedTemplates.length} liked design${displayedTemplates.length === 1 ? "" : "s"}`
                : `${templates.length} designs found`}
            </span>
          )}
        </div>
      </div>

      {/* Main Templates 5-Column Grid */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex flex-col select-none w-full">
                <div className="relative w-full aspect-[1/1.36] min-h-[340px] sm:min-h-[370px] rounded-2xl overflow-hidden bg-white/90 border border-pink-100/80 shadow-xs p-2 flex flex-col justify-between">
                  <div className="w-full h-full rounded-xl bg-gradient-to-b from-pink-50/80 via-rose-50/40 to-pink-50/70 animate-pulse" />
                </div>
                <div className="mt-2.5 px-0.5 space-y-1.5">
                  <div className="h-2.5 w-20 bg-pink-100/70 rounded-full animate-pulse" />
                  <div className="h-6 w-full bg-pink-100/40 rounded-xl animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedTemplates.length === 0 ? (
          showLikedOnly ? (
            <div className="text-center py-20 space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-pink-50 border border-pink-200/60 flex items-center justify-center mx-auto shadow-xs">
                <Heart size={36} className="text-[#F01472]" fill="#F01472" />
              </div>
              <h3 className="text-xl font-[450] text-gray-800">No Liked Templates Yet</h3>
              <p className="text-gray-500 text-sm font-[400] max-w-md mx-auto">
                Click the heart icon on any template card to save your favorites here.
              </p>
              <button
                onClick={() => setShowLikedOnly(false)}
                className="px-6 py-2.5 bg-[#F01472] text-white text-sm font-[400] rounded-full hover:bg-[#C80E5A] transition cursor-pointer shadow-md"
              >
                Show All Templates
              </button>
            </div>
          ) : (
            <div className="text-center py-20 space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-pink-100 flex items-center justify-center mx-auto">
                <Sparkles size={36} className="text-[#F01472]" />
              </div>
              <h3 className="text-xl font-[400] text-gray-800">No Templates Found</h3>
              <p className="text-gray-500 text-sm font-[400]">Try resetting your filters or search term.</p>
              <button
                onClick={() => {
                  setActiveCategory("all");
                  setPricingFilter("ALL");
                  setSearchQuery("");
                }}
                className="px-6 py-2.5 bg-[#F01472] text-white text-sm font-[400] rounded-full hover:bg-[#C80E5A] transition cursor-pointer shadow-md"
              >
                Reset Filters
              </button>
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-6">
            {displayedTemplates.map((tpl) => {
              const isFav = Boolean(favoritesMap[tpl.id]);
              const isPremium = tpl.pricing_type === "PREMIUM" || Boolean(tpl.is_luxury);
              const isUnlocked = Boolean(user?.is_premium || user?.role === "ADMIN");
              const requiresPayment = isPremium && !isUnlocked;

              return (
                <div
                  key={tpl.id}
                  className="group bg-white rounded-2xl sm:rounded-3xl p-3 border border-pink-100/90 hover:border-pink-300 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer"
                  onClick={() => handleSelectActiveTemplate(tpl)}
                >
                  {/* Inset Matting Frame with Light Neutral Gray */}
                  <div className="relative w-full h-[330px] sm:h-[365px] rounded-xl sm:rounded-2xl bg-[#F8F9FA] overflow-hidden flex items-center justify-center">
                    {/* Badge */}
                    <div
                      className={`absolute top-2.5 left-2.5 z-10 px-2.5 py-0.5 rounded-full text-[9px] font-[500] tracking-wider shadow-2xs ${
                        isPremium
                          ? "bg-amber-500 text-white"
                          : "bg-emerald-500 text-white"
                      }`}
                    >
                      {isPremium ? "PRO" : "FREE"}
                    </div>

                    {/* Favorite Heart */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleFavorite(e, tpl.id)}
                      className={`absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full shadow-xs transition cursor-pointer ${
                        isFav
                          ? "bg-white text-rose-500"
                          : "bg-white/90 text-gray-400 hover:text-rose-500"
                      }`}
                      aria-label="Toggle Favorite"
                    >
                      <Heart size={12} fill={isFav ? "currentColor" : "none"} />
                    </button>

                    {/* Thumbnail Preview */}
                    <TemplateThumbnailCard
                      template={tpl}
                    />

                    {/* Hover Overlay Buttons */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-1.5 p-2">
                      <button
                        type="button"
                        onClick={(e) => handleOpenPreview(e, tpl)}
                        className="px-2.5 py-1.5 bg-white text-gray-800 rounded-full text-[11px] font-[450] flex items-center gap-1 shadow-md hover:bg-pink-50 transition cursor-pointer"
                      >
                        <Eye size={12} /> Preview
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectActiveTemplate(tpl);
                        }}
                        className={`px-3 py-1.5 text-white rounded-full text-[11px] font-[450] flex items-center gap-1 shadow-md transition cursor-pointer ${
                          requiresPayment
                            ? "bg-gradient-to-r from-amber-500 to-rose-600 hover:brightness-105"
                            : "bg-[#F01472] hover:bg-[#C80E5A]"
                        }`}
                      >
                        {requiresPayment ? (
                          <>
                            <Crown size={12} /> Unlock PRO
                          </>
                        ) : (
                          <>
                            Create My Profile <ArrowRight size={12} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Card Footer Matching Reference */}
                  <div className="mt-2.5 flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 px-0.5">
                      <span className="text-xs">{tpl.preview_icon || "📄"}</span>
                      <span className="text-xs font-[500] text-gray-800 truncate">
                        {tpl.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectActiveTemplate(tpl);
                      }}
                      className={`w-full py-2 rounded-full text-white text-xs font-[500] transition flex items-center justify-center gap-1 cursor-pointer shadow-xs active:scale-[0.98] ${
                        requiresPayment
                          ? "bg-gradient-to-r from-amber-500 to-rose-600 hover:brightness-105 shadow-amber-500/20"
                          : "bg-[#F01472] hover:bg-[#C80E5A]"
                      }`}
                    >
                      {requiresPayment ? (
                        <>
                          <Crown size={13} /> Unlock PRO (30 Days Free)
                        </>
                      ) : (
                        <>
                          Create My Profile <ChevronRight size={12} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Full-Screen Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={Boolean(previewTemplate)}
        onClose={handleClosePreview}
        onSelectTemplate={handleSelectActiveTemplate}
        userData={userBiodataForPreview}
      />

      {/* Global App Footer */}
      <AppFooter />
    </div>
  );
};
