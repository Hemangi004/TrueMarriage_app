export interface EducationItem {
  id: string;
  degree: string;
  college: string;
  university: string;
  passingYear: string;
  qualification: string;
  certifications: string;
  certificateUrl?: string;
}

export interface BiodataForm {
  // ── Personal Details ──
  name: string;                // fullName
  gender: 'Male' | 'Female' | 'Other' | '';
  dob: string;                 // dateOfBirth (YYYY-MM-DD)
  age: number;                 // Auto-calculated
  timeOfBirth?: string;        // timeOfBirth
  placeOfBirth?: string;       // birthPlace
  religion: string;
  caste: string;
  subCaste: string;
  kuldevata?: string;          // kuldevata (family deity)
  gotra: string;
  rashi?: string;              // rashi (zodiac)
  nakshatra?: string;          // nakshatra (birth star)
  gan?: string;                // gan (astrological group)
  nadi?: string;               // nadi (astrological nadi)
  heightCm: number;            // height in cm
  complexion: string;
  bloodGroup: string;

  // ── Education & Career ──
  educationList: EducationItem[];
  occupation: string;
  company: string;
  designation: string;
  income?: string;             // income / salary description
  salaryRange: string;
  businessDetails: string;
  officeAddress: string;
  experienceYears: number;
  linkedInUrl: string;
  skills: string[];
  workMode: 'Remote' | 'Hybrid' | 'Office' | '';
  employmentType: 'Full Time' | 'Business' | 'Government' | 'Private' | 'Self Employed' | '';
  professionalSummary: string;

  // ── Family Details ──
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  brotherCount: number;
  brotherDetails: string;
  sisterCount: number;
  sisterDetails: string;
  maternalUncle?: string;      // maternalUncle (mama)
  relations?: string;          // relations / relatives
  familyType: 'Joint' | 'Nuclear' | '';
  nativePlace: string;
  familyBackground: string;
  familyValues: 'Traditional' | 'Modern' | 'Liberal' | 'Balanced' | '';

  // ── Contact ──
  currentAddress: string;
  permanentAddress: string;
  sameAsCurrentAddress: boolean;
  contactNumber: string;
  contactTo?: string;
  phone?: string;
  contactVerified: boolean;
  verifiedPhone?: string;
  email: string;
  emailVerified: boolean;
  verifiedEmail?: string;

  // ── Misc / Legacy ──
  weightKg: number;
  manglik: 'No' | 'Yes' | 'Anshik' | 'Don\'t Know';
  horoscopeUrl?: string;
  maritalStatus: 'Never Married' | 'Divorced' | 'Widowed' | 'Awaiting Divorce';
  languagesKnown: string[];
  nationality: string;
  siblings?: string;

  // ── Lifestyle ──
  diet: 'Vegetarian' | 'Eggetarian' | 'Non Veg' | 'Vegan' | '';
  smoking: 'Never' | 'Occasionally' | 'Yes' | 'No' | '';
  drinking: 'Never' | 'Socially' | 'Frequently' | 'No' | '';
  hobbies: string[];
  personalityTraits?: string[];

  // ── Partner Expectations ──
  expectedEducation: string;
  expectedProfession: string;
  expectedLocation: string;
  expectedAgeMin: number;
  expectedAgeMax: number;
  expectedHeightMin: number;
  expectedHeightMax: number;
  expectedReligion: string;
  expectedCaste: string;
  otherPreferences: string;

  // ── Uploads ──
  profilePictureUrl: string;   // profilePhoto
  originalProfilePictureUrl?: string; // uncropped, unfiltered master source photo
  profilePhotoFilter?: string; // active photo filter ID
  galleryPictures: string[];
  familyPhotoUrl: string;
  documentUrls: string[];

  // ── Header & Sacred Symbol Customization ──
  headerMotif?: string;        // Shloka text e.g. '|| Shri Ganeshay Namah: ||'
  selectedMotifIcon?: string;  // Motif icon/symbol e.g. '🙏', '🕉️', '卐'

  // ── UI Preferences & Dual-Script Native Names (Method 4) ──
  lang?: string;               // Active display language e.g. 'en', 'mr', 'hi'
  motherTongue?: string;       // Primary / native language name
  nameNative?: string;         // Full name in native Indic script
  fatherNameNative?: string;   // Father's name in native Indic script
  motherNameNative?: string;   // Mother's name in native Indic script
  maternalUncleNative?: string;// Maternal uncle's name in native Indic script
  nativeNames?: Record<string, string>; // Dynamic mapping of English names to native script
}

export type StepId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface StepInfo {
  id: StepId;
  label: string;
  shortLabel: string;
  iconName: string;
}
