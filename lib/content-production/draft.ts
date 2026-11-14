/**
 * Optional English explanation draft helper.
 *
 * Grounded only in the official question, correct option, and explanation_en.
 * Never invents road rules. Never batch-generates. Never publishes.
 */

import type { QuestionContext } from './types';

const INVENTED_MARKERS = [
  /you must always/i,
  /the highway code says you should never/i,
  /new rule/i,
  /according to my knowledge/i,
];

export function generateGroundedEnglishDraft(q: QuestionContext): {
  ok: boolean;
  draft: string;
  invented: false;
  source: 'official_explanation';
} {
  const expl = String(q.explanation_en || '').trim();
  const stem = String(q.question_en || '').trim();
  const idx = Math.max(1, Math.min(4, q.correct_answer || 1)) - 1;
  const correct = String(q.answers_en?.[idx] || '').trim();

  if (!expl) {
    return {
      ok: false,
      draft: '',
      invented: false,
      source: 'official_explanation',
    };
  }

  const parts = [
    stem ? `This question asks: ${stem}` : '',
    correct ? `The official correct answer is: ${correct}.` : '',
    `Why (from the official DVSA explanation, restated for teaching — official wording only): ${expl}`,
    'Do not treat this draft as additional Highway Code. Keep the official wording locked on the question.',
  ].filter(Boolean);

  return {
    ok: true,
    draft: parts.join('\n\n'),
    invented: false,
    source: 'official_explanation',
  };
}

export function draftInventedRules(text: string): boolean {
  return INVENTED_MARKERS.some((re) => re.test(text || ''));
}

export function assertSingleDraftRequest(payload: { question_ids?: string[]; batch?: boolean }): void {
  if (payload.batch === true || (payload.question_ids && payload.question_ids.length > 1)) {
    throw new Error('AI-assisted drafts are one question at a time. Never batch-generate.');
  }
}
