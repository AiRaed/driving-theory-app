'use client';

import { useState } from 'react';
import PracticeKeywordText from '@/components/PracticeKeywordText';
import { cn } from '@/lib/utils';

type OptionLike = {
  en?: string;
  image?: string;
};

type Props = {
  option: OptionLike;
  /** Classes for the English text line when present */
  enClassName?: string;
  /** Optional translation / secondary content rendered below text */
  children?: React.ReactNode;
  imageClassName?: string;
  missingLabel?: string;
  /**
   * Practice only. When set, published keywords linked to this question
   * become tappable inside the official English answer. Mock Test omits it.
   */
  keywordQuestionId?: string | null;
  keywordLanguage?: string | null;
};

/**
 * Renders a practice/mock answer option that may be text, image, or both.
 * Does not participate in scoring — callers keep using option.correct.
 */
export default function AnswerOptionContent({
  option,
  enClassName,
  children,
  imageClassName,
  missingLabel = 'Image unavailable',
  keywordQuestionId,
  keywordLanguage,
}: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasText = !!(option.en && option.en.trim());
  const hasImage = !!(option.image && option.image.trim());

  return (
    <div className="flex-1 min-w-0">
      {hasImage && !imageFailed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={option.image}
          alt={hasText ? option.en!.trim() : 'Answer option'}
          className={cn(
            'max-h-28 w-auto max-w-full object-contain mb-1 rounded-sm',
            imageClassName
          )}
          onError={() => setImageFailed(true)}
        />
      ) : null}
      {hasImage && imageFailed ? (
        <div className="text-sm text-[var(--text-secondary)] italic mb-1">{missingLabel}</div>
      ) : null}
      {hasText ? (
        keywordQuestionId ? (
          <div className={enClassName}>
            <PracticeKeywordText
              questionId={keywordQuestionId}
              language={keywordLanguage || 'en'}
              text={option.en || ''}
            />
          </div>
        ) : (
          <div className={enClassName} dir="ltr" lang="en">
            {option.en}
          </div>
        )
      ) : null}
      {children}
    </div>
  );
}
