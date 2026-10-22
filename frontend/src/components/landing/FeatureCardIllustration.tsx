import React from 'react';

export const FeatureCardIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 450 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-auto drop-shadow-sm select-none ${className}`}
    >
      <defs>
        <filter id="featShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#7c3aed" floodOpacity="0.08" />
        </filter>
        <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f8fafc" />
        </linearGradient>
      </defs>

      {/* ── Floating Leaves Above Screen ── */}
      <g opacity="0.6">
        <path d="M220 50 C215 35 230 25 245 35 C240 50 225 60 220 50 Z" fill="#c084fc" />
        <path d="M245 42 C255 30 270 38 265 52 C250 55 240 48 245 42 Z" fill="#a855f7" />
        <path d="M232 55 C238 48 248 52 245 60 C238 62 230 58 232 55 Z" fill="#9333ea" />
      </g>

      {/* ── Screen Window / Wireframe Box ── */}
      <g filter="url(#featShadow)">
        {/* Outer Frame */}
        <rect
          x="90"
          y="70"
          width="250"
          height="160"
          rx="10"
          fill="url(#screenGrad)"
          stroke="#cbd5e1"
          strokeWidth="2"
        />
        {/* Window Titlebar */}
        <path
          d="M90 80 C90 74.4772 94.4772 70 100 70 L330 70 C335.523 70 340 74.4772 340 80 L340 90 L90 90 Z"
          fill="#475569"
        />
        {/* Window Dots */}
        <circle cx="102" cy="80" r="3" fill="#cbd5e1" />
        <circle cx="112" cy="80" r="3" fill="#cbd5e1" />
        <circle cx="122" cy="80" r="3" fill="#cbd5e1" />

        {/* Inner Content Placeholder on Screen */}
        <rect x="105" y="105" width="80" height="70" rx="4" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1.5" />
        <rect x="115" y="115" width="60" height="8" rx="2" fill="#e2e8f0" />
        <rect x="115" y="130" width="45" height="6" rx="2" fill="#ede9fe" />

        {/* Text Lines on Right Side of Screen */}
        <rect x="200" y="110" width="125" height="8" rx="2" fill="#e2e8f0" />
        <rect x="200" y="125" width="110" height="7" rx="2" fill="#ede9fe" />
        <rect x="200" y="138" width="120" height="7" rx="2" fill="#e2e8f0" />
        <rect x="200" y="151" width="95" height="7" rx="2" fill="#ede9fe" />
        <rect x="200" y="164" width="115" height="7" rx="2" fill="#e2e8f0" />
      </g>

      {/* ── Floor Shadows ── */}
      <ellipse cx="120" cy="270" rx="25" ry="5" fill="#7c3aed" fillOpacity="0.1" />
      <ellipse cx="320" cy="270" rx="25" ry="5" fill="#7c3aed" fillOpacity="0.1" />
      <ellipse cx="260" cy="255" rx="14" ry="4" fill="#7c3aed" fillOpacity="0.1" />

      {/* ── Character 1 (Left - Pointing to Card) ── */}
      <g>
        {/* Head */}
        <ellipse cx="118" cy="148" rx="8" ry="9" fill="#ffd1b3" />
        <path d="M110 145 C110 138 116 134 122 135 C126 136 128 142 126 148 Z" fill="#1e1b4b" />
        
        {/* Torso - Dark Blue/Purple Suit */}
        <path d="M108 160 C114 158 122 158 128 160 L130 205 L106 205 Z" fill="#4338ca" />
        
        {/* Left Arm raised pointing */}
        <path d="M125 168 C135 160 142 152 150 152" stroke="#4338ca" strokeWidth="6" strokeLinecap="round" />
        <circle cx="150" cy="152" r="3" fill="#ffd1b3" />

        {/* Floating Card Widget Left Character is interacting with */}
        <rect x="135" y="155" width="48" height="32" rx="4" fill="#c084fc" opacity="0.9" />
        <rect x="142" y="163" width="34" height="4" rx="1" fill="#ffffff" />
        <rect x="142" y="172" width="22" height="4" rx="1" fill="#f3e8ff" />

        {/* Pants & Legs */}
        <path d="M111 205 L108 255" stroke="#312e81" strokeWidth="6.5" strokeLinecap="round" />
        <path d="M124 205 L126 255" stroke="#312e81" strokeWidth="6.5" strokeLinecap="round" />
        <path d="M104 255 L112 258" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
        <path d="M123 255 L131 258" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* ── Character 2 (Right - Holding Card) ── */}
      <g>
        {/* Head */}
        <ellipse cx="322" cy="148" rx="8" ry="9" fill="#ffd1b3" />
        <path d="M315 145 C315 137 322 134 328 136 C332 138 333 144 330 148 Z" fill="#78350f" />

        {/* Torso - Business Suit */}
        <path d="M312 160 C318 158 326 158 332 160 L334 205 L310 205 Z" fill="#475569" />
        <path d="M320 160 L322 175 L324 160 Z" fill="#f87171" />

        {/* Left Arm holding floating card */}
        <path d="M312 168 C302 175 295 180 292 185" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
        
        {/* Floating Card Widget Right Character is placing */}
        <rect x="275" y="175" width="40" height="34" rx="4" fill="#c084fc" opacity="0.9" />
        <rect x="282" y="184" width="26" height="4" rx="1" fill="#ffffff" />
        <rect x="282" y="193" width="18" height="4" rx="1" fill="#f3e8ff" />

        {/* Pants & Legs */}
        <path d="M315 205 L315 255" stroke="#1e293b" strokeWidth="6.5" strokeLinecap="round" />
        <path d="M328 205 L332 255" stroke="#1e293b" strokeWidth="6.5" strokeLinecap="round" />
        <path d="M311 255 L319 258" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
        <path d="M329 255 L337 258" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* ── Floor Potted Plant ── */}
      <g>
        {/* Plant Pot */}
        <path d="M255 240 L265 240 L263 252 L257 252 Z" fill="#64748b" />
        {/* Leaves */}
        <path d="M260 238 C255 228 250 230 252 235" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
        <path d="M260 238 C265 226 270 230 268 235" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
        <path d="M260 238 L260 226" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
};
