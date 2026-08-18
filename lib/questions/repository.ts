import { questions as staticQuestions } from '@/data/questions';
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
  type QuestionRow,
} from '@/lib/questions/types';

export type BankSource = 'database' | 'static';

export interface LearnerBank {
  questions: Question[];
  urduByTopic: TranslationData;
  romanianByTopic: TranslationData;
  polishByTopic: TranslationData;
  portugueseByTopic: TranslationData;
  source: BankSource;
  count: number;
}

export { EXPECTED_PUBLISHED_COUNT };

/** Async wrapper around the sync completeness gate (canonical provider API). */
export async function isDatabaseBankComplete(
  rows: QuestionRow[],
  expectedCount = EXPECTED_PUBLISHED_COUNT
): Promise<{ ok: boolean; reasons: string[] }> {
  return checkDatabaseBankComplete(rows, expectedCount);
}

function staticBank(): LearnerBank {
  return {
    questions: staticQuestions,
    urduByTopic: {},
    romanianByTopic: {},
    polishByTopic: {},
    portugueseByTopic: {},
    source: 'static',
    count: staticQuestions.length,
  };
}

/**
 * Canonical learner question bank provider.
 * Uses RLS-scoped server client (published only). Falls back to static on
 * error or incomplete bank — never throws.
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
      console.warn('[questions/repository] DB read failed, using static:', error.message);
      return staticBank();
    }

    const rows = (data || []) as QuestionRow[];
    const gate = checkDatabaseBankComplete(rows);
    if (!gate.ok) {
      console.warn(
        '[questions/repository] DB bank incomplete, using static:',
        gate.reasons.slice(0, 5).join('; ')
      );
      return staticBank();
    }

    const questions = rows.map(rowToLearnerQuestion);
    const urduByTopic: TranslationData = {};
    const romanianByTopic: TranslationData = {};
    const polishByTopic: TranslationData = {};
    const portugueseByTopic: TranslationData = {};
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
    }

    return {
      questions,
      urduByTopic,
      romanianByTopic,
      polishByTopic,
      portugueseByTopic,
      source: 'database',
      count: questions.length,
    };
  } catch (err) {
    console.warn('[questions/repository] Unexpected error, using static:', err);
    return staticBank();
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabase = { from: (table: string) => any };

let loggedTranslationsFallback = false;

function stripExtensibleColumns(payload: Record<string, unknown>): Record<string, unknown> {
  const next = { ...payload };
  delete next.translations;
  delete next.source_id;
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

  let result = await run(payload);
  if (
    result.error &&
    (isMissingColumnError(result.error, 'translations') ||
      isMissingColumnError(result.error, 'source_id'))
  ) {
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
