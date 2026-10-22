import React from 'react';
import { FileText } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { BaseLegalDocModal } from './BaseLegalDocModal';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({ isOpen, onClose }) => {
  const { t } = useI18n();

  return (
    <BaseLegalDocModal
      isOpen={isOpen}
      onClose={onClose}
      docType="terms"
      title={t('Terms & Conditions')}
      subtitle={t('Rules, terms, and guidelines governing the use of TrueMarriage services')}
      icon={<FileText className="w-5 h-5 text-white" />}
      badgeLabel={t('User Terms & Agreement')}
      rawFileUrl="/terms-and-conditions.txt"
    />
  );
};
