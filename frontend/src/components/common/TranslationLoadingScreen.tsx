import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, CheckCircle2, Heart, X } from 'lucide-react';

interface TranslationLoadingScreenProps {
  isOpen: boolean;
  targetLangCode: string;
  targetLangName: string;
  targetNativeName: string;
  isComplete?: boolean;
  onComplete?: () => void;
}

export const TranslationLoadingScreen: React.FC<TranslationLoadingScreenProps> = ({
  isOpen,
  targetLangName,
  targetNativeName,
  isComplete = false,
  onComplete,
}) => {
  const [progress, setProgress] = useState(25);
  const [statusText, setStatusText] = useState('Translating components');
  const [showDismiss, setShowDismiss] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Prevent background scrollbar flickering / layout shifting on Windows
  useEffect(() => {
    if (isOpen && !dismissed) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, dismissed]);

  // Smooth, stable milestone progression (prevents rapid re-render layout thrashing)
  useEffect(() => {
    if (!isOpen || dismissed) {
      setProgress(25);
      setStatusText('Translating components');
      setShowDismiss(false);
      return;
    }

    if (isComplete) {
      setProgress(100);
      setStatusText('Ready! Applying changes...');
      return;
    }

    const t1 = setTimeout(() => {
      setProgress(60);
      setStatusText('Applying language pack...');
    }, 150);

    const t2 = setTimeout(() => {
      setProgress(85);
      setStatusText('Localizing biodata & templates...');
    }, 550);

    const t3 = setTimeout(() => {
      setProgress(92);
    }, 1200);

    const dismissTimer = setTimeout(() => {
      setShowDismiss(true);
    }, 3500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(dismissTimer);
    };
  }, [isOpen, isComplete, dismissed]);

  useEffect(() => {
    if (!isOpen) {
      setDismissed(false);
    }
  }, [isOpen]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && !dismissed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md notranslate select-none overflow-hidden"
          translate="no"
        >
          {/* Subtle Ambient Backlight Glow behind modal */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Modal Popup Card */}
          <motion.div
            initial={{ scale: 0.95, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.97, y: -6, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-[390px] sm:max-w-[420px] bg-gradient-to-b from-[#FFF5F7] via-[#FDF0F3] to-[#FCE6EC] rounded-[28px] sm:rounded-[32px] shadow-2xl shadow-black/60 border border-white/60 overflow-hidden text-center flex flex-col items-center notranslate"
            translate="no"
          >
            {/* Optional Safe Dismiss Button (Appears if connection is delayed) */}
            <AnimatePresence>
              {showDismiss && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => {
                    setDismissed(true);
                    onComplete?.();
                  }}
                  className="absolute top-3.5 right-3.5 z-20 p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-slate-600 transition-colors shadow-sm backdrop-blur-sm notranslate"
                  title="Close and continue"
                  aria-label="Close"
                  translate="no"
                >
                  <X size={15} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Top Artwork: Stable container with fixed height to prevent any layout shift */}
            <div className="w-full h-44 sm:h-52 relative overflow-hidden flex items-center justify-center bg-gradient-to-b from-white/40 to-transparent notranslate" translate="no">
              <img
                src="/images/translation_envelope.png"
                alt="Better matches are loading..."
                className="w-full h-full object-contain select-none pointer-events-none drop-shadow-sm notranslate"
                loading="eager"
                translate="no"
              />
            </div>

            {/* Bottom Content Body */}
            <div className="w-full px-5 sm:px-7 pb-6 pt-1 flex flex-col items-center space-y-3.5 sm:space-y-4 notranslate" translate="no">
              {/* Translating Website Pill Badge */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/95 border border-[#F472B6] shadow-sm text-[11px] sm:text-xs font-bold text-[#E11D48] tracking-wide notranslate" translate="no">
                <Globe size={13} className="text-[#E11D48] animate-spin" style={{ animationDuration: '5s' }} />
                <span>Translating Website</span>
              </div>

              {/* Main Translation Heading */}
              <div className="space-y-1.5 max-w-sm mx-auto notranslate" translate="no">
                <h2 className="text-2xl sm:text-[26px] text-slate-700 tracking-tight leading-snug flex items-center justify-center flex-wrap gap-x-1.5 notranslate" translate="no">
                  <span className="font-['Caveat',_cursive] text-3xl sm:text-[34px] text-slate-700 font-medium italic">
                    Switching to
                  </span>
                  <span className="font-bold text-[#E11D48]">
                    {targetNativeName}
                  </span>
                  {targetLangName && targetLangName.toLowerCase() !== targetNativeName.toLowerCase() && (
                    <span className="text-slate-500 font-normal text-lg sm:text-xl">
                      ({targetLangName})
                    </span>
                  )}
                </h2>

                {/* Subtitle description */}
                <p className="text-xs text-slate-500 max-w-[310px] mx-auto leading-relaxed font-normal notranslate" translate="no">
                  Applying live translation across biodata studio, matches, and templates...
                </p>
              </div>

              {/* Smooth Hardware-Accelerated Progress Bar */}
              <div className="w-full max-w-[310px] mx-auto space-y-1.5 pt-0.5 notranslate" translate="no">
                <div className="flex items-center gap-3 notranslate" translate="no">
                  <div className="flex-1 bg-[#FDE2EC] h-2.5 rounded-full overflow-hidden p-0.5 relative notranslate" translate="no">
                    <div
                      className="bg-gradient-to-r from-[#E11D48] to-[#F01472] h-full rounded-full relative overflow-hidden notranslate"
                      style={{
                        width: `${progress}%`,
                        transition: 'width 0.65s cubic-bezier(0.25, 1, 0.5, 1)',
                      }}
                      translate="no"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent animate-shimmer -skew-x-12" />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#E11D48] min-w-[34px] text-right tabular-nums notranslate" translate="no">
                    {progress}%
                  </span>
                </div>

                {/* Stable Status Text */}
                <div className="flex items-center justify-between text-xs text-slate-500 px-0.5 notranslate" translate="no">
                  <span className="font-semibold text-slate-500 notranslate" translate="no">
                    {statusText}
                  </span>
                </div>
              </div>

              {/* Trust localization guarantee */}
              <div className="pt-1 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 notranslate" translate="no">
                <CheckCircle2 size={15} className="text-[#E11D48]" />
                <span>Full interface localization supported</span>
              </div>

              {/* Bottom Romantic Heart Divider */}
              <div className="pt-0.5 flex items-center justify-center gap-3 w-40 mx-auto text-pink-300 notranslate" translate="no">
                <div className="h-[1px] flex-1 bg-pink-300/80" />
                <Heart size={13} className="text-pink-400 fill-pink-50 stroke-[1.5] select-none" />
                <div className="h-[1px] flex-1 bg-pink-300/80" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
