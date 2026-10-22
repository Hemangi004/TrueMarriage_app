import React, { useState, useEffect } from 'react';
import {
  MapPin,
  GraduationCap,
  Briefcase,
  Heart,
  Sparkles,
  Check,
  ArrowRight,
  Bookmark,
  User,
} from 'lucide-react';
import type { DetailedProfile, TrueMatchBreakdown } from '../../types/discovery';

export interface ProfileCardProps {
  profile: DetailedProfile;
  breakdown: TrueMatchBreakdown;
  onViewDetail: (profileId: string) => void;
  onOpenBreakdown: (profile: DetailedProfile, breakdown: TrueMatchBreakdown) => void;
  onToggleShortlist?: (profileId: string) => void;
  onToggleSave?: (profileId: string) => void;
  onSendInterest?: (profileId: string) => void;
  onMaybeLater?: (profileId: string) => void;
  isShortlisted?: boolean;
  isSaved?: boolean;
  hasSentInterest?: boolean;
}


export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  breakdown,
  onViewDetail,
  onOpenBreakdown,
  onToggleShortlist,
  onToggleSave,
  onSendInterest,
  isShortlisted = false,
  isSaved = false,
  hasSentInterest = false,
}) => {
  const [localShortlisted, setLocalShortlisted] = useState(isShortlisted);
  const [localSaved, setLocalSaved] = useState(isSaved);
  const [localInterestSent, setLocalInterestSent] = useState(hasSentInterest);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setLocalSaved(isSaved);
  }, [isSaved]);

  useEffect(() => {
    setLocalShortlisted(isShortlisted);
  }, [isShortlisted]);

  useEffect(() => {
    setLocalInterestSent(hasSentInterest);
  }, [hasSentInterest]);

  const handleShortlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalShortlisted(!localShortlisted);
    if (onToggleShortlist) {
      onToggleShortlist(profile.id);
    }
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalSaved(!localSaved);
    if (onToggleSave) {
      onToggleSave(profile.id);
    }
  };

  const handleSendInterestClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (localInterestSent) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setLocalInterestSent(true);
      if (onSendInterest) {
        onSendInterest(profile.id);
      }
    }, 350);
  };

  const score = breakdown.overallScore;

  const displayName = (() => {
    const parts = (profile.name || '').trim().split(' ');
    if (['Dr.', 'Dr', 'CA', 'Adv.', 'Adv', 'Er.', 'Er', 'Prof.', 'Prof'].includes(parts[0]) && parts.length > 1) {
      return `${parts[0]} ${parts[1]}`;
    }
    return parts[0] || 'Candidate';
  })();

  const displayNativePlace = profile.nativePlace || profile.city || profile.state || '';

  return (
    <>
      {/* ── DESKTOP VIEW (>= md): 3D Flip Container on Hover ── */}
      <div
        onClick={() => onViewDetail(profile.id)}
        className="hidden md:block group perspective-1000 w-full aspect-[4/5] min-h-[420px] select-none cursor-pointer"
      >
        <div className="flip-card-inner transform-style-3d relative w-full h-full duration-500 transition-transform ease-out rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-purple-200/50">
          {/* FRONT SIDE: Photo with Name & Age at bottom-left */}
          <div className="backface-hidden absolute inset-0 w-full h-full rounded-3xl overflow-hidden border border-purple-100/70 bg-slate-900 flex flex-col justify-end">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt={profile.name}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
                className="absolute inset-0 w-full h-full object-cover object-top"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-100/50 to-pink-50 text-slate-400 gap-2">
                <User size={54} className="text-purple-300" />
                <span className="text-xs font-semibold">Photo not available</span>
              </div>
            )}

            {/* Subtle Bottom Vignette Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

            {/* Bottom-left: Name, Age & Native Place */}
            <div className="relative z-10 p-5 text-white pointer-events-none">
              <h3 className="text-xl font-bold tracking-tight leading-tight drop-shadow-md">
                {displayName}, {profile.age}
              </h3>
              {displayNativePlace && (
                <p className="text-xs text-white/80 font-medium pt-1 flex items-center gap-1 drop-shadow-sm">
                  <MapPin size={12} className="text-pink-300 shrink-0" />
                  <span className="truncate">{displayNativePlace}</span>
                </p>
              )}
            </div>
          </div>

          {/* BACK SIDE: Flipped on Hover with Top-Right Actions & Details */}
          <div className="backface-hidden rotate-y-180 absolute inset-0 w-full h-full rounded-3xl overflow-hidden bg-white border border-purple-100 p-5 flex flex-col justify-between text-slate-800 shadow-xl">
            {/* Top Section: Three Buttons at the top, Name and Age below them */}
            <div className="space-y-2 pb-2.5 border-b border-purple-50">
              <div className="flex items-center justify-end gap-1.5">
                {/* Save Button */}
                <button
                  type="button"
                  onClick={handleSaveClick}
                  className={`p-2 rounded-xl transition-all cursor-pointer border ${
                    localSaved
                      ? 'bg-amber-500 text-white border-amber-600 shadow-sm shadow-amber-500/30'
                      : 'bg-slate-50 hover:bg-amber-50 text-slate-400 hover:text-amber-600 border-slate-200'
                  }`}
                  title={localSaved ? 'Saved to Bookmarks' : 'Save Profile'}
                >
                  <Bookmark size={14} fill={localSaved ? 'currentColor' : 'none'} />
                </button>

                {/* Shortlist Button */}
                <button
                  type="button"
                  onClick={handleShortlistClick}
                  className={`p-2 rounded-xl transition-all cursor-pointer border ${
                    localShortlisted
                      ? 'bg-rose-500 text-white border-rose-600 shadow-sm shadow-rose-500/30'
                      : 'bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border-slate-200'
                  }`}
                  title={localShortlisted ? 'Shortlisted' : 'Shortlist Candidate'}
                >
                  <Heart size={14} fill={localShortlisted ? 'currentColor' : 'none'} />
                </button>

                {/* View Full Profile Button */}
                <button
                  type="button"
                  onClick={() => onViewDetail(profile.id)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-purple-950 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                  title="View Full Profile"
                >
                  <span>View</span>
                  <ArrowRight size={12} />
                </button>
              </div>

              {/* Name & Age below the three buttons */}
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <h4 className="text-base font-bold text-slate-900 truncate">
                  {profile.name}, {profile.age}
                </h4>
              </div>
            </div>

            {/* Middle Body: Candidate Details */}
            <div className="flex-1 py-2.5 space-y-2.5 overflow-hidden">
              {/* TrueMatch Score Pill */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenBreakdown(profile, breakdown);
                }}
                className="p-2 rounded-xl bg-purple-50/80 border border-purple-100 flex items-center justify-between hover:bg-purple-100/80 transition cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs text-purple-900 font-semibold truncate">
                  <Sparkles size={13} className="text-[#F01472] shrink-0" />
                  <span className="truncate">TrueMatch Compatibility</span>
                </div>
                <span className="font-mono text-xs font-black text-pink-600 bg-white px-2 py-0.5 rounded-md border border-pink-200 shrink-0 ml-1">
                  {score}%
                </span>
              </div>

              {/* Career, Education & Native Place below Education */}
              <div className="space-y-1.5 text-xs text-slate-600">
                {profile.profession && (
                  <div className="flex items-center gap-2">
                    <Briefcase size={13} className="text-[#F01472] shrink-0" />
                    <span className="truncate font-medium text-slate-800">{profile.profession}</span>
                  </div>
                )}
                {profile.education && (
                  <div className="flex items-center gap-2">
                    <GraduationCap size={13} className="text-purple-600 shrink-0" />
                    <span className="truncate text-slate-600">{profile.education}</span>
                  </div>
                )}
                {displayNativePlace && (
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-indigo-600 shrink-0" />
                    <span className="truncate text-slate-600">{displayNativePlace}</span>
                  </div>
                )}
              </div>

              {/* Attribute Chips */}
              <div className="flex flex-wrap gap-1.5">
                {profile.height && (
                  <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200">
                    {profile.height}
                  </span>
                )}
                {profile.maritalStatus && (
                  <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200">
                    {profile.maritalStatus}
                  </span>
                )}
                {(profile.religion || profile.community) && (
                  <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200 truncate max-w-[140px]">
                    {[profile.religion, profile.community].filter(Boolean).join(', ')}
                  </span>
                )}
              </div>

            </div>

            {/* Bottom CTA: Send Interest */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSendInterestClick}
                disabled={localInterestSent || isSending}
                className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  localInterestSent
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                    : 'bg-gradient-to-r from-[#F01472] via-pink-600 to-purple-600 hover:from-[#d01060] hover:to-purple-700 text-white shadow-pink-500/25 hover:shadow-lg'
                }`}
                title={localInterestSent ? 'Interest Sent' : 'Send Interest'}
              >
                {localInterestSent ? (
                  <>
                    <Check size={14} className="text-emerald-600" />
                    <span>Interest Sent</span>
                  </>
                ) : (
                  <>
                    <Heart size={14} fill="currentColor" />
                    <span>Send Interest</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE VIEW (< md): Clean 2-Column Grid Card ── */}
      <div
        onClick={() => onViewDetail(profile.id)}
        className="block md:hidden relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-purple-100/70 bg-slate-900 shadow-md select-none cursor-pointer active:scale-[0.98] transition-transform"
      >
        {/* Photo Background */}
        {profile.profileImage ? (
          <img
            src={profile.profileImage}
            alt={profile.name}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            className="absolute inset-0 w-full h-full object-cover object-top"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-100/50 to-pink-50 text-slate-400 gap-2">
            <User size={36} className="text-purple-300" />
            <span className="text-[10px] font-semibold text-center px-2">Photo not available</span>
          </div>
        )}

        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

        {/* Top-Left Score Badge */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onOpenBreakdown(profile, breakdown);
          }}
          className="absolute top-2 left-2 z-10 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-black/55 backdrop-blur-md border border-white/20 text-pink-300 font-mono text-[10px] font-bold cursor-pointer"
        >
          <Sparkles size={9} className="text-[#F01472]" />
          <span>{score}%</span>
        </div>

        {/* Top-Right Save & Shortlist Buttons */}
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
          <button
            type="button"
            onClick={handleSaveClick}
            className={`p-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer border shadow-sm ${
              localSaved
                ? 'bg-amber-500 text-white border-amber-600'
                : 'bg-black/40 text-white/90 border-white/20'
            }`}
            title={localSaved ? 'Saved' : 'Save Profile'}
          >
            <Bookmark size={11} fill={localSaved ? 'currentColor' : 'none'} />
          </button>
          <button
            type="button"
            onClick={handleShortlistClick}
            className={`p-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer border shadow-sm ${
              localShortlisted
                ? 'bg-rose-500 text-white border-rose-600'
                : 'bg-black/40 text-white/90 border-white/20'
            }`}
            title={localShortlisted ? 'Shortlisted' : 'Shortlist'}
          >
            <Heart size={11} fill={localShortlisted ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Bottom Name & Location */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-2.5 pb-2.5 text-white">
          <h3 className="text-sm font-bold tracking-tight drop-shadow-md truncate leading-tight">
            {displayName}{profile.age ? `, ${profile.age}` : ''}
          </h3>
          {displayNativePlace && (
            <p className="text-[10px] text-white/75 font-medium pt-0.5 flex items-center gap-0.5 truncate">
              <MapPin size={9} className="text-pink-300 shrink-0" />
              <span className="truncate">{displayNativePlace}</span>
            </p>
          )}
        </div>
      </div>
    </>
  );
};
