import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ShieldCheck, Check, Globe, BarChart3, Sliders, Trash2, Sparkles } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';

interface CookiePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface CookieSettings {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  personalization: boolean;
}

const STORAGE_KEY = 'tm_cookie_preferences';

const DEFAULT_SETTINGS: CookieSettings = {
  necessary: true,
  functional: true,
  analytics: true,
  personalization: true,
};

export const CookiePreferencesModal: React.FC<CookiePreferencesModalProps> = ({ isOpen, onClose }) => {
  const { t } = useI18n();
  const [settings, setSettings] = useState<CookieSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setSettings(JSON.parse(saved));
      } catch {}
    }
  }, [isOpen]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleSave = (customSettings?: CookieSettings) => {
    const toSave = customSettings || settings;
    setSettings(toSave);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {}

    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 900);
  };

  const handleAcceptAll = () => {
    const allOn: CookieSettings = {
      necessary: true,
      functional: true,
      analytics: true,
      personalization: true,
    };
    handleSave(allOn);
  };

  const handleRejectNonEssential = () => {
    const essentialOnly: CookieSettings = {
      necessary: true,
      functional: false,
      analytics: false,
      personalization: false,
    };
    handleSave(essentialOnly);
  };

  const handleClearOptionalData = () => {
    const obsoleteCookies = ['googtrans', 'googtrans_opt', 'googtrans_domain', '_googtrans'];
    const paths = ['/', window.location.pathname, ''];
    paths.forEach((p) => {
      obsoleteCookies.forEach((c) => {
        document.cookie = `${c}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${p};`;
      });
    });
    sessionStorage.clear();
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 900);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100005] flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      style={{ isolation: 'isolate' }}
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-[#FFF5F8] via-[#FFEAF3] to-[#FFF0F6] border-b border-pink-100 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F01472] text-white flex items-center justify-center shadow-md shadow-pink-300/40 shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#1e1b4b] tracking-tight">
                  {t('Cookie Preferences')}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-pink-100/80 text-[#F01472] text-[10px] font-bold border border-pink-200/60">
                  {t('Privacy Control')}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{t('Customize how TrueMarriage stores data in your browser')}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-gray-700 flex items-center justify-center border border-pink-200/60 shadow-2xs transition-all cursor-pointer"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-800 text-xs flex-1 bg-white">
          {savedToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 font-bold animate-fade-in">
              <Check size={16} className="text-emerald-600 shrink-0" />
              <span>{t('Your cookie preferences have been successfully updated!')}</span>
            </div>
          )}

          <p className="text-slate-600 leading-relaxed">
            {t(
              'We use cookies and local browser storage to provide a seamless matrimonial matchmaking experience, maintain secure authentication sessions, and remember your language and biodata preferences.'
            )}
          </p>

          {/* 1. Necessary Cookies */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
                <span className="font-extrabold text-sm text-slate-900">{t('Strictly Necessary')}</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                {t('Always Active')}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              {t(
                'Essential for logging in, protecting form drafts, profile security verification, and preventing spam. These cannot be switched off.'
              )}
            </p>
          </div>

          {/* 2. Functional & Language */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-purple-600 shrink-0" />
                <span className="font-extrabold text-sm text-slate-900">{t('Language & Localization')}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.functional}
                  onChange={(e) => setSettings((prev) => ({ ...prev, functional: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#F01472]"></div>
              </label>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              {t(
                'Remembers your chosen Indian language (Hindi, Marathi, Gujarati, etc.) and avoids resetting translation preferences when revisiting.'
              )}
            </p>
          </div>

          {/* 3. Analytics & Experience */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 size={18} className="text-blue-600 shrink-0" />
                <span className="font-extrabold text-sm text-slate-900">{t('Analytics & Performance')}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.analytics}
                  onChange={(e) => setSettings((prev) => ({ ...prev, analytics: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#F01472]"></div>
              </label>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              {t(
                'Helps us understand profile view metrics, visitor discovery counts, and optimize page load speeds across India.'
              )}
            </p>
          </div>

          {/* 4. Personalization */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders size={18} className="text-pink-600 shrink-0" />
                <span className="font-extrabold text-sm text-slate-900">{t('Matching Personalization')}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.personalization}
                  onChange={(e) => setSettings((prev) => ({ ...prev, personalization: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#F01472]"></div>
              </label>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              {t(
                'Remembers your favorite biodata template layout, last searched community filters, and shortlisted matches.'
              )}
            </p>
          </div>

          {/* Clean Optional Cookies Action */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-[11px] text-slate-500">
            <span>{t('Want to wipe optional session caches?')}</span>
            <button
              type="button"
              onClick={handleClearOptionalData}
              className="inline-flex items-center gap-1 font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
            >
              <Trash2 size={12} />
              <span>{t('Clear Cache')}</span>
            </button>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="px-6 py-3.5 bg-gray-50/90 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleRejectNonEssential}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white hover:bg-gray-100 text-gray-700 font-bold text-xs border border-gray-200 transition cursor-pointer"
          >
            {t('Reject Non-Essential')}
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleAcceptAll}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-pink-50 hover:bg-pink-100/80 text-[#F01472] font-bold text-xs border border-pink-200 transition cursor-pointer"
            >
              {t('Accept All')}
            </button>

            <button
              type="button"
              onClick={() => handleSave()}
              className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-[#F01472] hover:bg-[#D00F60] text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Sparkles size={13} />
              <span>{t('Save Preferences')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
