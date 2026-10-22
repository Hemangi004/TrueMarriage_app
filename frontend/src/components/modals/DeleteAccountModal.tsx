import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle, Eye, EyeOff, Loader2, Trash2, ShieldAlert } from 'lucide-react';
import { deleteAccountApi } from '../../services/apiService';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DELETION_REASONS = [
  'Married / Found my partner on TrueMarriage',
  'Found my partner through another avenue',
  'Unhappy with matches / experience',
  'Privacy and data concerns',
  'Taking an indefinite break',
  'Other',
];

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [reason, setReason] = useState<string>('');
  const [otherReason, setOtherReason] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [confirmText, setConfirmText] = useState<string>('');
  const [hasAcknowledged, setHasAcknowledged] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const isDeleteConfirmed = confirmText.trim().toUpperCase() === 'DELETE';
  const isFormValid = isDeleteConfirmed && hasAcknowledged && password.trim().length > 0;

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password.trim()) {
      setError('Please enter your account password to verify this action.');
      return;
    }

    if (!isDeleteConfirmed) {
      setError('Please type DELETE in capital letters to confirm.');
      return;
    }

    if (!hasAcknowledged) {
      setError('Please check the acknowledgment box to proceed.');
      return;
    }

    setIsSubmitting(true);
    try {
      const finalReason = reason === 'Other' ? otherReason.trim() : reason;
      await deleteAccountApi(password, 'DELETE', finalReason);
      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete account. Please verify your password and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100050] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn"
      onClick={!isSubmitting ? onClose : undefined}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden space-y-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Danger Header */}
        <div className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <AlertTriangle size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Delete Account Permanently</h3>
              <p className="text-[11px] text-rose-100">Irreversible action</p>
            </div>
          </div>
          {!isSubmitting && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full text-white/80 hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Content */}
        <form onSubmit={handleDelete} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Warning Banner */}
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-900 text-xs space-y-1.5 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-rose-950">
              <AlertTriangle size={14} className="text-rose-600 shrink-0" />
              <span>Warning: This cannot be undone</span>
            </div>
            <p className="text-[11px] text-rose-800">
              Deleting your account will permanently wipe your profile, personal biodata, photos, horoscope details, saved matches, and all conversation histories.
            </p>
          </div>

          {/* Reason Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700">
              Reason for leaving (optional)
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-800 cursor-pointer"
            >
              <option value="">Select a reason...</option>
              {DELETION_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {reason === 'Other' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">Please specify:</label>
              <input
                type="text"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                disabled={isSubmitting}
                placeholder="Help us understand how we could improve..."
                maxLength={200}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-800"
              />
            </div>
          )}

          {/* Password Verification Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700">
              1. Verify Account Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                placeholder="Enter your current password"
                required
                className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 text-xs pr-10 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Type DELETE to confirm */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700">
              2. Type <span className="font-mono bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded text-[11px] font-bold">DELETE</span> to confirm <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              disabled={isSubmitting}
              placeholder='Type "DELETE"'
              className={`w-full px-3.5 py-2.5 rounded-2xl border text-xs font-mono transition focus:outline-none ${
                confirmText.length > 0 && !isDeleteConfirmed
                  ? 'border-rose-400 bg-rose-50/50'
                  : isDeleteConfirmed
                  ? 'border-green-500 bg-green-50/40 text-green-900 font-bold'
                  : 'border-gray-200 text-gray-800'
              }`}
            />
            {confirmText.length > 0 && !isDeleteConfirmed && (
              <p className="text-[11px] text-rose-500 font-medium">Must match "DELETE" in capital letters</p>
            )}
          </div>

          {/* Acknowledgment Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={hasAcknowledged}
                onChange={(e) => setHasAcknowledged(e.target.checked)}
                disabled={isSubmitting}
                className="mt-0.5 w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-gray-300 cursor-pointer"
              />
              <span className="text-[11px] text-gray-600 select-none leading-relaxed">
                I understand that this action is irreversible and all my matrimonial records will be permanently deleted.
              </span>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2">
              <ShieldAlert size={15} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-rose-500/25 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 size={14} />
                  <span>Permanently Delete</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
