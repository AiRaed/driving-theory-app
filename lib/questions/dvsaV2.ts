/**
 * Local-only DVSA Feb 2026 → LingoTheory normalized question transform + validation.
 * Does not touch Supabase. Licensed content must stay under local-data/dvsa/.
 */

export const DVSA_V2_EXPECTED_COUNT = 758;

/** Map DVSA Topic column → LingoTheory TOPIC_META id */
export const DVSA_TO_LINGO: Record<string, string> = {
  Alertness: 'alertness',
  Attitude: 'attitude',
  'Essential documents': 'documents',
  'Hazard awareness': 'hazard-awareness',
  'Incidents, accidents and emergencies': 'incidents',
  'Motorway rules': 'motorway-driving',
  'Other types of vehicle': 'other-vehicles',
  'Road and traffic signs': 'road-signs',
  'Rules of the road': 'rules-of-the-road',
  'Safety margins': 'safety-margins',
  'Safety and your vehicle': 'safety-vehicle',
  'Safety and your vehicle/motorcycle': 'safety-vehicle',
  'Vehicle handling': 'vehicle-handling',
  'Vehicle/motorcycle handling': 'vehicle-handling',
  'Vehicle loading': 'vehicle-loading',
  'Vehicle/motorcycle loading': 'vehicle-loading',
  'Vulnerable road users': 'vulnerable-road-users',
};

export const LINGO_TOPIC_IDS = [
  'alertness',
  'attitude',
  'documents',
  'hazard-awareness',
  'incidents',
  'motorway-driving',
  'other-vehicles',
  'road-signs',
  'rules-of-the-road',
  'safety-margins',
  'safety-vehicle',
  'vehicle-handling',
  'vehicle-loading',
  'vulnerable-road-users',
] as const;

export type AnswerLetter = 'A' | 'B' | 'C' | 'D';

export type DvsaRawRow = {
  Item: string;
  Topic: string;
  'Current Answer': string;
  Stem: string;
  OptionA: string;
  OptionB: string;
  OptionC: string;
  OptionD: string;
  'Expl text': string;
  'Stem.gif': string;
  'A.gif': string;
  'B.gif': string;
  'C.gif': string;
  'D.gif': string;
  'Stem HiRes': string;
  'A HiRes': string;
  'B HiRes': string;
  'C HiRes': string;
  'D HiRes': string;
};

export type DvsaStagingOption = {
  en: string;
  ar: string;
  correct: boolean;
  /** Bare DVSA media filename when this option is image-based */
  image?: string;
  imageHiRes?: string;
};

export type DvsaStagingQuestion = {
  id: string;
  topic: string;
  promptEn: string;
  promptAr: string;
  options: DvsaStagingOption[];
  keywords: [];
  /** Stem image filename (gif preferred) */
  image?: string;
  imageHiRes?: string;
  explanationEn: string;
  /** 1-based index matching admin/DB correct_answer */
  correctAnswer: number;
  source: {
    dvsaTopic: string;
    answerMarkerRaw: string;
    answerMarkerNormalized: AnswerLetter;
  };
};

export type LearnerOption = {
  en: string;
  ar: string;
  correct: boolean;
  image?: string;
};

/** Normalize DVSA answer marker (e.g. AB2846 "b" → "B") without mutating source. */
export function normalizeAnswerMarker(raw: string): AnswerLetter | null {
  const t = String(raw || '').trim().toUpperCase();
  if (t === 'A' || t === 'B' || t === 'C' || t === 'D') return t;
  return null;
}

export function optionHasContent(option: {
  en?: string | null;
  image?: string | null;
}): boolean {
  return !!(option.en && option.en.trim()) || !!(option.image && option.image.trim());
}

/**
 * Scoring uses the option.correct flag only (unchanged semantics).
 * Image vs text does not affect correctness.
 */
export function isSelectedOptionCorrect(
  options: Array<{ correct: boolean }>,
  selectedIndex: number | null | undefined
): boolean {
  if (selectedIndex == null || selectedIndex < 0 || selectedIndex >= options.length) {
    return false;
  }
  return options[selectedIndex].correct === true;
}

export function scoreAnswers(
  questions: Array<{ options: Array<{ correct: boolean }> }>,
  chosenIndices: Array<number | null | undefined>
): { correct: number; total: number; percent: number } {
  const total = questions.length;
  let correct = 0;
  for (let i = 0; i < total; i++) {
    if (isSelectedOptionCorrect(questions[i].options, chosenIndices[i])) correct++;
  }
  return {
    correct,
    total,
    percent: total === 0 ? 0 : Math.round((correct / total) * 100),
  };
}

/** Public URL path for a DVSA media filename once assets are published. */
export function dvsaMediaPublicPath(filename: string, base = '/dvsa-media'): string {
  const name = filename.replace(/^\/+/, '');
  return `${base.replace(/\/$/, '')}/${name}`;
}

export function collectImageFilenames(q: DvsaStagingQuestion): string[] {
  const names: string[] = [];
  if (q.image) names.push(q.image);
  if (q.imageHiRes) names.push(q.imageHiRes);
  for (const o of q.options) {
    if (o.image) names.push(o.image);
    if (o.imageHiRes) names.push(o.imageHiRes);
  }
  return names;
}

export function resolveMediaPresence(
  filenames: string[],
  existsFn: (filename: string) => boolean
): { resolved: string[]; unresolved: string[] } {
  const resolved: string[] = [];
  const unresolved: string[] = [];
  const seen = new Set<string>();
  for (const f of filenames) {
    if (!f || seen.has(f)) continue;
    seen.add(f);
    if (existsFn(f)) resolved.push(f);
    else unresolved.push(f);
  }
  return { resolved, unresolved };
}

function pickStemImage(row: DvsaRawRow): { image?: string; imageHiRes?: string } {
  const gif = (row['Stem.gif'] || '').trim();
  const hi = (row['Stem HiRes'] || '').trim();
  return {
    image: gif || undefined,
    imageHiRes: hi || undefined,
  };
}

function buildOptions(row: DvsaRawRow, correctLetter: AnswerLetter): DvsaStagingOption[] {
  const letters: AnswerLetter[] = ['A', 'B', 'C', 'D'];
  const texts = [row.OptionA, row.OptionB, row.OptionC, row.OptionD];
  const gifs = [row['A.gif'], row['B.gif'], row['C.gif'], row['D.gif']];
  const hires = [row['A HiRes'], row['B HiRes'], row['C HiRes'], row['D HiRes']];

  return letters.map((letter, i) => {
    const en = (texts[i] || '').trim();
    const image = (gifs[i] || '').trim() || undefined;
    const imageHiRes = (hires[i] || '').trim() || undefined;
    return {
      en,
      ar: '',
      correct: letter === correctLetter,
      ...(image ? { image } : {}),
      ...(imageHiRes ? { imageHiRes } : {}),
    };
  });
}

export type TransformRowResult =
  | { ok: true; question: DvsaStagingQuestion }
  | { ok: false; id: string; errors: string[] };

export function transformDvsaRow(row: Partial<DvsaRawRow>): TransformRowResult {
  const id = String(row.Item || '').trim();
  const errors: string[] = [];
  if (!id) {
    return { ok: false, id: '(missing)', errors: ['missing Item id'] };
  }

  const dvsaTopic = String(row.Topic || '').trim();
  const topic = DVSA_TO_LINGO[dvsaTopic];
  if (!topic) {
    errors.push(`unmapped DVSA topic "${dvsaTopic}"`);
  }

  const answerMarkerRaw = String(row['Current Answer'] || '').trim();
  const answerMarkerNormalized = normalizeAnswerMarker(answerMarkerRaw);
  if (!answerMarkerNormalized) {
    errors.push(`invalid Current Answer "${answerMarkerRaw}"`);
  }

  const promptEn = String(row.Stem || '').trim();
  if (!promptEn) {
    errors.push('missing Stem');
  }

  const explanationEn = String(row['Expl text'] || '').trim();
  if (!explanationEn) {
    errors.push('missing Expl text');
  }

  if (!answerMarkerNormalized || !topic || errors.length) {
    return { ok: false, id, errors };
  }

  const options = buildOptions(row as DvsaRawRow, answerMarkerNormalized);
  for (let i = 0; i < 4; i++) {
    if (!optionHasContent(options[i])) {
      errors.push(`option ${i + 1} has neither text nor image`);
    }
  }

  const correctCount = options.filter((o) => o.correct).length;
  if (correctCount !== 1) {
    errors.push(`expected exactly 1 correct option, got ${correctCount}`);
  }

  if (errors.length) {
    return { ok: false, id, errors };
  }

  const stem = pickStemImage(row as DvsaRawRow);
  const correctAnswer = options.findIndex((o) => o.correct) + 1;

  const question: DvsaStagingQuestion = {
    id,
    topic,
    promptEn,
    promptAr: '',
    options,
    keywords: [],
    ...(stem.image ? { image: stem.image } : {}),
    ...(stem.imageHiRes ? { imageHiRes: stem.imageHiRes } : {}),
    explanationEn,
    correctAnswer,
    source: {
      dvsaTopic,
      answerMarkerRaw,
      answerMarkerNormalized,
    },
  };

  return { ok: true, question };
}

export function stagingToLearnerQuestion(q: DvsaStagingQuestion): {
  id: string;
  topic: string;
  promptEn: string;
  promptAr: string;
  options: LearnerOption[];
  keywords: [];
  image?: string;
  explanationEn: string;
} {
  return {
    id: q.id,
    topic: q.topic,
    promptEn: q.promptEn,
    promptAr: q.promptAr,
    options: q.options.map((o) => ({
      en: o.en,
      ar: o.ar,
      correct: o.correct,
      ...(o.image ? { image: dvsaMediaPublicPath(o.image) } : {}),
    })),
    keywords: [],
    ...(q.image ? { image: dvsaMediaPublicPath(q.image) } : {}),
    explanationEn: q.explanationEn,
  };
}

export type BankValidationReport = {
  ok: boolean;
  count: number;
  uniqueIds: number;
  topicIdsUsed: string[];
  imageOptionCount: number;
  stemImageCount: number;
  normalizedAnswerMarkers: Array<{ id: string; from: string; to: string }>;
  errors: string[];
  imageFilenames: string[];
};

export function validateTransformedBank(
  questions: DvsaStagingQuestion[],
  expectedCount = DVSA_V2_EXPECTED_COUNT
): BankValidationReport {
  const errors: string[] = [];
  const ids = new Set<string>();
  const topics = new Set<string>();
  const topicAllow = new Set<string>(LINGO_TOPIC_IDS);
  const normalizedAnswerMarkers: Array<{ id: string; from: string; to: string }> = [];
  let stemImageCount = 0;
  const imageFilenames: string[] = [];

  if (questions.length !== expectedCount) {
    errors.push(`count ${questions.length} !== expected ${expectedCount}`);
  }

  for (const q of questions) {
    if (ids.has(q.id)) {
      errors.push(`duplicate id ${q.id}`);
    }
    ids.add(q.id);

    if (!topicAllow.has(q.topic)) {
      errors.push(`${q.id}: topic "${q.topic}" not in LingoTheory 14 topics`);
    }
    topics.add(q.topic);

    if (!q.promptEn?.trim()) errors.push(`${q.id}: missing promptEn`);
    if (!q.explanationEn?.trim()) errors.push(`${q.id}: missing explanationEn`);

    if (!Array.isArray(q.options) || q.options.length !== 4) {
      errors.push(`${q.id}: expected 4 options`);
    } else {
      let correctIdx = -1;
      for (let i = 0; i < 4; i++) {
        const o = q.options[i];
        if (!optionHasContent(o)) {
          errors.push(`${q.id}: option ${i + 1} empty (no text or image)`);
        }
        if (o.correct) {
          if (correctIdx >= 0) errors.push(`${q.id}: multiple correct options`);
          correctIdx = i;
        }
      }
      if (correctIdx < 0) errors.push(`${q.id}: no correct option`);
      if (q.correctAnswer !== correctIdx + 1) {
        errors.push(
          `${q.id}: correctAnswer ${q.correctAnswer} !== option index ${correctIdx + 1}`
        );
      }
    }

    if (q.image) stemImageCount++;
    imageFilenames.push(...collectImageFilenames(q));

    if (
      q.source.answerMarkerRaw !== q.source.answerMarkerNormalized &&
      q.source.answerMarkerRaw.toUpperCase() === q.source.answerMarkerNormalized
    ) {
      normalizedAnswerMarkers.push({
        id: q.id,
        from: q.source.answerMarkerRaw,
        to: q.source.answerMarkerNormalized,
      });
    }

    if (errors.length >= 80) {
      errors.push('…truncated');
      break;
    }
  }

  if (topics.size !== 14 && questions.length === expectedCount) {
    errors.push(`expected 14 mapped topics in use, got ${topics.size}`);
  }

  return {
    ok: errors.length === 0,
    count: questions.length,
    uniqueIds: ids.size,
    topicIdsUsed: Array.from(topics).sort(),
    imageOptionCount: countImageOptionQuestions(questions),
    stemImageCount,
    normalizedAnswerMarkers,
    errors,
    imageFilenames: Array.from(new Set(imageFilenames)).sort(),
  };
}

/** Questions that use image answer options (all four slots have images). */
export function countImageOptionQuestions(questions: DvsaStagingQuestion[]): number {
  return questions.filter((q) => q.options.every((o) => !!o.image)).length;
}
