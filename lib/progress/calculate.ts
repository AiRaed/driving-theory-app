import type { ProgressAnswer, ProgressQuestionRef, ProgressSummary, TopicProgress } from './types';
import { PRACTICE_CONTENT_VERSION } from './types';

export function emptyTopicProgress(total = 0): TopicProgress {
  return {
    total,
    answered: 0,
    correct: 0,
    incorrect: 0,
    unanswered: total,
    completionPercent: 0,
    accuracyPercent: 0,
  };
}

function percent(part: number, whole: number): number {
  if (whole <= 0) return 0;
  return Math.round((part / whole) * 100);
}

function summariseIds(questionIds: string[], answersById: Map<string, ProgressAnswer>): TopicProgress {
  let correct = 0;
  let incorrect = 0;
  for (const id of questionIds) {
    const answer = answersById.get(id);
    if (!answer) continue;
    if (answer.isCorrect) correct += 1;
    else incorrect += 1;
  }
  const answered = correct + incorrect;
  const total = questionIds.length;
  return {
    total,
    answered,
    correct,
    incorrect,
    unanswered: total - answered,
    completionPercent: percent(answered, total),
    accuracyPercent: percent(correct, answered),
  };
}

/**
 * Progress uses distinct active-bank questions and the latest answer only.
 * Rows for questions outside the active bank are ignored.
 * Language is not part of the key, so English and Arabic share one record.
 */
export function summariseProgress(
  catalog: ProgressQuestionRef[],
  answers: ProgressAnswer[]
): ProgressSummary {
  const activeIds = new Set(catalog.map((question) => question.id));
  const answersById = new Map<string, ProgressAnswer>();
  for (const answer of answers) {
    if (!activeIds.has(answer.questionId)) continue;
    answersById.set(answer.questionId, answer);
  }

  const idsByTopic: Record<string, string[]> = {};
  for (const question of catalog) {
    const list = idsByTopic[question.topicId] ?? [];
    list.push(question.id);
    idsByTopic[question.topicId] = list;
  }

  const topics: Record<string, TopicProgress> = {};
  for (const topicId of Object.keys(idsByTopic)) {
    topics[topicId] = summariseIds(idsByTopic[topicId], answersById);
  }

  return {
    contentVersion: PRACTICE_CONTENT_VERSION,
    overall: summariseIds(catalog.map((question) => question.id), answersById),
    topics,
  };
}

/** Latest incorrect question ids still in the active bank. Topic is optional. */
export function incorrectQuestionIds(
  catalog: ProgressQuestionRef[],
  answers: ProgressAnswer[],
  topicId?: string
): string[] {
  const active = new Set(
    catalog
      .filter((question) => (topicId ? question.topicId === topicId : true))
      .map((question) => question.id)
  );
  return answers
    .filter((answer) => active.has(answer.questionId) && !answer.isCorrect)
    .map((answer) => answer.questionId);
}

/** Replace the latest answer for a question. Answered count stays 1. */
export function applyLatestAnswer(answers: ProgressAnswer[], next: ProgressAnswer): ProgressAnswer[] {
  const rest = answers.filter((answer) => answer.questionId !== next.questionId);
  return [...rest, next];
}
