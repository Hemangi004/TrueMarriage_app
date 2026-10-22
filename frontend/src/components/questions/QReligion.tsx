import React, { useState, useRef, useEffect } from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { Heart, Search } from 'lucide-react';

const RELIGIONS = [
  'Hindu',
  'Muslim',
  'Christian',
  'Sikh',
  'Jain',
  'Buddhist',
  'Parsi',
  'Jewish',
  'Inter-Religion',
  'Other',
];

export const QReligion: React.FC = () => {
  const { formData, updateFormData, goToNextQuestion, isNavigating } = useBiodata();
  const [search, setSearch] = useState('');
  const timerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const filtered = RELIGIONS.filter((r) =>
    r.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (rel: string) => {
    if (isNavigating) return;
    updateFormData({ religion: rel });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      goToNextQuestion();
    }, 200);
  };

  return (
    <div className="space-y-3.5">
      {/* Search Input */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 text-gray-400 pointer-events-none" size={17} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search religion..."
          className="wizard-input with-icon !pl-11 py-2 text-xs sm:text-sm font-[450]"
        />
      </div>

      {/* Grid options: 5 columns on screens >= 640px */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5">
          {filtered.map((rel) => {
            const isSelected = formData.religion === rel;
            return (
              <button
                key={rel}
                type="button"
                disabled={isNavigating}
                onClick={() => handleSelect(rel)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all select-none text-left ${
                  isNavigating ? 'pointer-events-none opacity-80' : 'cursor-pointer'
                } ${
                  isSelected
                    ? 'border-[#F01472] bg-rose-50/80 shadow-xs ring-1 ring-[#F01472]/30'
                    : 'border-gray-200 bg-white hover:border-rose-200 hover:bg-rose-50/30'
                }`}
              >
                <Heart
                  size={14}
                  className={`shrink-0 transition-colors ${isSelected ? 'text-[#F01472] fill-[#F01472]' : 'text-gray-400'}`}
                />
                <span className={`text-xs font-[450] transition-colors ${isSelected ? 'text-[#F01472]' : 'text-gray-900'}`}>
                  {rel}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="py-6 px-4 text-center bg-gray-50/70 rounded-2xl border border-dashed border-gray-200 animate-fadeIn">
          <p className="text-xs sm:text-sm font-[450] text-gray-700">No matching religion found.</p>
          <p className="text-[11px] text-gray-400 mt-1">Try searching with a different keyword or select "Other".</p>
          <button
            type="button"
            disabled={isNavigating}
            onClick={() => handleSelect('Other')}
            className={`mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-rose-200 bg-white text-xs font-[450] text-[#F01472] hover:bg-rose-50 hover:border-rose-300 transition shadow-2xs ${
              isNavigating ? 'pointer-events-none opacity-80' : 'cursor-pointer'
            }`}
          >
            Select "Other"
          </button>
        </div>
      )}
    </div>
  );
};
