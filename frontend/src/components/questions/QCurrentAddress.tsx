import React, { useState } from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { MapPin } from 'lucide-react';
import { validateNativePlace } from '../../utils/nameValidation';
import { CityAutocomplete } from '../common/CityAutocomplete';

export const QCurrentAddress: React.FC = () => {
  const { formData, updateFormData } = useBiodata();
  const [nativePlaceError, setNativePlaceError] = useState<string | null>(() => {
    const check = validateNativePlace(formData.nativePlace);
    return check.isValid ? null : check.error;
  });

  const handleNativePlaceChange = (chosenCityWithState: string) => {
    updateFormData({ nativePlace: chosenCityWithState });
    const check = validateNativePlace(chosenCityWithState);
    setNativePlaceError(check.isValid ? null : check.error);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start">
      {/* Left: Current Residence */}
      <div>
        <label className="block text-[11px] sm:text-xs font-[450] text-gray-500 tracking-normal mb-1.5">
          Current Residential Address
        </label>
        <div className="relative">
          <MapPin className="absolute left-3.5 top-3 text-rose-400 pointer-events-none" size={18} />
          <textarea
            rows={3}
            maxLength={250}
            value={formData.currentAddress || ''}
            onChange={(e) => updateFormData({ currentAddress: e.target.value })}
            placeholder="e.g. Flat 402, Sunshine Apts, Powai, Mumbai - 400076"
            className="wizard-input with-icon !pl-11 text-xs sm:text-sm font-[450] leading-relaxed"
          />
        </div>
        <p className="text-[11px] text-gray-400 font-normal pl-1 mt-1">
          Include street/area, city, state, and pin code.
        </p>
      </div>

      {/* Right: Native Place / Hometown */}
      <div>
        <label className="block text-[11px] sm:text-xs font-[450] text-gray-500 tracking-normal mb-1.5">
          Native Place / Hometown (City & State)
        </label>
        <CityAutocomplete
          value={formData.nativePlace || ''}
          onChange={handleNativePlaceChange}
          placeholder="Search native city (e.g. Satara)..."
          inputClassName="!py-2.5 !pl-11 !text-xs sm:!text-sm !rounded-2xl font-[450]"
          error={nativePlaceError}
        />
        <p className="text-[11px] text-gray-400 mt-1 pl-1 font-normal">
          Select from the official list of recognized cities.
        </p>
      </div>
    </div>
  );
};
