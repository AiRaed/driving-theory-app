'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SavedCardsPage() {
  const [data, setData] = useState<{
    keywords: Array<{ id: string; term_key: string; definition: string; language: string }>;
    explanations: Array<{ id: string; question_id: string; explanation: string; language: string }>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/learning-cards/saved')
      .then(async (r) => {
        const body = await r.json();
        if (r.status === 401) {
          setError('Log in to view saved cards.');
          return;
        }
        if (!r.ok) throw new Error(body.error || 'Failed');
        setData(body);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed'));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
      <h1 className="text-2xl font-bold">Saved cards</h1>
      <p className="text-sm text-[var(--text-secondary)]">
        Keyword and explanation cards you save from Practice. Mock Test never shows these during
        the exam. Cards are not DVSA-approved.
      </p>
      {error ? <p className="text-sm text-[var(--wrong)]">{error}</p> : null}
      {!data && !error ? <p className="text-sm">Loading…</p> : null}
      {data && data.keywords.length === 0 && data.explanations.length === 0 ? (
        <p className="text-sm text-[var(--text-secondary)]">
          No saved cards yet. After you answer in Practice, you can save published cards.
        </p>
      ) : null}
      {data?.keywords.map((k) => (
        <div key={k.id} className="lt-card p-4">
          <p className="text-[11px] uppercase text-[var(--text-secondary)]">
            Keyword · {k.language.toUpperCase()}
          </p>
          <p className="font-bold mt-1">{k.term_key}</p>
          <p className="text-sm mt-1">{k.definition}</p>
        </div>
      ))}
      {data?.explanations.map((e) => (
        <div key={e.id} className="lt-card p-4">
          <p className="text-[11px] uppercase text-[var(--text-secondary)]">
            Explanation · {e.language.toUpperCase()} · {e.question_id}
          </p>
          <p className="text-sm mt-1">{e.explanation}</p>
          <Link
            className="text-xs text-[var(--lingo-red)] font-semibold"
            href="/practice"
          >
            Practice
          </Link>
        </div>
      ))}
    </div>
  );
}
