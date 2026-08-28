import type {
  VocabHint,
  VocabHintLang,
  VocabHintTranslations,
  VocabHintsByQuestionId,
} from '@/lib/vocab-hints/types';
import { VOCAB_HINT_LANGS } from '@/lib/vocab-hints/types';

const MAX_TERM_LEN = 48;
const MAX_EXPLANATION_LEN = 160;
const MAX_HINTS_PER_QUESTION = 3;

const LEAKAGE_PATTERNS = [
  /\bcorrect answer\b/i,
  /\bright answer\b/i,
  /\byou should (always )?(choose|select|pick)\b/i,
  /\bthe answer is\b/i,
  /\bmust choose\b/i,
  /\boption [a-d]\b/i,
];

export interface QuestionContextForValidation {
  id: string;
  promptEn: string;
  options: Array<{ en: string; correct?: boolean }>;
}

export interface ValidationResult {
  ok: boolean;
  errors: string[];
  hints: VocabHint[];
}

function normalizeForMatch(s: string): string {
  return s
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[^\w\s'-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Term must appear in prompt or any option (case-insensitive, flexible punctuation). */
export function termAppearsInQuestion(
  term: string,
  ctx: QuestionContextForValidation
): boolean {
  const needle = normalizeForMatch(term);
  if (!needle || needle.length < 2) return false;
  const haystack = normalizeForMatch(
    [ctx.promptEn, ...ctx.options.map((o) => o.en)].join(' ')
  );
  return haystack.includes(needle);
}

function looksLikeLeakage(text: string, correctAnswers: string[]): boolean {
  if (LEAKAGE_PATTERNS.some((re) => re.test(text))) return true;
  const norm = normalizeForMatch(text);
  for (const ans of correctAnswers) {
    const a = normalizeForMatch(ans);
    if (a.length >= 12 && (norm.includes(a) || a.includes(norm))) {
      return true;
    }
  }
  return false;
}

function isTrivialTerm(term: string): boolean {
  const t = normalizeForMatch(term);
  const trivial = new Set([
    'you',
    'your',
    'the',
    'a',
    'an',
    'and',
    'or',
    'to',
    'of',
    'in',
    'on',
    'at',
    'for',
    'with',
    'from',
    'what',
    'when',
    'where',
    'why',
    'how',
    'should',
    'must',
    'can',
    'will',
    'do',
    'does',
    'is',
    'are',
    'be',
    'drive',
    'driving',
    'driver',
    'car',
    'road',
    'vehicle',
    'vehicles',
  ]);
  if (trivial.has(t)) return true;
  // Single very short common words
  if (t.length <= 2) return true;
  return false;
}

export function emptyTranslations(): VocabHintTranslations {
  return { en: '', ar: '', ur: '', ro: '', pl: '', pt: '', bn: '', fa: '' };
}

export function isCompleteTranslations(t: VocabHintTranslations): boolean {
  return VOCAB_HINT_LANGS.every((lang) => typeof t[lang] === 'string' && t[lang].trim().length > 0);
}

/**
 * Validate and sanitize AI (or manual) hint output for one question.
 * Returns filtered hints; ok=false if structure is unusable.
 */
export function validateQuestionVocabHints(
  raw: unknown,
  ctx: QuestionContextForValidation
): ValidationResult {
  const errors: string[] = [];

  if (raw === null || raw === undefined) {
    return { ok: true, errors: [], hints: [] };
  }

  if (!Array.isArray(raw)) {
    return { ok: false, errors: ['Hints must be a JSON array'], hints: [] };
  }

  if (raw.length > MAX_HINTS_PER_QUESTION) {
    errors.push(`Too many hints (${raw.length}); truncating to ${MAX_HINTS_PER_QUESTION}`);
  }

  const correctAnswers = ctx.options.filter((o) => o.correct).map((o) => o.en);
  const seen = new Set<string>();
  const hints: VocabHint[] = [];

  for (const item of raw.slice(0, MAX_HINTS_PER_QUESTION + 2)) {
    if (hints.length >= MAX_HINTS_PER_QUESTION) break;

    if (!item || typeof item !== 'object') {
      errors.push('Skipped non-object hint entry');
      continue;
    }

    const rec = item as Record<string, unknown>;
    const term = typeof rec.term === 'string' ? rec.term.trim() : '';
    if (!term) {
      errors.push('Skipped hint with empty term');
      continue;
    }
    if (term.length > MAX_TERM_LEN) {
      errors.push(`Term too long: "${term.slice(0, 24)}…"`);
      continue;
    }
    if (isTrivialTerm(term)) {
      errors.push(`Skipped trivial term: "${term}"`);
      continue;
    }

    const termKey = normalizeForMatch(term);
    if (seen.has(termKey)) {
      errors.push(`Duplicate term: "${term}"`);
      continue;
    }

    if (!termAppearsInQuestion(term, ctx)) {
      errors.push(`Term not found in question text: "${term}"`);
      continue;
    }

    // Prefer translations map; also accept flat en/ar/ur/ro for flexibility
    const translations: VocabHintTranslations = emptyTranslations();
    if (rec.translations && typeof rec.translations === 'object') {
      const tr = rec.translations as Record<string, unknown>;
      for (const lang of VOCAB_HINT_LANGS) {
        translations[lang] = typeof tr[lang] === 'string' ? tr[lang].trim() : '';
      }
    } else {
      for (const lang of VOCAB_HINT_LANGS) {
        translations[lang] = typeof rec[lang] === 'string' ? String(rec[lang]).trim() : '';
      }
    }

    if (!isCompleteTranslations(translations)) {
      errors.push(`Missing language explanations for term: "${term}"`);
      continue;
    }

    let tooLong = false;
    for (const lang of VOCAB_HINT_LANGS) {
      if (translations[lang].length > MAX_EXPLANATION_LEN) {
        errors.push(`Explanation too long (${lang}) for "${term}"`);
        tooLong = true;
        break;
      }
    }
    if (tooLong) continue;

    if (looksLikeLeakage(translations.en, correctAnswers)) {
      errors.push(`Possible answer leakage for term: "${term}"`);
      continue;
    }

    // Definition questions: if prompt is "What is a 'X'?" don't explain X with the answer
    const defMatch = ctx.promptEn.match(/what is (?:a |an |the )?['"]?([^'"?]+)['"]?\??/i);
    if (defMatch) {
      const defined = normalizeForMatch(defMatch[1]);
      if (defined === termKey || defined.includes(termKey) || termKey.includes(defined)) {
        errors.push(`Skipped definition-subject term (would leak answer): "${term}"`);
        continue;
      }
    }

    seen.add(termKey);
    hints.push({ term, translations });
  }

  return {
    ok: errors.length === 0 || hints.length > 0 || raw.length === 0,
    errors,
    hints,
  };
}

export function getExplanationForLang(
  hint: VocabHint,
  lang: VocabHintLang
): string {
  const localized = hint.translations[lang];
  if (typeof localized === 'string' && localized.trim()) {
    return localized;
  }
  // Never fall back to English when Polish/Portuguese text exists but was empty/whitespace-only above.
  // If missing entirely, still avoid silent English for pl/pt — return empty so UI
  // does not show an English explanation under a PL/PT session.
  if (lang === 'pl' || lang === 'pt' || lang === 'bn' || lang === 'fa') {
    return '';
  }
  return hint.translations.en || '';
}

export function countHints(store: VocabHintsByQuestionId): {
  questionsWithHints: number;
  totalHints: number;
  processedEmpty: number;
} {
  let questionsWithHints = 0;
  let totalHints = 0;
  let processedEmpty = 0;
  for (const list of Object.values(store)) {
    if (!list || list.length === 0) processedEmpty += 1;
    else {
      questionsWithHints += 1;
      totalHints += list.length;
    }
  }
  return { questionsWithHints, totalHints, processedEmpty };
}
