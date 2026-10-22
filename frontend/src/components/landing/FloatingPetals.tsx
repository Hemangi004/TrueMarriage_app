import React from 'react';
import { motion } from 'framer-motion';

interface PetalProps {
  id: number;
  startX: number;
  startY: number;
  scale: number;
  duration: number;
  delay: number;
  rotate: number;
}

const PETALS_DATA: PetalProps[] = [
  { id: 1, startX: 8, startY: -20, scale: 0.8, duration: 14, delay: 0, rotate: 25 },
  { id: 2, startX: 25, startY: -30, scale: 1.1, duration: 18, delay: 3, rotate: -40 },
  { id: 3, startX: 45, startY: -15, scale: 0.6, duration: 12, delay: 1.5, rotate: 60 },
  { id: 4, startX: 68, startY: -25, scale: 0.9, duration: 16, delay: 4, rotate: -15 },
  { id: 5, startX: 85, startY: -20, scale: 1.0, duration: 15, delay: 2, rotate: 45 },
  { id: 6, startX: 92, startY: -35, scale: 0.7, duration: 20, delay: 5.5, rotate: -55 },
  { id: 7, startX: 15, startY: -10, scale: 0.5, duration: 13, delay: 7, rotate: 30 },
  { id: 8, startX: 55, startY: -40, scale: 0.85, duration: 17, delay: 8.5, rotate: -20 },
];

export const FloatingPetals: React.FC<{ count?: number; className?: string }> = ({
  className = '',
}) => {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
    >
      {PETALS_DATA.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.startX}%`,
            top: `${petal.startY}px`,
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, 25 * (petal.id % 2 === 0 ? 1 : -1), -15 * (petal.id % 2 === 0 ? 1 : -1), 10],
            rotate: [petal.rotate, petal.rotate + 180, petal.rotate + 360],
            opacity: [0, 0.75, 0.85, 0.4, 0],
          }}
          transition={{
            duration: petal.duration,
            repeat: Infinity,
            delay: petal.delay,
            ease: 'linear',
          }}
        >
          {petal.id % 3 === 0 ? (
            // Small heart particle
            <svg
              width={16 * petal.scale}
              height={16 * petal.scale}
              viewBox="0 0 24 24"
              fill="rgba(240, 20, 114, 0.35)"
              className="drop-shadow-xs"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            // Curved Rose Petal SVG
            <svg
              width={22 * petal.scale}
              height={26 * petal.scale}
              viewBox="0 0 32 38"
              fill="none"
              className="drop-shadow-xs"
            >
              <path
                d="M16 2 C24 6, 30 15, 28 25 C26 33, 18 36, 14 36 C8 36, 3 31, 4 22 C5 12, 11 4, 16 2 Z"
                fill="url(#petalGradient)"
                opacity="0.7"
              />
              <path
                d="M16 4 C19 12, 17 24, 15 34"
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="1"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="petalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FB7185" stopOpacity="0.85" />
                  <stop offset="60%" stopColor="#F43F5E" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#BE123C" stopOpacity="0.65" />
                </linearGradient>
              </defs>
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
};
