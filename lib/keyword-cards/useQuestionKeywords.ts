'use client';

import { useEffect, useState } from 'react';
import type { LearnerKeywordCard } from './types';

const cache = new Map<string, LearnerKeywordCard[]>();
const inflight = new Map<string, Promise<LearnerKeywordCard[]>>();
const CACHE_LIMIT = 40;

function remember(questionId: string, rows: LearnerKeywordCard[]) {
  if (cache.has(questionId)) cache.delete(questionId);
  cache.set(questionId, rows);
  while (cache.size > CACHE_LIMIT) {
    const oldest = cache.keys().next().value;
    if (!oldest) break;
    cache.delete(oldest);
  }
}

function readKeywords(body: unknown): LearnerKeywordCard[] {
  const rows =
    body && typeof body === 'object' && Array.isArray((body as { keywords?: unknown }).keywords)
      ? (body as { keywords: Array<LearnerKeywordCard & { status?: string }> }).keywords
      : [];
  return rows.filter((row) => {
    if (!row || typeof row.id !== 'string') return false;
    if (row.status && row.status !== 'published') return false;
    return String(row.explanation_en || '').trim().length > 0;
  });
}

/** One in-flight request per question, shared by the prompt and the Keywords button. */
export function loadPublishedQuestionKeywords(questionId: string): Promise<LearnerKeywordCard[]> {
  const id = String(questionId || '').trim();
  if (!id) return Promise.resolve([]);
  const cached = cache.get(id);
  if (cached) return Promise.resolve(cached);
  const pending = inflight.get(id);
  if (pending) return pending;
  const request = fetch(`/api/keyword-cards/for-question?question_id=${encodeURIComponent(id)}`)
    .then(async (res) => {
      if (!res.ok) return [] as LearnerKeywordCard[];
      const rows = readKeywords(await res.json());
      remember(id, rows);
      return rows;
    })
    .catch(() => [] as LearnerKeywordCard[])
    .finally(() => {
      inflight.delete(id);
    });
  inflight.set(id, request);
  return request;
}

export function usePublishedQuestionKeywords(questionId: string): LearnerKeywordCard[] {
  const [keywords, setKeywords] = useState<LearnerKeywordCard[]>([]);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const cached = cache.get(questionId);
    if (cached) {
      setKeywords(cached);
      setLoadedFor(questionId);
      return;
    }
    loadPublishedQuestionKeywords(questionId).then((rows) => {
      if (cancelled) return;
      setKeywords(rows);
      setLoadedFor(questionId);
    });
    return () => {
      cancelled = true;
    };
  }, [questionId]);

  if (loadedFor !== questionId) return [];
  return keywords;
}
