import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Sparkles,
  Check,
  CheckCircle2,
} from 'lucide-react';
import type { SearchFilterState } from '../../types/discovery';

interface QuickFilterChipsProps {
  filters: SearchFilterState;
  onUpdateFilters: (newFilters: Partial<SearchFilterState>) => void;
  onOpenDrawer: () => void;
  activeFilterCount: number;
}

const POPULAR_LOCATIONS = ['Pune', 'Mumbai', 'Bengaluru', 'Delhi NCR', 'Hyderabad', 'Ahmedabad', 'Kolkata', 'Chennai'];
const PROFESSIONS = ['Software Engineer', 'Product Designer', 'Investment Banker', 'Doctor / Medical', 'Management Consultant', 'Chartered Accountant'];
const EDUCATIONS = ['B.Tech / B.E.', 'MBA / PGDM', 'M.S. / Master’s', 'MBBS / MD', 'Chartered Accountant (CA)'];
const RELIGIONS = ['Hindu', 'Jain', 'Sikh', 'Christian', 'Buddhist'];
const DIETS = ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Jain'];

export const QuickFilterChips: React.FC<QuickFilterChipsProps> = ({
  filters,
  onUpdateFilters,
  onOpenDrawer,
  activeFilterCount,
}) => {
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenPopover(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleLocation = (loc: string) => {
    const exists = filters.locations.includes(loc);
    const updated = exists ? filters.locations.filter((l) => l !== loc) : [...filters.locations, loc];
    onUpdateFilters({ locations: updated });
  };

  const toggleProfession = (prof: string) => {
    const exists = filters.professions.includes(prof);
    const updated = exists ? filters.professions.filter((p) => p !== prof) : [...filters.professions, prof];
    onUpdateFilters({ professions: updated });
  };

  const toggleEducation = (edu: string) => {
    const exists = filters.educations.includes(edu);
    const updated = exists ? filters.educations.filter((e) => e !== edu) : [...filters.educations, edu];
    onUpdateFilters({ educations: updated });
  };

  const toggleReligion = (rel: string) => {
    const exists = filters.religions.includes(rel);
    const updated = exists ? filters.religions.filter((r) => r !== rel) : [...filters.religions, rel];
    onUpdateFilters({ religions: updated });
  };

  const toggleDiet = (diet: string) => {
    const exists = filters.diets.includes(diet);
    const updated = exists ? filters.diets.filter((d) => d !== diet) : [...filters.diets, diet];
    onUpdateFilters({ diets: updated });
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {/* 1. Age Quick Chip */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setOpenPopover(openPopover === 'age' ? null : 'age')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              filters.minAge > 21 || filters.maxAge < 45
                ? 'bg-[#1e1b4b] text-white border-[#1e1b4b] shadow-xs'
                : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300 hover:bg-pink-50/40'
            }`}
          >
            <span>
              {filters.minAge > 21 || filters.maxAge < 45
                ? `Age ${filters.minAge}–${filters.maxAge}`
                : 'Age'}
            </span>
            <ChevronDown size={13} className="opacity-70" />
          </button>

          {openPopover === 'age' && (
            <div className="absolute top-full mt-2 left-0 z-30 w-72 bg-white rounded-2xl shadow-xl border border-purple-100 p-4 space-y-3 animate-scaleUp">
              <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                <span>Age Range</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-extrabold text-[11px]">
                  {filters.minAge} – {filters.maxAge} yrs
                </span>
              </div>
              <div className="space-y-2">
                <input
                  type="range"
                  min={21}
                  max={45}
                  value={filters.minAge}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val <= filters.maxAge) onUpdateFilters({ minAge: val });
                  }}
                  className="w-full accent-[#F01472] cursor-pointer"
                />
                <input
                  type="range"
                  min={21}
                  max={45}
                  value={filters.maxAge}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val >= filters.minAge) onUpdateFilters({ maxAge: val });
                  }}
                  className="w-full accent-[#F01472] cursor-pointer"
                />
              </div>
              <div className="flex justify-between pt-1">
                <button
                  type="button"
                  onClick={() => onUpdateFilters({ minAge: 21, maxAge: 45 })}
                  className="text-[11px] text-gray-400 hover:text-gray-700 font-bold"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setOpenPopover(null)}
                  className="px-3 py-1 bg-[#F01472] text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. Location Quick Chip */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setOpenPopover(openPopover === 'location' ? null : 'location')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              filters.locations.length > 0
                ? 'bg-[#1e1b4b] text-white border-[#1e1b4b] shadow-xs'
                : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300 hover:bg-pink-50/40'
            }`}
          >
            <span>
              {filters.locations.length === 1
                ? `📍 ${filters.locations[0]}`
                : filters.locations.length > 1
                ? `📍 ${filters.locations.length} Cities`
                : 'Location'}
            </span>
            <ChevronDown size={13} className="opacity-70" />
          </button>

          {openPopover === 'location' && (
            <div className="absolute top-full mt-2 left-0 z-30 w-64 bg-white rounded-2xl shadow-xl border border-purple-100 p-3 space-y-2 animate-scaleUp">
              <div className="text-[11px] font-bold text-gray-600 px-1">
                Popular Cities
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                {POPULAR_LOCATIONS.map((loc) => {
                  const isSel = filters.locations.includes(loc);
                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => toggleLocation(loc)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1 ${
                        isSel
                          ? 'bg-[#F01472] text-white border-[#F01472]'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-pink-50'
                      }`}
                    >
                      {isSel && <Check size={11} />}
                      {loc}
                    </button>
                  );
                })}
              </div>
              <div className="pt-2 border-t border-gray-100 flex justify-between">
                <button
                  type="button"
                  onClick={() => onUpdateFilters({ locations: [] })}
                  className="text-[11px] text-gray-400 font-bold"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setOpenPopover(null)}
                  className="px-3 py-1 bg-[#1e1b4b] text-white text-xs font-bold rounded-xl"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. Profession Quick Chip */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setOpenPopover(openPopover === 'profession' ? null : 'profession')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              filters.professions.length > 0
                ? 'bg-[#1e1b4b] text-white border-[#1e1b4b] shadow-xs'
                : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300 hover:bg-pink-50/40'
            }`}
          >
            <span>
              {filters.professions.length === 1
                ? `💼 ${filters.professions[0]}`
                : filters.professions.length > 1
                ? `💼 ${filters.professions.length} Careers`
                : 'Profession'}
            </span>
            <ChevronDown size={13} className="opacity-70" />
          </button>

          {openPopover === 'profession' && (
            <div className="absolute top-full mt-2 left-0 z-30 w-72 bg-white rounded-2xl shadow-xl border border-purple-100 p-3 space-y-2 animate-scaleUp">
              <div className="text-[11px] font-bold text-gray-600 px-1">
                Careers & Professions
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {PROFESSIONS.map((prof) => {
                  const isSel = filters.professions.includes(prof);
                  return (
                    <button
                      key={prof}
                      type="button"
                      onClick={() => toggleProfession(prof)}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                        isSel ? 'bg-purple-50 text-[#5b21b6] font-bold' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{prof}</span>
                      {isSel && <Check size={13} className="text-[#5b21b6]" />}
                    </button>
                  );
                })}
              </div>
              <div className="pt-2 border-t border-gray-100 flex justify-between">
                <button
                  type="button"
                  onClick={() => onUpdateFilters({ professions: [] })}
                  className="text-[11px] text-gray-400 font-bold"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setOpenPopover(null)}
                  className="px-3 py-1 bg-[#1e1b4b] text-white text-xs font-bold rounded-xl"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. Education Quick Chip */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setOpenPopover(openPopover === 'education' ? null : 'education')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              filters.educations.length > 0
                ? 'bg-[#1e1b4b] text-white border-[#1e1b4b] shadow-xs'
                : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300 hover:bg-pink-50/40'
            }`}
          >
            <span>
              {filters.educations.length === 1
                ? `🎓 ${filters.educations[0]}`
                : filters.educations.length > 1
                ? `🎓 ${filters.educations.length} Degrees`
                : 'Education'}
            </span>
            <ChevronDown size={13} className="opacity-70" />
          </button>

          {openPopover === 'education' && (
            <div className="absolute top-full mt-2 left-0 z-30 w-64 bg-white rounded-2xl shadow-xl border border-purple-100 p-3 space-y-2 animate-scaleUp">
              <div className="text-[11px] font-bold text-gray-600 px-1">
                Qualifications
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {EDUCATIONS.map((edu) => {
                  const isSel = filters.educations.includes(edu);
                  return (
                    <button
                      key={edu}
                      type="button"
                      onClick={() => toggleEducation(edu)}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                        isSel ? 'bg-purple-50 text-[#5b21b6] font-bold' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{edu}</span>
                      {isSel && <Check size={13} className="text-[#5b21b6]" />}
                    </button>
                  );
                })}
              </div>
              <div className="pt-2 border-t border-gray-100 flex justify-between">
                <button
                  type="button"
                  onClick={() => onUpdateFilters({ educations: [] })}
                  className="text-[11px] text-gray-400 font-bold"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setOpenPopover(null)}
                  className="px-3 py-1 bg-[#1e1b4b] text-white text-xs font-bold rounded-xl"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 5. Religion Quick Chip */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setOpenPopover(openPopover === 'religion' ? null : 'religion')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              filters.religions.length > 0
                ? 'bg-[#1e1b4b] text-white border-[#1e1b4b] shadow-xs'
                : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300 hover:bg-pink-50/40'
            }`}
          >
            <span>
              {filters.religions.length === 1
                ? `🙏 ${filters.religions[0]}`
                : filters.religions.length > 1
                ? `🙏 ${filters.religions.length} Religions`
                : 'Religion'}
            </span>
            <ChevronDown size={13} className="opacity-70" />
          </button>

          {openPopover === 'religion' && (
            <div className="absolute top-full mt-2 left-0 z-30 w-56 bg-white rounded-2xl shadow-xl border border-purple-100 p-3 space-y-2 animate-scaleUp">
              <div className="space-y-1">
                {RELIGIONS.map((rel) => {
                  const isSel = filters.religions.includes(rel);
                  return (
                    <button
                      key={rel}
                      type="button"
                      onClick={() => toggleReligion(rel)}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                        isSel ? 'bg-amber-50 text-amber-900 font-bold' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{rel}</span>
                      {isSel && <Check size={13} className="text-amber-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 6. Lifestyle / Diet Quick Chip */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setOpenPopover(openPopover === 'diet' ? null : 'diet')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              filters.diets.length > 0
                ? 'bg-[#1e1b4b] text-white border-[#1e1b4b] shadow-xs'
                : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300 hover:bg-pink-50/40'
            }`}
          >
            <span>
              {filters.diets.length === 1
                ? `🥗 ${filters.diets[0]}`
                : filters.diets.length > 1
                ? `🥗 ${filters.diets.length} Diets`
                : 'Lifestyle'}
            </span>
            <ChevronDown size={13} className="opacity-70" />
          </button>

          {openPopover === 'diet' && (
            <div className="absolute top-full mt-2 left-0 z-30 w-56 bg-white rounded-2xl shadow-xl border border-purple-100 p-3 space-y-2 animate-scaleUp">
              <div className="space-y-1">
                {DIETS.map((diet) => {
                  const isSel = filters.diets.includes(diet);
                  return (
                    <button
                      key={diet}
                      type="button"
                      onClick={() => toggleDiet(diet)}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                        isSel ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{diet}</span>
                      {isSel && <Check size={13} className="text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 7. Verified Toggle Chip */}
        <button
          type="button"
          onClick={() => onUpdateFilters({ verifiedOnly: !filters.verifiedOnly })}
          className={`shrink-0 px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer border ${
            filters.verifiedOnly
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/40'
          }`}
        >
          <CheckCircle2 size={13} className={filters.verifiedOnly ? 'text-white' : 'text-emerald-500'} />
          <span>Verified Only</span>
        </button>

        {/* 8. Final ✨ More Filters Button */}
        <button
          type="button"
          onClick={onOpenDrawer}
          className="shrink-0 px-4 py-2 rounded-2xl text-xs font-black bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 text-[#F01472] hover:bg-pink-100/60 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ml-auto"
        >
          <Sparkles size={13} />
          <span>✨ More Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#F01472] text-white text-[10px] font-black flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
