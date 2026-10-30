import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate, useLocation } from 'react-router-dom';
import { BiodataProvider, useBiodata } from './context/BiodataContext';
import { ConversationalWizard } from './components/wizard/ConversationalWizard';
import { AdminLayout } from './components/admin/AdminLayout';
import { DiscoverPage } from './components/discovery/DiscoverPage';
import { InteractionsPage } from './components/discovery/InteractionsPage';
import { ProfilePublicModal } from './components/discovery/ProfilePublicModal';
import { getPublicProfileBySlugApi } from './services/publicProfileService';
import { convertPublicProfileToDetailedProfile } from './utils/biodataHelpers';
import type { DetailedProfile } from './types/discovery';
import { QRCodeModal } from './components/profile/QRCodeModal';
import { Lock } from 'lucide-react';
import { TemplateGallery } from './components/templates/TemplateGallery';

import { AuthProvider, useAuth } from './context/AuthContext';
import { I18nProvider } from './context/I18nContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';

import { OTPModal } from './components/modals/OTPModal';
import { CropModal } from './components/modals/CropModal';
import { AISuggestionModal } from './components/modals/AISuggestionModal';
import { RegisterModal } from './components/modals/RegisterModal';
import { LoginModal } from './components/modals/LoginModal';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { ForgotPasswordModal } from './components/modals/ForgotPasswordModal';
import { PremiumUpgradeModal } from './components/modals/PremiumUpgradeModal';
import { ManageSubscriptionModal } from './components/modals/ManageSubscriptionModal';

import { AppHeader } from './components/common/AppHeader';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { updatePageSEO, ROUTE_SEO } from './utils/seo';
import { ErrorPage } from './components/common/ErrorPage';
import { AboutMePage } from './components/pages/AboutMePage';
import { TeamPage } from './components/pages/TeamPage';
import { SeoLandingPage } from './components/seo/SeoLandingPage';
import { SeoDirectoryIndex } from './components/seo/SeoDirectoryIndex';
import { ALL_SEO_SLUGS } from './data/seoLandingPages';

const RESERVED_STATIC_EXTENSIONS = [
  '.xml',
  '.txt',
  '.json',
  '.ico',
  '.png',
  '.jpg',
  '.jpeg',
  '.svg',
  '.webp',
  '.html',
  '.js',
  '.css',
  '.map',
];

const RESERVED_ROUTES = [
  'sitemap.xml',
  'robots.txt',
  'favicon.ico',
  'favicon.png',
  'favicon.svg',
  'index.html',
  'templates',
  'biodata-maker',
  'discovery',
  'discover',
  'interactions',
  'wizard',
  'studio',
  'admin',
  'landing',
  'login',
  'register',
  'profile',
  'about-us',
  'about-me',
  'about',
  'team',
  'meet-the-team',
  'developers',
  '404',
  '403',
  '401',
  '500',
];

const OwnProfileRedirect: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { slug, profileId, wizardCompleted } = useBiodata();
  const location = useLocation();

  if (isLoading) return null;
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  if (!wizardCompleted && user?.role !== 'ADMIN') {
    return <Navigate to="/wizard" replace />;
  }
  const effectiveSlug = slug || profileId || (user as any)?.slug || (user as any)?.profile_id;
  if (effectiveSlug) {
    return <Navigate to={`/@${effectiveSlug}${location.search}`} replace />;
  }
  const search = location.search ? `${location.search}&profile=true` : '?profile=true';
  return <Navigate to={`/discover${search}`} replace />;
};

const ProfileWrapper: React.FC = () => {
  const { slugOrId } = useParams<{ slugOrId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading: isAuthLoading, openLogin, openRegister } = useAuth();
  const cleanSlugOrId = (slugOrId || '').replace(/^@/, '').trim();

  // If this is a static file or reserved route, do NOT treat it as a profile
  const lowerSlug = cleanSlugOrId.toLowerCase();
  const isStaticFileOrReserved =
    RESERVED_ROUTES.includes(lowerSlug) ||
    RESERVED_STATIC_EXTENSIONS.some((ext) => lowerSlug.endsWith(ext));

  if (isStaticFileOrReserved) {
    if (lowerSlug === 'sitemap.xml' || lowerSlug === 'robots.txt') {
      // Direct raw download / view from the server
      window.location.replace(`/${cleanSlugOrId}`);
      return null;
    }
    if (['404', '403', '401', '500'].includes(lowerSlug)) {
      return <ErrorPage code={Number(lowerSlug) as any} />;
    }
    return <Navigate to="/" replace />;
  }

  const [profile, setProfile] = useState<DetailedProfile | null>(null);
  const [modalOpen, setModalOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // When visitor is unauthenticated, save target redirect and automatically open login modal
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      sessionStorage.setItem('tm_post_login_redirect', location.pathname + location.search);
      openLogin();
    }
  }, [isAuthLoading, isAuthenticated, location.pathname, location.search, openLogin]);

  useEffect(() => {
    // Only fetch candidate details if the visitor is authenticated
    if (isAuthLoading) return;
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setNotFound(false);

    getPublicProfileBySlugApi(cleanSlugOrId)
      .then((data) => {
        if (isMounted) {
          if (data) {
            setProfile(convertPublicProfileToDetailedProfile(data));
            setModalOpen(true);
            setNotFound(false);
          } else {
            setNotFound(true);
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          if (err?.message?.includes('Authentication required') || err?.message?.includes('401')) {
            openLogin();
          } else {
            setNotFound(true);
          }
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [cleanSlugOrId, isAuthenticated, isAuthLoading, openLogin]);

  // Loading state while checking auth
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white">
        <div className="w-10 h-10 border-3 border-pink-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-slate-400">Verifying session...</p>
      </div>
    );
  }

  // Not logged in: Show the Login Required Gate (Candidate details completely hidden)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8 text-center shadow-2xl space-y-5 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#F01472] to-purple-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-500/25">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Member Login Required
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              To protect the privacy and security of our candidates, matrimonial profiles can only be viewed by registered TrueMarriage members.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={() => {
                sessionStorage.setItem('tm_post_login_redirect', location.pathname + location.search);
                openLogin();
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#F01472] to-[#C80E5A] hover:from-rose-600 hover:to-rose-700 font-extrabold text-xs shadow-lg shadow-rose-500/25 transition cursor-pointer"
            >
              Sign In to View Profile
            </button>

            <button
              type="button"
              onClick={() => {
                sessionStorage.setItem('tm_post_login_redirect', location.pathname + location.search);
                openRegister();
              }}
              className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 font-bold text-xs transition cursor-pointer"
            >
              Create Free Account
            </button>
          </div>

          <div className="pt-2 border-t border-white/10">
            <p className="text-[11px] text-slate-400 font-medium">
              ðŸ”’ 100% ID Verified & Secure Community
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated, but still loading profile
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white">
        <div className="w-10 h-10 border-3 border-pink-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-slate-400">Loading verified biodata...</p>
      </div>
    );
  }

  if (notFound || !profile) {
    return <ErrorPage code={404} attemptedPath={`/${cleanSlugOrId}`} />;
  }

  return (
    <>
      <DiscoverPage />
      <ProfilePublicModal
        profile={profile}
        breakdown={null}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          navigate('/discover', { replace: true });
        }}
      />
    </>
  );
};

const MainContent: React.FC = () => {
  const location = useLocation();
  const {
    currentPage,
    slug,
    profileId,
    formData,
    wizardCompleted,
  } = useBiodata();

  const {
    user,
    isAuthenticated,
    isLoginOpen,
    isRegisterOpen,
    isForgotPasswordOpen,
    setLoginOpen,
    setRegisterOpen,
    setForgotPasswordOpen,
    openLogin,
    openRegister,
    openForgotPassword,
    isPremiumModalOpen,
    closePremiumModal,
    premiumModalPlanId,
    premiumModalSuccessCb,
    isManageSubscriptionOpen,
    closeManageSubscription,
  } = useAuth();

  const [qrModalOpen, setQrModalOpen] = useState(false);
  const qrSlugOrId = slug || profileId || '';
  const qrDisplayName = user?.full_name || 'Candidate';

  useEffect(() => {
    const cleanPath = location.pathname.split('?')[0].replace(/\/$/, '') || '/';
    const matched = ROUTE_SEO[cleanPath];
    if (matched) {
      updatePageSEO(matched);
    }
  }, [location.pathname]);

  // If user is authenticated as an ADMIN:
  // Strictly enforce that ONLY the admin portal is accessible.
  // No other page (landing, discovery, templates, wizard, studio, public profiles) is visible.
  const isAdminUser = user?.role === 'ADMIN' || localStorage.getItem('user_role') === 'ADMIN';
  if (isAdminUser) {
    return (
      <Routes>
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        />
        {/* Any other URL automatically redirects admin to /admin */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  // MANDATORY CANDIDATE PROFILE REQUIREMENT:
  // If user is authenticated as a candidate and has NOT completed their profile wizard,
  // lock them strictly to /wizard. No other page (discover, templates, interactions, public profiles) is visible.
  const isProfileCompleted = Boolean(wizardCompleted || user?.is_profile_completed);
  const isProfileLocked = isAuthenticated && !isAdminUser && !isProfileCompleted;

  return (
    <>
      {currentPage !== 'landing' &&
        currentPage !== 'admin' &&
        location.pathname !== '/' &&
        location.pathname !== '/login' &&
        location.pathname !== '/register' && (
          <AppHeader
            onOpenLogin={openLogin}
            onOpenRegister={openRegister}
          />
        )}

      {isProfileLocked ? (
        <Routes>
          <Route path="/wizard" element={<ConversationalWizard />} />
          <Route path="*" element={<Navigate to="/wizard" replace />} />
        </Routes>
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate
                  to={isAdminUser ? '/admin' : isProfileLocked ? '/wizard' : '/discover'}
                  replace
                />
              ) : (
                <LoginPage onOpenRegister={openRegister} onOpenForgotPassword={openForgotPassword} />
              )
            }
          />
          <Route
            path="/landing"
            element={
              isAuthenticated ? (
                <Navigate
                  to={isAdminUser ? '/admin' : isProfileLocked ? '/wizard' : '/discover'}
                  replace
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/discover" replace />
              ) : (
                <LoginPage onOpenRegister={openRegister} onOpenForgotPassword={openForgotPassword} />
              )
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/discover" replace />
              ) : (
                <RegisterPage onOpenLogin={openLogin} />
              )
            }
          />
          <Route
            path="/templates"
            element={
              <ProtectedRoute fallbackMessage="Sign in to choose and personalize your matrimonial biodata.">
                <TemplateGallery />
              </ProtectedRoute>
            }
          />
          <Route
            path="/templates/"
            element={
              <ProtectedRoute fallbackMessage="Sign in to choose and personalize your matrimonial biodata.">
                <TemplateGallery />
              </ProtectedRoute>
            }
          />
          <Route path="/biodata-maker" element={<Navigate to="/templates" replace />} />
          <Route path="/biodata-maker/" element={<Navigate to="/templates" replace />} />
          <Route
            path="/discover"
            element={
              <ProtectedRoute fallbackMessage="Sign in to discover curated matrimonial profiles and find your match.">
                <DiscoverPage />
              </ProtectedRoute>
            }
          />
          <Route path="/discovery" element={<Navigate to="/discover" replace />} />

          <Route
            path="/interactions"
            element={
              <ProtectedRoute fallbackMessage="Sign in to view your matrimonial interests and shortlisted profiles.">
                <InteractionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wizard"
            element={<Navigate to="/discover" replace />}
          />
          <Route path="/studio" element={<Navigate to="/templates?active=true" replace />} />
          <Route path="/studio/*" element={<Navigate to="/templates?active=true" replace />} />

        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        />

        {/* Dedicated Error Code Pages */}
        <Route path="/404" element={<ErrorPage code={404} />} />
        <Route path="/403" element={<ErrorPage code={403} />} />
        <Route path="/401" element={<ErrorPage code={401} />} />
        <Route path="/500" element={<ErrorPage code={500} />} />

        {/* Own Profile Route */}
        <Route path="/profile" element={<OwnProfileRedirect />} />
        <Route path="/profile/" element={<OwnProfileRedirect />} />

        {/* About Us Page */}
        <Route path="/about-us" element={<AboutMePage />} />
        <Route path="/about-me" element={<Navigate to="/about-us" replace />} />
        <Route path="/about" element={<Navigate to="/about-us" replace />} />

        {/* Meet the Team & Developers Page */}
        <Route path="/team" element={<TeamPage />} />
        <Route path="/meet-the-team" element={<Navigate to="/team" replace />} />
        <Route path="/developers" element={<Navigate to="/team" replace />} />

        {/* SEO Landing Pages & Master Hub */}
        <Route path="/biodata" element={<SeoDirectoryIndex />} />
        <Route path="/biodata/" element={<SeoDirectoryIndex />} />
        <Route path="/biodata-formats" element={<SeoDirectoryIndex />} />
        <Route path="/biodata-formats/" element={<SeoDirectoryIndex />} />
        <Route path="/biodata/:slug" element={<SeoLandingPage />} />
        {ALL_SEO_SLUGS.map((seoSlug) => (
          <Route key={seoSlug} path={`/${seoSlug}`} element={<SeoLandingPage slug={seoSlug} />} />
        ))}

        {/* Dynamic Public Profile Routes */}
        <Route path="/profile/:slugOrId" element={<ProfileWrapper />} />
        <Route path="/@:slugOrId" element={<ProfileWrapper />} />
        <Route path="/:slugOrId" element={<ProfileWrapper />} />

        {/* Catch-all for any other unmatched or multi-segment invalid paths */}
        <Route path="*" element={<ErrorPage code={404} />} />
      </Routes>
      )}

      {/* Modals are always mounted so they can work across pages. */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setRegisterOpen(false)}
        onOpenLogin={openLogin}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setLoginOpen(false)}
        onOpenRegister={openRegister}
        onOpenForgotPassword={openForgotPassword}
      />

      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
        onOpenLogin={openLogin}
      />

      <PremiumUpgradeModal
        isOpen={isPremiumModalOpen}
        onClose={closePremiumModal}
        defaultPlanId={premiumModalPlanId}
        onSuccess={premiumModalSuccessCb}
      />

      <ManageSubscriptionModal
        isOpen={isManageSubscriptionOpen}
        onClose={closeManageSubscription}
      />

      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        displayName={qrDisplayName || user?.full_name || 'Candidate'}
        slugOrId={qrSlugOrId}
        profilePictureUrl={formData?.profilePictureUrl}
        age={formData?.age ? `${formData.age} yrs` : undefined}
        location={formData?.currentAddress || formData?.nativePlace || ''}
        profession={formData?.occupation || formData?.designation || ''}
      />

      <OTPModal />
      <CropModal />
      <AISuggestionModal />
      {!isProfileLocked && <MobileBottomNav />}
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <I18nProvider>
        <AuthProvider>
          <BiodataProvider>
            <MainContent />
          </BiodataProvider>
        </AuthProvider>
      </I18nProvider>
    </BrowserRouter>
  );
}


