import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Sparkles,
  Heart,
  Smile,
  Clock,
  Coffee,
  MapPin,
  Music,
  GraduationCap,
  Users,
  CheckCircle2,
  Calendar,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import type { DetailedProfile, TrueMatchBreakdown } from '../../types/discovery';
import { getCompatibilityInsightApi, type CompatibilityInsightData } from '../../services/discoveryService';

interface TrueMatchBreakdownModalProps {
  profile: DetailedProfile | null;
  breakdown: TrueMatchBreakdown | null;
  isOpen: boolean;
  onClose: () => void;
  onViewFullProfile: (profileId: string) => void;
  onSendInterest: (profileId: string) => void;
  hasSentInterest?: boolean;
}

export const TrueMatchBreakdownModal: React.FC<TrueMatchBreakdownModalProps> = ({
  profile,
  breakdown,
  isOpen,
  onClose,
  onViewFullProfile,
  onSendInterest,
  hasSentInterest = false,
}) => {
  const [aiInsight, setAiInsight] = React.useState<CompatibilityInsightData | null>(null);
  const [loadingAiInsight, setLoadingAiInsight] = React.useState(true);

  useEffect(() => {
    if (isOpen) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = orig;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !profile) {
      setAiInsight(null);
      setLoadingAiInsight(false);
      return;
    }
    let isMounted = true;
    const targetId = profile.id || profile.slug || '';
    if (!targetId) return;

    setLoadingAiInsight(true);
    getCompatibilityInsightApi(targetId)
      .then((data) => {
        if (isMounted && data) {
          setAiInsight(data);
        }
      })
      .finally(() => {
        if (isMounted) setLoadingAiInsight(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, profile?.id, profile?.slug]);

  if (!isOpen || !profile || !breakdown) return null;

  const score = breakdown.overallScore;

  const dimensionCards = [
    {
      key: 'values',
      title: 'Values & Personality',
      weight: '20%',
      icon: <Smile size={18} className="text-pink-600" />,
      color: 'from-pink-500 to-rose-500',
      bg: 'bg-pink-50/50 border-pink-100',
      barColor: 'bg-pink-500',
      dim: breakdown.dimensions.valuesPersonality,
    },
    {
      key: 'marriage',
      title: 'Marriage Expectations',
      weight: '10%',
      icon: <Clock size={18} className="text-purple-600" />,
      color: 'from-purple-500 to-indigo-500',
      bg: 'bg-purple-50/50 border-purple-100',
      barColor: 'bg-purple-500',
      dim: breakdown.dimensions.marriageExpectations,
    },
    {
      key: 'lifestyle',
      title: 'Lifestyle & Habits',
      weight: '15%',
      icon: <Coffee size={18} className="text-amber-600" />,
      color: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-50/50 border-amber-100',
      barColor: 'bg-amber-500',
      dim: breakdown.dimensions.lifestyle,
    },
    {
      key: 'location',
      title: 'Location Compatibility',
      weight: '10%',
      icon: <MapPin size={18} className="text-emerald-600" />,
      color: 'from-emerald-500 to-teal-500',
      bg: 'bg-emerald-50/50 border-emerald-100',
      barColor: 'bg-emerald-500',
      dim: breakdown.dimensions.location,
    },
    {
      key: 'interests',
      title: 'Interests & Hobbies',
      weight: '10%',
      icon: <Music size={18} className="text-blue-600" />,
      color: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-50/50 border-blue-100',
      barColor: 'bg-blue-500',
      dim: breakdown.dimensions.interestsHobbies,
    },
    {
      key: 'education',
      title: 'Education & Career',
      weight: '10%',
      icon: <GraduationCap size={18} className="text-violet-600" />,
      color: 'from-violet-500 to-purple-600',
      bg: 'bg-violet-50/50 border-violet-100',
      barColor: 'bg-violet-500',
      dim: breakdown.dimensions.educationCareer,
    },
    {
      key: 'religion',
      title: 'Religion & Community',
      weight: '10%',
      icon: <Users size={18} className="text-rose-600" />,
      color: 'from-rose-500 to-pink-600',
      bg: 'bg-rose-50/50 border-rose-100',
      barColor: 'bg-rose-500',
      dim: breakdown.dimensions.religionCommunity,
    },
    {
      key: 'age',
      title: 'Age Compatibility',
      weight: '15%',
      icon: <Calendar size={18} className="text-indigo-600" />,
      color: 'from-indigo-500 to-blue-600',
      bg: 'bg-indigo-50/50 border-indigo-100',
      barColor: 'bg-indigo-500',
      dim: breakdown.dimensions.age,
    },
  ];

  const modal = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      style={{ isolation: 'isolate' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-[100000] border border-purple-100/80 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50/70 via-white to-pink-50/70 sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#F01472] to-[#C80E5A] text-white flex items-center justify-center shadow-md shadow-rose-500/20">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-base font-black text-[#1e1b4b]">Your TrueMatch Compatibility</h2>
              <p className="text-xs text-gray-500 font-medium">with {profile.name}, {profile.age}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Main Hero Score Banner */}
          <div className="relative rounded-3xl bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4c1d95] text-white p-6 sm:p-8 shadow-xl overflow-hidden">
            {/* Ambient orb */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 justify-between text-center sm:text-left">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-pink-300 text-xs font-bold border border-white/10">
                  <ShieldCheck size={13} className="text-amber-300" />
                  <span>100% Weighted Algorithmic Compatibility</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {score}% Compatible
                </h3>
                {loadingAiInsight || !aiInsight ? (
                  <div className="h-4 bg-white/20 rounded-full w-56 animate-pulse mt-2"></div>
                ) : (
                  <p className="text-sm text-purple-100 max-w-md font-medium leading-relaxed">
                    {aiInsight.headline}
                  </p>
                )}
              </div>

              {/* Circular Gauge */}
              <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="text-white/15 stroke-current"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="text-[#F01472] stroke-current"
                    strokeWidth="8"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * score) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <span className="text-2xl font-black">{score}%</span>
                  <span className="text-[10px] font-bold text-pink-200">Match</span>
                </div>
              </div>
            </div>

            {/* Why you may connect bullet points */}
            {loadingAiInsight || !aiInsight ? (
              <div className="mt-6 pt-5 border-t border-white/10 animate-pulse space-y-2.5">
                <div className="h-2.5 bg-white/20 rounded-full w-36 mb-3"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-white/20 shrink-0"></div>
                      <div className="h-3 bg-white/20 rounded-full w-3/4"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              aiInsight.reasons && aiInsight.reasons.length > 0 && (
                <div className="mt-6 pt-5 border-t border-white/10">
                  <p className="text-xs font-bold text-pink-100 mb-2.5">
                    Key Connection Highlights:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white/90">
                    {aiInsight.reasons.map((point, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>

          {/* Structured 8-Dimension Breakdown Grid */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-600 px-1">
              Detailed Compatibility Breakdown
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {dimensionCards.map((card) => (
                <div
                  key={card.key}
                  className={`p-4 rounded-2xl border ${card.bg} space-y-2.5 transition-all hover:shadow-xs`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-xl bg-white shadow-2xs">
                        {card.icon}
                      </div>
                      <div>
                        <h5 className="text-xs font-black text-gray-900">{card.title}</h5>
                        <span className="text-[10px] text-gray-400 font-semibold">Weight: {card.weight}</span>
                      </div>
                    </div>
                    <span className="text-sm font-black text-gray-800">{card.dim.score}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-gray-200/80 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${card.barColor} transition-all duration-700`}
                      style={{ width: `${card.dim.score}%` }}
                    />
                  </div>

                  {/* Dimension Summary */}
                  <p className="text-xs text-gray-600 font-medium leading-snug">
                    {card.dim.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Sticky Bottom Action Footer */}
        <div className="p-4 sm:p-5 border-t border-gray-100 bg-white flex items-center justify-between gap-3 sticky bottom-0 z-20">
          <button
            type="button"
            onClick={() => {
              onClose();
              onViewFullProfile(profile.id);
            }}
            className="px-5 py-3 rounded-2xl border border-purple-200 text-purple-900 font-bold text-xs hover:bg-purple-50 transition cursor-pointer flex items-center gap-1.5"
          >
            <span>View Full Profile</span>
            <ArrowRight size={14} />
          </button>

          <button
            type="button"
            onClick={() => {
              if (!hasSentInterest) onSendInterest(profile.id);
            }}
            disabled={hasSentInterest}
            className={`flex-1 py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm shadow-lg transition flex items-center justify-center gap-2 cursor-pointer ${
              hasSentInterest
                ? 'bg-emerald-600 text-white cursor-default shadow-emerald-500/20'
                : 'bg-gradient-to-r from-[#F01472] to-[#C80E5A] hover:from-rose-600 hover:to-rose-700 text-white shadow-rose-500/30'
            }`}
          >
            {hasSentInterest ? (
              <>
                <CheckCircle2 size={16} />
                <span>Interest Sent</span>
              </>
            ) : (
              <>
                <Heart size={16} className="fill-white" />
                <span>Send Interest</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};
