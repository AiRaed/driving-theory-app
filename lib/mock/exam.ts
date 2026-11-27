/**
 * Car theory multiple-choice mock.
 * Scoring and official wording stay on the server. This module never reads
 * learner_question_progress or learner_attempt_history.
 */

export const MOCK_QUESTION_COUNT = 50;
export const MOCK_DURATION_SEC = 57 * 60;
export const MOCK_PASS_MARK = 43;
export const MOCK_SESSION_VERSION = 'dvsa-v2-mock-silent-2';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const LEAK_KEYS = new Set([
  'correct',
  'correctIndex',
  'correctSourceIndex',
  'correct_answer',
  'is_correct',
  'isCorrect',
  'explanation',
  'explanationEn',
  'explanationAr',
  'explanationUr',
  'explanation_en',
  'explanation_ar',
  'explanation_ur',
]);

export type MockOutcome = 'correct' | 'incorrect' | 'unanswered';

export type ActiveMockOption = {
  sourceIndex: number;
  en: string;
  ar: string;
  image: string | null;
  extra?: Record<string, string>;
};

export type ActiveMockQuestion = {
  id: string;
  topic: string;
  promptEn: string;
  promptAr: string;
  image: string | null;
  promptExtra?: Record<string, string>;
  options: ActiveMockOption[];
};

export type MockAnswerView = {
  sourceIndex: number;
  en: string;
  ar: string;
  image: string | null;
  extra?: Record<string, string>;
};

export type MockReviewQuestion = {
  questionId: string;
  topic: string;
  promptEn: string;
  promptAr: string;
  promptExtra?: Record<string, string>;
  image: string | null;
  outcome: 'incorrect' | 'unanswered';
  selected: MockAnswerView | null;
  correct: MockAnswerView;
  explanationEn: string;
  explanationAr: string;
  explanationExtra?: Record<string, string>;
};

export type MockTestResult = {
  attemptId: string;
  score: number;
  total: typeof MOCK_QUESTION_COUNT;
  passed: boolean;
  correct: number;
  incorrect: number;
  unanswered: number;
  percent: number;
  timeTakenSec: number;
  passMark: typeof MOCK_PASS_MARK;
  reviews: MockReviewQuestion[];
};

export type StoredMockSession = {
  version: typeof MOCK_SESSION_VERSION;
  attemptId: string;
  questions: ActiveMockQuestion[];
  selections: Record<string, number>;
  currentIndex: number;
  endsAt: number;
  result: MockTestResult | null;
};

export type ParsedSubmitBody = {
  attemptId: string;
  questionIds: string[];
  selections: Record<string, number | null>;
  elapsedSec: number;
};

export function formatMockClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds || 0));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function remainingSeconds(elapsedSec: number, duration = MOCK_DURATION_SEC): number {
  if (!Number.isFinite(elapsedSec) || elapsedSec < 0) return duration;
  return Math.max(0, duration - Math.floor(elapsedSec));
}

export function remainingFromEndsAt(endsAt: number, now = Date.now()): number {
  if (!Number.isFinite(endsAt)) return MOCK_DURATION_SEC;
  return Math.max(0, Math.min(MOCK_DURATION_SEC, Math.ceil((endsAt - now) / 1000)));
}

export function timeTakenSeconds(elapsedSec: number): number {
  if (!Number.isFinite(elapsedSec) || elapsedSec <= 0) return 0;
  return Math.min(MOCK_DURATION_SEC, Math.floor(elapsedSec));
}

export function shouldAutoSubmit(remaining: number): boolean {
  return remaining <= 0;
}

export function needsUnansweredConfirmation(
  unanswered: number,
  reason: 'manual' | 'timer'
): boolean {
  return reason === 'manual' && unanswered > 0;
}

export function canSubmit(state: { submitted: boolean; submitting: boolean }): boolean {
  return !state.submitted && !state.submitting;
}

export function unansweredCount(
  questionIds: string[],
  selections: Record<string, number | null | undefined>
): number {
  return questionIds.filter((id) => selections[id] == null).length;
}

export function applySelection(
  selections: Record<string, number>,
  questionId: string,
  sourceIndex: number
): Record<string, number> {
  return { ...selections, [questionId]: sourceIndex };
}

export function findAnswerLeak(value: unknown, path = '$'): string[] {
  if (!value || typeof value !== 'object') return [];
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => findAnswerLeak(item, `${path}[${index}]`));
  }
  const leaks: string[] = [];
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    if (LEAK_KEYS.has(key)) leaks.push(`${path}.${key}`);
    else leaks.push(...findAnswerLeak(child, `${path}.${key}`));
  }
  return leaks;
}

export function scoreMockAttempt(input: {
  questionIds: string[];
  selections: Record<string, number | null | undefined>;
  keys: Record<string, number>;
}): {
  correct: number;
  incorrect: number;
  unanswered: number;
  total: number;
  percent: number;
  passed: boolean;
  outcomes: Array<{
    questionId: string;
    outcome: MockOutcome;
    selectedSourceIndex: number | null;
    correctSourceIndex: number;
  }>;
} {
  if (input.questionIds.length !== MOCK_QUESTION_COUNT) {
    throw new Error('A car theory mock must contain 50 questions');
  }
  if (new Set(input.questionIds).size !== MOCK_QUESTION_COUNT) {
    throw new Error('A mock cannot repeat a question');
  }

  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;
  const outcomes = input.questionIds.map((questionId) => {
    const correctSourceIndex = input.keys[questionId];
    if (
      !Number.isInteger(correctSourceIndex) ||
      correctSourceIndex < 1 ||
      correctSourceIndex > 4
    ) {
      throw new Error(`Missing official answer for ${questionId}`);
    }
    const selected = input.selections[questionId];
    const selectedSourceIndex = selected == null ? null : selected;
    let outcome: MockOutcome;
    if (selectedSourceIndex == null) {
      outcome = 'unanswered';
      unanswered += 1;
    } else if (selectedSourceIndex === correctSourceIndex) {
      outcome = 'correct';
      correct += 1;
    } else {
      outcome = 'incorrect';
      incorrect += 1;
    }
    return { questionId, outcome, selectedSourceIndex, correctSourceIndex };
  });

  return {
    correct,
    incorrect,
    unanswered,
    total: MOCK_QUESTION_COUNT,
    percent: Math.round((correct / MOCK_QUESTION_COUNT) * 100),
    passed: correct >= MOCK_PASS_MARK,
    outcomes,
  };
}

export function shuffleInPlace<T>(items: T[], random: () => number = Math.random): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    const current = copy[index];
    copy[index] = copy[swap];
    copy[swap] = current;
  }
  return copy;
}

export function pickMockQuestions<T>(
  questions: T[],
  count = MOCK_QUESTION_COUNT,
  random: () => number = Math.random
): T[] {
  if (questions.length < count) {
    throw new Error('Not enough published questions for a mock test');
  }
  return shuffleInPlace(questions, random).slice(0, count);
}

function isSourceIndex(value: unknown): value is number {
  return value === 1 || value === 2 || value === 3 || value === 4;
}

export function parseSubmitBody(body: unknown): ParsedSubmitBody | null {
  if (!body || typeof body !== 'object') return null;
  const raw = body as Record<string, unknown>;
  const attemptId = typeof raw.attemptId === 'string' ? raw.attemptId.trim() : '';
  if (!UUID_RE.test(attemptId)) return null;
  if (!Array.isArray(raw.questionIds) || raw.questionIds.length !== MOCK_QUESTION_COUNT) {
    return null;
  }
  const questionIds: string[] = [];
  for (const id of raw.questionIds) {
    if (typeof id !== 'string') return null;
    const trimmed = id.trim();
    if (!trimmed || trimmed.length > 80) return null;
    questionIds.push(trimmed);
  }
  if (new Set(questionIds).size !== MOCK_QUESTION_COUNT) return null;

  const rawSelections =
    raw.selections && typeof raw.selections === 'object' && !Array.isArray(raw.selections)
      ? (raw.selections as Record<string, unknown>)
      : null;
  if (!rawSelections) return null;

  const selections: Record<string, number | null> = {};
  for (const id of questionIds) {
    const value = rawSelections[id];
    if (value == null) {
      selections[id] = null;
      continue;
    }
    if (!isSourceIndex(value)) return null;
    selections[id] = value;
  }

  return {
    attemptId,
    questionIds,
    selections,
    elapsedSec: timeTakenSeconds(typeof raw.elapsedSec === 'number' ? raw.elapsedSec : 0),
  };
}

function isAnswerView(value: unknown): value is MockAnswerView {
  if (!value || typeof value !== 'object') return false;
  const view = value as MockAnswerView;
  return isSourceIndex(view.sourceIndex) && typeof view.en === 'string' && typeof view.ar === 'string';
}

export function parseMockResult(value: unknown): MockTestResult | null {
  if (!value || typeof value !== 'object') return null;
  const row = value as MockTestResult;
  if (typeof row.attemptId !== 'string' || !UUID_RE.test(row.attemptId)) return null;
  if (row.total !== MOCK_QUESTION_COUNT || row.passMark !== MOCK_PASS_MARK) return null;
  if (!Number.isInteger(row.score) || row.score < 0 || row.score > MOCK_QUESTION_COUNT) return null;
  if (row.score !== row.correct) return null;
  if (
    !Number.isInteger(row.correct) ||
    !Number.isInteger(row.incorrect) ||
    !Number.isInteger(row.unanswered)
  ) {
    return null;
  }
  if (row.correct + row.incorrect + row.unanswered !== MOCK_QUESTION_COUNT) return null;
  if (row.passed !== row.correct >= MOCK_PASS_MARK) return null;
  if (row.percent !== Math.round((row.correct / MOCK_QUESTION_COUNT) * 100)) return null;
  if (!Number.isInteger(row.timeTakenSec) || row.timeTakenSec < 0 || row.timeTakenSec > MOCK_DURATION_SEC) {
    return null;
  }
  if (!Array.isArray(row.reviews) || row.reviews.length !== row.incorrect + row.unanswered) return null;
  for (const review of row.reviews) {
    if (!review || (review.outcome !== 'incorrect' && review.outcome !== 'unanswered')) return null;
    if (typeof review.questionId !== 'string' || typeof review.promptEn !== 'string') return null;
    if (typeof review.explanationEn !== 'string' || typeof review.explanationAr !== 'string') return null;
    if (!isAnswerView(review.correct)) return null;
    if (review.outcome === 'unanswered' && review.selected != null) return null;
    if (review.outcome === 'incorrect' && !isAnswerView(review.selected)) return null;
  }
  return row;
}

function isActiveQuestion(value: unknown): value is ActiveMockQuestion {
  if (!value || typeof value !== 'object') return false;
  const question = value as ActiveMockQuestion;
  if (typeof question.id !== 'string' || typeof question.promptEn !== 'string') return false;
  if (!Array.isArray(question.options) || question.options.length < 2) return false;
  return question.options.every(
    (option) =>
      isSourceIndex(option?.sourceIndex) &&
      typeof option.en === 'string' &&
      typeof option.ar === 'string' &&
      findAnswerLeak(option).length === 0
  );
}

export function parseActiveExam(value: unknown): { attemptId: string; questions: ActiveMockQuestion[] } | null {
  if (!value || typeof value !== 'object') return null;
  const body = value as { attemptId?: unknown; questions?: unknown };
  if (typeof body.attemptId !== 'string' || !UUID_RE.test(body.attemptId)) return null;
  if (!Array.isArray(body.questions) || body.questions.length !== MOCK_QUESTION_COUNT) return null;
  if (findAnswerLeak(body.questions).length > 0) return null;
  if (!body.questions.every(isActiveQuestion)) return null;
  const ids = body.questions.map((question) => question.id);
  if (new Set(ids).size !== MOCK_QUESTION_COUNT) return null;
  return { attemptId: body.attemptId, questions: body.questions };
}

export function parseStoredMockSession(value: unknown): StoredMockSession | null {
  if (!value || typeof value !== 'object') return null;
  const session = value as StoredMockSession;
  if (session.version !== MOCK_SESSION_VERSION) return null;
  const exam = parseActiveExam({ attemptId: session.attemptId, questions: session.questions });
  if (!exam) return null;
  if (!session.selections || typeof session.selections !== 'object' || Array.isArray(session.selections)) {
    return null;
  }
  const selections: Record<string, number> = {};
  for (const [questionId, sourceIndex] of Object.entries(session.selections)) {
    if (!exam.questions.some((question) => question.id === questionId)) return null;
    if (!isSourceIndex(sourceIndex)) return null;
    selections[questionId] = sourceIndex;
  }
  if (!Number.isInteger(session.currentIndex) || session.currentIndex < 0 || session.currentIndex > 49) {
    return null;
  }
  if (!Number.isFinite(session.endsAt)) return null;
  const result = session.result == null ? null : parseMockResult(session.result);
  if (session.result != null && !result) return null;
  return {
    version: MOCK_SESSION_VERSION,
    attemptId: exam.attemptId,
    questions: exam.questions,
    selections,
    currentIndex: session.currentIndex,
    endsAt: session.endsAt,
    result,
  };
}

export function reviewPosition(
  reviews: MockReviewQuestion[],
  index: number
): { kind: 'incorrect' | 'unanswered'; current: number; total: number } | null {
  const item = reviews[index];
  if (!item) return null;
  const same = reviews.filter((review) => review.outcome === item.outcome);
  return {
    kind: item.outcome,
    current: same.findIndex((review) => review.questionId === item.questionId) + 1,
    total: same.length,
  };
}

export function moveReviewIndex(index: number, delta: number, length: number): number {
  if (length <= 0) return 0;
  return Math.min(length - 1, Math.max(0, index + delta));
}
