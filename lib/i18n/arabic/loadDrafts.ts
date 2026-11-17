/**
 * Reads local Arabic drafts. Does not write Supabase, apply migrations,
 * or change official English text.
 */

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import type {
  ArabicHintDraftFile,
  ArabicKeywordDraftFile,
  ArabicQuestionDraftFile,
  GlossaryEntry,
} from './types';
import type { EnglishHintSource, EnglishKeywordSource, OfficialEnglishQuestion } from './validate';

export const ARABIC_GLOSSARY_PATH = path.join(process.cwd(), 'data', 'ar-glossary.json');
export const ARABIC_HINT_DRAFT_PATH = path.join(process.cwd(), 'data', 'ar-explanation-hint-drafts.json');
export const ARABIC_KEYWORD_DRAFT_PATH = path.join(process.cwd(), 'data', 'ar-keyword-translations.json');
export const ARABIC_QUESTION_DRAFT_PATH = path.join(
  process.cwd(),
  'local-data',
  'dvsa',
  'staging',
  'ar-question-drafts.json'
);
export const V2_STAGING_PATH = path.join(process.cwd(), 'local-data', 'dvsa', 'staging', 'questions.v2.json');
export const V1_BACKUP_PATH = path.join(
  process.cwd(),
  'local-data',
  'dvsa',
  'backups',
  '2026-11-14T19-02-40-089Z',
  'questions.json'
);
export const ENGLISH_HINT_PATH = path.join(process.cwd(), 'data', 'explanation-hint-drafts.json');
export const ENGLISH_KEYWORD_PATH = path.join(process.cwd(), 'data', 'keyword-card-drafts.json');

function readJson<T>(file: string): T | null {
  if (!existsSync(file)) return null;
  return JSON.parse(readFileSync(file, 'utf8')) as T;
}

export function loadGlossaryEntries(): GlossaryEntry[] {
  const file = readJson<{ entries: GlossaryEntry[] }>(ARABIC_GLOSSARY_PATH);
  return file?.entries || [];
}

export function loadOfficialV2Questions(): OfficialEnglishQuestion[] | null {
  const file = readJson<{ questions: Array<Record<string, unknown>> }>(V2_STAGING_PATH);
  if (!file?.questions) return null;
  return file.questions.map((row) => ({
    id: String(row.id || ''),
    question: String(row.promptEn || ''),
    answers: Array.isArray(row.options)
      ? (row.options as Array<{ en?: string }>).map((option) => String(option.en || ''))
      : [],
    explanation: String(row.explanationEn || ''),
    correctAnswer: Number(row.correctAnswer || 0),
  }));
}

export function loadArabicQuestionDrafts(): ArabicQuestionDraftFile | null {
  return readJson<ArabicQuestionDraftFile>(ARABIC_QUESTION_DRAFT_PATH);
}

export function loadEnglishHints(): EnglishHintSource[] {
  const file = readJson<{ drafts?: Array<Record<string, unknown>> }>(ENGLISH_HINT_PATH);
  return (file?.drafts || []).map((row) => ({
    question_id: String(row.question_id || ''),
    english: String(row.english || ''),
    provisional: row.provisional === true || row.review_status === 'provisional',
  }));
}

export function loadArabicHintDrafts(): ArabicHintDraftFile | null {
  return readJson<ArabicHintDraftFile>(ARABIC_HINT_DRAFT_PATH);
}

export function loadEnglishKeywords(): EnglishKeywordSource[] {
  const file = readJson<{ keywords?: Array<Record<string, unknown>> }>(ENGLISH_KEYWORD_PATH);
  return (file?.keywords || []).map((row) => ({
    draft_id: String(row.draft_id || ''),
    term_en: String(row.term_en || ''),
    term_normalized: String(row.term_normalized || ''),
    explanation_en: String(row.explanation_en || ''),
    image_url: (row.image_url as string | null) ?? null,
    question_ids: Array.isArray(row.question_ids) ? row.question_ids.map(String) : [],
  }));
}

export function loadArabicKeywordDrafts(): ArabicKeywordDraftFile | null {
  return readJson<ArabicKeywordDraftFile>(ARABIC_KEYWORD_DRAFT_PATH);
}

export interface ExistingArabicAudit {
  v2_total: number;
  v2_arabic_stems: number;
  v2_arabic_complete: number;
  v1_total: number;
  v1_arabic_stems: number;
  v1_arabic_explanations: number;
  v1_arabic_complete: number;
  exact_stem_overlaps: number;
  safe_to_reuse: number;
  preserved: true;
  note: string;
}

function completeV1(row: Record<string, unknown>): boolean {
  if (!String(row.question_ar || '').trim()) return false;
  if (!String(row.explanation_ar || '').trim()) return false;
  return [1, 2, 3, 4].every((index) => String(row[`answer_${index}_ar`] || '').trim());
}

/** Compares stored Arabic with the current V2 English source. Does not copy it. */
export function auditExistingArabic(): ExistingArabicAudit {
  const v2 = readJson<{ questions: Array<Record<string, unknown>> }>(V2_STAGING_PATH);
  const backup = readJson<Array<Record<string, unknown>>>(V1_BACKUP_PATH);
  const v2Rows = v2?.questions || [];
  const v1Rows = Array.isArray(backup) ? backup : [];
  let v2Arabic = 0;
  let v2Complete = 0;
  for (const row of v2Rows) {
    const stem = String(row.promptAr || '').trim();
    const options = Array.isArray(row.options) ? (row.options as Array<{ ar?: string; en?: string }>) : [];
    const optionArabic = options.filter((option) => String(option.ar || '').trim()).length;
    const textOptions = options.filter((option) => String(option.en || '').trim()).length;
    if (stem) v2Arabic += 1;
    if (stem && optionArabic >= textOptions && textOptions > 0) v2Complete += 1;
  }
  const byStem = new Map<string, Record<string, unknown>>();
  let v1Stems = 0;
  let v1Explanations = 0;
  let v1Complete = 0;
  for (const row of v1Rows) {
    if (String(row.question_ar || '').trim()) v1Stems += 1;
    if (String(row.explanation_ar || '').trim()) v1Explanations += 1;
    if (completeV1(row)) v1Complete += 1;
    const key = String(row.question_en || '').replace(/\s+/g, ' ').trim().toLowerCase();
    if (key && !byStem.has(key)) byStem.set(key, row);
  }
  let overlaps = 0;
  let safe = 0;
  for (const row of v2Rows) {
    const key = String(row.promptEn || '').replace(/\s+/g, ' ').trim().toLowerCase();
    const previous = byStem.get(key);
    if (!previous) continue;
    overlaps += 1;
    const options = Array.isArray(row.options) ? (row.options as Array<{ en?: string }>) : [];
    const sameOptions = options.every(
      (option, index) =>
        String(option.en || '').trim() === String(previous[`answer_${index + 1}_en`] || '').trim()
    );
    const sameExplanation =
      String(row.explanationEn || '').trim() === String(previous.explanation_en || '').trim();
    if (sameOptions && sameExplanation && completeV1(previous)) safe += 1;
  }
  return {
    v2_total: v2Rows.length,
    v2_arabic_stems: v2Arabic,
    v2_arabic_complete: v2Complete,
    v1_total: v1Rows.length,
    v1_arabic_stems: v1Stems,
    v1_arabic_explanations: v1Explanations,
    v1_arabic_complete: v1Complete,
    exact_stem_overlaps: overlaps,
    safe_to_reuse: safe,
    preserved: true,
    note:
      'V1 Arabic stays in the backup. It is not copied onto V2, because matching stems still differ in options or explanations.',
  };
}
