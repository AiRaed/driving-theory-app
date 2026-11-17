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
