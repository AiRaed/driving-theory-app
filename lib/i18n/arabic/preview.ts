/**
 * Development-only overlay of unreviewed Arabic drafts.
 * Production uses stored Arabic fields only. This module never writes
 * Supabase and never reads the V1 question backup.
 */

import {
  loadArabicHintDrafts,
  loadArabicKeywordDrafts,
  loadArabicQuestionDrafts,
} from './loadDrafts';
import type { ArabicHintDraft, ArabicKeywordDraft, ArabicQuestionDraft } from './types';

export type ArabicPreviewReview = 'approved' | 'draft';

/** Same key as keywords.term_normalized. Kept local so this file stays free of app aliases. */
function keywordTermKey(term: string): string {
  return String(term || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

export function isArabicDraftPreviewEnabled(): boolean {
  return (
    process.env.NODE_ENV === 'development' &&
    process.env.RENDER !== 'true' &&
    process.env.ARABIC_DRAFT_PREVIEW !== '0'
  );
}

let questionDrafts: Map<string, ArabicQuestionDraft> | null = null;
let hintDrafts: Map<string, ArabicHintDraft> | null = null;
let keywordDrafts: Map<string, ArabicKeywordDraft> | null = null;

function questionsById(): Map<string, ArabicQuestionDraft> {
  if (!questionDrafts) {
    questionDrafts = new Map();
    for (const draft of loadArabicQuestionDrafts()?.questions || []) {
      if (draft.id && !questionDrafts.has(draft.id)) questionDrafts.set(draft.id, draft);
    }
  }
  return questionDrafts;
}

function hintsByQuestion(): Map<string, ArabicHintDraft> {
  if (!hintDrafts) {
    hintDrafts = new Map();
    for (const draft of loadArabicHintDrafts()?.drafts || []) {
      if (draft.question_id && !hintDrafts.has(draft.question_id)) {
        hintDrafts.set(draft.question_id, draft);
      }
    }
  }
  return hintDrafts;
}

function keywordsByTerm(): Map<string, ArabicKeywordDraft> {
  if (!keywordDrafts) {
    keywordDrafts = new Map();
    for (const draft of loadArabicKeywordDrafts()?.keywords || []) {
      const key = draft.term_normalized || keywordTermKey(draft.term_en);
      if (key && !keywordDrafts.has(key)) keywordDrafts.set(key, draft);
    }
  }
  return keywordDrafts;
}

export interface QuestionArabicShape {
  id: string;
  promptEn: string;
  promptAr: string;
  options: Array<{ en: string; ar: string; correct: boolean }>;
  arabicReview?: ArabicPreviewReview;
}

/**
 * Fills empty Arabic fields from one prepared draft.
 * Stored Arabic wins. English text, correctness and ids stay as they are.
 */
export function overlayQuestionArabic<T extends QuestionArabicShape>(
  question: T,
  draft: { question: string; answers: string[] } | null,
  sourceEnglish: string[]
): T & { arabicReview?: ArabicPreviewReview } {
  const hasStoredArabic =
    question.promptAr.trim().length > 0 ||
    question.options.some((option) => option.ar.trim().length > 0);
  if (hasStoredArabic || !draft) return question;
  const used = new Set<number>();
  return {
    ...question,
    promptEn: question.promptEn,
    promptAr: draft.question,
    options: question.options.map((option) => {
      if (!option.en.trim()) {
        return { ...option, en: option.en, correct: option.correct };
      }
      const index = sourceEnglish.findIndex(
        (english, position) => !used.has(position) && english.trim() === option.en.trim()
      );
      if (index >= 0) used.add(index);
      return {
        ...option,
        en: option.en,
        correct: option.correct,
        ar: index >= 0 ? draft.answers[index] || '' : option.ar,
      };
    }),
    arabicReview: 'draft',
  };
}

export function applyDevelopmentQuestionArabic<T extends QuestionArabicShape>(
  question: T,
  sourceEnglish: string[]
): T & { arabicReview?: ArabicPreviewReview } {
  if (!isArabicDraftPreviewEnabled()) return question;
  const draft = questionsById().get(question.id);
  if (!draft) return question;
  return overlayQuestionArabic(question, draft, sourceEnglish);
}

export function developmentHintArabic(questionId: string): string {
  if (!isArabicDraftPreviewEnabled()) return '';
  return String(hintsByQuestion().get(questionId)?.arabic || '').trim();
}

export function chooseExplanationArabic(input: {
  publishedArabic?: string | null;
  publishedLanguage?: string | null;
  fallback: boolean;
  questionId: string;
}): { explanation_ar: string | null; arabic_review: ArabicPreviewReview | null } {
  const approved =
    input.publishedLanguage === 'ar' && !input.fallback
      ? String(input.publishedArabic || '').trim()
      : '';
  if (approved) return { explanation_ar: approved, arabic_review: 'approved' };
  const draft = developmentHintArabic(input.questionId);
  if (draft) return { explanation_ar: draft, arabic_review: 'draft' };
  return { explanation_ar: null, arabic_review: null };
}

export interface KeywordArabicShape {
  term_en: string;
  translation_ar?: string | null;
  explanation_ar?: string | null;
  arabic_review?: ArabicPreviewReview;
}

export function overlayKeywordArabic<T extends KeywordArabicShape>(
  card: T,
  draft: { translation_ar: string; explanation_ar: string } | null
): T & { arabic_review?: ArabicPreviewReview } {
  if (String(card.translation_ar || '').trim() || String(card.explanation_ar || '').trim()) {
    return card;
  }
  if (!draft) return card;
  return {
    ...card,
    translation_ar: draft.translation_ar,
    explanation_ar: draft.explanation_ar,
    arabic_review: 'draft',
  };
}

export function applyDevelopmentKeywordArabic<T extends KeywordArabicShape>(
  card: T
): T & { arabic_review?: ArabicPreviewReview } {
  if (!isArabicDraftPreviewEnabled()) return card;
  const draft = keywordsByTerm().get(keywordTermKey(card.term_en));
  if (!draft) return card;
  return overlayKeywordArabic(card, draft);
}

export interface ArabicActivationPlan {
  writes_database: false;
  executed: false;
  human_reviewed: false;
  questions: { prepared: number; marked_reviewed: number; target: string };
  hints: {
    prepared: number;
    needs_explanation: number;
    review_later: number;
    marked_reviewed: number;
    target: string;
  };
  keywords: { prepared: number; marked_reviewed: number; target: string };
  steps: string[];
}

/** Read-only description of a future activation. It does not connect or write. */
export function planArabicActivation(): ArabicActivationPlan {
  const questions = loadArabicQuestionDrafts()?.questions || [];
  const hints = loadArabicHintDrafts();
  const hintRows = hints?.drafts || [];
  const keywords = loadArabicKeywordDrafts()?.keywords || [];
  return {
    writes_database: false,
    executed: false,
    human_reviewed: false,
    questions: {
      prepared: questions.length,
      marked_reviewed: questions.filter((row) => row.human_reviewed !== false).length,
      target: 'questions.question_ar, answer_1_ar–answer_4_ar, explanation_ar, translations.ar',
    },
    hints: {
      prepared: hintRows.length,
      needs_explanation: hints?.needs_explanation ?? hintRows.filter((row) => !row.provisional).length,
      review_later: hints?.review_later ?? hintRows.filter((row) => row.provisional).length,
      marked_reviewed: hintRows.filter((row) => row.human_reviewed !== false).length,
      target: 'explanation_cards where language = ar, status stays draft',
    },
    keywords: {
      prepared: keywords.length,
      marked_reviewed: keywords.filter((row) => row.human_reviewed !== false).length,
      target: 'keywords.translation_ar and keywords.explanation_ar on the existing row',
    },
    steps: [
      'Review each draft in /admin/translations. Leave human_reviewed false until a person reviews it.',
      'Do not add a migration. The Arabic columns and explanation_cards language key already exist.',
      'After review, copy question Arabic onto the same question id. Do not change question_en, answer English, correct_answer, or status.',
      'Add Arabic explanation hints as explanation_cards with language=ar and status=draft. Keep the 57 review_later hints provisional.',
      'Copy keyword Arabic onto the existing keyword row. Leave that row draft until it is approved.',
      'Publish one question or card at a time with the existing admin action. Do not bulk-publish.',
      'Do not copy V1 Arabic onto V2 question ids. Production then reads only the stored approved fields.',
    ],
  };
}
