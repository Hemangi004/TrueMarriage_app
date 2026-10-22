import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { getBackLabel, getHomeLabel } from '../../utils/navigationI18n';

export interface ErrorPageProps {
  code?: 401 | 403 | 404 | 500 | number;
  title?: string;
  subtitle?: string;
  description?: string;
  attemptedPath?: string;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  code = 404,
  title: customTitle,
  subtitle: customSubtitle,
  description: customDescription,
  attemptedPath,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useI18n();

  const currentPath = attemptedPath || location.pathname;

  const errorData: Record<
    number,
    {
      title: string;
      message: string;
    }
  > = {
    401: {
      title: customTitle || 'Authentication Required',
      message:
        customDescription ||
        customSubtitle ||
        'Please sign in to access this page or resource.',
    },
    403: {
      title: customTitle || 'Access Forbidden',
      message:
        customDescription ||
        customSubtitle ||
        'You do not have permission to view this page.',
    },
    404: {
      title: customTitle || 'Page Not Found',
      message:
        customDescription ||
        customSubtitle ||
        "The page you're looking for doesn't exist or may have been moved.",
    },
    500: {
      title: customTitle || 'Server Error',
      message:
        customDescription ||
        customSubtitle ||
        'Something went wrong on our end. Please try again later.',
    },
  };

  const currentError = errorData[code] || {
    title: customTitle || `Error ${code}`,
    message: customDescription || customSubtitle || 'An unexpected error occurred.',
  };

  useEffect(() => {
    const originalTitle = document.title;
    document.title = `${code} – ${currentError.title} | TrueMarriage`;

    let metaRobots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    let createdRobots = false;
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.name = 'robots';
      document.head.appendChild(metaRobots);
      createdRobots = true;
    }
    metaRobots.content = 'noindex, nofollow';

    let metaStatus = document.querySelector('meta[name="prerender-status-code"]') as HTMLMetaElement | null;
    let createdStatus = false;
    if (!metaStatus) {
      metaStatus = document.createElement('meta');
      metaStatus.name = 'prerender-status-code';
      document.head.appendChild(metaStatus);
      createdStatus = true;
    }
    metaStatus.content = String(code);

    return () => {
      document.title = originalTitle;
      if (createdRobots && metaRobots) {
        metaRobots.remove();
      } else if (metaRobots) {
        metaRobots.content = 'index, follow';
      }
      if (createdStatus && metaStatus) {
        metaStatus.remove();
      }
    };
  }, [code, currentError.title]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 select-none">
      <div className="max-w-md w-full text-center bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200/80">
        {/* Simple Large Status Code */}
        <div className="text-7xl sm:text-8xl font-black text-slate-900 tracking-tight font-mono mb-2">
          {code}
        </div>

        {/* Clean Title */}
        <h1 className="text-2xl font-bold text-slate-800 mb-3">
          {currentError.title}
        </h1>

        {/* Simple Message */}
        <p className="text-sm text-slate-500 leading-relaxed mb-6">
          {currentError.message}
        </p>

        {/* Subtle Attempted Path if 404 */}
        {code === 404 && currentPath && currentPath !== '/' && (
          <div className="mb-6 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-mono truncate max-w-full inline-block">
            {currentPath}
          </div>
        )}

        {/* Simple Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto flex-1 py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span className="notranslate" translate="no">{getBackLabel(lang)}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full sm:w-auto flex-1 py-2.5 px-4 rounded-xl bg-[#F01472] hover:bg-[#D01060] text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Home size={16} />
            <span className="notranslate" translate="no">{getHomeLabel(lang)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
