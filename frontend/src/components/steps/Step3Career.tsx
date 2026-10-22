import React, { useState } from 'react';
import { Briefcase, Building, DollarSign, Globe, Sparkles, Laptop, Check, AlertCircle } from 'lucide-react';
import { useBiodata } from '../../context/BiodataContext';
import { validateOccupation, validateCompany } from '../../utils/nameValidation';

const BRAND = '#F01472';
const LABEL: React.CSSProperties = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' };

const EMPLOYMENT_TYPES = ['Full Time', 'Business', 'Government', 'Private', 'Self Employed'];
const WORK_MODES = ['Office', 'Remote', 'Hybrid'];
const SALARY_RANGES = ['Below 2L', '2-5 LPA', '5-10 LPA', '10-20 LPA', '20-50 LPA', '50L+ LPA'];

export const Step3Career: React.FC = () => {
  const { formData, updateFormData, openAiModal } = useBiodata();
  const [occError, setOccError] = useState<string | null>(() => {
    const check = validateOccupation(formData.occupation);
    return check.isValid ? null : check.error;
  });
  const [compError, setCompError] = useState<string | null>(() => {
    const check = validateCompany(formData.company);
    return check.isValid ? null : check.error;
  });

  const pillBtn = (active: boolean) => ({
    padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
    background: active ? BRAND : '#fff', color: active ? '#fff' : '#374151',
    border: active ? `1.5px solid ${BRAND}` : '1.5px solid #E5E7EB',
    display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.15s',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
        <Briefcase style={{ width: '18px', height: '18px', color: BRAND }} />
        <div>
          <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: 0 }}>Career & Business</h2>
          <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>Your occupation, company, income, and work preferences</p>
        </div>
      </div>

      {/* Basic job fields */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div>
          <label style={LABEL}><Briefcase style={{ width: '10px', display: 'inline', marginRight: '3px' }} />Occupation / Job Title *</label>
          <input
            type="text"
            value={formData.occupation}
            placeholder="e.g. Software Engineer"
            onChange={(e) => {
              const val = e.target.value;
              updateFormData({ occupation: val });
              const check = validateOccupation(val);
              setOccError(check.isValid ? null : check.error);
            }}
            className={`w-full px-3 py-2 text-sm glass-input ${occError ? '!border-red-500 !bg-red-50/20' : ''}`}
          />
          {occError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#DC2626', fontSize: '11px', fontWeight: 600, marginTop: '4px' }}>
              <AlertCircle size={12} />
              <span>{occError}</span>
            </div>
          )}
        </div>
        <div>
          <label style={LABEL}><Building style={{ width: '10px', display: 'inline', marginRight: '3px' }} />Company / Organisation</label>
          <input
            type="text"
            value={formData.company}
            placeholder="e.g. Infosys, Tata Motors"
            onChange={(e) => {
              const val = e.target.value;
              updateFormData({ company: val });
              const check = validateCompany(val);
              setCompError(check.isValid ? null : check.error);
            }}
            className={`w-full px-3 py-2 text-sm glass-input ${compError ? '!border-red-500 !bg-red-50/20' : ''}`}
          />
          {compError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#DC2626', fontSize: '11px', fontWeight: 600, marginTop: '4px' }}>
              <AlertCircle size={12} />
              <span>{compError}</span>
            </div>
          )}
        </div>
        <div>
          <label style={LABEL}>Designation / Role</label>
          <input type="text" value={formData.designation} placeholder="e.g. Senior Manager"
            onChange={e => updateFormData({ designation: e.target.value })} className="w-full px-3 py-2 text-sm glass-input" />
        </div>
        <div>
          <label style={LABEL}><Globe style={{ width: '10px', display: 'inline', marginRight: '3px' }} />Work / Office Address</label>
          <input type="text" value={formData.officeAddress} placeholder="e.g. Mumbai, Work from Home"
            onChange={e => updateFormData({ officeAddress: e.target.value })} className="w-full px-3 py-2 text-sm glass-input" />
        </div>
      </div>

      {/* Income */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px' }}>
        <label style={LABEL}><DollarSign style={{ width: '10px', display: 'inline', marginRight: '3px' }} />Annual Income Range *</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {SALARY_RANGES.map(r => (
            <button key={r} type="button" onClick={() => updateFormData({ salaryRange: r })} style={pillBtn(formData.salaryRange === r)}>
              {formData.salaryRange === r && <Check style={{ width: '12px', height: '12px', strokeWidth: 3 }} />}{r}
            </button>
          ))}
        </div>
      </div>

      {/* Employment Type */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px' }}>
        <label style={LABEL}>Employment Type</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {EMPLOYMENT_TYPES.map(t => (
            <button key={t} type="button" onClick={() => updateFormData({ employmentType: t as any })} style={pillBtn(formData.employmentType === t)}>
              {formData.employmentType === t && <Check style={{ width: '12px', strokeWidth: 3 }} />}{t}
            </button>
          ))}
        </div>
      </div>

      {/* Work Mode */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px' }}>
        <label style={LABEL}><Laptop style={{ width: '10px', display: 'inline', marginRight: '3px' }} />Work Mode</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {WORK_MODES.map(m => (
            <button key={m} type="button" onClick={() => updateFormData({ workMode: m as any })} style={{ ...pillBtn(formData.workMode === m), flex: 1, justifyContent: 'center' }}>
              {formData.workMode === m && <Check style={{ width: '12px', strokeWidth: 3 }} />}{m} Work
            </button>
          ))}
        </div>
      </div>

      {/* Professional Summary */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <label style={{ ...LABEL, marginBottom: 0 }}>Professional Summary / Bio</label>
          <button type="button" onClick={() => openAiModal('summary')}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', background: BRAND, color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
            <Sparkles style={{ width: '12px', height: '12px' }} /> ✨ AI Generate
          </button>
        </div>
        <textarea
          rows={4}
          maxLength={500}
          value={formData.professionalSummary}
          placeholder="Describe your professional background, achievements, and career goals..."
          onChange={e => updateFormData({ professionalSummary: e.target.value.slice(0, 500) })}
          className="w-full px-3 py-2 text-sm glass-input"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
          <p style={{ fontSize: '10px', color: (formData.professionalSummary || '').length >= 500 ? '#D97706' : '#9CA3AF' }}>
            {(formData.professionalSummary || '').length}/500 characters
          </p>
          {(formData.professionalSummary || '').length >= 500 && (
            <p style={{ fontSize: '10px', color: '#D97706', fontWeight: 600 }}>Maximum limit reached</p>
          )}
        </div>
      </div>

    </div>
  );
};
