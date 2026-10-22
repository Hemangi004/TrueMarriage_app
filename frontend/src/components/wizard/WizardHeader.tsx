import React from 'react';
import { useBiodata, TOTAL_QUESTIONS } from '../../context/BiodataContext';
import { Sparkles } from 'lucide-react';

const ENCOURAGING_MESSAGES: Record<number, string> = {
  1: "✨ Welcome! Let's build your dream bio.",
  2: "🎂 Great! When's the big day?",
  3: "👤 Perfect! Telling us more about yourself.",
  4: "📏 Looking good! Every detail helps.",
  5: "⚖️ Awesome! Moving right along.",
  6: "🩸 Super! Fast and easy.",
  7: "✨ Sparkling! Express your unique vibe.",
  8: "🕊️ Beautiful! Finding matching cultures.",
  9: "📜 Great job! Adding your heritage.",
  10: "⭐ Almost halfway there! You're on fire.",
  11: "🗣️ Languages connect hearts!",
  12: "🏠 Where do you call home?",
  13: "📍 Address preferences set!",
  14: "🏢 Adding permanent location details.",
  15: "📱 Keep your account safe and verified.",
  16: "📧 Stay notified with matching profiles.",
  17: "💍 Tell us your marital preferences.",
  18: "🎓 Education shines bright!",
  19: "💼 Professional journey matters.",
  20: "👨‍👩‍👧‍👦 Family is everything!",
  21: "🥗 Lifestyle vibes & hobbies matter.",
  22: "❤️ Almost done! What are you looking for?",
  23: "📸 Profiles with photos get 5x more responses!",
  24: "🎉 Woohoo! Your premium biodata is ready!",
};

export const WizardHeader: React.FC = () => {
  const { questionIndex } = useBiodata();

  const progressPercent = Math.round((questionIndex / TOTAL_QUESTIONS) * 100);
  const encouragingMessage = ENCOURAGING_MESSAGES[questionIndex] || "✨ Great! Let's continue.";

  return (
    <header className="w-full max-w-xl mx-auto pt-3 sm:pt-4 px-4 pb-1 select-none space-y-2">
      {/* Top Row: Step Counter */}
      <div className="flex items-center justify-between relative">
        <span className="px-3 py-0.5 bg-rose-50 border border-rose-200/80 text-[#F01472] font-[450] text-[11px] sm:text-xs rounded-full shadow-xs tracking-wide">
          Step {questionIndex} of {TOTAL_QUESTIONS}
        </span>
      </div>

      {/* Animated Progress Bar */}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-rose-100 shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-rose-400 via-[#F01472] to-[#C80E5A] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Encouraging AI Message Banner */}
      <div className="flex items-center justify-center gap-1.5 py-0.5 px-3 bg-gradient-to-r from-rose-50/80 via-pink-50/60 to-rose-50/80 border border-rose-100/60 rounded-xl text-[11px] sm:text-xs font-[450] text-[#C80E5A]">
        <Sparkles size={12} className="text-[#F01472] animate-pulse" />
        <span>{encouragingMessage}</span>
      </div>
    </header>
  );
};
