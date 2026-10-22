import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
  X,
  FileDown,
  Palette,
  ChevronRight,
  Loader2,
  Sparkles,
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
import { ChooseTemplateModal } from './ChooseTemplateModal';

interface DownloadBiodataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadComplete?: () => void;
  onNavigateToTemplates?: () => void;
}

export const DownloadBiodataModal: React.FC<DownloadBiodataModalProps> = ({
  isOpen,
  onClose,
  onDownloadComplete,
  onNavigateToTemplates,
}) => {
  const navigate = useNavigate();
  const { formData, profileId, slug } = useBiodata();
  const { user } = useAuth();
  const { lang } = useI18n();

  const [isChooseModalOpen, setIsChooseModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generatingOption, setGeneratingOption] = useState<'last_used' | 'custom' | null>(null);

  // Last used template storage
  const [lastUsedTemplateId, setLastUsedTemplateId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('last_used_template_id') || localStorage.getItem('selected_template_id') || null;
  });
  const [lastUsedTemplateName, setLastUsedTemplateName] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('last_used_template_name') || null;
  });

  // Hidden Canvas Rendering State
  const [activeTemplateForRender, setActiveTemplateForRender] = useState<TemplateItem | null>(null);
  const hiddenCanvasRef = useRef<HTMLDivElement>(null);

  // Synchronize last used template name
  useEffect(() => {
    if (isOpen) {
      const id = localStorage.getItem('last_used_template_id') || localStorage.getItem('selected_template_id') || 'modern_minimal_gold';
      setLastUsedTemplateId(id);

      const name = localStorage.getItem('last_used_template_name');
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
    }
  }, [isOpen]);

  // Consolidated user biodata for rendering into high-resolution A4
  const activeUserData = useMemo(() => {
    const fd = formData as any;
    const candidateName = fd?.fullName || fd?.name || user?.full_name || 'Candidate';
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

      // Persist as last downloaded template & update history
      recordDownloadedTemplate(readyTemplate.id, readyTemplate.name);
      setLastUsedTemplateId(readyTemplate.id);
      setLastUsedTemplateName(readyTemplate.name);

      if (onDownloadComplete) onDownloadComplete();
      onClose();
    } catch (err) {
      console.error('Failed to download biodata PDF:', err);
      alert('Unable to generate PDF at this time. Please try again or choose another template.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
      setGeneratingOption(null);
      setActiveTemplateForRender(null);
    }
  };

  /**
   * Option 1: Download with active / last used template
   */
  const handleDownloadLastUsed = async () => {
    setGeneratingOption('last_used');

    const existingId =
      lastUsedTemplateId ||
      localStorage.getItem('last_used_template_id') ||
      localStorage.getItem('selected_template_id') ||
      'modern_minimal_gold';

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
        setIsChooseModalOpen(true);
      }
    } catch (err) {
      console.error('Error fetching last used template:', err);
      alert('Unable to load template for download. Please try choosing a template.');
    } finally {
      setIsGenerating(false);
      setGeneratingOption(null);
    }
  };

  /**
   * Option 2: Choose Template & Download -> Redirects to /templates
   */
  const handleOpenChooseTemplate = () => {
    onClose();
    if (onNavigateToTemplates) {
      onNavigateToTemplates();
    }
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete('profile');
        url.searchParams.delete('edit');
        url.searchParams.delete('tab');
        window.history.replaceState(null, '', url.pathname);
      } catch (e) {}
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/templates');
  };

  const handleSelectTemplateAndDownload = async (template: TemplateItem) => {
    setIsChooseModalOpen(false);
    setGeneratingOption('custom');
    await executePdfDownload(template);
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[100030] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
        onClick={!isGenerating ? onClose : undefined}
      >
        <div
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden space-y-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#F01472] via-[#E11D48] to-[#C80E5A] px-6 py-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <FileDown size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Download Biodata</h3>
                <p className="text-[11px] text-pink-100">Select how you want to export your PDF</p>
              </div>
            </div>
            {!isGenerating && (
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full text-white/80 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Body Options */}
          <div className="p-6 space-y-3.5">
            {/* Generating Progress State */}
            {isGenerating && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3 animate-pulse">
                <Loader2 size={18} className="animate-spin text-[#F01472] shrink-0" />
                <div>
                  <div className="font-bold">Generating Biodata PDF...</div>
                  <div className="text-[11px] text-rose-600">{generationStep}</div>
                </div>
              </div>
            )}

            {/* Option 1: Download Last Downloaded Template */}
            <button
              type="button"
              onClick={handleDownloadLastUsed}
              disabled={isGenerating}
              className={`w-full p-4 rounded-2xl border-2 text-left transition flex items-center gap-3.5 group cursor-pointer ${
                generatingOption === 'last_used'
                  ? 'border-rose-400 bg-rose-50'
                  : 'border-rose-100 hover:border-rose-300 bg-rose-50/40 hover:bg-rose-50'
              }`}
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F01472] to-[#FF4B8B] text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
                {isGenerating && generatingOption === 'last_used' ? (
                  <Loader2 size={20} className="animate-spin text-white" />
                ) : (
                  <FileDown size={20} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#F01472] transition-colors">
                    Download Last Downloaded Template
                  </span>
                  <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                  {lastUsedTemplateName
                    ? `Design: "${lastUsedTemplateName}" (Instant download)`
                    : 'Download with your active / default design'}
                </p>
              </div>
            </button>

            {/* Option 2: Choose Template & Download */}
            <button
              type="button"
              onClick={handleOpenChooseTemplate}
              disabled={isGenerating}
              className={`w-full p-4 rounded-2xl border-2 text-left transition flex items-center gap-3.5 group cursor-pointer ${
                generatingOption === 'custom'
                  ? 'border-purple-400 bg-purple-50'
                  : 'border-purple-100 hover:border-purple-300 bg-purple-50/40 hover:bg-purple-50'
              }`}
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
                {isGenerating && generatingOption === 'custom' ? (
                  <Loader2 size={20} className="animate-spin text-white" />
                ) : (
                  <Palette size={20} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                    Choose Template & Download
                  </span>
                  <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Browse all designs, layouts & themes before downloading
                </p>
              </div>
            </button>
          </div>

          {/* Footer note */}
          <div className="px-6 py-3 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-500" />
              <span>High-resolution print-ready A4 PDF</span>
            </span>
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="text-gray-400 hover:text-gray-600 font-semibold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Visual Template Picker Modal */}
      <ChooseTemplateModal
        isOpen={isChooseModalOpen}
        onClose={() => setIsChooseModalOpen(false)}
        onSelectTemplate={handleSelectTemplateAndDownload}
        lastUsedTemplateId={lastUsedTemplateId}
      />

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
    </>,
    document.body
  );
};
