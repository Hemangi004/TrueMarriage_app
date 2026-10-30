import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Crown,
  X,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import {
  getSubscriptionStatusApi,
  cancelSubscriptionApi,
  type SubscriptionStatus,
} from '../../services/paymentService';

interface ManageSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManageSubscriptionModal: React.FC<ManageSubscriptionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, refreshUser, openPremiumCheckout } = useAuth();
  const { t } = useI18n();

  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // Fetch subscription details whenever modal opens
  useEffect(() => {
    if (!isOpen) {
      setConfirmingCancel(false);
      setError(null);
      setSuccessMessage(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    getSubscriptionStatusApi()
      .then((data) => {
        if (isMounted) {
          setSubscription(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || 'Could not fetch subscription details');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !cancelling) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, cancelling, onClose]);

  const handleCancelSubscription = async () => {
    setCancelling(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await cancelSubscriptionApi();
      setSubscription(res.subscription);
      setSuccessMessage(
        res.message ||
          'Subscription auto-renewal has been successfully cancelled. You maintain full PRO access until your current period ends.'
      );
      setConfirmingCancel(false);
      await refreshUser();
    } catch (err: any) {
      setError(err?.message || 'Failed to cancel subscription renewal. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  if (!isOpen) return null;

  const expiryDate =
    subscription?.premium_until || user?.premium_until
      ? new Date(subscription?.premium_until || (user?.premium_until as string)).toLocaleDateString(
          undefined,
          { year: 'numeric', month: 'long', day: 'numeric' }
        )
      : '30 Days from activation';

  const isCancelled = subscription?.is_cancelled || subscription?.status === 'cancelled';

  return createPortal(
    <div
      className="fixed inset-0 z-[100050] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
      onClick={() => {
        if (!cancelling) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-pink-100 overflow-hidden flex flex-col max-h-[92vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#F01472] to-[#FF4B8B] text-white flex items-center justify-center shadow-md shadow-pink-500/20 shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {t('PRO Subscription')}
              </h3>
              <p className="text-xs text-slate-500">{t('Plan & billing details')}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={cancelling}
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            title={t('Close')}
            aria-label={t('Close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {loading ? (
            <div className="py-10 flex flex-col items-center justify-center gap-2.5 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-[#F01472]" />
              <p className="text-xs font-medium">{t('Loading subscription...')}</p>
            </div>
          ) : (
            <>
              {/* Notifications */}
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                  <div className="flex-1">{error}</div>
                </div>
              )}

              {successMessage && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <div className="flex-1 font-medium">{successMessage}</div>
                </div>
              )}

              {/* Main Plan Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">
                    {subscription?.plan_name || 'TrueMarriage PRO Monthly'}
                  </span>

                  {isCancelled ? (
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      {t('Cancelled')}
                    </span>
                  ) : subscription?.is_in_trial ? (
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-pink-100 text-[#F01472] border border-pink-200 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F01472]" />
                      {t('30-Day Free Trial')}
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {t('Active')}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-slate-900">₹{subscription?.amount || 299}</span>
                  <span className="text-xs text-slate-500 font-medium">/ month</span>
                  {subscription?.is_in_trial && !isCancelled && (
                    <span className="ml-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      ₹0 today
                    </span>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center gap-2 text-xs text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    {isCancelled
                      ? t('Access ends:')
                      : subscription?.is_in_trial
                      ? t('First billing date:')
                      : t('Next billing date:')}{' '}
                    <strong className="text-slate-900 font-bold">{expiryDate}</strong>
                    {subscription?.is_in_trial && !isCancelled && subscription.days_left_in_trial ? (
                      <span className="text-slate-500"> ({subscription.days_left_in_trial} days left)</span>
                    ) : null}
                  </span>
                </div>
              </div>

              {/* Status Note or Actions */}
              {isCancelled ? (
                <div className="space-y-3 pt-1">
                  <p className="text-xs text-slate-500 text-center">
                    {t('No future charges will occur. You have full access until')}{' '}
                    <strong>{expiryDate}</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      openPremiumCheckout('premium_monthly');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#F01472] to-[#FF4B8B] hover:from-[#E00B65] hover:to-[#F01472] shadow-sm shadow-pink-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{t('Reactivate Subscription (₹299/mo)')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : confirmingCancel ? (
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/60 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-rose-900">
                      <p className="font-bold">{t('Cancel auto-renewal?')}</p>
                      <p className="text-rose-700 text-[11px] mt-0.5">
                        {t('You will retain access until')} <strong>{expiryDate}</strong>. {t('No charges will be made.')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setConfirmingCancel(false)}
                      disabled={cancelling}
                      className="flex-1 py-2 px-3 rounded-xl bg-white text-slate-700 border border-slate-200 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      {t('Keep Plan')}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelSubscription}
                      disabled={cancelling}
                      className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {cancelling ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>{t('Cancelling...')}</span>
                        </>
                      ) : (
                        <span>{t('Confirm Cancel')}</span>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-1 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setConfirmingCancel(true)}
                    className="text-xs font-medium text-slate-400 hover:text-rose-600 transition-colors py-1 cursor-pointer"
                  >
                    {t('Cancel subscription renewal')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
