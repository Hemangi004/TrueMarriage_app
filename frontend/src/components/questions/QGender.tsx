import React, { useRef, useEffect } from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { User, UserCheck, HeartHandshake } from 'lucide-react';

export const QGender: React.FC = () => {
  const { formData, updateFormData, goToNextQuestion, isNavigating } = useBiodata();
  const timerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSelect = (gender: 'Male' | 'Female' | 'Other') => {
    if (isNavigating) return;
    updateFormData({ gender });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      goToNextQuestion();
    }, 200);
  };

  const options = [
    { value: 'Male', label: 'Male', description: 'Groom profile', icon: User, color: 'text-blue-500 bg-blue-50 border-blue-200' },
    { value: 'Female', label: 'Female', description: 'Bride profile', icon: UserCheck, color: 'text-rose-500 bg-rose-50 border-rose-200' },
    { value: 'Other', label: 'Other', description: 'Non-binary / Other', icon: HeartHandshake, color: 'text-purple-500 bg-purple-50 border-purple-200' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isSelected = formData.gender === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            disabled={isNavigating}
            onClick={() => handleSelect(opt.value as any)}
            className={`option-card flex flex-col items-center justify-center p-3.5 sm:p-4 text-center transition-all ${
              isNavigating ? 'pointer-events-none opacity-80' : 'cursor-pointer'
            } ${isSelected ? 'selected' : ''}`}
          >
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-2 border ${opt.color}`}>
              <Icon size={22} />
            </div>
            <span className="text-sm sm:text-base font-[450] text-gray-900">{opt.label}</span>
            <span className="text-[11px] sm:text-xs text-gray-500 mt-0.5 font-normal">{opt.description}</span>
          </button>
        );
      })}
    </div>
  );
};
