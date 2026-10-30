import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import { useBiodata } from '../../context/BiodataContext';
import { QRCodeModal } from '../profile/QRCodeModal';
import { DownloadBiodataButton } from '../common/DownloadBiodataButton';
import { EditProfileModal } from '../profile/EditProfileModal';
import { SignOutConfirmModal } from '../modals/SignOutConfirmModal';
import { sendInterestApi } from '../../services/interestService';
import { getCompatibilityInsightApi, type CompatibilityInsightData } from '../../services/discoveryService';
import {
  X,
  Heart,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  MapPin,
  Sparkles,
  Users,
  Smile,
  Clock,
  Share2,
  Check,
  Coffee,
  Mail,
  Bookmark,
  AlertTriangle,
  ArrowRight,
  LogOut,
  Palette,
  Shield,
  Phone,
  Lock,
  QrCode,
  Copy,
  Camera,
  Trash2,
  User as UserIcon,
  Edit3,
  Crop,
  MoreVertical,
} from 'lucide-react';
import type { DetailedProfile, TrueMatchBreakdown } from '../../types/discovery';

export interface ProfilePublicModalProps {
  profile: DetailedProfile | null;
  breakdown: TrueMatchBreakdown | null;
  isOpen: boolean;
  onClose: () => void;
  onSendInterest?: (profileId: string, options?: { silent?: boolean }) => Promise<void> | void;
  onToggleShortlist?: (profileId: string, options?: { silent?: boolean }) => void;
  onToggleSave?: (profileId: string, options?: { silent?: boolean }) => void;
  isShortlisted?: boolean;
  isSaved?: boolean;
  hasSentInterest?: boolean;
  isOwnProfile?: boolean;
}

export const ProfilePublicModal: React.FC<ProfilePublicModalProps> = ({
  profile,
  breakdown,
  isOpen,
  onClose,
  onSendInterest,
  onToggleShortlist,
  onToggleSave,
  isShortlisted = false,
  isSaved = false,
  hasSentInterest = false,
  isOwnProfile = false,
}) => {
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);
  const [localShortlisted, setLocalShortlisted] = useState(isShortlisted);
  const [localSaved, setLocalSaved] = useState(isSaved);
  const [localInterestSent, setLocalInterestSent] = useState(hasSentInterest);
  const [isSendingInterest, setIsSendingInterest] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [unhiddenPhone, setUnhiddenPhone] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('edit') === 'true' || localStorage.getItem('edit_profile_open') === 'true';
    }
    return false;
  });
  const [urlCopied, setUrlCopied] = useState(false);
  const [aiInsight, setAiInsight] = useState<CompatibilityInsightData | null>(null);
  const [loadingAiInsight, setLoadingAiInsight] = useState(true);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const {
    wizardCompleted,
    completionScore,
    goToWizard,
    goToStudio,
    goToInteractions,
    profileId,
    slug,
    formData,
    updateFormData,
    openCropper,
  } = useBiodata();
  const { user, logout, isAuthenticated, openLogin, openPremiumCheckout } = useAuth();
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (hasSentInterest) {
      setLocalInterestSent(true);
      return;
    }
    if (user?.id && profile) {
      try {
        const userSaved = localStorage.getItem(`tm_interest_sent_profiles_${user.id}`);
        if (userSaved) {
          const parsed = JSON.parse(userSaved);
          if (parsed.includes(profile.id) || (profile.slug && parsed.includes(profile.slug))) {
            setLocalInterestSent(true);
          }
        }
      } catch {}
    }
  }, [hasSentInterest, user?.id, profile?.id, profile?.slug]);

  useEffect(() => {
    setLocalShortlisted(isShortlisted);
  }, [isShortlisted]);

  useEffect(() => {
    setLocalSaved(isSaved);
  }, [isSaved]);

  useEffect(() => {
    setUnhiddenPhone(false);
  }, [profile?.id, profile?.slug]);

  const isOwn = Boolean(
    isOwnProfile ||
      profile?.id === 'my_profile' ||
      profile?.id === 'my-profile' ||
      (profileId && profile?.id && profile.id.toLowerCase() === profileId.toLowerCase()) ||
      (user?.id && profile?.id && profile.id.toLowerCase() === user.id.toLowerCase()) ||
      (slug && profile?.slug && profile.slug.toLowerCase() === slug.toLowerCase())
  );

  useEffect(() => {
    if (!isOpen || !profile || isOwn) {
      setAiInsight(null);
      setLoadingAiInsight(false);
      return;
    }
    let isMounted = true;
    const targetId = profile.id || profile.slug || '';
    if (!targetId) return;

    setLoadingAiInsight(true);
    getCompatibilityInsightApi(targetId)
      .then((data) => {
        if (isMounted && data) {
          setAiInsight(data);
        }
      })
      .catch((err) => {
        console.error('Failed to load compatibility insight:', err);
      })
      .finally(() => {
        if (isMounted) {
          setLoadingAiInsight(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, profile?.id, profile?.slug, isOwn]);


  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        if (src) {
          openCropper(src, (croppedUrl, originalUrl, filterId) => {
            const rawSource = originalUrl || src;
            const chosenFilter = filterId || 'normal';
            updateFormData({
              profilePictureUrl: croppedUrl,
              originalProfilePictureUrl: rawSource,
              profilePhotoFilter: chosenFilter,
            });
            if (profile) {
              profile.profileImage = croppedUrl;
              profile.originalProfileImage = rawSource;
              profile.photoFilter = chosenFilter;
            }
            setToastMessage('Profile photo updated successfully');
            setTimeout(() => setToastMessage(null), 3000);
          }, src, 'normal');
        }
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handlePhotoRemove = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    updateFormData({
      profilePictureUrl: '',
      originalProfilePictureUrl: '',
      profilePhotoFilter: 'normal',
    });
    if (profile) {
      profile.profileImage = '';
      profile.originalProfileImage = '';
      profile.photoFilter = 'normal';
    }
    if (photoInputRef.current) {
      photoInputRef.current.value = '';
    }
    setToastMessage('Profile photo removed');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const isProfileIncomplete = Boolean(
    isOwn &&
      !profileId &&
      !wizardCompleted &&
      completionScore < 20 &&
      !formData?.gender &&
      !formData?.maritalStatus
  );

  const cleanSlug = (str?: string | null) => {
    if (!str || !str.trim()) return '';
    return str
      .toLowerCase()
      .trim()
      .split('@')[0]
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const profileIdentifier = isOwn
    ? (
        slug ||
        cleanSlug(formData?.name) ||
        cleanSlug(user?.full_name) ||
        cleanSlug(profile?.name) ||
        profileId ||
        cleanSlug(user?.email) ||
        (profile?.id && profile.id !== 'my_profile' && profile.id !== 'my-profile' ? profile.id : 'profile')
      )
    : (
        profile?.slug ||
        cleanSlug(profile?.name) ||
        profile?.id ||
        ''
      );

  const publicProfileUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/${profileIdentifier}`
    : `/${profileIdentifier}`;

  useEffect(() => {
    if (isOpen && profile) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      setSelectedPhotoIdx(0);

      // Clean Instagram-style URL pushState (e.g. /username)
      const originalPath = window.location.pathname + window.location.search;
      const targetUrl = `/${profileIdentifier}`;

      if (window.location.pathname !== targetUrl) {
        window.history.pushState({ modalOpen: true, originalPath }, '', targetUrl);
      }

      const handlePopState = () => {
        onClose();
      };
      window.addEventListener('popstate', handlePopState);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('popstate', handlePopState);
        if (window.location.pathname === targetUrl || window.location.pathname.startsWith('/profile/')) {
          window.history.replaceState(null, '', originalPath || '/');
        }
      };
    }
  }, [isOpen, profile, profileIdentifier, onClose]);

  if (!isOpen || !profile) return null;

  const myPhoto = isOwn ? (formData?.profilePictureUrl || profile.profileImage) : profile.profileImage;
  const allPhotos = [myPhoto, ...(profile.additionalPhotos || [])].filter(Boolean);
  const activePhoto = allPhotos[selectedPhotoIdx] || myPhoto;
  const score = breakdown?.overallScore || 95;

  const ownPhone =
    formData?.contactTo ||
    formData?.contactNumber ||
    formData?.phone ||
    (user as any)?.phone ||
    profile?.contactTo ||
    profile?.contact_to ||
    profile?.phone ||
    '';
  const displayOwnPhone = ownPhone ? (ownPhone.startsWith('+') ? ownPhone : `+91 ${ownPhone}`) : 'Verified';

  const isContactLocked = Boolean(
    (profile as any)?.is_contact_locked ||
    profile?.hideContactDetails ||
    (profile as any)?.hide_contact_details
  );

  const rawTargetPhone =
    profile?.contactTo ||
    profile?.contact_to ||
    profile?.contactDetails?.contact_to ||
    profile?.phone ||
    profile?.contactDetails?.phone ||
    (profile as any)?.contact_number ||
    (profile as any)?.contactNumber ||
    '';
  const maskedPhoneDisplay = (() => {
    if ((profile as any)?.masked_phone) return (profile as any).masked_phone;
    if (rawTargetPhone && rawTargetPhone.replace(/\D/g, '').length >= 6) {
      const digits = rawTargetPhone.replace(/\D/g, '');
      const prefix = digits.slice(0, 2);
      const suffix = digits.slice(-2);
      return `+91 ${prefix}•••• ••${suffix}`;
    }
    return '+91 ••••• •••••';
  })();

  const fullPhoneToDisplay = (() => {
    if (rawTargetPhone && rawTargetPhone.replace(/\D/g, '').length >= 6) {
      const digits = rawTargetPhone.replace(/\D/g, '');
      if (digits.length === 10) {
        return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
      }
      if (digits.length === 12 && digits.startsWith('91')) {
        return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
      }
      if (rawTargetPhone.startsWith('+')) return rawTargetPhone;
      return `+91 ${rawTargetPhone}`;
    }
    return '';
  })();

  const handleShortlist = () => {
    const nextState = !localShortlisted;
    setLocalShortlisted(nextState);
    setToastMessage(nextState ? 'Profile added to your shortlist' : 'Removed from shortlist');
    setTimeout(() => setToastMessage(null), 3000);
    if (onToggleShortlist) {
      onToggleShortlist(profile.id, { silent: true });
    } else {
      try {
        const stored = JSON.parse(localStorage.getItem('tm_shortlisted_profiles') || '[]');
        const updated = nextState
          ? Array.from(new Set([...stored, profile.id, profile.slug].filter(Boolean)))
          : stored.filter((id: string) => id !== profile.id && id !== profile.slug);
        localStorage.setItem('tm_shortlisted_profiles', JSON.stringify(updated));
      } catch {}
    }
  };

  const handleSave = () => {
    const nextState = !localSaved;
    setLocalSaved(nextState);
    setToastMessage(nextState ? 'Profile saved to your Bookmarks' : 'Removed from Saved Profiles');
    setTimeout(() => setToastMessage(null), 3000);
    if (onToggleSave) {
      onToggleSave(profile.id, { silent: true });
    } else {
      try {
        const stored = JSON.parse(localStorage.getItem('tm_saved_profiles') || '[]');
        const updated = nextState
          ? Array.from(new Set([...stored, profile.id, profile.slug].filter(Boolean)))
          : stored.filter((id: string) => id !== profile.id && id !== profile.slug);
        localStorage.setItem('tm_saved_profiles', JSON.stringify(updated));
      } catch {}
    }
  };

  const handleSendInterest = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!profile) return;
    if (!isAuthenticated) {
      setToastMessage('Please log in to send interest.');
      setTimeout(() => setToastMessage(null), 3000);
      if (openLogin) openLogin();
      return;
    }
    if (localInterestSent || isSendingInterest) return;

    setIsSendingInterest(true);
    try {
      if (onSendInterest) {
        await onSendInterest(profile.id, { silent: true });
        setToastMessage('Interest sent successfully');
      } else {
        const targetId = profile.id || profile.slug || '';
        const res = await sendInterestApi(targetId);
        setToastMessage(res?.message || 'Interest sent successfully');
        if (user?.id) {
          try {
            const key = `tm_interest_sent_profiles_${user.id}`;
            const current = JSON.parse(localStorage.getItem(key) || '[]');
            const updated = Array.from(new Set([...current, profile.id, profile.slug].filter(Boolean)));
            localStorage.setItem(key, JSON.stringify(updated));
            localStorage.setItem('tm_interest_sent_profiles', JSON.stringify(updated));
          } catch {}
        }
      }
      setLocalInterestSent(true);
      window.dispatchEvent(new CustomEvent('interest:sent', { detail: { profileId: profile.id } }));
    } catch (err: any) {
      const msg = err?.message || 'Failed to send interest';
      setToastMessage(msg);
      if (msg.toLowerCase().includes('already exists')) {
        setLocalInterestSent(true);
      }
    } finally {
      setIsSendingInterest(false);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleShare = () => {
    const shareUrl = publicProfileUrl || window.location.href;
    const name = profile.name || 'Candidate';
    const lines: string[] = [
      `✨ *Matrimonial Profile of ${name}* ✨`,
      `━━━━━━━━━━━━━━━━━━━━━`,
    ];
    if (profile.age > 0) lines.push(`🎂 Age: ${profile.age} yrs`);
    if (profile.height) lines.push(`📏 Height: ${profile.height}`);
    if (profile.religion || profile.community) {
      lines.push(`🕊️ Community: ${[profile.religion, profile.community].filter(Boolean).join(' - ')}`);
    }
    if (profile.education) lines.push(`🎓 Education: ${profile.education}`);
    if (profile.profession) lines.push(`💼 Profession: ${profile.profession}${profile.company ? ` at ${profile.company}` : ''}`);
    if (profile.annualIncome) lines.push(`💰 Income: ${profile.annualIncome}`);
    if (profile.location || profile.city) lines.push(`🏠 Location: ${profile.location || profile.city}`);
    if (profile.nativePlace) lines.push(`📍 Native: ${profile.nativePlace}`);
    lines.push(`\n🔗 View Verified Profile: ${shareUrl}`);
    lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`_Shared via TrueMarriage_`);
    const text = lines.join('\n');

    if (navigator.share) {
      navigator.share({
        title: `${profile.name} - Matrimonial Profile | TrueMarriage`,
        text: text,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setToastMessage('Profile details & link copied to clipboard');
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  const modalContent = (
    <div
      className={`fixed top-0 inset-x-0 ${
        isAuthenticated
          ? 'bottom-[calc(3.75rem+env(safe-area-inset-bottom,8px))] sm:bottom-0'
          : 'bottom-0'
      } sm:inset-0 z-[55] sm:z-[100001] flex items-center justify-center p-0 sm:p-6 animate-fade-in bg-black/75 backdrop-blur-md`}
      onClick={onClose}
    >
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 right-6 z-[100002] px-5 py-2.5 rounded-full bg-white/95 text-slate-800 text-xs font-semibold shadow-xl shadow-rose-950/10 border border-rose-200/90 backdrop-blur-md flex items-center gap-2.5 animate-toast-bottom-right pointer-events-none">
          <Sparkles size={15} className="text-[#F01472] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Profile Modal Card */}
      <div
        className="bg-white rounded-none sm:rounded-3xl w-full max-w-4xl h-full sm:h-auto sm:max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border-0 sm:border border-purple-100 relative animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="px-3.5 sm:px-5 py-2.5 sm:py-3.5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-20 gap-2 sm:gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-extrabold text-[#1e1b4b] truncate">{profile.name || 'Candidate Profile'}</h2>
              {profile.age > 0 && <span className="text-xs font-bold text-gray-400 shrink-0">• {profile.age} yrs</span>}
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-gray-500 font-medium truncate">
              {profile.location && (
                <span className="flex items-center gap-0.5 truncate">
                  <MapPin size={11} className="text-pink-500 shrink-0" />
                  <span className="truncate">{profile.location}</span>
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(publicProfileUrl);
                  setUrlCopied(true);
                  setTimeout(() => setUrlCopied(false), 2000);
                }}
                className="inline-flex items-center gap-1 font-mono text-[9px] sm:text-[10px] bg-purple-50 hover:bg-purple-100 text-purple-700 px-1.5 sm:px-2 py-0.5 rounded-full border border-purple-200 transition cursor-pointer shrink-0 notranslate"
                translate="no"
                title="Copy public link"
              >
                {urlCopied ? <Check size={10} className="text-emerald-600" /> : <Copy size={10} />}
                <span className="notranslate" translate="no">{urlCopied ? 'Link Copied!' : `/${profileIdentifier}`}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Desktop Actions */}
            {!isOwn && (
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleShortlist}
                  className={`p-2 rounded-full transition cursor-pointer flex items-center justify-center ${
                    localShortlisted
                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                      : 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200/80 shadow-xs'
                  }`}
                  title={localShortlisted ? 'Shortlisted' : 'Shortlist Candidate'}
                >
                  <Heart size={16} fill={localShortlisted ? 'currentColor' : 'none'} className={localShortlisted ? 'text-rose-600' : ''} />
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className={`p-2 rounded-full transition cursor-pointer flex items-center justify-center ${
                    localSaved
                      ? 'bg-amber-50 text-amber-600 border border-amber-200'
                      : 'bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-600 border border-slate-200/80 shadow-xs'
                  }`}
                  title={localSaved ? 'Saved to Bookmarks' : 'Save Profile'}
                >
                  <Bookmark size={16} fill={localSaved ? 'currentColor' : 'none'} className={localSaved ? 'text-amber-600' : ''} />
                </button>

                <button
                  type="button"
                  onClick={() => setQrModalOpen(true)}
                  className="p-2 rounded-full bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-700 border border-slate-200/80 transition cursor-pointer flex items-center justify-center shadow-xs"
                  title="View & Download Profile QR Code"
                >
                  <QrCode size={16} />
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 transition cursor-pointer"
                  title="Share profile"
                >
                  <Share2 size={16} />
                </button>
              </div>
            )}

            {/* Mobile Actions: Prioritize Shortlist + QR/Share dropdown */}
            {!isOwn && (
              <div className="flex sm:hidden items-center gap-1">
                <button
                  type="button"
                  onClick={handleShortlist}
                  className={`w-9 h-9 rounded-full transition cursor-pointer flex items-center justify-center ${
                    localShortlisted
                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200/80 shadow-xs'
                  }`}
                  title={localShortlisted ? 'Shortlisted' : 'Shortlist Candidate'}
                  aria-label="Shortlist"
                >
                  <Heart size={16} fill={localShortlisted ? 'currentColor' : 'none'} className={localShortlisted ? 'text-rose-600' : ''} />
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen((prev) => !prev)}
                    className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80 flex items-center justify-center transition cursor-pointer"
                    title="More actions"
                    aria-label="More actions"
                  >
                    <MoreVertical size={16} />
                  </button>

                  {mobileMenuOpen && (
                    <div
                      className="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl shadow-xl border border-rose-100 py-1.5 z-50 animate-scale-up"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleSave();
                        }}
                        className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-600 flex items-center gap-2.5 transition"
                      >
                        <Bookmark size={14} fill={localSaved ? 'currentColor' : 'none'} className={localSaved ? 'text-amber-500' : ''} />
                        <span>{localSaved ? 'Saved to Bookmarks' : 'Bookmark Profile'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setQrModalOpen(true);
                        }}
                        className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2.5 transition"
                      >
                        <QrCode size={14} />
                        <span>Profile QR Code</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleShare();
                        }}
                        className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition"
                      >
                        <Share2 size={14} />
                        <span>Share Profile</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {isOwn && (
              <div className="flex sm:hidden items-center gap-1">
                <DownloadBiodataButton variant="compact" />
                <button
                  type="button"
                  onClick={() => {
                    setEditModalOpen(true);
                    if (typeof window !== 'undefined') {
                      try {
                        const url = new URL(window.location.href);
                        url.searchParams.set('edit', 'true');
                        window.history.replaceState(null, '', url.toString());
                        localStorage.setItem('edit_profile_open', 'true');
                      } catch (e) {}
                    }
                  }}
                  className="w-9 h-9 rounded-full bg-rose-50 hover:bg-rose-100 text-[#F01472] border border-rose-200 transition cursor-pointer flex items-center justify-center shadow-xs"
                  title="Edit Your Profile"
                  aria-label="Edit Profile"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setQrModalOpen(true)}
                  className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80 transition cursor-pointer flex items-center justify-center shadow-xs"
                  title="View Profile QR Code"
                >
                  <QrCode size={15} />
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80 transition cursor-pointer flex items-center justify-center shadow-xs"
                  title="Share profile"
                >
                  <Share2 size={15} />
                </button>
              </div>
            )}

            {isOwn && (
              <div className="hidden sm:flex items-center gap-1.5">
                <DownloadBiodataButton variant="header" />
                <button
                  type="button"
                  onClick={() => {
                    setEditModalOpen(true);
                    if (typeof window !== 'undefined') {
                      try {
                        const url = new URL(window.location.href);
                        url.searchParams.set('edit', 'true');
                        window.history.replaceState(null, '', url.toString());
                        localStorage.setItem('edit_profile_open', 'true');
                      } catch (e) {}
                    }
                  }}
                  className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 text-[#F01472] border border-rose-200 transition cursor-pointer flex items-center justify-center shadow-xs"
                  title="Edit Your Profile"
                  aria-label="Edit Profile"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setQrModalOpen(true)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-700 border border-slate-200/80 transition cursor-pointer flex items-center justify-center shadow-xs"
                  title="View & Download Profile QR Code"
                >
                  <QrCode size={15} />
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 transition cursor-pointer flex items-center justify-center shadow-xs"
                  title="Share profile"
                >
                  <Share2 size={15} />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 sm:w-auto sm:h-auto p-2 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-800 hover:text-rose-600 border border-slate-200/80 transition cursor-pointer flex items-center justify-center shadow-xs"
              title="Close"
            >
              <X size={18} className="stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto" ref={modalContentRef}>

          {/* ── Own profile, wizard not done: show ONLY the completion prompt + account info ── */}
          {isProfileIncomplete ? (
            <div className="flex flex-col items-center justify-center p-6 sm:p-10 gap-6 text-center max-w-lg mx-auto">
              <div className="w-20 h-20 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center shadow-md">
                <AlertTriangle className="w-9 h-9 text-amber-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900">Profile Not Complete</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  You haven't finished the biodata wizard yet. Complete it to create your matrimonial profile and start getting discovered by potential matches.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  goToWizard();
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-sm shadow-lg shadow-amber-500/30 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Complete My Profile in Wizard
                <ArrowRight className="w-4 h-4" />
              </button>

              {user && (
                <div className="w-full space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-indigo-500" /> Email:
                    </span>
                    <span className="font-bold text-slate-900 truncate max-w-[180px]">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-rose-500" /> Phone:
                    </span>
                    <span className="font-bold text-slate-900">{formData?.contactTo || formData?.contactNumber || user.phone || 'Not added'}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-purple-500" /> Role & Status:
                    </span>
                    <span className="font-bold text-purple-700">{user.role} • {user.status}</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Profile Status:
                    </span>
                    <span className="font-extrabold text-emerald-700">Active & Published</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
          <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
          {/* Top Hero: Photos & Primary Overview */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left Photo Gallery */}
            <div className="md:col-span-5 space-y-3">
              <input
                type="file"
                ref={photoInputRef}
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <div className="relative rounded-3xl overflow-hidden bg-purple-50 shadow-md aspect-[4/5] border border-purple-100 group">
                {activePhoto ? (
                  <>
                    <img
                      src={activePhoto}
                      alt={profile.name}
                      className="w-full h-full object-cover object-top"
                    />
                    {isOwn && (
                      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 sm:gap-2 z-10">
                        <button
                          type="button"
                          onClick={() => {
                            const sourceToCrop = formData?.originalProfilePictureUrl || profile?.originalProfileImage || activePhoto;
                            const currentFilter = formData?.profilePhotoFilter || profile?.photoFilter || 'normal';
                            if (sourceToCrop) {
                              openCropper(sourceToCrop, (croppedUrl, originalUrl, filterId) => {
                                const rawSource = originalUrl || sourceToCrop;
                                const chosenFilter = filterId || 'normal';
                                updateFormData({
                                  profilePictureUrl: croppedUrl,
                                  originalProfilePictureUrl: rawSource,
                                  profilePhotoFilter: chosenFilter,
                                });
                                if (profile) {
                                  profile.profileImage = croppedUrl;
                                  profile.originalProfileImage = rawSource;
                                  profile.photoFilter = chosenFilter;
                                }
                                setToastMessage('Photo framing updated successfully');
                                setTimeout(() => setToastMessage(null), 3000);
                              }, sourceToCrop, currentFilter);
                            }
                          }}
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-950/75 hover:bg-slate-950 text-white shadow-md transition flex items-center justify-center cursor-pointer backdrop-blur-xs hover:scale-110 active:scale-95"
                          title="Adjust crop and framing"
                          aria-label="Adjust crop"
                        >
                          <Crop size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => photoInputRef.current?.click()}
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-950/75 hover:bg-slate-950 text-white shadow-md transition flex items-center justify-center cursor-pointer backdrop-blur-xs hover:scale-110 active:scale-95"
                          title="Change photo"
                          aria-label="Change photo"
                        >
                          <Camera size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={handlePhotoRemove}
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-rose-600/90 hover:bg-rose-600 text-white shadow-md transition flex items-center justify-center cursor-pointer backdrop-blur-xs hover:scale-110 active:scale-95"
                          title="Remove photo"
                          aria-label="Remove photo"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-rose-50 via-purple-50 to-pink-50 p-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-white shadow-md border-2 border-rose-200 flex items-center justify-center text-[#F01472] font-black text-2xl mb-2">
                      {profile.name ? profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : <UserIcon size={32} />}
                    </div>
                    <span className="text-xs font-bold text-slate-600">No Photo Uploaded</span>
                    {isOwn && (
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        className="mt-3 px-4 py-2 rounded-full bg-[#F01472] hover:bg-[#C80E5A] text-white text-xs font-extrabold shadow-md hover:scale-105 transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Camera size={14} />
                        <span>+ Upload Photo</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Status / Verification Badge - Only shown when viewing someone else's profile */}
                {!isOwn && (
                  <div className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md font-extrabold text-xs shadow-md border">
                    <span className="inline-flex items-center gap-1.5 text-emerald-800 border-emerald-100">
                      <CheckCircle2 size={13} className="text-emerald-500 fill-emerald-100" />
                      <span>
                        {profile.verification?.idVerified
                          ? 'ID Verified'
                          : profile.verification?.mobileVerified
                          ? 'Mobile Verified'
                          : 'Verified Candidate'}
                      </span>
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {allPhotos.length > 1 && (
                <div className="flex gap-2">
                  {allPhotos.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPhotoIdx(idx)}
                      className={`w-14 aspect-[4/5] rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                        selectedPhotoIdx === idx
                          ? 'border-[#F01472] scale-105 shadow-md'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Overview & Quick Highlights */}
            <div className="md:col-span-7 space-y-5">
              {/* Name, Headline & Verified Badges (Section 9) */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-[#1e1b4b]">{profile.name}</h1>
                </div>
                <p className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                  <Briefcase size={15} className="text-[#F01472]" />
                  <span>{profile.profession}</span>
                  {profile.company && <span className="text-gray-400 font-medium">at {profile.company}</span>}
                </p>
                <p className="text-xs text-gray-500 font-semibold flex items-center gap-1.5">
                  <GraduationCap size={15} className="text-purple-600" />
                  <span>{profile.education}</span>
                  {profile.college && <span className="text-gray-400">({profile.college})</span>}
                </p>

                {/* Contact Details (Own Profile) */}
                {isOwn && user && (
                  <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-[11px] font-bold tracking-wide text-purple-900">
                        Contact Details
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 pt-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <Mail className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{formData?.contactTo || formData?.contactNumber || user.phone || 'Phone not added'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* TrueMatch Compatibility Breakdown (Candidate Matches Only) */}
              {!isOwn && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1e1b4b] to-[#312e81] text-white space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-white/20 text-pink-300">
                        <Sparkles size={16} className={loadingAiInsight ? "animate-pulse" : ""} />
                      </span>
                      <span className="text-xs font-bold tracking-wide text-pink-300">
                        TrueMatch Compatibility
                      </span>
                    </div>
                    <span className="text-lg font-black text-amber-300">{score}% TrueMatch</span>
                  </div>

                  {loadingAiInsight || !aiInsight ? (
                    <div className="space-y-3 animate-pulse pt-1">
                      <div className="h-3.5 bg-white/20 rounded-full w-5/6"></div>
                      <div className="space-y-2 pt-2 border-t border-white/10">
                        <div className="h-2.5 bg-white/15 rounded-full w-1/3 mb-2"></div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3.5 h-3.5 rounded-full bg-white/20 shrink-0"></div>
                            <div className="h-3 bg-white/20 rounded-full w-3/4"></div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3.5 h-3.5 rounded-full bg-white/20 shrink-0"></div>
                            <div className="h-3 bg-white/20 rounded-full w-2/3"></div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3.5 h-3.5 rounded-full bg-white/20 shrink-0"></div>
                            <div className="h-3 bg-white/20 rounded-full w-4/5"></div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3.5 h-3.5 rounded-full bg-white/20 shrink-0"></div>
                            <div className="h-3 bg-white/20 rounded-full w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs text-purple-100 font-medium leading-relaxed">
                        {aiInsight.headline}
                      </p>

                      {aiInsight.reasons && aiInsight.reasons.length > 0 && (
                        <div className="space-y-1 text-xs text-purple-100 pt-1 border-t border-white/10">
                          <p className="text-[11px] font-semibold text-white/80 tracking-wide">Why you may connect:</p>
                          {aiInsight.reasons.map((h, i) => (
                            <div key={i} className="flex items-start gap-2 text-white/90 text-xs">
                              <Check size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Quick Stat Pill Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                {[
                  { label: 'Height', val: profile.height },
                  { label: 'Religion', val: `${profile.religion} - ${profile.community}` },
                  { label: 'Mother Tongue', val: profile.motherTongue },
                  { label: 'Marital Status', val: profile.maritalStatus },
                  { label: 'Annual Income', val: profile.annualIncome || 'Confidential' },
                  { label: 'Native Place', val: profile.nativePlace || profile.city },
                ].map((stat, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-0.5">
                    <p className="text-[10px] text-gray-400 font-bold tracking-wide">{stat.label}</p>
                    <p className="text-xs font-black text-gray-800 truncate">{stat.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section: About Me (Section 8) */}
          <div className="p-6 rounded-3xl bg-pink-50/40 border border-pink-100/70 space-y-2">
            <h4 className="text-xs font-bold text-[#8B1A4A] tracking-wide flex items-center gap-1.5">
              <Smile size={15} /> About {profile.name.split(' ')[0]}
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed italic">
              "{profile.aboutMe}"
            </p>
          </div>

          {/* Section: Personality & Interests (Section 8) */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-gray-800 tracking-wide flex items-center gap-1.5 mb-2.5">
                <Sparkles size={14} className="text-[#F01472]" /> Personality Traits
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.personality.map((p) => (
                  <span
                    key={p}
                    className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 text-xs font-bold border border-purple-100"
                  >
                    ✨ {p}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-800 tracking-wide flex items-center gap-1.5 mb-2.5">
                <Heart size={14} className="text-rose-600" /> Interests & Hobbies
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((int) => (
                  <span
                    key={int}
                    className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-semibold"
                  >
                    🎯 {int}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 2-Column Detailed Section: Family Background & Lifestyle (Section 8) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Family Background */}
            <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-xs space-y-4">
              <h4 className="text-xs font-bold text-gray-800 tracking-wide flex items-center gap-1.5">
                <Users size={15} className="text-indigo-600" /> Family Background
              </h4>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Family Type:</span>
                  <span className="font-bold text-gray-800">{profile.familyType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Family Values:</span>
                  <span className="font-bold text-gray-800">{profile.familyValues}</span>
                </div>
                {/* Father's Details */}
                {(isOwn ? (formData?.fatherName || profile.fatherName) : profile.fatherName) && (
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">Father's Name:</span>
                    <span className="font-bold text-gray-800">{isOwn ? (formData?.fatherName || profile.fatherName) : profile.fatherName}</span>
                  </div>
                )}
                {(isOwn ? (formData?.fatherOccupation || profile.fatherOccupation) : profile.fatherOccupation) && (
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">Father's Occupation:</span>
                    <span className="font-bold text-gray-800">{isOwn ? (formData?.fatherOccupation || profile.fatherOccupation) : profile.fatherOccupation}</span>
                  </div>
                )}

                {/* Mother's Details */}
                {(isOwn ? (formData?.motherName || profile.motherName) : profile.motherName) && (
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">Mother's Name:</span>
                    <span className="font-bold text-gray-800">{isOwn ? (formData?.motherName || profile.motherName) : profile.motherName}</span>
                  </div>
                )}
                {(isOwn ? (formData?.motherOccupation || profile.motherOccupation) : profile.motherOccupation) && (
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">Mother's Occupation:</span>
                    <span className="font-bold text-gray-800">{isOwn ? (formData?.motherOccupation || profile.motherOccupation) : profile.motherOccupation}</span>
                  </div>
                )}
                {profile.siblings && (
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">Siblings:</span>
                    <span className="font-bold text-gray-800">{profile.siblings}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Lifestyle & Habits */}
            <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-xs space-y-4">
              <h4 className="text-xs font-bold text-gray-800 tracking-wide flex items-center gap-1.5">
                <Coffee size={15} className="text-amber-600" /> Lifestyle & Habits
              </h4>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Diet:</span>
                  <span className="font-bold text-gray-800">{profile.diet}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Smoking:</span>
                  <span className="font-bold text-gray-800">{profile.smoking === 'No' ? '🚫 Non-Smoker' : profile.smoking}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Drinking:</span>
                  <span className="font-bold text-gray-800">{profile.drinking === 'No' ? '🚫 Non-Drinker' : profile.drinking}</span>
                </div>

                {/* Phone & Contact Details with Inline Unhide */}
                <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500 flex items-center gap-1.5 font-medium">
                    <Phone size={13} className="text-rose-500 shrink-0" />
                    <span>Phone:</span>
                  </span>
                  {isOwn ? (
                    <div className="flex items-center gap-1.5 font-bold text-gray-800 text-right">
                      <span>{displayOwnPhone}</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold flex items-center gap-0.5 border border-emerald-200 shrink-0">
                        <Check size={10} className="stroke-[3]" /> Verified
                      </span>
                    </div>
                  ) : isContactLocked && !(user?.is_premium || user?.role === 'ADMIN' || unhiddenPhone) ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (user?.is_premium || user?.role === 'ADMIN') {
                          setUnhiddenPhone(true);
                        } else {
                          import('../../services/adminUserAnalysisService')
                            .then((mod) => mod.recordPremiumClickApi())
                            .catch(() => {});
                          openPremiumCheckout('premium_monthly', () => {
                            setUnhiddenPhone(true);
                          });
                        }
                      }}
                      className="group/contact flex items-center gap-1.5 py-0.5 px-2 rounded-lg bg-gradient-to-r from-amber-50 to-rose-50 hover:from-amber-100 hover:to-rose-100 border border-amber-200/90 hover:border-rose-300 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
                      title="Upgrade to Premium to unhide verified contact details"
                    >
                      <span className="font-mono text-xs font-bold text-slate-700 tracking-wider">
                        {maskedPhoneDisplay}
                      </span>
                      <span className="inline-flex items-center justify-center p-1 rounded-md bg-gradient-to-r from-amber-500 to-[#F01472] text-white shadow-2xs group-hover/contact:scale-105 transition-all">
                        <Lock size={11} className="stroke-[2.5]" />
                      </span>
                    </button>
                  ) : rawTargetPhone ? (
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${fullPhoneToDisplay.replace(/\s+/g, '')}`}
                        className="font-mono text-xs font-bold text-gray-800 hover:text-[#F01472] transition cursor-pointer"
                        title="Click to call"
                      >
                        {fullPhoneToDisplay}
                      </a>
                      <a
                        href={`https://wa.me/${rawTargetPhone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 hover:bg-emerald-100 transition"
                        title="Chat on WhatsApp"
                      >
                        WhatsApp
                      </a>
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-gray-400 italic">
                      Contact via Interest
                    </span>
                  )}
                </div>
                {profile.fitness && (
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">Fitness Routine:</span>
                    <span className="font-bold text-gray-800">{profile.fitness}</span>
                  </div>
                )}
                {profile.travel && (
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">Travel Style:</span>
                    <span className="font-bold text-gray-800">{profile.travel}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section: Partner Expectations & Marriage Preferences (Section 8) */}
          {profile.marriageExpectations && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-50 via-rose-50 to-pink-50 border border-purple-100/80 space-y-3">
              <h4 className="text-xs font-bold text-[#1e1b4b] tracking-wide flex items-center gap-1.5">
                <Clock size={15} className="text-[#F01472]" /> What I'm Looking For in a Life Partner
              </h4>
              <p className="text-sm text-gray-800 leading-relaxed font-medium">
                "{profile.marriageExpectations}"
              </p>
            </div>
          )}
        </div>
          )} {/* end ternary: complete profile content */}
        </div> {/* end overflow-y-auto */}

        {/* Modal Sticky Bottom Actions Bar */}
        {isOwn ? (
          <div className="p-3 sm:p-5 border-t border-gray-100 bg-white flex items-center justify-between gap-2 sm:gap-3 sticky bottom-0 z-20 w-full flex-wrap sm:flex-nowrap">
            {isProfileIncomplete ? (
              <div className="flex items-center justify-between w-full">
                {user && (
                  <button
                    type="button"
                    onClick={() => setShowSignOutConfirm(true)}
                    className="py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs font-extrabold text-slate-600 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="ml-auto py-2 sm:py-2.5 px-5 sm:px-6 rounded-xl font-black text-xs sm:text-sm text-white bg-gradient-to-r from-[#F01472] to-[#C80E5A] hover:from-rose-600 hover:to-rose-700 shadow-md shadow-rose-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Close</span>
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      goToStudio();
                    }}
                    className="py-2 sm:py-2.5 px-2.5 sm:px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 shadow-xs"
                  >
                    <Palette size={14} />
                    <span>Studio</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      goToInteractions();
                    }}
                    className="py-2 sm:py-2.5 px-2.5 sm:px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 shadow-xs"
                  >
                    <Heart size={14} />
                    <span>Interactions</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
                  {user && (
                    <button
                      type="button"
                      onClick={() => setShowSignOutConfirm(true)}
                      className="py-2 sm:py-2.5 px-2.5 sm:px-3.5 rounded-xl text-xs font-extrabold text-slate-600 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <LogOut size={14} />
                      <span className="hidden sm:inline">Sign Out</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={onClose}
                    className="py-2 sm:py-2.5 px-4 sm:px-5 rounded-xl font-black text-xs sm:text-sm text-white bg-gradient-to-r from-[#F01472] to-[#C80E5A] hover:from-rose-600 hover:to-rose-700 shadow-md shadow-rose-500/25 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Close</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="p-3.5 sm:p-5 border-t border-gray-100 bg-white flex items-center sticky bottom-0 z-20">
            <button
              type="button"
              onClick={handleSendInterest}
              disabled={localInterestSent || isSendingInterest}
              className={`w-full py-3 sm:py-3.5 px-5 sm:px-6 rounded-xl sm:rounded-2xl font-black text-sm shadow-lg transition flex items-center justify-center gap-2 cursor-pointer ${
                localInterestSent
                  ? 'bg-emerald-600 text-white cursor-default shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-[#F01472] to-[#C80E5A] hover:from-rose-600 hover:to-rose-700 text-white shadow-rose-500/30'
              }`}
            >
              {localInterestSent ? (
                <>
                  <Check size={16} />
                  <span>Interest Sent</span>
                </>
              ) : isSendingInterest ? (
                <span>Sending Interest...</span>
              ) : (
                <>
                  <Heart size={16} className="fill-white" />
                  <span>Send Interest</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(
    <>
      {!showSignOutConfirm && modalContent}
      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        displayName={profile.name || 'Candidate'}
        slugOrId={profileIdentifier}
        profilePictureUrl={myPhoto}
        age={profile.age ? `${profile.age} yrs` : (formData?.age ? `${formData.age} yrs` : '')}
        location={profile.location || [profile.city, profile.state].filter(Boolean).join(', ') || formData?.currentAddress || formData?.nativePlace || ''}
        profession={profile.profession || formData?.occupation || formData?.designation || ''}
      />
      <EditProfileModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          if (typeof window !== 'undefined') {
            try {
              const url = new URL(window.location.href);
              url.searchParams.delete('edit');
              url.searchParams.delete('tab');
              url.searchParams.delete('section');
              window.history.replaceState(null, '', url.toString());
              localStorage.removeItem('edit_profile_open');
            } catch (e) {}
          }
        }}
        onSaved={() => {
          if (profile && formData.profilePictureUrl) {
            profile.profileImage = formData.profilePictureUrl;
          }
          // EditProfileModal already displays its own "Profile updated successfully" toast
        }}
      />
      <SignOutConfirmModal
        isOpen={showSignOutConfirm}
        onClose={() => setShowSignOutConfirm(false)}
        isLoading={isLoggingOut}
        onConfirm={async () => {
          try {
            setIsLoggingOut(true);
            await logout();
            setShowSignOutConfirm(false);
            onClose();
          } finally {
            setIsLoggingOut(false);
          }
        }}
      />
    </>,
    document.body
  );
};
