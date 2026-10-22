import React, { useState } from 'react';
import { GraduationCap, Plus, Trash2, Award, Building2, Calendar, FileCheck, AlertCircle } from 'lucide-react';
import { useBiodata } from '../../context/BiodataContext';
import type { EducationItem } from '../../types/biodata';
import { validateDegreeName, validateCollegeName } from '../../utils/nameValidation';

const BRAND = '#F01472';
const BRAND_LIGHT = '#FFF0F6';
const BRAND_BORDER = '#FBBDD8';
const LABEL: React.CSSProperties = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' };
const QUALIFICATIONS = ['High School', 'Diploma', 'Bachelors Degree', 'Masters Degree', 'MBA', 'PhD', 'Other'];
const PASSING_YEARS = Array.from({ length: 30 }, (_, i) => String(new Date().getFullYear() - i));

export const Step2Education: React.FC = () => {
  const { formData, updateFormData } = useBiodata();
  const [error, setError] = useState<string | null>(null);
  const educationList: EducationItem[] = formData.educationList || [];

  const handleAdd = () => {
    const hasEmpty = educationList.some(e => !e.degree.trim() && !e.qualification.trim());
    if (hasEmpty) {
      setError('Please fill in the existing qualification before adding another.');
      return;
    }
    setError(null);
    updateFormData({
      educationList: [...educationList, {
        id: `edu-${Date.now()}`, degree: '', college: '', university: '',
        passingYear: new Date().getFullYear().toString(), qualification: 'Bachelors Degree', certifications: '',
      }],
    });
  };

  const handleRemove = (id: string) => {
    setError(null);
    updateFormData({ educationList: educationList.filter(e => e.id !== id) });
  };

  const handleUpdate = (id: string, fields: Partial<EducationItem>) => {
    if (fields.degree !== undefined) {
      const trimmed = fields.degree.trim();
      if (trimmed) {
        const degCheck = validateDegreeName(trimmed);
        if (!degCheck.isValid) {
          setError(degCheck.error);
          return;
        }
        const isDuplicate = educationList.some(
          e => e.id !== id && (e.degree || e.qualification || '').trim().toLowerCase() === trimmed.toLowerCase()
        );
        if (isDuplicate) {
          setError('This qualification has already been added.');
          return;
        }
      }
      setError(null);
    }
    if (fields.college !== undefined) {
      const colCheck = validateCollegeName(fields.college);
      if (!colCheck.isValid) {
        setError(colCheck.error);
        return;
      }
      setError(null);
    }
    updateFormData({ educationList: educationList.map(e => e.id === id ? { ...e, ...fields } : e) });
  };

  const handleCertUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpdate(id, { certificateUrl: URL.createObjectURL(file) });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
        <GraduationCap style={{ width: '18px', height: '18px', color: BRAND }} />
        <div>
          <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: 0 }}>Education Details</h2>
          <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>Add your degrees, colleges, and certifications</p>
        </div>
        <button type="button" onClick={handleAdd} style={{
          marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px',
          padding: '7px 14px', background: BRAND, color: '#fff', border: 'none',
          borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
        }}>
          <Plus style={{ width: '13px', height: '13px' }} /> Add Degree
        </button>
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: '8px', color: '#BE123C', fontSize: '12px', fontWeight: 600 }}>
          <AlertCircle style={{ width: '15px', height: '15px', flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Education Cards */}
      {educationList.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', background: BRAND_LIGHT, borderRadius: '8px', border: `1px dashed ${BRAND_BORDER}` }}>
          <GraduationCap style={{ width: '32px', height: '32px', color: BRAND_BORDER, margin: '0 auto 8px' }} />
          <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0 }}>No education added yet. Click "Add Degree" to start.</p>
        </div>
      )}

      {educationList.map((edu, idx) => (
        <div key={edu.id} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: BRAND, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award style={{ width: '13px', height: '13px' }} /> Education #{idx + 1}
            </span>
            <button type="button" onClick={() => handleRemove(edu.id)}
              style={{ background: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Trash2 style={{ width: '11px' }} /> Remove
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={LABEL}><Award style={{ width: '10px', display: 'inline', marginRight: '3px' }} />Qualification</label>
              <select value={edu.qualification} onChange={e => handleUpdate(edu.id, { qualification: e.target.value })} className="w-full px-3 py-2 text-sm glass-input">
                {QUALIFICATIONS.map(q => <option key={q}>{q}</option>)}
              </select>
            </div>
            <div>
              <label style={LABEL}>Degree / Course</label>
              <input type="text" value={edu.degree} placeholder="e.g. B.Tech Computer Science"
                onChange={e => handleUpdate(edu.id, { degree: e.target.value })} className="w-full px-3 py-2 text-sm glass-input" />
            </div>
            <div>
              <label style={LABEL}><Building2 style={{ width: '10px', display: 'inline', marginRight: '3px' }} />College / Institute</label>
              <input type="text" value={edu.college} placeholder="e.g. IIT Bombay"
                onChange={e => handleUpdate(edu.id, { college: e.target.value })} className="w-full px-3 py-2 text-sm glass-input" />
            </div>
            <div>
              <label style={LABEL}>University / Board</label>
              <input type="text" value={edu.university} placeholder="e.g. Mumbai University"
                onChange={e => handleUpdate(edu.id, { university: e.target.value })} className="w-full px-3 py-2 text-sm glass-input" />
            </div>
            <div>
              <label style={LABEL}><Calendar style={{ width: '10px', display: 'inline', marginRight: '3px' }} />Passing Year</label>
              <select value={edu.passingYear} onChange={e => handleUpdate(edu.id, { passingYear: e.target.value })} className="w-full px-3 py-2 text-sm glass-input">
                {PASSING_YEARS.map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label style={LABEL}><FileCheck style={{ width: '10px', display: 'inline', marginRight: '3px' }} />Certificate Upload</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', background: BRAND_LIGHT, border: `1.5px dashed ${BRAND_BORDER}`, borderRadius: '6px', cursor: 'pointer', fontSize: '11px', color: BRAND, fontWeight: 600 }}>
                {edu.certificateUrl ? '✓ Uploaded' : '+ Upload Certificate'}
                <input type="file" accept="image/*,.pdf" onChange={e => handleCertUpload(edu.id, e)} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          <div style={{ marginTop: '12px' }}>
            <label style={LABEL}>Additional Certifications</label>
            <input type="text" value={edu.certifications} placeholder="e.g. AWS Certified, PMP, IELTS 7.5"
              onChange={e => handleUpdate(edu.id, { certifications: e.target.value })} className="w-full px-3 py-2 text-sm glass-input" />
          </div>
        </div>
      ))}

    </div>
  );
};
