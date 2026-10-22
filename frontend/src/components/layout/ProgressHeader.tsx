import React from 'react';
import { Check } from 'lucide-react';
import { useBiodata } from '../../context/BiodataContext';
import type { StepId, StepInfo } from '../../types/biodata';

const BRAND = '#F01472';
const BRAND_LIGHT = '#FFF0F6';
const BRAND_BORDER = '#FBBDD8';

export const STEPS: StepInfo[] = [
  { id: 1, label: 'Personal',     shortLabel: 'Personal',     iconName: 'User' },
  { id: 2, label: 'Education',    shortLabel: 'Education',    iconName: 'GraduationCap' },
  { id: 3, label: 'Career',       shortLabel: 'Career',       iconName: 'Briefcase' },
  { id: 4, label: 'Family',       shortLabel: 'Family',       iconName: 'Users' },
  { id: 5, label: 'Lifestyle',    shortLabel: 'Lifestyle',    iconName: 'HeartHandshake' },
  { id: 6, label: 'Expectations', shortLabel: 'Expectations', iconName: 'Target' },
  { id: 7, label: 'Uploads',      shortLabel: 'Photos',       iconName: 'Camera' },
  { id: 8, label: 'Preview',      shortLabel: 'Preview',      iconName: 'Eye' },
];

export const ProgressHeader: React.FC = () => {
  const { currentStep, setCurrentStep, completedSteps } = useBiodata();

  return (
    <div style={{ maxWidth: '100%', padding: '0 1cm' }}>
      {/* Branding row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0 10px' }}>
        <span style={{ fontSize: '20px', fontWeight: 800, color: BRAND, letterSpacing: '-0.5px' }}>
          TrueMarriage <span style={{ color: '#111827' }}>AI</span>
        </span>
        <span style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 500 }}>
          Matrimonial Biodata Builder
        </span>
      </div>

      {/* Step pills row */}
      <div style={{
        display: 'flex',
        gap: '6px',
        paddingBottom: '14px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        {STEPS.map((step) => {
          const isCompleted = completedSteps.has(step.id as StepId);
          const isCurrent   = currentStep === step.id;

          return (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id as StepId)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '999px',
                border: isCurrent
                  ? `1.5px solid ${BRAND}`
                  : isCompleted
                  ? `1.5px solid ${BRAND_BORDER}`
                  : '1.5px solid #E5E7EB',
                background: isCurrent ? BRAND : isCompleted ? BRAND_LIGHT : '#fff',
                color: isCurrent ? '#fff' : isCompleted ? BRAND : '#6B7280',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
              }}
            >
              {isCompleted && !isCurrent
                ? <Check style={{ width: '11px', height: '11px', strokeWidth: 3 }} />
                : <span style={{
                    width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0,
                    background: isCurrent ? 'rgba(255,255,255,0.3)' : isCompleted ? BRAND_BORDER : '#E5E7EB',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '9px', fontWeight: 900, color: isCurrent ? '#fff' : '#9CA3AF',
                  }}>
                    {step.id}
                  </span>
              }
              {step.shortLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
};
