/** Official DVSA item ids are stored on questions.id, for example AB2243. */
const OFFICIAL_QUESTION_ID = /^[A-Z]{2}\d{3,5}[a-z]?$/;

export function normalizeOfficialQuestionId(value: string): string {
  return String(value || '').trim().toUpperCase();
}

export function isOfficialQuestionId(value: string): boolean {
  return OFFICIAL_QUESTION_ID.test(normalizeOfficialQuestionId(value));
}
