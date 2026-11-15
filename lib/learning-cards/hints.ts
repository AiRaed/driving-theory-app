/**
 * Explanation Hints helpers.
 *
 * Reuses explanation_cards (Learning Cards). A complete admin-saved hint
 * is published so Practice can show a Hint button immediately. Empty drafts
 * never appear to learners. Keyword cards keep the old status workflow.
 */

import type { ExplanationCard, LearningCardStatus } from './types';
import { isLearnerVisibleCardStatus } from './types';

export function isCompleteExplanationHint(card: {
  explanation?: string | null;
}): boolean {
  return String(card.explanation || '').trim().length > 0;
}

/** Practice/Mock-safe: published + non-empty English (or translated) body. */
export function isLearnerVisibleExplanationHint(
  card: Pick<ExplanationCard, 'status' | 'explanation'> | null | undefined
): boolean {
  if (!card) return false;
  return isLearnerVisibleCardStatus(card.status) && isCompleteExplanationHint(card);
}

export function resolveExplanationSaveStatus(input: {
  explanation: string;
  activate?: boolean;
  existingStatus?: LearningCardStatus | null;
}): { status: LearningCardStatus; published_at: string | null } {
  const complete = isCompleteExplanationHint(input);
  if (input.activate === true && complete) {
    return { status: 'published', published_at: new Date().toISOString() };
  }
  if (!complete) {
    return {
      status: input.existingStatus === 'archived' ? 'archived' : 'draft',
      published_at: null,
    };
  }
  if (input.existingStatus === 'published') {
    return { status: 'published', published_at: null };
  }
  return { status: input.existingStatus || 'draft', published_at: null };
}

/** Suggested presentation. Text is always required; image and video are optional. */
export function hintPresentation(format: string | null | undefined): 'text' | 'text_image' | 'text_video' {
  if (format === 'video') return 'text_video';
  if (format === 'image' || format === 'diagram') return 'text_image';
  return 'text';
}

export function hintPresentationLabel(format: string | null | undefined): string {
  const presentation = hintPresentation(format);
  if (presentation === 'text_video') return 'Text + Video';
  if (presentation === 'text_image') return 'Text + Image/Diagram';
  return 'Text';
}

export function hintStatusLabel(status: string | null | undefined, explanation?: string): string {
  if (!status || status === 'none') return 'none';
  if (status === 'archived') return 'removed';
  if (status === 'published' && isCompleteExplanationHint({ explanation })) return 'active';
  return 'draft';
}
