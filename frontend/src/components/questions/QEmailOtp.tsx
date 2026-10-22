import React from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { isDisposableEmail, COMMON_EMAIL_ERROR_MSG } from '../../utils/disposableEmail';

export const QEmailOtp: React.FC = () => {
  const { formData, updateFormData, openOtpModal, validationError, setValidationError } = useBiodata();

  const isVerified = formData.emailVerified;
  const emailVal = formData.email || '';
  const isDisposable = emailVal.trim().length > 0 && isDisposableEmail(emailVal.trim());
  const displayError = isDisposable
    ? COMMON_EMAIL_ERROR_MSG
    : validationError;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    updateFormData({ email: val, emailVerified: false });
    if (val.trim().length > 0 && isDisposableEmail(val.trim())) {
      setValidationError(COMMON_EMAIL_ERROR_MSG);
    } else if (validationError) {
      setValidationError(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-center">
      {/* Email Input */}
      <div>
        <label className="block text-[11px] font-[450] text-gray-500 tracking-normal mb-1.5">
          Email Address
        </label>
        <div className="relative flex items-center">
          <Mail className={`absolute left-3.5 pointer-events-none transition-colors ${displayError ? 'text-rose-500' : 'text-rose-400'}`} size={18} />
          <input
            type="email"
            value={emailVal}
            onChange={handleEmailChange}
            placeholder="your.name@example.com"
            className={`wizard-input with-icon !pl-11 py-2 text-xs sm:text-sm font-[450] transition-all ${
              displayError
                ? '!border-rose-400 !bg-rose-50/40 text-rose-900 focus:!border-rose-500'
                : 'text-gray-900'
            }`}
          />
        </div>
        {displayError ? (
          <p className="text-xs text-rose-600 font-[450] pl-1 mt-1.5 animate-fadeIn">
            {displayError}
          </p>
        ) : (
          <p className="text-[11px] text-gray-400 font-normal pl-1 mt-1">
            We will email your completed PDF biodata here.
          </p>
        )}
      </div>

      {/* OTP Status Box */}
      <div className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-200 rounded-2xl">
        <div className="flex items-center gap-2.5">
          {isVerified ? (
            <CheckCircle2 className="text-emerald-500" size={20} />
          ) : (
            <ShieldCheck className="text-amber-500" size={20} />
          )}
          <div>
            <span className="block text-xs sm:text-sm font-[450] text-gray-800">
              {isVerified ? 'Email Address Verified' : 'Verify Email Address'}
            </span>
            <span className="block text-[11px] text-gray-500 font-normal">
              {isVerified ? 'Biodata PDFs sent directly to inbox' : 'Receive instant match notifications'}
            </span>
          </div>
        </div>

        {!isVerified && (
          <button
            type="button"
            disabled={isDisposable || !emailVal}
            onClick={() => {
              if (emailVal && !isDisposable) {
                openOtpModal('email', emailVal);
              }
            }}
            className={`px-3 py-1.5 font-[450] text-xs rounded-xl shadow-xs transition-colors shrink-0 ml-2 ${
              isDisposable || !emailVal
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#F01472] text-white hover:bg-[#C80E5A] cursor-pointer'
            }`}
          >
            Send OTP
          </button>
        )}
      </div>
    </div>
  );
};
