/**
 * Arabic draft quality checks. Read-only: nothing here writes Supabase
 * or marks a draft as human-reviewed.
 */

import type { GlossaryEntry, TranslationIssue } from './types';

export interface OfficialEnglishQuestion {
  id: string;
  question: string;
  answers: string[];
  explanation: string;
  correctAnswer: number;
}

export interface ArabicAnswerDraft {
  id: string;
  question: string;
  answers: string[];
  explanation: string;
  review_status?: string;
  human_reviewed?: boolean;
  published?: boolean;
}

const EN_NEGATION =
  /\b(not|no|never|without|except|unless|cannot|can't|don't|doesn't|didn't|isn't|aren't|won't|mustn't|neither|nor)\b|must not|do not/i;
const AR_NEGATION =
  /لا|ليس|ليست|لست|لم|لن|غير|بدون|من دون|إلا|الا|ما عدا|باستثناء|ممنوع|يحظر|يُحظر/;
const AR_EXCEPT = /إلا|الا|ما عدا|باستثناء|ما لم/;

export function numberTokens(text: string): string[] {
  return String(text || '').match(/\d+(?:\.\d+)?/g) || [];
}

function multisetDiff(expected: string[], actual: string[]): { missing: string[]; extra: string[] } {
  const rest = [...actual];
  const missing: string[] = [];
  for (const token of expected) {
    const index = rest.indexOf(token);
    if (index === -1) missing.push(token);
    else rest.splice(index, 1);
  }
  return { missing, extra: rest };
}

function issue(
  severity: TranslationIssue['severity'],
  code: string,
  target: string,
  message: string
): TranslationIssue {
  return { severity, code, target, message };
}

export function glossaryKey(en: string): string {
  return en.trim().toLowerCase();
}

export function validateGlossary(entries: GlossaryEntry[]): TranslationIssue[] {
  const issues: TranslationIssue[] = [];
  const seenEn = new Map<string, string>();
  const seenAr = new Map<string, string>();
  for (const entry of entries) {
    const key = glossaryKey(entry.en);
    if (!entry.en.trim() || !entry.ar.trim()) {
      issues.push(issue('error', 'empty_glossary', entry.en || '(blank)', 'Glossary entry is empty'));
    }
    if (seenEn.has(key)) {
      issues.push(issue('error', 'duplicate_term', entry.en, `Duplicate glossary term also used by ${seenEn.get(key)}`));
    }
    seenEn.set(key, entry.en);
    if (entry.kind === 'keyword') {
      const previous = seenAr.get(entry.ar.trim());
      if (previous) {
        issues.push(
          issue('warning', 'duplicate_arabic', entry.en, `Same Arabic as “${previous}”. Keep one canonical form.`)
        );
      }
      seenAr.set(entry.ar.trim(), entry.en);
    }
  }
  const required = ['hard shoulder', 'dual carriageway', 'zebra crossing', 'level crossing', 'central reservation'];
  for (const term of required) {
    if (!seenEn.has(term)) {
      issues.push(issue('error', 'missing_core_term', term, 'Core driving term is missing from the glossary'));
    }
  }
  return issues;
}

interface Span {
  start: number;
  end: number;
  entry: GlossaryEntry;
}

function findGlossarySpans(english: string, entries: GlossaryEntry[]): Span[] {
  const source = english || '';
  const ranked = [...entries].sort((a, b) => b.en.length - a.en.length);
  const found: Span[] = [];
  for (const entry of ranked) {
    const phrase = entry.en.trim();
    if (phrase.length < 2 && !/^\d+$/.test(phrase)) continue;
    const pattern = new RegExp(
      `(?:^|[^A-Za-z0-9])(${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(?=$|[^A-Za-z0-9])`,
      'gi'
    );
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(source))) {
      const start = match.index + match[0].length - match[1].length;
      const end = start + match[1].length;
      found.push({ start, end, entry });
      if (match[0].length === 0) break;
    }
  }
  found.sort((a, b) => b.end - b.start - (a.end - a.start) || a.start - b.start);
  const accepted: Span[] = [];
  for (const span of found) {
    if (accepted.some((other) => span.start < other.end && other.start < span.end)) continue;
    accepted.push(span);
  }
  return accepted;
}

function foldArabic(text: string): string {
  return text
    .replace(/[ً-ْ]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ت');
}

/** Accept the canonical term, the definite form, and normal prefixes such as للـ / بـ. */
export function arabicHasGlossaryTerm(arabic: string, term: string): boolean {
  const folded = foldArabic(arabic);
  const expected = foldArabic(term);
  if (!expected) return false;
  if (folded.includes(expected)) return true;
  const bare = expected.replace(/^ال/, '');
  return bare.length >= 3 && folded.includes(bare);
}

export function terminologyWarnings(
  target: string,
  english: string,
  arabic: string,
  entries: GlossaryEntry[]
): TranslationIssue[] {
  const issues: TranslationIssue[] = [];
  const enforced = entries.filter((entry) => entry.kind === 'keyword');
  for (const span of findGlossarySpans(english, enforced)) {
    if (!arabicHasGlossaryTerm(arabic, span.entry.ar)) {
      issues.push(
        issue(
          'warning',
          'terminology',
          target,
          `“${span.entry.en}” should use the glossary form “${span.entry.ar}”`
        )
      );
    }
  }
  return issues;
}

function fieldIssues(
  target: string,
  english: string,
  arabic: string,
  entries: GlossaryEntry[],
  allowEmpty: boolean
): TranslationIssue[] {
  const issues: TranslationIssue[] = [];
  const source = english.trim();
  const translated = arabic.trim();
  if (!source && translated) {
    issues.push(issue('error', 'added_text', target, 'Arabic was added where the English source is empty'));
    return issues;
  }
  if (!source) return issues;
  if (!translated) {
    if (!allowEmpty) issues.push(issue('error', 'missing_arabic', target, 'Arabic field is empty'));
    return issues;
  }
  const numbers = multisetDiff(numberTokens(source), numberTokens(translated));
  if (numbers.missing.length || numbers.extra.length) {
    issues.push(
      issue(
        'error',
        'number_mismatch',
        target,
        `Numbers differ. Missing ${numbers.missing.join(', ') || 'none'}; extra ${numbers.extra.join(', ') || 'none'}`
      )
    );
  }
  if (EN_NEGATION.test(source)) {
    const excepts = /\bexcept\b|\bunless\b/i.test(source);
    if (excepts && !AR_EXCEPT.test(translated)) {
      issues.push(issue('warning', 'missing_exception', target, 'English exception was not detected in Arabic'));
    } else if (!AR_NEGATION.test(translated)) {
      issues.push(issue('warning', 'missing_negation', target, 'English negation was not detected in Arabic'));
    }
  }
  if (source.length > 12 && source.toLowerCase() === translated.toLowerCase() && !/^[A-Z0-9 .+-]+$/.test(source)) {
    issues.push(issue('warning', 'untranslated', target, 'Arabic matches the English text'));
  }
  issues.push(...terminologyWarnings(target, source, translated, entries));
  return issues;
}

export function validateQuestionDrafts(input: {
  official: OfficialEnglishQuestion[];
  drafts: ArabicAnswerDraft[];
  glossary: GlossaryEntry[];
}): TranslationIssue[] {
  const issues: TranslationIssue[] = [];
  if (input.official.length !== 758) {
    issues.push(issue('error', 'question_count', 'bank', `Official bank has ${input.official.length} questions, expected 758`));
  }
  const officialById = new Map(input.official.map((row) => [row.id, row]));
  const seen = new Set<string>();
  for (const draft of input.drafts) {
    if (seen.has(draft.id)) {
      issues.push(issue('error', 'duplicate_id', draft.id, 'Duplicate Arabic question draft'));
    }
    seen.add(draft.id);
    if (draft.human_reviewed !== false) {
      issues.push(issue('error', 'marked_reviewed', draft.id, 'Machine draft must stay human_reviewed false'));
    }
    if (draft.published !== false || draft.review_status !== 'draft') {
      issues.push(issue('error', 'published_draft', draft.id, 'Question draft must stay unpublished and in draft review'));
    }
    const official = officialById.get(draft.id);
    if (!official) {
      issues.push(issue('error', 'unknown_question', draft.id, 'Draft id is not an official V2 question'));
      continue;
    }
    if (draft.answers.length !== 4 || official.answers.length !== 4) {
      issues.push(issue('error', 'answer_alignment', draft.id, 'Question must keep four answers in source order'));
    }
    issues.push(
      ...fieldIssues(`${draft.id} question`, official.question, draft.question, input.glossary, false)
    );
    for (let i = 0; i < 4; i++) {
      issues.push(
        ...fieldIssues(
          `${draft.id} answer ${i + 1}`,
          official.answers[i] || '',
          draft.answers[i] || '',
          input.glossary,
          false
        )
      );
    }
    issues.push(
      ...fieldIssues(
        `${draft.id} explanation`,
        official.explanation,
        draft.explanation,
        input.glossary,
        false
      )
    );
  }
  for (const official of input.official) {
    if (!seen.has(official.id)) {
      issues.push(issue('error', 'missing_arabic', official.id, 'No Arabic draft for this official question'));
    }
  }
  return issues;
}

export interface EnglishHintSource {
  question_id: string;
  english: string;
  provisional: boolean;
}

export interface ArabicHintInput {
  question_id: string;
  arabic: string;
  provisional?: boolean;
  review_status?: string;
  human_reviewed?: boolean;
  published?: boolean;
}

export function validateHintDrafts(input: {
  english: EnglishHintSource[];
  arabic: ArabicHintInput[];
  glossary: GlossaryEntry[];
}): TranslationIssue[] {
  const issues: TranslationIssue[] = [];
  const provisional = input.english.filter((row) => row.provisional).length;
  const standard = input.english.length - provisional;
  if (input.english.length !== 547 || standard !== 490 || provisional !== 57) {
    issues.push(
      issue(
        'error',
        'hint_counts',
        'hints',
        `English hints changed: total ${input.english.length}, needs ${standard}, review_later ${provisional}`
      )
    );
  }
  const englishById = new Map(input.english.map((row) => [row.question_id, row]));
  const seen = new Set<string>();
  for (const draft of input.arabic) {
    if (seen.has(draft.question_id)) {
      issues.push(issue('error', 'duplicate_id', draft.question_id, 'Duplicate Arabic hint'));
    }
    seen.add(draft.question_id);
    if (draft.human_reviewed !== false || draft.published !== false || draft.review_status !== 'draft') {
      issues.push(issue('error', 'published_draft', draft.question_id, 'Hint translation must stay an unreviewed draft'));
    }
    const source = englishById.get(draft.question_id);
    if (!source) {
      issues.push(issue('error', 'unknown_question', draft.question_id, 'Arabic hint has no English draft'));
      continue;
    }
    if (Boolean(draft.provisional) !== source.provisional) {
      issues.push(issue('error', 'review_later_changed', draft.question_id, 'review_later flag must stay unchanged'));
    }
    issues.push(
      ...fieldIssues(`${draft.question_id} hint`, source.english, draft.arabic, input.glossary, false)
    );
  }
  for (const source of input.english) {
    if (!seen.has(source.question_id)) {
      issues.push(issue('error', 'missing_arabic', source.question_id, 'No Arabic hint draft'));
    }
  }
  return issues;
}

export interface EnglishKeywordSource {
  draft_id: string;
  term_en: string;
  term_normalized: string;
  explanation_en: string;
  image_url?: string | null;
  question_ids: string[];
}

export interface ArabicKeywordInput {
  draft_id: string;
  term_en: string;
  term_normalized: string;
  translation_ar: string;
  explanation_ar: string;
  image_url?: string | null;
  question_ids: string[];
  review_status?: string;
  human_reviewed?: boolean;
  published?: boolean;
}

export function validateKeywordTranslations(input: {
  english: EnglishKeywordSource[];
  arabic: ArabicKeywordInput[];
  glossary: GlossaryEntry[];
}): TranslationIssue[] {
  const issues: TranslationIssue[] = [];
  const glossaryByTerm = new Map(input.glossary.filter((e) => e.kind === 'keyword').map((e) => [glossaryKey(e.en), e]));
  const englishById = new Map(input.english.map((row) => [row.draft_id, row]));
  const seen = new Set<string>();
  const seenTerms = new Set<string>();
  for (const draft of input.arabic) {
    if (seen.has(draft.draft_id)) {
      issues.push(issue('error', 'duplicate_id', draft.draft_id, 'Duplicate Arabic keyword card'));
    }
    seen.add(draft.draft_id);
    const termKey = glossaryKey(draft.term_en);
    if (seenTerms.has(termKey)) {
      issues.push(issue('error', 'duplicate_term', draft.term_en, 'Arabic reuse must stay on the same canonical card'));
    }
    seenTerms.add(termKey);
    if (draft.human_reviewed !== false || draft.published !== false || draft.review_status !== 'draft') {
      issues.push(issue('error', 'published_draft', draft.term_en, 'Keyword translation must stay an unreviewed draft'));
    }
    if (!draft.translation_ar.trim() || !draft.explanation_ar.trim()) {
      issues.push(issue('error', 'empty_definition', draft.term_en || draft.draft_id, 'Arabic term or definition is empty'));
    }
    const source = englishById.get(draft.draft_id);
    if (!source) {
      issues.push(issue('error', 'unknown_keyword', draft.draft_id, 'Arabic keyword does not match an English card'));
      continue;
    }
    if (source.term_en !== draft.term_en || source.term_normalized !== draft.term_normalized) {
      issues.push(issue('error', 'term_changed', draft.term_en, 'Canonical English term must stay unchanged'));
    }
    if ((source.image_url || null) !== (draft.image_url || null)) {
      issues.push(issue('error', 'image_changed', draft.term_en, 'Existing image reference must be copied, not replaced'));
    }
    if (source.question_ids.join('|') !== draft.question_ids.join('|')) {
      issues.push(issue('error', 'links_changed', draft.term_en, 'Question links must stay on the canonical card'));
    }
    const expected = glossaryByTerm.get(termKey);
    if (!expected) {
      issues.push(issue('error', 'missing_glossary', draft.term_en, 'Keyword is missing from the glossary'));
    } else if (draft.translation_ar.trim() !== expected.ar) {
      issues.push(
        issue('error', 'terminology', draft.term_en, `Arabic term must be “${expected.ar}”`)
      );
    }
    issues.push(
      ...fieldIssues(
        `${draft.term_en} definition`,
        source.explanation_en,
        draft.explanation_ar,
        input.glossary,
        false
      ).filter((item) => item.code !== 'terminology' || !item.message.startsWith(`“${draft.term_en}”`))
    );
  }
  for (const source of input.english) {
    if (!seen.has(source.draft_id)) {
      issues.push(issue('error', 'missing_arabic', source.term_en, 'No Arabic keyword translation'));
    }
  }
  return issues;
}

export function countBySeverity(issues: TranslationIssue[]): { errors: number; warnings: number } {
  return {
    errors: issues.filter((item) => item.severity === 'error').length,
    warnings: issues.filter((item) => item.severity === 'warning').length,
  };
}
