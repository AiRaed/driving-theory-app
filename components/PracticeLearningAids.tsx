'use client';

import { useEffect, useState } from 'react';
import KeywordInlineText, { type InlineKeyword } from '@/components/KeywordInlineText';
import ExplanationCardPanel from '@/components/ExplanationCardPanel';

type Payload = {
  keywords: InlineKeyword[];
  terms: Array<{ term_key: string; term_en: string }>;
  explanation: {
    id: string;
    explanation: string;
    format?: string;
    language?: string;
  } | null;
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
          setData({ keywords, terms, explanation: body.explanation || null });
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

export function PracticeExplanationAfterAnswer({
  questionId,
  language,
  visible,
}: {
  questionId: string;
  language: string;
  visible: boolean;
}) {
  const data = usePublishedCards(questionId, language);
  if (!visible) return null;
  return <ExplanationCardPanel card={data?.explanation || null} />;
}
