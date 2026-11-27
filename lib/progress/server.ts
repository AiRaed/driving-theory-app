import { createServiceClient } from '@/lib/admin/supabaseAdmin';
import { summariseProgress } from './calculate';
import type { ProgressAnswer, ProgressQuestionRef, ProgressSummary } from './types';
import { PRACTICE_CONTENT_VERSION } from './types';

interface QuestionCatalogRow {
  id: string;
  topic_id: string;
}

interface ProgressRow {
  question_id: string;
  topic_id: string;
  is_correct: boolean;
  selected_answer: number;
  attempt_count: number;
}

export async function loadPracticeProgress(userId: string): Promise<ProgressSummary> {
  const admin = createServiceClient();
  const [catalogResult, progressResult] = await Promise.all([
    admin
      .from('questions')
      .select('id, topic_id')
      .eq('status', 'published')
      .eq('content_version', PRACTICE_CONTENT_VERSION),
    admin
      .from('learner_question_progress')
      .select('question_id, topic_id, is_correct, selected_answer, attempt_count')
      .eq('user_id', userId)
      .eq('content_version', PRACTICE_CONTENT_VERSION),
  ]);

  if (catalogResult.error) {
    throw new Error(catalogResult.error.message);
  }
  if (progressResult.error) {
    throw new Error(progressResult.error.message);
  }

  const catalog: ProgressQuestionRef[] = ((catalogResult.data || []) as QuestionCatalogRow[]).map(
    (row) => ({ id: row.id, topicId: row.topic_id })
  );
  const answers: ProgressAnswer[] = ((progressResult.data || []) as ProgressRow[]).map((row) => ({
    questionId: row.question_id,
    topicId: row.topic_id,
    isCorrect: row.is_correct,
    selectedAnswer: row.selected_answer,
    attemptCount: row.attempt_count,
  }));

  return summariseProgress(catalog, answers);
}

/**
 * Published active V2 questions in this topic whose latest answer is incorrect.
 * Returns ids only. Correct answers and selected options stay on the server.
 */
export async function listIncorrectQuestionIds(userId: string, topicId: string): Promise<string[]> {
  const admin = createServiceClient();
  const [catalogResult, progressResult] = await Promise.all([
    admin
      .from('questions')
      .select('id')
      .eq('status', 'published')
      .eq('content_version', PRACTICE_CONTENT_VERSION)
      .eq('topic_id', topicId)
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true }),
    admin
      .from('learner_question_progress')
      .select('question_id')
      .eq('user_id', userId)
      .eq('content_version', PRACTICE_CONTENT_VERSION)
      .eq('topic_id', topicId)
      .eq('is_correct', false),
  ]);

  if (catalogResult.error) {
    throw new Error(catalogResult.error.message);
  }
  if (progressResult.error) {
    throw new Error(progressResult.error.message);
  }

  const incorrect = new Set(
    ((progressResult.data || []) as Array<{ question_id: string }>).map((row) => row.question_id)
  );
  return ((catalogResult.data || []) as Array<{ id: string }>)
    .map((row) => row.id)
    .filter((id) => incorrect.has(id));
}

export async function recordPracticeAnswer(input: {
  userId: string;
  questionId: string;
  selectedAnswer: number;
  clientAttemptId: string;
}): Promise<ProgressSummary> {
  const admin = createServiceClient();
  const prior = await admin
    .from('learner_attempt_history')
    .select('question_id, selected_answer')
    .eq('user_id', input.userId)
    .eq('client_attempt_id', input.clientAttemptId)
    .maybeSingle();
  if (prior.error) {
    throw new Error(prior.error.message);
  }
  if (
    prior.data &&
    (prior.data.question_id !== input.questionId ||
      prior.data.selected_answer !== input.selectedAnswer)
  ) {
    throw new Error('attempt id reused');
  }

  const { error } = await admin.rpc('record_learner_practice_answer', {
    p_user_id: input.userId,
    p_question_id: input.questionId,
    p_selected_answer: input.selectedAnswer,
    p_client_attempt_id: input.clientAttemptId,
  });
  if (error) {
    throw new Error(error.message);
  }
  return loadPracticeProgress(input.userId);
}
