import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useBiodata } from '../../context/BiodataContext';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import { EditProfileModal } from './EditProfileModal';
import { SignOutConfirmModal } from '../modals/SignOutConfirmModal';
import { DownloadBiodataModal } from '../modals/DownloadBiodataModal';
import { DisableAccountModal } from '../modals/DisableAccountModal';
import { DeleteAccountModal } from '../modals/DeleteAccountModal';
import { SUPPORTED_TRANSLATION_LANGUAGES } from '../../services/indicTransliterationService';
import {
  X,
  Pencil,
  ChevronRight,
  ArrowRight,
  FileText,
  Languages,
  Headphones,
  Wallet,
  Crown,
  Sparkles,
  RefreshCw,
  Settings,
  Check,
  LogOut,
  PauseCircle,
  Trash2,
  User,
  Mail,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

interface MyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MyProfileModal: React.FC<MyProfileModalProps> = ({ isOpen, onClose }) => {
  const { formData, updateFormData } = useBiodata();
  const { user, logout, showAuthToast, openPremiumCheckout, openManageSubscription } = useAuth();
  const { lang, setLang } = useI18n();

  // Sub-modals state
  const [editModalOpen, setEditModalOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('edit') === 'true' || localStorage.getItem('edit_profile_open') === 'true';
    }
    return false;
  });

  const handleOpenEditModal = () => {
    setEditModalOpen(true);
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('edit', 'true');
        window.history.replaceState(null, '', url.toString());
        localStorage.setItem('edit_profile_open', 'true');
      } catch (e) {}
    }
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete('edit');
        url.searchParams.delete('tab');
        window.history.replaceState(null, '', url.toString());
        localStorage.removeItem('edit_profile_open');
      } catch (e) {}
    }
  };

  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [membershipModalOpen, setMembershipModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Hidden download trigger button ref

  // Calculate profile completeness
  const completeness = useMemo(() => {
    const fd = formData as any;
    const checks = [
      Boolean(fd.fullName?.trim() || fd.name?.trim()),
      Boolean(fd.gender),
      Boolean(fd.dateOfBirth || fd.timeOfBirth || fd.age),
      Boolean(fd.height || fd.heightCm),
      Boolean(fd.maritalStatus),
      Boolean(fd.religion || fd.caste),
      Boolean(fd.motherTongue),
      Boolean(fd.education),
      Boolean(fd.occupation),
      Boolean(fd.city || fd.currentAddress),
      Boolean(fd.profilePictureUrl),
      Boolean(fd.aboutMe?.trim()),
    ];
    const filled = checks.filter(Boolean).length;
    const pct = Math.round((filled / checks.length) * 100);
    return Math.min(100, Math.max(30, pct));
  }, [formData]);

  // Format Name, Gender initial, Age (e.g. "Ek F, 30")
  const displayTitle = useMemo(() => {
    const fd = formData as any;
    const u = user as any;
    const rawName = fd.fullName?.trim() || fd.name?.trim() || user?.full_name?.trim() || 'User';
    // Shorten or clean name like in screenshot "Ek F, 30"
    const nameParts = rawName.split(' ');
    const shortName = nameParts[0] || 'User';

    const genderRaw = fd.gender || u?.gender || '';
    const genderInitial = genderRaw ? genderRaw.charAt(0).toUpperCase() : '';

    const ageVal = fd.age || (fd.dateOfBirth ? calculateAgeFromDob(fd.dateOfBirth) : '');

    const prefix = [shortName, genderInitial].filter(Boolean).join(' ');
    return ageVal ? `${prefix}, ${ageVal}` : prefix;
  }, [formData, user]);

  const primaryPhoto = (formData as any).profilePictureUrl || (user as any)?.profile_picture_url || '';

  const handleSignOutConfirm = async () => {
    setIsSigningOut(true);
    try {
      await logout();
      setShowSignOutConfirm(false);
      onClose();
      if (typeof window !== 'undefined') {
        try {
          const url = new URL(window.location.href);
          url.searchParams.delete('profile');
          url.searchParams.delete('edit');
          url.searchParams.delete('tab');
          window.history.replaceState(null, '', url.pathname);
        } catch (e) {}
        window.location.href = '/login';
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsSigningOut(false);
    }
  };



  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[100001] flex items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >


      <div
        className="relative w-full max-w-md min-h-screen sm:min-h-0 sm:max-h-[92vh] sm:rounded-3xl bg-[#faf8fc] sm:shadow-2xl sm:border sm:border-purple-100 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundImage: 'radial-gradient(circle at top right, rgba(254, 242, 242, 0.6), transparent 50%), radial-gradient(circle at top left, rgba(250, 245, 255, 0.6), transparent 50%)'
        }}
      >
        {/* Top Header */}
        <div className="pt-6 pb-2 px-5 sm:px-6 flex items-center justify-between shrink-0">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Profile
          </h1>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition flex items-center justify-center cursor-pointer shadow-xs border border-gray-200/60"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Main Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 pb-24 sm:pb-8 flex-1">
          {/* Card 1: Profile Summary Card */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 border border-purple-100/60 shadow-xs relative overflow-hidden">
            <div className="flex items-center gap-4">
              {/* Profile Avatar */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden bg-gradient-to-tr from-purple-100 to-pink-100 border-2 border-white shadow-sm flex items-center justify-center">
                  {primaryPhoto ? (
                    <img
                      src={primaryPhoto}
                      alt={displayTitle}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={30} className="text-purple-300" />
                  )}
                </div>
              </div>

              {/* Name & Edit Profile */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight truncate">
                    {displayTitle}
                  </h2>
                  {user?.is_premium && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-[#F01472] to-[#FF4B8B] text-white shadow-2xs shrink-0">
                      <Crown size={10} />
                      PRO
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleOpenEditModal}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#18181b] hover:bg-black text-white text-xs font-semibold shadow-xs transition cursor-pointer active:scale-95"
                >
                  <Pencil size={12} />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>

          </div>

          {/* Card 2: Profile Details Completion Card */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-purple-100/60 shadow-xs flex items-center gap-4">
            {/* Circular Progress Ring */}
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                {/* Background Ring */}
                <path
                  className="text-gray-100"
                  strokeWidth="3.6"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Progress Ring (Crimson / Red arc matching screenshot) */}
                <path
                  className="text-[#c5221f]"
                  strokeDasharray={`${completeness}, 100`}
                  strokeWidth="3.6"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-sm font-extrabold text-gray-900 tracking-tight">
                {completeness}%
              </span>
            </div>

            {/* Description & Action */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-gray-900 leading-snug">
                Profiles with 100% details get more connections
              </h3>
              <button
                type="button"
                onClick={handleOpenEditModal}
                className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-[#1a73e8] hover:text-blue-700 transition cursor-pointer active:scale-95"
              >
                <span>Complete profile</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Card 3: Action Items Menu List */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-purple-100/60 shadow-xs divide-y divide-gray-100 overflow-hidden">
            {/* 1. Download Biodata */}
            <button
              type="button"
              onClick={() => setDownloadModalOpen(true)}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-purple-50/40 transition cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <FileText size={18} className="text-gray-700 group-hover:text-purple-700 transition" />
                <span className="text-sm font-medium text-gray-800 group-hover:text-gray-900">
                  Download biodata
                </span>
              </div>
              <ChevronRight size={17} className="text-gray-400 group-hover:text-gray-600 transition" />
            </button>

            {/* 2. Change Language */}
            <button
              type="button"
              onClick={() => setLanguageModalOpen(true)}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-purple-50/40 transition cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <Languages size={18} className="text-gray-700 group-hover:text-purple-700 transition" />
                <span className="text-sm font-medium text-gray-800 group-hover:text-gray-900">
                  Change language
                </span>
              </div>
              <ChevronRight size={17} className="text-gray-400 group-hover:text-gray-600 transition" />
            </button>

            {/* 3. Help */}
            <button
              type="button"
              onClick={() => setHelpModalOpen(true)}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-purple-50/40 transition cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <Headphones size={18} className="text-gray-700 group-hover:text-purple-700 transition" />
                <span className="text-sm font-medium text-gray-800 group-hover:text-gray-900">
                  Help
                </span>
              </div>
              <ChevronRight size={17} className="text-gray-400 group-hover:text-gray-600 transition" />
            </button>

            {/* 4. Premium Subscription / 30-Day Free Trial */}
            {!user?.is_premium ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openPremiumCheckout('premium_monthly');
                }}
                className="w-full px-5 py-3.5 flex items-center justify-between text-left bg-gradient-to-r from-pink-50/90 via-rose-50/70 to-pink-50/90 hover:from-pink-100/80 hover:to-rose-100/80 transition cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#F01472] to-[#FF4B8B] text-white flex items-center justify-center shadow-xs shrink-0">
                    <Sparkles size={15} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#F01472] flex items-center gap-1.5">
                      <span>Upgrade to Premium</span>
                    </div>
                    <div className="text-[11px] font-semibold text-pink-600/85">
                      30-Day Free Trial ??? ???0 Today
                    </div>
                  </div>
                </div>
                <ChevronRight size={17} className="text-[#F01472] group-hover:translate-x-0.5 transition-transform" />
              </button>
            ) : user?.is_subscription_cancelled ? (
              <div className="w-full px-5 py-3.5 flex items-center justify-between bg-amber-50/60">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <Crown size={15} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span>PRO Access</span>
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-900">
                        Renewal Cancelled
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        openPremiumCheckout('premium_monthly');
                      }}
                      className="text-[11px] font-bold text-[#F01472] hover:underline flex items-center gap-1 mt-0.5 cursor-pointer"
                    >
                      <RefreshCw size={10} />
                      <span>Reactivate Subscription ???</span>
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openManageSubscription();
                  }}
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 underline cursor-pointer shrink-0 ml-2"
                >
                  Details
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openManageSubscription();
                }}
                className="w-full px-5 py-3.5 flex items-center justify-between text-left bg-pink-50/40 hover:bg-pink-50/80 transition cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#F01472] to-[#FF4B8B] text-white flex items-center justify-center shadow-xs shrink-0">
                    <Crown size={15} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <span>Premium Member</span>
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">
                        ACTIVE
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold text-[#F01472]">
                      Manage Subscription & Billing ???
                    </div>
                  </div>
                </div>
                <ChevronRight size={17} className="text-pink-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}

            {/* 5. Settings */}
            <button
              type="button"
              onClick={() => setSettingsModalOpen(true)}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-purple-50/40 transition cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <Settings size={18} className="text-gray-700 group-hover:text-purple-700 transition" />
                <span className="text-sm font-medium text-gray-800 group-hover:text-gray-900">
                  Settings
                </span>
              </div>
              <ChevronRight size={17} className="text-gray-400 group-hover:text-gray-600 transition" />
            </button>

            {/* 6. Logout */}
            <button
              type="button"
              onClick={() => setShowSignOutConfirm(true)}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-rose-50/50 transition cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <LogOut size={18} className="text-rose-600 group-hover:text-rose-700 transition" />
                <span className="text-sm font-semibold text-rose-600 group-hover:text-rose-700">
                  Logout
                </span>
              </div>
              <ChevronRight size={17} className="text-gray-400 group-hover:text-rose-400 transition" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Sub-Modal: Edit Profile ────────────────────────────────────────── */}
      <EditProfileModal
        isOpen={editModalOpen}
        onClose={handleCloseEditModal}
      />

      {/* ── Sub-Modal: Change Language ─────────────────────────────────────── */}
      {languageModalOpen && (
        <div
          className="fixed inset-0 z-[100003] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn notranslate"
          translate="no"
          onClick={() => setLanguageModalOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl border border-gray-100 space-y-4 notranslate"
            translate="no"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Languages size={18} className="text-[#F01472]" />
                <h3 className="text-base font-bold text-gray-900">Choose Language</h3>
              </div>
              <button
                type="button"
                onClick={() => setLanguageModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
              {SUPPORTED_TRANSLATION_LANGUAGES.map((item) => {
                const isSelected = (formData.lang || lang || 'en') === item.code;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setLang(item.code);
                      updateFormData({ lang: item.code, motherTongue: item.name || formData.motherTongue });
                      setLanguageModalOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 rounded-2xl text-left text-xs flex items-center justify-between transition cursor-pointer ${
                      isSelected
                        ? 'bg-rose-50 text-[#F01472] font-bold border border-rose-200'
                        : 'bg-gray-50/80 text-gray-700 hover:bg-gray-100 border border-transparent font-medium'
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-sm">{item.nativeName || item.name}</span>
                      <span className="text-gray-400 text-[11px] ml-2">({item.name})</span>
                    </div>
                    {isSelected && <Check size={16} className="text-[#F01472]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Sub-Modal: Help ───────────────────────────────────────────────── */}
      {helpModalOpen && (
        <div
          className="fixed inset-0 z-[100003] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn"
          onClick={() => setHelpModalOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Headphones size={18} className="text-[#F01472]" />
                <h3 className="text-base font-bold text-gray-900">Help & Support</h3>
              </div>
              <button
                type="button"
                onClick={() => setHelpModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Need assistance with your profile, matches, or biodata? Reach our support team anytime.
            </p>

            <div className="space-y-2.5">
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noreferrer"
                className="w-full p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2.5">
                  <MessageCircle size={18} className="text-emerald-600" />
                  <div>
                    <div className="text-xs font-bold">WhatsApp Helpline</div>
                    <div className="text-[11px] text-emerald-600">Quick 24/7 support</div>
                  </div>
                </div>
                <ExternalLink size={14} className="text-emerald-500" />
              </a>

              <a
                href="mailto:support@truemarriage.com"
                className="w-full p-3.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2.5">
                  <Mail size={18} className="text-purple-600" />
                  <div>
                    <div className="text-xs font-bold">Email Support</div>
                    <div className="text-[11px] text-purple-600">support@truemarriage.com</div>
                  </div>
                </div>
                <ExternalLink size={14} className="text-purple-500" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Sub-Modal: Membership Details ─────────────────────────────────── */}
      {membershipModalOpen && (
        <div
          className="fixed inset-0 z-[100003] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn"
          onClick={() => setMembershipModalOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Wallet size={18} className="text-[#F01472]" />
                <h3 className="text-base font-bold text-gray-900">Membership Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setMembershipModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 border border-purple-100 text-center space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 bg-purple-100/80 px-2.5 py-0.5 rounded-full">
                Active Plan
              </span>
              <h4 className="text-base font-bold text-gray-900 pt-1">Free Lifetime Access</h4>
              <p className="text-xs text-gray-600 font-medium">15/15 Unlocks Remaining</p>
            </div>

            <div className="space-y-2 text-xs text-gray-700">
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-600 shrink-0" />
                <span>Unlimited profile search & recommendations</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-600 shrink-0" />
                <span>Direct WhatsApp contact unlocks</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-600 shrink-0" />
                <span>High-resolution PDF biodata downloads</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Sub-Modal: Settings ───────────────────────────────────────────── */}
      {settingsModalOpen && (
        <div
          className="fixed inset-0 z-[100003] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn"
          onClick={() => setSettingsModalOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Settings size={18} className="text-[#F01472]" />
                <h3 className="text-base font-bold text-gray-900">Account Settings</h3>
              </div>
              <button
                type="button"
                onClick={() => setSettingsModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-gray-700">
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="text-[11px] text-gray-400">Registered Email</div>
                <div className="font-semibold text-gray-800 truncate">{user?.email || formData.email || 'Not connected'}</div>
              </div>

              {formData.contactNumber && (
                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="text-[11px] text-gray-400">Phone Number</div>
                  <div className="font-semibold text-gray-800">{formData.contactNumber}</div>
                </div>
              )}
            </div>

            {/* Account Management & Security Options */}
            <div className="pt-2 border-t border-gray-100 space-y-2">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">
                Account Actions
              </div>

              {/* Option 1: Disable Account */}
              <button
                type="button"
                onClick={() => {
                  setSettingsModalOpen(false);
                  setShowDisableModal(true);
                }}
                className="w-full py-2.5 px-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-200/80 text-xs font-semibold transition flex items-center justify-between group cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <PauseCircle size={15} />
                  </div>
                  <div>
                    <div className="font-bold text-amber-900 text-xs">Disable Account</div>
                    <div className="text-[10px] text-amber-700 font-normal">Temporarily pause and hide profile</div>
                  </div>
                </div>
                <ChevronRight size={14} className="text-amber-500 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Option 2: Delete Account */}
              <button
                type="button"
                onClick={() => {
                  setSettingsModalOpen(false);
                  setShowDeleteModal(true);
                }}
                className="w-full py-2.5 px-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100/80 text-rose-900 border border-rose-200/80 text-xs font-semibold transition flex items-center justify-between group cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                    <Trash2 size={15} />
                  </div>
                  <div>
                    <div className="font-bold text-rose-900 text-xs">Delete Account</div>
                    <div className="text-[10px] text-rose-700 font-normal">Permanently delete profile and data</div>
                  </div>
                </div>
                <ChevronRight size={14} className="text-rose-500 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setSettingsModalOpen(false);
                setShowSignOutConfirm(true);
              }}
              className="w-full py-2.5 px-4 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Sub-Modal: Sign Out Confirmation ──────────────────────────────── */}
      <SignOutConfirmModal
        isOpen={showSignOutConfirm}
        onClose={() => setShowSignOutConfirm(false)}
        onConfirm={handleSignOutConfirm}
        isLoading={isSigningOut}
      />

      {/* Sub-Modal: Disable Account Verification */}
      <DisableAccountModal
        isOpen={showDisableModal}
        onClose={() => setShowDisableModal(false)}
        onSuccess={async () => {
          setShowDisableModal(false);
          onClose();
          await logout();
          showAuthToast?.('Your account has been temporarily disabled.');
        }}
      />

      {/* Sub-Modal: Delete Account Verification */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onSuccess={async () => {
          setShowDeleteModal(false);
          onClose();
          await logout();
          showAuthToast?.('Your account and personal data have been permanently deleted.');
        }}
      />

      {/* Sub-Modal: Download Biodata Options (Last Used or Choose Template) */}
      <DownloadBiodataModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        onNavigateToTemplates={() => {
          setDownloadModalOpen(false);
          onClose();
        }}
      />
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};

// Helper: calculate age from date of birth
function calculateAgeFromDob(dobString: string): string {
  try {
    const dob = new Date(dobString);
    if (isNaN(dob.getTime())) return '';
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    return age > 0 && age < 120 ? String(age) : '';
  } catch {
    return '';
  }
}
