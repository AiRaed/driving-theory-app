'use client';

import { useId, useMemo, useRef, useState } from 'react';
import PracticeKeywordDialog from '@/components/PracticeKeywordDialog';
import { keywordDialogCopy } from '@/lib/keyword-cards/dialog';
import { segmentKeywordText } from '@/lib/keyword-cards/highlightTerms';
import { isolateKeywordActivation } from '@/lib/keyword-cards/keywordActivation';
import { usePublishedQuestionKeywords } from '@/lib/keyword-cards/useQuestionKeywords';

/**
 * Official English text with tappable published keywords.
 * Practice only. Matching does not change the stored question or answer.
 * The chip is its own button so it can sit inside an answer option without
 * selecting or submitting that option.
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
  const copy = keywordDialogCopy(language);
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

  const openKeyword = (keywordId: string | null) => {
    if (!keywordId) return;
    setSelectedId(keywordId);
    setOpen(true);
  };

  return (
    <>
      <span dir="ltr" lang="en">
        {segments.map((segment, index) =>
          segment.keywordId ? (
            <button
              key={`${segment.keywordId}-${index}`}
              type="button"
              className="lt-keyword-term"
              aria-haspopup="dialog"
              aria-expanded={open && selectedId === segment.keywordId}
              aria-controls={open ? dialogId : undefined}
              aria-label={`${segment.text}, ${copy.learnMoreLabel}`}
              data-testid="practice-keyword-term"
              data-keyword-id={segment.keywordId}
              onPointerDown={(event) => event.stopPropagation()}
              onMouseDown={(event) => event.stopPropagation()}
              onTouchStart={(event) => event.stopPropagation()}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') event.stopPropagation();
              }}
              onClick={(event) => {
                isolateKeywordActivation(event);
                triggerRef.current = event.currentTarget;
                openKeyword(segment.keywordId);
              }}
            >
              <span className="lt-keyword-term-label" dir="ltr" lang="en">
                {segment.text}
              </span>
              <span className="lt-keyword-term-more" dir={copy.dir} lang={copy.lang}>
                <svg className="lt-keyword-term-icon" viewBox="0 0 20 20" aria-hidden="true">
                  <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <path
                    d="M7.7 7.8a2.35 2.35 0 1 1 3.15 2.2c-.55.28-.95.78-.95 1.35V12.2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <circle cx="10" cy="14.7" r="0.85" fill="currentColor" />
                </svg>
                {copy.learnMoreLabel}
              </span>
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
