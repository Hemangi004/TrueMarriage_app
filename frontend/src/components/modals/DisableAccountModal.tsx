import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertCircle, Eye, EyeOff, Loader2, PauseCircle, ShieldAlert } from 'lucide-react';
import { disableAccountApi } from '../../services/apiService';

interface DisableAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DEACTIVATE_REASONS = [
  'Taking a break from matchmaking',
  'Found someone / In a relationship',
  'Too busy with work or studies',
  'Privacy concerns',
  'Getting too many unwanted contacts',
  'Other',
];

export const DisableAccountModal: React.FC<DisableAccountModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [reason, setReason] = useState<string>('');
  const [otherReason, setOtherReason] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDisable = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password.trim()) {
      setError('Please enter your account password to verify this action.');
      return;
    }

    setIsSubmitting(true);
    try {
      const finalReason = reason === 'Other' ? otherReason.trim() : reason;
      await disableAccountApi(password, finalReason);
      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Failed to disable account. Please check your password and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100050] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={!isSubmitting ? onClose : undefined}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden space-y-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <PauseCircle size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Disable Account</h3>
              <p className="text-[11px] text-amber-100">Temporarily deactivate your profile</p>
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
        <form onSubmit={handleDisable} className="p-6 space-y-4">
          {/* Information Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/70 text-amber-900 text-xs space-y-1.5 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-amber-950">
              <AlertCircle size={14} className="text-amber-600 shrink-0" />
              <span>What happens when you disable your account?</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800 pl-1">
              <li>Your profile will be hidden from matches and search results.</li>
              <li>Other members won't be able to send you interests or view your details.</li>
              <li>You will be signed out from all active sessions.</li>
              <li>You can reactivate your account at any time by contacting support.</li>
            </ul>
          </div>

          {/* Reason Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700">
              Reason for disabling (optional)
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-800 cursor-pointer"
            >
              <option value="">Select a reason...</option>
              {DEACTIVATE_REASONS.map((r) => (
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
                placeholder="Tell us more (optional)"
                maxLength={200}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-800"
              />
            </div>
          )}

          {/* Password Verification Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700">
              Verify Account Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                placeholder="Enter your current password"
                required
                className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 text-xs pr-10 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-800"
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
            <p className="text-[11px] text-gray-400">
              For security, please enter your password to confirm account deactivation.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2">
              <ShieldAlert size={15} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
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
              disabled={isSubmitting || !password.trim()}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <PauseCircle size={14} />
                  <span>Disable Account</span>
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
