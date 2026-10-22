import React from 'react';

export const MeetupHeroIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 620 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-auto drop-shadow-sm select-none ${className}`}
    >
      <defs>
        {/* Soft Backdrop Organic Blob */}
        <linearGradient id="blobGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f3e8ff" stopOpacity="0.6" />
        </linearGradient>
        {/* Table Gradient */}
        <linearGradient id="tableTopGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fffbf5" />
          <stop offset="100%" stopColor="#f5ede0" />
        </linearGradient>
      </defs>

      {/* ── Soft Background Organic Blob Container ── */}
      <path
        d="M260 40 C380 10 520 20 580 90 C640 160 610 280 570 360 C530 440 400 450 300 420 C200 390 190 320 200 240 C210 160 210 60 260 40 Z"
        fill="url(#blobGrad)"
      />

      {/* Decorative Soft Horizontal Lines on Background */}
      <g opacity="0.4">
        <line x1="280" y1="90" x2="350" y2="90" stroke="#d8b4fe" strokeWidth="8" strokeLinecap="round" />
        <line x1="290" y1="110" x2="330" y2="110" stroke="#d8b4fe" strokeWidth="6" strokeLinecap="round" />
      </g>

      {/* ── Artistic Tree & Branches in Background ── */}
      <g>
        {/* Main Trunk */}
        <path
          d="M485 360 L480 180 C480 150 450 130 425 100 C410 82 420 65 435 55"
          stroke="#d2bba8"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Branch Right */}
        <path
          d="M480 170 C510 140 540 120 565 85 C575 72 585 55 590 35"
          stroke="#d2bba8"
          strokeWidth="9"
          strokeLinecap="round"
        />
        {/* Small Upper Sub-branches */}
        <path d="M440 85 C420 70 395 60 380 40" stroke="#d2bba8" strokeWidth="6" strokeLinecap="round" />
        <path d="M525 125 C555 110 575 95 595 70" stroke="#d2bba8" strokeWidth="6" strokeLinecap="round" />
        <path d="M480 210 C505 190 535 180 550 160" stroke="#d2bba8" strokeWidth="6" strokeLinecap="round" />

        {/* Tree Foliage Cloud Canopy (Soft Lavender/Purple) */}
        <path
          d="M370 50 C350 30 380 10 415 15 C440 -5 480 5 495 25 C525 10 560 20 570 45 C595 40 615 65 605 90 C620 115 605 140 580 145 C560 165 525 160 505 145 C485 165 445 160 430 135 C400 145 370 125 375 95 C355 85 355 65 370 50 Z"
          fill="#ede9fe"
          opacity="0.75"
        />
        <circle cx="430" cy="70" r="18" fill="#d8b4fe" opacity="0.5" />
        <circle cx="530" cy="50" r="22" fill="#c084fc" opacity="0.45" />
        <circle cx="575" cy="95" r="16" fill="#d8b4fe" opacity="0.5" />
      </g>

      {/* ── Ground Plants / Foliage Behind Seating ── */}
      <g>
        {/* Left Ground Leaves */}
        <path d="M255 365 C235 330 245 295 265 275 C260 305 275 335 295 355" fill="#8b5cf6" />
        <path d="M238 345 C222 315 235 285 255 275 C245 305 260 330 280 350" fill="#a78bfa" opacity="0.8" />
        <circle cx="270" cy="370" r="3.5" fill="#8b5cf6" />
        <circle cx="285" cy="375" r="4.5" fill="#a78bfa" />
        <circle cx="300" cy="373" r="3" fill="#8b5cf6" />

        {/* Right Ground Leaves */}
        <path d="M545 360 C565 335 560 310 540 300 C550 320 535 340 525 355" fill="#a855f7" />
        <circle cx="555" cy="365" r="4" fill="#a855f7" />
        <circle cx="540" cy="368" r="3.5" fill="#c084fc" />
      </g>

      {/* ── Floor / Ground Shadow ── */}
      <ellipse cx="440" cy="385" rx="160" ry="14" fill="#7c3aed" fillOpacity="0.08" />

      {/* ── Center Person 1 (Man in Dark Suit/Shirt) ── */}
      <g>
        {/* Torso */}
        <path d="M410 205 C425 205 448 215 452 245 L456 315 L405 315 L410 245 Z" fill="#334155" />
        {/* Collar */}
        <path d="M425 215 L433 240 L440 215 Z" fill="#ffffff" />
        {/* Head */}
        <path d="M428 190 L428 210 L436 210 L436 190 Z" fill="#8d5b4c" />
        <ellipse cx="432" cy="175" rx="13" ry="15" fill="#8d5b4c" />
        {/* Dark Short Hair */}
        <path d="M419 175 C419 160 427 155 436 155 C445 155 449 163 449 173 C449 177 445 181 441 180 C437 170 427 170 423 180 Z" fill="#0f172a" />
        {/* Arms */}
        <path d="M414 245 C414 265 425 282 438 288" stroke="#334155" strokeWidth="9" strokeLinecap="round" />
        <circle cx="438" cy="288" r="5" fill="#8d5b4c" />
      </g>

      {/* ── Center Person 2 / Friend in Background ── */}
      <g opacity="0.95">
        <path d="M375 220 C388 220 405 230 408 255 L410 315 L370 315 Z" fill="#475569" />
        <ellipse cx="388" cy="190" rx="12" ry="14" fill="#a16207" />
        <path d="M378 190 C378 178 385 174 392 174 C399 174 402 180 402 188 Z" fill="#1e1b4b" />
      </g>

      {/* ── Table (Placed in Center Depth) ── */}
      <g>
        {/* Wooden-look Modern Round Table Top */}
        <ellipse cx="428" cy="290" rx="60" ry="12" fill="url(#tableTopGrad)" stroke="#e4dac7" strokeWidth="2" />
        {/* Table Legs */}
        <path d="M418 300 L398 380" stroke="#d59f84" strokeWidth="5" strokeLinecap="round" />
        <path d="M438 300 L458 380" stroke="#d59f84" strokeWidth="5" strokeLinecap="round" />
        <path d="M428 300 L428 380" stroke="#b87d60" strokeWidth="4" strokeLinecap="round" />
        {/* Crossbar */}
        <path d="M408 342 L448 342" stroke="#c48a6d" strokeWidth="3" />
        {/* Coffee Cups on Table */}
        <rect x="404" y="282" width="8" height="9" rx="2" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <rect x="438" y="280" width="7" height="10" rx="2" fill="#ec4899" />
      </g>

      {/* ── Guy on Left (Orange T-shirt, Blue Jeans, Blonde Hair) ── */}
      <g>
        {/* Left Chair Frame */}
        <path d="M322 250 C312 270 312 308 322 338" stroke="#e2b197" strokeWidth="5" strokeLinecap="round" />
        <path d="M316 280 L350 330" stroke="#e2b197" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M326 338 L306 395" stroke="#d59f84" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M354 338 L346 392" stroke="#c48a6d" strokeWidth="4.5" strokeLinecap="round" />

        {/* Left Arm on table */}
        <path d="M375 250 C390 262 405 272 418 276" stroke="#ff6b6b" strokeWidth="12" strokeLinecap="round" />
        <circle cx="418" cy="276" r="6" fill="#ffd1b3" />

        {/* Torso - Orange Salmon Shirt */}
        <path d="M346 220 C365 216 382 225 384 255 L380 320 L342 320 L338 250 Z" fill="#ff6b6b" />

        {/* Head & Neck */}
        <path d="M358 200 L358 220 L368 220 L368 200 Z" fill="#ffd1b3" />
        <ellipse cx="363" cy="184" rx="14" ry="16" fill="#ffd1b3" />

        {/* Blonde/Yellow Hair */}
        <path d="M349 182 C349 165 360 158 372 160 C382 162 383 172 379 182 C376 174 365 170 358 182 Z" fill="#fef08a" />
        <path d="M349 182 C346 174 351 165 360 162 C365 158 374 160 378 167" stroke="#fde047" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Blue Pants / Jeans */}
        <path d="M346 315 C348 335 362 345 380 345 L398 345 C408 355 398 388 390 398" stroke="#60a5fa" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M348 320 C352 348 364 362 375 372" stroke="#3b82f6" strokeWidth="12" strokeLinecap="round" />

        {/* Shoes */}
        <path d="M385 398 C380 398 376 402 378 407 L398 407 C401 403 394 398 385 398 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
        <path d="M373 372 L386 376 L382 381 L369 377 Z" fill="#1e293b" />
      </g>

      {/* ── Woman on Right (Purple Top, Dark Pants, Long Hair) ── */}
      <g>
        {/* Right Chair */}
        <path d="M510 260 C520 280 520 315 510 345" stroke="#e2b197" strokeWidth="5" strokeLinecap="round" />
        <path d="M510 345 L528 400" stroke="#d59f84" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M482 345 L492 395" stroke="#c48a6d" strokeWidth="4.5" strokeLinecap="round" />

        {/* Torso - Purple Top */}
        <path d="M495 225 C480 223 464 233 464 258 L468 320 L502 320 L506 254 Z" fill="#7c3aed" />

        {/* Head & Neck */}
        <path d="M484 204 L484 225 L494 225 L494 204 Z" fill="#d49b82" />
        <ellipse cx="489" cy="188" rx="13" ry="15" fill="#d49b82" />

        {/* Curly Brunette Hair */}
        <path d="M476 188 C474 172 485 162 498 165 C509 169 511 181 507 195 C503 209 496 218 491 219 C487 209 480 206 476 188 Z" fill="#9a3412" />
        <path d="M504 191 C509 205 509 224 502 238" stroke="#9a3412" strokeWidth="5.5" strokeLinecap="round" />

        {/* Left Arm gesturing */}
        <path d="M466 248 C452 262 443 266 433 269" stroke="#7c3aed" strokeWidth="10" strokeLinecap="round" />
        <circle cx="433" cy="269" r="5" fill="#d49b82" />

        {/* Dark Pants & Crossed Legs */}
        <path d="M490 315 C485 333 472 350 458 360 L458 378 C462 388 471 392 480 394" stroke="#1e1b4b" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
        {/* Boots */}
        <path d="M458 373 C454 373 450 377 452 383 L467 385 C470 381 465 373 458 373 Z" fill="#b45309" />
      </g>
    </svg>
  );
};
