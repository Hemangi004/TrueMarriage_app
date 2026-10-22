import React from 'react';
import { Target, Heart, MapPin, User, Check, Sparkles } from 'lucide-react';
import { useBiodata } from '../../context/BiodataContext';

const BRAND = '#F01472';
const LABEL: React.CSSProperties = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' };

const AGE_MIN = Array.from({ length: 53 }, (_, i) => i + 18);
const AGE_MAX = Array.from({ length: 53 }, (_, i) => i + 18);
const RELIGIONS = ['No Preference', 'Hindu', 'Muslim', 'Sikh', 'Christian', 'Jain', 'Buddhist', 'Any'];
const QUALIFICATIONS = ['No Preference', 'High School', 'Diploma', 'Graduate', 'Post Graduate', 'PhD'];
const LOCATIONS = ['Same City', 'Same State', 'Any State', 'NRI Also OK', 'Abroad Only'];

export const Step6Expectations: React.FC = () => {
  const { formData, updateFormData, openAiModal } = useBiodata();

  const pillBtn = (active: boolean) => ({
    padding: '7px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
    background: active ? BRAND : '#fff', color: active ? '#fff' : '#374151',
    border: active ? `1.5px solid ${BRAND}` : '1.5px solid #E5E7EB',
    display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.15s',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
        <Target style={{ width: '18px', height: '18px', color: BRAND }} />
        <div>
          <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: 0 }}>Partner Expectations</h2>
          <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>Describe your ideal life partner preferences</p>
        </div>
      </div>

      {/* Age Range */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px' }}>
        <label style={LABEL}><User style={{ width: '10px', display: 'inline', marginRight: '3px' }} />Preferred Age Range</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            value={formData.expectedAgeMin || 22}
            onChange={e => {
              const newMin = parseInt(e.target.value, 10);
              const updates: any = { expectedAgeMin: newMin };
              if (!formData.expectedAgeMax || formData.expectedAgeMax <= newMin) {
                updates.expectedAgeMax = Math.min(70, newMin + 1);
              }
              updateFormData(updates);
            }}
            className="px-3 py-2 text-sm glass-input"
            style={{ width: '120px' }}
          >
            {AGE_MIN.map(a => <option key={a} value={a}>{a} yrs</option>)}
          </select>
          <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 600 }}>to</span>
          <select
            value={formData.expectedAgeMax || 35}
            onChange={e => {
              const newMax = parseInt(e.target.value, 10);
              const updates: any = { expectedAgeMax: newMax };
              if (!formData.expectedAgeMin || formData.expectedAgeMin >= newMax) {
                updates.expectedAgeMin = Math.max(18, newMax - 1);
              }
              updateFormData(updates);
            }}
            className="px-3 py-2 text-sm glass-input"
            style={{ width: '120px' }}
          >
            {AGE_MAX.filter(a => a > (formData.expectedAgeMin || 18)).map(a => <option key={a} value={a}>{a} yrs</option>)}
          </select>
        </div>
      </div>

      {/* Religion */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px' }}>
        <label style={LABEL}><Heart style={{ width: '10px', display: 'inline', marginRight: '3px' }} />Religion Preference</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {RELIGIONS.map(r => (
            <button key={r} type="button" onClick={() => updateFormData({ expectedReligion: r })} style={pillBtn(formData.expectedReligion === r)}>
              {formData.expectedReligion === r && <Check style={{ width: '11px', strokeWidth: 3 }} />}{r}
            </button>
          ))}
        </div>
      </div>

      {/* Education & Profession */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px' }}>
          <label style={LABEL}>Min Qualification</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {QUALIFICATIONS.map(q => (
              <button key={q} type="button" onClick={() => updateFormData({ expectedEducation: q })}
                style={{ ...pillBtn(formData.expectedEducation === q), justifyContent: 'flex-start' }}>
                {formData.expectedEducation === q && <Check style={{ width: '11px', strokeWidth: 3 }} />}{q}
              </button>
            ))}
          </div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px' }}>
          <label style={LABEL}>Expected Profession</label>
          <input type="text" value={formData.expectedProfession} placeholder="e.g. IT Professional, Doctor, Any"
            onChange={e => updateFormData({ expectedProfession: e.target.value })} className="w-full px-3 py-2 text-sm glass-input" />
        </div>
      </div>

      {/* Location Preference */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px' }}>
        <label style={LABEL}><MapPin style={{ width: '10px', display: 'inline', marginRight: '3px' }} />Location Preference</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {LOCATIONS.map(l => (
            <button key={l} type="button" onClick={() => updateFormData({ expectedLocation: l })} style={pillBtn(formData.expectedLocation === l)}>
              {formData.expectedLocation === l && <Check style={{ width: '11px', strokeWidth: 3 }} />}{l}
            </button>
          ))}
        </div>
      </div>

      {/* Partner Description */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <label style={{ ...LABEL, marginBottom: 0 }}>About the Partner You Seek</label>
          <button type="button" onClick={() => openAiModal('expectations')}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', background: BRAND, color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
            <Sparkles style={{ width: '12px' }} /> ✨ AI Write
          </button>
        </div>
        <textarea
          rows={4}
          maxLength={500}
          value={formData.otherPreferences}
          placeholder="Describe the qualities, values, and attributes you seek in a life partner..."
          onChange={e => updateFormData({ otherPreferences: e.target.value.slice(0, 500) })}
          className="w-full px-3 py-2 text-sm glass-input"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
          <p style={{ fontSize: '10px', color: (formData.otherPreferences || '').length >= 500 ? '#D97706' : '#9CA3AF' }}>
            {(formData.otherPreferences || '').length}/500 characters
          </p>
          {(formData.otherPreferences || '').length >= 500 && (
            <p style={{ fontSize: '10px', color: '#D97706', fontWeight: 600 }}>Maximum limit reached</p>
          )}
        </div>
      </div>

    </div>
  );
};
