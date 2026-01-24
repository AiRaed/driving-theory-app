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
export async function loadUrduTranslations(): Promise<TranslationData | null> {
  if (urTranslations !== null) {
    return urTranslations;
  }

  try {
    const response = await fetch('/locales/ur.json');
    if (!response.ok) {
      return null;
    }
    urTranslations = await response.json();
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
    const topicData = urTranslationsData[topic];
    if (!topicData) return null;

    const questionData = topicData[questionId];
    if (!questionData) return null;

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
  if (!urTranslationsData) return null;
  
  const topicData = urTranslationsData[topic];
  if (!topicData) return null;

  const questionData = topicData[questionId];
  if (!questionData || !questionData.options) return null;

  // Find the index of the option in the original array by matching English text
  const originalIndex = originalOptions.findIndex(opt => opt.en === optionEn);
  if (originalIndex === -1 || originalIndex >= questionData.options.length) return null;

  return questionData.options[originalIndex]?.ur || null;
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

