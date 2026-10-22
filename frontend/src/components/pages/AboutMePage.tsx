import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  Send,
  Lock,
  PhoneOff,
  Globe2,
  ArrowRight,
} from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { useAuth } from '../../context/AuthContext';
import { AppFooter } from '../common/AppFooter';

export const AboutMePage: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { openLogin, isAuthenticated } = useAuth();

  const supportEmail = 'support@truemarriage.in';

  const pledges = [
    {
      icon: <PhoneOff className="w-5 h-5 text-[#F01472]" />,
      title: t('Zero Telemarketing Calls. Ever.'),
      desc: t(
        'Traditional matrimonial sites operate aggressive call centers that hound parents during dinner time pushing expensive VIP packages. TrueMarriage has no outbound sales callers. We will never cold-call you or pressure your family into buying anything.'
      ),
    },
    {
      icon: <FileText className="w-5 h-5 text-[#F01472]" />,
      title: t('The Biodata Maker Stays 100% Free'),
      desc: t(
        'Exchanging an auspicious, well-crafted biodata is a cherished tradition across Indian homes. We believe no family should be forced to pay ₹500 or endure watermarks just to download a dignified PDF for their son or daughter.'
      ),
    },
    {
      icon: <Lock className="w-5 h-5 text-[#F01472]" />,
      title: t('Mutual, Protected Contact Privacy'),
      desc: t(
        'Your phone number and sensitive family details are never visible to the public or indexed on search engines. Contact information is only shared when both candidates mutually accept an interest request.'
      ),
    },
    {
      icon: <Globe2 className="w-5 h-5 text-[#F01472]" />,
      title: t('Rooted in Authentic Cultural Heritage'),
      desc: t(
        'From traditional Rajputana motifs and South Indian borders to clean modern aesthetics, our templates honor the diverse wedding cultures of India in 13 regional languages, so grandparents and elders feel at home.'
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFBFD] text-slate-900 flex flex-col selection:bg-rose-100 selection:text-[#C80E5A]">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-12 sm:pb-16 flex-1 w-full">

        {/* ── Editorial Header ─────────────────────────────────────── */}
        <header className="mb-14 sm:mb-20 space-y-6">
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-[450] text-slate-950 leading-[1.2] tracking-tight">
            {t('A quieter, more respectful way to find a life partner.')}
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
            {t(
              'Finding someone to share your life with is one of the most sacred transitions an Indian family ever navigates. It was never meant to feel like an aggressive sales pipeline, an intrusive telemarketing desk, or an endless paywall.'
            )}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              id="btn-about-create-biodata"
              onClick={() => {
                navigate('/templates');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 rounded-xl bg-[#F01472] hover:bg-[#C80E5A] text-white font-medium text-xs sm:text-sm shadow-sm transition cursor-pointer"
            >
              {t('Create Free Biodata')}
            </button>

            <button
              type="button"
              id="btn-about-explore-profiles"
              onClick={() => {
                if (isAuthenticated) {
                  navigate('/discover');
                } else {
                  openLogin();
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-slate-800 border border-slate-200 hover:border-rose-200 font-medium text-xs sm:text-sm transition cursor-pointer"
            >
              {t('Explore Verified Profiles')}
            </button>
          </div>
        </header>

        {/* ── Key Philosophical Quote ──────────────────────────────── */}
        <figure className="my-12 p-6 sm:p-8 rounded-2xl bg-white border border-rose-100 shadow-xs relative">
          <blockquote className="text-base sm:text-lg text-slate-800 leading-relaxed font-normal italic">
            “{t('A marriage brings together not just two individuals, but two families, their histories, and their aspirations. The platform that introduces them should reflect that gravity with quiet dignity, beautiful design, and absolute respect for personal privacy.')}”
          </blockquote>
          <figcaption className="mt-4 pt-3 border-t border-rose-50 text-xs text-slate-500 font-medium">
            — {t('The TrueMarriage Team')}
          </figcaption>
        </figure>

        {/* ── The Story & Mission (Editorial Chapters) ─────────────── */}
        <section className="space-y-12 sm:space-y-16 my-14 sm:my-20">
          
          {/* Chapter 1 */}
          <article className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-[450] text-slate-950">
              {t('Why we felt matrimony needed to start over')}
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              <p>
                {t(
                  'Over the past decade, major matrimonial platforms evolved from matchmaking services into aggressive sales machines. Families who registered to find a bride or groom found themselves subjected to unceasing phone calls from relationship managers, hidden paywalls to view basic details, and chaotic interfaces packed with commercial advertisements.'
                )}
              </p>
              <p>
                {t(
                  'Candidates had their personal phone numbers leaked or displayed openly to strangers, and simple biodata documents were watermarked unless families paid hefty subscription fees. We asked a simple question: why should starting a family feel so transactional?'
                )}
              </p>
            </div>
          </article>

          {/* Chapter 2 */}
          <article className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-[450] text-slate-950">
              {t('The biodata as a sacred first impression')}
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              <p>
                {t(
                  'In every corner of India — whether in Pune, Jaipur, Chennai, Ahmedabad, or Kolkata — a marriage biodata is the first formal token of respect exchanged between two households. It carries horoscopes, family lineages, educational achievements, and personal aspirations.'
                )}
              </p>
              <p>
                {t(
                  'We dedicated months to handcrafting cultural biodata templates with authentic regional motifs, delicate silk borders, and clean typography in 13 Indian languages. We made high-resolution PDF downloads 100% free with no watermarks and no hidden fees, because every family deserves an elegant introduction.'
                )}
              </p>
            </div>
          </article>

          {/* Chapter 3 */}
          <article className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-[450] text-slate-950">
              {t('Privacy by architecture, not as an afterthought')}
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              <p>
                {t(
                  'At TrueMarriage, your contact details belong entirely to you. Phone numbers are never sold to third-party data brokers, never broadcasted publicly, and never handed over to telemarketers. When you find a profile you connect with, communication proceeds only after both sides explicitly approve the request.'
                )}
              </p>
              <p>
                {t(
                  'We pair this with sincere profile verification to ensure every member on the platform is genuine, family-oriented, and looking for a meaningful life partnership.'
                )}
              </p>
            </div>
          </article>

        </section>

        {/* ── Our Commitments to Families ──────────────────── */}
        <section className="my-14 sm:my-20 pt-10 border-t border-rose-100 space-y-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-[450] text-slate-950">
              {t('Our commitments to every Indian family')}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {t('The principles that guide how we build, moderate, and run TrueMarriage every day.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pledges.map((pledge) => (
              <div
                key={pledge.title}
                className="p-6 rounded-2xl bg-white border border-rose-100 shadow-2xs space-y-3"
              >
                <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center">
                  {pledge.icon}
                </div>
                <h3 className="text-base font-[450] text-slate-900">
                  {pledge.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {pledge.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Transparent Comparison ──────────────────────────────── */}
        <section className="my-14 sm:my-20 pt-10 border-t border-rose-100 space-y-6">
          <h2 className="text-xl sm:text-2xl font-[450] text-slate-950">
            {t('What you can expect here')}
          </h2>

          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 text-left">
              
              <div className="p-6 space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {t('Phone & WhatsApp')}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {t('Completely private. Shared strictly upon mutual interest approval. No telemarketer will ever call your number.')}
                </p>
              </div>

              <div className="p-6 space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {t('Marriage Biodata')}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {t('100% free creation and high-resolution PDF download in 13 languages, with zero watermarks forever.')}
                </p>
              </div>

              <div className="p-6 space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {t('Community Standard')}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {t('Focused entirely on sincere, family-minded matchmaking. Zero casual dating clutter, bots, or ghost profiles.')}
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ── Community Care & Contact ─────────────────────────────── */}
        <section className="my-14 pt-10 border-t border-rose-100 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-4">
            <h2 className="text-lg sm:text-xl font-[450] text-slate-900">
              {t('We are always listening')}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
              {t(
                'TrueMarriage is built for the families who place their trust in us. If you have suggestions for regional cultural biodatas, questions regarding profile privacy, or feedback on your experience, our support team responds personally within 24 hours.'
              )}
            </p>

            <div className="pt-2">
              <a
                href={`mailto:${supportEmail}?subject=Inquiry%20regarding%20TrueMarriage`}
                className="px-5 py-2.5 rounded-xl bg-[#F01472] hover:bg-[#C80E5A] text-white font-medium text-xs sm:text-sm transition inline-flex items-center gap-2 shadow-2xs"
              >
                <Send className="w-4 h-4" />
                <span>{t('Email Support Team')}</span>
              </a>
            </div>
          </div>
        </section>

        {/* ── Meet the Team Link ───────────────────────────────────── */}
        <div className="pt-6 border-t border-rose-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
          <span className="text-slate-500">
            {t('Curious about the developers and designers building this platform?')}
          </span>
          <Link
            to="/team"
            className="inline-flex items-center gap-1.5 font-medium text-[#F01472] hover:text-[#C80E5A] transition group shrink-0"
          >
            <span>{t('Meet the Team')}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

      </main>

      {/* Global App Footer */}
      <AppFooter />
    </div>
  );
};
