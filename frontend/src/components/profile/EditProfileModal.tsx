import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useBiodata } from '../../context/BiodataContext';
import { saveBiodataApi, deleteMyProfileApi, generateOllamaSummaryApi } from '../../services/apiService';
import { DeleteConfirmModal } from '../modals/DeleteConfirmModal';
import type { BiodataForm } from '../../types/biodata';
import { cmToFeetInches, calculateAge, normalizeDobToIso } from '../../utils/biodataHelpers';
import { cleanMobileNumber, validateMobileNumber } from '../../utils/phoneValidation';
import { isDisposableEmail, isCommonEmail, COMMON_EMAIL_ERROR_MSG } from '../../utils/disposableEmail';
import {
  validatePlaceOfBirth,
  validateDegreeName,
  validateCollegeName,
  validateOccupation,
  validateCompany,
  validateFamilyOccupation,
  validateNativePlace,
  validateHobbyName,
  validateLanguageName,
  validateExpectedAgeRange,
  validateDateOfBirth,
  normalizeHobbiesList,
  splitHobbiesString,
  KNOWN_HOBBY_NAMES,
  normalizeLanguagesList,
  POPULAR_LANGUAGES,
} from '../../utils/nameValidation';
import {
  X,
  Save,
  User,
  GraduationCap,
  Users,
  Coffee,
  Heart,
  Phone,
  Camera,
  Moon,
  Sparkles,
  Loader2,
  Plus,
  Trash2,
  AlertCircle,
  Check,
  AlertTriangle,
  CheckCircle2,
  Crop,
  Wand2,
  RefreshCw,
  Briefcase,
  Feather,
  Crown,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { CityAutocomplete } from '../common/CityAutocomplete';
import {
  transliterateIndicName,
  SUPPORTED_TRANSLATION_LANGUAGES,
} from '../../services/indicTransliterationService';

export type TabKey = 'personal' | 'astro' | 'career' | 'family' | 'lifestyle' | 'expectations' | 'contact' | 'photos';

const VALID_TABS: TabKey[] = [
  'personal',
  'astro',
  'career',
  'family',
  'lifestyle',
  'expectations',
  'contact',
  'photos',
];

const getSavedOrUrlTab = (fallback?: TabKey): TabKey => {
  if (typeof window !== 'undefined') {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = (params.get('tab') || params.get('section') || '').toLowerCase();
      if (VALID_TABS.includes(tabParam as TabKey)) {
        return tabParam as TabKey;
      }
      const saved = (localStorage.getItem('active_edit_profile_tab') || '').toLowerCase();
      if (VALID_TABS.includes(saved as TabKey)) {
        return saved as TabKey;
      }
    } catch (e) {}
  }
  return fallback && VALID_TABS.includes(fallback) ? fallback : 'personal';
};

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
  onDeleteModalChange?: (isOpen: boolean) => void;
  initialTab?: TabKey;
}

const RASHI_OPTIONS = [
  'Mesh (Aries)', 'Vrishabh (Taurus)', 'Mithun (Gemini)', 'Kark (Cancer)',
  'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrishchik (Scorpio)',
  'Dhanu (Sagittarius)', 'Makar (Capricorn)', 'Kumbh (Aquarius)', 'Meen (Pisces)',
  "Don't Know / Other"
];

const NAKSHATRA_OPTIONS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha',
  'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
  "Don't Know / Other"
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const COMPLEXION_OPTIONS = ['Very Fair', 'Fair', 'Wheatish', 'Wheatish Medium', 'Dark'];

const AI_BIO_TONES = [
  {
    id: 'warm_balanced',
    label: '🌸 Warm & Balanced',
    icon: Heart,
    selectedClass: 'bg-gradient-to-br from-rose-500 to-pink-600 text-white border-rose-500 shadow-sm ring-1 ring-rose-400/50',
    unselectedClass: 'bg-rose-50/80 border-rose-200 text-rose-900 hover:bg-rose-100/80 hover:border-rose-300',
    iconColor: 'text-rose-400/35',
  },
  {
    id: 'modern_professional',
    label: '💼 Modern Professional',
    icon: Briefcase,
    selectedClass: 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-blue-600 shadow-sm ring-1 ring-blue-400/50',
    unselectedClass: 'bg-blue-50/80 border-blue-200 text-blue-900 hover:bg-blue-100/80 hover:border-blue-300',
    iconColor: 'text-blue-400/35',
  },
  {
    id: 'traditional_cultural',
    label: '🪷 Traditional & Cultural',
    icon: Crown,
    selectedClass: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white border-amber-500 shadow-sm ring-1 ring-amber-400/50',
    unselectedClass: 'bg-amber-50/80 border-amber-200 text-amber-950 hover:bg-amber-100/80 hover:border-amber-300',
    iconColor: 'text-amber-500/35',
  },
  {
    id: 'heartfelt_direct',
    label: '❤️ Heartfelt & Direct',
    icon: Feather,
    selectedClass: 'bg-gradient-to-br from-purple-600 to-violet-700 text-white border-purple-600 shadow-sm ring-1 ring-purple-400/50',
    unselectedClass: 'bg-purple-50/80 border-purple-200 text-purple-900 hover:bg-purple-100/80 hover:border-purple-300',
    iconColor: 'text-purple-400/35',
  },
];


export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  onDeleteModalChange,
  initialTab,
}) => {
  const { formData, updateFormData, openCropper, resetFormData, goToLanding } = useBiodata();
  const [localData, setLocalData] = useState<BiodataForm>(formData);
  const [activeTab, setActiveTabState] = useState<TabKey>(() => getSavedOrUrlTab(initialTab));

  const setActiveTab = useCallback((tab: TabKey) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('active_edit_profile_tab', tab);
        const url = new URL(window.location.href);
        url.searchParams.set('tab', tab);
        window.history.replaceState(null, '', url.toString());
      } catch (e) {}
    }
  }, []);

  const handleModalClose = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete('edit');
        url.searchParams.delete('tab');
        url.searchParams.delete('section');
        window.history.replaceState(null, '', url.toString());
        localStorage.removeItem('edit_profile_open');
      } catch (e) {}
    }
    onClose();
  }, [onClose]);

  const [saving, setSaving] = useState(false);
  const [isTabDropdownOpen, setIsTabDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [newHobby, setNewHobby] = useState('');
  const [hobbyError, setHobbyError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newLanguage, setNewLanguage] = useState('');
  const [languageError, setLanguageError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [religionError, setReligionError] = useState<string | null>(null);
  const [casteError, setCasteError] = useState<string | null>(null);
  const [subCasteError, setSubCasteError] = useState<string | null>(null);
  const [gotraError, setGotraError] = useState<string | null>(null);
  const [kuldevataError, setKuldevataError] = useState<string | null>(null);
  const [fatherNameError, setFatherNameError] = useState<string | null>(null);
  const [motherNameError, setMotherNameError] = useState<string | null>(null);
  const [occupationError, setOccupationError] = useState<string | null>(null);
  const [companyError, setCompanyError] = useState<string | null>(null);
  const [fatherOccupationError, setFatherOccupationError] = useState<string | null>(null);
  const [motherOccupationError, setMotherOccupationError] = useState<string | null>(null);
  const [nativePlaceError, setNativePlaceError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [contactToError, setContactToError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [dobError, setDobError] = useState<string | null>(null);
  const [placeOfBirthError, setPlaceOfBirthError] = useState<string | null>(null);
  const [eduDegree, setEduDegree] = useState('');
  const [eduCollege, setEduCollege] = useState('');
  const [eduYear, setEduYear] = useState('');
  const [eduError, setEduError] = useState<string | null>(null);
  const [expectedAgeError, setExpectedAgeError] = useState<string | null>(null);

  // Dual-Script & Native Language States
  // Resolve native language from localData.lang or localData.motherTongue
  const resolveNativeLang = () => {
    // 1. Direct code in localData.lang or formData.lang
    const code = (localData.lang || formData.lang || '').toLowerCase().trim();
    if (code && code !== 'en') {
      const found = SUPPORTED_TRANSLATION_LANGUAGES.find((l) => l.code === code);
      if (found && found.code !== 'en') return found;
    }
    // 2. Look in motherTongue
    const mt = (localData.motherTongue || formData.motherTongue || '').toLowerCase().trim();
    if (mt && mt !== 'english') {
      const found = SUPPORTED_TRANSLATION_LANGUAGES.find(
        (l) => l.code !== 'en' && (l.name.toLowerCase() === mt || l.nativeName.toLowerCase() === mt)
      );
      if (found) return found;
    }
    return null;
  };

  const nativeLangObj = resolveNativeLang();
  const hasNativeLanguage = nativeLangObj !== null && nativeLangObj.code !== 'en';
  const nativeLangCode = nativeLangObj?.code || 'en';

  const candidateDebounceRef = useRef<any>(null);
  const fatherDebounceRef = useRef<any>(null);
  const motherDebounceRef = useRef<any>(null);
  const uncleDebounceRef = useRef<any>(null);

  const triggerCandidateTransliteration = (text: string, overrideLangCode?: string) => {
    const lCode = overrideLangCode || nativeLangCode;
    if (!text.trim() || !lCode || lCode === 'en') return;
    if (candidateDebounceRef.current) clearTimeout(candidateDebounceRef.current);
    candidateDebounceRef.current = setTimeout(async () => {
      try {
        const trans = await transliterateIndicName(text.trim(), lCode);
        if (trans && trans.trim()) {
          setLocalData((prev) => ({
            ...prev,
            nameNative: trans.trim(),
            nativeNames: { ...(prev.nativeNames || {}), [text.trim()]: trans.trim() },
          }));
        }
      } catch (e) {
        console.debug('Candidate name transliteration failed:', e);
      }
    }, 350);
  };

  const triggerFatherTransliteration = (text: string, overrideLangCode?: string) => {
    const lCode = overrideLangCode || nativeLangCode;
    if (!text.trim() || !lCode || lCode === 'en') return;
    if (fatherDebounceRef.current) clearTimeout(fatherDebounceRef.current);
    fatherDebounceRef.current = setTimeout(async () => {
      try {
        const trans = await transliterateIndicName(text.trim(), lCode);
        if (trans && trans.trim()) {
          setLocalData((prev) => ({
            ...prev,
            fatherNameNative: trans.trim(),
            nativeNames: { ...(prev.nativeNames || {}), [text.trim()]: trans.trim() },
          }));
        }
      } catch (e) {
        console.debug('Father name transliteration failed:', e);
      }
    }, 350);
  };

  const triggerMotherTransliteration = (text: string, overrideLangCode?: string) => {
    const lCode = overrideLangCode || nativeLangCode;
    if (!text.trim() || !lCode || lCode === 'en') return;
    if (motherDebounceRef.current) clearTimeout(motherDebounceRef.current);
    motherDebounceRef.current = setTimeout(async () => {
      try {
        const trans = await transliterateIndicName(text.trim(), lCode);
        if (trans && trans.trim()) {
          setLocalData((prev) => ({
            ...prev,
            motherNameNative: trans.trim(),
            nativeNames: { ...(prev.nativeNames || {}), [text.trim()]: trans.trim() },
          }));
        }
      } catch (e) {
        console.debug('Mother name transliteration failed:', e);
      }
    }, 350);
  };

  const triggerUncleTransliteration = (text: string, overrideLangCode?: string) => {
    const lCode = overrideLangCode || nativeLangCode;
    if (!text.trim() || !lCode || lCode === 'en') return;
    if (uncleDebounceRef.current) clearTimeout(uncleDebounceRef.current);
    uncleDebounceRef.current = setTimeout(async () => {
      try {
        const trans = await transliterateIndicName(text.trim(), lCode);
        if (trans && trans.trim()) {
          setLocalData((prev) => ({
            ...prev,
            maternalUncleNative: trans.trim(),
            nativeNames: { ...(prev.nativeNames || {}), [text.trim()]: trans.trim() },
          }));
        }
      } catch (e) {
        console.debug('Mama name transliteration failed:', e);
      }
    }, 350);
  };

  const handleMotherTongueChange = (code: string) => {
    const chosen = SUPPORTED_TRANSLATION_LANGUAGES.find((l) => l.code === code);
    if (!chosen || chosen.code === 'en') {
      setLocalData((prev) => ({
        ...prev,
        lang: 'en',
        motherTongue: 'English',
        nameNative: '',
        fatherNameNative: '',
        motherNameNative: '',
        maternalUncleNative: '',
      }));
    } else {
      setLocalData((prev) => ({
        ...prev,
        lang: chosen.code,
        motherTongue: chosen.name,
      }));
      if (localData.name?.trim()) {
        triggerCandidateTransliteration(localData.name, chosen.code);
      }
      if (localData.fatherName?.trim()) {
        triggerFatherTransliteration(localData.fatherName, chosen.code);
      }
      if (localData.motherName?.trim()) {
        triggerMotherTransliteration(localData.motherName, chosen.code);
      }
      if (localData.maternalUncle?.trim()) {
        triggerUncleTransliteration(localData.maternalUncle, chosen.code);
      }
    }
  };

  useEffect(() => {
    if (hasNativeLanguage) {
      if (localData.name?.trim() && !localData.nameNative?.trim()) {
        triggerCandidateTransliteration(localData.name);
      }
      if (localData.fatherName?.trim() && !localData.fatherNameNative?.trim()) {
        triggerFatherTransliteration(localData.fatherName);
      }
      if (localData.motherName?.trim() && !localData.motherNameNative?.trim()) {
        triggerMotherTransliteration(localData.motherName);
      }
      if (localData.maternalUncle?.trim() && !localData.maternalUncleNative?.trim()) {
        triggerUncleTransliteration(localData.maternalUncle);
      }
    }
  }, [hasNativeLanguage, nativeLangCode]);

  // AI Bio Inline Expansion States
  const [aiBioExpanded, setAiBioExpanded] = useState(false);
  const [aiBioTone, setAiBioTone] = useState('warm_balanced');
  const [aiBioGenerating, setAiBioGenerating] = useState(false);
  const [aiBioSource, setAiBioSource] = useState('');

  const handleGenerateAiBioInline = async () => {
    setAiBioGenerating(true);
    try {
      const res = await generateOllamaSummaryApi(
        localData,
        'llama3',
        localData.professionalSummary || undefined,
        aiBioTone
      );
      if (res?.summary) {
        const text = res.summary.trim().slice(0, 500);
        handleChange('professionalSummary', text);
        setAiBioSource(res.source || 'groq');
        setToastMessage('✨ AI Bio generated and inserted!');
        setTimeout(() => setToastMessage(null), 3500);
      }
    } catch (e) {
      console.error('Failed to generate AI bio', e);
      setToastMessage('Failed to generate AI bio. Please try again.');
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setAiBioGenerating(false);
    }
  };

  const prevIsOpenRef = useRef(false);
  const prevInitialTabRef = useRef<TabKey | undefined>(undefined);

  useEffect(() => {
    if (isOpen) {
      if (!prevIsOpenRef.current) {
        // Modal just transitioned from closed to open
        const targetTab = getSavedOrUrlTab(initialTab);
        setActiveTabState(targetTab);
        if (typeof window !== 'undefined') {
          try {
            const url = new URL(window.location.href);
            url.searchParams.set('edit', 'true');
            url.searchParams.set('tab', targetTab);
            window.history.replaceState(null, '', url.toString());
            localStorage.setItem('edit_profile_open', 'true');
            localStorage.setItem('active_edit_profile_tab', targetTab);
          } catch (e) {}
        }
        // Initialize local form data on opening
        const initial = { ...formData };
        if (initial.dob) {
          const computedAge = calculateAge(initial.dob);
          if (computedAge > 0) {
            initial.age = computedAge;
          }
        }
        setLocalData(initial);
      } else if (initialTab && initialTab !== prevInitialTabRef.current) {
        // Only update activeTab if parent explicitly changes initialTab prop
        setActiveTab(initialTab);
      }
      prevInitialTabRef.current = initialTab;

      setNameError(null);
      setReligionError(null);
      setCasteError(null);
      setSubCasteError(null);
      setGotraError(null);
      setKuldevataError(null);
      setFatherNameError(null);
      setMotherNameError(null);
      setOccupationError(null);
      setCompanyError(null);
      setFatherOccupationError(null);
      setMotherOccupationError(null);
      setNativePlaceError(null);
      setPhoneError(null);
      setEmailError(null);
      setDobError(null);
      setPlaceOfBirthError(null);
      setEduDegree('');
      setEduCollege('');
      setEduYear('');
      setEduError(null);
      setHobbyError(null);
      setLanguageError(null);
      setExpectedAgeError(null);
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    } else {
      if (prevIsOpenRef.current) {
        // Modal just closed
        if (typeof window !== 'undefined') {
          try {
            const url = new URL(window.location.href);
            url.searchParams.delete('edit');
            url.searchParams.delete('tab');
            url.searchParams.delete('section');
            window.history.replaceState(null, '', url.toString());
            localStorage.removeItem('edit_profile_open');
          } catch (e) {}
        }
      }
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, initialTab, formData, setActiveTab]);

  if (!isOpen) return null;

  const handleChange = (field: keyof BiodataForm, value: any) => {
    setLocalData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'dob') {
        const iso = normalizeDobToIso(String(value || ''));
        if (iso) {
          next.dob = iso;
          next.age = calculateAge(iso);
        } else {
          next.dob = String(value || '');
          next.age = 0;
        }
      }
      return next;
    });
  };

  const handleAddEditEducation = () => {
    const trimmed = eduDegree.trim();
    const trimmedCollege = eduCollege.trim();
    const trimmedYear = eduYear.trim();

    const degreeCheck = validateDegreeName(trimmed);
    if (!degreeCheck.isValid) {
      setEduError(degreeCheck.error);
      return;
    }

    const collegeCheck = validateCollegeName(trimmedCollege);
    if (!collegeCheck.isValid) {
      setEduError(collegeCheck.error);
      return;
    }

    const currentList = localData.educationList || [];
    const isDuplicate = currentList.some(
      (item) => (item.degree || item.qualification || '').trim().toLowerCase() === trimmed.toLowerCase()
    );

    if (isDuplicate) {
      setEduError('This qualification has already been added.');
      return;
    }

    setEduError(null);
    const newItem = {
      id: Date.now().toString(),
      degree: trimmed,
      college: trimmedCollege,
      university: '',
      passingYear: trimmedYear,
      qualification: trimmed,
      certifications: '',
    };

    const updatedList = [...currentList, newItem];
    handleChange('educationList', updatedList);
    setEduDegree('');
    setEduCollege('');
    setEduYear('');
  };

  const handleRemoveEditEducation = (id: string) => {
    setEduError(null);
    const currentList = localData.educationList || [];
    const updatedList = currentList.filter((item) => item.id !== id);
    handleChange('educationList', updatedList);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (localData.name && !/^[A-Za-z\s\-']+$/.test(localData.name)) {
      setNameError("Name should only contain letters, spaces, and hyphens");
      setToastMessage("Please fix the errors before saving.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    if (localData.dob) {
      const dobCheck = validateDateOfBirth(localData.dob, localData.gender);
      if (!dobCheck.isValid) {
        setDobError(dobCheck.error);
        setActiveTab('personal');
        setToastMessage(dobCheck.error || "Please select a valid date of birth.");
        setTimeout(() => setToastMessage(null), 3500);
        return;
      }
    }

    if (localData.placeOfBirth && localData.placeOfBirth.trim()) {
      const pobCheck = validatePlaceOfBirth(localData.placeOfBirth);
      if (!pobCheck.isValid) {
        setPlaceOfBirthError(pobCheck.error || "Please enter a valid place of birth");
        setActiveTab('personal');
        setToastMessage("Please fix the Birth Place error before saving.");
        setTimeout(() => setToastMessage(null), 3000);
        return;
      }
    }

    if (localData.religion && (/\d/.test(localData.religion) || !/^[A-Za-z\u0900-\u0D7F\s\-\'\,\.\/\(\)]+$/.test(localData.religion))) {
      setReligionError("Religion should contain letters only (numbers are not allowed)");
      setActiveTab('astro');
      setToastMessage("Please fix the Religion error before saving.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    if (localData.caste && (/\d/.test(localData.caste) || !/^[A-Za-z\u0900-\u0D7F\s\-\'\/\(\)\.\,]+$/.test(localData.caste))) {
      setCasteError("Caste / Community should contain letters only (numbers are not allowed)");
      setActiveTab('astro');
      setToastMessage("Please fix the Caste / Community error before saving.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    if (localData.subCaste && (/\d/.test(localData.subCaste) || !/^[A-Za-z\u0900-\u0D7F\s\-\'\/\(\)\.\,]+$/.test(localData.subCaste))) {
      setSubCasteError("Sub-caste should contain letters only (numbers are not allowed)");
      setActiveTab('astro');
      setToastMessage("Please fix the Sub-caste error before saving.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    if (localData.gotra && (/\d/.test(localData.gotra) || !/^[A-Za-z\u0900-\u0D7F\s\-\'\,\.\/\(\)]+$/.test(localData.gotra))) {
      setGotraError("Gotra should contain letters only (numbers are not allowed)");
      setActiveTab('astro');
      setToastMessage("Please fix the Gotra error before saving.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    if (localData.kuldevata && (/\d/.test(localData.kuldevata) || !/^[A-Za-z\u0900-\u0D7F\s\-\'\,\.\/\(\)]+$/.test(localData.kuldevata))) {
      setKuldevataError("Kuldevata / Deity should contain letters only (numbers are not allowed)");
      setActiveTab('astro');
      setToastMessage("Please fix the Kuldevata / Deity error before saving.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    if (localData.fatherName && (/\d/.test(localData.fatherName) || !/^[A-Za-z\u0900-\u0D7F\s\-\'\.]+$/.test(localData.fatherName))) {
      setFatherNameError("Father's Name should contain letters only (numbers are not allowed)");
      setActiveTab('family');
      setToastMessage("Please fix the Father's Name error before saving.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    if (localData.motherName && (/\d/.test(localData.motherName) || !/^[A-Za-z\u0900-\u0D7F\s\-\'\.]+$/.test(localData.motherName))) {
      setMotherNameError("Mother's Name should contain letters only (numbers are not allowed)");
      setActiveTab('family');
      setToastMessage("Please fix the Mother's Name error before saving.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    if (localData.occupation && localData.occupation.trim()) {
      const occCheck = validateOccupation(localData.occupation);
      if (!occCheck.isValid) {
        setOccupationError(occCheck.error || "Please enter a valid occupation");
        setActiveTab('career');
        setToastMessage("Please fix the Profession / Designation error before saving.");
        setTimeout(() => setToastMessage(null), 3000);
        return;
      }
    }

    if (localData.company && localData.company.trim()) {
      const compCheck = validateCompany(localData.company);
      if (!compCheck.isValid) {
        setCompanyError(compCheck.error || "Please enter a valid company name");
        setActiveTab('career');
        setToastMessage("Please fix the Company / Employer error before saving.");
        setTimeout(() => setToastMessage(null), 3000);
        return;
      }
    }

    if (localData.fatherOccupation && localData.fatherOccupation.trim()) {
      const fOccCheck = validateFamilyOccupation(localData.fatherOccupation, "Father's Occupation");
      if (!fOccCheck.isValid) {
        setFatherOccupationError(fOccCheck.error || "Please enter a valid occupation");
        setActiveTab('family');
        setToastMessage("Please fix the Father's Occupation error before saving.");
        setTimeout(() => setToastMessage(null), 3000);
        return;
      }
    }

    if (localData.motherOccupation && localData.motherOccupation.trim()) {
      const mOccCheck = validateFamilyOccupation(localData.motherOccupation, "Mother's Occupation");
      if (!mOccCheck.isValid) {
        setMotherOccupationError(mOccCheck.error || "Please enter a valid occupation");
        setActiveTab('family');
        setToastMessage("Please fix the Mother's Occupation error before saving.");
        setTimeout(() => setToastMessage(null), 3000);
        return;
      }
    }

    if (localData.nativePlace && localData.nativePlace.trim()) {
      const npCheck = validateNativePlace(localData.nativePlace);
      if (!npCheck.isValid) {
        setNativePlaceError(npCheck.error || "Please enter a valid native place");
        setActiveTab('family');
        setToastMessage("Please fix the Native Place error before saving.");
        setTimeout(() => setToastMessage(null), 3000);
        return;
      }
    }

    if (localData.contactNumber && localData.contactNumber.trim()) {
      const phoneValidation = validateMobileNumber(localData.contactNumber);
      if (!phoneValidation.isValid) {
        setPhoneError(phoneValidation.error || "Please enter a valid 10-digit mobile number");
        setActiveTab('contact');
        setToastMessage("Please fix the Contact Phone Number before saving.");
        setTimeout(() => setToastMessage(null), 3000);
        return;
      }
    }

    if (localData.contactTo && localData.contactTo.trim()) {
      const contactToValidation = validateMobileNumber(localData.contactTo);
      if (!contactToValidation.isValid) {
        setContactToError(contactToValidation.error || "Please enter a valid 10-digit public contact number");
        setActiveTab('contact');
        setToastMessage("Please fix the Public Contact Number before saving.");
        setTimeout(() => setToastMessage(null), 3000);
        return;
      }
    }

    if (localData.languagesKnown && localData.languagesKnown.length > 0) {
      const invalidLang = localData.languagesKnown.find((l) => !validateLanguageName(l).isValid);
      if (invalidLang) {
        setLanguageError(`"${invalidLang}" is not a valid language name.`);
        setActiveTab('lifestyle');
        setToastMessage("Please fix the Languages error before saving.");
        setTimeout(() => setToastMessage(null), 3000);
        return;
      }
    }

    if (localData.hobbies && localData.hobbies.length > 0) {
      const invalidHobby = localData.hobbies.find((h) => !validateHobbyName(h).isValid);
      if (invalidHobby) {
        setHobbyError(`"${invalidHobby}" is not a valid hobby name.`);
        setActiveTab('lifestyle');
        setToastMessage("Please fix the Hobbies error before saving.");
        setTimeout(() => setToastMessage(null), 3000);
        return;
      }
    }

    if (localData.email && localData.email.trim()) {
      const trimmedEmail = localData.email.trim();
      if (!trimmedEmail.includes('@') || !isCommonEmail(trimmedEmail)) {
        const msg = !trimmedEmail.includes('@')
          ? 'Please enter a valid email address (e.g. example@gmail.com).'
          : COMMON_EMAIL_ERROR_MSG;
        setEmailError(msg);
        setActiveTab('contact');
        setToastMessage('Please fix the Email Address before saving.');
        setTimeout(() => setToastMessage(null), 3000);
        return;
      }
    }

    const ageRangeCheck = validateExpectedAgeRange(localData.expectedAgeMin, localData.expectedAgeMax);
    if (!ageRangeCheck.isValid) {
      setExpectedAgeError(ageRangeCheck.error);
      setActiveTab('expectations');
      setToastMessage("Please fix the Expected Age error before saving.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    
    setSaving(true);
    try {
      updateFormData(localData);
      const res = await saveBiodataApi(localData);
      if (res && res.profileData) {
        updateFormData(res.profileData);
        setLocalData((prev) => ({ ...prev, ...res.profileData }));
      }
      setToastMessage('Profile updated successfully');
      if (onSaved) onSaved();
      setTimeout(() => {
        setToastMessage(null);
      }, 2500);
    } catch (err: any) {
      const msg = err.message || 'Failed to save changes. Please try again.';
      setToastMessage(msg);
      if (msg.toLowerCase().includes('face') || msg.toLowerCase().includes('photo')) {
        setActiveTab('photos');
      }
      setTimeout(() => setToastMessage(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleAddHobby = () => {
    const trimmed = newHobby.trim();
    if (!trimmed) {
      setHobbyError('Please enter a hobby name.');
      return;
    }

    const hobbiesToAdd = splitHobbiesString(trimmed);
    for (const h of hobbiesToAdd) {
      const check = validateHobbyName(h);
      if (!check.isValid) {
        setHobbyError(check.error || 'Hobby name should contain only alphabets.');
        return;
      }
    }

    const current = normalizeHobbiesList(localData.hobbies);
    const updated = [...current];
    for (const h of hobbiesToAdd) {
      if (!updated.some((item) => item.toLowerCase() === h.toLowerCase())) {
        const canonical = KNOWN_HOBBY_NAMES.find((k) => k.toLowerCase() === h.toLowerCase()) || h;
        updated.push(canonical);
      }
    }

    handleChange('hobbies', updated);
    setNewHobby('');
    setHobbyError(null);
  };

  const handleRemoveHobby = (hobby: string) => {
    const current = normalizeHobbiesList(localData.hobbies);
    handleChange('hobbies', current.filter((h) => h.toLowerCase() !== hobby.toLowerCase()));
  };

  const handleAddLanguage = () => {
    const trimmed = newLanguage.trim();
    if (!trimmed) {
      setLanguageError('Please enter a language name.');
      return;
    }
    const check = validateLanguageName(trimmed);
    if (!check.isValid) {
      setLanguageError(check.error || 'Please enter a valid language name. Numbers and special characters are not allowed.');
      return;
    }
    const current = normalizeLanguagesList(localData.languagesKnown || []);
    const existing = current.find((l) => l.toLowerCase() === trimmed.toLowerCase());
    if (existing) {
      setLanguageError(`"${existing}" is already added.`);
      return;
    }
    const canonical = POPULAR_LANGUAGES.find((k) => k.toLowerCase() === trimmed.toLowerCase()) || trimmed;
    handleChange('languagesKnown', [...current, canonical]);
    setNewLanguage('');
    setLanguageError(null);
  };

  const handleRemoveLanguage = (lang: string) => {
    const current = normalizeLanguagesList(localData.languagesKnown || []);
    handleChange('languagesKnown', current.filter((l) => l.toLowerCase() !== lang.toLowerCase()));
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const src = reader.result as string;
          openCropper(src, (croppedUrl, originalUrl, filterId) => {
            const rawSource = originalUrl || src;
            handleChange('profilePictureUrl', croppedUrl);
            handleChange('originalProfilePictureUrl', rawSource);
            handleChange('profilePhotoFilter', filterId || 'normal');
            setToastMessage('Profile photo updated! Click Save Changes to apply.');
            setTimeout(() => setToastMessage(null), 4000);
          }, src, 'normal');
        }
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleOpenCropForCurrentPhoto = () => {
    const sourceToCrop = localData.originalProfilePictureUrl || formData.originalProfilePictureUrl || localData.profilePictureUrl;
    const currentFilter = localData.profilePhotoFilter || formData.profilePhotoFilter || 'normal';
    if (sourceToCrop) {
      openCropper(sourceToCrop, (croppedUrl, originalUrl, filterId) => {
        const rawSource = originalUrl || sourceToCrop;
        handleChange('profilePictureUrl', croppedUrl);
        handleChange('originalProfilePictureUrl', rawSource);
        handleChange('profilePhotoFilter', filterId || 'normal');
        setToastMessage('Framing updated! Click Save Changes to apply.');
        setTimeout(() => setToastMessage(null), 4000);
      }, sourceToCrop, currentFilter);
    }
  };

  const tabs: { id: TabKey; label: string; icon: React.ReactNode }[] = [
    { id: 'personal', label: 'Personal Details', icon: <User size={15} /> },
    { id: 'astro', label: 'Religion & Astro', icon: <Moon size={15} /> },
    { id: 'career', label: 'Education & Career', icon: <GraduationCap size={15} /> },
    { id: 'family', label: 'Family Details', icon: <Users size={15} /> },
    { id: 'lifestyle', label: 'Lifestyle & Habits', icon: <Coffee size={15} /> },
    { id: 'expectations', label: 'Expectations & Bio', icon: <Heart size={15} /> },
    { id: 'contact', label: 'Contact Details', icon: <Phone size={15} /> },
    { id: 'photos', label: 'Profile Photos', icon: <Camera size={15} /> },
  ];

  const handleDeleteProfile = async (reason?: string, feedback?: string) => {
    await deleteMyProfileApi(reason, feedback);
    resetFormData();
    setDeleteModalOpen(false);
    onDeleteModalChange?.(false);
    onClose();
    goToLanding();
  };

  const profileNameForConfirm = (localData.name || formData.name || '').trim() || 'My Profile';
  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <>
      {createPortal(
        <div
          className={`fixed inset-0 z-[100010] flex items-center justify-center p-0 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in ${deleteModalOpen ? 'hidden pointer-events-none' : ''}`}
          onClick={onClose}
        >
          {/* Toast message */}
          {toastMessage && (
            <div className="fixed bottom-20 sm:bottom-6 right-6 z-[100006] px-5 py-2.5 rounded-full bg-white/95 text-slate-800 text-xs font-semibold shadow-xl shadow-rose-950/10 border border-rose-200/90 backdrop-blur-md flex items-center gap-2.5 animate-toast-bottom-right pointer-events-none">
              <Sparkles size={15} className="text-[#F01472] shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Main Modal Window */}
          <div
            className="bg-white rounded-none sm:rounded-3xl w-full max-w-5xl h-full sm:h-[92vh] sm:max-h-[850px] flex flex-col shadow-2xl overflow-hidden border-0 sm:border border-purple-100 relative animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-rose-100/80 flex items-center justify-between bg-gradient-to-r from-rose-50/50 via-white to-pink-50/30 sticky top-0 z-20">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-[#F01472] to-[#C80E5A] text-white flex items-center justify-center font-black shadow-md shadow-rose-500/20 shrink-0">
              <Sparkles size={16} />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-black text-gray-900 leading-tight truncate">Edit Your Biodata Profile</h2>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium truncate">Update your matrimonial biodata information anytime</p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={handleModalClose}
              className="p-1.5 sm:p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-rose-50 transition cursor-pointer"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Body: Sidebar Navigation + Form */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* Mobile Dropdown Menu (Replaces the cut-off horizontal scrolling tab bar) */}
          <div className="md:hidden p-3 bg-white border-b border-rose-100/80 relative z-30">
            <button
              type="button"
              onClick={() => setIsTabDropdownOpen(!isTabDropdownOpen)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 hover:bg-rose-50/50 border border-purple-100 flex items-center justify-between shadow-xs transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-[#F01472]">{currentTab.icon}</span>
                <span className="text-xs font-bold text-gray-900">{currentTab.label}</span>
              </div>
              <ChevronDown
                size={16}
                className={`text-gray-500 transition-transform duration-200 ${isTabDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isTabDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsTabDropdownOpen(false)}
                />
                <div className="absolute top-full left-3 right-3 mt-1.5 bg-white rounded-2xl shadow-xl border border-purple-100 p-1.5 z-50 animate-fadeIn space-y-1 max-h-72 overflow-y-auto">
                  {tabs.map((tab) => {
                    const active = activeTab === tab.id;
                    const isMissingPhotoTab = tab.id === 'photos' && !localData.profilePictureUrl;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(tab.id);
                          setIsTabDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                          active
                            ? 'bg-rose-50 text-[#F01472] border border-rose-200/80 font-black'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={active ? 'text-[#F01472]' : 'text-gray-400'}>{tab.icon}</span>
                          <span>{tab.label}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {isMissingPhotoTab && (
                            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Photo required" />
                          )}
                          {active && <Check size={14} className="text-[#F01472]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Desktop Tab Sidebar */}
          <div className="hidden md:flex md:w-64 bg-slate-50/70 border-r border-rose-100/70 p-3 flex-col gap-1 overflow-y-auto shrink-0 no-scrollbar">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              const isMissingPhotoTab = tab.id === 'photos' && !localData.profilePictureUrl;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition text-left shrink-0 cursor-pointer ${
                    active
                      ? 'bg-white text-[#F01472] shadow-sm border border-rose-100 font-black'
                      : 'text-gray-600 hover:bg-rose-50/60 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={active ? 'text-[#F01472]' : 'text-gray-400'}>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </div>
                  {isMissingPhotoTab && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 ml-1.5" title="Photo required for Discover page" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Form Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white space-y-5 sm:space-y-6">
            {/* Discover Page Notice if profile photo is missing (hidden in photos tab since photos tab has its own dedicated card) */}
            {!localData.profilePictureUrl && activeTab !== 'photos' && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/70 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-950 shadow-xs animate-fadeIn">
                <div className="flex items-start sm:items-center gap-2.5">
                  <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
                  <div className="text-xs">
                    <span className="font-black text-amber-900">Discover Page Notice:</span>{' '}
                    <span className="text-amber-800">
                      Profiles without an uploaded photo are not shown to candidates on the Discover page.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('photos')}
                  className="self-end sm:self-auto px-3 py-1.5 rounded-xl bg-[#F01472] hover:bg-[#C80E5A] text-white text-[11px] font-black transition flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
                >
                  <Camera size={13} />
                  <span>Upload Photo</span>
                </button>
              </div>
            )}
            {/* 1. PERSONAL DETAILS */}
            {activeTab === 'personal' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-gray-100 pb-2">
                  <h3 className="text-sm font-extrabold text-gray-900">Personal & Physical Details</h3>
                  <p className="text-xs text-gray-500">Basic identification, birth info, and physical appearance</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-gray-700">Full Name (English)</label>
                      <span className={`text-[10px] font-mono ${(localData.name || '').length >= 50 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                        {(localData.name || '').length}/50
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={50}
                      value={localData.name || ''}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (val.length > 50) val = val.slice(0, 50);
                        handleChange('name', val);
                        if (val && !/^[A-Za-z\s\-']+$/.test(val)) {
                          setNameError("Name should only contain letters, spaces, and hyphens");
                        } else if (val && val.length > 50) {
                          setNameError("Full Name cannot exceed 50 characters.");
                        } else {
                          setNameError(null);
                        }
                        if (hasNativeLanguage && val.trim()) {
                          triggerCandidateTransliteration(val);
                        }
                      }}
                      placeholder="e.g. Anushka Sharma"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium text-gray-900 focus:ring-2 outline-none ${nameError ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:ring-rose-500/20 focus:border-[#F01472]'}`}
                    />
                    {nameError && <p className="text-red-500 text-[10px] mt-1">{nameError}</p>}

                    {/* Dual-Script Native Candidate Name (only shown if a native language is set) */}
                    {hasNativeLanguage && (
                      <div className="mt-3">
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Name in {nativeLangObj.nativeName} ({nativeLangObj.name})
                        </label>
                        <input
                          type="text"
                          value={localData.nameNative || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setLocalData((prev) => ({
                              ...prev,
                              nameNative: val,
                              nativeNames: { ...(prev.nativeNames || {}), [(localData.name || '').trim()]: val.trim() },
                            }));
                          }}
                          placeholder={`e.g. name in ${nativeLangObj.nativeName}`}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none bg-white"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Gender</label>
                    <select
                      value={localData.gender || ''}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none bg-white"
                    >
                      <option value="">Select Gender</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>

                    {/* Mother Tongue / Native Language */}
                    <div className="mt-3">
                      <label className="block text-xs font-bold text-gray-700 mb-1">Mother Tongue / Native Language</label>
                      <select
                        value={nativeLangObj?.code || 'en'}
                        onChange={(e) => handleMotherTongueChange(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none bg-white"
                      >
                        <option value="en">English (No Native Script)</option>
                        {SUPPORTED_TRANSLATION_LANGUAGES.filter((l) => l.code !== 'en').map((l) => (
                          <option key={l.code} value={l.code}>
                            {l.nativeName} ({l.name})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      max={(() => {
                        const now = new Date();
                        const minLegalAge = localData.gender === 'Male' ? 21 : 18;
                        return `${now.getFullYear() - minLegalAge}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                      })()}
                      value={localData.dob ? localData.dob.split('T')[0] : ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleChange('dob', val);
                        if (val) {
                          const check = validateDateOfBirth(val, localData.gender);
                          setDobError(check.isValid ? null : check.error);
                        } else {
                          setDobError(null);
                        }
                      }}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium text-gray-900 focus:ring-2 outline-none bg-white transition ${
                        dobError
                          ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:ring-rose-500/20 focus:border-rose-500'
                          : 'border-gray-200 focus:ring-rose-500/20 focus:border-[#F01472]'
                      }`}
                    />
                    {dobError && (
                      <p className="mt-1 text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                        <AlertCircle size={12} className="shrink-0" />
                        <span>{dobError}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Age</label>
                    <div className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-slate-50/80 text-xs font-bold text-gray-900 flex items-center justify-between shadow-2xs">
                      <span>{localData.dob && localData.age && localData.age > 0 ? `${localData.age} Years` : (localData.dob ? `${calculateAge(localData.dob)} Years` : 'Select DOB to compute')}</span>
                      <span className="text-[10px] font-bold text-rose-500 bg-rose-50 border border-rose-200/60 px-2 py-0.5 rounded-md">Auto-calculated</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Birth Place (City & State)</label>
                    <CityAutocomplete
                      value={localData.placeOfBirth || ''}
                      onChange={(val) => {
                        handleChange('placeOfBirth', val);
                        if (val && val.trim()) {
                          const res = validatePlaceOfBirth(val);
                          setPlaceOfBirthError(res.isValid ? null : res.error);
                        } else {
                          setPlaceOfBirthError(null);
                        }
                      }}
                      placeholder="Search city of birth (e.g. Pune, Maharashtra)..."
                      error={placeOfBirthError}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Birth Time</label>
                    <input
                      type="time"
                      value={localData.timeOfBirth || ''}
                      onChange={(e) => handleChange('timeOfBirth', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Height (cm) — {localData.heightCm ? cmToFeetInches(localData.heightCm) : ''}
                    </label>
                    <input
                      type="number"
                      min={120}
                      max={240}
                      value={localData.heightCm || ''}
                      onChange={(e) => handleChange('heightCm', parseInt(e.target.value) || 0)}
                      placeholder="e.g. 165"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      min={30}
                      max={200}
                      value={localData.weightKg || ''}
                      onChange={(e) => handleChange('weightKg', parseInt(e.target.value) || 0)}
                      placeholder="e.g. 65"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Marital Status</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'].map((status) => {
                        const isSelected = (localData.maritalStatus || 'Never Married') === status;
                        return (
                          <button
                            key={status}
                            type="button"
                            onClick={() => handleChange('maritalStatus', status)}
                            className={`px-3 py-2 rounded-xl text-xs border transition-all cursor-pointer flex items-center justify-center ${
                              isSelected
                                ? 'bg-[#FFF0F6] border-[#F01472] text-[#C80E5A] ring-1 ring-[#F01472]/30 shadow-2xs font-bold'
                                : 'bg-white border-gray-200 text-gray-800 hover:border-rose-300 hover:text-gray-950 hover:bg-rose-50/20 font-medium'
                            }`}
                          >
                            <span className={isSelected ? 'text-[#C80E5A] font-bold' : 'text-gray-800 font-medium'}>{status}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Complexion</label>
                    <select
                      value={localData.complexion || ''}
                      onChange={(e) => handleChange('complexion', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none bg-white"
                    >
                      <option value="">Select Complexion</option>
                      {COMPLEXION_OPTIONS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Blood Group</label>
                    <select
                      value={localData.bloodGroup || ''}
                      onChange={(e) => handleChange('bloodGroup', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none bg-white"
                    >
                      <option value="">Select Blood Group</option>
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 2. ASTRO & RELIGION */}
            {activeTab === 'astro' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-gray-100 pb-2">
                  <h3 className="text-sm font-extrabold text-gray-900">Religion & Astrological Info</h3>
                  <p className="text-xs text-gray-500">Horoscope, community, and astrological compatibility parameters</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Religion</label>
                    <input
                      type="text"
                      value={localData.religion || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleChange('religion', val);
                        if (val && /\d/.test(val)) {
                          setReligionError('Religion should contain letters only (numbers are not allowed)');
                        } else if (val && !/^[A-Za-z\u0900-\u0D7F\s\-\'\,\.\/\(\)]+$/.test(val)) {
                          setReligionError('Religion should contain valid alphabetical characters only');
                        } else {
                          setReligionError(null);
                        }
                      }}
                      placeholder="e.g. Hindu / Jain / Sikh"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium text-gray-900 focus:ring-2 outline-none transition ${
                        religionError
                          ? 'border-red-500 bg-red-50/20 focus:ring-red-500/20 focus:border-red-500'
                          : 'border-gray-200 focus:ring-rose-500/20 focus:border-[#F01472]'
                      }`}
                    />
                    {religionError && (
                      <p className="text-red-500 text-[10px] mt-1 font-semibold animate-fadeIn">{religionError}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Caste / Community</label>
                    <input
                      type="text"
                      value={localData.caste || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleChange('caste', val);
                        if (val && /\d/.test(val)) {
                          setCasteError('Caste / Community should contain letters only (numbers are not allowed)');
                        } else if (val && !/^[A-Za-z\u0900-\u0D7F\s\-\'\/\(\)\.\,]+$/.test(val)) {
                          setCasteError('Caste / Community should contain valid alphabetical characters only');
                        } else {
                          setCasteError(null);
                        }
                      }}
                      placeholder="e.g. Maratha / Brahmin"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium text-gray-900 focus:ring-2 outline-none transition ${
                        casteError
                          ? 'border-red-500 bg-red-50/20 focus:ring-red-500/20 focus:border-red-500'
                          : 'border-gray-200 focus:ring-rose-500/20 focus:border-[#F01472]'
                      }`}
                    />
                    {casteError && (
                      <p className="text-red-500 text-[10px] mt-1 font-semibold animate-fadeIn">{casteError}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Sub-Caste</label>
                    <input
                      type="text"
                      value={localData.subCaste || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleChange('subCaste', val);
                        if (val && /\d/.test(val)) {
                          setSubCasteError('Sub-caste should contain letters only (numbers are not allowed)');
                        } else if (val && !/^[A-Za-z\u0900-\u0D7F\s\-\'\/\(\)\.\,]+$/.test(val)) {
                          setSubCasteError('Sub-caste should contain valid alphabetical characters only');
                        } else {
                          setSubCasteError(null);
                        }
                      }}
                      placeholder="e.g. 96 Kuli"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium text-gray-900 focus:ring-2 outline-none transition ${
                        subCasteError
                          ? 'border-red-500 bg-red-50/20 focus:ring-red-500/20 focus:border-red-500'
                          : 'border-gray-200 focus:ring-rose-500/20 focus:border-[#F01472]'
                      }`}
                    />
                    {subCasteError && (
                      <p className="text-red-500 text-[10px] mt-1 font-semibold animate-fadeIn">{subCasteError}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Gotra</label>
                    <input
                      type="text"
                      value={localData.gotra || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleChange('gotra', val);
                        if (val && /\d/.test(val)) {
                          setGotraError('Gotra should contain letters only (numbers are not allowed)');
                        } else if (val && !/^[A-Za-z\u0900-\u0D7F\s\-\'\,\.\/\(\)]+$/.test(val)) {
                          setGotraError('Gotra should contain valid alphabetical characters only');
                        } else {
                          setGotraError(null);
                        }
                      }}
                      placeholder="e.g. Kashyap"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium text-gray-900 focus:ring-2 outline-none transition ${
                        gotraError
                          ? 'border-red-500 bg-red-50/20 focus:ring-red-500/20 focus:border-red-500'
                          : 'border-gray-200 focus:ring-rose-500/20 focus:border-[#F01472]'
                      }`}
                    />
                    {gotraError && (
                      <p className="text-red-500 text-[10px] mt-1 font-semibold animate-fadeIn">{gotraError}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Rashi (Moon Sign)</label>
                    <select
                      value={localData.rashi || ''}
                      onChange={(e) => handleChange('rashi', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none bg-white"
                    >
                      <option value="">Select Rashi</option>
                      {RASHI_OPTIONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Nakshatra</label>
                    <select
                      value={localData.nakshatra || ''}
                      onChange={(e) => handleChange('nakshatra', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none bg-white"
                    >
                      <option value="">Select Nakshatra</option>
                      {NAKSHATRA_OPTIONS.map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Kuldevata / Deity</label>
                    <input
                      type="text"
                      value={localData.kuldevata || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleChange('kuldevata', val);
                        if (val && /\d/.test(val)) {
                          setKuldevataError('Kuldevata / Deity should contain letters only (numbers are not allowed)');
                        } else if (val && !/^[A-Za-z\u0900-\u0D7F\s\-\'\,\.\/\(\)]+$/.test(val)) {
                          setKuldevataError('Kuldevata / Deity should contain valid alphabetical characters only');
                        } else {
                          setKuldevataError(null);
                        }
                      }}
                      placeholder="e.g. Khandoba / Bhavani Mata"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium text-gray-900 focus:ring-2 outline-none transition ${
                        kuldevataError
                          ? 'border-red-500 bg-red-50/20 focus:ring-red-500/20 focus:border-red-500'
                          : 'border-gray-200 focus:ring-rose-500/20 focus:border-[#F01472]'
                      }`}
                    />
                    {kuldevataError && (
                      <p className="text-red-500 text-[10px] mt-1 font-semibold animate-fadeIn">{kuldevataError}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Manglik Status</label>
                    <select
                      value={localData.manglik || 'No'}
                      onChange={(e) => handleChange('manglik', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none bg-white"
                    >
                      <option value="No">No (Non-Manglik)</option>
                      <option value="Yes">Yes (Manglik)</option>
                      <option value="Anshik">Anshik (Partial)</option>
                      <option value="Don't Know">Don't Know</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 3. EDUCATION & CAREER */}
            {activeTab === 'career' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-gray-100 pb-2">
                  <h3 className="text-sm font-extrabold text-gray-900">Education & Professional Career</h3>
                  <p className="text-xs text-gray-500">Academic qualifications, current employment, and financial details</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Educational Qualifications List & Add Form */}
                <div className="sm:col-span-2 space-y-3 bg-gray-50/70 p-3.5 rounded-2xl border border-gray-200/80">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-gray-700">
                      Educational Qualifications ({localData.educationList?.length || 0})
                    </label>
                  </div>

                  {localData.educationList && localData.educationList.length > 0 && (
                    <div className="space-y-2">
                      {localData.educationList.map((item) => {
                        const details = [item.college, item.passingYear]
                          .map((s) => (s || '').replace(/^\(\s*\)$/, '').trim())
                          .filter(Boolean)
                          .join(' · ');
                        return (
                          <div
                            key={item.id}
                            className="p-2.5 bg-white border border-gray-200 rounded-xl flex items-center justify-between shadow-2xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-[#F01472] shrink-0">
                                <GraduationCap size={15} />
                              </div>
                              <div className="min-w-0">
                                <span className="block font-bold text-gray-900 text-xs truncate">
                                  {item.degree || item.qualification || 'Degree'}
                                </span>
                                {details ? (
                                  <span className="block text-[10px] text-gray-500 font-medium mt-0.5">
                                    {details}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveEditEducation(item.id)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer shrink-0"
                              title="Remove qualification"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Add New Qualification Row */}
                  <div className="pt-2 border-t border-gray-200/60 space-y-2">
                    <span className="text-[11px] font-bold text-gray-600 block">Add Qualification</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={eduDegree}
                        onChange={(e) => {
                          setEduDegree(e.target.value);
                          if (eduError) setEduError(null);
                        }}
                        placeholder="Degree (e.g. B.Tech / MBA)"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none bg-white"
                      />
                      <input
                        type="text"
                        value={eduCollege}
                        onChange={(e) => {
                          setEduCollege(e.target.value);
                          if (eduError) setEduError(null);
                        }}
                        placeholder="College / Institute"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none bg-white"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={eduYear}
                          onChange={(e) => {
                            setEduYear(e.target.value);
                            if (eduError) setEduError(null);
                          }}
                          placeholder="Year (e.g. 2022)"
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none bg-white"
                        />
                        <button
                          type="button"
                          onClick={handleAddEditEducation}
                          className="px-3.5 py-2 bg-rose-50 border border-rose-200 text-[#F01472] font-bold text-xs rounded-xl hover:bg-rose-100 transition-colors flex items-center justify-center gap-1 cursor-pointer shrink-0"
                        >
                          <Plus size={14} />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>

                    {eduError && (
                      <div className="flex items-center gap-1.5 p-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-lg animate-fadeIn">
                        <AlertCircle size={14} className="shrink-0 text-rose-500" />
                        <span>{eduError}</span>
                      </div>
                    )}
                  </div>
                </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Profession / Designation</label>
                    <input
                      type="text"
                      value={localData.occupation || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleChange('occupation', val);
                        const check = validateOccupation(val);
                        setOccupationError(check.isValid ? null : check.error);
                      }}
                      placeholder="e.g. Senior Software Engineer / Doctor"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium text-gray-900 focus:ring-2 outline-none transition ${
                        occupationError
                          ? 'border-red-500 bg-red-50/20 focus:ring-red-500/20 focus:border-red-500'
                          : 'border-gray-200 focus:ring-rose-500/20 focus:border-[#F01472]'
                      }`}
                    />
                    {occupationError && (
                      <p className="text-red-500 text-[10px] mt-1 font-semibold animate-fadeIn">{occupationError}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Company / Employer Name</label>
                    <input
                      type="text"
                      value={localData.company || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleChange('company', val);
                        const check = validateCompany(val);
                        setCompanyError(check.isValid ? null : check.error);
                      }}
                      placeholder="e.g. Microsoft / TCS / Apollo Hospitals"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium text-gray-900 focus:ring-2 outline-none transition ${
                        companyError
                          ? 'border-red-500 bg-red-50/20 focus:ring-red-500/20 focus:border-red-500'
                          : 'border-gray-200 focus:ring-rose-500/20 focus:border-[#F01472]'
                      }`}
                    />
                    {companyError && (
                      <p className="text-red-500 text-[10px] mt-1 font-semibold animate-fadeIn">{companyError}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Annual Income</label>
                    <input
                      type="text"
                      value={localData.income || localData.salaryRange || ''}
                      onChange={(e) => {
                        handleChange('income', e.target.value);
                        handleChange('salaryRange', e.target.value);
                      }}
                      placeholder="e.g. ₹ 22 LPA / ₹ 15–20 Lakhs"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Work Mode</label>
                    <select
                      value={localData.workMode || ''}
                      onChange={(e) => handleChange('workMode', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none bg-white"
                    >
                      <option value="">Select Work Mode</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Office">In-Office</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 4. FAMILY DETAILS */}
            {activeTab === 'family' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-gray-100 pb-2">
                  <h3 className="text-sm font-extrabold text-gray-900">Family Background</h3>
                  <p className="text-xs text-gray-500">Parents, siblings, family structure, and roots</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Father's Name</label>
                    <input
                      type="text"
                      value={localData.fatherName || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleChange('fatherName', val);
                        if (val && /\d/.test(val)) {
                          setFatherNameError("Father's Name should contain letters only (numbers are not allowed)");
                        } else if (val && !/^[A-Za-z\u0900-\u0D7F\s\-\'\.]+$/.test(val)) {
                          setFatherNameError("Father's Name should contain valid letters only");
                        } else {
                          setFatherNameError(null);
                        }
                        if (hasNativeLanguage && val.trim()) {
                          triggerFatherTransliteration(val);
                        }
                      }}
                      placeholder="Father's full name"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium text-gray-900 focus:ring-2 outline-none transition ${
                        fatherNameError
                          ? 'border-red-500 bg-red-50/20 focus:ring-red-500/20 focus:border-red-500'
                          : 'border-gray-200 focus:ring-rose-500/20 focus:border-[#F01472]'
                      }`}
                    />
                    {fatherNameError && (
                      <p className="text-red-500 text-[10px] mt-1 font-semibold animate-fadeIn">{fatherNameError}</p>
                    )}

                    {/* Dual-Script Native Father Name (only shown if a native language is set) */}
                    {hasNativeLanguage && (
                      <div className="mt-3">
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Father's Name in {nativeLangObj.nativeName}
                        </label>
                        <input
                          type="text"
                          value={localData.fatherNameNative || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setLocalData((prev) => ({
                              ...prev,
                              fatherNameNative: val,
                              nativeNames: { ...(prev.nativeNames || {}), [(localData.fatherName || '').trim()]: val.trim() },
                            }));
                          }}
                          placeholder={`e.g. father's name in ${nativeLangObj.nativeName}`}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none bg-white"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Father's Occupation</label>
                    <input
                      type="text"
                      value={localData.fatherOccupation || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleChange('fatherOccupation', val);
                        const check = validateFamilyOccupation(val, "Father's Occupation");
                        setFatherOccupationError(check.isValid ? null : check.error);
                      }}
                      placeholder="e.g. Retired Govt Officer / Business"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium text-gray-900 focus:ring-2 outline-none transition ${
                        fatherOccupationError
                          ? 'border-red-500 bg-red-50/20 focus:ring-red-500/20 focus:border-red-500'
                          : 'border-gray-200 focus:ring-rose-500/20 focus:border-[#F01472]'
                      }`}
                    />
                    {fatherOccupationError && (
                      <p className="text-red-500 text-[10px] mt-1 font-semibold animate-fadeIn">{fatherOccupationError}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Mother's Name</label>
                    <input
                      type="text"
                      value={localData.motherName || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleChange('motherName', val);
                        if (val && /\d/.test(val)) {
                          setMotherNameError("Mother's Name should contain letters only (numbers are not allowed)");
                        } else if (val && !/^[A-Za-z\u0900-\u0D7F\s\-\'\.]+$/.test(val)) {
                          setMotherNameError("Mother's Name should contain valid letters only");
                        } else {
                          setMotherNameError(null);
                        }
                        if (hasNativeLanguage && val.trim()) {
                          triggerMotherTransliteration(val);
                        }
                      }}
                      placeholder="Mother's full name"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium text-gray-900 focus:ring-2 outline-none transition ${
                        motherNameError
                          ? 'border-red-500 bg-red-50/20 focus:ring-red-500/20 focus:border-red-500'
                          : 'border-gray-200 focus:ring-rose-500/20 focus:border-[#F01472]'
                      }`}
                    />
                    {motherNameError && (
                      <p className="text-red-500 text-[10px] mt-1 font-semibold animate-fadeIn">{motherNameError}</p>
                    )}

                    {/* Dual-Script Native Mother Name (only shown if a native language is set) */}
                    {hasNativeLanguage && (
                      <div className="mt-3">
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Mother's Name in {nativeLangObj.nativeName}
                        </label>
                        <input
                          type="text"
                          value={localData.motherNameNative || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setLocalData((prev) => ({
                              ...prev,
                              motherNameNative: val,
                              nativeNames: { ...(prev.nativeNames || {}), [(localData.motherName || '').trim()]: val.trim() },
                            }));
                          }}
                          placeholder={`e.g. mother's name in ${nativeLangObj.nativeName}`}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none bg-white"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Mother's Occupation</label>
                    <input
                      type="text"
                      value={localData.motherOccupation || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleChange('motherOccupation', val);
                        const check = validateFamilyOccupation(val, "Mother's Occupation");
                        setMotherOccupationError(check.isValid ? null : check.error);
                      }}
                      placeholder="e.g. Homemaker / Teacher"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium text-gray-900 focus:ring-2 outline-none transition ${
                        motherOccupationError
                          ? 'border-red-500 bg-red-50/20 focus:ring-red-500/20 focus:border-red-500'
                          : 'border-gray-200 focus:ring-rose-500/20 focus:border-[#F01472]'
                      }`}
                    />
                    {motherOccupationError && (
                      <p className="text-red-500 text-[10px] mt-1 font-semibold animate-fadeIn">{motherOccupationError}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Brothers Details</label>
                    <input
                      type="text"
                      value={localData.brotherDetails || ''}
                      onChange={(e) => handleChange('brotherDetails', e.target.value)}
                      placeholder="e.g. 1 Elder Brother (Married, Software Engineer)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Sisters Details</label>
                    <input
                      type="text"
                      value={localData.sisterDetails || ''}
                      onChange={(e) => handleChange('sisterDetails', e.target.value)}
                      placeholder="e.g. 1 Younger Sister (Studying MBBS)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Family Type</label>
                    <select
                      value={localData.familyType || ''}
                      onChange={(e) => handleChange('familyType', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none bg-white"
                    >
                      <option value="">Select Family Type</option>
                      <option value="Nuclear">Nuclear Family</option>
                      <option value="Joint">Joint Family</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Native Place / Hometown (City & State)</label>
                    <CityAutocomplete
                      value={localData.nativePlace || ''}
                      onChange={(val) => {
                        handleChange('nativePlace', val);
                        const check = validateNativePlace(val);
                        setNativePlaceError(check.isValid ? null : check.error);
                      }}
                      placeholder="Search native city (e.g. Satara, Maharashtra)..."
                      error={nativePlaceError}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Maternal Uncle (Mama)</label>
                    <input
                      type="text"
                      value={localData.maternalUncle || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleChange('maternalUncle', val);
                        if (hasNativeLanguage && val.trim()) {
                          triggerUncleTransliteration(val);
                        }
                      }}
                      placeholder="e.g. Anil Deshmukh (Sangli)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none"
                    />

                    {/* Dual-Script Native Mama Name (only shown if a native language is set) */}
                    {hasNativeLanguage && (
                      <div className="mt-3">
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Mama's Name in {nativeLangObj.nativeName}
                        </label>
                        <input
                          type="text"
                          value={localData.maternalUncleNative || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setLocalData((prev) => ({
                              ...prev,
                              maternalUncleNative: val,
                              nativeNames: { ...(prev.nativeNames || {}), [(localData.maternalUncle || '').trim()]: val.trim() },
                            }));
                          }}
                          placeholder={`e.g. mama's name in ${nativeLangObj.nativeName}`}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none bg-white"
                        />
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Relations / Notable Relatives</label>
                    <textarea
                      rows={2}
                      value={localData.relations || ''}
                      onChange={(e) => handleChange('relations', e.target.value)}
                      placeholder="e.g. Patil, Shinde, Jadhav families — well-known in community"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 5. LIFESTYLE & HABITS */}
            {activeTab === 'lifestyle' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-gray-100 pb-2">
                  <h3 className="text-sm font-extrabold text-gray-900">Lifestyle, Habits & Hobbies</h3>
                  <p className="text-xs text-gray-500">Diet, routines, recreational interests, and languages</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Diet Preference</label>
                    <select
                      value={localData.diet || ''}
                      onChange={(e) => handleChange('diet', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none bg-white"
                    >
                      <option value="">Select Diet</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Eggetarian">Eggetarian</option>
                      <option value="Non Veg">Non-Vegetarian</option>
                      <option value="Vegan">Vegan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Smoking</label>
                    <select
                      value={localData.smoking === 'No' ? 'Never' : (localData.smoking || '')}
                      onChange={(e) => handleChange('smoking', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none bg-white"
                    >
                      <option value="">Select option</option>
                      <option value="Never">No / Never</option>
                      <option value="Occasionally">Occasionally</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Drinking</label>
                    <select
                      value={localData.drinking === 'No' ? 'Never' : (localData.drinking || '')}
                      onChange={(e) => handleChange('drinking', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none bg-white"
                    >
                      <option value="">Select option</option>
                      <option value="Never">No / Never</option>
                      <option value="Socially">Socially</option>
                      <option value="Frequently">Frequently</option>
                    </select>
                  </div>
                </div>

                {/* Hobbies chips */}
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold text-gray-700">Hobbies & Interests</label>
                  <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 bg-slate-50 rounded-xl border border-gray-200">
                    {normalizeHobbiesList(localData.hobbies).map((h) => (
                      <span
                        key={h}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white text-purple-900 border border-purple-200 shadow-2xs"
                      >
                        {h}
                        <button
                          type="button"
                          onClick={() => handleRemoveHobby(h)}
                          className="hover:text-rose-600 cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    {normalizeHobbiesList(localData.hobbies).length === 0 && (
                      <span className="text-xs text-gray-400 italic">No hobbies added yet</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={50}
                      value={newHobby}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val.length > 50) {
                          setNewHobby(val.slice(0, 50));
                          setHobbyError('Hobby name cannot exceed 50 characters.');
                          return;
                        }
                        if (val.trim()) {
                          const check = validateHobbyName(val.trim());
                          if (!check.isValid) {
                            setHobbyError(check.error || 'Hobby name should contain only alphabets.');
                          } else if (hobbyError) {
                            setHobbyError(null);
                          }
                        } else if (hobbyError) {
                          setHobbyError(null);
                        }
                        setNewHobby(val);
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddHobby())}
                      placeholder="Add hobby (e.g. Classical Dance, Reading, Travel)"
                      className={`flex-1 px-3.5 py-2 rounded-xl border text-xs font-medium text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none transition-all ${
                        hobbyError ? '!border-red-500 !bg-red-50/20' : 'border-gray-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleAddHobby}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-900 cursor-pointer flex items-center gap-1"
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>
                  {hobbyError && (
                    <div className="flex items-center gap-1.5 text-xs text-red-600 font-semibold pl-1 animate-fadeIn">
                      <AlertCircle size={13} className="shrink-0 text-red-500" />
                      <span>{hobbyError}</span>
                    </div>
                  )}

                  {/* Quick popular hobby suggestion pills */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-bold text-gray-500">Quick Suggestions</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['Reading', 'Traveling', 'Cooking', 'Fitness & Yoga', 'Music & Guitar', 'Photography', 'Trekking', 'Gaming'].map((hobby) => {
                        const isSel = normalizeHobbiesList(localData.hobbies).some((item) => item.toLowerCase() === hobby.toLowerCase());
                        return (
                          <button
                            key={hobby}
                            type="button"
                            onClick={() => {
                              const curr = normalizeHobbiesList(localData.hobbies);
                              if (isSel) {
                                handleChange('hobbies', curr.filter((h) => h.toLowerCase() !== hobby.toLowerCase()));
                              } else {
                                handleChange('hobbies', [...curr, hobby]);
                              }
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                              isSel
                                ? 'bg-rose-100/80 text-[#C80E5A] border-rose-300 font-extrabold shadow-2xs'
                                : 'bg-white text-gray-600 hover:bg-rose-50/50 border-gray-200 shadow-2xs'
                            }`}
                          >
                            {isSel ? <Check size={11} className="text-[#F01472]" /> : <Plus size={11} className="text-gray-400" />}
                            <span>{hobby}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Languages */}
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold text-gray-700">Languages Known</label>
                  <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 bg-slate-50 rounded-xl border border-gray-200">
                    {(localData.languagesKnown || []).map((lang) => (
                      <span
                        key={lang}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white text-rose-900 border border-rose-200 shadow-2xs"
                      >
                        {lang}
                        <button
                          type="button"
                          onClick={() => handleRemoveLanguage(lang)}
                          className="hover:text-rose-600 cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    {(!localData.languagesKnown || localData.languagesKnown.length === 0) && (
                      <span className="text-xs text-gray-400 italic">No languages added yet</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={50}
                      value={newLanguage}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val.length > 50) {
                          setNewLanguage(val.slice(0, 50));
                          setLanguageError('Language name cannot exceed 50 characters.');
                          return;
                        }
                        if (val.trim()) {
                          const check = validateLanguageName(val.trim());
                          if (!check.isValid) {
                            setLanguageError(check.error || 'Please enter a valid language name. Numbers and special characters are not allowed.');
                          } else if (languageError) {
                            setLanguageError(null);
                          }
                        } else if (languageError) {
                          setLanguageError(null);
                        }
                        setNewLanguage(val);
                      }}
                      onKeyDown={(e) => {
                        if (/\d/.test(e.key)) {
                          e.preventDefault();
                          setLanguageError('Please enter a valid language name. Numbers and special characters are not allowed.');
                          return;
                        }
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddLanguage();
                        }
                      }}
                      placeholder="Add language (e.g. Marathi, Hindi, English)"
                      className={`flex-1 px-3.5 py-2 rounded-xl border text-xs font-medium text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none transition-all ${
                        languageError ? '!border-red-500 !bg-red-50/20' : 'border-gray-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleAddLanguage}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-900 cursor-pointer flex items-center gap-1"
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>
                  {languageError && (
                    <div className="flex items-center gap-1.5 text-xs text-red-600 font-semibold pl-1 animate-fadeIn">
                      <AlertCircle size={13} className="shrink-0 text-red-500" />
                      <span>{languageError}</span>
                    </div>
                  )}

                  {/* Quick popular language suggestion pills */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-bold text-gray-500">Quick Suggestions</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['English', 'Hindi', 'Marathi', 'Gujarati', 'Punjabi', 'Bengali', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Sindhi', 'Urdu'].map((lang) => {
                        const curr = normalizeLanguagesList(localData.languagesKnown || []);
                        const isSel = curr.some((l) => l.toLowerCase() === lang.toLowerCase());
                        return (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => {
                              if (isSel) {
                                handleChange('languagesKnown', curr.filter((l) => l.toLowerCase() !== lang.toLowerCase()));
                              } else {
                                handleChange('languagesKnown', [...curr, lang]);
                              }
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                              isSel
                                ? 'bg-rose-100/80 text-[#C80E5A] border-rose-300 font-extrabold shadow-2xs'
                                : 'bg-white text-gray-600 hover:bg-rose-50/50 border-gray-200 shadow-2xs'
                            }`}
                          >
                            {isSel ? <Check size={11} className="text-[#F01472]" /> : <Plus size={11} className="text-gray-400" />}
                            <span>{lang}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. EXPECTATIONS & BIO */}
            {activeTab === 'expectations' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-gray-100 pb-2">
                  <h3 className="text-sm font-extrabold text-gray-900">About Me & Partner Expectations</h3>
                  <p className="text-xs text-gray-500">Personal summary bio and companion expectations</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-gray-700">About Me (Bio Summary)</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setAiBioExpanded((prev) => !prev)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold shadow-2xs transition-all duration-200 cursor-pointer ${
                          aiBioExpanded
                            ? 'bg-rose-100/90 text-[#C80E5A] border border-rose-300 ring-1 ring-rose-300/50'
                            : 'bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 text-[#F01472] border border-rose-200 hover:scale-[1.02] active:scale-95'
                        }`}
                      >
                        <Wand2 size={12} className={`text-[#F01472] ${aiBioExpanded ? '' : 'animate-pulse'}`} />
                        <span>{aiBioExpanded ? 'Hide AI Options' : 'AI Generate Bio'}</span>
                        {aiBioExpanded ? <ChevronUp size={12} className="text-[#C80E5A]" /> : <ChevronDown size={12} className="text-rose-400" />}
                      </button>
                      <span className={`text-[11px] font-medium ${(localData.professionalSummary || '').length >= 500 ? 'text-amber-600 font-semibold' : 'text-gray-400'}`}>
                        {(localData.professionalSummary || '').length}/500
                      </span>
                    </div>
                  </div>

                  {/* Smooth Inline Expandable AI Bio Options Card */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      aiBioExpanded ? 'max-h-72 opacity-100 mb-2.5' : 'max-h-0 opacity-0 mb-0 pointer-events-none'
                    }`}
                  >
                    <div className="bg-gradient-to-br from-rose-50/80 via-pink-50/50 to-purple-50/40 border border-rose-200/90 rounded-2xl p-3.5 space-y-2.5 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                          <Wand2 size={12} className="text-[#F01472]" />
                          Choose Writing Tone
                        </span>
                        {aiBioSource && (
                          <span className="text-[10px] text-gray-500 font-semibold bg-white/90 px-2 py-0.5 rounded-full border border-rose-200">
                            {aiBioSource === 'groq' ? '⚡ Groq Cloud AI' : '🤖 Smart Engine'}
                          </span>
                        )}
                      </div>

                      {/* Tone Chips */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {AI_BIO_TONES.map((t) => {
                          const Icon = t.icon;
                          const isSelected = aiBioTone === t.id;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setAiBioTone(t.id)}
                              className={`relative overflow-hidden group p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer min-h-[50px] flex items-center ${
                                isSelected ? t.selectedClass : t.unselectedClass
                              }`}
                            >
                              <span className="relative z-10 text-[11px] sm:text-xs font-bold leading-tight pr-5">
                                {t.label}
                              </span>
                              <div className="absolute -right-2.5 -bottom-2.5 pointer-events-none transition-transform duration-300 group-hover:scale-110">
                                <Icon
                                  size={46}
                                  strokeWidth={1.5}
                                  className={`${isSelected ? 'text-white/20' : t.iconColor} rotate-[-12deg]`}
                                />
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center justify-between pt-1 border-t border-rose-100">
                        <span className="text-[10.5px] text-gray-500 font-medium">
                          Crafts a concise ~35 word matrimonial intro directly into the box below.
                        </span>
                        <button
                          type="button"
                          onClick={handleGenerateAiBioInline}
                          disabled={aiBioGenerating}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#F01472] to-[#C80E5A] hover:from-rose-600 hover:to-rose-700 text-white font-extrabold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
                        >
                          {aiBioGenerating ? (
                            <RefreshCw size={12} className="animate-spin" />
                          ) : (
                            <Sparkles size={12} />
                          )}
                          <span>{aiBioGenerating ? 'Writing with AI...' : localData.professionalSummary ? 'Regenerate Bio' : 'Generate Bio'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    maxLength={500}
                    value={localData.professionalSummary || ''}
                    onChange={(e) => handleChange('professionalSummary', e.target.value.slice(0, 500))}
                    placeholder="Briefly describe your personality, values, and passions..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none resize-y"
                  />
                  {(localData.professionalSummary || '').length >= 500 && (
                    <p className="text-[11px] text-amber-600 mt-0.5">Maximum character limit reached (500 characters).</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-gray-700">Partner Expectations</label>
                    <span className={`text-[11px] font-medium ${(localData.otherPreferences || '').length >= 500 ? 'text-amber-600 font-semibold' : 'text-gray-400'}`}>
                      {(localData.otherPreferences || '').length}/500
                    </span>
                  </div>

                  <textarea
                    rows={3}
                    maxLength={500}
                    value={localData.otherPreferences || ''}
                    onChange={(e) => handleChange('otherPreferences', e.target.value.slice(0, 500))}
                    placeholder="Seeking a grounded, family-oriented partner with mutual respect..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none resize-y"
                  />
                  {(localData.otherPreferences || '').length >= 500 && (
                    <p className="text-[11px] text-amber-600 mt-0.5">Maximum character limit reached (500 characters).</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Expected Age (Min – Max)</label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          min={18}
                          max={80}
                          value={localData.expectedAgeMin !== undefined && localData.expectedAgeMin !== null && localData.expectedAgeMin !== 0 ? localData.expectedAgeMin : ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            const newMin = val === '' ? '' : parseInt(val, 10);
                            handleChange('expectedAgeMin', newMin);
                            const check = validateExpectedAgeRange(newMin, localData.expectedAgeMax);
                            setExpectedAgeError(check.isValid ? null : check.error);
                          }}
                          placeholder="Min (e.g. 22)"
                          className={`w-full px-3.5 py-2.5 rounded-xl border ${expectedAgeError ? 'border-red-500 bg-red-50/20' : 'border-gray-300 bg-white'} text-xs font-bold text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none shadow-2xs transition`}
                        />
                      </div>
                      <span className="text-gray-500 font-bold text-xs">to</span>
                      <div className="relative flex-1">
                        <input
                          type="number"
                          min={18}
                          max={80}
                          value={localData.expectedAgeMax !== undefined && localData.expectedAgeMax !== null && localData.expectedAgeMax !== 0 ? localData.expectedAgeMax : ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            const newMax = val === '' ? '' : parseInt(val, 10);
                            handleChange('expectedAgeMax', newMax);
                            const check = validateExpectedAgeRange(localData.expectedAgeMin, newMax);
                            setExpectedAgeError(check.isValid ? null : check.error);
                          }}
                          placeholder="Max (e.g. 35)"
                          className={`w-full px-3.5 py-2.5 rounded-xl border ${expectedAgeError ? 'border-red-500 bg-red-50/20' : 'border-gray-300 bg-white'} text-xs font-bold text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none shadow-2xs transition`}
                        />
                      </div>
                    </div>
                    {expectedAgeError && (
                      <p className="text-red-500 text-xs font-medium mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {expectedAgeError}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Expected Profession / Education</label>
                    <input
                      type="text"
                      value={localData.expectedProfession || localData.expectedEducation || ''}
                      onChange={(e) => {
                        handleChange('expectedProfession', e.target.value);
                        handleChange('expectedEducation', e.target.value);
                      }}
                      placeholder="e.g. Graduate / Working Professional"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 7. CONTACT DETAILS */}
            {activeTab === 'contact' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-gray-100 pb-2">
                  <h3 className="text-sm font-extrabold text-gray-900">Contact & Address Details</h3>
                  <p className="text-xs text-gray-500">Contact information, phone numbers, and residence address</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Contact Phone Number</label>
                    <input
                      type="tel"
                      value={localData.contactNumber || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        const cleaned = cleanMobileNumber(val);
                        handleChange('contactNumber', cleaned);
                        if (cleaned && cleaned.length > 0) {
                          const res = validateMobileNumber(cleaned);
                          if (!res.isValid) {
                            setPhoneError(res.error);
                          } else {
                            setPhoneError(null);
                          }
                        } else {
                          setPhoneError(null);
                        }
                      }}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium text-gray-900 focus:ring-2 outline-none transition ${
                        phoneError
                          ? 'border-red-500 bg-red-50/20 focus:ring-red-500/20 focus:border-red-500'
                          : 'border-gray-200 focus:ring-rose-500/20 focus:border-[#F01472]'
                      }`}
                    />
                    {phoneError && (
                      <p className="text-red-500 text-[10px] mt-1 font-semibold animate-fadeIn">{phoneError}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-gray-700">Public Contact Number (Contact To)</label>
                      {localData.contactNumber && localData.contactNumber !== localData.contactTo && (
                        <button
                          type="button"
                          onClick={() => {
                            handleChange('contactTo', localData.contactNumber);
                            setContactToError(null);
                          }}
                          className="text-[10px] text-rose-600 hover:text-rose-700 font-semibold cursor-pointer underline hover:no-underline"
                        >
                          Same as phone
                        </button>
                      )}
                    </div>
                    <input
                      type="tel"
                      value={localData.contactTo || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        const cleaned = cleanMobileNumber(val);
                        handleChange('contactTo', cleaned);
                        if (cleaned && cleaned.length > 0) {
                          const res = validateMobileNumber(cleaned);
                          if (!res.isValid) {
                            setContactToError(res.error);
                          } else {
                            setContactToError(null);
                          }
                        } else {
                          setContactToError(null);
                        }
                      }}
                      placeholder="e.g. 9876543210 (shared on discovery)"
                      maxLength={10}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium text-gray-900 focus:ring-2 outline-none transition ${
                        contactToError
                          ? 'border-red-500 bg-red-50/20 focus:ring-red-500/20 focus:border-red-500'
                          : 'border-gray-200 focus:ring-rose-500/20 focus:border-[#F01472]'
                      }`}
                    />
                    {contactToError ? (
                      <p className="text-red-500 text-[10px] mt-1 font-semibold animate-fadeIn">{contactToError}</p>
                    ) : (
                      <p className="text-gray-400 text-[10px] mt-1">Shared on your public profile when matches click to unlock contact.</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={localData.email || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleChange('email', val);
                        if (val.trim().length > 0) {
                          if (!val.trim().includes('@')) {
                            setEmailError('Please enter a valid email address (e.g. example@gmail.com).');
                          } else if (isDisposableEmail(val.trim())) {
                            setEmailError(COMMON_EMAIL_ERROR_MSG);
                          } else {
                            setEmailError(null);
                          }
                        } else {
                          setEmailError(null);
                        }
                      }}
                      placeholder="your.email@example.com"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium text-gray-900 focus:ring-2 outline-none transition ${
                        emailError
                          ? 'border-red-500 bg-red-50/20 focus:ring-red-500/20 focus:border-red-500'
                          : 'border-gray-200 focus:ring-rose-500/20 focus:border-[#F01472]'
                      }`}
                    />
                    {emailError && (
                      <p className="text-red-500 text-[10px] mt-1 font-semibold animate-fadeIn">{emailError}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Current Residential Address</label>
                    <textarea
                      rows={2}
                      value={localData.currentAddress || ''}
                      onChange={(e) => handleChange('currentAddress', e.target.value)}
                      placeholder="Full current address (Flat, Building, Area, City, State, Pincode)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Permanent Address</label>
                    <textarea
                      rows={2}
                      value={localData.permanentAddress || ''}
                      onChange={(e) => handleChange('permanentAddress', e.target.value)}
                      placeholder="Permanent family address (if different from current address)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-[#F01472] outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 8. PROFILE PHOTOS */}
            {activeTab === 'photos' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-b border-gray-100 pb-2">
                  <h3 className="text-sm font-extrabold text-gray-900">Profile Picture & Gallery</h3>
                  <p className="text-xs text-gray-500">Upload and configure your verified matrimonial photos</p>
                </div>

                {/* Prominent Discover Page Visibility Information */}
                <div
                  className={`p-4 rounded-2xl border transition-all ${
                    localData.profilePictureUrl
                      ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50/90 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {localData.profilePictureUrl ? (
                      <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-2 font-black">
                        <span>Discover Page Visibility</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            localData.profilePictureUrl
                              ? 'bg-emerald-200 text-emerald-800'
                              : 'bg-amber-200 text-amber-900'
                          }`}
                        >
                          {localData.profilePictureUrl ? 'Visible on Discover' : 'Photo Required'}
                        </span>
                      </div>
                      <p className="text-[11.5px] leading-relaxed text-slate-700">
                        {localData.profilePictureUrl ? (
                          <>
                            Your profile photo is uploaded. Your biodata profile is eligible to appear in candidate searches and recommendations on the <strong>Discover page</strong>.
                          </>
                        ) : (
                          <>
                            <strong>Profiles without an uploaded photo are not shown to members on the Discover page.</strong> Upload a clear, recent portrait photo so your biodata can be discovered by potential matches.
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-slate-50/80 rounded-2xl border border-gray-200/80">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                    {/* Photo Preview Box */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-32 h-40 rounded-2xl bg-white border-2 border-dashed border-rose-300 overflow-hidden relative shadow-sm flex items-center justify-center group">
                        {localData.profilePictureUrl ? (
                          <>
                            <img
                              src={localData.profilePictureUrl}
                              alt="Profile"
                              className="w-full h-full object-cover transition duration-200"
                            />
                            <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                              <button
                                type="button"
                                onClick={handleOpenCropForCurrentPhoto}
                                className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-gray-900 text-[11px] font-bold shadow-md flex items-center gap-1.5 cursor-pointer transition transform hover:scale-105"
                                title="Crop or Adjust framing"
                              >
                                <Crop size={13} className="text-[#F01472]" />
                                <span>Adjust Framing</span>
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-3 text-center text-rose-300">
                            <Camera size={32} />
                            <span className="text-[11px] font-bold text-gray-400 mt-1">No Photo</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 flex-1">
                      <div>
                        <h4 className="text-xs font-extrabold text-gray-900">Primary Profile Photo</h4>
                        <p className="text-[11px] text-gray-500">Clear portrait photo recommended (JPG, PNG, or WebP up to 10MB)</p>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        <label className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F01472] hover:bg-[#C80E5A] text-white text-xs font-bold shadow-md shadow-rose-500/20 cursor-pointer transition">
                          <Camera size={14} />
                          <span>{localData.profilePictureUrl ? 'Change Photo' : 'Upload Photo'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileChange}
                            className="hidden"
                          />
                        </label>

                        {localData.profilePictureUrl && (
                          <button
                            type="button"
                            onClick={handleOpenCropForCurrentPhoto}
                            className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#F01472] border border-rose-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Crop size={14} />
                            <span>Crop & Adjust Photo</span>
                          </button>
                        )}

                        {localData.profilePictureUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              handleChange('profilePictureUrl', '');
                              handleChange('originalProfilePictureUrl', '');
                              handleChange('profilePhotoFilter', 'normal');
                            }}
                            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-gray-600 border border-gray-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Trash2 size={13} /> Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-4 sm:px-6 py-3 sm:py-3.5 border-t border-gray-100 flex items-center justify-between bg-slate-50 sticky bottom-0 z-20 gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handleModalClose}
              className="px-3 sm:px-4 py-2 rounded-xl text-xs font-extrabold text-gray-600 hover:bg-gray-200 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setDeleteModalOpen(true);
                onDeleteModalChange?.(true);
              }}
              className="px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 hover:text-red-600 border border-red-200 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 size={13} />
              <span className="hidden sm:inline">Delete Profile</span>
              <span className="sm:hidden">Delete</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-5 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F01472] to-[#C80E5A] hover:from-rose-600 hover:to-rose-700 text-white font-black text-xs shadow-md shadow-rose-500/25 transition flex items-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              <span>{saving ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          onDeleteModalChange?.(false);
        }}
        onConfirm={handleDeleteProfile}
        confirmValue={profileNameForConfirm}
        profileName={profileNameForConfirm}
        confirmLabel="profile name"
      />
    </>
  );
};

