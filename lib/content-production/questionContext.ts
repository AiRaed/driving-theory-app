import type { QuestionContext } from './types';

const OFFICIAL_FIELDS = [
  'id',
  'topic_id',
  'question_en',
  'explanation_en',
  'correct_answer',
  'answer_1_en',
  'answer_2_en',
  'answer_3_en',
  'answer_4_en',
  'official_locked',
] as const;

export const LOCKED_OFFICIAL_FIELDS = [
  'question_en',
  'answer_1_en',
  'answer_2_en',
  'answer_3_en',
  'answer_4_en',
  'correct_answer',
  'explanation_en',
] as const;

type QuestionsClient = {
  from: (table: string) => {
    select: (cols: string) => {
      in: (col: string, val: string[]) => PromiseLike<{ data: unknown; error: { message?: string } | null }>;
      eq: (col: string, val: unknown) => PromiseLike<{ data: unknown; error: { message?: string } | null }> & {
        maybeSingle?: () => PromiseLike<{ data: unknown; error: { message?: string } | null }>;
      };
    };
  };
};

export function rowToQuestionContext(row: Record<string, unknown>): QuestionContext {
  return {
    question_id: String(row.id),
    topic: String(row.topic_id || ''),
    question_en: String(row.question_en || ''),
    explanation_en: String(row.explanation_en || ''),
    correct_answer: Number(row.correct_answer || 1),
    answers_en: [
      String(row.answer_1_en || ''),
      String(row.answer_2_en || ''),
      String(row.answer_3_en || ''),
      String(row.answer_4_en || ''),
    ],
    official_locked: row.official_locked !== false,
  };
}

export async function loadQuestionContexts(
  client: QuestionsClient,
  ids: string[]
): Promise<QuestionContext[]> {
  if (!ids.length) return [];
  const { data, error } = await client
    .from('questions')
    .select(OFFICIAL_FIELDS.join(','))
    .in('id', ids);
  if (error) throw new Error(error.message || 'Failed to load question context');
  return ((data as Record<string, unknown>[]) || []).map(rowToQuestionContext);
}

/** Production APIs must never PATCH these fields. */
export function assertNoOfficialMutation(body: Record<string, unknown>): void {
  for (const field of LOCKED_OFFICIAL_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      throw new Error(`Official DVSA field ${field} is locked and cannot be written from content production.`);
    }
  }
}
