import React, { useState } from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { Star, Compass, AlertCircle } from 'lucide-react';

const RASHI_LIST = [
  'Mesh (Aries)', 'Vrishabh (Taurus)', 'Mithun (Gemini)', 'Kark (Cancer)',
  'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrishchik (Scorpio)',
  'Dhanu (Sagittarius)', 'Makar (Capricorn)', 'Kumbh (Aquarius)', 'Meen (Pisces)'
];

const NAKSHATRA_LIST = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha',
  'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

const GAN_LIST = ['Dev', 'Manav', 'Raksha'];
const NADI_LIST = ['Adi (Vata)', 'Madhya (Pitta)', 'Antya (Kapha)'];

export const QAstroDetails: React.FC = () => {
  const { formData, updateFormData } = useBiodata();
  const [kuldevataError, setKuldevataError] = useState<string | null>(null);
  const [gotraError, setGotraError] = useState<string | null>(null);

  const validateAstroField = (val: string, label: string): string | null => {
    if (!val) return null;
    if (/\d/.test(val)) return `${label} should contain letters only (numbers are not allowed)`;
    if (!/^[A-Za-z\u0900-\u0D7F\s\-\'\,\.\/\(\)]+$/.test(val)) return `${label} should contain valid letters only`;
    return null;
  };

  const handleKuldevataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    updateFormData({ kuldevata: val });
    setKuldevataError(validateAstroField(val, 'Kuldevata / Deity'));
  };

  const handleGotraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    updateFormData({ gotra: val });
    setGotraError(validateAstroField(val, 'Gotra'));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-start">
      {/* Column 1: Kuldevata, Gotra & Gan */}
      <div className="space-y-3.5">
        {/* Kuldevata */}
        <div>
          <label className="block text-[11px] font-[450] text-gray-500 tracking-normal mb-1.5">
            Kuldevata (Family Deity)
          </label>
          <div className="relative flex items-center">
            <Star className={`absolute left-4 pointer-events-none ${kuldevataError ? 'text-red-400' : 'text-amber-400'}`} size={18} />
            <input
              type="text"
              maxLength={50}
              value={formData.kuldevata || ''}
              onChange={handleKuldevataChange}
              placeholder="e.g. Shri Khandoba, Bhavani Devi"
              className={`wizard-input with-icon !pl-12 py-2 text-xs sm:text-sm font-[450] transition-all ${
                kuldevataError ? '!border-red-500 !bg-red-50/20' : ''
              }`}
            />
          </div>
          {kuldevataError && (
            <div className="flex items-center gap-1 text-xs text-red-600 font-[450] mt-1 animate-fadeIn">
              <AlertCircle size={13} className="shrink-0 text-red-500" />
              <span>{kuldevataError}</span>
            </div>
          )}
        </div>

        {/* Gotra */}
        <div>
          <label className="block text-[11px] font-[450] text-gray-500 tracking-normal mb-1.5">
            Gotra (Ancestral Clan)
          </label>
          <div className="relative flex items-center">
            <Compass className={`absolute left-4 pointer-events-none ${gotraError ? 'text-red-400' : 'text-rose-400'}`} size={18} />
            <input
              type="text"
              maxLength={50}
              value={formData.gotra || ''}
              onChange={handleGotraChange}
              placeholder="e.g. Kashyap, Vashishtha, Bharadwaj"
              className={`wizard-input with-icon !pl-12 py-2 text-xs sm:text-sm font-[450] transition-all ${
                gotraError ? '!border-red-500 !bg-red-50/20' : ''
              }`}
            />
          </div>
          {gotraError && (
            <div className="flex items-center gap-1 text-xs text-red-600 font-[450] mt-1 animate-fadeIn">
              <AlertCircle size={13} className="shrink-0 text-red-500" />
              <span>{gotraError}</span>
            </div>
          )}
        </div>

        {/* Gan */}
        <div>
          <label className="block text-[11px] font-[450] text-gray-500 tracking-normal mb-1.5">
            Gan
          </label>
          <div className="flex flex-wrap gap-2">
            {GAN_LIST.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => updateFormData({ gan: g })}
                className={`pill-button text-xs py-1.5 px-3 font-[450] ${formData.gan === g ? 'selected' : ''}`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Column 2: Rashi, Nakshatra & Nadi */}
      <div className="space-y-3.5">
        {/* Rashi */}
        <div>
          <label className="block text-[11px] font-[450] text-gray-500 tracking-normal mb-1.5">
            Rashi (Zodiac Sign)
          </label>
          <select
            value={formData.rashi || ''}
            onChange={(e) => updateFormData({ rashi: e.target.value })}
            className="wizard-input py-2 text-xs sm:text-sm font-[450]"
          >
            <option value="">Select Rashi</option>
            {RASHI_LIST.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Nakshatra */}
        <div>
          <label className="block text-[11px] font-[450] text-gray-500 tracking-normal mb-1.5">
            Nakshatra (Birth Star)
          </label>
          <select
            value={formData.nakshatra || ''}
            onChange={(e) => updateFormData({ nakshatra: e.target.value })}
            className="wizard-input py-2 text-xs sm:text-sm font-[450]"
          >
            <option value="">Select Nakshatra</option>
            {NAKSHATRA_LIST.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {/* Nadi */}
        <div>
          <label className="block text-[11px] font-[450] text-gray-500 tracking-normal mb-1.5">
            Nadi
          </label>
          <div className="flex flex-wrap gap-2">
            {NADI_LIST.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => updateFormData({ nadi: n })}
                className={`pill-button text-xs py-1.5 px-3 font-[450] ${formData.nadi === n ? 'selected' : ''}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
