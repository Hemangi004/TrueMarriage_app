import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Crown, FileText, Droplets, Pencil, MessageCircle, Zap, CheckCircle2 } from "lucide-react";
import { DEFAULT_MARATHI_BIODATA_ELEMENTS, type TemplateItem } from "../../services/templateService";
import { BiodataRenderer, DEFAULT_FEMALE_SAMPLE } from "../rendering/BiodataRenderer";
import { TEN_DUMMY_PROFILES } from "../../utils/dummyBiodataProfiles";
import { FloatingPetals } from "../landing/FloatingPetals";
import { useAuth } from "../../context/AuthContext";

interface TemplatePreviewModalProps {
  template: TemplateItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: TemplateItem) => void;
  userData?: any;
}

const DecorativePetal = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 32 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 2 C24 6, 30 15, 28 25 C26 33, 18 36, 14 36 C8 36, 3 31, 4 22 C5 12, 11 4, 16 2 Z"
      fill="url(#modalPetalGrad)"
      opacity="0.82"
    />
    <path
      d="M16 4 C19 12, 17 24, 15 34"
      stroke="rgba(255, 255, 255, 0.45)"
      strokeWidth="1"
      strokeLinecap="round"
    />
    <defs>
      <linearGradient id="modalPetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDA4AF" stopOpacity="0.9" />
        <stop offset="60%" stopColor="#FB7185" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.75" />
      </linearGradient>
    </defs>
  </svg>
);

const FEATURES = [
  { label: "HD Quality PDF",     Icon: FileText,      color: "text-violet-500" },
  { label: "No Watermark",       Icon: Droplets,      color: "text-rose-500"   },
  { label: "Edit Anytime",       Icon: Pencil,        color: "text-orange-500" },
  { label: "WhatsApp Ready",     Icon: MessageCircle, color: "text-emerald-500"},
  { label: "Instant Download",   Icon: Zap,           color: "text-amber-500"  },
];

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  template,
  isOpen,
  onClose,
  onSelectTemplate,
  userData,
}) => {
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || !template) return null;
  const { user, openPremiumCheckout } = useAuth();
  const isPremium = template.pricing_type === "PREMIUM" || Boolean(template.is_luxury);
  const isUnlocked = Boolean(user?.is_premium || user?.role === "ADMIN");
  const requiresPayment = isPremium && !isUnlocked;

  const previewData =
    userData ||
    (template.layout_json?.page as any)?.sampleData ||
    (template.layout_json as any)?.sampleData ||
    (typeof (template as any)?.selectedDummyIndex === 'number'
      ? TEN_DUMMY_PROFILES[(template as any).selectedDummyIndex % TEN_DUMMY_PROFILES.length]?.data
      : null) ||
    (typeof (template.layout_json?.page as any)?.selectedDummyIndex === 'number'
      ? TEN_DUMMY_PROFILES[(template.layout_json?.page as any).selectedDummyIndex]?.data
      : null) ||
    DEFAULT_FEMALE_SAMPLE;

  const resolvedLayout = template.layout_json || {
    page: {
      width: 794,
      height: 1123,
      padding: 32,
      background: template.default_bg || '#FFFDF5',
      fontFamily: template.font_family || 'Playfair Display',
    },
    elements: DEFAULT_MARATHI_BIODATA_ELEMENTS,
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/35 backdrop-blur-md p-4 overflow-y-auto"
      style={{ isolation: "isolate" }}
      onClick={onClose}
    >
      {/* Ambient background floating petals */}
      <FloatingPetals className="opacity-55" />

      <div
        className="relative w-full max-w-5xl bg-white rounded-[28px] md:rounded-[32px] shadow-[0_25px_70px_rgba(244,63,94,0.15),0_10px_30px_rgba(0,0,0,0.06)] border border-rose-100/70 overflow-hidden flex flex-col md:flex-row max-h-[92vh] z-[100000]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Preview"
          className="absolute top-4 right-4 z-30 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 transition cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Left: Romantic Light A4 Preview Canvas */}
        <div className="relative flex-1 bg-gradient-to-br from-[#fff6f8] via-[#fffbfb] to-[#fff1f5] flex items-center justify-center p-8 min-h-[420px] md:min-h-[580px] overflow-hidden select-none">
          {/* Decorative rose petals */}
          <div className="absolute top-[28%] -left-1 w-8 h-10 transform -rotate-[26deg] drop-shadow-xs pointer-events-none z-20">
            <DecorativePetal />
          </div>
          <div className="absolute bottom-[20%] right-4 w-7 h-9 transform rotate-[36deg] drop-shadow-xs pointer-events-none z-20">
            <DecorativePetal />
          </div>
          <div className="absolute bottom-[10%] left-8 w-5 h-7 transform -rotate-[15deg] opacity-70 pointer-events-none z-20">
            <DecorativePetal />
          </div>

          {/* Paper Sheet Preview */}
          <div className="relative z-10 shadow-[0_20px_50px_rgba(244,63,94,0.12),0_8px_20px_rgba(0,0,0,0.06)] rounded-lg overflow-hidden border border-rose-100/60 transform scale-90 sm:scale-100 origin-center bg-white transition-transform duration-300">
            <BiodataRenderer layoutJson={resolvedLayout} data={previewData} scale={0.48} lang={previewData?.lang || (previewData as any)?.lang} />
          </div>
        </div>

        {/* Right: Info Panel */}
        <div className="w-full md:w-84 lg:w-[350px] flex flex-col p-7 space-y-5 overflow-y-auto bg-white">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              {isPremium ? (
                <span className="flex items-center gap-1 px-2.5 py-0.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-extrabold rounded-md shadow-xs">
                  <Crown size={10} /> PRO
                </span>
              ) : (
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold tracking-wider rounded-md uppercase">
                  FREE
                </span>
              )}
              <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] font-bold rounded-md">
                {template.badge || (isPremium ? "VIP" : "#1")}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{template.name}</h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed font-normal">
              {template.description || "Professional matrimonial biodata template."}
            </p>
          </div>

          {/* Features — each with its own distinct icon */}
          <div className="space-y-2.5">
            {FEATURES.map(({ label, Icon, color }) => (
              <div key={label} className="flex items-center gap-2.5 text-xs sm:text-[13px] text-slate-700 font-medium">
                <Icon size={15} className={`shrink-0 ${color}`} />
                <span>{label}</span>
                <CheckCircle2 size={14} className="ml-auto text-emerald-500 shrink-0" />
              </div>
            ))}
          </div>

          {/* Template Info Card */}
          <div className="p-3.5 bg-[#f8f9fc] rounded-2xl border border-slate-100/90 space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-500">
              <span>Preview Profile</span>
              <span className="text-[#F01472] font-bold truncate max-w-[180px]">{previewData?.personalDetails?.fullName || "Candidate"}</span>
            </div>
            <div className="flex justify-between items-center text-slate-500">
              <span>Font</span>
              <span className="text-slate-800 font-semibold">{template.font_family || "Playfair Display"}</span>
            </div>
            <div className="flex justify-between items-center text-slate-500">
              <span>Format</span>
              <span className="text-slate-800 font-semibold">A4 Portrait PDF</span>
            </div>
            <div className="flex justify-between items-center text-slate-500">
              <span>Version</span>
              <span className="text-slate-800 font-semibold">v{template.version || 4}</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="space-y-2.5 mt-auto pt-2">
            <button
              onClick={() => {
                if (requiresPayment) {
                  import('../../services/adminUserAnalysisService')
                    .then((mod) => mod.recordPremiumClickApi())
                    .catch(() => {});
                  openPremiumCheckout('premium_monthly', () => {
                    onSelectTemplate(template);
                    onClose();
                  });
                  return;
                }
                if (isPremium) {
                  import('../../services/adminUserAnalysisService')
                    .then((mod) => mod.recordPremiumClickApi())
                    .catch(() => {});
                } else {
                  import('../../services/adminUserAnalysisService')
                    .then((mod) => mod.recordFreeClickApi())
                    .catch(() => {});
                }
                onSelectTemplate(template);
              }}
              className={`w-full py-3.5 px-6 rounded-full hover:brightness-105 active:scale-[0.99] text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                requiresPayment
                  ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-rose-600 shadow-[0_10px_25px_rgba(245,158,11,0.35)] hover:shadow-[0_14px_32px_rgba(245,158,11,0.48)]'
                  : 'bg-gradient-to-r from-[#e11d48] via-[#e91e63] to-[#f43f5e] shadow-[0_10px_25px_rgba(233,30,99,0.35)] hover:shadow-[0_14px_32px_rgba(233,30,99,0.48)]'
              }`}
            >
              {requiresPayment ? (
                <>
                  <Crown size={15} />
                  <span>Unlock with 30-Day Free Trial</span>
                </>
              ) : (
                <span>Create My Profile</span>
              )}
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-full text-slate-600 hover:text-slate-900 font-semibold text-sm transition cursor-pointer hover:bg-slate-50"
            >
              Close Preview
            </button>
          </div>

          <p className="text-[11px] text-slate-400 text-center font-normal">
            Fill your biodata details after selecting this template
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
