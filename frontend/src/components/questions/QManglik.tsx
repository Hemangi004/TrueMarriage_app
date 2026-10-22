import React, { useRef, useEffect } from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { Compass, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

export const QManglik: React.FC = () => {
  const { formData, updateFormData, goToNextQuestion, isNavigating } = useBiodata();
  const timerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const options = [
    { value: 'No', label: 'Non-Manglik / No', description: 'No dosha in chart', icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-50 border-emerald-200' },
    { value: 'Yes', label: 'Manglik / Yes', description: 'Full Mangal dosha', icon: Compass, color: 'text-rose-500 bg-rose-50 border-rose-200' },
    { value: 'Anshik', label: 'Anshik Manglik', description: 'Partial / Mild dosha', icon: AlertCircle, color: 'text-amber-500 bg-amber-50 border-amber-200' },
    { value: "Don't Know", label: "Don't Know", description: 'Horoscope pending', icon: HelpCircle, color: 'text-gray-500 bg-gray-50 border-gray-200' },
  ];

  const handleSelect = (val: 'No' | 'Yes' | 'Anshik' | "Don't Know") => {
    if (isNavigating) return;
    updateFormData({ manglik: val });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      goToNextQuestion();
    }, 200);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isSelected = formData.manglik === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            disabled={isNavigating}
            onClick={() => handleSelect(opt.value as any)}
            className={`option-card flex flex-col items-center p-3 text-center transition-all ${
              isNavigating ? 'pointer-events-none opacity-80' : 'cursor-pointer'
            } ${isSelected ? 'selected' : ''}`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mb-1.5 border ${opt.color}`}>
              <Icon size={18} />
            </div>
            <span className="block font-[450] text-gray-900 text-xs sm:text-sm">{opt.label}</span>
            <span className="block text-[11px] text-gray-500 font-normal mt-0.5">{opt.description}</span>
          </button>
        );
      })}
    </div>
  );
};
