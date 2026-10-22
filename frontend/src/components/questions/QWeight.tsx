import React from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { Scale, Minus, Plus } from 'lucide-react';

export const QWeight: React.FC = () => {
  const { formData, updateFormData } = useBiodata();
  const weight = formData.weightKg || 65;

  const setWeight = (val: number) => {
    const clamped = Math.max(30, Math.min(180, val));
    updateFormData({ weightKg: clamped });
  };

  const quickWeights = [45, 55, 65, 75, 85, 95];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-center">
      {/* Left Column: Counter Display */}
      <div className="md:col-span-5 flex items-center justify-center gap-4 p-5 bg-gradient-to-br from-rose-50/80 to-pink-50/60 border border-rose-200/80 rounded-2xl">
        <button
          type="button"
          onClick={() => setWeight(weight - 1)}
          className="w-10 h-10 rounded-xl bg-white border border-rose-200 text-[#F01472] font-[450] flex items-center justify-center hover:bg-rose-100 transition-colors shadow-xs active:scale-95 cursor-pointer"
        >
          <Minus size={18} />
        </button>

        <div className="text-center">
          <div className="text-3xl sm:text-4xl font-[450] text-gray-900 flex items-baseline justify-center gap-1.5">
            <span>{weight}</span>
            <span className="text-sm font-[450] text-rose-500">kg</span>
          </div>
          <div className="text-[11px] font-[450] text-gray-400 mt-0.5 flex items-center justify-center gap-1">
            <Scale size={12} /> Approx {(weight * 2.20462).toFixed(0)} lbs
          </div>
        </div>

        <button
          type="button"
          onClick={() => setWeight(weight + 1)}
          className="w-10 h-10 rounded-xl bg-white border border-rose-200 text-[#F01472] font-[450] flex items-center justify-center hover:bg-rose-100 transition-colors shadow-xs active:scale-95 cursor-pointer"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Right Column: Slider & Quick Pills */}
      <div className="md:col-span-7 space-y-3.5">
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-[450] text-gray-500 tracking-normal">
            <span>Select Weight</span>
            <span className="text-[#F01472] font-[450]">{weight} kg</span>
          </div>
          <input
            type="range"
            min="35"
            max="140"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="w-full accent-[#F01472] h-2 bg-gray-200 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[11px] font-[450] text-gray-400">
            <span>35 kg</span>
            <span>140 kg</span>
          </div>
        </div>

        <div>
          <span className="text-[11px] font-[450] text-gray-400 tracking-normal block mb-1.5">
            Quick Select
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickWeights.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setWeight(w)}
                className={`pill-button text-xs py-1 px-2.5 font-[450] ${
                  weight === w ? 'selected' : ''
                }`}
              >
                {w} kg
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
