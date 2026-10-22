import React, { useState } from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { cmToFeetInches } from '../../utils/biodataHelpers';
import { AlertCircle } from 'lucide-react';
import { validateGeneralText } from '../../utils/nameValidation';

export const QPartnerPreferences: React.FC = () => {
  const { formData, updateFormData } = useBiodata();
  const [eduError, setEduError] = useState<string | null>(() => {
    const check = validateGeneralText(formData.expectedEducation, 'Expected Education / Profession');
    return check.isValid ? null : check.error;
  });

  const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    updateFormData({ expectedEducation: val });
    const check = validateGeneralText(val, 'Expected Education / Profession');
    setEduError(check.isValid ? null : check.error);
  };

  const minAge = formData.expectedAgeMin || 22;
  const maxAge = formData.expectedAgeMax || 32;
  const minHeight = formData.expectedHeightMin || 152;
  const maxHeight = formData.expectedHeightMax || 185;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start">
      {/* Column 1: Age & Height Ranges */}
      <div className="space-y-4">
        {/* Age Preference Range */}
        <div>
          <div className="flex justify-between text-[11px] sm:text-xs font-[450] text-gray-500 tracking-normal mb-1.5">
            <span>Preferred Age Range</span>
            <span className="text-[#F01472] font-[450]">{minAge} - {maxAge} yrs</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <span className="text-[10px] text-gray-400 font-[450]">Min Age ({minAge})</span>
              <input
                type="range"
                min="18"
                max="60"
                value={minAge}
                onChange={(e) => {
                  const newMin = Number(e.target.value);
                  const newMax = Math.max(newMin + 1, maxAge);
                  updateFormData({ expectedAgeMin: newMin, expectedAgeMax: newMax });
                }}
                className="w-full accent-[#F01472] h-1.5 bg-gray-200 rounded cursor-pointer"
              />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-[450]">Max Age ({maxAge})</span>
              <input
                type="range"
                min="18"
                max="60"
                value={maxAge}
                onChange={(e) => {
                  const newMax = Number(e.target.value);
                  const newMin = Math.min(minAge, newMax - 1);
                  updateFormData({ expectedAgeMax: newMax, expectedAgeMin: newMin });
                }}
                className="w-full accent-[#F01472] h-1.5 bg-gray-200 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Height Preference Range */}
        <div>
          <div className="flex justify-between text-[11px] sm:text-xs font-[450] text-gray-500 tracking-normal mb-1.5">
            <span>Preferred Height</span>
            <span className="text-[#F01472] font-[450]">
              {cmToFeetInches(minHeight)} - {cmToFeetInches(maxHeight)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <span className="text-[10px] text-gray-400 font-[450]">Min ({minHeight} cm)</span>
              <input
                type="range"
                min="135"
                max="210"
                value={minHeight}
                onChange={(e) => updateFormData({ expectedHeightMin: Number(e.target.value) })}
                className="w-full accent-[#F01472] h-1.5 bg-gray-200 rounded cursor-pointer"
              />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-[450]">Max ({maxHeight} cm)</span>
              <input
                type="range"
                min="135"
                max="210"
                value={maxHeight}
                onChange={(e) => updateFormData({ expectedHeightMax: Number(e.target.value) })}
                className="w-full accent-[#F01472] h-1.5 bg-gray-200 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Column 2: Expected Education & Other Expectations */}
      <div className="space-y-3.5">
        {/* Expected Education / Profession */}
        <div>
          <label className="block text-[11px] sm:text-xs font-[450] text-gray-500 tracking-normal mb-1">
            Expected Education / Profession
          </label>
          <input
            type="text"
            maxLength={100}
            value={formData.expectedEducation || ''}
            onChange={handleEducationChange}
            placeholder="e.g. Graduate / Engineer / Doctor / CA"
            className={`wizard-input py-2.5 px-3.5 text-xs sm:text-sm font-[450] transition-all ${
              eduError ? '!border-red-500 !bg-red-50/20 focus:!border-red-500 focus:!ring-red-500/20' : ''
            }`}
          />
          {eduError && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 font-[450] mt-1 animate-fadeIn">
              <AlertCircle size={13} className="shrink-0 text-red-500" />
              <span>{eduError}</span>
            </div>
          )}
        </div>

        {/* Other Expectations */}
        <div>
          <label className="block text-[11px] sm:text-xs font-[450] text-gray-500 tracking-normal mb-1">
            Other Expectations
          </label>
          <textarea
            rows={2}
            maxLength={500}
            value={formData.otherPreferences || ''}
            onChange={(e) => updateFormData({ otherPreferences: e.target.value })}
            placeholder="e.g. Looking for a well-educated, family-oriented partner..."
            className="wizard-input py-2 px-3 text-xs sm:text-sm font-[450] leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};
