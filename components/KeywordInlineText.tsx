'use client';

import { useMemo, useState } from 'react';
import SaveCardButton from '@/components/SaveCardButton';

export type InlineKeyword = {
  id: string;
  term_key: string;
  term_en?: string;
  translation?: string;
  definition: string;
};

/**
 * Older learning-card highlighter. Practice question text uses PracticeKeywordText
 * and the Keyword Cards popup. Never import from Mock Test.
 */
export default function KeywordInlineText({
  text,
  keywords,
}: {
  text: string;
  keywords: InlineKeyword[];
}) {
  const [open, setOpen] = useState<InlineKeyword | null>(null);
  const parts = useMemo(() => splitByTerms(text, keywords), [text, keywords]);

  if (!keywords.length) {
    return <>{text}</>;
  }

  return (
    <div>
      <span>
        {parts.map((part, i) =>
          part.keyword ? (
            <button
              key={`${part.keyword.id}-${i}`}
              type="button"
              className="underline decoration-dotted underline-offset-2 text-[var(--lingo-red)] font-semibold"
              onClick={() => setOpen(part.keyword)}
            >
              {part.text}
            </button>
          ) : (
            <span key={i}>{part.text}</span>
          )
        )}
      </span>
      {open ? (
        <div className="mt-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-secondary)] p-3 text-sm font-normal">
          <p className="font-bold">{open.translation || open.term_en || open.term_key}</p>
          <p className="text-[var(--text-secondary)] mt-1">{open.definition}</p>
          <p className="text-[11px] text-[var(--text-secondary)] mt-2">
            This keyword card has been created by LingoTheory as additional learning support and is not part of the DVSA revision material.
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            <SaveCardButton cardKind="keyword" keywordCardId={open.id} />
            <button
              type="button"
              className="lt-btn-ghost px-2 py-1 text-xs"
              onClick={() => setOpen(null)}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function splitByTerms(text: string, keywords: InlineKeyword[]) {
  const terms = keywords
    .map((k) => ({
      keyword: k,
      needle: (k.translation || k.term_en || k.term_key).trim(),
    }))
    .filter((t) => t.needle.length > 2)
    .sort((a, b) => b.needle.length - a.needle.length);
  const out: Array<{ text: string; keyword: InlineKeyword | null }> = [];
  let remaining = text;
  while (remaining.length) {
    let earliest = -1;
    let hit: (typeof terms)[number] | null = null;
    for (const t of terms) {
      const idx = remaining.toLowerCase().indexOf(t.needle.toLowerCase());
      if (idx >= 0 && (earliest < 0 || idx < earliest)) {
        earliest = idx;
        hit = t;
      }
    }
    if (!hit || earliest < 0) {
      out.push({ text: remaining, keyword: null });
      break;
    }
    if (earliest > 0) out.push({ text: remaining.slice(0, earliest), keyword: null });
    out.push({
      text: remaining.slice(earliest, earliest + hit.needle.length),
      keyword: hit.keyword,
    });
    remaining = remaining.slice(earliest + hit.needle.length);
  }
  return out;
}
