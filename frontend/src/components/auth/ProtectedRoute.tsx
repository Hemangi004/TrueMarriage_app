import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackMessage?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallbackMessage,
}) => {
  const { isAuthenticated, isLoading, openLogin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      sessionStorage.setItem('tm_post_login_redirect', location.pathname + location.search);
      const prompt = fallbackMessage || 'Please log in to create your matrimonial biodata.';
      openLogin(undefined, prompt);
    }
  }, [isLoading, isAuthenticated, location.pathname, location.search, openLogin, fallbackMessage]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-slate-500 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <p className="text-sm font-medium">Verifying authentication status...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
