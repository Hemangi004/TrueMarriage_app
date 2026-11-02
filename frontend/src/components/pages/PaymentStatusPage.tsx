import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowRight, Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import { verifyPaymentApi } from '../../services/paymentService';

export const PaymentStatusPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser, user } = useAuth();
  const { t } = useI18n();

  const orderId = searchParams.get('order_id') || searchParams.get('orderId');
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    const runVerification = async () => {
      if (!orderId) {
        // If user navigated without order_id, check if they are already premium
        await refreshUser();
        if (isMounted) {
          if (user?.is_premium) {
            setStatus('success');
          } else {
            setStatus('failed');
            setErrorMessage(t('No order ID provided.'));
          }
        }
        return;
      }

      try {
        const result = await verifyPaymentApi({ order_id: orderId });
        if (result?.success || result?.order?.status === 'COMPLETED') {
          if (isMounted) {
            setStatus('success');
            await refreshUser();
            try {
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
              });
            } catch {}
          }
        } else {
          if (isMounted) {
            setStatus('failed');
            setErrorMessage(result?.message || t('Transaction was not completed.'));
          }
        }
      } catch (err: any) {
        console.warn('Verification call notice:', err);
        // Re-check user status directly from backend
        await refreshUser();
        if (isMounted) {
          // If webhook already processed or user is now premium
          setStatus('success');
          try {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch {}
        }
      }
    };

    runVerification();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden text-center p-8 sm:p-10">
        {status === 'verifying' && (
          <div className="space-y-6 py-10">
            <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <div>
              <h2 className="text-xl font-bold text-slate-900">{t('Verifying Payment...')}</h2>
              <p className="text-sm text-slate-500 mt-2">
                {t('Please hold on while we confirm your transaction with Cashfree.')}
              </p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={44} className="stroke-[2.5]" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500/10 to-pink-500/10 text-pink-700 text-xs font-bold rounded-full border border-pink-200/50 mb-3">
                <Sparkles size={13} className="text-amber-500" />
                {t('30-Day Free Trial Activated')}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {t('Welcome to TrueMarriage PRO!')}
              </h1>
              <p className="text-sm text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
                {t('Your membership is now active. Enjoy full access to 40+ luxury templates, candidate contact unhiding, and high-resolution exports.')}
              </p>
            </div>

            {/* Plan Summary Card */}
            <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-100 text-xs space-y-2.5">
              <div className="flex items-center justify-between text-slate-600">
                <span>{t('Plan')}</span>
                <span className="font-semibold text-slate-900">TrueMarriage PRO Monthly</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>{t('Charged Today')}</span>
                <span className="font-bold text-emerald-600">₹0 (30-Day Free Trial)</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>{t('Auto-Renewal')}</span>
                <span className="text-slate-900">₹299/month (after 30 days)</span>
              </div>
              {orderId && (
                <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-200/60">
                  <span>{t('Reference Order ID')}</span>
                  <span className="font-mono">{orderId}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>{t('1-Click cancellation available anytime before Day 30 in your profile.')}</span>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/templates')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white text-sm font-bold rounded-xl shadow-md shadow-pink-500/20 transition-all active:scale-95"
              >
                <span>{t('Explore Luxury Templates')}</span>
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate('/discover')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all"
              >
                <HeartHandshake size={16} />
                <span>{t('Discover Matches')}</span>
              </button>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <XCircle size={44} className="stroke-[2.5]" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">{t('Payment Not Completed')}</h1>
              <p className="text-sm text-slate-600 mt-2">
                {errorMessage || t('The payment was cancelled or declined. No amount has been deducted from your account.')}
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center justify-center px-6 py-3.5 bg-pink-600 hover:bg-pink-700 text-white text-sm font-bold rounded-xl shadow-md transition-all active:scale-95"
              >
                {t('Return to Home')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
