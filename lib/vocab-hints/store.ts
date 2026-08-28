'use client';

import vocabHintsData from '@/data/vocab-hints.json';
import vocabTermPlData from '@/data/vocab-term-pl.json';
import vocabTermPtData from '@/data/vocab-term-pt.json';
import vocabTermFaData from '@/data/vocab-term-fa.json';
import type { TranslationLang } from '@/lib/translations';
import type { VocabHint, VocabHintsByQuestionId } from '@/lib/vocab-hints/types';
import { translationLangToVocabLang } from '@/lib/vocab-hints/types';
import { getExplanationForLang } from '@/lib/vocab-hints/validate';

const store = vocabHintsData as unknown as VocabHintsByQuestionId;
const termPl = vocabTermPlData as Record<string, string>;
const termPt = vocabTermPtData as Record<string, string>;
const termFa = vocabTermFaData as Record<string, string>;

/** Pre-generated hints for a question (empty if none / not yet enriched). */
export function getVocabHintsForQuestion(questionId: string): VocabHint[] {
  const list = store[questionId];
  return Array.isArray(list) ? list : [];
}

export function questionHasVocabHints(questionId: string): boolean {
  return getVocabHintsForQuestion(questionId).length > 0;
}

function getDisplayTerm(hint: VocabHint, lang: ReturnType<typeof translationLangToVocabLang>): string {
  if (lang === 'pl') {
    const pl = termPl[hint.term]?.trim();
    if (pl) return pl;
  }
  if (lang === 'pt') {
    const pt = termPt[hint.term]?.trim();
    if (pt) return pt;
  }
  if (lang === 'fa') {
    const fa = termFa[hint.term]?.trim();
    if (fa) return fa;
  }
  return hint.term;
}

export function getVocabHintDisplay(
  hint: VocabHint,
  translationLang: TranslationLang
): { term: string; explanation: string; dir: 'ltr' | 'rtl' } {
  const lang = translationLangToVocabLang(translationLang);
  const explanation = getExplanationForLang(hint, lang);
  const dir = lang === 'ar' || lang === 'ur' || lang === 'fa' ? 'rtl' : 'ltr';
  return { term: getDisplayTerm(hint, lang), explanation, dir };
}
