import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LoginModal } from '../modals/LoginModal';
import { ForgotPasswordModal } from '../modals/ForgotPasswordModal';
import { ShieldX, Loader2 } from 'lucide-react';
import { ErrorPage } from '../common/ErrorPage';

interface AdminRouteProps {
  children: React.ReactNode;
  fallbackMessage?: string;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({
  children,
  fallbackMessage = 'Administrator privileges are required to access this page.',
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-slate-500 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <p className="text-sm font-medium">Verifying administrator authorization...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center max-w-md w-full bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl space-y-5">
          <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-inner">
            <ShieldX className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xl font-bold text-slate-900">Administrator Login Required</h4>
            <p className="text-xs text-slate-500">{fallbackMessage}</p>
          </div>
          <button
            onClick={() => setLoginOpen(true)}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-700 to-indigo-800 text-white font-bold text-sm hover:from-purple-800 hover:to-indigo-900 transition shadow-lg shadow-purple-700/20 cursor-pointer"
          >
            Sign In as Admin
          </button>
        </div>

        <LoginModal
          isOpen={loginOpen}
          onClose={() => setLoginOpen(false)}
          onOpenForgotPassword={() => {
            setLoginOpen(false);
            setForgotOpen(true);
          }}
        />

        <ForgotPasswordModal
          isOpen={forgotOpen}
          onClose={() => setForgotOpen(false)}
          onOpenLogin={() => {
            setForgotOpen(false);
            setLoginOpen(true);
          }}
        />
      </div>
    );
  }

  if (user?.role !== 'ADMIN') {
    return (
      <ErrorPage
        code={403}
        title="403 — Access Forbidden"
        subtitle="Administrator Privileges Required"
        description={`Your account (${user?.email || 'Current user'}) does not have administrator clearance to access this management console.`}
      />
    );
  }

  return <>{children}</>;
};
