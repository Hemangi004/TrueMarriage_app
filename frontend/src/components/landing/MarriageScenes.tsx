import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Sparkles,
  Shield,
  UserCheck,
  Compass,
  ArrowRight,
  Star,
  MessageCircle,
} from 'lucide-react';
import { useI18n } from '../../context/I18nContext';

interface MarriageScenesProps {
  onOpenWizard?: () => void;
  onOpenRegister?: () => void;
  onOpenTemplates?: () => void;
}

const DEMO_LANGUAGES = [
  {
    code: 'en',
    label: 'English',
    shree: '॥ Shree Ganeshay Namah ॥',
    title: 'MATRIMONIAL BIODATA',
    name: 'Pooja Sharma',
    profession: 'Software Engineer • Mumbai',
    details: [
      { label: 'Date of Birth', val: '14 August 1998' },
      { label: 'Height / Complexion', val: '5 ft 5 in • Fair' },
      { label: 'Education', val: 'B.Tech in Computer Science' },
      { label: 'Gotra / Rashi', val: 'Kashyap • Leo (सिंह)' },
    ],
  },
  {
    code: 'hi',
    label: 'हिन्दी',
    shree: '॥ श्री गणेशाय नमः ॥',
    title: 'विवाह बायोडाटा',
    name: 'पूजा शर्मा',
    profession: 'सॉफ्टवेयर इंजीनियर • मुंबई',
    details: [
      { label: 'जन्म तारीख', val: '14 अगस्त 1998' },
      { label: 'ऊंचाई / वर्ण', val: '5 फीट 5 इंच • गोरा' },
      { label: 'शिक्षा', val: 'बी.टेक (कंप्यूटर साइंस)' },
      { label: 'गोत्र / राशि', val: 'कश्यप • सिंह राशि' },
    ],
  },
  {
    code: 'mr',
    label: 'मराठी',
    shree: '॥ श्री गणेशाय नमः ॥',
    title: 'लग्न बायोडाटा',
    name: 'पूजा शर्मा',
    profession: 'सॉफ्टवेअर इंजिनिअर • मुंबई',
    details: [
      { label: 'जन्म तारीख', val: '१४ ऑगस्ट १९९८' },
      { label: 'उंची / वर्ण', val: '५ फूट ५ इंच • गोरी' },
      { label: 'शिक्षण', val: 'बी.टेक (कॉम्प्युटर सायन्स)' },
      { label: 'गोत्र / रास', val: 'कश्यप • सिंह रास' },
    ],
  },
  {
    code: 'gu',
    label: 'ગુજરાતી',
    shree: '॥ શ્રી ગણેશાય નમઃ ॥',
    title: 'લગ્ન બાયોડેટા',
    name: 'પૂજા શર્મા',
    profession: 'સોફ્ટવેર એન્જિનિયર • મુંબઈ',
    details: [
      { label: 'જન્મ તારીખ', val: '૧૪ ઓગસ્ટ ૧૯૯૮' },
      { label: 'ઊંચાઈ / રંગ', val: '૫ ફૂટ ૫ ઇંચ • ગોરો' },
      { label: 'શિક્ષણ', val: 'બી.ટેક (કોમ્પ્યુટર સાયન્સ)' },
      { label: 'ગોત્ર / રાશિ', val: 'કશ્યપ • સિંહ રાશિ' },
    ],
  },
  {
    code: 'ta',
    label: 'தமிழ்',
    shree: '॥ ஸ்ரீ கணேசாய நமஹ ॥',
    title: 'திருமண பயோடேட்டா',
    name: 'பூஜா சர்மா',
    profession: 'மென்பொருள் பொறியாளர்',
    details: [
      { label: 'பிறந்த தேதி', val: '14 ஆகஸ்ட் 1998' },
      { label: 'உயரம் / நிறம்', val: '5 அடி 5 அங்குலம்' },
      { label: 'கல்வி', val: 'பி.டெக் கணினி அறிவியல்' },
      { label: 'ராசி / நட்சத்திரம்', val: 'சிம்மம் • மகம்' },
    ],
  },
];

export const MarriageScenes: React.FC<MarriageScenesProps> = ({
  onOpenWizard,
  onOpenTemplates,
}) => {
  const { t } = useI18n();
  const [activeStep, setActiveStep] = useState(0);
  const [activeDemoLang, setActiveDemoLang] = useState(0);

  // Automatically cycle through different languages every 2.8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveDemoLang((prev) => (prev + 1) % DEMO_LANGUAGES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const curLang = DEMO_LANGUAGES[activeDemoLang] || DEMO_LANGUAGES[0];

  return (
    <div className="space-y-24 py-12">
      {/* ──────────────────────────────────────────────────────────────────
          SCENE 1: "Create your FREE Biodata in 2 minutes in any language"
          ────────────────────────────────────────────────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <div className="relative rounded-[40px] bg-gradient-to-br from-[#FFF5F8] via-[#FFEAF3] to-[#FFDFED] overflow-hidden p-6 sm:p-10 lg:p-14 border-2 border-pink-200/90 shadow-2xl shadow-pink-200/40 text-gray-800">
          {/* Ambient Warm Blush Glows & Sparkles */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* ── LEFT COLUMN: Automatic Multi-Language Biodata Graphics ── */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center relative order-2 lg:order-1">
              {/* Biodata Document Showcase Card */}
              <div className="relative w-full max-w-md">
                {/* The Paper Document Card */}
                <div className="relative bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200/80 shadow-2xl shadow-pink-200/50 transition-all overflow-hidden">
                  {/* Traditional Golden Border Frame */}
                  <div className="absolute inset-1.5 rounded-[22px] border border-amber-300/40 pointer-events-none" />
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-500/60 rounded-tl" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-500/60 rounded-tr" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-500/60 rounded-bl" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-500/60 rounded-br" />

                  {/* Candidate Photo & Basic Info */}
                  <div className="pb-3.5 flex items-center gap-3.5 border-b border-gray-100">
                    <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-md shrink-0">
                      <img
                        src="/images/hero_bride.jpg"
                        alt="Candidate"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={curLang.code + '-profile'}
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 4 }}
                          transition={{ duration: 0.25 }}
                        >
                          <h4 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                            {curLang.name}
                          </h4>
                          <p className="text-xs text-[#F01472] font-medium truncate">
                            {curLang.profession}
                          </p>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Biodata Data Rows */}
                  <div className="pt-3 space-y-1 text-xs">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={curLang.code + '-details'}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-1"
                      >
                        {curLang.details.map((row, rIdx) => (
                          <div
                            key={rIdx}
                            className="grid grid-cols-12 py-1 px-2 rounded-lg hover:bg-pink-50/40 transition-colors"
                          >
                            <span className="col-span-5 text-gray-500 font-medium text-[11px] truncate">
                              {row.label}
                            </span>
                            <span className="col-span-1 text-gray-400 text-center">:</span>
                            <span className="col-span-6 text-gray-800 font-semibold text-[11px] truncate">
                              {row.val}
                            </span>
                          </div>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN: Section Title & Action CTAs ── */}
            <div className="lg:col-span-6 space-y-6 order-1 lg:order-2 flex flex-col justify-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-[450] text-[#1e1b4b] tracking-tight leading-[1.16]">
                {t('Create your')}{' '}
                <span className="text-[#F01472] font-semibold italic font-serif">
                  {t('FREE Biodata')}
                </span> <br className="hidden sm:inline" />
                {t('in 2 minutes in any language')}
              </h2>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={onOpenTemplates || onOpenWizard}
                  className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#F01472] to-[#E11D48] hover:from-[#D80D62] hover:to-[#C0143C] text-white text-sm font-semibold shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t('Create Free Biodata Now')}</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={onOpenTemplates}
                  className="px-6 py-3.5 rounded-full bg-white hover:bg-pink-50/50 text-gray-700 hover:text-[#F01472] text-sm font-medium border border-pink-200/90 shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles size={15} className="text-[#F01472]" />
                  <span>{t('Browse 50+ Templates')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────
          SCENE 2: "Smart Matchmaking Section" (Image 2 style)
          ────────────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-[450] text-[#1e1b4b] tracking-tight">
            {t('Let our AI find')}{' '}
            <span className="text-[#F01472]">
              {t('your perfect match')}
            </span>
          </h2>
          <p className="text-gray-500 text-sm mt-2 font-[400]">
            {t('Advanced algorithms analyze values, lifestyle, astrological alignment and preferences.')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Feature Cards (Expanded with meaningful matrimony dimensions) */}
          <div className="lg:col-span-6 space-y-3.5">
            {[
              {
                icon: <Sparkles className="text-purple-600" size={20} />,
                bg: 'bg-purple-50',
                border: 'border-purple-100',
                title: t('Smart Compatibility Engine'),
                desc: t('AI scores your potential partner across 24 emotional, educational and lifestyle dimensions.'),
              },
              {
                icon: <Compass className="text-pink-600" size={20} />,
                bg: 'bg-pink-50',
                border: 'border-pink-100',
                title: t('Lifestyle & Value Preferences'),
                desc: t('Match based on shared culinary tastes, career goals, work-life balance and family outlook.'),
              },
              {
                icon: <UserCheck className="text-emerald-600" size={20} />,
                bg: 'bg-emerald-50',
                border: 'border-emerald-100',
                title: t('100% Verified & Genuine Profiles'),
                desc: t('Government ID & phone number verification ensures only genuine brides, grooms and families connect.'),
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 5 }}
                className={`p-4 sm:p-4.5 rounded-2xl bg-white border ${item.border} shadow-2xs hover:shadow-xs transition-all flex items-start gap-3.5`}
              >
                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-[450] text-[#1e1b4b] mb-0.5">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-[400]">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Mobile Mockup with 98% Compatibility Meter & Meaningful Breakdown */}
          <div className="lg:col-span-6 flex justify-center relative">
            {/* Top Floating Badge */}
            <div className="absolute -top-3 right-8 sm:right-16 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-pink-200 shadow-md text-[11px] font-[450] text-[#F01472] z-20 flex items-center gap-1.5">
              <Sparkles size={12} />
              <span>24 AI Factors Analyzed</span>
            </div>

            <motion.div
              whileHover={{ y: -4 }}
              className="relative w-[300px] sm:w-[330px] bg-white rounded-[40px] p-6 shadow-2xl border-4 border-slate-100 shadow-pink-200/50 flex flex-col"
            >
              {/* Phone Speaker Notch */}
              <div className="w-16 h-3.5 bg-slate-100 rounded-full mx-auto mb-5 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-slate-300" />
              </div>

              {/* Animated 98% Compatibility Circle Meter */}
              <div className="relative w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#FCE7F3"
                    strokeWidth="7"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#F01472"
                    strokeWidth="7"
                    strokeDasharray="251.2"
                    strokeDashoffset="12"
                    strokeLinecap="round"
                    fill="transparent"
                    initial={{ strokeDashoffset: 251.2 }}
                    whileInView={{ strokeDashoffset: 12 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-[450] text-[#F01472]">98%</span>
                  <span className="text-[10px] text-gray-500 font-medium tracking-wide">{t('Compatibility')}</span>
                </div>
              </div>

              {/* Matched Profiles Row */}
              <div className="flex flex-col items-center justify-center mb-3">
                <div className="flex items-center justify-center -space-x-3 mb-1.5">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <img src="/images/hero_groom.jpg" alt="Partner" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#F01472] text-white flex items-center justify-center z-10 shadow-xs">
                    <Heart size={11} className="fill-white" />
                  </div>
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <img src="/images/hero_bride.jpg" alt="Partner" className="w-full h-full object-cover" />
                  </div>
                </div>
                <span className="text-[11px] text-gray-500 font-medium tracking-wide notranslate" translate="no">TrueMatch</span>
              </div>


            </motion.div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────
          SCENE 3: "Testimonials / Real people, real happiness"
          ────────────────────────────────────────────────────────────────── */}
      <section id="testimonials" className="max-w-7xl mx-auto px-5 sm:px-8 scroll-mt-24">
        <div className="bg-gradient-to-tr from-rose-50/80 via-white to-pink-50/60 rounded-[40px] p-8 sm:p-14 border border-pink-100 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Story Text */}
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-[450] text-[#1e1b4b] tracking-tight leading-tight">
                {t('Real people,')} <br />
                <span className="text-[#F01472]">
                  {t('real stories, real happiness')}
                </span>
              </h2>

              <p className="text-gray-500 text-sm font-[400]">
                {t('Thousands of love stories and beautiful marriages that started right here.')}
              </p>

              {/* Quote Card */}
              <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm relative space-y-3">
                <span className="text-4xl text-[#F01472]/30 font-serif leading-none absolute top-3 left-4">“</span>
                <p className="text-xs sm:text-sm text-gray-700 font-[400] italic leading-relaxed pt-2">
                  {t(
                    'True Marriage helped us find our best friend and life partner. The AI biodata presentation made a tremendous impression on both our families. Thank you for making our wedding dreams come true!'
                  )}
                </p>
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-[450] text-gray-900">— Amit & Neha</div>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className="fill-amber-400" />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={onOpenTemplates}
                  className="inline-flex items-center gap-2 text-xs font-[450] text-[#F01472] hover:text-[#C80E5A] transition-colors cursor-pointer bg-white px-5 py-2.5 rounded-full border border-pink-200 shadow-xs"
                >
                  {t('Read More Testimonials')} <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Right Couple Wedding Image (New Distinct Photo) */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-md h-80 sm:h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
                <img
                  src="/images/success_couple.jpg"
                  alt="Amit and Neha Wedding"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6 text-white">
                  <div>
                    <div className="text-sm font-[450] text-pink-200">{t('True Couple')}</div>
                    <div className="text-base font-[450] text-white">Amit & Neha</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────
          SCENE 4: "Easy & Secure Process / Simple steps to your new beginning"
          ────────────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="bg-white rounded-[40px] p-8 sm:p-14 border border-gray-100 shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-[450] text-[#1e1b4b] tracking-tight">
              {t('Simple steps to')}{' '}
              <span className="text-[#F01472]">
                {t('your new beginning')}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Steps List */}
            <div className="lg:col-span-6 space-y-4">
              {[
                {
                  icon: <UserCheck size={18} className="text-[#F01472]" />,
                  title: t('1. Create Your Profile'),
                  desc: t('Quick & easy registration with AI-assisted bio writing and photo enhancement.'),
                },
                {
                  icon: <Sparkles size={18} className="text-[#F01472]" />,
                  title: t('2. Get Matched'),
                  desc: t('AI calculates compatibility score and delivers curated matches directly to you.'),
                },
                {
                  icon: <MessageCircle size={18} className="text-[#F01472]" />,
                  title: t('3. Connect & Interact'),
                  desc: t('Chat, request contact sharing, or schedule family meetings securely.'),
                },
                {
                  icon: <Heart size={18} className="text-[#F01472]" />,
                  title: t('4. Find Your Forever'),
                  desc: t('Take the auspicious next steps towards a blissful wedding celebration.'),
                },
              ].map((step, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                    activeStep === idx
                      ? 'bg-pink-50/70 border-pink-300 shadow-sm'
                      : 'bg-white border-gray-100 hover:border-pink-200'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center shrink-0">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-[450] text-[#1e1b4b]">{step.title}</h3>
                    <p className="text-xs text-gray-500 font-[400] mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right 3D Security Shield & Pink Lock Vector Scene */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center">
              <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Concentric Glowing Rings */}
                <div className="absolute inset-0 rounded-full bg-pink-100/60 animate-ping opacity-25" />
                <div className="absolute inset-4 rounded-full bg-pink-200/40 animate-pulse" />
                <div className="absolute inset-10 rounded-full bg-gradient-to-tr from-pink-300/30 to-rose-200/30" />

                {/* 3D-styled Pink Security Shield Card */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative z-10 w-32 h-36 bg-gradient-to-tr from-[#F01472] via-[#FB7185] to-[#FDA4AF] rounded-3xl shadow-2xl shadow-pink-400/50 flex flex-col items-center justify-center text-white border-2 border-white"
                >
                  <Shield size={50} className="text-white drop-shadow-md" />
                </motion.div>
              </div>

              {/* Privacy Banner Pill (Image 2 style) */}
              <div className="w-full max-w-sm mt-6 p-3.5 rounded-2xl bg-gradient-to-r from-[#F01472] to-[#E11D48] text-white flex items-center justify-center shadow-lg shadow-pink-300/40">
                <span className="text-xs font-[450] tracking-wide text-center">
                  {t('Your privacy & security are our top priority')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
