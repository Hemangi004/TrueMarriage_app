import React from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { Calendar as CalendarIcon, Sparkles, AlertCircle } from 'lucide-react';
import { calculateAge, normalizeDobToIso } from '../../utils/biodataHelpers';
import { validateDateOfBirth } from '../../utils/nameValidation';

const MIN_YEAR = 1950;

export const QDobAge: React.FC = () => {
  const { formData, updateFormData, validationError, setValidationError } = useBiodata();

  const minLegalAge = formData.gender === 'Male' ? 21 : 18;

  const handleDateChange = (rawDate: string) => {
    if (!rawDate) {
      updateFormData({ dob: '', age: 0 });
      setValidationError(null);
      return;
    }

    const iso = normalizeDobToIso(rawDate);
    const formattedDob = iso || rawDate;
    const age = calculateAge(formattedDob);
    updateFormData({ dob: formattedDob, age });

    const check = validateDateOfBirth(formattedDob, formData.gender);
    if (!check.isValid) {
      setValidationError(check.error);
    } else {
      setValidationError(null);
    }
  };

  // Calculate dynamic maximum allowed date string for datepicker (18 or 21 years ago)
  const today = new Date();
  const maxDateString = `${today.getFullYear() - minLegalAge}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const currentDobCheck = formData.dob ? validateDateOfBirth(formData.dob, formData.gender) : { isValid: true, error: null };
  const displayError = !currentDobCheck.isValid ? currentDobCheck.error : validationError;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5 items-center">
        {/* Date Input */}
        <div>
          <label className="block text-[11px] sm:text-xs font-[450] text-gray-500 tracking-normal mb-1.5">
            Date of Birth
          </label>
          <div className="relative flex items-center">
            <CalendarIcon
              className={`absolute left-3.5 pointer-events-none transition-colors ${
                displayError ? 'text-rose-500' : 'text-rose-400'
              }`}
              size={18}
            />
            <input
              type="date"
              min={`${MIN_YEAR}-01-01`}
              max={maxDateString}
              value={formData.dob || ''}
              onChange={(e) => handleDateChange(e.target.value)}
              onInput={(e) => handleDateChange((e.target as HTMLInputElement).value)}
              onBlur={(e) => handleDateChange(e.target.value)}
              className={`wizard-input with-icon !pl-11 text-xs sm:text-sm font-[450] cursor-pointer transition-all ${
                displayError
                  ? '!border-rose-400 !bg-rose-50/40 text-rose-900 focus:!border-rose-500'
                  : 'text-gray-900'
              }`}
            />
          </div>
        </div>

        {/* Calculated Age Card */}
        <div>
          <label className="block text-[11px] sm:text-xs font-[450] text-gray-500 tracking-normal mb-1.5">
            Calculated Age
          </label>
          {formData.dob && formData.age >= minLegalAge ? (
            <div className="py-2.5 px-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl flex items-center justify-between animate-fadeIn shadow-2xs">
              <div className="flex items-center gap-2">
                <Sparkles className="text-emerald-600 shrink-0" size={16} />
                <span className="text-xs sm:text-[13px] font-[450] text-gray-700">Verified Age</span>
              </div>
              <span className="text-base sm:text-lg font-[450] text-emerald-700">
                {formData.age} <span className="text-xs font-[450] text-emerald-600">years</span>
              </span>
            </div>
          ) : (
            <div className="py-2.5 px-4 bg-gray-50/80 border border-dashed border-gray-200 rounded-2xl flex items-center gap-2 text-xs text-gray-400 font-[450]">
              <Sparkles size={14} className="text-gray-300 shrink-0" />
              <span>Auto-calculated when date is set</span>
            </div>
          )}
        </div>
      </div>

      {displayError && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs font-[450] text-rose-700 animate-fadeIn">
          <AlertCircle size={15} className="shrink-0 text-rose-600" />
          <span>{displayError}</span>
        </div>
      )}
    </div>
  );
};
