import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBiodata } from '../../context/BiodataContext';
import { AlertCircle } from 'lucide-react';

interface QuestionCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  isFullWidth?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ title, subtitle, children, isFullWidth }) => {
  const { questionIndex, slideDirection, validationError } = useBiodata();

  const isFullPage = isFullWidth || questionIndex === 25;
  const cardMaxWidthClass = isFullPage ? 'max-w-7xl' : 'max-w-5xl xl:max-w-6xl';

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 350, damping: 30 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 80 : -80,
      opacity: 0,
      scale: 0.96,
      transition: {
        x: { duration: 0.2 },
        opacity: { duration: 0.15 },
      },
    }),
  };

  return (
    <div className={`w-full ${cardMaxWidthClass} mx-auto px-3 sm:px-4 pt-1 sm:pt-2 mb-6 transition-all duration-300`}>
      <AnimatePresence mode="popLayout" custom={slideDirection} initial={false}>
        <motion.div
          key={questionIndex}
          custom={slideDirection}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="wizard-card p-4 sm:p-6 relative overflow-visible shadow-xl border border-rose-100/60 bg-white/95 backdrop-blur-sm rounded-3xl"
        >
          {/* Subtle Ambient Background Decorative Accents inside clipped boundary */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none -z-0">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-200/30 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-pink-200/30 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* Header Section inside Card */}
          <div className="mb-3 sm:mb-4 relative z-10">
            <h2 className="text-base sm:text-lg md:text-xl font-[450] text-gray-900 tracking-tight leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-gray-500 font-normal leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Inline Validation Warning Box */}
          {validationError && questionIndex !== 1 && questionIndex !== 3 && questionIndex !== 19 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-rose-50 border border-rose-200 text-[#C80E5A] rounded-2xl flex items-center gap-2.5 text-xs sm:text-[13px] font-[450] shadow-xs"
            >
              <AlertCircle size={17} className="shrink-0 text-[#F01472]" />
              <span>{validationError}</span>
            </motion.div>
          )}

          {/* Question Input / Controls Content */}
          <div className="relative z-10">{children}</div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
