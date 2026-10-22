import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ShieldCheck, X, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';
import { useBiodata } from '../../context/BiodataContext';
import { useAuth } from '../../context/AuthContext';
import { sendOtpApi, verifyOtpApi } from '../../services/apiService';

const OTP_LENGTH = 6;

export const OTPModal: React.FC = () => {
  const { otpModal, closeOtpModal, verifyOtpSuccess } = useBiodata();
  const auth = useAuth();
  const [otpCode, setOtpCode] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [verifying, setVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState<number>(60);
  const [sending, setSending] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Setup / initial OTP trigger
  useEffect(() => {
    if (!otpModal.isOpen) return;

    setOtpCode(Array(OTP_LENGTH).fill(''));
    setErrorMsg(null);
    setCooldown(60);

    let isMounted = true;

    if (otpModal.alreadyDispatched) {
      setSending(false);
      setSuccessMsg(`Verification code dispatched to ${otpModal.targetValue}`);
    } else if (otpModal.targetValue) {
      setSending(true);
      const type = otpModal.type || 'email';
      sendOtpApi(type, otpModal.targetValue)
        .then((result) => {
          if (isMounted) {
            setSending(false);
            if (result.success) {
              setSuccessMsg(result.message || `Verification code dispatched to ${otpModal.targetValue}`);
            } else {
              setErrorMsg(result.message || 'Failed to send verification code.');
            }
          }
        })
        .catch(() => {
          if (isMounted) {
            setSending(false);
            setErrorMsg('Failed to send verification code. Please try again.');
          }
        });
    }

    // Auto-focus first input box after modal mounts
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 150);

    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [otpModal.isOpen, otpModal.targetValue, otpModal.type, otpModal.alreadyDispatched]);

  if (!otpModal.isOpen) return null;

  const handleDigitChange = (index: number, rawVal: string) => {
    setErrorMsg(null);

    // If pasted or multi-char input
    const cleanDigits = rawVal.replace(/\D/g, '');
    if (cleanDigits.length > 1) {
      const newOtp = [...otpCode];
      for (let i = 0; i < OTP_LENGTH; i++) {
        newOtp[i] = cleanDigits[i] || '';
      }
      setOtpCode(newOtp);
      const nextIndex = Math.min(cleanDigits.length, OTP_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const digit = cleanDigits.slice(-1);
    const newOtp = [...otpCode];
    newOtp[index] = digit;
    setOtpCode(newOtp);

    // Auto-move focus to next box
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpCode[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pastedData) return;

    const newOtp = [...otpCode];
    for (let i = 0; i < OTP_LENGTH; i++) {
      newOtp[i] = pastedData[i] || '';
    }
    setOtpCode(newOtp);
    const nextIndex = Math.min(pastedData.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleResend = async () => {
    if (cooldown > 0 || sending || !otpModal.targetValue) return;

    setSending(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const type = otpModal.type || 'email';
      const result = await sendOtpApi(type, otpModal.targetValue);
      setSending(false);
      if (result.success) {
        setSuccessMsg(result.message || `New code sent to ${otpModal.targetValue}`);
        setCooldown(60);
        setOtpCode(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
      } else {
        setErrorMsg(result.message || 'Failed to resend OTP. Please wait.');
      }
    } catch {
      setSending(false);
      setErrorMsg('Failed to resend verification code.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpCode.join('').trim();

    if (code.length < 4) {
      setErrorMsg(`Please enter the complete verification code.`);
      return;
    }

    setVerifying(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const result = await verifyOtpApi(otpModal.type || 'email', otpModal.targetValue, code);
      setVerifying(false);

      if (result && result.success !== false) {
        setSuccessMsg(result.message || 'Verification successful!');
        if (auth?.refreshUser) {
          await auth.refreshUser();
        }
        setTimeout(() => {
          verifyOtpSuccess();
        }, 300);
      } else {
        setErrorMsg(result?.message || 'Invalid or expired OTP code.');
      }
    } catch (err: any) {
      setVerifying(false);
      setErrorMsg(err.message || 'Invalid OTP code. Please check and try again.');
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="glass-card max-w-md w-full rounded-2xl p-6 sm:p-8 relative space-y-6 border border-white/80 shadow-2xl bg-white">
        
        {/* Close button */}
        <button
          onClick={closeOtpModal}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">
            Verify {otpModal.type === 'phone' ? 'Mobile Number' : 'Email Address'}
          </h3>
          <p className="text-xs text-slate-500">
            Enter the 6-digit verification code sent to{' '}
            <strong className="text-slate-800 break-all notranslate" translate="no">{otpModal.targetValue}</strong>
          </p>
        </div>

        {/* Feedback Banners */}
        {sending && (
          <div className="p-3 text-xs rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 shrink-0 animate-spin text-blue-600" />
            <span>Sending verification code to <span className="notranslate" translate="no">{otpModal.targetValue}</span>...</span>
          </div>
        )}

        {errorMsg && !sending && (
          <div className="p-3 text-xs rounded-xl bg-rose-50 text-rose-700 border border-rose-200 flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && !sending && (
          <div className="p-3 text-xs rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* OTP Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2 sm:gap-3 notranslate" translate="no">
            {otpCode.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                id={`otp-input-${index}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                translate="no"
                className="notranslate w-10 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 bg-slate-50 focus:bg-white text-slate-900 outline-none transition-all"
                autoComplete="one-time-code"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={verifying}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {verifying ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Verifying OTP...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Confirm & Verify
              </span>
            )}
          </button>
        </form>

        {/* Resend Action */}
        <div className="text-[12px] text-center text-slate-500">
          Didn't receive code?{' '}
          {cooldown > 0 ? (
            <span className="text-slate-400 font-semibold notranslate" translate="no">
              Resend in <strong className="text-slate-600 notranslate" translate="no">{cooldown}s</strong>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={sending}
              className="text-emerald-600 font-bold hover:underline cursor-pointer"
            >
              Resend Code
            </button>
          )}
        </div>

      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};
