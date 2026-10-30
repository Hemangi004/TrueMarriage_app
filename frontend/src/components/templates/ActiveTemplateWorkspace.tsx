import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Check,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Download,
  CheckCircle2,
  Share2,
  Loader2,
  Crown,
} from 'lucide-react';
import { generateHighResPdf, downloadPdfBuffer, type PdfOptions } from '../../utils/pdfGenerator';
import { useBiodata } from '../../context/BiodataContext';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import { recordDownloadedTemplate, type TemplateItem } from '../../services/templateService';
import { BiodataRenderer } from '../rendering/BiodataRenderer';
import { PersonalizationModal } from './PersonalizationModal';
import { EditProfileModal, type TabKey } from '../profile/EditProfileModal';
import { ModifyHeaderModal } from '../summary/ModifyHeaderModal';
import { BiodataShareModal } from '../modals/BiodataShareModal';

interface ActiveTemplateWorkspaceProps {
  activeTemplate: TemplateItem;
  allTemplates: TemplateItem[];
  onSelectTemplate: (template: TemplateItem) => void;
  onBackToCatalog: () => void;
}

interface CustomizationSnapshot {
  templateId: string;
  motifIcon: string;
  headerShloka: string;
}

export const ActiveTemplateWorkspace: React.FC<ActiveTemplateWorkspaceProps> = ({
  activeTemplate,
  allTemplates,
  onSelectTemplate,
  onBackToCatalog,
}) => {
  const { formData, profileId, slug, updateFormData } = useBiodata();
  const { lang } = useI18n();
  const { user, openPremiumCheckout } = useAuth();
  const isTemplatePro = activeTemplate.pricing_type === 'PREMIUM' || Boolean(activeTemplate.is_luxury);
  const isUnlocked = Boolean(user?.is_premium || user?.role === 'ADMIN');
  const requiresPayment = isTemplatePro && !isUnlocked;

  // Share modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Canvas zoom state
  const [zoom, setZoom] = useState<number>(0.85);

  // Auto-fit zoom on mount / window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setZoom(0.42);
      } else if (width < 1024) {
        setZoom(0.65);
      } else if (width < 1440) {
        setZoom(0.82);
      } else {
        setZoom(0.92);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // Modal states
  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('edit') === 'true' || localStorage.getItem('edit_profile_open') === 'true';
    }
    return false;
  });
  const [editProfileInitialTab, setEditProfileInitialTab] = useState<TabKey>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = (params.get('tab') || params.get('section') || '').toLowerCase();
      const validTabs: TabKey[] = ['personal', 'astro', 'career', 'family', 'lifestyle', 'expectations', 'contact', 'photos'];
      if (validTabs.includes(tab as TabKey)) {
        return tab as TabKey;
      }
      const saved = (localStorage.getItem('active_edit_profile_tab') || '').toLowerCase();
      if (validTabs.includes(saved as TabKey)) {
        return saved as TabKey;
      }
    }
    return 'personal';
  });
  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);

  // Toast message
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Auto-save state
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  // History stack for Undo / Redo
  const [history, setHistory] = useState<CustomizationSnapshot[]>([
    {
      templateId: activeTemplate.id,
      motifIcon: formData?.selectedMotifIcon || '/symbols/ganesha_golden.png',
      headerShloka: formData?.headerMotif || '|| Shri Ganeshay Namah: ||',
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const pushSnapshot = (snap: CustomizationSnapshot) => {
    setHistory((prev) => {
      const updated = prev.slice(0, historyIndex + 1);
      return [...updated, snap];
    });
    setHistoryIndex((prev) => prev + 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1;
      const target = history[nextIdx];
      setHistoryIndex(nextIdx);
      applySnapshot(target);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      const target = history[nextIdx];
      setHistoryIndex(nextIdx);
      applySnapshot(target);
    }
  };

  const applySnapshot = (snap: CustomizationSnapshot) => {
    setSaveStatus('saving');
    updateFormData({
      selectedMotifIcon: snap.motifIcon,
      headerMotif: snap.headerShloka,
    });
    const matched = allTemplates.find((t) => t.id === snap.templateId);
    if (matched) {
      onSelectTemplate(matched);
    }
    localStorage.setItem('selected_template_id', snap.templateId);
    setTimeout(() => setSaveStatus('saved'), 400);
  };



  // Header & Shloka application
  const handleApplyHeader = (symbol: string, shloka: string) => {
    setSaveStatus('saving');
    updateFormData({
      selectedMotifIcon: symbol,
      headerMotif: shloka,
    });
    localStorage.setItem('selected_header_symbol', symbol);
    localStorage.setItem('selected_header_shloka', shloka);

    pushSnapshot({
      templateId: activeTemplate.id,
      motifIcon: symbol,
      headerShloka: shloka,
    });

    setIsHeaderModalOpen(false);
    showToast('Auspicious symbol & shloka updated');
    setTimeout(() => setSaveStatus('saved'), 400);
  };

  // Open contextual edit profile
  const handleOpenEditSection = (tab: TabKey) => {
    setEditProfileInitialTab(tab);
    setIsEditProfileOpen(true);
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('edit', 'true');
        url.searchParams.set('tab', tab);
        window.history.replaceState(null, '', url.toString());
        localStorage.setItem('edit_profile_open', 'true');
        localStorage.setItem('active_edit_profile_tab', tab);
      } catch (e) {}
    }
  };

  // DOM ref for PDF generator
  const canvasRef = useRef<HTMLDivElement>(null);

  // Instant Automatic A4 PDF Download
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleInstantDownloadPdf = async () => {
    if (!canvasRef.current || isDownloadingPdf) return;

    if (requiresPayment) {
      openPremiumCheckout('premium_monthly', () => {
        handleInstantDownloadPdf();
      });
      return;
    }

    setIsDownloadingPdf(true);
    showToast('Generating high-resolution A4 PDF...');

    try {
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
        candidateName: formData?.name || 'Candidate',
        profileId,
      };

      const pdfBytes = await generateHighResPdf(canvasRef.current, pdfOptions);
      const safeName = (formData?.name || 'Candidate').replace(/[^a-zA-Z0-9_\-]/g, '_');
      const filename = `truemarriage_Biodata_${safeName}_A4.pdf`;

      downloadPdfBuffer(pdfBytes, filename);
      if (activeTemplate) {
        recordDownloadedTemplate(activeTemplate.id, activeTemplate.name);
      }
      showToast('✓ A4 Biodata downloaded successfully!');
    } catch (err) {
      console.error('PDF download error:', err);
      showToast('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Consolidated user biodata for rendering
  const activeUserData = useMemo(() => {
    return {
      ...formData,
      isUserBiodata: true,
      name: formData?.name || 'Candidate',
      lang,
      selectedMotifIcon: formData?.selectedMotifIcon || '/symbols/ganesha_golden.png',
      headerMotif: formData?.headerMotif || '|| Shri Ganeshay Namah: ||',
      pageHeader: {
        deity: formData?.headerMotif || '|| Shri Ganeshay Namah: ||',
        deityIcon: formData?.selectedMotifIcon || '/symbols/ganesha_golden.png',
      },
    };
  }, [formData, lang]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-br from-rose-50/40 via-white to-pink-50/30">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-20 right-6 z-50 px-4 py-2.5 rounded-2xl shadow-xl shadow-rose-950/10 bg-white/95 text-slate-800 border border-rose-200/90 backdrop-blur-md flex items-center gap-2 text-xs font-semibold animate-toast-bottom-right">
          <CheckCircle2 className="w-4 h-4 text-[#E11D48] shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-rose-100/80 px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2.5 shadow-2xs">
        {/* Left: Back to Templates + Active Template Title + Badge + Saved Status */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
              {activeTemplate.name}
            </h1>
            {activeTemplate.badge && (
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200/60">
                {activeTemplate.badge}
              </span>
            )}
          </div>

          {/* Auto-Save Indicator */}
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full shrink-0">
            <Check size={12} strokeWidth={2.5} className={saveStatus === 'saving' ? 'opacity-40 animate-spin' : ''} />
            <span>{saveStatus === 'saving' ? 'Saving...' : 'Saved'}</span>
          </div>
        </div>

        {/* Right: Undo/Redo + Zoom + Action Buttons [Share] [Personalize] [Download PDF] */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Undo / Redo */}
          <div className="hidden md:flex items-center rounded-full border border-slate-200/90 bg-white p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1.5 rounded-full text-slate-600 hover:text-rose-700 hover:bg-rose-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-600 transition cursor-pointer"
              title="Undo last change"
            >
              <Undo2 size={13} />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 rounded-full text-slate-600 hover:text-rose-700 hover:bg-rose-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-600 transition cursor-pointer"
              title="Redo change"
            >
              <Redo2 size={13} />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center rounded-full border border-slate-200/90 bg-white p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.35, Math.round((z - 0.05) * 100) / 100))}
              className="p-1.5 rounded-full text-slate-600 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut size={13} />
            </button>
            <span className="text-[11px] font-bold text-slate-600 px-2 min-w-[42px] text-center select-none">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.4, Math.round((z + 0.05) * 100) / 100))}
              className="p-1.5 rounded-full text-slate-600 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn size={13} />
            </button>
          </div>

          {/* Share Biodata Button */}
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="px-3.5 py-1.5 rounded-full border border-slate-200/90 bg-white hover:bg-rose-50 hover:border-rose-300 text-slate-700 hover:text-rose-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Share Biodata Options"
          >
            <Share2 size={13} className="text-rose-600" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* Personalize Button */}
          <button
            type="button"
            onClick={() => setIsPersonalizeOpen(true)}
            className="px-4 py-1.5 rounded-full border border-rose-200 bg-rose-50/70 hover:bg-rose-100/90 text-rose-700 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Sparkles size={13} className="text-[#E11D48]" />
            <span>Personalize</span>
          </button>

          {/* Download PDF Button - Instant Automatic A4 Download */}
          <button
            type="button"
            onClick={handleInstantDownloadPdf}
            disabled={isDownloadingPdf}
            className={`px-4 sm:px-5 py-1.5 rounded-full hover:opacity-95 disabled:opacity-75 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
              requiresPayment
                ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-rose-600 shadow-amber-500/25'
                : 'bg-gradient-to-r from-[#E11D48] via-rose-600 to-pink-600 shadow-rose-950/15'
            }`}
          >
            {isDownloadingPdf ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Downloading A4...</span>
              </>
            ) : requiresPayment ? (
              <>
                <Crown size={13} />
                <span>Unlock PRO & Download</span>
              </>
            ) : (
              <>
                <Download size={13} />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>
      </header>



      {/* Main A4 Biodata Canvas Workspace */}
      <main className="flex-1 overflow-auto flex flex-col items-center justify-start py-6 px-4 bg-slate-100/60 relative min-h-0">
        {/* Decorative backdrop glow */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="w-[850px] h-[850px] rounded-full bg-rose-200/25 blur-3xl" />
        </div>

        {/* Layout Box with Exact Scaled Dimensions (Eliminates Empty Space) */}
        <div
          className="relative my-2 group/sheet flex justify-center shrink-0"
          style={{
            width: `${Math.round(794 * zoom)}px`,
            height: `${Math.round(1123 * zoom)}px`,
          }}
        >
          {/* Scaled A4 Sheet Container */}
          <div
            className="transition-transform duration-200 ease-out shadow-2xl rounded-sm absolute top-0 left-0"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              width: '794px',
              height: '1123px',
            }}
          >
            {/* Target A4 element captured for PDF download */}
            <div
              ref={canvasRef}
              id="biodata-canvas-a4"
              className="w-[794px] h-[1123px] overflow-hidden bg-white"
              style={{ width: '794px', height: '1123px' }}
            >
              <BiodataRenderer
                layoutJson={activeTemplate.layout_json}
                lang={formData?.lang || lang}
                data={activeUserData}
                className="rounded-none shadow-none"
              />
            </div>
          </div>

          {/* Subtle Hover Hint to Personalize (Positioned at visible bottom of scaled sheet) */}
          <div
            onClick={() => setIsPersonalizeOpen(true)}
            className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 group-hover/sheet:opacity-100 transition-opacity duration-300 pointer-events-auto cursor-pointer z-10"
          >
            <span className="bg-slate-900/85 hover:bg-slate-900 text-white text-xs font-semibold px-4 py-1.5 rounded-full backdrop-blur-md shadow-lg flex items-center gap-1.5 transition">
              <Sparkles size={13} className="text-amber-400" />
              <span>Click anywhere to personalize this biodata</span>
            </span>
          </div>
        </div>
      </main>

      {/* ── Modals ────────────────────────────────────────── */}

      {/* Personalize Action Sheet */}
      <PersonalizationModal
        isOpen={isPersonalizeOpen}
        onClose={() => setIsPersonalizeOpen(false)}
        onOpenEditSection={handleOpenEditSection}
        onOpenHeaderMotif={() => setIsHeaderModalOpen(true)}
        onOpenShloka={() => setIsHeaderModalOpen(true)}
        onChangeTemplate={onBackToCatalog}
        activeTemplateName={activeTemplate.name}
      />

      {/* Edit Profile Details Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        initialTab={editProfileInitialTab}
        onClose={() => {
          setIsEditProfileOpen(false);
          if (typeof window !== 'undefined') {
            try {
              const url = new URL(window.location.href);
              url.searchParams.delete('edit');
              url.searchParams.delete('tab');
              url.searchParams.delete('section');
              window.history.replaceState(null, '', url.toString());
              localStorage.removeItem('edit_profile_open');
            } catch (e) {}
          }
        }}
        onSaved={() => {
          // EditProfileModal already displays its own "Profile updated successfully" toast
          setSaveStatus('saving');
          setTimeout(() => setSaveStatus('saved'), 400);
        }}
      />

      {/* Auspicious Header Motif & Shloka Modal */}
      <ModifyHeaderModal
        isOpen={isHeaderModalOpen}
        onClose={() => setIsHeaderModalOpen(false)}
        initialSymbol={formData?.selectedMotifIcon || '/symbols/ganesha_golden.png'}
        initialShloka={formData?.headerMotif || '|| Shri Ganeshay Namah: ||'}
        onApply={handleApplyHeader}
      />

      {/* Share Biodata Modal */}
      <BiodataShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        formData={formData}
        slug={slug}
        profileId={profileId}
        templateName={activeTemplate.name}
      />
    </div>
  );
};
