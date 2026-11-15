'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Filter = 'all' | 'keywords' | 'explanations';

type NewKeyword = {
  id: string;
  term_en: string;
  translation_ar?: string;
  explanation_en: string;
  explanation_ar?: string;
  image_url?: string | null;
  image_alt?: string | null;
};

type LegacyKeyword = {
  id: string;
  term_key: string;
  definition: string;
  language: string;
  image_url?: string | null;
  image_alt?: string | null;
};

type ExplanationCard = {
  id: string;
  question_id: string;
  explanation: string;
  language: string;
  image_url?: string | null;
  video_url?: string | null;
};

export default function SavedCardsPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [keywords, setKeywords] = useState<NewKeyword[]>([]);
  const [legacyKeywords, setLegacyKeywords] = useState<LegacyKeyword[]>([]);
  const [explanations, setExplanations] = useState<ExplanationCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [unsavingId, setUnsavingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/learning-cards/saved').then(async (res) => ({ res, body: await res.json() })),
      fetch('/api/keyword-cards/saved').then(async (res) => ({ res, body: await res.json() })),
    ])
      .then(([legacy, keyword]) => {
        if (legacy.res.status === 401 || keyword.res.status === 401) {
          setError('Log in to view saved cards.');
          setKeywords([]);
          setLegacyKeywords([]);
          setExplanations([]);
          return;
        }
        if (!legacy.res.ok) throw new Error(legacy.body.error || 'Failed');
        setError(keyword.res.ok ? null : keyword.body.error || null);
        setLegacyKeywords(legacy.body.keywords || []);
        setExplanations(legacy.body.explanations || []);
        setKeywords(keyword.res.ok ? keyword.body.keywords || [] : []);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'Failed'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const showKeywords = filter !== 'explanations';
  const showExplanations = filter !== 'keywords';
  const keywordCount = keywords.length + legacyKeywords.length;
  const empty =
    !loading &&
    !error &&
    ((filter === 'all' && keywordCount === 0 && explanations.length === 0) ||
      (filter === 'keywords' && keywordCount === 0) ||
      (filter === 'explanations' && explanations.length === 0));

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
      <h1 className="text-2xl font-bold">Saved cards</h1>
      <p className="text-sm text-[var(--text-secondary)]">
        Keyword Cards and Explanation Cards you save from Practice. A keyword is saved once, even
        when it is linked to several questions. Mock Test never shows these during the exam.
      </p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Saved card type">
        {(
          [
            ['all', 'All'],
            ['keywords', 'Keywords'],
            ['explanations', 'Explanations'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            className={filter === value ? 'lt-btn-primary px-3 py-1.5 text-sm' : 'lt-btn-ghost px-3 py-1.5 text-sm'}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>
      {error ? (
        <p className="text-sm text-[var(--wrong)]" role="alert">
          {error}
        </p>
      ) : null}
      {loading ? <p className="text-sm">Loading…</p> : null}
      {empty ? (
        <p className="text-sm text-[var(--text-secondary)]">
          No saved cards yet. Save a keyword or an explanation hint from Practice.
        </p>
      ) : null}
      {showKeywords
        ? keywords.map((card) => (
            <article key={card.id} className="lt-card p-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--lingo-red)]">
                Keyword Card
              </p>
              <h2 dir="ltr" lang="en" className="mt-1 text-lg font-bold">
                {card.term_en}
              </h2>
              {card.translation_ar ? (
                <p dir="rtl" lang="ar" className="mt-1 font-semibold">
                  {card.translation_ar}
                </p>
              ) : null}
              <p dir="ltr" lang="en" className="mt-2 text-sm whitespace-pre-wrap">
                {card.explanation_en}
              </p>
              {card.explanation_ar ? (
                <p dir="rtl" lang="ar" className="mt-2 text-sm whitespace-pre-wrap">
                  {card.explanation_ar}
                </p>
              ) : null}
              {card.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={card.image_url}
                  alt={card.image_alt || card.term_en}
                  className="mt-2 h-auto w-full max-h-72 object-contain rounded border border-[var(--border)]"
                />
              ) : null}
              <button
                type="button"
                className="mt-2 text-xs font-semibold"
                aria-label={`Unsave ${card.term_en}`}
                disabled={unsavingId === card.id}
                onClick={() => {
                  setUnsavingId(card.id);
                  void fetch('/api/keyword-cards/saved', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ keyword_id: card.id }),
                  })
                    .then(async (res) => {
                      const body = await res.json().catch(() => ({}));
                      if (!res.ok || body.saved !== false) {
                        setError(body.error || 'Could not unsave this keyword card');
                        return;
                      }
                      setError(null);
                      setKeywords((current) => current.filter((item) => item.id !== card.id));
                    })
                    .catch(() => setError('Could not unsave this keyword card'))
                    .finally(() => setUnsavingId(null));
                }}
              >
                Unsave
              </button>
            </article>
          ))
        : null}
      {showKeywords
        ? legacyKeywords.map((card) => (
            <article key={card.id} className="lt-card p-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--lingo-red)]">
                Keyword Card
              </p>
              <p className="mt-1 text-[11px] uppercase text-[var(--text-secondary)]">
                {card.language.toUpperCase()}
              </p>
              <h2 className="font-bold mt-1">{card.term_key}</h2>
              <p className="text-sm mt-1">{card.definition}</p>
              {card.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={card.image_url}
                  alt={card.image_alt || ''}
                  className="mt-2 h-auto w-full max-h-48 object-contain rounded border border-[var(--border)]"
                />
              ) : null}
              <button
                type="button"
                className="mt-2 text-xs font-semibold"
                onClick={() => {
                  void fetch('/api/learning-cards/saved', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      card_kind: 'keyword',
                      keyword_card_id: card.id,
                    }),
                  }).then(() => {
                    setLegacyKeywords((current) => current.filter((item) => item.id !== card.id));
                  });
                }}
              >
                Unsave
              </button>
            </article>
          ))
        : null}
      {showExplanations
        ? explanations.map((card) => (
            <article key={card.id} className="lt-card p-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--navy)]">
                Explanation Card
              </p>
              <p className="text-[11px] uppercase text-[var(--text-secondary)] mt-1">
                {card.language.toUpperCase()} · {card.question_id}
              </p>
              <p className="text-sm mt-1 whitespace-pre-wrap">{card.explanation}</p>
              {card.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={card.image_url} alt="" className="mt-2 max-h-48 rounded border border-[var(--border)]" />
              ) : null}
              {card.video_url ? (
                <p className="text-xs mt-2 break-all">
                  <a href={card.video_url} className="text-[var(--lingo-red)]">
                    Video
                  </a>
                </p>
              ) : null}
              <div className="mt-2 flex gap-3 items-center">
                <Link className="text-xs text-[var(--lingo-red)] font-semibold" href="/practice">
                  Practice
                </Link>
                <button
                  type="button"
                  className="text-xs font-semibold"
                  onClick={() => {
                    void fetch('/api/learning-cards/saved', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        card_kind: 'explanation',
                        explanation_card_id: card.id,
                      }),
                    }).then(() => {
                      setExplanations((current) => current.filter((item) => item.id !== card.id));
                    });
                  }}
                >
                  Unsave
                </button>
              </div>
            </article>
          ))
        : null}
    </div>
  );
}
