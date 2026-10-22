import React from 'react';
import { ArrowLeft, ArrowRight, Eye, CheckCircle2, Save } from 'lucide-react';
import { useBiodata } from '../../context/BiodataContext';
import { useI18n } from '../../context/I18nContext';
import { getBackLabel } from '../../utils/navigationI18n';

const BRAND       = '#F01472';
const BRAND_DARK  = '#C80E5A';
const BRAND_LIGHT = '#FFF0F6';
const BRAND_BDR   = '#FBBDD8';

export const WizardFooter: React.FC = () => {
  const { currentStep, setCurrentStep, goToNextStep, goToPrevStep, lastSavedTime } = useBiodata();
  const { lang } = useI18n();

  return (
    <div
      className="no-print"
      style={{
        marginTop: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        background: '#fff',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        padding: '12px 16px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      }}
    >
      {/* Previous */}
      <div>
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={goToPrevStep}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 18px', borderRadius: '6px', cursor: 'pointer',
              background: '#fff', color: '#374151', fontWeight: 700, fontSize: '12px',
              border: '1.5px solid #E5E7EB', transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#F9FAFB')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
          >
            <ArrowLeft style={{ width: '14px', height: '14px' }} />
            <span className="notranslate" translate="no">{getBackLabel(lang)}</span>
          </button>
        ) : <div />}
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>

        {/* Auto-save badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          padding: '7px 12px', borderRadius: '6px',
          background: BRAND_LIGHT, color: BRAND,
          border: `1px solid ${BRAND_BDR}`, fontSize: '11px', fontWeight: 600,
        }}>
          <Save style={{ width: '12px', height: '12px' }} />
          Auto-saved {lastSavedTime ? `at ${lastSavedTime}` : 'just now'}
        </div>

        {/* Preview */}
        {currentStep !== 8 && (
          <button
            type="button"
            onClick={() => setCurrentStep(8)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '6px', cursor: 'pointer',
              background: '#fff', color: BRAND, fontWeight: 700, fontSize: '12px',
              border: `1.5px solid ${BRAND_BDR}`, transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = BRAND_LIGHT)}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
          >
            <Eye style={{ width: '14px', height: '14px' }} /> Preview
          </button>
        )}

        {/* Next / Download */}
        {currentStep < 8 ? (
          <button
            type="button"
            onClick={goToNextStep}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 22px', borderRadius: '6px', cursor: 'pointer',
              background: BRAND, color: '#fff', fontWeight: 700, fontSize: '12px',
              border: 'none', transition: 'background 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = BRAND_DARK;
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(240,20,114,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = BRAND;
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Next <ArrowRight style={{ width: '14px', height: '14px' }} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('triggerPdfDownload'))}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 22px', borderRadius: '6px', cursor: 'pointer',
              background: BRAND, color: '#fff', fontWeight: 700, fontSize: '12px',
              border: 'none',
            }}
          >
            <CheckCircle2 style={{ width: '14px', height: '14px' }} /> Download PDF
          </button>
        )}
      </div>
    </div>
  );
};
