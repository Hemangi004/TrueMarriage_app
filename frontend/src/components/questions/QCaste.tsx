import React, { useState } from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { Scroll, Bookmark, AlertCircle } from 'lucide-react';

const COMMON_CASTES: Record<string, string[]> = {
  Hindu: ['Brahmin', 'Kshatriya', 'Vaishya', 'Maratha', 'Rajput', 'Agarwal', 'Kayastha', 'Jat', 'Yadav', 'Gupta', 'Saini', 'Baniya', 'Lingayat', 'Reddy', 'Nair', 'Kamma', 'Vankaria', 'Other'],
  Muslim: ['Sunni', 'Shia', 'Pathan', 'Syed', 'Sheikh', 'Ansari', 'Qureshi', 'Other'],
  Sikh: ['Jat', 'Khatri', 'Ramgarhia', 'Arora', 'Saini', 'Other'],
  Jain: ['Oswal', 'Agarwal', 'Porwal', 'Khandelwal', 'Other'],
  Christian: ['Catholic', 'Protestant', 'Syrian', 'Pentecostal', 'Other'],
};

export const QCaste: React.FC = () => {
  const { formData, updateFormData } = useBiodata();
  const [casteError, setCasteError] = useState<string | null>(null);
  const [subCasteError, setSubCasteError] = useState<string | null>(null);

  const religion = formData.religion || 'Hindu';
  const casteList = COMMON_CASTES[religion] || ['General', 'Brahmin', 'Baniya', 'Khatri', 'Maratha', 'Other'];

  const validateCaste = (val: string): boolean => {
    if (!val) {
      setCasteError(null);
      return true;
    }
    if (/\d/.test(val)) {
      setCasteError('Caste / Community should contain letters only (numbers are not allowed)');
      return false;
    }
    if (!/^[A-Za-z\u0900-\u0D7F\s\-\'\/\(\)\.\,]+$/.test(val)) {
      setCasteError('Caste / Community should contain valid alphabetical characters only');
      return false;
    }
    setCasteError(null);
    return true;
  };

  const validateSubCaste = (val: string): boolean => {
    if (!val) {
      setSubCasteError(null);
      return true;
    }
    if (/\d/.test(val)) {
      setSubCasteError('Sub-caste should contain letters only (numbers are not allowed)');
      return false;
    }
    if (!/^[A-Za-z\u0900-\u0D7F\s\-\'\/\(\)\.\,]+$/.test(val)) {
      setSubCasteError('Sub-caste should contain valid alphabetical characters only');
      return false;
    }
    setSubCasteError(null);
    return true;
  };

  const handleCasteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    updateFormData({ caste: val });
    validateCaste(val);
  };

  const handleSubCasteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    updateFormData({ subCaste: val });
    validateSubCaste(val);
  };

  const handleSelectPill = (c: string) => {
    updateFormData({ caste: c });
    setCasteError(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-start">
      {/* Left Column: Inputs (5 cols on md/lg) */}
      <div className="md:col-span-5 space-y-3.5">
        {/* Caste Field */}
        <div>
          <label className="block text-[11px] font-[450] text-gray-500 tracking-normal mb-1.5">
            Caste / Community
          </label>
          <div className="relative flex items-center">
            <Scroll className={`absolute left-3.5 pointer-events-none ${casteError ? 'text-red-400' : 'text-rose-400'}`} size={18} />
            <input
              type="text"
              maxLength={50}
              value={formData.caste || ''}
              onChange={handleCasteChange}
              placeholder="e.g. Brahmin, Maratha, Agarwal"
              className={`wizard-input with-icon !pl-11 py-2 text-xs sm:text-sm font-[450] transition-all ${
                casteError ? 'border-red-500 bg-red-50/20 focus:ring-red-500/20 focus:border-red-500' : ''
              }`}
            />
          </div>

          {casteError && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 font-[450] mt-1.5 animate-fadeIn">
              <AlertCircle size={14} className="shrink-0 text-red-500" />
              <span>{casteError}</span>
            </div>
          )}
          <p className="text-[11px] text-gray-400 mt-1 pl-0.5">Type or pick from suggestions</p>
        </div>

        {/* Sub-caste Field */}
        <div>
          <label className="block text-[11px] font-[450] text-gray-500 tracking-normal mb-1.5">
            Sub-Caste (Optional)
          </label>
          <div className="relative flex items-center">
            <Bookmark className={`absolute left-3.5 pointer-events-none ${subCasteError ? 'text-red-400' : 'text-gray-400'}`} size={18} />
            <input
              type="text"
              maxLength={50}
              value={formData.subCaste || ''}
              onChange={handleSubCasteChange}
              placeholder="e.g. Deshastha, Kanyakubj"
              className={`wizard-input with-icon !pl-11 py-2 text-xs sm:text-sm font-[450] transition-all ${
                subCasteError ? 'border-red-500 bg-red-50/20 focus:ring-red-500/20 focus:border-red-500' : ''
              }`}
            />
          </div>

          {subCasteError && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 font-[450] mt-1.5 animate-fadeIn">
              <AlertCircle size={14} className="shrink-0 text-red-500" />
              <span>{subCasteError}</span>
            </div>
          )}
          <p className="text-[11px] text-gray-400 mt-1 pl-0.5">Specific sect or branch (optional)</p>
        </div>
      </div>

      {/* Right Column: Suggestions Panel (7 cols on md/lg) */}
      <div className="md:col-span-7 bg-rose-50/50 rounded-2xl p-3.5 sm:p-4 border border-rose-100/80">
        <div className="flex items-center justify-between mb-2.5">
          <label className="block text-[11px] font-[450] text-gray-600 tracking-normal">
            Popular {religion} Communities
          </label>
          <span className="text-[11px] font-[450] text-rose-500">Quick Select</span>
        </div>

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {casteList.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => handleSelectPill(c)}
              className={`pill-button text-xs py-1 px-2.5 transition-all font-[450] ${
                formData.caste === c ? 'selected shadow-xs' : 'hover:border-rose-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
