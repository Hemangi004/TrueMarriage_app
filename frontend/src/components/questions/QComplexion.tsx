import React, { useRef, useEffect } from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { Sparkles } from 'lucide-react';

export const QComplexion: React.FC = () => {
  const { formData, updateFormData, goToNextQuestion, isNavigating } = useBiodata();
  const timerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const options = ['Fair', 'Very Fair', 'Wheatish', 'Medium', 'Dusky', 'Dark'];

  const handleSelect = (complexion: string) => {
    if (isNavigating) return;
    updateFormData({ complexion });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      goToNextQuestion();
    }, 200);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 sm:gap-3">
      {options.map((opt) => {
        const isSelected = formData.complexion === opt;
        return (
          <button
            key={opt}
            type="button"
            disabled={isNavigating}
            onClick={() => handleSelect(opt)}
            className={`option-card flex flex-col items-center justify-center p-3 text-center transition-all ${
              isNavigating ? 'pointer-events-none opacity-80' : 'cursor-pointer'
            } ${isSelected ? 'selected' : ''}`}
          >
            <Sparkles size={16} className={`mb-1.5 ${isSelected ? 'text-[#F01472]' : 'text-rose-400'}`} />
            <span className="text-xs sm:text-sm font-[450] text-gray-900">{opt}</span>
          </button>
        );
      })}
    </div>
  );
};
