import React from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  User,
  GraduationCap,
  Users,
  Moon,
  Phone,
  Scroll,
  RotateCcw,
  Check,
  ChevronRight,
} from 'lucide-react';
import type { TabKey } from '../profile/EditProfileModal';

interface PersonalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEditSection: (tab: TabKey) => void;
  onOpenHeaderMotif: () => void;
  onOpenShloka: () => void;
  onChangeTemplate: () => void;
  activeTemplateName?: string;
}

export const PersonalizationModal: React.FC<PersonalizationModalProps> = ({
  isOpen,
  onClose,
  onOpenEditSection,
  onOpenHeaderMotif,
  onOpenShloka,
  onChangeTemplate,
  activeTemplateName = 'Current Template',
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden flex flex-col max-h-[90vh] animate-scale-up"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-rose-50/80 via-white to-pink-50/60 border-b border-rose-100/80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E11D48] animate-pulse" />
              <h2 className="text-lg font-bold text-slate-900">Personalize Biodata</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Update details, auspicious symbols, or choose another template
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-rose-100/70 text-slate-500 hover:text-slate-800 transition flex items-center justify-center cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-5 overflow-y-auto space-y-6">
          {/* Section: Content */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                Biodata Content
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Instant live preview</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenEditSection('personal');
                }}
                className="group flex items-center justify-between p-3 rounded-2xl border border-slate-200/90 hover:border-rose-300 hover:bg-rose-50/40 transition cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:bg-rose-100 transition">
                    <User size={16} />
                  </div>
                  <div className="truncate">
                    <span className="block text-xs font-semibold text-slate-800 group-hover:text-rose-700">
                      Personal Details
                    </span>
                    <span className="block text-[10.5px] text-slate-400 truncate">
                      Name, Age, Caste, Height
                    </span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition shrink-0 ml-1" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenEditSection('career');
                }}
                className="group flex items-center justify-between p-3 rounded-2xl border border-slate-200/90 hover:border-rose-300 hover:bg-rose-50/40 transition cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition">
                    <GraduationCap size={16} />
                  </div>
                  <div className="truncate">
                    <span className="block text-xs font-semibold text-slate-800 group-hover:text-amber-700">
                      Education & Career
                    </span>
                    <span className="block text-[10.5px] text-slate-400 truncate">
                      Degree, Job, Income
                    </span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition shrink-0 ml-1" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenEditSection('family');
                }}
                className="group flex items-center justify-between p-3 rounded-2xl border border-slate-200/90 hover:border-rose-300 hover:bg-rose-50/40 transition cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-100 transition">
                    <Users size={16} />
                  </div>
                  <div className="truncate">
                    <span className="block text-xs font-semibold text-slate-800 group-hover:text-purple-700">
                      Family Details
                    </span>
                    <span className="block text-[10.5px] text-slate-400 truncate">
                      Parents, Siblings, Native
                    </span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition shrink-0 ml-1" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenEditSection('astro');
                }}
                className="group flex items-center justify-between p-3 rounded-2xl border border-slate-200/90 hover:border-rose-300 hover:bg-rose-50/40 transition cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition">
                    <Moon size={16} />
                  </div>
                  <div className="truncate">
                    <span className="block text-xs font-semibold text-slate-800 group-hover:text-indigo-700">
                      Horoscope & Kundali
                    </span>
                    <span className="block text-[10.5px] text-slate-400 truncate">
                      Rashi, Nakshatra, Manglik
                    </span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition shrink-0 ml-1" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenEditSection('contact');
                }}
                className="group flex items-center justify-between p-3 rounded-2xl border border-slate-200/90 hover:border-rose-300 hover:bg-rose-50/40 transition cursor-pointer text-left sm:col-span-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition">
                    <Phone size={16} />
                  </div>
                  <div className="truncate">
                    <span className="block text-xs font-semibold text-slate-800 group-hover:text-emerald-700">
                      Contact & Address
                    </span>
                    <span className="block text-[10.5px] text-slate-400 truncate">
                      Phone number, Email address, Residence
                    </span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition shrink-0 ml-1" />
              </button>
            </div>
          </div>

          {/* Section: Design & Auspicious Motifs */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                Auspicious Design
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Symbols & sacred verses</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenHeaderMotif();
                }}
                className="group flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/90 hover:border-amber-300 hover:bg-amber-50/40 transition cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-sm shrink-0">
                    🙏
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-slate-800 group-hover:text-amber-800">
                      Header & Symbol
                    </span>
                    <span className="block text-[10.5px] text-slate-400">
                      Ganesha, Om, Swastika, Khanda
                    </span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-amber-700 transition shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenShloka();
                }}
                className="group flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/90 hover:border-amber-300 hover:bg-amber-50/40 transition cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center text-xs shrink-0">
                    <Scroll size={15} />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-slate-800 group-hover:text-rose-800">
                      Wedding Shloka
                    </span>
                    <span className="block text-[10.5px] text-slate-400">
                      Vakratunda Mahakaya, etc.
                    </span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-rose-700 transition shrink-0" />
              </button>
            </div>
          </div>

          {/* Section: Template Selection */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-slate-50 to-rose-50/30 border border-slate-200/80">
              <div className="min-w-0 mr-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Active Template
                </span>
                <span className="text-xs font-bold text-slate-800 truncate block mt-0.5">
                  {activeTemplateName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onChangeTemplate();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 hover:text-rose-800 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer shrink-0"
              >
                <RotateCcw size={12} />
                <span>Change Template</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <Check size={14} />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
