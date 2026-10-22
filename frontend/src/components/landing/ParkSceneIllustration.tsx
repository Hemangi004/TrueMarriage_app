import React from 'react';

export const ParkSceneIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 1000 650"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-auto select-none pointer-events-none ${className}`}
      preserveAspectRatio="none"
    >
      <defs>
        {/* Deep Purple Gradient */}
        <linearGradient id="parkBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#9333ea" />
          <stop offset="100%" stopColor="#7e22ce" />
        </linearGradient>

        <linearGradient id="treeGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7e22ce" />
          <stop offset="100%" stopColor="#581c87" />
        </linearGradient>

        <linearGradient id="benchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* ── Concentric Decorative Rings ── */}
      <g opacity="0.18">
        <circle cx="280" cy="480" r="140" stroke="#ffffff" strokeWidth="24" />
        <circle cx="280" cy="480" r="95" stroke="#ffffff" strokeWidth="16" />
      </g>

      {/* ── Distant Trees & Foliage Silhouette ── */}
      <g opacity="0.3">
        {/* Right Tree Silhouette */}
        <path
          d="M720 320 C720 220 750 180 770 140 M720 250 C680 200 660 170 650 140 M720 280 C760 240 790 220 810 180"
          stroke="#4c1d95"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Far Right Small Tree */}
        <path
          d="M860 330 C860 260 880 220 900 180 M860 280 C840 240 830 210 820 180"
          stroke="#4c1d95"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>

      {/* ── Large Stylized Tree on Bottom Left Center ── */}
      <g>
        {/* Tree Canopy Big Purple Cloud */}
        <path
          d="M480 380 C440 370 410 400 410 440 C390 460 395 500 420 520 C405 550 430 580 465 580 C480 610 520 620 555 605 C580 625 620 615 635 585 C660 580 675 550 665 520 C685 490 675 450 645 435 C650 395 615 370 575 380 C550 355 505 355 480 380 Z"
          fill="url(#treeGrad2)"
          opacity="0.95"
        />
        {/* Trunk & Bark Details */}
        <path d="M545 590 L535 650 L560 650 L555 590 Z" fill="#2e1065" />
        <path d="M540 540 C545 560 545 590 540 620" stroke="#3b0764" strokeWidth="12" strokeLinecap="round" />
      </g>

      {/* ── Distant Walking People (Small Silhouettes) ── */}
      <g opacity="0.8">
        {/* Couple walking in background */}
        <ellipse cx="818" cy="335" rx="3" ry="3.5" fill="#fbcfe8" />
        <path d="M816 339 L816 352 L820 352 L820 339 Z" fill="#f43f5e" />
        <path d="M817 352 L816 365" stroke="#1e1b4b" strokeWidth="1.5" />
        <path d="M819 352 L820 365" stroke="#1e1b4b" strokeWidth="1.5" />

        <ellipse cx="826" cy="336" rx="3" ry="3.5" fill="#ffd1b3" />
        <path d="M824 340 L824 353 L828 353 L828 340 Z" fill="#3b82f6" />
        <path d="M825 353 L824 366" stroke="#1e1b4b" strokeWidth="1.5" />
        <path d="M827 353 L828 366" stroke="#1e1b4b" strokeWidth="1.5" />

        {/* Small Bench in Distance */}
        <path d="M860 355 L885 355" stroke="#2e1065" strokeWidth="2.5" />
        <path d="M864 355 L862 365" stroke="#2e1065" strokeWidth="2" />
        <path d="M881 355 L883 365" stroke="#2e1065" strokeWidth="2" />
      </g>

      {/* ── Park Bench with Relaxing Person (Right Side) ── */}
      <g>
        {/* Park Bench */}
        {/* Seat & Backrest */}
        <path
          d="M710 380 L790 380 C794 380 796 384 794 388 L788 410 C786 414 782 416 778 416 L702 416 C698 416 694 412 696 408 L704 384 C706 381 708 380 710 380 Z"
          fill="url(#benchGrad)"
        />
        {/* Bench Legs */}
        <path d="M708 416 L704 445" stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M784 416 L788 445" stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" />

        {/* Person Relaxing on Bench with knee pulled up */}
        {/* Head */}
        <ellipse cx="738" cy="360" rx="7" ry="8" fill="#ffd1b3" />
        {/* Long dark wavy hair */}
        <path d="M732 355 C730 348 738 344 745 348 C748 352 750 365 746 375 C742 370 735 368 732 355 Z" fill="#09090b" />
        {/* Torso / Jacket */}
        <path d="M730 368 C738 366 748 368 750 382 L748 405 L726 405 Z" fill="#38bdf8" />
        {/* Legs / Boots (One leg raised on bench, one hanging down) */}
        <path d="M748 402 C755 395 765 388 775 390 L772 402 L750 408" fill="#1e1b4b" />
        <path d="M772 402 L782 422 L795 435" stroke="#09090b" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M742 405 L740 435" stroke="#1e1b4b" strokeWidth="7" strokeLinecap="round" />
        <path d="M738 435 L746 438" stroke="#09090b" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* ── Person Sitting Under Left Tree (Bottom) ── */}
      <g>
        {/* Head */}
        <ellipse cx="420" cy="552" rx="7" ry="8" fill="#ffd1b3" />
        <path d="M414 550 C414 544 422 540 426 542 C430 544 430 550 428 554 Z" fill="#9a3412" />
        {/* Body / Shirt */}
        <path d="M414 560 C420 558 428 558 432 560 L435 590 L410 590 Z" fill="#fb923c" />
        {/* Resting Arm */}
        <path d="M428 565 C435 572 445 575 452 572" stroke="#fb923c" strokeWidth="5" strokeLinecap="round" />
        {/* Legs sitting on grass */}
        <path d="M414 590 C425 595 445 595 455 588" stroke="#312e81" strokeWidth="7" strokeLinecap="round" />
      </g>

      {/* ── Botanical Plant Leaves on Bottom Right & Left Corners ── */}
      <g opacity="0.85">
        {/* Right Corner Big Foliage Sprig */}
        <path
          d="M930 600 C920 540 940 480 960 440 C955 490 970 540 985 580"
          fill="#c084fc"
        />
        <path
          d="M900 620 C910 560 925 510 945 470 C935 520 950 565 965 610"
          fill="#a855f7"
        />
        <circle cx="915" cy="530" r="4" fill="#f3e8ff" />
        <circle cx="940" cy="490" r="5" fill="#f3e8ff" />
        <circle cx="965" cy="450" r="4.5" fill="#f3e8ff" />
        <circle cx="975" cy="510" r="3.5" fill="#f3e8ff" />

        {/* Left Corner Foliage Sprig */}
        <path
          d="M80 620 C90 570 80 520 60 480 C70 530 55 570 40 610"
          fill="#c084fc"
          opacity="0.7"
        />
      </g>
    </svg>
  );
};
