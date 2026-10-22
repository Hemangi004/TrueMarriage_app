import React, { useState } from 'react';
import { User, Calendar, MapPin, Phone, Mail, ShieldCheck, Upload, FileText, Check, Plus, Heart } from 'lucide-react';
import { useBiodata } from '../../context/BiodataContext';
import { calculateAge, cmToFeetInches } from '../../utils/biodataHelpers';
import { cleanMobileNumber, validateMobileNumber, MOBILE_NUMBER_MAX_LENGTH } from '../../utils/phoneValidation';
import { POPULAR_LANGUAGES, normalizeLanguagesList, validateLanguageName } from '../../utils/nameValidation';

const BRAND = '#F01472';
const BRAND_LIGHT = '#FFF0F6';
const BRAND_BORDER = '#FBBDD8';
const CARD = { background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', marginBottom: '0' };
const LABEL = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' };
const HEIGHT_OPTIONS = Array.from({ length: 71 }, (_, i) => 140 + i);

export const Step1Personal: React.FC = () => {
  const { formData, updateFormData, openOtpModal } = useBiodata();
  const [customLanguage, setCustomLanguage] = useState('');
  const [langError, setLangError] = useState<string | null>(null);

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    updateFormData({ dob: v, age: calculateAge(v) });
  };

  const handleToggleLanguage = (lang: string) => {
    const cur = normalizeLanguagesList(formData.languagesKnown || []);
    const isSel = cur.some(l => l.toLowerCase() === lang.toLowerCase());
    const canonical = POPULAR_LANGUAGES.find(k => k.toLowerCase() === lang.toLowerCase()) || lang;
    updateFormData({
      languagesKnown: isSel
        ? cur.filter(l => l.toLowerCase() !== lang.toLowerCase())
        : [...cur, canonical]
    });
  };

  const handleSameAddressToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chk = e.target.checked;
    updateFormData({ sameAsCurrentAddress: chk, permanentAddress: chk ? formData.currentAddress : formData.permanentAddress });
  };

  const handleHoroscopeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) updateFormData({ horoscopeUrl: URL.createObjectURL(file) });
  };

  const btnStyle = (active: boolean) => ({
    padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
    background: active ? BRAND : '#fff', color: active ? '#fff' : '#374151',
    border: active ? `1.5px solid ${BRAND}` : '1.5px solid #E5E7EB',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Section heading */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
        <User style={{ width: '18px', height: '18px', color: BRAND }} />
        <div>
          <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: 0 }}>Personal Details</h2>
          <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>Your basic information for the biodata</p>
        </div>
      </div>

      {/* Grid row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label style={{ ...LABEL, marginBottom: 0 }}><User style={{ width: '11px', display: 'inline', marginRight: '4px' }} />Full Name *</label>
            <span style={{ fontSize: '10px', fontFamily: 'monospace', color: (formData.name || '').length >= 50 ? '#E11D48' : '#9CA3AF', fontWeight: (formData.name || '').length >= 50 ? 700 : 400 }}>
              {(formData.name || '').length}/50
            </span>
          </div>
          <input
            type="text"
            maxLength={50}
            value={formData.name || ''}
            onChange={e => {
              let v = e.target.value;
              if (v.length > 50) v = v.slice(0, 50);
              updateFormData({ name: v });
            }}
            placeholder="e.g. Aarav Sharma"
            className={`w-full px-3 py-2 text-sm glass-input ${
              formData.name && (!/^[a-zA-Z\s]+$/.test(formData.name.trim()) || formData.name.trim().length > 50)
                ? '!border-rose-400 !bg-rose-50/40 text-rose-900'
                : ''
            }`}
          />
          {formData.name && !/^[a-zA-Z\s]+$/.test(formData.name.trim()) && (
            <p style={{ color: '#E11D48', fontSize: '10px', fontWeight: 600, margin: '4px 0 0 2px' }}>
              Full Name can only have alphabetic characters and spaces.
            </p>
          )}
          {formData.name && formData.name.length >= 50 && (
            <p style={{ color: '#E11D48', fontSize: '10px', fontWeight: 600, margin: '4px 0 0 2px' }}>
              Maximum character limit reached (50 characters max).
            </p>
          )}
        </div>
        <div>
          <label style={LABEL}><Heart style={{ width: '11px', display: 'inline', marginRight: '4px' }} />Gender *</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['Male', 'Female', 'Other'] as const).map(g => (
              <button key={g} type="button" onClick={() => updateFormData({ gender: g })} style={btnStyle(formData.gender === g)}>{g}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div>
          <label style={{ ...LABEL, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span><Calendar style={{ width: '11px', display: 'inline', marginRight: '4px' }} />Date of Birth *</span>
            {formData.age > 0 && <span style={{ background: BRAND_LIGHT, color: BRAND, fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', border: `1px solid ${BRAND_BORDER}` }}>Age: {formData.age}</span>}
          </label>
          <input
            type="date"
            max={(() => {
              const now = new Date();
              const minLegalAge = formData.gender === 'Male' ? 21 : 18;
              return `${now.getFullYear() - minLegalAge}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
            })()}
            value={formData.dob}
            onChange={handleDobChange}
            className={`w-full px-3 py-2 text-sm glass-input ${
              formData.dob && (formData.age < (formData.gender === 'Male' ? 21 : 18) || calculateAge(formData.dob) <= 0)
                ? '!border-rose-400 !bg-rose-50/40 text-rose-900'
                : ''
            }`}
          />
          {formData.dob && (formData.age < (formData.gender === 'Male' ? 21 : 18) || calculateAge(formData.dob) <= 0) && (
            <p style={{ color: '#E11D48', fontSize: '10px', fontWeight: 600, margin: '4px 0 0 2px' }}>
              Minimum legal marriage age for {formData.gender === 'Male' ? 'males is 21' : 'females is 18'} years (current age: {formData.age || 0}).
            </p>
          )}
        </div>
        <div>
          <label style={LABEL}>Marital Status *</label>
          <select value={formData.maritalStatus} onChange={e => updateFormData({ maritalStatus: e.target.value as any })} className="w-full px-3 py-2 text-sm glass-input">
            <option>Never Married</option><option>Divorced</option><option>Widowed</option><option>Awaiting Divorce</option>
          </select>
        </div>
      </div>

      {/* Row 3: Physical Attributes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '14px' }}>
        <div>
          <label style={LABEL}>Height *</label>
          <select value={formData.heightCm || 165} onChange={e => updateFormData({ heightCm: parseInt(e.target.value) })} className="w-full px-3 py-2 text-sm glass-input">
            {HEIGHT_OPTIONS.map(h => (
              <option key={h} value={h}>{cmToFeetInches(h)} ({h} cm)</option>
            ))}
          </select>
        </div>
        <div>
          <label style={LABEL}>Weight (kg)</label>
          <input type="number" value={formData.weightKg || ''} placeholder="e.g. 72"
            onChange={e => updateFormData({ weightKg: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 text-sm glass-input" />
        </div>
        <div>
          <label style={LABEL}>Blood Group</label>
          <select value={formData.bloodGroup} onChange={e => updateFormData({ bloodGroup: e.target.value })} className="w-full px-3 py-2 text-sm glass-input">
            <option value="">Select</option>
            {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bg => <option key={bg}>{bg}</option>)}
          </select>
        </div>
        <div>
          <label style={LABEL}>Complexion</label>
          <select value={formData.complexion} onChange={e => updateFormData({ complexion: e.target.value })} className="w-full px-3 py-2 text-sm glass-input">
            <option>Fair</option><option>Very Fair</option><option>Wheatish</option><option>Dusky</option>
          </select>
        </div>
      </div>

      {/* Row 4 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
        <div>
          <label style={LABEL}>Religion *</label>
          <select value={formData.religion} onChange={e => updateFormData({ religion: e.target.value })} className="w-full px-3 py-2 text-sm glass-input">
            <option>Hindu</option><option>Muslim</option><option>Sikh</option><option>Christian</option><option>Jain</option><option>Buddhist</option><option>Other</option>
          </select>
        </div>
        <div>
          <label style={LABEL}>Caste</label>
          <input
            type="text"
            value={formData.caste || ''}
            placeholder="e.g. Brahmin"
            onChange={(e) => {
              const val = e.target.value;
              updateFormData({ caste: val });
            }}
            className={`w-full px-3 py-2 text-sm glass-input ${
              formData.caste && (/\d/.test(formData.caste) || !/^[A-Za-z\u0900-\u0D7F\s\-\'\/\(\)\.\,]+$/.test(formData.caste))
                ? '!border-red-500 !bg-red-50/20'
                : ''
            }`}
          />
          {formData.caste && (/\d/.test(formData.caste) || !/^[A-Za-z\u0900-\u0D7F\s\-\'\/\(\)\.\,]+$/.test(formData.caste)) && (
            <p className="text-red-500 text-[10px] mt-1 font-semibold">Caste should contain letters only</p>
          )}
        </div>
        <div>
          <label style={LABEL}>Manglik</label>
          <select value={formData.manglik} onChange={e => updateFormData({ manglik: e.target.value as any })} className="w-full px-3 py-2 text-sm glass-input">
            <option value="No">No</option><option value="Yes">Yes</option><option value="Anshik">Anshik</option><option value="Don't Know">Don't Know</option>
          </select>
        </div>
      </div>

      {/* Languages */}
      <div style={CARD}>
        <label style={LABEL}>Languages Known</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
          {POPULAR_LANGUAGES.map(lang => {
            const sel = (formData.languagesKnown || []).some(l => l.toLowerCase() === lang.toLowerCase());
            return (
              <button key={lang} type="button" onClick={() => handleToggleLanguage(lang)}
                style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                  background: sel ? BRAND : BRAND_LIGHT, color: sel ? '#fff' : BRAND,
                  border: `1px solid ${sel ? BRAND : BRAND_BORDER}`,
                  display: 'flex', alignItems: 'center', gap: '4px' }}>
                {sel && <Check style={{ width: '10px', height: '10px', strokeWidth: 3 }} />}{lang}
              </button>
            );
          })}
        </div>
        <form onSubmit={e => {
          e.preventDefault();
          const trimmed = customLanguage.trim();
          if (!trimmed) {
            setLangError('Please enter a language name.');
            return;
          }
          const check = validateLanguageName(trimmed);
          if (!check.isValid) {
            setLangError(check.error || 'Please enter a valid language name. Numbers and special characters are not allowed.');
            return;
          }
          const cur = normalizeLanguagesList(formData.languagesKnown || []);
          const existing = cur.find(l => l.toLowerCase() === trimmed.toLowerCase());
          if (existing) {
            setLangError(`"${existing}" is already selected.`);
            return;
          }
          handleToggleLanguage(trimmed);
          setCustomLanguage('');
          setLangError(null);
        }} style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '320px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <input
              type="text"
              maxLength={50}
              placeholder="Add language..."
              value={customLanguage}
              onKeyDown={(e) => {
                if (/\d/.test(e.key)) {
                  e.preventDefault();
                  setLangError('Please enter a valid language name. Numbers and special characters are not allowed.');
                }
              }}
              onChange={e => {
                const val = e.target.value;
                if (val.length > 50) {
                  setCustomLanguage(val.slice(0, 50));
                  setLangError('Language name cannot exceed 50 characters.');
                  return;
                }
                if (val.trim()) {
                  const check = validateLanguageName(val.trim());
                  if (!check.isValid) {
                    setLangError(check.error || 'Please enter a valid language name. Numbers and special characters are not allowed.');
                  } else if (langError) {
                    setLangError(null);
                  }
                } else if (langError) {
                  setLangError(null);
                }
                setCustomLanguage(val);
              }}
              className="flex-1 px-3 py-1.5 text-xs glass-input"
              style={{ borderRadius: '6px' }}
            />
            <button type="submit" style={{ padding: '6px 12px', background: BRAND, color: '#fff', borderRadius: '6px', fontWeight: 700, fontSize: '11px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Plus style={{ width: '10px', height: '10px' }} />Add
            </button>
          </div>
          {langError && <p className="text-red-500 text-[10px] font-semibold">{langError}</p>}
        </form>
      </div>

      {/* Addresses */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div>
          <label style={LABEL}><MapPin style={{ width: '11px', display: 'inline', marginRight: '4px' }} />Current Address *</label>
          <textarea rows={3} value={formData.currentAddress} placeholder="Street, City, State, Pincode"
            onChange={e => { const v = e.target.value; updateFormData({ currentAddress: v, permanentAddress: formData.sameAsCurrentAddress ? v : formData.permanentAddress }); }}
            className="w-full px-3 py-2 text-sm glass-input" />
        </div>
        <div>
          <label style={{ ...LABEL, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span><MapPin style={{ width: '11px', display: 'inline', marginRight: '4px' }} />Permanent Address</span>
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '10px', color: BRAND, fontWeight: 600, textTransform: 'none', letterSpacing: 'normal' }}>
              <input type="checkbox" checked={formData.sameAsCurrentAddress} onChange={handleSameAddressToggle} style={{ accentColor: BRAND }} />Same as Current
            </label>
          </label>
          <textarea rows={3} disabled={formData.sameAsCurrentAddress} value={formData.permanentAddress} onChange={e => updateFormData({ permanentAddress: e.target.value })}
            placeholder="Permanent address" className="w-full px-3 py-2 text-sm glass-input" style={{ opacity: formData.sameAsCurrentAddress ? 0.5 : 1 }} />
        </div>
      </div>

      {/* Contact & Email */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div style={CARD}>
          <label style={{ ...LABEL, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span><Phone style={{ width: '11px', display: 'inline', marginRight: '4px' }} />Contact *</span>
            {formData.contactVerified && <span style={{ fontSize: '10px', fontWeight: 700, color: '#059669', background: '#D1FAE5', padding: '2px 6px', borderRadius: '4px', border: '1px solid #6EE7B7', display: 'flex', alignItems: 'center', gap: '3px' }}><ShieldCheck style={{ width: '10px' }} />Verified</span>}
          </label>
          <div style={{ display: 'flex', gap: '6px' }}>
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={MOBILE_NUMBER_MAX_LENGTH}
              value={formData.contactNumber}
              placeholder="9876543210"
              onKeyDown={e => {
                const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End', 'Enter'];
                if (!allowed.includes(e.key) && !/[0-9]/.test(e.key) && !e.ctrlKey && !e.metaKey) {
                  e.preventDefault();
                }
              }}
              onChange={e => updateFormData({ contactNumber: cleanMobileNumber(e.target.value), contactVerified: false })}
              className="flex-1 px-3 py-2 text-sm glass-input"
            />
            {!formData.contactVerified && (
              <button
                type="button"
                onClick={() => {
                  const check = validateMobileNumber(formData.contactNumber);
                  if (check.isValid) {
                    openOtpModal('phone', formData.contactNumber);
                  } else {
                    alert(check.error);
                  }
                }}
                style={{ padding: '6px 10px', background: '#059669', color: '#fff', borderRadius: '6px', fontSize: '11px', fontWeight: 700, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                Verify
              </button>
            )}
          </div>
        </div>
        <div style={CARD}>
          <label style={{ ...LABEL, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span><Mail style={{ width: '11px', display: 'inline', marginRight: '4px' }} />Email *</span>
            {formData.emailVerified && <span style={{ fontSize: '10px', fontWeight: 700, color: '#059669', background: '#D1FAE5', padding: '2px 6px', borderRadius: '4px', border: '1px solid #6EE7B7', display: 'flex', alignItems: 'center', gap: '3px' }}><ShieldCheck style={{ width: '10px' }} />Verified</span>}
          </label>
          <div style={{ display: 'flex', gap: '6px' }}>
            <input type="email" value={formData.email} placeholder="aarav@example.com"
              onChange={e => updateFormData({ email: e.target.value, emailVerified: false })} className="flex-1 px-3 py-2 text-sm glass-input" />
            {!formData.emailVerified && (
              <button type="button" onClick={() => openOtpModal('email', formData.email)}
                style={{ padding: '6px 10px', background: BRAND, color: '#fff', borderRadius: '6px', fontSize: '11px', fontWeight: 700, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Verify
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Horoscope */}
      <div>
        <label style={LABEL}><FileText style={{ width: '11px', display: 'inline', marginRight: '4px' }} />Horoscope / Kundli</label>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '6px', border: `1.5px dashed ${BRAND_BORDER}`, background: BRAND_LIGHT, color: BRAND, fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
          <Upload style={{ width: '13px' }} />{formData.horoscopeUrl ? 'Change Horoscope' : 'Upload Kundli'}
          <input type="file" accept="image/*,.pdf" onChange={handleHoroscopeFile} style={{ display: 'none' }} />
        </label>
      </div>

    </div>
  );
};
