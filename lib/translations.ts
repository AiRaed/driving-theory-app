// Translation loading utility — English (off) + Arabic + Urdu + Romanian + Polish + Portuguese + Bengali
export type { TranslationLang } from '@/lib/i18n/languages';
export {
  TRANSLATION_LANG_KEY,
  getTranslationLang,
  setTranslationLang,
  isLtrTranslationLang,
} from '@/lib/i18n/languages';

/** Locale JSON shape used by Urdu, Romanian, Polish, Portuguese, Bengali (and future locale files). */
export interface TranslationData {
  [topic: string]: {
    [questionId: string]: {
      promptUr?: string;
      promptRo?: string;
      promptPl?: string;
      promptPt?: string;
      promptBn?: string;
      options?: Array<{ ur?: string; ro?: string; pl?: string; pt?: string; bn?: string }>;
    };
  };
}

type LocaleFileLang = 'ur' | 'ro' | 'pl' | 'pt' | 'bn';

let urTranslations: TranslationData | null = null;
let roTranslations: TranslationData | null = null;
let plTranslations: TranslationData | null = null;
let ptTranslations: TranslationData | null = null;
let bnTranslations: TranslationData | null = null;

function getLocaleCache(lang: LocaleFileLang): TranslationData | null {
  if (lang === 'ur') return urTranslations;
  if (lang === 'ro') return roTranslations;
  if (lang === 'pl') return plTranslations;
  if (lang === 'pt') return ptTranslations;
  return bnTranslations;
}

function setLocaleCache(lang: LocaleFileLang, data: TranslationData): void {
  if (lang === 'ur') urTranslations = data;
  else if (lang === 'ro') roTranslations = data;
  else if (lang === 'pl') plTranslations = data;
  else if (lang === 'pt') ptTranslations = data;
  else bnTranslations = data;
}

async function loadLocaleJson(
  lang: LocaleFileLang,
  forceReload: boolean
): Promise<TranslationData | null> {
  const cache = getLocaleCache(lang);
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
    setLocaleCache(lang, data);
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

/** Load Polish translations from JSON file */
export async function loadPolishTranslations(
  forceReload: boolean = false
): Promise<TranslationData | null> {
  return loadLocaleJson('pl', forceReload);
}

/** Load Portuguese (Portugal) translations from JSON file */
export async function loadPortugueseTranslations(
  forceReload: boolean = false
): Promise<TranslationData | null> {
  return loadLocaleJson('pt', forceReload);
}

/** Load Bengali translations from JSON file (UI-ready; question bank may still be incomplete). */
export async function loadBengaliTranslations(
  forceReload: boolean = false
): Promise<TranslationData | null> {
  return loadLocaleJson('bn', forceReload);
}

/** @deprecated Prefer loadRomanianTranslations — alias kept for clarity */
export const loadRoTranslations = loadRomanianTranslations;

/** @deprecated Prefer loadPolishTranslations — alias kept for clarity */
export const loadPlTranslations = loadPolishTranslations;

/** @deprecated Prefer loadPortugueseTranslations — alias kept for clarity */
export const loadPtTranslations = loadPortugueseTranslations;

function getLocalePrompt(
  questionData: TranslationData[string][string] | undefined,
  lang: LocaleFileLang
): string | undefined {
  if (!questionData) return undefined;
  if (lang === 'ur') return questionData.promptUr;
  if (lang === 'ro') return questionData.promptRo;
  if (lang === 'pl') return questionData.promptPl;
  if (lang === 'pt') return questionData.promptPt;
  return questionData.promptBn;
}

function getLocaleOption(
  questionData: TranslationData[string][string] | undefined,
  index: number,
  lang: LocaleFileLang
): string | undefined {
  const opt = questionData?.options?.[index];
  if (!opt) return undefined;
  if (lang === 'ur') return opt.ur;
  if (lang === 'ro') return opt.ro;
  if (lang === 'pl') return opt.pl;
  if (lang === 'pt') return opt.pt;
  return opt.bn;
}

export function isLocaleFileLang(lang: string): lang is LocaleFileLang {
  return lang === 'ur' || lang === 'ro' || lang === 'pl' || lang === 'pt' || lang === 'bn';
}

// Get translation for a question (locale-file langs: ur, ro, pl, pt, bn)
export function getQuestionTranslation(
  questionId: string,
  topic: string,
  lang: import('@/lib/i18n/languages').TranslationLang,
  localeData: TranslationData | null
): { prompt?: string; options?: string[] } | null {
  if (lang === 'off' || lang === 'ar') {
    return null;
  }

  if (isLocaleFileLang(lang) && localeData) {
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

/** Option translation for locale-file languages by matching English option order */
export function getLocaleOptionTranslation(
  optionEn: string,
  originalOptions: Array<{ en: string }>,
  localeData: TranslationData | null,
  questionId: string,
  topic: string,
  lang: LocaleFileLang
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

export function getPolishOptionTranslation(
  optionEn: string,
  originalOptions: Array<{ en: string }>,
  plTranslationsData: TranslationData | null,
  questionId: string,
  topic: string
): string | null {
  return getLocaleOptionTranslation(
    optionEn,
    originalOptions,
    plTranslationsData,
    questionId,
    topic,
    'pl'
  );
}

export function getPortugueseOptionTranslation(
  optionEn: string,
  originalOptions: Array<{ en: string }>,
  ptTranslationsData: TranslationData | null,
  questionId: string,
  topic: string
): string | null {
  return getLocaleOptionTranslation(
    optionEn,
    originalOptions,
    ptTranslationsData,
    questionId,
    topic,
    'pt'
  );
}

export function getBengaliOptionTranslation(
  optionEn: string,
  originalOptions: Array<{ en: string }>,
  bnTranslationsData: TranslationData | null,
  questionId: string,
  topic: string
): string | null {
  return getLocaleOptionTranslation(
    optionEn,
    originalOptions,
    bnTranslationsData,
    questionId,
    topic,
    'bn'
  );
}

export function getQuestionPromptTranslation(
  question: { promptEn: string; promptAr?: string; id: string; topic: string },
  lang: import('@/lib/i18n/languages').TranslationLang,
  localeData: TranslationData | null
): string {
  if (lang === 'off') return '';
  if (lang === 'ar') return question.promptAr || '';
  if (isLocaleFileLang(lang) && localeData) {
    const translation = getQuestionTranslation(question.id, question.topic, lang, localeData);
    return translation?.prompt || '';
  }
  return '';
}

export function getOptionTranslation(
  option: { en: string; ar: string },
  lang: import('@/lib/i18n/languages').TranslationLang,
  localeData: TranslationData | null,
  originalOptions: Array<{ en: string }>,
  questionId: string,
  topic: string
): string {
  if (lang === 'off') return '';
  if (lang === 'ar') return option.ar || '';
  if (isLocaleFileLang(lang)) {
    return (
      getLocaleOptionTranslation(option.en, originalOptions, localeData, questionId, topic, lang) ||
      ''
    );
  }
  return '';
}
