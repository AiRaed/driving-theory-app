/**
 * Phase 5D Content Production workspace types.
 *
 * Production tasks group related DVSA questions so one image/video/voiceover
 * can serve many items. Official DVSA stem, options, correct answers, and
 * explanation_en stay locked on the questions row. Task "published" is media
 * production status — it does not publish Learning Cards or mutate the bank.
 */

export const PRODUCTION_STATUSES = [
  'not_started',
  'in_progress',
  'ready_for_review',
  'approved',
  'published',
  'skipped',
] as const;
export type ProductionStatus = (typeof PRODUCTION_STATUSES)[number];

export const PRODUCTION_FORMATS = ['text', 'diagram', 'image', 'video'] as const;
export type ProductionFormat = (typeof PRODUCTION_FORMATS)[number];

export const MEDIA_KINDS = ['image', 'diagram', 'video', 'voiceover'] as const;
export type MediaKind = (typeof MEDIA_KINDS)[number];

export const TRANSLATION_REVIEW_STATUSES = [
  'not_started',
  'in_progress',
  'ready_for_review',
  'approved',
] as const;
export type TranslationReviewStatus = (typeof TRANSLATION_REVIEW_STATUSES)[number];

export const PRODUCTION_PRIORITIES = ['high', 'medium', 'low'] as const;
export type ProductionPriority = (typeof PRODUCTION_PRIORITIES)[number];

export const PRODUCTION_LANGUAGES = ['en', 'ar', 'ur', 'ro', 'pl', 'pt', 'bn', 'fa'] as const;

export const UNFINISHED_STATUSES: readonly ProductionStatus[] = [
  'not_started',
  'in_progress',
  'ready_for_review',
];

export interface ConceptGroup {
  concept_key: string;
  slug: string;
  title: string;
  topic: string;
  suggested_format: ProductionFormat;
  classification: string;
  priority: ProductionPriority;
  rationale: string;
  question_ids: string[];
}

export interface ProductionTask {
  id: string;
  concept_key: string;
  title: string;
  topic: string;
  suggested_format: ProductionFormat;
  format: ProductionFormat;
  priority: ProductionPriority;
  classification: string;
  rationale: string;
  status: ProductionStatus;
  explanation_en_draft: string;
  english_revision: number;
  notes: string;
  source: 'recommendation_group' | 'manual';
  question_ids: string[];
  coverage: number;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  updated_by?: string | null;
  /** Media production status, independent of DVSA / learning-card publish. */
  media_status: ProductionStatus;
}

export interface ProductionTranslation {
  id: string;
  task_id: string;
  language: string;
  body: string;
  review_status: TranslationReviewStatus;
  english_revision: number;
  stale: boolean;
  updated_at: string;
}

export interface MediaAsset {
  id: string;
  kind: MediaKind;
  language: string | null;
  title: string;
  storage_path: string;
  public_url: string;
  mime_type: string;
  status: ProductionStatus;
  notes: string;
  shared_visual: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskMediaLink {
  task_id: string;
  asset_id: string;
  role: 'visual' | 'voiceover';
}

export interface QuestionContext {
  question_id: string;
  topic: string;
  question_en: string;
  explanation_en: string;
  correct_answer: number;
  answers_en: [string, string, string, string];
  official_locked: boolean;
}

export interface ProductionFilters {
  topic?: string;
  format?: string;
  priority?: string;
  status?: string;
  coverage?: 'single' | 'multi' | '';
}

export interface QueueTotals {
  tasks: number;
  questions_covered: number;
  by_status: Record<string, number>;
  by_format: Record<string, number>;
  by_priority: Record<string, number>;
  by_topic: Record<string, number>;
  unfinished: number;
}

export function isProductionStatus(value: string): value is ProductionStatus {
  return (PRODUCTION_STATUSES as readonly string[]).includes(value);
}

export function canAdvanceProductionStatus(from: ProductionStatus, to: ProductionStatus): boolean {
  if (from === to) return true;
  if (to === 'skipped') return from !== 'published';
  if (from === 'skipped' && to === 'not_started') return true;
  const order: ProductionStatus[] = [
    'not_started',
    'in_progress',
    'ready_for_review',
    'approved',
    'published',
  ];
  const fromIdx = order.indexOf(from);
  const toIdx = order.indexOf(to);
  if (fromIdx < 0 || toIdx < 0) return false;
  return toIdx === fromIdx + 1 || (from === 'published' && to === 'approved');
}

export function canUpgradeFormat(from: ProductionFormat, to: ProductionFormat): boolean {
  if (from === to) return true;
  if (to === 'video' && (from === 'image' || from === 'diagram' || from === 'text')) return true;
  if (from === 'text' && (to === 'image' || to === 'diagram' || to === 'video')) return true;
  if (from === 'image' && to === 'diagram') return true;
  if (from === 'diagram' && to === 'image') return true;
  return false;
}

export function isUnfinished(status: ProductionStatus): boolean {
  return UNFINISHED_STATUSES.includes(status);
}

export function priorityRank(priority: string): number {
  if (priority === 'high') return 0;
  if (priority === 'medium') return 1;
  return 2;
}

export function classificationRank(classification: string): number {
  if (classification === 'needs_explanation') return 0;
  if (classification === 'review_later') return 1;
  return 2;
}
