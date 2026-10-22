import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { KeyRound, X, AlertCircle, CheckCircle2, Lock, Mail, ShieldCheck, Star, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { requestPasswordResetOtpApi, resetPasswordWithOtpApi } from '../../services/apiService';
import { validatePasswordStrength } from '../../utils/passwordPolicy';
import { PasswordChecklist } from '../common/PasswordChecklist';
import { TrueMarriageLogo } from '../common/TrueMarriageLogo';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onOpenLogin,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const passwordCheck = validatePasswordStrength(newPassword);
  const isPasswordInvalid = newPassword.length > 0 && !passwordCheck.isValid;
  const isPasswordMismatch = passwordConfirmation.length > 0 && newPassword !== passwordConfirmation;

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const result = await requestPasswordResetOtpApi(email);
      setLoading(false);
      setInfoMsg(result.message || 'If an account exists for this email address, a reset code has been sent.');
      setStep(2);
    } catch (err: any) {
      setLoading(false);
      const rawMsg = err?.message || '';
      const isTechnicalError =
        rawMsg.includes('JSON') ||
        rawMsg.includes('token') ||
        rawMsg.includes('Unexpected') ||
        rawMsg.includes('Internal S') ||
        rawMsg.includes('<!DOCTYPE') ||
        rawMsg.includes('SyntaxError');
      setErrorMsg(
        isTechnicalError
          ? 'Unable to send reset code at this time. Please try again later.'
          : rawMsg || 'Failed to request password reset code.'
      );
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!code || code.trim().length !== 6) {
      setErrorMsg('Please enter the 6-digit verification code from your email.');
      return;
    }

    const passCheck = validatePasswordStrength(newPassword);
    if (!passCheck.isValid) {
      setErrorMsg(passCheck.errorMessage || 'Please provide a strong password.');
      return;
    }

    if (newPassword !== passwordConfirmation) {
      setErrorMsg('Password confirmation does not match new password.');
      return;
    }

    setLoading(true);
    try {
      const result = await resetPasswordWithOtpApi(email, code.trim(), newPassword, passwordConfirmation);
      setLoading(false);
      if (result.success) {
        setSuccessMsg('Password has been reset successfully! Please log in with your new password.');
        setTimeout(() => {
          onClose();
          onOpenLogin();
        }, 1500);
      } else {
        setErrorMsg(result.message || 'Password reset failed. Please check your code and try again.');
      }
    } catch (err: any) {
      setLoading(false);
      const rawMsg = err?.message || '';
      const isTechnicalError =
        rawMsg.includes('JSON') ||
        rawMsg.includes('token') ||
        rawMsg.includes('Unexpected') ||
        rawMsg.includes('Internal S') ||
        rawMsg.includes('<!DOCTYPE') ||
        rawMsg.includes('SyntaxError');
      setErrorMsg(
        isTechnicalError
          ? 'Unable to reset password at this time. Please try again later.'
          : rawMsg || 'Password reset failed.'
      );
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div
        className="w-full max-w-[760px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ── LEFT PANEL: Brand Theme & Security Graphics ── */}
        <div className="hidden md:flex md:w-[46%] bg-gradient-to-br from-[#1b0a33] via-[#2a0d45] to-[#450e45] p-7 text-white flex-col justify-between relative overflow-hidden select-none">
          {/* Ambient Decorative Lighting */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-500/15 rounded-full blur-2xl pointer-events-none" />

          {/* Top Tagline */}
          <div className="relative z-10 space-y-1">
            <h4 className="text-xl font-black text-white tracking-tight leading-snug">
              Protecting Your Sacred Connection & Privacy
            </h4>
          </div>

          {/* Center Graphic */}
          <div className="relative z-10 my-auto py-6 flex items-center justify-center">
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-[220px] bg-white/10 backdrop-blur-xl rounded-2xl p-4 text-white shadow-2xl border border-white/20 text-center space-y-3"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-r from-[#F01472] to-[#C80E5A] text-white flex items-center justify-center shadow-lg shadow-rose-500/30">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <div className="text-xs font-black tracking-wide text-white">Bank-Grade Encryption</div>
                <p className="text-[10px] text-pink-200/90 mt-0.5">End-to-end OTP verification & session protection</p>
              </div>
              <div className="pt-2 border-t border-white/15 flex items-center justify-center gap-2 text-[10px] font-bold text-pink-100">
                <KeyRound size={12} className="text-amber-300" />
                <span>Zero Password Leakage</span>
              </div>
            </motion.div>
          </div>

          {/* Bottom Trust Indicators */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] text-pink-100/80 font-medium">
            <span className="flex items-center gap-1">
              <Star size={11} className="text-amber-300 fill-amber-300" /> 100% Verified Profiles
            </span>
            <span>•</span>
            <span>🔒 Confidential & Secure</span>
          </div>
        </div>

        {/* ── RIGHT PANEL: Reset Form ── */}
        <div className="w-full md:w-[54%] p-5 sm:p-7 md:p-8 flex flex-col justify-center text-slate-800 relative bg-white">
          {/* Header */}
          <div className="text-left space-y-1.5 mb-5">
            <TrueMarriageLogo variant="full" size="sm" className="mb-2" />
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {step === 1 ? 'Reset Password' : 'Set New Password'}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {step === 1
                ? 'Enter your registered email address to receive a secure 6-digit reset code.'
                : 'Enter the 6-digit code from your email along with your new password.'}
            </p>
          </div>

          {/* Feedback Banners */}
          {errorMsg && (
            <div className="p-3 text-xs rounded-xl bg-rose-50 text-rose-700 border border-rose-200 flex items-start gap-2 mb-4 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {infoMsg && (
            <div className="p-3 text-xs rounded-xl bg-pink-50 text-[#C80E5A] border border-pink-200 flex items-start gap-2 mb-4">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{infoMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 text-xs rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form Step 1: Request OTP */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                  <input
                    type="email"
                    placeholder="e.g. priya@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200 focus:border-[#F01472] focus:ring-2 focus:ring-rose-500/20 outline-none transition bg-slate-50/50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F01472] to-[#C80E5A] text-white font-extrabold text-xs hover:from-rose-600 hover:to-rose-700 disabled:opacity-50 transition shadow-md shadow-rose-500/25 flex items-center justify-center gap-2 cursor-pointer mt-3"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Sending Code...
                  </span>
                ) : (
                  <span>Send Code</span>
                )}
              </button>
            </form>
          )}

          {/* Form Step 2: Verification Code & New Password */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-3.5">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">6-Digit Verification Code</label>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[11px] font-bold text-[#F01472] hover:underline cursor-pointer"
                  >
                    Change Email
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center tracking-[0.35em] font-mono text-lg py-2 rounded-xl border border-slate-200 focus:border-[#F01472] focus:ring-2 focus:ring-rose-500/20 outline-none transition bg-slate-50/50 focus:bg-white font-bold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Enter strong password (min 8 chars)"
                    value={newPassword}
                    onFocus={() => setIsPasswordFocused(true)}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full pl-10 pr-10 py-2.5 text-xs font-medium rounded-xl border outline-none transition ${
                      isPasswordInvalid
                        ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-rose-900'
                        : 'border-slate-200 focus:border-[#F01472] focus:ring-2 focus:ring-rose-500/20 bg-slate-50/50 focus:bg-white'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer p-1 focus:outline-none"
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                    title={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {(isPasswordFocused || newPassword.length > 0) && (
                  <PasswordChecklist password={newPassword} className="mt-2" />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter new password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    className={`w-full pl-10 pr-10 py-2.5 text-xs font-medium rounded-xl border outline-none transition ${
                      isPasswordMismatch
                        ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-rose-900'
                        : 'border-slate-200 focus:border-[#F01472] focus:ring-2 focus:ring-rose-500/20 bg-slate-50/50 focus:bg-white'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer p-1 focus:outline-none"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {isPasswordMismatch && (
                  <p className="text-[11px] font-medium text-rose-600 mt-1">
                    Password confirmation does not match new password.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F01472] to-[#C80E5A] text-white font-extrabold text-xs hover:from-rose-600 hover:to-rose-700 disabled:opacity-50 transition shadow-md shadow-rose-500/25 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Resetting Password...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Update Password & Invalidate Sessions
                  </span>
                )}
              </button>
            </form>
          )}

          <p className="text-[12px] text-center text-slate-500 pt-4">
            Remember your password?{' '}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenLogin();
              }}
              className="text-[#F01472] font-bold hover:underline cursor-pointer"
            >
              Back to Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};
