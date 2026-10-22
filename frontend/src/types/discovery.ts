export interface VerificationStatus {
  mobileVerified: boolean;
  emailVerified: boolean;
  idVerified: boolean;
  profileComplete: boolean;
}

export interface TrueMatchDimension {
  score: number; // 0 - 100
  weight: number; // e.g. 0.20
  summary: string;
  points: string[];
}

export interface TrueMatchBreakdown {
  overallScore: number; // 0 - 100
  recommendationTagline: string;
  whyYouMatch: string[];
  isHardMatchPassed: boolean;
  dimensions: {
    valuesPersonality: TrueMatchDimension;
    marriageExpectations: TrueMatchDimension;
    lifestyle: TrueMatchDimension;
    location: TrueMatchDimension;
    interestsHobbies: TrueMatchDimension;
    educationCareer: TrueMatchDimension;
    religionCommunity: TrueMatchDimension;
    age: TrueMatchDimension;
  };
}

export interface UserPreferences {
  ageMin: number;
  ageMax: number;
  preferredGender: 'Male' | 'Female' | '';
  preferredCities: string[];
  maritalStatus: string[];
  workingPartnerPreference: 'Yes' | 'Open' | 'No' | '';
  familyValues: string[];
  dietPreferences: string[];
  religionPreferences: string[];
  communityPreferences: string[];
  educationLevels: string[];
  smoking: string[];
  drinking: string[];
  marriageTimeline: string[];
}

export interface DetailedProfile {
  id: string;
  slug?: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  height: string;
  city: string;
  state: string;
  location: string;
  profileImage: string;
  originalProfileImage?: string;
  photoFilter?: string;
  additionalPhotos?: string[];
  profession: string;
  company?: string;
  education: string;
  college?: string;
  annualIncome?: string;
  religion: string;
  community: string;
  motherTongue: string;
  maritalStatus: 'Never Married' | 'Divorced' | 'Widowed' | 'Awaiting Divorce';
  familyType: 'Nuclear Family' | 'Joint Family' | 'Extended Family';
  familyValues: 'Traditional' | 'Moderate' | 'Liberal';
  fatherName?: string;
  fatherOccupation?: string;
  motherName?: string;
  motherOccupation?: string;
  siblings?: string;
  nativePlace?: string;
  diet: 'Vegetarian' | 'Non-Vegetarian' | 'Eggetarian' | 'Jain' | 'Vegan';
  smoking: 'No' | 'Occasionally' | 'Yes';
  drinking: 'No' | 'Socially' | 'Yes';
  fitness?: string;
  travel?: string;
  personality: string[];
  interests: string[];
  aboutMe: string;
  marriageExpectations: string;
  marriageTimeline?: 'Immediate' | 'Within 6-12 months' | 'Within 1-2 years' | 'Not decided';
  workingPartnerPreference?: 'Prefers working partner' | 'Open to both' | 'Prefers homemaker';
  childrenPreference?: 'Wants children' | 'Not sure' | 'Does not want';
  phone?: string;
  email?: string;
  contactNumber?: string;
  contactTo?: string;
  contact_to?: string;
  hideContactDetails?: boolean;
  contactDetails?: {
    phone?: string;
    contact_to?: string;
    email?: string;
    contact_person?: string;
    relation?: string;
  } | null;
  verification: VerificationStatus;
  profileCompletion: number;
  trueMatchScore?: number;
  trueMatchHighlights?: string[];
  publishedAt?: string;
  isShortlisted?: boolean;
  isSaved?: boolean;
  hasSentInterest?: boolean;
}

export type DiscoveryTab = 'for_you' | 'highly_compatible' | 'new_matches' | 'near_you' | 'similar_interests' | 'saved_profiles' | 'shortlisted_profiles';

export interface SearchFilterState {
  searchQuery: string;
  minAge: number;
  maxAge: number;
  gender: string;
  locations: string[];
  professions: string[];
  educations: string[];
  religions: string[];
  communities: string[];
  motherTongues: string[];
  maritalStatuses: string[];
  familyTypes: string[];
  familyValues: string[];
  diets: string[];
  smoking: string[];
  drinking: string[];
  verifiedOnly: boolean;
  marriageTimeline: string[];
  workingPartnerPreference: string;
  sortBy: 'best_match' | 'recently_joined' | 'recently_active' | 'age_low_high' | 'age_high_low';
}

export interface PublicProfileListItem {
  id: string;
  slug?: string | null;
  display_name: string;
  gender?: string | null;
  age?: number | null;
  height?: string | null;
  religion?: string | null;
  caste?: string | null;
  mother_tongue?: string | null;
  marital_status?: string | null;
  education?: string | null;
  college?: string | null;
  occupation?: string | null;
  company?: string | null;
  annual_income?: string | null;
  city?: string | null;
  state?: string | null;
  native_place?: string | null;
  family_type?: string | null;
  family_values?: string | null;
  father_name?: string | null;
  father_occupation?: string | null;
  mother_name?: string | null;
  mother_occupation?: string | null;
  siblings?: string | null;
  diet?: string | null;
  smoking?: string | null;
  drinking?: string | null;
  fitness?: string | null;
  travel?: string | null;
  personality?: string[];
  interests?: string[];
  about_me?: string | null;
  partner_expectations?: string | null;
  marriage_timeline?: string | null;
  profile_picture_url?: string | null;
  additional_photos?: string[];
  additionalPhotos?: string[];
  published_at?: string | null;
  verified?: boolean;
  trueMatchScore?: number;
}

export interface PublicProfileDetail extends PublicProfileListItem {
  is_locked?: boolean;
  contact_details?: {
    phone?: string | null;
    email?: string | null;
    contact_person?: string | null;
    relation?: string | null;
  } | null;
  trueMatchHighlights?: string[];
}

export interface PaginatedDiscoveryResponse {
  success: boolean;
  data: PublicProfileListItem[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

export interface DiscoveryQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  gender?: string;
  min_age?: number;
  max_age?: number;
  location?: string;
  education?: string;
  occupation?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}
