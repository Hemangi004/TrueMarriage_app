import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { useBiodata } from '../../context/BiodataContext';
import { SUPPORTED_TRANSLATION_LANGUAGES } from '../../services/indicTransliterationService';

interface LanguageItem {
  code: string;
  native: string;
  english: string;
  fullWidth?: boolean;
}

export const WIZARD_LANGUAGES: LanguageItem[] = [
  { code: 'en', native: 'English', english: 'English' },
  { code: 'mr', native: 'मराठी', english: 'Marathi' },
  { code: 'hi', native: 'हिन्दी', english: 'Hindi' },
  { code: 'gu', native: 'ગુજરાતી', english: 'Gujarati' },
  { code: 'bn', native: 'বাংলা', english: 'Bengali' },
  { code: 'ta', native: 'தமிழ்', english: 'Tamil' },
  { code: 'te', native: 'తెలుగు', english: 'Telugu' },
  { code: 'kn', native: 'ಕನ್ನಡ', english: 'Kannada' },
  { code: 'ml', native: 'മലയാളം', english: 'Malayalam' },
  { code: 'pa', native: 'ਪੰਜਾਬੀ', english: 'Punjabi' },
  { code: 'or', native: 'ଓଡ଼ିଆ', english: 'Odia' },
  { code: 'as', native: 'অসমীয়া', english: 'Assamese' },
  { code: 'ur', native: 'اردو', english: 'Urdu', fullWidth: true },
];

interface ChooseLanguageScreenProps {
  onContinue: () => void;
}

export const ChooseLanguageScreen: React.FC<ChooseLanguageScreenProps> = ({ onContinue }) => {
  const { lang, setLang } = useI18n();
  const { formData, updateFormData } = useBiodata();

  // Exactly one language selectable at a time
  const [selectedLang, setSelectedLang] = useState<string>(() => {
    return formData.lang || lang || 'en';
  });

  const handleSelect = (code: string) => {
    setSelectedLang(code);
  };

  const handleContinue = () => {
    // 1. Trigger whole website translation
    setLang(selectedLang);

    // 2. Update biodata formData with selected language
    const chosen = SUPPORTED_TRANSLATION_LANGUAGES.find((l) => l.code === selectedLang);
    updateFormData({
      lang: selectedLang,
      motherTongue: chosen?.name || formData.motherTongue || '',
    });

    // 3. Mark language as confirmed in this session
    try {
      sessionStorage.setItem('tm_wizard_lang_selected', 'true');
    } catch {}

    // 4. Move forward to Step 1 of the wizard
    onContinue();
  };

  return (
    <div className="fixed inset-0 z-[100] h-[100dvh] max-h-screen overflow-y-auto sm:overflow-hidden flex flex-col justify-center items-center px-4 py-3 sm:py-4 bg-white select-none">
      <div className="w-full max-w-[360px] sm:max-w-[400px] mx-auto flex flex-col items-center text-center my-auto">
        {/* Top True Marriage Logo - Increased Size */}
        <div className="mb-2 sm:mb-3 notranslate" translate="no">
          <img
            src="/logo.png"
            alt="True Marriage"
            className="h-10 sm:h-12 w-auto object-contain mx-auto"
            loading="eager"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-[26px] font-bold text-[#0F172A] tracking-tight leading-tight">
          Choose your language
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-[13px] text-[#475569] font-normal mt-1 mb-3 sm:mb-3.5 max-w-[280px] sm:max-w-xs leading-normal">
          Select your preferred language to continue with your biodata.
        </p>

        {/* 13 Language Options Grid - Unbolded with full character clearance */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 w-full notranslate" translate="no">
          {WIZARD_LANGUAGES.map((item) => {
            const isSelected = selectedLang === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => handleSelect(item.code)}
                aria-pressed={isSelected}
                className={`relative px-4 py-2 sm:py-2.5 rounded-[18px] text-left transition-all duration-150 cursor-pointer ${
                  item.fullWidth ? 'col-span-2' : 'col-span-1'
                } ${
                  isSelected
                    ? 'bg-white border-2 border-[#D81B60] shadow-sm'
                    : 'bg-white hover:bg-slate-50 border border-gray-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.03)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 pr-1">
                    {/* Native Name - Unbolded font-medium with leading-normal so matras/ascenders are never cut */}
                    <span
                      className={`text-[14px] sm:text-[15px] font-medium block leading-normal overflow-visible ${
                        isSelected ? 'text-[#D81B60]' : 'text-[#0F172A]'
                      }`}
                    >
                      {item.native}
                    </span>
                    {/* English Subtext - font-normal */}
                    <span
                      className={`text-[11px] sm:text-xs block mt-0.5 leading-normal font-normal ${
                        isSelected ? 'text-[#E85B8F]' : 'text-[#64748B]'
                      }`}
                    >
                      {item.english}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#D81B60] text-white flex items-center justify-center shrink-0 ml-1 shadow-xs">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        <button
          type="button"
          onClick={handleContinue}
          className="mt-3.5 sm:mt-4 px-10 py-2.5 sm:py-3 rounded-full bg-[#D81B60] hover:bg-[#C2185B] active:scale-95 text-white font-semibold text-sm sm:text-base shadow-lg shadow-pink-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <span>Continue</span>
          <ArrowRight size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};
