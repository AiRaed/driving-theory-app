'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { PRODUCTION_LANGUAGES } from '@/lib/content-production/types';

type Task = {
  id: string;
  title: string;
  topic: string;
  format: string;
  suggested_format: string;
  priority: string;
  classification: string;
  status: string;
  media_status: string;
  coverage: number;
  question_ids: string[];
  rationale: string;
  explanation_en_draft: string;
  english_revision: number;
  notes: string;
};

type Question = {
  question_id: string;
  question_en: string;
  explanation_en: string;
  correct_answer: number;
  answers_en: string[];
  official_locked: boolean;
};

type Translation = {
  id: string;
  language: string;
  body: string;
  review_status: string;
  stale: boolean;
  english_revision: number;
};

type Asset = {
  id: string;
  kind: string;
  title: string;
  language: string | null;
  status: string;
  shared_visual: boolean;
};

export default function ContentProductionTaskPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [task, setTask] = useState<Task | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [library, setLibrary] = useState<Asset[]>([]);
  const [draft, setDraft] = useState('');
  const [notes, setNotes] = useState('');
  const [linkId, setLinkId] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [lang, setLang] = useState('ar');
  const [langBody, setLangBody] = useState('');
  const [langReview, setLangReview] = useState('not_started');

  const load = useCallback(async () => {
    const [res, mediaRes] = await Promise.all([
      fetch(`/api/admin/content-production/tasks/${id}`),
      fetch('/api/admin/content-production/media'),
    ]);
    const data = await res.json();
    const media = await mediaRes.json();
    if (data.task) {
      setTask(data.task);
      setDraft(data.task.explanation_en_draft || '');
      setNotes(data.task.notes || '');
    }
    setQuestions(data.questions || []);
    setTranslations(data.translations || []);
    setAssets(data.assets || []);
    setLibrary(media.assets || []);
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const patch = async (body: Record<string, unknown>) => {
    const res = await fetch(`/api/admin/content-production/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || 'Update failed');
      return;
    }
    setTask(data.task);
    setMessage('Saved. Cards were not published.');
    void load();
  };

  const generateDraft = async () => {
    const res = await fetch(`/api/admin/content-production/tasks/${id}/draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question_id: task?.question_ids[0],
        apply: false,
        question: questions[0],
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || 'Draft failed');
      return;
    }
    setDraft(data.draft);
    setMessage('Grounded draft ready. Review it, then save. Not published.');
  };

  const saveTranslation = async () => {
    const res = await fetch(`/api/admin/content-production/tasks/${id}/translations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: lang, body: langBody, review_status: langReview }),
    });
    const data = await res.json();
    setMessage(res.ok ? `Saved ${lang} translation (independent review).` : data.error);
    void load();
  };

  const attach = async (assetId: string, kind: string) => {
    await fetch('/api/admin/content-production/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        asset_id: assetId,
        task_id: id,
        role: kind === 'voiceover' ? 'voiceover' : 'visual',
      }),
    });
    void load();
  };

  if (!task) {
    return <p className="text-sm text-[var(--text-secondary)]">Loading task…</p>;
  }

  return (
    <div className="space-y-5">
      <div>
        <Link href="/admin/content-production" className="text-xs font-medium text-[var(--lingo-red)]">
          ← Production queue
        </Link>
        <h1 className="text-2xl font-bold mt-2">{task.title}</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          {task.topic} · {task.priority} · covers {task.coverage} questions. Official DVSA text is
          locked. Media status: {task.media_status}. Production “published” does not publish Learning
          Cards.
        </p>
      </div>

      {message ? (
        <p className="text-sm rounded-[var(--radius-md)] border border-[var(--border)] px-3 py-2">{message}</p>
      ) : null}

      <div className="grid md:grid-cols-3 gap-3">
        <label className="text-sm">
          Production status
          <select
            className="lt-input mt-1"
            value={task.status}
            onChange={(e) => void patch({ status: e.target.value })}
          >
            {['not_started', 'in_progress', 'ready_for_review', 'approved', 'published', 'skipped'].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Format (image may upgrade to video)
          <select
            className="lt-input mt-1"
            value={task.format}
            onChange={(e) => void patch({ format: e.target.value })}
          >
            <option value="text">text</option>
            <option value="diagram">diagram</option>
            <option value="image">image</option>
            <option value="video">video</option>
          </select>
        </label>
        <label className="text-sm">
          Media status (independent)
          <select
            className="lt-input mt-1"
            value={task.media_status}
            onChange={(e) => void patch({ media_status: e.target.value })}
          >
            {['not_started', 'in_progress', 'ready_for_review', 'approved', 'published', 'skipped'].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="lt-card p-4 space-y-2">
        <h2 className="text-sm font-bold">Linked DVSA IDs ({task.coverage})</h2>
        <p className="font-mono text-xs break-all">{task.question_ids.join(', ') || 'None'}</p>
        <div className="flex gap-2">
          <input
            className="lt-input"
            placeholder="Link question ID"
            value={linkId}
            onChange={(e) => setLinkId(e.target.value)}
          />
          <button
            type="button"
            className="lt-btn-secondary px-3 py-2 text-sm"
            onClick={() => {
              void patch({ link_question_ids: [linkId.trim()] });
              setLinkId('');
            }}
          >
            Link
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {task.question_ids.map((qid) => (
            <button
              key={qid}
              type="button"
              className="text-xs border border-[var(--border)] rounded px-2 py-1"
              onClick={() => void patch({ unlink_question_ids: [qid] })}
            >
              Unlink {qid}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {(questions.length ? questions : task.question_ids.map((qid) => ({
          question_id: qid,
          question_en: '',
          explanation_en: '',
          correct_answer: 1,
          answers_en: ['', '', '', ''],
          official_locked: true,
        }))).map((q) => (
          <div key={q.question_id} className="lt-card p-4 space-y-2">
            <div className="flex justify-between gap-2">
              <h3 className="font-mono text-sm font-bold">{q.question_id}</h3>
              <span className="text-[11px] uppercase text-[var(--text-secondary)]">Official locked</span>
            </div>
            <p className="text-sm">{q.question_en || 'Official stem loads from Supabase questions (read-only).'}</p>
            {q.answers_en?.[q.correct_answer - 1] ? (
              <p className="text-sm">
                <strong>Correct answer:</strong> {q.answers_en[q.correct_answer - 1]}
              </p>
            ) : null}
            <p className="text-sm text-[var(--text-secondary)]">
              <strong>Official explanation:</strong> {q.explanation_en || '—'}
            </p>
          </div>
        ))}
      </div>

      <div className="lt-card p-4 space-y-3">
        <div className="flex flex-wrap justify-between gap-2">
          <h2 className="text-sm font-bold">English explanation draft</h2>
          <button type="button" className="lt-btn-ghost px-3 py-1.5 text-xs" onClick={() => void generateDraft()}>
            Generate grounded draft (this question only)
          </button>
        </div>
        <p className="text-xs text-[var(--text-secondary)]">
          Optional helper restates the official explanation. It does not invent road rules and does not
          publish. Revision {task.english_revision}.
        </p>
        <textarea
          className="lt-input min-h-[160px]"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <textarea
          className="lt-input min-h-[80px]"
          placeholder="Producer notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button
          type="button"
          className="lt-btn-primary px-3 py-2 text-sm"
          onClick={() => void patch({ explanation_en_draft: draft, notes })}
        >
          Save English draft
        </button>
      </div>

      <div className="lt-card p-4 space-y-3">
        <h2 className="text-sm font-bold">Translations</h2>
        <p className="text-xs text-[var(--text-secondary)]">
          Shared visual assets stay attached. Each language has its own text and voiceover. Stale means
          English changed after this translation.
        </p>
        <div className="grid sm:grid-cols-3 gap-2">
          <select className="lt-input" value={lang} onChange={(e) => setLang(e.target.value)}>
            {PRODUCTION_LANGUAGES.filter((code) => code !== 'en').map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
          <select className="lt-input" value={langReview} onChange={(e) => setLangReview(e.target.value)}>
            {['not_started', 'in_progress', 'ready_for_review', 'approved'].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <textarea
            className="lt-input sm:col-span-3 min-h-[80px]"
            placeholder="Translation text"
            value={langBody}
            onChange={(e) => setLangBody(e.target.value)}
          />
        </div>
        <button type="button" className="lt-btn-secondary px-3 py-2 text-sm" onClick={() => void saveTranslation()}>
          Save translation
        </button>
        <ul className="text-sm divide-y divide-[var(--border)]">
          {translations.map((row) => (
            <li key={row.id} className="py-2 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <strong>{row.language}</strong>
                {row.stale ? <span className="text-[var(--warning)]">stale</span> : null}
                <select
                  className="lt-input w-auto py-1 text-xs"
                  value={row.review_status}
                  onChange={(e) => {
                    void fetch(`/api/admin/content-production/tasks/${id}/translations`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ language: row.language, review_status: e.target.value }),
                    }).then(() => void load());
                  }}
                >
                  {['not_started', 'in_progress', 'ready_for_review', 'approved'].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-[var(--text-secondary)] whitespace-pre-wrap">{row.body}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="lt-card p-4 space-y-3">
        <h2 className="text-sm font-bold">Attached media</h2>
        <ul className="text-sm">
          {assets.map((asset) => (
            <li key={asset.id}>
              {asset.title} · {asset.kind}
              {asset.language ? `/${asset.language}` : ' · shared visual'} · {asset.status}
            </li>
          ))}
        </ul>
        <p className="text-xs text-[var(--text-secondary)]">Attach from library</p>
        <div className="flex flex-wrap gap-2">
          {library.map((asset) => (
            <button
              key={asset.id}
              type="button"
              className="text-xs border border-[var(--border)] rounded px-2 py-1"
              onClick={() => void attach(asset.id, asset.kind)}
            >
              Attach {asset.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
