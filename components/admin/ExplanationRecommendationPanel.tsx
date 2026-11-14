'use client';

import { useEffect, useState } from 'react';

type Rec = {
  question_id: string;
  recommended_classification: string;
  effective_classification: string;
  rationale: string;
  priority: string;
  suggested_format: string;
  admin_override: string | null;
  override_note: string;
  card_unnecessary: boolean;
  topic: string;
};

type Card = {
  id: string;
  language: string;
  explanation: string;
  format: string;
  status: string;
  notes?: string | null;
};

export default function ExplanationRecommendationPanel({
  questionId,
}: {
  questionId: string;
}) {
  const [rec, setRec] = useState<Rec | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [override, setOverride] = useState('');
  const [note, setNote] = useState('');
  const [unnecessary, setUnnecessary] = useState(false);
  const [lang, setLang] = useState('en');
  const [explanation, setExplanation] = useState('');
  const [format, setFormat] = useState('text');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const [r, c] = await Promise.all([
      fetch(`/api/admin/learning-cards/recommendations/${encodeURIComponent(questionId)}`),
      fetch(`/api/admin/learning-cards/explanations?question_id=${encodeURIComponent(questionId)}`),
    ]);
    const recData = await r.json();
    const cardData = await c.json();
    if (r.ok) {
      setRec(recData.recommendation);
      setOverride(recData.recommendation?.admin_override || '');
      setNote(recData.recommendation?.override_note || '');
      setUnnecessary(!!recData.recommendation?.card_unnecessary);
      setFormat(recData.recommendation?.suggested_format || 'text');
    }
    if (c.ok) setCards(cardData.cards || []);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]);

  const saveOverride = async () => {
    setError(null);
    const res = await fetch(
      `/api/admin/learning-cards/recommendations/${encodeURIComponent(questionId)}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_override: override || null,
          override_note: note,
          card_unnecessary: unnecessary,
        }),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Override failed');
      return;
    }
    setRec(data.recommendation);
    setMessage('Recommendation override saved. Not published. Not DVSA-approved.');
  };

  const createCard = async () => {
    setError(null);
    const res = await fetch('/api/admin/learning-cards/explanations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question_id: questionId,
        language: lang,
        explanation,
        format,
        notes: 'Not DVSA-approved.',
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Create failed');
      return;
    }
    setExplanation('');
    setMessage(`Draft ${lang.toUpperCase()} explanation card created. Not published.`);
    void load();
  };

  const setStatus = async (id: string, status: string) => {
    const res = await fetch('/api/admin/learning-cards/explanations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'status', id, status }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Status change failed');
      return;
    }
    void load();
  };

  if (!rec) {
    return (
      <div className="lt-card p-5 text-sm text-[var(--text-secondary)]">
        No explanation recommendation loaded for this ID.
      </div>
    );
  }

  return (
    <div className="lt-card p-5 space-y-4">
      <div>
        <h2 className="text-lg font-bold text-[var(--text-primary)]">
          Explanation recommendation
        </h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Pedagogical suggestion only — not DVSA-approved. You may override any
          recommendation and create a card for any question, including{' '}
          <code>image_is_enough</code>.
        </p>
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        <div>
          <dt className="text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
            Recommended
          </dt>
          <dd className="font-semibold">{rec.recommended_classification}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
            Effective
          </dt>
          <dd className="font-semibold">{rec.effective_classification}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
            Priority / format
          </dt>
          <dd>
            {rec.priority} · {rec.suggested_format}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
            Rationale
          </dt>
          <dd>{rec.rationale}</dd>
        </div>
      </dl>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="text-sm">
          Admin override
          <select
            className="lt-input mt-1"
            value={override}
            onChange={(e) => setOverride(e.target.value)}
          >
            <option value="">Use recommendation</option>
            <option value="needs_explanation">needs_explanation</option>
            <option value="image_is_enough">image_is_enough</option>
            <option value="review_later">review_later</option>
            <option value="unnecessary">unnecessary (no card needed)</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm mt-6">
          <input
            type="checkbox"
            checked={unnecessary}
            onChange={(e) => setUnnecessary(e.target.checked)}
          />
          Mark card unnecessary
        </label>
        <label className="text-sm sm:col-span-2">
          Override note
          <input className="lt-input mt-1" value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
      </div>
      <button type="button" className="lt-btn-ghost px-3 py-2 text-sm" onClick={() => void saveOverride()}>
        Save override
      </button>

      <div className="border-t border-[var(--border)] pt-4 space-y-3">
        <h3 className="font-bold text-sm">Create / edit explanation card</h3>
        <p className="text-xs text-[var(--text-secondary)]">
          Workflow: draft → submitted → approved → published. Seed/example cards stay draft.
          Official DVSA explanation on the question row is unchanged.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select className="lt-input" value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="en">English</option>
            <option value="ar">Arabic</option>
          </select>
          <select className="lt-input" value={format} onChange={(e) => setFormat(e.target.value)}>
            <option value="text">text</option>
            <option value="diagram">diagram</option>
            <option value="image">image</option>
            <option value="video">video</option>
          </select>
        </div>
        <textarea
          className="lt-input min-h-[80px]"
          placeholder="Pedagogical explanation (not official DVSA text)"
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
        />
        <button type="button" className="lt-btn-primary px-3 py-2 text-sm" onClick={() => void createCard()}>
          Save draft card
        </button>
      </div>

      {cards.length > 0 && (
        <ul className="space-y-2 text-sm">
          {cards.map((c) => (
            <li key={c.id} className="border border-[var(--border)] rounded-[var(--radius-sm)] p-3">
              <p className="font-semibold">
                {c.language.toUpperCase()} · {c.status} · {c.format}
              </p>
              <p className="text-[var(--text-secondary)] mt-1 line-clamp-3">{c.explanation}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {['submitted', 'approved', 'published', 'draft', 'archived'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="lt-btn-ghost px-2 py-1 text-xs"
                    onClick={() => void setStatus(c.id, s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}

      {message && <p className="text-xs text-[var(--correct)]">{message}</p>}
      {error && <p className="text-xs text-[var(--wrong)]">{error}</p>}
    </div>
  );
}
