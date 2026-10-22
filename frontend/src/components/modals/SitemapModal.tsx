import React from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Map,
  ExternalLink,
  Home,
  LayoutGrid,
  Search,
  Sparkles,
  Sliders,
  HeartHandshake,
  Shield,
  Lock,
  FileText,
  RefreshCw,
  Cookie,
  ArrowUpRight,
  Headphones,
} from 'lucide-react';
import { useI18n } from '../../context/I18nContext';

interface SitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenRefund?: () => void;
  onOpenLegal?: (tab: 'privacy' | 'terms' | 'refund') => void;
  onOpenCookies?: () => void;
  onOpenHelp?: () => void;
}

interface SitemapRouteItem {
  title: string;
  path: string;
  fullUrl: string;
  description: string;
  priority: string;
  changeFreq: string;
  icon: React.ReactNode;
  action: () => void;
}

export const SitemapModal: React.FC<SitemapModalProps> = ({
  isOpen,
  onClose,
  onOpenPrivacy,
  onOpenTerms,
  onOpenRefund,
  onOpenLegal,
  onOpenCookies,
  onOpenHelp,
}) => {
  const { t } = useI18n();
  const navigate = useNavigate();

  if (!isOpen || typeof document === 'undefined') return null;

  const handleNavigate = (path: string) => {
    onClose();
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const xmlRoutes: SitemapRouteItem[] = [
    {
      title: t('Home & Matchmaking Portal'),
      path: '/',
      fullUrl: 'https://truemarriage.in/',
      description: t('Create stunning matrimonial biodata, explore matchmaking features and testimonials.'),
      priority: '1.0',
      changeFreq: 'daily',
      icon: <Home className="w-4 h-4 text-[#F01472]" />,
      action: () => handleNavigate('/'),
    },
    {
      title: t('Biodata Maker'),
      path: '/biodata-maker',
      fullUrl: 'https://truemarriage.in/biodata-maker',
      description: t('Explore 100+ modern, traditional, and royal marriage biodata themes.'),
      priority: '0.9',
      changeFreq: 'weekly',
      icon: <LayoutGrid className="w-4 h-4 text-purple-600" />,
      action: () => handleNavigate('/biodata-maker'),
    },
    {
      title: t('Biodata Formats & SEO Directory'),
      path: '/biodata',
      fullUrl: 'https://truemarriage.in/biodata',
      description: t('Directory of 24+ specialized formats, regional language makers, and free PDF templates.'),
      priority: '0.9',
      changeFreq: 'weekly',
      icon: <Sparkles className="w-4 h-4 text-[#F01472]" />,
      action: () => handleNavigate('/biodata'),
    },
    {
      title: t('Discover Verified Profiles'),
      path: '/discover',
      fullUrl: 'https://truemarriage.in/discover',
      description: t('Browse authentic matchmaking profiles filtered by location, education, and community.'),
      priority: '0.9',
      changeFreq: 'hourly',
      icon: <Search className="w-4 h-4 text-indigo-600" />,
      action: () => handleNavigate('/discover'),
    },
    {
      title: t('Biodata Profile Wizard'),
      path: '/wizard',
      fullUrl: 'https://truemarriage.in/wizard',
      description: t('Interactive step-by-step assistant for personal, family, and horoscope details.'),
      priority: '0.8',
      changeFreq: 'weekly',
      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
      action: () => handleNavigate('/wizard'),
    },
    {
      title: t('Biodata Templates & PDF Maker'),
      path: '/templates',
      fullUrl: 'https://truemarriage.in/templates',
      description: t('Live preview, typography tuning, watermarking, and instant high-res PDF generation.'),
      priority: '0.8',
      changeFreq: 'weekly',
      icon: <Sliders className="w-4 h-4 text-rose-500" />,
      action: () => handleNavigate('/templates'),
    },
    {
      title: t('Interactions & Shortlists'),
      path: '/interactions',
      fullUrl: 'https://truemarriage.in/interactions',
      description: t('Manage sent & received marriage interests, accepted connections, and bookmarks.'),
      priority: '0.7',
      changeFreq: 'daily',
      icon: <HeartHandshake className="w-4 h-4 text-pink-600" />,
      action: () => handleNavigate('/interactions'),
    },
    {
      title: t('About Us — Mission & Values'),
      path: '/about-us',
      fullUrl: 'https://truemarriage.in/about-us',
      description: t('The story, core values, and privacy principles behind TrueMarriage.'),
      priority: '0.8',
      changeFreq: 'monthly',
      icon: <Sparkles className="w-4 h-4 text-[#F01472]" />,
      action: () => handleNavigate('/about-us'),
    },
    {
      title: t('Meet the Team — Developers & Contributors'),
      path: '/team',
      fullUrl: 'https://truemarriage.in/team',
      description: t('Meet the engineering and product team developing TrueMarriage.'),
      priority: '0.6',
      changeFreq: 'monthly',
      icon: <Sparkles className="w-4 h-4 text-[#F01472]" />,
      action: () => handleNavigate('/team'),
    },
  ];

  const legalItems = [
    {
      title: t('Privacy Policy'),
      icon: <Lock className="w-3.5 h-3.5 text-pink-500" />,
      action: () => {
        onClose();
        if (onOpenPrivacy) onOpenPrivacy();
        else onOpenLegal?.('privacy');
      },
    },
    {
      title: t('Terms of Service'),
      icon: <FileText className="w-3.5 h-3.5 text-purple-500" />,
      action: () => {
        onClose();
        if (onOpenTerms) onOpenTerms();
        else onOpenLegal?.('terms');
      },
    },
    {
      title: t('Refund Policy'),
      icon: <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />,
      action: () => {
        onClose();
        if (onOpenRefund) onOpenRefund();
        else onOpenLegal?.('refund');
      },
    },
    {
      title: t('Help & Support'),
      icon: <Headphones className="w-3.5 h-3.5 text-[#F01472]" />,
      action: () => {
        onClose();
        onOpenHelp?.();
      },
    },
    {
      title: t('Cookie Preferences'),
      icon: <Cookie className="w-3.5 h-3.5 text-amber-500" />,
      action: () => {
        onClose();
        onOpenCookies?.();
      },
    },
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-[100005] flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      style={{ isolation: 'isolate' }}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-[#FFF5F8] via-[#FFEAF3] to-[#FFF0F6] border-b border-pink-100 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F01472] text-white flex items-center justify-center shadow-md shadow-pink-300/40 shrink-0">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#1e1b4b] tracking-tight">
                  {t('Platform Sitemap & Route Index')}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-pink-100/80 text-[#F01472] text-[10px] font-bold border border-pink-200/60">
                  {t('sitemap.xml')}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{t('Verified index of all active public routes matching sitemap.xml')}</p>
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white">
          {/* Live XML Routes Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <span>{t('Indexed Routes in sitemap.xml')}</span>
                <span className="px-2 py-0.5 rounded-full bg-pink-100 text-[#F01472] text-[10px] font-bold border border-pink-200/60">
                  {xmlRoutes.length} {t('Active')}
                </span>
              </h4>
              <span className="text-[11px] text-slate-400 font-medium">{t('Base: https://truemarriage.in')}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {xmlRoutes.map((route) => (
                <button
                  key={route.path}
                  type="button"
                  onClick={route.action}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-pink-300 hover:shadow-md transition-all text-left flex flex-col justify-between gap-3 group cursor-pointer"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-pink-50 transition">
                          {route.icon}
                        </div>
                        <h5 className="font-extrabold text-xs text-slate-900 group-hover:text-[#F01472] transition">
                          {route.title}
                        </h5>
                      </div>
                      <ArrowUpRight size={14} className="text-slate-400 group-hover:text-[#F01472] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {route.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono notranslate" translate="no">
                      {route.path}
                    </span>
                    <div className="flex items-center gap-2">
                      <span>Priority: <strong className="text-slate-600">{route.priority}</strong></span>
                      <span>•</span>
                      <span className="capitalize">{route.changeFreq}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Legal & Policy Center */}
          <div>
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('Legal & Compliance Pages')}</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {legalItems.map((item) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={item.action}
                  className="px-3 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-pink-300 text-slate-700 hover:text-[#F01472] text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-2xs"
                >
                  {item.icon}
                  <span className="truncate">{item.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Raw Sitemap XML Link */}
          <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Map size={16} className="text-[#F01472] shrink-0" />
              <div>
                <p className="font-bold text-slate-900">{t('Standard XML Sitemap for Crawlers')}</p>
                <p className="text-[11px] text-slate-500">{t('Compliant with Google, Bing, and search engines standard sitemap 0.9 protocol.')}</p>
              </div>
            </div>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-pink-50 text-[#F01472] font-bold text-xs border border-pink-200 transition flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer notranslate"
              translate="no"
            >
              <span>sitemap.xml</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-gray-50/90 border-t border-gray-100 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-gray-400 font-medium">
            © 2026 TrueMarriage • Platform Sitemap
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#F01472] hover:bg-[#D00F60] text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
          >
            {t('Close')}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

