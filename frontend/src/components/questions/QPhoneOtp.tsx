import React from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { Phone, ShieldCheck, Share2 } from 'lucide-react';
import { cleanMobileNumber, MOBILE_NUMBER_MAX_LENGTH } from '../../utils/phoneValidation';

export const QPhoneOtp: React.FC = () => {
  const { formData, updateFormData, validationError, setValidationError } = useBiodata();

  const currentVal = formData.contactNumber || '';
  const currentContactTo = formData.contactTo || '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = cleanMobileNumber(e.target.value);
    updateFormData({ contactNumber: cleaned });
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleContactToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = cleanMobileNumber(e.target.value);
    updateFormData({ contactTo: cleaned });
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End', 'Enter'];
    if (
      !allowedKeys.includes(e.key) &&
      !/[0-9]/.test(e.key) &&
      !e.ctrlKey &&
      !e.metaKey
    ) {
      e.preventDefault();
    }
  };

  const handleCopySameNumber = () => {
    if (currentVal) {
      updateFormData({ contactTo: currentVal });
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-start">
        {/* Primary Phone Input */}
        <div>
          <label className="block text-[11px] font-[450] text-gray-500 tracking-normal mb-1.5">
            Primary Mobile Number
          </label>
          <div className="relative flex items-center">
            <Phone className={`absolute left-3.5 pointer-events-none transition-colors ${validationError ? 'text-rose-500' : 'text-rose-400'}`} size={18} />
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={MOBILE_NUMBER_MAX_LENGTH}
              value={currentVal}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="e.g. 9876543210"
              className={`wizard-input with-icon !pl-11 py-2 text-sm sm:text-base font-[450] tracking-wider transition-all ${
                validationError
                  ? '!border-rose-400 !bg-rose-50/40 text-rose-900 focus:!border-rose-500 focus:!ring-rose-500/20'
                  : 'text-gray-900'
              }`}
            />
          </div>
          {validationError ? (
            <p className="text-xs text-rose-600 font-[450] pl-1 mt-1.5 animate-fadeIn">
              {validationError}
            </p>
          ) : (
            <p className="text-[11px] text-gray-400 font-normal pl-1 mt-1">
              Your 10-digit mobile number for account verification.
            </p>
          )}
        </div>

        {/* Public Contact Number (contactTo) Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[11px] font-[450] text-gray-500 tracking-normal">
              Public Contact Number (Visible to Matches)
            </label>
            {currentVal && currentVal !== currentContactTo && (
              <button
                type="button"
                onClick={handleCopySameNumber}
                className="text-[10px] text-rose-600 hover:text-rose-700 font-semibold cursor-pointer underline hover:no-underline"
              >
                Same as mobile
              </button>
            )}
          </div>
          <div className="relative flex items-center">
            <Share2 className="absolute left-3.5 pointer-events-none text-amber-500" size={18} />
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={MOBILE_NUMBER_MAX_LENGTH}
              value={currentContactTo}
              onChange={handleContactToChange}
              onKeyDown={handleKeyDown}
              placeholder="e.g. 9876543210 (parent or self)"
              className="wizard-input with-icon !pl-11 py-2 text-sm sm:text-base font-[450] tracking-wider text-gray-900 transition-all border-gray-200 focus:border-[#F01472]"
            />
          </div>
          <p className="text-[11px] text-gray-400 font-normal pl-1 mt-1">
            Displayed on your discovery profile when prospective matches unlock contact details.
          </p>
        </div>
      </div>

      {/* Security Info Box */}
      <div className="flex items-start gap-3 p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl">
        <ShieldCheck className="text-emerald-500 shrink-0 mt-0.5" size={20} />
        <div>
          <span className="block text-xs sm:text-sm font-[450] text-gray-800">
            Privacy & Contact Control
          </span>
          <span className="block text-[11px] text-gray-500 mt-0.5 leading-relaxed font-normal">
            Your private account number is kept strictly confidential. Only the public contact number you provide above will be revealed to members when they click to unlock contact details.
          </span>
        </div>
      </div>
    </div>
  );
};
