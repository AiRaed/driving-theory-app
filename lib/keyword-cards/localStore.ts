/**
 * Local Keyword Cards store. Writes stay under gitignored local-data/ unless
 * LOCAL_KEYWORD_CARDS_STORE points somewhere else (tests). Never talks to Supabase.
 */

import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import type { LearningCardStatus } from '../learning-cards/types';
import {
  asKeywordRecord,
  assertImageOnly,
  assertReviewable,
  assertStatusTransition,
  isPublishedKeyword,
  prepareKeywordFields,
  toLearnerKeyword,
} from './rules';
import type {
  KeywordImageInput,
  KeywordInput,
  KeywordQuestionLink,
  KeywordRecord,
  KeywordSave,
  LearnerKeywordCard,
} from './types';

export const LOCAL_KEYWORD_CARDS_DIR = path.join(process.cwd(), 'local-data', 'keyword-cards');
export const LOCAL_KEYWORD_CARDS_STORE = path.join(LOCAL_KEYWORD_CARDS_DIR, 'store.json');

export interface KeywordCardsLocalState {
  keywords: KeywordRecord[];
  links: KeywordQuestionLink[];
  saves: KeywordSave[];
}

function emptyState(): KeywordCardsLocalState {
  return { keywords: [], links: [], saves: [] };
}

function nowIso(): string {
  return new Date().toISOString();
}

export function keywordCardsStorePath(): string {
  return process.env.LOCAL_KEYWORD_CARDS_STORE || LOCAL_KEYWORD_CARDS_STORE;
}

export function readKeywordCards(): KeywordCardsLocalState {
  const storePath = keywordCardsStorePath();
  if (!existsSync(storePath)) return emptyState();
  try {
    const raw = JSON.parse(readFileSync(storePath, 'utf8'));
    return {
      keywords: Array.isArray(raw.keywords) ? raw.keywords : [],
      links: Array.isArray(raw.links) ? raw.links : [],
      saves: Array.isArray(raw.saves) ? raw.saves : [],
    };
  } catch {
    return emptyState();
  }
}

export function writeKeywordCards(state: KeywordCardsLocalState): void {
  const storePath = keywordCardsStorePath();
  mkdirSync(path.dirname(storePath), { recursive: true });
  writeFileSync(storePath, JSON.stringify(state, null, 2) + '\n', 'utf8');
}

function requireKeyword(state: KeywordCardsLocalState, id: string): KeywordRecord {
  const row = state.keywords.find((item) => item.id === id);
  if (!row) throw new Error('Keyword card not found');
  return row;
}

export function listKeywords(filters?: { q?: string; status?: string }): {
  keywords: KeywordRecord[];
  links: KeywordQuestionLink[];
} {
  const state = readKeywordCards();
  const q = String(filters?.q || '').trim().toLowerCase();
  const keywords = state.keywords
    .filter((row) => {
      if (filters?.status && row.status !== filters.status) return false;
      if (!q) return true;
      return (
        row.term_en.toLowerCase().includes(q) ||
        row.term_normalized.includes(q) ||
        row.translation_ar.toLowerCase().includes(q) ||
        row.explanation_en.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => a.term_en.localeCompare(b.term_en));
  return { keywords, links: state.links };
}

export function createKeyword(input: KeywordInput, userId?: string | null): KeywordRecord {
  const fields = prepareKeywordFields(input);
  const state = readKeywordCards();
  if (state.keywords.some((row) => row.term_normalized === fields.term_normalized)) {
    throw new Error('A keyword card with this term already exists');
  }
  const stamp = nowIso();
  const row: KeywordRecord = asKeywordRecord({
    id: randomUUID(),
    ...fields,
    image_storage_path: null,
    status: 'draft',
    created_at: stamp,
    updated_at: stamp,
    created_by: userId || null,
    updated_by: userId || null,
    published_at: null,
    reviewed_at: null,
    reviewed_by: null,
  });
  state.keywords.push(row);
  writeKeywordCards(state);
  return row;
}

export function updateKeyword(
  id: string,
  input: KeywordInput,
  userId?: string | null
): KeywordRecord {
  const fields = prepareKeywordFields(input);
  const state = readKeywordCards();
  const existing = requireKeyword(state, id);
  if (
    state.keywords.some(
      (row) => row.id !== id && row.term_normalized === fields.term_normalized
    )
  ) {
    throw new Error('A keyword card with this term already exists');
  }
  const imageChanged = (fields.image_url || null) !== (existing.image_url || null);
  const next: KeywordRecord = asKeywordRecord({
    ...existing,
    ...fields,
    image_storage_path: fields.image_url
      ? imageChanged
        ? null
        : existing.image_storage_path
      : null,
    status: existing.status,
    published_at: existing.published_at,
    reviewed_at: existing.reviewed_at,
    reviewed_by: existing.reviewed_by,
    created_at: existing.created_at,
    created_by: existing.created_by,
    updated_at: nowIso(),
    updated_by: userId || null,
  });
  if (next.status === 'published' || next.status === 'approved') {
    assertReviewable(next, next.status === 'published' ? 'published' : 'approved');
  }
  state.keywords = state.keywords.map((row) => (row.id === id ? next : row));
  writeKeywordCards(state);
  return next;
}

export function setKeywordStatus(
  id: string,
  to: LearningCardStatus,
  userId?: string | null
): KeywordRecord {
  const state = readKeywordCards();
  const existing = requireKeyword(state, id);
  assertStatusTransition(existing.status, to);
  assertReviewable(existing, to);
  const stamp = nowIso();
  const next: KeywordRecord = {
    ...existing,
    status: to,
    updated_at: stamp,
    updated_by: userId || null,
    published_at: to === 'published' ? stamp : null,
    reviewed_at: to === 'approved' || to === 'published' ? stamp : existing.reviewed_at,
    reviewed_by: to === 'approved' || to === 'published' ? userId || null : existing.reviewed_by,
  };
  state.keywords = state.keywords.map((row) => (row.id === id ? next : row));
  writeKeywordCards(state);
  return next;
}

export function setKeywordImage(
  id: string,
  image: KeywordImageInput,
  userId?: string | null
): KeywordRecord {
  const image_url = String(image.image_url || '').trim() || null;
  assertImageOnly(image_url);
  const state = readKeywordCards();
  const existing = requireKeyword(state, id);
  const next: KeywordRecord = {
    ...existing,
    image_url,
    image_alt: image_url ? String(image.image_alt || existing.image_alt || '').trim() || null : null,
    image_storage_path: image_url
      ? image.image_storage_path === undefined
        ? image_url === existing.image_url
          ? existing.image_storage_path
          : null
        : image.image_storage_path
      : null,
    updated_at: nowIso(),
    updated_by: userId || null,
  };
  state.keywords = state.keywords.map((row) => (row.id === id ? next : row));
  writeKeywordCards(state);
  return next;
}

export function removeKeyword(id: string): void {
  const state = readKeywordCards();
  requireKeyword(state, id);
  state.keywords = state.keywords.filter((row) => row.id !== id);
  state.links = state.links.filter((row) => row.keyword_id !== id);
  state.saves = state.saves.filter((row) => row.keyword_id !== id);
  writeKeywordCards(state);
}

export function linkKeywordQuestion(
  keywordId: string,
  questionId: string,
  userId?: string | null
): KeywordQuestionLink {
  const state = readKeywordCards();
  requireKeyword(state, keywordId);
  const question_id = String(questionId || '').trim();
  if (!question_id) throw new Error('Official question is required');
  const existing = state.links.find(
    (row) => row.keyword_id === keywordId && row.question_id === question_id
  );
  if (existing) return existing;
  const link: KeywordQuestionLink = {
    keyword_id: keywordId,
    question_id,
    created_at: nowIso(),
    created_by: userId || null,
  };
  state.links.push(link);
  writeKeywordCards(state);
  return link;
}

export function unlinkKeywordQuestion(keywordId: string, questionId: string): void {
  const state = readKeywordCards();
  requireKeyword(state, keywordId);
  const question_id = String(questionId || '').trim();
  state.links = state.links.filter(
    (row) => !(row.keyword_id === keywordId && row.question_id === question_id)
  );
  writeKeywordCards(state);
}

export function listPublishedForQuestion(questionId: string): LearnerKeywordCard[] {
  const state = readKeywordCards();
  const ids = new Set(
    state.links.filter((row) => row.question_id === questionId).map((row) => row.keyword_id)
  );
  return state.keywords
    .filter((row) => ids.has(row.id) && isPublishedKeyword(row))
    .sort((a, b) => a.term_en.localeCompare(b.term_en))
    .map(toLearnerKeyword);
}

export function listSavedKeywords(userId: string): LearnerKeywordCard[] {
  const state = readKeywordCards();
  const ids = new Set(
    state.saves.filter((row) => row.user_id === userId).map((row) => row.keyword_id)
  );
  return state.keywords
    .filter((row) => ids.has(row.id) && isPublishedKeyword(row))
    .sort((a, b) => a.term_en.localeCompare(b.term_en))
    .map(toLearnerKeyword);
}

export function addKeywordSave(userId: string, keywordId: string): KeywordSave {
  const state = readKeywordCards();
  const keyword = requireKeyword(state, keywordId);
  if (!isPublishedKeyword(keyword)) {
    throw new Error('Only published keyword cards can be saved');
  }
  const existing = state.saves.find(
    (row) => row.user_id === userId && row.keyword_id === keywordId
  );
  if (existing) return existing;
  const row: KeywordSave = {
    id: randomUUID(),
    user_id: userId,
    keyword_id: keywordId,
    created_at: nowIso(),
  };
  state.saves.push(row);
  writeKeywordCards(state);
  return row;
}

export function removeKeywordSave(userId: string, keywordId: string): void {
  const state = readKeywordCards();
  state.saves = state.saves.filter(
    (row) => !(row.user_id === userId && row.keyword_id === keywordId)
  );
  writeKeywordCards(state);
}

export function toggleKeywordSave(
  userId: string,
  keywordId: string
): { saved: boolean; row: KeywordSave | null } {
  const state = readKeywordCards();
  const existing = state.saves.find(
    (row) => row.user_id === userId && row.keyword_id === keywordId
  );
  if (existing) {
    removeKeywordSave(userId, keywordId);
    return { saved: false, row: null };
  }
  return { saved: true, row: addKeywordSave(userId, keywordId) };
}
