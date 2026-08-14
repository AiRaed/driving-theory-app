'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TOPIC_META,
  langBadgeStatus,
  type QuestionRow,
} from '@/lib/questions/types';
import { toTitleCaseLabel } from '@/lib/utils';

function LangBadges({ row }: { row: QuestionRow }) {
  const b = langBadgeStatus(row);
  const chips = [
    { code: 'EN', on: b.en },
    { code: 'AR', on: b.ar },
    { code: 'UR', on: b.ur },
    ...b.extra.map((c) => ({ code: c.toUpperCase(), on: true })),
  ];
  return (
    <div className="flex flex-wrap gap-1">
      {chips.map((c) => (
        <span
          key={c.code}
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
            c.on
              ? 'bg-[var(--correct-soft)] text-[var(--correct)]'
              : 'bg-[var(--surface-secondary)] text-[var(--text-secondary)] opacity-60'
          }`}
        >
          {c.code}
        </span>
      ))}
    </div>
  );
}

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [qDraft, setQDraft] = useState('');
  const [topic, setTopic] = useState('');
  const [status, setStatus] = useState('published');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 25;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      if (q.trim()) params.set('q', q.trim());
      if (topic) params.set('topic', topic);
      if (status) params.set('status', status);
      const res = await fetch(`/api/admin/questions?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load');
      setQuestions(data.questions || []);
      setTotal(data.total || 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [page, q, topic, status]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setQ(qDraft);
    }, 300);
    return () => clearTimeout(t);
  }, [qDraft]);

  const archive = async (id: string) => {
    if (!confirm(`Archive question ${id}? It will leave Practice/Mock Test.`)) return;
    const res = await fetch(`/api/admin/questions/${encodeURIComponent(id)}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Archive failed');
      return;
    }
    void load();
  };

  const hardDelete = async (id: string) => {
    if (!confirm(`PERMANENTLY delete ${id}? This cannot be undone.`)) return;
    if (!confirm('Type-confirm: delete forever?')) return;
    const res = await fetch(`/api/admin/questions/${encodeURIComponent(id)}?hard=1`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Delete failed');
      return;
    }
    void load();
  };

  const duplicate = async (id: string) => {
    if (!confirm(`Duplicate question ${id} as a draft?`)) return;
    const getRes = await fetch(`/api/admin/questions/${encodeURIComponent(id)}`);
    const getData = await getRes.json();
    if (!getRes.ok) {
      alert(getData.error || 'Failed to load question');
      return;
    }
    const src = getData.question as QuestionRow;
    const form = {
      id: `${src.id}-COPY-${Date.now().toString(36).toUpperCase()}`,
      topic_id: src.topic_id,
      question_en: src.question_en,
      question_ar: src.question_ar || '',
      question_ur: src.question_ur || '',
      answer_1_en: src.answer_1_en,
      answer_1_ar: src.answer_1_ar || '',
      answer_1_ur: src.answer_1_ur || '',
      answer_2_en: src.answer_2_en,
      answer_2_ar: src.answer_2_ar || '',
      answer_2_ur: src.answer_2_ur || '',
      answer_3_en: src.answer_3_en || '',
      answer_3_ar: src.answer_3_ar || '',
      answer_3_ur: src.answer_3_ur || '',
      answer_4_en: src.answer_4_en || '',
      answer_4_ar: src.answer_4_ar || '',
      answer_4_ur: src.answer_4_ur || '',
      correct_answer: src.correct_answer,
      explanation_en: src.explanation_en || '',
      explanation_ar: src.explanation_ar || '',
      explanation_ur: src.explanation_ur || '',
      keywords: src.keywords || [],
      image_url: src.image_url || '',
      image_alt: src.image_alt || '',
      status: 'draft' as const,
      translations: src.translations || {},
    };
    const res = await fetch('/api/admin/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Duplicate failed');
      return;
    }
    window.location.href = `/admin/questions/${encodeURIComponent(data.question.id)}`;
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Questions</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {total} total · page {page} of {totalPages}
          </p>
        </div>
        <Link href="/admin/questions/new" className="lt-btn-primary px-4 py-2.5 text-sm">
          Add Question
        </Link>
      </div>

      <div className="lt-card p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <input
          className="lt-input sm:col-span-2"
          placeholder="Search English / Arabic / Urdu / ID…"
          value={qDraft}
          onChange={(e) => setQDraft(e.target.value)}
        />
        <select
          className="lt-input"
          value={topic}
          onChange={(e) => {
            setPage(1);
            setTopic(e.target.value);
          }}
        >
          <option value="">All topics</option>
          {TOPIC_META.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label_en}
            </option>
          ))}
        </select>
        <select
          className="lt-input"
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
          <option value="needs_review">Needs review</option>
        </select>
      </div>

      {error && (
        <div className="rounded-[var(--radius-md)] border border-[var(--wrong)]/30 bg-[var(--wrong-soft)] px-4 py-3 text-sm text-[var(--wrong)]">
          {error}
        </div>
      )}

      <div className="lt-card overflow-x-auto">
        <table className="w-full text-sm min-w-[860px]">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
              <th className="px-4 py-3 font-bold">Question</th>
              <th className="px-3 py-3 font-bold">Topic</th>
              <th className="px-3 py-3 font-bold">Translations</th>
              <th className="px-3 py-3 font-bold">Image</th>
              <th className="px-3 py-3 font-bold">Status</th>
              <th className="px-3 py-3 font-bold">Updated</th>
              <th className="px-3 py-3 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[var(--text-secondary)]">
                  Loading…
                </td>
              </tr>
            ) : questions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[var(--text-secondary)]">
                  No questions found. Run the import script if the bank is empty.
                </td>
              </tr>
            ) : (
              questions.map((row) => (
                <tr key={row.id} className="border-b border-[var(--border)] align-top">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-[var(--text-primary)]">{row.id}</p>
                    <p className="text-[var(--text-secondary)] line-clamp-2 mt-0.5">
                      {row.question_en}
                    </p>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">{toTitleCaseLabel(row.topic_id)}</td>
                  <td className="px-3 py-3">
                    <LangBadges row={row} />
                  </td>
                  <td className="px-3 py-3">
                    {row.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={row.image_url}
                        alt={row.image_alt || ''}
                        className="h-10 w-10 object-contain rounded border border-[var(--border)] bg-[var(--surface-secondary)]"
                      />
                    ) : (
                      <span className="text-xs text-[var(--text-secondary)]">No image</span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={
                        row.status === 'published'
                          ? 'text-[var(--correct)] font-medium'
                          : row.status === 'draft'
                            ? 'text-[var(--warning)] font-medium'
                            : 'text-[var(--text-secondary)]'
                      }
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-[var(--text-secondary)] text-xs">
                    {row.updated_at ? new Date(row.updated_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-col gap-1 items-start">
                      <Link
                        href={`/admin/questions/${encodeURIComponent(row.id)}`}
                        className="text-[var(--lingo-red)] font-medium hover:underline"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/admin/questions/${encodeURIComponent(row.id)}?preview=1`}
                        className="text-[var(--text-secondary)] hover:underline"
                      >
                        Preview
                      </Link>
                      <button
                        type="button"
                        onClick={() => void duplicate(row.id)}
                        className="text-[var(--text-secondary)] hover:underline"
                      >
                        Duplicate
                      </button>
                      <button
                        type="button"
                        onClick={() => void archive(row.id)}
                        className="text-[var(--text-secondary)] hover:underline"
                      >
                        Archive
                      </button>
                      <button
                        type="button"
                        onClick={() => void hardDelete(row.id)}
                        className="text-[var(--wrong)]/80 hover:underline text-xs"
                      >
                        Delete…
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          className="lt-btn-ghost px-4 py-2 text-sm"
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </button>
        <p className="text-sm text-[var(--text-secondary)]">
          {page} / {totalPages}
        </p>
        <button
          type="button"
          className="lt-btn-ghost px-4 py-2 text-sm"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}
