import React, { useEffect, useState } from 'react';
import { useBiodata, TOTAL_QUESTIONS } from '../../context/BiodataContext';
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { getBackLabel } from '../../utils/navigationI18n';

interface WizardFooterProps {
  onBackToLanguageSelect?: () => void;
}

export const WizardFooter: React.FC<WizardFooterProps> = ({ onBackToLanguageSelect }) => {
  const {
    questionIndex,
    formData,
    goToNextQuestion,
    goToPrevQuestion,
    goToTemplates,
    markWizardComplete,
    isNavigating,
    checkStepValidity,
  } = useBiodata();
  const { lang } = useI18n();
  const [isSaving, setIsSaving] = useState(false);

  const isFirst = questionIndex === 1;
  const isFinal = questionIndex === TOTAL_QUESTIONS;

  const isStepInvalid = !checkStepValidity(questionIndex, formData).isValid;
  const isDisabled = isStepInvalid || isNavigating || isSaving;

  const handleNext = async () => {
    if (isDisabled) return;
    setIsSaving(true);
    try {
      if (isFinal) {
        await markWizardComplete();
        goToTemplates();
      } else {
        await goToNextQuestion();
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Keydown listener for Enter key navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        const target = e.target as HTMLElement;
        if (target && target.tagName === 'TEXTAREA') return;
        if (isDisabled) return;
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, isDisabled]);

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-rose-100/60 py-3 px-4 shadow-lg">
      <div className="max-w-xl mx-auto flex flex-col items-center justify-center min-h-[52px]">
        {/* Buttons Row: Back and Continue share the same vertical alignment */}
        <div className="w-full relative flex items-center justify-center">
          {/* Previous Button (anchored on left, vertically aligned with Continue button) */}
          {(!isFirst || onBackToLanguageSelect) && (
            <button
              type="button"
              disabled={isNavigating || isSaving}
              onClick={(e) => {
                e.preventDefault();
                if (isNavigating || isSaving) return;
                if (isFirst) {
                  onBackToLanguageSelect?.();
                } else {
                  goToPrevQuestion();
                }
              }}
              aria-label={getBackLabel(lang)}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 flex items-center gap-1.5 px-3.5 h-9 rounded-2xl border-2 border-gray-200 text-gray-600 font-[450] text-xs hover:border-rose-300 hover:text-[#F01472] transition-all duration-200 select-none ${
                isNavigating || isSaving
                  ? 'opacity-50 cursor-not-allowed pointer-events-none'
                  : 'cursor-pointer hover:bg-rose-50/40 active:scale-95'
              }`}
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline notranslate" translate="no">
                {getBackLabel(lang)}
              </span>
            </button>
          )}

          {/* Centered Continue Button */}
          {isFinal ? (
            <button
              type="button"
              disabled={isDisabled}
              onClick={handleNext}
              className={`flex items-center gap-2 px-7 h-9 rounded-2xl font-[450] text-xs sm:text-sm transition-all duration-200 select-none ${
                isDisabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none'
                  : 'bg-gradient-to-r from-[#F01472] to-[#C80E5A] text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'
              }`}
            >
              {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
              <span>{isSaving ? 'Saving...' : 'Design & Export'}</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={isDisabled}
              onClick={handleNext}
              className={`flex items-center gap-2 px-7 h-9 rounded-2xl font-[450] text-xs sm:text-sm transition-all duration-200 select-none ${
                isDisabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none'
                  : 'bg-gradient-to-r from-[#F01472] to-[#C80E5A] text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'
              }`}
            >
              <span>{isSaving ? 'Saving...' : 'Continue'}</span>
              {isSaving ? <Loader2 size={15} className="animate-spin" /> : <ArrowRight size={15} />}
            </button>
          )}
        </div>

        {/* Enter Key Hint below the button row */}
        <div className="hidden sm:flex items-center gap-1 text-[10px] text-gray-400 font-medium select-none mt-1">
          <span>Press</span>
          <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-gray-600 font-mono text-[9px]">
            Enter ↵
          </kbd>
        </div>
      </div>
    </footer>
  );
};
