import React, { useEffect, useRef, useState } from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { useI18n } from '../../context/I18nContext';
import { User, Edit3 } from 'lucide-react';
import { validateFullName } from '../../utils/nameValidation';
import { transliterateIndicName, SUPPORTED_TRANSLATION_LANGUAGES } from '../../services/indicTransliterationService';

export const QFullName: React.FC = () => {
  const { formData, updateFormData, validationError, setValidationError } = useBiodata();
  const { lang } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isTransliterating, setIsTransliterating] = useState(false);
  const debounceRef = useRef<any>(null);

  const activeLangCode = formData.lang || lang || 'en';
  const activeLangObj =
    SUPPORTED_TRANSLATION_LANGUAGES.find((l) => l.code === activeLangCode) ||
    SUPPORTED_TRANSLATION_LANGUAGES[0];

  const nameVal = formData.name || '';
  const nativeVal = formData.nameNative || '';
  const nameCheck = validateFullName(nameVal);
  const isInvalid = nameVal.length > 0 && !nameCheck.isValid;
  const displayError = isInvalid ? nameCheck.error : validationError;

  // Auto-transliterate English name into active native language when user types
  const triggerTransliteration = (text: string, targetLang: string) => {
    if (!text.trim() || targetLang === 'en') {
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsTransliterating(true);
      try {
        const trans = await transliterateIndicName(text.trim(), targetLang);
        if (trans && trans.trim()) {
          updateFormData({
            nameNative: trans.trim(),
            nativeNames: {
              ...(formData.nativeNames || {}),
              [text.trim()]: trans.trim(),
            },
          });
        }
      } catch (e) {
        console.debug('Transliteration failed:', e);
      } finally {
        setIsTransliterating(false);
      }
    }, 350);
  };

  const handleEnglishNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (val.length > 50) {
      val = val.slice(0, 50);
      setValidationError('Maximum character limit exceeded (50 characters max).');
    }
    updateFormData({ name: val });
    const check = validateFullName(val);
    if (val.length > 0 && !check.isValid) {
      setValidationError(check.error);
    } else if (validationError) {
      setValidationError(null);
    }

    if (activeLangCode !== 'en' && val.trim()) {
      triggerTransliteration(val, activeLangCode);
    }
  };

  const handleNativeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    updateFormData({
      nameNative: val,
      nativeNames: {
        ...(formData.nativeNames || {}),
        [nameVal.trim()]: val.trim(),
      },
    });
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // When language changes and English name exists, auto-populate native name
  useEffect(() => {
    if (activeLangCode !== 'en' && nameVal.trim() && !nativeVal.trim()) {
      triggerTransliteration(nameVal, activeLangCode);
    }
  }, [activeLangCode]);

  const previewName = activeLangCode !== 'en' && nativeVal.trim() ? nativeVal.trim() : (nameVal.trim() || 'Your Name Here');
  const previewDeity = formData.headerMotif || (activeLangCode !== 'en' ? '|| श्री गणेशाय नमः ||' : '|| Shri Ganeshay Namah: ||');

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
      {/* Input Column */}
      <div className="md:col-span-7 space-y-4">
        {/* English Name Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-[450] text-gray-600 tracking-normal">
              Official Full Name (English)
            </label>
            <span className={`text-[10px] font-mono ${nameVal.length >= 50 ? 'text-rose-600 font-bold' : 'text-gray-400'}`}>
              {nameVal.length}/50
            </span>
          </div>
          <div className="relative flex items-center">
            <User className={`absolute left-3.5 pointer-events-none transition-colors ${displayError ? 'text-rose-500' : 'text-rose-400'}`} size={18} />
            <input
              ref={inputRef}
              type="text"
              maxLength={50}
              value={nameVal}
              onChange={handleEnglishNameChange}
              placeholder="e.g. Rahul Ramesh Sharma"
              className={`wizard-input with-icon !pl-11 text-xs sm:text-sm font-[450] transition-all ${
                displayError
                  ? '!border-rose-400 !bg-rose-50/40 text-rose-900 focus:!border-rose-500 focus:!ring-rose-500/20'
                  : 'text-gray-900'
              }`}
              autoComplete="name"
            />
          </div>
          {displayError ? (
            <p className="text-xs text-rose-600 font-[450] pl-1 animate-fadeIn">
              {displayError}
            </p>
          ) : (
            <p className="text-[11px] text-gray-400 font-normal pl-1">
              Enter your official first, middle & last name in English (max 50 chars).
            </p>
          )}
        </div>

        {/* Dual-Script Native Name Field (Method 4: Saved to Database) */}
        {activeLangCode !== 'en' && (
          <div className="p-3.5 bg-gradient-to-br from-rose-50/50 via-white to-pink-50/40 border border-rose-200/80 rounded-2xl space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                <Edit3 size={13} className="text-[#F01472]" />
                <span>Name in {activeLangObj.nativeName} ({activeLangObj.name})</span>
              </label>
              <span className="text-[10px] text-rose-500 font-medium">
                {isTransliterating ? 'Generating...' : 'Saved to profile'}
              </span>
            </div>
            <input
              type="text"
              value={nativeVal}
              onChange={handleNativeNameChange}
              placeholder={`e.g. your name in ${activeLangObj.nativeName}`}
              className="wizard-input py-2 px-3 text-xs sm:text-sm font-semibold text-gray-900 bg-white border-rose-200 focus:border-[#F01472]"
            />
            <p className="text-[11px] text-gray-500 leading-snug">
              ✨ Auto-generated using Indic phonetic transliteration. You can edit any letters according to your family's preferred traditional spelling.
            </p>
          </div>
        )}
      </div>

      {/* Live Preview Card */}
      <div className="md:col-span-5 p-4 bg-gradient-to-br from-rose-50/70 via-white to-pink-50/60 border border-rose-100 rounded-2xl space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-normal text-gray-400 uppercase">
            Biodata Header Preview
          </span>
          {activeLangCode !== 'en' && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-[#C80E5A]">
              {activeLangObj.nativeName}
            </span>
          )}
        </div>

        <div className="text-center py-3 px-3 bg-white/90 rounded-xl border border-rose-100 shadow-2xs space-y-1">
          <div className="text-xs text-[#8B1A4A] font-semibold tracking-wide">
            {previewDeity}
          </div>
          <div className="text-base sm:text-lg font-black text-gray-900 truncate">
            {previewName}
          </div>
        </div>

        <p className="text-[11px] text-gray-500 font-normal leading-relaxed">
          {activeLangCode !== 'en'
            ? `Your biodata header and names will be displayed in ${activeLangObj.nativeName} (${activeLangObj.name}) across all templates.`
            : 'This title will be prominently featured at the top of your selected biodata templates.'}
        </p>
      </div>
    </div>
  );
};
