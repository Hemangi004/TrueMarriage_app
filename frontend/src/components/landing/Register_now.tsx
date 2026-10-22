import React, { useState } from 'react';
import {
  X, Mail, Lock, Phone, KeyRound, Eye, EyeOff, ArrowRight, ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
// motion removed
import { useBiodata } from '../../context/BiodataContext';
import { TrueMarriageLogo } from '../common/TrueMarriageLogo';
import { AuthBannerCarousel } from '../auth/AuthBannerCarousel';

import { isDisposableEmail, COMMON_EMAIL_ERROR_MSG } from '../../utils/disposableEmail';
import { validatePasswordStrength } from '../../utils/passwordPolicy';
import { PasswordChecklist } from '../common/PasswordChecklist';
import { validateFullName } from '../../utils/nameValidation';
import { cleanMobileNumber, validateMobileNumber, MOBILE_NUMBER_MAX_LENGTH } from '../../utils/phoneValidation';

interface RegisterNowProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin?: () => void;
}

type AuthMode = 'login' | 'register' | 'otp' | 'forgot_password';

export const Register_now: React.FC<RegisterNowProps> = ({ isOpen, onClose, onOpenLogin }) => {
  const { goToWizard } = useBiodata();

  const [authMode, setAuthMode] = useState<AuthMode>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetMessages = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    resetMessages();
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage('Successfully connected with Google! Redirecting...');
      setTimeout(() => { onClose(); goToWizard(); }, 1200);
    }, 800);
  };

  const handleFacebookLogin = () => {
    setLoading(true);
    resetMessages();
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage('Successfully connected with Facebook! Redirecting...');
      setTimeout(() => { onClose(); goToWizard(); }, 1200);
    }, 800);
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!email || !password) { setErrorMessage('Please enter both email and password.'); return; }

    if (authMode === 'register') {
      const nameCheck = validateFullName(fullName);
      if (!nameCheck.isValid) { setErrorMessage(nameCheck.error); return; }
    }

    if (authMode === 'register' && isDisposableEmail(email.trim())) {
      setErrorMessage(COMMON_EMAIL_ERROR_MSG); return;
    }

    if (authMode === 'register') {
      const passCheck = validatePasswordStrength(password);
      if (!passCheck.isValid) { setErrorMessage(passCheck.errorMessage || 'Please enter a strong password.'); return; }
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage(
        authMode === 'register'
          ? `Account created for ${fullName || email}! Welcome to TrueMarriage.`
          : `Welcome back! Logged in as ${email}.`
      );
      setTimeout(() => { onClose(); goToWizard(); }, 1200);
    }, 900);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    const phoneCheck = validateMobileNumber(phoneNumber);
    if (!phoneCheck.isValid) { setErrorMessage(phoneCheck.error); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setSuccessMessage(`4-digit OTP sent to ${cleanMobileNumber(phoneNumber)}. Demo code: 5829`);
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    if (otpCode === '5829' || otpCode === '1234' || otpCode.length === 4) {
      setSuccessMessage('Phone verified successfully! Redirecting...');
      setTimeout(() => { onClose(); goToWizard(); }, 1200);
    } else {
      setErrorMessage('Invalid OTP code. Try entering 5829.');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    if (!email) { setErrorMessage('Please enter your registered email address.'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage(`Password reset link sent to ${email}. Check your inbox!`);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-pink-950/20 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div
        className="w-full max-w-[760px] bg-white rounded-[26px] shadow-2xl overflow-hidden flex flex-col md:flex-row relative my-auto border border-pink-100/70"
        onClick={(e) => e.stopPropagation()}
      >
        

        {/* 🌸 LEFT PANEL: 5-Second Cycling Wedding Banners 🌸 */}
        <AuthBannerCarousel />
        {/* â”€â”€ RIGHT PANEL: Form â”€â”€ */}
        <div className="w-full md:w-[54%] p-6 sm:p-10 flex flex-col justify-center text-slate-800 relative bg-white max-h-[90vh] overflow-y-auto">
          <TrueMarriageLogo variant="full" size="sm" className="mb-4" />

          {/* Alerts */}
          {successMessage && (
            <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <X size={16} className="text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* â”€â”€ Login / Register tabs â”€â”€ */}
          {(authMode === 'login' || authMode === 'register') && (
            <div>
              {/* Tab switcher */}
              <div className="flex bg-[#f3f4f6] p-1 rounded-2xl mb-5">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); resetMessages(); }}
                  className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                    authMode === 'login' ? 'bg-white text-[#1e1b4b] shadow-sm' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); resetMessages(); }}
                  className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                    authMode === 'register' ? 'bg-white text-[#1e1b4b] shadow-sm' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Register Now
                </button>
              </div>

              {/* Social Buttons */}
              <div className="space-y-3 mb-4">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs hover:shadow transition flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleFacebookLogin}
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs hover:shadow transition flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="12" fill="#1877F2" />
                    <path d="M15.04 12.07h-2.09v7.71h-3.19v-7.71H8.25v-2.71h1.51V7.59c0-1.25.59-3.21 3.21-3.21l2.36.01v2.63h-1.71c-.28 0-.67.14-.67.73v1.61h2.4l-.31 2.72z" fill="#ffffff" />
                  </svg>
                  <span>Continue with Facebook</span>
                </button>
              </div>

              {/* OTP link */}
              <div className="text-center mb-4">
                <button
                  type="button"
                  onClick={() => { setAuthMode('otp'); resetMessages(); }}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#581c87] hover:text-[#7e22ce] transition-colors cursor-pointer"
                >
                  <Phone size={14} className="text-[#581c87]" />
                  <span>Or Login with OTP (Phone / Mobile)</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center mb-4">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-semibold text-slate-500 shrink-0">Or with email</span>
                <div className="border-t border-slate-200 w-full" />
              </div>

              {/* Email / Password Form */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                {authMode === 'register' && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700">Full Name</label>
                      <span className={`text-[11px] font-medium ${fullName.length >= 50 ? 'text-amber-600 font-semibold' : 'text-slate-400'}`}>
                        {fullName.length}/50
                      </span>
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={50}
                      placeholder="Aarav Sharma"
                      value={fullName}
                      onChange={(e) => {
                        const val = e.target.value.slice(0, 50);
                        setFullName(val);
                        const check = validateFullName(val);
                        if (val.trim().length > 0 && !check.isValid) {
                          if (errorMessage && (errorMessage.includes('Full Name') || errorMessage.includes('full name'))) {
                            setErrorMessage(check.error);
                          }
                        } else if (errorMessage && (errorMessage.includes('Full Name') || errorMessage.includes('full name'))) {
                          setErrorMessage(null);
                        }
                      }}
                      className={`w-full px-4 py-2.5 border rounded-xl text-xs font-medium outline-none transition-all ${
                        fullName.length > 0 && !validateFullName(fullName).isValid
                          ? 'bg-rose-50 border-rose-400 text-rose-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                          : 'bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#F01472] focus:ring-2 focus:ring-rose-500/20'
                      }`}
                    />
                    {fullName.length >= 50 && (
                      <p className="text-[11px] font-medium text-amber-600 mt-1">Maximum character limit reached (50 characters).</p>
                    )}
                    {fullName.length > 0 && !validateFullName(fullName).isValid && (
                      <p className="text-[11px] font-medium text-rose-600 mt-1">{validateFullName(fullName).error}</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. priya@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errorMessage === COMMON_EMAIL_ERROR_MSG) {
                          setErrorMessage(null);
                        }
                      }}
                      className={`w-full pl-10 pr-3.5 py-2.5 text-xs font-medium rounded-xl border outline-none transition-all ${
                        authMode === 'register' && isDisposableEmail(email.trim())
                          ? 'bg-rose-50 border-rose-400 text-rose-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                          : 'bg-slate-50/50 border-slate-200 focus:bg-white focus:border-[#F01472] focus:ring-2 focus:ring-rose-500/20'
                      }`}
                    />
                  </div>
                  {authMode === 'register' && isDisposableEmail(email.trim()) && (
                    <p className="text-[11px] font-medium text-rose-600 mt-1 pl-1">{COMMON_EMAIL_ERROR_MSG}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">Password</label>
                    {authMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => { setAuthMode('forgot_password'); resetMessages(); }}
                        className="text-[11px] font-bold text-[#F01472] hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter password"
                      value={password}
                      onFocus={() => setIsPasswordFocused(true)}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-10 pr-10 py-2.5 text-xs font-medium rounded-xl border outline-none transition-all ${
                        authMode === 'register' && password.length > 0 && !validatePasswordStrength(password).isValid
                          ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                          : 'bg-slate-50/50 border-slate-200 focus:bg-white focus:border-[#F01472] focus:ring-2 focus:ring-rose-500/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {authMode === 'register' && (isPasswordFocused || password.length > 0) && (
                    <PasswordChecklist password={password} className="mt-2" />
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F01472] to-[#C80E5A] text-white font-extrabold text-xs hover:from-rose-600 hover:to-rose-700 disabled:opacity-50 transition shadow-md shadow-rose-500/25 flex items-center justify-center gap-2 cursor-pointer mt-3"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {authMode === 'register' ? 'Complete Registration' : 'Sign In'}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </button>
              </form>

              {onOpenLogin && authMode === 'register' && (
                <p className="text-[12px] text-center text-slate-500 pt-4">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { onClose(); onOpenLogin(); }}
                    className="text-[#F01472] font-bold hover:underline cursor-pointer"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          )}

          {/* â”€â”€ OTP Login â”€â”€ */}
          {authMode === 'otp' && (
            <div>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); resetMessages(); }}
                className="mb-5 inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <ArrowLeft size={15} />
                <span>Back</span>
              </button>

              <h3 className="text-xl font-black text-slate-900 mb-1">OTP Instant Login</h3>
              <p className="text-xs text-slate-500 mb-5">Login with a one-time verification passcode</p>

              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                      <input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={MOBILE_NUMBER_MAX_LENGTH}
                        required
                        placeholder="9876543210"
                        value={phoneNumber}
                        onKeyDown={(e) => {
                          const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End', 'Enter'];
                          if (!allowed.includes(e.key) && !/[0-9]/.test(e.key) && !e.ctrlKey && !e.metaKey) {
                            e.preventDefault();
                          }
                        }}
                        onChange={(e) => setPhoneNumber(cleanMobileNumber(e.target.value))}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:bg-white focus:border-[#F01472] focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F01472] to-[#C80E5A] text-white font-extrabold text-xs shadow-md shadow-rose-500/25 hover:from-rose-600 hover:to-rose-700 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Send OTP Verification Code</span>
                    <ArrowRight size={15} />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Enter 4-Digit OTP</label>
                    <div className="relative">
                      <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete="one-time-code"
                        maxLength={4}
                        required
                        placeholder="5829"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 text-base tracking-widest font-bold focus:bg-white focus:border-[#F01472] focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1.5 font-medium">Demo hint: Use passcode 5829</p>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F01472] to-[#C80E5A] text-white font-extrabold text-xs shadow-md shadow-rose-500/25 hover:from-rose-600 hover:to-rose-700 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Confirm OTP &amp; Login</span>
                    <CheckCircle2 size={15} />
                  </button>
                  <div className="text-center">
                    <button type="button" onClick={() => setOtpSent(false)} className="text-xs text-[#F01472] font-bold hover:underline cursor-pointer">
                      Change Phone Number
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* â”€â”€ Forgot Password â”€â”€ */}
          {authMode === 'forgot_password' && (
            <div>
              <button
                type="button"
                onClick={() => { setAuthMode('login'); resetMessages(); }}
                className="mb-5 inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <ArrowLeft size={15} />
                <span>Back to Login</span>
              </button>

              <h3 className="text-xl font-black text-slate-900 mb-1">Reset Password</h3>
              <p className="text-xs text-slate-500 mb-5">Enter your email to recover your account</p>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Registered Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. priya@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:bg-white focus:border-[#F01472] focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F01472] to-[#C80E5A] text-white font-extrabold text-xs shadow-md shadow-rose-500/25 hover:from-rose-600 hover:to-rose-700 transition flex items-center justify-center gap-2 cursor-pointer mt-3"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send Password Reset Link <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


