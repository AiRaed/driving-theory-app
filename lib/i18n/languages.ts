/**
 * Single source of truth for learner languages.
 * Onboarding, LanguageSelector, Practice, Mock Test, and analytics all consume this list.
 *
 * To add a language later (e.g. Persian): add one entry here, add UI strings,
 * and add the locale JSON / vocab translations. Do not duplicate language lists in pages.
 */

export const TRANSLATION_LANGS = ['off', 'ar', 'ur', 'ro', 'pl', 'pt', 'bn', 'fa'] as const;
export type TranslationLang = (typeof TRANSLATION_LANGS)[number];

export type TextDirection = 'ltr' | 'rtl';

export interface SupportedLanguage {
  /** App/internal code. English is 'off' (existing TranslationLang). */
  code: TranslationLang;
  /** URL / campaign / analytics code ('en' for English). */
  urlCode: string;
  nativeName: string;
  englishName: string;
  dir: TextDirection;
  enabled: boolean;
  flag: string;
}

export const SUPPORTED_LANGUAGES: readonly SupportedLanguage[] = [
  { code: 'off', urlCode: 'en', nativeName: 'English', englishName: 'English', dir: 'ltr', enabled: true, flag: '🇬🇧' },
  { code: 'ar', urlCode: 'ar', nativeName: 'العربية', englishName: 'Arabic', dir: 'rtl', enabled: true, flag: '🇸🇦' },
  { code: 'ur', urlCode: 'ur', nativeName: 'اردو', englishName: 'Urdu', dir: 'rtl', enabled: true, flag: '🇵🇰' },
  { code: 'ro', urlCode: 'ro', nativeName: 'Română', englishName: 'Romanian', dir: 'ltr', enabled: true, flag: '🇷🇴' },
  { code: 'pl', urlCode: 'pl', nativeName: 'Polski', englishName: 'Polish', dir: 'ltr', enabled: true, flag: '🇵🇱' },
  { code: 'pt', urlCode: 'pt', nativeName: 'Português', englishName: 'Portuguese', dir: 'ltr', enabled: true, flag: '🇵🇹' },
  { code: 'bn', urlCode: 'bn', nativeName: 'বাংলা', englishName: 'Bengali', dir: 'ltr', enabled: true, flag: '🇧🇩' },
  { code: 'fa', urlCode: 'fa', nativeName: 'فارسی', englishName: 'Persian', dir: 'rtl', enabled: true, flag: '🇮🇷' },
] as const;

export const ENABLED_LANGUAGES = SUPPORTED_LANGUAGES.filter((l) => l.enabled);

export const TRANSLATION_LANG_KEY = 'translationLang';
export const LANGUAGE_CHOSEN_KEY = 'ltLanguageChosen';
export const CAMPAIGN_LANG_KEY = 'ltCampaignLang';

export function isTranslationLang(value: string | null | undefined): value is TranslationLang {
  return !!value && (TRANSLATION_LANGS as readonly string[]).includes(value);
}

export function getLanguageMeta(code: TranslationLang): SupportedLanguage {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code) ?? SUPPORTED_LANGUAGES[0];
}

export function isRtlLang(lang: TranslationLang): boolean {
  return getLanguageMeta(lang).dir === 'rtl';
}

export function isLtrTranslationLang(lang: TranslationLang): boolean {
  return lang === 'ro' || lang === 'pl' || lang === 'pt' || lang === 'bn';
}

/** Map TranslationLang ↔ analytics / DB preferred_language ('en' not 'off'). */
export function toAnalyticsLanguage(lang: TranslationLang | string | null | undefined): string {
  if (lang === 'ar' || lang === 'ur' || lang === 'ro' || lang === 'pl' || lang === 'pt' || lang === 'bn' || lang === 'fa') {
    return lang;
  }
  return 'en';
}

export function fromAnalyticsLanguage(value: string | null | undefined): TranslationLang {
  if (value === 'en' || value === 'off') return 'off';
  if (isTranslationLang(value) && value !== 'off') return value;
  return 'off';
}

export function parseUrlLang(raw: string | null | undefined): TranslationLang | null {
  if (!raw) return null;
  const v = raw.trim().toLowerCase();
  if (v === 'en' || v === 'off') return 'off';
  const match = ENABLED_LANGUAGES.find((l) => l.urlCode === v || l.code === v);
  return match ? match.code : null;
}

export function getTranslationLang(): TranslationLang {
  if (typeof window === 'undefined') return 'off';
  try {
    const stored = localStorage.getItem(TRANSLATION_LANG_KEY);
    if (isTranslationLang(stored)) return stored;
  } catch {
    // ignore
  }
  return 'off';
}

export function setTranslationLang(lang: TranslationLang): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TRANSLATION_LANG_KEY, lang);
  } catch {
    // ignore
  }
}

export function hasStoredTranslationLang(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return isTranslationLang(localStorage.getItem(TRANSLATION_LANG_KEY));
  } catch {
    return false;
  }
}

export function hasChosenLanguageLocally(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(LANGUAGE_CHOSEN_KEY) === '1';
  } catch {
    return false;
  }
}

export function markLanguageChosenLocally(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LANGUAGE_CHOSEN_KEY, '1');
  } catch {
    // ignore
  }
}

export function getCampaignLang(): TranslationLang | null {
  if (typeof window === 'undefined') return null;
  try {
    return parseUrlLang(sessionStorage.getItem(CAMPAIGN_LANG_KEY));
  } catch {
    return null;
  }
}

export function setCampaignLang(lang: TranslationLang): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(CAMPAIGN_LANG_KEY, lang === 'off' ? 'en' : lang);
  } catch {
    // ignore
  }
}
