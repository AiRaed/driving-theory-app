'use client';

import { useEffect, useRef, useState } from 'react';
import KeywordInlineText, { type InlineKeyword } from '@/components/KeywordInlineText';
import PracticeHintDialog from '@/components/PracticeHintDialog';
import { hintDialogCopy, type PracticeHintCard } from '@/lib/learning-cards/hintDialog';

type HintCard = PracticeHintCard;

type Payload = {
  keywords: InlineKeyword[];
  terms: Array<{ term_key: string; term_en: string }>;
  explanation: HintCard | null;
};

function usePublishedCards(questionId: string, language: string) {
  const [data, setData] = useState<Payload | null>(null);
  useEffect(() => {
    let cancelled = false;
    setData(null);
    fetch(
      `/api/learning-cards/for-question?question_id=${encodeURIComponent(questionId)}&language=${encodeURIComponent(language || 'en')}`
    )
      .then((r) => r.json())
      .then((body) => {
        if (!cancelled) {
          const terms = body.terms || [];
          const keywords = (body.keywords || []).map((k: InlineKeyword) => ({
            ...k,
            term_en: terms.find((t: { term_key: string }) => t.term_key === k.term_key)?.term_en,
          }));
          const explanation = body.explanation || null;
          const complete =
            explanation && String(explanation.explanation || '').trim().length > 0
              ? explanation
              : null;
          setData({ keywords, terms, explanation: complete });
        }
      })
      .catch(() => {
        if (!cancelled) setData({ keywords: [], terms: [], explanation: null });
      });
    return () => {
      cancelled = true;
    };
  }, [questionId, language]);
  return data;
}

/** Practice only. Mock Test must not import this module. */
export default function PracticeLearningAids({
  questionId,
  language,
  prompt,
}: {
  questionId: string;
  language: string;
  prompt: string;
}) {
  const data = usePublishedCards(questionId, language);
  return (
    <div className="text-[19px] sm:text-[21px] font-bold text-[var(--text-primary)] leading-[1.4] flex-1 min-w-0 break-words whitespace-normal">
      <KeywordInlineText text={prompt} keywords={data?.keywords || []} />
    </div>
  );
}

/** Hint button only when a complete active explanation hint exists. */
export function PracticeExplanationHint({
  questionId,
  language,
}: {
  questionId: string;
  language: string;
}) {
  const data = usePublishedCards(questionId, language);
  const [open, setOpen] = useState(false);
  const [scope, setScope] = useState(`${questionId}:${language}`);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const nextScope = `${questionId}:${language}`;
  if (scope !== nextScope) {
    setScope(nextScope);
    setOpen(false);
  }
  const card = data?.explanation || null;
  if (!card) return null;
  const copy = hintDialogCopy(card.language || language);
  return (
    <div className="mt-3">
      <button
        ref={triggerRef}
        type="button"
        className="lt-btn-ghost px-3 py-2 text-sm"
        dir={copy.dir}
        lang={copy.lang}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? 'practice-hint-dialog' : undefined}
        data-testid="practice-hint-trigger"
        onClick={() => setOpen(true)}
      >
        {copy.triggerLabel}
      </button>
      <PracticeHintDialog
        open={open}
        card={card}
        returnFocusRef={triggerRef}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}

/** @deprecated Use PracticeExplanationHint. Kept so older imports fail closed. */
export function PracticeExplanationAfterAnswer({
  questionId,
  language,
  visible,
}: {
  questionId: string;
  language: string;
  visible: boolean;
}) {
  if (!visible) return null;
  return <PracticeExplanationHint questionId={questionId} language={language} />;
}
