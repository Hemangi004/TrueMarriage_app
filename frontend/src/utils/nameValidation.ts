import { isValidCity } from '../data/indianCities';

export const MIN_NAME_LENGTH = 3;
export const MAX_NAME_LENGTH = 50;
export const MAX_ABOUT_LENGTH = 500;

export interface NameValidationResult {
  isValid: boolean;
  error: string | null;
}

export const validateFullName = (name: string): NameValidationResult => {
  if (!name || !name.trim()) {
    return { isValid: false, error: 'Please enter your full name.' };
  }

  const trimmed = name.trim();

  if (trimmed.length < MIN_NAME_LENGTH) {
    return { isValid: false, error: `Full Name must be at least ${MIN_NAME_LENGTH} characters long.` };
  }

  if (trimmed.length > MAX_NAME_LENGTH) {
    return { isValid: false, error: `Full Name cannot exceed ${MAX_NAME_LENGTH} characters.` };
  }

  if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) {
    return { isValid: false, error: 'Full Name can only contain alphabetic characters and spaces.' };
  }

  const lettersOnly = trimmed.replace(/[^a-zA-Z]/g, '');
  if (lettersOnly.length < MIN_NAME_LENGTH) {
    return { isValid: false, error: `Full Name must contain at least ${MIN_NAME_LENGTH} letters.` };
  }

  return { isValid: true, error: null };
};

export const validateAboutMe = (about?: string | null): NameValidationResult => {
  if (!about || !about.trim()) {
    return { isValid: true, error: null };
  }

  const trimmed = about.trim();

  if (trimmed.length > MAX_ABOUT_LENGTH) {
    return { isValid: false, error: `About field cannot exceed ${MAX_ABOUT_LENGTH} characters (current: ${trimmed.length}).` };
  }

  return { isValid: true, error: null };
};

export const validatePlaceOfBirth = (place?: string | null): NameValidationResult => {
  if (!place || !place.trim()) {
    return { isValid: true, error: null };
  }

  const trimmed = place.trim();

  if (trimmed.length < 2) {
    return { isValid: false, error: 'Place of Birth must be at least 2 characters.' };
  }

  if (trimmed.length > 50) {
    return { isValid: false, error: 'Place of Birth cannot exceed 50 characters.' };
  }

  if (/\d/.test(trimmed)) {
    return { isValid: false, error: 'Place of Birth cannot contain numbers (letters only).' };
  }

  if (!isValidCity(trimmed)) {
    return { isValid: false, error: 'Please enter a valid city, town, or village name.' };
  }

  return { isValid: true, error: null };
};

export const validateDegreeName = (degree?: string | null): NameValidationResult => {
  if (!degree || !degree.trim()) {
    return { isValid: false, error: 'Please enter or select a Degree/Specialization.' };
  }

  const trimmed = degree.trim();

  if (trimmed.length > 100) {
    return { isValid: false, error: 'Degree / Specialization cannot exceed 100 characters.' };
  }

  if (/^\d+$/.test(trimmed)) {
    return { isValid: false, error: 'Degree / Specialization cannot be numbers only.' };
  }

  const letters = trimmed.match(/[a-zA-Z\u0900-\u0D7F]/g);
  if (!letters || letters.length < 2) {
    return { isValid: false, error: 'Please enter a valid Degree/Specialization containing letters.' };
  }

  return { isValid: true, error: null };
};

export const validateCollegeName = (college?: string | null): NameValidationResult => {
  if (!college || !college.trim()) {
    return { isValid: true, error: null };
  }

  const trimmed = college.trim();

  if (trimmed.length > 100) {
    return { isValid: false, error: 'College / Institute name cannot exceed 100 characters.' };
  }

  if (/^\d+$/.test(trimmed)) {
    return { isValid: false, error: 'College / Institute name cannot be numbers only.' };
  }

  const letters = trimmed.match(/[a-zA-Z\u0900-\u0D7F]/g);
  if (!letters || letters.length < 2) {
    return { isValid: false, error: 'Please enter a valid College / Institute name containing letters.' };
  }

  return { isValid: true, error: null };
};

export const validateOccupation = (occupation?: string | null): NameValidationResult => {
  if (!occupation || !occupation.trim()) {
    return { isValid: true, error: null };
  }

  const trimmed = occupation.trim();

  if (trimmed.length > 100) {
    return { isValid: false, error: 'Occupation / Profession cannot exceed 100 characters.' };
  }

  if (/^\d+$/.test(trimmed)) {
    return { isValid: false, error: 'Occupation / Profession cannot be numbers only.' };
  }

  const letters = trimmed.match(/[a-zA-Z\u0900-\u0D7F]/g);
  if (!letters || letters.length < 2) {
    return { isValid: false, error: 'Please enter a valid Occupation / Profession containing letters.' };
  }

  return { isValid: true, error: null };
};

export const validateCompany = (company?: string | null): NameValidationResult => {
  if (!company || !company.trim()) {
    return { isValid: true, error: null };
  }

  const trimmed = company.trim();

  if (trimmed.length > 100) {
    return { isValid: false, error: 'Company / Employer name cannot exceed 100 characters.' };
  }

  if (/^\d+$/.test(trimmed)) {
    return { isValid: false, error: 'Company / Employer name cannot be numbers only.' };
  }

  const letters = trimmed.match(/[a-zA-Z\u0900-\u0D7F]/g);
  if (!letters || letters.length < 2) {
    return { isValid: false, error: 'Please enter a valid Company / Employer name containing letters.' };
  }

  return { isValid: true, error: null };
};

export const validateFamilyOccupation = (occupation?: string | null, label: string = "Occupation"): NameValidationResult => {
  if (!occupation || !occupation.trim()) {
    return { isValid: true, error: null };
  }

  const trimmed = occupation.trim();

  if (trimmed.length > 100) {
    return { isValid: false, error: `${label} cannot exceed 100 characters.` };
  }

  if (/^\d+$/.test(trimmed)) {
    return { isValid: false, error: `${label} cannot be numbers only.` };
  }

  const letters = trimmed.match(/[a-zA-Z\u0900-\u0D7F]/g);
  if (!letters || letters.length < 2) {
    return { isValid: false, error: `Please enter a valid ${label} containing letters.` };
  }

  return { isValid: true, error: null };
};

export const validateMaternalUncle = (name?: string | null): NameValidationResult => {
  if (!name || !name.trim()) {
    return { isValid: true, error: null };
  }

  const trimmed = name.trim();

  if (trimmed.length > 100) {
    return { isValid: false, error: "Maternal Uncle's name cannot exceed 100 characters." };
  }

  if (/\d/.test(trimmed)) {
    return { isValid: false, error: "Maternal Uncle's name should contain letters only (numbers are not allowed)" };
  }

  if (!/^[A-Za-z\u0900-\u0D7F\s\-\'\,\.\/\(\)]+$/.test(trimmed)) {
    return { isValid: false, error: "Maternal Uncle's name should contain valid letters only" };
  }

  const letters = trimmed.match(/[a-zA-Z\u0900-\u0D7F]/g);
  if (!letters || letters.length < 2) {
    return { isValid: false, error: "Maternal Uncle's name must contain at least 2 letters." };
  }

  return { isValid: true, error: null };
};

export const validateNativePlace = (place?: string | null): NameValidationResult => {
  if (!place || !place.trim()) {
    return { isValid: true, error: null };
  }

  const trimmed = place.trim();

  if (trimmed.length < 2) {
    return { isValid: false, error: 'Native Place must be at least 2 characters.' };
  }

  if (trimmed.length > 50) {
    return { isValid: false, error: 'Native Place cannot exceed 50 characters.' };
  }

  if (/\d/.test(trimmed)) {
    return { isValid: false, error: 'Native Place cannot contain numbers (letters only).' };
  }

  if (!isValidCity(trimmed)) {
    return { isValid: false, error: 'Please enter a valid city, town, or village name.' };
  }

  return { isValid: true, error: null };
};

export const validateGeneralText = (text?: string | null, label: string = 'Field', maxLength: number = 100): NameValidationResult => {
  if (!text || !text.trim()) {
    return { isValid: true, error: null };
  }

  const trimmed = text.trim();

  if (maxLength && trimmed.length > maxLength) {
    return { isValid: false, error: `${label} cannot exceed ${maxLength} characters.` };
  }

  if (/^\d+$/.test(trimmed)) {
    return { isValid: false, error: `${label} cannot be numbers only.` };
  }

  const letters = trimmed.match(/[a-zA-Z\u0900-\u0D7F]/g);
  if (!letters || letters.length < 2) {
    return { isValid: false, error: `Please enter a valid ${label} containing letters.` };
  }

  return { isValid: true, error: null };
};

export const validateRelations = (relations?: string | null): NameValidationResult => {
  if (!relations || !relations.trim()) {
    return { isValid: true, error: null };
  }

  const trimmed = relations.trim();

  if (trimmed.length > 250) {
    return { isValid: false, error: 'Relations / Notable Relatives cannot exceed 250 characters.' };
  }

  if (/\d/.test(trimmed)) {
    return { isValid: false, error: 'Relations / Notable Relatives should contain letters only (numbers are not allowed)' };
  }

  if (!/^[A-Za-z\u0900-\u0D7F\s\-\'\,\.\/\(\)\&\;\—\–]+$/.test(trimmed)) {
    return { isValid: false, error: 'Relations / Notable Relatives should contain valid letters and punctuation only' };
  }

  const letters = trimmed.match(/[a-zA-Z\u0900-\u0D7F]/g);
  if (!letters || letters.length < 2) {
    return { isValid: false, error: 'Relations / Notable Relatives must contain at least 2 letters.' };
  }

  return { isValid: true, error: null };
};

export const validateHobbyName = (text?: string | null): NameValidationResult => {
  if (!text || !text.trim()) {
    return { isValid: false, error: 'Please enter a hobby name.' };
  }

  const trimmed = text.trim();

  if (trimmed.length > 50) {
    return { isValid: false, error: 'Hobby name cannot exceed 50 characters.' };
  }

  if (/\d/.test(trimmed)) {
    return { isValid: false, error: 'Hobby name should contain only alphabets.' };
  }

  if (/[<>\\="`{};:()\[\]{}%+\?@#$*~^|]/.test(trimmed) || /[^A-Za-z\u0900-\u0D7F\s\-\&]/.test(trimmed)) {
    return { isValid: false, error: 'Hobby name should contain only alphabets.' };
  }

  const disallowedKeywords = /^(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|WHERE|FROM|EXEC|ALTER|CREATE|TRUNCATE|SCRIPT|JAVASCRIPT|ALERT|TABLE|DATABASE|HTML|BODY|IFRAME|DIV|SPAN|IMG|SVG|ONERROR|ONLOAD|ONCLICK|EVAL|FETCH|DOCUMENT|WINDOW|PROMPT|CONFIRM)$/i;
  const words = trimmed.split(/[\s-]+/);
  if (words.some((w) => disallowedKeywords.test(w))) {
    return { isValid: false, error: 'Please enter a valid hobby name.' };
  }

  const letters = trimmed.match(/[a-zA-Z\u0900-\u0D7F]/g);
  if (!letters || letters.length < 2) {
    return { isValid: false, error: 'Hobby name must contain at least 2 letters.' };
  }

  return { isValid: true, error: null };
};

export const validateLanguageName = (text?: string | null): NameValidationResult => {
  if (!text || !text.trim()) {
    return { isValid: false, error: 'Please enter a language name.' };
  }

  const trimmed = text.trim();

  if (trimmed.length > 50) {
    return { isValid: false, error: 'Language name cannot exceed 50 characters.' };
  }

  if (/\d/.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid language name. Numbers and special characters are not allowed.' };
  }

  if (/[<>&\/\\="'`{};:()\[\]{}%+\?@#$*~^|]/.test(trimmed) || /[^A-Za-z\u0900-\u0D7F\s\-]/.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid language name. Numbers and special characters are not allowed.' };
  }

  if (!/^[A-Za-z\u0900-\u0D7F]+([ -][A-Za-z\u0900-\u0D7F]+)*$/.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid language name.' };
  }

  const disallowedKeywords = /^(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|WHERE|FROM|EXEC|ALTER|CREATE|TRUNCATE|SCRIPT|JAVASCRIPT|ALERT|TABLE|DATABASE|HTML|BODY|IFRAME|DIV|SPAN|IMG|SVG|ONERROR|ONLOAD|ONCLICK|EVAL|FETCH|DOCUMENT|WINDOW|PROMPT|CONFIRM)$/i;
  const words = trimmed.split(/[\s-]+/);
  if (words.some((w) => disallowedKeywords.test(w))) {
    return { isValid: false, error: 'Please enter a valid language name.' };
  }

  const letters = trimmed.match(/[a-zA-Z\u0900-\u0D7F]/g);
  if (!letters || letters.length < 2) {
    return { isValid: false, error: 'Language name must contain at least 2 letters.' };
  }

  return { isValid: true, error: null };
};

export const KNOWN_HOBBY_NAMES = [
  'Reading', 'Traveling', 'Travel', 'Cooking', 'Music & Guitar', 'Music', 'Guitar',
  'Fitness & Yoga', 'Fitness', 'Yoga', 'Photography', 'Trekking', 'Gaming',
  'Painting & Art', 'Painting', 'Art', 'Dancing', 'Dance', 'Watching Movies', 'Movies',
  'Gardening', 'Swimming', 'Coding', 'Writing', 'Sports', 'Gym', 'Meditation',
  'Cricket', 'Badminton', 'Football', 'Singing', 'Baking', 'Cycling', 'Hiking',
  'Chess', 'Astronomy', 'Pottery', 'Classical Dance'
];

/**
 * Splits a single hobby string that may contain multiple hobbies (separated by commas,
 * slashes, semicolons, "and", or space-separated known popular hobbies) into individual hobbies.
 */
export const splitHobbiesString = (input: string): string[] => {
  if (!input || !input.trim()) return [];

  // 1. Split by common delimiters: comma, semicolon, slash, pipe, newline
  const rawSegments = input.split(/[,;\n\r/|]+/);
  const result: string[] = [];

  for (const seg of rawSegments) {
    const trimmed = seg.trim();
    if (!trimmed) continue;

    // Check if the segment contains ' and ' between hobbies (e.g. 'Reading and Dancing')
    if (/\s+and\s+/i.test(trimmed) && !/&/i.test(trimmed)) {
      const andParts = trimmed.split(/\s+and\s+/i);
      for (const part of andParts) {
        const pt = part.trim();
        if (pt) result.push(pt);
      }
      continue;
    }

    // Check if segment is multiple space-separated known hobbies (e.g. "Reading Dancing Photography")
    // Compound hobbies like "Music & Guitar", "Fitness & Yoga", "Watching Movies", "Painting & Art", "Classical Dance"
    const knownCompound = ['Music & Guitar', 'Fitness & Yoga', 'Watching Movies', 'Painting & Art', 'Classical Dance'];
    const isKnownCompound = knownCompound.some(k => k.toLowerCase() === trimmed.toLowerCase());

    if (!isKnownCompound && trimmed.includes(' ')) {
      const words = trimmed.split(/\s+/);
      const matchedHobbies: string[] = [];
      let allWordsMatched = true;

      for (const w of words) {
        const match = KNOWN_HOBBY_NAMES.find(k => k.toLowerCase() === w.toLowerCase());
        if (match) {
          matchedHobbies.push(match);
        } else {
          allWordsMatched = false;
          break;
        }
      }

      if (allWordsMatched && matchedHobbies.length > 1) {
        result.push(...matchedHobbies);
        continue;
      }
    }

    result.push(trimmed);
  }

  return result;
};

/**
 * Normalizes an array of hobbies: splits any combined strings, trims,
 * filters empty values, and deduplicates case-insensitively.
 */
export const normalizeHobbiesList = (hobbies?: string[] | string | null): string[] => {
  if (!hobbies) return [];
  const rawList = Array.isArray(hobbies) ? hobbies : [hobbies];
  const flattened: string[] = [];

  for (const item of rawList) {
    if (typeof item === 'string') {
      flattened.push(...splitHobbiesString(item));
    }
  }

  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const h of flattened) {
    const trimmed = h.trim();
    if (!trimmed) continue;
    const check = validateHobbyName(trimmed);
    if (!check.isValid) continue;
    const lower = trimmed.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      const knownMatch = KNOWN_HOBBY_NAMES.find(k => k.toLowerCase() === lower);
      normalized.push(knownMatch || trimmed);
    }
  }

  return normalized;
};

export const POPULAR_LANGUAGES = [
  'English',
  'Hindi',
  'Marathi',
  'Gujarati',
  'Bengali',
  'Tamil',
  'Telugu',
  'Kannada',
  'Malayalam',
  'Punjabi',
  'Odia',
  'Assamese',
  'Urdu',
];

export const LANGUAGE_NAME_MAX_LENGTH = 50;

/**
 * Normalizes an array of languages: trims, enforces maximum length of 50 chars,
 * deduplicates case-insensitively, and canonicalizes to proper casing from POPULAR_LANGUAGES if matched.
 */
export const normalizeLanguagesList = (languages?: (string | null | undefined)[] | string | null): string[] => {
  if (!languages) return [];
  const rawList = Array.isArray(languages) ? languages : [languages];
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const item of rawList) {
    if (typeof item !== 'string') continue;
    let trimmed = item.trim();
    if (!trimmed) continue;
    if (trimmed.length > LANGUAGE_NAME_MAX_LENGTH) {
      trimmed = trimmed.slice(0, LANGUAGE_NAME_MAX_LENGTH).trim();
    }
    const check = validateLanguageName(trimmed);
    if (!check.isValid) continue;
    const lower = trimmed.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      const knownMatch = POPULAR_LANGUAGES.find((k) => k.toLowerCase() === lower);
      normalized.push(knownMatch || trimmed);
    }
  }

  return normalized;
};

/**
 * Validates partner expected age range (Min and Max).
 * Requires Maximum age to be strictly greater than Minimum age when both are provided.
 */
export const validateExpectedAgeRange = (
  min?: number | string | null,
  max?: number | string | null
): NameValidationResult => {
  const hasMin = min !== undefined && min !== null && min !== '' && !isNaN(Number(min)) && Number(min) > 0;
  const hasMax = max !== undefined && max !== null && max !== '' && !isNaN(Number(max)) && Number(max) > 0;

  if (hasMin) {
    const numMin = Number(min);
    if (numMin < 18 || numMin > 80) {
      return { isValid: false, error: 'Minimum age must be between 18 and 80.' };
    }
  }

  if (hasMax) {
    const numMax = Number(max);
    if (numMax < 18 || numMax > 80) {
      return { isValid: false, error: 'Maximum age must be between 18 and 80.' };
    }
  }

  if (hasMin && hasMax) {
    const numMin = Number(min);
    const numMax = Number(max);
    if (numMax <= numMin) {
      return { isValid: false, error: 'Maximum age must be greater than minimum age.' };
    }
  }

  return { isValid: true, error: null };
};

/**
 * Validates candidate date of birth.
 * Enforces minimum legal marriage age (21 for males, 18 for females/others)
 * and strictly rejects current/future/infant birth dates.
 */
export const validateDateOfBirth = (
  dobString?: string | null,
  gender?: string | null
): NameValidationResult => {
  if (!dobString || !dobString.trim()) {
    return { isValid: false, error: 'Please enter your date of birth.' };
  }

  const trimmed = dobString.trim();
  const dateObj = new Date(trimmed);
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: 'Please enter a valid date of birth.' };
  }

  const now = new Date();
  // Strip hours for pure date comparison
  const todayZero = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dobZero = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());

  if (dobZero >= todayZero) {
    return { isValid: false, error: 'Date of birth cannot be today or in the future.' };
  }

  const isMale = String(gender || '').toLowerCase() === 'male';
  const minLegalAge = isMale ? 21 : 18;

  // Calculate age accurately
  let age = todayZero.getFullYear() - dobZero.getFullYear();
  const monthDiff = todayZero.getMonth() - dobZero.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && todayZero.getDate() < dobZero.getDate())) {
    age--;
  }

  if (age < minLegalAge) {
    return {
      isValid: false,
      error: isMale
        ? `Minimum legal marriage age for males is 21 years (calculated age: ${age} years).`
        : `Minimum legal marriage age for females is 18 years (calculated age: ${age} years).`,
    };
  }

  if (age > 100) {
    return { isValid: false, error: 'Please enter a valid date of birth.' };
  }

  return { isValid: true, error: null };
};

