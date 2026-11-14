'use client';

import { useEffect, useState } from 'react';

type Card = {
  id: string;
  term_key: string;
  language: string;
  definition: string;
  translation: string;
  status: string;
};

type Term = { term_key: string; term_en: string };

export default function KeywordCardEditor({ questionId }: { questionId?: string }) {
  const [cards, setCards] = useState<Card[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [term, setTerm] = useState('');
  const [language, setLanguage] = useState('en');
  const [definition, setDefinition] = useState('');
  const [translation, setTranslation] = useState('');
  const [linkTerm, setLinkTerm] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch('/api/admin/learning-cards/keywords');
    const data = await res.json();
    if (res.ok) {
      setCards(data.cards || []);
      setTerms(data.terms || []);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async () => {
    setError(null);
    const res = await fetch('/api/admin/learning-cards/keywords', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        term_en: term,
        language,
        definition,
        translation,
        question_id: questionId,
        notes: 'Reusable keyword card. Not DVSA-approved.',
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Save failed');
      return;
    }
    setMessage('Draft keyword card saved. Not published. Reusable across questions.');
    setTerm('');
    setDefinition('');
    setTranslation('');
    void load();
  };

  const linkExisting = async () => {
    if (!questionId || !linkTerm) return;
    setError(null);
    const res = await fetch('/api/admin/learning-cards/keywords', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'link',
        term_key: linkTerm,
        question_id: questionId,
        source_field: 'stem',
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Link failed');
      return;
    }
    setMessage(`Linked “${linkTerm}” to this question. Reusable across questions.`);
  };

  const setStatus = async (id: string, status: string) => {
    const res = await fetch('/api/admin/learning-cards/keywords', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'status', id, status }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Status failed');
      return;
    }
    void load();
  };

  return (
    <div className="lt-card p-5 space-y-4">
      <div>
        <h2 className="text-lg font-bold">Keyword cards</h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Reusable across questions, including simple Road Signs items. Separate from
          Explanation Cards. English + Arabic first.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          className="lt-input"
          placeholder="English term (e.g. dual carriageway)"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
        <select className="lt-input" value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="ar">Arabic</option>
        </select>
        <input
          className="lt-input"
          placeholder="Term in this language"
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
        />
        <textarea
          className="lt-input min-h-[64px] sm:col-span-2"
          placeholder="Definition"
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
        />
      </div>
      <button type="button" className="lt-btn-primary px-3 py-2 text-sm" onClick={() => void save()}>
        Save draft keyword
      </button>
      {questionId ? (
        <div className="flex flex-wrap gap-2 items-center">
          <select
            className="lt-input"
            value={linkTerm}
            onChange={(e) => setLinkTerm(e.target.value)}
          >
            <option value="">Link existing term to this question</option>
            {terms.map((t) => (
              <option key={t.term_key} value={t.term_key}>
                {t.term_en || t.term_key}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="lt-btn-ghost px-3 py-2 text-sm"
            onClick={() => void linkExisting()}
          >
            Link term
          </button>
        </div>
      ) : null}
      <ul className="space-y-2 text-sm">
        {cards.map((c) => (
          <li key={c.id} className="border border-[var(--border)] rounded-[var(--radius-sm)] p-3">
            <p className="font-semibold">
              {c.term_key} · {c.language.toUpperCase()} · {c.status}
            </p>
            <p className="text-[var(--text-secondary)]">{c.definition}</p>
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
      {message && <p className="text-xs text-[var(--correct)]">{message}</p>}
      {error && <p className="text-xs text-[var(--wrong)]">{error}</p>}
    </div>
  );
}
