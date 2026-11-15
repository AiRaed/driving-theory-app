/**
 * Learning Cards foundation (Phase 5A).
 *
 * Local types only. Tables in supabase/migrations/0009_learning_cards.sql
 * must not be applied until a later approved window.
 *
 * Keyword cards are reusable (term + language).
 * Explanation cards are per official DVSA question id + language.
 * Saved cards belong to the signed-in user.
 *
 * Practice may render published cards. Mock Test must not.
 */

export const LEARNING_CARD_STATUSES = [
  'draft',
  'submitted',
  'approved',
  'published',
  'archived',
] as const;

export type LearningCardStatus = (typeof LEARNING_CARD_STATUSES)[number];

export const LEARNING_CARD_KINDS = ['keyword', 'explanation'] as const;
export type LearningCardKind = (typeof LEARNING_CARD_KINDS)[number];

export const LEARNING_CARD_MEDIA_SLOTS = ['image', 'video'] as const;
export type LearningCardMediaSlot = (typeof LEARNING_CARD_MEDIA_SLOTS)[number];

export const KEYWORD_SOURCE_FIELDS = [
  'stem',
  'option_1',
  'option_2',
  'option_3',
  'option_4',
] as const;
export type KeywordSourceField = (typeof KEYWORD_SOURCE_FIELDS)[number];

export interface KeywordTerm {
  term_key: string;
  term_en: string;
  created_at?: string;
  created_by?: string | null;
}

export interface KeywordCard {
  id: string;
  term_key: string;
  language: string;
  definition: string;
  translation: string;
  image_url: string | null;
  image_alt: string | null;
  video_url: string | null;
  status: LearningCardStatus;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
  created_by?: string | null;
  updated_by?: string | null;
  published_at?: string | null;
}

export interface KeywordCardQuestionLink {
  term_key: string;
  question_id: string;
  source_field: KeywordSourceField | null;
}

export const EXPLANATION_CLASSIFICATIONS = [
  'needs_explanation',
  'image_is_enough',
  'review_later',
] as const;
export type ExplanationClassification = (typeof EXPLANATION_CLASSIFICATIONS)[number];

export const EXPLANATION_OVERRIDE_VALUES = [
  ...EXPLANATION_CLASSIFICATIONS,
  'unnecessary',
] as const;
export type ExplanationOverride = (typeof EXPLANATION_OVERRIDE_VALUES)[number];

export const EXPLANATION_PRIORITIES = ['high', 'medium', 'low'] as const;
export type ExplanationPriority = (typeof EXPLANATION_PRIORITIES)[number];

export const EXPLANATION_FORMATS = ['text', 'diagram', 'image', 'video'] as const;
export type ExplanationFormat = (typeof EXPLANATION_FORMATS)[number];

/** English + Arabic first; other codes remain valid. */
export const LEARNING_CARD_INITIAL_LANGUAGES = ['en', 'ar'] as const;

export const CLASSIFIER_VERSION = '5e.2';

export interface ExplanationCard {
  id: string;
  /** Official DVSA item id (questions.id for V2, e.g. AB1234). */
  question_id: string;
  language: string;
  explanation: string;
  format: ExplanationFormat;
  image_url: string | null;
  image_alt: string | null;
  video_url: string | null;
  status: LearningCardStatus;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
  created_by?: string | null;
  updated_by?: string | null;
  published_at?: string | null;
}

export interface ExplanationRecommendation {
  question_id: string;
  topic: string;
  has_image: boolean;
  has_option_images: boolean;
  recommended_classification: ExplanationClassification;
  rationale: string;
  priority: ExplanationPriority;
  suggested_format: ExplanationFormat;
  classifier_version: string;
  /** Always false — recommendations are not DVSA-approved. */
  dvsa_approved: false;
}

export interface ExplanationRecommendationRecord extends ExplanationRecommendation {
  admin_override: ExplanationOverride | null;
  override_note: string;
  card_unnecessary: boolean;
  effective_classification: ExplanationClassification | 'unnecessary';
}

export interface SavedCard {
  id: string;
  user_id: string;
  card_kind: LearningCardKind;
  keyword_card_id: string | null;
  explanation_card_id: string | null;
  created_at?: string;
}

/** Canonical lookup key: lowercased, trimmed English term. */
export function normalizeTermKey(term: string): string {
  return term.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function isLearnerVisibleCardStatus(status: LearningCardStatus): boolean {
  return status === 'published';
}

/** Empty drafts and archived cards never appear in Practice. */
export function isLearnerVisibleExplanationHint(card: {
  status: LearningCardStatus;
  explanation?: string | null;
}): boolean {
  return isLearnerVisibleCardStatus(card.status) && String(card.explanation || '').trim().length > 0;
}

/** Mock Test exam surface must never render hints or tappable keywords. */
export function mockExamAllowsLearningAids(): false {
  return false;
}

export function canAdvanceCardStatus(
  from: LearningCardStatus,
  to: LearningCardStatus
): boolean {
  if (from === to) return true;
  const order: LearningCardStatus[] = [
    'draft',
    'submitted',
    'approved',
    'published',
  ];
  if (to === 'archived') return from !== 'archived';
  if (to === 'draft') return from === 'submitted' || from === 'approved';
  const fromIdx = order.indexOf(from);
  const toIdx = order.indexOf(to);
  if (fromIdx < 0 || toIdx < 0) return false;
  return toIdx === fromIdx + 1 || (from === 'published' && to === 'approved');
}

export function effectiveClassification(
  recommended: ExplanationClassification,
  override: ExplanationOverride | null | undefined,
  cardUnnecessary = false
): ExplanationClassification | 'unnecessary' {
  if (cardUnnecessary || override === 'unnecessary') return 'unnecessary';
  if (override && EXPLANATION_CLASSIFICATIONS.includes(override as ExplanationClassification)) {
    return override as ExplanationClassification;
  }
  return recommended;
}

export function isValidLearningCardLanguage(code: string): boolean {
  return /^[a-z]{2,5}$/.test(String(code || '').trim().toLowerCase());
}
