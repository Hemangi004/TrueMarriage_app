import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, X, AlertCircle, CheckCircle2, Lock, Mail, User, Eye, EyeOff } from 'lucide-react';
import { useBiodata } from '../../context/BiodataContext';
import { registerApi, initiateGoogleLogin } from '../../services/apiService';
import { isDisposableEmail, COMMON_EMAIL_ERROR_MSG } from '../../utils/disposableEmail';
import { validatePasswordStrength } from '../../utils/passwordPolicy';
import { PasswordChecklist } from '../common/PasswordChecklist';
import { validateFullName } from '../../utils/nameValidation';
import { AuthBannerCarousel } from './AuthBannerCarousel';

interface RegisterPageProps {
  onOpenLogin?: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onOpenLogin }) => {
  const navigate = useNavigate();
  const { openOtpModal, resetFormData } = useBiodata();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const nameValidation = validateFullName(name);
  const isNameTouched = name.length > 0;
  const isNameInvalid = isNameTouched && !nameValidation.isValid;
  const nameErrorText = isNameTouched ? nameValidation.error : null;

  const isEmailDisposable = email.trim().length > 0 && isDisposableEmail(email.trim());
  const passwordCheck = validatePasswordStrength(password);
  const isPasswordInvalid = password.length > 0 && !passwordCheck.isValid;
  const isPasswordMismatch = passwordConfirmation.length > 0 && password !== passwordConfirmation;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (val.length > 50) {
      val = val.slice(0, 50);
      setErrorMsg('Full Name cannot exceed 50 characters.');
    }
    setName(val);
    const check = validateFullName(val);
    if (val.trim().length > 0 && !check.isValid) {
      if (errorMsg && (errorMsg.includes('Full Name') || errorMsg.includes('full name'))) {
        setErrorMsg(check.error);
      }
    } else if (errorMsg && (errorMsg.includes('Full Name') || errorMsg.includes('full name'))) {
      setErrorMsg(null);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errorMsg === COMMON_EMAIL_ERROR_MSG) {
      setErrorMsg(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const nameCheck = validateFullName(name);
    if (!nameCheck.isValid) { setErrorMsg(nameCheck.error); return; }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail) || isDisposableEmail(trimmedEmail)) {
      return;
    }

    const passCheck = validatePasswordStrength(password);
    if (!passCheck.isValid) { setErrorMsg(passCheck.errorMessage || 'Please provide a strong password.'); return; }

    if (password !== passwordConfirmation) { setErrorMsg('Password confirmation does not match password.'); return; }

    setLoading(true);
    try {
      const result = await registerApi({ name: trimmedName, email: trimmedEmail, password, password_confirmation: passwordConfirmation });
      if (result.success) {
        setSuccessMsg('Account created! Opening verification modal...');
        resetFormData();
        setTimeout(() => { openOtpModal('email', trimmedEmail, false); }, 600);
      } else {
        setErrorMsg(result.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => { initiateGoogleLogin(); };

  return (
    <div className="min-h-screen min-h-[100dvh] w-full flex flex-col md:flex-row bg-white overflow-x-hidden">
      {/* LEFT PANEL: Full-Screen Cycling Wedding Banners */}
      <div className="w-full md:w-1/2 h-[280px] sm:h-[340px] md:h-auto md:min-h-screen relative shrink-0">
        <AuthBannerCarousel className="!w-full !h-full md:!min-h-screen" />
      </div>

      {/* RIGHT PANEL: Register Form (Full screen, no outline) */}
      <div className="w-full md:w-1/2 flex-1 flex flex-col justify-center items-center p-5 sm:p-8 md:p-12 lg:p-16 bg-white relative overflow-y-auto pb-[max(2rem,env(safe-area-inset-bottom))]">
        <div className="w-full max-w-[420px] mx-auto flex flex-col justify-center">
          {/* Floating Toast Notification (Zero layout push) */}
          {errorMsg && (
            <div className="absolute top-3 left-4 right-4 z-40 p-2.5 text-xs rounded-xl bg-rose-600 text-white shadow-lg flex items-center justify-between gap-2 animate-fadeIn">
              <div className="flex items-center gap-2 min-w-0">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="truncate font-semibold">{errorMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMsg(null)}
                className="p-0.5 hover:bg-rose-700 rounded-md text-white/80 hover:text-white shrink-0 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          {successMsg && (
            <div className="absolute top-3 left-4 right-4 z-40 p-2.5 text-xs rounded-xl bg-emerald-600 text-white shadow-lg flex items-center justify-between gap-2 animate-fadeIn">
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="truncate font-semibold">{successMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setSuccessMsg(null)}
                className="p-0.5 hover:bg-emerald-700 rounded-md text-white/80 hover:text-white shrink-0 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Brand Logo */}
          <div className="text-left mb-2.5">
            <img
              src="/logo.png"
              alt="True Marriage"
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </div>

          {/* Heading */}
          <div className="text-left mb-3">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1">Create TrueMarriage Account</h3>
            <p className="text-xs text-slate-500 font-normal leading-relaxed">
              Sign up to find verified matches &amp; build your matrimonial biodata.
            </p>
          </div>

          {/* Google OAuth Action Button */}
          <div className="mb-2.5">
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full py-2 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/80 text-slate-700 font-bold text-xs shadow-xs hover:shadow-sm transition flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-2.5">
            <div className="border-t border-slate-200/80 w-full" />
            <span className="bg-white px-3 text-[11px] font-medium text-slate-400 shrink-0">Or with email</span>
            <div className="border-t border-slate-200/80 w-full" />
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-2.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">Full Name</label>
                <span className={`text-[10px] font-mono ${name.length >= 50 ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
                  {name.length}/50
                </span>
              </div>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  maxLength={50}
                  value={name}
                  onChange={handleNameChange}
                  className={`w-full pl-10 pr-3.5 py-2 text-xs font-semibold text-black !text-black rounded-xl border outline-none transition placeholder:text-slate-400 ${
                    isNameInvalid
                      ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-rose-900'
                      : 'border-slate-200/90 focus:border-[#F01472] focus:ring-2 focus:ring-rose-500/20 bg-slate-50/40 hover:bg-slate-50/80 focus:bg-white'
                  }`}
                  required
                />
              </div>
              {isNameInvalid && nameErrorText && (
                <p className="text-[11px] font-medium text-rose-600 mt-1 animate-fadeIn">{nameErrorText}</p>
              )}
              {name.length >= 50 && (
                <p className="text-[11px] font-medium text-rose-600 mt-1 animate-fadeIn">Maximum character limit reached (50 characters max).</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                <input
                  type="email"
                  name="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`w-full pl-10 pr-3.5 py-2 text-xs font-semibold text-black !text-black rounded-xl border outline-none transition placeholder:text-slate-400 ${
                    isEmailDisposable
                      ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-rose-900'
                      : 'border-slate-200/90 focus:border-[#F01472] focus:ring-2 focus:ring-rose-500/20 bg-slate-50/40 hover:bg-slate-50/80 focus:bg-white'
                  }`}
                  required
                />
              </div>
              {isEmailDisposable && (
                <p className="text-[11px] font-medium text-rose-600 mt-1">{COMMON_EMAIL_ERROR_MSG}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="new-password"
                  value={password}
                  onFocus={() => setIsPasswordFocused(true)}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-10 py-2 text-xs font-semibold text-black !text-black rounded-xl border outline-none transition placeholder:text-slate-400 ${
                    isPasswordInvalid
                      ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-rose-900'
                      : 'border-slate-200/90 focus:border-[#F01472] focus:ring-2 focus:ring-rose-500/20 bg-slate-50/40 hover:bg-slate-50/80 focus:bg-white'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer p-1 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {(isPasswordFocused || password.length > 0) && (
                <PasswordChecklist password={password} className="mt-2" />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  autoComplete="new-password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className={`w-full pl-10 pr-10 py-2 text-xs font-semibold text-black !text-black rounded-xl border outline-none transition placeholder:text-slate-400 ${
                    isPasswordMismatch
                      ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-rose-900'
                      : 'border-slate-200/90 focus:border-[#F01472] focus:ring-2 focus:ring-rose-500/20 bg-slate-50/40 hover:bg-slate-50/80 focus:bg-white'
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
                <p className="text-[11px] font-medium text-rose-600 mt-1">Password confirmation does not match password.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 sm:py-3 rounded-xl bg-[#e11d48] hover:bg-[#cf133f] active:scale-[0.99] text-white font-bold text-xs shadow-md shadow-rose-500/20 flex items-center justify-center gap-2 cursor-pointer transition mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Registering Account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" /> Register &amp; Send Verification OTP
                </span>
              )}
            </button>
          </form>

          {onOpenLogin ? (
            <p className="text-[11px] sm:text-xs text-center text-slate-500 pt-3">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onOpenLogin}
                className="text-[#F01472] font-bold hover:underline cursor-pointer ml-0.5"
              >
                Sign in
              </button>
            </p>
          ) : (
            <p className="text-[11px] sm:text-xs text-center text-slate-500 pt-3">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-[#F01472] font-bold hover:underline cursor-pointer ml-0.5"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
