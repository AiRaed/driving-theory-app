/**
 * Admin-only preview and import of local Keyword Card drafts.
 * Writes status = draft only. Never approves, publishes, or calls a status route.
 * Does not read or write Supabase by itself. Callers pass the rows they already hold.
 */

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { isKeywordCardsNotMigratedError } from './errors';
import { isOfficialQuestionId } from './questionId';
import { normalizeKeywordTerm } from './rules';
import type { KeywordDraft, KeywordDraftFile, KeywordReviewConcern } from './draftTypes';

export const KEYWORD_DRAFT_IMPORT_CONFIRM = 'IMPORT_DRAFTS_ONLY';
export const KEYWORD_DRAFT_IMPORT_BATCH = 20;
const NOTE_PREFIX = 'draft-import:v1;';

export class KeywordDraftImportRejectedError extends Error {
  readonly errors: string[];
  constructor(errors: string[]) {
    super(errors[0] || 'Keyword draft import was rejected');
    this.name = 'KeywordDraftImportRejectedError';
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export interface ImportExistingKeyword {
  id: string;
  term_en: string;
  term_normalized: string;
  explanation_en: string;
  translation_ar: string;
  explanation_ar: string;
  image_url: string | null;
  image_alt: string | null;
  status: string;
  notes: string | null;
}

export interface ImportExistingLink {
  keyword_id: string;
  question_id: string;
}

export interface KeywordDraftImportPreviewFlag {
  term_en: string;
  review_concern: KeywordReviewConcern | null;
  review_note: string | null;
  previous_explanation_en: string | null;
  question_ids: string[];
}

export interface KeywordDraftImportPreview {
  ok: boolean;
  errors: string[];
  review_flags: KeywordDraftImportPreviewFlag[];
  keyword_count: number;
  link_count: number;
  would_create: number;
  would_update: number;
  would_skip_duplicate: number;
  would_skip_manual: number;
  would_skip_protected: number;
  would_link: number;
  already_linked: number;
  published: false;
  writes: false;
}

export interface KeywordDraftImportResult {
  created: number;
  updated: number;
  skipped: number;
  duplicate: number;
  failed: number;
  linked: number;
  already_linked: number;
  skipped_manual: number;
  skipped_protected: number;
  published: false;
  batch_size: number;
  failures: Array<{ term_en: string; message: string }>;
}

export interface KeywordImportWriter {
  createDraft(input: {
    term_en: string;
    explanation_en: string;
    notes: string;
  }): Promise<{ id: string; status: string }>;
  updateDraftContent(
    id: string,
    input: {
      term_en: string;
      explanation_en: string;
      translation_ar: string;
      explanation_ar: string;
      image_url: string | null;
      image_alt: string | null;
      notes: string;
    }
  ): Promise<{ id: string; status: string }>;
  link(keywordId: string, questionId: string): Promise<void>;
  removeCreated(id: string): Promise<void>;
}

type PlannedAction = 'create' | 'update' | 'duplicate' | 'skip_manual' | 'skip_protected';

interface PlannedKeyword {
  keyword: KeywordDraft;
  action: PlannedAction;
  existing: ImportExistingKeyword | null;
  newQuestionIds: string[];
  alreadyLinked: number;
}

export function keywordDraftFingerprint(term: string, explanation: string): string {
  return createHash('sha256')
    .update(`${normalizeKeywordTerm(term)}\n${String(explanation || '').trim()}`)
    .digest('hex')
    .slice(0, 20);
}

export function keywordDraftImportNote(keyword: {
  draft_id: string;
  term_en: string;
  explanation_en: string;
  review_flag: boolean;
  review_note?: string | null;
}): string {
  const hash = keywordDraftFingerprint(keyword.term_en, keyword.explanation_en);
  const review = keyword.review_flag ? ';review=required' : '';
  const note = keyword.review_note ? ` ${keyword.review_note}` : '';
  return `${NOTE_PREFIX}id=${keyword.draft_id};hash=${hash}${review}.${note}`.trim();
}

export function assertKeywordDraftImportConfirmation(value: unknown): void {
  if (value !== KEYWORD_DRAFT_IMPORT_CONFIRM) {
    throw new KeywordDraftImportRejectedError([
      'Explicit confirmation is required before a draft import can write.',
    ]);
  }
}

export function loadReviewedKeywordDraft(root = process.cwd()): KeywordDraftFile {
  const filePath = path.join(root, 'data', 'keyword-card-drafts.json');
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(filePath, 'utf8'));
  } catch {
    throw new KeywordDraftImportRejectedError(['Malformed keyword draft file.']);
  }
  if (!parsed || typeof parsed !== 'object' || !Array.isArray((parsed as KeywordDraftFile).keywords)) {
    throw new KeywordDraftImportRejectedError(['Malformed keyword draft file.']);
  }
  return parsed as KeywordDraftFile;
}

export function loadOfficialQuestionIds(root = process.cwd()): Set<string> {
  const filePath = path.join(root, 'local-data', 'dvsa', 'staging', 'questions.v2.json');
  let parsed: { questions?: Array<{ id?: string }> };
  try {
    parsed = JSON.parse(readFileSync(filePath, 'utf8'));
  } catch {
    throw new KeywordDraftImportRejectedError(['Official question bank could not be read.']);
  }
  const ids = new Set<string>();
  for (const question of parsed.questions || []) {
    if (question.id) ids.add(question.id);
  }
  return ids;
}

function hashFromNote(notes: string | null): string | null {
  if (!notes || !notes.startsWith(NOTE_PREFIX)) return null;
  const match = notes.match(/hash=([a-f0-9]{20})/);
  return match ? match[1] : null;
}

function isDraftKeyword(value: unknown): value is KeywordDraft {
  if (!value || typeof value !== 'object') return false;
  const row = value as Partial<KeywordDraft>;
  return typeof row.term_en === 'string' && typeof row.explanation_en === 'string' && Array.isArray(row.links);
}

export function validateKeywordDraftImport(
  draft: unknown,
  officialQuestionIds: ReadonlySet<string>
): string[] {
  const errors: string[] = [];
  if (!draft || typeof draft !== 'object') return ['Malformed keyword draft file.'];
  const file = draft as Partial<KeywordDraftFile>;
  if (file.schema !== 'lingotheory.keyword_card_drafts.v1') errors.push('Unexpected draft schema');
  if (file.status !== 'draft' || file.published !== false || file.do_not_publish !== true) {
    errors.push('Draft file must stay unpublished');
  }
  if (!Array.isArray(file.keywords)) return [...errors, 'Malformed keyword draft file.'];
  if (file.keywords.length === 0) errors.push('Draft file has no keywords');

  const seenTerms = new Set<string>();
  const seenPairs = new Set<string>();
  for (const value of file.keywords) {
    if (!isDraftKeyword(value)) {
      errors.push('Malformed keyword draft');
      continue;
    }
    const label = value.term_en || value.draft_id || 'keyword';
    if (value.status !== 'draft' || value.published !== false) {
      errors.push(`${label} is not an unpublished draft`);
    }
    if (value.translation_ar || value.explanation_ar) {
      errors.push(`${label} includes Arabic text`);
    }
    if (value.image_url || value.image_storage_path) {
      errors.push(`${label} includes an image file`);
    }
    const term = normalizeKeywordTerm(value.term_en);
    if (!term || !String(value.explanation_en || '').trim()) {
      errors.push(`${label} is missing a term or explanation`);
    }
    if (seenTerms.has(term)) errors.push(`Duplicate canonical keyword ${term}`);
    seenTerms.add(term);
    const links = Array.isArray(value.links) ? value.links : [];
    if (!links.length) errors.push(`${label} has no question links`);
    for (const link of links) {
      const questionId = String(link?.question_id || '');
      if (!isOfficialQuestionId(questionId) || !officialQuestionIds.has(questionId)) {
        errors.push(`${label} links unknown question ${questionId || '(blank)'}`);
      }
      const pair = `${term}::${questionId}`;
      if (seenPairs.has(pair)) errors.push(`Duplicate link ${pair}`);
      seenPairs.add(pair);
    }
  }
  return errors;
}

function planKeywords(
  keywords: KeywordDraft[],
  existingKeywords: ImportExistingKeyword[],
  existingLinks: ImportExistingLink[]
): PlannedKeyword[] {
  const byTerm = new Map(existingKeywords.map((row) => [row.term_normalized, row]));
  const linksByKeyword = new Map<string, Set<string>>();
  for (const link of existingLinks) {
    const set = linksByKeyword.get(link.keyword_id) || new Set<string>();
    set.add(link.question_id);
    linksByKeyword.set(link.keyword_id, set);
  }

  return keywords.map((keyword) => {
    const existing = byTerm.get(keyword.term_normalized) || null;
    const questionIds = keyword.links.map((link) => link.question_id);
    if (!existing) {
      return {
        keyword,
        action: 'create' as const,
        existing: null,
        newQuestionIds: questionIds,
        alreadyLinked: 0,
      };
    }
    const protectedStatus = existing.status !== 'draft';
    const currentHash = keywordDraftFingerprint(existing.term_en, existing.explanation_en);
    const payloadHash = keywordDraftFingerprint(keyword.term_en, keyword.explanation_en);
    const noteHash = hashFromNote(existing.notes);
    const untouchedImport = noteHash !== null && noteHash === currentHash;
    const linked = linksByKeyword.get(existing.id) || new Set<string>();
    const newQuestionIds = questionIds.filter((id) => !linked.has(id));
    const alreadyLinked = questionIds.length - newQuestionIds.length;
    if (protectedStatus) {
      return { keyword, action: 'skip_protected', existing, newQuestionIds: [], alreadyLinked };
    }
    if (!untouchedImport) {
      return { keyword, action: 'skip_manual', existing, newQuestionIds: [], alreadyLinked };
    }
    if (currentHash === payloadHash) {
      return { keyword, action: 'duplicate', existing, newQuestionIds, alreadyLinked };
    }
    return { keyword, action: 'update', existing, newQuestionIds, alreadyLinked };
  });
}

export function previewKeywordDraftImport(
  draft: unknown,
  officialQuestionIds: ReadonlySet<string>,
  existing: { keywords: ImportExistingKeyword[]; links: ImportExistingLink[] } = {
    keywords: [],
    links: [],
  }
): KeywordDraftImportPreview {
  const errors = validateKeywordDraftImport(draft, officialQuestionIds);
  const file = (draft || {}) as Partial<KeywordDraftFile>;
  const keywords = Array.isArray(file.keywords) ? file.keywords.filter(isDraftKeyword) : [];
  const review_flags: KeywordDraftImportPreviewFlag[] = keywords
    .filter((keyword) => keyword.review_flag)
    .map((keyword) => ({
      term_en: keyword.term_en,
      review_concern: keyword.review_concern || null,
      review_note: keyword.review_note || null,
      previous_explanation_en: keyword.previous_explanation_en || null,
      question_ids: keyword.links.map((link) => link.question_id),
    }));
  const planned = errors.length ? [] : planKeywords(keywords, existing.keywords, existing.links);
  const count = (action: PlannedAction) => planned.filter((item) => item.action === action).length;
  return {
    ok: errors.length === 0,
    errors,
    review_flags,
    keyword_count: keywords.length,
    link_count: keywords.reduce((sum, keyword) => sum + keyword.links.length, 0),
    would_create: count('create'),
    would_update: count('update'),
    would_skip_duplicate: count('duplicate'),
    would_skip_manual: count('skip_manual'),
    would_skip_protected: count('skip_protected'),
    would_link: planned.reduce((sum, item) => sum + item.newQuestionIds.length, 0),
    already_linked: planned.reduce((sum, item) => sum + item.alreadyLinked, 0),
    published: false,
    writes: false,
  };
}

function chunks<T>(items: T[], size: number): T[][] {
  const groups: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    groups.push(items.slice(index, index + size));
  }
  return groups;
}

export async function executeKeywordDraftImport(input: {
  draft: unknown;
  officialQuestionIds: ReadonlySet<string>;
  existing: { keywords: ImportExistingKeyword[]; links: ImportExistingLink[] };
  writer: KeywordImportWriter;
  batchSize?: number;
}): Promise<KeywordDraftImportResult> {
  const preview = previewKeywordDraftImport(input.draft, input.officialQuestionIds, input.existing);
  if (!preview.ok) throw new KeywordDraftImportRejectedError(preview.errors);
  const file = input.draft as KeywordDraftFile;
  const planned = planKeywords(file.keywords, input.existing.keywords, input.existing.links);
  const batchSize = input.batchSize || KEYWORD_DRAFT_IMPORT_BATCH;
  const result: KeywordDraftImportResult = {
    created: 0,
    updated: 0,
    skipped: 0,
    duplicate: 0,
    failed: 0,
    linked: 0,
    already_linked: 0,
    skipped_manual: 0,
    skipped_protected: 0,
    published: false,
    batch_size: batchSize,
    failures: [],
  };

  for (const batch of chunks(planned, batchSize)) {
    for (const item of batch) {
      if (item.action === 'skip_protected') {
        result.skipped_protected += 1;
        result.skipped += 1;
        result.already_linked += item.alreadyLinked;
        continue;
      }
      if (item.action === 'skip_manual') {
        result.skipped_manual += 1;
        result.skipped += 1;
        result.already_linked += item.alreadyLinked;
        continue;
      }
      let createdId: string | null = null;
      let linkedThisKeyword = 0;
      try {
        let keywordId = item.existing?.id || '';
        if (item.action === 'create') {
          const created = await input.writer.createDraft({
            term_en: item.keyword.term_en,
            explanation_en: item.keyword.explanation_en,
            notes: keywordDraftImportNote(item.keyword),
          });
          createdId = created.id;
          keywordId = created.id;
          if (created.status !== 'draft') {
            throw new Error('Import refused to keep a keyword that was not left as a draft');
          }
        }
        for (const questionId of item.newQuestionIds) {
          await input.writer.link(keywordId, questionId);
          linkedThisKeyword += 1;
        }
        if (item.action === 'update' && item.existing) {
          const updated = await input.writer.updateDraftContent(item.existing.id, {
            term_en: item.keyword.term_en,
            explanation_en: item.keyword.explanation_en,
            translation_ar: item.existing.translation_ar || '',
            explanation_ar: item.existing.explanation_ar || '',
            image_url: item.existing.image_url,
            image_alt: item.existing.image_alt,
            notes: keywordDraftImportNote(item.keyword),
          });
          if (updated.status !== 'draft') {
            throw new Error('Import refused to change a draft into another status');
          }
        }
        if (item.action === 'create') result.created += 1;
        if (item.action === 'update') result.updated += 1;
        if (item.action === 'duplicate') result.duplicate += 1;
        result.linked += linkedThisKeyword;
        result.already_linked += item.alreadyLinked;
      } catch (error) {
        if (isKeywordCardsNotMigratedError(error)) throw error;
        if (createdId) {
          try {
            await input.writer.removeCreated(createdId);
          } catch {
            // Keep the original failure. A retry can reconcile a card that could not be removed.
          }
        }
        result.failed += 1;
        result.failures.push({
          term_en: item.keyword.term_en,
          message: error instanceof Error ? error.message : 'Import failed',
        });
      }
    }
  }
  return result;
}
