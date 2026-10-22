import React from 'react';
import { Users, User, Briefcase, Home, Heart } from 'lucide-react';
import { useBiodata } from '../../context/BiodataContext';
import { CityAutocomplete } from '../common/CityAutocomplete';

const BRAND = '#F01472';
const LABEL: React.CSSProperties = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' };

export const Step4Family: React.FC = () => {
  const { formData, updateFormData } = useBiodata();

  const pillBtn = (active: boolean) => ({
    padding: '7px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
    background: active ? BRAND : '#fff', color: active ? '#fff' : '#374151',
    border: active ? `1.5px solid ${BRAND}` : '1.5px solid #E5E7EB', transition: 'all 0.15s',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
        <Users style={{ width: '18px', height: '18px', color: BRAND }} />
        <div>
          <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: 0 }}>Family Background</h2>
          <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>Share information about your parents, siblings, and family values</p>
        </div>
      </div>

      {/* Family Type & Values */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '14px' }}>
          <label style={LABEL}><Home style={{ width: '10px', display: 'inline', marginRight: '3px' }} />Family Type</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {(['Nuclear', 'Joint'] as const).map(ft => (
              <button key={ft} type="button" onClick={() => updateFormData({ familyType: ft })} style={pillBtn(formData.familyType === ft)}>{ft}</button>
            ))}
          </div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '14px' }}>
          <label style={LABEL}><Heart style={{ width: '10px', display: 'inline', marginRight: '3px' }} />Family Values</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {(['Traditional', 'Modern', 'Liberal', 'Balanced'] as const).map(fv => (
              <button key={fv} type="button" onClick={() => updateFormData({ familyValues: fv })} style={pillBtn(formData.familyValues === fv)}>{fv}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Father */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#374151', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <User style={{ width: '13px', color: BRAND }} /> Father's Details
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={LABEL}>Father's Name</label>
            <input type="text" value={formData.fatherName} placeholder="e.g. Rajesh Sharma"
              onChange={e => updateFormData({ fatherName: e.target.value })} className="w-full px-3 py-2 text-sm glass-input" />
          </div>
          <div>
            <label style={LABEL}><Briefcase style={{ width: '10px', display: 'inline', marginRight: '3px' }} />Occupation</label>
            <input type="text" value={formData.fatherOccupation} placeholder="e.g. Retired IAS Officer"
              onChange={e => updateFormData({ fatherOccupation: e.target.value })} className="w-full px-3 py-2 text-sm glass-input" />
          </div>
        </div>
      </div>

      {/* Mother */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#374151', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <User style={{ width: '13px', color: '#A855F7' }} /> Mother's Details
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={LABEL}>Mother's Name</label>
            <input type="text" value={formData.motherName} placeholder="e.g. Sunita Sharma"
              onChange={e => updateFormData({ motherName: e.target.value })} className="w-full px-3 py-2 text-sm glass-input" />
          </div>
          <div>
            <label style={LABEL}>Occupation</label>
            <input type="text" value={formData.motherOccupation} placeholder="e.g. Homemaker / Teacher"
              onChange={e => updateFormData({ motherOccupation: e.target.value })} className="w-full px-3 py-2 text-sm glass-input" />
          </div>
        </div>
      </div>

      {/* Siblings */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#374151', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Users style={{ width: '13px', color: BRAND }} /> Siblings
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={LABEL}>Brothers</label>
            <select value={formData.brotherCount} onChange={e => updateFormData({ brotherCount: parseInt(e.target.value) })} className="w-full px-3 py-2 text-sm glass-input">
              {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n} Brother{n !== 1 ? 's' : ''}</option>)}
            </select>
          </div>
          <div>
            <label style={LABEL}>Sisters</label>
            <select value={formData.sisterCount} onChange={e => updateFormData({ sisterCount: parseInt(e.target.value) })} className="w-full px-3 py-2 text-sm glass-input">
              {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n} Sister{n !== 1 ? 's' : ''}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Family Details */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px' }}>
        <label style={LABEL}>Family Location / Native Place</label>
        <CityAutocomplete
          value={formData.nativePlace || ''}
          onChange={(val) => updateFormData({ nativePlace: val })}
          placeholder="Search native city (e.g. Pune, Maharashtra)..."
        />
        <label style={{ ...LABEL, marginTop: '12px' }}>About Family / Family Background</label>
        <textarea rows={3} value={formData.familyBackground} placeholder="Describe your family background, traditions, values..."
          onChange={e => updateFormData({ familyBackground: e.target.value })} className="w-full px-3 py-2 text-sm glass-input" />
      </div>

    </div>
  );
};
