/**
 * Thin wrapper around the canonical repository provider.
 * Existing imports of getLearnerQuestionBank keep working.
 */
export type { BankSource, LearnerBank } from '@/lib/questions/repository';
export {
  getPublishedQuestionBank,
  isDatabaseBankComplete,
  EXPECTED_PUBLISHED_COUNT,
} from '@/lib/questions/repository';

import { getPublishedQuestionBank } from '@/lib/questions/repository';
import type { LearnerBank } from '@/lib/questions/repository';

/** @deprecated Prefer getPublishedQuestionBank — alias kept for callers. */
export async function getLearnerQuestionBank(): Promise<LearnerBank> {
  return getPublishedQuestionBank();
}
