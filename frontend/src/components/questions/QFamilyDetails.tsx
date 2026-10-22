import React, { useState, useRef, useEffect } from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { useI18n } from '../../context/I18nContext';
import { Heart, AlertCircle, Edit3 } from 'lucide-react';
import { validateFamilyOccupation } from '../../utils/nameValidation';
import { transliterateIndicName, SUPPORTED_TRANSLATION_LANGUAGES } from '../../services/indicTransliterationService';

const FAMILY_VALUES = ['Traditional', 'Balanced', 'Modern', 'Liberal'];

export const QFamilyDetails: React.FC = () => {
  const { formData, updateFormData } = useBiodata();
  const { lang } = useI18n();
  const [fatherNameError, setFatherNameError] = useState<string | null>(null);
  const [motherNameError, setMotherNameError] = useState<string | null>(null);
  const [fatherOccupationError, setFatherOccupationError] = useState<string | null>(() => {
    const check = validateFamilyOccupation(formData.fatherOccupation, "Father's Occupation");
    return check.isValid ? null : check.error;
  });
  const [motherOccupationError, setMotherOccupationError] = useState<string | null>(() => {
    const check = validateFamilyOccupation(formData.motherOccupation, "Mother's Occupation");
    return check.isValid ? null : check.error;
  });

  const [isFatherTransliterating, setIsFatherTransliterating] = useState(false);
  const [isMotherTransliterating, setIsMotherTransliterating] = useState(false);
  const fatherDebounceRef = useRef<any>(null);
  const motherDebounceRef = useRef<any>(null);

  const activeLangCode = formData.lang || lang || 'en';
  const activeLangObj =
    SUPPORTED_TRANSLATION_LANGUAGES.find((l) => l.code === activeLangCode) ||
    SUPPORTED_TRANSLATION_LANGUAGES[0];

  const validateName = (val: string, label: string): string | null => {
    if (!val) return null;
    if (/\d/.test(val)) return `${label} should contain letters only (numbers are not allowed)`;
    if (!/^[A-Za-z\u0900-\u0D7F\s\-\'\.]+$/.test(val)) return `${label} should contain valid letters only`;
    return null;
  };

  const triggerFatherTransliteration = (text: string, targetLang: string) => {
    if (!text.trim() || targetLang === 'en') return;
    if (fatherDebounceRef.current) clearTimeout(fatherDebounceRef.current);
    fatherDebounceRef.current = setTimeout(async () => {
      setIsFatherTransliterating(true);
      try {
        const trans = await transliterateIndicName(text.trim(), targetLang);
        if (trans && trans.trim()) {
          updateFormData({
            fatherNameNative: trans.trim(),
            nativeNames: {
              ...(formData.nativeNames || {}),
              [text.trim()]: trans.trim(),
            },
          });
        }
      } catch (e) {
        console.debug('Father name transliteration failed:', e);
      } finally {
        setIsFatherTransliterating(false);
      }
    }, 350);
  };

  const triggerMotherTransliteration = (text: string, targetLang: string) => {
    if (!text.trim() || targetLang === 'en') return;
    if (motherDebounceRef.current) clearTimeout(motherDebounceRef.current);
    motherDebounceRef.current = setTimeout(async () => {
      setIsMotherTransliterating(true);
      try {
        const trans = await transliterateIndicName(text.trim(), targetLang);
        if (trans && trans.trim()) {
          updateFormData({
            motherNameNative: trans.trim(),
            nativeNames: {
              ...(formData.nativeNames || {}),
              [text.trim()]: trans.trim(),
            },
          });
        }
      } catch (e) {
        console.debug('Mother name transliteration failed:', e);
      } finally {
        setIsMotherTransliterating(false);
      }
    }, 350);
  };

  const handleFatherNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    updateFormData({ fatherName: val });
    setFatherNameError(validateName(val, "Father's Name"));
    if (activeLangCode !== 'en' && val.trim()) {
      triggerFatherTransliteration(val, activeLangCode);
    }
  };

  const handleFatherNameNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    updateFormData({
      fatherNameNative: val,
      nativeNames: {
        ...(formData.nativeNames || {}),
        [(formData.fatherName || '').trim()]: val.trim(),
      },
    });
  };

  const handleMotherNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    updateFormData({ motherName: val });
    setMotherNameError(validateName(val, "Mother's Name"));
    if (activeLangCode !== 'en' && val.trim()) {
      triggerMotherTransliteration(val, activeLangCode);
    }
  };

  const handleMotherNameNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    updateFormData({
      motherNameNative: val,
      nativeNames: {
        ...(formData.nativeNames || {}),
        [(formData.motherName || '').trim()]: val.trim(),
      },
    });
  };

  const handleFatherOccupationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    updateFormData({ fatherOccupation: val });
    const check = validateFamilyOccupation(val, "Father's Occupation");
    setFatherOccupationError(check.isValid ? null : check.error);
  };

  const handleMotherOccupationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    updateFormData({ motherOccupation: val });
    const check = validateFamilyOccupation(val, "Mother's Occupation");
    setMotherOccupationError(check.isValid ? null : check.error);
  };

  useEffect(() => {
    if (activeLangCode !== 'en') {
      if (formData.fatherName?.trim() && !formData.fatherNameNative?.trim()) {
        triggerFatherTransliteration(formData.fatherName, activeLangCode);
      }
      if (formData.motherName?.trim() && !formData.motherNameNative?.trim()) {
        triggerMotherTransliteration(formData.motherName, activeLangCode);
      }
    }
  }, [activeLangCode]);

  return (
    <div className="space-y-4">
      {/* Parents Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-[11px] font-[450] text-gray-500 tracking-normal mb-1">
            Father's Name
          </label>
          <input
            type="text"
            maxLength={100}
            value={formData.fatherName || ''}
            onChange={handleFatherNameChange}
            placeholder="e.g. Ramesh Sharma"
            className={`wizard-input py-2 px-3 text-xs sm:text-sm font-[450] transition-all ${
              fatherNameError ? '!border-red-500 !bg-red-50/20' : ''
            }`}
          />
          {fatherNameError && (
            <div className="flex items-center gap-1 text-[11px] text-red-600 font-[450] mt-1 animate-fadeIn">
              <AlertCircle size={13} className="shrink-0 text-red-500" />
              <span>{fatherNameError}</span>
            </div>
          )}

          {/* Dual-Script Native Father Name */}
          {activeLangCode !== 'en' && (
            <div className="mt-2 p-2.5 bg-rose-50/50 border border-rose-200/80 rounded-xl space-y-1 animate-fadeIn">
              <div className="flex items-center justify-between text-[11px]">
                <label className="font-semibold text-gray-700 flex items-center gap-1">
                  <Edit3 size={11} className="text-[#F01472]" />
                  <span>Father's Name in {activeLangObj.nativeName}</span>
                </label>
                <span className="text-[10px] text-rose-500 font-medium">
                  {isFatherTransliterating ? 'Generating...' : 'Saved'}
                </span>
              </div>
              <input
                type="text"
                value={formData.fatherNameNative || ''}
                onChange={handleFatherNameNativeChange}
                placeholder={`e.g. father's name in ${activeLangObj.nativeName}`}
                className="wizard-input py-1.5 px-2.5 text-xs font-semibold text-gray-900 bg-white border-rose-200 focus:border-[#F01472]"
              />
            </div>
          )}
        </div>
        <div>
          <label className="block text-[11px] font-[450] text-gray-500 tracking-normal mb-1">
            Father's Occupation
          </label>
          <input
            type="text"
            maxLength={100}
            value={formData.fatherOccupation || ''}
            onChange={handleFatherOccupationChange}
            placeholder="e.g. Retired Govt Officer"
            className={`wizard-input py-2 px-3 text-xs sm:text-sm font-[450] transition-all ${
              fatherOccupationError ? '!border-red-500 !bg-red-50/20' : ''
            }`}
          />
          {fatherOccupationError && (
            <div className="flex items-center gap-1 text-[11px] text-red-600 font-[450] mt-1 animate-fadeIn">
              <AlertCircle size={13} className="shrink-0 text-red-500" />
              <span>{fatherOccupationError}</span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-[11px] font-[450] text-gray-500 tracking-normal mb-1">
            Mother's Name
          </label>
          <input
            type="text"
            maxLength={100}
            value={formData.motherName || ''}
            onChange={handleMotherNameChange}
            placeholder="e.g. Sunita Sharma"
            className={`wizard-input py-2 px-3 text-xs sm:text-sm font-[450] transition-all ${
              motherNameError ? '!border-red-500 !bg-red-50/20' : ''
            }`}
          />
          {motherNameError && (
            <div className="flex items-center gap-1 text-[11px] text-red-600 font-[450] mt-1 animate-fadeIn">
              <AlertCircle size={13} className="shrink-0 text-red-500" />
              <span>{motherNameError}</span>
            </div>
          )}

          {/* Dual-Script Native Mother Name */}
          {activeLangCode !== 'en' && (
            <div className="mt-2 p-2.5 bg-rose-50/50 border border-rose-200/80 rounded-xl space-y-1 animate-fadeIn">
              <div className="flex items-center justify-between text-[11px]">
                <label className="font-semibold text-gray-700 flex items-center gap-1">
                  <Edit3 size={11} className="text-[#F01472]" />
                  <span>Mother's Name in {activeLangObj.nativeName}</span>
                </label>
                <span className="text-[10px] text-rose-500 font-medium">
                  {isMotherTransliterating ? 'Generating...' : 'Saved'}
                </span>
              </div>
              <input
                type="text"
                value={formData.motherNameNative || ''}
                onChange={handleMotherNameNativeChange}
                placeholder={`e.g. mother's name in ${activeLangObj.nativeName}`}
                className="wizard-input py-1.5 px-2.5 text-xs font-semibold text-gray-900 bg-white border-rose-200 focus:border-[#F01472]"
              />
            </div>
          )}
        </div>
        <div>
          <label className="block text-[11px] font-[450] text-gray-500 tracking-normal mb-1">
            Mother's Occupation
          </label>
          <input
            type="text"
            maxLength={100}
            value={formData.motherOccupation || ''}
            onChange={handleMotherOccupationChange}
            placeholder="e.g. Homemaker / Teacher"
            className={`wizard-input py-2 px-3 text-xs sm:text-sm font-[450] transition-all ${
              motherOccupationError ? '!border-red-500 !bg-red-50/20' : ''
            }`}
          />
          {motherOccupationError && (
            <div className="flex items-center gap-1 text-[11px] text-red-600 font-[450] mt-1 animate-fadeIn">
              <AlertCircle size={13} className="shrink-0 text-red-500" />
              <span>{motherOccupationError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Siblings counter + description */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-[11px] font-[450] text-gray-500 tracking-normal mb-1">
            Brothers
          </label>
          <input
            type="number"
            min="0"
            max="10"
            value={formData.brotherCount || 0}
            onChange={(e) => updateFormData({ brotherCount: Number(e.target.value) })}
            className="wizard-input py-2 px-3 text-xs sm:text-sm text-center font-[450]"
          />
          <input
            type="text"
            maxLength={100}
            value={formData.brotherDetails || ''}
            onChange={(e) => updateFormData({ brotherDetails: e.target.value })}
            placeholder="e.g. 2 married, 1 engineer"
            className="wizard-input py-1.5 px-3 text-xs mt-1 font-[450]"
          />
        </div>
        <div>
          <label className="block text-[11px] font-[450] text-gray-500 tracking-normal mb-1">
            Sisters
          </label>
          <input
            type="number"
            min="0"
            max="10"
            value={formData.sisterCount || 0}
            onChange={(e) => updateFormData({ sisterCount: Number(e.target.value) })}
            className="wizard-input py-2 px-3 text-xs sm:text-sm text-center font-[450]"
          />
          <input
            type="text"
            maxLength={100}
            value={formData.sisterDetails || ''}
            onChange={(e) => updateFormData({ sisterDetails: e.target.value })}
            placeholder="e.g. 1 married, 1 teacher"
            className="wizard-input py-1.5 px-3 text-xs mt-1 font-[450]"
          />
        </div>
      </div>

      {/* Family Values pills */}
      <div>
        <label className="block text-[11px] font-[450] text-gray-500 tracking-normal mb-1.5">
          Family Values & Vibe
        </label>
        <div className="flex flex-wrap gap-2">
          {FAMILY_VALUES.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => updateFormData({ familyValues: val as any })}
              className={`pill-button text-xs py-1.5 px-3 font-[450] ${
                formData.familyValues === val ? 'selected' : ''
              }`}
            >
              <Heart size={14} className={formData.familyValues === val ? 'text-white' : 'text-rose-400'} />
              <span>{val}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
