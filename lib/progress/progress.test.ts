import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { applyLatestAnswer, formatCompletionPercent, incorrectQuestionIds, summariseProgress } from './calculate';
import { progressCopy, progressDir } from './copy';
import { buildRetrySession, tallyRetrySession } from './retry';
import type { ProgressAnswer, ProgressQuestionRef } from './types';

function run(name: string, fn: () => void) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

const catalog: ProgressQuestionRef[] = [
  { id: 'q1', topicId: 'alertness' },
  { id: 'q2', topicId: 'alertness' },
  { id: 'q3', topicId: 'alertness' },
  { id: 'q4', topicId: 'safety-margins' },
];

function answer(
  questionId: string,
  topicId: string,
  isCorrect: boolean,
  attemptCount = 1
): ProgressAnswer {
  return { questionId, topicId, isCorrect, selectedAnswer: isCorrect ? 1 : 2, attemptCount };
}

run('a new account with no answers has zero progress', () => {
  const summary = summariseProgress(catalog, []);
  assert.equal(summary.overall.total, 4);
  assert.equal(summary.overall.answered, 0);
  assert.equal(summary.overall.correct, 0);
  assert.equal(summary.overall.incorrect, 0);
  assert.equal(summary.overall.unanswered, 4);
  assert.equal(summary.overall.completionPercent, 0);
  assert.equal(summary.overall.accuracyPercent, 0);
  assert.equal(summary.topics.alertness.total, 3);
});

run('correct and incorrect answers use the latest result only', () => {
  const summary = summariseProgress(catalog, [
    answer('q1', 'alertness', true, 2),
    answer('q2', 'alertness', false, 4),
  ]);
  assert.equal(summary.topics.alertness.answered, 2);
  assert.equal(summary.topics.alertness.correct, 1);
  assert.equal(summary.topics.alertness.incorrect, 1);
  assert.equal(summary.topics.alertness.unanswered, 1);
  assert.equal(summary.topics.alertness.completionPercent, 66.7);
  assert.equal(summary.topics.alertness.accuracyPercent, 50);
  assert.equal(summary.overall.answered, 2);
  assert.equal(summary.overall.completionPercent, 50);
});

run('repeating an answer does not increase completed questions', () => {
  const first = summariseProgress(catalog, [answer('q1', 'alertness', false, 1)]);
  const repeated = applyLatestAnswer(first ? [answer('q1', 'alertness', false, 1)] : [], answer('q1', 'alertness', false, 3));
  const summary = summariseProgress(catalog, repeated);
  assert.equal(summary.overall.answered, 1);
  assert.equal(summary.overall.incorrect, 1);
  assert.equal(repeated[0].attemptCount, 3);
});

run('a corrected answer moves from incorrect to correct without a new completion', () => {
  const answers = applyLatestAnswer(
    [answer('q1', 'alertness', false, 1)],
    answer('q1', 'alertness', true, 2)
  );
  const summary = summariseProgress(catalog, answers);
  assert.equal(summary.overall.answered, 1);
  assert.equal(summary.overall.correct, 1);
  assert.equal(summary.overall.incorrect, 0);
  assert.equal(summary.topics.alertness.completionPercent, 33.3);
});

run('a wrong answer after a correction stays incorrect without a new completion', () => {
  const corrected = applyLatestAnswer(
    [answer('q1', 'alertness', false, 1)],
    answer('q1', 'alertness', true, 2)
  );
  const wrongAgain = applyLatestAnswer(corrected, answer('q1', 'alertness', false, 3));
  const summary = summariseProgress(catalog, wrongAgain);
  assert.equal(summary.overall.answered, 1);
  assert.equal(summary.overall.correct, 0);
  assert.equal(summary.overall.incorrect, 1);
});

run('small completion totals keep one decimal place', () => {
  const bank: ProgressQuestionRef[] = Array.from({ length: 758 }, (_, index) => ({
    id: `bank-${index}`,
    topicId: 'alertness',
  }));
  const answers = [0, 1, 2].map((index) => answer(`bank-${index}`, 'alertness', true));
  const summary = summariseProgress(bank, answers);
  assert.equal(summary.overall.answered, 3);
  assert.equal(summary.overall.completionPercent, 0.4);
  assert.equal(formatCompletionPercent(summary.overall.completionPercent), '0.4');
  assert.equal(formatCompletionPercent(50), '50');
  assert.equal(formatCompletionPercent(0), '0');
  assert.equal(formatCompletionPercent(100), '100');
});

run('skipped questions stay unanswered', () => {
  const summary = summariseProgress(catalog, [answer('q4', 'safety-margins', true)]);
  assert.equal(summary.topics.alertness.answered, 0);
  assert.equal(summary.topics.alertness.unanswered, 3);
  assert.equal(summary.overall.unanswered, 3);
});

run('rows outside the active bank are ignored', () => {
  const summary = summariseProgress(catalog, [answer('retired', 'alertness', true)]);
  assert.equal(summary.overall.answered, 0);
});

run('language is not part of the progress identity', () => {
  const english = summariseProgress(catalog, [answer('q1', 'alertness', false)]);
  const arabic = summariseProgress(catalog, [answer('q1', 'alertness', true)]);
  assert.equal(english.overall.answered, 1);
  assert.equal(arabic.overall.answered, 1);
  assert.equal(arabic.overall.correct, 1);
});

run('incorrect question ids can be listed by topic or across topics', () => {
  const answers = [answer('q1', 'alertness', false), answer('q2', 'alertness', true), answer('q4', 'safety-margins', false)];
  assert.deepEqual(incorrectQuestionIds(catalog, answers, 'alertness'), ['q1']);
  assert.deepEqual(incorrectQuestionIds(catalog, answers), ['q1', 'q4']);
  assert.deepEqual(incorrectQuestionIds(catalog, [answer('retired', 'alertness', false)]), []);
});

run('english and arabic progress labels are both present', () => {
  const en = progressCopy('en');
  const ar = progressCopy('ar');
  assert.equal(en.title, 'Your Learning Progress');
  assert.ok(ar.title.length > 0);
  assert.notEqual(en.title, ar.title);
  assert.ok(ar.correct);
  assert.ok(ar.incorrect);
  assert.ok(ar.remaining);
  assert.equal(progressCopy('ur').title, en.title);
  assert.equal(en.restartTitle, 'Restart Practice');
  assert.equal(en.retryIncorrect, 'Retry Incorrect Questions ({n})');
  assert.equal(en.retryIncorrectHelp, 'Focus on the questions you got wrong.');
  assert.equal(en.retryNone, 'No incorrect questions to retry.');
  assert.equal(en.restartAll, 'Restart All Questions ({n})');
  assert.equal(en.restartAllHelp, 'Practise the entire topic again.');
  assert.equal(en.cancel, 'Cancel');
  assert.equal(en.retrySessionLabel, 'Retry Incorrect Questions');
  assert.equal(en.reviewed, 'Questions reviewed');
  assert.equal(en.corrected, 'Questions corrected during this session');
  assert.equal(en.remainingIncorrect, 'Incorrect questions remaining in this topic');
  assert.equal(en.retryRemaining, 'Retry Remaining Incorrect Questions ({n})');
  assert.equal(en.backToTopics, 'Back to Practice Topics');
  assert.equal(en.allCorrected, 'Great work! You have corrected all your incorrect answers in this topic.');
  assert.notEqual(ar.restartTitle, en.restartTitle);
  assert.ok(ar.retryNone.length > 0);
  assert.ok(ar.allCorrected.length > 0);
  assert.equal(progressDir('ar'), 'rtl');
  assert.equal(progressDir('en'), 'ltr');
});

run('a retry session stays stable after a question is corrected', () => {
  const topic = ['q1', 'q2', 'q3'];
  const session = buildRetrySession(topic, ['q3', 'q1', 'missing']);
  assert.deepEqual(session, ['q1', 'q3']);
  const corrected = tallyRetrySession(session, { q1: true });
  assert.deepEqual(session, ['q1', 'q3']);
  assert.deepEqual(corrected, { reviewed: 2, corrected: 1 });
  const wrongAgain = tallyRetrySession(session, { q1: false, q3: true });
  assert.equal(wrongAgain.corrected, 1);
  assert.equal(wrongAgain.reviewed, 2);
  assert.deepEqual(tallyRetrySession(session, {}), { reviewed: 2, corrected: 0 });
});

const root = path.resolve(__dirname, '../..');

run('migration stores latest answers, history, isolation and account deletion', () => {
  const sql = fs.readFileSync(path.join(root, 'supabase/migrations/0012_learner_progress.sql'), 'utf8');
  assert.match(sql, /PRIMARY KEY \(user_id, question_id, content_version\)/);
  assert.match(sql, /UNIQUE \(user_id, client_attempt_id\)/);
  assert.match(sql, /IF FOUND THEN/);
  assert.match(sql, /0012 stopped: attempt identity is already installed/);
  assert.match(sql, /REFERENCES auth\.users \(id\) ON DELETE CASCADE/);
  assert.match(sql, /user_id = auth\.uid\(\)/);
  assert.match(sql, /WITH CHECK \(false\)/);
  assert.match(sql, /FOR INSERT/);
  assert.match(sql, /FOR UPDATE/);
  assert.match(sql, /FOR DELETE/);
  assert.doesNotMatch(sql, /FOR ALL/);
  assert.doesNotMatch(sql, /DROP TABLE/i);
  assert.doesNotMatch(sql, /TRUNCATE/i);
  assert.doesNotMatch(sql, /DELETE FROM/i);
  assert.match(sql, /WHERE is_correct = false/);
  assert.match(sql, /q\.correct_answer = p_selected_answer/);
  assert.match(sql, /content_version = 'v2'/);
  assert.match(sql, /GRANT EXECUTE ON FUNCTION public\.record_learner_practice_answer\(uuid, text, integer, uuid\) TO service_role/);
  assert.match(sql, /FROM authenticated/);
});

run('account deletion removes progress rows', () => {
  const route = fs.readFileSync(path.join(root, 'app/api/auth/delete-account/route.ts'), 'utf8');
  assert.match(route, /learner_question_progress/);
  assert.match(route, /learner_attempt_history/);
  assert.match(route, /deleteUser\(user\.id\)/);
});

run('practice restart does not delete saved progress', () => {
  const page = fs.readFileSync(path.join(root, 'app/practice/page.tsx'), 'utf8');
  const restart = page.slice(page.indexOf('const handleRestart'), page.indexOf('const handleImageError'));
  assert.match(restart, /Session navigation only/);
  assert.doesNotMatch(restart, /learner_question_progress/);
  assert.doesNotMatch(restart, /delete\(/);
  assert.match(page, /useLearnerProgress\(\s*Boolean\(accountUserId\) && statusConfirmed,\s*accountUserId\s*\)/);
  assert.match(page, /<TopicProgressBlock/);
  assert.match(page, /<LearningProgressPanel/);
  assert.match(page, /if \(accountUserId && typeof selected\?\.sourceIndex === 'number'\)/);
  assert.match(page, /RestartPracticeModal/);
  assert.match(page, /RetrySessionSummary/);
  assert.match(page, /fetchIncorrectQuestionIds/);
  assert.match(page, /buildRetrySession/);
  assert.match(page, /questionIds: prev\.questionIds/);
  assert.match(page, /\/api\/practice\/increment-usage/);
  assert.match(page, /PaywallOverlay/);
  assert.match(page, /decidePracticePageGate/);
  const answerHandler = page.slice(page.indexOf('const handleAnswerClick'), page.indexOf('const handlePrevious'));
  assert.doesNotMatch(answerHandler, /questionIds\.filter/);
  const categories = fs.readFileSync(path.join(root, 'lib/questions/practiceCategory.ts'), 'utf8');
  const order = categories.slice(
    categories.indexOf('PRACTICE_TOPIC_ORDER'),
    categories.indexOf('] as const')
  );
  assert.equal(order.match(/'[^']+'/g)?.length, 14);
  const dashboard = fs.readFileSync(path.join(root, 'app/dashboard/DashboardClient.tsx'), 'utf8');
  assert.match(dashboard, /useLearnerProgress\(Boolean\(user\) && statusConfirmed, user\?\.id\)/);
  assert.match(dashboard, /<LearningProgressPanel/);
});

run('progress saves do not trust a client correctness flag', () => {
  const route = fs.readFileSync(path.join(root, 'app/api/progress/answer/route.ts'), 'utf8');
  assert.doesNotMatch(route, /is_correct/);
  assert.match(route, /user\.id/);
  assert.match(route, /attempt id reused/);
  const mock = fs.readFileSync(path.join(root, 'app/mock-test/page.tsx'), 'utf8');
  assert.doesNotMatch(mock, /\/api\/progress/);
  const incorrectRoute = fs.readFileSync(path.join(root, 'app/api/progress/incorrect/route.ts'), 'utf8');
  assert.match(incorrectRoute, /getUser\(\)/);
  assert.match(incorrectRoute, /user\.id/);
  assert.match(incorrectRoute, /questionIds/);
  assert.match(incorrectRoute, /Unknown topic/);
  assert.doesNotMatch(incorrectRoute, /correct_answer/);
  assert.doesNotMatch(incorrectRoute, /selected_answer/);
  const server = fs.readFileSync(path.join(root, 'lib/progress/server.ts'), 'utf8');
  const lookup = server.slice(
    server.indexOf('export async function listIncorrectQuestionIds'),
    server.indexOf('export async function recordPracticeAnswer')
  );
  assert.match(lookup, /user_id/);
  assert.match(lookup, /is_correct', false/);
  assert.match(lookup, /status', 'published'/);
  assert.match(lookup, /content_version/);
  assert.doesNotMatch(lookup, /correct_answer/);
  assert.doesNotMatch(lookup, /selected_answer/);
});

run('a reused attempt id cannot be applied to another question or answer', () => {
  const sql = fs.readFileSync(
    path.join(root, 'supabase/migrations/0013_learner_progress_attempt_identity.sql'),
    'utf8'
  );
  assert.match(sql, /CREATE OR REPLACE FUNCTION public\.record_learner_practice_answer/);
  assert.match(sql, /existing_question_id IS DISTINCT FROM q\.id/);
  assert.match(sql, /existing_answer IS DISTINCT FROM p_selected_answer/);
  assert.match(sql, /RAISE EXCEPTION 'attempt id reused'/);
  assert.match(sql, /q\.correct_answer = p_selected_answer/);
  assert.doesNotMatch(sql, /DROP TABLE/i);
  assert.doesNotMatch(sql, /TRUNCATE/i);
  assert.doesNotMatch(sql, /DELETE FROM/i);
  const server = fs.readFileSync(path.join(root, 'lib/progress/server.ts'), 'utf8');
  assert.match(server, /attempt id reused/);
  assert.match(server, /prior\.data\.question_id !== input\.questionId/);
  assert.match(server, /prior\.data\.selected_answer !== input\.selectedAnswer/);
});

console.log('progress tests passed');
