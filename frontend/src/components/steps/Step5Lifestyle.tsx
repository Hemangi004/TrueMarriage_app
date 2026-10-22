import React from 'react';
import { Utensils, Cigarette, Wine, Sparkles, Check, Smile } from 'lucide-react';
import { useBiodata } from '../../context/BiodataContext';

/* ── Pastel palette per hobby ─────────────────────────────────── */
const HOBBIES_LIST = [
  { name: 'Reading',     icon: '📖', bg: '#FDE8D0', text: '#B45309', border: '#FBBF83' }, // pastel peach
  { name: 'Travel',      icon: '✈️', bg: '#DBEAFE', text: '#1D4ED8', border: '#93C5FD' }, // pastel sky blue
  { name: 'Photography', icon: '📷', bg: '#FCE7F3', text: '#BE185D', border: '#F9A8D4' }, // pastel rose
  { name: 'Cooking',     icon: '🍳', bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' }, // pastel amber
  { name: 'Music',       icon: '🎧', bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' }, // pastel mint
  { name: 'Painting',    icon: '🎨', bg: '#E0F2FE', text: '#0369A1', border: '#7DD3FC' }, // pastel cyan
  { name: 'Dance',       icon: '💃', bg: '#F3E8FF', text: '#7E22CE', border: '#D8B4FE' }, // pastel lavender
  { name: 'Movies',      icon: '🎬', bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' }, // pastel coral
  { name: 'Sports',      icon: '⚽', bg: '#DCFCE7', text: '#166534', border: '#86EFAC' }, // pastel green
  { name: 'Gym',         icon: '🏋️', bg: '#FFF7ED', text: '#9A3412', border: '#FDC397' }, // pastel orange
  { name: 'Yoga',        icon: '🧘', bg: '#CCFBF1', text: '#134E4A', border: '#5EEAD4' }, // pastel teal
  { name: 'Gaming',      icon: '🎮', bg: '#EDE9FE', text: '#4C1D95', border: '#C4B5FD' }, // pastel violet
  { name: 'Meditation',  icon: '🕊️', bg: '#E0F2FE', text: '#075985', border: '#7DD3FC' }, // pastel sky
  { name: 'Adventure',   icon: '🏔️', bg: '#FEF3C7', text: '#78350F', border: '#FDE68A' }, // pastel yellow
];

/* ── Pastel color sets per diet option ───────────────────────── */
const DIET_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Vegetarian: { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' }, // mint green
  Eggetarian: { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' }, // warm yellow
  'Non Veg':  { bg: '#FDE8D0', text: '#B45309', border: '#FBBF83' }, // peach
  Vegan:      { bg: '#F3E8FF', text: '#7E22CE', border: '#D8B4FE' }, // lavender
};

/* ── Pastel color sets per smoking/drinking options ──────────── */
const HABIT_COLORS = {
  good:   { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' }, // mint (Never)
  medium: { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' }, // amber (Occasionally/Socially)
  bad:    { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' }, // coral (Yes/Frequently)
};

const SMOKING_MAP: Record<string, keyof typeof HABIT_COLORS> = {
  Never: 'good', Occasionally: 'medium', Yes: 'bad'
};
const DRINKING_MAP: Record<string, keyof typeof HABIT_COLORS> = {
  Never: 'good', Socially: 'medium', Frequently: 'bad'
};

export const Step5Lifestyle: React.FC = () => {
  const { formData, updateFormData, openAiModal } = useBiodata();

  const handleToggleHobby = (hobbyName: string) => {
    const current = formData.hobbies || [];
    if (current.includes(hobbyName)) {
      updateFormData({ hobbies: current.filter((h) => h !== hobbyName) });
    } else {
      updateFormData({ hobbies: [...current, hobbyName] });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* ── Dietary Preference ─────────────────────────── */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
          <Utensils style={{ width: '12px', display: 'inline', marginRight: '4px', color: '#10B981' }} /> Dietary Preference *
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {(['Vegetarian', 'Eggetarian', 'Non Veg', 'Vegan'] as const).map((d) => {
            const isSelected = formData.diet === d;
            const pal = DIET_COLORS[d];
            return (
              <button
                key={d}
                type="button"
                onClick={() => updateFormData({ diet: d })}
                style={isSelected ? {
                  background: pal.bg,
                  color: pal.text,
                  border: `1.5px solid ${pal.border}`,
                  boxShadow: `0 2px 8px ${pal.border}60`,
                } : {
                  background: '#fff',
                  color: '#64748b',
                  border: '1.5px solid #e2e8f0',
                }}
                className="py-2.5 px-3 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5"
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                {d}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Smoking Habits ─────────────────────────────── */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
          <Cigarette style={{ width: '12px', display: 'inline', marginRight: '4px', color: '#9CA3AF' }} /> Smoking Habits *
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {(['Never', 'Occasionally', 'Yes'] as const).map((s) => {
            const isSelected = (formData.smoking === 'No' ? 'Never' : formData.smoking) === s;
            const pal = HABIT_COLORS[SMOKING_MAP[s]];
            return (
              <button
                key={s}
                type="button"
                onClick={() => updateFormData({ smoking: s })}
                style={isSelected ? {
                  background: pal.bg,
                  color: pal.text,
                  border: `1.5px solid ${pal.border}`,
                  boxShadow: `0 2px 8px ${pal.border}60`,
                } : {
                  background: '#fff',
                  color: '#64748b',
                  border: '1.5px solid #e2e8f0',
                }}
                className="py-2.5 px-3 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5"
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Drinking Habits ─────────────────────────────── */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
          <Wine style={{ width: '12px', display: 'inline', marginRight: '4px', color: '#9CA3AF' }} /> Drinking Habits *
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {(['Never', 'Socially', 'Frequently'] as const).map((dr) => {
            const isSelected = (formData.drinking === 'No' ? 'Never' : formData.drinking) === dr;
            const pal = HABIT_COLORS[DRINKING_MAP[dr]];
            return (
              <button
                key={dr}
                type="button"
                onClick={() => updateFormData({ drinking: dr })}
                style={isSelected ? {
                  background: pal.bg,
                  color: pal.text,
                  border: `1.5px solid ${pal.border}`,
                  boxShadow: `0 2px 8px ${pal.border}60`,
                } : {
                  background: '#fff',
                  color: '#64748b',
                  border: '1.5px solid #e2e8f0',
                }}
                className="py-2.5 px-3 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5"
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                {dr}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Hobbies & Passion Interests ─────────────────── */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151' }}>
              <Smile style={{ width: '12px', display: 'inline', marginRight: '4px', color: '#F01472' }} /> Hobbies & Passion Interests
            </label>
            <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>Select pastel tags that describe what you enjoy doing.</p>
          </div>
          <button
            type="button"
            onClick={() => openAiModal('hobbies')}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', background: '#F01472', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
          >
            <Sparkles style={{ width: '12px' }} />
            ✨ AI Suggest
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {HOBBIES_LIST.map((hobby) => {
            const isSelected = formData.hobbies?.includes(hobby.name);
            return (
              <button
                key={hobby.name}
                type="button"
                onClick={() => handleToggleHobby(hobby.name)}
                style={isSelected ? {
                  background: hobby.bg,
                  color: hobby.text,
                  border: `1.5px solid ${hobby.border}`,
                  boxShadow: `0 2px 8px ${hobby.border}50`,
                } : {
                  background: '#fff',
                  color: '#64748b',
                  border: '1.5px solid #e2e8f0',
                }}
                className="p-2.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-2"
              >
                <span className="text-sm">{hobby.icon}</span>
                <span className="truncate flex-1 text-left">{hobby.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 ml-auto stroke-[3] shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
