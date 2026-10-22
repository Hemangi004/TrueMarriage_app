import type { BiodataForm } from '../types/biodata';


export const normalizeDobToIso = (dobString: string): string => {
  if (!dobString) return '';
  const trimmed = dobString.trim();

  // Match separators -, /, .
  const parts = trimmed.split(/[-/.]/);
  if (parts.length === 3) {
    const p0 = parseInt(parts[0], 10);
    const p1 = parseInt(parts[1], 10);
    const p2 = parseInt(parts[2], 10);
    if (isNaN(p0) || isNaN(p1) || isNaN(p2)) return '';

    let year = 0;
    let month = 0;
    let day = 0;

    // Case 1: YYYY-MM-DD
    if (p0 >= 1900 && p0 <= 2099) {
      year = p0;
      month = p1;
      day = p2;
    }
    // Case 2: DD-MM-YYYY or MM-DD-YYYY
    else if (p2 >= 1900 && p2 <= 2099) {
      year = p2;
      if (p0 > 12 && p1 <= 12) {
        day = p0;
        month = p1;
      } else if (p1 > 12 && p0 <= 12) {
        day = p1;
        month = p0;
      } else {
        // Standard DD-MM-YYYY
        day = p0;
        month = p1;
      }
    } else {
      return '';
    }

    if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 1920 && year <= 2026) {
      return `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
  }

  // Fallback to standard Date parsing if valid
  const d = new Date(trimmed);
  if (!isNaN(d.getTime())) {
    const y = d.getFullYear();
    if (y >= 1920 && y <= 2026) {
      return `${y.toString().padStart(4, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
  }

  return '';
};

export const calculateAge = (dobString: string): number => {
  if (!dobString) return 0;
  const isoDate = normalizeDobToIso(dobString);
  if (!isoDate) return 0;

  const [yearStr, monthStr, dayStr] = isoDate.split('-');
  const birthYear = parseInt(yearStr, 10);
  const birthMonth = parseInt(monthStr, 10) - 1;
  const birthDay = parseInt(dayStr, 10);

  const today = new Date();
  let age = today.getFullYear() - birthYear;
  const monthDiff = today.getMonth() - birthMonth;
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDay)) {
    age--;
  }
  return (age > 0 && age < 120) ? age : 0;
};

export const cmToFeetInches = (cm: number): string => {
  if (!cm) return '';
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${cm} cm (${feet}'${inches}")`;
};

export const calculateCompletionScore = (formData: BiodataForm): number => {
  let filledCount = 0;
  let totalKeyFields = 28;

  // Step 1: Personal
  if (formData.name) filledCount++;
  if (formData.gender) filledCount++;
  if (formData.dob) filledCount++;
  if (formData.heightCm) filledCount++;
  if (formData.religion) filledCount++;
  if (formData.caste) filledCount++;
  if (formData.maritalStatus) filledCount++;
  if (formData.languagesKnown && formData.languagesKnown.length > 0) filledCount++;
  if (formData.currentAddress) filledCount++;
  if (formData.contactNumber) filledCount++;
  if (formData.email) filledCount++;

  // Step 2: Education
  if (formData.educationList && formData.educationList.length > 0) filledCount++;

  // Step 3: Career
  if (formData.occupation) filledCount++;
  if (formData.company) filledCount++;
  if (formData.salaryRange) filledCount++;
  if (formData.employmentType) filledCount++;
  if (formData.skills && formData.skills.length > 0) filledCount++;

  // Step 4: Family
  if (formData.fatherName) filledCount++;
  if (formData.motherName) filledCount++;
  if (formData.familyType) filledCount++;
  if (formData.familyValues) filledCount++;
  if (formData.nativePlace) filledCount++;

  // Step 5: Lifestyle
  if (formData.diet) filledCount++;
  if (formData.hobbies && formData.hobbies.length > 0) filledCount++;

  // Step 6: Expectations
  if (formData.expectedEducation || formData.expectedProfession) filledCount++;
  if (formData.otherPreferences) filledCount++;

  // Step 7: Uploads
  if (formData.profilePictureUrl) filledCount += 2; // High weight

  const score = Math.round((filledCount / totalKeyFields) * 100);
  return Math.min(score, 100);
};

export const emptyBiodataForm: BiodataForm = {
  // Personal
  name: '',
  gender: '',
  dob: '',
  age: 0,
  timeOfBirth: '',
  placeOfBirth: '',
  religion: '',
  caste: '',
  subCaste: '',
  kuldevata: '',
  gotra: '',
  rashi: '',
  nakshatra: '',
  gan: '',
  nadi: '',
  heightCm: 165,
  complexion: '',
  bloodGroup: '',

  // Education & Career
  educationList: [],
  occupation: '',
  company: '',
  designation: '',
  income: '',
  salaryRange: '',
  businessDetails: '',
  officeAddress: '',
  experienceYears: 0,
  linkedInUrl: '',
  skills: [],
  workMode: '',
  employmentType: '',
  professionalSummary: '',

  // Family
  fatherName: '',
  fatherOccupation: '',
  motherName: '',
  motherOccupation: '',
  brotherCount: 0,
  brotherDetails: '',
  sisterCount: 0,
  sisterDetails: '',
  maternalUncle: '',
  relations: '',
  familyType: '',
  nativePlace: '',
  familyBackground: '',
  familyValues: '',

  // Contact
  currentAddress: '',
  permanentAddress: '',
  sameAsCurrentAddress: true,
  contactNumber: '',
  contactTo: '',
  contactVerified: false,
  verifiedPhone: '',
  email: '',
  emailVerified: false,
  verifiedEmail: '',

  // Misc / Legacy
  weightKg: 60,
  manglik: 'No',
  maritalStatus: 'Never Married',
  languagesKnown: [],
  nationality: 'Indian',

  // Lifestyle
  diet: '',
  smoking: '',
  drinking: '',
  hobbies: [],
  personalityTraits: [],

  // Partner Expectations
  expectedEducation: '',
  expectedProfession: '',
  expectedLocation: '',
  expectedAgeMin: 22,
  expectedAgeMax: 35,
  expectedHeightMin: 150,
  expectedHeightMax: 190,
  expectedReligion: '',
  expectedCaste: '',
  otherPreferences: '',

  // Uploads
  profilePictureUrl: '',
  originalProfilePictureUrl: '',
  profilePhotoFilter: 'normal',
  galleryPictures: [],
  familyPhotoUrl: '',
  documentUrls: [],

  // Sacred Header & Symbol
  headerMotif: '|| Shri Ganeshay Namah: ||',
  selectedMotifIcon: '/symbols/ganesha_golden.png',

  // UI Preferences & Dual-Script Native Names (Method 4)
  lang: 'en',
  motherTongue: '',
  nameNative: '',
  fatherNameNative: '',
  motherNameNative: '',
  maternalUncleNative: '',
  nativeNames: {},
};

export const initialBiodataForm = emptyBiodataForm;

export const getInitialBiodataForm = (user?: { full_name?: string | null; email?: string; is_email_verified?: boolean; phone?: string | null; is_phone_verified?: boolean; contactTo?: string; contact_to?: string } | null): BiodataForm => {
  if (!user) return emptyBiodataForm;
  const userPhone = user.phone || '';
  const userEmail = user.email || '';
  const isPhoneVerified = !!(user.is_phone_verified && userPhone);
  const isEmailVerified = !!(user.is_email_verified && userEmail);
  const contactTo = (user as any).contactTo || (user as any).contact_to || '';
  return {
    ...emptyBiodataForm,
    name: user.full_name || '',
    email: userEmail,
    emailVerified: isEmailVerified,
    verifiedEmail: isEmailVerified ? userEmail : '',
    contactNumber: userPhone,
    contactTo: contactTo,
    contactVerified: isPhoneVerified,
    verifiedPhone: isPhoneVerified ? userPhone : '',
  };
};

import type { DetailedProfile } from '../types/discovery';

export const convertFormDataToDetailedProfile = (formData: BiodataForm, profileId?: string): DetailedProfile => {
  const age = formData.age || (formData.dob ? calculateAge(formData.dob) : 0);

  const eduTop = (formData.educationList && formData.educationList[0]) || null;
  const eduStr = eduTop ? `${eduTop.degree || eduTop.qualification || ''}` : '';
  const collegeStr = eduTop ? eduTop.college || eduTop.university || '' : '';

  const familyTypeValue: 'Joint Family' | 'Nuclear Family' | 'Extended Family' =
    formData.familyType === 'Joint' ? 'Joint Family' : 'Nuclear Family';

  const familyValuesValue: 'Traditional' | 'Moderate' | 'Liberal' =
    formData.familyValues === 'Liberal' ? 'Liberal' : formData.familyValues === 'Traditional' ? 'Traditional' : 'Moderate';

  return {
    id: profileId || 'my_profile',
    name: formData.name || '',
    age: age || 0,
    gender: (formData.gender as any) || '',
    height: formData.heightCm ? cmToFeetInches(formData.heightCm) : '',
    city: formData.currentAddress ? formData.currentAddress.split(',')[0].trim() : '',
    state: formData.currentAddress && formData.currentAddress.includes(',') ? formData.currentAddress.split(',')[1].trim() : '',
    location: formData.currentAddress || '',
    profileImage: formData.profilePictureUrl || '',
    originalProfileImage: formData.originalProfilePictureUrl || '',
    photoFilter: formData.profilePhotoFilter || 'normal',
    additionalPhotos: formData.galleryPictures && formData.galleryPictures.length > 0 ? formData.galleryPictures : [],
    profession: formData.occupation || formData.designation || '',
    company: formData.company || '',
    education: eduStr,
    college: collegeStr,
    annualIncome: formData.salaryRange || formData.income || '',
    religion: formData.religion || '',
    community: formData.caste ? (formData.subCaste ? `${formData.caste} (${formData.subCaste})` : formData.caste) : '',
    motherTongue: (formData.languagesKnown && formData.languagesKnown[0]) || '',
    maritalStatus: (formData.maritalStatus as any) || '',
    familyType: familyTypeValue,
    familyValues: familyValuesValue,
    fatherName: formData.fatherName || '',
    fatherOccupation: formData.fatherOccupation || '',
    motherName: formData.motherName || '',
    motherOccupation: formData.motherOccupation || '',
    siblings: formData.brotherCount || formData.sisterCount ? `${formData.brotherCount || 0} Brother(s), ${formData.sisterCount || 0} Sister(s)` : formData.siblings || '',
    nativePlace: formData.nativePlace || '',
    diet: (formData.diet as any) || 'Vegetarian',
    smoking: (formData.smoking === 'Yes' ? 'Yes' : 'No') as any,
    drinking: (formData.drinking === 'Frequently' ? 'Frequently' : formData.drinking === 'Socially' ? 'Socially' : 'No') as any,
    fitness: '',
    travel: '',
    personality: formData.skills && formData.skills.length > 0 ? formData.skills.slice(0, 4) : [],
    interests: formData.hobbies && formData.hobbies.length > 0 ? formData.hobbies : [],
    aboutMe: formData.professionalSummary || '',
    marriageExpectations: formData.otherPreferences || formData.expectedProfession || '',
    marriageTimeline: undefined,
    workingPartnerPreference: undefined,
    childrenPreference: undefined,
    phone: formData.contactTo || formData.contactNumber || formData.phone || '',
    contactTo: formData.contactTo || '',
    contact_to: formData.contactTo || '',
    email: formData.email || '',
    contactNumber: formData.contactTo || formData.contactNumber || formData.phone || '',
    verification: {
      mobileVerified: Boolean(formData.contactVerified || formData.verifiedPhone),
      emailVerified: Boolean(formData.emailVerified || formData.verifiedEmail),
      idVerified: false,
      profileComplete: false,
    },
    profileCompletion: calculateCompletionScore(formData),
    publishedAt: new Date().toISOString(),
  };
};

export const convertPublicProfileToDetailedProfile = (p: any): DetailedProfile => {
  return {
    id: p.id || '',
    slug: p.slug || '',
    name: p.display_name || p.name || 'Candidate',
    age: p.age || 0,
    gender: (p.gender as any) || 'Female',
    height: p.height || '',
    city: p.city || p.current_city || '',
    state: p.state || '',
    location: p.city && p.state ? `${p.city}, ${p.state}` : (p.city || p.state || ''),
    profileImage: p.profile_picture_url || '',
    originalProfileImage: p.original_profile_picture_url || p.originalProfilePictureUrl || '',
    photoFilter: p.photo_filter || p.profilePhotoFilter || 'normal',
    additionalPhotos: p.additional_photos || p.galleryPictures || [],
    profession: p.occupation || '',
    company: p.company || '',
    education: p.education || '',
    annualIncome: p.annual_income || '',
    religion: p.religion || '',
    community: p.caste || '',
    motherTongue: p.mother_tongue || '',
    maritalStatus: (p.marital_status as any) || 'Never Married',
    familyType: (p.family_type as any) || 'Nuclear Family',
    familyValues: (p.family_values as any) || 'Moderate',
    fatherName: p.father_name || '',
    fatherOccupation: p.father_occupation || '',
    motherName: p.mother_name || '',
    motherOccupation: p.mother_occupation || '',
    siblings: p.siblings || (p.brothers || p.sisters ? `${p.brothers || 0} Brother(s), ${p.sisters || 0} Sister(s)` : ''),
    nativePlace: p.native_place || '',
    diet: (p.diet as any) || 'Vegetarian',
    smoking: (p.smoking as any) || 'No',
    drinking: (p.drinking as any) || 'No',
    personality: Array.isArray(p.personality) ? p.personality : [],
    interests: Array.isArray(p.interests) ? p.interests : [],
    aboutMe: p.about_me || p.professional_summary || '',
    marriageExpectations: p.partner_expectations || '',
    marriageTimeline: p.marriage_timeline,
    workingPartnerPreference: p.working_partner_preference,
    childrenPreference: p.children_preference,
    contactTo: p.contactTo || p.contact_to || p.contact_details?.contact_to || p.contactDetails?.contact_to || '',
    contact_to: p.contact_to || p.contactTo || p.contact_details?.contact_to || p.contactDetails?.contact_to || '',
    phone: p.contactTo || p.contact_to || p.contact_details?.contact_to || p.contactDetails?.contact_to || p.phone || p.contact_number || p.contact_details?.phone || p.contactDetails?.phone || '',
    email: p.email || p.contact_details?.email || p.contactDetails?.email || '',
    contactNumber: p.contactTo || p.contact_to || p.contact_details?.contact_to || p.contactDetails?.contact_to || p.contact_number || p.phone || '',
    hideContactDetails: p.hide_contact_details ?? p.hideContactDetails ?? false,
    contactDetails: p.contact_details || p.contactDetails || null,
    verification: {
      mobileVerified: true,
      emailVerified: true,
      idVerified: Boolean(p.verified ?? true),
      profileComplete: true,
    },
    profileCompletion: 95,
    publishedAt: p.published_at || new Date().toISOString(),
  };
};

export const formatBiodataShareText = (formData: BiodataForm, shareUrl?: string): string => {
  const name = formData.name?.trim() || 'Candidate';
  const lines: string[] = [];

  lines.push(`✨ *Matrimonial Biodata of ${name}* ✨`);
  lines.push(`━━━━━━━━━━━━━━━━━━━━━`);

  // Personal
  const personalDetails: string[] = [];
  if (formData.gender) personalDetails.push(`👤 Gender: ${formData.gender}`);
  const age = formData.age || (formData.dob ? calculateAge(formData.dob) : 0);
  if (age > 0) personalDetails.push(`🎂 Age: ${age} yrs`);
  if (formData.heightCm) personalDetails.push(`📏 Height: ${cmToFeetInches(formData.heightCm)}`);
  if (formData.maritalStatus) personalDetails.push(`💍 Marital Status: ${formData.maritalStatus}`);
  
  const communityParts = [formData.religion, formData.caste, formData.subCaste ? `(${formData.subCaste})` : ''].filter(Boolean);
  if (communityParts.length > 0) {
    personalDetails.push(`🕊️ Community: ${communityParts.join(' - ')}`);
  }
  if (formData.nativePlace) personalDetails.push(`📍 Native Place: ${formData.nativePlace}`);
  if (formData.currentAddress) personalDetails.push(`🏠 Location: ${formData.currentAddress}`);

  if (personalDetails.length > 0) {
    lines.push(personalDetails.join('\n'));
  }

  // Education & Career
  const careerDetails: string[] = [];
  const topEdu = formData.educationList?.[0];
  const eduStr = topEdu ? [topEdu.degree || topEdu.qualification, topEdu.college || topEdu.university].filter(Boolean).join(', ') : '';
  if (eduStr) careerDetails.push(`🎓 Education: ${eduStr}`);
  if (formData.occupation) careerDetails.push(`💼 Profession: ${formData.occupation}${formData.company ? ` at ${formData.company}` : ''}`);
  if (formData.salaryRange || formData.income) careerDetails.push(`💰 Income: ${formData.salaryRange || formData.income}`);

  if (careerDetails.length > 0) {
    lines.push(`\n📚 *Education & Career*`);
    lines.push(careerDetails.join('\n'));
  }

  // Family Details
  const familyDetails: string[] = [];
  if (formData.fatherName) familyDetails.push(`👨 Father: ${formData.fatherName}${formData.fatherOccupation ? ` (${formData.fatherOccupation})` : ''}`);
  if (formData.motherName) familyDetails.push(`👩 Mother: ${formData.motherName}${formData.motherOccupation ? ` (${formData.motherOccupation})` : ''}`);
  if (formData.brotherCount || formData.sisterCount) {
    const sibs: string[] = [];
    if (formData.brotherCount) sibs.push(`${formData.brotherCount} Brother(s)`);
    if (formData.sisterCount) sibs.push(`${formData.sisterCount} Sister(s)`);
    familyDetails.push(`👥 Siblings: ${sibs.join(', ')}`);
  }
  if (familyDetails.length > 0) {
    lines.push(`\n👨‍👩‍👧‍👦 *Family Background*`);
    lines.push(familyDetails.join('\n'));
  }

  // Contact
  const contactDetails: string[] = [];
  if (formData.contactNumber) contactDetails.push(`📞 Contact: ${formData.contactNumber}`);
  if (formData.email) contactDetails.push(`✉️ Email: ${formData.email}`);

  if (contactDetails.length > 0) {
    lines.push(`\n📲 *Contact Details*`);
    lines.push(contactDetails.join('\n'));
  }

  if (shareUrl) {
    lines.push(`\n🔗 View Verified Profile: ${shareUrl}`);
  }

  lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`_Shared via TrueMarriage_`);

  return lines.join('\n');
};


