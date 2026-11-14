'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { TOPIC_META } from '@/lib/questions/types';
import KeywordCardEditor from '@/components/admin/KeywordCardEditor';

type Rec = {
  question_id: string;
  topic: string;
  recommended_classification: string;
  effective_classification: string;
  priority: string;
  suggested_format: string;
  rationale: string;
  card_status: string;
  card_unnecessary: boolean;
};

export default function AdminLearningCardsPage() {
  const [rows, setRows] = useState<Rec[]>([]);
  const [totals, setTotals] = useState<Record<string, unknown>>({});
  const [classification, setClassification] = useState('');
  const [topic, setTopic] = useState('');
  const [priority, setPriority] = useState('');
  const [cardStatus, setCardStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [seedMsg, setSeedMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (classification) params.set('classification', classification);
    if (topic) params.set('topic', topic);
    if (priority) params.set('priority', priority);
    if (cardStatus) params.set('card_status', cardStatus);
    const res = await fetch(`/api/admin/learning-cards/recommendations?${params}`);
    const data = await res.json();
    setRows(data.recommendations || []);
    setTotals(data.totals || {});
    setLoading(false);
  }, [classification, topic, priority, cardStatus]);

  useEffect(() => {
    void load();
  }, [load]);

  const seed = async () => {
    const res = await fetch('/api/admin/learning-cards/seed-drafts', { method: 'POST' });
    const data = await res.json();
    setSeedMsg(JSON.stringify(data));
    void load();
  };

  const recTotals = (totals.recommended || {}) as Record<string, number>;
  const priTotals = (totals.priority || {}) as Record<string, number>;
  const cardTotals = (totals.card_status || {}) as Record<string, number>;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Learning cards</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-2xl">
          Classify where a custom Explanation Card adds value. Admin can override any
          recommendation, including creating a card for <code>image_is_enough</code>. After
          migration 0009, drafts persist in Supabase. Learners only see published cards.
          Recommendations are not DVSA-approved.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Unique IDs" value={String(totals.unique_ids || 0)} />
        <Stat label="Needs explanation" value={String(recTotals.needs_explanation || 0)} />
        <Stat label="Image is enough" value={String(recTotals.image_is_enough || 0)} />
        <Stat label="Review later" value={String(recTotals.review_later || 0)} />
        <Stat label="High priority" value={String(priTotals.high || 0)} />
        <Stat label="Cards none" value={String(cardTotals.none || 0)} />
        <Stat label="Draft cards" value={String(cardTotals.draft || 0)} />
        <Stat label="Published cards" value={String(cardTotals.published || 0)} />
      </div>

      <div className="lt-card p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <select className="lt-input" value={classification} onChange={(e) => setClassification(e.target.value)}>
          <option value="">All classifications</option>
          <option value="needs_explanation">needs_explanation</option>
          <option value="image_is_enough">image_is_enough</option>
          <option value="review_later">review_later</option>
          <option value="unnecessary">unnecessary (override)</option>
        </select>
        <select className="lt-input" value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option value="">All topics</option>
          {TOPIC_META.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label_en}
            </option>
          ))}
        </select>
        <select className="lt-input" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="">All priorities</option>
          <option value="high">high</option>
          <option value="medium">medium</option>
          <option value="low">low</option>
        </select>
        <select className="lt-input" value={cardStatus} onChange={(e) => setCardStatus(e.target.value)}>
          <option value="">Any card status</option>
          <option value="none">no card</option>
          <option value="draft">draft</option>
          <option value="submitted">submitted</option>
          <option value="approved">approved</option>
          <option value="published">published</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className="lt-btn-ghost px-3 py-2 text-sm" onClick={() => void seed()}>
          Seed draft examples (never publish)
        </button>
        {seedMsg ? (
          <p className="text-xs text-[var(--text-secondary)] break-all">{seedMsg}</p>
        ) : null}
      </div>

      <KeywordCardEditor />

      <div className="lt-card overflow-x-auto">
        <table className="w-full text-sm min-w-[860px]">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
              <th className="px-4 py-3">ID</th>
              <th className="px-3 py-3">Topic</th>
              <th className="px-3 py-3">Recommended</th>
              <th className="px-3 py-3">Effective</th>
              <th className="px-3 py-3">Priority</th>
              <th className="px-3 py-3">Format</th>
              <th className="px-3 py-3">Card</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center">
                  Loading…
                </td>
              </tr>
            ) : (
              rows.slice(0, 100).map((r) => (
                <tr key={r.question_id} className="border-b border-[var(--border)] align-top">
                  <td className="px-4 py-3 font-mono text-xs">{r.question_id}</td>
                  <td className="px-3 py-3">{r.topic}</td>
                  <td className="px-3 py-3">{r.recommended_classification}</td>
                  <td className="px-3 py-3">{r.effective_classification}</td>
                  <td className="px-3 py-3">{r.priority}</td>
                  <td className="px-3 py-3">{r.suggested_format}</td>
                  <td className="px-3 py-3">{r.card_status}</td>
                  <td className="px-3 py-3">
                    <Link
                      className="text-[var(--lingo-red)] text-xs font-semibold"
                      href={`/admin/questions/${encodeURIComponent(r.question_id)}`}
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <p className="px-4 py-2 text-xs text-[var(--text-secondary)]">
          Showing {Math.min(100, rows.length)} of {rows.length} filtered
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="lt-card p-3">
      <p className="text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">{label}</p>
      <p className="text-xl font-bold tabular-nums">{value}</p>
    </div>
  );
}
