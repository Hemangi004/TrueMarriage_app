import React from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { useI18n } from '../../context/I18nContext';
import { Check, Globe, Sparkles } from 'lucide-react';
import { SUPPORTED_TRANSLATION_LANGUAGES } from '../../services/indicTransliterationService';
import { normalizeLanguagesList } from '../../utils/nameValidation';

export const QLanguages: React.FC = () => {
  const { formData, updateFormData } = useBiodata();
  const { lang, setLang } = useI18n();

  const activeLangCode = formData.lang || lang || 'en';
  const selectedKnown = normalizeLanguagesList(formData.languagesKnown || []);

  const handleSelectPrimaryLanguage = (code: string) => {
    const chosen = SUPPORTED_TRANSLATION_LANGUAGES.find((l) => l.code === code);
    setLang(code as any);

    // Auto-ensure the primary language is also in languagesKnown
    const currentList = [...selectedKnown];
    if (chosen && !currentList.some((l) => l.toLowerCase() === chosen.name.toLowerCase())) {
      currentList.unshift(chosen.name);
    }

    updateFormData({
      lang: code,
      motherTongue: chosen?.name || formData.motherTongue || '',
      languagesKnown: currentList,
    });
  };

  const toggleKnownLanguage = (languageName: string) => {
    const isSelected = selectedKnown.some((l) => l.toLowerCase() === languageName.toLowerCase());
    let updated: string[];
    if (isSelected) {
      updated = selectedKnown.filter((l) => l.toLowerCase() !== languageName.toLowerCase());
    } else {
      updated = [...selectedKnown, languageName];
    }
    updateFormData({ languagesKnown: updated });
  };

  return (
    <div className="space-y-5 text-left">
      {/* ── 1. Primary / Native Biodata Language (Method 4: Database Stored) ── */}
      <div className="bg-gradient-to-br from-rose-50/80 via-white to-pink-50/60 border border-rose-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#F01472] text-white flex items-center justify-center shadow-2xs">
              <Globe size={14} />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                Primary Biodata Language
              </h3>
              <p className="text-[11px] text-gray-500">
                All templates, names, and field labels will be previewed and printed in this language.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-rose-600 bg-rose-100/70 px-2 py-0.5 rounded-full">
            <Sparkles size={11} /> Saved to Profile
          </span>
        </div>

        {/* 13 Supported Translation/Transliteration Languages Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-1">
          {SUPPORTED_TRANSLATION_LANGUAGES.map((l) => {
            const isSelected = l.code === activeLangCode;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => handleSelectPrimaryLanguage(l.code)}
                className={`py-2 px-3 rounded-xl text-left transition-all cursor-pointer border flex items-center justify-between gap-1.5 ${
                  isSelected
                    ? 'bg-[#F01472] text-white border-[#F01472] shadow-sm shadow-rose-500/25 ring-2 ring-rose-200'
                    : 'bg-white text-gray-800 border-gray-200 hover:border-rose-300 hover:bg-rose-50/40 shadow-2xs'
                }`}
              >
                <div className="min-w-0">
                  <div className={`text-xs font-bold leading-tight truncate ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                    {l.nativeName}
                  </div>
                  <div className={`text-[10px] leading-tight truncate ${isSelected ? 'text-rose-100' : 'text-gray-400'}`}>
                    {l.name}
                  </div>
                </div>
                {isSelected && <Check size={14} className="text-white shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. Languages Known (Multi-Select) ── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-800 tracking-normal">
            Languages You Speak / Read
          </label>
          <span className="text-[11px] text-gray-400 font-normal">
            {selectedKnown.length} selected
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {SUPPORTED_TRANSLATION_LANGUAGES.map((l) => {
            const isSelected = selectedKnown.some((k) => k.toLowerCase() === l.name.toLowerCase());
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => toggleKnownLanguage(l.name)}
                className={`py-1.5 px-3 rounded-xl text-xs font-[450] transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-rose-100 text-[#C80E5A] border border-rose-300 shadow-2xs ring-1 ring-rose-200'
                    : 'bg-white text-gray-700 hover:bg-rose-50/50 border border-gray-200 hover:border-rose-200 shadow-2xs'
                }`}
              >
                {isSelected ? (
                  <>
                    <Check size={13} className="text-[#F01472]" />
                    <span>{l.name} ({l.nativeName})</span>
                  </>
                ) : (
                  <>
                    <span className="text-gray-400">+</span>
                    <span>{l.name} ({l.nativeName})</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
