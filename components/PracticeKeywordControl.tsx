'use client';

import { useEffect, useRef, useState } from 'react';
import PracticeKeywordDialog from '@/components/PracticeKeywordDialog';
import { keywordDialogCopy } from '@/lib/keyword-cards/dialog';
import type { LearnerKeywordCard } from '@/lib/keyword-cards/types';

/** Practice only. Hidden unless this question has a published keyword card. */
export default function PracticeKeywordControl({
  questionId,
  language,
}: {
  questionId: string;
  language: string;
}) {
  const [keywords, setKeywords] = useState<LearnerKeywordCard[]>([]);
  const [open, setOpen] = useState(false);
  const [scope, setScope] = useState(questionId);
  const triggerRef = useRef<HTMLButtonElement>(null);
  if (scope !== questionId) {
    setScope(questionId);
    setOpen(false);
  }

  useEffect(() => {
    let cancelled = false;
    setKeywords([]);
    fetch(`/api/keyword-cards/for-question?question_id=${encodeURIComponent(questionId)}`)
      .then((res) => res.json())
      .then((body) => {
        if (cancelled) return;
        const rows = Array.isArray(body.keywords) ? body.keywords : [];
        setKeywords(
          rows.filter(
            (row: LearnerKeywordCard) => row && String(row.explanation_en || '').trim().length > 0
          )
        );
      })
      .catch(() => {
        if (!cancelled) setKeywords([]);
      });
    return () => {
      cancelled = true;
    };
  }, [questionId]);

  if (!keywords.length) return null;
  const copy = keywordDialogCopy(language);
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
        aria-controls={open ? 'practice-keyword-dialog' : undefined}
        data-testid="practice-keyword-trigger"
        onClick={() => setOpen(true)}
      >
        {copy.triggerLabel}
      </button>
      <PracticeKeywordDialog
        open={open}
        keywords={keywords}
        language={language}
        returnFocusRef={triggerRef}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
