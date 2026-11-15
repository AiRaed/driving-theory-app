/**
 * Keyword Cards (LingoTheory V2).
 *
 * One row per difficult term: canonical English, optional Arabic, one optional
 * image. Independent of per-language keyword_cards and of Explanation Hints.
 * Learners only see status = 'published'. Mock Test must not render these.
 */

import type { LearningCardStatus } from '../learning-cards/types';

export const KEYWORD_CARDS_MIGRATION = '0011_keyword_cards.sql';

export type KeywordCardStatus = LearningCardStatus;

export interface KeywordRecord {
  id: string;
  term_en: string;
  term_normalized: string;
  explanation_en: string;
  translation_ar: string;
  explanation_ar: string;
  image_url: string | null;
  image_alt: string | null;
  image_storage_path: string | null;
  status: KeywordCardStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  published_at: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

export interface KeywordQuestionLink {
  keyword_id: string;
  question_id: string;
  created_at: string;
  created_by: string | null;
}

export interface KeywordSave {
  id: string;
  user_id: string;
  keyword_id: string;
  created_at: string;
}

/** Fields a learner may see. No review notes and no answer key. */
export interface LearnerKeywordCard {
  id: string;
  term_en: string;
  translation_ar: string;
  explanation_en: string;
  explanation_ar: string;
  image_url: string | null;
  image_alt: string | null;
}

export interface KeywordInput {
  term_en: string;
  explanation_en: string;
  translation_ar?: string | null;
  explanation_ar?: string | null;
  image_url?: string | null;
  image_alt?: string | null;
  notes?: string | null;
}

export interface KeywordImageInput {
  image_url: string | null;
  image_alt?: string | null;
  image_storage_path?: string | null;
}
