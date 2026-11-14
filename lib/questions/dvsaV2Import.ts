/**
 * DVSA V2 → DB row mapper (local preparation only).
 * Does not connect to Supabase. Used by the dry-run importer.
 */

import fs from 'fs';
import path from 'path';
import {
  DVSA_V2_EXPECTED_COUNT,
  type DvsaStagingQuestion,
} from './dvsaV2';

export type MediaReviewStatus =
  | 'not_applicable'
  | 'unreviewed'
  | 'needs_fix'
  | 'reviewed';

export type QuestionWorkflowStatus =
  | 'draft'
  | 'submitted'
  | 'approved'
  | 'published'
  | 'archived';

export type MediaSlot = 'stem' | 'answer_1' | 'answer_2' | 'answer_3' | 'answer_4';

export type ConversionManifestEntry = {
  original_ref: string;
  status: string;
  derivative_relative_path?: string;
  derivative_basename?: string;
  derivative_sha256?: string;
  derivative_bytes?: number;
  review_flags?: string[];
};

export type StagingBundle = {
  generated_at?: string;
  phase?: string;
  expected_count?: number;
  source_verification?: {
    status?: string;
    reason?: string;
  };
  note?: string;
  questions: DvsaStagingQuestion[];
};

export type MediaUrlResolver = (originalRef: string | undefined | null) => string | null;

export type DvsaV2DbRow = {
  id: string;
  topic_id: string;
  question_en: string;
  question_ar: string;
  question_ur: string;
  answer_1_en: string;
  answer_1_ar: string;
  answer_1_ur: string;
  answer_2_en: string;
  answer_2_ar: string;
  answer_2_ur: string;
  answer_3_en: string;
  answer_3_ar: string;
  answer_3_ur: string;
  answer_4_en: string;
  answer_4_ar: string;
  answer_4_ur: string;
  correct_answer: number;
  explanation_en: string | null;
  explanation_ar: string | null;
  explanation_ur: string | null;
  translations: Record<string, never>;
  source_id: string;
  official_source_id: string;
  keywords: [];
  image_url: string | null;
  image_alt: string | null;
  answer_1_image_url: string | null;
  answer_2_image_url: string | null;
  answer_3_image_url: string | null;
  answer_4_image_url: string | null;
  status: QuestionWorkflowStatus;
  content_version: 'v2';
  media_review_status: MediaReviewStatus;
  official_locked: true;
  media_original_refs: Record<string, string>;
  sort_order: number;
};

export type MediaRevisionSeed = {
  question_id: string;
  slot: MediaSlot;
  version: 1;
  is_current: true;
  original_ref: string;
  storage_path: string | null;
  public_url: string | null;
  sha256: string | null;
  review_status: 'unreviewed';
  notes: string;
};

function optionEn(q: DvsaStagingQuestion, index: number): string {
  return (q.options[index]?.en || '').trim();
}

function optionImageRef(q: DvsaStagingQuestion, index: number): string | undefined {
  const opt = q.options[index];
  const ref = (opt?.imageHiRes || opt?.image || '').trim();
  return ref || undefined;
}

function stemImageRef(q: DvsaStagingQuestion): string | undefined {
  const ref = (q.imageHiRes || q.image || '').trim();
  return ref || undefined;
}

/**
 * Map one staging question to a draft DB row.
 * Always draft + official_locked + content_version=v2.
 * Provisional derivatives → media_review_status=unreviewed (never DVSA-approved).
 */
export function stagingQuestionToDraftRow(
  q: DvsaStagingQuestion,
  resolveUrl: MediaUrlResolver,
  sortOrder = 0
): { row: DvsaV2DbRow; revisions: MediaRevisionSeed[]; warnings: string[] } {
  const warnings: string[] = [];
  const media_original_refs: Record<string, string> = {};
  const revisions: MediaRevisionSeed[] = [];

  const pushSlot = (slot: MediaSlot, originalRef: string | undefined) => {
    if (!originalRef) return;
    media_original_refs[slot] = originalRef;
    const url = resolveUrl(originalRef);
    if (!url) {
      warnings.push(`${q.id}: unresolved media for ${slot} (${originalRef})`);
    }
    revisions.push({
      question_id: q.id,
      slot,
      version: 1,
      is_current: true,
      original_ref: originalRef,
      storage_path: null,
      public_url: url,
      sha256: null,
      review_status: 'unreviewed',
      notes: 'Provisional derivative from Phase 2b conversion — not DVSA-approved; pending admin visual review.',
    });
    return url;
  };

  const stemUrl = pushSlot('stem', stemImageRef(q)) ?? null;
  const a1 = pushSlot('answer_1', optionImageRef(q, 0)) ?? null;
  const a2 = pushSlot('answer_2', optionImageRef(q, 1)) ?? null;
  const a3 = pushSlot('answer_3', optionImageRef(q, 2)) ?? null;
  const a4 = pushSlot('answer_4', optionImageRef(q, 3)) ?? null;

  const hasMedia = revisions.length > 0;

  const row: DvsaV2DbRow = {
    id: q.id,
    topic_id: q.topic,
    question_en: q.promptEn,
    question_ar: '',
    question_ur: '',
    answer_1_en: optionEn(q, 0),
    answer_1_ar: '',
    answer_1_ur: '',
    answer_2_en: optionEn(q, 1),
    answer_2_ar: '',
    answer_2_ur: '',
    answer_3_en: optionEn(q, 2),
    answer_3_ar: '',
    answer_3_ur: '',
    answer_4_en: optionEn(q, 3),
    answer_4_ar: '',
    answer_4_ur: '',
    correct_answer: q.correctAnswer,
    explanation_en: q.explanationEn?.trim() || null,
    explanation_ar: null,
    explanation_ur: null,
    translations: {},
    source_id: q.id,
    official_source_id: q.id,
    keywords: [],
    image_url: stemUrl,
    image_alt: stemUrl ? `Question ${q.id} illustration (provisional)` : null,
    answer_1_image_url: a1,
    answer_2_image_url: a2,
    answer_3_image_url: a3,
    answer_4_image_url: a4,
    status: 'draft',
    content_version: 'v2',
    media_review_status: hasMedia ? 'unreviewed' : 'not_applicable',
    official_locked: true,
    media_original_refs,
    sort_order: sortOrder,
  };

  return { row, revisions, warnings };
}

export function loadStagingBundle(stagingPath: string): StagingBundle {
  const raw = JSON.parse(fs.readFileSync(stagingPath, 'utf8')) as StagingBundle;
  if (!Array.isArray(raw.questions)) {
    throw new Error(`Invalid staging bundle: missing questions[] at ${stagingPath}`);
  }
  return raw;
}

export function loadConversionManifest(
  manifestPath: string
): Map<string, ConversionManifestEntry> {
  const raw = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as {
    files?: ConversionManifestEntry[];
    entries?: ConversionManifestEntry[];
  };
  const list = raw.files || raw.entries || [];
  const map = new Map<string, ConversionManifestEntry>();
  for (const entry of list) {
    if (entry?.original_ref) map.set(entry.original_ref, entry);
  }
  return map;
}

/**
 * Resolve DVSA original filename → provisional public URL path.
 * Default uses /dvsa-media/{derivativeBasename} for local/CDN mapping after upload.
 * Does not upload anything.
 */
export function createDerivativeUrlResolver(
  manifest: Map<string, ConversionManifestEntry>,
  opts: { publicBasePath?: string; missingAsNull?: boolean } = {}
): MediaUrlResolver {
  const base = (opts.publicBasePath || '/dvsa-media').replace(/\/$/, '');
  return (originalRef) => {
    if (!originalRef?.trim()) return null;
    const entry = manifest.get(originalRef.trim());
    if (!entry || entry.status !== 'converted' || !entry.derivative_basename) {
      return opts.missingAsNull === false ? `${base}/${originalRef.trim()}` : null;
    }
    return `${base}/${entry.derivative_basename}`;
  };
}

export type DryRunReport = {
  generated_at: string;
  phase: 'phase-3-import-dry-run';
  mode: 'dry-run';
  expected_count: number;
  staged_count: number;
  unique_ids: number;
  source_verification: StagingBundle['source_verification'] | { status: string; reason: string };
  status_forced: 'draft';
  content_version: 'v2';
  official_locked: true;
  media_review_default: 'unreviewed';
  media_review_note: string;
  rows_ready: number;
  revision_seeds: number;
  unresolved_media_slots: number;
  warnings_sample: string[];
  id_collision_risk_note: string;
  shared_supabase_isolation: string;
  would_write_status: 'draft';
  execute_blocked_until: string[];
  sample_ids: string[];
  ok: boolean;
  errors: string[];
};

export function buildDryRunReport(
  bundle: StagingBundle,
  rows: DvsaV2DbRow[],
  allWarnings: string[],
  revisionCount: number
): DryRunReport {
  const ids = new Set(rows.map((r) => r.id));
  const errors: string[] = [];
  if (rows.length !== DVSA_V2_EXPECTED_COUNT) {
    errors.push(`row count ${rows.length} !== ${DVSA_V2_EXPECTED_COUNT}`);
  }
  if (ids.size !== rows.length) {
    errors.push(`duplicate ids: ${rows.length - ids.size}`);
  }
  const sv = bundle.source_verification || {
    status: 'NOT_VERIFIED',
    reason: 'Missing source_verification on staging bundle',
  };
  if (sv.status === 'VERIFIED') {
    // Do not silently accept — surface for human confirmation
  }

  return {
    generated_at: new Date().toISOString(),
    phase: 'phase-3-import-dry-run',
    mode: 'dry-run',
    expected_count: DVSA_V2_EXPECTED_COUNT,
    staged_count: bundle.questions.length,
    unique_ids: ids.size,
    source_verification: sv,
    status_forced: 'draft',
    content_version: 'v2',
    official_locked: true,
    media_review_default: 'unreviewed',
    media_review_note:
      'Provisional Phase 2b derivatives are marked unreviewed. Do not mark as DVSA-approved.',
    rows_ready: rows.length,
    revision_seeds: revisionCount,
    unresolved_media_slots: allWarnings.filter((w) => w.includes('unresolved media')).length,
    warnings_sample: allWarnings.slice(0, 40),
    id_collision_risk_note:
      'V2 uses official DVSA Item IDs (e.g. AB2001). Current live bank uses different IDs (e.g. AL-01). Draft insert should not overwrite published v1 rows. Still verify no ID overlap before execute.',
    shared_supabase_isolation:
      'Localhost and production share one Supabase project. Draft/submitted/approved rows are excluded by RLS (status=published only). Do not publish until cutover.',
    would_write_status: 'draft',
    execute_blocked_until: [
      'Apply migration 0008 in an approved window',
      'Upload provisional derivatives to storage with deterministic paths',
      'Confirm no ID overlap with published v1',
      'Pass --execute --confirm-shared-supabase --i-understand-draft-only',
      'Set DVSA_V2_IMPORT_ENABLED=true',
      'Keep EXPECTED_PUBLISHED_COUNT=742 until cutover',
    ],
    sample_ids: rows.slice(0, 8).map((r) => r.id),
    ok: errors.length === 0,
    errors,
  };
}

export function defaultStagingPaths(cwd = process.cwd()) {
  const root = path.join(cwd, 'local-data/dvsa/staging');
  return {
    stagingQuestions: path.join(root, 'questions.v2.json'),
    conversionManifest: path.join(root, 'media-conversion-manifest.json'),
    dryRunReport: path.join(root, 'import-dry-run-report.json'),
    dryRunRowsSample: path.join(root, 'import-dry-run-rows.sample.json'),
  };
}
