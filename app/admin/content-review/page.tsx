'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { QuestionRow } from '@/lib/questions/types';
import { toTitleCaseLabel } from '@/lib/utils';

/**
 * Admin queue for progressive DVSA V2 review (explanations, media, keywords, workflow).
 * Lists non-published / unreviewed rows. Does not publish V2 content.
 */
export default function AdminContentReviewPage() {
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('draft');
  const [mediaReview, setMediaReview] = useState('unreviewed');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: '1',
        pageSize: '50',
        content_version: 'v2',
      });
      if (status) params.set('status', status);
      if (mediaReview) params.set('media_review_status', mediaReview);
      const res = await fetch(`/api/admin/questions?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load');
      setQuestions(data.questions || []);
      setTotal(data.total || 0);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Failed to load (migration 0008 + draft import required before V2 rows appear)'
      );
    } finally {
      setLoading(false);
    }
  }, [status, mediaReview]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Content review (V2)</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-2xl">
          Progressive review for draft DVSA V2 questions: explanations, keyword cards, and
          provisional images. Official stem/options/correct answers stay read-only when locked.
          Images are internal QA only — never mark as DVSA-approved. Draft rows never appear in
          live Practice or Mock Test.
        </p>
      </div>

      <div className="lt-card p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <select
          className="lt-input"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="draft">Draft</option>
          <option value="submitted">Submitted</option>
          <option value="approved">Approved</option>
          <option value="">All workflow statuses</option>
        </select>
        <select
          className="lt-input"
          value={mediaReview}
          onChange={(e) => setMediaReview(e.target.value)}
        >
          <option value="unreviewed">Media: unreviewed</option>
          <option value="needs_fix">Media: needs fix</option>
          <option value="reviewed">Media: reviewed (internal)</option>
          <option value="">Any media status</option>
        </select>
        <button type="button" className="lt-btn-ghost px-4 py-2 text-sm" onClick={() => void load()}>
          Refresh
        </button>
      </div>

      {error ? (
        <div className="rounded-[var(--radius-md)] border border-[var(--wrong)]/30 bg-[var(--wrong-soft)] px-4 py-3 text-sm text-[var(--wrong)]">
          {error}
        </div>
      ) : null}

      <p className="text-sm text-[var(--text-secondary)]">
        {loading ? 'Loading…' : `${total} matching · showing ${questions.length}`}
      </p>

      <div className="lt-card overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
              <th className="px-4 py-3 font-bold">ID</th>
              <th className="px-3 py-3 font-bold">Topic</th>
              <th className="px-3 py-3 font-bold">Status</th>
              <th className="px-3 py-3 font-bold">Media</th>
              <th className="px-3 py-3 font-bold">Stem</th>
              <th className="px-3 py-3 font-bold" />
            </tr>
          </thead>
          <tbody>
            {questions.map((row) => (
              <tr key={row.id} className="border-b border-[var(--border)]/60 align-top">
                <td className="px-4 py-3 font-mono text-xs">{row.id}</td>
                <td className="px-3 py-3">{toTitleCaseLabel(row.topic_id)}</td>
                <td className="px-3 py-3">{row.status}</td>
                <td className="px-3 py-3">{row.media_review_status || '—'}</td>
                <td className="px-3 py-3 max-w-md truncate" title={row.question_en}>
                  {row.question_en}
                </td>
                <td className="px-3 py-3 text-right">
                  <Link
                    href={`/admin/questions/${encodeURIComponent(row.id)}`}
                    className="text-[var(--lingo-red)] font-semibold text-xs hover:underline"
                  >
                    Review
                  </Link>
                </td>
              </tr>
            ))}
            {!loading && questions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[var(--text-secondary)]">
                  No V2 rows yet. Run the dry-run importer first; live draft import is blocked until
                  an approved window after migration 0008.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
