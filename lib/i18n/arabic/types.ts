/**
 * Arabic-first draft types.
 * These drafts are pending review. They are not published and they do not
 * authorise a database write.
 */

export type ArabicReviewStatus = 'draft';

export interface GlossaryEntry {
  en: string;
  ar: string;
  /** keyword = one existing Keyword Card. support = shared wording only. */
  kind: 'keyword' | 'support';
}

export interface ArabicQuestionDraft {
  id: string;
  question: string;
  answers: [string, string, string, string];
  explanation: string;
  review_status: ArabicReviewStatus;
  human_reviewed: false;
  published: false;
}

export interface ArabicQuestionDraftFile {
  schema: 'lingotheory.ar_question_drafts.v1';
  language: 'ar';
  review_status: ArabicReviewStatus;
  human_reviewed: false;
  published: false;
  do_not_write_database: true;
  do_not_publish: true;
  source: string;
  question_count: number;
  note: string;
  questions: ArabicQuestionDraft[];
}

export interface ArabicHintDraft {
  question_id: string;
  arabic: string;
  provisional: boolean;
  review_status: ArabicReviewStatus;
  human_reviewed: false;
  published: false;
  dvsa_approved: false;
}

export interface ArabicHintDraftFile {
  schema: 'lingotheory.ar_explanation_hint_drafts.v1';
  language: 'ar';
  review_status: ArabicReviewStatus;
  human_reviewed: false;
  published: false;
  do_not_write_database: true;
  do_not_publish: true;
  review_required: true;
  count: number;
  needs_explanation: number;
  review_later: number;
  note: string;
  drafts: ArabicHintDraft[];
}

export interface ArabicKeywordDraft {
  draft_id: string;
  term_en: string;
  term_normalized: string;
  translation_ar: string;
  explanation_ar: string;
  image_url: string | null;
  image_alt: string | null;
  question_ids: string[];
  review_status: ArabicReviewStatus;
  human_reviewed: false;
  published: false;
}

export interface ArabicKeywordDraftFile {
  schema: 'lingotheory.ar_keyword_drafts.v1';
  language: 'ar';
  review_status: ArabicReviewStatus;
  human_reviewed: false;
  published: false;
  do_not_write_database: true;
  do_not_publish: true;
  review_required: true;
  keyword_count: number;
  note: string;
  keywords: ArabicKeywordDraft[];
}

export interface TranslationIssue {
  severity: 'error' | 'warning';
  code: string;
  target: string;
  message: string;
}
