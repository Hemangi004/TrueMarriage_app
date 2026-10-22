import React, { useState, useEffect, useRef } from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { GraduationCap, Building2, Calendar, Plus, Trash2, AlertCircle } from 'lucide-react';
import type { EducationItem } from '../../types/biodata';
import { validateDegreeName, validateCollegeName } from '../../utils/nameValidation';

const POPULAR_DEGREES = [
  'B.Tech / B.E.',
  'M.Tech / M.E.',
  'MBBS / MD',
  'MBA / PGDM',
  'CA / CS',
  'B.Com / M.Com',
  'B.Sc / M.Sc',
  'BBA / BCA',
  'Ph.D / Doctorate',
  'LL.B / LL.M',
  'Other',
];

export const QEducation: React.FC = () => {
  const { formData, updateFormData } = useBiodata();

  const [degree, setDegree] = useState('');
  const [college, setCollege] = useState('');
  const [passingYear, setPassingYear] = useState('');
  const [error, setError] = useState<string | null>(null);

  const educationList = formData.educationList || [];

  // Ref to track latest state for unmount auto-save
  const draftRef = useRef({ degree, college, passingYear, educationList, updateFormData });
  useEffect(() => {
    draftRef.current = { degree, college, passingYear, educationList, updateFormData };
  });

  // Auto-save dangling input when moving to the next step
  useEffect(() => {
    return () => {
      const { degree, college, passingYear, educationList, updateFormData } = draftRef.current;
      const trimmedDeg = (degree || '').trim();
      const trimmedCollege = (college || '').trim();
      const trimmedYear = (passingYear || '').trim();

      if (!trimmedDeg && !trimmedCollege) return;

      const degValid = validateDegreeName(trimmedDeg);
      const colValid = validateCollegeName(trimmedCollege);
      if (!degValid.isValid || !colValid.isValid) return;

      const existingIdx = educationList.findIndex(
        (item) => (item.degree || item.qualification || '').trim().toLowerCase() === trimmedDeg.toLowerCase()
      );

      if (existingIdx >= 0) {
        if (trimmedCollege || trimmedYear) {
          const updated = [...educationList];
          updated[existingIdx] = {
            ...updated[existingIdx],
            college: trimmedCollege || updated[existingIdx].college || '',
            passingYear: trimmedYear || updated[existingIdx].passingYear || '',
          };
          updateFormData({ educationList: updated });
        }
        return;
      }

      updateFormData({
        educationList: [
          ...educationList,
          {
            id: Date.now().toString(),
            degree: trimmedDeg,
            college: trimmedCollege,
            passingYear: trimmedYear,
            university: '',
            qualification: trimmedDeg,
            certifications: '',
          },
        ],
      });
    };
  }, []);

  const handleAddEducation = () => {
    const trimmedDegree = degree.trim();
    const trimmedCollege = college.trim();
    const trimmedYear = passingYear.trim();

    const degreeCheck = validateDegreeName(trimmedDegree);
    if (!degreeCheck.isValid) {
      setError(degreeCheck.error);
      return;
    }

    const collegeCheck = validateCollegeName(trimmedCollege);
    if (!collegeCheck.isValid) {
      setError(collegeCheck.error);
      return;
    }

    const existingIdx = educationList.findIndex(
      (item) => (item.degree || item.qualification || '').trim().toLowerCase() === trimmedDegree.toLowerCase()
    );

    if (existingIdx >= 0) {
      const existing = educationList[existingIdx];
      // If the existing item was missing college/year and user is filling them now, merge as one record
      if (!existing.college && (trimmedCollege || trimmedYear)) {
        const updatedList = [...educationList];
        updatedList[existingIdx] = {
          ...existing,
          college: trimmedCollege || existing.college || '',
          passingYear: trimmedYear || existing.passingYear || '',
        };
        updateFormData({ educationList: updatedList });
        setDegree('');
        setCollege('');
        setPassingYear('');
        setError(null);
        return;
      }

      setError('This qualification has already been added.');
      return;
    }

    setError(null);
    const newItem: EducationItem = {
      id: Date.now().toString(),
      degree: trimmedDegree,
      college: trimmedCollege,
      university: '',
      passingYear: trimmedYear,
      qualification: trimmedDegree,
      certifications: '',
    };
    updateFormData({ educationList: [...educationList, newItem] });
    setDegree('');
    setCollege('');
    setPassingYear('');
  };

  const handleRemove = (id: string) => {
    setError(null);
    updateFormData({
      educationList: educationList.filter((item) => item.id !== id),
    });
  };

  return (
    <div className="space-y-4">
      {/* Existing Combined Education Cards */}
      {educationList.length > 0 && (
        <div className="space-y-2">
          <span className="text-[11px] font-[450] text-gray-400 tracking-normal">
            Added Qualifications ({educationList.length})
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {educationList.map((item) => {
              const details = [item.college, item.passingYear]
                .map((s) => (s || '').replace(/^\(\s*\)$/, '').trim())
                .filter(Boolean)
                .join(' · ');
              return (
                <div
                  key={item.id}
                  className="p-3 bg-rose-50/50 border border-rose-200/80 rounded-2xl flex items-center justify-between shadow-2xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-white border border-rose-200 flex items-center justify-center text-[#F01472] shrink-0">
                      <GraduationCap size={16} />
                    </div>
                    <div className="min-w-0">
                      <span className="block font-[450] text-gray-900 text-xs sm:text-sm truncate">
                        {item.degree || item.qualification || 'Degree / Qualification'}
                      </span>
                      {details ? (
                        <span className="block text-[11px] text-gray-500 font-normal truncate mt-0.5">
                          {details}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer shrink-0"
                    title="Remove qualification"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2-Column Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start">
        {/* Left Column: Degree & Popular Pills */}
        <div className="space-y-2.5">
          <label className="block text-[11px] sm:text-xs font-[450] text-gray-500 tracking-normal">
            Degree / Specialization
          </label>
          <div className="relative flex items-center">
            <GraduationCap className="absolute left-3.5 text-rose-400 pointer-events-none" size={17} />
            <input
              type="text"
              maxLength={100}
              value={degree}
              onChange={(e) => {
                setDegree(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. B.Tech / B.E."
              className="wizard-input with-icon !pl-11 text-xs sm:text-sm font-[450]"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {POPULAR_DEGREES.slice(0, 8).map((deg) => {
              const existingMatch = educationList.find(
                (item) => (item.degree || item.qualification || '').trim().toLowerCase() === deg.toLowerCase()
              );
              return (
                <button
                  key={deg}
                  type="button"
                  onClick={() => {
                    setDegree(deg);
                    if (existingMatch) {
                      if (existingMatch.college) setCollege(existingMatch.college);
                      if (existingMatch.passingYear) setPassingYear(existingMatch.passingYear);
                    }
                    if (error) setError(null);
                  }}
                  className={`pill-button text-[11px] py-1 px-2.5 font-[450] cursor-pointer ${
                    degree === deg ? 'selected' : ''
                  } ${existingMatch ? 'ring-1 ring-emerald-500/40 opacity-80' : ''}`}
                >
                  {deg} {existingMatch && '✓'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: College, Year & Add Button */}
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] sm:text-xs font-[450] text-gray-500 tracking-normal mb-1.5">
              College / Institute
            </label>
            <div className="relative flex items-center">
              <Building2 className="absolute left-3.5 text-gray-400 pointer-events-none" size={17} />
              <input
                type="text"
                maxLength={100}
                value={college}
                onChange={(e) => {
                  setCollege(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g. YCC / IIT Bombay"
                className="wizard-input with-icon !pl-11 text-xs sm:text-sm font-[450]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] sm:text-xs font-[450] text-gray-500 tracking-normal mb-1.5">
              Passing Year
            </label>
            <div className="relative flex items-center">
              <Calendar className="absolute left-3.5 text-gray-400 pointer-events-none" size={17} />
              <input
                type="number"
                max={2099}
                min={1950}
                value={passingYear}
                onChange={(e) => {
                  const val = e.target.value.slice(0, 4);
                  setPassingYear(val);
                  if (error) setError(null);
                }}
                placeholder="e.g. 2018"
                className="wizard-input with-icon !pl-11 text-xs sm:text-sm font-[450]"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-1.5 p-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-[450] rounded-xl animate-fadeIn">
              <AlertCircle size={14} className="shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleAddEducation}
            disabled={!degree.trim()}
            className="w-full py-2.5 bg-rose-50 border border-rose-200 text-[#F01472] font-[450] text-xs sm:text-sm rounded-2xl hover:bg-rose-100 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Plus size={16} />
            <span>Add Qualification</span>
          </button>
        </div>
      </div>
    </div>
  );
};
