/**
 * Build unreviewed English hint drafts from the local V2 bank.
 * Writes teaching text for needs_explanation and provisional text for
 * review_later. Does not write to Supabase, does not publish, and does
 * not change official questions or classifications.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { composeGroundedHint } from '../lib/learning-cards/groundedDraft';
import { hintPresentation } from '../lib/learning-cards/hints';
import { CLASSIFIER_VERSION } from '../lib/learning-cards/types';
import { DVSA_V2_EXPECTED_COUNT } from '../lib/questions/dvsaV2';

const root = path.join(__dirname, '..');
const sourcePath = path.join(root, 'local-data/dvsa/staging/questions.v2.json');
const recommendationsPath = path.join(root, 'data/explanation-recommendations.json');
const outPath = path.join(root, 'data/explanation-hint-drafts.json');
const PROVISIONAL_LABEL = 'Provisional — Needs Human Review';

type V2Q = {
  id: string;
  topic: string;
  promptEn: string;
  options: Array<{ en?: string; correct?: boolean }>;
  explanationEn?: string;
  correctAnswer?: number;
};

type Rec = {
  question_id: string;
  recommended_classification: string;
  suggested_format: string;
};

function correctAnswer(q: V2Q): string {
  const index = Number(q.correctAnswer || 0) - 1;
  const fromIndex = index >= 0 ? q.options?.[index]?.en : '';
  if (fromIndex) return fromIndex;
  return q.options?.find((option) => option.correct)?.en || '';
}

function main() {
  if (!existsSync(sourcePath)) throw new Error(`Missing ${sourcePath}`);
  if (!existsSync(recommendationsPath)) throw new Error(`Missing ${recommendationsPath}`);
  const bank = JSON.parse(readFileSync(sourcePath, 'utf8'));
  const questions: V2Q[] = bank.questions || [];
  if (questions.length !== DVSA_V2_EXPECTED_COUNT) {
    throw new Error(`Expected ${DVSA_V2_EXPECTED_COUNT}, got ${questions.length}`);
  }
  const recommendations = JSON.parse(readFileSync(recommendationsPath, 'utf8'));
  const recs: Rec[] = recommendations.recommendations || [];
  if (recs.length !== DVSA_V2_EXPECTED_COUNT) {
    throw new Error(`Expected ${DVSA_V2_EXPECTED_COUNT} recommendations, got ${recs.length}`);
  }
  const recById = new Map(recs.map((rec) => [rec.question_id, rec]));
  const classCounts = { needs_explanation: 0, review_later: 0, image_is_enough: 0, other: 0 };
  for (const rec of recs) {
    if (rec.recommended_classification in classCounts) {
      classCounts[rec.recommended_classification as keyof typeof classCounts] += 1;
    } else classCounts.other += 1;
  }
  if (
    classCounts.needs_explanation !== 490 ||
    classCounts.review_later !== 57 ||
    classCounts.image_is_enough !== 211
  ) {
    throw new Error(`Classification counts changed: ${JSON.stringify(classCounts)}`);
  }

  const previous = existsSync(outPath) ? JSON.parse(readFileSync(outPath, 'utf8')) : { drafts: [] };
  const previousEnglish = new Map<string, string>(
    (previous.drafts || []).map((draft: { question_id: string; english: string }) => [
      draft.question_id,
      draft.english,
    ])
  );

  const selected: Array<{
    id: string;
    format: string;
    english: string;
    rule_id: string;
    provisional: boolean;
  }> = [];

  for (const q of questions) {
    const rec = recById.get(q.id);
    if (!rec) throw new Error(`No recommendation for ${q.id}`);
    const provisional = rec.recommended_classification === 'review_later';
    if (rec.recommended_classification !== 'needs_explanation' && !provisional) continue;
    const answer = correctAnswer(q);
    let draft;
    try {
      draft = composeGroundedHint({
        prompt: String(q.promptEn || ''),
        explanation: String(q.explanationEn || ''),
        correctAnswer: answer,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`${q.id}: ${message}`);
    }
    selected.push({
      id: q.id,
      format: rec.suggested_format,
      english: draft.english,
      rule_id: draft.rule_id,
      provisional,
    });
  }

  const byRule = new Map<string, string[]>();
  for (const row of selected) {
    const list = byRule.get(row.rule_id) || [];
    list.push(row.id);
    byRule.set(row.rule_id, list);
  }

  const presentation = { text: 0, text_image: 0, text_video: 0 };
  let corrected = 0;
  let unchanged = 0;
  let provisionalCreated = 0;
  const drafts = selected.map((row) => {
    const presentationKey = hintPresentation(row.format);
    presentation[presentationKey] += 1;
    const linked = (byRule.get(row.rule_id) || []).filter((id) => id !== row.id).sort();
    const previousText = previousEnglish.get(row.id);
    if (row.provisional) provisionalCreated += 1;
    else if (previousText && previousText !== row.english) corrected += 1;
    else if (previousText === row.english) unchanged += 1;
    return {
      question_id: row.id,
      english: row.english,
      rule_id: row.rule_id,
      presentation: presentationKey,
      suggested_format: row.format,
      linked_question_ids: linked.length >= 1 && linked.length <= 12 ? linked : [],
      review_status: row.provisional ? 'provisional' : 'unreviewed',
      provisional: row.provisional,
      review_label: row.provisional ? PROVISIONAL_LABEL : null,
      dvsa_approved: false,
      published: false,
    };
  });

  const payload = {
    generated_at: new Date().toISOString(),
    classifier_version: CLASSIFIER_VERSION,
    dvsa_approved: false,
    published: false,
    review_required: true,
    note: 'Editable teaching drafts for admin review. needs_explanation drafts are unreviewed suggestions. review_later drafts are provisional and stay hidden until an admin accepts and saves one. Nothing here is published. Official DVSA wording is not copied.',
    count: drafts.length,
    coverage: {
      needs_explanation: drafts.filter((draft) => !draft.provisional).length,
      review_later: drafts.filter((draft) => draft.provisional).length,
      image_is_enough: 0,
    },
    presentation,
    drafts,
  };
  writeFileSync(outPath, JSON.stringify(payload, null, 2));
  console.log(
    JSON.stringify(
      {
        count: drafts.length,
        coverage: payload.coverage,
        presentation,
        corrected,
        unchanged,
        provisionalCreated,
        linkedGroups: Array.from(byRule.values()).filter((ids) => ids.length > 1).length,
      },
      null,
      2
    )
  );
}

main();
