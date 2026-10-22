import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { BiodataForm, StepId } from '../types/biodata';
import type { ProfileModerationStatus } from '../types/adminProfile';
import { initialBiodataForm, getInitialBiodataForm, calculateCompletionScore } from '../utils/biodataHelpers';
import { saveBiodataApi, sendOtpApi, getMyBiodataApi, publishBiodataApi, verifyPhotoApi } from '../services/apiService';
import { isDisposableEmail, COMMON_EMAIL_ERROR_MSG } from '../utils/disposableEmail';
import {
  validateFullName,
  validatePlaceOfBirth,
  validateOccupation,
  validateCompany,
  validateFamilyOccupation,
  validateMaternalUncle,
  validateRelations,
  validateNativePlace,
  validateGeneralText,
  validateDegreeName,
  validateCollegeName,
  validateLanguageName,
  validateHobbyName,
  normalizeHobbiesList,
  normalizeLanguagesList,
  validateDateOfBirth,
} from '../utils/nameValidation';
import { validateMobileNumber } from '../utils/phoneValidation';
import { useAuth } from './AuthContext';
import { AlertTriangle, X } from 'lucide-react';

export const TOTAL_QUESTIONS = 25;

export type AppPage =
  | 'landing'
  | 'profile'
  | 'wizard'
  | 'studio'
  | 'admin'
  | 'discovery'
  | 'interactions'
  | 'templates'
  | 'about-us'
  | 'about-me'
  | 'team';

interface BiodataContextType {
  formData: BiodataForm;
  updateFormData: (fields: Partial<BiodataForm>) => void;
  resetFormData: () => void;
  
  // Page Navigation
  currentPage: AppPage;
  goToLanding: () => void;
  goToProfile: () => void;
  goToStudio: () => void;
  goToWizard: (templateId?: string) => void;
  jumpToQuestionAndWizard: (questionIdx: number) => void;
  wizardCompleted: boolean;
  markWizardComplete: () => Promise<void> | void;
  goToAdmin: () => void;
  goToDiscovery: () => void;
  goToInteractions: () => void;
  goToTemplates: () => void;

  // Moderation Metadata
  moderationStatus: ProfileModerationStatus | string;
  rejectionReason: string | null;
  profileId: string | null;
  slug: string | null;
  fetchMyBiodata: () => Promise<boolean | void>;
  submitForModeration: () => Promise<{ success: boolean; message: string }>;

  // Question Wizard Navigation State
  questionIndex: number;
  setQuestionIndex: (idx: number) => void;
  slideDirection: number; // 1 for forward, -1 for backward
  goToNextQuestion: () => Promise<boolean>;
  goToPrevQuestion: () => void;
  skipQuestion: () => void;
  isNavigating: boolean;
  checkStepValidity: (idx: number, data?: BiodataForm) => { isValid: boolean; error: string | null };
  
  // Inline Validation
  validationError: string | null;
  setValidationError: (err: string | null) => void;

  // Legacy Step Compatibility
  currentStep: StepId;
  setCurrentStep: (step: StepId) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  
  // Analytics & Completion
  completionScore: number;
  lastSavedTime: string;

  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  // OTP Verification Modal
  otpModal: {
    isOpen: boolean;
    type: 'phone' | 'email' | null;
    targetValue: string;
    alreadyDispatched?: boolean;
  };
  openOtpModal: (type: 'phone' | 'email', targetValue: string, autoSend?: boolean) => void;
  closeOtpModal: () => void;
  verifyOtpSuccess: () => void;

  // AI Assistant Modal
  aiModal: {
    isOpen: boolean;
    type: 'summary' | 'hobbies' | 'expectations' | null;
  };
  openAiModal: (type: 'summary' | 'hobbies' | 'expectations') => void;
  closeAiModal: () => void;
  applyAiSuggestion: (value: string | string[]) => void;

  // Cropper Modal
  cropModalOpen: boolean;
  setCropModalOpen: (open: boolean) => void;
  tempImageSrc: string | null;
  setTempImageSrc: (src: string | null) => void;
  cropCallback: ((croppedUrl: string, originalUrl?: string, filterId?: string) => void) | null;
  setCropCallback: (cb: ((croppedUrl: string, originalUrl?: string, filterId?: string) => void) | null) => void;
  activeFilterId: string | null;
  setActiveFilterId: (id: string | null) => void;
  openCropper: (
    src: string,
    onComplete?: (croppedUrl: string, originalUrl?: string, filterId?: string) => void,
    rawSource?: string,
    initialFilter?: string
  ) => void;
  
  // Platform Guidelines Alert
  guidelineAlert: { message: string; type?: 'error' | 'info' | 'success' } | null;
  showGuidelineAlert: (message: string, type?: 'error' | 'info' | 'success', duration?: number) => void;

  // Steps completion tracker
  completedSteps: Set<StepId>;
}

const BiodataContext = createContext<BiodataContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'soul_sync_biodata_form_v1';
const WIZARD_QUESTION_INDEX_KEY = 'soul_sync_wizard_question_index';
const WIZARD_STEP_KEY = 'soul_sync_wizard_step';
const WIZARD_COMPLETED_KEY = 'truemarriage_wizard_completed';

const getBiodataStorageKey = (userId?: string | null) => {
  if (userId) return `soul_sync_biodata_user_${userId}_v1`;
  return 'soul_sync_biodata_guest_v1';
};

const getWizardQuestionIndexKey = (userId?: string | null) => {
  if (userId) return `soul_sync_wizard_q_${userId}`;
  return 'soul_sync_wizard_q_guest';
};

const getWizardStepKey = (userId?: string | null) => {
  if (userId) return `soul_sync_wizard_step_${userId}`;
  return 'soul_sync_wizard_step_guest';
};

const getWizardCompletedKey = (userId?: string | null) => {
  if (userId) return `truemarriage_wizard_completed_${userId}`;
  return 'truemarriage_wizard_completed_guest';
};

export const checkStepValidity = (idx: number, data: BiodataForm): { isValid: boolean; error: string | null } => {
  switch (idx) {
    case 1: {
      const nameCheck = validateFullName(data.name || '');
      if (!nameCheck.isValid) {
        return { isValid: false, error: nameCheck.error };
      }
      break;
    }
    case 2:
      if (!data.gender) {
        return { isValid: false, error: 'Please select your gender' };
      }
      break;
    case 3: {
      const dobCheck = validateDateOfBirth(data.dob, data.gender);
      if (!dobCheck.isValid) {
        return { isValid: false, error: dobCheck.error };
      }
      break;
    }
    case 4: {
      const pob = (data.placeOfBirth || '').trim();
      if (pob) {
        const pobCheck = validatePlaceOfBirth(pob);
        if (!pobCheck.isValid) {
          return { isValid: false, error: pobCheck.error };
        }
      }
      break;
    }
    case 5: {
      const rel = (data.religion || '').trim();
      if (rel && (/\d/.test(rel) || !/^[A-Za-z\u0900-\u0D7F\s\-\'\,\.\/\(\)]+$/.test(rel))) {
        return { isValid: false, error: 'Religion contains invalid characters' };
      }
      break;
    }
    case 6: {
      const caste = (data.caste || '').trim();
      const subCaste = (data.subCaste || '').trim();
      if (caste && (/\d/.test(caste) || !/^[A-Za-z\u0900-\u0D7F\s\-\'\/\(\)\.\,]+$/.test(caste))) {
        return { isValid: false, error: 'Caste contains invalid characters' };
      }
      if (subCaste && (/\d/.test(subCaste) || !/^[A-Za-z\u0900-\u0D7F\s\-\'\/\(\)\.\,]+$/.test(subCaste))) {
        return { isValid: false, error: 'Sub-caste contains invalid characters' };
      }
      break;
    }
    case 7: {
      const gotra = (data.gotra || '').trim();
      const kuldevata = (data.kuldevata || '').trim();
      if (gotra && (/\d/.test(gotra) || !/^[A-Za-z\u0900-\u0D7F\s\-\'\,\.\/\(\)]+$/.test(gotra))) {
        return { isValid: false, error: 'Gotra contains invalid characters' };
      }
      if (kuldevata && (/\d/.test(kuldevata) || !/^[A-Za-z\u0900-\u0D7F\s\-\'\,\.\/\(\)]+$/.test(kuldevata))) {
        return { isValid: false, error: 'Kuldevata contains invalid characters' };
      }
      break;
    }
    case 11: {
      const eduList = data.educationList || [];
      for (const item of eduList) {
        const deg = (item.degree || item.qualification || '').trim();
        const col = (item.college || '').trim();
        if (deg) {
          const degCheck = validateDegreeName(deg);
          if (!degCheck.isValid) return { isValid: false, error: degCheck.error };
        }
        if (col) {
          const colCheck = validateCollegeName(col);
          if (!colCheck.isValid) return { isValid: false, error: colCheck.error };
        }
      }
      break;
    }
    case 12: {
      const occ = (data.occupation || '').trim();
      const comp = (data.company || '').trim();
      if (occ) {
        const occCheck = validateOccupation(occ);
        if (!occCheck.isValid) return { isValid: false, error: occCheck.error };
      }
      if (comp) {
        const compCheck = validateCompany(comp);
        if (!compCheck.isValid) return { isValid: false, error: compCheck.error };
      }
      break;
    }
    case 13: {
      const fName = (data.fatherName || '').trim();
      const mName = (data.motherName || '').trim();
      const fOcc = (data.fatherOccupation || '').trim();
      const mOcc = (data.motherOccupation || '').trim();
      if (fName && (/\d/.test(fName) || !/^[A-Za-z\u0900-\u0D7F\s\-\'\.]+$/.test(fName))) {
        return { isValid: false, error: "Father's name contains invalid characters" };
      }
      if (mName && (/\d/.test(mName) || !/^[A-Za-z\u0900-\u0D7F\s\-\'\.]+$/.test(mName))) {
        return { isValid: false, error: "Mother's name contains invalid characters" };
      }
      if (fOcc) {
        const fOccCheck = validateFamilyOccupation(fOcc, "Father's Occupation");
        if (!fOccCheck.isValid) return { isValid: false, error: fOccCheck.error };
      }
      if (mOcc) {
        const mOccCheck = validateFamilyOccupation(mOcc, "Mother's Occupation");
        if (!mOccCheck.isValid) return { isValid: false, error: mOccCheck.error };
      }
      break;
    }
    case 14: {
      const mama = (data.maternalUncle || '').trim();
      const rel = (data.relations || '').trim();
      if (mama) {
        const mamaCheck = validateMaternalUncle(mama);
        if (!mamaCheck.isValid) return { isValid: false, error: mamaCheck.error };
      }
      if (rel) {
        const relCheck = validateRelations(rel);
        if (!relCheck.isValid) return { isValid: false, error: relCheck.error };
      }
      break;
    }
    case 15: {
      const addr = (data.currentAddress || '').trim();
      if (!addr || addr.length < 5) {
        return { isValid: false, error: 'Please enter your current address (at least 5 characters)' };
      }
      break;
    }
    case 17: {
      if (!data.sameAsCurrentAddress) {
        const perm = (data.permanentAddress || '').trim();
        if (!perm || perm.length < 5) {
          return { isValid: false, error: 'Please enter your permanent address (at least 5 characters)' };
        }
      }
      break;
    }
    case 18: {
      const phoneCheck = validateMobileNumber(data.contactNumber || '');
      if (!phoneCheck.isValid) {
        return { isValid: false, error: phoneCheck.error };
      }
      if (data.contactTo && data.contactTo.trim()) {
        const contactToCheck = validateMobileNumber(data.contactTo.trim());
        if (!contactToCheck.isValid) {
          return { isValid: false, error: `Public Contact: ${contactToCheck.error}` };
        }
      }
      break;
    }
    case 19: {
      const email = (data.email || '').trim();
      if (email) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return { isValid: false, error: 'Please enter a valid email address' };
        }
        if (isDisposableEmail(email)) {
          return { isValid: false, error: COMMON_EMAIL_ERROR_MSG };
        }
      }
      break;
    }
    case 21: {
      const np = (data.nativePlace || '').trim();
      if (np) {
        const npCheck = validateNativePlace(np);
        if (!npCheck.isValid) return { isValid: false, error: npCheck.error };
      }
      break;
    }
    case 22: {
      const langs = data.languagesKnown || [];
      for (const l of langs) {
        const lCheck = validateLanguageName(l);
        if (!lCheck.isValid) return { isValid: false, error: lCheck.error };
      }
      break;
    }
    case 23: {
      const hobs = data.hobbies || [];
      for (const h of hobs) {
        const hCheck = validateHobbyName(h);
        if (!hCheck.isValid) return { isValid: false, error: hCheck.error };
      }
      break;
    }
    case 24: {
      const expEdu = (data.expectedEducation || '').trim();
      if (expEdu) {
        const expCheck = validateGeneralText(expEdu, 'Expected Education / Profession');
        if (!expCheck.isValid) return { isValid: false, error: expCheck.error };
      }
      break;
    }
  }
  return { isValid: true, error: null };
};

export const BiodataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading: authLoading, refreshUser } = useAuth();

  const [formData, setFormData] = useState<BiodataForm>(() => {
    const storedLang = typeof window !== 'undefined' ? (localStorage.getItem('app_lang') || 'en') : 'en';
    if (user && user.role === 'ADMIN') {
      return { ...initialBiodataForm, lang: storedLang };
    }
    const cachedUserId = user?.id || (typeof window !== 'undefined' ? localStorage.getItem('auth_user_id') : null);
    const storageKey = getBiodataStorageKey(cachedUserId);
    let saved = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
    if (!saved && cachedUserId && typeof window !== 'undefined') {
      saved = localStorage.getItem(getBiodataStorageKey(null)) || localStorage.getItem(LOCAL_STORAGE_KEY);
    }
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (user && user.email) {
          const draftEmail = (parsed.email || '').trim().toLowerCase();
          const userEmail = user.email.trim().toLowerCase();
          if (draftEmail && draftEmail !== userEmail) {
            return { ...getInitialBiodataForm(user), lang: storedLang };
          }
        }
        if (parsed.name && parsed.name.toLowerCase().includes('admin')) {
          parsed.name = user?.full_name || '';
        }
        // Always align active lang with user's chosen UI language
        const baseForm = user ? getInitialBiodataForm(user) : initialBiodataForm;
        return {
          ...baseForm,
          ...parsed,
          educationList: Array.isArray(parsed.educationList) ? parsed.educationList : [],
          hobbies: Array.isArray(parsed.hobbies) ? parsed.hobbies : [],
          skills: Array.isArray(parsed.skills) ? parsed.skills : [],
          languagesKnown: Array.isArray(parsed.languagesKnown) ? parsed.languagesKnown : [],
          galleryPictures: Array.isArray(parsed.galleryPictures) ? parsed.galleryPictures : [],
          documentUrls: Array.isArray(parsed.documentUrls) ? parsed.documentUrls : [],
          lang: storedLang || parsed.lang || 'en',
        };
      } catch (e) {
        return user ? { ...getInitialBiodataForm(user), lang: storedLang } : { ...initialBiodataForm, lang: storedLang };
      }
    }
    return user ? { ...getInitialBiodataForm(user), lang: storedLang } : { ...initialBiodataForm, lang: storedLang };
  });

  const formDataRef = useRef<BiodataForm>(formData);
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Keep formData.lang in sync with the app-level language selection stored in localStorage.
  // This runs on mount and whenever app_lang changes (the I18nContext always writes 'app_lang').
  useEffect(() => {
    const syncLang = () => {
      const storedLang = localStorage.getItem('app_lang') || 'en';
      setFormData(prev => {
        if (prev.lang === storedLang) return prev; // no-op if already in sync
        return { ...prev, lang: storedLang };
      });
    };
    syncLang(); // run once on mount
    // StorageEvent fires when a *different* tab writes to localStorage;
    // the reload-on-lang-switch in I18nContext means on the same tab a reload
    // is triggered anyway, so syncLang() on mount covers that case too.
    window.addEventListener('storage', syncLang);
    return () => window.removeEventListener('storage', syncLang);
  }, []);


  const currentPage: AppPage = useMemo(() => {
    const cleanPath = location.pathname.split('?')[0].replace(/\/$/, '') || '/';
    if (cleanPath === '/templates' || cleanPath === '/biodata-maker' || cleanPath === '/studio') return 'templates';
    if (cleanPath === '/discovery' || cleanPath === '/discover') return 'discovery';
    if (cleanPath === '/interactions') return 'interactions';
    if (cleanPath === '/wizard') return 'wizard';
    if (cleanPath === '/admin') return 'admin';
    if (cleanPath === '/about-us' || cleanPath === '/about-me' || cleanPath === '/about') return 'about-us';
    if (cleanPath === '/team' || cleanPath === '/meet-the-team' || cleanPath === '/developers') return 'team';
    if (
      cleanPath.startsWith('/profile/') ||
      cleanPath.startsWith('/@') ||
      (cleanPath !== '/' && cleanPath.length > 1 && !cleanPath.includes('.'))
    ) {
      return 'profile';
    }
    return 'landing';
  }, [location.pathname]);

  const [questionIndex, setQuestionIndexState] = useState<number>(() => {
    // 1. Check URL query parameters first (e.g. /wizard?step=23 or ?q=23)
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const qParam = searchParams.get('step') || searchParams.get('q') || searchParams.get('question');
      if (qParam) {
        const parsed = parseInt(qParam, 10);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= TOTAL_QUESTIONS) {
          return parsed;
        }
      }
    }

    // 2. Check user-scoped localStorage
    const cachedUserId = user?.id || (typeof window !== 'undefined' ? localStorage.getItem('auth_user_id') : null);
    const storageKey = getWizardQuestionIndexKey(cachedUserId);
    const saved = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= TOTAL_QUESTIONS) {
        return parsed;
      }
    }
    if (cachedUserId && typeof window !== 'undefined') {
      const guestSaved = localStorage.getItem(getWizardQuestionIndexKey(null)) || localStorage.getItem(WIZARD_QUESTION_INDEX_KEY);
      if (guestSaved) {
        const parsed = parseInt(guestSaved, 10);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= TOTAL_QUESTIONS) {
          return parsed;
        }
      }
    }
    return 1;
  });
  const [slideDirection, setSlideDirection] = useState<number>(1);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [currentStep, setCurrentStep] = useState<StepId>(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const stepParam = searchParams.get('step') || searchParams.get('s');
      if (stepParam) {
        const parsed = parseInt(stepParam, 10) as StepId;
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 8) {
          return parsed;
        }
      }
    }

    const cachedUserId = user?.id || (typeof window !== 'undefined' ? localStorage.getItem('auth_user_id') : null);
    const storageKey = getWizardStepKey(cachedUserId);
    const saved = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
    if (saved) {
      const parsed = parseInt(saved, 10) as StepId;
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 8) {
        return parsed;
      }
    }
    if (cachedUserId && typeof window !== 'undefined') {
      const guestSaved = localStorage.getItem(getWizardStepKey(null)) || localStorage.getItem(WIZARD_STEP_KEY);
      if (guestSaved) {
        const parsed = parseInt(guestSaved, 10) as StepId;
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 8) {
          return parsed;
        }
      }
    }
    return 1;
  });

  // Keep questionIndex in sync with user-scoped localStorage
  useEffect(() => {
    if (questionIndex >= 1 && questionIndex <= TOTAL_QUESTIONS) {
      const activeId = user?.id || (typeof window !== 'undefined' ? localStorage.getItem('auth_user_id') : null);
      const storageKey = getWizardQuestionIndexKey(activeId);
      localStorage.setItem(storageKey, String(questionIndex));
      localStorage.setItem(WIZARD_QUESTION_INDEX_KEY, String(questionIndex));
    }
  }, [questionIndex, user?.id]);

  // Keep currentStep in sync with user-scoped localStorage
  useEffect(() => {
    if (currentStep >= 1 && currentStep <= 8) {
      const activeId = user?.id || (typeof window !== 'undefined' ? localStorage.getItem('auth_user_id') : null);
      const storageKey = getWizardStepKey(activeId);
      localStorage.setItem(storageKey, String(currentStep));
      localStorage.setItem(WIZARD_STEP_KEY, String(currentStep));
    }
  }, [currentStep, user?.id]);

  // Keep URL query parameter in sync on /wizard without full reload (preserves Step 23 on browser refresh)
  useEffect(() => {
    if (location.pathname.startsWith('/wizard')) {
      const searchParams = new URLSearchParams(location.search);
      const currentParam = searchParams.get('step') || searchParams.get('q');
      const paramVal = String(questionIndex);
      if (currentParam !== paramVal) {
        searchParams.set('step', paramVal);
        const newUrl = `${location.pathname}?${searchParams.toString()}`;
        window.history.replaceState(window.history.state, '', newUrl);
      }
    }
  }, [location.pathname, location.search, questionIndex]);

  // Allow explicit URL query parameter override on navigation (e.g. /wizard?q=23 or ?step=23)
  useEffect(() => {
    if (location.pathname.startsWith('/wizard')) {
      const searchParams = new URLSearchParams(location.search);
      const qParam = searchParams.get('q') || searchParams.get('question') || searchParams.get('step');
      if (qParam) {
        const parsed = parseInt(qParam, 10);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= TOTAL_QUESTIONS) {
          setQuestionIndexState(parsed);
        }
      }
    }
  }, [location.pathname, location.search]);

  // Moderation Metadata - Default to APPROVED since review/approval requirement is removed
  const [moderationStatus, setModerationStatus] =
    useState<ProfileModerationStatus | string>('APPROVED');
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');

  const fetchMyBiodata = useCallback(async (): Promise<boolean> => {
    if (!isAuthenticated || !user) return false;

    try {
      const res = await getMyBiodataApi();

      if (res && res.success && res.data) {
        if (res.data.hobbies) {
          res.data.hobbies = normalizeHobbiesList(res.data.hobbies);
        }
        if (res.data.languagesKnown) {
          res.data.languagesKnown = normalizeLanguagesList(res.data.languagesKnown);
        }
        if (res.data.smoking === 'No') {
          res.data.smoking = 'Never';
        }
        if (res.data.drinking === 'No') {
          res.data.drinking = 'Never';
        }

        const userKey = getBiodataStorageKey(user.id);
        const savedStr = localStorage.getItem(userKey) || localStorage.getItem(LOCAL_STORAGE_KEY);
        let localDraft: Partial<BiodataForm> = {};
        if (savedStr) {
          try { localDraft = JSON.parse(savedStr); } catch (e) {}
        }

        // Clean out any poisoned admin name
        const serverName = (res.data.fullName || res.data.name || '').trim();
        const isAdminServerName = serverName.toLowerCase().includes('admin');
        const resolvedName = (!isAdminServerName && serverName) ? serverName : (user.full_name || '');

        if (localDraft.name && localDraft.name.toLowerCase().includes('admin')) {
          delete localDraft.name;
        }

        // Validate that localDraft strictly belongs to the currently authenticated user
        const draftEmail = (localDraft.email || '').trim().toLowerCase();
        const userEmail = (user.email || '').trim().toLowerCase();
        const draftBelongsToUser = Boolean(!draftEmail || draftEmail === userEmail);

        const baseServerData = {
          ...(user ? getInitialBiodataForm(user) : initialBiodataForm),
          ...res.data,
          educationList: Array.isArray(res.data?.educationList) ? res.data.educationList : (Array.isArray(localDraft?.educationList) ? localDraft.educationList : []),
          hobbies: Array.isArray(res.data?.hobbies) ? res.data.hobbies : (Array.isArray(localDraft?.hobbies) ? localDraft.hobbies : []),
          skills: Array.isArray(res.data?.skills) ? res.data.skills : (Array.isArray(localDraft?.skills) ? localDraft.skills : []),
          languagesKnown: Array.isArray(res.data?.languagesKnown) ? res.data.languagesKnown : (Array.isArray(localDraft?.languagesKnown) ? localDraft.languagesKnown : []),
          email: user.email,
          name: resolvedName,
          emailVerified: user.is_email_verified,
          verifiedEmail: user.email,
        };

        const mergedData = draftBelongsToUser ? { ...baseServerData, ...localDraft, email: user.email, name: resolvedName } : baseServerData;

        // Ensure lifestyle preferences from localDraft are not accidentally reverted if valid
        if (draftBelongsToUser && localDraft.drinking && ['Never', 'Socially', 'Frequently'].includes(localDraft.drinking)) {
          mergedData.drinking = localDraft.drinking;
        }
        if (draftBelongsToUser && localDraft.smoking && ['Never', 'Occasionally', 'Yes'].includes(localDraft.smoking)) {
          mergedData.smoking = localDraft.smoking;
        }

        // Keep active language synced
        const activeAppLang = typeof window !== 'undefined' ? localStorage.getItem('app_lang') : null;
        if (activeAppLang) {
          mergedData.lang = activeAppLang;
        } else if (res.data?.lang) {
          mergedData.lang = res.data.lang;
          try { localStorage.setItem('app_lang', res.data.lang); } catch (e) {}
        } else {
          mergedData.lang = 'en';
        }

        setFormData(mergedData);
        formDataRef.current = mergedData;
        localStorage.setItem(userKey, JSON.stringify(mergedData));
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mergedData));

        if (res.moderationStatus) {
          setModerationStatus(res.moderationStatus);
        }

        if (res.rejectionReason !== undefined) {
          setRejectionReason(res.rejectionReason);
        }

        if (res.profileId) {
          setProfileId(res.profileId);
        }

        if (res.slug) {
          setSlug(res.slug);
        }

        const score = calculateCompletionScore(mergedData);
        const isCompleteFromBackend =
          res.isCompleted !== undefined
            ? Boolean(res.isCompleted)
            : (res.moderationStatus === 'APPROVED' && Boolean(res.profileId) && score >= 20);

        // Restore saved questionIndex and currentStep if present
        const qKey = getWizardQuestionIndexKey(user.id);
        const savedQ = localStorage.getItem(qKey) || localStorage.getItem(WIZARD_QUESTION_INDEX_KEY);
        if (savedQ) {
          const parsedQ = parseInt(savedQ, 10);
          if (!isNaN(parsedQ) && parsedQ >= 1 && parsedQ <= TOTAL_QUESTIONS) {
            setQuestionIndexState(parsedQ);
          }
        }
        const sKey = getWizardStepKey(user.id);
        const savedS = localStorage.getItem(sKey) || localStorage.getItem(WIZARD_STEP_KEY);
        if (savedS) {
          const parsedS = parseInt(savedS, 10) as StepId;
          if (!isNaN(parsedS) && parsedS >= 1 && parsedS <= 8) {
            setCurrentStep(parsedS);
          }
        }

        const compKey = getWizardCompletedKey(user.id);
        if (isCompleteFromBackend) {
          setWizardCompleted(true);
          localStorage.setItem(compKey, 'true');
          return true;
        } else {
          setWizardCompleted(false);
          localStorage.removeItem(compKey);
          return false;
        }
      } else if (res && res.success && res.data === null && user) {
        // User has no saved profile record on server yet (In-progress draft or brand new profile)
        const userKey = getBiodataStorageKey(user.id);
        const savedStr = localStorage.getItem(userKey);
        let hasValidDraft = false;
        if (savedStr) {
          try {
            const parsed = JSON.parse(savedStr);
            const draftEmail = (parsed.email || '').trim().toLowerCase();
            const userEmail = (user.email || '').trim().toLowerCase();
            if (!draftEmail || draftEmail === userEmail) {
              const draftData = {
                ...getInitialBiodataForm(user),
                ...parsed,
                email: user.email,
                name: parsed.name || user.full_name || '',
                emailVerified: user.is_email_verified,
                verifiedEmail: user.email,
              };
              setFormData(draftData);
              formDataRef.current = draftData;
              hasValidDraft = true;
            }
          } catch (e) {}
        }

        if (!hasValidDraft) {
          const freshInitial = getInitialBiodataForm(user);
          setFormData(freshInitial);
          formDataRef.current = freshInitial;
        }

        // Restore questionIndex and currentStep from localStorage if present
        const qKey = getWizardQuestionIndexKey(user.id);
        const savedQ = localStorage.getItem(qKey) || localStorage.getItem(WIZARD_QUESTION_INDEX_KEY);
        if (savedQ) {
          const parsedQ = parseInt(savedQ, 10);
          if (!isNaN(parsedQ) && parsedQ >= 1 && parsedQ <= TOTAL_QUESTIONS) {
            setQuestionIndexState(parsedQ);
          }
        }

        const sKey = getWizardStepKey(user.id);
        const savedS = localStorage.getItem(sKey) || localStorage.getItem(WIZARD_STEP_KEY);
        if (savedS) {
          const parsedS = parseInt(savedS, 10) as StepId;
          if (!isNaN(parsedS) && parsedS >= 1 && parsedS <= 8) {
            setCurrentStep(parsedS);
          }
        }

        setWizardCompleted(false);
        setModerationStatus('DRAFT');
        setRejectionReason(null);
        setProfileId(null);
        setSlug(null);
        const compKey = getWizardCompletedKey(user.id);
        localStorage.removeItem(compKey);
        return false;
      } else {
        // Network lag or non-200: Do not purge. Retain local completion status
        const compKey = getWizardCompletedKey(user?.id);
        return localStorage.getItem(compKey) === 'true';
      }
    } catch {
      const compKey = getWizardCompletedKey(user?.id);
      return localStorage.getItem(compKey) === 'true';
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const handleLogout = () => {
      activeUserIdRef.current = null;
      setFormData(initialBiodataForm);
      formDataRef.current = initialBiodataForm;
      setQuestionIndexState(1);
      setCurrentStep(1);
      setWizardCompleted(false);
      setModerationStatus('APPROVED');
      setRejectionReason(null);
      setProfileId(null);
      setSlug(null);
      setLastSavedTime('Just now');
      setValidationError(null);
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const activeUserIdRef = useRef<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('auth_user_id') : null
  );

  useEffect(() => {
    if (authLoading) return;

    const currentUserId = user?.id || null;
    const previousUserId = activeUserIdRef.current;
    const userSwitched = previousUserId !== null && currentUserId !== null && previousUserId !== currentUserId;
    activeUserIdRef.current = currentUserId;

    if (user && user.is_profile_completed !== undefined) {
      setWizardCompleted(Boolean(user.is_profile_completed));
      const compKey = getWizardCompletedKey(user.id);
      if (user.is_profile_completed) {
        localStorage.setItem(compKey, 'true');
      } else {
        localStorage.removeItem(compKey);
      }
    }

    if (userSwitched) {
      activeUserIdRef.current = currentUserId;

      // Switched account: initialize isolated form state immediately
      const cleanInitial = getInitialBiodataForm(user);
      setFormData(cleanInitial);
      formDataRef.current = cleanInitial;
      setQuestionIndexState(1);
      setCurrentStep(1);
      setWizardCompleted(false);
      setModerationStatus('DRAFT');
      setRejectionReason(null);
      setProfileId(null);
      setSlug(null);
      setValidationError(null);
    } else if (!user) {
      // Logged out / Guest: Retain in-progress guest draft from localStorage if present
      const guestKey = getBiodataStorageKey(null);
      const savedStr = typeof window !== 'undefined' ? (localStorage.getItem(guestKey) || localStorage.getItem(LOCAL_STORAGE_KEY)) : null;
      let hasDraft = false;
      if (savedStr) {
        try {
          const parsed = JSON.parse(savedStr);
          if (parsed && typeof parsed === 'object') {
            const safeParsed: BiodataForm = {
              ...initialBiodataForm,
              ...parsed,
              educationList: Array.isArray(parsed.educationList) ? parsed.educationList : [],
              hobbies: Array.isArray(parsed.hobbies) ? parsed.hobbies : [],
              skills: Array.isArray(parsed.skills) ? parsed.skills : [],
              languagesKnown: Array.isArray(parsed.languagesKnown) ? parsed.languagesKnown : [],
              galleryPictures: Array.isArray(parsed.galleryPictures) ? parsed.galleryPictures : [],
              documentUrls: Array.isArray(parsed.documentUrls) ? parsed.documentUrls : [],
            };
            setFormData(safeParsed);
            formDataRef.current = safeParsed;
            hasDraft = true;
          }
        } catch {}
      }
      if (!hasDraft) {
        setFormData(initialBiodataForm);
        formDataRef.current = initialBiodataForm;
      }
      setModerationStatus('APPROVED');
      setRejectionReason(null);
      setProfileId(null);
      setSlug(null);
      setLastSavedTime('Just now');
      setValidationError(null);
      return;
    } else if (user.role === 'ADMIN') {
      // Admin accounts do not maintain personal biodata profiles
      setFormData(initialBiodataForm);
      formDataRef.current = initialBiodataForm;
      setQuestionIndexState(1);
      setCurrentStep(1);
      setWizardCompleted(false);
      setModerationStatus('APPROVED');
      setRejectionReason(null);
      setProfileId(null);
      setSlug(null);
      setValidationError(null);
      return;
    } else {
      // Same user refresh: Ensure active in-progress draft & step are hydrated
      const userKey = getBiodataStorageKey(currentUserId);
      const savedStr = localStorage.getItem(userKey);
      if (savedStr) {
        try {
          const parsed = JSON.parse(savedStr);
          if (parsed && typeof parsed === 'object') {
            const draftEmail = (parsed.email || '').trim().toLowerCase();
            const userEmail = (user.email || '').trim().toLowerCase();
            if (!draftEmail || draftEmail === userEmail) {
              const draftData = {
                ...getInitialBiodataForm(user),
                ...parsed,
                email: user.email,
                name: parsed.name || user.full_name || '',
                emailVerified: user.is_email_verified,
                verifiedEmail: user.email,
              };
              setFormData(draftData);
              formDataRef.current = draftData;
            }
          }
        } catch (e) {}
      }

      // Restore saved questionIndex & step from localStorage if present
      const qKey = getWizardQuestionIndexKey(currentUserId);
      const savedQ = localStorage.getItem(qKey) || localStorage.getItem(WIZARD_QUESTION_INDEX_KEY);
      if (savedQ) {
        const parsedQ = parseInt(savedQ, 10);
        if (!isNaN(parsedQ) && parsedQ >= 1 && parsedQ <= TOTAL_QUESTIONS) {
          setQuestionIndexState(parsedQ);
        }
      }
      const sKey = getWizardStepKey(currentUserId);
      const savedS = localStorage.getItem(sKey) || localStorage.getItem(WIZARD_STEP_KEY);
      if (savedS) {
        const parsedS = parseInt(savedS, 10) as StepId;
        if (!isNaN(parsedS) && parsedS >= 1 && parsedS <= 8) {
          setCurrentStep(parsedS);
        }
      }
    }

    if (isAuthenticated && user) {
      if (user.role === 'ADMIN') {
        if (!location.pathname.startsWith('/admin')) {
          navigate('/admin', { replace: true });
        }
        return;
      }

      let isMounted = true;

      const initUserSession = async () => {
        const isCompletedOnServer = await fetchMyBiodata();

        if (!isMounted) return;

        const pathname = location.pathname;
        if (pathname === '/' || pathname === '') {
          // Respect pending redirect requested by action button (e.g. /templates)
          const pendingRedirect = sessionStorage.getItem('tm_post_login_redirect');
          if (pendingRedirect) {
            sessionStorage.removeItem('tm_post_login_redirect');
            navigate(pendingRedirect, { replace: true });
            return;
          }

          // Check if profile was already completed on server or locally
          const userCompKey = getWizardCompletedKey(user.id);
          const alreadyCompleted =
            isCompletedOnServer ||
            localStorage.getItem(userCompKey) === 'true';

          if (alreadyCompleted) {
            navigate('/discover', { replace: true });
          } else {
            navigate('/wizard', { replace: true });
          }
        }
      };

      initUserSession();

      return () => {
        isMounted = false;
      };
    } else {
      setModerationStatus('APPROVED');
      setRejectionReason(null);
      setProfileId(null);
      setSlug(null);
    }
  }, [isAuthenticated, user, authLoading, fetchMyBiodata]);

  // Global auth:logout listener for instant synchronous purge
  useEffect(() => {
    const handleAuthLogout = () => {
      activeUserIdRef.current = null;
      setFormData(initialBiodataForm);
      formDataRef.current = initialBiodataForm;
      setQuestionIndexState(1);
      setCurrentStep(1);
      setWizardCompleted(false);
      setModerationStatus('APPROVED');
      setRejectionReason(null);
      setProfileId(null);
      setSlug(null);
      setLastSavedTime('Just now');
      setValidationError(null);
    };

    window.addEventListener('auth:logout', handleAuthLogout);
    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, []);

  useEffect(() => {
    if (location.pathname !== '/' && location.pathname !== '') {
      sessionStorage.removeItem('tm_post_login_redirect');
    }
  }, [location.pathname]);

  const submitForModeration = async () => {
    if (!isAuthenticated) {
      return {
        success: false,
        message: 'Authentication required to publish profile.',
      };
    }

    const res = await publishBiodataApi(formData);

    if (res && res.success) {
      setModerationStatus('APPROVED');
      setRejectionReason(null);

      if (res.profileId) {
        setProfileId(res.profileId);
      }
      if (res.slug) {
        setSlug(res.slug);
      }

      setWizardCompleted(true);
      localStorage.setItem(WIZARD_COMPLETED_KEY, 'true');

      return {
        success: true,
        message: res.message || 'Profile published successfully!',
      };
    }

    return {
      success: false,
      message: 'Failed to publish profile.',
    };
  };

  const goToLanding = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(isAuthenticated ? '/discover' : '/');
  };

  const goToProfile = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (slug || profileId) {
      navigate(`/@${slug || profileId}`);
    } else {
      navigate('/profile');
    }
  };

  const ensureAuthOrRedirect = (targetPath: string): boolean => {
    // 1. If user is authenticated in React AuthContext, permit navigation immediately!
    if (isAuthenticated && user) {
      return true;
    }

    // 2. Secondary check for stored token or admin role
    const token = localStorage.getItem('auth_token') || localStorage.getItem('access_token');
    const userRole = localStorage.getItem('user_role');
    if (token || userRole === 'ADMIN') {
      return true;
    }

    // 3. User is genuinely not logged in
    sessionStorage.setItem('tm_post_login_redirect', targetPath);
    window.dispatchEvent(new CustomEvent('tm:open-login', { detail: { redirect: targetPath } }));
    navigate('/');
    return false;
  };

  const goToStudio = () => {
    if (!ensureAuthOrRedirect('/templates?active=true')) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/templates?active=true');
  };

  const [wizardCompleted, setWizardCompleted] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const activeUser = localStorage.getItem('auth_user_id');
      const compKey = activeUser ? getWizardCompletedKey(activeUser) : WIZARD_COMPLETED_KEY;
      return localStorage.getItem(compKey) === 'true';
    }
    return false;
  });

  const markWizardComplete = async () => {
    const userCompKey = user?.id ? getWizardCompletedKey(user.id) : WIZARD_COMPLETED_KEY;
    localStorage.setItem(userCompKey, 'true');
    localStorage.setItem(WIZARD_COMPLETED_KEY, 'true');
    setWizardCompleted(true);
    try {
      const currentForm = formDataRef.current || formData;
      await saveBiodataApi({ ...currentForm, is_completed: true } as any);
      if (refreshUser) {
        await refreshUser();
      }
    } catch (err) {
      console.warn('Failed to persist is_completed to backend', err);
    }
  };

  const goToWizard = (templateId?: string) => {
    if (!ensureAuthOrRedirect('/wizard')) return;
    if (templateId) {
      localStorage.setItem('selected_template_id', templateId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/wizard');
  };

  const jumpToQuestionAndWizard = (targetIdx: number) => {
    if (!ensureAuthOrRedirect('/wizard')) return;
    setQuestionIndexState(targetIdx);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/wizard');
  };

  const goToAdmin = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/admin');
  };

  const goToDiscovery = () => {
    if (!ensureAuthOrRedirect('/discover')) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/discover');
  };

  const goToInteractions = () => {
    if (!ensureAuthOrRedirect('/interactions')) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/interactions');
  };

  const goToTemplates = () => {
    if (!ensureAuthOrRedirect('/templates')) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/templates');
  };

// UI state & dark mode
const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
  return (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
});
  // OTP Modal State
  const [otpModal, setOtpModal] = useState<{
    isOpen: boolean;
    type: 'phone' | 'email' | null;
    targetValue: string;
    alreadyDispatched?: boolean;
  }>({
    isOpen: false,
    type: null,
    targetValue: '',
    alreadyDispatched: false,
  });

  // AI Modal State
  const [aiModal, setAiModal] = useState<{ isOpen: boolean; type: 'summary' | 'hobbies' | 'expectations' | null }>({
    isOpen: false,
    type: null,
  });

  // Image Crop Modal
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
  const [cropCallback, setCropCallback] = useState<((croppedUrl: string, originalUrl?: string, filterId?: string) => void) | null>(null);
  const [activeFilterId, setActiveFilterId] = useState<string | null>(null);
  const [guidelineAlert, setGuidelineAlert] = useState<{ message: string; type?: 'error' | 'info' | 'success' } | null>(null);

  const showGuidelineAlert = useCallback((message: string, type: 'error' | 'info' | 'success' = 'error', duration = 6000) => {
    setGuidelineAlert({ message, type });
    setTimeout(() => setGuidelineAlert(null), duration);
  }, []);

  const openCropper = useCallback(async (
    src: string,
    onComplete?: (croppedUrl: string, originalUrl?: string, filterId?: string) => void,
    rawSource?: string,
    initialFilter?: string
  ) => {
    if (!src) return;

    try {
      const currentForm = formDataRef.current;
      // If rawSource is provided, use it. Otherwise, if src matches current profilePictureUrl and we have originalProfilePictureUrl, use that!
      const candidateMaster = rawSource || (
        (src === currentForm.profilePictureUrl || !rawSource) && currentForm.originalProfilePictureUrl
          ? currentForm.originalProfilePictureUrl
          : src
      );

      // 1. Convert blob URL to Base64 data URL if necessary
      let verifySrc = candidateMaster;
      if (candidateMaster.startsWith('blob:')) {
        const res = await fetch(candidateMaster);
        const blob = await res.blob();
        verifySrc = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }

      // 2. Pre-screen with strict OpenCV human face detector
      const verifyRes = await verifyPhotoApi(verifySrc);
      if (!verifyRes || !verifyRes.success) {
        throw new Error(verifyRes?.message || 'Please follow platform guidelines: Upload a clear portrait photo showing your face (photos of food, objects, scenery, or pets are not allowed).');
      }

      // 3. Verified human face! Proceed to CropModal with pristine master source
      setActiveFilterId(initialFilter || currentForm.profilePhotoFilter || 'normal');
      setTempImageSrc(verifySrc);
      setCropCallback(() => (onComplete ? onComplete : null));
      setCropModalOpen(true);
    } catch (err: any) {
      // 4. Verification failed: NEVER open the CropModal! Directly trigger bottom-right alert
      setCropModalOpen(false);
      setTempImageSrc(null);
      const errorMsg = err.message || 'Please follow platform guidelines: Upload a clear portrait photo showing your face (photos of food, objects, scenery, or pets are not allowed).';
      showGuidelineAlert(errorMsg, 'error', 6000);
    }
  }, [showGuidelineAlert]);

  // Sync Dark Mode class to <html> tag
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Auto save periodically only for authenticated non-admin users with active biodata progress
  useEffect(() => {
    if (!isAuthenticated || !user || user.role === 'ADMIN') return;

    const interval = setInterval(async () => {
      // Prevent background tabs or non-wizard pages from overriding active wizard data
      if (typeof document !== 'undefined' && document.hidden) return;
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/wizard')) return;

      const currentForm = formDataRef.current;
      const hasContent = Boolean(
        currentForm.name || currentForm.gender || currentForm.dob || currentForm.maritalStatus
      );
      if (!hasContent) return;

      const userStorageKey = getBiodataStorageKey(user.id);
      localStorage.setItem(userStorageKey, JSON.stringify(currentForm));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentForm));
      try {
        const result = await saveBiodataApi(currentForm);
        if (result?.timestamp) {
          setLastSavedTime(`Auto-saved at ${result.timestamp}`);
        }
      } catch {
        // Silently catch network errors during periodic auto-save
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  const updateFormData = (fields: Partial<BiodataForm>) => {
    const current = formDataRef.current;
    const sanitizedFields = { ...fields };
    if (sanitizedFields.hobbies !== undefined) {
      sanitizedFields.hobbies = normalizeHobbiesList(sanitizedFields.hobbies);
    }
    if (sanitizedFields.languagesKnown !== undefined) {
      sanitizedFields.languagesKnown = normalizeLanguagesList(sanitizedFields.languagesKnown);
    }
    // Sync current user's email if no email is set, but allow editing when fields.email is provided
    if (user && user.email) {
      if (sanitizedFields.email === undefined && !current.email) {
        sanitizedFields.email = user.email;
        sanitizedFields.verifiedEmail = user.email;
        sanitizedFields.emailVerified = user.is_email_verified;
      } else if (sanitizedFields.email && sanitizedFields.email.trim().toLowerCase() === user.email.trim().toLowerCase()) {
        sanitizedFields.verifiedEmail = user.email;
        sanitizedFields.emailVerified = user.is_email_verified;
      }
    }

    if (!sanitizedFields.lang) {
      sanitizedFields.lang = current.lang || (typeof window !== 'undefined' ? localStorage.getItem('app_lang') : null) || 'en';
    }
    const updated = { ...current, ...sanitizedFields };
    formDataRef.current = updated;

    const activeId = user?.id || (typeof window !== 'undefined' ? localStorage.getItem('auth_user_id') : null);
    const userKey = getBiodataStorageKey(activeId);
    localStorage.setItem(userKey, JSON.stringify(updated));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    const now = new Date();
    setLastSavedTime(`Saved at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);

    // Only auto-save to server if user has entered substantive biodata details and is NOT an admin
    const hasMeaningfulContent = Boolean(
      updated.gender || updated.dob || updated.maritalStatus || updated.religion || updated.occupation || updated.currentAddress
    );
    if (isAuthenticated && user && user.role !== 'ADMIN' && hasMeaningfulContent) {
      saveBiodataApi(updated).catch(() => {});
    }

    setFormData(updated);
    setValidationError(null);
  };

  const resetFormData = () => {
    const userKey = getBiodataStorageKey(user?.id);
    localStorage.removeItem(userKey);
    localStorage.removeItem(getWizardQuestionIndexKey(user?.id));
    localStorage.removeItem(getWizardStepKey(user?.id));
    localStorage.removeItem(getWizardCompletedKey(user?.id));
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(WIZARD_QUESTION_INDEX_KEY);
    localStorage.removeItem(WIZARD_STEP_KEY);
    localStorage.removeItem(WIZARD_COMPLETED_KEY);

    const fresh = (user && user.role !== 'ADMIN') ? getInitialBiodataForm(user) : initialBiodataForm;
    setFormData(fresh);
    formDataRef.current = fresh;
    setQuestionIndexState(1);
    setCurrentStep(1);
    setWizardCompleted(false);
    setLastSavedTime('Just now');
    setValidationError(null);
  };

  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const isNavigatingRef = useRef<boolean>(false);
  const lastNavTimeRef = useRef<number>(0);
  const navTimeoutRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (navTimeoutRef.current) {
        clearTimeout(navTimeoutRef.current);
      }
    };
  }, []);

  // Validation function per question
  const validateQuestion = (idx: number): boolean => {
    const result = checkStepValidity(idx, formDataRef.current);
    if (!result.isValid) {
      setValidationError(result.error || "Please fill in this required field correctly.");
      return false;
    }
    setValidationError(null);
    return true;
  };

  const setQuestionIndex = (targetIdx: number) => {
    const now = Date.now();
    if (isNavigatingRef.current || (now - lastNavTimeRef.current < 350)) {
      return;
    }
    isNavigatingRef.current = true;
    lastNavTimeRef.current = now;
    setIsNavigating(true);

    if (navTimeoutRef.current) {
      clearTimeout(navTimeoutRef.current);
    }
    navTimeoutRef.current = setTimeout(() => {
      isNavigatingRef.current = false;
      setIsNavigating(false);
    }, 350);

    setSlideDirection(targetIdx > questionIndex ? 1 : -1);
    setQuestionIndexState(targetIdx);
    const activeId = user?.id || (typeof window !== 'undefined' ? localStorage.getItem('auth_user_id') : null);
    const qKey = getWizardQuestionIndexKey(activeId);
    localStorage.setItem(qKey, String(targetIdx));
    localStorage.setItem(WIZARD_QUESTION_INDEX_KEY, String(targetIdx));
    setValidationError(null);
  };

  const goToNextQuestion = async (): Promise<boolean> => {
    const now = Date.now();
    if (isNavigatingRef.current || (now - lastNavTimeRef.current < 350)) {
      return false;
    }

    if (!validateQuestion(questionIndex)) {
      return false;
    }

    isNavigatingRef.current = true;
    lastNavTimeRef.current = now;
    setIsNavigating(true);

    if (navTimeoutRef.current) {
      clearTimeout(navTimeoutRef.current);
    }
    navTimeoutRef.current = setTimeout(() => {
      isNavigatingRef.current = false;
      setIsNavigating(false);
    }, 350);

    setSlideDirection(1);

    const currentData = formDataRef.current;

    // Persist immediately on step advance synchronously to local storage
    const activeId = user?.id || (typeof window !== 'undefined' ? localStorage.getItem('auth_user_id') : null);
    const storageKey = getBiodataStorageKey(activeId);
    localStorage.setItem(storageKey, JSON.stringify(currentData));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentData));

    // Await server persistence if authenticated to ensure DB commit completes
    if (isAuthenticated && user?.role !== 'ADMIN') {
      try {
        const res = await saveBiodataApi(currentData);
        if (res?.profileData) {
          formDataRef.current = { ...formDataRef.current, ...res.profileData };
          localStorage.setItem(storageKey, JSON.stringify(formDataRef.current));
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formDataRef.current));
        }
      } catch (err) {
        console.warn('Failed to save biodata during question advance:', err);
      }
    }

    // Smart Conditional Flow Logic
    let nextIdx = questionIndex + 1;

    // Q16 = Address Toggle; if same address, skip Q17 (permanentAddress) → go to Q18
    if (
      questionIndex === 16 &&
      (currentData.sameAsCurrentAddress ||
        currentData.permanentAddress === currentData.currentAddress)
    ) {
      nextIdx = 18;
    }

    if (nextIdx <= TOTAL_QUESTIONS) {
      setQuestionIndexState(nextIdx);
      const qKey = getWizardQuestionIndexKey(activeId);
      localStorage.setItem(qKey, String(nextIdx));
      localStorage.setItem(WIZARD_QUESTION_INDEX_KEY, String(nextIdx));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return true;
  };

  const goToPrevQuestion = () => {
    const now = Date.now();
    if (isNavigatingRef.current || (now - lastNavTimeRef.current < 350)) {
      return;
    }

    isNavigatingRef.current = true;
    lastNavTimeRef.current = now;
    setIsNavigating(true);

    if (navTimeoutRef.current) {
      clearTimeout(navTimeoutRef.current);
    }
    navTimeoutRef.current = setTimeout(() => {
      isNavigatingRef.current = false;
      setIsNavigating(false);
    }, 350);

    setSlideDirection(-1);
    setValidationError(null);

    let prevIdx = questionIndex - 1;

    // When going back from Q18, skip Q17 if permanent address is same
    if (
      questionIndex === 18 &&
      (formDataRef.current.sameAsCurrentAddress ||
        formDataRef.current.permanentAddress === formDataRef.current.currentAddress)
    ) {
      prevIdx = 16;
    }

    if (prevIdx >= 1) {
      setQuestionIndexState(prevIdx);
      const activeId = user?.id || (typeof window !== 'undefined' ? localStorage.getItem('auth_user_id') : null);
      const qKey = getWizardQuestionIndexKey(activeId);
      localStorage.setItem(qKey, String(prevIdx));
      localStorage.setItem(WIZARD_QUESTION_INDEX_KEY, String(prevIdx));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const skipQuestion = () => {
    const now = Date.now();
    if (isNavigatingRef.current || (now - lastNavTimeRef.current < 350)) {
      return;
    }

    isNavigatingRef.current = true;
    lastNavTimeRef.current = now;
    setIsNavigating(true);

    if (navTimeoutRef.current) {
      clearTimeout(navTimeoutRef.current);
    }
    navTimeoutRef.current = setTimeout(() => {
      isNavigatingRef.current = false;
      setIsNavigating(false);
    }, 350);

    setValidationError(null);
    setSlideDirection(1);
    let nextIdx = questionIndex + 1;
    if (questionIndex === 16 && (formDataRef.current.sameAsCurrentAddress || formDataRef.current.permanentAddress === formDataRef.current.currentAddress)) {
      nextIdx = 18;
    }
    if (nextIdx <= TOTAL_QUESTIONS) {
      setQuestionIndexState(nextIdx);
      const activeId = user?.id || (typeof window !== 'undefined' ? localStorage.getItem('auth_user_id') : null);
      const qKey = getWizardQuestionIndexKey(activeId);
      localStorage.setItem(qKey, String(nextIdx));
      localStorage.setItem(WIZARD_QUESTION_INDEX_KEY, String(nextIdx));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToNextStep = () => {
    if (currentStep < 8) {
      setCurrentStep((prev) => (prev + 1) as StepId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as StepId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // OTP Helpers
  const openOtpModal = (type: 'phone' | 'email', targetValue: string, autoSend: boolean = true) => {
    if (autoSend) {
      sendOtpApi(type, targetValue);
    }
    setOtpModal({ isOpen: true, type, targetValue, alreadyDispatched: !autoSend });
  };

  const closeOtpModal = () => {
    setOtpModal({ isOpen: false, type: null, targetValue: '', alreadyDispatched: false });
  };

  const verifyOtpSuccess = () => {
    if (otpModal.type === 'phone') {
      updateFormData({ contactVerified: true, verifiedPhone: otpModal.targetValue });
    } else if (otpModal.type === 'email') {
      const emailVal = (otpModal.targetValue || user?.email || '').trim().toLowerCase();
      updateFormData({
        email: emailVal,
        verifiedEmail: emailVal,
        emailVerified: true
      });
    }
    closeOtpModal();
  };

  // AI Modal Helpers
  const openAiModal = (type: 'summary' | 'hobbies' | 'expectations') => {
    setAiModal({ isOpen: true, type });
  };

  const closeAiModal = () => {
    setAiModal({ isOpen: false, type: null });
  };

  const applyAiSuggestion = (value: string | string[]) => {
    if (aiModal.type === 'summary' && typeof value === 'string') {
      updateFormData({ professionalSummary: value });
    } else if (aiModal.type === 'hobbies' && Array.isArray(value)) {
      updateFormData({ hobbies: Array.from(new Set([...(formData.hobbies || []), ...value])) });
    } else if (aiModal.type === 'expectations' && typeof value === 'string') {
      updateFormData({ otherPreferences: value });
    }
    closeAiModal();
  };

  // Determine completed steps
  const completedSteps = new Set<StepId>();
  if (formData.name && formData.gender && formData.dob) completedSteps.add(1);
  if (formData.educationList && formData.educationList.length > 0) completedSteps.add(2);
  if (formData.occupation && formData.company) completedSteps.add(3);
  if (formData.fatherName && formData.motherName) completedSteps.add(4);
  if (formData.diet && formData.hobbies && formData.hobbies.length > 0) completedSteps.add(5);
  if (formData.otherPreferences || formData.expectedEducation) completedSteps.add(6);
  if (formData.profilePictureUrl) completedSteps.add(7);
  if (completedSteps.size >= 6) completedSteps.add(8);

  const completionScore = calculateCompletionScore(formData);

  return (
    <BiodataContext.Provider
      value={{
        formData,
        updateFormData,
        resetFormData,
        currentPage,
        goToLanding,
        goToProfile,
        goToStudio,
        goToWizard,
        jumpToQuestionAndWizard,
        wizardCompleted,
        markWizardComplete,
        goToAdmin,
        goToDiscovery,
        goToInteractions,
        goToTemplates,


        moderationStatus,
        rejectionReason,
        profileId,
        slug,
        fetchMyBiodata,
        submitForModeration,

        questionIndex,
        setQuestionIndex,
        slideDirection,
        goToNextQuestion,
        goToPrevQuestion,
        skipQuestion,
        isNavigating,
        checkStepValidity: (idx: number, data?: BiodataForm) => checkStepValidity(idx, data || formDataRef.current),
        validationError,
        setValidationError,
        currentStep,
        setCurrentStep,
        goToNextStep,
        goToPrevStep,
        completionScore,
        lastSavedTime,
        isDarkMode,
        toggleDarkMode,
        otpModal,
        openOtpModal,
        closeOtpModal,
        verifyOtpSuccess,
        aiModal,
        openAiModal,
        closeAiModal,
        applyAiSuggestion,
        cropModalOpen,
        setCropModalOpen,
        tempImageSrc,
        setTempImageSrc,
        cropCallback,
        setCropCallback,
        activeFilterId,
        setActiveFilterId,
        openCropper,
        guidelineAlert,
        showGuidelineAlert,
        completedSteps,
      }}
    >
      {children}

      {/* Floating Bottom-Right Platform Guidelines Alert */}
      {guidelineAlert && (
        <div className="fixed bottom-6 right-6 z-[100060] max-w-sm sm:max-w-md p-4 rounded-2xl shadow-2xl backdrop-blur-md flex items-start gap-3 animate-toast-bottom-right bg-slate-900/95 text-white border border-rose-500/80 shadow-rose-950/40 pointer-events-auto">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
            <AlertTriangle size={18} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-tight">Platform Guidelines Alert</span>
              <span className="px-1.5 py-0.5 rounded bg-rose-500/25 text-rose-400 text-[10px] font-extrabold uppercase tracking-wider">Photo Required</span>
            </div>
            <p className="text-[11.5px] text-slate-300 leading-snug mt-1">
              {guidelineAlert.message}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setGuidelineAlert(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
            title="Dismiss"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </BiodataContext.Provider>
  );
};

export const useBiodata = () => {
  const context = useContext(BiodataContext);
  if (!context) {
    throw new Error('useBiodata must be used within a BiodataProvider');
  }
  return context;
};

