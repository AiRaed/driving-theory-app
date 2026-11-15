'use client';

import { useCallback, useEffect, useState } from 'react';
import { TOPIC_META } from '@/lib/questions/types';
import KeywordCardEditor from '@/components/admin/KeywordCardEditor';
import ExplanationHintEditor from '@/components/admin/ExplanationHintEditor';

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
  draft_review?: string | null;
  draft_label?: string | null;
};

export default function AdminLearningCardsPage() {
  const [rows, setRows] = useState<Rec[]>([]);
  const [totals, setTotals] = useState<Record<string, unknown>>({});
  const [classification, setClassification] = useState('needs_explanation');
  const [topic, setTopic] = useState('');
  const [priority, setPriority] = useState('');
  const [cardStatus, setCardStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showKeywords, setShowKeywords] = useState(false);
  const [query, setQuery] = useState('');
  const [media, setMedia] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 50;

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
    setPage(0);
  }, [classification, topic, priority, cardStatus, query, media]);

  useEffect(() => {
    void load();
  }, [load]);

  const searched = rows.filter((row) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return row.question_id.toLowerCase().includes(q);
  });
  const mediaCounts = { text: 0, image: 0, diagram: 0, video: 0 };
  for (const row of searched) {
    if (row.suggested_format === 'text') mediaCounts.text += 1;
    else if (row.suggested_format === 'image') mediaCounts.image += 1;
    else if (row.suggested_format === 'diagram') mediaCounts.diagram += 1;
    else if (row.suggested_format === 'video') mediaCounts.video += 1;
  }
  const filtered = media
    ? searched.filter((row) => row.suggested_format === media)
    : searched;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const visible = filtered.slice(safePage * pageSize, safePage * pageSize + pageSize);

  const recTotals = (totals.recommended || {}) as Record<string, number>;
  const priTotals = (totals.priority || {}) as Record<string, number>;
  const cardTotals = (totals.card_status || {}) as Record<string, number>;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Explanation hints</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-3xl">
          Use the 758 DVSA recommendations to find questions that need extra teaching. Do not create a hint for every question. Official images and signs are often enough. Saving a complete English hint makes it available in Practice immediately. Empty drafts never appear to learners. Mock Test stays hint-free.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Questions reviewed" value={String(totals.unique_ids || 0)} />
        <Stat label="Needs explanation" value={String(recTotals.needs_explanation || 0)} />
        <Stat label="Image is enough" value={String(recTotals.image_is_enough || 0)} />
        <Stat label="High priority" value={String(priTotals.high || 0)} />
        <Stat label="No hint yet" value={String(cardTotals.none || 0)} />
        <Stat label="Drafts" value={String(cardTotals.draft || 0)} />
        <Stat label="Active in Practice" value={String(cardTotals.published || 0)} />
        <Stat label="Review later" value={String(recTotals.review_later || 0)} />
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
          <option value="archived">removed</option>
        </select>
        <label className="block text-xs font-semibold text-[var(--text-secondary)] sm:col-span-2 lg:col-span-2">
          Suggested Media
          <select
            className="lt-input mt-1 font-normal"
            aria-label="Suggested Media"
            value={media}
            onChange={(e) => setMedia(e.target.value)}
          >
            <option value="">All formats ({searched.length})</option>
            <option value="text">Text only ({mediaCounts.text})</option>
            <option value="image">Image ({mediaCounts.image})</option>
            <option value="diagram">Diagram ({mediaCounts.diagram})</option>
            <option value="video">Video ({mediaCounts.video})</option>
          </select>
          <span className="mt-1 block font-normal">
            Recommendation only. This is not an uploaded image or video.
          </span>
        </label>
        <input
          className="lt-input sm:col-span-2 lg:col-span-4"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by question ID"
          aria-label="Search by question ID"
        />
      </div>

      {selectedId ? (
        <ExplanationHintEditor
          questionId={selectedId}
          onOpenQuestion={(id) => {
            setSelectedId(id);
            setQuery(id);
          }}
          onChanged={() => {
            void load();
          }}
        />
      ) : (
        <p className="text-sm text-[var(--text-secondary)]">
          Select a question below to write, edit or remove its Practice hint.
        </p>
      )}

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
            ) : visible.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center">
                  No questions match these filters.
                </td>
              </tr>
            ) : (
              visible.map((r) => (
                <tr
                  key={r.question_id}
                  className={`border-b border-[var(--border)] align-top ${
                    selectedId === r.question_id ? 'bg-[var(--surface-secondary)]' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-xs">
                    {r.question_id}
                    {r.draft_review === 'provisional' ? (
                      <span className="mt-1 block max-w-[11rem] rounded bg-amber-100 px-1.5 py-0.5 font-sans text-[10px] font-semibold normal-case tracking-normal text-amber-950">
                        Provisional — Needs Human Review
                      </span>
                    ) : null}
                  </td>
                  <td className="px-3 py-3">{r.topic}</td>
                  <td className="px-3 py-3">{r.recommended_classification}</td>
                  <td className="px-3 py-3">{r.effective_classification}</td>
                  <td className="px-3 py-3">{r.priority}</td>
                  <td className="px-3 py-3">{r.suggested_format}</td>
                  <td className="px-3 py-3">
                    {r.card_status === 'published' ? 'active' : r.card_status}
                  </td>
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      className="text-[var(--lingo-red)] text-xs font-semibold"
                      onClick={() => setSelectedId(r.question_id)}
                    >
                      {r.card_status === 'none' ? 'Add hint' : 'Edit'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-secondary)]">
          <p>
            Showing {filtered.length === 0 ? 0 : safePage * pageSize + 1}–
            {Math.min(filtered.length, safePage * pageSize + visible.length)} of {filtered.length}{' '}
            matching. {String(totals.unique_ids || 0)} questions in total. Unreviewed drafts stay
            hidden until you save a hint.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="lt-btn-ghost px-3 py-1.5"
              disabled={safePage <= 0}
              onClick={() => setPage((current) => Math.max(0, current - 1))}
            >
              Previous
            </button>
            <span className="self-center">
              Page {safePage + 1} of {pageCount}
            </span>
            <button
              type="button"
              className="lt-btn-ghost px-3 py-1.5"
              disabled={safePage >= pageCount - 1}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div>
        <button
          type="button"
          className="text-sm text-[var(--text-secondary)] underline"
          onClick={() => setShowKeywords((v) => !v)}
        >
          {showKeywords ? 'Hide keyword cards' : 'Keyword cards (separate)'}
        </button>
        {showKeywords ? (
          <div className="mt-3">
            <KeywordCardEditor />
          </div>
        ) : null}
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
