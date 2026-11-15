/**
 * English hint drafts for the admin editor.
 * Nothing in this file is published to learners.
 * review_later drafts stay provisional until an admin saves a hint.
 */

import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

export const PROVISIONAL_HINT_LABEL = 'Provisional — Needs Human Review';

export interface ExplanationHintDraft {
  question_id: string;
  english: string;
  rule_id: string;
  presentation: 'text' | 'text_image' | 'text_video';
  suggested_format: string;
  linked_question_ids: string[];
  review_status: 'unreviewed' | 'provisional';
  provisional?: boolean;
  review_label?: string | null;
  dvsa_approved: false;
  published: false;
}

interface DraftFile {
  classifier_version?: string;
  count?: number;
  published?: boolean;
  review_required?: boolean;
  presentation?: Record<string, number>;
  drafts?: ExplanationHintDraft[];
}

let cache: DraftFile | null = null;
let cacheMtime = Number.NaN;
let index: Map<string, ExplanationHintDraft> | null = null;

function draftFilePath(): string {
  return path.join(process.cwd(), 'data', 'explanation-hint-drafts.json');
}

function normalise(row: ExplanationHintDraft): ExplanationHintDraft {
  const provisional = row.provisional === true || row.review_status === 'provisional';
  return {
    ...row,
    dvsa_approved: false,
    published: false,
    provisional,
    review_status: provisional ? 'provisional' : 'unreviewed',
    review_label: provisional ? row.review_label || PROVISIONAL_HINT_LABEL : null,
  };
}

function loadFile(): DraftFile {
  const file = draftFilePath();
  if (!existsSync(file)) {
    cache = { drafts: [], published: false, review_required: true };
    cacheMtime = Number.NaN;
    index = new Map();
    return cache;
  }
  const mtime = statSync(file).mtimeMs;
  if (cache && cacheMtime === mtime && index) return cache;
  cache = JSON.parse(readFileSync(file, 'utf8')) as DraftFile;
  cacheMtime = mtime;
  index = new Map(
    (cache.drafts || []).map((row) => {
      const draft = normalise(row);
      return [draft.question_id, draft];
    })
  );
  return cache;
}

export function loadHintDraftsByQuestion(): Map<string, ExplanationHintDraft> {
  loadFile();
  return index || new Map();
}

export function loadHintDraft(questionId: string): ExplanationHintDraft | null {
  return loadHintDraftsByQuestion().get(questionId) || null;
}

export function hintDraftSummary(): {
  count: number;
  published: false;
  review_required: true;
  presentation: Record<string, number>;
} {
  const file = loadFile();
  return {
    count: file.count || (file.drafts || []).length,
    published: false,
    review_required: true,
    presentation: file.presentation || {},
  };
}
