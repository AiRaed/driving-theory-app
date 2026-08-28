/**
 * Smart Vocabulary Hints — types
 *
 * Separate from existing pedagogical "Learning Hints" (keywords.term starting with "hint").
 * These explain difficult UK driving vocabulary only; they must never reveal answers.
 */

import type { TranslationLang } from '@/lib/translations';

/** Learner UI languages that need vocab explanations (English = 'off' → 'en'). */
export const VOCAB_HINT_LANGS = ['en', 'ar', 'ur', 'ro', 'pl', 'pt', 'bn', 'fa'] as const;
export type VocabHintLang = (typeof VOCAB_HINT_LANGS)[number];

export type VocabHintTranslations = Record<VocabHintLang, string>;

export interface VocabHint {
  /** English term or short phrase as it appears in the question/options */
  term: string;
  /** Short explanations keyed by language code */
  translations: VocabHintTranslations;
}

/** Per-question hint list (empty array = analysed, no useful vocab). */
export type VocabHintsByQuestionId = Record<string, VocabHint[]>;

/** Reusable dictionary for consistent meanings across questions. */
export type VocabDictionary = Record<
  string,
  {
    translations: VocabHintTranslations;
    /** Optional note about when this meaning applies */
    contextNote?: string;
  }
>;

export interface VocabHintsProgress {
  version: 1;
  updatedAt: string;
  /** Question IDs successfully processed (including those with zero hints) */
  processedIds: string[];
  failedIds: string[];
  skippedIds: string[];
  stats: {
    questionsProcessed: number;
    hintsCreated: number;
    apiCalls: number;
    dictionaryHits: number;
  };
}

/** Map TranslationLang ('off'|'ar'|'ur'|'ro'|'pl'|'pt'|'bn'|'fa') → vocab explanation language. */
export function translationLangToVocabLang(lang: TranslationLang): VocabHintLang {
  if (lang === 'off') return 'en';
  return lang;
}
