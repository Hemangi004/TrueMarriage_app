import React, { useState } from 'react';
import { X, CheckCircle, Sparkles, ArrowRight, Heart } from 'lucide-react';
import { useBiodata } from '../../context/BiodataContext';
import { isDisposableEmail, COMMON_EMAIL_ERROR_MSG } from '../../utils/disposableEmail';

interface EarlyAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EarlyAccessModal: React.FC<EarlyAccessModalProps> = ({ isOpen, onClose }) => {
  const { goToWizard } = useBiodata();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (name.trim() && !/^[a-zA-Z\s]+$/.test(name.trim())) {
      setErrorMsg('Full Name can only have alphabetic characters and spaces.');
      return;
    }
    if (!email) return;
    if (isDisposableEmail(email.trim())) {
      setErrorMsg(COMMON_EMAIL_ERROR_MSG);
      return;
    }
    setSubmitted(true);
  };

  const handleStartApp = () => {
    onClose();
    goToWizard();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-purple-100 overflow-hidden">
        {/* Decorative Top Gradient Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#ff4b72] via-[#ec4899] to-[#8b5cf6]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={18} />
        </button>

        {!submitted ? (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ff4b72] to-[#ec4899] flex items-center justify-center text-white shadow-lg shadow-pink-500/25 mb-5">
              <Sparkles size={22} />
            </div>

            <h3 className="text-2xl font-extrabold text-[#1e1b4b] tracking-tight mb-2">
              Register Now
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Join thousands of community members and discover easier meetups, verified matrimonial profiles, and seamless event connections.
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 text-xs rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-700">
                    Full Name
                  </label>
                  <span className={`text-[11px] font-medium ${name.length >= 50 ? 'text-amber-600 font-semibold' : 'text-gray-400'}`}>
                    {name.length}/50
                  </span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={50}
                  placeholder="e.g. Aarav Sharma"
                  value={name}
                  onChange={(e) => {
                    const val = e.target.value.slice(0, 50);
                    setName(val);
                    if (val.trim() && !/^[a-zA-Z\s]+$/.test(val.trim())) {
                      setErrorMsg('Full Name can only have alphabetic characters and spaces.');
                    } else if (errorMsg === 'Full Name can only have alphabetic characters and spaces.') {
                      setErrorMsg(null);
                    }
                  }}
                  className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all ${
                    name.trim() && !/^[a-zA-Z\s]+$/.test(name.trim())
                      ? 'bg-rose-50 border-rose-400 text-rose-900 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15'
                      : 'bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:border-[#ff4b72] focus:ring-4 focus:ring-pink-500/15'
                  }`}
                />
                {name.length >= 50 && (
                  <p className="text-[11px] font-medium text-amber-600 mt-1">Maximum character limit reached (50 characters).</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="aarav@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (isDisposableEmail(e.target.value.trim())) {
                      setErrorMsg(COMMON_EMAIL_ERROR_MSG);
                    } else if (errorMsg === COMMON_EMAIL_ERROR_MSG) {
                      setErrorMsg(null);
                    }
                  }}
                  className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all ${
                    isDisposableEmail(email.trim())
                      ? 'bg-rose-50 border-rose-400 text-rose-900 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15'
                      : 'bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:border-[#ff4b72] focus:ring-4 focus:ring-pink-500/15'
                  }`}
                />
                {isDisposableEmail(email.trim()) && (
                  <p className="text-[11px] font-medium text-rose-600 mt-1 pl-1">
                    {COMMON_EMAIL_ERROR_MSG}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-full font-bold text-white text-sm bg-gradient-to-r from-[#ff4b72] to-[#ec4899] hover:from-[#e11d48] hover:to-[#db2777] shadow-lg shadow-pink-500/30 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Complete Registration</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-2xl font-extrabold text-[#1e1b4b] mb-2">You're On The List!</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Welcome, <span className="font-semibold text-gray-900">{name || 'friend'}</span>! You can now jump straight into creating your matrimonial biodata and exploring features.
            </p>

            <button
              onClick={handleStartApp}
              className="w-full py-3.5 px-6 rounded-full font-bold text-white text-sm bg-gradient-to-r from-[#ff4b72] to-[#ec4899] hover:from-[#e11d48] hover:to-[#db2777] shadow-lg shadow-pink-500/30 hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Launch Biodata Creator</span>
              <Heart size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
