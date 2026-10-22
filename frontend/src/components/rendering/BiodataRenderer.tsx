import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { TemplateLayoutJSON, TemplateElement } from '../../services/templateService';
import { useI18n, fetchLiveTranslation } from '../../context/I18nContext';
import { getTranslatedMatrimonialText, localizeValue, localizeTemplateString } from '../../utils/matrimonialI18n';
import {
  transliterateIndicNameBatch,
  getCachedIndicTransliteration,
  isNameField,
  isNameElement,
} from '../../services/indicTransliterationService';
import { TEN_DUMMY_PROFILES, SAMPLE_FEMALE_PHOTOS, SAMPLE_MALE_PHOTOS } from '../../utils/dummyBiodataProfiles';
export { SAMPLE_FEMALE_PHOTOS, SAMPLE_MALE_PHOTOS };

interface BiodataRendererProps {
  layoutJson?: TemplateLayoutJSON;
  data?: any;
  scale?: number;
  className?: string;
  lang?: string;
}



export const DEFAULT_MALE_SAMPLE = TEN_DUMMY_PROFILES[0].data;
export const DEFAULT_FEMALE_SAMPLE = TEN_DUMMY_PROFILES[1].data;


export const BUILTIN_DECORATION_SVGS: Record<string, React.ReactNode> = {
  ganesh: (
    <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
      <path d="M50 5 C30 5 15 20 15 40 C15 55 25 65 35 70 C30 75 25 85 25 95 L30 95 C35 85 45 80 50 80 C55 80 65 85 70 95 L75 95 C75 85 70 75 65 70 C75 65 85 55 85 40 C85 20 70 5 50 5 Z M35 35 C38 35 40 38 40 40 C40 42 38 45 35 45 C32 45 30 42 30 40 C30 38 32 35 35 35 Z M65 35 C68 35 70 38 70 40 C70 42 68 45 65 45 C62 45 60 42 60 40 C60 38 62 35 65 35 Z M50 20 C55 20 60 25 60 30 C60 35 55 40 50 40 C45 40 40 35 40 30 C40 25 45 20 50 20 Z" />
    </svg>
  ),
  om: (
    <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
      <text x="50" y="75" fontSize="70" textAnchor="middle" fontFamily="serif" fontWeight="bold">ॐ</text>
    </svg>
  ),
  shloka: (
    <div className="w-full h-full flex items-center justify-center text-center font-bold tracking-wider font-serif">
      ॥ श्री गणेशाय नमः ॥
    </div>
  ),
  mandala: (
    <svg viewBox="0 0 200 200" className="w-full h-full stroke-current fill-none" strokeWidth="2">
      <circle cx="100" cy="100" r="90" />
      <circle cx="100" cy="100" r="70" />
      <circle cx="100" cy="100" r="50" />
      <circle cx="100" cy="100" r="30" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
        <line key={deg} x1="100" y1="10" x2="100" y2="190" transform={`rotate(${deg} 100 100)`} opacity="0.4" />
      ))}
    </svg>
  ),
  floral_corner: (
    <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
      <path d="M0 0 L100 0 C60 10 30 30 20 60 C10 80 0 100 0 100 Z M15 15 C30 15 50 35 50 50 C35 50 15 30 15 15 Z" />
    </svg>
  ),
  golden_frame: (
    <div className="w-full h-full border-4 border-double border-amber-600 rounded-lg p-1">
      <div className="w-full h-full border border-amber-500/60 rounded" />
    </div>
  ),
  ring: (
    <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-current" strokeWidth="4">
      <circle cx="40" cy="50" r="25" />
      <circle cx="60" cy="50" r="25" />
      <polygon points="50,20 54,28 62,28 56,34 58,42 50,37 42,42 44,34 38,28 46,28" className="fill-current stroke-none" />
    </svg>
  ),
  lotus: (
    <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
      <path d="M50 20 C60 35 75 40 85 60 C65 65 55 80 50 85 C45 80 35 65 15 60 C25 40 40 35 50 20 Z" />
      <path d="M50 35 C58 45 70 50 75 65 C60 68 54 78 50 82 C46 78 40 68 25 65 C30 50 42 45 50 35 Z" opacity="0.7" />
    </svg>
  ),
};

const formatDobForDisplay = (dobStr: string): string => {
  if (!dobStr || !dobStr.trim()) return '';
  const trimmed = dobStr.trim();
  if (/[a-zA-Z]/.test(trimmed)) return trimmed;
  const parts = trimmed.split(/[-/.]/);
  if (parts.length === 3) {
    let y = 0, m = 0, d = 0;
    if (parts[0].length === 4) {
      y = parseInt(parts[0], 10);
      m = parseInt(parts[1], 10);
      d = parseInt(parts[2], 10);
    } else if (parts[2].length === 4) {
      d = parseInt(parts[0], 10);
      m = parseInt(parts[1], 10);
      y = parseInt(parts[2], 10);
    }
    if (y && m && d && m >= 1 && m <= 12) {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return `${d} ${monthNames[m - 1]} ${y}`;
    }
  }
  return trimmed;
};

const formatHeightForDisplay = (heightCm: any, heightStr?: any): string => {
  if (heightCm && Number(heightCm) > 0) {
    const cm = Number(heightCm);
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${cm} cm (${feet}'${inches}")`;
  }
  if (heightStr && String(heightStr).trim()) return String(heightStr).trim();
  return '';
};

export const normalizeBiodataData = (raw: any, activeLang: string = 'en') => {
  if (!raw) return DEFAULT_MALE_SAMPLE;

  // Detect whether this is a user's actual biodata vs a showcase sample profile
  const isUser = Boolean(
    raw?.isUserBiodata ||
    raw?.educationList !== undefined ||
    raw?.brotherCount !== undefined ||
    raw?.sisterCount !== undefined ||
    raw?.sameAsCurrentAddress !== undefined ||
    (raw?.name && !raw?.isSampleProfile && !raw?.personalDetails?.fullName)
  );

  const isFemale =
    String(raw?.gender || raw?.personalDetails?.gender || '').toLowerCase().includes('fem') ||
    String(raw?.gender || '').toLowerCase().includes('bride');
  const defaultSample = isFemale ? DEFAULT_FEMALE_SAMPLE : DEFAULT_MALE_SAMPLE;

  // Retrieve cached wizard inputs if available
  let cachedInputs: Record<string, any> = {};
  try {
    const saved = localStorage.getItem('biodata_wizard_fields');
    if (saved) cachedInputs = JSON.parse(saved);
  } catch (e) {}

  const getVal = (...keys: string[]) => {
    for (const k of keys) {
      if (raw?.[k] !== undefined && raw[k] !== null && String(raw[k]).trim() !== '') return raw[k];
      if (cachedInputs?.[k] !== undefined && cachedInputs[k] !== null && String(cachedInputs[k]).trim() !== '') return cachedInputs[k];
    }
    return undefined;
  };

  // Helper: if value exists, return it; otherwise, return 'None' for user biodatas or sample fallback
  const resolveVal = (val: any, fallbackSampleVal: string): string => {
    if (val !== undefined && val !== null && String(val).trim() !== '') {
      return String(val).trim();
    }
    return isUser ? 'None' : fallbackSampleVal;
  };

  const MOTIF_ICON_MAP: Record<string, string> = {
    ganesh_mandala: '/symbols/ganesha_mandala.png',
    ganesha: '/symbols/ganesha_golden.png',
    ganesha_classic: '/symbols/ganesha_classic.png',
    ganesha_golden: '/symbols/ganesha_golden.png',
    ganesha_modern: '/symbols/ganesha_modern.png',
    ganesha_bal: '/symbols/ganesha_bal.png',
    ganesha_marble: '/symbols/ganesha_marble.png',
    vitthal: '/symbols/vitthal.png',
    shiva: '/symbols/shiva.png',
    ram: '/symbols/ram.png',
    krishna: '/symbols/krishna.png',
    khandoba: '/symbols/khandoba.png',
    jyotiba: '/symbols/jyotiba.png',
    mahalaxmi: '/symbols/mahalaxmi.png',
    balaji: '/symbols/balaji.png',
    swami_samarth_seated: '/symbols/swami_samarth_seated.png',
    swami_samarth_round: '/symbols/swami_samarth_round.png',
    sai_baba: '/symbols/sai_baba.png',
    om: '/symbols/om_sun.png',
    om_sun: '/symbols/om_sun.png',
    om_mandala: '/symbols/om_mandala.png',
    shree_red: '/symbols/shree_red.png',
    shree_lotus: '/symbols/shree_lotus.png',
    swastik: '/symbols/swastik_classic.png',
    swastik_classic: '/symbols/swastik_classic.png',
    swastik_gold: '/symbols/swastik_gold.png',
    shivaji_maharaj: '/symbols/shivaji_maharaj.png',
    buddha_gold: '/symbols/buddha_gold.png',
    buddha_lotus: '/symbols/buddha_lotus.png',
    ambedkar_round: '/symbols/ambedkar_round.png',
    ambedkar: '/symbols/ambedkar.png',
    jain_symbol: '/symbols/jain_symbol.png',
    mahavira: '/symbols/mahavira.png',
    islamic_crescent: '/symbols/islamic_crescent.png',
    islamic_mosque: '/symbols/islamic_mosque.png',
    radha_krishna: '/symbols/krishna.png',
    lotus: '/symbols/shree_lotus.png',
    diya: '/symbols/ganesha_golden.png',
    '🙏': '/symbols/ganesha_golden.png',
    'dYT?': '/symbols/ganesha_golden.png',
  };

  const rawIcon = getVal('selectedMotifIcon', 'deityIcon') ?? raw?.pageHeader?.deityIcon;
  const resolvedIcon = rawIcon !== undefined ? (MOTIF_ICON_MAP[rawIcon] || rawIcon) : (isUser ? '/symbols/ganesha_golden.png' : defaultSample.pageHeader.deityIcon);

  const rawDeity = getVal('headerMotif', 'deityHeader', 'deity') ?? raw?.pageHeader?.deity;
  const resolvedDeity = rawDeity !== undefined && String(rawDeity).trim() !== '' ? rawDeity : (isUser ? '|| Shri Ganeshay Namah: ||' : defaultSample.pageHeader.deity);

  return {
    pageHeader: {
      deity: resolvedDeity,
      deityIcon: resolvedIcon,
    },
    personalDetails: {
      fullName: (() => {
        if (activeLang !== 'en') {
          if (raw?.nameNative && String(raw.nameNative).trim()) return String(raw.nameNative).trim();
          if (raw?.personalDetails?.nameNative && String(raw.personalDetails.nameNative).trim()) return String(raw.personalDetails.nameNative).trim();
        }
        return (
          raw?.personalDetails?.fullName ||
          getVal('name', 'fullName', 'full_name') ||
          (isUser ? (raw?.name === '' ? 'Candidate' : 'Candidate') : defaultSample.personalDetails.fullName)
        );
      })(),
      gender:
        raw?.personalDetails?.gender ||
        getVal('gender') ||
        (isUser ? 'None' : (isFemale ? 'Female' : 'Male')),
      dateOfBirth: (() => {
        const rawDob = raw?.personalDetails?.dateOfBirth || getVal('dob', 'dateOfBirth', 'date_of_birth');
        const formatted = formatDobForDisplay(rawDob);
        return resolveVal(formatted, defaultSample.personalDetails.dateOfBirth);
      })(),
      timeOfBirth: resolveVal(
        raw?.personalDetails?.timeOfBirth || getVal('timeOfBirth', 'birthTime', 'birth_time'),
        defaultSample.personalDetails.timeOfBirth
      ),
      placeOfBirth: resolveVal(
        raw?.personalDetails?.placeOfBirth || getVal('birthPlace', 'placeOfBirth', 'birth_place'),
        defaultSample.personalDetails.placeOfBirth
      ),
      religion: resolveVal(
        raw?.personalDetails?.religion || getVal('religion'),
        defaultSample.personalDetails.religion
      ),
      caste: (() => {
        const directCaste = raw?.personalDetails?.caste || getVal('caste');
        const subCaste = raw?.personalDetails?.subCaste || getVal('subCaste', 'sub_caste');
        if (directCaste && subCaste && !String(directCaste).includes(String(subCaste))) {
          return `${directCaste} (${subCaste})`;
        }
        return resolveVal(directCaste || subCaste, defaultSample.personalDetails.caste);
      })(),
      kuldevata: resolveVal(
        raw?.personalDetails?.kuldevata || getVal('kuldevata', 'kuldaivat', 'kuldevat'),
        defaultSample.personalDetails.kuldevata
      ),
      gotra: resolveVal(
        raw?.personalDetails?.gotra || getVal('gotra'),
        defaultSample.personalDetails.gotra
      ),
      rashi: resolveVal(
        raw?.personalDetails?.rashi || getVal('rashi', 'zodiac'),
        defaultSample.personalDetails.rashi
      ),
      nakshatra: resolveVal(
        raw?.personalDetails?.nakshatra || getVal('nakshatra'),
        defaultSample.personalDetails.nakshatra
      ),
      gan: resolveVal(
        raw?.personalDetails?.gan || getVal('gan'),
        defaultSample.personalDetails.gan
      ),
      nadi: resolveVal(
        raw?.personalDetails?.nadi || getVal('nadi'),
        defaultSample.personalDetails.nadi
      ),
      height: (() => {
        const rawHeight = raw?.personalDetails?.height || getVal('height');
        const heightCm = raw?.heightCm || getVal('heightCm', 'height_cm');
        const formatted = formatHeightForDisplay(heightCm, rawHeight);
        return resolveVal(formatted, defaultSample.personalDetails.height);
      })(),
      weight: (() => {
        const rawWeight = raw?.personalDetails?.weight || getVal('weight');
        const weightKg = raw?.weightKg || getVal('weightKg', 'weight_kg');
        let formatted = '';
        if (weightKg && Number(weightKg) > 0) {
          formatted = `${weightKg} kg`;
        } else if (rawWeight && String(rawWeight).trim()) {
          formatted = String(rawWeight).trim();
        }
        return resolveVal(formatted, defaultSample.personalDetails.weight || 'None');
      })(),
      complexion: resolveVal(
        raw?.personalDetails?.complexion || getVal('complexion'),
        defaultSample.personalDetails.complexion
      ),
      maritalStatus: resolveVal(
        raw?.personalDetails?.maritalStatus || getVal('maritalStatus', 'marital_status'),
        defaultSample.personalDetails.maritalStatus
      ),
      bloodGroup: resolveVal(
        raw?.personalDetails?.bloodGroup || getVal('bloodGroup', 'blood_group'),
        defaultSample.personalDetails.bloodGroup
      ),
      motherTongue: (() => {
        const langs = raw?.languagesKnown || raw?.languages;
        const langStr = Array.isArray(langs) && langs.length > 0 ? langs.join(', ') : (typeof langs === 'string' && langs ? langs : undefined);
        const val = raw?.personalDetails?.motherTongue || getVal('motherTongue', 'mother_tongue') || langStr;
        return resolveVal(val, defaultSample.personalDetails.motherTongue);
      })(),
      photoUrl:
        raw?.personalDetails?.photoUrl ||
        getVal('profilePictureUrl', 'photoUrl', 'photo', 'photo_url', 'profilePhoto') ||
        defaultSample.personalDetails.photoUrl,
    },
    educationOccupation: {
      education: (() => {
        const eduList = raw?.educationList;
        if (Array.isArray(eduList) && eduList.length > 0) {
          const formatted = eduList
            .map((e: any) => `${e.degree || e.qualification || ''}${e.college ? ' (' + e.college + ')' : ''}`)
            .filter(Boolean)
            .join(', ');
          if (formatted) return formatted;
        }
        const val = raw?.educationOccupation?.education || getVal('highestEducation', 'education', 'highest_education');
        return resolveVal(val, defaultSample.educationOccupation.education);
      })(),
      occupation: resolveVal(
        raw?.educationOccupation?.occupation || getVal('occupation', 'designation', 'jobTitle', 'job_title', 'profession'),
        defaultSample.educationOccupation.occupation
      ),
      companyName: resolveVal(
        raw?.educationOccupation?.companyName || getVal('company', 'companyName', 'company_name', 'employer', 'businessDetails'),
        defaultSample.educationOccupation.companyName
      ),
      annualIncome: resolveVal(
        raw?.educationOccupation?.annualIncome || getVal('income', 'salaryRange', 'annualIncome', 'annual_income'),
        defaultSample.educationOccupation.annualIncome
      ),
      workLocation: resolveVal(
        raw?.educationOccupation?.workLocation || getVal('officeAddress', 'workLocation', 'work_location', 'workingCity', 'working_city'),
        defaultSample.educationOccupation.workLocation
      ),
    },
    familyDetails: {
      fatherName: (() => {
        if (activeLang !== 'en') {
          if (raw?.fatherNameNative && String(raw.fatherNameNative).trim()) return String(raw.fatherNameNative).trim();
          if (raw?.familyDetails?.fatherNameNative && String(raw.familyDetails.fatherNameNative).trim()) return String(raw.familyDetails.fatherNameNative).trim();
        }
        return resolveVal(
          raw?.familyDetails?.fatherName || getVal('fatherName', 'father_name'),
          defaultSample.familyDetails.fatherName
        );
      })(),
      fatherOccupation: resolveVal(
        raw?.familyDetails?.fatherOccupation || getVal('fatherOccupation', 'father_occupation'),
        defaultSample.familyDetails.fatherOccupation
      ),
      motherName: (() => {
        if (activeLang !== 'en') {
          if (raw?.motherNameNative && String(raw.motherNameNative).trim()) return String(raw.motherNameNative).trim();
          if (raw?.familyDetails?.motherNameNative && String(raw.familyDetails.motherNameNative).trim()) return String(raw.familyDetails.motherNameNative).trim();
        }
        return resolveVal(
          raw?.familyDetails?.motherName || getVal('motherName', 'mother_name'),
          defaultSample.familyDetails.motherName
        );
      })(),
      motherOccupation: resolveVal(
        raw?.familyDetails?.motherOccupation || getVal('motherOccupation', 'mother_occupation'),
        defaultSample.familyDetails.motherOccupation
      ),
      brothers: (() => {
        const details = raw?.familyDetails?.brothers || getVal('brotherDetails', 'brothers');
        if (details && String(details).trim()) return String(details).trim();
        const count = raw?.brotherCount !== undefined ? raw.brotherCount : raw?.brothersCount;
        if (typeof count === 'number') {
          return count > 0 ? `${count} Brother(s)` : 'None';
        }
        return isUser ? 'None' : defaultSample.familyDetails.brothers;
      })(),
      sisters: (() => {
        const details = raw?.familyDetails?.sisters || getVal('sisterDetails', 'sisters');
        if (details && String(details).trim()) return String(details).trim();
        const count = raw?.sisterCount !== undefined ? raw.sisterCount : raw?.sistersCount;
        if (typeof count === 'number') {
          return count > 0 ? `${count} Sister(s)` : 'None';
        }
        return isUser ? 'None' : defaultSample.familyDetails.sisters;
      })(),
      familyType: (() => {
        const val = raw?.familyDetails?.familyType || getVal('familyType', 'family_type');
        if (val && String(val).trim()) {
          const s = String(val).trim();
          return s.toLowerCase().includes('family') ? s : `${s} Family`;
        }
        return isUser ? 'None' : defaultSample.familyDetails.familyType;
      })(),
      nativePlace: resolveVal(
        raw?.familyDetails?.nativePlace || getVal('nativePlace', 'native_place', 'familyOrigin', 'family_origin'),
        defaultSample.familyDetails.nativePlace
      ),
      maternalUncle: (() => {
        if (activeLang !== 'en') {
          if (raw?.maternalUncleNative && String(raw.maternalUncleNative).trim()) return String(raw.maternalUncleNative).trim();
          if (raw?.familyDetails?.maternalUncleNative && String(raw.familyDetails.maternalUncleNative).trim()) return String(raw.familyDetails.maternalUncleNative).trim();
        }
        return resolveVal(
          raw?.familyDetails?.maternalUncle || raw?.familyDetails?.mama || getVal('maternalUncle', 'mama', 'maternal_uncle'),
          defaultSample.familyDetails.maternalUncle
        );
      })(),
      relations: resolveVal(
        raw?.familyDetails?.relations || raw?.familyDetails?.natesambandh || getVal('relations', 'natesambandh'),
        defaultSample.familyDetails.relations || ''
      ),
    },
    contactDetails: {
      primaryContact: resolveVal(
        raw?.contactDetails?.primaryContact || getVal('contactNumber', 'primaryContact', 'phone', 'contact_number'),
        defaultSample.contactDetails.primaryContact
      ),
      secondaryContact: resolveVal(
        raw?.contactDetails?.secondaryContact || getVal('secondaryContact', 'alternatePhone', 'alternate_phone', 'verifiedPhone'),
        defaultSample.contactDetails.secondaryContact || ''
      ),
      email: resolveVal(
        raw?.contactDetails?.email || getVal('email'),
        defaultSample.contactDetails.email
      ),
      residenceAddress: resolveVal(
        raw?.contactDetails?.residenceAddress || getVal('currentAddress', 'residenceAddress', 'permanentAddress', 'address'),
        defaultSample.contactDetails.residenceAddress
      ),
    },
  };
};

export const resolveTemplateVariable = (
  templateStr: string,
  dataObj: any,
  missingBehavior: 'placeholder' | 'hide' | 'not_provided' = 'placeholder',
  targetLang: string = 'en'
): string => {
  if (!templateStr) return '';
  const data = normalizeBiodataData(dataObj);

  // Match {{field.path}}, [field.path], and {field.path}
  return templateStr.replace(/(?:\{\{|\{|\[)\s*([\w.]+)\s*(?:\}\}|\}|\])/g, (_fullMatch, path) => {
    const parts = path.split('.');
    let curr: any = data;
    for (const p of parts) {
      if (curr && typeof curr === 'object' && p in curr) {
        curr = curr[p];
      } else {
        curr = undefined;
        break;
      }
    }
    if (curr !== undefined && curr !== null && String(curr).trim() !== '') {
      const valStr = String(curr);
      if (targetLang && targetLang !== 'en') {
        if (isNameField(path)) {
          const nameTrans = getCachedIndicTransliteration(valStr, targetLang);
          if (nameTrans && nameTrans !== valStr) return nameTrans;
        }
        return localizeValue(valStr, targetLang);
      }
      return valStr;
    }
    if (missingBehavior === 'hide') return '';
    if (missingBehavior === 'not_provided') {
      return targetLang && targetLang !== 'en' ? localizeValue('Not Provided', targetLang) : 'Not Provided';
    }
    return targetLang && targetLang !== 'en' ? localizeValue('None', targetLang) : 'None';
  });
};

export const resolveFieldBinding = (
  bindingPath: string | undefined,
  dataObj: any,
  targetLang: string = 'en'
): string => {
  if (!bindingPath) return '';
  const data = normalizeBiodataData(dataObj);
  const parts = bindingPath.split('.');
  let curr: any = data;
  for (const p of parts) {
    if (curr && typeof curr === 'object' && p in curr) {
      curr = curr[p];
    } else {
      curr = undefined;
      break;
    }
  }
  if (curr !== undefined && curr !== null && String(curr).trim() !== '') {
    const valStr = typeof curr === 'string' ? curr : String(curr);
    if (targetLang && targetLang !== 'en') {
      if (isNameField(bindingPath)) {
        const nameTrans = getCachedIndicTransliteration(valStr, targetLang);
        if (nameTrans && nameTrans !== valStr) return nameTrans;
      }
      return localizeValue(valStr, targetLang);
    }
    return valStr;
  }
  return targetLang && targetLang !== 'en' ? localizeValue('None', targetLang) : 'None';
};

export const BiodataRenderer: React.FC<BiodataRendererProps> = ({
  layoutJson,
  data,
  scale = 1,
  className = '',
  lang,
}) => {
  const i18nContext = useI18n();
  const activeLang =
    (lang && lang !== 'en' ? lang : undefined) ||
    data?.lang ||
    lang ||
    (i18nContext?.lang && i18nContext.lang !== 'en' ? i18nContext.lang : undefined) ||
    i18nContext?.lang ||
    'en';

  const rawPage = layoutJson?.page;
  const page = {
    background: '#FFFFFF',
    padding: 32,
    fontFamily: 'Playfair Display',
    ...(rawPage || {}),
    width: Number(rawPage?.width) > 0 ? Number(rawPage?.width) : 794,
    height: Number(rawPage?.height) > 0 ? Number(rawPage?.height) : 1123,
  };

  const elements: TemplateElement[] = layoutJson?.elements || [
    {
      id: 'default_name',
      type: 'text',
      content: '{{personalDetails.fullName}}',
      x: 50,
      y: 60,
      width: 694,
      height: 50,
      zIndex: 1,
      style: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#8B0000',
        textAlign: 'center',
        fontFamily: page.fontFamily || 'Playfair Display',
      },
    },
  ];

  // Resolve template's saved live data if data is not explicitly provided
  const templateSavedData =
    (layoutJson?.page as any)?.sampleData ||
    (layoutJson as any)?.sampleData ||
    (typeof (layoutJson?.page as any)?.selectedDummyIndex === 'number'
      ? TEN_DUMMY_PROFILES[(layoutJson?.page as any).selectedDummyIndex]?.data
      : undefined);

  const effectiveData = data !== undefined && data !== null ? data : templateSavedData;
  const resolvedData = normalizeBiodataData(effectiveData, activeLang);

  const knownNames = useMemo(() => {
    const s = new Set<string>();
    const pd = resolvedData.personalDetails as any;
    if (pd?.fullName && typeof pd.fullName === 'string' && pd.fullName.trim()) {
      s.add(pd.fullName.trim());
      s.add(pd.fullName.trim().toLowerCase());
    }
    const fd = resolvedData.familyDetails as any;
    if (fd?.fatherName && typeof fd.fatherName === 'string' && fd.fatherName.trim()) {
      s.add(fd.fatherName.trim());
      s.add(fd.fatherName.trim().toLowerCase());
    }
    if (fd?.motherName && typeof fd.motherName === 'string' && fd.motherName.trim()) {
      s.add(fd.motherName.trim());
      s.add(fd.motherName.trim().toLowerCase());
    }
    if (fd?.maternalUncle && typeof fd.maternalUncle === 'string' && fd.maternalUncle.trim()) {
      s.add(fd.maternalUncle.trim());
      s.add(fd.maternalUncle.trim().toLowerCase());
    }
    return s;
  }, [resolvedData]);

  const [liveTranslations, setLiveTranslations] = useState<Record<string, string>>(() => {
    if (activeLang === 'en') return {};
    try {
      const saved = localStorage.getItem('soul_sync_live_translations_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        const raw = parsed?.[activeLang] || {};
        const sanitized: Record<string, string> = {};
        for (const [k, v] of Object.entries(raw)) {
          if (typeof v === 'string' && v.trim() && v.trim().toLowerCase() !== k.trim().toLowerCase()) {
            sanitized[k] = v.trim();
          }
        }
        return sanitized;
      }
    } catch {}
    return {};
  });

  const inFlightRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!activeLang || activeLang === 'en') return;

    const nameCandidates: string[] = [];
    const generalCandidates: string[] = [];

    const addCandidate = (val: any, isName: boolean = false) => {
      if (!val || typeof val !== 'string') return;
      const trimmed = val.trim();
      if (!trimmed || trimmed.length < 2) return;
      if (/^[\d\s+\-/:.,()]+$/.test(trimmed)) return;
      if (trimmed.startsWith('http') || trimmed.includes('@') || trimmed.includes('www.')) return;
      if (/[\u0900-\u0DFF]/.test(trimmed)) return;
      if (isName) {
        nameCandidates.push(trimmed);
      } else {
        generalCandidates.push(trimmed);
      }
    };

    const pd = resolvedData.personalDetails as any;
    if (pd) {
      addCandidate(pd.fullName, true);
      addCandidate(pd.placeOfBirth, false);
      addCandidate(pd.religion, false);
      addCandidate(pd.caste, false);
      addCandidate(pd.subCaste, false);
      addCandidate(pd.kuldevata, false);
      addCandidate(pd.gotra, false);
      addCandidate(pd.rashi, false);
      addCandidate(pd.nakshatra, false);
      addCandidate(pd.complexion, false);
      addCandidate(pd.maritalStatus, false);
      addCandidate(pd.motherTongue, false);
    }
    const eo = resolvedData.educationOccupation as any;
    if (eo) {
      addCandidate(eo.education, false);
      addCandidate(eo.occupation, false);
      addCandidate(eo.companyName, false);
      addCandidate(eo.annualIncome, false);
      addCandidate(eo.workLocation, false);
    }
    const fd = resolvedData.familyDetails as any;
    if (fd) {
      addCandidate(fd.fatherName, true);
      addCandidate(fd.fatherOccupation, false);
      addCandidate(fd.motherName, true);
      addCandidate(fd.motherOccupation, false);
      addCandidate(fd.brothers, false);
      addCandidate(fd.sisters, false);
      addCandidate(fd.familyType, false);
      addCandidate(fd.maternalUncle, true);
      addCandidate(fd.nativePlace, false);
      addCandidate(fd.relations, false);
    }
    const cd = resolvedData.contactDetails as any;
    if (cd) {
      addCandidate(cd.residenceAddress, false);
    }

    elements.forEach((el) => {
      if (el.type === 'text') {
        const isNameEl = isNameElement(el);
        if (el.content && !el.content.includes('{') && !el.content.includes('[')) {
          const val = el.content.replace(/^:\s*/, '').replace(/:\s*$/, '').trim();
          addCandidate(val, isNameEl || knownNames.has(val) || knownNames.has(val.toLowerCase()));
        }
        if (el.fieldBinding) {
          const boundVal = resolveFieldBinding(el.fieldBinding, resolvedData, 'en');
          const cleanBound = boundVal ? boundVal.replace(/^:\s*/, '').replace(/:\s*$/, '').trim() : '';
          if (cleanBound) {
            addCandidate(
              cleanBound,
              isNameEl || isNameField(el.fieldBinding) || knownNames.has(cleanBound) || knownNames.has(cleanBound.toLowerCase())
            );
          }
        }
        if (el.content && (el.content.includes('{') || el.content.includes('['))) {
          const resolvedStr = resolveTemplateVariable(el.content, resolvedData, 'placeholder', 'en');
          const cleanResolved = resolvedStr.replace(/^:\s*/, '').replace(/:\s*$/, '').trim();
          if (cleanResolved) {
            addCandidate(
              cleanResolved,
              isNameEl || knownNames.has(cleanResolved) || knownNames.has(cleanResolved.toLowerCase())
            );
          }
        }
      }
    });

    let cache: Record<string, Record<string, string>> = {};
    try {
      const saved = localStorage.getItem('soul_sync_live_translations_v3');
      if (saved) cache = JSON.parse(saved);
    } catch {}
    const langCache = cache[activeLang] || {};

    // Filter name candidates that aren't cached or already in Indic transliteration format
    const uniqueNames = Array.from(new Set(nameCandidates)).filter((text) => {
      const cached = getCachedIndicTransliteration(text, activeLang);
      if (cached && cached !== text) return false;
      const key = `${activeLang}:name:${text}`;
      if (inFlightRef.current.has(key)) return false;
      return true;
    });

    // Filter general candidates that aren't translated or in built-in dictionary
    const uniqueGeneral = Array.from(new Set(generalCandidates)).filter((text) => {
      const clean = text.toLowerCase().trim();
      if (langCache[text] || langCache[clean]) return false;
      const preLocalized = localizeValue(clean, activeLang);
      if (preLocalized && preLocalized.trim().toLowerCase() !== clean) return false;
      const key = `${activeLang}:${text}`;
      if (inFlightRef.current.has(key)) return false;
      return true;
    });

    if (uniqueNames.length === 0 && uniqueGeneral.length === 0) {
      if (Object.keys(langCache).length > 0 && Object.keys(langCache).length !== Object.keys(liveTranslations).length) {
        setLiveTranslations(langCache);
      }
      return;
    }

    uniqueNames.forEach((t) => inFlightRef.current.add(`${activeLang}:name:${t}`));
    uniqueGeneral.forEach((t) => inFlightRef.current.add(`${activeLang}:${t}`));

    Promise.all([
      // 1. Transliterate names using dedicated Indic Transliteration Engine
      uniqueNames.length > 0
        ? transliterateIndicNameBatch(uniqueNames, activeLang).catch(() => ({} as Record<string, string>))
        : Promise.resolve({} as Record<string, string>),
      // 2. Translate general vocabulary using standard live translation
      Promise.all(
        uniqueGeneral.map(async (text) => {
          try {
            const trans = await fetchLiveTranslation(text, activeLang);
            return { text, trans };
          } catch {
            return { text, trans: text };
          }
        })
      ),
    ]).then(([nameResults, generalResults]) => {
      let updatedCache: Record<string, Record<string, string>> = {};
      try {
        const saved = localStorage.getItem('soul_sync_live_translations_v3');
        if (saved) updatedCache = JSON.parse(saved);
      } catch {}
      if (!updatedCache[activeLang]) updatedCache[activeLang] = {};

      // Ingest Indic name transliterations
      Object.entries(nameResults).forEach(([orig, trans]) => {
        inFlightRef.current.delete(`${activeLang}:name:${orig}`);
        if (trans && typeof trans === 'string' && trans.trim()) {
          updatedCache[activeLang][orig] = trans.trim();
          updatedCache[activeLang][orig.toLowerCase().trim()] = trans.trim();
        }
      });

      // Ingest general translations
      generalResults.forEach(({ text, trans }) => {
        inFlightRef.current.delete(`${activeLang}:${text}`);
        if (
          trans &&
          typeof trans === 'string' &&
          trans.trim() &&
          trans.trim().toLowerCase() !== text.trim().toLowerCase()
        ) {
          updatedCache[activeLang][text] = trans.trim();
          updatedCache[activeLang][text.toLowerCase().trim()] = trans.trim();
        }
      });

      // Purge any poisoned cache entries where value === key or bad loanword translations
      const badTranslations = ['पेरिस', 'पैरिस', 'پیرس', 'paris', 'पॅरिस'];
      for (const [k, v] of Object.entries(updatedCache[activeLang])) {
        if (!v || typeof v !== 'string' || v.trim().toLowerCase() === k.trim().toLowerCase()) {
          delete updatedCache[activeLang][k];
        } else if (k.toLowerCase().includes('parise') && badTranslations.some((b) => v.toLowerCase().includes(b))) {
          delete updatedCache[activeLang][k];
        }
      }

      try {
        localStorage.setItem('soul_sync_live_translations_v3', JSON.stringify(updatedCache));
      } catch {}

      setLiveTranslations({ ...updatedCache[activeLang] });
    });
  }, [activeLang, resolvedData, elements]);

  // Background style computation
  let pageBgStyle: React.CSSProperties = {
    backgroundColor: page.background || '#FFFFFF',
  };

  if (page.backgroundType === 'gradient' && page.gradient?.colors?.length) {
    const colorsStr = page.gradient.colors.join(', ');
    if (page.gradient.type === 'radial') {
      pageBgStyle.background = `radial-gradient(circle, ${colorsStr})`;
    } else {
      const angle = page.gradient.angle || 135;
      pageBgStyle.background = `linear-gradient(${angle}deg, ${colorsStr})`;
    }
  }

  return (
    <div
      className={`relative overflow-hidden shadow-2xl transition-all notranslate ${className}`}
      translate="no"
      style={{
        width: `${page.width * scale}px`,
        height: `${page.height * scale}px`,
        fontFamily: page.fontFamily || 'serif',
        transformOrigin: 'top left',
        isolation: 'isolate',
        contain: 'paint',
        overflow: 'hidden',
        ...pageBgStyle,
      }}
    >
      {/* Background Image Layer */}
      {page.backgroundImage && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${page.backgroundImage})`,
            backgroundSize: page.backgroundFit === 'stretch' ? '100% 100%' : page.backgroundFit || 'cover',
            backgroundPosition: page.backgroundPosition || 'center',
            backgroundRepeat: page.backgroundFit === 'original' ? 'repeat' : 'no-repeat',
            opacity: page.backgroundOpacity ?? 1,
            zIndex: 0,
          }}
        />
      )}

      {/* Render Canvas Elements */}
      {elements.map((el) => {
        const rotationAngle = el.rotation || 0;

        const style: React.CSSProperties = {
          position: 'absolute',
          left: `${el.x * scale}px`,
          top: `${el.y * scale}px`,
          width: `${el.width * scale}px`,
          height: `${el.height * scale}px`,
          zIndex: el.zIndex || 1,
          transform: rotationAngle ? `rotate(${rotationAngle}deg)` : undefined,
          transformOrigin: 'center center',
          fontSize: el.style?.fontSize ? `${el.style.fontSize * scale}px` : undefined,
          fontWeight: el.style?.fontWeight as any,
          fontStyle: el.style?.fontStyle,
          textDecoration: el.style?.textDecoration,
          color: el.style?.color,
          backgroundColor: el.style?.backgroundColor,
          textAlign: el.style?.textAlign,
          borderRadius: el.style?.borderRadius,
          border: el.style?.border || (el.style?.borderWidth ? `${el.style.borderWidth * scale}px ${el.style.borderStyle || 'solid'} ${el.style.borderColor || el.style.color || '#000'}` : undefined),
          borderBottom: el.style?.borderBottom,
          letterSpacing: el.style?.letterSpacing,
          lineHeight: el.style?.lineHeight || '1.4',
          fontFamily: el.style?.fontFamily || page.fontFamily,
          boxShadow: el.style?.boxShadow,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          opacity: el.style?.opacity ?? 1,
        };

        if (el.type === 'image') {
          // Check if this image slot is meant for deity/motif icon
          if (
            el.fieldBinding === 'pageHeader.ganeshaIcon' ||
            el.fieldBinding === 'pageHeader.deityIcon' ||
            el.id === 'ganesha_img' ||
            el.id === 'ganesha_icon' ||
            el.id === 'deity_img'
          ) {
            const symbol = resolvedData.pageHeader?.deityIcon;
            if (symbol === 'none' || symbol === '🚫') {
              return null;
            }
            if (symbol) {
              if (symbol.startsWith('http') || symbol.startsWith('/') || symbol.startsWith('data:') || symbol.startsWith('blob:')) {
                return (
                  <div key={el.id} style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={symbol}
                      alt="Sacred Symbol"
                      className="w-full h-full object-contain"
                      crossOrigin="anonymous"
                    />
                  </div>
                );
              }
              return (
                <div key={el.id} style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: `${Math.min(el.width, el.height) * 0.7 * scale}px`, lineHeight: 1 }}>
                    {symbol}
                  </span>
                </div>
              );
            }
          }

          const explicitContent = el.content && (el.content.startsWith('http') || el.content.startsWith('data:') || el.content.startsWith('/')) ? el.content : '';
          const boundSrc = resolveFieldBinding(el.fieldBinding, resolvedData);
          // If data has explicit profilePictureUrl or photoUrl from a real user profile, prefer it; otherwise use explicitContent or fallback
          const isRealUserData = data && (data.profilePictureUrl || data.photoUrl || data.photo);
          const imgSrc = (isRealUserData && boundSrc) || explicitContent || boundSrc || resolvedData.personalDetails?.photoUrl;

          const photoShapeSetting = (resolvedData as any)?.photoShape || (data as any)?.photoShape;
          const isRound = photoShapeSetting === 'circle' || photoShapeSetting === 'round' || el.shapeType === 'circle' || el.shapeType === 'oval';
          const isSquare = photoShapeSetting === 'square' || el.shapeType === 'square' || el.shapeType === 'rectangle';
          const isArch = photoShapeSetting === 'arch' || el.shapeType === 'arch';
          const borderRadiusVal = isRound ? '50%' : isSquare ? '0px' : isArch ? '40px 40px 10px 10px' : (el.style?.borderRadius || '8px');

          return (
            <div key={el.id} style={{ ...style, borderRadius: borderRadiusVal }} className="overflow-hidden">
              <img
                src={imgSrc || '/sample_profiles/rahul.webp'}
                alt="Profile Frame"
                className="w-full h-full"
                style={{
                  objectFit: el.style?.objectFit || 'cover',
                  borderRadius: borderRadiusVal,
                }}
              />
            </div>
          );
        }

        if (el.type === 'decoration') {
          const key = el.decorationKey || 'ganesh';
          const svgContent = el.svgContent;
          const iconColor = el.style?.color || '#8B0000';

          // If this is a central religious motif decoration and the user selected a custom symbol
          if (
            (key === 'ganesh' || key === 'om' || el.id === 'ganesha_icon' || el.id === 'deity_icon' || el.id === 'deity_symbol') &&
            resolvedData.pageHeader?.deityIcon
          ) {
            const symbol = resolvedData.pageHeader.deityIcon;
            if (symbol === 'none' || symbol === '🚫') {
              return null;
            }
            if (symbol.startsWith('http') || symbol.startsWith('/') || symbol.startsWith('data:') || symbol.startsWith('blob:')) {
              return (
                <div
                  key={el.id}
                  style={{
                    ...style,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={symbol}
                    alt="Sacred Symbol"
                    className="w-full h-full object-contain"
                    crossOrigin="anonymous"
                  />
                </div>
              );
            }
            return (
              <div
                key={el.id}
                style={{
                  ...style,
                  color: iconColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: `${Math.min(el.width, el.height) * 0.75 * scale}px`, lineHeight: 1 }}>
                  {symbol}
                </span>
              </div>
            );
          }

          return (
            <div key={el.id} style={{ ...style, color: iconColor }}>
              {svgContent ? (
                <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: svgContent }} />
              ) : el.content ? (
                <img src={el.content} alt="Decoration" className="w-full h-full object-contain" />
              ) : (
                BUILTIN_DECORATION_SVGS[key] || BUILTIN_DECORATION_SVGS.ganesh
              )}
            </div>
          );
        }

        if (el.type === 'divider') {
          return (
            <div key={el.id} style={style}>
              <hr
                className="w-full"
                style={{
                  borderColor: el.style?.borderColor || el.style?.color || '#D97706',
                  borderWidth: el.style?.borderWidth ? `${el.style.borderWidth * scale}px` : '1px',
                  borderStyle: el.style?.borderStyle || 'solid',
                }}
              />
            </div>
          );
        }

        if (el.type === 'shape') {
          const shapeRadius = el.shapeType === 'circle' || el.shapeType === 'oval' ? '50%' : el.style?.borderRadius || '0';
          return <div key={el.id} style={{ ...style, borderRadius: shapeRadius }} />;
        }

        // Text element: Evaluate either fieldBinding, deity header IDs, or content
        const missingBehavior = page.missingDataBehavior || 'placeholder';
        const isLabel = el.id.startsWith('f_') || el.id.startsWith('label') || (!el.fieldBinding && !el.content?.includes('{{') && !el.content?.includes('{') && (el.content?.endsWith(':') || el.content?.endsWith(': ')));
        const textWrapClass = el.style?.textWrap === 'nowrap' || isLabel ? 'whitespace-nowrap overflow-hidden text-ellipsis' : el.style?.textWrap === 'truncate' ? 'truncate' : 'whitespace-normal';
        let renderedText = '';

        if (
          el.id === 'ganesha_icon' ||
          el.id === 'deity_text' ||
          el.id === 'deity_icon' ||
          el.fieldBinding === 'pageHeader.deityIcon' ||
          el.fieldBinding === 'pageHeader.ganeshaIcon'
        ) {
          const symbol = resolvedData.pageHeader?.deityIcon ?? '';
          if (symbol === 'none' || symbol === '🚫') return null;
          if (symbol.startsWith('http') || symbol.startsWith('/') || symbol.startsWith('data:') || symbol.startsWith('blob:')) {
            return (
              <div key={el.id} style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={symbol}
                  alt="Sacred Symbol"
                  className="w-full h-full object-contain"
                  crossOrigin="anonymous"
                />
              </div>
            );
          }
          renderedText = symbol;
        } else if (
          el.id === 'shloka' ||
          el.id === 'deity' ||
          el.id === 'heading1' ||
          el.id === 'header_shloka' ||
          el.fieldBinding === 'pageHeader.deity'
        ) {
          const rawDeity = resolvedData.pageHeader?.deity ?? el.content ?? '|| Shri Ganeshay Namah: ||';
          renderedText = getTranslatedMatrimonialText(rawDeity, activeLang);
        } else if (el.content && (el.content.includes('{{') || el.content.includes('{') || el.content.includes('['))) {
          renderedText = localizeTemplateString(
            el.content,
            resolvedData,
            activeLang,
            missingBehavior,
            (str, data, missing, lang) => resolveTemplateVariable(str, data, missing, lang)
          );
        } else if (el.fieldBinding) {
          renderedText = resolveFieldBinding(el.fieldBinding, resolvedData, activeLang);
        } else if (el.content) {
          renderedText = localizeTemplateString(
            el.content,
            resolvedData,
            activeLang,
            missingBehavior,
            (str, data, missing, lang) => resolveTemplateVariable(str, data, missing, lang)
          );
        }

        // If activeLang is non-English, ensure value localization and check liveTranslations for renderedText
        if (activeLang !== 'en' && renderedText) {
          const rawStripped = renderedText.replace(/^:\s*/, '').trim();
          const isNameEl = isNameElement(el) || knownNames.has(rawStripped) || knownNames.has(rawStripped.toLowerCase());

          if (isNameEl) {
            // Check direct database dual-script storage first (Method 4)
            let directNative: string | undefined;
            const bPath = (el.fieldBinding || '').toLowerCase();
            const cLower = (el.content || '').toLowerCase();

            if (bPath.includes('fullname') || bPath.endsWith('name') || cLower.includes('fullname') || cLower.includes('{{name}}') || cLower.includes('personaldetails.fullname')) {
              directNative = (effectiveData as any)?.nameNative || (effectiveData as any)?.personalDetails?.nameNative;
            } else if (bPath.includes('fathername') || cLower.includes('fathername')) {
              directNative = (effectiveData as any)?.fatherNameNative || (effectiveData as any)?.familyDetails?.fatherNameNative;
            } else if (bPath.includes('mothername') || cLower.includes('mothername')) {
              directNative = (effectiveData as any)?.motherNameNative || (effectiveData as any)?.familyDetails?.motherNameNative;
            } else if (bPath.includes('maternaluncle') || cLower.includes('maternaluncle')) {
              directNative = (effectiveData as any)?.maternalUncleNative || (effectiveData as any)?.familyDetails?.maternalUncleNative;
            }

            if (!directNative && (effectiveData as any)?.nativeNames) {
              directNative = (effectiveData as any).nativeNames[rawStripped] || (effectiveData as any).nativeNames[rawStripped.toLowerCase()];
            }

            if (directNative && typeof directNative === 'string' && directNative.trim()) {
              renderedText = renderedText.startsWith(':') ? `: ${directNative.trim()}` : directNative.trim();
            } else {
              const cachedName = getCachedIndicTransliteration(rawStripped, activeLang);
              if (cachedName && cachedName !== rawStripped) {
                renderedText = renderedText.startsWith(':') ? `: ${cachedName}` : cachedName;
              }
            }
          } else {
            renderedText = localizeValue(renderedText, activeLang);
          }

          const stripped = renderedText.replace(/^:\s*/, '').trim();
          const cleanLower = stripped.toLowerCase();
          const candidateTrans = liveTranslations[renderedText] || liveTranslations[stripped] || liveTranslations[cleanLower];
          if (
            candidateTrans &&
            candidateTrans.trim() &&
            candidateTrans.trim().toLowerCase() !== cleanLower &&
            candidateTrans.trim() !== stripped
          ) {
            const badTranslations = ['पेरिस', 'पैरिस', 'پیرس', 'paris', 'पॅरिस'];
            const isBad = isNameEl && badTranslations.some((b) => candidateTrans.toLowerCase().includes(b));
            if (!isBad) {
              renderedText = renderedText.startsWith(':') ? `: ${candidateTrans.trim()}` : candidateTrans.trim();
            }
          }
        }

        // Clean up lone leading colon if no label element precedes it on the same line
        if (renderedText.startsWith(':')) {
          const hasLabelOnSameRow = elements.some(
            (other) =>
              other.id !== el.id &&
              other.type === 'text' &&
              Math.abs((other.y || 0) - (el.y || 0)) < 20 &&
              (other.x || 0) < (el.x || 0)
          );
          if (!hasLabelOnSameRow) {
            renderedText = renderedText.replace(/^:\s*/, '');
          }
        }

        // If behavior is 'hide' and there's no text, skip the element entirely
        if (missingBehavior === 'hide' && !renderedText.trim()) return null;

        return (
          <div key={el.id} style={{ ...style, overflow: isLabel ? 'hidden' : (style.overflow || 'visible') }}>
            <span className={`w-full ${textWrapClass}`} style={{ lineHeight: 1.35 }}>{renderedText}</span>
          </div>
        );
      })}
    </div>
  );
};


