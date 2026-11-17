'use client';

import { useEffect, useRef, useState } from 'react';
import PracticeHintDialog from '@/components/PracticeHintDialog';
import PracticeKeywordText from '@/components/PracticeKeywordText';
import { hintDialogCopy, type PracticeHintCard } from '@/lib/learning-cards/hintDialog';

type HintCard = PracticeHintCard;

function usePublishedExplanation(questionId: string, language: string) {
  const [card, setCard] = useState<HintCard | null>(null);
  useEffect(() => {
    let cancelled = false;
    setCard(null);
    fetch(
      `/api/learning-cards/for-question?question_id=${encodeURIComponent(questionId)}&language=${encodeURIComponent(language || 'en')}`
    )
      .then((r) => r.json())
      .then((body) => {
        if (cancelled) return;
        const explanation = body.explanation || null;
        const text = String(explanation?.explanation || '').trim();
        const explanationAr = String(body.explanation_ar || '').trim();
        if (!text && !explanationAr) {
          setCard(null);
          return;
        }
        const review =
          body.arabic_review === 'draft' || body.arabic_review === 'approved'
            ? body.arabic_review
            : undefined;
        setCard({
          id: explanation?.id || `${questionId}-ar`,
          explanation: text,
          format: explanation?.format,
          language: explanation?.language || 'en',
          image_url: explanation?.image_url,
          image_alt: explanation?.image_alt,
          video_url: explanation?.video_url,
          explanation_ar: explanationAr || undefined,
          arabic_review: review,
        });
      })
      .catch(() => {
        if (!cancelled) setCard(null);
      });
    return () => {
      cancelled = true;
    };
  }, [questionId, language]);
  return card;
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
  return (
    <div
      dir="ltr"
      lang="en"
      className="text-[1.4rem] font-bold leading-[1.3] tracking-tight text-[#102D4E] sm:text-[1.7rem] flex-1 min-w-0 break-words whitespace-normal"
    >
      <PracticeKeywordText questionId={questionId} language={language} text={prompt} />
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
  const card = usePublishedExplanation(questionId, language);
  const [open, setOpen] = useState(false);
  const [scope, setScope] = useState(`${questionId}:${language}`);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const nextScope = `${questionId}:${language}`;
  if (scope !== nextScope) {
    setScope(nextScope);
    setOpen(false);
  }
  if (!card) return null;
  const copy = hintDialogCopy(language);
  return (
    <div className="shrink-0">
      <button
        ref={triggerRef}
        type="button"
        className="lt-btn-ghost lt-hint-trigger inline-flex items-center gap-2 px-4 py-2 text-sm"
        dir={copy.dir}
        lang={copy.lang}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? 'practice-hint-dialog' : undefined}
        data-testid="practice-hint-trigger"
        onClick={() => setOpen(true)}
      >
        <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6M10 21h4" />
          <path d="M12 3a6 6 0 0 0-3.2 11.1c.4.3.7.8.7 1.3V16h5v-.6c0-.5.3-1 .7-1.3A6 6 0 0 0 12 3Z" />
        </svg>
        {copy.triggerLabel}
      </button>
      <PracticeHintDialog
        open={open}
        card={card}
        uiLanguage={language}
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
