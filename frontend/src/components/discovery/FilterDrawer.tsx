import React, { useState, useEffect } from 'react';
import {
  X,
  RotateCcw,
  SlidersHorizontal,
  GraduationCap,
  Briefcase,
  Heart,
  Users,
  Smile,
  Clock,
  Sparkles,
  Check,
} from 'lucide-react';
import type { SearchFilterState } from '../../types/discovery';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SearchFilterState;
  onApplyFilters: (newFilters: SearchFilterState) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
}

const POPULAR_LOCATIONS = [
  'Pune', 'Mumbai', 'Bengaluru', 'Delhi NCR', 'Hyderabad',
  'Ahmedabad', 'Kolkata', 'Chennai', 'Jaipur', 'Chandigarh', 'Kochi', 'Goa'
];

const PROFESSIONS = [
  'Software Engineer', 'Product Designer', 'Investment Banker',
  'AI Research Scientist', 'Architect', 'Doctor / Medical',
  'Management Consultant', 'Chartered Accountant', 'Civil Services', 'Entrepreneur / Founder'
];

const EDUCATIONS = [
  'B.Tech / B.E.', 'M.Tech / M.E.', 'MBA / PGDM',
  'M.S. / Master’s', 'MBBS / MD / Medical', 'Chartered Accountant (CA)',
  'B.Arch / Design', 'Law (LL.B / LL.M)', 'Ph.D / Doctorate'
];

const RELIGIONS = ['Hindu', 'Jain', 'Sikh', 'Christian', 'Buddhist', 'Muslim', 'Parsi', 'Other'];

const COMMUNITIES = [
  'Brahmin', 'Maratha', 'Patel / Leva', 'Rajput', 'Iyer / Iyengar',
  'Agarwal / Marwari', 'Khatri', 'Jat Sikh', 'Reddy', 'Nair', 'Roman Catholic'
];

const MOTHER_TONGUES = ['Marathi', 'Hindi', 'Gujarati', 'Tamil', 'Telugu', 'Bengali', 'Punjabi', 'Malayalam', 'Kannada', 'English'];

const DIETS = ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Jain', 'Vegan'];

const FAMILY_TYPES = ['Nuclear Family', 'Joint Family', 'Extended Family'];
const FAMILY_VALUES = ['Moderate', 'Traditional', 'Liberal'];
const MARITAL_STATUSES = ['Never Married', 'Divorced', 'Widowed'];
const MARRIAGE_TIMELINES = ['Immediate', 'Within 6-12 months', 'Within 1-2 years'];

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
  totalFilteredCount,
}) => {
  const [localFilters, setLocalFilters] = useState<SearchFilterState>(filters);
  const [activeTab, setActiveTab] = useState<'basic' | 'education' | 'religion' | 'family' | 'lifestyle' | 'marriage'>('basic');

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, isOpen]);

  if (!isOpen) return null;

  const toggleArrayItem = (key: keyof SearchFilterState, value: string) => {
    const arr = (localFilters[key] as string[]) || [];
    const exists = arr.includes(value);
    const updated = exists ? arr.filter((v) => v !== value) : [...arr, value];
    setLocalFilters((prev) => ({ ...prev, [key]: updated }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    onResetFilters();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[99999] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
      />

      {/* Drawer Body */}
      <div className="relative w-full max-w-lg sm:max-w-xl h-full bg-white shadow-2xl flex flex-col z-10 animate-slideInRight">
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-purple-100 flex items-center justify-between bg-gradient-to-r from-purple-50/50 via-white to-rose-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#F01472] to-[#C80E5A] text-white flex items-center justify-center shadow-md shadow-rose-500/20">
              <SlidersHorizontal size={17} />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#1e1b4b]">Custom Profile Filters</h2>
              <p className="text-xs text-gray-500">Refine verified matrimonial candidates</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs for Sections */}
        <div className="flex overflow-x-auto border-b border-gray-100 bg-gray-50/80 px-4 py-2 gap-1.5 scrollbar-none shrink-0">
          {[
            { id: 'basic', label: 'Basic Info', icon: <Users size={13} /> },
            { id: 'education', label: 'Career & Edu', icon: <Briefcase size={13} /> },
            { id: 'religion', label: 'Community', icon: <Heart size={13} /> },
            { id: 'family', label: 'Family', icon: <Users size={13} /> },
            { id: 'lifestyle', label: 'Lifestyle', icon: <Smile size={13} /> },
            { id: 'marriage', label: 'Marriage Goals', icon: <Clock size={13} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#1e1b4b] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-200/60 border border-gray-200/70'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Scrollable Filter Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. BASIC INFORMATION */}
          {activeTab === 'basic' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Age Dual Range */}
              <div className="space-y-3 p-4 rounded-2xl bg-purple-50/40 border border-purple-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800">
                    Age Range
                  </label>
                  <span className="px-3 py-0.5 rounded-full bg-[#1e1b4b] text-white text-xs font-black">
                    {localFilters.minAge} – {localFilters.maxAge} years
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] text-gray-500 font-bold">Min Age: {localFilters.minAge}</span>
                    <input
                      type="range"
                      min={21}
                      max={45}
                      value={localFilters.minAge}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (val <= localFilters.maxAge) {
                          setLocalFilters((prev) => ({ ...prev, minAge: val }));
                        }
                      }}
                      className="w-full accent-[#F01472] cursor-pointer"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] text-gray-500 font-bold">Max Age: {localFilters.maxAge}</span>
                    <input
                      type="range"
                      min={21}
                      max={45}
                      value={localFilters.maxAge}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (val >= localFilters.minAge) {
                          setLocalFilters((prev) => ({ ...prev, maxAge: val }));
                        }
                      }}
                      className="w-full accent-[#F01472] cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Gender Preference */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800">Looking for</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '', label: 'All Candidates' },
                    { id: 'Female', label: '👰 Brides (Female)' },
                    { id: 'Male', label: '🤵 Grooms (Male)' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setLocalFilters((prev) => ({ ...prev, gender: g.id }))}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${
                        localFilters.gender === g.id
                          ? 'bg-[#F01472] text-white border-[#F01472] shadow-xs'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Marital Status */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800">Marital Status</label>
                <div className="flex flex-wrap gap-2">
                  {MARITAL_STATUSES.map((status) => {
                    const isSelected = localFilters.maritalStatuses.includes(status);
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => toggleArrayItem('maritalStatuses', status)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#1e1b4b] text-white border-[#1e1b4b]'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        {isSelected && <Check size={12} />}
                        {status}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Locations */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800">Preferred Cities</label>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_LOCATIONS.map((loc) => {
                    const isSelected = localFilters.locations.includes(loc);
                    return (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => toggleArrayItem('locations', loc)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? 'bg-[#F01472] text-white border-[#F01472]'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300'
                        }`}
                      >
                        {isSelected && <Check size={12} />}
                        📍 {loc}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 2. EDUCATION & CAREER */}
          {activeTab === 'education' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Education Level */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <GraduationCap size={14} className="text-purple-600" /> Education Qualification
                </label>
                <div className="flex flex-wrap gap-2">
                  {EDUCATIONS.map((edu) => {
                    const isSelected = localFilters.educations.includes(edu);
                    return (
                      <button
                        key={edu}
                        type="button"
                        onClick={() => toggleArrayItem('educations', edu)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? 'bg-[#5b21b6] text-white border-[#5b21b6]'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        {isSelected && <Check size={12} />}
                        🎓 {edu}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Profession Domain */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <Briefcase size={14} className="text-indigo-600" /> Profession / Career Domain
                </label>
                <div className="flex flex-wrap gap-2">
                  {PROFESSIONS.map((prof) => {
                    const isSelected = localFilters.professions.includes(prof);
                    return (
                      <button
                        key={prof}
                        type="button"
                        onClick={() => toggleArrayItem('professions', prof)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? 'bg-[#1e1b4b] text-white border-[#1e1b4b]'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        {isSelected && <Check size={12} />}
                        💼 {prof}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 3. RELIGION & COMMUNITY */}
          {activeTab === 'religion' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-800">
                ✨ Community filters are completely optional. TrueMarriage celebrates love across all backgrounds.
              </div>

              {/* Religion */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800">Religion</label>
                <div className="flex flex-wrap gap-2">
                  {RELIGIONS.map((rel) => {
                    const isSelected = localFilters.religions.includes(rel);
                    return (
                      <button
                        key={rel}
                        type="button"
                        onClick={() => toggleArrayItem('religions', rel)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-amber-300'
                        }`}
                      >
                        {isSelected && <Check size={12} />}
                        {rel}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Community */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800">Community / Caste (Optional)</label>
                <div className="flex flex-wrap gap-2">
                  {COMMUNITIES.map((caste) => {
                    const isSelected = localFilters.communities.includes(caste);
                    return (
                      <button
                        key={caste}
                        type="button"
                        onClick={() => toggleArrayItem('communities', caste)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? 'bg-purple-700 text-white border-purple-700'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        {isSelected && <Check size={12} />}
                        {caste}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mother Tongue */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800">Mother Tongue</label>
                <div className="flex flex-wrap gap-2">
                  {MOTHER_TONGUES.map((lang) => {
                    const isSelected = localFilters.motherTongues.includes(lang);
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleArrayItem('motherTongues', lang)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? 'bg-indigo-700 text-white border-indigo-700'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        {isSelected && <Check size={12} />}
                        🗣️ {lang}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 4. FAMILY */}
          {activeTab === 'family' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Family Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800">Family Structure</label>
                <div className="flex flex-wrap gap-2">
                  {FAMILY_TYPES.map((ft) => {
                    const isSelected = localFilters.familyTypes.includes(ft);
                    return (
                      <button
                        key={ft}
                        type="button"
                        onClick={() => toggleArrayItem('familyTypes', ft)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#1e1b4b] text-white border-[#1e1b4b]'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        {isSelected && <Check size={12} />}
                        👨‍👩‍👧 {ft}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Family Values */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800">Family Values</label>
                <div className="grid grid-cols-3 gap-2">
                  {FAMILY_VALUES.map((fv) => {
                    const isSelected = localFilters.familyValues.includes(fv);
                    return (
                      <button
                        key={fv}
                        type="button"
                        onClick={() => toggleArrayItem('familyValues', fv)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${
                          isSelected
                            ? 'bg-[#F01472] text-white border-[#F01472]'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300'
                        }`}
                      >
                        {fv}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 5. LIFESTYLE */}
          {activeTab === 'lifestyle' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Diet */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800">Dietary Habits</label>
                <div className="flex flex-wrap gap-2">
                  {DIETS.map((diet) => {
                    const isSelected = localFilters.diets.includes(diet);
                    return (
                      <button
                        key={diet}
                        type="button"
                        onClick={() => toggleArrayItem('diets', diet)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300'
                        }`}
                      >
                        {isSelected && <Check size={12} />}
                        🥗 {diet}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Smoking */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800">Smoking</label>
                <div className="flex gap-2">
                  {['No', 'Occasionally', 'Yes'].map((s) => {
                    const isSelected = localFilters.smoking.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleArrayItem('smoking', s)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${
                          isSelected
                            ? 'bg-[#1e1b4b] text-white border-[#1e1b4b]'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        {s === 'No' ? '🚫 Non-Smoker' : s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Drinking */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800">Drinking</label>
                <div className="flex gap-2">
                  {['No', 'Socially', 'Yes'].map((d) => {
                    const isSelected = localFilters.drinking.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => toggleArrayItem('drinking', d)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${
                          isSelected
                            ? 'bg-[#1e1b4b] text-white border-[#1e1b4b]'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        {d === 'No' ? '🚫 Non-Drinker' : d === 'Socially' ? '🥂 Socially' : d}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 6. MARRIAGE PREFERENCES */}
          {activeTab === 'marriage' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Marriage Timeline */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800">Marriage Timeline</label>
                <div className="flex flex-wrap gap-2">
                  {MARRIAGE_TIMELINES.map((time) => {
                    const isSelected = localFilters.marriageTimeline.includes(time);
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => toggleArrayItem('marriageTimeline', time)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#F01472] text-white border-[#F01472]'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300'
                        }`}
                      >
                        {isSelected && <Check size={12} />}
                        ⏳ {time}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Working Partner Preference */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800">Working Partner Preference</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: '', label: 'No Preference' },
                    { id: 'Prefers working partner', label: '💼 Prefers Working Partner' },
                    { id: 'Open to both', label: '🤝 Open to Both' },
                    { id: 'Prefers homemaker', label: '🏡 Prefers Homemaker' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setLocalFilters((prev) => ({ ...prev, workingPartnerPreference: p.id }))}
                      className={`p-2.5 rounded-xl text-xs font-bold border text-left transition cursor-pointer ${
                        localFilters.workingPartnerPreference === p.id
                          ? 'bg-[#1e1b4b] text-white border-[#1e1b4b]'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-purple-100 bg-white flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-3 rounded-2xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-100 transition cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <RotateCcw size={13} /> Reset Filters
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#F01472] to-[#C80E5A] hover:from-rose-600 hover:to-rose-700 text-white font-extrabold text-sm shadow-lg shadow-rose-500/25 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles size={16} /> Show {totalFilteredCount} Profiles
          </button>
        </div>
      </div>
    </div>
  );
};
