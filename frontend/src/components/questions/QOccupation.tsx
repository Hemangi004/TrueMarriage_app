import React, { useState } from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { Briefcase, Building, IndianRupee, Laptop, AlertCircle } from 'lucide-react';
import { validateOccupation, validateCompany } from '../../utils/nameValidation';

const WORK_MODES: Array<'Remote' | 'Hybrid' | 'Office'> = ['Remote', 'Hybrid', 'Office'];
const SALARY_RANGES = [
  '₹5 - ₹10 LPA',
  '₹10 - ₹15 LPA',
  '₹15 - ₹25 LPA',
  '₹25 - ₹40 LPA',
  '₹40 - ₹75 LPA',
  '₹75 LPA+',
];

export const QOccupation: React.FC = () => {
  const { formData, updateFormData } = useBiodata();
  const [occupationError, setOccupationError] = useState<string | null>(() => {
    const check = validateOccupation(formData.occupation);
    return check.isValid ? null : check.error;
  });
  const [companyError, setCompanyError] = useState<string | null>(() => {
    const check = validateCompany(formData.company);
    return check.isValid ? null : check.error;
  });

  const handleOccupationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    updateFormData({ occupation: val });
    const check = validateOccupation(val);
    setOccupationError(check.isValid ? null : check.error);
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    updateFormData({ company: val });
    const check = validateCompany(val);
    setCompanyError(check.isValid ? null : check.error);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start">
      {/* Column 1: Profession, Employer & Work Mode */}
      <div className="space-y-3.5">
        {/* Occupation / Role */}
        <div>
          <label className="block text-[11px] sm:text-xs font-[450] text-gray-500 tracking-normal mb-1.5">
            Occupation / Profession
          </label>
          <div className="relative flex items-center">
            <Briefcase className={`absolute left-3.5 pointer-events-none transition-colors ${occupationError ? 'text-red-400' : 'text-rose-400'}`} size={17} />
            <input
              type="text"
              maxLength={100}
              value={formData.occupation || ''}
              onChange={handleOccupationChange}
              placeholder="e.g. Senior Software Engineer"
              className={`wizard-input with-icon !pl-11 text-xs sm:text-sm font-[450] transition-all ${
                occupationError ? '!border-red-500 !bg-red-50/20 focus:!border-red-500 focus:!ring-red-500/20' : ''
              }`}
            />
          </div>
          {occupationError && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 font-[450] mt-1.5 animate-fadeIn">
              <AlertCircle size={13} className="shrink-0 text-red-500" />
              <span>{occupationError}</span>
            </div>
          )}
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-[11px] sm:text-xs font-[450] text-gray-500 tracking-normal mb-1.5">
            Company / Employer
          </label>
          <div className="relative flex items-center">
            <Building className={`absolute left-3.5 pointer-events-none transition-colors ${companyError ? 'text-red-400' : 'text-gray-400'}`} size={17} />
            <input
              type="text"
              maxLength={100}
              value={formData.company || ''}
              onChange={handleCompanyChange}
              placeholder="e.g. Google India / TCS / Self Employed"
              className={`wizard-input with-icon !pl-11 text-xs sm:text-sm font-[450] transition-all ${
                companyError ? '!border-red-500 !bg-red-50/20 focus:!border-red-500 focus:!ring-red-500/20' : ''
              }`}
            />
          </div>
          {companyError && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 font-[450] mt-1.5 animate-fadeIn">
              <AlertCircle size={13} className="shrink-0 text-red-500" />
              <span>{companyError}</span>
            </div>
          )}
        </div>

        {/* Work Mode */}
        <div>
          <label className="block text-[11px] sm:text-xs font-[450] text-gray-500 tracking-normal mb-1.5">
            Work Mode
          </label>
          <div className="flex gap-2">
            {WORK_MODES.map((wm) => (
              <button
                key={wm}
                type="button"
                onClick={() => updateFormData({ workMode: wm })}
                className={`pill-button flex-1 justify-center py-2 text-xs font-[450] cursor-pointer ${
                  formData.workMode === wm ? 'selected' : ''
                }`}
              >
                <Laptop size={13} />
                <span>{wm}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Column 2: Income & Quick Range */}
      <div className="space-y-3.5">
        {/* Income (free text) */}
        <div>
          <label className="block text-[11px] sm:text-xs font-[450] text-gray-500 tracking-normal mb-1.5">
            Annual Income
          </label>
          <div className="relative flex items-center">
            <IndianRupee className="absolute left-3.5 text-emerald-500 pointer-events-none" size={17} />
            <input
              type="text"
              maxLength={100}
              value={formData.income || ''}
              onChange={(e) => updateFormData({ income: e.target.value })}
              placeholder="e.g. ₹12 LPA, ₹80,000/month"
              className="wizard-input with-icon !pl-11 text-xs sm:text-sm font-[450]"
            />
          </div>
          <p className="text-[11px] text-gray-400 mt-1 font-normal">This will appear on your biodata template</p>
        </div>

        {/* Salary Range quick picks */}
        <div>
          <label className="block text-[11px] sm:text-xs font-[450] text-gray-500 tracking-normal mb-1.5">
            Quick Income Range
          </label>
          <div className="flex flex-wrap gap-2">
            {SALARY_RANGES.map((sal) => (
              <button
                key={sal}
                type="button"
                onClick={() => updateFormData({ salaryRange: sal, income: sal })}
                className={`pill-button text-xs py-1.5 px-3 font-[450] cursor-pointer ${
                  formData.salaryRange === sal ? 'selected' : ''
                }`}
              >
                <IndianRupee size={12} />
                <span>{sal}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
