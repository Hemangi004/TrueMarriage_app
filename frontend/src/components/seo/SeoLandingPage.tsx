import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Download,
  ShieldCheck,
  Eye,
  ChevronDown,
  ChevronUp,
  Heart,
  HelpCircle,
  MapPin,
  Layers,
  Globe,
  Printer,
  Smartphone,
  Check,
  X,
  Compass,
  BookOpen,
} from 'lucide-react';
import { SEO_LANDING_PAGES } from '../../data/seoLandingPages';
import type { SeoLandingPageData } from '../../data/seoLandingPages';
import { updatePageSEO } from '../../utils/seo';
import { AppFooter } from '../common/AppFooter';

interface SeoLandingPageProps {
  slug?: string;
}

export const SeoLandingPage: React.FC<SeoLandingPageProps> = ({ slug: propSlug }) => {
  const { slug: paramSlug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const slug = propSlug || paramSlug || 'free-marriage-biodata-maker';
  const pageData: SeoLandingPageData = SEO_LANDING_PAGES[slug] || SEO_LANDING_PAGES['free-marriage-biodata-maker'];

  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeFormatTab, setActiveFormatTab] = useState<'boy' | 'girl' | 'primary'>('primary');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Build structured data for Google Search
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: pageData.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };

    const howToSchema = {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: pageData.howSection.heading,
      description: pageData.howSection.intro,
      step: pageData.howSection.workflowSteps.map((step) => ({
        '@type': 'HowToStep',
        position: step.stepNumber,
        name: step.title,
        text: step.description,
      })),
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://truemarriage.in/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Biodata Formats',
          item: 'https://truemarriage.in/biodata',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: pageData.primaryKeyword,
          item: `https://truemarriage.in/biodata/${pageData.slug}`,
        },
      ],
    };

    updatePageSEO({
      title: pageData.title,
      description: pageData.description,
      canonicalPath: pageData.canonicalPath,
      schema: [faqSchema, howToSchema, breadcrumbSchema],
    });
  }, [slug, pageData]);

  const activeSample =
    activeFormatTab === 'boy' && pageData.sampleBiodatas.boySample
      ? pageData.sampleBiodatas.boySample
      : activeFormatTab === 'girl' && pageData.sampleBiodatas.girlSample
      ? pageData.sampleBiodatas.girlSample
      : pageData.sampleBiodatas.primarySample ||
        pageData.sampleBiodatas.boySample ||
        pageData.sampleBiodatas.girlSample;

  const handleStartMaker = () => {
    navigate('/templates');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartWizard = () => {
    navigate('/templates');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const boyTabLabel =
    slug === 'marriage-biodata-in-hindi'
      ? 'वर प्रारूप (लड़का)'
      : slug === 'marriage-biodata-in-marathi'
      ? 'वर स्वरूप (मुलगा)'
      : slug === 'gujarati-marriage-biodata'
      ? 'વર ફોર્મેટ (છોકરો)'
      : slug === 'tamil-marriage-biodata'
      ? 'மணமகன் வடிவம் (ஆண்)'
      : slug === 'telugu-marriage-biodata'
      ? 'వరుడి నమూనా (అబ్బాయి)'
      : slug === 'kannada-marriage-biodata'
      ? 'ವರನ ಮಾದರಿ (ಹುಡುಗ)'
      : slug === 'bengali-marriage-biodata'
      ? 'পাত্রের ফরম্যাট (ছেলে)'
      : 'Groom Format (Boy)';

  const girlTabLabel =
    slug === 'marriage-biodata-in-hindi'
      ? 'वधू प्रारूप (लड़की)'
      : slug === 'marriage-biodata-in-marathi'
      ? 'वधू स्वरूप (मुलगी)'
      : slug === 'gujarati-marriage-biodata'
      ? 'કન્યા ફોર્મેટ (છોકરી)'
      : slug === 'tamil-marriage-biodata'
      ? 'மணமகள் வடிவம் (பெண்)'
      : slug === 'telugu-marriage-biodata'
      ? 'వధువు నమూనా (అమ్మాయి)'
      : slug === 'kannada-marriage-biodata'
      ? 'ವಧುವಿನ ಮಾದರಿ (ಹುಡುಗಿ)'
      : slug === 'bengali-marriage-biodata'
      ? 'পাত্রীর ফরম্যাট (মেয়ে)'
      : 'Bride Format (Girl)';

  return (
    <div className="min-h-screen bg-[#FFFBFD] text-slate-900 flex flex-col selection:bg-rose-100 selection:text-[#C80E5A]">
      {/* ── Breadcrumb Navigation ─────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-3 w-full">
        <ol className="flex items-center space-x-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
          <li>
            <Link to="/" className="hover:text-[#F01472] transition-colors">
              Home
            </Link>
          </li>
          <li className="text-slate-300">/</li>
          <li>
            <Link to="/biodata" className="hover:text-[#F01472] transition-colors">
              Biodata Formats
            </Link>
          </li>
          <li className="text-slate-300">/</li>
          <li className="text-slate-800 font-semibold truncate max-w-[200px] sm:max-w-none">
            {pageData.primaryKeyword}
          </li>
        </ol>
      </nav>

      {/* ── Hero Section ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-4 pb-12 sm:pb-16 lg:pb-20">
        <div className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_top,#ffeaf3_0%,transparent_65%)]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Heading, Subheading & CTAs */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100/80 text-[#C80E5A] text-xs font-bold border border-pink-200/80 shadow-2xs">
                <Sparkles size={13} className="text-[#F01472]" />
                <span>{pageData.badge}</span>
              </div>

              {pageData.nativeScript && (
                <div className="text-lg sm:text-xl font-medium text-pink-700 tracking-wide font-serif">
                  {pageData.nativeScript}
                </div>
              )}

              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-950 leading-[1.2] tracking-tight">
                {pageData.h1}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto lg:mx-0">
                {pageData.subheading}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={handleStartMaker}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#F01472] hover:bg-[#D00F60] text-white font-bold text-sm shadow-md shadow-pink-300/40 hover:shadow-lg hover:shadow-pink-300/50 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  <span>{pageData.ctaText || 'Create Free Biodata PDF'}</span>
                  <ArrowRight size={15} />
                </button>

                <button
                  type="button"
                  onClick={handleStartWizard}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white hover:bg-rose-50 text-slate-800 border border-slate-200 hover:border-pink-300 font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
                >
                  <Eye size={16} className="text-[#F01472]" />
                  <span>{pageData.previewCtaText || 'Preview 100+ Templates'}</span>
                </button>
              </div>

              {/* Highlights Checklist */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 text-xs text-slate-600 max-w-lg mx-auto lg:mx-0">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span>100% Free Download</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span>Zero Watermarks</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span>Print-Ready A4 PDF</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span>WhatsApp Optimized</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span>13 Indian Languages</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span>Vedic & Modern Layouts</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Sample Biodata Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-sm sm:max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-xl border border-pink-100/80 transition-all hover:shadow-2xl">
                {/* Decorative Top Stamp */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-rose-100 text-xs">
                  <div className="flex items-center gap-1.5 text-[#F01472] font-bold">
                    <Heart size={14} className="fill-[#F01472]" />
                    <span>TrueMarriage Auspicious Format</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[10px] border border-emerald-100">
                    A4 PDF Verified
                  </span>
                </div>

                {/* Candidate Quick Header */}
                {activeSample && (
                  <div className="space-y-4">
                    <div className="text-center py-2 bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 rounded-2xl border border-pink-100/60">
                      <div className="text-xs uppercase tracking-wider text-rose-800 font-semibold">
                        {pageData.nativeScript ? `|| ${pageData.nativeScript} ||` : '|| Marriage Biodata ||'}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mt-0.5 font-serif">
                        {activeSample.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {activeSample.title}
                      </p>
                    </div>

                    {/* Sample Key Fields Table */}
                    <div className="space-y-2 text-xs divide-y divide-slate-100">
                      {activeSample.fields.slice(0, 6).map((field, idx) => (
                        <div key={idx} className="pt-2 flex justify-between items-start gap-2">
                          <span className="text-slate-500 font-medium shrink-0">
                            {field.label}:
                          </span>
                          <span className="text-slate-900 font-semibold text-right">
                            {field.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handleStartMaker}
                        className="w-full py-2.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-[#F01472] font-bold text-xs border border-pink-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles size={13} />
                        <span>Use This Layout for Free</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE QUESTION 1: WHY ─────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-white border-y border-pink-100/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mb-10 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F01472] uppercase tracking-wider mb-2">
              <BookOpen size={13} />
              <span>Core Understanding</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {pageData.whySection.heading}
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              {pageData.whySection.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {pageData.whySection.reasons.map((reason, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-gradient-to-br from-[#FFFBFD] to-[#FFF5F8] border border-pink-100/90 hover:border-pink-300 hover:shadow-md transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-pink-100 text-[#F01472] font-extrabold text-sm flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  0{index + 1}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {reason.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CORE QUESTION 2: HOW ─────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-[#FFFBFD]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mb-10 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F01472] uppercase tracking-wider mb-2">
              <Compass size={13} />
              <span>Step-by-Step Blueprint</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {pageData.howSection.heading}
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              {pageData.howSection.intro}
            </p>
          </div>

          {/* Workflow Steps */}
          <div className="space-y-4 mb-12">
            {pageData.howSection.workflowSteps.map((step) => (
              <div
                key={step.stepNumber}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 hover:border-pink-300 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-200 text-[#F01472] font-black text-base flex items-center justify-center shrink-0 group-hover:bg-[#F01472] group-hover:text-white transition-colors">
                  {step.stepNumber}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <ArrowRight size={18} className="text-slate-300 group-hover:text-[#F01472] group-hover:translate-x-1 transition-all hidden sm:block shrink-0" />
              </div>
            ))}
          </div>

          {/* Key Elements Checklist & Dos/Don'ts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Checklist */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-pink-100 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <span>Essential Elements to Include</span>
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                {pageData.howSection.keyElementsToInclude.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F01472] mt-2 shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dos and Don'ts */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Check size={14} className="text-emerald-700" />
                  <span>Dos (Best Practices)</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-emerald-950">
                  {pageData.howSection.dosAndDonts.dos.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-100">
                <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <X size={14} className="text-rose-700" />
                  <span>Don'ts (Common Mistakes)</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-rose-950">
                  {pageData.howSection.dosAndDonts.donts.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Regional Terminology Glossary (if available) */}
          {pageData.howSection.terminologyGlossary && (
            <div className="mt-8 p-6 rounded-3xl bg-white border border-pink-100 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Globe size={18} className="text-[#F01472]" />
                <span>Regional Matrimonial Terminology</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {pageData.howSection.terminologyGlossary.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-pink-50/50 border border-pink-100 text-xs">
                    <div className="font-bold text-slate-900 text-sm mb-0.5">{item.term}</div>
                    <div className="text-pink-700 font-semibold">{item.meaning}</div>
                    {item.native && <div className="text-slate-500 text-[11px] mt-1">{item.native}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── CORE QUESTION 3: WHERE ────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-white border-y border-pink-100/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mb-10 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F01472] uppercase tracking-wider mb-2">
              <MapPin size={13} />
              <span>Distribution & Usage</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {pageData.whereSection.heading}
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              {pageData.whereSection.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
            {pageData.whereSection.useCases.map((useCase, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#FFFBFD] border border-slate-200 hover:border-pink-300 transition-all flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-pink-100 text-[#F01472] flex items-center justify-center shrink-0">
                  {idx % 2 === 0 ? <Smartphone size={18} /> : <Printer size={18} />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">
                    {useCase.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {useCase.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 border border-pink-200 text-xs sm:text-sm text-slate-700 leading-relaxed flex items-center gap-3">
            <ShieldCheck size={20} className="text-[#F01472] shrink-0" />
            <span>{pageData.whereSection.downloadAndShareDetails}</span>
          </div>
        </div>
      </section>

      {/* ── Interactive Format Comparison (Boy vs Girl) ──────────── */}
      {(pageData.sampleBiodatas.boySample || pageData.sampleBiodatas.girlSample) && (
        <section className="py-12 sm:py-16 bg-[#FFFBFD]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Sample Biodata Formats
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Inspect real-world field structures and wording recommendations.
                </p>
              </div>

              {pageData.sampleBiodatas.boySample && pageData.sampleBiodatas.girlSample && (
                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setActiveFormatTab('boy')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeFormatTab === 'boy'
                        ? 'bg-[#F01472] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {boyTabLabel}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFormatTab('girl')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeFormatTab === 'girl'
                        ? 'bg-[#F01472] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {girlTabLabel}
                  </button>
                </div>
              )}
            </div>

            {activeSample && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-md">
                <div className="border-b border-slate-100 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-serif">
                      {activeSample.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      {activeSample.title}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-pink-100/70 text-[#C80E5A] text-xs font-bold border border-pink-200/50 self-start sm:self-auto">
                    Verified TrueMarriage Template
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeSample.fields.map((field, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        {field.label}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-900">
                        {field.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-500 text-center sm:text-left">
                    Want to personalize this exact format with your photo and details?
                  </div>
                  <button
                    type="button"
                    onClick={handleStartMaker}
                    className="px-6 py-2.5 rounded-xl bg-[#F01472] hover:bg-[#D00F60] text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Create Your Version Free</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── FAQ Section (With Schema.org Integration) ─────────────── */}
      <section className="py-12 sm:py-16 bg-white border-t border-pink-100/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F01472] uppercase tracking-wider mb-2">
              <HelpCircle size={13} />
              <span>Answers to Common Questions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Everything you need to know about creating and downloading your marriage biodata.
            </p>
          </div>

          <div className="space-y-3">
            {pageData.faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 overflow-hidden transition-all bg-[#FFFBFD]"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-pink-50/40 transition-colors"
                  >
                    <span className="font-bold text-sm text-slate-900">
                      {faq.question}
                    </span>
                    <span className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4.5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Interlinked Hub / Related Searches ────────────────────── */}
      {pageData.relatedSlugs && pageData.relatedSlugs.length > 0 && (
        <section className="py-12 bg-[#FFFBFD] border-t border-pink-100/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Layers size={17} className="text-[#F01472]" />
              <span>Explore Related Biodata Formats & Guides</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {pageData.relatedSlugs.map((relSlug) => {
                const relPage = SEO_LANDING_PAGES[relSlug];
                if (!relPage) return null;
                return (
                  <Link
                    key={relSlug}
                    to={`/biodata/${relSlug}`}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-pink-300 hover:shadow-xs transition-all flex items-center justify-between gap-2 group"
                  >
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-[#F01472] transition-colors truncate">
                        {relPage.primaryKeyword}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {relPage.badge}
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-[#F01472] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Final Direct Call to Action ──────────────────────────── */}
      <section className="py-14 sm:py-20 bg-gradient-to-r from-[#F01472] via-[#E11D48] to-[#BE123C] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Create an Auspicious Marriage Biodata?
          </h2>
          <p className="text-sm sm:text-base text-pink-100 max-w-xl mx-auto font-normal">
            Join thousands of Indian families who create, customize, and download verified high-resolution matrimonial biodatas on TrueMarriage completely free.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleStartMaker}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-[#F01472] font-black text-sm shadow-xl hover:bg-rose-50 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Create Free Biodata Now</span>
              <ArrowRight size={16} />
            </button>
            <Link
              to="/biodata"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all text-center"
            >
              Browse All 24 Formats
            </Link>
          </div>
        </div>
      </section>

      {/* ── Global Footer ────────────────────────────────────────── */}
      <AppFooter />
    </div>
  );
};
