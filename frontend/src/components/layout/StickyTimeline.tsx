import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { useBiodata } from '../../context/BiodataContext';
import type { StepId } from '../../types/biodata';

export const STEPS = [
  { id: 1 as StepId, name: 'Personal',     desc: 'Basic Details' },
  { id: 2 as StepId, name: 'Education',    desc: 'Degrees & College' },
  { id: 3 as StepId, name: 'Career',       desc: 'Job & Salary' },
  { id: 4 as StepId, name: 'Family',       desc: 'Parents & Siblings' },
  { id: 5 as StepId, name: 'Lifestyle',    desc: 'Diet & Hobbies' },
  { id: 6 as StepId, name: 'Expectations', desc: 'Partner Preferences' },
  { id: 7 as StepId, name: 'Uploads',      desc: 'Photos & Documents' },
  { id: 8 as StepId, name: 'Preview',      desc: 'Final Review & Export' },
];

const C = {
  brand:       '#F01472',
  brandDark:   '#C80E5A',
  brandLight:  '#FFF0F6',
  brandBorder: '#FBBDD8',
};

export const StickyTimeline: React.FC = () => {
  const { currentStep, setCurrentStep, completedSteps, completionScore } = useBiodata();

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-4 space-y-3">

        {/* ── Steps Timeline Card ─────────────────────── */}
        <div style={{
          background: '#fff',
          border: `1px solid ${C.brandBorder}`,
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 2px 12px rgba(240,20,114,0.06)',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '12px',
            marginBottom: '12px',
            borderBottom: `1px solid ${C.brandLight}`,
          }}>
            <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', color: '#94a3b8', textTransform: 'none' }}>
              Steps Timeline
            </span>
            <span style={{
              fontSize: '11px', fontWeight: 700, padding: '2px 10px',
              borderRadius: '999px', background: C.brandLight,
              color: C.brand, border: `1px solid ${C.brandBorder}`,
            }}>
              {currentStep} / 8
            </span>
          </div>

          {/* Steps */}
          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute', top: '16px', bottom: '16px', left: '15px',
              width: '1px', background: C.brandBorder,
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {STEPS.map((step) => {
                const isCurrent   = currentStep === step.id;
                const isCompleted = completedSteps.has(step.id);

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setCurrentStep(step.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px',
                      borderRadius: '8px',
                      border: isCurrent ? `1px solid ${C.brandBorder}` : '1px solid transparent',
                      background: isCurrent ? C.brandLight : 'transparent',
                      cursor: 'pointer',
                      position: 'relative',
                      zIndex: 1,
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isCurrent) e.currentTarget.style.background = '#FFF8FB';
                    }}
                    onMouseLeave={(e) => {
                      if (!isCurrent) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {/* ── CIRCLE indicator ── */}
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',           /* ← perfect circle */
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontWeight: 700,
                      fontSize: '12px',
                      transition: 'all 0.2s',
                      background: (isCurrent || isCompleted) ? C.brand : C.brandLight,
                      color: (isCurrent || isCompleted) ? '#fff' : C.brand,
                      border: (isCurrent || isCompleted) ? 'none' : `1.5px solid ${C.brandBorder}`,
                      boxShadow: isCurrent ? `0 0 0 3px ${C.brandLight}, 0 0 0 4px ${C.brandBorder}` : 'none',
                    }}>
                      {isCompleted && !isCurrent
                        ? <Check style={{ width: '15px', height: '15px', strokeWidth: 3 }} />
                        : isCurrent
                        ? <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff', display: 'block' }} />
                        : step.id}
                    </div>

                    {/* Label */}
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: isCurrent ? C.brand : isCompleted ? '#1A0A10' : '#94a3b8',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {step.name}
                      </div>
                      <div style={{ fontSize: '10px', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {isCurrent ? 'In progress' : isCompleted ? 'Completed' : step.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── AI Profile Strength Card ─────────────────── */}
        <div style={{
          background: '#fff',
          border: `1px solid ${C.brandBorder}`,
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 2px 12px rgba(240,20,114,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', color: C.brand, textTransform: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles style={{ width: '13px', height: '13px' }} />
              AI Profile Strength
            </span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8' }}>
              {completionScore >= 80 ? 'Excellent' : completionScore >= 50 ? 'Good' : 'Basic'}
            </span>
          </div>

          <div style={{ fontSize: '26px', fontWeight: 900, color: '#1A0A10', marginBottom: '8px' }}>
            {completionScore}%
          </div>

          {/* Progress bar */}
          <div style={{ width: '100%', height: '6px', borderRadius: '9999px', background: C.brandLight, overflow: 'hidden', marginBottom: '8px' }}>
            <div style={{
              height: '100%',
              borderRadius: '9999px',
              background: C.brand,
              width: `${completionScore}%`,
              transition: 'width 0.5s ease',
            }} />
          </div>

          <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>
            High quality profiles get{' '}
            <strong style={{ color: C.brand }}>4x more responses</strong> on matrimonial platforms.
          </p>
        </div>

      </div>
    </aside>
  );
};
