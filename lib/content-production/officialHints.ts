/**
 * Official DVSA V2 stems for content-production grouping.
 *
 * Production seed must load these from live Supabase (service role), never
 * from gitignored local DVSA staging files.
 * Read-only. Does not write questions, recommendations, or learning cards.
 */

import { isProductionRuntime } from '../learning-cards/backend';
import type { QuestionHint } from './conceptFamilies';
import { productionForbidsLocalContentJson } from './backend';

export const REQUIRED_CONTENT_VERSION = 'v2';

export const OFFICIAL_HINT_FIELDS = [
  'id',
  'question_en',
  'explanation_en',
  'correct_answer',
  'answer_1_en',
  'answer_2_en',
  'answer_3_en',
  'answer_4_en',
  'content_version',
] as const;

export const OFFICIAL_HINT_PAGE_SIZE = 1000;

export class IncompleteOfficialQuestionDataError extends Error {
  readonly code = 'INCOMPLETE_OFFICIAL_QUESTION_DATA';
  readonly missing_ids: string[];
  readonly incomplete_stems: string[];
  constructor(missing_ids: string[], incomplete_stems: string[]) {
    super(
      'Official V2 question stems are missing or incomplete. Production seed refuses coarse grouping.'
    );
    this.name = 'IncompleteOfficialQuestionDataError';
    this.missing_ids = missing_ids;
    this.incomplete_stems = incomplete_stems;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

type OfficialQuery = {
  eq?: (col: string, val: unknown) => OfficialQuery;
  in?: (col: string, val: string[]) => OfficialQuery;
  order: (col: string) => OfficialQuery;
  range: (
    from: number,
    to: number
  ) => PromiseLike<{ data: unknown; error: { message?: string } | null }>;
};

export type OfficialQuestionsClient = {
  from: (table: string) => {
    select: (cols: string) => OfficialQuery;
  };
};

export function isOfficialV2Row(row: Record<string, unknown>): boolean {
  return String(row.content_version || '').trim() === REQUIRED_CONTENT_VERSION;
}

export function officialRowToHint(row: Record<string, unknown>): QuestionHint {
  const correct = Number(row.correct_answer || 1);
  const optionKey = `answer_${correct}_en` as const;
  return {
    promptEn: String(row.question_en || ''),
    explanationEn: String(row.explanation_en || ''),
    correctOptionEn: String(row[optionKey] || ''),
  };
}

export function hintsFromOfficialRows(rows: Array<Record<string, unknown>>): Record<string, QuestionHint> {
  const out: Record<string, QuestionHint> = {};
  for (const row of rows) {
    const id = String(row.id || '').trim();
    if (!id || !isOfficialV2Row(row)) continue;
    out[id] = officialRowToHint(row);
  }
  return out;
}

export function inspectOfficialQuestionRows(
  questionIds: string[],
  rows: Array<Record<string, unknown>>
): {
  missing_ids: string[];
  incomplete_stems: string[];
  mismatched_versions: string[];
  hints: Record<string, QuestionHint>;
} {
  const byId = new Map<string, Record<string, unknown>>();
  for (const row of rows) {
    const id = String(row.id || '').trim();
    if (!id) continue;
    const existing = byId.get(id);
    if (!existing || (isOfficialV2Row(row) && !isOfficialV2Row(existing))) {
      byId.set(id, row);
    }
  }
  const missing_ids: string[] = [];
  const incomplete_stems: string[] = [];
  const mismatched_versions: string[] = [];
  const hints: Record<string, QuestionHint> = {};
  for (const id of questionIds) {
    const row = byId.get(id);
    if (!row) {
      missing_ids.push(id);
      continue;
    }
    if (!isOfficialV2Row(row)) {
      mismatched_versions.push(id);
      continue;
    }
    const hint = officialRowToHint(row);
    if (!String(hint.promptEn || '').trim()) {
      incomplete_stems.push(id);
      continue;
    }
    hints[id] = hint;
  }
  return { missing_ids, incomplete_stems, mismatched_versions, hints };
}

export async function loadOfficialQuestionRows(
  client: OfficialQuestionsClient
): Promise<Array<Record<string, unknown>>> {
  const rows: Array<Record<string, unknown>> = [];
  let from = 0;
  for (;;) {
    const { data, error } = await client
      .from('questions')
      .select(OFFICIAL_HINT_FIELDS.join(','))
      .order('id')
      .range(from, from + OFFICIAL_HINT_PAGE_SIZE - 1);
    if (error) {
      throw new Error(error.message || 'Failed to load official question stems from Supabase');
    }
    const page = (data as Array<Record<string, unknown>>) || [];
    rows.push(...page);
    if (page.length < OFFICIAL_HINT_PAGE_SIZE) break;
    from += OFFICIAL_HINT_PAGE_SIZE;
  }
  return rows;
}

export async function loadOfficialQuestionHints(
  client: OfficialQuestionsClient
): Promise<Record<string, QuestionHint>> {
  const rows = await loadOfficialQuestionRows(client);
  return hintsFromOfficialRows(rows);
}

export function inspectOfficialHints(
  questionIds: string[],
  hints: Record<string, QuestionHint>
): { missing_ids: string[]; incomplete_stems: string[] } {
  const missing_ids: string[] = [];
  const incomplete_stems: string[] = [];
  for (const id of questionIds) {
    const hint = hints[id];
    if (!hint) {
      missing_ids.push(id);
      continue;
    }
    if (!String(hint.promptEn || '').trim()) incomplete_stems.push(id);
  }
  return { missing_ids, incomplete_stems };
}

export function assertOfficialHintsComplete(
  questionIds: string[],
  hints: Record<string, QuestionHint>
): void {
  const { missing_ids, incomplete_stems } = inspectOfficialHints(questionIds, hints);
  if (missing_ids.length || incomplete_stems.length) {
    throw new IncompleteOfficialQuestionDataError(missing_ids, incomplete_stems);
  }
}

/** Production / Render must never read gitignored staging JSON for seed grouping. */
export function productionMustUseOfficialSupabaseStems(): boolean {
  return isProductionRuntime() || productionForbidsLocalContentJson();
}
