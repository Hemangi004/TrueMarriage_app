import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { BaseLegalDocModal } from './BaseLegalDocModal';

interface RefundPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RefundPolicyModal: React.FC<RefundPolicyModalProps> = ({ isOpen, onClose }) => {
  const { t } = useI18n();

  return (
    <BaseLegalDocModal
      isOpen={isOpen}
      onClose={onClose}
      docType="refund"
      title={t('Refund & Cancellation Policy')}
      subtitle={t('Policies regarding payments, subscriptions, cancellations, and refunds')}
      icon={<RefreshCw className="w-5 h-5 text-white" />}
      badgeLabel={t('Customer Protection')}
      rawFileUrl="/refund-policy.txt"
    />
  );
};
