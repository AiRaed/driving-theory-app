import type { Question } from '@/data/questions';

export type QuestionStatus = 'draft' | 'published' | 'archived';

/** ISO-ish language codes: 'ar' | 'ur' | 'fr' | … */
export type LangCode = string;

export interface QuestionTranslation {
  question: string;
  answers: [string, string, string, string]; // A–D
  explanation: string;
}

export type TranslationsMap = Record<string, QuestionTranslation>;

export interface TopicRow {
  id: string;
  label_en: string;
  label_ar: string | null;
  label_ur: string | null;
  sort_order: number;
}

export interface QuestionRow {
  id: string;
  topic_id: string;
  question_en: string;
  question_ar: string;
  question_ur: string;
  answer_1_en: string;
  answer_1_ar: string;
  answer_1_ur: string;
  answer_2_en: string;
  answer_2_ar: string;
  answer_2_ur: string;
  answer_3_en: string;
  answer_3_ar: string;
  answer_3_ur: string;
  answer_4_en: string;
  answer_4_ar: string;
  answer_4_ur: string;
  correct_answer: number;
  explanation_en: string | null;
  explanation_ar: string | null;
  explanation_ur: string | null;
  /** Extensible lang map; may be absent until migration 0005 is applied. */
  translations?: TranslationsMap | null;
  source_id?: string | null;
  keywords: Question['keywords'] | null;
  image_url: string | null;
  image_alt: string | null;
  status: QuestionStatus;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
  created_by?: string | null;
  updated_by?: string | null;
}

/**
 * Admin form: English fields + translations map.
 * Flat ar/ur convenience fields are kept for the current editor and always synced into the map on save.
 */
export interface QuestionFormData {
  id?: string;
  topic_id: string;
  question_en: string;
  answer_1_en: string;
  answer_2_en: string;
  answer_3_en: string;
  answer_4_en: string;
  correct_answer: number;
  explanation_en: string;
  translations: TranslationsMap;
  /** Convenience mirrors — synced into translations.ar / .ur */
  question_ar: string;
  question_ur: string;
  answer_1_ar: string;
  answer_1_ur: string;
  answer_2_ar: string;
  answer_2_ur: string;
  answer_3_ar: string;
  answer_3_ur: string;
  answer_4_ar: string;
  answer_4_ur: string;
  explanation_ar: string;
  explanation_ur: string;
  keywords?: Question['keywords'];
  image_url: string;
  image_alt: string;
  status: QuestionStatus;
  source_id?: string | null;
}

export const KNOWN_LANGS: Array<{ code: LangCode; label: string }> = [
  { code: 'ar', label: 'Arabic' },
  { code: 'ur', label: 'Urdu' },
  { code: 'fr', label: 'French' },
  { code: 'es', label: 'Spanish' },
  { code: 'pl', label: 'Polish' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'ro', label: 'Romanian' },
  { code: 'bn', label: 'Bengali' },
  { code: 'pa', label: 'Punjabi' },
  { code: 'zh', label: 'Chinese' },
  { code: 'hi', label: 'Hindi' },
  { code: 'so', label: 'Somali' },
];

function normalizeTranslation(t: Partial<QuestionTranslation> | null | undefined): QuestionTranslation {
  return {
    question: t?.question || '',
    answers: [
      t?.answers?.[0] || '',
      t?.answers?.[1] || '',
      t?.answers?.[2] || '',
      t?.answers?.[3] || '',
    ],
    explanation: t?.explanation || '',
  };
}

export function emptyTranslation(): QuestionTranslation {
  return normalizeTranslation({});
}

export function translationHasContent(t: QuestionTranslation | null | undefined): boolean {
  if (!t) return false;
  if (t.question?.trim()) return true;
  if (t.explanation?.trim()) return true;
  return (t.answers || []).some((a) => !!a?.trim());
}

export function getTranslation(
  map: TranslationsMap | null | undefined,
  code: LangCode
): QuestionTranslation | undefined {
  if (!map) return undefined;
  const t = map[code];
  return t ? normalizeTranslation(t) : undefined;
}

export function setTranslation(
  map: TranslationsMap,
  code: LangCode,
  t: QuestionTranslation
): TranslationsMap {
  return { ...map, [code]: normalizeTranslation(t) };
}

export function removeTranslation(map: TranslationsMap, code: LangCode): TranslationsMap {
  const next = { ...map };
  delete next[code];
  return next;
}

/** Drop empty language entries from a map. */
export function pruneTranslations(map: TranslationsMap): TranslationsMap {
  const out: TranslationsMap = {};
  for (const [code, raw] of Object.entries(map || {})) {
    const t = normalizeTranslation(raw);
    if (translationHasContent(t)) out[code] = t;
  }
  return out;
}

/**
 * Prefer row.translations when non-empty; otherwise build from flat ar/ur columns.
 */
export function rowToTranslationsMap(row: QuestionRow): TranslationsMap {
  const raw = row.translations;
  if (raw && typeof raw === 'object' && !Array.isArray(raw) && Object.keys(raw).length > 0) {
    const out: TranslationsMap = {};
    for (const [code, t] of Object.entries(raw)) {
      out[code] = normalizeTranslation(t);
    }
    return out;
  }

  const map: TranslationsMap = {};
  const ar: QuestionTranslation = {
    question: row.question_ar || '',
    answers: [
      row.answer_1_ar || '',
      row.answer_2_ar || '',
      row.answer_3_ar || '',
      row.answer_4_ar || '',
    ],
    explanation: row.explanation_ar || '',
  };
  if (translationHasContent(ar)) map.ar = ar;

  const ur: QuestionTranslation = {
    question: row.question_ur || '',
    answers: [
      row.answer_1_ur || '',
      row.answer_2_ur || '',
      row.answer_3_ur || '',
      row.answer_4_ur || '',
    ],
    explanation: row.explanation_ur || '',
  };
  if (translationHasContent(ur)) map.ur = ur;

  return map;
}

/** Flat ar/ur column payload derived from a translations map. */
export function translationsToFlat(map: TranslationsMap): {
  question_ar: string;
  question_ur: string;
  answer_1_ar: string;
  answer_1_ur: string;
  answer_2_ar: string;
  answer_2_ur: string;
  answer_3_ar: string;
  answer_3_ur: string;
  answer_4_ar: string;
  answer_4_ur: string;
  explanation_ar: string | null;
  explanation_ur: string | null;
} {
  const ar = getTranslation(map, 'ar');
  const ur = getTranslation(map, 'ur');
  return {
    question_ar: ar?.question || '',
    question_ur: ur?.question || '',
    answer_1_ar: ar?.answers[0] || '',
    answer_1_ur: ur?.answers[0] || '',
    answer_2_ar: ar?.answers[1] || '',
    answer_2_ur: ur?.answers[1] || '',
    answer_3_ar: ar?.answers[2] || '',
    answer_3_ur: ur?.answers[2] || '',
    answer_4_ar: ar?.answers[3] || '',
    answer_4_ur: ur?.answers[3] || '',
    explanation_ar: ar?.explanation?.trim() ? ar.explanation : null,
    explanation_ur: ur?.explanation?.trim() ? ur.explanation : null,
  };
}

/**
 * Sync flat ar/ur convenience fields into the translations map (preserving other langs).
 */
export function syncFlatIntoTranslations(form: QuestionFormData): TranslationsMap {
  let map: TranslationsMap = { ...(form.translations || {}) };
  map = setTranslation(map, 'ar', {
    question: form.question_ar || '',
    answers: [
      form.answer_1_ar || '',
      form.answer_2_ar || '',
      form.answer_3_ar || '',
      form.answer_4_ar || '',
    ],
    explanation: form.explanation_ar || '',
  });
  map = setTranslation(map, 'ur', {
    question: form.question_ur || '',
    answers: [
      form.answer_1_ur || '',
      form.answer_2_ur || '',
      form.answer_3_ur || '',
      form.answer_4_ur || '',
    ],
    explanation: form.explanation_ur || '',
  });
  return pruneTranslations(map);
}

/** English + flat ar/ur + translations jsonb payload for DB writes. */
export function formToDbPayload(form: QuestionFormData): Record<string, unknown> {
  const map = syncFlatIntoTranslations(form);
  const flat = translationsToFlat(map);
  return {
    topic_id: form.topic_id,
    question_en: form.question_en.trim(),
    answer_1_en: form.answer_1_en.trim(),
    answer_2_en: form.answer_2_en.trim(),
    answer_3_en: (form.answer_3_en || '').trim(),
    answer_4_en: (form.answer_4_en || '').trim(),
    correct_answer: form.correct_answer,
    explanation_en: form.explanation_en.trim() || null,
    ...flat,
    question_ar: flat.question_ar.trim(),
    question_ur: flat.question_ur.trim(),
    answer_1_ar: flat.answer_1_ar.trim(),
    answer_1_ur: flat.answer_1_ur.trim(),
    answer_2_ar: flat.answer_2_ar.trim(),
    answer_2_ur: flat.answer_2_ur.trim(),
    answer_3_ar: flat.answer_3_ar.trim(),
    answer_3_ur: flat.answer_3_ur.trim(),
    answer_4_ar: flat.answer_4_ar.trim(),
    answer_4_ur: flat.answer_4_ur.trim(),
    keywords: form.keywords || [],
    image_url: form.image_url.trim() || null,
    image_alt: form.image_alt.trim() || null,
    status: form.status,
    translations: map,
    source_id: form.source_id ?? null,
  };
}

export function langBadgeStatus(row: QuestionRow): {
  en: true;
  ar: boolean;
  ur: boolean;
  extra: string[];
} {
  const map = rowToTranslationsMap(row);
  const ar = !!(getTranslation(map, 'ar')?.question?.trim() || row.question_ar?.trim());
  const ur = !!(getTranslation(map, 'ur')?.question?.trim() || row.question_ur?.trim());
  const extra = Object.keys(map).filter(
    (code) => code !== 'ar' && code !== 'ur' && !!getTranslation(map, code)?.question?.trim()
  );
  return { en: true, ar, ur, extra };
}

/** True when the row is missing translations or required English fields. */
export function questionNeedsReview(row: QuestionRow): boolean {
  const badges = langBadgeStatus(row);
  return (
    !badges.ar ||
    !badges.ur ||
    !row.answer_1_en?.trim() ||
    !row.answer_2_en?.trim() ||
    !row.topic_id ||
    !row.correct_answer
  );
}

/** Map DB row → learner Question shape used by Practice / Mock Test. */
export function rowToLearnerQuestion(row: QuestionRow): Question {
  const map = rowToTranslationsMap(row);
  const ar = getTranslation(map, 'ar');
  // Prefer flat ar columns when set (editor live edits + always-synced writes).
  return {
    id: row.id,
    topic: row.topic_id,
    promptEn: row.question_en,
    promptAr: row.question_ar || ar?.question || '',
    options: [
      {
        en: row.answer_1_en || '',
        ar: row.answer_1_ar || ar?.answers[0] || '',
        correct: row.correct_answer === 1,
      },
      {
        en: row.answer_2_en || '',
        ar: row.answer_2_ar || ar?.answers[1] || '',
        correct: row.correct_answer === 2,
      },
      {
        en: row.answer_3_en || '',
        ar: row.answer_3_ar || ar?.answers[2] || '',
        correct: row.correct_answer === 3,
      },
      {
        en: row.answer_4_en || '',
        ar: row.answer_4_ar || ar?.answers[3] || '',
        correct: row.correct_answer === 4,
      },
    ].filter((a) => a.en.trim().length > 0),
    keywords: Array.isArray(row.keywords) ? row.keywords : [],
    image: row.image_url || undefined,
  };
}

/** Attach Urdu option strings for client translation helpers when loading from DB. */
export function rowToUrduBucket(row: QuestionRow): {
  promptUr?: string;
  options?: Array<{ ur: string }>;
} {
  const map = rowToTranslationsMap(row);
  const ur = getTranslation(map, 'ur');
  return {
    promptUr: row.question_ur || ur?.question || undefined,
    options: [
      { ur: row.answer_1_ur || ur?.answers[0] || '' },
      { ur: row.answer_2_ur || ur?.answers[1] || '' },
      { ur: row.answer_3_ur || ur?.answers[2] || '' },
      { ur: row.answer_4_ur || ur?.answers[3] || '' },
    ],
  };
}

/** Attach Romanian from translations JSONB (no flat question_ro columns). */
export function rowToRomanianBucket(row: QuestionRow): {
  promptRo?: string;
  options?: Array<{ ro: string }>;
} {
  const map = rowToTranslationsMap(row);
  const ro = getTranslation(map, 'ro');
  if (!ro || !translationHasContent(ro)) {
    return { promptRo: undefined, options: undefined };
  }
  return {
    promptRo: ro.question || undefined,
    options: [
      { ro: ro.answers[0] || '' },
      { ro: ro.answers[1] || '' },
      { ro: ro.answers[2] || '' },
      { ro: ro.answers[3] || '' },
    ],
  };
}

export function emptyQuestionForm(topicId = 'alertness'): QuestionFormData {
  return {
    topic_id: topicId,
    question_en: '',
    answer_1_en: '',
    answer_2_en: '',
    answer_3_en: '',
    answer_4_en: '',
    correct_answer: 1,
    explanation_en: '',
    translations: {},
    question_ar: '',
    question_ur: '',
    answer_1_ar: '',
    answer_1_ur: '',
    answer_2_ar: '',
    answer_2_ur: '',
    answer_3_ar: '',
    answer_3_ur: '',
    answer_4_ar: '',
    answer_4_ur: '',
    explanation_ar: '',
    explanation_ur: '',
    keywords: [],
    image_url: '',
    image_alt: '',
    status: 'draft',
    source_id: null,
  };
}

export function rowToForm(row: QuestionRow): QuestionFormData {
  const map = rowToTranslationsMap(row);
  const flat = translationsToFlat(map);
  // Prefer flat columns when present so editor stays stable pre/post migration
  return {
    id: row.id,
    topic_id: row.topic_id,
    question_en: row.question_en,
    answer_1_en: row.answer_1_en || '',
    answer_2_en: row.answer_2_en || '',
    answer_3_en: row.answer_3_en || '',
    answer_4_en: row.answer_4_en || '',
    correct_answer: row.correct_answer,
    explanation_en: row.explanation_en || '',
    translations: map,
    question_ar: row.question_ar || flat.question_ar || '',
    question_ur: row.question_ur || flat.question_ur || '',
    answer_1_ar: row.answer_1_ar || flat.answer_1_ar || '',
    answer_1_ur: row.answer_1_ur || flat.answer_1_ur || '',
    answer_2_ar: row.answer_2_ar || flat.answer_2_ar || '',
    answer_2_ur: row.answer_2_ur || flat.answer_2_ur || '',
    answer_3_ar: row.answer_3_ar || flat.answer_3_ar || '',
    answer_3_ur: row.answer_3_ur || flat.answer_3_ur || '',
    answer_4_ar: row.answer_4_ar || flat.answer_4_ar || '',
    answer_4_ur: row.answer_4_ur || flat.answer_4_ur || '',
    explanation_ar: row.explanation_ar || flat.explanation_ar || '',
    explanation_ur: row.explanation_ur || flat.explanation_ur || '',
    keywords: Array.isArray(row.keywords) ? row.keywords : [],
    image_url: row.image_url || '',
    image_alt: row.image_alt || '',
    status: row.status,
    source_id: row.source_id ?? null,
  };
}

export function validateQuestionForm(data: QuestionFormData): string | null {
  if (!data.topic_id) return 'Topic is required';
  if (!data.question_en.trim()) return 'English question is required';
  if (!data.answer_1_en.trim() || !data.answer_2_en.trim()) {
    return 'At least Answer A and B (English) are required';
  }
  if (data.correct_answer < 1 || data.correct_answer > 4) {
    return 'Select a correct answer (1–4)';
  }
  const correctEn =
    data[`answer_${data.correct_answer}_en` as keyof QuestionFormData];
  if (typeof correctEn === 'string' && !correctEn.trim()) {
    return 'Correct answer option must have English text';
  }
  if (!['draft', 'published', 'archived'].includes(data.status)) {
    return 'Invalid status';
  }
  return null;
}

export function isMissingColumnError(
  error: { message?: string; code?: string } | null | undefined,
  column: string
): boolean {
  if (!error?.message) return false;
  const msg = error.message.toLowerCase();
  const col = column.toLowerCase();
  return (
    msg.includes(col) &&
    (msg.includes('does not exist') ||
      msg.includes('schema cache') ||
      msg.includes('could not find') ||
      msg.includes('unknown column'))
  );
}

/** Target published unique count for learner DB bank gate. */
export const EXPECTED_PUBLISHED_COUNT = 742;

export const TOPIC_META: Array<{
  id: string;
  label_en: string;
  label_ar: string;
  label_ur: string;
  sort_order: number;
}> = [
  { id: 'alertness', label_en: 'Alertness', label_ar: 'الانتباه والتركيز', label_ur: 'چوکسی', sort_order: 1 },
  { id: 'attitude', label_en: 'Attitude', label_ar: 'سلوك السائق', label_ur: 'رویہ', sort_order: 2 },
  { id: 'documents', label_en: 'Documents', label_ar: 'الوثائق والرخص', label_ur: 'دستاویزات', sort_order: 3 },
  { id: 'hazard-awareness', label_en: 'Hazard Awareness', label_ar: 'التنبّه للمخاطر', label_ur: 'خطرات سے آگاہی', sort_order: 4 },
  { id: 'incidents', label_en: 'Incidents', label_ar: 'الحوادث والطوارئ', label_ur: 'حادثات', sort_order: 5 },
  { id: 'motorway-driving', label_en: 'Motorway Driving', label_ar: 'الطرق السريعة', label_ur: 'موٹر وے پر ڈرائیونگ', sort_order: 6 },
  { id: 'other-vehicles', label_en: 'Other Vehicles', label_ar: 'المركبات الأخرى', label_ur: 'دیگر گاڑیاں', sort_order: 7 },
  { id: 'road-signs', label_en: 'Road Signs', label_ar: 'إشارات الطريق', label_ur: 'سڑک کے اشارے', sort_order: 8 },
  { id: 'rules-of-the-road', label_en: 'Rules of the Road', label_ar: 'قوانين الطريق', label_ur: 'سڑک کے قواعد', sort_order: 9 },
  { id: 'safety-margins', label_en: 'Safety Margins', label_ar: 'مسافات الأمان', label_ur: 'محفوظ فاصلے', sort_order: 10 },
  { id: 'safety-vehicle', label_en: 'Safety Vehicle', label_ar: 'سلامة المركبة', label_ur: 'گاڑی کی حفاظت', sort_order: 11 },
  { id: 'vehicle-handling', label_en: 'Vehicle Handling', label_ar: 'التحكم بالمركبة', label_ur: 'گاڑی پر کنٹرول', sort_order: 12 },
  { id: 'vehicle-loading', label_en: 'Vehicle Loading', label_ar: 'تحميل المركبة', label_ur: 'گاڑی کی لوڈنگ', sort_order: 13 },
  { id: 'vulnerable-road-users', label_en: 'Vulnerable Road Users', label_ar: 'مستخدمي الطريق', label_ur: 'کمزور سڑک استعمال کرنے والے', sort_order: 14 },
];

/**
 * Completeness gate for switching learners onto the DB bank.
 * Published count must equal expectedCount; every row must have topic_id,
 * question_en, answer_1_en, answer_2_en, valid correct_answer matching a
 * non-empty English option, and topic_id in TOPIC_META.
 */
export function isDatabaseBankComplete(
  rows: QuestionRow[],
  expectedCount = EXPECTED_PUBLISHED_COUNT
): { ok: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const topicIds = new Set(TOPIC_META.map((t) => t.id));

  if (rows.length !== expectedCount) {
    reasons.push(`published count ${rows.length} !== expected ${expectedCount}`);
  }

  for (const row of rows) {
    if (!row.topic_id) {
      reasons.push(`${row.id}: missing topic_id`);
    } else if (!topicIds.has(row.topic_id)) {
      reasons.push(`${row.id}: topic_id "${row.topic_id}" not in TOPIC_META`);
    }
    if (!row.question_en?.trim()) {
      reasons.push(`${row.id}: missing question_en`);
    }
    if (!row.answer_1_en?.trim()) {
      reasons.push(`${row.id}: missing answer_1_en`);
    }
    if (!row.answer_2_en?.trim()) {
      reasons.push(`${row.id}: missing answer_2_en`);
    }
    const ca = row.correct_answer;
    if (typeof ca !== 'number' || ca < 1 || ca > 4) {
      reasons.push(`${row.id}: correct_answer not in 1..4`);
    } else {
      const key = `answer_${ca}_en` as keyof QuestionRow;
      const ans = row[key];
      if (typeof ans !== 'string' || !ans.trim()) {
        reasons.push(`${row.id}: correct answer slot ${ca} is empty`);
      }
    }
    if (reasons.length >= 40) {
      reasons.push('…truncated');
      break;
    }
  }

  return { ok: reasons.length === 0, reasons };
}
