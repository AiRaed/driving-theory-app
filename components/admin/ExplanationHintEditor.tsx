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
  image_url?: string | null;
  image_alt?: string | null;
  video_url?: string | null;
};

type QuestionDetail = {
  id: string;
  question_en: string;
  explanation_en: string | null;
  correct_answer: number;
  answer_1_en: string;
  answer_2_en: string;
  answer_3_en: string;
  answer_4_en: string;
};

type Reusable = { question_id: string; explanation: string; format: string };

const FORMAT_LABEL: Record<string, string> = {
  text: 'Text',
  image: 'Text + Image/Diagram',
  diagram: 'Text + Image/Diagram',
  video: 'Text + Video',
};

type SuggestedHint = {
  english: string;
  presentation_label?: string;
  linked_question_ids?: string[];
  review_status?: string;
  provisional?: boolean;
  review_label?: string | null;
  published?: boolean;
};

function rejectionKey(questionId: string): string {
  return `lt-hint-draft-reject:${questionId}`;
}

export default function ExplanationHintEditor({
  questionId,
  onChanged,
  onOpenQuestion,
}: {
  questionId: string;
  onChanged?: () => void;
  onOpenQuestion?: (questionId: string) => void;
}) {
  const [rec, setRec] = useState<Rec | null>(null);
  const [question, setQuestion] = useState<QuestionDetail | null>(null);
  const [card, setCard] = useState<Card | null>(null);
  const [explanation, setExplanation] = useState('');
  const [format, setFormat] = useState('text');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [override, setOverride] = useState('');
  const [reuseId, setReuseId] = useState('');
  const [reusable, setReusable] = useState<Reusable[]>([]);
  const [suggestion, setSuggestion] = useState<SuggestedHint | null>(null);
  const [draftRejected, setDraftRejected] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [r, c, q, reuse] = await Promise.all([
      fetch(`/api/admin/learning-cards/recommendations/${encodeURIComponent(questionId)}`),
      fetch(`/api/admin/learning-cards/explanations?question_id=${encodeURIComponent(questionId)}`),
      fetch(`/api/admin/questions/${encodeURIComponent(questionId)}`),
      fetch('/api/admin/learning-cards/explanations?reusable=1'),
    ]);
    const recData = await r.json();
    const cardData = await c.json();
    const qData = await q.json();
    const reuseData = await reuse.json();
    const suggested = (recData.suggested_hint || null) as SuggestedHint | null;
    setSuggestion(suggested);
    const rejected =
      suggested?.provisional === true &&
      typeof window !== 'undefined' &&
      window.localStorage.getItem(rejectionKey(questionId)) === '1';
    setDraftRejected(rejected);
    if (r.ok) {
      setRec(recData.recommendation);
      setOverride(recData.recommendation?.admin_override || '');
      setFormat(recData.recommendation?.suggested_format || 'text');
    }
    const enCard = (cardData.cards || []).find((item: Card) => item.language === 'en') || null;
    setCard(enCard);
    if (enCard && String(enCard.explanation || '').trim()) {
      setExplanation(enCard.explanation || '');
      setFormat(enCard.format || recData.recommendation?.suggested_format || 'text');
      setImageUrl(enCard.image_url || '');
      setImageAlt(enCard.image_alt || '');
      setVideoUrl(enCard.video_url || '');
    } else if (suggested?.provisional && typeof window !== 'undefined' && window.localStorage.getItem(rejectionKey(questionId)) === '1') {
      setExplanation('');
      setFormat(recData.recommendation?.suggested_format || 'text');
      setImageUrl(enCard?.image_url || '');
      setImageAlt(enCard?.image_alt || '');
      setVideoUrl(enCard?.video_url || '');
    } else {
      setExplanation(suggested?.english || '');
      setFormat(recData.recommendation?.suggested_format || 'text');
      setImageUrl(enCard?.image_url || '');
      setImageAlt(enCard?.image_alt || '');
      setVideoUrl(enCard?.video_url || '');
    }
    if (q.ok) setQuestion(qData.question);
    setReusable((reuseData.cards || []).filter((item: Reusable) => item.question_id !== questionId));
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]);

  const answers = question
    ? [question.answer_1_en, question.answer_2_en, question.answer_3_en, question.answer_4_en]
    : [];
  const correctIndex = question ? question.correct_answer - 1 : -1;
  const correct = correctIndex >= 0 ? answers[correctIndex] || '' : '';
  const active = card?.status === 'published' && String(card.explanation || '').trim().length > 0;

  const saveHint = async () => {
    setError(null);
    setSaving(true);
    const res = await fetch('/api/admin/learning-cards/explanations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question_id: questionId,
        language: 'en',
        explanation,
        format,
        image_url: imageUrl || null,
        image_alt: imageAlt || null,
        video_url: videoUrl || null,
        notes: 'Not DVSA-approved.',
        activate: true,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error || 'Save failed');
      return;
    }
    setCard(data.card);
    try {
      window.localStorage.removeItem(rejectionKey(questionId));
    } catch {
      /* ignore */
    }
    setDraftRejected(false);
    setMessage(
      data.learner_visible
        ? 'Hint saved and now available in Practice. Not a DVSA explanation.'
        : 'Draft saved. Add English explanation text before it can appear in Practice.'
    );
    onChanged?.();
  };

  const disableHint = async () => {
    setError(null);
    const res = await fetch('/api/admin/learning-cards/explanations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'disable', question_id: questionId, language: 'en' }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Disable failed');
      return;
    }
    setCard(data.card);
    setMessage('Hint disabled. The text is kept, but Practice will hide it until you save again.');
    onChanged?.();
  };

  const removeHint = async () => {
    setError(null);
    const res = await fetch('/api/admin/learning-cards/explanations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'remove', question_id: questionId, language: 'en' }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Remove failed');
      return;
    }
    setCard(data.card);
    setMessage('Hint removed from Practice. Official DVSA text is unchanged.');
    onChanged?.();
    void load();
  };

  const saveOverride = async () => {
    const res = await fetch(
      `/api/admin/learning-cards/recommendations/${encodeURIComponent(questionId)}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_override: override || null }),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Override failed');
      return;
    }
    setRec(data.recommendation);
    setMessage('Recommendation override saved. This does not change official DVSA content.');
    onChanged?.();
  };

  const reuse = async () => {
    if (!reuseId) return;
    const res = await fetch('/api/admin/learning-cards/explanations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reuse', from_question_id: reuseId, question_id: questionId }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Reuse failed');
      return;
    }
    setMessage('Reused an existing educational hint. Official DVSA text is unchanged.');
    onChanged?.();
    void load();
  };

  const rejectDraft = () => {
    try {
      window.localStorage.setItem(rejectionKey(questionId), '1');
    } catch {
      /* ignore */
    }
    setDraftRejected(true);
    setExplanation('');
    setError(null);
    setMessage('Provisional draft rejected. Nothing was saved, so Practice is unchanged.');
  };

  const restoreDraft = () => {
    try {
      window.localStorage.removeItem(rejectionKey(questionId));
    } catch {
      /* ignore */
    }
    setDraftRejected(false);
    setExplanation(suggestion?.english || '');
    setError(null);
    setMessage('Provisional draft restored in the editor. Practice stays unchanged until you save.');
  };

  const uploadMedia = async (file: File, kind: 'image' | 'video') => {
    const form = new FormData();
    form.set('question_id', questionId);
    form.set('kind', kind);
    form.set('file', file);
    form.set('image_alt', imageAlt || 'Explanation hint image');
    const res = await fetch('/api/admin/learning-cards/explanations/media', {
      method: 'POST',
      body: form,
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Image upload failed');
      return;
    }
    if (kind === 'video') setVideoUrl(data.video_url || '');
    else setImageUrl(data.image_url || '');
    setCard(data.card);
    setMessage(
      kind === 'video'
        ? 'Hint video attached. The written explanation is still required.'
        : 'Hint image attached. Official question images are unchanged.'
    );
  };

  if (!rec && !question) {
    return (
      <div className="lt-card p-5 text-sm text-[var(--text-secondary)]">
        Loading explanation hint…
      </div>
    );
  }

  return (
    <div className="lt-card p-5 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold">Explanation hint</h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Extra teaching for Practice only. Official DVSA question, answers and explanation stay
            unchanged. Mock Test never shows this.
          </p>
        </div>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded ${
            active ? 'bg-green-100 text-green-800' : 'bg-[var(--surface-secondary)] text-[var(--text-secondary)]'
          }`}
        >
          {active ? 'Active in Practice' : 'Not shown to learners'}
        </span>
      </div>

      <dl className="grid grid-cols-1 gap-2 text-sm">
        <div>
          <dt className="text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
            Question ID
          </dt>
          <dd className="font-mono">{questionId}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
            Official question
          </dt>
          <dd>{question?.question_en || '—'}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
            Correct answer
          </dt>
          <dd>{correct || '—'}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
            Official explanation
          </dt>
          <dd className="text-[var(--text-secondary)]">{question?.explanation_en || '—'}</dd>
        </div>
      </dl>

      {rec ? (
        <div className="rounded-[var(--radius-sm)] border border-[var(--border)] p-3 space-y-2 text-sm">
          <p>
            <span className="font-semibold">Recommendation:</span>{' '}
            {rec.recommended_classification.replace(/_/g, ' ')} · {rec.priority} priority
          </p>
          <p>
            <span className="font-semibold">Suggested Hint format:</span>{' '}
            {suggestion?.presentation_label || FORMAT_LABEL[rec.suggested_format] || rec.suggested_format}
            {rec.admin_override ? ` · override ${rec.admin_override.replace(/_/g, ' ')}` : ''}
          </p>
          <p className="text-[var(--text-secondary)]">{rec.rationale}</p>
          <p className="text-xs text-[var(--text-secondary)]">
            Do not create a hint just because a recommendation exists. Skip questions whose official
            image or sign already explains the point.
          </p>
          <label className="block text-sm">
            Manual override
            <select
              className="lt-input mt-1"
              value={override}
              onChange={(e) => setOverride(e.target.value)}
            >
              <option value="">Use recommendation</option>
              <option value="needs_explanation">Needs explanation</option>
              <option value="image_is_enough">Image is enough</option>
              <option value="review_later">Review later</option>
              <option value="unnecessary">Unnecessary</option>
            </select>
          </label>
          <button type="button" className="lt-btn-ghost px-3 py-2 text-sm" onClick={() => void saveOverride()}>
            Save override
          </button>
        </div>
      ) : null}

      {suggestion?.provisional && !active ? (
        <div className="rounded-[var(--radius-sm)] border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950">
          <p className="font-semibold">Provisional — Needs Human Review</p>
          <p className="mt-1">
            Suggested draft for a review-later question. It is not active. Save hint accepts it and
            makes it available in Practice. Reject draft clears the text and does not publish it.
            The question stays classified as review later.
          </p>
        </div>
      ) : null}

      {suggestion && !active ? (
        <p className="text-xs text-[var(--text-secondary)] rounded-[var(--radius-sm)] border border-[var(--border)] p-3">
          Suggested draft. It is not shown to learners until you save. Edit it first if the wording
          needs to match this question more closely.
        </p>
      ) : null}

      {(suggestion?.linked_question_ids || []).length > 0 ? (
        <div className="text-sm">
          <p className="text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
            Linked question IDs
          </p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {suggestion!.linked_question_ids!.map((id) => (
              <button
                key={id}
                type="button"
                className="font-mono text-xs px-2 py-1 rounded border border-[var(--border)]"
                onClick={() => onOpenQuestion?.(id)}
              >
                {id}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <label className="block text-sm">
        English hint text
        <textarea
          className="lt-input mt-1 min-h-[120px]"
          placeholder="Clear teaching in English. Required before the hint appears in Practice."
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
        />
      </label>

      <label className="block text-sm">
        Media type
        <select className="lt-input mt-1" value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="text">Text</option>
          <option value="image">Image</option>
          <option value="diagram">Diagram</option>
          <option value="video">Video</option>
        </select>
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="text-sm sm:col-span-2">
          Optional image URL
          <input
            className="lt-input mt-1"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://…"
          />
        </label>
        <label className="text-sm">
          Image alt text
          <input className="lt-input mt-1" value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} />
        </label>
        <label className="text-sm">
          Upload image
          <input
            className="lt-input mt-1"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void uploadMedia(file, 'image');
            }}
          />
        </label>
        <label className="text-sm sm:col-span-2">
          Optional video URL
          <input
            className="lt-input mt-1"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://…"
          />
        </label>
        <label className="text-sm">
          Upload video
          <input
            className="lt-input mt-1"
            type="file"
            accept="video/mp4,video/webm"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void uploadMedia(file, 'video');
            }}
          />
        </label>
      </div>

      {reusable.length > 0 ? (
        <div className="flex flex-wrap items-end gap-2">
          <label className="text-sm flex-1 min-w-[220px]">
            Reuse an existing hint
            <select className="lt-input mt-1" value={reuseId} onChange={(e) => setReuseId(e.target.value)}>
              <option value="">Select a published hint…</option>
              {reusable.slice(0, 80).map((item) => (
                <option key={item.question_id} value={item.question_id}>
                  {item.question_id} · {item.format}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="lt-btn-ghost px-3 py-2 text-sm" onClick={() => void reuse()}>
            Reuse
          </button>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="lt-btn-primary px-3 py-2 text-sm"
          disabled={saving}
          onClick={() => void saveHint()}
        >
          Save hint
        </button>
        {suggestion?.provisional && !active ? (
          <button type="button" className="lt-btn-ghost px-3 py-2 text-sm" onClick={rejectDraft}>
            Reject draft
          </button>
        ) : null}
        {draftRejected && suggestion?.provisional ? (
          <button type="button" className="lt-btn-ghost px-3 py-2 text-sm" onClick={restoreDraft}>
            Show provisional draft
          </button>
        ) : null}
        {card && active ? (
          <button type="button" className="lt-btn-ghost px-3 py-2 text-sm" onClick={() => void disableHint()}>
            Disable hint
          </button>
        ) : null}
        {card ? (
          <button type="button" className="lt-btn-ghost px-3 py-2 text-sm" onClick={() => void removeHint()}>
            Remove hint
          </button>
        ) : null}
      </div>

      {message && <p className="text-xs text-[var(--correct)]">{message}</p>}
      {error && <p className="text-xs text-[var(--wrong)]">{error}</p>}
    </div>
  );
}
