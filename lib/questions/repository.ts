import type { Question } from '@/data/questions';
import type { TranslationData } from '@/lib/translations';
import { createClient } from '@/lib/supabase/server';
import {
  EXPECTED_PUBLISHED_COUNT,
  isDatabaseBankComplete as checkDatabaseBankComplete,
  isMissingColumnError,
  rowToLearnerQuestion,
  rowToUrduBucket,
  rowToRomanianBucket,
  rowToPolishBucket,
  rowToPortugueseBucket,
  rowToPersianBucket,
  type QuestionRow,
} from '@/lib/questions/types';

export type BankSource = 'database' | 'unavailable';

export interface LearnerBank {
  questions: Question[];
  urduByTopic: TranslationData;
  romanianByTopic: TranslationData;
  polishByTopic: TranslationData;
  portugueseByTopic: TranslationData;
  persianByTopic: TranslationData;
  source: BankSource;
  count: number;
  reasons?: string[];
}

export { EXPECTED_PUBLISHED_COUNT };

/** Async wrapper around the sync completeness gate (canonical provider API). */
export async function isDatabaseBankComplete(
  rows: QuestionRow[],
  expectedCount = EXPECTED_PUBLISHED_COUNT
): Promise<{ ok: boolean; reasons: string[] }> {
  return checkDatabaseBankComplete(rows, expectedCount);
}

function emptyBank(reasons: string[]): LearnerBank {
  return {
    questions: [],
    urduByTopic: {},
    romanianByTopic: {},
    polishByTopic: {},
    portugueseByTopic: {},
    persianByTopic: {},
    source: 'unavailable',
    count: 0,
    reasons,
  };
}

/**
 * Canonical learner question bank provider.
 * Uses RLS-scoped server client (published only).
 * Never falls back to the obsolete static 742-question bundle.
 */
export async function getPublishedQuestionBank(): Promise<LearnerBank> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('status', 'published')
      .order('topic_id', { ascending: true })
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true });

    if (error) {
      console.warn('[questions/repository] DB read failed:', error.message);
      return emptyBank([`db_read_failed: ${error.message}`]);
    }

    const rows = (data || []) as QuestionRow[];
    const gate = checkDatabaseBankComplete(rows);
    if (!gate.ok) {
      console.warn(
        '[questions/repository] DB bank incomplete:',
        gate.reasons.slice(0, 5).join('; ')
      );
      return emptyBank(gate.reasons);
    }

    const questions = rows.map(rowToLearnerQuestion);
    const urduByTopic: TranslationData = {};
    const romanianByTopic: TranslationData = {};
    const polishByTopic: TranslationData = {};
    const portugueseByTopic: TranslationData = {};
    const persianByTopic: TranslationData = {};
    for (const row of rows) {
      if (!urduByTopic[row.topic_id]) urduByTopic[row.topic_id] = {};
      urduByTopic[row.topic_id][row.id] = rowToUrduBucket(row);
      const roBucket = rowToRomanianBucket(row);
      if (roBucket.promptRo) {
        if (!romanianByTopic[row.topic_id]) romanianByTopic[row.topic_id] = {};
        romanianByTopic[row.topic_id][row.id] = roBucket;
      }
      const plBucket = rowToPolishBucket(row);
      if (plBucket.promptPl) {
        if (!polishByTopic[row.topic_id]) polishByTopic[row.topic_id] = {};
        polishByTopic[row.topic_id][row.id] = plBucket;
      }
      const ptBucket = rowToPortugueseBucket(row);
      if (ptBucket.promptPt) {
        if (!portugueseByTopic[row.topic_id]) portugueseByTopic[row.topic_id] = {};
        portugueseByTopic[row.topic_id][row.id] = ptBucket;
      }
      const faBucket = rowToPersianBucket(row);
      if (faBucket.promptFa) {
        if (!persianByTopic[row.topic_id]) persianByTopic[row.topic_id] = {};
        persianByTopic[row.topic_id][row.id] = faBucket;
      }
    }

    return {
      questions,
      urduByTopic,
      romanianByTopic,
      polishByTopic,
      portugueseByTopic,
      persianByTopic,
      source: 'database',
      count: questions.length,
    };
  } catch (err) {
    console.warn('[questions/repository] Unexpected error:', err);
    return emptyBank([`unexpected: ${err instanceof Error ? err.message : String(err)}`]);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabase = { from: (table: string) => any };

let loggedTranslationsFallback = false;

function stripExtensibleColumns(payload: Record<string, unknown>): Record<string, unknown> {
  const next = { ...payload };
  delete next.translations;
  delete next.source_id;
  // Migration 0008 columns — strip if schema not yet applied (shared project may lag).
  delete next.official_source_id;
  delete next.answer_1_image_url;
  delete next.answer_2_image_url;
  delete next.answer_3_image_url;
  delete next.answer_4_image_url;
  delete next.content_version;
  delete next.media_review_status;
  delete next.official_locked;
  delete next.media_original_refs;
  return next;
}

function logTranslationsFallbackOnce() {
  if (!loggedTranslationsFallback) {
    console.warn(
      '[questions] translations/source_id column missing; writing flat columns only (apply migration 0005)'
    );
    loggedTranslationsFallback = true;
  }
}

/**
 * Insert/update a question row. Always includes flat ar/ur.
 * If `translations` (or `source_id`) column is missing, retries without those fields (log once).
 */
export async function writeQuestionWithFallback(
  client: AnySupabase,
  payload: Record<string, unknown>,
  action: { type: 'insert' } | { type: 'update'; id: string }
): Promise<{ data: QuestionRow | null; error: { message?: string } | null }> {
  const run = async (p: Record<string, unknown>) => {
    if (action.type === 'insert') {
      return client.from('questions').insert(p).select('*').single();
    }
    return client.from('questions').update(p).eq('id', action.id).select('*').single();
  };

  const needsColumnFallback = (error: { message?: string } | null) =>
    !!error &&
    (isMissingColumnError(error, 'translations') ||
      isMissingColumnError(error, 'source_id') ||
      isMissingColumnError(error, 'content_version') ||
      isMissingColumnError(error, 'answer_1_image_url') ||
      isMissingColumnError(error, 'official_locked') ||
      isMissingColumnError(error, 'media_review_status') ||
      isMissingColumnError(error, 'official_source_id'));

  let result = await run(payload);
  if (needsColumnFallback(result.error)) {
    logTranslationsFallbackOnce();
    result = await run(stripExtensibleColumns(payload));
  }

  return {
    data: (result.data as QuestionRow) || null,
    error: result.error,
  };
}

/**
 * Batch upsert with the same graceful fallback for missing translations column.
 */
export async function upsertQuestionsWithFallback(
  client: AnySupabase,
  rows: Record<string, unknown>[],
  onConflict = 'id'
): Promise<{ error: { message?: string } | null }> {
  let result = await client.from('questions').upsert(rows, { onConflict });
  if (
    result.error &&
    (isMissingColumnError(result.error, 'translations') ||
      isMissingColumnError(result.error, 'source_id'))
  ) {
    logTranslationsFallbackOnce();
    const stripped = rows.map(stripExtensibleColumns);
    result = await client.from('questions').upsert(stripped, { onConflict });
  }
  return { error: result.error };
}
