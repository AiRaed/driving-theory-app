/**
 * Admin review snapshot. Read-only. Does not publish or write the database.
 */

import {
  auditExistingArabic,
  loadArabicHintDrafts,
  loadArabicKeywordDrafts,
  loadArabicQuestionDrafts,
  loadEnglishHints,
  loadEnglishKeywords,
  loadGlossaryEntries,
  loadOfficialV2Questions,
} from './loadDrafts';
import { countBySeverity, validateGlossary, validateHintDrafts, validateKeywordTranslations, validateQuestionDrafts } from './validate';
import type { TranslationIssue } from './types';

function topIssues(issues: TranslationIssue[], limit = 40): TranslationIssue[] {
  return [...issues].sort((a, b) => (a.severity === b.severity ? 0 : a.severity === 'error' ? -1 : 1)).slice(0, limit);
}

export function buildArabicReview() {
  const glossary = loadGlossaryEntries();
  const glossaryIssues = validateGlossary(glossary);
  const official = loadOfficialV2Questions();
  const questionDraft = loadArabicQuestionDrafts();
  const englishHints = loadEnglishHints();
  const hintDraft = loadArabicHintDrafts();
  const englishKeywords = loadEnglishKeywords();
  const keywordDraft = loadArabicKeywordDrafts();

  const questionIssues =
    official && questionDraft
      ? validateQuestionDrafts({
          official,
          drafts: questionDraft.questions,
          glossary,
        })
      : [];
  const hintIssues = hintDraft
    ? validateHintDrafts({
        english: englishHints,
        arabic: hintDraft.drafts,
        glossary,
      })
    : [];
  const keywordIssues = keywordDraft
    ? validateKeywordTranslations({
        english: englishKeywords,
        arabic: keywordDraft.keywords,
        glossary,
      })
    : [];

  return {
    generated_from: 'local drafts',
    writes_database: false,
    human_reviewed: false,
    existing: auditExistingArabic(),
    glossary: {
      entries: glossary.length,
      keyword_entries: glossary.filter((entry) => entry.kind === 'keyword').length,
      ...countBySeverity(glossaryIssues),
      issues: topIssues(glossaryIssues),
    },
    questions: {
      official: official?.length || 0,
      prepared: questionDraft?.questions.length || 0,
      file_present: Boolean(questionDraft),
      published: false,
      ...countBySeverity(questionIssues),
      issues: topIssues(questionIssues),
    },
    hints: {
      english: englishHints.length,
      prepared: hintDraft?.drafts.length || 0,
      review_later: englishHints.filter((row) => row.provisional).length,
      needs_explanation: englishHints.filter((row) => !row.provisional).length,
      file_present: Boolean(hintDraft),
      published: false,
      ...countBySeverity(hintIssues),
      issues: topIssues(hintIssues),
    },
    keywords: {
      english: englishKeywords.length,
      prepared: keywordDraft?.keywords.length || 0,
      file_present: Boolean(keywordDraft),
      published: false,
      ...countBySeverity(keywordIssues),
      issues: topIssues(keywordIssues),
    },
    next_steps: [
      'Review drafts in this screen. Nothing here is published.',
      'A person must approve each item before human_reviewed can be set. Do not mark these drafts as reviewed automatically.',
      'Question Arabic lives in local-data and is separate from the official English columns.',
      'Hint Arabic is a separate draft from the official DVSA explanation. Keep review_later items provisional.',
      'Keyword Arabic belongs on the existing canonical card. Do not create a second card.',
      'After approval, import during an approved window. Do not bulk-publish.',
    ],
  };
}
