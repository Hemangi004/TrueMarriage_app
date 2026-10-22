import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { LogIn, AlertCircle, CheckCircle2, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { initiateGoogleLogin } from '../../services/apiService';
import { AuthBannerCarousel } from '../auth/AuthBannerCarousel';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister?: () => void;
  onOpenForgotPassword?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onOpenRegister,
  onOpenForgotPassword,
}) => {
  const { login, executePostLoginAction } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      const isAdmin = result.user?.role === 'ADMIN' || localStorage.getItem('user_role') === 'ADMIN';
      if (isAdmin) {
        setSuccessMsg('Admin login verified! Redirecting to admin panel...');
        window.location.href = '/admin';
        return;
      }

      setSuccessMsg('Login successful!');
      const handled = executePostLoginAction(result.user);
      setTimeout(() => {
        onClose();
        if (!handled || window.location.pathname === '/' || window.location.pathname === '/landing') {
          navigate('/discover');
        }
      }, 400);
    } else {
      setErrorMsg(result.message || 'Invalid email address or password.');
    }
  };

  const handleGoogleAuth = () => {
    initiateGoogleLogin();
  };

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex flex-col md:flex-row md:items-center md:justify-center p-0 md:p-6 bg-white md:bg-pink-950/20 md:backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div
        className="w-full max-w-none md:max-w-[760px] min-h-[100dvh] md:min-h-0 h-full md:h-auto bg-white rounded-none md:rounded-[26px] shadow-none md:shadow-2xl overflow-y-auto md:overflow-hidden flex flex-col md:flex-row relative my-0 md:my-auto border-0 md:border md:border-pink-100/70"
        onClick={(e) => e.stopPropagation()}
      >
        

        {/* 🌸 LEFT PANEL: 5-Second Cycling Wedding Banners 🌸 */}
        <AuthBannerCarousel />

        {/* 🌸 RIGHT PANEL: Login Form 🌸 */}
        <div className="w-full md:w-[54%] p-6 sm:p-8 max-md:pb-[max(2.5rem,env(safe-area-inset-bottom,24px))] flex flex-col justify-center text-slate-800 relative bg-white">
          {/* Brand Logo */}
          <div className="text-left mb-3.5">
            <img
              src="/logo.png"
              alt="True Marriage"
              className="h-9 sm:h-10 w-auto object-contain"
            />
          </div>

          {/* Heading */}
          <div className="text-left mb-5">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Welcome Back</h3>
            <p className="text-xs text-slate-500 font-normal leading-relaxed">
              Sign in to manage your biodata, browse curated matches &amp; track interactions.
            </p>
          </div>

          {/* Google OAuth Action Button */}
          <div className="mb-4">
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/80 text-slate-700 font-bold text-xs shadow-xs hover:shadow-sm transition flex items-center justify-center gap-2.5 cursor-pointer"
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
          <div className="relative flex items-center justify-center mb-4">
            <div className="border-t border-slate-200/80 w-full" />
            <span className="bg-white px-3 text-[11px] font-medium text-slate-400 shrink-0">
              Or with email
            </span>
            <div className="border-t border-slate-200/80 w-full" />
          </div>

          {/* Feedback Banners */}
          {errorMsg && (
            <div className="p-3 text-xs rounded-xl bg-rose-50 text-rose-700 border border-rose-200 flex items-start gap-2 mb-3.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 text-xs rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-2 mb-3.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
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
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs font-semibold text-black !text-black rounded-xl border border-slate-200/90 focus:border-[#F01472] focus:ring-2 focus:ring-rose-500/20 outline-none transition bg-slate-50/40 hover:bg-slate-50/80 focus:bg-white placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">Password</label>
                {onOpenForgotPassword && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenForgotPassword();
                    }}
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
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-xs font-semibold text-black !text-black rounded-xl border border-slate-200/90 focus:border-[#F01472] focus:ring-2 focus:ring-rose-500/20 outline-none transition bg-slate-50/40 hover:bg-slate-50/80 focus:bg-white placeholder:text-slate-400"
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 sm:py-3 rounded-xl bg-[#e11d48] hover:bg-[#cf133f] active:scale-[0.99] text-white font-bold text-xs shadow-md shadow-rose-500/20 flex items-center justify-center gap-2 cursor-pointer transition mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </span>
              )}
            </button>
          </form>

          {onOpenRegister && (
            <p className="text-[11px] sm:text-xs text-center text-slate-500 pt-3 sm:pt-4">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenRegister();
                }}
                className="text-[#F01472] font-bold hover:underline cursor-pointer ml-0.5"
              >
                Register now
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};
