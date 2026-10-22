import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy } from 'lucide-react';
import { AIBioGenerator } from '../summary/AIBioGenerator';

export const QBiodataSummary: React.FC = () => {
  useEffect(() => {
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  }, []);

  return (
    <div className="space-y-4 text-left w-full max-w-2xl mx-auto">
      {/* Compact Celebration Banner */}
      <div className="relative overflow-hidden p-3.5 sm:p-4 bg-gradient-to-r from-[#F01472] to-[#C80E5A] text-white rounded-2xl shadow-md shadow-rose-500/20 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            <Trophy size={18} className="text-amber-300" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black tracking-tight truncate">
                Your Profile is Ready! 🎉
              </h2>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-white/20 text-rose-100 shrink-0">
                100%
              </span>
            </div>
            <p className="text-[11px] text-rose-100/90 font-medium truncate sm:whitespace-normal">
              Generate or refine your AI matrimonial bio below, then continue.
            </p>
          </div>
        </div>
      </div>

      {/* AI Bio Generator Only */}
      <AIBioGenerator />
    </div>
  );
};
