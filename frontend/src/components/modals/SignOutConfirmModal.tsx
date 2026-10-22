import React from 'react';
import { createPortal } from 'react-dom';
import { LogOut, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SignOutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
}

export const SignOutConfirmModal: React.FC<SignOutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100060] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 overflow-hidden text-center"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {/* Icon */}
          <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-100 shadow-xs">
            <LogOut size={26} className="text-[#F01472]" />
          </div>

          {/* Title & Prompt */}
          <h3 className="text-lg font-extrabold text-slate-900 mb-2">
            Are you sure you want to sign out?
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-6">
            You will need to sign in again to access your biodata, shortlisted profiles, and chats.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#F01472] to-[#C80E5A] hover:from-[#C80E5A] hover:to-[#A00B47] text-white text-xs font-bold shadow-md shadow-pink-500/20 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogOut size={14} />
                  <span>Yes, Sign Out</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};
