import React from 'react';
import { Check } from 'lucide-react';
import { validatePasswordStrength } from '../../utils/passwordPolicy';

interface PasswordChecklistProps {
  password: string;
  className?: string;
}

export const PasswordChecklist: React.FC<PasswordChecklistProps> = ({ password, className = '' }) => {
  const check = validatePasswordStrength(password);

  const criteria = [
    { label: '8+ chars', met: check.hasMinLength },
    { label: 'A–Z', met: check.hasUppercase },
    { label: 'a–z', met: check.hasLowercase },
    { label: '0–9', met: check.hasNumber },
    { label: 'Special (@#$)', met: check.hasSpecialChar },
  ];

  const metCount = criteria.filter((c) => c.met).length;

  const getStrengthInfo = () => {
    if (metCount === 0) return { label: 'Too Weak', color: 'bg-slate-200', text: 'text-slate-400', width: 'w-1/12' };
    if (metCount <= 2) return { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-600', width: 'w-1/4' };
    if (metCount <= 3) return { label: 'Fair', color: 'bg-amber-500', text: 'text-amber-600', width: 'w-2/4' };
    if (metCount === 4) return { label: 'Good', color: 'bg-blue-500', text: 'text-blue-600', width: 'w-3/4' };
    return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-600', width: 'w-full' };
  };

  const strength = getStrengthInfo();

  return (
    <div className={`space-y-1.5 transition-all text-xs animate-fadeIn ${className}`}>
      {/* Strength Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full transition-all duration-300 rounded-full ${strength.color} ${strength.width}`} />
        </div>
        <span className={`text-[10px] font-bold shrink-0 ${strength.text}`}>
          {password ? strength.label : 'Strength'}
        </span>
      </div>

      {/* Compact Requirements Badges */}
      <div className="flex flex-wrap items-center gap-1.5">
        {criteria.map((item, idx) => (
          <span
            key={idx}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border transition-colors duration-150 ${
              item.met
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-700'
                : 'bg-slate-50 border-slate-200/80 text-slate-400'
            }`}
          >
            {item.met ? (
              <Check size={10} strokeWidth={3} className="text-emerald-600" />
            ) : (
              <span className="w-1 h-1 rounded-full bg-slate-300" />
            )}
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
};

