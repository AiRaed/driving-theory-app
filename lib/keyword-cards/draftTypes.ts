/**
 * Local Keyword Card drafts. Nothing here is published.
 * term_normalized follows keywords.term_normalized in 0011_keyword_cards.sql.
 */

export type KeywordDraftPriority = 'high' | 'medium' | 'low';
export type KeywordDraftGrounding = 'source' | 'editorial' | 'mixed';
export type KeywordLabelOrigin = 'source_term' | 'editorial_label';
export type KeywordReviewConcern = 'terminology' | 'explanation' | 'mapping';
export type EvidenceField = 'prompt' | 'correct_answer' | 'explanation';

export interface LexiconEntry {
  term_en: string;
  /** Literal phrases. Longest contained phrase wins when two cards nest. */
  aliases: string[];
  explanation_en: string;
  example_en?: string;
  priority: KeywordDraftPriority;
  /** Null means text is enough. A string means one image would help. */
  image_concept: string | null;
  review_flag?: boolean;
  review_note?: string;
  review_concern?: KeywordReviewConcern;
  /** Kept when a flagged explanation was rewritten, so a reviewer can compare it. */
  previous_explanation_en?: string;
  label_origin?: KeywordLabelOrigin;
  /** Frequent but still tied to the words in the question. Listed for review. */
  watch_coverage?: boolean;
}

export interface EditorialPattern {
  term_en: string;
  phrases: string[];
  note: string;
}

export interface EvidenceSnippet {
  field: EvidenceField;
  alias: string;
  grounding: 'source' | 'editorial';
  snippet: string;
}

export interface KeywordDraftLink {
  question_id: string;
  grounding: 'source' | 'editorial';
  evidence: EvidenceSnippet[];
}

export interface KeywordDraft {
  draft_id: string;
  term_en: string;
  term_normalized: string;
  explanation_en: string;
  example_en: string;
  translation_ar: '';
  explanation_ar: '';
  image_url: null;
  image_alt: null;
  image_storage_path: null;
  image_recommended: boolean;
  image_concept: string | null;
  priority: KeywordDraftPriority;
  status: 'draft';
  published: false;
  label_origin: KeywordLabelOrigin;
  grounding: KeywordDraftGrounding;
  review_flag: boolean;
  review_note: string | null;
  review_concern: KeywordReviewConcern | null;
  previous_explanation_en: string | null;
  watch_coverage: boolean;
  notes: string | null;
  aliases: string[];
  matched_forms: string[];
  question_ids: string[];
  links: KeywordDraftLink[];
}

export interface OfficialQuestionText {
  id: string;
  topic: string;
  prompt: string;
  correctAnswer: string;
  explanation: string;
}

export interface KeywordDraftFile {
  schema: 'lingotheory.keyword_card_drafts.v1';
  migration_reference: '0011_keyword_cards.sql';
  status: 'draft';
  published: false;
  review_required: true;
  arabic_pending: true;
  do_not_publish: true;
  do_not_write_database: true;
  source: string;
  question_count: number;
  keyword_count: number;
  link_count: number;
  generated_by: 'tools/generate-keyword-card-drafts.ts';
  import_note: string;
  keywords: KeywordDraft[];
}
