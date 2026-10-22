/**
 * Navigation Translation Helper
 * Provides standard, concise UI/UX button labels across supported languages.
 * Specifically ensures back buttons display professional, concise text
 * like "वापस" (Vaapas) instead of full sentences like "घर वापस जा रहा हूँ".
 */

export const BACK_BUTTON_LABELS: Record<string, string> = {
  en: 'Back',
  hi: 'वापस',
  mr: 'मागे',
  gu: 'પાછા',
  bn: 'ফিরে যান',
  ta: 'பின்செல்',
  te: 'వెనుకకు',
  kn: 'ಹಿಂದೆ',
  ml: 'തിരികെ',
  pa: 'ਵਾਪਸ',
  or: 'ପଛକୁ',
  as: 'উভতি যাওক',
  ur: 'واپس',
};

export const HOME_BUTTON_LABELS: Record<string, string> = {
  en: 'Home',
  hi: 'होम',
  mr: 'मुख्यपृष्ठ',
  gu: 'હોમ',
  bn: 'হোম',
  ta: 'முகப்பு',
  te: 'హోమ్',
  kn: 'ಮುಖಪುಟ',
  ml: 'ഹോം',
  pa: 'ਹੋਮ',
  or: 'ମୁଖ୍ୟପୃଷ୍ଠା',
  as: 'মূলপৃষ্ঠা',
  ur: 'ہوم',
};

export function getBackLabel(lang: string = 'en'): string {
  const code = (lang || 'en').toLowerCase().split('-')[0];
  return BACK_BUTTON_LABELS[code] || 'Back';
}

export function getHomeLabel(lang: string = 'en'): string {
  const code = (lang || 'en').toLowerCase().split('-')[0];
  return HOME_BUTTON_LABELS[code] || 'Home';
}
