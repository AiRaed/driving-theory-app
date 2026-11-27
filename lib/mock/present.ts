import {
  dbOptionHasContent,
  getTranslation,
  rowToTranslationsMap,
  type QuestionRow,
} from '../questions/types';
import {
  findAnswerLeak,
  pickMockQuestions,
  scoreMockAttempt,
  shuffleInPlace,
  timeTakenSeconds,
  type ActiveMockOption,
  type ActiveMockQuestion,
  type MockAnswerView,
  type MockTestResult,
} from './exam';

const SENTINEL_LANGS = new Set(['ar', 'en']);

function clean(value: string | null | undefined): string {
  return typeof value === 'string' ? value.trim() : '';
}

function extraFromRow(row: QuestionRow): {
  promptExtra?: Record<string, string>;
  answers: Array<Record<string, string> | undefined>;
} {
  const map = rowToTranslationsMap(row);
  const promptExtra: Record<string, string> = {};
  const answers: Array<Record<string, string>> = [{}, {}, {}, {}];
  const urduPrompt = clean(row.question_ur) || clean(map.ur?.question);
  if (urduPrompt) promptExtra.ur = urduPrompt;
  for (let slot = 0; slot < 4; slot += 1) {
    const column = clean(row[`answer_${slot + 1}_ur` as 'answer_1_ur']);
    const fromMap = clean(map.ur?.answers[slot]);
    const text = column || fromMap;
    if (text) answers[slot].ur = text;
  }
  for (const [code, value] of Object.entries(map)) {
    if (SENTINEL_LANGS.has(code)) continue;
    const prompt = clean(value.question);
    if (prompt && !promptExtra[code]) promptExtra[code] = prompt;
    for (let slot = 0; slot < 4; slot += 1) {
      const text = clean(value.answers[slot]);
      if (text && !answers[slot][code]) answers[slot][code] = text;
    }
  }
  return {
    promptExtra: Object.keys(promptExtra).length ? promptExtra : undefined,
    answers: answers.map((entry) => (Object.keys(entry).length ? entry : undefined)),
  };
}

function optionFromRow(row: QuestionRow, slot: 1 | 2 | 3 | 4, extra?: Record<string, string>): ActiveMockOption | null {
  if (!dbOptionHasContent(row, slot)) return null;
  const en = clean(row[`answer_${slot}_en` as 'answer_1_en']);
  const ar =
    clean(row[`answer_${slot}_ar` as 'answer_1_ar']) ||
    clean(getTranslation(rowToTranslationsMap(row), 'ar')?.answers[slot - 1]);
  const image = clean(row[`answer_${slot}_image_url` as 'answer_1_image_url']) || null;
  return {
    sourceIndex: slot,
    en,
    ar,
    image,
    extra,
  };
}

export function toActiveQuestion(row: QuestionRow, random: () => number = Math.random): ActiveMockQuestion {
  const extra = extraFromRow(row);
  const map = rowToTranslationsMap(row);
  const options = ([1, 2, 3, 4] as const)
    .map((slot) => optionFromRow(row, slot, extra.answers[slot - 1]))
    .filter((option): option is ActiveMockOption => option != null);
  return {
    id: row.id,
    topic: row.topic_id,
    promptEn: row.question_en,
    promptAr: clean(row.question_ar) || clean(map.ar?.question),
    image: clean(row.image_url) || null,
    promptExtra: extra.promptExtra,
    options: shuffleInPlace(options, random),
  };
}

export function buildActiveExam(rows: QuestionRow[], random: () => number = Math.random): ActiveMockQuestion[] {
  const questions = pickMockQuestions(rows, 50, random).map((row) => toActiveQuestion(row, random));
  const leaks = findAnswerLeak(questions);
  if (leaks.length > 0) {
    throw new Error('Active mock payload included answer data');
  }
  return questions;
}

function publishedExplanationAr(row: QuestionRow): string {
  const column = clean(row.explanation_ar);
  if (column) return column;
  return clean(getTranslation(rowToTranslationsMap(row), 'ar')?.explanation);
}

function publishedExplanationExtra(row: QuestionRow): Record<string, string> | undefined {
  const map = rowToTranslationsMap(row);
  const extra: Record<string, string> = {};
  const urdu = clean(row.explanation_ur) || clean(map.ur?.explanation);
  if (urdu) extra.ur = urdu;
  for (const [code, value] of Object.entries(map)) {
    if (code === 'ar' || code === 'en' || code === 'ur') continue;
    const text = clean(value.explanation);
    if (text) extra[code] = text;
  }
  return Object.keys(extra).length ? extra : undefined;
}

function answerView(row: QuestionRow, sourceIndex: number): MockAnswerView | null {
  if (sourceIndex < 1 || sourceIndex > 4) return null;
  const built = optionFromRow(row, sourceIndex as 1 | 2 | 3 | 4, extraFromRow(row).answers[sourceIndex - 1]);
  if (!built) return null;
  return built;
}

export function buildMockResult(input: {
  attemptId: string;
  rows: QuestionRow[];
  questionIds: string[];
  selections: Record<string, number | null>;
  elapsedSec: number;
}): MockTestResult {
  const byId = new Map(input.rows.map((row) => [row.id, row]));
  const keys: Record<string, number> = {};
  for (const id of input.questionIds) {
    const row = byId.get(id);
    if (!row || row.status !== 'published') {
      throw new Error(`Unpublished or unknown question ${id}`);
    }
    keys[id] = row.correct_answer;
  }
  const scored = scoreMockAttempt({
    questionIds: input.questionIds,
    selections: input.selections,
    keys,
  });
  const reviews = scored.outcomes
    .filter((item) => item.outcome !== 'correct')
    .map((item) => {
      const row = byId.get(item.questionId)!;
      const extra = extraFromRow(row);
      const map = rowToTranslationsMap(row);
      const correct = answerView(row, item.correctSourceIndex);
      if (!correct) throw new Error(`Official answer has no content for ${row.id}`);
      const selected =
        item.outcome === 'unanswered' || item.selectedSourceIndex == null
          ? null
          : answerView(row, item.selectedSourceIndex) ?? {
              sourceIndex: item.selectedSourceIndex,
              en: '',
              ar: '',
              image: null,
            };
      return {
        questionId: row.id,
        topic: row.topic_id,
        promptEn: row.question_en,
        promptAr: clean(row.question_ar) || clean(map.ar?.question),
        promptExtra: extra.promptExtra,
        image: clean(row.image_url) || null,
        outcome: item.outcome as 'incorrect' | 'unanswered',
        selected: item.outcome === 'unanswered' ? null : selected,
        correct,
        explanationEn: clean(row.explanation_en),
        explanationAr: publishedExplanationAr(row),
        explanationExtra: publishedExplanationExtra(row),
      };
    });

  return {
    attemptId: input.attemptId,
    score: scored.correct,
    total: 50,
    passed: scored.passed,
    correct: scored.correct,
    incorrect: scored.incorrect,
    unanswered: scored.unanswered,
    percent: scored.percent,
    timeTakenSec: timeTakenSeconds(input.elapsedSec),
    passMark: 43,
    reviews,
  };
}
