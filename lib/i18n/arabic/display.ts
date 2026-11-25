/**
 * Keyword card text order.
 * English term and definition stay first. Arabic term and definition follow
 * only when Arabic is selected and a translation exists.
 */

export type TextDirection = 'ltr' | 'rtl';

export interface KeywordDisplayInput {
  language: string | null | undefined;
  term_en: string;
  translation_ar?: string | null;
  explanation_en?: string | null;
  explanation_ar?: string | null;
  arabic_review?: 'approved' | 'draft' | null;
}

export interface KeywordDisplay {
  term: string;
  termLang: 'en';
  termDir: 'ltr';
  englishDefinition: string;
  arabicTerm: string;
  arabicDefinition: string;
  showArabic: boolean;
  /** True only for the development preview of an unreviewed draft. */
  draft: boolean;
  /** True when Arabic was requested and no Arabic term or definition exists. */
  fallback: boolean;
}

export function isArabicLanguage(language: string | null | undefined): boolean {
  return String(language || '').trim().toLowerCase() === 'ar';
}

export function directionForLanguage(language: string | null | undefined): TextDirection {
  const lang = String(language || '').trim().toLowerCase();
  if (lang === 'ar' || lang === 'ur' || lang === 'fa') return 'rtl';
  return 'ltr';
}

export function keywordDisplay(input: KeywordDisplayInput): KeywordDisplay {
  const arabic = isArabicLanguage(input.language);
  const arabicTerm = String(input.translation_ar || '').trim();
  const english = String(input.explanation_en || '').trim();
  const arabicDefinition = String(input.explanation_ar || '').trim();
  const showArabic = arabic && (arabicTerm.length > 0 || arabicDefinition.length > 0);
  return {
    term: input.term_en,
    termLang: 'en',
    termDir: 'ltr',
    englishDefinition: english,
    arabicTerm,
    arabicDefinition,
    showArabic,
    draft: showArabic && input.arabic_review === 'draft',
    fallback: arabic && !showArabic,
  };
}

/** Saved explanation cards keep the language stored on the card. */
export function savedExplanationDirection(cardLanguage: string | null | undefined): TextDirection {
  return directionForLanguage(cardLanguage);
}

export interface SavedCardLanguageInput {
  /** Learner language. English is `off` or `en`. */
  language: string | null | undefined;
  englishBody: string;
  arabicTitle?: string | null;
  arabicBody?: string | null;
  /**
   * Translation for a future selected language. Arabic is not passed here;
   * it uses the Arabic fields so another language cannot show Arabic by mistake.
   */
  selected?: { lang: string; title?: string | null; body?: string | null } | null;
}

export interface SavedCardLanguageView {
  englishBody: string;
  extraTitle: string;
  extraBody: string;
  extraLang: string;
  extraDir: TextDirection;
  showExtra: boolean;
}

function selectedLanguage(language: string | null | undefined): string {
  const lang = String(language || '').trim().toLowerCase();
  if (!lang || lang === 'off' || lang === 'en') return 'en';
  return lang;
}

/**
 * Saved Cards copy for the selected language.
 * English shows English only. Arabic shows English plus Arabic.
 * Any other selected language shows English plus that translation only.
 */
export function savedCardLanguageView(input: SavedCardLanguageInput): SavedCardLanguageView {
  const lang = selectedLanguage(input.language);
  const englishBody = String(input.englishBody || '').trim();
  const empty: SavedCardLanguageView = {
    englishBody,
    extraTitle: '',
    extraBody: '',
    extraLang: 'en',
    extraDir: 'ltr',
    showExtra: false,
  };
  if (lang === 'en') return empty;
  if (lang === 'ar') {
    const extraTitle = String(input.arabicTitle || '').trim();
    const extraBody = String(input.arabicBody || '').trim();
    return {
      englishBody,
      extraTitle,
      extraBody,
      extraLang: 'ar',
      extraDir: 'rtl',
      showExtra: extraTitle.length > 0 || extraBody.length > 0,
    };
  }
  const title = String(input.selected?.title || '').trim();
  const body = String(input.selected?.body || '').trim();
  const selectedLang = String(input.selected?.lang || lang).trim().toLowerCase() || lang;
  if (selectedLang === 'ar') return empty;
  return {
    englishBody,
    extraTitle: title,
    extraBody: body,
    extraLang: selectedLang,
    extraDir: directionForLanguage(selectedLang),
    showExtra: title.length > 0 || body.length > 0,
  };
}
