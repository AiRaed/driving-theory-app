// Translation loading utility
export type TranslationLang = 'off' | 'ar' | 'ur';

export interface TranslationData {
  [topic: string]: {
    [questionId: string]: {
      promptUr?: string;
      options?: Array<{ ur: string }>;
    };
  };
}

let urTranslations: TranslationData | null = null;

// Load Urdu translations from JSON file
export async function loadUrduTranslations(forceReload: boolean = false): Promise<TranslationData | null> {
  if (urTranslations !== null && !forceReload) {
    return urTranslations;
  }

  try {
    // Add cache-busting query parameter when force reloading
    const url = forceReload ? `/locales/ur.json?t=${Date.now()}` : '/locales/ur.json';
    const response = await fetch(url);
    if (!response.ok) {
      console.warn('Failed to load Urdu translations: response not ok', response.status);
      return null;
    }
    const data = await response.json();
    // Always update the cached translations, even if forceReload is false
    // This ensures we have the latest data
    urTranslations = data;
    
    // Verify critical sections exist
    if (urTranslations && !urTranslations.alertness) {
      console.warn('[Translations] alertness section missing in loaded translations');
    }
    
    return urTranslations;
  } catch (error) {
    console.error('Failed to load Urdu translations:', error);
    return null;
  }
}

// Get translation for a question
export function getQuestionTranslation(
  questionId: string,
  topic: string,
  lang: TranslationLang,
  urTranslationsData: TranslationData | null
): { prompt?: string; options?: string[]; optionsMap?: Map<string, string> } | null {
  if (lang === 'off') {
    return null;
  }

  if (lang === 'ar') {
    // Arabic is stored directly in the question data, return null to use existing logic
    return null;
  }

  if (lang === 'ur' && urTranslationsData) {
    if (!urTranslationsData[topic]) {
      console.warn(`[Translations] Topic "${topic}" not found in Urdu translations. Available topics:`, Object.keys(urTranslationsData));
      return null;
    }

    const topicData = urTranslationsData[topic];
    if (!topicData[questionId]) {
      console.warn(`[Translations] Question "${questionId}" not found in topic "${topic}". Available questions:`, Object.keys(topicData).slice(0, 10));
      return null;
    }

    const questionData = topicData[questionId];
    if (!questionData.promptUr) {
      console.warn(`[Translations] Question "${questionId}" missing promptUr in topic "${topic}"`);
      return null;
    }

    const optionsArray = questionData.options?.map(opt => opt.ur) || [];
    
    // Create a map from English text to Urdu (we'll need to match by original order)
    // This will be used to match shuffled options
    return {
      prompt: questionData.promptUr,
      options: optionsArray,
    };
  }

  return null;
}

// Get Urdu translation for a specific option by matching with original options
export function getUrduOptionTranslation(
  optionEn: string,
  originalOptions: Array<{ en: string }>,
  urTranslationsData: TranslationData | null,
  questionId: string,
  topic: string
): string | null {
  if (!urTranslationsData) {
    console.warn(`[Translations] No Urdu translations data available for ${questionId}`);
    return null;
  }
  
  const topicData = urTranslationsData[topic];
  if (!topicData) {
    console.warn(`[Translations] Topic "${topic}" not found for ${questionId}`);
    return null;
  }

  const questionData = topicData[questionId];
  if (!questionData || !questionData.options) {
    console.warn(`[Translations] Question "${questionId}" or options not found in topic "${topic}"`);
    return null;
  }

  // Find the index of the option in the original array by matching English text
  const originalIndex = originalOptions.findIndex(opt => opt.en === optionEn);
  if (originalIndex === -1) {
    console.warn(`[Translations] Option not found in original options for ${questionId}: "${optionEn.substring(0, 50)}..."`);
    return null;
  }
  
  if (originalIndex >= questionData.options.length) {
    console.warn(`[Translations] Option index out of bounds for ${questionId}: originalIndex=${originalIndex}, options.length=${questionData.options.length}`);
    return null;
  }

  const urTranslation = questionData.options[originalIndex]?.ur;
  if (!urTranslation) {
    console.warn(`[Translations] Urdu translation missing for option ${originalIndex} in ${questionId}`);
    return null;
  }

  return urTranslation;
}

// Get localStorage key for translation language
export const TRANSLATION_LANG_KEY = 'translationLang';

// Get translation language from localStorage
export function getTranslationLang(): TranslationLang {
  if (typeof window === 'undefined') return 'off';
  const stored = localStorage.getItem(TRANSLATION_LANG_KEY);
  if (stored === 'ar' || stored === 'ur') {
    return stored;
  }
  return 'off';
}

// Set translation language in localStorage
export function setTranslationLang(lang: TranslationLang): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TRANSLATION_LANG_KEY, lang);
}

/**
 * Get translation text for a question prompt based on selected language only
 * @param question - Question object with promptEn and promptAr
 * @param lang - Selected translation language ('off', 'ar', 'ur')
 * @param urTranslationsData - Urdu translations data (required if lang === 'ur')
 * @param questionId - Question ID (required if lang === 'ur')
 * @param topic - Question topic (required if lang === 'ur')
 * @returns Translation string or empty string if lang is 'off' or translation not found
 */
export function getQuestionPromptTranslation(
  question: { promptEn: string; promptAr?: string; id: string; topic: string },
  lang: TranslationLang,
  urTranslationsData: TranslationData | null
): string {
  if (lang === 'off') {
    return '';
  }
  
  if (lang === 'ar') {
    return question.promptAr || '';
  }
  
  if (lang === 'ur' && urTranslationsData) {
    const translation = getQuestionTranslation(question.id, question.topic, 'ur', urTranslationsData);
    return translation?.prompt || '';
  }
  
  return '';
}

/**
 * Get translation text for an option based on selected language only
 * @param option - Option object with en and ar
 * @param lang - Selected translation language ('off', 'ar', 'ur')
 * @param urTranslationsData - Urdu translations data (required if lang === 'ur')
 * @param originalOptions - Original options array (required if lang === 'ur')
 * @param questionId - Question ID (required if lang === 'ur')
 * @param topic - Question topic (required if lang === 'ur')
 * @returns Translation string or empty string if lang is 'off' or translation not found
 */
export function getOptionTranslation(
  option: { en: string; ar: string },
  lang: TranslationLang,
  urTranslationsData: TranslationData | null,
  originalOptions: Array<{ en: string }>,
  questionId: string,
  topic: string
): string {
  if (lang === 'off') {
    return '';
  }
  
  if (lang === 'ar') {
    return option.ar || '';
  }
  
  if (lang === 'ur' && urTranslationsData) {
    const urOption = getUrduOptionTranslation(
      option.en,
      originalOptions,
      urTranslationsData,
      questionId,
      topic
    );
    return urOption || '';
  }
  
  return '';
}

