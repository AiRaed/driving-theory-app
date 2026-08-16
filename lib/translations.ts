// Translation loading utility — English (off) + Arabic + Urdu + Romanian
export type TranslationLang = 'off' | 'ar' | 'ur' | 'ro';

/** Locale JSON shape used by Urdu and Romanian (and future locale files). */
export interface TranslationData {
  [topic: string]: {
    [questionId: string]: {
      promptUr?: string;
      promptRo?: string;
      options?: Array<{ ur?: string; ro?: string }>;
    };
  };
}

let urTranslations: TranslationData | null = null;
let roTranslations: TranslationData | null = null;

async function loadLocaleJson(
  lang: 'ur' | 'ro',
  forceReload: boolean
): Promise<TranslationData | null> {
  const cache = lang === 'ur' ? urTranslations : roTranslations;
  if (cache !== null && !forceReload) {
    return cache;
  }

  try {
    const url = forceReload
      ? `/locales/${lang}.json?t=${Date.now()}`
      : `/locales/${lang}.json`;
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Failed to load ${lang} translations:`, response.status);
      return null;
    }
    const data = (await response.json()) as TranslationData;
    if (lang === 'ur') urTranslations = data;
    else roTranslations = data;
    return data;
  } catch (error) {
    console.error(`Failed to load ${lang} translations:`, error);
    return null;
  }
}

/** Load Urdu translations from JSON file */
export async function loadUrduTranslations(
  forceReload: boolean = false
): Promise<TranslationData | null> {
  return loadLocaleJson('ur', forceReload);
}

/** Load Romanian translations from JSON file */
export async function loadRomanianTranslations(
  forceReload: boolean = false
): Promise<TranslationData | null> {
  return loadLocaleJson('ro', forceReload);
}

/** @deprecated Prefer loadRomanianTranslations — alias kept for clarity */
export const loadRoTranslations = loadRomanianTranslations;

function getLocalePrompt(
  questionData: TranslationData[string][string] | undefined,
  lang: 'ur' | 'ro'
): string | undefined {
  if (!questionData) return undefined;
  return lang === 'ur' ? questionData.promptUr : questionData.promptRo;
}

function getLocaleOption(
  questionData: TranslationData[string][string] | undefined,
  index: number,
  lang: 'ur' | 'ro'
): string | undefined {
  const opt = questionData?.options?.[index];
  if (!opt) return undefined;
  return lang === 'ur' ? opt.ur : opt.ro;
}

// Get translation for a question (locale-file langs: ur, ro)
export function getQuestionTranslation(
  questionId: string,
  topic: string,
  lang: TranslationLang,
  localeData: TranslationData | null
): { prompt?: string; options?: string[] } | null {
  if (lang === 'off' || lang === 'ar') {
    return null;
  }

  if ((lang === 'ur' || lang === 'ro') && localeData) {
    const topicData = localeData[topic];
    if (!topicData) {
      console.warn(`[Translations] Topic "${topic}" not found for ${lang}`);
      return null;
    }
    const questionData = topicData[questionId];
    if (!questionData) {
      console.warn(`[Translations] Question "${questionId}" not found in topic "${topic}" (${lang})`);
      return null;
    }
    const prompt = getLocalePrompt(questionData, lang);
    if (!prompt) {
      console.warn(`[Translations] Question "${questionId}" missing prompt for ${lang}`);
      return null;
    }
    const optionsArray =
      questionData.options?.map((_, i) => getLocaleOption(questionData, i, lang) || '') || [];
    return { prompt, options: optionsArray };
  }

  return null;
}

/** Option translation for Urdu or Romanian by matching English option order */
export function getLocaleOptionTranslation(
  optionEn: string,
  originalOptions: Array<{ en: string }>,
  localeData: TranslationData | null,
  questionId: string,
  topic: string,
  lang: 'ur' | 'ro'
): string | null {
  if (!localeData) return null;
  const topicData = localeData[topic];
  if (!topicData) return null;
  const questionData = topicData[questionId];
  if (!questionData?.options) return null;
  const originalIndex = originalOptions.findIndex((opt) => opt.en === optionEn);
  if (originalIndex === -1) return null;
  return getLocaleOption(questionData, originalIndex, lang) || null;
}

/** Back-compat wrapper for Urdu option lookup */
export function getUrduOptionTranslation(
  optionEn: string,
  originalOptions: Array<{ en: string }>,
  urTranslationsData: TranslationData | null,
  questionId: string,
  topic: string
): string | null {
  return getLocaleOptionTranslation(
    optionEn,
    originalOptions,
    urTranslationsData,
    questionId,
    topic,
    'ur'
  );
}

export function getRomanianOptionTranslation(
  optionEn: string,
  originalOptions: Array<{ en: string }>,
  roTranslationsData: TranslationData | null,
  questionId: string,
  topic: string
): string | null {
  return getLocaleOptionTranslation(
    optionEn,
    originalOptions,
    roTranslationsData,
    questionId,
    topic,
    'ro'
  );
}

export const TRANSLATION_LANG_KEY = 'translationLang';

export function getTranslationLang(): TranslationLang {
  if (typeof window === 'undefined') return 'off';
  const stored = localStorage.getItem(TRANSLATION_LANG_KEY);
  if (stored === 'ar' || stored === 'ur' || stored === 'ro') {
    return stored;
  }
  return 'off';
}

export function setTranslationLang(lang: TranslationLang): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TRANSLATION_LANG_KEY, lang);
}

export function getQuestionPromptTranslation(
  question: { promptEn: string; promptAr?: string; id: string; topic: string },
  lang: TranslationLang,
  localeData: TranslationData | null
): string {
  if (lang === 'off') return '';
  if (lang === 'ar') return question.promptAr || '';
  if ((lang === 'ur' || lang === 'ro') && localeData) {
    const translation = getQuestionTranslation(question.id, question.topic, lang, localeData);
    return translation?.prompt || '';
  }
  return '';
}

export function getOptionTranslation(
  option: { en: string; ar: string },
  lang: TranslationLang,
  localeData: TranslationData | null,
  originalOptions: Array<{ en: string }>,
  questionId: string,
  topic: string
): string {
  if (lang === 'off') return '';
  if (lang === 'ar') return option.ar || '';
  if (lang === 'ur') {
    return (
      getUrduOptionTranslation(option.en, originalOptions, localeData, questionId, topic) || ''
    );
  }
  if (lang === 'ro') {
    return (
      getRomanianOptionTranslation(option.en, originalOptions, localeData, questionId, topic) ||
      ''
    );
  }
  return '';
}
