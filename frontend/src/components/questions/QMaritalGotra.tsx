import React from 'react';
import { useBiodata } from '../../context/BiodataContext';

export const QMaritalGotra: React.FC = () => {
  const { formData, updateFormData } = useBiodata();

  const statuses = ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'];

  return (
    <div className="space-y-3">
      <label className="block text-[11px] sm:text-xs font-[450] text-gray-500 tracking-normal mb-1.5">
        Select Marital Status
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {statuses.map((st) => {
          const isSelected = formData.maritalStatus === st;
          return (
            <button
              key={st}
              type="button"
              onClick={() => updateFormData({ maritalStatus: st as any })}
              className={`option-card flex items-center justify-center py-2.5 px-3 text-xs sm:text-[13px] text-center cursor-pointer transition-all ${
                isSelected
                  ? 'selected !border-[#F01472] !bg-[#FFF0F6] !text-[#C80E5A] font-semibold shadow-2xs'
                  : '!border-gray-200 !bg-white !text-gray-800 hover:!text-gray-950 hover:!border-rose-300 font-medium'
              }`}
            >
              <span className={isSelected ? 'text-[#C80E5A] font-semibold' : 'text-gray-800 font-medium'}>
                {st}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
