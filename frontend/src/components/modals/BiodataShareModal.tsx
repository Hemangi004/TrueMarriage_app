import React, { useState, useEffect } from 'react';
import type { BiodataForm } from '../../types/biodata';
import { formatBiodataShareText, cmToFeetInches, calculateAge } from '../../utils/biodataHelpers';
import {
  X,
  Copy,
  Check,
  Share2,
  Mail,
  Send,
  FileText,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';

export interface BiodataShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: BiodataForm;
  slug?: string | null;
  profileId?: string | null;
  shareUrl?: string;
  templateName?: string;
}

export const BiodataShareModal: React.FC<BiodataShareModalProps> = ({
  isOpen,
  onClose,
  formData,
  slug,
  profileId,
  shareUrl: customShareUrl,
  templateName,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Resolve public share URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const effectiveIdentifier = slug || profileId || (formData as any)?.slug || (formData as any)?.profileId;
  const computedUrl = effectiveIdentifier
    ? `${baseUrl}/@${effectiveIdentifier}`
    : `${baseUrl}/templates`;
  const shareUrl = customShareUrl || computedUrl;

  // Formatted share text
  const shareText = formatBiodataShareText(formData, shareUrl);

  const candidateName = formData?.name?.trim() || 'Candidate';
  const age = formData?.age || (formData?.dob ? calculateAge(formData.dob) : 0);
  const heightStr = formData?.heightCm ? cmToFeetInches(formData.heightCm) : '';
  const occupation = formData?.occupation || '';
  const community = [formData?.religion, formData?.caste].filter(Boolean).join(' • ');

  const showTemporaryFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  // 1. Copy public link
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      showTemporaryFeedback('Link copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 2200);
    } catch {
      showTemporaryFeedback('Failed to copy link');
    }
  };

  // 2. Copy full formatted text
  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedText(true);
      showTemporaryFeedback('Full biodata text copied!');
      setTimeout(() => setCopiedText(false), 2200);
    } catch {
      showTemporaryFeedback('Failed to copy text');
    }
  };

  // 3. WhatsApp share
  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // 4. Email share
  const handleEmailShare = () => {
    const subject = `Matrimonial Biodata of ${candidateName}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(shareText)}`;
    window.location.href = mailtoUrl;
  };

  // 5. Telegram share
  const handleTelegramShare = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(tgUrl, '_blank', 'noopener,noreferrer');
  };

  // 6. Device Native Share
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Matrimonial Biodata - ${candidateName}`,
          text: shareText,
          url: shareUrl,
        });
      } catch (e: any) {
        if (e?.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const hasNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  const candidatePhoto = formData?.profilePictureUrl || (formData as any)?.photo;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-linear-to-r from-rose-50/50 via-white to-pink-50/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600/10 text-rose-600 flex items-center justify-center shadow-2xs">
              <Share2 size={18} />
            </div>
            <div>
              <h3 id="share-modal-title" className="text-base font-bold text-slate-800 leading-tight">
                Share Biodata
              </h3>
              <p className="text-xs text-slate-500">
                {templateName ? `Template: ${templateName}` : 'Share with prospects and family'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close share modal"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Temporary Feedback Notification */}
        {feedback && (
          <div className="bg-emerald-600 text-white text-xs font-medium px-4 py-2 flex items-center justify-center gap-1.5 transition-all">
            <Check size={14} />
            <span>{feedback}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4.5">
          {/* Candidate Profile Summary Card */}
          <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {candidatePhoto ? (
                <img
                  src={candidatePhoto}
                  alt={candidateName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-rose-500 to-pink-600 text-white font-bold text-base flex items-center justify-center shadow-xs shrink-0">
                  {candidateName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {candidateName}
                  </h4>
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100/70 text-rose-700">
                    <ShieldCheck size={10} /> Verified
                  </span>
                </div>
                <p className="text-xs text-slate-600 truncate mt-0.5">
                  {[
                    age ? `${age} Yrs` : null,
                    heightStr || null,
                    occupation || null,
                    community || null,
                  ]
                    .filter(Boolean)
                    .join(' • ') || 'Matrimonial Profile'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Copy Link Bar */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Public Profile Link
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-mono focus:outline-none focus:ring-1 focus:ring-rose-400 select-all"
                />
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs ${
                  copiedLink
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700 text-white'
                }`}
              >
                {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Sharing Options Grid */}
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-2">
              Choose Sharing Method
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* WhatsApp Option */}
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="group p-3 rounded-xl border border-emerald-200/90 bg-emerald-50/50 hover:bg-emerald-100/70 hover:border-emerald-300 text-left transition flex items-center justify-between gap-2.5 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-950 flex items-center gap-1">
                      WhatsApp
                      <span className="text-[9px] font-semibold bg-emerald-200/80 text-emerald-800 px-1.5 py-0.2 rounded-full">
                        Popular
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-700/90 leading-tight mt-0.5">
                      Send to chat or family group
                    </p>
                  </div>
                </div>
                <ExternalLink size={13} className="text-emerald-500 shrink-0" />
              </button>

              {/* Email Option */}
              <button
                type="button"
                onClick={handleEmailShare}
                className="group p-3 rounded-xl border border-blue-200/90 bg-blue-50/50 hover:bg-blue-100/70 hover:border-blue-300 text-left transition flex items-center justify-between gap-2.5 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                    <Mail size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-blue-950">
                      Email
                    </div>
                    <p className="text-[11px] text-blue-700/90 leading-tight mt-0.5">
                      Send formal biodata email
                    </p>
                  </div>
                </div>
                <ExternalLink size={13} className="text-blue-500 shrink-0" />
              </button>

              {/* Copy Formatted Text */}
              <button
                type="button"
                onClick={handleCopyText}
                className="group p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-300 text-left transition flex items-center justify-between gap-2.5 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-lg text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform ${
                      copiedText ? 'bg-emerald-600' : 'bg-slate-700'
                    }`}
                  >
                    {copiedText ? <Check size={18} /> : <FileText size={18} />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {copiedText ? 'Text Copied!' : 'Copy Biodata Text'}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
                      Ready for SMS, notes, or apps
                    </p>
                  </div>
                </div>
                <Copy size={13} className="text-slate-400 shrink-0" />
              </button>

              {/* Telegram Option */}
              <button
                type="button"
                onClick={handleTelegramShare}
                className="group p-3 rounded-xl border border-sky-200/90 bg-sky-50/50 hover:bg-sky-100/70 hover:border-sky-300 text-left transition flex items-center justify-between gap-2.5 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-sky-500 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                    <Send size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-sky-950">
                      Telegram
                    </div>
                    <p className="text-[11px] text-sky-700/90 leading-tight mt-0.5">
                      Share to contacts & channels
                    </p>
                  </div>
                </div>
                <ExternalLink size={13} className="text-sky-500 shrink-0" />
              </button>
            </div>

            {/* Device Native Share (More Options) */}
            {hasNativeShare && (
              <button
                type="button"
                onClick={handleNativeShare}
                className="w-full mt-2.5 py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <Share2 size={14} className="text-slate-500" />
                <span>More Sharing Options (Device System Share)</span>
              </button>
            )}
          </div>

          {/* Expandable Text Preview Accordion */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="w-full flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-slate-800 transition py-1 cursor-pointer"
            >
              <span>Preview formatted message text</span>
              {showPreview ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {showPreview && (
              <div className="mt-2 p-3 bg-slate-900 text-slate-100 text-[11px] font-mono rounded-xl max-h-48 overflow-y-auto leading-relaxed whitespace-pre-wrap select-all">
                {shareText}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500">
          <span>TrueMarriage Verified Biodata</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 font-semibold transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
