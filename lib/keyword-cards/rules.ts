/**
 * Keyword Card rules shared by the local store and the Supabase store.
 * Publishing is explicit. An image is never required. Video is rejected.
 */

import { canAdvanceCardStatus, type LearningCardStatus } from '../learning-cards/types';
import type { KeywordInput, KeywordRecord, LearnerKeywordCard } from './types';

export function canonicalKeywordTerm(term: string): string {
  return String(term || '').trim().replace(/\s+/g, ' ');
}

/** Dedup key. Matches the SQL check on keywords.term_normalized. */
export function normalizeKeywordTerm(term: string): string {
  return canonicalKeywordTerm(term).toLowerCase();
}

export function assertImageOnly(url: string | null | undefined): void {
  if (!url) return;
  const path = url.split('?')[0].toLowerCase();
  if (/\.(mp4|webm|mov|m4v)(?:$|\/)/.test(path) || path.includes('/video/')) {
    throw new Error('Keyword cards do not support video');
  }
}

export function prepareKeywordFields(input: KeywordInput) {
  const term_en = canonicalKeywordTerm(input.term_en);
  const term_normalized = normalizeKeywordTerm(term_en);
  if (!term_normalized) throw new Error('English term is required');
  if (term_en.length > 80) throw new Error('English term is too long');
  const explanation_en = String(input.explanation_en || '').trim();
  if (!explanation_en) throw new Error('Simple English explanation is required');
  if (explanation_en.length > 2000) throw new Error('English explanation is too long');
  const translation_ar = String(input.translation_ar || '').trim();
  const explanation_ar = String(input.explanation_ar || '').trim();
  if (translation_ar.length > 2000 || explanation_ar.length > 2000) {
    throw new Error('Arabic text is too long');
  }
  const image_url = String(input.image_url || '').trim() || null;
  assertImageOnly(image_url);
  const image_alt = String(input.image_alt || '').trim() || null;
  const notes = input.notes == null ? null : String(input.notes).trim() || null;
  return {
    term_en,
    term_normalized,
    explanation_en,
    translation_ar,
    explanation_ar,
    image_url,
    image_alt,
    notes,
  };
}

export function assertStatusTransition(from: LearningCardStatus, to: LearningCardStatus): void {
  if (!canAdvanceCardStatus(from, to)) {
    throw new Error(`Cannot move keyword card from ${from} to ${to}`);
  }
}

export function assertReviewable(keyword: { explanation_en?: string | null }, to: LearningCardStatus): void {
  if ((to === 'approved' || to === 'published') && !String(keyword.explanation_en || '').trim()) {
    throw new Error('Simple English explanation is required before approval');
  }
}

export function showsKeywordImage(card: { image_url?: string | null } | null | undefined): boolean {
  return Boolean(card?.image_url);
}

/** True when another keyword still displays this file or its public URL. */
export function keywordImageIsReferencedByAnother(
  keywords: ReadonlyArray<{
    id: string;
    image_url?: string | null;
    image_storage_path?: string | null;
  }>,
  exceptId: string,
  image: { image_url?: string | null; image_storage_path?: string | null }
): boolean {
  const url = String(image.image_url || '').trim() || null;
  const storagePath = String(image.image_storage_path || '').trim() || null;
  if (!url && !storagePath) return false;
  return keywords.some((row) => {
    if (row.id === exceptId) return false;
    if (storagePath && row.image_storage_path === storagePath) return true;
    if (url && row.image_url === url) return true;
    return false;
  });
}

export function toLearnerKeyword(row: KeywordRecord): LearnerKeywordCard {
  return {
    id: row.id,
    term_en: row.term_en,
    translation_ar: row.translation_ar || '',
    explanation_en: row.explanation_en || '',
    explanation_ar: row.explanation_ar || '',
    image_url: row.image_url || null,
    image_alt: row.image_alt || null,
  };
}

export function isPublishedKeyword(row: { status?: string; explanation_en?: string | null }): boolean {
  return row.status === 'published' && String(row.explanation_en || '').trim().length > 0;
}

export function clampKeywordIndex(length: number, index: number): number {
  if (length <= 0) return 0;
  if (index < 0) return 0;
  if (index >= length) return length - 1;
  return index;
}

export function asKeywordRecord(row: KeywordRecord): KeywordRecord {
  return {
    ...row,
    translation_ar: row.translation_ar || '',
    explanation_ar: row.explanation_ar || '',
    explanation_en: row.explanation_en || '',
    image_url: row.image_url || null,
    image_alt: row.image_alt || null,
    image_storage_path: row.image_storage_path || null,
    notes: row.notes ?? null,
    created_by: row.created_by ?? null,
    updated_by: row.updated_by ?? null,
    published_at: row.published_at ?? null,
    reviewed_at: row.reviewed_at ?? null,
    reviewed_by: row.reviewed_by ?? null,
  };
}
