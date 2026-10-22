import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download,
  ChevronDown,
  FileDown,
  Palette,
  CheckCircle2,
  Loader2,
  Check,
} from 'lucide-react';
import { useBiodata } from '../../context/BiodataContext';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import {
  getTemplateDetailApi,
  searchTemplatesApi,
  recordDownloadedTemplate,
  type TemplateItem,
} from '../../services/templateService';
import { BiodataRenderer } from '../rendering/BiodataRenderer';
import { generateHighResPdf, downloadPdfBuffer, type PdfOptions } from '../../utils/pdfGenerator';
import { ChooseTemplateModal } from '../modals/ChooseTemplateModal';

interface DownloadBiodataButtonProps {
  className?: string;
  variant?: 'primary' | 'header' | 'outline' | 'compact';
  onDownloadStart?: () => void;
  onDownloadComplete?: () => void;
}

export const DownloadBiodataButton: React.FC<DownloadBiodataButtonProps> = ({
  className = '',
  variant = 'primary',
  onDownloadStart,
  onDownloadComplete,
}) => {
  const navigate = useNavigate();
  const { formData, profileId, slug } = useBiodata();
  const { user } = useAuth();
  const { lang } = useI18n();

  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isChooseModalOpen, setIsChooseModalOpen] = useState(false);

  // Last used template storage
  const [lastUsedTemplateId, setLastUsedTemplateId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('last_used_template_id') || localStorage.getItem('selected_template_id') || null;
  });
  const [lastUsedTemplateName, setLastUsedTemplateName] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('last_used_template_name') || null;
  });


  // PDF Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [showCompleteToast, setShowCompleteToast] = useState(false);
  const [lastDownloadedFilename, setLastDownloadedFilename] = useState<string>('');

  // Hidden Canvas Rendering State
  const [activeTemplateForRender, setActiveTemplateForRender] = useState<TemplateItem | null>(null);
  const hiddenCanvasRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpenMenu(false);
      }
    };
    if (isOpenMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpenMenu]);

  // Synchronize last used template name if ID exists but name is empty
  useEffect(() => {
    if (lastUsedTemplateId && !lastUsedTemplateName) {
      getTemplateDetailApi(lastUsedTemplateId)
        .then((tpl) => {
          if (tpl?.name) {
            setLastUsedTemplateName(tpl.name);
            localStorage.setItem('last_used_template_name', tpl.name);
          }
        })
        .catch(() => {});
    }
  }, [lastUsedTemplateId, lastUsedTemplateName]);

  // Listen for storage or template_downloaded events across components
  useEffect(() => {
    const handleSync = (e?: Event) => {
      const customEvent = e as CustomEvent<{ id?: string; name?: string }>;
      const id = customEvent?.detail?.id || localStorage.getItem('last_used_template_id') || localStorage.getItem('selected_template_id');
      const name = customEvent?.detail?.name || localStorage.getItem('last_used_template_name');
      if (id) {
        setLastUsedTemplateId(id);
      }
      if (name) {
        setLastUsedTemplateName(name);
      } else if (id) {
        getTemplateDetailApi(id)
          .then((tpl) => {
            if (tpl?.name) {
              setLastUsedTemplateName(tpl.name);
              localStorage.setItem('last_used_template_name', tpl.name);
            }
          })
          .catch(() => {});
      }
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('template_downloaded', handleSync);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('template_downloaded', handleSync);
    };
  }, []);

  // Consolidated user biodata for rendering into high-resolution A4
  const activeUserData = useMemo(() => {
    const candidateName = formData?.name || user?.full_name || 'Candidate';
    return {
      ...formData,
      name: candidateName,
      fullName: candidateName,
      isUserBiodata: true,
      lang: lang || 'en',
      selectedMotifIcon: formData?.selectedMotifIcon || '/symbols/ganesha_golden.png',
      headerMotif: formData?.headerMotif || '|| Shri Ganeshay Namah: ||',
      pageHeader: {
        deity: formData?.headerMotif || '|| Shri Ganeshay Namah: ||',
        deityIcon: formData?.selectedMotifIcon || '/symbols/ganesha_golden.png',
      },
    };
  }, [formData, user, lang]);

  /**
   * Execute PDF Generation using the supplied or fetched template
   */
  const executePdfDownload = async (template: TemplateItem) => {
    try {
      setIsGenerating(true);
      setGenerationStep('Preparing biodata template...');
      if (onDownloadStart) onDownloadStart();

      let readyTemplate = template;
      if (!readyTemplate.layout_json) {
        const full = await getTemplateDetailApi(readyTemplate.id);
        if (full?.layout_json) {
          readyTemplate = full;
        }
      }

      setActiveTemplateForRender(readyTemplate);
      setGenerationStep('Formatting high-resolution A4 canvas...');

      // Allow DOM repaint for hidden canvas
      await new Promise((resolve) => setTimeout(resolve, 250));

      if (!hiddenCanvasRef.current) {
        throw new Error('Canvas container unavailable');
      }

      setGenerationStep('Generating high-resolution PDF...');

      const candidateName = activeUserData.name || 'Candidate';
      const pdfOptions: PdfOptions = {
        paperSize: 'a4',
        orientation: 'portrait',
        resolution: 'ultra',
        printReady: {
          showCropMarks: false,
          highContrastMode: false,
          showHeaderFooter: false,
        },
        passwordProtection: {
          enabled: false,
        },
        digitalSignature: {
          enabled: false,
          type: 'stamp',
        },
        candidateName,
        profileId: profileId || slug || null,
      };

      const pdfBytes = await generateHighResPdf(hiddenCanvasRef.current, pdfOptions);
      const safeName = candidateName.replace(/[^a-zA-Z0-9_\-]/g, '_');
      const filename = `TrueMarriage_Biodata_${safeName}.pdf`;

      downloadPdfBuffer(pdfBytes, filename);

      setLastDownloadedFilename(filename);
      setShowCompleteToast(true);
      setTimeout(() => setShowCompleteToast(false), 4500);

      // Persist as last downloaded template & update history
      recordDownloadedTemplate(readyTemplate.id, readyTemplate.name);
      setLastUsedTemplateId(readyTemplate.id);
      setLastUsedTemplateName(readyTemplate.name);

      if (onDownloadComplete) onDownloadComplete();
    } catch (err) {
      console.error('Failed to download biodata PDF:', err);
      alert('Unable to generate PDF at this time. Please try again or choose another template.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
      setActiveTemplateForRender(null);
    }
  };

  /**
   * Handle user selecting and downloading a new template from modal
   */
  const handleSelectTemplateAndDownload = async (template: TemplateItem) => {
    setIsChooseModalOpen(false);
    setIsOpenMenu(false);
    await executePdfDownload(template);
  };



  /**
   * Download Biodata PDF with active / last used or default template
   */
  const handleDownloadLastUsed = async () => {
    setIsOpenMenu(false);

    const existingId =
      lastUsedTemplateId ||
      localStorage.getItem('last_used_template_id') ||
      localStorage.getItem('selected_template_id');

    if (!existingId) {
      setIsChooseModalOpen(true);
      return;
    }

    try {
      setIsGenerating(true);
      setGenerationStep('Fetching biodata template...');

      let fullTemplate: TemplateItem | null = null;
      try {
        fullTemplate = await getTemplateDetailApi(existingId);
      } catch {
        fullTemplate = null;
      }

      if (!fullTemplate && existingId !== 'modern_minimal_gold') {
        try {
          fullTemplate = await getTemplateDetailApi('modern_minimal_gold');
        } catch {
          fullTemplate = null;
        }
      }

      if (!fullTemplate) {
        const allTpls = await searchTemplatesApi({});
        if (allTpls && allTpls.length > 0) {
          fullTemplate = await getTemplateDetailApi(allTpls[0].id);
        }
      }

      if (fullTemplate) {
        await executePdfDownload(fullTemplate);
      } else {
        alert('Could not load template. Please try again.');
      }
    } catch (err) {
      console.error('Error fetching last used template:', err);
      alert('Unable to load template for download. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Button Style Variant Maps
  const getButtonStyles = () => {
    switch (variant) {
      case 'header':
        return 'px-3.5 py-2 rounded-full bg-gradient-to-r from-[#F01472] to-[#FF4B8B] hover:brightness-105 active:scale-95 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5';
      case 'outline':
        return 'px-3.5 py-2 rounded-xl bg-white hover:bg-rose-50 text-slate-800 hover:text-[#F01472] border border-slate-200 hover:border-rose-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-2xs';
      case 'compact':
        return 'px-2.5 py-1.5 rounded-lg bg-[#F01472] hover:bg-[#C80E5A] text-white font-bold text-[11px] transition cursor-pointer flex items-center gap-1 shadow-xs';
      case 'primary':
      default:
        return 'px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#F01472] via-[#E11D48] to-[#C80E5A] hover:brightness-105 active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-rose-500/30 transition-all duration-150 cursor-pointer flex items-center gap-2';
    }
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Primary Trigger Button: Click "Download Biodata ▼" */}
      <button
        type="button"
        onClick={() => setIsOpenMenu(!isOpenMenu)}
        disabled={isGenerating}
        className={`${getButtonStyles()} ${isGenerating ? 'opacity-80 cursor-wait' : ''}`}
        title="Download Biodata PDF"
      >
        {isGenerating ? (
          <>
            <Loader2 size={14} className="animate-spin text-white" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <Download size={15} strokeWidth={2.2} />
            <span>Download Biodata</span>
            <ChevronDown
              size={14}
              strokeWidth={2.2}
              className={`transition-transform duration-200 ${isOpenMenu ? 'rotate-180' : ''}`}
            />
          </>
        )}
      </button>

      {/* Download Menu Dropdown */}
      {isOpenMenu && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white/95 backdrop-blur-xl border border-rose-100 shadow-2xl p-2 z-[100020] animate-fadeIn">
          <div className="space-y-1">
            {/* 1. Download with Last Used Template */}
            <button
              type="button"
              onClick={handleDownloadLastUsed}
              className="w-full p-2.5 rounded-xl hover:bg-rose-50 text-left transition flex items-start gap-3 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#F01472] group-hover:text-white transition">
                <FileDown size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-rose-700">
                    Download Last Downloaded Template
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {lastUsedTemplateName
                    ? `Design: ${lastUsedTemplateName}`
                    : lastUsedTemplateId
                    ? 'Saved Custom Design'
                    : 'Use active default template'}
                </p>
              </div>
            </button>

            {/* 2. Choose Template and Download */}
            <button
              type="button"
              onClick={() => {
                setIsOpenMenu(false);
                if (window.location.pathname === '/templates') {
                  setIsChooseModalOpen(true);
                } else {
                  navigate('/templates');
                }
              }}
              className="w-full p-2.5 rounded-xl hover:bg-purple-50 text-left transition flex items-start gap-3 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-purple-600 group-hover:text-white transition">
                <Palette size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-purple-700">
                    Choose Template & Download
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  Browse and pick from all biodata designs
                </p>
              </div>
            </button>
          </div>



          {lastUsedTemplateName && (
            <div className="mt-2 pt-2 border-t border-slate-100 px-3 py-1 flex items-center justify-between text-[11px] text-slate-500">
              <span className="truncate">Active: <b className="text-slate-700 font-bold">{lastUsedTemplateName}</b></span>
              <Check size={12} className="text-emerald-600 shrink-0" />
            </div>
          )}
        </div>
      )}

      {/* Hidden DOM Element for High-Resolution PDF Rendering */}
      {activeTemplateForRender && activeTemplateForRender.layout_json && (
        <div
          style={{
            position: 'fixed',
            left: '-9999px',
            top: 0,
            width: '794px',
            height: '1123px',
            zIndex: -9999,
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          <div
            ref={hiddenCanvasRef}
            style={{
              width: '794px',
              height: '1123px',
              backgroundColor: activeTemplateForRender.default_bg || '#FFFFFF',
              boxSizing: 'border-box',
            }}
          >
            <BiodataRenderer
              data={activeUserData}
              layoutJson={activeTemplateForRender.layout_json}
              scale={1}
              lang={formData?.lang || lang}
            />
          </div>
        </div>
      )}

      {/* Floating Generating Banner */}
      {isGenerating && (
        <div className="fixed bottom-6 right-6 z-[100060] px-4 py-3 rounded-2xl bg-slate-900/95 text-white shadow-2xl backdrop-blur-md border border-slate-700/60 flex items-center gap-3 animate-fadeIn">
          <Loader2 size={18} className="animate-spin text-pink-400" />
          <div className="text-xs">
            <span className="font-bold block">Generating Biodata</span>
            <span className="text-slate-300 text-[11px]">{generationStep || 'Processing...'}</span>
          </div>
        </div>
      )}

      {/* Download Complete Toast */}
      {showCompleteToast && (
        <div className="fixed bottom-6 right-6 z-[100060] px-5 py-3 rounded-2xl bg-white text-slate-900 shadow-2xl border border-emerald-200 flex items-center gap-3 animate-bounce">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} />
          </div>
          <div className="text-xs">
            <span className="font-bold text-emerald-800 block">Download Complete!</span>
            <span className="text-slate-500 text-[11px]">
              {lastDownloadedFilename || 'Biodata PDF saved to your downloads.'}
            </span>
          </div>
        </div>
      )}

      {/* Choose Template Modal */}
      <ChooseTemplateModal
        isOpen={isChooseModalOpen}
        onClose={() => setIsChooseModalOpen(false)}
        onSelectTemplate={handleSelectTemplateAndDownload}
        lastUsedTemplateId={lastUsedTemplateId}
      />
    </div>
  );
};
