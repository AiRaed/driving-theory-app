'use client';

import SaveCardButton from '@/components/SaveCardButton';

export default function ExplanationCardPanel({
  card,
}: {
  card: {
    id: string;
    explanation: string;
    format?: string;
    language?: string;
  } | null;
}) {
  if (!card) return null;
  return (
    <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4 space-y-2">
      <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
        Extra explanation · {card.language?.toUpperCase() || 'EN'} · {card.format || 'text'}
      </p>
      <p className="text-sm text-[var(--text-primary)] leading-relaxed">{card.explanation}</p>
      <p className="text-[11px] text-[var(--text-secondary)]">
        This is a LingoTheory learning card, not a DVSA-approved explanation. Official wording
        stays on the question.
      </p>
      <SaveCardButton cardKind="explanation" explanationCardId={card.id} />
    </div>
  );
}
