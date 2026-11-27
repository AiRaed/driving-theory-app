'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchLearnerProgress, submitLearnerAnswer } from './client';
import type { ProgressSummary } from './types';
import { emptyTopicProgress } from './calculate';
import { PRACTICE_CONTENT_VERSION } from './types';

export type ProgressLoadStatus = 'loading' | 'ready' | 'error';

const EMPTY_SUMMARY: ProgressSummary = {
  contentVersion: PRACTICE_CONTENT_VERSION,
  overall: emptyTopicProgress(),
  topics: {},
};

export function useLearnerProgress(enabled = true, accountId?: string | null) {
  const [summary, setSummary] = useState<ProgressSummary>(EMPTY_SUMMARY);
  const [status, setStatus] = useState<ProgressLoadStatus>('loading');
  const [saveError, setSaveError] = useState(false);

  const reload = useCallback(async () => {
    const result = await fetchLearnerProgress();
    if (!result.ok) {
      setStatus('error');
      return;
    }
    setSummary(result.summary);
    setStatus('ready');
  }, []);

  useEffect(() => {
    if (!enabled) return;
    setSummary(EMPTY_SUMMARY);
    setStatus('loading');
    setSaveError(false);
    void reload();
  }, [enabled, accountId, reload]);

  const recordAnswer = useCallback(async (questionId: string, selectedAnswer: number, clientAttemptId: string) => {
    const result = await submitLearnerAnswer(questionId, selectedAnswer, clientAttemptId);
    if (!result.ok) {
      setSaveError(true);
      return false;
    }
    setSaveError(false);
    setSummary(result.summary);
    setStatus('ready');
    return true;
  }, []);

  return { summary, status, saveError, recordAnswer, reload };
}
