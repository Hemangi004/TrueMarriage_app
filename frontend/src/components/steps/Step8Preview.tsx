import React, { useState, useRef, useEffect } from 'react';
import {
  Eye, Download,
  Sparkles, Loader2, Share2, Palette, RotateCcw
} from 'lucide-react';
import { useBiodata } from '../../context/BiodataContext';
import { generateOllamaSummaryApi } from '../../services/apiService';
import { cmToFeetInches } from '../../utils/biodataHelpers';
import { PdfGeneratorModal } from '../summary/PdfGeneratorModal';
import { BiodataShareModal } from '../modals/BiodataShareModal';

const BRAND = '#F01472';
const BRAND_LIGHT = '#FFF0F6';
const BRAND_BORDER = '#FBBDD8';

/* ── Templates ─────────────────────────────────────────────── */
const TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    desc: 'Traditional Indian style with decorative border',
    preview: '🏛️',
    accent: '#8B1A4A',
    bg: '#FFFBF0',
  },
  {
    id: 'modern',
    name: 'Modern',
    desc: 'Clean, contemporary with pink accents',
    preview: '✨',
    accent: '#F01472',
    bg: '#FFFFFF',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    desc: 'Professional black & white, print-ready',
    preview: '📄',
    accent: '#111827',
    bg: '#FFFFFF',
  },
] as const;

type TemplateId = (typeof TEMPLATES)[number]['id'];

/* ── Helper Row for preview ──────────────────────────────────*/
const Row: React.FC<{ label: string; value?: string | number; accent?: string }> = ({ label, value, accent = '#111827' }) =>
  value ? (
    <div style={{ display: 'flex', borderBottom: '1px solid #F3F4F6', padding: '5px 0', gap: '8px' }}>
      <span style={{ width: '130px', fontSize: '11px', color: '#6B7280', fontWeight: 600, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: '12px', color: accent, fontWeight: 500 }}>{value}</span>
    </div>
  ) : null;

/* ── Classic Template ────────────────────────────────────────*/
const ClassicTemplate: React.FC<{ formData: any; aiSummary: string }> = ({ formData, aiSummary }) => (
  <div style={{ background: '#FFFBF0', border: '3px double #8B1A4A', borderRadius: '4px', padding: '28px', fontFamily: 'Georgia, serif', maxWidth: '700px', margin: '0 auto' }}>
    {/* Decorative top */}
    <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #8B1A4A', paddingBottom: '16px' }}>
      <div style={{ fontSize: '11px', letterSpacing: '0.1em', color: '#8B1A4A', marginBottom: '6px' }}>
        ॐ || श्री गणेशाय नमः ||
      </div>
      <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#8B1A4A', margin: '4px 0' }}>Matrimonial Biodata</h1>
      <div style={{ fontSize: '13px', color: '#B45309' }}>
        {formData.name || '—'} · {formData.religion || 'Hindu'} · {formData.caste || '—'}
      </div>
    </div>
    {/* Photo + Summary row */}
    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
      <div style={{ width: '90px', aspectRatio: '4/5', border: '2px solid #8B1A4A', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
        {formData.profilePictureUrl
          ? <img src={formData.profilePictureUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>👤</div>
        }
      </div>
      {aiSummary && (
        <div style={{ flex: 1, background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '4px', padding: '12px', fontSize: '12px', color: '#78350F', lineHeight: '1.7', fontStyle: 'italic' }}>
          {aiSummary}
        </div>
      )}
    </div>
    {/* Sections in 2 cols */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
      <div>
        <div style={{ fontWeight: 800, fontSize: '12px', color: '#8B1A4A', borderBottom: '1px solid #8B1A4A', paddingBottom: '4px', marginBottom: '8px' }}>Personal Details</div>
        <Row label="Full Name" value={formData.name} accent="#4B1C1C" />
        <Row label="DOB / Age" value={formData.dob ? `${formData.dob} (${formData.age} yrs)` : ''} accent="#4B1C1C" />
        <Row label="Height" value={formData.heightCm ? cmToFeetInches(formData.heightCm) : ''} accent="#4B1C1C" />
        <Row label="Complexion" value={formData.complexion} accent="#4B1C1C" />
        <Row label="Religion" value={formData.religion} accent="#4B1C1C" />
        <Row label="Caste / Gotra" value={[formData.caste, formData.gotra].filter(Boolean).join(' / ')} accent="#4B1C1C" />
        <Row label="Manglik" value={formData.manglik} accent="#4B1C1C" />
        <Row label="Marital Status" value={formData.maritalStatus} accent="#4B1C1C" />
        <Row label="Languages" value={(formData.languagesKnown || []).join(', ')} accent="#4B1C1C" />
      </div>
      <div>
        <div style={{ fontWeight: 800, fontSize: '12px', color: '#8B1A4A', borderBottom: '1px solid #8B1A4A', paddingBottom: '4px', marginBottom: '8px' }}>Career Details</div>
        <Row label="Occupation" value={formData.occupation} accent="#4B1C1C" />
        <Row label="Designation" value={formData.designation} accent="#4B1C1C" />
        <Row label="Company" value={formData.company} accent="#4B1C1C" />
        <Row label="Income" value={formData.salaryRange} accent="#4B1C1C" />
        <div style={{ fontWeight: 800, fontSize: '12px', color: '#8B1A4A', borderBottom: '1px solid #8B1A4A', paddingBottom: '4px', marginBottom: '8px', marginTop: '14px' }}>Education Details</div>
        {(formData.educationList || []).map((e: any) => {
          const details = [e.college || e.university, e.passingYear].map(s => (s || '').replace(/^\(\s*\)$/, '').trim()).filter(Boolean).join(' · ');
          return (
            <div key={e.id} style={{ fontSize: '11px', color: '#4B1C1C', marginBottom: '4px' }}>
              <strong>{e.degree || e.qualification}</strong>
              {details && <><br />{details}</>}
            </div>
          );
        })}
      </div>
    </div>
    {/* Family */}
    <div style={{ marginTop: '16px', borderTop: '1px solid #DCA35A', paddingTop: '12px' }}>
      <div style={{ fontWeight: 800, fontSize: '12px', color: '#8B1A4A', marginBottom: '8px' }}>Family Background</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <Row label="Father" value={[formData.fatherName, formData.fatherOccupation].filter(Boolean).join(', ')} accent="#4B1C1C" />
        <Row label="Mother" value={[formData.motherName, formData.motherOccupation].filter(Boolean).join(', ')} accent="#4B1C1C" />
        <Row label="Family Type" value={formData.familyType} accent="#4B1C1C" />
        <Row label="Native Place" value={formData.nativePlace} accent="#4B1C1C" />
      </div>
      {formData.familyBackground && <p style={{ fontSize: '11px', color: '#4B1C1C', marginTop: '8px', fontStyle: 'italic' }}>{formData.familyBackground}</p>}
    </div>
    {/* Expectations */}
    <div style={{ marginTop: '16px', borderTop: '1px solid #DCA35A', paddingTop: '12px' }}>
      <div style={{ fontWeight: 800, fontSize: '12px', color: '#8B1A4A', marginBottom: '8px' }}>Partner Expectations</div>
      <p style={{ fontSize: '11px', color: '#4B1C1C', lineHeight: '1.7', margin: 0 }}>{formData.otherPreferences || 'Looking for a compatible, educated, and family-oriented partner.'}</p>
    </div>
    {/* Contact */}
    <div style={{ marginTop: '16px', borderTop: '2px solid #8B1A4A', paddingTop: '10px', textAlign: 'center', fontSize: '11px', color: '#8B1A4A' }}>
      📞 {formData.contactTo || formData.contactNumber || '—'} &nbsp;|&nbsp; ✉️ {formData.email || '—'}
    </div>
  </div>
);

/* ── Modern Template ─────────────────────────────────────────*/
const ModernTemplate: React.FC<{ formData: any; aiSummary: string }> = ({ formData, aiSummary }) => (
  <div style={{ background: '#fff', maxWidth: '700px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
    {/* Pink header strip */}
    <div style={{ background: BRAND, padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.5)', overflow: 'hidden', flexShrink: 0 }}>
        {formData.profilePictureUrl
          ? <img src={formData.profilePictureUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', background: BRAND_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>👤</div>
        }
      </div>
      <div>
        <h1 style={{ color: '#fff', fontSize: '20px', fontWeight: 900, margin: '0 0 4px' }}>{formData.name || '—'}</h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px', margin: 0 }}>
          {[formData.age && `${formData.age} yrs`, formData.occupation, formData.religion].filter(Boolean).join(' · ')}
        </p>
        {formData.currentAddress && <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', margin: '4px 0 0' }}>📍 {formData.currentAddress}</p>}
      </div>
    </div>
    <div style={{ padding: '20px' }}>
      {/* AI summary */}
      {aiSummary && (
        <div style={{ background: BRAND_LIGHT, border: `1px solid ${BRAND_BORDER}`, borderRadius: '8px', padding: '14px', marginBottom: '16px', fontSize: '12px', color: '#4B1C1C', lineHeight: '1.7' }}>
          <span style={{ fontWeight: 800, color: BRAND, marginRight: '6px' }}>✨ About Me:</span>{aiSummary}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        {/* Personal */}
        <Section2 title="Personal Details" accent={BRAND}>
          <Row label="Gender" value={formData.gender} accent="#374151" />
          <Row label="Date of Birth" value={formData.dob} accent="#374151" />
          <Row label="Height" value={formData.heightCm ? cmToFeetInches(formData.heightCm) : ''} accent="#374151" />
          <Row label="Blood Group" value={formData.bloodGroup} accent="#374151" />
          <Row label="Complexion" value={formData.complexion} accent="#374151" />
          <Row label="Religion / Caste" value={[formData.religion, formData.caste].filter(Boolean).join(' / ')} accent="#374151" />
          <Row label="Manglik" value={formData.manglik} accent="#374151" />
          <Row label="Languages" value={(formData.languagesKnown || []).join(', ')} accent="#374151" />
        </Section2>
        {/* Career + Education */}
        <div>
          <Section2 title="Career" accent={BRAND}>
            <Row label="Job Title" value={formData.occupation} accent="#374151" />
            <Row label="Company" value={formData.company} accent="#374151" />
            <Row label="Income" value={formData.salaryRange} accent="#374151" />
            <Row label="Work Mode" value={formData.workMode} accent="#374151" />
          </Section2>
          <div style={{ height: '12px' }} />
          <Section2 title="Education" accent={BRAND}>
            {(formData.educationList || []).map((e: any) => (
              <div key={e.id} style={{ marginBottom: '6px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>{e.degree || '—'}</div>
                <div style={{ fontSize: '10px', color: '#9CA3AF' }}>{[e.college, e.passingYear].filter(Boolean).join(' · ')}</div>
              </div>
            ))}
          </Section2>
        </div>
      </div>
      {/* Family */}
      <Section2 title="Family Background" accent={BRAND} style={{ marginTop: '14px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
          <Row label="Father" value={[formData.fatherName, formData.fatherOccupation].filter(Boolean).join(', ')} accent="#374151" />
          <Row label="Mother" value={[formData.motherName, formData.motherOccupation].filter(Boolean).join(', ')} accent="#374151" />
          <Row label="Family Type" value={formData.familyType} accent="#374151" />
          <Row label="Native" value={formData.nativePlace} accent="#374151" />
        </div>
      </Section2>
      {/* Expectations */}
      {formData.otherPreferences && (
        <Section2 title="Partner Expectations" accent={BRAND} style={{ marginTop: '14px' }}>
          <p style={{ fontSize: '12px', color: '#374151', lineHeight: '1.7', margin: 0 }}>{formData.otherPreferences}</p>
        </Section2>
      )}
      {/* Lifestyle */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '14px' }}>
        <Section2 title="Lifestyle" accent={BRAND}>
          <Row label="Diet" value={formData.diet} accent="#374151" />
          <Row label="Smoking" value={formData.smoking} accent="#374151" />
          <Row label="Drinking" value={formData.drinking} accent="#374151" />
          <Row label="Hobbies" value={(formData.hobbies || []).join(', ')} accent="#374151" />
        </Section2>
        <Section2 title="Contact" accent={BRAND}>
          <Row label="Phone" value={formData.contactTo || formData.contactNumber} accent="#374151" />
          <Row label="Email" value={formData.email} accent="#374151" />
        </Section2>
      </div>
    </div>
  </div>
);

/* ── Minimal Template ────────────────────────────────────────*/
const MinimalTemplate: React.FC<{ formData: any; aiSummary: string }> = ({ formData, aiSummary }) => (
  <div style={{ background: '#fff', maxWidth: '700px', margin: '0 auto', padding: '32px', fontFamily: 'Inter, sans-serif' }}>
    {/* Top bar */}
    <div style={{ borderBottom: '2px solid #111827', paddingBottom: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#111827', margin: '0 0 4px' }}>{formData.name || '—'}</h1>
        <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>{[formData.occupation, formData.company].filter(Boolean).join(' · ')}</p>
      </div>
      {formData.profilePictureUrl && (
        <div style={{ width: '72px', aspectRatio: '4/5', borderRadius: '4px', overflow: 'hidden', border: '1px solid #E5E7EB', flexShrink: 0 }}>
          <img src={formData.profilePictureUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
    </div>
    {/* Summary */}
    {aiSummary && <p style={{ fontSize: '12px', color: '#374151', lineHeight: '1.8', marginBottom: '20px', borderLeft: '3px solid #111827', paddingLeft: '12px' }}>{aiSummary}</p>}
    {/* Columns */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      <div>
        <h3 style={{ fontSize: '11px', fontWeight: 800, color: '#111827', borderBottom: '1px solid #E5E7EB', paddingBottom: '4px', marginBottom: '10px' }}>Personal</h3>
        <Row label="Age" value={formData.age ? `${formData.age} years` : ''} accent="#374151" />
        <Row label="Height" value={formData.heightCm ? cmToFeetInches(formData.heightCm) : ''} accent="#374151" />
        <Row label="Religion / Caste" value={[formData.religion, formData.caste].filter(Boolean).join(' / ')} accent="#374151" />
        <Row label="Manglik" value={formData.manglik} accent="#374151" />
        <Row label="Marital Status" value={formData.maritalStatus} accent="#374151" />
        <Row label="Blood Group" value={formData.bloodGroup} accent="#374151" />
        <Row label="Languages" value={(formData.languagesKnown || []).join(', ')} accent="#374151" />
        <h3 style={{ fontSize: '11px', fontWeight: 800, color: '#111827', borderBottom: '1px solid #E5E7EB', paddingBottom: '4px', marginBottom: '10px', marginTop: '16px' }}>Education</h3>
        {(formData.educationList || []).map((e: any) => (
          <div key={e.id} style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>{e.degree || '—'}</div>
            <div style={{ fontSize: '10px', color: '#9CA3AF' }}>{[e.college, e.passingYear].filter(Boolean).join(', ')}</div>
          </div>
        ))}
      </div>
      <div>
        <h3 style={{ fontSize: '11px', fontWeight: 800, color: '#111827', borderBottom: '1px solid #E5E7EB', paddingBottom: '4px', marginBottom: '10px' }}>Career</h3>
        <Row label="Occupation" value={formData.occupation} accent="#374151" />
        <Row label="Company" value={formData.company} accent="#374151" />
        <Row label="Designation" value={formData.designation} accent="#374151" />
        <Row label="Income" value={formData.salaryRange} accent="#374151" />
        <h3 style={{ fontSize: '11px', fontWeight: 800, color: '#111827', borderBottom: '1px solid #E5E7EB', paddingBottom: '4px', marginBottom: '10px', marginTop: '16px' }}>Family</h3>
        <Row label="Father" value={[formData.fatherName, formData.fatherOccupation].filter(Boolean).join(', ')} accent="#374151" />
        <Row label="Mother" value={[formData.motherName, formData.motherOccupation].filter(Boolean).join(', ')} accent="#374151" />
        <Row label="Family Type" value={[formData.familyType, formData.familyValues].filter(Boolean).join(' / ')} accent="#374151" />
        <Row label="Native" value={formData.nativePlace} accent="#374151" />
        <h3 style={{ fontSize: '11px', fontWeight: 800, color: '#111827', borderBottom: '1px solid #E5E7EB', paddingBottom: '4px', marginBottom: '10px', marginTop: '16px' }}>Lifestyle</h3>
        <Row label="Diet" value={formData.diet} accent="#374151" />
        <Row label="Hobbies" value={(formData.hobbies || []).join(', ')} accent="#374151" />
      </div>
    </div>
    {formData.otherPreferences && (
      <>
        <h3 style={{ fontSize: '11px', fontWeight: 800, color: '#111827', borderBottom: '1px solid #E5E7EB', paddingBottom: '4px', marginBottom: '10px', marginTop: '20px' }}>Partner Expectations</h3>
        <p style={{ fontSize: '12px', color: '#374151', lineHeight: '1.7', margin: 0 }}>{formData.otherPreferences}</p>
      </>
    )}
    <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '20px', paddingTop: '12px', display: 'flex', gap: '24px', fontSize: '11px', color: '#6B7280' }}>
      <span>📞 {formData.contactTo || formData.contactNumber || '—'}</span>
      <span>✉️ {formData.email || '—'}</span>
      {formData.currentAddress && <span>📍 {formData.currentAddress}</span>}
    </div>
  </div>
);

/* ── Section helper for Modern ──────────────────────────────*/
const Section2: React.FC<{ title: string; accent: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ title, accent, children, style }) => (
  <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', ...style }}>
    <div style={{ background: accent + '12', borderBottom: `1px solid ${accent}30`, padding: '7px 12px', fontSize: '11px', fontWeight: 800, color: accent }}>{title}</div>
    <div style={{ padding: '10px 12px' }}>{children}</div>
  </div>
);

/* ── Main Step8Preview component ─────────────────────────────*/
export const Step8Preview: React.FC = () => {
  const { formData, profileId, slug } = useBiodata();
  const [aiSummary, setAiSummary] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSource, setAiSource] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('modern');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const ollamaModel = 'llama3';
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleTrigger = () => setIsPdfModalOpen(true);
    window.addEventListener('triggerPdfDownload', handleTrigger);
    return () => window.removeEventListener('triggerPdfDownload', handleTrigger);
  }, []);

  const handleGenerateSummary = async () => {
    const currentBio = aiSummary;
    setAiLoading(true);
    setAiSummary('');
    try {
      const result = await generateOllamaSummaryApi(formData, ollamaModel, currentBio);
      if (result?.summary) {
        setAiSummary(result.summary);
        setAiSource(result.source || 'unknown');
      }
    } finally {
      setAiLoading(false);
    }
  };

  const handlePrint = () => {
    setIsPdfModalOpen(true);
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const activeTemplate = TEMPLATES.find(t => t.id === selectedTemplate)!;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* ── Step 2: AI Generate Biodata Summary ───────────────*/}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <Sparkles style={{ width: '15px', color: BRAND }} />
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#111827' }}>✨ AI Generate Biodata Summary</span>
              <span style={{ fontSize: '10px', background: '#EDE9FE', color: '#7E22CE', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>Ollama LLM</span>
            </div>
            <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>Uses local Ollama AI to craft a personalized matrimonial bio from your profile data</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {aiSummary && (
              <button type="button" onClick={() => { setAiSummary(''); setAiSource(''); }}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', background: '#F3F4F6', color: '#6B7280', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                <RotateCcw style={{ width: '11px' }} /> Reset
              </button>
            )}
            <button type="button" onClick={handleGenerateSummary} disabled={aiLoading}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: aiLoading ? '#9CA3AF' : BRAND, color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: aiLoading ? 'not-allowed' : 'pointer' }}>
              {aiLoading ? <Loader2 style={{ width: '13px', animation: 'spin 1s linear infinite' }} /> : <Sparkles style={{ width: '13px' }} />}
              {aiLoading ? 'Generating…' : aiSummary ? 'Regenerate' : '✨ Generate Summary'}
            </button>
          </div>
        </div>

        {/* Summary output */}
        {aiSummary && (
          <div style={{ background: BRAND_LIGHT, border: `1px solid ${BRAND_BORDER}`, borderRadius: '8px', padding: '14px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
              <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.8', margin: 0, flex: 1 }}>{aiSummary}</p>
            </div>
            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, background: aiSource === 'ollama' ? '#EDE9FE' : '#F3F4F6', color: aiSource === 'ollama' ? '#7E22CE' : '#6B7280', padding: '2px 8px', borderRadius: '999px' }}>
                {aiSource === 'ollama' ? `🤖 ${ollamaModel} (Ollama)` : aiSource === 'smart_fallback' ? '⚡ Smart Fallback' : '💾 Local Fallback'}
              </span>
              <textarea
                value={aiSummary}
                onChange={e => setAiSummary(e.target.value)}
                rows={3}
                style={{ display: 'none' }}
              />
              <button type="button" onClick={() => {
                const el = document.getElementById('ai-summary-editor') as HTMLTextAreaElement;
                if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
              }} style={{ fontSize: '10px', color: BRAND, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
                Edit
              </button>
            </div>
            <textarea
              id="ai-summary-editor"
              defaultValue={aiSummary}
              onBlur={e => setAiSummary(e.target.value)}
              rows={3}
              style={{ display: 'none', width: '100%', marginTop: '8px', padding: '8px', border: `1px solid ${BRAND_BORDER}`, borderRadius: '6px', fontSize: '12px', color: '#374151', resize: 'vertical' }}
            />
          </div>
        )}
        {!aiSummary && !aiLoading && (
          <div style={{ border: `1.5px dashed ${BRAND_BORDER}`, borderRadius: '8px', padding: '20px', textAlign: 'center', background: BRAND_LIGHT }}>
            <Sparkles style={{ width: '22px', color: BRAND_BORDER, margin: '0 auto 6px', display: 'block' }} />
            <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>Click "✨ Generate Summary" to create an AI-crafted bio from your profile data.</p>
            <p style={{ fontSize: '10px', color: '#C4B5FD', margin: '4px 0 0' }}>Works offline with smart fallback if Ollama is not running.</p>
          </div>
        )}
      </div>

      {/* ── Step 3: Choose Template ───────────────────────── */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          <Palette style={{ width: '15px', color: BRAND }} />
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#111827' }}>Choose Template</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {TEMPLATES.map(t => (
            <button key={t.id} type="button" onClick={() => setSelectedTemplate(t.id)}
              style={{
                flex: 1, padding: '14px 10px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer',
                border: selectedTemplate === t.id ? `2px solid ${BRAND}` : '2px solid #E5E7EB',
                background: selectedTemplate === t.id ? BRAND_LIGHT : '#F9FAFB',
                transition: 'all 0.15s',
              }}>
              <div style={{ fontSize: '24px', marginBottom: '6px' }}>{t.preview}</div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: selectedTemplate === t.id ? BRAND : '#374151' }}>{t.name}</div>
              <div style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '2px' }}>{t.desc}</div>
              {selectedTemplate === t.id && (
                <div style={{ marginTop: '6px', fontSize: '10px', fontWeight: 700, color: BRAND, background: BRAND_BORDER, padding: '2px 8px', borderRadius: '999px', display: 'inline-block' }}>
                  ✓ Selected
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Step 4: Preview ───────────────────────────────── */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Eye style={{ width: '15px', color: BRAND }} />
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#111827' }}>Preview — {activeTemplate.name} Template</span>
          </div>
          <span style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: 600 }}>This is how your PDF will look</span>
        </div>
        {/* Preview container */}
        <div
          id="biodata-preview"
          ref={previewRef}
          style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'auto', background: activeTemplate.bg }}
        >
          {selectedTemplate === 'classic' && <ClassicTemplate formData={formData} aiSummary={aiSummary} />}
          {selectedTemplate === 'modern' && <ModernTemplate formData={formData} aiSummary={aiSummary} />}
          {selectedTemplate === 'minimal' && <MinimalTemplate formData={formData} aiSummary={aiSummary} />}
        </div>
      </div>

      {/* ── Step 5: Download / Share ──────────────────────── */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <Download style={{ width: '15px', color: BRAND }} />
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#111827' }}>Download & Share</span>
          </div>
          <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>Save as PDF or share biodata details directly</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" onClick={handleShare}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: '#fff', color: '#374151', border: '1.5px solid #E5E7EB', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
            <Share2 style={{ width: '14px' }} /> Share
          </button>
          <button type="button" onClick={handlePrint}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 24px', background: BRAND, color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(240,20,114,0.3)' }}>
            <Download style={{ width: '14px' }} /> Download PDF
          </button>
        </div>
      </div>

      {/* PDF Generator Modal */}
      <PdfGeneratorModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        targetElement={previewRef.current}
        candidateName={formData.name || 'Biodata Candidate'}
        profileId={null}
      />

      {/* Share Biodata Modal */}
      <BiodataShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        formData={formData}
        slug={slug}
        profileId={profileId}
      />
    </div>
  );
};
