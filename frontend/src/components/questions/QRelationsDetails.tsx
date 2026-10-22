import React, { useState, useRef, useEffect } from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { useI18n } from '../../context/I18nContext';
import { Users, Link2, AlertCircle, Edit3 } from 'lucide-react';
import { validateMaternalUncle, validateRelations } from '../../utils/nameValidation';
import { transliterateIndicName, SUPPORTED_TRANSLATION_LANGUAGES } from '../../services/indicTransliterationService';

export const QRelationsDetails: React.FC = () => {
  const { formData, updateFormData } = useBiodata();
  const { lang } = useI18n();
  const [uncleError, setUncleError] = useState<string | null>(() => {
    const check = validateMaternalUncle(formData.maternalUncle);
    return check.isValid ? null : check.error;
  });
  const [relationsError, setRelationsError] = useState<string | null>(() => {
    const check = validateRelations(formData.relations);
    return check.isValid ? null : check.error;
  });

  const [isUncleTransliterating, setIsUncleTransliterating] = useState(false);
  const uncleDebounceRef = useRef<any>(null);

  const activeLangCode = formData.lang || lang || 'en';
  const activeLangObj =
    SUPPORTED_TRANSLATION_LANGUAGES.find((l) => l.code === activeLangCode) ||
    SUPPORTED_TRANSLATION_LANGUAGES[0];

  const triggerUncleTransliteration = (text: string, targetLang: string) => {
    if (!text.trim() || targetLang === 'en') return;
    if (uncleDebounceRef.current) clearTimeout(uncleDebounceRef.current);
    uncleDebounceRef.current = setTimeout(async () => {
      setIsUncleTransliterating(true);
      try {
        const trans = await transliterateIndicName(text.trim(), targetLang);
        if (trans && trans.trim()) {
          updateFormData({
            maternalUncleNative: trans.trim(),
            nativeNames: {
              ...(formData.nativeNames || {}),
              [text.trim()]: trans.trim(),
            },
          });
        }
      } catch (e) {
        console.debug('Mama name transliteration failed:', e);
      } finally {
        setIsUncleTransliterating(false);
      }
    }, 350);
  };

  const handleUncleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    updateFormData({ maternalUncle: val });
    const check = validateMaternalUncle(val);
    setUncleError(check.isValid ? null : check.error);
    if (activeLangCode !== 'en' && val.trim()) {
      triggerUncleTransliteration(val, activeLangCode);
    }
  };

  const handleUncleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    updateFormData({
      maternalUncleNative: val,
      nativeNames: {
        ...(formData.nativeNames || {}),
        [(formData.maternalUncle || '').trim()]: val.trim(),
      },
    });
  };

  const handleRelationsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    updateFormData({ relations: val });
    const check = validateRelations(val);
    setRelationsError(check.isValid ? null : check.error);
  };

  useEffect(() => {
    if (activeLangCode !== 'en' && formData.maternalUncle?.trim() && !formData.maternalUncleNative?.trim()) {
      triggerUncleTransliteration(formData.maternalUncle, activeLangCode);
    }
  }, [activeLangCode]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start">
      {/* Maternal Uncle */}
      <div>
        <label className="block text-[11px] font-[450] text-gray-500 tracking-normal mb-1.5">
          Maternal Uncle (Mama)
        </label>
        <div className="relative flex items-center">
          <Users className={`absolute left-3.5 pointer-events-none transition-colors ${uncleError ? 'text-red-400' : 'text-rose-400'}`} size={17} />
          <input
            type="text"
            maxLength={100}
            value={formData.maternalUncle || ''}
            onChange={handleUncleChange}
            placeholder="e.g. Anil Deshmukh (Sangli)"
            className={`wizard-input with-icon !pl-11 py-2 text-xs sm:text-sm font-[450] transition-all ${
              uncleError ? '!border-red-500 !bg-red-50/20 focus:!border-red-500 focus:!ring-red-500/20' : ''
            }`}
          />
        </div>
        {uncleError ? (
          <div className="flex items-center gap-1.5 text-xs text-red-600 font-[450] mt-1 animate-fadeIn">
            <AlertCircle size={13} className="shrink-0 text-red-500" />
            <span>{uncleError}</span>
          </div>
        ) : (
          <p className="text-[11px] text-gray-400 mt-1">Mama's name & native place</p>
        )}

        {/* Dual-Script Native Mama Name */}
        {activeLangCode !== 'en' && (
          <div className="mt-2.5 p-2.5 bg-rose-50/50 border border-rose-200/80 rounded-xl space-y-1 animate-fadeIn">
            <div className="flex items-center justify-between text-[11px]">
              <label className="font-semibold text-gray-700 flex items-center gap-1">
                <Edit3 size={11} className="text-[#F01472]" />
                <span>Mama's Name in {activeLangObj.nativeName}</span>
              </label>
              <span className="text-[10px] text-rose-500 font-medium">
                {isUncleTransliterating ? 'Generating...' : 'Saved'}
              </span>
            </div>
            <input
              type="text"
              value={formData.maternalUncleNative || ''}
              onChange={handleUncleNativeChange}
              placeholder={`e.g. mama's name in ${activeLangObj.nativeName}`}
              className="wizard-input py-1.5 px-2.5 text-xs font-semibold text-gray-900 bg-white border-rose-200 focus:border-[#F01472]"
            />
          </div>
        )}
      </div>

      {/* Relations / Relatives */}
      <div>
        <label className="block text-[11px] font-[450] text-gray-500 tracking-normal mb-1.5">
          Relations / Notable Relatives
        </label>
        <div className="relative flex items-start">
          <Link2 className={`absolute left-3.5 top-3 pointer-events-none transition-colors ${relationsError ? 'text-red-400' : 'text-rose-400'}`} size={17} />
          <textarea
            rows={2}
            maxLength={250}
            value={formData.relations || ''}
            onChange={handleRelationsChange}
            placeholder="e.g. Patil, Shinde, Jadhav families — well-known in community"
            className={`wizard-input with-icon !pl-11 py-2 text-xs sm:text-sm font-[450] resize-none transition-all ${
              relationsError ? '!border-red-500 !bg-red-50/20 focus:!border-red-500 focus:!ring-red-500/20' : ''
            }`}
          />
        </div>
        {relationsError ? (
          <div className="flex items-center gap-1.5 text-xs text-red-600 font-[450] mt-1 animate-fadeIn">
            <AlertCircle size={13} className="shrink-0 text-red-500" />
            <span>{relationsError}</span>
          </div>
        ) : (
          <p className="text-[11px] text-gray-400 mt-1">Mention prominent relatives or family connections</p>
        )}
      </div>
    </div>
  );
};
