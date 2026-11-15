/**
 * Build review-only Keyword Card drafts from the local official question bank.
 * Does not write to Supabase, does not publish, and does not edit official
 * questions, explanation classifications, or hint drafts.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { EDITORIAL_PATTERNS, KEYWORD_LEXICON, assertLexicon } from '../lib/keyword-cards/draftLexicon';
import { buildKeywordDrafts } from '../lib/keyword-cards/matchKeywordDrafts';
import { validateKeywordDrafts } from '../lib/keyword-cards/draftValidation';
import type { KeywordDraftFile, OfficialQuestionText } from '../lib/keyword-cards/draftTypes';
import { DVSA_V2_EXPECTED_COUNT } from '../lib/questions/dvsaV2';

const root = path.join(__dirname, '..');
const sourcePath = path.join(root, 'local-data/dvsa/staging/questions.v2.json');
const recommendationsPath = path.join(root, 'data/explanation-recommendations.json');
const hintDraftPath = path.join(root, 'data/explanation-hint-drafts.json');
const draftPath = path.join(root, 'data/keyword-card-drafts.json');
const auditPath = path.join(root, 'data/keyword-card-drafts-audit.json');

const IMPORT_NOTE =
  'Import only from Admin → Keyword Cards, after a human reviews this file. The importer writes status = draft and question links only. It requires an explicit confirmation, does not run on page load, and has no bulk-publish action. Do not call the status route. Arabic stays empty until the translation phase. Upload at most one image, and only after the card is accepted.';

interface V2Question {
  id: string;
  topic: string;
  promptEn?: string;
  explanationEn?: string;
  correctAnswer?: number;
  options?: Array<{ en?: string; correct?: boolean }>;
}

function correctAnswer(question: V2Question): string {
  const index = Number(question.correctAnswer || 0) - 1;
  const fromIndex = index >= 0 ? question.options?.[index]?.en : '';
  if (fromIndex) return fromIndex;
  return question.options?.find((option) => option.correct)?.en || '';
}

function loadQuestions(): OfficialQuestionText[] {
  const bank = JSON.parse(readFileSync(sourcePath, 'utf8')) as { questions?: V2Question[] };
  const questions = bank.questions || [];
  if (questions.length !== DVSA_V2_EXPECTED_COUNT) {
    throw new Error(`Expected ${DVSA_V2_EXPECTED_COUNT} questions, found ${questions.length}`);
  }
  return questions.map((question) => ({
    id: question.id,
    topic: question.topic,
    prompt: String(question.promptEn || ''),
    correctAnswer: correctAnswer(question),
    explanation: String(question.explanationEn || ''),
  }));
}

function main() {
  assertLexicon();
  const questions = loadQuestions();
  const recommendations = JSON.parse(readFileSync(recommendationsPath, 'utf8'));
  const hints = JSON.parse(readFileSync(hintDraftPath, 'utf8'));
  const classification = recommendations?.totals?.classification || {};
  const hintDraftCount = Array.isArray(hints.drafts) ? hints.drafts.length : 0;

  const keywords = buildKeywordDrafts(questions, KEYWORD_LEXICON, EDITORIAL_PATTERNS);
  const unused = KEYWORD_LEXICON.filter(
    (entry) => !keywords.some((keyword) => keyword.term_en === entry.term_en)
  ).map((entry) => entry.term_en);

  const linkCount = keywords.reduce((sum, keyword) => sum + keyword.links.length, 0);
  const draft: KeywordDraftFile = {
    schema: 'lingotheory.keyword_card_drafts.v1',
    migration_reference: '0011_keyword_cards.sql',
    status: 'draft',
    published: false,
    review_required: true,
    arabic_pending: true,
    do_not_publish: true,
    do_not_write_database: true,
    source: 'local-data/dvsa/staging/questions.v2.json',
    question_count: questions.length,
    keyword_count: keywords.length,
    link_count: linkCount,
    generated_by: 'tools/generate-keyword-card-drafts.ts',
    import_note: IMPORT_NOTE,
    keywords,
  };

  const officialQuestionIds = new Set(questions.map((question) => question.id));
  const errors = validateKeywordDrafts({
    draft,
    officialQuestionIds,
    classification: {
      needs_explanation: classification.needs_explanation,
      review_later: classification.review_later,
      image_is_enough: classification.image_is_enough,
    },
    hintDraftCount,
  });
  if (errors.length) {
    throw new Error(`Draft validation failed:\n${errors.slice(0, 30).join('\n')}`);
  }

  const covered = new Set(keywords.flatMap((keyword) => keyword.question_ids));
  const uncovered = questions.map((question) => question.id).filter((id) => !covered.has(id));
  const byPriority = { high: 0, medium: 0, low: 0 };
  let imageRecommended = 0;
  let editorialLinks = 0;
  let sourceLinks = 0;
  for (const keyword of keywords) {
    byPriority[keyword.priority] += 1;
    if (keyword.image_recommended) imageRecommended += 1;
    for (const link of keyword.links) {
      if (link.grounding === 'editorial') editorialLinks += 1;
      else sourceLinks += 1;
    }
  }

  const sampleTerms = [
    'Blind spot',
    'Box junction',
    'Hard shoulder',
    'Give way',
    'Toucan crossing',
    'SORN',
    'Aquaplaning',
    'Two-second rule',
    'Red reflective studs',
    'Contraflow',
    'Puffin crossing',
    'Noseweight',
    'Recovery position',
    'National speed limit',
    'Zigzag lines',
    'Crawler lane',
    'Rear fog lights',
    'Level crossing',
    'Dual carriageway',
    'White stick',
    'Kick-down',
    'Hatched markings',
  ];
  const sample = sampleTerms
    .map((term) => keywords.find((keyword) => keyword.term_en === term))
    .filter((keyword): keyword is NonNullable<typeof keyword> => Boolean(keyword))
    .map((keyword) => ({
      term_en: keyword.term_en,
      explanation_en: keyword.explanation_en,
      example_en: keyword.example_en,
      priority: keyword.priority,
      image_recommended: keyword.image_recommended,
      image_concept: keyword.image_concept,
      grounding: keyword.grounding,
      label_origin: keyword.label_origin,
      review_flag: keyword.review_flag,
      question_ids: keyword.question_ids,
    }));

  const merged = keywords
    .filter((keyword) => keyword.matched_forms.length > 1)
    .map((keyword) => ({
      term_en: keyword.term_en,
      matched_forms: keyword.matched_forms,
      link_count: keyword.links.length,
    }));

  const audit = {
    schema: 'lingotheory.keyword_card_draft_audit.v1',
    published: false,
    do_not_write_database: true,
    source_of_terms: {
      source_grounded:
        'The phrase, or an inflection of the same concept, appears in the official prompt, correct answer, or explanation.',
      editorial:
        'The canonical name or the question link was inferred. Every editorial item is review_flag true and is listed separately.',
    },
    summary: {
      unique_keywords: keywords.length,
      lexicon_entries: KEYWORD_LEXICON.length,
      lexicon_entries_with_no_match: unused,
      priority: byPriority,
      image_recommended: imageRecommended,
      text_only: keywords.length - imageRecommended,
      official_questions: questions.length,
      questions_with_a_keyword: covered.size,
      questions_with_no_keyword: uncovered.length,
      keyword_question_links: linkCount,
      source_links: sourceLinks,
      editorial_links: editorialLinks,
      duplicate_candidate_groups_merged: merged.length,
      review_flag_count: keywords.filter((keyword) => keyword.review_flag).length,
    },
    duplicate_candidates_merged: merged,
    ambiguous_terms: keywords
      .filter((keyword) => keyword.review_flag)
      .map((keyword) => ({
        term_en: keyword.term_en,
        review_note: keyword.review_note,
        review_concern: keyword.review_concern,
        previous_explanation_en: keyword.previous_explanation_en,
        label_origin: keyword.label_origin,
        grounding: keyword.grounding,
        link_count: keyword.links.length,
        question_ids: keyword.question_ids,
      })),
    potentially_overbroad_or_suspicious: keywords
      .filter((keyword) => keyword.watch_coverage || keyword.links.length >= 40 || keyword.grounding !== 'source')
      .map((keyword) => ({
        term_en: keyword.term_en,
        link_count: keyword.links.length,
        watch_coverage: keyword.watch_coverage,
        grounding: keyword.grounding,
        reason: keyword.grounding !== 'source'
          ? 'Includes an editorially inferred link.'
          : 'High coverage. Links follow the words, but a reviewer should confirm the card is not too broad.',
        sample_question_ids: keyword.question_ids.slice(0, 8),
      })),
    editorial_links: keywords.flatMap((keyword) =>
      keyword.links
        .filter((link) => link.grounding === 'editorial')
        .map((link) => ({
          term_en: keyword.term_en,
          question_id: link.question_id,
          evidence: link.evidence,
        }))
    ),
    questions_with_no_keyword: uncovered,
    sample,
    untouched: {
      official_questions: questions.length,
      needs_explanation: classification.needs_explanation,
      review_later: classification.review_later,
      image_is_enough: classification.image_is_enough,
      hint_drafts: hintDraftCount,
    },
    import_later: IMPORT_NOTE,
  };

  writeFileSync(draftPath, `${JSON.stringify(draft, null, 2)}\n`);
  writeFileSync(auditPath, `${JSON.stringify(audit, null, 2)}\n`);
  console.log(
    JSON.stringify(
      {
        keywords: keywords.length,
        links: linkCount,
        covered: covered.size,
        uncovered: uncovered.length,
        priority: byPriority,
        image_recommended: imageRecommended,
        text_only: keywords.length - imageRecommended,
        unused,
      },
      null,
      2
    )
  );
}

main();
