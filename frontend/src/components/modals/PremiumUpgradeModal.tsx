import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Crown,
  Sparkles,
  PhoneCall,
  DownloadCloud,
  ArrowRight,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import { launchRazorpayCheckout } from '../../services/paymentService';

const PREMIUM_BENEFITS = [
  {
    icon: Clock,
    title: '30-Day Free Trial (₹0 Charged Today)',
    description: 'Instant full PRO access for 30 days without immediate charge. First renewal at ₹299 starts after 30 days.',
    color: 'text-pink-600 bg-pink-50 border border-pink-200/60',
  },
  {
    icon: Crown,
    title: 'Unlock All 40+ Luxury & Royal Templates',
    description: 'Instant access to royal gold foil, emerald velvet, rajwada, and sovereign biodata layouts.',
    color: 'text-amber-600 bg-amber-50 border border-amber-200/60',
  },
  {
    icon: PhoneCall,
    title: 'Reveal Hidden Candidate Contacts',
    description: 'Directly view verified WhatsApp numbers, phone calls, and guardian emails on discovery.',
    color: 'text-[#F01472] bg-pink-50 border border-pink-200/60',
  },
  {
    icon: DownloadCloud,
    title: 'Export & Download All Luxury Biodatas',
    description: 'Download crisp, high-resolution A4 PDFs for any luxury template without watermark.',
    color: 'text-blue-600 bg-blue-50 border border-blue-200/60',
  },
  {
    icon: ShieldCheck,
    title: 'Cancel Anytime With 1-Click',
    description: 'Cancel recurring renewal at any time during your 30-day trial in your account without any charges.',
    color: 'text-emerald-600 bg-emerald-50 border border-emerald-200/60',
  },
];

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlanId?: string;
  onSuccess?: () => void;
}

export const PremiumUpgradeModal: React.FC<PremiumUpgradeModalProps> = ({
  isOpen,
  onClose,
  defaultPlanId = 'premium_monthly',
  onSuccess,
}) => {
  const { refreshUser, showAuthToast } = useAuth();
  const { t } = useI18n();
  const [selectedPlanId, setSelectedPlanId] = useState<string>(defaultPlanId);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (defaultPlanId) {
      setSelectedPlanId(defaultPlanId);
    }
  }, [defaultPlanId, isOpen]);

  // Body scroll lock & Escape key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isProcessing) {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isProcessing, onClose]);

  if (!isOpen) return null;

  const handleProceedToPayment = () => {
    setIsProcessing(true);
    launchRazorpayCheckout({
      planId: selectedPlanId,
      onSuccess: async () => {
        setIsProcessing(false);
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}
        showAuthToast('🎉 Payment Successful! TrueMarriage PRO has been activated.');
        await refreshUser();
        if (onSuccess) onSuccess();
        onClose();
      },
      onError: (err) => {
        setIsProcessing(false);
        console.warn('Checkout error or dismissed:', err);
      },
      onClose: () => {
        setIsProcessing(false);
      },
    });
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100005] flex items-stretch md:items-center justify-center p-0 md:p-5 overflow-hidden md:overflow-y-auto bg-white md:bg-slate-950/70 md:backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isProcessing) {
          onClose();
        }
      }}
      style={{ isolation: 'isolate' }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-none md:max-w-2xl h-[100dvh] md:h-auto max-h-[100dvh] md:max-h-[88vh] bg-white rounded-none md:rounded-3xl shadow-none md:shadow-2xl border-0 md:border md:border-pink-100/90 overflow-hidden flex flex-col animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-white overscroll-contain">
          {/* Trial Guarantee Highlight Box */}
          <div className="mb-4 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#FFF5F8] via-[#FFEAF3] to-[#FFF8FB] border border-pink-200/80 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F01472] to-[#FF4B8B] text-white flex items-center justify-center shadow-xs shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>{t('30 Days 100% Free')}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-white shadow-2xs">
                    {t('ZERO RISK')}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {t('₹0 charged today. Auto-renews at ₹299/month only after 30 days. Cancel anytime with 1 click in your account before day 30 to avoid any charges.')}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {PREMIUM_BENEFITS.map((b, i) => {
              const IconComponent = b.icon;
              return (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl border border-slate-100 bg-[#FFFDFE] hover:bg-white hover:border-pink-200 hover:shadow-xs transition-all flex items-start gap-3"
                >
                  <div className={`p-2 rounded-xl shrink-0 ${b.color}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 leading-snug">{t(b.title)}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{t(b.description)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Sticky Bottom Action Footer */}
        <div className="p-3.5 sm:p-4.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-2.5 shrink-0 pb-[max(0.875rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="w-1/3 sm:w-auto px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer disabled:opacity-50"
          >
            {t('Cancel')}
          </button>

          <button
            type="button"
            onClick={handleProceedToPayment}
            disabled={isProcessing}
            className="flex-1 sm:flex-initial px-5 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#F01472] to-[#FF4B8B] hover:from-[#E00B65] hover:to-[#F01472] shadow-md shadow-pink-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[42px]"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t('Setting Up Free Trial...')}</span>
              </>
            ) : (
              <>
                <span>{t('Start 30-Day Free Trial (₹0 Today)')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
