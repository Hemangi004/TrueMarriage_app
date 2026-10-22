import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Sparkles,
  Sliders,
  RotateCcw,
  MapPin,
  Check,
  Briefcase,
  Plus,
  Utensils,
  Home,
} from 'lucide-react';
import type { UserPreferences } from '../../types/discovery';
import { DEFAULT_USER_PREFERENCES } from '../../services/trueMatchEngine';
import { CityAutocomplete } from '../common/CityAutocomplete';
import { isValidCity, getCanonicalCity } from '../../data/indianCities';

interface UserPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSavePreferences: (newPrefs: UserPreferences) => void;
  /** The logged-in user's own gender — used to derive the correct legal minimum age */
  myGender?: string;
}

const POPULAR_CITIES = [
  'Pune',
  'Mumbai',
  'Bengaluru',
  'Delhi NCR',
  'Hyderabad',
  'Ahmedabad',
  'Kolkata',
  'Chennai',
  'Goa',
  'Jaipur',
];

// Replaced 'Jain' with 'Vegan' as requested
const DIETS = ['Vegetarian', 'Vegan', 'Non-Vegetarian', 'Eggetarian'];
const FAMILY_VALUES = ['Moderate', 'Traditional', 'Liberal'];
const MARITAL_STATUSES = ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'];

export const UserPreferencesModal: React.FC<UserPreferencesModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSavePreferences,
  myGender,
}) => {
  // Legal minimum age for candidates:
  // Male user seeks Brides → min age 18 (legal age for girls in India)
  // Female user seeks Grooms → min age 21 (legal age for boys in India)
  const candidateMinAge = (() => {
    const g = (myGender || '').trim().toLowerCase();
    if (g === 'male' || g === 'm') return 18;   // seeking brides
    if (g === 'female' || g === 'f') return 21; // seeking grooms
    return 18; // fallback
  })();
  const [localPrefs, setLocalPrefs] = useState<UserPreferences>(() => ({
    ...DEFAULT_USER_PREFERENCES,
    ...preferences,
  }));

  const [customCityInput, setCustomCityInput] = useState('');
  const [cityInputError, setCityInputError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLocalPrefs({
        ...DEFAULT_USER_PREFERENCES,
        ...preferences,
      });
      setCustomCityInput('');
      setCityInputError(null);
    }
  }, [isOpen, preferences]);

  if (!isOpen) return null;

  // ── City Management ────────────────────────────────────────────────────────
  const toggleCity = (city: string) => {
    const trimmed = city.trim();
    if (!trimmed) return;
    const current = localPrefs.preferredCities || [];
    const exists = current.some((c) => c.toLowerCase() === trimmed.toLowerCase());
    const updated = exists
      ? current.filter((c) => c.toLowerCase() !== trimmed.toLowerCase())
      : [...current, trimmed];
    setLocalPrefs((prev) => ({ ...prev, preferredCities: updated }));
  };

  const handleAddCustomCity = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customCityInput.trim();
    if (!trimmed) {
      setCityInputError('Please search and select a city from the list.');
      setTimeout(() => setCityInputError(null), 3000);
      return;
    }

    if (/\d/.test(trimmed)) {
      setCityInputError('City or village name cannot contain numbers.');
      setTimeout(() => setCityInputError(null), 3000);
      return;
    }

    if (trimmed.length < 2 || trimmed.length > 50) {
      setCityInputError('City or village name must be between 2 and 50 characters.');
      setTimeout(() => setCityInputError(null), 3000);
      return;
    }

    const canonical = getCanonicalCity(trimmed);
    if (!canonical && !isValidCity(trimmed)) {
      setCityInputError('Please select or enter a valid city or village name.');
      setTimeout(() => setCityInputError(null), 3500);
      return;
    }

    const cityToAdd = canonical || trimmed;
    const current = localPrefs.preferredCities || [];
    if (current.some((c) => c.toLowerCase() === cityToAdd.toLowerCase() || c.toLowerCase() === cityToAdd.split(',')[0].trim().toLowerCase())) {
      setCityInputError(`"${cityToAdd}" is already in your preferred cities.`);
      setTimeout(() => setCityInputError(null), 2500);
      return;
    }

    setLocalPrefs((prev) => ({
      ...prev,
      preferredCities: [...(prev.preferredCities || []), cityToAdd],
    }));
    setCustomCityInput('');
    setCityInputError(null);
  };

  const handleRemoveCity = (cityToRemove: string) => {
    setLocalPrefs((prev) => ({
      ...prev,
      preferredCities: (prev.preferredCities || []).filter((c) => c !== cityToRemove),
    }));
  };

  // ── Marital Status ─────────────────────────────────────────────────────────
  const toggleMaritalStatus = (status: string) => {
    const current = localPrefs.maritalStatus || [];
    const exists = current.includes(status);
    const updated = exists ? current.filter((s) => s !== status) : [...current, status];
    setLocalPrefs((prev) => ({ ...prev, maritalStatus: updated }));
  };

  // ── Diet Preferences ───────────────────────────────────────────────────────
  const toggleDiet = (diet: string) => {
    const current = localPrefs.dietPreferences || [];
    const exists = current.includes(diet);
    const updated = exists ? current.filter((d) => d !== diet) : [...current, diet];
    setLocalPrefs((prev) => ({ ...prev, dietPreferences: updated }));
  };

  // ── Family Values ──────────────────────────────────────────────────────────
  const toggleFamilyValue = (val: string) => {
    const current = localPrefs.familyValues || [];
    const exists = current.includes(val);
    const updated = exists ? current.filter((v) => v !== val) : [...current, val];
    setLocalPrefs((prev) => ({ ...prev, familyValues: updated }));
  };

  const handleSave = () => {
    onSavePreferences(localPrefs);
    onClose();
  };

  const handleReset = () => {
    setLocalPrefs({
      ...DEFAULT_USER_PREFERENCES,
      preferredGender: preferences.preferredGender || DEFAULT_USER_PREFERENCES.preferredGender,
    });
  };

  const modal = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
      style={{ isolation: 'isolate' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto border border-purple-100/60 max-h-[90vh] z-[100000]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-pink-50 text-[#F01472] flex items-center justify-center shadow-xs">
                <Sliders size={18} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Match Preferences</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize your criteria to discover the most compatible candidates
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Preferred Age Range */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50/70 via-purple-50/40 to-slate-50 border border-pink-100/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 tracking-normal">
                Preferred Age Range
              </label>
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#F01472] to-[#C80E5A] text-white text-xs font-bold shadow-xs">
                {localPrefs.ageMin} – {localPrefs.ageMax} yrs
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-1">
                <span className="text-[11px] text-slate-500 font-semibold">Min: {localPrefs.ageMin} yrs</span>
                <input
                  type="range"
                  min={candidateMinAge}
                  max={55}
                  value={Math.max(localPrefs.ageMin, candidateMinAge)}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val <= localPrefs.ageMax) setLocalPrefs((p) => ({ ...p, ageMin: val }));
                  }}
                  className="w-full accent-[#F01472] cursor-pointer"
                />
                <span className="text-[10px] text-slate-400">Legal min: {candidateMinAge} yrs</span>
              </div>
              <div className="flex-1 space-y-1">
                <span className="text-[11px] text-slate-500 font-semibold">Max: {localPrefs.ageMax} yrs</span>
                <input
                  type="range"
                  min={candidateMinAge}
                  max={55}
                  value={localPrefs.ageMax}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val >= localPrefs.ageMin) setLocalPrefs((p) => ({ ...p, ageMax: val }));
                  }}
                  className="w-full accent-[#F01472] cursor-pointer"
                />
              </div>
            </div>
          </div>


          {/* Preferred Cities + Custom City Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 tracking-normal flex items-center gap-1.5">
                <MapPin size={14} className="text-[#F01472]" />
                <span>Preferred Cities</span>
              </label>
              {(localPrefs.preferredCities || []).length > 0 && (
                <span className="text-[11px] text-slate-500 font-medium">
                  {localPrefs.preferredCities.length} selected
                </span>
              )}
            </div>

            {/* Curated City Search Input */}
            <form onSubmit={handleAddCustomCity} className="flex items-start gap-2">
              <div className="flex-1">
                <CityAutocomplete
                  value={customCityInput}
                  onChange={(val) => {
                    setCustomCityInput(val);
                    if (cityInputError) setCityInputError(null);
                  }}
                  onSelect={(item) => {
                    setCustomCityInput(item.displayName);
                    if (cityInputError) setCityInputError(null);
                  }}
                  placeholder="Search and select city (e.g. Nagpur, Nashik, Pune)..."
                  inputClassName="!py-2 !text-xs bg-slate-50/70"
                  error={cityInputError}
                />
              </div>
              <button
                type="submit"
                disabled={!customCityInput.trim()}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0 shadow-xs"
              >
                <Plus size={14} />
                <span>Add City</span>
              </button>
            </form>

            {/* Selected Cities Display */}
            {(localPrefs.preferredCities || []).length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500">
                  Selected Cities
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-slate-50/70 rounded-xl border border-slate-200/80">
                  {localPrefs.preferredCities.map((city) => (
                    <span
                      key={city}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fdf2f6] text-[#9d174d] border border-[#fbcfe8] text-xs font-semibold shadow-2xs transition"
                    >
                      <span>{city}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCity(city)}
                        className="hover:text-rose-700 text-pink-400 hover:bg-pink-200/60 cursor-pointer ml-0.5 p-0.5 rounded-full transition"
                        title="Remove city"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Quick-Add Cities */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-slate-500">
                Popular Locations
              </span>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_CITIES.map((city) => {
                  const isSel = (localPrefs.preferredCities || []).includes(city);
                  return (
                    <button
                      key={city}
                      type="button"
                      onClick={() => toggleCity(city)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer flex items-center gap-1 ${
                        isSel
                          ? 'bg-gradient-to-r from-[#F01472] to-[#C80E5A] text-white border-transparent shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-pink-300 hover:bg-pink-50/30'
                      }`}
                    >
                      {isSel ? <Check size={12} /> : <Plus size={11} className="text-slate-400" />}
                      <span>{city}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dietary Preferences (Jain replaced with Vegan) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 tracking-normal flex items-center gap-1.5">
              <Utensils size={14} className="text-emerald-600" />
              <span>Dietary Preferences</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DIETS.map((diet) => {
                const isSel = (localPrefs.dietPreferences || []).includes(diet);
                return (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => toggleDiet(diet)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      isSel
                        ? 'bg-gradient-to-r from-[#F01472] to-[#C80E5A] text-white border-transparent shadow-sm shadow-pink-500/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-pink-300 hover:bg-pink-50/40'
                    }`}
                  >
                    {isSel && <Check size={12} />}
                    <span>{diet}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Marital Status */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 tracking-normal">
              Marital Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {MARITAL_STATUSES.map((status) => {
                const isSel = (localPrefs.maritalStatus || []).includes(status);
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => toggleMaritalStatus(status)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      isSel
                        ? 'bg-gradient-to-r from-[#F01472] to-[#C80E5A] text-white border-transparent shadow-sm shadow-pink-500/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-pink-300 hover:bg-pink-50/40'
                    }`}
                  >
                    {isSel && <Check size={12} />}
                    <span>{status}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Working Partner Preference */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 tracking-normal flex items-center gap-1.5">
              <Briefcase size={14} className="text-indigo-600" />
              <span>Working Partner</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Yes', label: '💼 Working' },
                { id: 'Open', label: '🤝 Open to Both' },
                { id: 'No', label: '🏡 Homemaker' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setLocalPrefs((p) => ({ ...p, workingPartnerPreference: item.id as any }))
                  }
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${
                    localPrefs.workingPartnerPreference === item.id
                      ? 'bg-[#1b0a33] text-white border-[#1b0a33] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-purple-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Family Values */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 tracking-normal flex items-center gap-1.5">
              <Home size={14} className="text-purple-600" />
              <span>Family Values</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {FAMILY_VALUES.map((val) => {
                const isSel = (localPrefs.familyValues || []).includes(val);
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => toggleFamilyValue(val)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${
                      isSel
                        ? 'bg-gradient-to-r from-[#F01472] to-[#C80E5A] text-white border-transparent shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-pink-300'
                    }`}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="p-4 sm:px-6 border-t border-slate-100 bg-white flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 transition cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw size={13} />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-[#F01472] to-[#C80E5A] hover:from-[#d90d63] hover:to-[#b00b4e] text-white font-extrabold text-xs shadow-lg shadow-pink-500/25 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles size={15} />
            <span>Save & Recalculate Matches</span>
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};
