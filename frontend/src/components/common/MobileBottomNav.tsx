import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useBiodata } from '../../context/BiodataContext';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import { AnimatePresence, motion } from 'framer-motion';
import { MyProfileModal } from '../profile/MyProfileModal';
import { EditProfileModal } from '../profile/EditProfileModal';
import { getDiscoverableProfilesApi } from '../../services/discoveryService';
import {
  Search,
  Layers,
  Heart,
  User,
  LogOut,
  ChevronRight,
  Edit3,
} from 'lucide-react';

const NAV_LABELS: Record<string, Record<string, string>> = {
  Discover: {
    en: 'Discover',
    hi: 'खोजें',
    mr: 'शोधा',
    gu: 'શોધો',
    bn: 'খুঁজুন',
    ta: 'கண்டுபிடி',
    te: 'కనుగొనండి',
    kn: 'ಹುಡುಕಿ',
    ml: 'കണ്ടെത്തുക',
    pa: 'ਲੱਭੋ',
    or: 'ସନ୍ଧାନ',
    as: 'সন্ধান',
    ur: 'تلاش',
  },
  Studio: {
    en: 'Studio',
    hi: 'स्टूडियो',
    mr: 'स्टुडिओ',
    gu: 'સ્ટુડિયો',
    bn: 'স্টুডিও',
    ta: 'ஸ்டுடியோ',
    te: 'స్టూడియో',
    kn: 'ಸ್ಟುಡಿಯೋ',
    ml: 'സ്റ്റുഡിയോ',
    pa: 'ਸਟੂਡੀਓ',
    or: 'ଷ୍ଟୁଡିଓ',
    as: 'ষ্টুডিঅ’',
    ur: 'اسٹوڈیو',
  },
  'Biodata Builder': {
    en: 'Biodata Builder',
    hi: 'बायोडाटा बिल्डर',
    mr: 'बायोडेटा बिल्डर',
    gu: 'બાયોડેટા બિલ્ડર',
    bn: 'বায়োডাটা বিল্ডার',
    ta: 'பயோடேட்டா பில்டர்',
    te: 'బయోడేటా బిల్డర్',
    kn: 'ಬಯೋಡೇಟಾ ಬಿಲ್ಡರ್',
    ml: 'ബയോഡാറ്റ ബിൽഡർ',
    pa: 'ਬਾਇਓਡਾਟਾ ਬਿਲਡਰ',
    or: 'ବାୟୋଡାଟା ବିଲ୍ଡର',
    as: 'বায়’ডাটা বিল্ডাৰ',
    ur: 'بایوڈیٹا بلڈر',
  },
  Interactions: {
    en: 'Matches',
    hi: 'मैचेस',
    mr: 'मॅचेस',
    gu: 'મેચેસ',
    bn: 'ম্যাচ',
    ta: 'பொருத்தம்',
    te: 'జతలు',
    kn: 'ಹೊಂದಾಣಿಕೆ',
    ml: 'മാച്ചുകൾ',
    pa: 'ਮੈਚ',
    or: 'ମେଳକ',
    as: 'মিল',
    ur: 'میچز',
  },
};

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { lang, t } = useI18n();
  const { user, isAuthenticated, logout } = useAuth();
  const { goToDiscovery, goToTemplates, goToInteractions, formData, wizardCompleted } = useBiodata();
  const [isActionPanelOpen, setIsActionPanelOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const curPath = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
      if (!curPath.startsWith('/templates') && !curPath.startsWith('/wizard')) {
        return params.get('profile') === 'true' || params.get('edit') === 'true' || localStorage.getItem('edit_profile_open') === 'true';
      }
      return params.get('profile') === 'true';
    }
    return false;
  });

  // Manage body bottom clearance only when active and rendered
  useEffect(() => {
    if (isAuthenticated && user && (wizardCompleted || user.role === 'ADMIN') && !location.pathname.startsWith('/wizard')) {
      document.body.classList.add('has-bottom-nav');
    } else {
      document.body.classList.remove('has-bottom-nav');
    }
    return () => {
      document.body.classList.remove('has-bottom-nav');
    };
  }, [isAuthenticated, user, wizardCompleted, location.pathname]);

  // STRICT REQUIREMENT: Only show bottom nav to logged-in users who have completed their profile!
  if (!isAuthenticated || !user || (!wizardCompleted && user.role !== 'ADMIN')) {
    return null;
  }

  const pathname = location.pathname.toLowerCase().replace(/\/$/, '') || '/';

  // Do not render bottom nav inside admin or wizard
  if (
    pathname.startsWith('/admin') ||
    pathname === '/wizard'
  ) {
    return null;
  }

  const getLabel = (key: string) => NAV_LABELS[key]?.[lang] || NAV_LABELS[key]?.en || t(key);

  const isDiscoverActive = pathname === '/discover' || pathname === '/discovery';
  const isTemplatesActive = pathname === '/templates' || pathname === '/biodata-maker' || pathname === '/studio';
  const isInteractionsActive = pathname === '/interactions';

  const userInitials = (user.full_name || user.email || 'U').substring(0, 2).toUpperCase();
  const userPhotoUrl = formData?.profilePictureUrl || (user as any)?.avatar || (user as any)?.photo || '';

  return (
    <>
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 inset-x-0 z-[60] md:hidden bg-white/95 backdrop-blur-xl border-t border-rose-100/90 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] pb-[max(0.5rem,env(safe-area-inset-bottom,8px))] pt-1 px-2 select-none"
      >
        <div className="flex items-center justify-around max-w-lg mx-auto relative">
          {/* 1. Discover Button */}
          <button
            type="button"
            onTouchStart={() => {
              if (isAuthenticated) getDiscoverableProfilesApi().catch(() => {});
            }}
            onMouseEnter={() => {
              if (isAuthenticated) getDiscoverableProfilesApi().catch(() => {});
            }}
            onClick={() => {
              setIsProfileModalOpen(false);
              goToDiscovery();
            }}
            aria-label={getLabel('Discover')}
            title={getLabel('Discover')}
            className={`flex-1 flex items-center justify-center py-3 transition-all duration-150 active:scale-90 cursor-pointer ${
              isDiscoverActive && !isProfileModalOpen ? 'text-[#F01472]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Search size={22} strokeWidth={isDiscoverActive && !isProfileModalOpen ? 2.5 : 1.8} />
          </button>

          {/* 2. Biodata Maker Button */}
          <button
            type="button"
            onClick={() => {
              setIsProfileModalOpen(false);
              goToTemplates();
            }}
            aria-label={getLabel('Biodata Builder')}
            title={getLabel('Biodata Builder')}
            className={`flex-1 flex items-center justify-center py-3 transition-all duration-150 active:scale-90 cursor-pointer ${
              isTemplatesActive && !isProfileModalOpen ? 'text-[#F01472]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Layers size={22} strokeWidth={isTemplatesActive && !isProfileModalOpen ? 2.5 : 1.8} />
          </button>

          {/* 3. Matches / Interactions Button */}
          <button
            type="button"
            onClick={() => {
              setIsProfileModalOpen(false);
              goToInteractions();
            }}
            aria-label={getLabel('Interactions')}
            title={getLabel('Interactions')}
            className={`flex-1 flex items-center justify-center py-3 transition-all duration-150 active:scale-90 cursor-pointer ${
              isInteractionsActive && !isProfileModalOpen ? 'text-[#F01472]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Heart
              size={22}
              strokeWidth={isInteractionsActive && !isProfileModalOpen ? 2.5 : 1.8}
              className={isInteractionsActive && !isProfileModalOpen ? 'fill-[#F01472]' : ''}
            />
          </button>

          {/* 4. Profile Button (Far Right) */}
          <div className="flex-1 flex items-center justify-center py-1.5">
            <button
              type="button"
              onClick={() => {
                setIsActionPanelOpen(false);
                setIsProfileModalOpen(true);
              }}
              aria-label="My Profile"
              className={`w-9 h-9 rounded-full bg-gradient-to-tr from-[#C80E5A] via-[#F01472] to-[#FF4B8B] shadow-md shadow-pink-500/30 border-2 border-white flex items-center justify-center text-white transition-all duration-150 active:scale-90 cursor-pointer overflow-hidden font-black text-xs notranslate ${
                isProfileModalOpen ? 'ring-2 ring-[#F01472] scale-105' : ''
              }`}
              translate="no"
              title="My Profile"
            >
              {userPhotoUrl ? (
                <img
                  src={userPhotoUrl}
                  alt={user.full_name || 'My Profile'}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : userInitials ? (
                <span>{userInitials}</span>
              ) : (
                <User size={18} className="fill-white/20" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Slide-up Action Panel (Bottom Sheet) */}
      <AnimatePresence>
        {isActionPanelOpen && (
          <div className="fixed inset-0 z-[70] md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsActionPanelOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Bottom Sheet Drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="absolute bottom-0 inset-x-0 bg-white rounded-t-3xl shadow-2xl border-t border-rose-100 p-4 pb-[max(1.25rem,env(safe-area-inset-bottom,16px))] overflow-hidden select-none"
            >
              {/* Handle Bar */}
              <div className="w-10 h-1.5 bg-slate-200 rounded-full mx-auto mb-3.5" />

              {/* User Identity Header - Click to open My Profile */}
              <button
                type="button"
                onClick={() => {
                  setIsActionPanelOpen(false);
                  setIsProfileModalOpen(true);
                }}
                className="w-full flex items-center gap-3 p-3 bg-slate-50/90 hover:bg-purple-50/80 rounded-2xl border border-slate-100 mb-3.5 text-left transition-colors cursor-pointer group/user"
              >
                {userPhotoUrl ? (
                  <img
                    src={userPhotoUrl}
                    alt={user.full_name || 'Profile'}
                    className="w-11 h-11 rounded-full object-cover border-2 border-purple-300 ring-2 ring-purple-100 shrink-0"
                  />
                ) : (
                  <div
                    className="w-11 h-11 rounded-full bg-purple-700 text-white font-black text-sm flex items-center justify-center shrink-0 notranslate"
                    translate="no"
                  >
                    {userInitials}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-sm text-slate-900 group-hover/user:text-purple-700 transition-colors truncate">
                    {user.full_name || user.email?.split('@')[0] || 'My Account'}
                  </h4>
                  {user.email && (
                    <p className="text-xs text-slate-500 truncate">
                      {user.email}
                    </p>
                  )}
                </div>
                <ChevronRight size={16} className="text-slate-400 group-hover/user:text-purple-600 group-hover/user:translate-x-0.5 transition-all shrink-0" />
              </button>

              {/* Action Buttons */}
              <div className="space-y-2">
                {/* My Profile */}
                <button
                  type="button"
                  onClick={() => {
                    setIsActionPanelOpen(false);
                    setIsProfileModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-purple-50/80 hover:bg-purple-100 text-purple-900 border border-purple-200/70 text-sm font-bold transition active:scale-[0.98] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-200/70 text-purple-700 flex items-center justify-center shrink-0">
                      <User size={16} />
                    </div>
                    <span className="font-bold text-slate-800">My Profile</span>
                  </div>
                  <ChevronRight size={16} className="text-purple-400" />
                </button>

                {/* Edit Profile */}
                <button
                  type="button"
                  onClick={() => {
                    setIsActionPanelOpen(false);
                    setIsEditModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-purple-50/80 hover:bg-purple-100 text-purple-900 border border-purple-200/70 text-sm font-bold transition active:scale-[0.98] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-200/70 text-purple-700 flex items-center justify-center shrink-0">
                      <Edit3 size={16} />
                    </div>
                    <span className="font-bold text-slate-800">Edit Profile</span>
                  </div>
                  <ChevronRight size={16} className="text-purple-400" />
                </button>

                {/* Logout - Styled in Red */}
                <button
                  type="button"
                  onClick={async () => {
                    setIsActionPanelOpen(false);
                    try {
                      await logout();
                    } catch (err) {
                      console.error('Logout error:', err);
                    }
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/80 text-sm font-bold transition active:scale-[0.98] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-red-200/70 text-red-600 flex items-center justify-center shrink-0">
                      <LogOut size={16} />
                    </div>
                    <span className="font-bold text-red-600">Logout</span>
                  </div>
                  <ChevronRight size={16} className="text-red-400" />
                </button>
              </div>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={() => setIsActionPanelOpen(false)}
                className="w-full mt-3 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition cursor-pointer text-center"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal Dialog */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
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
      />

      {/* My Profile Modal — full biodata preview, same as desktop */}
      <MyProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          if (typeof window !== 'undefined') {
            try {
              const url = new URL(window.location.href);
              url.searchParams.delete('profile');
              url.searchParams.delete('edit');
              url.searchParams.delete('tab');
              window.history.replaceState(null, '', url.toString());
              localStorage.removeItem('edit_profile_open');
            } catch (e) {}
          }
        }}
      />
    </>
  );
};
