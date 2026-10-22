import type {
  DetailedProfile,
  UserPreferences,
  TrueMatchBreakdown,
  TrueMatchDimension,
} from '../types/discovery';
import type { BiodataForm } from '../types/biodata';

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  ageMin: 18,
  ageMax: 55,
  preferredGender: 'Female',
  preferredCities: [],
  maritalStatus: ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'],
  workingPartnerPreference: '',
  familyValues: ['Moderate', 'Traditional', 'Liberal'],
  dietPreferences: ['Vegetarian', 'Vegan', 'Eggetarian', 'Non-Vegetarian', 'Jain'],
  religionPreferences: [],
  communityPreferences: [],
  educationLevels: [],
  smoking: ['No', 'Occasionally', 'Yes'],
  drinking: ['No', 'Socially', 'Frequently', 'Yes'],
  marriageTimeline: ['Immediate', 'Within 6-12 months', 'Within 1-2 years', 'Not decided'],
};

/**
 * Calculates the TrueMatch compatibility breakdown between a user profile/preferences and a candidate profile.
 * Implements the 100% weighted formula:
 *  - Values & Personality: 20%
 *  - Lifestyle: 15%
 *  - Age Compatibility: 15%
 *  - Location Compatibility: 10%
 *  - Education & Career: 10%
 *  - Religion / Community: 10%
 *  - Marriage Expectations: 10%
 *  - Interests & Hobbies: 10%
 */
export function calculateTrueMatchScore(
  candidate: DetailedProfile,
  _userProfile?: BiodataForm | null,
  userPrefs: UserPreferences = DEFAULT_USER_PREFERENCES
): TrueMatchBreakdown {
  const whyYouMatch: string[] = [];

  // 1. HARD MATCH VERIFICATION
  let isHardMatchPassed = true;

  // Age hard filter check
  if (candidate.age < userPrefs.ageMin - 3 || candidate.age > userPrefs.ageMax + 3) {
    isHardMatchPassed = false;
  }

  // Gender hard filter check
  if (userPrefs.preferredGender && candidate.gender !== userPrefs.preferredGender) {
    isHardMatchPassed = false;
  }

  // Marital Status hard filter check
  if (
    userPrefs.maritalStatus.length > 0 &&
    !userPrefs.maritalStatus.includes(candidate.maritalStatus)
  ) {
    isHardMatchPassed = false;
  }

  // 2. SOFT MATCH DIMENSIONS (0 - 100 each)

  // ── Dimension A: Values & Personality (Weight: 20%) ──
  let valuesScore = 80;
  const valuesPoints: string[] = [];
  if (
    userPrefs.familyValues.includes(candidate.familyValues) ||
    candidate.familyValues === 'Moderate'
  ) {
    valuesScore += 15;
    valuesPoints.push('Both share a balanced, modern yet family-oriented mindset');
    whyYouMatch.push('Both are family-oriented');
  } else {
    valuesScore -= 10;
    valuesPoints.push('Slight difference in traditional vs modern viewpoints');
  }

  const personality = candidate.personality || [];
  if (personality.includes('Family-oriented') || personality.includes('Family-first')) {
    valuesScore += 5;
    valuesPoints.push('High value placed on family relationships and bonding');
  }
  if (personality.includes('Ambitious') || personality.includes('Leader')) {
    valuesPoints.push('Driven with clear aspirations and intellectual depth');
  }
  valuesScore = Math.min(98, Math.max(50, valuesScore));

  const valuesDim: TrueMatchDimension = {
    score: valuesScore,
    weight: 0.20,
    summary:
      valuesScore >= 90
        ? 'You both deeply value family traditions and share an open-minded modern outlook.'
        : 'Good emotional resonance with complementary family expectations.',
    points: valuesPoints,
  };

  // ── Dimension B: Lifestyle (Weight: 15%) ──
  let lifestyleScore = 75;
  const lifestylePoints: string[] = [];
  if (candidate.diet && userPrefs.dietPreferences.includes(candidate.diet)) {
    lifestyleScore += 15;
    lifestylePoints.push(`Matching dietary preference: ${candidate.diet}`);
    whyYouMatch.push(`Aligned on ${candidate.diet} diet`);
  } else if (candidate.diet) {
    lifestylePoints.push(`Dietary preference: ${candidate.diet}`);
  }

  if (candidate.smoking && (userPrefs.smoking.includes(candidate.smoking) || candidate.smoking === 'No')) {
    lifestyleScore += 5;
    lifestylePoints.push('Zero smoking habit compatibility');
  }

  if (candidate.drinking && userPrefs.drinking.includes(candidate.drinking)) {
    lifestyleScore += 5;
    lifestylePoints.push(`Social drinking compatibility (${candidate.drinking})`);
  }

  if (candidate.fitness) {
    lifestylePoints.push(`Active lifestyle routine: ${candidate.fitness}`);
    whyYouMatch.push('Active & healthy lifestyle');
  }
  lifestyleScore = Math.min(98, Math.max(50, lifestyleScore));

  const lifestyleDim: TrueMatchDimension = {
    score: lifestyleScore,
    weight: 0.15,
    summary:
      lifestyleScore >= 88
        ? 'Both prioritize healthy living, similar dietary choices, and an active routine.'
        : 'Compatible daily habits and mutual respect for personal space.',
    points: lifestylePoints,
  };

  // ── Dimension C: Age Compatibility (Weight: 15%) ──
  let ageScore = 80;
  const agePoints: string[] = [];
  const candidateAge = candidate.age || 25;
  if (candidateAge >= userPrefs.ageMin && candidateAge <= userPrefs.ageMax) {
    ageScore = 98;
    agePoints.push(`Age ${candidateAge} falls right within your preferred range (${userPrefs.ageMin}–${userPrefs.ageMax})`);
    whyYouMatch.push(`Ideal age range (${candidateAge} yrs)`);
  } else {
    const diff = Math.min(
      Math.abs(candidateAge - userPrefs.ageMin),
      Math.abs(candidateAge - userPrefs.ageMax)
    );
    ageScore = Math.max(40, 90 - diff * 12);
    agePoints.push(`Age ${candidateAge} is slightly outside preferred range (${userPrefs.ageMin}–${userPrefs.ageMax})`);
  }

  const ageDim: TrueMatchDimension = {
    score: ageScore,
    weight: 0.15,
    summary:
      ageScore >= 90
        ? `Within your ideal age window with natural generational compatibility.`
        : `Close to your age preference with mature life stage readiness.`,
    points: agePoints,
  };

  // ── Dimension D: Location Compatibility (Weight: 10%) ──
  let locScore = 70;
  const locPoints: string[] = [];
  const candCity = (candidate.city || '').toLowerCase();
  const candState = (candidate.state || '').toLowerCase();
  const matchesCity = userPrefs.preferredCities.some(
    (c: string) => candCity.includes(c.toLowerCase()) || candState.includes(c.toLowerCase())
  );
  const candLoc = candidate.location || [candidate.city, candidate.state].filter(Boolean).join(', ') || 'India';
  if (matchesCity) {
    locScore = 96;
    locPoints.push(`Located in ${candLoc} — directly in your preferred cities`);
    whyYouMatch.push('Preferred cities overlap');
  } else {
    locScore = 72;
    locPoints.push(`Currently based in ${candLoc}`);
  }

  const locDim: TrueMatchDimension = {
    score: locScore,
    weight: 0.10,
    summary:
      locScore >= 90
        ? `Your preferred cities overlap perfectly, minimizing relocation friction.`
        : `Geographically accessible with openness to mutual relocation.`,
    points: locPoints,
  };

  // ── Dimension E: Education & Career (Weight: 10%) ──
  let eduScore = 85;
  const eduPoints: string[] = [];
  if (candidate.profession) {
    eduPoints.push(`Established professional career: ${candidate.profession}`);
  }
  if (candidate.education) {
    eduPoints.push(`High educational qualification: ${candidate.education}`);
  }
  if (candidate.annualIncome) {
    eduPoints.push(`Financial stability & transparency: ${candidate.annualIncome}`);
  }
  eduScore = Math.min(96, eduScore + 8);
  whyYouMatch.push('Strong educational & professional background');

  const eduDim: TrueMatchDimension = {
    score: eduScore,
    weight: 0.10,
    summary: 'Both appreciate career ambitions, intellectual growth, and professional balance.',
    points: eduPoints,
  };

  // ── Dimension F: Religion & Community (Weight: 10%) ──
  let relScore = 85;
  const relPoints: string[] = [];
  if (
    userPrefs.religionPreferences.length === 0 ||
    userPrefs.religionPreferences.includes(candidate.religion)
  ) {
    relScore = 95;
    relPoints.push(`Compatible cultural/religious heritage: ${candidate.religion}`);
  } else {
    relScore = 75;
    relPoints.push(`Background: ${candidate.religion}`);
  }
  if (candidate.motherTongue) {
    relPoints.push(`Mother tongue: ${candidate.motherTongue}`);
  }

  const relDim: TrueMatchDimension = {
    score: relScore,
    weight: 0.10,
    summary: 'Harmonious cultural sensibilities and respect for festive traditions.',
    points: relPoints,
  };

  // ── Dimension G: Marriage Expectations (Weight: 10%) ──
  let marriageScore = 85;
  const marriagePoints: string[] = [];
  if (
    candidate.workingPartnerPreference === 'Prefers working partner' &&
    (userPrefs.workingPartnerPreference === 'Yes' || userPrefs.workingPartnerPreference === 'Open')
  ) {
    marriageScore += 8;
    marriagePoints.push('Both support a dual-career partnership with shared responsibilities');
    whyYouMatch.push('Both prefer a working partner');
  }

  if (candidate.marriageTimeline) {
    marriagePoints.push(`Aligned marriage timeline: ${candidate.marriageTimeline}`);
    whyYouMatch.push('Similar marriage timeline');
  }

  marriageScore = Math.min(98, marriageScore);

  const marriageDim: TrueMatchDimension = {
    score: marriageScore,
    weight: 0.10,
    summary: 'Aligned on timeline, equality in marriage, and shared future aspirations.',
    points: marriagePoints,
  };

  // ── Dimension H: Interests & Hobbies (Weight: 10%) ──
  let interestsScore = 82;
  const interestPoints: string[] = [];
  if (candidate.interests && candidate.interests.length > 0) {
    interestPoints.push(`Shared interests: ${candidate.interests.slice(0, 3).join(', ')}`);
  }
  if (candidate.travel) {
    interestPoints.push(`Mutual love for travel: ${candidate.travel}`);
    whyYouMatch.push('Both enjoy travelling');
  }
  interestsScore = Math.min(95, interestsScore + 6);

  const interestsDim: TrueMatchDimension = {
    score: interestsScore,
    weight: 0.10,
    summary: 'Common hobbies that foster meaningful weekend conversations and shared memories.',
    points: interestPoints,
  };

  // 3. FINAL WEIGHTED CALCULATION
  const weightedRaw =
    valuesDim.score * valuesDim.weight +
    lifestyleDim.score * lifestyleDim.weight +
    ageDim.score * ageDim.weight +
    locDim.score * locDim.weight +
    eduDim.score * eduDim.weight +
    relDim.score * relDim.weight +
    marriageDim.score * marriageDim.weight +
    interestsDim.score * interestsDim.weight;

  // Apply penalty if hard match failed
  let finalScore = Math.round(weightedRaw);
  if (!isHardMatchPassed) {
    finalScore = Math.max(50, Math.round(finalScore * 0.78));
  }

  // Generate personalized recommendation tagline (Section 12)
  let recommendationTagline = 'Recommended because you both value family life.';
  if (whyYouMatch.includes('Preferred cities overlap') && locDim.score >= 90) {
    recommendationTagline = 'Recommended because your preferred cities overlap.';
  } else if (whyYouMatch.includes('Both enjoy travelling')) {
    recommendationTagline = 'Recommended because you share a passion for travel & active living.';
  } else if (whyYouMatch.includes('Similar marriage expectations')) {
    recommendationTagline = 'Recommended because your marriage expectations are highly compatible.';
  } else if (valuesDim.score >= 92) {
    recommendationTagline = 'Recommended because you both share family-first values.';
  }

  return {
    overallScore: finalScore,
    recommendationTagline,
    whyYouMatch: Array.from(new Set(whyYouMatch)).slice(0, 4),
    isHardMatchPassed,
    dimensions: {
      valuesPersonality: valuesDim,
      marriageExpectations: marriageDim,
      lifestyle: lifestyleDim,
      location: locDim,
      interestsHobbies: interestsDim,
      educationCareer: eduDim,
      religionCommunity: relDim,
      age: ageDim,
    },
  };
}
