import React, { useEffect, useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Sliders,
  X,
  RotateCcw,
  Bookmark,
  Heart,
  HeartHandshake,
} from 'lucide-react';

import { getDiscoverableProfilesApi } from '../../services/discoveryService';
import { calculateTrueMatchScore, DEFAULT_USER_PREFERENCES } from '../../services/trueMatchEngine';
import { sendInterestApi, getSentInterestsApi } from '../../services/interestService';

import type {
  DetailedProfile,
  DiscoveryTab,
  UserPreferences,
  TrueMatchBreakdown,
} from '../../types/discovery';

import { ProfileCard } from './ProfileCard';
import { TrueMatchBreakdownModal } from './TrueMatchBreakdownModal';
import { ProfilePublicModal } from './ProfilePublicModal';
import { UserPreferencesModal } from './UserPreferencesModal';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBiodata } from '../../context/BiodataContext';
import { AppFooter } from '../common/AppFooter';

// Known ID & slug aliases between mock seeds and live DB
const ID_ALIASES: Record<string, string[]> = {
  prof_1: ['bio_490166bcdbdb', 'priya-deshmukh'],
  bio_490166bcdbdb: ['prof_1', 'priya-deshmukh'],
  prof_2: ['bio_ac3d40d691cc', 'ananya-iyer'],
  bio_ac3d40d691cc: ['prof_2', 'ananya-iyer'],
  prof_3: ['bio_377038ba6c1c', 'kavya-reddy'],
  bio_377038ba6c1c: ['prof_3', 'kavya-reddy'],
  prof_4: ['bio_9296d36445e3', 'dr-tanvi-kulkarni'],
  bio_9296d36445e3: ['prof_4', 'dr-tanvi-kulkarni'],
  prof_5: ['bio_0364304c53c7', 'rohan-patil'],
  bio_0364304c53c7: ['prof_5', 'rohan-patil'],
  prof_6: ['bio_0521b236ee0b', 'aarav-sharma'],
  bio_0521b236ee0b: ['prof_6', 'aarav-sharma'],
};

export const DiscoverPage: React.FC = () => {
  const { user, isAuthenticated, isLoading: isAuthLoading, openLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      sessionStorage.setItem('tm_post_login_redirect', '/discover');
      openLogin();
      navigate('/', { replace: true });
    }
  }, [isAuthLoading, isAuthenticated, openLogin, navigate]);

  if (!isAuthenticated && !isAuthLoading) {
    return null;
  }

  const { profileId, slug, formData } = useBiodata();
  // Active Tab
  const [activeTab, setActiveTab] = useState<DiscoveryTab>('for_you');

  // Search input
  const [searchQuery, setSearchQuery] = useState('');

  // Live and Authentic Profiles strictly fetched from backend API (with sessionStorage cache)
  const [allProfiles, setAllProfiles] = useState<DetailedProfile[]>(() => {
    try {
      const cached = sessionStorage.getItem('tm_cached_discover_profiles');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return [];
  });

  // User Match Preferences
  const [userPrefs, setUserPrefs] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('tm_user_preferences');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_USER_PREFERENCES,
          ...parsed,
        };
      }
    } catch {}
    return DEFAULT_USER_PREFERENCES;
  });
  const [prefsModalOpen, setPrefsModalOpen] = useState(false);

  // Profile modals
  const [selectedProfile, setSelectedProfile] = useState<DetailedProfile | null>(null);
  const [selectedBreakdown, setSelectedBreakdown] = useState<TrueMatchBreakdown | null>(null);
  const [breakdownModalOpen, setBreakdownModalOpen] = useState(false);

  // Interaction tracking
  const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('tm_shortlisted_profiles');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [savedProfileIds, setSavedProfileIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('tm_saved_profiles');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [interestSentIds, setInterestSentIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('tm_interest_sent_profiles');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(() => new Set());

  // Re-hydrate interestSentIds once user is loaded
  useEffect(() => {
    if (!user?.id) return;
    try {
      const userKey = `tm_interest_sent_profiles_${user.id}`;
      const saved = localStorage.getItem(userKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setInterestSentIds((prev) => new Set([...prev, ...parsed]));
        }
      }
    } catch {}
  }, [user?.id]);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Always sync preferredGender from logged-in user's own biodata gender.
  // This runs every time gender changes so Female users always see Male candidates and vice versa,
  // regardless of what was previously saved in localStorage.
  useEffect(() => {
    const userGender = (formData?.gender || '').trim().toLowerCase();

    let targetGender: 'Male' | 'Female' | '' = '';
    if (userGender === 'male' || userGender === 'm') {
      targetGender = 'Female'; // Male user → show Female (Bride) candidates
    } else if (userGender === 'female' || userGender === 'f') {
      targetGender = 'Male'; // Female user → show Male (Groom) candidates
    }

    if (targetGender) {
      setUserPrefs((prev) => {
        // Only update if the gender actually changed to avoid re-render loops
        if (prev.preferredGender === targetGender) return prev;
        const updated = { ...prev, preferredGender: targetGender };
        try {
          const existing = localStorage.getItem('tm_user_preferences');
          const parsed = existing ? JSON.parse(existing) : {};
          localStorage.setItem('tm_user_preferences', JSON.stringify({ ...parsed, preferredGender: targetGender }));
        } catch {}
        return updated;
      });
    }
  }, [formData?.gender]);

  // Loading state: true on initial load until API response arrives (or false if cached)
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(() => {
    try {
      const cached = sessionStorage.getItem('tm_cached_discover_profiles');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return false;
        }
      }
    } catch {}
    return true;
  });
  const [isLoading, setIsLoading] = useState(false);

  const normalizeGender = (g?: string | null): 'Male' | 'Female' => {
    if (!g) return 'Female';
    const clean = g.trim().toLowerCase();
    return clean === 'male' || clean === 'm' || clean === 'groom' ? 'Male' : 'Female';
  };

  useEffect(() => {
    let isMounted = true;

    getDiscoverableProfilesApi()
      .then((res) => {
        if (res && res.success && res.data && res.data.length > 0 && isMounted) {
          const apiProfiles: DetailedProfile[] = res.data.map((item) => ({
              id: item.id,
              slug: item.slug || '',
              name: item.display_name,
              age: item.age || 27,
              gender: normalizeGender(item.gender),
              height: item.height || "5' 6\"",
              city: item.city || 'Pune',
              state: item.state || 'Maharashtra',
              location: item.city && item.state ? `${item.city}, ${item.state}` : (item.city || item.state || 'Maharashtra'),
              profileImage: item.profile_picture_url || '',
              additionalPhotos: item.additional_photos || item.additionalPhotos || [],
            profession: item.occupation || 'Professional',
            company: item.company || '',
            education: item.education || 'Graduate',
            college: item.college || '',
            annualIncome: item.annual_income || '',
            religion: item.religion || 'Hindu',
            community: item.caste || '',
            motherTongue: item.mother_tongue || 'Hindi',
            maritalStatus: (item.marital_status as any) || 'Never Married',
            familyType: (item.family_type as any) || 'Nuclear Family',
            familyValues: (item.family_values as any) || 'Moderate',
            fatherName: item.father_name || '',
            fatherOccupation: item.father_occupation || '',
            motherName: item.mother_name || '',
            motherOccupation: item.mother_occupation || '',
            siblings: item.siblings || '',
            nativePlace: item.native_place || '',
            diet: (item.diet as any) || 'Vegetarian',
            smoking: (item.smoking as any) || 'No',
            drinking: (item.drinking as any) || 'No',
            fitness: item.fitness || '',
            travel: item.travel || '',
            personality: item.personality && item.personality.length > 0 ? item.personality : ['Family-oriented', 'Kind', 'Ambitious'],
            interests: item.interests && item.interests.length > 0 ? item.interests : ['Music', 'Reading', 'Travel'],
            aboutMe:
              item.about_me ||
              'Looking forward to building a meaningful, respectful and joyful life together.',
            marriageExpectations:
              item.partner_expectations || 'Seeking an understanding and grounded companion.',
            marriageTimeline: (item.marriage_timeline as any) || 'Within 6-12 months',
            workingPartnerPreference: 'Prefers working partner',
            childrenPreference: 'Wants children',
            verification: {
              mobileVerified: true,
              emailVerified: true,
              idVerified: Boolean(item.verified ?? true),
              profileComplete: true,
            },
            profileCompletion: 98,
            publishedAt: item.published_at || new Date().toISOString(),
          }));

          setAllProfiles(apiProfiles);
          try {
            sessionStorage.setItem('tm_cached_discover_profiles', JSON.stringify(apiProfiles));
          } catch {}
        } else if (isMounted) {
          setAllProfiles((prev) => prev);
        }
      })
      .catch(() => {
        if (isMounted) {
          setAllProfiles((prev) => prev);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsInitialLoading(false);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch already sent interests from server to initialize interestSentIds state
  useEffect(() => {
    if (!isAuthenticated) return;
    let isMounted = true;
    getSentInterestsApi(1, 100)
      .then((res) => {
        if (res && res.data && isMounted) {
          setInterestSentIds((prev) => {
            const next = new Set(prev);
            for (const item of res.data) {
              if (item.profile?.id) next.add(item.profile.id);
              if (item.profile?.slug) next.add(item.profile.slug);
              if (item.profile?.user_id) next.add(item.profile.user_id);
              if (item.receiver_profile_id) next.add(item.receiver_profile_id);
              if (item.receiver_user_id) next.add(item.receiver_user_id);
            }
            try {
              const key = user?.id ? `tm_interest_sent_profiles_${user.id}` : 'tm_interest_sent_profiles';
              localStorage.setItem(key, JSON.stringify(Array.from(next)));
              localStorage.setItem('tm_interest_sent_profiles', JSON.stringify(Array.from(next)));
            } catch {}
            return next;
          });
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if (isInitialLoading) return;
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, [activeTab, userPrefs]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Resilient check for whether a profile is saved (handles IDs, slugs, and legacy alias seeds)
  const isProfileSaved = (p: DetailedProfile | { id: string; slug?: string }): boolean => {
    if (savedProfileIds.has(p.id)) return true;
    if (p.slug && savedProfileIds.has(p.slug)) return true;
    const aliases = ID_ALIASES[p.id];
    if (aliases && aliases.some((a) => savedProfileIds.has(a))) return true;
    return false;
  };

  // Resilient check for whether a profile is shortlisted (handles IDs, slugs, and legacy alias seeds)
  const isProfileShortlisted = (p: DetailedProfile | { id: string; slug?: string }): boolean => {
    if (shortlistedIds.has(p.id)) return true;
    if (p.slug && shortlistedIds.has(p.slug)) return true;
    const aliases = ID_ALIASES[p.id];
    if (aliases && aliases.some((a) => shortlistedIds.has(a))) return true;
    return false;
  };

  // Resilient check for whether interest was sent (handles IDs, slugs, and legacy alias seeds)
  const isProfileInterestSent = (p: DetailedProfile | { id: string; slug?: string }): boolean => {
    if (interestSentIds.has(p.id)) return true;
    if (p.slug && interestSentIds.has(p.slug)) return true;
    const aliases = ID_ALIASES[p.id];
    if (aliases && aliases.some((a) => interestSentIds.has(a))) return true;
    return false;
  };

  const handleToggleShortlist = (profileId: string, options?: { silent?: boolean }) => {
    setShortlistedIds((prev) => {
      const next = new Set(prev);
      const aliases = [profileId, ...(ID_ALIASES[profileId] || [])];
      const alreadyShortlisted = aliases.some((a) => next.has(a));

      if (alreadyShortlisted) {
        aliases.forEach((a) => next.delete(a));
        if (!options?.silent && !selectedProfile) {
          showToast('Removed from shortlist');
        }
      } else {
        next.add(profileId);
        if (!options?.silent && !selectedProfile) {
          showToast('Profile added to your shortlist');
        }
      }
      try {
        localStorage.setItem('tm_shortlisted_profiles', JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  };

  const handleToggleSave = (profileId: string, options?: { silent?: boolean }) => {
    setSavedProfileIds((prev) => {
      const next = new Set(prev);
      const aliases = [profileId, ...(ID_ALIASES[profileId] || [])];
      const alreadySaved = aliases.some((a) => next.has(a));

      if (alreadySaved) {
        aliases.forEach((a) => next.delete(a));
        if (!options?.silent && !selectedProfile) {
          showToast('Removed from Saved Profiles');
        }
      } else {
        next.add(profileId);
        if (!options?.silent && !selectedProfile) {
          showToast('Profile saved to your Bookmarks');
        }
      }
      try {
        localStorage.setItem('tm_saved_profiles', JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  };

  const handleSendInterest = async (profileId: string, options?: { silent?: boolean }) => {
    if (!isAuthenticated) {
      if (!options?.silent && !selectedProfile) {
        showToast('Please log in to send interest.');
      }
      openLogin();
      return;
    }

    // Find profile to collect all aliases (id, slug, etc.)
    const target = allProfiles.find((p) => p.id === profileId || p.slug === profileId);
    const resolvedId = target?.id || target?.slug || profileId;
    const aliases = [profileId];
    if (target) {
      if (target.id) aliases.push(target.id);
      if (target.slug) aliases.push(target.slug);
    }
    const extraAliases = ID_ALIASES[profileId] || [];
    aliases.push(...extraAliases);

    // Optimistically mark interest sent and persist immediately
    setInterestSentIds((prev) => {
      const next = new Set(prev);
      aliases.forEach((a) => next.add(a));
      try {
        const key = user?.id ? `tm_interest_sent_profiles_${user.id}` : 'tm_interest_sent_profiles';
        localStorage.setItem(key, JSON.stringify(Array.from(next)));
        localStorage.setItem('tm_interest_sent_profiles', JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });

    try {
      const res = await sendInterestApi(resolvedId);
      if (!options?.silent && !selectedProfile) {
        showToast(res.message || 'Interest sent successfully');
      }
      if (res?.data) {
        const data = res.data;
        const idsToAdd = [profileId, resolvedId];
        if (data.profile?.id) idsToAdd.push(data.profile.id);
        if (data.profile?.slug) idsToAdd.push(data.profile.slug);
        if (data.profile?.user_id) idsToAdd.push(data.profile.user_id);
        if (data.receiver_profile_id) idsToAdd.push(data.receiver_profile_id);
        if (data.receiver_user_id) idsToAdd.push(data.receiver_user_id);

        setInterestSentIds((prev) => {
          const next = new Set(prev);
          idsToAdd.forEach((i) => next.add(i));
          try {
            const key = user?.id ? `tm_interest_sent_profiles_${user.id}` : 'tm_interest_sent_profiles';
            localStorage.setItem(key, JSON.stringify(Array.from(next)));
            localStorage.setItem('tm_interest_sent_profiles', JSON.stringify(Array.from(next)));
          } catch {}
          return next;
        });
      }
      // Dispatch custom event to notify components/bell
      window.dispatchEvent(new CustomEvent('interest:sent', { detail: { profileId } }));
    } catch (err: any) {
      const msg = err?.message || 'Failed to send interest';
      if (!options?.silent && !selectedProfile) {
        showToast(msg);
      }
      if (!msg.toLowerCase().includes('already exists')) {
        setInterestSentIds((prev) => {
          const next = new Set(prev);
          aliases.forEach((a) => next.delete(a));
          try {
            const key = user?.id ? `tm_interest_sent_profiles_${user.id}` : 'tm_interest_sent_profiles';
            localStorage.setItem(key, JSON.stringify(Array.from(next)));
          } catch {}
          return next;
        });
      }
      throw err;
    }
  };

  const handleMaybeLater = (profileId: string) => {
    setDismissedIds((prev) => new Set(prev).add(profileId));
    showToast('Profile dismissed from current feed');
  };

  const handleResetDismissed = () => {
    setDismissedIds(new Set());
    showToast('Feed refreshed with all profiles');
  };

  // Compute TrueMatch scores for all candidate profiles
  const scoredProfiles = useMemo(() => {
    const myName = (formData?.name || user?.full_name || '').trim().toLowerCase();
    const myProfileId = (profileId || '').trim().toLowerCase();
    const mySlug = (slug || '').trim().toLowerCase();
    const myUserId = (user?.id || '').trim().toLowerCase();

    return allProfiles
      .filter((p) => {
        // Exclude dismissed profiles
        if (dismissedIds.has(p.id)) return false;

        // Strictly exclude logged-in user's own profile
        const pId = (p.id || '').trim().toLowerCase();
        if (pId === 'my_profile' || pId === 'my-profile') return false;
        if (myProfileId && pId === myProfileId) return false;
        if (myUserId && (pId === myUserId || (p as any).user_id === user?.id)) return false;

        // Exclude by slug
        const pSlug = (p.slug || '').trim().toLowerCase();
        if (mySlug && pSlug && pSlug === mySlug) return false;

        // Exclude by exact name if provided
        if (myName && p.name && p.name.trim().toLowerCase() === myName) return false;

        // ── SAVED & SHORTLISTED TAB BYPASS ──
        // When viewing saved or shortlisted profiles, candidates always pass through!
        if (activeTab === 'saved_profiles') {
          return isProfileSaved(p);
        }
        if (activeTab === 'shortlisted_profiles') {
          return isProfileShortlisted(p);
        }

        // ── 1. Preferred Gender Filter ──
        if (userPrefs.preferredGender && p.gender) {
          if (p.gender.trim().toLowerCase() !== userPrefs.preferredGender.trim().toLowerCase()) {
            return false;
          }
        }


        // ── 2. Preferred Age Range Filter (always AND logic — must be within user's set range) ──
        if (p.age) {
          if (p.age < userPrefs.ageMin) return false;
          if (p.age > userPrefs.ageMax) return false;
        }


        // ── 3. Marital Status Filter (skip when all statuses are selected — means no filter) ──
        const ALL_MARITAL = ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'];
        const maritalFilterActive =
          userPrefs.maritalStatus &&
          userPrefs.maritalStatus.length > 0 &&
          userPrefs.maritalStatus.length < ALL_MARITAL.length;
        if (maritalFilterActive && p.maritalStatus && !userPrefs.maritalStatus.includes(p.maritalStatus)) {
          return false;
        }

        // ── 4. Dietary Preferences Filter (skip when all diets are selected) ──
        const ALL_DIETS = ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Jain', 'Vegan'];
        const dietFilterActive =
          userPrefs.dietPreferences &&
          userPrefs.dietPreferences.length > 0 &&
          userPrefs.dietPreferences.length < ALL_DIETS.length;
        if (
          dietFilterActive &&
          p.diet &&
          !userPrefs.dietPreferences.some((d) => p.diet.toLowerCase().includes(d.toLowerCase()))
        ) {
          return false;
        }

        // ── 5. Family Values Filter (skip when all values are selected) ──
        const ALL_FAMILY_VALUES = ['Moderate', 'Traditional', 'Liberal'];
        const familyValuesFilterActive =
          userPrefs.familyValues &&
          userPrefs.familyValues.length > 0 &&
          userPrefs.familyValues.length < ALL_FAMILY_VALUES.length;
        if (
          familyValuesFilterActive &&
          p.familyValues &&
          !userPrefs.familyValues.some((fv) => p.familyValues.toLowerCase().includes(fv.toLowerCase()))
        ) {
          return false;
        }

        return true;
      })
      .map((candidate) => {
        const breakdown = calculateTrueMatchScore(candidate, null, userPrefs);
        return { profile: candidate, breakdown };
      })
      .filter(({ profile, breakdown }) => {
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = profile.name.toLowerCase().includes(q);
          const matchProf = profile.profession.toLowerCase().includes(q);
          const matchCity =
            profile.city.toLowerCase().includes(q) || profile.state.toLowerCase().includes(q);
          const matchEdu = profile.education.toLowerCase().includes(q);
          const matchInterests = profile.interests.some((i) => i.toLowerCase().includes(q));
          if (!matchName && !matchProf && !matchCity && !matchEdu && !matchInterests) {
            return false;
          }
        }

        // Tab-specific filters
        if (activeTab === 'saved_profiles') {
          return isProfileSaved(profile);
        }
        if (activeTab === 'shortlisted_profiles') {
          return isProfileShortlisted(profile);
        }
        if (activeTab === 'highly_compatible') {
          return breakdown.overallScore >= 70;
        }
        if (activeTab === 'new_matches') {
          return Boolean(profile.publishedAt);
        }
        if (activeTab === 'near_you') {
          if (!userPrefs.preferredCities || userPrefs.preferredCities.length === 0) return true;
          return userPrefs.preferredCities.some(
            (c: string) =>
              profile.city.toLowerCase().includes(c.toLowerCase()) ||
              profile.state.toLowerCase().includes(c.toLowerCase())
          );
        }
        if (activeTab === 'similar_interests') {
          return profile.interests.length > 0;
        }
        return true;
      })
      .sort((a, b) => {
        if (activeTab === 'new_matches') {
          return (b.profile.publishedAt || '').localeCompare(a.profile.publishedAt || '');
        }
        return b.breakdown.overallScore - a.breakdown.overallScore;
      });
  }, [dismissedIds, userPrefs, searchQuery, activeTab, savedProfileIds, shortlistedIds, allProfiles, formData?.name, user, profileId, slug]);

  const shortlistedCount = useMemo(() => {
    const matched = allProfiles.filter((p) => isProfileShortlisted(p)).length;
    return Math.max(matched, shortlistedIds.size);
  }, [allProfiles, shortlistedIds]);

  const savedCount = useMemo(() => {
    const matched = allProfiles.filter((p) => isProfileSaved(p)).length;
    return Math.max(matched, savedProfileIds.size);
  }, [allProfiles, savedProfileIds]);

  const handleOpenBreakdown = (profile: DetailedProfile, breakdown: TrueMatchBreakdown) => {
    setSelectedProfile(profile);
    setSelectedBreakdown(breakdown);
    setBreakdownModalOpen(true);
  };

  const handleViewDetail = (profileId: string) => {
    const item = scoredProfiles.find((sp) => sp.profile.id === profileId);
    if (item) {
      setSelectedProfile(item.profile);
      setSelectedBreakdown(item.breakdown);
    }
  };

  const isDetailModalOpen = Boolean(selectedProfile || breakdownModalOpen || location.pathname !== '/discover');

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8fc] text-gray-800 font-sans">
      {/* Toast Notification - Only show when no modal or subview is open */}
      {toastMessage && !isDetailModalOpen && (
        <div className="fixed bottom-6 right-6 z-[100002] px-5 py-2.5 rounded-full bg-white/95 text-slate-800 text-xs font-semibold shadow-xl shadow-rose-950/10 border border-rose-200/90 backdrop-blur-md flex items-center gap-2.5 animate-toast-bottom-right pointer-events-none">
          <Sparkles size={15} className="text-[#F01472] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Single-Line Header: Search Bar & Filter Tabs ─────────────────── */}
      <section className="bg-gradient-to-r from-purple-50/50 via-white to-pink-50/50 border-b border-purple-100 py-3 px-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-2.5 w-full">
          {/* Search Input */}
          <div className="relative flex-1 min-w-0 bg-white rounded-2xl px-3 py-2 shadow-xs border border-purple-100 flex items-center gap-2 focus-within:ring-2 focus-within:ring-rose-500/20 focus-within:border-[#F01472]">
            <Search size={15} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidates by name, profession, city..."
              className="w-full text-xs text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none font-[400] min-w-0 truncate"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-0.5 text-gray-400 hover:text-gray-600 cursor-pointer shrink-0"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Edit Preferences Button */}
          <button
            type="button"
            onClick={() => setPrefsModalOpen(true)}
            className="p-2.5 md:px-3.5 md:py-2 rounded-2xl bg-white hover:bg-purple-50 text-[#1e1b4b] font-[400] text-xs border border-purple-200/80 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition shrink-0"
            title="Edit Match Preferences"
            aria-label="Edit Match Preferences"
          >
            <Sliders size={14} className="text-[#F01472]" />
            <span className="hidden md:inline">Preferences</span>
          </button>

          {/* Shortlisted Candidates Button */}
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'shortlisted_profiles' ? 'for_you' : 'shortlisted_profiles')}
            className={`relative p-2.5 rounded-2xl transition-all cursor-pointer flex items-center justify-center shrink-0 ${
              activeTab === 'shortlisted_profiles'
                ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/25 border border-rose-600'
                : 'bg-white text-gray-700 hover:bg-rose-50 hover:text-rose-600 border border-gray-200/80 shadow-xs'
            }`}
            title={`Shortlisted Candidates (${shortlistedCount})`}
            aria-label={`Shortlisted Candidates (${shortlistedCount})`}
          >
            <Heart size={16} fill={activeTab === 'shortlisted_profiles' ? 'currentColor' : 'none'} />
            {shortlistedCount > 0 && (
              <span
                className={`absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-black flex items-center justify-center leading-none shadow-sm pointer-events-none border-2 transition-all ${
                  activeTab === 'shortlisted_profiles'
                    ? 'bg-white text-rose-600 border-rose-500'
                    : 'bg-rose-500 text-white border-white shadow-rose-500/30'
                }`}
              >
                {shortlistedCount > 99 ? '99+' : shortlistedCount}
              </span>
            )}
          </button>

          {/* Saved Candidates Button */}
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'saved_profiles' ? 'for_you' : 'saved_profiles')}
            className={`relative p-2.5 rounded-2xl transition-all cursor-pointer flex items-center justify-center shrink-0 ${
              activeTab === 'saved_profiles'
                ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/25 border border-amber-600'
                : 'bg-white text-gray-700 hover:bg-amber-50 hover:text-amber-600 border border-gray-200/80 shadow-xs'
            }`}
            title={`Saved Candidates (${savedCount})`}
            aria-label={`Saved Candidates (${savedCount})`}
          >
            <Bookmark size={16} fill={activeTab === 'saved_profiles' ? 'currentColor' : 'none'} />
            {savedCount > 0 && (
              <span
                className={`absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-black flex items-center justify-center leading-none shadow-sm pointer-events-none border-2 transition-all ${
                  activeTab === 'saved_profiles'
                    ? 'bg-white text-amber-600 border-amber-500'
                    : 'bg-rose-500 text-white border-white shadow-rose-500/30'
                }`}
              >
                {savedCount > 99 ? '99+' : savedCount}
              </span>
            )}
          </button>
        </div>
      </section>

      {/* ── Main Content Area ─────────────────────────────────────────── */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-16 space-y-8">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-purple-100/60">
          <div className="flex items-center gap-2 flex-wrap">
            {isInitialLoading ? (
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-[400] text-[#1e1b4b]">
                  Finding Matches...
                </h2>
                <span className="px-3 py-1 rounded-full bg-rose-50 text-[#F01472] text-xs font-medium border border-rose-200/80 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F01472] animate-ping" />
                  Scanning Verified Profiles
                </span>
              </div>
            ) : (
              <>
                <h2 className="text-xl sm:text-2xl font-[400] text-[#1e1b4b]">
                  {scoredProfiles.length}{' '}
                  {scoredProfiles.length === 1 ? 'Compatible Match' : 'Compatible Matches'}
                </h2>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-[400] border border-emerald-200">
                  100% Verified Profiles
                </span>
                {activeTab === 'saved_profiles' && (
                  <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-[400] border border-amber-200 flex items-center gap-1">
                    <Bookmark size={12} className="text-amber-600 fill-amber-600" />
                    <span>Saved Profiles</span>
                  </span>
                )}
                {activeTab === 'shortlisted_profiles' && (
                  <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-[400] border border-rose-200 flex items-center gap-1">
                    <Heart size={12} className="text-rose-600 fill-rose-600" />
                    <span>Shortlisted Candidates</span>
                  </span>
                )}
              </>
            )}
          </div>

          {!isInitialLoading && dismissedIds.size > 0 && (
            <button
              type="button"
              onClick={handleResetDismissed}
              className="text-xs font-[400] text-[#F01472] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={12} /> Show {dismissedIds.size} dismissed profiles
            </button>
          )}
        </div>

        {/* ── Profile Grid or Loading Screen ─────────────────────────────────────────────── */}
        {isInitialLoading || (isLoading && scoredProfiles.length === 0) ? (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Dedicated Loading Hero Screen Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-50/90 via-purple-50/70 to-pink-50/80 border border-pink-100/90 p-8 sm:p-12 text-center shadow-xs">
              <div className="relative z-10 flex flex-col items-center justify-center max-w-md mx-auto space-y-3.5">
                <div className="relative flex items-center justify-center my-2">
                  <div className="absolute w-24 h-24 rounded-full bg-pink-500/15 animate-ping" />
                  <div className="relative w-18 h-18 rounded-3xl bg-gradient-to-tr from-[#F01472] to-pink-400 text-white flex items-center justify-center shadow-xl shadow-pink-500/25">
                    <HeartHandshake size={34} className="animate-pulse text-white" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  Curating Compatible Matches for You...
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-normal leading-relaxed">
                  Scanning verified matrimonial biodatas and calculating AI compatibility scores based on your partner preferences.
                </p>
                <div className="w-52 sm:w-64 h-1.5 bg-pink-200/60 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-gradient-to-r from-[#F01472] via-pink-400 to-[#F01472] rounded-full animate-pulse w-full" />
                </div>
              </div>
            </div>

            {/* Shimmering Profile Card Skeletons */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
                <div
                  key={idx}
                  className="w-full aspect-[4/5] rounded-3xl bg-white border border-pink-100/80 p-3.5 sm:p-4 flex flex-col justify-between shadow-xs overflow-hidden relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-20 bg-pink-50 rounded-full animate-pulse" />
                    <div className="h-7 w-7 bg-pink-50 rounded-full animate-pulse" />
                  </div>
                  <div className="flex-1 my-3 flex flex-col items-center justify-center space-y-2">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-pink-50 to-purple-50 animate-pulse border-2 border-pink-100/60" />
                    <div className="h-4 bg-pink-100/60 rounded-full w-28 animate-pulse" />
                  </div>
                  <div className="space-y-2 pt-2.5 border-t border-pink-50">
                    <div className="h-3.5 bg-pink-100/50 rounded-md w-3/4 animate-pulse" />
                    <div className="h-3 bg-pink-50 rounded-md w-1/2 animate-pulse" />
                    <div className="h-8 bg-pink-50/70 rounded-xl w-full animate-pulse mt-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : scoredProfiles.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-purple-200/80 shadow-sm max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-pink-50 text-[#F01472] flex items-center justify-center mx-auto shadow-inner">
              {activeTab === 'saved_profiles' ? (
                <Bookmark size={28} />
              ) : activeTab === 'shortlisted_profiles' ? (
                <Heart size={28} />
              ) : (
                <Sparkles size={28} />
              )}
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-gray-800">
                {activeTab === 'saved_profiles'
                  ? 'No saved profiles yet'
                  : activeTab === 'shortlisted_profiles'
                  ? 'No shortlisted profiles yet'
                  : 'No matching profiles in this feed'}
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                {activeTab === 'saved_profiles'
                  ? 'Click the bookmark icon on any profile card to save them here for quick access.'
                  : activeTab === 'shortlisted_profiles'
                  ? 'Click the heart icon on any profile card to shortlist them here for quick access.'
                  : 'Try expanding your match preferences or search keywords to view more candidates.'}
              </p>
            </div>
            <div>
              {activeTab === 'saved_profiles' || activeTab === 'shortlisted_profiles' ? (
                <button
                  type="button"
                  onClick={() => setActiveTab('for_you')}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#F01472] to-[#C80E5A] hover:from-rose-600 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-pink-500/25 transition cursor-pointer"
                >
                  Explore All Matches
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setPrefsModalOpen(true)}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#F01472] to-[#C80E5A] hover:from-rose-600 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-pink-500/25 transition cursor-pointer"
                >
                  Update Preferences
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {scoredProfiles.map(({ profile, breakdown }) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                breakdown={breakdown}
                onViewDetail={handleViewDetail}
                onOpenBreakdown={handleOpenBreakdown}
                onToggleShortlist={handleToggleShortlist}
                onToggleSave={handleToggleSave}
                onSendInterest={handleSendInterest}
                onMaybeLater={handleMaybeLater}
                isShortlisted={isProfileShortlisted(profile)}
                isSaved={isProfileSaved(profile)}
                hasSentInterest={isProfileInterestSent(profile)}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── TrueMatch Compatibility Breakdown Modal ─────────────────── */}
      <TrueMatchBreakdownModal
        profile={selectedProfile}
        breakdown={selectedBreakdown}
        isOpen={breakdownModalOpen}
        onClose={() => setBreakdownModalOpen(false)}
        onViewFullProfile={(profileId) => {
          setBreakdownModalOpen(false);
          handleViewDetail(profileId);
        }}
        onSendInterest={handleSendInterest}
        hasSentInterest={selectedProfile ? isProfileInterestSent(selectedProfile) : false}
      />

      {/* ── Full Profile Detail Modal ─────────────────────────────────── */}
      <ProfilePublicModal
        profile={selectedProfile && !breakdownModalOpen ? selectedProfile : null}
        breakdown={selectedBreakdown}
        isOpen={Boolean(selectedProfile && !breakdownModalOpen)}
        onClose={() => {
          setSelectedProfile(null);
          setSelectedBreakdown(null);
        }}
        onSendInterest={handleSendInterest}
        onToggleShortlist={handleToggleShortlist}
        onToggleSave={handleToggleSave}
        isShortlisted={selectedProfile ? isProfileShortlisted(selectedProfile) : false}
        isSaved={selectedProfile ? isProfileSaved(selectedProfile) : false}
        hasSentInterest={selectedProfile ? isProfileInterestSent(selectedProfile) : false}
      />

      {/* ── User Preferences Modal ────────────────────────────────────── */}
      <UserPreferencesModal
        isOpen={prefsModalOpen}
        onClose={() => setPrefsModalOpen(false)}
        preferences={userPrefs}
        myGender={formData?.gender || ''}
        onSavePreferences={(newPrefs) => {
          setUserPrefs(newPrefs);
          try {
            localStorage.setItem('tm_user_preferences', JSON.stringify(newPrefs));
          } catch (e) {
            console.error('Failed to save preferences to localStorage', e);
          }
          showToast('Preferences updated! TrueMatches recalculated.');
        }}
      />

      <AppFooter />
    </div>
  );
};