import React, { useState } from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { Clock } from 'lucide-react';
import { validatePlaceOfBirth } from '../../utils/nameValidation';
import { CityAutocomplete } from '../common/CityAutocomplete';

export const QBirthDetails: React.FC = () => {
  const { formData, updateFormData } = useBiodata();
  const [placeError, setPlaceError] = useState<string | null>(() => {
    const res = validatePlaceOfBirth(formData.placeOfBirth);
    return res.isValid ? null : res.error;
  });

  const handleCityChange = (chosenCityWithState: string) => {
    updateFormData({ placeOfBirth: chosenCityWithState });
    const check = validatePlaceOfBirth(chosenCityWithState);
    setPlaceError(check.isValid ? null : check.error);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-start">
      {/* Time of Birth */}
      <div>
        <label className="block text-[11px] font-[450] text-gray-500 tracking-normal mb-1.5">
          Time of Birth
        </label>
        <div className="relative flex items-center">
          <Clock className="absolute left-3.5 text-rose-400 pointer-events-none" size={18} />
          <input
            type="time"
            value={formData.timeOfBirth || ''}
            onChange={(e) => updateFormData({ timeOfBirth: e.target.value })}
            className="wizard-input with-icon !pl-11 py-2 text-xs sm:text-sm font-[450]"
          />
        </div>
        <p className="text-[11px] text-gray-400 mt-1 pl-0.5">Used for horoscope matching & kundali</p>
      </div>

      {/* Place of Birth */}
      <div>
        <label className="block text-[11px] font-[450] text-gray-500 tracking-normal mb-1.5">
          Place of Birth (City & State)
        </label>
        <CityAutocomplete
          value={formData.placeOfBirth || ''}
          onChange={handleCityChange}
          placeholder="Search city of birth (e.g. Pune, Maharashtra)..."
          inputClassName="!py-2 !pl-11 !text-xs sm:!text-sm !rounded-2xl font-[450]"
          error={placeError}
        />
        <p className="text-[11px] text-gray-400 mt-1 pl-1">
          Type to search city, taluka or town from list.
        </p>
      </div>
    </div>
  );
};
