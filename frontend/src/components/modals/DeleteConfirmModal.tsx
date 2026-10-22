import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Trash2, X, Loader2, ChevronDown } from 'lucide-react';

export const DELETION_REASONS = [
  'I found a partner',
  'I no longer need the service',
  'Not satisfied with the service',
  'Privacy concerns',
  'Too many notifications',
  'Other',
] as const;

export type DeletionReason = (typeof DELETION_REASONS)[number];

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string, feedback?: string) => Promise<void>;
  /** The value the user must type to unlock deletion (usually the profile name or ID) */
  confirmValue: string;
  /** Display name shown in the warning message */
  profileName: string;
  /** Optional label for the input prompt (default: "profile name") */
  confirmLabel?: string;
  /** Whether reason selection is required before deletion (default: true) */
  requireReason?: boolean;
  /** Optional modal header title (default: "Delete Profile") */
  title?: string;
  /** Optional entity description for warning message (default: "the profile") */
  entityType?: string;
  /** Optional confirm button label (default: "Delete Profile") */
  buttonText?: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  confirmValue,
  profileName,
  requireReason = true,
  title = 'Delete Profile',
  entityType = 'the profile',
  buttonText = 'Delete Profile',
}) => {
  const [typed, setTyped] = useState('');
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [otherFeedback, setOtherFeedback] = useState<string>('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setTyped('');
      setSelectedReason('');
      setOtherFeedback('');
      setError(null);
      setDeleting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isMatch = typed.trim() === confirmValue.trim();
  const isReasonValid = !requireReason || Boolean(selectedReason);
  const isReadyToConfirm = isMatch && isReasonValid && !deleting;

  const handleConfirm = async () => {
    if (!isReadyToConfirm) return;
    setDeleting(true);
    setError(null);
    try {
      const feedback = selectedReason === 'Other' ? otherFeedback.trim() : undefined;
      await onConfirm(selectedReason || undefined, feedback);
    } catch (e: any) {
      setError(e?.message || 'Deletion failed. Please try again.');
      setDeleting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isReadyToConfirm) handleConfirm();
    if (e.key === 'Escape') onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100060] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
        onClick={!deleting ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn flex flex-col max-h-[90vh]">
        {/* Red danger header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <AlertTriangle size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-black text-sm">{title}</h2>
              <p className="text-red-100 text-[11px] font-medium">This action cannot be undone</p>
            </div>
          </div>
          {!deleting && (
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition cursor-pointer"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 overflow-y-auto">
          {/* Warning text */}
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-100">
            <p className="text-red-700 text-xs font-medium leading-relaxed">
              This will <strong>permanently delete</strong> {entityType}{' '}
              <span className="font-black text-red-800">"{profileName}"</span>{' '}
              and all associated data. This action is <strong>irreversible</strong> and cannot be recovered.
            </p>
          </div>

          {/* Reason selection */}
          {requireReason && (
            <div className="space-y-1.5">
              <label htmlFor="delete-reason-select" className="text-xs font-bold text-slate-700 block">
                Why are you deleting your profile? <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="delete-reason-select"
                  value={selectedReason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  disabled={deleting}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-red-200 appearance-none cursor-pointer pr-10 ${
                    selectedReason
                      ? 'border-slate-300 bg-white text-slate-900'
                      : 'border-slate-300 bg-slate-50/70 text-slate-500'
                  }`}
                >
                  <option value="" disabled>
                    Select a reason...
                  </option>
                  {DELETION_REASONS.map((r) => (
                    <option key={r} value={r} className="text-slate-900">
                      {r}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>
          )}

          {/* Additional feedback if Other is selected */}
          {requireReason && selectedReason === 'Other' && (
            <div className="space-y-1.5 animate-fadeIn">
              <label htmlFor="delete-other-feedback" className="text-xs font-bold text-slate-700 block">
                Additional Feedback
              </label>
              <textarea
                id="delete-other-feedback"
                rows={3}
                value={otherFeedback}
                onChange={(e) => setOtherFeedback(e.target.value)}
                disabled={deleting}
                placeholder="Please tell us what we could have done better or why you are leaving..."
                maxLength={500}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 transition focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 resize-none placeholder:text-slate-400"
              />
            </div>
          )}

          {/* Confirmation input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Please type{' '}
              <code className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-800 font-mono text-[11px]">
                {confirmValue}
              </code>{' '}
              to confirm:
            </label>
            <input
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={deleting}
              placeholder={`Type "${confirmValue}"`}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono font-medium transition focus:outline-none text-slate-900 ${
                typed.length > 0 && !isMatch
                  ? 'border-red-400 bg-red-50/50 focus:ring-2 focus:ring-red-200'
                  : isMatch
                  ? 'border-green-500 bg-green-50/50 focus:ring-2 focus:ring-green-200'
                  : 'border-slate-300 bg-white focus:ring-2 focus:ring-slate-200'
              }`}
              style={{ color: '#0f172a' }}
            />
            {typed.length > 0 && !isMatch && (
              <p className="text-xs text-red-500 font-medium">
                Doesn't match — check capitalization and spacing.
              </p>
            )}
            {isMatch && requireReason && !selectedReason && (
              <p className="text-xs text-amber-600 font-medium">
                Please select a reason above to proceed.
              </p>
            )}
          </div>

          {/* API error */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 pt-2 flex items-center justify-end gap-3 shrink-0 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!isReadyToConfirm}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-black transition flex items-center gap-2 shadow-md shadow-red-500/25 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {deleting ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={13} />
                {buttonText}
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
