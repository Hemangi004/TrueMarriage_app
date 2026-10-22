import React, { useState, useRef, useEffect } from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { useI18n } from '../../context/I18nContext';
import { searchTemplatesApi, getTemplateDetailApi } from '../../services/templateService';
import { BiodataRenderer } from '../rendering/BiodataRenderer';
import { TEN_DUMMY_PROFILES } from '../../utils/dummyBiodataProfiles';
import {
  Download,
  Heart,
  Undo2,
  Redo2,
  LayoutGrid,
  Edit3,
  Flower2,
    Palette,
  Share2,
  Check,
  Landmark,
  ZoomIn,
  Loader2,
  Sparkles,
  Crown,
} from 'lucide-react';
import { PdfGeneratorModal } from './PdfGeneratorModal';
import { EditProfileModal } from '../profile/EditProfileModal';
import { ModifyHeaderModal } from './ModifyHeaderModal';
import { BiodataShareModal } from '../modals/BiodataShareModal';

/* ── Customization Types ─────────────────────────────────────────────── */
export type TemplateId = string;

interface TemplateConfig {
  id: string;
  name: string;
  badge: string;
  previewIcon: string;
  defaultAccent: string;
  defaultBg: string;
  fontFamily: 'serif' | 'sans';
  category?: string;
  categories?: string[];
  bgImage?: string;
  gradientPreview?: string;
  isCustom?: boolean;
  layout_json?: any;
}

/* ── Pink Watercolor Floral Petals (Workspace Background) ───── */
const PinkFloralWorkspaceAccent: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none ${className}`}
  >
    <g opacity="0.65">
      <circle cx="90" cy="90" r="15" fill="#F8B4C8" opacity="0.75" />
      <circle cx="112" cy="85" r="14" fill="#F4A2BA" opacity="0.8" />
      <circle cx="106" cy="106" r="16" fill="#F8B4C8" opacity="0.75" />
      <circle cx="85" cy="106" r="14" fill="#FCAFC3" opacity="0.8" />
      <circle cx="96" cy="96" r="7" fill="#E8829F" />
      <path d="M90 65 C80 40 60 30 45 35 C55 55 75 60 90 65 Z" fill="#F6C5D4" opacity="0.7" />
      <path d="M125 90 C150 80 160 60 155 45 C135 55 130 75 125 90 Z" fill="#F6C5D4" opacity="0.7" />
      <path d="M65 95 C40 105 30 125 35 140 C55 130 60 110 65 95 Z" fill="#F6C5D4" opacity="0.7" />
      <path d="M100 125 C110 150 130 160 145 155 C135 135 115 130 100 125 Z" fill="#F6C5D4" opacity="0.7" />
    </g>
  </svg>
);

interface TemplateStudioProps {
  isPdfModalOpen?: boolean;
  onClosePdfModal?: () => void;
  onOpenPdfModal?: () => void;
  onOpenEditModal?: () => void;
}

export const TemplateStudio: React.FC<TemplateStudioProps> = ({
  isPdfModalOpen: externalPdfOpen,
  onClosePdfModal,
  onOpenPdfModal,
  onOpenEditModal,
}) => {
  const { formData, profileId, slug, updateFormData } = useBiodata();
  const { lang } = useI18n();

  // Template state: starts empty and loading from database
  const [templateList, setTemplateList] = useState<TemplateConfig[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState<boolean>(true);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>(() => {
    return localStorage.getItem('selected_template_id') || '';
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>(['modern_minimal_gold']);
  const [internalEditModalOpen, setInternalEditModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);

  const handleApplyHeader = (symbol: string, shloka: string) => {
    updateFormData({
      selectedMotifIcon: symbol,
      headerMotif: shloka,
    });
    setIsHeaderModalOpen(false);
  };

  const handleOpenEdit = () => {
    if (onOpenEditModal) {
      onOpenEditModal();
    } else {
      setInternalEditModalOpen(true);
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  // PDF Generator Modal State
  const [internalPdfModalOpen, setInternalPdfModalOpen] = useState(false);
  const isPdfOpen = externalPdfOpen !== undefined ? externalPdfOpen : internalPdfModalOpen;

  const handleOpenPdfModal = () => {
    if (onOpenPdfModal) {
      onOpenPdfModal();
    } else {
      setInternalPdfModalOpen(true);
    }
  };

  const handleClosePdfModal = () => {
    if (onClosePdfModal) {
      onClosePdfModal();
    } else {
      setInternalPdfModalOpen(false);
    }
  };

  // Fetch templates directly from backend database
  useEffect(() => {
    let isMounted = true;
    const fetchDatabaseTemplates = async () => {
      setIsLoadingTemplates(true);
      try {
        const backendTpls = await searchTemplatesApi({});
        if (isMounted && backendTpls && backendTpls.length > 0) {
          // Desired display order mapping to ensure intuitive presentation
          const preferredOrder = [
            'modern_minimal_gold',
            'trad_gold_mandala',
            'trad_floral_ganesha',
            'trad_red_mandala',
            'elegant_floral_border',
            'trad_shiv_parvati',
            'royal_gold_arch',
          ];

          const sortedBackendTpls = [...backendTpls].sort((a, b) => {
            const idxA = preferredOrder.indexOf(a.id);
            const idxB = preferredOrder.indexOf(b.id);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return 0;
          });

          const converted: TemplateConfig[] = sortedBackendTpls.map((t: any) => {
            const catSlugs = (t.categories || []).map((c: any) => (c.slug || c.id || '').toLowerCase());
            const catId = catSlugs[0] || 'traditional';
            return {
              id: t.id,
              name: t.name,
              badge: t.badge || (t.id === 'modern_minimal_gold' ? 'Active' : 'Traditional'),
              previewIcon: t.preview_icon || '📄',
              defaultAccent: t.default_accent || '#B45309',
              defaultBg: t.default_bg || '#FFFFFF',
              fontFamily: (t.font_family?.toLowerCase().includes('inter') || t.font_family?.toLowerCase().includes('sans')) ? 'sans' : 'serif',
              category: catId,
              categories: catSlugs,
              bgImage: t.thumbnail_url || undefined,
              layout_json: t.layout_json,
            };
          });

          setTemplateList(converted);

          // Select saved template if valid, otherwise select the first database template
          const savedId = localStorage.getItem('selected_template_id');
          if (savedId && converted.some((c) => c.id === savedId)) {
            setSelectedTemplate(savedId);
          } else if (converted.length > 0) {
            setSelectedTemplate(converted[0].id);
            localStorage.setItem('selected_template_id', converted[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load templates from database:', err);
      } finally {
        if (isMounted) {
          setIsLoadingTemplates(false);
        }
      }
    };

    fetchDatabaseTemplates();
    return () => {
      isMounted = false;
    };
  }, []);

  // Preview references & Auto-fit scaling state (Default: 60% Zoom)
  // Fetch full template layout on-demand if selected template does not have layout_json
  useEffect(() => {
    if (!selectedTemplate) return;
    const current = templateList.find((t) => t.id === selectedTemplate);
    if (current && !current.layout_json) {
      getTemplateDetailApi(selectedTemplate).then((full) => {
        if (full?.layout_json) {
          setTemplateList((prev) =>
            prev.map((item) =>
              item.id === selectedTemplate ? { ...item, layout_json: full.layout_json } : item
            )
          );
        }
      });
    }
  }, [selectedTemplate, templateList]);

  // Preview references & Auto-fit scaling state (Default: 50% Zoom)
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [autoScale, setAutoScale] = useState<number>(0.6);
  const [customZoom, setCustomZoom] = useState<number | null>(0.6);

  const activeScale = customZoom ?? autoScale;

  useEffect(() => {
    const updateScale = () => {
      if (!previewContainerRef.current) return;
      const { clientWidth, clientHeight } = previewContainerRef.current;
      const padX = 24;
      const padY = 24;
      const availableW = Math.max(clientWidth - padX, 220);
      const availableH = Math.max(clientHeight - padY, 220);
      const scaleX = availableW / 794;
      const scaleY = availableH / 1123;
      const fitScale = Math.min(scaleX, scaleY);
      setAutoScale(Math.max(0.25, Math.min(fitScale, 1.2)));
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (previewContainerRef.current) ro.observe(previewContainerRef.current);
    window.addEventListener('resize', updateScale);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  const handleTemplateSelect = (template: TemplateConfig) => {
    setSelectedTemplate(template.id);
    localStorage.setItem('selected_template_id', template.id);
  };

  const currentTemplateObj =
    templateList.find((t) => t.id === selectedTemplate) || templateList[0];

  // Filter templates by Category
  const filteredTemplates = templateList.filter((t) => {
    if (activeCategory === 'all') return true;
    const list = t.categories && t.categories.length > 0 ? t.categories : [t.category || ''];
    return list.some((c) => c.toLowerCase().includes(activeCategory.toLowerCase()));
  });

  return (
    <div className="w-full flex-1 flex flex-col min-h-0">
      {/* ── 2-PANEL WORKSPACE LAYOUT (Compact Gap & Padding) ── */}
      <div className="flex flex-col lg:flex-row items-stretch gap-3 lg:gap-3.5 flex-1 h-[calc(100vh-5.2rem)] max-h-[calc(100vh-5.2rem)] min-h-[580px] overflow-hidden">
        
        {/* ── 1. LEFT PANEL: CHOOSE TEMPLATE ── */}
        <div className="w-full lg:w-[440px] xl:w-[470px] 2xl:w-[500px] shrink-0 h-full max-h-[calc(100vh-5.2rem)] min-h-0 bg-white rounded-3xl border border-rose-100/90 shadow-sm p-3.5 sm:p-4 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-rose-50 border border-rose-200/80 text-[#E11D48] flex items-center justify-center shrink-0">
                <Flower2 size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 leading-tight">Choose Template</h2>
                <p className="text-xs text-gray-400 mt-0.5">Pick a design that matches your style</p>
              </div>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 no-scrollbar shrink-0">
            {[
              { id: 'all', label: 'All', icon: <LayoutGrid size={12} /> },
              { id: 'traditional', label: 'Traditional', icon: <Landmark size={12} /> },
              { id: 'floral', label: 'Floral', icon: <Flower2 size={12} /> },
              { id: 'royal', label: 'Royal & Heritage', icon: <Crown size={12} /> },
              { id: 'modern', label: 'Modern', icon: <Palette size={12} /> },
              { id: 'luxury', label: 'Luxury', icon: <Sparkles size={12} /> },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-[#E11D48] text-white shadow-xs'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-pink-200 hover:text-[#E11D48]'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Section Heading */}
          <div className="text-xs font-bold text-gray-800 mt-1.5 mb-2 shrink-0">
            {isLoadingTemplates ? 'Loading Templates...' : `All Templates (${filteredTemplates.length})`}
          </div>

          {/* Template Cards: Smooth Scrollable Container with Sleek Rose Scrollbar */}
          <div
            className="flex-1 min-h-0 overflow-y-auto pr-1.5 pb-8 custom-scrollbar"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#FBBDD8 rgba(244, 244, 245, 0.6)',
            }}
          >
            {isLoadingTemplates ? (
              /* Shimmer Skeletons while fetching database templates */
              <div className="grid grid-cols-3 gap-2.5 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div key={idx} className="rounded-2xl border border-gray-100 bg-gray-50 overflow-hidden flex flex-col">
                    <div className="h-32 sm:h-36 bg-gradient-to-br from-rose-50 to-gray-100 flex items-center justify-center">
                      <Loader2 size={18} className="animate-spin text-rose-300" />
                    </div>
                    <div className="p-2 space-y-1 bg-white">
                      <div className="h-3 bg-gray-200 rounded w-4/5" />
                      <div className="h-2 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2.5">
                {filteredTemplates.map((t) => {
                  const isSelected = selectedTemplate === t.id;
                  const isFav = favorites.includes(t.id);
                  const cardSampleData =
                    (t.layout_json?.page as any)?.sampleData ||
                    (t.layout_json as any)?.sampleData ||
                    (typeof (t.layout_json?.page as any)?.selectedDummyIndex === 'number'
                      ? TEN_DUMMY_PROFILES[(t.layout_json?.page as any).selectedDummyIndex]?.data
                      : null) ||
                    TEN_DUMMY_PROFILES[0].data;
                  return (
                    <div
                      key={t.id}
                      onClick={() => handleTemplateSelect(t)}
                      className={`group rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col bg-white ${
                        isSelected
                          ? 'border-2 border-[#E11D48] ring-2 ring-pink-500/20 shadow-sm scale-[1.01]'
                          : 'border-gray-200 hover:border-pink-300 hover:shadow-xs'
                      }`}
                    >
                      {/* Thumbnail Viewport */}
                      <div className="relative aspect-[1/1.38] min-h-[148px] bg-[#FAF7F2] overflow-hidden flex items-center justify-center">
                        {isSelected && (
                          <span className="absolute top-2 left-2 bg-[#E11D48] text-white text-[9.5px] font-bold px-2 py-0.5 rounded-full shadow-2xs z-10 flex items-center gap-1">
                            <Check size={10} /> Active
                          </span>
                        )}

                        {t.layout_json ? (
                          <div className="w-full h-full flex items-center justify-center overflow-hidden pointer-events-none select-none bg-white">
                            <BiodataRenderer
                              layoutJson={t.layout_json}
                              data={cardSampleData}
                              scale={0.165}
                              className="shadow-none rounded-none"
                            />
                          </div>
                        ) : t.bgImage ? (
                          <img
                            src={t.bgImage}
                            alt={t.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-pink-50 p-2 text-center">
                            <span className="text-xl mb-1">{t.previewIcon || '📄'}</span>
                            <span className="text-[9px] font-medium text-gray-500">{t.name}</span>
                          </div>
                        )}
                      </div>

                      {/* Card Footer */}
                      <div className="p-2 bg-white border-t border-gray-100 flex flex-col justify-between">
                        <div className="text-[11px] sm:text-xs font-bold text-gray-900 truncate">{t.name}</div>
                        <div className="flex items-center justify-between text-[10px] text-gray-400 mt-0.5">
                          <span className="capitalize">{t.category || 'Traditional'}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(t.id);
                            }}
                            className="text-gray-300 hover:text-[#E11D48] transition cursor-pointer"
                          >
                            <Heart
                              size={12}
                              className={isFav ? 'fill-[#E11D48] text-[#E11D48]' : 'text-gray-300'}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── 2. RIGHT/MAIN PANEL: LIVE PREVIEW & CANVAS (Tight Padding & No Top Gap) ── */}
        <div className="flex-1 min-w-0 h-full max-h-[calc(100vh-5.2rem)] min-h-0 flex flex-col bg-[#FFF5F7] rounded-3xl border border-rose-100/90 p-3.5 sm:p-4 overflow-hidden relative shadow-2xs">
          
          {/* Pink Watercolor Floral Accents in 4 corners of workspace */}
          <PinkFloralWorkspaceAccent className="absolute -top-10 -left-10 w-56 h-56" />
          <PinkFloralWorkspaceAccent className="absolute -top-10 -right-10 w-56 h-56 rotate-90" />
          <PinkFloralWorkspaceAccent className="absolute -bottom-10 -left-10 w-56 h-56 -rotate-90" />
          <PinkFloralWorkspaceAccent className="absolute -bottom-10 -right-10 w-56 h-56 rotate-180" />

          {/* Top Canvas Toolbar */}
          <div className="relative z-10 flex items-center justify-between pb-2 shrink-0 gap-2 flex-wrap">
            {/* Left: Live Preview Dot + Current Template Name */}
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isLoadingTemplates ? 'bg-amber-400 animate-ping' : 'bg-emerald-500'}`} />
              <span className="text-xs font-bold text-gray-800">Live Preview</span>
              <span className="text-[11px] font-semibold text-gray-600 bg-white/90 border border-gray-200/80 px-3 py-0.5 rounded-full shadow-2xs">
                {isLoadingTemplates ? 'Loading from Database...' : (currentTemplateObj?.name || 'Template Preview')}
              </span>
            </div>

            {/* Right: Edit Details, Share, Zoom, Undo, Redo, Download PDF */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Edit Details Button */}
              <button
                type="button"
                onClick={handleOpenEdit}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-[#E11D48] font-bold text-xs rounded-full border border-rose-200 transition-all cursor-pointer shadow-2xs"
                title="Edit Biodata Details"
              >
                <Edit3 size={13} />
                <span>Edit Details</span>
              </button>

              {/* Modify Header / Symbol & Shloka Button */}
              <button
                type="button"
                onClick={() => setIsHeaderModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-full border border-amber-300 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
                title="Modify Sacred Symbol & Shloka Header (|| Shri Ganeshay Namah: ||)"
              >
                <Sparkles size={13} className="text-amber-600" />
                <span>Modify Header</span>
              </button>

              {/* Share Button */}
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-rose-50 text-gray-700 hover:text-rose-700 font-semibold text-xs rounded-full border border-gray-200 hover:border-rose-200 transition-all cursor-pointer shadow-2xs"
                title="Share Biodata Options"
              >
                <Share2 size={13} className="text-rose-600" />
                <span>Share</span>
              </button>

              {/* Zoom Dropdown: 60% by default with full zoom options */}
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2.5 py-1 text-xs text-gray-700 font-semibold shadow-2xs">
                <ZoomIn size={12} className="text-gray-400" />
                <select
                  value={customZoom !== null ? Math.round(customZoom * 100) : 'auto'}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'auto') {
                      setCustomZoom(null);
                    } else {
                      setCustomZoom(Number(val) / 100);
                    }
                  }}
                  className="bg-transparent border-none outline-none text-xs text-gray-700 font-semibold cursor-pointer"
                >
                  <option value={50}>50%</option>
                  <option value={60}>60% (Default)</option>
                  <option value={75}>75% (Scrollable)</option>
                  <option value={85}>85% (Readable)</option>
                  <option value={100}>100% (Full Size)</option>
                  <option value={120}>120% (Zoomed)</option>
                  <option value="auto">Auto Fit ({Math.round(autoScale * 100)}%)</option>
                </select>
              </div>

              {/* Undo Button */}
              <button
                type="button"
                onClick={() => {}}
                className="w-7 h-7 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 flex items-center justify-center shadow-2xs transition cursor-pointer"
                title="Undo"
              >
                <Undo2 size={13} />
              </button>

              {/* Redo Button */}
              <button
                type="button"
                onClick={() => {}}
                className="w-7 h-7 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 flex items-center justify-center shadow-2xs transition cursor-pointer"
                title="Redo"
              >
                <Redo2 size={13} />
              </button>

              {/* Download PDF Button */}
              <button
                type="button"
                onClick={handleOpenPdfModal}
                disabled={isLoadingTemplates}
                className={`flex items-center gap-1.5 px-4 py-1.5 bg-[#E11D48] hover:bg-[#D81364] text-white font-bold text-xs rounded-full shadow-xs transition cursor-pointer ${
                  isLoadingTemplates ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                <Download size={13} />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          {/* Canvas Viewport Frame: Starts directly at top (pt-1) with full scroll option */}
          <div
            ref={previewContainerRef}
            className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-auto flex justify-center items-start pt-1.5 pb-6 px-2 no-scrollbar scrollbar-none [&::-webkit-scrollbar]:hidden"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <div
              id="biodata-preview-wrapper"
              style={{
                width: `${794 * activeScale}px`,
                height: `${1123 * activeScale}px`,
                position: 'relative',
                flexShrink: 0,
                boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.04)',
                borderRadius: `${8 * Math.min(activeScale, 1)}px`,
                overflow: 'hidden',
                transition: 'width 0.15s ease-out, height 0.15s ease-out',
                backgroundColor: '#FFFFFF',
              }}
            >
              {isLoadingTemplates ? (
                /* Sleek Loading State for Preview Canvas */
                <div className="w-full h-full flex flex-col items-center justify-center bg-white text-center p-8 select-none">
                  <div className="w-12 h-12 rounded-full border-3 border-rose-100 border-t-[#E11D48] animate-spin mb-4" />
                  <h3 className="text-base font-bold text-gray-800 tracking-tight">Loading Template Preview...</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-xs">
                    Fetching authentic design layout directly from database
                  </p>
                </div>
              ) : (
                /* Dynamic Preview directly from Database layout */
                <div
                  id="biodata-preview"
                  ref={previewRef}
                  style={{
                    width: '794px',
                    height: '1123px',
                    minHeight: '1123px',
                    maxHeight: '1123px',
                    transform: `scale(${activeScale})`,
                    transformOrigin: 'top left',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    backgroundColor: currentTemplateObj?.defaultBg || '#FFFFFF',
                    overflow: 'hidden',
                  }}
                >
                  {currentTemplateObj?.layout_json ? (
                    <BiodataRenderer
                      layoutJson={currentTemplateObj.layout_json}
                      lang={formData.lang || lang}
                      data={{
                        ...formData,
                        isUserBiodata: true,
                        name: formData.name || 'Candidate',
                        lang: formData.lang || lang,
                        selectedMotifIcon: formData.selectedMotifIcon || '/symbols/ganesha_golden.png',
                        headerMotif: formData.headerMotif || '|| Shri Ganeshay Namah: ||',
                        pageHeader: {
                          deity: formData.headerMotif || '|| Shri Ganeshay Namah: ||',
                          deityIcon: formData.selectedMotifIcon || '/symbols/ganesha_golden.png',
                        },
                      }}
                    />
                  ) : (
                    <div className="w-full h-full relative" style={{ backgroundColor: currentTemplateObj?.defaultBg || '#FFF' }}>
                      {currentTemplateObj?.bgImage && (
                        <img
                          src={currentTemplateObj.bgImage}
                          alt="template bg"
                          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-90"
                        />
                      )}
                      <div className="relative z-10 w-full h-full flex flex-col items-center pt-36 px-14">
                        <h1
                          style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '44px',
                            color: '#1E293B',
                            fontWeight: 700,
                          }}
                          className="text-center"
                        >
                          {formData.name || 'Candidate'}
                        </h1>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* PDF Generator Modal */}
      <PdfGeneratorModal
        isOpen={isPdfOpen}
        onClose={handleClosePdfModal}
        targetElement={previewRef.current}
        candidateName={formData.name || 'Candidate'}
        profileId={profileId}
      />

      {/* Internal Edit Modal fallback */}
      <EditProfileModal
        isOpen={internalEditModalOpen}
        onClose={() => setInternalEditModalOpen(false)}
      />

      {/* Modify Sacred Header & Symbol Modal */}
      <ModifyHeaderModal
        isOpen={isHeaderModalOpen}
        onClose={() => setIsHeaderModalOpen(false)}
        initialSymbol={formData.selectedMotifIcon || '/symbols/ganesha_golden.png'}
        initialShloka={formData.headerMotif || '|| Shri Ganeshay Namah: ||'}
        onApply={handleApplyHeader}
      />

      {/* Share Biodata Modal */}
      <BiodataShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        formData={formData}
        slug={slug}
        profileId={profileId}
      />
    </div>
  );
};
