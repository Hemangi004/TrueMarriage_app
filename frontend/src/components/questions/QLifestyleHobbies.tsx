import React, { useState } from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { Utensils, Check, Plus, AlertCircle, Heart, X } from 'lucide-react';
import { validateHobbyName, normalizeHobbiesList, splitHobbiesString, KNOWN_HOBBY_NAMES } from '../../utils/nameValidation';

const DIETS = ['Vegetarian', 'Eggetarian', 'Non Veg', 'Vegan'];
const POPULAR_HOBBIES = [
  'Reading', 'Traveling', 'Cooking', 'Music & Guitar', 'Fitness & Yoga',
  'Photography', 'Trekking', 'Gaming', 'Painting & Art', 'Dancing',
  'Watching Movies', 'Gardening', 'Swimming', 'Coding', 'Writing'
];
const POPULAR_TRAITS = [
  'Introvert', 'Extrovert', 'Ambivert', 'Creative', 'Analytical',
  'Empathetic', 'Ambitious', 'Optimistic', 'Practical', 'Adventurous'
];

export const QLifestyleHobbies: React.FC = () => {
  const { formData, updateFormData } = useBiodata();

  const [customHobby, setCustomHobby] = useState('');
  const [hobbyError, setHobbyError] = useState<string | null>(null);
  const normalizeTraitsList = (raw: any): string[] => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.filter((s) => typeof s === 'string' && s.trim());
    if (typeof raw === 'string') return raw.split(',').map((s) => s.trim()).filter(Boolean);
    return [];
  };

  const selectedHobbies = normalizeHobbiesList(formData.hobbies);
  const selectedTraits = normalizeTraitsList(formData.personalityTraits);

  const toggleHobby = (h: string) => {
    const current = normalizeHobbiesList(formData.hobbies);
    let updated: string[];
    if (current.some((item) => item.toLowerCase() === h.toLowerCase())) {
      updated = current.filter((item) => item.toLowerCase() !== h.toLowerCase());
    } else {
      updated = [...current, h];
    }
    updateFormData({ hobbies: updated });
  };

  const handleAddCustomHobby = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customHobby.trim();
    if (!trimmed) {
      setHobbyError('Please enter a hobby name.');
      return;
    }

    const hobbiesToAdd = splitHobbiesString(trimmed);
    for (const h of hobbiesToAdd) {
      const check = validateHobbyName(h);
      if (!check.isValid) {
        setHobbyError(check.error || 'Hobby name should contain only alphabets.');
        return;
      }
    }

    const current = normalizeHobbiesList(formData.hobbies);
    const updated = [...current];
    for (const h of hobbiesToAdd) {
      if (!updated.some((item) => item.toLowerCase() === h.toLowerCase())) {
        const canonical = KNOWN_HOBBY_NAMES.find((k) => k.toLowerCase() === h.toLowerCase()) || h;
        updated.push(canonical);
      }
    }

    updateFormData({ hobbies: updated });
    setCustomHobby('');
    setHobbyError(null);
  };

  const toggleTrait = (t: string) => {
    const current = normalizeTraitsList(formData.personalityTraits);
    const exists = current.some((item) => item.toLowerCase() === t.toLowerCase());
    let updated: string[];
    if (exists) {
      updated = current.filter((item) => item.toLowerCase() !== t.toLowerCase());
    } else {
      updated = [...current, t];
    }
    updateFormData({ personalityTraits: updated });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-start">
      {/* ── LEFT COLUMN: Diet, Habits & Traits ── */}
      <div className="md:col-span-5 space-y-3.5">
        {/* Diet Selector */}
        <div>
          <label className="block text-[11px] font-[450] text-gray-500 tracking-normal mb-1.5">
            Dietary Preference
          </label>
          <div className="flex flex-wrap gap-1.5">
            {DIETS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => updateFormData({ diet: d as any })}
                className={`pill-button text-xs py-1.5 px-3 font-[450] ${
                  formData.diet === d ? 'selected' : ''
                }`}
              >
                <Utensils size={13} className={formData.diet === d ? 'text-white' : 'text-rose-400'} />
                <span>{d}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Smoking & Drinking */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-[450] text-gray-500 tracking-normal mb-1">
              Smoking
            </label>
            <select
              value={formData.smoking === 'No' ? 'Never' : (formData.smoking || '')}
              onChange={(e) => updateFormData({ smoking: e.target.value as any })}
              className="wizard-input py-1.5 px-2.5 text-xs font-[450]"
            >
              <option value="">Select</option>
              <option value="Never">Never</option>
              <option value="Occasionally">Occasionally</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-[450] text-gray-500 tracking-normal mb-1">
              Drinking
            </label>
            <select
              value={formData.drinking === 'No' ? 'Never' : (formData.drinking || '')}
              onChange={(e) => updateFormData({ drinking: e.target.value as any })}
              className="wizard-input py-1.5 px-2.5 text-xs font-[450]"
            >
              <option value="">Select</option>
              <option value="Never">Never</option>
              <option value="Socially">Socially</option>
              <option value="Frequently">Frequently</option>
            </select>
          </div>
        </div>

        {/* Personality Traits */}
        <div>
          <label className="block text-[11px] font-[450] text-gray-500 tracking-normal mb-1.5">
            Personality Traits
          </label>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_TRAITS.map((t) => {
              const isSelected = selectedTraits.some((s) => s.toLowerCase() === t.toLowerCase());
              return (
                <button
                  key={t}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleTrait(t);
                  }}
                  className={`py-1.5 px-3 rounded-full text-xs font-[450] transition-all cursor-pointer flex items-center gap-1.5 border select-none ${
                    isSelected
                      ? 'bg-[#F01472] text-white border-[#F01472] shadow-sm ring-1 ring-rose-300'
                      : 'bg-white text-gray-700 hover:bg-rose-50/60 border-gray-200 hover:border-rose-300 shadow-2xs'
                  }`}
                >
                  {isSelected && <Check size={12} strokeWidth={2.5} />}
                  <span>{t}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── RIGHT COLUMN: Hobbies Selection ── */}
      <div className="md:col-span-7 space-y-3">
        {/* Selected Hobbies Box */}
        <div className="bg-gradient-to-br from-rose-50/70 via-white to-pink-50/50 border border-rose-200/80 rounded-2xl p-3.5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-[#F01472] text-white flex items-center justify-center shadow-2xs">
                <Heart size={12} />
              </div>
              <span className="text-[11px] font-[450] text-gray-800 tracking-normal">
                Selected Hobbies
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-[450] bg-[#F01472] text-white shadow-2xs">
              {selectedHobbies.length}
            </span>
          </div>

          {selectedHobbies.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {selectedHobbies.map((h) => (
                <span
                  key={h}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-[450] bg-white text-[#F01472] border border-rose-200 shadow-xs hover:border-rose-300 hover:bg-rose-50/40 transition-all group"
                >
                  <span>{h}</span>
                  <button
                    type="button"
                    onClick={() => toggleHobby(h)}
                    className="p-0.5 text-rose-400 hover:text-rose-700 hover:bg-rose-100 rounded-full cursor-pointer transition-colors"
                    title={`Remove ${h}`}
                    aria-label={`Remove ${h}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <div className="py-2 text-center text-xs text-gray-400 font-normal">
              No hobbies selected yet. Tap from available below or add custom.
            </div>
          )}
        </div>

        {/* Available Hobbies Chips */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-[450] text-gray-500 tracking-normal">
              Available Hobbies
            </label>
            <span className="text-[11px] text-gray-400 font-normal">
              Tap to toggle
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1 scrollbar-thin">
            {POPULAR_HOBBIES.map((h) => {
              const isSelected = selectedHobbies.some((s) => s.toLowerCase() === h.toLowerCase());
              return (
                <button
                  key={h}
                  type="button"
                  onClick={() => toggleHobby(h)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-[450] transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-rose-100/80 text-[#C80E5A] border border-rose-300 shadow-2xs ring-1 ring-rose-200'
                      : 'bg-white text-gray-700 hover:bg-rose-50/50 border border-gray-200 hover:border-rose-200 shadow-2xs'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check size={13} className="text-[#F01472]" />
                      <span>{h}</span>
                    </>
                  ) : (
                    <>
                      <Plus size={13} className="text-gray-400" />
                      <span>{h}</span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Add Hobby */}
        <form onSubmit={handleAddCustomHobby} className="pt-2 border-t border-gray-100 flex flex-col gap-1.5">
          <div className="flex gap-1.5">
            <input
              type="text"
              maxLength={50}
              value={customHobby}
              onChange={(e) => {
                const val = e.target.value;
                if (val.length > 50) {
                  setCustomHobby(val.slice(0, 50));
                  setHobbyError('Hobby name cannot exceed 50 characters.');
                  return;
                }
                if (val.trim()) {
                  const hobbiesToAdd = splitHobbiesString(val.trim());
                  let foundErr: string | null = null;
                  for (const h of hobbiesToAdd) {
                    const check = validateHobbyName(h);
                    if (!check.isValid) {
                      foundErr = check.error || 'Hobby name should contain only alphabets.';
                      break;
                    }
                  }
                  setHobbyError(foundErr);
                } else if (hobbyError) {
                  setHobbyError(null);
                }
                setCustomHobby(val);
              }}
              placeholder="Add custom hobby (e.g. Pottery, Hiking)..."
              className={`wizard-input py-1.5 px-3 text-xs font-[450] flex-1 transition-all ${
                hobbyError ? '!border-red-500 !bg-red-50/20' : ''
              }`}
            />
            <button
              type="button"
              onClick={handleAddCustomHobby}
              className="px-3.5 py-1.5 bg-[#F01472] hover:bg-rose-600 text-white font-[450] text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1 shrink-0"
            >
              <Plus size={13} />
              <span>Add</span>
            </button>
          </div>
          {hobbyError && (
            <div className="flex items-center gap-1 text-[11px] text-red-600 font-[450] pl-1 animate-fadeIn">
              <AlertCircle size={12} className="shrink-0 text-red-500" />
              <span>{hobbyError}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
