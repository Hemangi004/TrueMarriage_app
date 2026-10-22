import React from 'react';
import { type LegalTabType } from '../../services/legalDocService';
import { PrivacyPolicyModal } from './PrivacyPolicyModal';
import { TermsOfServiceModal } from './TermsOfServiceModal';
import { RefundPolicyModal } from './RefundPolicyModal';

export type LegalTab = LegalTabType;
export { PrivacyPolicyModal, TermsOfServiceModal, RefundPolicyModal };

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
}

/**
 * Backwards-compatible LegalModal wrapper.
 * Delegates to the dedicated individual modal based on initialTab without showing tabs.
 */
export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, initialTab = 'privacy' }) => {
  if (initialTab === 'terms') {
    return <TermsOfServiceModal isOpen={isOpen} onClose={onClose} />;
  }
  if (initialTab === 'refund') {
    return <RefundPolicyModal isOpen={isOpen} onClose={onClose} />;
  }
  return <PrivacyPolicyModal isOpen={isOpen} onClose={onClose} />;
};
