'use client';

import { useEffect, useState } from 'react';

export default function SaveCardButton({
  cardKind,
  keywordCardId,
  explanationCardId,
}: {
  cardKind: 'keyword' | 'explanation';
  keywordCardId?: string;
  explanationCardId?: string;
}) {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/learning-cards/saved')
      .then(async (res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((body) => {
        if (cancelled || !body) return;
        const mine =
          cardKind === 'explanation'
            ? (body.explanations || []).some(
                (card: { id: string }) => card.id === explanationCardId
              )
            : (body.keywords || []).some((card: { id: string }) => card.id === keywordCardId);
        setSaved(mine);
      })
      .catch(() => {
        if (!cancelled) setSaved(false);
      });
    return () => {
      cancelled = true;
    };
  }, [cardKind, explanationCardId, keywordCardId]);

  const toggle = async () => {
    setError(null);
    const res = await fetch('/api/learning-cards/saved', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        card_kind: cardKind,
        keyword_card_id: keywordCardId || null,
        explanation_card_id: explanationCardId || null,
      }),
    });
    const data = await res.json();
    if (res.status === 401) {
      setError('Log in to save cards.');
      return;
    }
    if (!res.ok) {
      setError(data.error || 'Could not save');
      return;
    }
    setSaved(!!data.saved);
  };

  return (
    <div>
      <button type="button" className="lt-btn-ghost px-3 py-1.5 text-xs" onClick={() => void toggle()}>
        {saved ? 'Unsave card' : 'Save card'}
      </button>
      {error ? <p className="text-[11px] text-[var(--wrong)] mt-1">{error}</p> : null}
    </div>
  );
}
