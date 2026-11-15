'use client';

import ExplanationHintEditor from '@/components/admin/ExplanationHintEditor';

/** Kept for Question Editor. Same simplified Explanation Hints workflow. */
export default function ExplanationRecommendationPanel({
  questionId,
}: {
  questionId: string;
}) {
  return <ExplanationHintEditor questionId={questionId} />;
}
