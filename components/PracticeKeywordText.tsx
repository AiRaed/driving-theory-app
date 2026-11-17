'use client';

import { useId, useMemo, useRef, useState } from 'react';
import PracticeKeywordDialog from '@/components/PracticeKeywordDialog';
import { segmentKeywordText } from '@/lib/keyword-cards/highlightTerms';
import { usePublishedQuestionKeywords } from '@/lib/keyword-cards/useQuestionKeywords';

/**
 * Official English question text with tappable published keywords.
 * Practice only. Matching does not change the stored question.
 */
export default function PracticeKeywordText({
  questionId,
  language,
  text,
}: {
  questionId: string;
  language: string;
  text: string;
}) {
  const keywords = usePublishedQuestionKeywords(questionId);
  const dialogId = useId();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scope, setScope] = useState(questionId);
  const triggerRef = useRef({ current: null as HTMLButtonElement | null }).current;
  if (scope !== questionId) {
    setScope(questionId);
    setOpen(false);
    setSelectedId(null);
  }

  const segments = useMemo(() => segmentKeywordText(text, keywords), [text, keywords]);

  return (
    <>
      <span dir="ltr" lang="en">
        {segments.map((segment, index) =>
          segment.keywordId ? (
            <button
              key={`${segment.keywordId}-${index}`}
              type="button"
              className="lt-keyword-term"
              dir="ltr"
              lang="en"
              aria-haspopup="dialog"
              aria-expanded={open && selectedId === segment.keywordId}
              aria-controls={open ? dialogId : undefined}
              aria-label={`${segment.text}, keyword`}
              data-testid="practice-keyword-term"
              data-keyword-id={segment.keywordId}
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
                setSelectedId(segment.keywordId);
                setOpen(true);
              }}
            >
              {segment.text}
            </button>
          ) : (
            <span key={index}>{segment.text}</span>
          )
        )}
      </span>
      {keywords.length > 0 ? (
        <PracticeKeywordDialog
          open={open}
          keywords={keywords}
          language={language}
          dialogId={dialogId}
          initialKeywordId={selectedId}
          returnFocusRef={triggerRef}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}
