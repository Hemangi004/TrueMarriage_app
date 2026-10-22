import React, { useRef, useEffect } from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { Droplet } from 'lucide-react';

export const QBloodGroup: React.FC = () => {
  const { formData, updateFormData, goToNextQuestion, isNavigating } = useBiodata();
  const timerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const handleSelect = (bg: string) => {
    if (isNavigating) return;
    updateFormData({ bloodGroup: bg });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      goToNextQuestion();
    }, 200);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5 sm:gap-3">
      {bloodGroups.map((bg) => {
        const isSelected = formData.bloodGroup === bg;
        return (
          <button
            key={bg}
            type="button"
            disabled={isNavigating}
            onClick={() => handleSelect(bg)}
            className={`option-card flex flex-col items-center justify-center py-2.5 px-2 sm:py-3 text-center transition-all ${
              isNavigating ? 'pointer-events-none opacity-80' : 'cursor-pointer'
            } ${isSelected ? 'selected' : ''}`}
          >
            <Droplet
              size={18}
              className={`mb-1 transition-colors ${isSelected ? 'text-[#F01472] fill-rose-100' : 'text-gray-400'}`}
            />
            <span className="text-xs sm:text-sm font-[450] text-gray-900">{bg}</span>
          </button>
        );
      })}
    </div>
  );
};
