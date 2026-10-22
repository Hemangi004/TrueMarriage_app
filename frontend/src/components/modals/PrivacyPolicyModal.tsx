import React from 'react';
import { Lock } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { BaseLegalDocModal } from './BaseLegalDocModal';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  const { t } = useI18n();

  return (
    <BaseLegalDocModal
      isOpen={isOpen}
      onClose={onClose}
      docType="privacy"
      title={t('Privacy Policy')}
      subtitle={t('How TrueMarriage collects, protects, and manages your personal information')}
      icon={<Lock className="w-5 h-5 text-white" />}
      badgeLabel={t('Data Privacy & Security')}
      rawFileUrl="/privacy-policy.txt"
    />
  );
};
