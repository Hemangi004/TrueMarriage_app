import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { loginApi, logoutApi, getCurrentUserApi, verifyGoogleIdTokenApi } from '../services/apiService';

export interface User {
  id: string;
  email: string;
  full_name?: string | null;
  role: 'USER' | 'ADMIN';
  status: 'PENDING_VERIFICATION' | 'ACTIVE' | 'DEACTIVATED' | 'BLOCKED';
  is_email_verified: boolean;
  phone?: string | null;
  is_phone_verified?: boolean;
  is_profile_completed?: boolean;
}

interface AuthContextType {
  user: User | null;
  authenticated: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; user?: User }>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isLoginOpen: boolean;
  isRegisterOpen: boolean;
  isForgotPasswordOpen: boolean;
  openLogin: (postLoginAction?: (() => void) | unknown, promptMessage?: string) => void;
  openRegister: () => void;
  openForgotPassword: () => void;
  closeAuthModals: () => void;
  setLoginOpen: (open: boolean) => void;
  setRegisterOpen: (open: boolean) => void;
  setForgotPasswordOpen: (open: boolean) => void;
  requireAuth: (callback: () => void, promptMessage?: string) => void;
  authToast: string | null;
  showAuthToast: (message: string) => void;
  postLoginAction: (() => void) | null;
  setPostLoginAction: (action: (() => void) | null) => void;
  executePostLoginAction: (customUser?: User | null) => boolean;
  loginWithGoogleIdToken?: (idToken: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const cachedRole = localStorage.getItem('user_role');
      const token = localStorage.getItem('auth_token') || localStorage.getItem('access_token');
      if (cachedRole === 'ADMIN' && token) {
        return {
          id: 'admin',
          email: 'admin@truemarriage.in',
          role: 'ADMIN',
          status: 'ACTIVE',
          is_email_verified: true,
        };
      }
      const cachedUserStr = localStorage.getItem('auth_user');
      if (cachedUserStr && token) {
        return JSON.parse(cachedUserStr);
      }
    } catch {
      // Ignore localStorage errors
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoginOpen, setLoginOpen] = useState<boolean>(false);
  const [isRegisterOpen, setRegisterOpen] = useState<boolean>(false);
  const [isForgotPasswordOpen, setForgotPasswordOpen] = useState<boolean>(false);
  const [postLoginAction, setPostLoginAction] = useState<(() => void) | null>(null);
  const [authToast, setAuthToast] = useState<string | null>(null);
  const navigate = useNavigate();

  const showAuthToast = (message: string) => {
    setAuthToast(message);
    setTimeout(() => {
      setAuthToast((curr) => (curr === message ? null : curr));
    }, 4500);
  };

  const openLogin = (action?: (() => void) | unknown, promptMessage?: string) => {
    if (typeof action === 'function') {
      setPostLoginAction(() => action as () => void);
    }
    if (typeof promptMessage === 'string' && promptMessage.trim()) {
      showAuthToast(promptMessage);
    }
    setRegisterOpen(false);
    setForgotPasswordOpen(false);
    setLoginOpen(true);
  };

  const openRegister = () => {
    setLoginOpen(false);
    setForgotPasswordOpen(false);
    setRegisterOpen(true);
  };

  const openForgotPassword = () => {
    setLoginOpen(false);
    setRegisterOpen(false);
    setForgotPasswordOpen(true);
  };

  const closeAuthModals = () => {
    setLoginOpen(false);
    setRegisterOpen(false);
    setForgotPasswordOpen(false);
  };

  const executePostLoginAction = (customUser?: User | null) => {
    const activeRole = customUser?.role || user?.role || localStorage.getItem('user_role');
    // If user is ADMIN, always route exclusively to /admin
    if (activeRole === 'ADMIN') {
      sessionStorage.removeItem('tm_post_login_redirect');
      setPostLoginAction(null);
      window.location.href = '/admin';
      return true;
    }

    // sessionStorage is the most reliable signal (survives re-renders)
    const storedPath = sessionStorage.getItem('tm_post_login_redirect');

    if (storedPath && storedPath !== '/' && storedPath !== '/landing' && storedPath !== '/login') {
      sessionStorage.removeItem('tm_post_login_redirect');
      setPostLoginAction(null);
      navigate(storedPath, { replace: true });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return true;
    }

    if (postLoginAction) {
      const action = postLoginAction;
      setPostLoginAction(null);
      action();
      return true;
    }

    // Default post-login destination: navigate directly to /discover instead of landing page
    sessionStorage.removeItem('tm_post_login_redirect');
    navigate('/discover', { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return true;
  };

  const refreshUser = async () => {
    try {
      const res = await getCurrentUserApi();
      const userData = res?.user || (res?.id && res?.email ? res : null);
      if (userData) {
        setUser(userData);
        if (userData.role) {
          localStorage.setItem('user_role', userData.role);
        }
        localStorage.setItem('auth_user', JSON.stringify(userData));
        localStorage.setItem('auth_user_id', userData.id);
      } else {
        setUser(null);
        localStorage.removeItem('user_role');
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_user_id');
      }
    } catch {
      setUser(null);
      localStorage.removeItem('user_role');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_user_id');
    }
  };

  const refreshAuth = refreshUser;

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);

      // Handle OAuth query parameters (?oauth_success=true&token=... or ?oauth_error=...)
      let hadOAuthSuccess = false;
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const oauthSuccess = searchParams.get('oauth_success');
        const oauthToken = searchParams.get('token');
        const oauthError = searchParams.get('oauth_error');

        if (oauthSuccess === 'true') {
          hadOAuthSuccess = true;
          if (oauthToken) {
            localStorage.setItem('auth_token', oauthToken);
            localStorage.setItem('access_token', oauthToken);
          }

          // If completed inside a popup, notify opener and close cleanly
          if (window.opener && window.opener !== window) {
            try {
              window.opener.postMessage({ type: 'tm:oauth_token', token: oauthToken }, '*');
              window.close();
              return;
            } catch {
              // Ignore cross-origin errors
            }
          }

          const url = new URL(window.location.href);
          url.searchParams.delete('oauth_success');
          url.searchParams.delete('token');
          window.history.replaceState({}, '', url.pathname + (url.search || '') + url.hash);
        } else if (oauthError) {
          console.error('OAuth sign-in error:', oauthError);
          const url = new URL(window.location.href);
          url.searchParams.delete('oauth_error');
          window.history.replaceState({}, '', url.pathname + (url.search || '') + url.hash);
        }
      } catch (e) {
        console.warn('Failed to parse OAuth query params:', e);
      }

      await refreshUser();
      if (hadOAuthSuccess) {
        executePostLoginAction();
      }
      setLoading(false);
    };
    initAuth();

    const handleOpenLogin = (e: Event) => {
      const customEvent = e as CustomEvent<{ redirect?: string }>;
      if (customEvent?.detail?.redirect) {
        sessionStorage.setItem('tm_post_login_redirect', customEvent.detail.redirect);
      }
      openLogin();
    };
    window.addEventListener('tm:open-login', handleOpenLogin);

    const handleOAuthMessage = async (e: MessageEvent) => {
      if (e.data && e.data.type === 'tm:oauth_token' && e.data.token) {
        localStorage.setItem('auth_token', e.data.token);
        localStorage.setItem('access_token', e.data.token);
        await refreshUser();
        executePostLoginAction();
      } else if (e.data && e.data.type === 'tm:google_id_token' && e.data.id_token) {
        try {
          await loginWithGoogleIdToken(e.data.id_token);
        } catch (err) {
          console.error('Failed to authenticate Google ID token from window message:', err);
        }
      }
    };
    window.addEventListener('message', handleOAuthMessage);

    // Native mobile app bridge listener (for Android WebView or Capacitor native plugins)
    const handleGoogleIdTokenEvent = async (e: Event) => {
      const customEvent = e as CustomEvent<{ id_token: string }>;
      if (customEvent?.detail?.id_token) {
        try {
          await loginWithGoogleIdToken(customEvent.detail.id_token);
        } catch (err) {
          console.error('Failed to authenticate Google ID token from custom event:', err);
        }
      }
    };
    window.addEventListener('tm:google-id-token', handleGoogleIdTokenEvent);

    (window as any).handleAndroidGoogleIdToken = (idToken: string) => {
      loginWithGoogleIdToken(idToken).catch((err) => {
        showAuthToast(err?.message || 'Google sign-in failed');
      });
    };
    (window as any).handleAndroidGoogleError = (errorMsg: string) => {
      showAuthToast(errorMsg || 'Google sign-in was cancelled');
    };

    return () => {
      window.removeEventListener('tm:open-login', handleOpenLogin);
      window.removeEventListener('message', handleOAuthMessage);
      window.removeEventListener('tm:google-id-token', handleGoogleIdTokenEvent);
      delete (window as any).handleAndroidGoogleIdToken;
      delete (window as any).handleAndroidGoogleError;
    };
  }, []);


  const login = async (email: string, password: string) => {
    try {
      const result = await loginApi(email, password);
      const userData: User | null = result?.user || (result?.id && result?.email ? result : null);
      if (userData) {
        setUser(userData);
        if (userData.role) {
          localStorage.setItem('user_role', userData.role);
        }
        localStorage.setItem('auth_user', JSON.stringify(userData));
        localStorage.setItem('auth_user_id', userData.id);
        if (userData.role === 'ADMIN') {
          sessionStorage.removeItem('tm_post_login_redirect');
          setPostLoginAction(null);
          window.location.href = '/admin';
        }
        return { success: true, user: userData };
      }
      return { success: false, message: result?.message || 'Login failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      // Ignore errors on logout
    }
    // Clear all auth tokens, session redirects, and cached user profile drafts
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_user_id');
    localStorage.removeItem('tm_user_preferences');
    localStorage.removeItem('tm_saved_profiles');
    localStorage.removeItem('tm_shortlisted_profiles');
    sessionStorage.clear();

    // Purge all user and guest biodata draft keys
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key &&
          (key.startsWith('soul_sync_') ||
           key.startsWith('truemarriage_wizard_') ||
           key === 'biodata_wizard_fields' ||
           key === 'selected_template_id' || key === 'last_used_template_id' || key === 'last_used_template_name')
        ) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch {
      // Ignore storage read errors
    }

    // Synchronously notify all mounted context providers (e.g. BiodataContext) to purge React memory
    window.dispatchEvent(new CustomEvent('auth:logout'));

    setUser(null);
    navigate('/login', { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const authenticated = Boolean(user && user.status === 'ACTIVE');

  const requireAuth = (callback: () => void, promptMessage?: string) => {
    if (authenticated) {
      callback();
    } else {
      const message = promptMessage || 'Please log in to create your matrimonial biodata.';
      showAuthToast(message);
      openLogin(callback, message);
    }
  };

  const loginWithGoogleIdToken = async (idToken: string) => {
    try {
      setLoading(true);
      const res = await verifyGoogleIdTokenApi(idToken);
      if (res?.access_token) {
        localStorage.setItem('auth_token', res.access_token);
        localStorage.setItem('access_token', res.access_token);
      }
      await refreshUser();
      closeAuthModals();
      executePostLoginAction(res?.user);
      return res;
    } catch (err: any) {
      console.error('Google ID token verification failed:', err);
      showAuthToast(err?.message || 'Google sign-in failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authenticated,
        isAuthenticated: authenticated,
        loading,
        isLoading: loading,
        login,
        loginWithGoogleIdToken,
        logout,
        refreshAuth,
        refreshUser,
        isLoginOpen,
        isRegisterOpen,
        isForgotPasswordOpen,
        openLogin,
        openRegister,
        openForgotPassword,
        closeAuthModals,
        setLoginOpen,
        setRegisterOpen,
        setForgotPasswordOpen,
        requireAuth,
        authToast,
        showAuthToast,
        postLoginAction,
        setPostLoginAction,
        executePostLoginAction,
      }}
    >
      {children}

      {/* Floating Toast Notification for Auth Gate */}
      {authToast && (
        <div className="fixed bottom-6 right-6 z-[100060] px-5 py-2.5 rounded-full bg-white/95 text-slate-800 text-xs sm:text-sm font-semibold shadow-xl shadow-rose-950/10 border border-rose-200/90 backdrop-blur-md flex items-center gap-2.5 animate-toast-bottom-right pointer-events-none">
          <Sparkles size={15} className="text-[#F01472] shrink-0" />
          <span>{authToast}</span>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
