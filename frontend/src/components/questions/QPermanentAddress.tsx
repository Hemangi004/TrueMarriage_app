import React from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { Home } from 'lucide-react';

export const QPermanentAddress: React.FC = () => {
  const { formData, updateFormData } = useBiodata();

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 items-start">
      {/* Left Column: Textarea */}
      <div className="md:col-span-7 space-y-2">
        <label className="block text-[11px] font-[450] text-gray-500 tracking-normal">
          Permanent Address
        </label>
        <div className="relative">
          <Home className="absolute left-3.5 top-3 text-rose-400 pointer-events-none" size={17} />
          <textarea
            rows={3}
            maxLength={250}
            value={formData.permanentAddress || ''}
            onChange={(e) => updateFormData({ permanentAddress: e.target.value })}
            placeholder="e.g. House No. 12, Main Street, Ancestral Village, Jaipur, Rajasthan"
            className="wizard-input with-icon !pl-11 py-2 text-xs sm:text-sm font-[450] leading-relaxed resize-none"
          />
        </div>
        <p className="text-[11px] text-gray-400 font-normal pl-1">
          Specify your ancestral home or permanent family property address.
        </p>
      </div>

      {/* Right Column: Helpful Note Card */}
      <div className="md:col-span-5 p-4 bg-rose-50/50 border border-rose-100 rounded-2xl">
        <span className="text-[10px] font-[450] tracking-normal text-rose-600 block mb-1">
          Traditional Matrimonial Detail
        </span>
        <p className="text-xs font-[450] text-gray-700 leading-relaxed">
          Families frequently consult permanent and native addresses for community cross-referencing and verification.
        </p>
      </div>
    </div>
  );
};
