import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Language = string;

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (englishText: string) => string;
  translateBio: (text: string, targetLang: Language) => Promise<string>;
  isTranslating: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Cache stored in browser localStorage
const CACHE_KEY = 'soul_sync_live_translations_v3';

function getInitialCache(): Record<string, Record<string, string>> {
  try {
    const saved = localStorage.getItem(CACHE_KEY);
    return saved ? JSON.parse(saved) : { hi: {}, mr: {} };
  } catch (e) {
    return { hi: {}, mr: {} };
  }
}

// Live Translate via Google Translate free GTX endpoint directly in browser
export async function fetchLiveTranslation(text: string, targetLang: string): Promise<string> {
  if (!text || !text.trim() || targetLang === 'en') return text;
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    if (!response.ok) return text;
    const data = await response.json();
    if (data && data[0] && Array.isArray(data[0])) {
      const translatedStr = data[0].map((item: any) => item[0]).join('');
      return translatedStr || text;
    }
    return text;
  } catch (e) {
    return text;
  }
}

// Set Google Translate Cookie across root path & domains
function setGoogleTranslateCookie(langCode: string) {
  if (langCode === 'en') {
    clearGoogleTranslateCookies();
    return;
  }
  const cookieVal = `/en/${langCode}`;
  const domain = window.location.hostname;

  document.cookie = `googtrans=${cookieVal}; path=/;`;
  if (domain && domain !== 'localhost' && !domain.includes('127.0.0.1')) {
    document.cookie = `googtrans=${cookieVal}; path=/; domain=.${domain};`;
  }
}

// Thoroughly clear Google Translate cookies across all paths and domains
function clearGoogleTranslateCookies() {
  const hostname = window.location.hostname;
  const domainParts = hostname.split('.');
  const domains = ['', hostname, `.${hostname}`];
  while (domainParts.length > 1) {
    domains.push(`.${domainParts.join('.')}`);
    domainParts.shift();
  }
  const paths = ['/', window.location.pathname, ''];
  const cookieNames = ['googtrans', 'googtrans_opt', 'googtrans_domain', '_googtrans'];

  domains.forEach((d) => {
    paths.forEach((p) => {
      cookieNames.forEach((c) => {
        document.cookie = `${c}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${p}; ${d ? `domain=${d};` : ''}`;
        document.cookie = `${c}=/en/en; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${p}; ${d ? `domain=${d};` : ''}`;
      });
    });
  });
  try {
    sessionStorage.removeItem('googtrans');
    localStorage.removeItem('googtrans');
  } catch {}
}

// Detect whether Google Translate has mutated the live DOM (not our React source strings)
function isPageTranslatedByGoogle(): boolean {
  if (typeof document === 'undefined') return false;
  const htmlEl = document.documentElement;
  const bodyEl = document.body;
  return (
    htmlEl.classList.contains('translated-ltr') ||
    htmlEl.classList.contains('translated-rtl') ||
    (bodyEl?.classList.contains('translated-ltr') ?? false) ||
    !!document.querySelector('font')
  );
}

// Programmatically trigger Google Translate DOM translation engine (non-English targets only)
function triggerGoogleTranslateDOM(langCode: string) {
  if (langCode === 'en') return;

  setGoogleTranslateCookie(langCode);

  const applyChange = () => {
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
      return true;
    }
    return false;
  };

  if (!applyChange()) {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (applyChange() || attempts > 25) {
        clearInterval(interval);
      }
    }, 150);
  }
}

import { TranslationLoadingScreen } from '../components/common/TranslationLoadingScreen';

const LANGUAGE_METADATA: Record<string, { name: string; nativeName: string }> = {
  en: { name: 'English', nativeName: 'English' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी' },
  mr: { name: 'Marathi', nativeName: 'मराठी' },
  gu: { name: 'Gujarati', nativeName: 'ગુજરાતી' },
  bn: { name: 'Bengali', nativeName: 'বাংলা' },
  ta: { name: 'Tamil', nativeName: 'தமிழ்' },
  te: { name: 'Telugu', nativeName: 'తెలుగు' },
  kn: { name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  ml: { name: 'Malayalam', nativeName: 'മലയാളം' },
  pa: { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  or: { name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  as: { name: 'Assamese', nativeName: 'অসমীয়া' },
  ur: { name: 'Urdu', nativeName: 'اردو' },
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      return (localStorage.getItem('app_lang') as Language) || 'en';
    } catch {
      return 'en';
    }
  });
  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>(getInitialCache);
  const [isTranslating, setIsTranslating] = useState(false);

  // Check if a language switch was active across reload
  const [isLanguageSwitching, setIsLanguageSwitching] = useState<boolean>(() => {
    try {
      const raw = sessionStorage.getItem('tm_switching_lang');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Date.now() - (parsed.timestamp || 0) < 15000) {
          return true;
        }
      }
    } catch {}
    return false;
  });

  const [isComplete, setIsComplete] = useState<boolean>(false);

  const [switchingTarget, setSwitchingTarget] = useState<{ code: string; name: string; nativeName: string }>(() => {
    try {
      const raw = sessionStorage.getItem('tm_switching_lang');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.code) {
          return { code: parsed.code, name: parsed.name, nativeName: parsed.nativeName };
        }
      }
      const saved = localStorage.getItem('app_lang') || 'en';
      const meta = LANGUAGE_METADATA[saved] || { name: saved.toUpperCase(), nativeName: saved.toUpperCase() };
      return { code: saved, ...meta };
    } catch {
      return { code: 'en', name: 'English', nativeName: 'English' };
    }
  });

  useEffect(() => {
    const saved = localStorage.getItem('app_lang') as Language;
    if (saved && saved !== 'en') {
      setLangState(saved);
      triggerGoogleTranslateDOM(saved);
    } else {
      setLangState('en');
      // Strip GT cookies only — reload renders pristine English from React, never machine-translated English
      clearGoogleTranslateCookies();
    }
  }, []);

  // Monitor DOM translation status when language switching is active
  useEffect(() => {
    if (!isLanguageSwitching) return;

    const targetCode = switchingTarget.code;

    let finished = false;
    const markDone = () => {
      if (finished) return;
      finished = true;
      setIsComplete(true);
      setTimeout(() => {
        setIsLanguageSwitching(false);
        setIsComplete(false);
      }, 500);
    };

    // If switching to English, the native DOM is already pure English
    if (targetCode === 'en') {
      const timer = setTimeout(() => {
        markDone();
      }, 700);
      return () => clearTimeout(timer);
    }

    const checkIsTranslated = () => {
      const htmlEl = document.documentElement;
      const bodyEl = document.body;
      const hasTranslatedClass =
        htmlEl.classList.contains('translated-ltr') ||
        htmlEl.classList.contains('translated-rtl') ||
        (bodyEl && bodyEl.classList.contains('translated-ltr'));
      const hasFontTags = !!document.querySelector('font');
      return hasTranslatedClass || hasFontTags;
    };

    // Guarantee minimum comfortable loading duration (at least 750ms) so user enjoys the smooth animation
    const minTimer = setTimeout(() => {
      if (checkIsTranslated()) {
        markDone();
      }
    }, 850);

    // Set up MutationObserver to detect Google Translate's DOM mutations
    const observer = new MutationObserver(() => {
      if (checkIsTranslated()) {
        observer.disconnect();
        setTimeout(markDone, 200);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'lang'],
    });

    const pollInterval = setInterval(() => {
      if (checkIsTranslated()) {
        clearInterval(pollInterval);
        observer.disconnect();
        markDone();
      }
    }, 200);

    // Safety fallback: smoothly complete after 2400ms in case Google Translate is delayed
    const fallbackTimer = setTimeout(() => {
      observer.disconnect();
      clearInterval(pollInterval);
      markDone();
    }, 2400);

    return () => {
      clearTimeout(minTimer);
      clearInterval(pollInterval);
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [isLanguageSwitching, switchingTarget.code]);

  const setLang = (newLang: Language) => {
    const revertingToOriginalEnglish = newLang === 'en' && isPageTranslatedByGoogle();
    if (newLang === lang && !revertingToOriginalEnglish) return;

    const meta = LANGUAGE_METADATA[newLang] || {
      name: newLang.toUpperCase(),
      nativeName: newLang.toUpperCase(),
    };

    const targetInfo = { code: newLang, name: meta.name, nativeName: meta.nativeName };
    setSwitchingTarget(targetInfo);
    setIsLanguageSwitching(true);
    setIsComplete(false);

    setLangState(newLang);

    if (newLang === 'en') {
      try {
        localStorage.setItem('app_lang', 'en');
      } catch {}
      clearGoogleTranslateCookies();

      // Full reload with GT cookies cleared — restores original English source text from React,
      // not a machine translation back from Hindi/Marathi/etc.
      setTimeout(() => {
        clearGoogleTranslateCookies();
        window.location.reload();
      }, 250);
      return;
    }

    try {
      localStorage.setItem('app_lang', newLang);
      sessionStorage.setItem('tm_switching_lang', JSON.stringify({
        code: newLang,
        name: meta.name,
        nativeName: meta.nativeName,
        timestamp: Date.now(),
      }));
    } catch {}
    setGoogleTranslateCookie(newLang);
    triggerGoogleTranslateDOM(newLang);

    // Clean page reload with googtrans cookie active guarantees Google Translate translates all page elements
    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  // Plain English pass-through: allows Google Translate DOM engine to translate cleanly without React DOM reconciliation conflicts
  const t = useCallback(
    (englishText: string): string => {
      return englishText || '';
    },
    []
  );

  const translateBio = async (text: string, targetLang: Language): Promise<string> => {
    if (targetLang === 'en') return text;
    if (translations[targetLang]?.[text] && translations[targetLang][text] !== text) {
      return translations[targetLang][text];
    }
    setIsTranslating(true);
    try {
      const result = await fetchLiveTranslation(text, targetLang);
      setTranslations((prev) => {
        const updated = {
          ...prev,
          [targetLang]: { ...(prev[targetLang] || {}), [text]: result },
        };
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
      return result;
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t, translateBio, isTranslating }}>
      {children}
      <TranslationLoadingScreen
        isOpen={isLanguageSwitching}
        targetLangCode={switchingTarget.code}
        targetLangName={switchingTarget.name}
        targetNativeName={switchingTarget.nativeName}
        isComplete={isComplete}
      />
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

// Inline JSX translation component helper: <T>Your English Text</T>
export const T: React.FC<{ children: string }> = ({ children }) => {
  const { t } = useI18n();
  return <>{t(children)}</>;
};
