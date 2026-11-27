import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import type { QuestionRow } from '../questions/types';
import { mockCopy } from './copy';
import {
  MOCK_DURATION_SEC,
  MOCK_PASS_MARK,
  MOCK_QUESTION_COUNT,
  applySelection,
  canSubmit,
  findAnswerLeak,
  formatMockClock,
  moveReviewIndex,
  needsUnansweredConfirmation,
  parseActiveExam,
  parseMockResult,
  parseSubmitBody,
  remainingFromEndsAt,
  reviewPosition,
  shouldAutoSubmit,
  unansweredCount,
} from './exam';
import { buildActiveExam, buildMockResult, toActiveQuestion } from './present';

const root = path.join(__dirname, '../..');
const ATTEMPT = '11111111-1111-4111-8111-111111111111';

function run(name: string, fn: () => void) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

function row(id: string, correct = 1, extra: Partial<QuestionRow> = {}): QuestionRow {
  return {
    id,
    topic_id: 'alertness',
    question_en: `Prompt ${id}`,
    question_ar: `عربي ${id}`,
    question_ur: '',
    answer_1_en: 'Alpha',
    answer_1_ar: 'ألف',
    answer_1_ur: '',
    answer_2_en: 'Beta',
    answer_2_ar: 'باء',
    answer_2_ur: '',
    answer_3_en: 'Gamma',
    answer_3_ar: '',
    answer_3_ur: '',
    answer_4_en: 'Delta',
    answer_4_ar: '',
    answer_4_ur: '',
    correct_answer: correct,
    explanation_en: `Official explanation ${id}`,
    explanation_ar: `شرح رسمي ${id}`,
    explanation_ur: null,
    keywords: [],
    image_url: id === 'q1' ? 'https://cdn.example/q1.png' : null,
    image_alt: null,
    status: 'published',
    sort_order: 1,
    translations: {
      bn: {
        question: `BN ${id}`,
        answers: ['bn1', 'bn2', 'bn3', 'bn4'],
        explanation: 'BN_SECRET_EXPLANATION',
      },
    },
    ...extra,
  } as QuestionRow;
}

function bank(correctFor: (index: number) => number = () => 1): QuestionRow[] {
  return Array.from({ length: 50 }, (_, index) => row(`q${index + 1}`, correctFor(index)));
}

run('car mock is 50 questions, 57 minutes, and passes at 43', () => {
  assert.equal(MOCK_QUESTION_COUNT, 50);
  assert.equal(MOCK_DURATION_SEC, 57 * 60);
  assert.equal(MOCK_PASS_MARK, 43);
  assert.equal(formatMockClock(MOCK_DURATION_SEC), '57:00');
  const now = 1_700_000_000_000;
  assert.equal(remainingFromEndsAt(now + MOCK_DURATION_SEC * 1000, now), 3420);
  assert.equal(remainingFromEndsAt(now - 1000, now), 0);
  assert.equal(shouldAutoSubmit(0), true);
  assert.equal(shouldAutoSubmit(1), false);
});

run('selecting an answer does not reveal the official key', () => {
  const active = toActiveQuestion(
    row('q1', 3, { explanation_en: 'LEAK_SENTINEL_EXPLANATION' }),
    () => 0
  );
  assert.deepEqual(findAnswerLeak(active), []);
  const encoded = JSON.stringify(active);
  assert.equal(encoded.includes('LEAK_SENTINEL_EXPLANATION'), false);
  assert.equal(encoded.includes('BN_SECRET_EXPLANATION'), false);
  assert.equal(encoded.includes('"correct"'), false);
  assert.equal(active.promptEn, 'Prompt q1');
  assert.equal(active.promptAr, 'عربي q1');
  assert.equal(active.image, 'https://cdn.example/q1.png');
  assert.equal(active.promptExtra?.bn, 'BN q1');
  assert.deepEqual(
    active.options.map((option) => option.sourceIndex).sort(),
    [1, 2, 3, 4]
  );
  const exam = buildActiveExam(
    bank().map((item, index) =>
      index === 0 ? row('q1', 2, { explanation_en: 'LEAK_SENTINEL_EXPLANATION' }) : item
    ),
    () => 0
  );
  assert.equal(exam.length, 50);
  assert.deepEqual(findAnswerLeak(exam), []);
  assert.equal(JSON.stringify(exam).includes('LEAK_SENTINEL_EXPLANATION'), false);
  assert.equal(parseActiveExam({ attemptId: ATTEMPT, questions: exam })?.questions.length, 50);
  assert.equal(
    parseActiveExam({
      attemptId: ATTEMPT,
      questions: [{ ...exam[0], explanationEn: 'Official explanation q1' }],
    }),
    null
  );
});

run('the latest selection is the one that is scored', () => {
  const ids = bank().map((item) => item.id);
  let selections: Record<string, number> = {};
  selections = applySelection(selections, 'q1', 2);
  selections = applySelection(selections, 'q1', 1);
  assert.equal(selections.q1, 1);
  for (const id of ids.slice(1)) selections = applySelection(selections, id, 1);
  const passed = buildMockResult({
    attemptId: ATTEMPT,
    rows: bank(),
    questionIds: ids,
    selections,
    elapsedSec: 120,
  });
  assert.equal(passed.score, 50);
  assert.equal(passed.passed, true);
  const changed = { ...selections, q1: 2 };
  const failed = buildMockResult({
    attemptId: ATTEMPT,
    rows: bank(),
    questionIds: ids,
    selections: changed,
    elapsedSec: 120,
  });
  assert.equal(failed.score, 49);
  assert.equal(failed.reviews[0]?.selected?.en, 'Beta');
  assert.equal(failed.reviews[0]?.correct.en, 'Alpha');
  assert.equal(failed.reviews[0]?.explanationEn, 'Official explanation q1');
  assert.equal(failed.reviews[0]?.explanationAr, 'شرح رسمي q1');
});

run('43 out of 50 passes and 42 out of 50 fails', () => {
  const rows = bank();
  const ids = rows.map((item) => item.id);
  const selections: Record<string, number | null> = {};
  ids.forEach((id, index) => {
    selections[id] = index < 43 ? 1 : 2;
  });
  const passed = buildMockResult({
    attemptId: ATTEMPT,
    rows,
    questionIds: ids,
    selections,
    elapsedSec: 1000,
  });
  assert.equal(passed.correct, 43);
  assert.equal(passed.incorrect, 7);
  assert.equal(passed.unanswered, 0);
  assert.equal(passed.passed, true);
  assert.equal(passed.percent, 86);
  assert.equal(passed.reviews.length, 7);
  assert.equal(passed.reviews.every((item) => item.outcome === 'incorrect'), true);

  ids.forEach((id, index) => {
    selections[id] = index < 42 ? 1 : 2;
  });
  const failed = buildMockResult({
    attemptId: ATTEMPT,
    rows,
    questionIds: ids,
    selections,
    elapsedSec: 1000,
  });
  assert.equal(failed.correct, 42);
  assert.equal(failed.incorrect, 8);
  assert.equal(failed.passed, false);
  assert.equal(failed.percent, 84);

  ids.forEach((id, index) => {
    selections[id] = index < 42 ? 1 : null;
  });
  const missed = buildMockResult({
    attemptId: ATTEMPT,
    rows,
    questionIds: ids,
    selections,
    elapsedSec: MOCK_DURATION_SEC + 50,
  });
  assert.equal(missed.correct, 42);
  assert.equal(missed.unanswered, 8);
  assert.equal(missed.passed, false);
  assert.equal(missed.timeTakenSec, MOCK_DURATION_SEC);
  assert.equal(missed.reviews.filter((item) => item.outcome === 'unanswered').length, 8);
  assert.equal(
    missed.reviews.every((item) => item.outcome === 'unanswered' || item.outcome === 'incorrect'),
    true
  );
  const position = reviewPosition(missed.reviews, 0);
  assert.equal(position?.kind, 'unanswered');
  assert.equal(position?.current, 1);
  assert.equal(position?.total, 8);
  const before = JSON.stringify(missed);
  assert.equal(moveReviewIndex(0, 1, missed.reviews.length), 1);
  assert.equal(JSON.stringify(missed), before);
});

run('unanswered confirmation is skipped when the timer expires', () => {
  const ids = ['a', 'b', 'c'];
  assert.equal(unansweredCount(ids, { a: 1 }), 2);
  assert.equal(needsUnansweredConfirmation(2, 'manual'), true);
  assert.equal(needsUnansweredConfirmation(2, 'timer'), false);
  assert.equal(needsUnansweredConfirmation(0, 'manual'), false);
  assert.equal(canSubmit({ submitted: false, submitting: false }), true);
  assert.equal(canSubmit({ submitted: true, submitting: false }), false);
  assert.equal(canSubmit({ submitted: false, submitting: true }), false);
});

run('submit body cannot supply the official answer', () => {
  const ids = Array.from({ length: 50 }, (_, index) => `q${index + 1}`);
  const selections = Object.fromEntries(ids.map((id) => [id, id === 'q1' ? 2 : 1]));
  const parsed = parseSubmitBody({
    attemptId: ATTEMPT,
    questionIds: ids,
    selections,
    elapsedSec: 90,
    correct_answer: 1,
    is_correct: true,
    explanation_en: 'LEAK_SENTINEL_EXPLANATION',
  });
  assert.ok(parsed);
  assert.equal(parsed?.selections.q1, 2);
  assert.equal('correct_answer' in (parsed as object), false);
  assert.equal(JSON.stringify(parsed).includes('LEAK_SENTINEL_EXPLANATION'), false);
  assert.equal(parseMockResult(parsed), null);
});

run('draft questions are not scored and active routes do not touch practice progress', () => {
  const rows = bank();
  rows[0] = row('q1', 1, { status: 'draft' });
  assert.throws(
    () =>
      buildMockResult({
        attemptId: ATTEMPT,
        rows,
        questionIds: rows.map((item) => item.id),
        selections: Object.fromEntries(rows.map((item) => [item.id, 1])),
        elapsedSec: 10,
      }),
    /Unpublished/
  );

  const page = fs.readFileSync(path.join(root, 'app/mock-test/page.tsx'), 'utf8');
  const review = fs.readFileSync(path.join(root, 'components/MockCompletedReview.tsx'), 'utf8');
  const start = fs.readFileSync(path.join(root, 'app/api/mock-test/start/route.ts'), 'utf8');
  const submit = fs.readFileSync(path.join(root, 'app/api/mock-test/submit/route.ts'), 'utf8');
  const active = page.slice(page.indexOf('data-testid="mock-active"'));
  assert.equal(page.includes('trackAttempt'), false);
  assert.equal(page.includes('useQuestionBank'), false);
  assert.equal(page.includes('keywordQuestionId'), false);
  assert.equal(page.includes('PracticeKeyword'), false);
  assert.equal(page.includes('PracticeLearningAids'), false);
  assert.equal(page.includes('PracticeExplanationHint'), false);
  assert.equal(page.includes('/api/progress'), false);
  assert.equal(page.includes('/api/keyword-cards'), false);
  assert.equal(page.includes('learner_question_progress'), false);
  assert.equal(page.includes('learner_attempt_history'), false);
  assert.equal(page.includes('data-state="correct"'), false);
  assert.equal(page.includes('data-state="wrong"'), false);
  assert.equal(page.includes('{currentQuestion.promptEn}'), true);
  assert.equal(page.includes('dir="ltr"'), true);
  assert.equal(page.includes('no hints, vocab cards, or tappable keywords'), true);
  assert.equal(page.includes('/api/mock-test/start'), true);
  assert.equal(page.includes('/api/mock-test/submit'), true);
  assert.equal(page.includes('finishTest'), true);
  assert.equal(active.includes('MockCompletedReview'), false);
  assert.equal(review.includes('<PracticeExplanationHint'), true);
  assert.equal(review.includes('<PracticeKeywordControl'), true);
  assert.equal(review.includes("mockCopy(lang, 'dvsaExplanation')"), true);
  assert.equal(review.includes('learner_question_progress'), false);
  assert.equal(start.includes("eq('status', 'published')"), true);
  assert.equal(start.includes('findAnswerLeak'), true);
  assert.equal(start.includes('explanation_en'), false);
  assert.equal(start.includes('learner_question_progress'), false);
  assert.equal(submit.includes('buildMockResult'), true);
  assert.equal(submit.includes('learner_question_progress'), false);
  assert.equal(submit.includes('learner_attempt_history'), false);
  assert.equal(submit.includes('recordPracticeAnswer'), false);
  assert.equal(mockCopy('ar', 'finishTest'), 'إنهاء الاختبار');
  assert.equal(mockCopy('en', 'hazardNote').includes('hazard perception'), true);
  assert.equal(mockCopy('en', 'passMotivation').includes('43 out of 50'), true);
});

console.log('mock exam tests passed');
