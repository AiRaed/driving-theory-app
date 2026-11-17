'use client';

import { useId, useRef, useState } from 'react';
import PracticeKeywordDialog from '@/components/PracticeKeywordDialog';
import { keywordDialogCopy } from '@/lib/keyword-cards/dialog';
import { usePublishedQuestionKeywords } from '@/lib/keyword-cards/useQuestionKeywords';

/** Practice only. Hidden unless this question has a published keyword card. */
export default function PracticeKeywordControl({
  questionId,
  language,
}: {
  questionId: string;
  language: string;
}) {
  const keywords = usePublishedQuestionKeywords(questionId);
  const dialogId = useId();
  const [open, setOpen] = useState(false);
  const [scope, setScope] = useState(questionId);
  const triggerRef = useRef<HTMLButtonElement>(null);
  if (scope !== questionId) {
    setScope(questionId);
    setOpen(false);
  }

  if (!keywords.length) return null;
  const copy = keywordDialogCopy(language);
  return (
    <div className="mt-4">
      <button
        ref={triggerRef}
        type="button"
        className="inline-flex min-h-11 items-center rounded-full border border-[#168CBA]/40 bg-[#E7F4F9] px-4 text-sm font-bold text-[#168CBA]"
        dir={copy.dir}
        lang={copy.lang}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? dialogId : undefined}
        data-testid="practice-keyword-trigger"
        onClick={() => setOpen(true)}
      >
        {copy.triggerLabel}
      </button>
      <PracticeKeywordDialog
        open={open}
        keywords={keywords}
        language={language}
        dialogId={dialogId}
        returnFocusRef={triggerRef}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
