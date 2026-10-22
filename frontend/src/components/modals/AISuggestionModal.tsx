import React, { useState } from 'react';
import { Sparkles, X, Check, Wand2 } from 'lucide-react';
import { useBiodata } from '../../context/BiodataContext';


const AI_SUGGESTIONS = {
  summary: [
    'Passionate Senior AI Engineer working with global products. Tech enthusiast who loves solving real-world problems and balancing professional growth with family values.',
    'Thoughtful, warm-hearted professional with a keen interest in literature, classical music, and tech innovation. Believes in mutual respect and continuous learning.',
    'Energetic corporate leader with an entrepreneurial mindset. Enjoys weekend travels, fitness, and spending quality time with family and close friends.'
  ],
  expectations: [
    'Looking for a warm-hearted, progressive partner with strong family values, open communication, and mutual respect. Preferably someone who values personal growth and family togetherness.',
    'Seeking an educated, independent, and understanding life partner who enjoys meaningful conversations, traveling, and sharing life\'s ups and downs with a positive outlook.',
    'Hoping to connect with a compassionate partner from a similar cultural background who balances career ambitions with family life.'
  ],
  hobbies: [
    ['Reading', 'Travel', 'Photography', 'Gym', 'Meditation'],
    ['Cooking', 'Music', 'Movies', 'Yoga', 'Adventure'],
    ['Painting', 'Dance', 'Sports', 'Gaming', 'Reading']
  ]
};

export const AISuggestionModal: React.FC = () => {
  const { aiModal, closeAiModal, applyAiSuggestion } = useBiodata();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  if (!aiModal.isOpen || !aiModal.type) return null;

  const currentOptions = AI_SUGGESTIONS[aiModal.type];

  const handleApply = () => {
    applyAiSuggestion(currentOptions[selectedIndex] as any);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
      <div className="glass-card max-w-lg w-full rounded-lg p-6 sm:p-8 relative space-y-6 border border-purple-200/50 shadow-md bg-white">
        
        {/* Close button */}
        <button
          onClick={closeAiModal}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-purple-600 to-rose-500 text-white flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              AI Writing Assistant
            </h3>
            <p className="text-xs text-slate-500">
              {aiModal.type === 'summary' && 'Generate elegant professional summary & bio'}
              {aiModal.type === 'expectations' && 'Generate partner expectations copy'}
              {aiModal.type === 'hobbies' && 'Select AI-curated hobby packages'}
            </p>
          </div>
        </div>

        {/* Options List */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {currentOptions.map((opt, idx) => {
            const isSelected = selectedIndex === idx;
            const textContent = Array.isArray(opt) ? opt.join(', ') : opt;

            return (
              <div
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-500/20 shadow-md'
                    : 'bg-white border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-medium text-slate-800 leading-relaxed">
                    "{textContent}"
                  </p>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'bg-purple-600 text-white' : 'border border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Apply Action Button */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={closeAiModal}
            className="flex-1 py-3 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-rose-600 text-white text-xs font-bold shadow-lg hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            <Wand2 className="w-4 h-4" /> Apply AI Suggestion
          </button>
        </div>

      </div>
    </div>
  );
};
