import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  Palette,
  Cpu,
  FileText,
  Compass,
  User,
} from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { updatePageSEO, ROUTE_SEO } from '../../utils/seo';
import { AppFooter } from '../common/AppFooter';

interface DeveloperProfile {
  name: string;
  role: string;
  area: string;
  bio: string;
  avatarUrl: string;
  skills?: string[];
  ownership?: string[];
}

export const TeamPage: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  useEffect(() => {
    updatePageSEO(ROUTE_SEO['/team']);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const developers: DeveloperProfile[] = [
    {
      name: 'Pratyush Nirwan',
      role: t('Full-Stack Engineer'),
      area: t('UI Engineering, Discovery Feed, Database Maintenance & Website-Wide Translations'),
      bio: t(
        'Engineered user interfaces and mobile responsiveness across the entire platform, architected the matchmaking discovery feed, managed and maintained ongoing database operations and query performance, and built the website-wide localization engine supporting 13 Indian languages alongside production infrastructure automation.'
      ),
      avatarUrl: 'https://github.com/Pratyush-Nirwan.png',
      skills: [
        'UI Engineering',
        'React 19',
        'TypeScript',
        'Discovery Feed Engine',
        'Database Maintenance & Indexing',
        'Mobile Responsiveness',
        'Website-Wide i18n',
        'FastAPI',
        'Docker & CI/CD',
      ],
      ownership: [
        t('User interface (UI) engineering and responsive layout implementation'),
        t('Matchmaking discovery feed and candidate search algorithms'),
        t('Database management, ongoing query maintenance & indexing performance'),
        t('Mobile-first responsive design across all application pages'),
        t('Website-wide localization engine across 13 Indian languages'),
        t('Production infrastructure, automated deployments & uptime'),
      ],
    },
    {
      name: 'Hemangi Kayarkar',
      role: t('Product Designer'),
      area: t('Product Design, Biodata Builders, Design Systems & Template Translations'),
      bio: t(
        'Led product design and frontend engineering across the platform, created the interactive matrimonial biodata builders, crafted the comprehensive design systems and tokens, and implemented regional template translations and authentic typography across 100+ biodata layouts celebrating diverse Indian traditions.'
      ),
      avatarUrl: 'https://github.com/Hemangi004.png',
      skills: [
        'Frontend Engineering',
        'Product Design',
        'UI/UX Design',
        'React',
        'TypeScript',
        'Biodata Builders',
        'Template Translations',
        'Design Systems',
        'Tailwind CSS',
        'SVG Motifs',
        'Print Stylesheet Precision',
      ],
      ownership: [
        t('Product design, visual layout systems & page styling'),
        t('Interactive multi-step matrimonial biodata builders'),
        t('100+ cultural biodata layouts across Indian regional traditions'),
        t('Regional template translations and authentic native typography'),
        t('Unified design system tokens, color palettes & heritage motifs'),
        t('High-fidelity PDF print generation and export precision'),
      ],
    },
    {
      name: 'Shraddha Iyer',
      role: t('Security Engineer'),
      area: t('Core Database Architecture, Auth Subsystems, Security & Data Privacy'),
      bio: t(
        'Engineered the foundational PostgreSQL database architecture and relational data models, built the core authentication and authorization infrastructure, created the strict 2-step OTP verification pipeline, developed the matrimonial biodata PDF generation engine, and established the Admin Security Operations Center (SOC).'
      ),
      avatarUrl: 'https://github.com/Shraddhariyer.png',
      skills: [
        'Database Architecture',
        'PostgreSQL & SQLAlchemy',
        'Alembic Migrations',
        'Backend Engineering',
        'FastAPI',
        'Python',
        'Auth & RBAC',
        'Security Operations (SOC)',
        '2-Step OTP Pipeline',
        'PDF Generation Engine',
      ],
      ownership: [
        t('Foundational database architecture, relational models & entity schemas'),
        t('Database migration pipelines, Alembic versioning & backend test suites'),
        t('End-to-end authentication, JWT sessions & Google OAuth integration'),
        t('Strict 2-step dual-channel OTP verification pipeline (SMS & Email)'),
        t('Admin Security Operations Center (SOC) & audit logging middleware'),
        t('Matrimonial biodata PDF generation engine & privacy firewalls'),
      ],
    },
    {
      name: 'Aishwarya Sakharkar',
      role: t('UI Designer'),
      area: t('User Interface Design, Visual Aesthetics & Design Systems'),
      bio: t(
        'Crafted intuitive user interfaces and elegant visual layouts across TrueMarriage, establishing design consistency, refined typography, and delightful micro-interactions for a warm and dignifying matrimonial experience.'
      ),
      avatarUrl: 'https://github.com/AishwaryaSakharkar.png',
      skills: [
        'UI Design',
        'Visual Design',
        'Figma',
        'Design Systems',
        'Typography & Palettes',
        'Micro-Interactions',
        'User Experience',
      ],
      ownership: [
        t('User interface visual design and aesthetic consistency'),
        t('Design system tokens, typography and color palettes'),
        t('Component layout specifications and interactive styling'),
      ],
    },
  ];

  const engineeringPrinciples = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#F01472]" />,
      title: t('Privacy by Architecture'),
      desc: t(
        'Zero third-party trackers, telemarketing funnels, or data brokers. Candidate contact details are strictly sealed behind mutual consent with granular privacy controls.'
      ),
    },
    {
      icon: <Palette className="w-5 h-5 text-[#F01472]" />,
      title: t('Cultural Heritage in Code'),
      desc: t(
        'We believe digital craft should honor real family traditions. Our templates celebrate regional Indian heritage with native scripts, authentic motifs, and respectful layouts.'
      ),
    },
    {
      icon: <Cpu className="w-5 h-5 text-[#F01472]" />,
      title: t('Lightweight & High Performance'),
      desc: t(
        'Built with a modern core — React 19, TypeScript, and FastAPI. Instant client-side page rendering, zero telemetry bloat, and fast biodata generation on every device.'
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDFE] text-slate-800 flex flex-col justify-between selection:bg-rose-100 selection:text-rose-900">
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-20 space-y-14 sm:space-y-20">
        {/* ── Breadcrumb / Return Navigation ───────────────────────── */}
        <nav aria-label="Breadcrumb">
          <button
            type="button"
            onClick={() => {
              navigate('/about-us');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-500 hover:text-[#F01472] transition-colors font-normal cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F01472] rounded-md py-1 pr-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('Back to About Us')}</span>
          </button>
        </nav>

        {/* ── Page Header / Hero ───────────────────────────────────── */}
        <header className="space-y-5 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-[450] text-slate-950 leading-[1.18] tracking-tight">
            {t('Meet the team behind TrueMarriage')}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {t(
              'TrueMarriage is engineered and maintained by a dedicated development team committed to modern engineering, strict privacy, and genuine respect for Indian matrimony.'
            )}
          </p>
        </header>

        {/* ── Team Cards Showcase ─────────────────────────────────── */}
        <section aria-label="Team Members">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {developers.map((dev, idx) => (
              <div
                key={dev.name}
                onClick={() => setFlippedIndex((prev) => (prev === idx ? null : idx))}
                className="group perspective-1000 w-full min-h-[400px] sm:min-h-[420px] select-none cursor-pointer"
              >
                <div
                  className={`flip-card-inner transform-style-3d relative w-full h-full duration-500 transition-transform ease-out rounded-3xl shadow-[0_4px_24px_rgba(240,20,114,0.04)] group-hover:shadow-[0_16px_40px_rgba(240,20,114,0.12)] ${
                    flippedIndex === idx ? 'max-md:rotate-y-180' : ''
                  }`}
                >
                  {/* FRONT SIDE: Profile Details & Bio */}
                  <div className="backface-hidden absolute inset-0 w-full h-full rounded-3xl bg-white border border-rose-100/90 p-5 sm:p-6 flex flex-col space-y-4 overflow-hidden">
                    {/* Header: Avatar, Name & Lead Role */}
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-12 h-12 sm:w-13 sm:h-13 rounded-2xl overflow-hidden bg-rose-50/70 border border-rose-100 shrink-0 flex items-center justify-center text-rose-600 font-medium shadow-2xs">
                        <img
                          src={dev.avatarUrl}
                          alt={dev.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center bg-rose-50 text-[#F01472] -z-10">
                          <User className="w-5 h-5 text-rose-400" />
                        </span>
                      </div>

                      <div className="min-w-0 flex-1 pt-0.5">
                        <h3 className="text-base sm:text-[17px] font-[450] text-slate-900 tracking-tight leading-snug whitespace-nowrap">
                          {dev.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#F01472] font-medium mt-0.5 whitespace-nowrap">
                          {dev.role}
                        </p>
                      </div>
                    </div>

                    {/* Narrative Bio */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {dev.bio}
                    </p>
                  </div>

                  {/* BACK SIDE: Maximized Full-Bleed Photo */}
                  <div className="backface-hidden rotate-y-180 absolute inset-0 w-full h-full rounded-3xl overflow-hidden border border-rose-100/90 bg-slate-950 flex flex-col justify-end shadow-xl">
                    <img
                      src={dev.avatarUrl}
                      alt={dev.name}
                      className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />

                    {/* Fallback Icon */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-rose-950 via-slate-900 to-black text-rose-200 -z-10">
                      <User className="w-16 h-16 opacity-30 text-rose-200" />
                    </div>

                    {/* Vignette Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent pointer-events-none" />

                    {/* Overlay Content at Bottom */}
                    <div className="relative z-10 p-5 sm:p-6 text-white space-y-1">
                      <h3 className="text-xl sm:text-2xl font-semibold text-white drop-shadow-sm tracking-tight whitespace-nowrap">
                        {dev.name}
                      </h3>
                      <p className="text-xs text-slate-300 font-normal line-clamp-2 leading-relaxed drop-shadow-xs">
                        {dev.area}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Engineering Standards / Creed ────────────────────────── */}
        <section className="pt-12 border-t border-rose-100/80 space-y-8" aria-labelledby="creed-heading">
          <div className="space-y-2 max-w-2xl">
            <h2 id="creed-heading" className="text-xl sm:text-2xl font-[450] text-slate-950">
              {t('Our Engineering Creed')}
            </h2>
            <p className="text-sm text-slate-600 font-normal leading-relaxed">
              {t(
                'How we design, develop, and safeguard every layer of the TrueMarriage platform.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {engineeringPrinciples.map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-3xl bg-white border border-rose-100/90 shadow-[0_2px_16px_rgba(240,20,114,0.03)] space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="text-base font-[450] text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Architecture & Exploration Panel ─────────────────────── */}
        <section className="p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-rose-50/70 to-white border border-rose-100/90 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-[0_2px_20px_rgba(240,20,114,0.04)]">
          <div className="space-y-2.5 max-w-xl">
            <h3 className="text-base sm:text-lg font-[450] text-slate-900 leading-snug">
              {t('Pure Architecture, Zero Third-Party Telemetry')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {t(
                'TrueMarriage is built cleanly with React 19, TypeScript, and FastAPI. No advertising SDKs, no behavioral tracking pixels, and zero data brokers—ensuring family biodatas render swiftly and candidate information remains completely private.'
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                navigate('/biodata');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F01472] hover:bg-[#d01060] text-white text-xs sm:text-sm font-medium transition shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F01472] focus-visible:ring-offset-2"
            >
              <FileText className="w-4 h-4" />
              <span>{t('Biodata Maker')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                navigate('/about-us');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-rose-300 hover:bg-rose-50/50 text-slate-800 text-xs sm:text-sm font-medium transition shadow-2xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F01472] focus-visible:ring-offset-2"
            >
              <Compass className="w-4 h-4" />
              <span>{t('Our Mission')}</span>
            </button>
          </div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
};
