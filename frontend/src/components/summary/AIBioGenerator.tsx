import React, { useState } from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { generateOllamaSummaryApi } from '../../services/apiService';
import { Sparkles, RefreshCw, Check, Edit3, Wand2, Copy, Heart, Briefcase, Feather, Crown } from 'lucide-react';

const TONES = [
  {
    id: 'warm_balanced',
    label: '🌸 Warm & Balanced',
    icon: Heart,
    selectedClass: 'bg-gradient-to-br from-rose-500 to-pink-600 text-white border-rose-500 shadow-md shadow-rose-500/25 ring-2 ring-rose-400/50',
    unselectedClass: 'bg-rose-50/80 border-rose-200/90 text-rose-900 hover:bg-rose-100/80 hover:border-rose-300',
    iconColor: 'text-rose-400/35',
  },
  {
    id: 'modern_professional',
    label: '💼 Modern Professional',
    icon: Briefcase,
    selectedClass: 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md shadow-blue-500/25 ring-2 ring-blue-400/50',
    unselectedClass: 'bg-blue-50/80 border-blue-200/90 text-blue-900 hover:bg-blue-100/80 hover:border-blue-300',
    iconColor: 'text-blue-400/35',
  },
  {
    id: 'traditional_cultural',
    label: '🪷 Traditional & Cultural',
    icon: Crown,
    selectedClass: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white border-amber-500 shadow-md shadow-amber-500/25 ring-2 ring-amber-400/50',
    unselectedClass: 'bg-amber-50/80 border-amber-200/90 text-amber-950 hover:bg-amber-100/80 hover:border-amber-300',
    iconColor: 'text-amber-500/35',
  },
  {
    id: 'heartfelt_direct',
    label: '❤️ Heartfelt & Direct',
    icon: Feather,
    selectedClass: 'bg-gradient-to-br from-purple-600 to-violet-700 text-white border-purple-600 shadow-md shadow-purple-500/25 ring-2 ring-purple-400/50',
    unselectedClass: 'bg-purple-50/80 border-purple-200/90 text-purple-900 hover:bg-purple-100/80 hover:border-purple-300',
    iconColor: 'text-purple-400/35',
  },
];

export const AIBioGenerator: React.FC<{
  onBioChange?: (bio: string) => void;
}> = ({ onBioChange }) => {
  const { formData, updateFormData } = useBiodata();
  const [selectedTone, setSelectedTone] = useState('warm_balanced');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiBioText, setAiBioText] = useState(formData.professionalSummary || '');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sourceTag, setSourceTag] = useState<string>('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateOllamaSummaryApi(formData, 'llama3', aiBioText || undefined, selectedTone);
      if (result?.summary) {
        setAiBioText(result.summary);
        setSourceTag(result.source || 'ai');
        updateFormData({ professionalSummary: result.summary });
        if (onBioChange) onBioChange(result.summary);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyBio = (text: string) => {
    setAiBioText(text);
    updateFormData({ professionalSummary: text });
    if (onBioChange) onBioChange(text);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(aiBioText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-gradient-to-br from-rose-500/5 via-pink-500/5 to-purple-500/5 border border-rose-200/80 rounded-3xl p-6 shadow-sm mb-8">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5 border-b border-rose-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#F01472] to-[#C80E5A] text-white flex items-center justify-center shadow-md shadow-rose-500/20">
            <Wand2 size={24} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
              AI Matrimonial Bio Generator
              <span className="text-xs bg-rose-100 text-[#F01472] px-2.5 py-0.5 rounded-full font-bold">
                Smart LLM
              </span>
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Automatically craft an engaging, personalized matrimonial intro bio in your preferred tone.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="gradient-btn px-6 py-3 text-sm font-extrabold flex items-center gap-2 shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? (
            <RefreshCw size={18} className="animate-spin" />
          ) : (
            <Sparkles size={18} />
          )}
          <span>{isGenerating ? 'Crafting Bio...' : aiBioText ? 'Regenerate Bio' : 'Generate Bio'}</span>
        </button>
      </div>

      {/* Tone Selection Chips */}
      <div className="mb-5">
        <label className="block text-xs font-bold text-gray-700 mb-2">
          Select Writing Tone
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TONES.map((t) => {
            const Icon = t.icon;
            const isSelected = selectedTone === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTone(t.id)}
                className={`relative overflow-hidden group p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 text-left cursor-pointer min-h-[64px] flex items-center ${
                  isSelected ? t.selectedClass : t.unselectedClass
                }`}
              >
                <span className="relative z-10 text-xs sm:text-sm font-bold leading-snug tracking-tight pr-6">
                  {t.label}
                </span>
                <div className="absolute -right-3 -bottom-3 pointer-events-none transition-transform duration-300 group-hover:scale-110 group-hover:rotate-0">
                  <Icon
                    size={62}
                    strokeWidth={1.5}
                    className={`${isSelected ? 'text-white/20' : t.iconColor} rotate-[-12deg]`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Generated Output Box */}
      {aiBioText ? (
        <div className="relative bg-white border border-rose-200 rounded-2xl p-5 shadow-xs space-y-3">
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={aiBioText}
                maxLength={500}
                onChange={(e) => handleApplyBio(e.target.value.slice(0, 500))}
                rows={4}
                className="wizard-input text-sm leading-relaxed p-3 w-full"
                placeholder="Edit your bio text..."
              />
              <div className="flex justify-between items-center text-[11px] text-gray-400">
                <span>{aiBioText.length}/500</span>
                {aiBioText.length >= 500 && <span className="text-amber-600 font-semibold">Maximum limit reached</span>}
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-1.5 bg-[#F01472] text-white text-xs font-bold rounded-xl"
              >
                Done Editing
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-800 leading-relaxed italic bg-rose-50/40 p-4 rounded-xl border border-rose-100">
                "{aiBioText}"
              </p>

              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold rounded-full text-[11px] flex items-center gap-1">
                    <Check size={12} /> Applied to Biodata
                  </span>
                  {sourceTag && (
                    <span className="text-[10px] text-gray-400 font-medium">
                      Source: {sourceTag === 'ollama' ? '🤖 Ollama AI' : '⚡ Smart Engine'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="text-[#F01472] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 size={13} /> Edit Bio
                  </button>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="text-gray-500 hover:text-gray-900 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 text-center border-2 border-dashed border-rose-200 rounded-2xl bg-white/60">
          <Sparkles className="mx-auto text-rose-300 mb-2" size={28} />
          <p className="text-xs text-gray-500 font-medium">
            Click <strong>Generate Bio</strong> above to craft an AI-generated introduction for your biodata.
          </p>
        </div>
      )}
    </div>
  );
};
