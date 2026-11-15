/**
 * Checks for local Keyword Card drafts.
 * These checks do not read or write Supabase.
 */

import { isOfficialQuestionId } from './questionId';
import { normalizeKeywordTerm } from './rules';
import { aliasAppearsInSnippet } from './matchKeywordDrafts';
import type { KeywordDraft, KeywordDraftFile } from './draftTypes';

export interface DraftValidationInput {
  draft: KeywordDraftFile;
  officialQuestionIds: ReadonlySet<string>;
  classification: { needs_explanation: number; review_later: number; image_is_enough: number };
  hintDraftCount: number;
}

export function validateKeywordDrafts(input: DraftValidationInput): string[] {
  const errors: string[] = [];
  const { draft } = input;
  if (draft.schema !== 'lingotheory.keyword_card_drafts.v1') errors.push('Unexpected draft schema');
  if (draft.published !== false || draft.do_not_publish !== true || draft.do_not_write_database !== true) {
    errors.push('Draft file must stay unpublished and must not authorise a database write');
  }
  if (draft.status !== 'draft' || draft.arabic_pending !== true || draft.review_required !== true) {
    errors.push('Draft file metadata is not a review-only draft');
  }
  if (input.classification.needs_explanation !== 490) errors.push('needs_explanation count changed');
  if (input.classification.review_later !== 57) errors.push('review_later count changed');
  if (input.classification.image_is_enough !== 211) errors.push('image_is_enough count changed');
  if (input.hintDraftCount !== 547) errors.push(`Hint draft count changed: ${input.hintDraftCount}`);
  if (input.officialQuestionIds.size !== 758) errors.push('Official question count is not 758');

  const seenTerms = new Set<string>();
  const seenIds = new Set<string>();
  let linkCount = 0;
  const covered = new Set<string>();

  for (const keyword of draft.keywords) {
    errors.push(...validateKeyword(keyword, input.officialQuestionIds, seenTerms, seenIds));
    linkCount += keyword.links.length;
    for (const id of keyword.question_ids) covered.add(id);
    if (keyword.question_ids.length !== keyword.links.length) {
      errors.push(`${keyword.term_en} question_ids and links differ`);
    }
  }

  if (draft.keyword_count !== draft.keywords.length) errors.push('keyword_count does not match the list');
  if (draft.link_count !== linkCount) errors.push('link_count does not match the links');
  if (covered.size > input.officialQuestionIds.size) errors.push('Covered more questions than exist');
  for (const id of Array.from(covered)) {
    if (!input.officialQuestionIds.has(id)) errors.push(`Covered unknown question ${id}`);
  }
  return errors;
}

function validateKeyword(
  keyword: KeywordDraft,
  officialIds: ReadonlySet<string>,
  seenTerms: Set<string>,
  seenIds: Set<string>
): string[] {
  const errors: string[] = [];
  const label = keyword.term_en || keyword.draft_id;
  if (keyword.status !== 'draft' || keyword.published !== false) {
    errors.push(`${label} is not an unpublished draft`);
  }
  if (keyword.translation_ar !== '' || keyword.explanation_ar !== '') {
    errors.push(`${label} has Arabic text`);
  }
  if (keyword.image_url !== null || keyword.image_storage_path !== null) {
    errors.push(`${label} has an image file reference`);
  }
  if (!keyword.explanation_en.trim()) errors.push(`${label} has an empty English explanation`);
  if (keyword.term_en.length > 80) errors.push(`${label} term is too long`);
  if (keyword.explanation_en.length > 2000) errors.push(`${label} explanation is too long`);
  if (normalizeKeywordTerm(keyword.term_en) !== keyword.term_normalized) {
    errors.push(`${label} term_normalized does not match the schema rule`);
  }
  if (!keyword.term_normalized) errors.push(`${label} has an empty normalised term`);
  if (seenTerms.has(keyword.term_normalized)) errors.push(`Duplicate canonical keyword ${keyword.term_normalized}`);
  seenTerms.add(keyword.term_normalized);
  if (seenIds.has(keyword.draft_id)) errors.push(`Duplicate draft id ${keyword.draft_id}`);
  seenIds.add(keyword.draft_id);
  if (keyword.image_recommended !== Boolean(keyword.image_concept)) {
    errors.push(`${label} image recommendation does not match its image concept`);
  }
  if (keyword.review_flag && !keyword.review_concern) {
    errors.push(`${label} is flagged without a review concern`);
  }
  if (
    keyword.review_concern &&
    keyword.review_concern !== 'terminology' &&
    keyword.review_concern !== 'explanation' &&
    keyword.review_concern !== 'mapping'
  ) {
    errors.push(`${label} has an unknown review concern`);
  }
  if (!keyword.review_flag && keyword.review_concern) {
    errors.push(`${label} has a review concern but is not flagged`);
  }
  if (/[\u0600-\u06FF]/.test(keyword.explanation_en) || /[\u0600-\u06FF]/.test(keyword.term_en)) {
    errors.push(`${label} contains Arabic script`);
  }
  const pairs = new Set<string>();
  for (const link of keyword.links) {
    if (!isOfficialQuestionId(link.question_id) || !officialIds.has(link.question_id)) {
      errors.push(`${label} links unknown question ${link.question_id}`);
    }
    const pair = `${keyword.term_normalized}::${link.question_id}`;
    if (pairs.has(pair)) errors.push(`Duplicate link ${pair}`);
    pairs.add(pair);
    if (!link.evidence.length) errors.push(`${label} has no evidence for ${link.question_id}`);
    for (const item of link.evidence) {
      if (!aliasAppearsInSnippet(item.alias, item.snippet)) {
        errors.push(`${label} evidence for ${link.question_id} does not contain “${item.alias}”`);
      }
    }
  }
  return errors;
}
