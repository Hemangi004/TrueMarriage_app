import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

interface TypewriterTextProps {
  words: string[];
  lang?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
  className?: string;
}

function getGraphemes(text: string, lang = 'en'): string[] {
  if (!text) return [];
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    try {
      const segmenter = new Intl.Segmenter(lang, { granularity: 'grapheme' });
      return Array.from(segmenter.segment(text), (s) => s.segment);
    } catch {
      return Array.from(text);
    }
  }
  return Array.from(text);
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  words = ['beautiful', 'perfect', 'unforgettable', 'timeless', 'soulful'],
  lang = 'en',
  typingSpeed = 120,
  deletingSpeed = 60,
  pauseTime = 1800,
  className = '',
}) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [currentGraphemeCount, setCurrentGraphemeCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // When words or lang changes, reset word index and count
  useEffect(() => {
    setWordIndex(0);
    setCurrentGraphemeCount(0);
    setIsDeleting(false);
  }, [words, lang]);

  const currentFullWord = words[wordIndex % words.length] || '';
  const currentGraphemes = useMemo(() => getGraphemes(currentFullWord, lang), [currentFullWord, lang]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (currentGraphemeCount < currentGraphemes.length) {
        timer = setTimeout(() => {
          setCurrentGraphemeCount((prev) => prev + 1);
        }, typingSpeed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
      }
    } else {
      if (currentGraphemeCount > 0) {
        timer = setTimeout(() => {
          setCurrentGraphemeCount((prev) => prev - 1);
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }

    return () => clearTimeout(timer);
  }, [currentGraphemeCount, isDeleting, currentGraphemes.length, words.length, typingSpeed, deletingSpeed, pauseTime]);

  const displayText = useMemo(() => {
    return currentGraphemes.slice(0, currentGraphemeCount).join('');
  }, [currentGraphemes, currentGraphemeCount]);

  // Longest word determines reserved width so the headline never reflows
  const longestWord = words.reduce((a, b) => (a.length >= b.length ? a : b), '');

  return (
    <span
      className={`relative inline-block notranslate ${className}`}
      style={{ minWidth: '1em' }}
      translate="no"
    >
      {/* Invisible sizer — always occupies the width of the longest word */}
      <span
        aria-hidden="true"
        translate="no"
        className="invisible select-none pointer-events-none whitespace-nowrap text-[#F01472] notranslate"
      >
        {longestWord}
      </span>

      {/* Actual typed text + cursor — overlaid on top of the sizer */}
      <span className="absolute inset-0 flex items-baseline notranslate" translate="no">
        {/* Wrap text in relative so the underline SVG sizes to it */}
        <span className="relative text-[#F01472] whitespace-nowrap notranslate" translate="no">
          {displayText}
          {/* Underline — w-full of THIS span = current typed text width */}
          <svg
            className="absolute -bottom-1 left-0 w-full overflow-visible"
            viewBox="0 0 200 10"
            preserveAspectRatio="none"
            style={{ height: '7px' }}
          >
            <path
              d="M0 6 Q50 1 100 6 Q150 11 200 6"
              stroke="#F01472"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </span>
        {/* Animated cursor */}
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          className="inline-block w-[3px] h-[0.82em] bg-gradient-to-b from-[#F01472] to-[#C80E5A] ml-1 rounded-full shadow-[0_0_8px_rgba(240,20,114,0.6)] self-center shrink-0"
        />
      </span>
    </span>
  );
};
