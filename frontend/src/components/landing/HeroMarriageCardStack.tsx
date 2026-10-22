import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  RotateCcw,
  MessageCircle,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import confetti from 'canvas-confetti';

interface ProfileItem {
  id: string;
  name: string;
  age: number;
  profession: string;
  location: string;
  image: string;
  isNew?: boolean;
}

const PROFILES: ProfileItem[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    age: 25,
    profession: 'Software Engineer',
    location: 'Delhi, India',
    image: '/images/hero_bride.jpg',
    isNew: true,
  },
  {
    id: '2',
    name: 'Rahul Verma',
    age: 27,
    profession: 'Product Designer',
    location: 'Mumbai, India',
    image: '/images/hero_groom.jpg',
    isNew: true,
  },
  {
    id: '3',
    name: 'Kavya Ramanathan',
    age: 25,
    profession: 'Data Scientist',
    location: 'Chennai, India',
    image: '/images/hero_south_bride.jpg',
    isNew: true,
  },
  {
    id: '4',
    name: 'Arjun Malhotra',
    age: 28,
    profession: 'Investment Banker',
    location: 'Chandigarh, India',
    image: '/images/hero_north_groom.jpg',
    isNew: false,
  },
  {
    id: '5',
    name: 'Aditya Menon',
    age: 27,
    profession: 'Product Manager',
    location: 'Bangalore, India',
    image: '/images/hero_south_groom.jpg',
    isNew: true,
  },
  {
    id: '6',
    name: 'Ananya Iyer',
    age: 26,
    profession: 'Financial Analyst',
    location: 'Hyderabad, India',
    image: '/images/hero_bride_2.jpg',
    isNew: false,
  },
];

interface HeroMarriageCardStackProps {
  onOpenRegister?: () => void;
  onExploreMatches?: () => void;
}

export const HeroMarriageCardStack: React.FC<HeroMarriageCardStackProps> = ({
  onOpenRegister,
  onExploreMatches,
}) => {
  const { t } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [isPaused, setIsPaused] = useState(false);

  // Automatic 3-second interval to rotate images
  React.useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PROFILES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const currentProfile = PROFILES[currentIndex];
  const isLiked = Boolean(likedMap[currentProfile.id]);

  const prevProfile = PROFILES[(currentIndex - 1 + PROFILES.length) % PROFILES.length];
  const nextProfile = PROFILES[(currentIndex + 1) % PROFILES.length];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + PROFILES.length) % PROFILES.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % PROFILES.length);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isLiked;
    setLikedMap((prev) => ({ ...prev, [currentProfile.id]: nextState }));

    if (nextState) {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { x: 0.75, y: 0.45 },
        colors: ['#F01472', '#FB7185', '#FDA4AF', '#FFE4E6', '#C084FC'],
      });
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedMap((prev) => ({ ...prev, [currentProfile.id]: false }));
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative flex flex-col items-center select-none w-full max-w-[460px] mx-auto"
    >
      {/* ── Main Fan-Deck Card Structure (Matching Image 1) ── */}
      <div className="relative w-full h-[450px] flex items-center justify-center">
        {/* Soft Ambient Radial Light Aura */}
        <div className="absolute -inset-10 bg-gradient-to-tr from-pink-300/35 via-rose-200/25 to-purple-200/25 rounded-[60px] blur-3xl pointer-events-none" />

        {/* ── Left Navigation Arrow (Image 1 style) ── */}
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          onClick={handlePrev}
          className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-pink-400 hover:text-[#F01472] shadow-md hover:shadow-lg border border-pink-100 flex items-center justify-center transition-all cursor-pointer"
          title="Previous Match"
          aria-label="Previous Match"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </motion.button>

        {/* ── Left Background Card (Fanned out left) ── */}
        <motion.div
          onClick={handlePrev}
          className="absolute left-0 sm:left-4 w-[240px] sm:w-[260px] aspect-[4/5] rounded-[30px] overflow-hidden shadow-lg border border-pink-100/60 bg-white opacity-60 transform -rotate-12 -translate-x-6 sm:-translate-x-10 cursor-pointer hover:opacity-80 transition-all z-0"
        >
          <img
            src={prevProfile.image}
            alt={prevProfile.name}
            className="w-full h-full object-cover grayscale-[20%]"
          />
        </motion.div>

        {/* ── Right Background Card (Fanned out right) ── */}
        <motion.div
          onClick={handleNext}
          className="absolute right-0 sm:right-4 w-[240px] sm:w-[260px] aspect-[4/5] rounded-[30px] overflow-hidden shadow-lg border border-pink-100/60 bg-white opacity-60 transform rotate-12 translate-x-6 sm:translate-x-10 cursor-pointer hover:opacity-80 transition-all z-0"
        >
          <img
            src={nextProfile.image}
            alt={nextProfile.name}
            className="w-full h-full object-cover grayscale-[20%]"
          />
        </motion.div>

        {/* ── Right Navigation Arrow (Image 1 style) ── */}
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleNext}
          className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-[#F01472] hover:bg-[#C80E5A] text-white shadow-lg shadow-pink-500/30 flex items-center justify-center transition-all cursor-pointer"
          title="Next Match"
          aria-label="Next Match"
        >
          <ChevronRight size={20} strokeWidth={2.5} />
        </motion.button>

        {/* ── Center Main Active Card (Image 1 style) ── */}
        <div className="relative z-20 w-[270px] sm:w-[300px] aspect-[4/5]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProfile.id}
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full h-full rounded-[32px] overflow-hidden shadow-2xl shadow-pink-300/40 border-2 border-white bg-white flex flex-col group"
            >
              {/* Full Card Photo */}
              <div className="relative w-full h-full">
                <img
                  src={currentProfile.image}
                  alt={currentProfile.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />

                {/* Top Left: "New" Green Pill (Exact Image 1) */}
                {currentProfile.isNew && (
                  <div className="absolute top-4 left-4 bg-[#22C55E] text-white text-[11px] font-[450] px-3 py-0.5 rounded-full shadow-sm">
                    {t('New')}
                  </div>
                )}

                {/* Bottom Overlay Info (Exact Image 1) */}
                <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-5 pb-16 text-white text-left">
                  {/* Name + Age + Green Verified Badge */}
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-[450] text-white tracking-wide drop-shadow-xs">
                      {currentProfile.name}, {currentProfile.age}
                    </h3>
                    {/* Green circle with white checkmark badge */}
                    <span className="inline-flex items-center justify-center w-4 h-4 bg-[#22C55E] rounded-full text-white shrink-0 shadow-xs">
                      <Check size={10} strokeWidth={3.5} />
                    </span>
                  </div>

                  {/* Profession */}
                  <p className="text-xs text-white/90 font-[400] mt-0.5">
                    {currentProfile.profession}
                  </p>

                  {/* Location */}
                  <p className="text-[11px] text-white/75 font-[400]">
                    {currentProfile.location}
                  </p>
                </div>

                {/* ── 3 Action Buttons Anchored on Bottom Center (Exact Image 1) ── */}
                <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-3.5 z-10">
                  {/* Undo Button */}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: -15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleReset}
                    className="w-11 h-11 rounded-full bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700 flex items-center justify-center shadow-lg transition-all cursor-pointer"
                    title="Reset / Undo"
                  >
                    <RotateCcw size={16} strokeWidth={2.2} />
                  </motion.button>

                  {/* Heart / Like Button (Center Larger) */}
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.88 }}
                    onClick={handleLike}
                    className={`w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-xl transition-all cursor-pointer border border-pink-100 ${
                      isLiked ? 'ring-4 ring-pink-200' : ''
                    }`}
                    title="Like profile"
                  >
                    <Heart
                      size={24}
                      className={`transition-transform duration-300 ${
                        isLiked
                          ? 'fill-[#F01472] text-[#F01472] scale-110'
                          : 'fill-[#F01472] text-[#F01472] hover:scale-105'
                      }`}
                    />
                  </motion.button>

                  {/* Chat Button */}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => (onOpenRegister ? onOpenRegister() : onExploreMatches?.())}
                    className="w-11 h-11 rounded-full bg-white hover:bg-pink-50 text-[#F01472] flex items-center justify-center shadow-lg transition-all cursor-pointer"
                    title="Message / Chat"
                  >
                    <MessageCircle size={17} className="fill-[#F01472]" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Social Proof Bottom Bar (Exact Image 1 style) ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-4 bg-white/95 backdrop-blur-md px-6 py-3 rounded-full border border-pink-100 shadow-md shadow-pink-200/30 flex items-center gap-4"
      >
        {/* 4 Avatars Overlapping with Green Check Circle */}
        <div className="flex items-center -space-x-2">
          {PROFILES.slice(0, 3).map((p, idx) => (
            <div
              key={idx}
              className="w-7 h-7 rounded-full overflow-hidden border-2 border-white shadow-xs"
            >
              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
            </div>
          ))}
          {/* 4th avatar with check badge */}
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-100 to-rose-200 border-2 border-white flex items-center justify-center relative shadow-xs">
            <span className="text-[10px]">👩</span>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#22C55E] rounded-full text-white flex items-center justify-center text-[7px] font-bold border border-white">
              ✓
            </span>
          </div>
        </div>

        {/* Text */}
        <div className="text-left leading-tight">
          <div className="text-xs font-[450] text-[#F01472]">
            1,000+ {t('families')}
          </div>
          <div className="text-[11px] text-gray-500 font-[400]">
            {t('found their perfect match')}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
