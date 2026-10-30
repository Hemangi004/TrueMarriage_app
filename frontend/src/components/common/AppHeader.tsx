import React, { useState } from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import { NotificationBell } from '../discovery/NotificationBell';
import { TrueMarriageLogo } from './TrueMarriageLogo';
import { UserPillDropdown } from './UserPillDropdown';
import { MyProfileModal } from '../profile/MyProfileModal';
import { getDiscoverableProfilesApi } from '../../services/discoveryService';
import {
  Sparkles,
  Home,
  Search,
  Heart,
  Shield,
  Layers,
} from 'lucide-react';

const NAV_LABELS: Record<string, Record<string, string>> = {
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
  Templates: {
    en: 'Biodata Maker',
    hi: 'बायोडाटा मेकर',
    mr: 'बायोडेटा मेकर',
    gu: 'બાયોડેટા મેકર',
    bn: 'বায়োডাটা মেকার',
    ta: 'பயோடேட்டா மேக்கர்',
    te: 'బయోడేటా మేకర్',
    kn: 'ಬಯೋಡೇಟಾ ಮೇಕರ್',
    ml: 'ബയോഡാറ്റ മേക്കർ',
    pa: 'ਬਾਇਓਡਾਟਾ ਮੇਕਰ',
    or: 'ବାୟୋଡାଟା ମେକର',
    as: 'বায়’ডাটা মেকাৰ',
    ur: 'بایوڈیٹا میکر',
  },
  'Biodata Maker': {
    en: 'Biodata Maker',
    hi: 'बायोडाटा मेकर',
    mr: 'बायोडेटा मेकर',
    gu: 'બાયોડેટા મેકર',
    bn: 'বায়োডাটা মেকার',
    ta: 'பயோடேட்டா மேக்கர்',
    te: 'బయోడేటా మేకర్',
    kn: 'ಬಯೋಡೇಟಾ ಮೇಕರ್',
    ml: 'ബയോഡാറ്റ മേക്കർ',
    pa: 'ਬਾਇਓਡਾਟਾ ਮੇਕਰ',
    or: 'ବାୟୋଡାଟା ମେକର',
    as: 'বায়’ডাটা মেকাৰ',
    ur: 'بایوڈیٹا میکر',
  },
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
    ur: 'تلاش کریں',
  },
  Interactions: {
    en: 'Interactions',
    hi: 'बातचीत',
    mr: 'संवाद',
    gu: 'વાતચીત',
    bn: 'কথোপকথন',
    ta: 'தொடர்புகள்',
    te: 'సంభాషణలు',
    kn: 'ಸಂವಹನಗಳು',
    ml: 'ഇടപെടലുകൾ',
    pa: 'ਗੱਲਬਾਤ',
    or: 'ବାର୍ତ୍ତାଳାପ',
    as: 'বাৰ্তালাপ',
    ur: 'بات چیت',
  },
  Home: {
    en: 'Home',
    hi: 'होम',
    mr: 'होम',
    gu: 'હોમ',
    bn: 'হোম',
    ta: 'முகப்பு',
    te: 'హోమ్',
    kn: 'ಮುಖಪುಟ',
    ml: 'ഹോം',
    pa: 'ਹੋਮ',
    or: 'ମୁଖ୍ୟପୃଷ୍ଠା',
    as: 'মূল পৃষ্ঠা',
    ur: 'ہوم',
  },
  Wizard: {
    en: 'Wizard',
    hi: 'विज़ार्ड',
    mr: 'विझार्ड',
    gu: 'વિઝાર્ડ',
    bn: 'উইজার্ড',
    ta: 'வழிகாட்டி',
    te: 'విజార్డ్',
    kn: 'ವಿಝಾರ್ಡ್',
    ml: 'വിസാർഡ്',
    pa: 'ਵਿਜ਼ਾਰਡ',
    or: 'ୱିଜାର୍ଡ',
    as: 'ৱিজাৰ্ড',
    ur: 'وزرڈ',
  },
  Admin: {
    en: 'Admin',
    hi: 'एडमिन',
    mr: 'अॅडमिन',
    gu: 'એડમિન',
    bn: 'অ্যাডমিন',
    ta: 'நிர்வாகி',
    te: 'అడ్మిన్',
    kn: 'ಅಡ್ಮಿನ್',
    ml: 'ಅഡ്മിൻ',
    pa: 'ਐਡਮਿਨ',
    or: 'ପ୍ରଶାସକ',
    as: 'প্ৰশাসক',
    ur: 'ایڈمن',
  },
};

interface AppHeaderProps {
  onOpenLogin?: () => void;
  onOpenRegister?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onOpenLogin, onOpenRegister }) => {
  const {
    currentPage,
    goToLanding,
    goToWizard,
    goToAdmin,
    goToDiscovery,
    goToInteractions,
    goToTemplates,
    formData,
    profileId,
    wizardCompleted,
    completionScore,
  } = useBiodata();

  const { user, isAuthenticated, openLogin, openRegister, requireAuth } = useAuth();
  const { t, lang } = useI18n();
  const getNavLabel = (key: string) => NAV_LABELS[key]?.[lang] || NAV_LABELS[key]?.en || t(key);
  const isProfileCompleted = Boolean(wizardCompleted || user?.is_profile_completed);
  const isProfileLocked = isAuthenticated && user?.role !== 'ADMIN' && !isProfileCompleted;

  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const pathname = window.location.pathname;
      if (pathname.startsWith('/wizard')) {
        return false;
      }
      if (!pathname.startsWith('/templates') && !pathname.startsWith('/wizard')) {
        return params.get('profile') === 'true' || params.get('edit') === 'true' || localStorage.getItem('edit_profile_open') === 'true';
      }
      return params.get('profile') === 'true';
    }
    return false;
  });

  const isProfileIncomplete =
    !profileId &&
    !wizardCompleted &&
    completionScore < 20 &&
    !formData?.gender;

  return (
    <>
      <header className="hidden md:block sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-rose-100/80 shadow-xs">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between gap-4 relative">
          <button
            type="button"
            onClick={goToLanding}
            className="flex items-center group text-left cursor-pointer hover:opacity-95 transition-opacity z-10 py-1"
          >
            <TrueMarriageLogo variant="horizontal" size="md" />
          </button>

          {/* Desktop Navigation Links - Perfectly Centered */}
          {!isProfileLocked && (
            <nav className="hidden lg:flex items-center justify-center absolute left-1/2 -translate-x-1/2 gap-2 text-xs font-bold text-gray-700 text-center">
              {!isAuthenticated && (
                <button
                  type="button"
                  onClick={goToLanding}
                  className={`px-3.5 py-2 rounded-full transition cursor-pointer flex items-center justify-center gap-1.5 text-center ${currentPage === 'landing'
                      ? 'bg-rose-50 text-[#F01472] font-black'
                      : 'hover:bg-rose-50/60 hover:text-[#F01472]'
                    }`}
                >
                  <Home size={14} />
                  <span className="notranslate text-center" translate="no">{getNavLabel('Home')}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  sessionStorage.setItem('tm_post_login_redirect', '/biodata-maker');
                  requireAuth(goToTemplates);
                }}
                className={`px-3.5 py-2 rounded-full transition cursor-pointer flex items-center justify-center gap-1.5 text-center ${currentPage === 'templates'
                    ? 'bg-rose-50 text-[#F01472] font-black'
                    : 'hover:bg-rose-50/60 hover:text-[#F01472]'
                  }`}
              >
                <Layers size={14} />
                <span className="notranslate text-center" translate="no">{getNavLabel('Biodata Maker')}</span>
              </button>

              <button
                type="button"
                onMouseEnter={() => {
                  if (isAuthenticated) getDiscoverableProfilesApi().catch(() => {});
                }}
                onClick={() => {
                  sessionStorage.setItem('tm_post_login_redirect', '/discover');
                  requireAuth(goToDiscovery);
                }}
                className={`px-3.5 py-2 rounded-full transition cursor-pointer flex items-center justify-center gap-1.5 text-center ${currentPage === 'discovery'
                    ? 'bg-rose-50 text-[#F01472] font-black'
                    : 'hover:bg-rose-50/60 hover:text-[#F01472]'
                  }`}
              >
                <Search size={14} />
                <span className="notranslate text-center" translate="no">{getNavLabel('Discover')}</span>
              </button>

              {isAuthenticated && (
                <button
                  type="button"
                  onClick={goToInteractions}
                  className={`px-3.5 py-2 rounded-full transition cursor-pointer flex items-center justify-center gap-1.5 text-center ${currentPage === 'interactions'
                      ? 'bg-rose-50 text-[#F01472] font-black'
                      : 'hover:bg-rose-50/60 hover:text-[#F01472]'
                    }`}
                >
                  <Heart size={14} />
                  <span className="notranslate text-center" translate="no">{getNavLabel('Interactions')}</span>
                </button>
              )}

              {isProfileIncomplete && (
                <button
                  type="button"
                  onClick={() => requireAuth(() => goToWizard())}
                  className={`px-3.5 py-2 rounded-full transition cursor-pointer flex items-center gap-1.5 ${currentPage === 'wizard'
                      ? 'bg-rose-50 text-[#F01472] font-black'
                      : 'hover:bg-rose-50/60 hover:text-[#F01472]'
                    }`}
                >
                  <Sparkles size={14} />
                  <span className="notranslate" translate="no">{getNavLabel('Wizard')}</span>
                </button>
              )}

              {isAuthenticated && user?.role === 'ADMIN' && (
                <button
                  type="button"
                  onClick={goToAdmin}
                  className={`px-3.5 py-2 rounded-full transition cursor-pointer flex items-center gap-1.5 ${currentPage === 'admin'
                      ? 'bg-rose-700 text-white font-black'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                    }`}
                >
                  <Shield size={14} />
                  <span className="notranslate" translate="no">{getNavLabel('Admin')}</span>
                </button>
              )}
            </nav>
          )}

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 min-w-0">
            {isAuthenticated && !isProfileLocked && (
              <NotificationBell onOpenInteractions={goToInteractions} />
            )}

            {isAuthenticated && user ? (
              <div className="hidden md:inline-block">
                <UserPillDropdown onOpenMyProfile={() => setProfileModalOpen(true)} />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => (openLogin ? openLogin() : onOpenLogin && onOpenLogin())}
                  className="px-3.5 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:bg-rose-50 hover:text-[#F01472] font-bold text-xs transition cursor-pointer"
                >
                  {t('Sign In')}
                </button>

                <button
                  type="button"
                  onClick={openRegister || onOpenRegister}
                  className="hidden sm:flex px-4 py-1.5 rounded-full bg-[#F01472] hover:bg-[#C80E5A] text-white font-black text-xs shadow-md shadow-rose-500/25 transition cursor-pointer"
                >
                  {t('Register Free')}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {!isProfileLocked && (
        <MyProfileModal
          isOpen={profileModalOpen}
          onClose={() => {
            setProfileModalOpen(false);
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
      )}
    </>
  );
};
