import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Mail,
  Copy,
  Check,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useI18n } from '../../context/I18nContext';

interface HelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpCenterModal: React.FC<HelpCenterModalProps> = ({ isOpen, onClose }) => {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Keyboard close & scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleCopy = () => {
    navigator.clipboard.writeText('support@truemarriage.in');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      q: t('How can I download or print my matrimonial biodata?'),
      a: t('Once you complete filling your details in the Biodata Wizard or choose a design in the Templates gallery, tap "Download PDF" to preview and export high-resolution print-ready copies or share directly via WhatsApp.'),
    },
    {
      q: t('Is my contact information and personal data secure?'),
      a: t('Yes. TrueMarriage enforces 100% genuine verification with strict privacy controls. You can decide whether your phone number and address are visible publicly or shared only upon mutual interest approval.'),
    },
    {
      q: t('How do I update or edit my existing biodata?'),
      a: t('You can log in to your TrueMarriage account anytime and head to "My Profile" or the Biodata Wizard to edit information, replace photos, or switch templates with 1-click auto-save.'),
    },
    {
      q: t('How do I contact support for refunds or billing?'),
      a: t('Simply write to us at support@truemarriage.in with your registered email and payment ID. Our team reviews and resolves requests within 24–48 business hours.'),
    },
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-[100005] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      style={{ isolation: 'isolate' }}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#FFF5F8] via-[#FFEAF3] to-[#FFF0F6] border-b border-pink-100 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F01472] text-white flex items-center justify-center shadow-md shadow-pink-300/40 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1e1b4b] tracking-tight">
                {t('Help & Support')}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {t("We're here to help with your queries")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t('Close Help Center')}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-gray-700 flex items-center justify-center border border-pink-200/60 shadow-2xs transition-all cursor-pointer shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Main Support Email Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-pink-50/70 to-white border border-pink-100/90 text-center flex flex-col items-center">
            <span className="text-[11px] font-bold text-[#F01472] uppercase tracking-wider bg-pink-100/80 px-3 py-1 rounded-full mb-3">
              {t('Official Support Desk')}
            </span>

            <a
              href="mailto:support@truemarriage.in?subject=TrueMarriage%20Support%20Request"
              className="text-lg sm:text-xl font-black text-[#1e1b4b] hover:text-[#F01472] transition-colors tracking-tight break-all"
            >
              support@truemarriage.in
            </a>

            <p className="text-xs text-gray-500 mt-2 max-w-sm leading-relaxed">
              {t('Have questions, feedback, or need help with your biodata? Email us and our team will get back to you within 2–4 hours.')}
            </p>

            <div className="flex items-center gap-2.5 mt-5 w-full max-w-xs">
              <a
                href="mailto:support@truemarriage.in?subject=TrueMarriage%20Support%20Request"
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#F01472] hover:bg-[#D00F60] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
              >
                <Mail size={14} />
                <span>{t('Send Email')}</span>
              </a>

              <button
                type="button"
                onClick={handleCopy}
                className="py-2.5 px-4 rounded-xl bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold border border-gray-200 transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer shrink-0 active:scale-95"
                title={t('Copy to clipboard')}
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-emerald-600" />
                    <span className="text-emerald-700 font-bold">{t('Copied')}</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>{t('Copy')}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick FAQs */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
              {t('Frequently Asked Questions')}
            </h3>

            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200/80 bg-white overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 hover:bg-pink-50/40 transition-colors cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <HelpCircle className="w-3.5 h-3.5 text-[#F01472] shrink-0" />
                      <span>{faq.q}</span>
                    </span>
                    {isOpen ? (
                      <ChevronUp size={15} className="text-gray-400 shrink-0" />
                    ) : (
                      <ChevronDown size={15} className="text-gray-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-3.5 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 shrink-0">
          <span>© 2026 TrueMarriage</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white hover:bg-gray-100 text-gray-700 font-medium border border-gray-200 transition-colors cursor-pointer"
          >
            {t('Close')}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
