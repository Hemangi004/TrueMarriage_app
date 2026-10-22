import React, { useRef, useEffect } from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { Check, X, MapPin } from 'lucide-react';

export const QAddressToggle: React.FC = () => {
  const { formData, updateFormData, goToNextQuestion, isNavigating } = useBiodata();
  const timerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const isSame = formData.sameAsCurrentAddress;

  const handleSelect = (same: boolean) => {
    if (isNavigating) return;
    if (same) {
      updateFormData({
        sameAsCurrentAddress: true,
        permanentAddress: formData.currentAddress,
      });
    } else {
      updateFormData({ sameAsCurrentAddress: false });
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      goToNextQuestion();
    }, 200);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 items-center">
      {/* Left Column: Current Address Summary */}
      <div className="md:col-span-5 p-4 bg-rose-50/40 border border-rose-100 rounded-2xl flex items-start gap-3">
        <MapPin size={18} className="text-rose-500 shrink-0 mt-0.5" />
        <div className="min-w-0">
          <span className="block text-[10px] font-[450] text-gray-400 tracking-normal">Current Residence</span>
          <span className="block text-xs sm:text-sm font-[450] text-gray-800 mt-0.5 truncate">
            {formData.currentAddress || 'Not specified'}
          </span>
        </div>
      </div>

      {/* Right Column: Toggle Option Cards */}
      <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          disabled={isNavigating}
          onClick={() => handleSelect(true)}
          className={`option-card flex items-center justify-between p-3.5 transition-all ${
            isNavigating ? 'pointer-events-none opacity-80' : 'cursor-pointer'
          } ${isSame ? 'selected' : ''}`}
        >
          <div className="text-left">
            <span className="block text-xs sm:text-sm font-[450] text-gray-900">Yes, it's same</span>
            <span className="block text-[11px] text-gray-400 mt-0.5">Skip permanent step</span>
          </div>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center border shrink-0 ml-2 ${
            isSame ? 'bg-[#F01472] text-white border-[#F01472]' : 'bg-gray-100 text-gray-400 border-gray-200'
          }`}>
            <Check size={14} />
          </div>
        </button>

        <button
          type="button"
          disabled={isNavigating}
          onClick={() => handleSelect(false)}
          className={`option-card flex items-center justify-between p-3.5 transition-all ${
            isNavigating ? 'pointer-events-none opacity-80' : 'cursor-pointer'
          } ${!isSame && formData.sameAsCurrentAddress !== undefined ? 'selected' : ''}`}
        >
          <div className="text-left">
            <span className="block text-xs sm:text-sm font-[450] text-gray-900">No, different</span>
            <span className="block text-[11px] text-gray-400 mt-0.5">Enter permanent next</span>
          </div>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center border shrink-0 ml-2 ${
            !isSame && formData.sameAsCurrentAddress !== undefined ? 'bg-[#F01472] text-white border-[#F01472]' : 'bg-gray-100 text-gray-400 border-gray-200'
          }`}>
            <X size={14} />
          </div>
        </button>
      </div>
    </div>
  );
};
