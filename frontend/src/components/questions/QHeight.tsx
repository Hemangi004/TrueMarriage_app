import React from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { cmToFeetInches } from '../../utils/biodataHelpers';
import { Ruler } from 'lucide-react';

export const QHeight: React.FC = () => {
  const { formData, updateFormData } = useBiodata();

  const heightCm = formData.heightCm || 168;

  const handleSliderChange = (val: number) => {
    updateFormData({ heightCm: val });
  };

  const feetInchesStr = cmToFeetInches(heightCm);

  // Common quick height choices
  const quickHeights = [152, 160, 165, 170, 175, 180, 185];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-center">
      {/* Left Column: Dynamic Display Badge */}
      <div className="md:col-span-5 p-5 bg-gradient-to-br from-rose-50/80 to-pink-50/60 border border-rose-200/80 rounded-2xl text-center shadow-xs">
        <Ruler size={26} className="mx-auto mb-1.5 text-[#F01472]" />
        <div className="text-2xl sm:text-3xl font-[450] text-gray-900 tracking-tight">
          {feetInchesStr}
        </div>
        <div className="text-xs font-[450] text-rose-500 mt-0.5">
          {heightCm} cm
        </div>
      </div>

      {/* Right Column: Interactive Slider & Quick Pills */}
      <div className="md:col-span-7 space-y-4">
        {/* Interactive Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-[450] text-gray-500 tracking-normal">
            <span>Select Height</span>
            <span className="text-[#F01472] font-[450]">{feetInchesStr}</span>
          </div>
          <input
            type="range"
            min="135"
            max="210"
            value={heightCm}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            className="w-full accent-[#F01472] h-2 bg-gray-200 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[11px] font-[450] text-gray-400">
            <span>4'5" (135 cm)</span>
            <span>6'11" (210 cm)</span>
          </div>
        </div>

        {/* Quick Select Pills */}
        <div>
          <span className="text-[11px] font-[450] text-gray-400 tracking-normal block mb-1.5">
            Popular Heights
          </span>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {quickHeights.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => handleSliderChange(h)}
                className={`pill-button text-xs py-1 px-2.5 font-[450] ${
                  heightCm === h ? 'selected' : ''
                }`}
              >
                {cmToFeetInches(h)} ({h}cm)
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
