/**
 * Indic Transliteration Service
 * 
 * Provides authentic phonetic transliteration for Indian names and surnames
 * into all 12 major Indian languages (Hindi, Marathi, Gujarati, Bengali, Tamil,
 * Telugu, Kannada, Malayalam, Punjabi, Odia, Urdu, Assamese).
 * 
 * Eliminates machine-translation errors (e.g., treating Indian surname 'Parise' as French 'Paris' -> 'पेरिस')
 * by using dedicated phonetic transliteration engines for Indian languages.
 */

import { API_BASE_URL } from '../config/api';

export interface SupportedTranslationLanguage {
  code: string;
  name: string;
  nativeName: string;
}

/**
 * All 13 languages supported by our translation and transliteration system.
 */
export const SUPPORTED_TRANSLATION_LANGUAGES: SupportedTranslationLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
];

const INDIC_CACHE_KEY = 'soul_sync_indic_names_cache_v1';
const LIVE_TRANSLATION_CACHE_KEY = 'soul_sync_live_translations_v3';

/**
 * Checks if a field path or identifier represents a person's name.
 */
export function isNameField(fieldBindingOrPath?: string | null): boolean {
  if (!fieldBindingOrPath) return false;
  const lower = fieldBindingOrPath.toLowerCase().trim();
  return (
    lower === 'v_name' ||
    lower === 'v_fname' ||
    lower === 'v_mname' ||
    lower === 'v_mama' ||
    lower === 'name' ||
    lower === 'fullname' ||
    lower === 'candidate_name' ||
    lower === 'person_name' ||
    lower === 'default_name' ||
    lower.includes('fullname') ||
    lower.includes('fathername') ||
    lower.includes('mothername') ||
    lower.includes('maternaluncle') ||
    lower.includes('groomname') ||
    lower.includes('bridename') ||
    lower.endsWith('.name') ||
    lower.endsWith('_name') ||
    lower.endsWith('_fname') ||
    lower.endsWith('_mname') ||
    lower.endsWith('_mama') ||
    lower.includes('candidatename')
  );
}

/**
 * Checks if an entire template element slot is dedicated to a person's name
 */
export function isNameElement(el?: { id?: string; fieldBinding?: string; content?: string } | null): boolean {
  if (!el) return false;
  if (isNameField(el.fieldBinding) || isNameField(el.id)) return true;
  if (el.content) {
    const cLower = el.content.toLowerCase();
    if (
      cLower.includes('fullname') ||
      cLower.includes('fathername') ||
      cLower.includes('mothername') ||
      cLower.includes('maternaluncle') ||
      cLower.includes('{{name}}') ||
      cLower.includes('{name}') ||
      cLower.includes('[name]')
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Reads the persistent Indic names cache from localStorage.
 */
function getIndicCache(): Record<string, Record<string, string>> {
  if (typeof window === 'undefined') return {};
  try {
    const saved = localStorage.getItem(INDIC_CACHE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

/**
 * Saves a name translation into the Indic names cache and updates live translations.
 */
function saveIndicCache(targetLang: string, originalName: string, transliterated: string): void {
  if (typeof window === 'undefined' || !originalName || !transliterated) return;
  try {
    const cache = getIndicCache();
    if (!cache[targetLang]) cache[targetLang] = {};
    cache[targetLang][originalName] = transliterated;
    cache[targetLang][originalName.toLowerCase()] = transliterated;
    localStorage.setItem(INDIC_CACHE_KEY, JSON.stringify(cache));

    // Also update soul_sync_live_translations_v3 with the verified transliteration
    // so any component reading from the general translation cache gets the proper phonetic spelling
    const generalSaved = localStorage.getItem(LIVE_TRANSLATION_CACHE_KEY);
    const generalCache = generalSaved ? JSON.parse(generalSaved) : {};
    if (!generalCache[targetLang]) generalCache[targetLang] = {};
    generalCache[targetLang][originalName] = transliterated;
    generalCache[targetLang][originalName.toLowerCase()] = transliterated;
    localStorage.setItem(LIVE_TRANSLATION_CACHE_KEY, JSON.stringify(generalCache));
  } catch {}
}

/**
 * Purges any previous bad translations from localStorage (e.g. 'Parise' -> 'पेरिस' / 'पैरिस')
 */
export function purgeCorruptedNameCaches(): void {
  if (typeof window === 'undefined') return;
  try {
    const generalSaved = localStorage.getItem(LIVE_TRANSLATION_CACHE_KEY);
    if (!generalSaved) return;
    const generalCache = JSON.parse(generalSaved);
    let modified = false;

    // Bad keywords that shouldn't appear for 'parise'
    const badTranslations = ['पेरिस', 'पैरिस', 'پیرس', 'paris', 'पॅरिस'];

    for (const lang of Object.keys(generalCache)) {
      const langObj = generalCache[lang];
      if (!langObj) continue;
      for (const [key, val] of Object.entries(langObj)) {
        const lowerKey = key.toLowerCase();
        if (
          lowerKey.includes('parise') &&
          typeof val === 'string' &&
          badTranslations.some((b) => val.includes(b))
        ) {
          delete langObj[key];
          modified = true;
        }
      }
    }

    if (modified) {
      localStorage.setItem(LIVE_TRANSLATION_CACHE_KEY, JSON.stringify(generalCache));
    }
  } catch {}
}

// Automatically purge corrupted caches on load
if (typeof window !== 'undefined') {
  purgeCorruptedNameCaches();
}

/**
 * Synchronously checks if a name has an existing cached Indic transliteration.
 */
export function getCachedIndicTransliteration(name: string, targetLang: string): string | null {
  if (!name || !name.trim() || targetLang === 'en') return name;
  const trimmed = name.trim();
  const lower = trimmed.toLowerCase();

  // 1. Check Indic names cache
  const cache = getIndicCache();
  if (cache[targetLang]?.[trimmed]) return cache[targetLang][trimmed];
  if (cache[targetLang]?.[lower]) return cache[targetLang][lower];

  // 2. Check general live translation cache if clean and not poisoned
  try {
    const liveSaved = localStorage.getItem(LIVE_TRANSLATION_CACHE_KEY);
    if (liveSaved) {
      const liveCache = JSON.parse(liveSaved);
      const cand = liveCache[targetLang]?.[trimmed] || liveCache[targetLang]?.[lower];
      if (cand && typeof cand === 'string' && cand.trim()) {
        const badTranslations = ['पेरिस', 'पैरिस', 'پیرس', 'paris', 'पॅरिस'];
        if (!badTranslations.some((b) => cand.toLowerCase().includes(b))) {
          return cand.trim();
        }
      }
    }
  } catch {}

  // 3. Multi-word name assembly if individual words are cached
  const words = trimmed.split(/\s+/);
  if (words.length > 1) {
    const transWords = words.map((w) => {
      const wClean = w.trim();
      const wLower = wClean.toLowerCase();
      return cache[targetLang]?.[wClean] || cache[targetLang]?.[wLower];
    });
    if (transWords.every(Boolean)) {
      return (transWords as string[]).join(' ');
    }
  }

  return null;
}

/**
 * Phonetically transliterates a person's name into the target Indic language
 * using the Indic Transliteration Engine.
 */
export async function transliterateIndicName(name: string, targetLang: string): Promise<string> {
  if (!name || !name.trim() || targetLang === 'en') return name;
  const trimmed = name.trim();

  // If already in native Indic script (\u0900 to \u0DFF), return as is
  if (/[\u0900-\u0DFF]/.test(trimmed)) {
    return trimmed;
  }

  // 1. Check local cache
  const cached = getCachedIndicTransliteration(trimmed, targetLang);
  if (cached) return cached;

  // 2. Call backend transliterate endpoint
  try {
    const url = `${API_BASE_URL}/transliterate`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: trimmed, target_lang: targetLang }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.success && data.transliterated) {
        saveIndicCache(targetLang, trimmed, data.transliterated);
        return data.transliterated;
      }
    }
  } catch (err) {
    console.debug('Indic transliteration API call failed:', err);
  }

  return trimmed;
}

/**
 * Batch transliterates multiple names simultaneously for maximum rendering efficiency.
 */
export async function transliterateIndicNameBatch(
  names: string[],
  targetLang: string
): Promise<Record<string, string>> {
  if (!names.length || targetLang === 'en') {
    return names.reduce((acc, n) => ({ ...acc, [n]: n }), {});
  }

  const result: Record<string, string> = {};
  const toFetch: string[] = [];

  for (const name of names) {
    if (!name || !name.trim()) continue;
    const trimmed = name.trim();

    if (/[\u0900-\u0DFF]/.test(trimmed)) {
      result[trimmed] = trimmed;
      continue;
    }

    const cached = getCachedIndicTransliteration(trimmed, targetLang);
    if (cached) {
      result[trimmed] = cached;
    } else {
      toFetch.push(trimmed);
    }
  }

  if (toFetch.length === 0) {
    return result;
  }

  try {
    const uniqueToFetch = Array.from(new Set(toFetch));
    const url = `${API_BASE_URL}/transliterate/batch`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ names: uniqueToFetch, target_lang: targetLang }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.success && data.translations) {
        for (const [orig, trans] of Object.entries(data.translations)) {
          const transStr = trans as string;
          result[orig] = transStr;
          saveIndicCache(targetLang, orig, transStr);
        }
        return result;
      }
    }
  } catch (e) {
    console.debug('Batch transliteration call failed, using single fetch fallback:', e);
  }

  // Single fetch fallback for remaining names
  await Promise.all(
    toFetch.map(async (name) => {
      const trans = await transliterateIndicName(name, targetLang);
      result[name] = trans;
    })
  );

  return result;
}
