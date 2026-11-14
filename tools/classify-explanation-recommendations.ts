/**
 * Classify all 758 V2 questions for Explanation Card recommendations.
 * Reads licensed local-data/dvsa/staging/questions.v2.json (gitignored).
 * Writes:
 *   - data/explanation-recommendations.json (IDs + recommendations only, no licensed stems)
 *   - local-data/dvsa/staging/explanation-classification-report.json (full local report)
 *
 * Does not write to Supabase. Does not invent explanations.
 */

import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { classifyExplanationNeed } from '../lib/learning-cards/classify';
import { CLASSIFIER_VERSION, type ExplanationRecommendation } from '../lib/learning-cards/types';
import { DVSA_V2_EXPECTED_COUNT } from '../lib/questions/dvsaV2';

const root = path.join(__dirname, '..');
const sourcePath = path.join(root, 'local-data/dvsa/staging/questions.v2.json');
const bundledPath = path.join(root, 'data/explanation-recommendations.json');
const reportPath = path.join(root, 'local-data/dvsa/staging/explanation-classification-report.json');

type V2Q = {
  id: string;
  topic: string;
  promptEn: string;
  options: Array<{ en?: string; image?: string | null; correct?: boolean }>;
  explanationEn?: string;
  image?: string;
  answer_1_image_url?: string;
};

function main() {
  if (!existsSync(sourcePath)) {
    throw new Error(`Missing ${sourcePath}. Classification needs the local V2 bank.`);
  }
  const bank = JSON.parse(readFileSync(sourcePath, 'utf8'));
  const questions: V2Q[] = bank.questions || [];
  if (questions.length !== DVSA_V2_EXPECTED_COUNT) {
    throw new Error(`Expected ${DVSA_V2_EXPECTED_COUNT} questions, got ${questions.length}`);
  }
  const ids = questions.map((q) => q.id);
  const unique = new Set(ids);
  if (unique.size !== DVSA_V2_EXPECTED_COUNT) {
    throw new Error(`IDs not unique: ${unique.size}`);
  }

  const recommendations: ExplanationRecommendation[] = questions.map((q) =>
    classifyExplanationNeed({
      id: q.id,
      topic: q.topic,
      promptEn: q.promptEn,
      options: q.options || [],
      explanationEn: q.explanationEn,
      image: q.image,
    })
  );

  const byClass: Record<string, number> = {};
  const byPriority: Record<string, number> = {};
  const byTopic: Record<string, Record<string, number>> = {};
  const byFormat: Record<string, number> = {};
  for (const r of recommendations) {
    byClass[r.recommended_classification] = (byClass[r.recommended_classification] || 0) + 1;
    byPriority[r.priority] = (byPriority[r.priority] || 0) + 1;
    byFormat[r.suggested_format] = (byFormat[r.suggested_format] || 0) + 1;
    byTopic[r.topic] = byTopic[r.topic] || {};
    byTopic[r.topic][r.recommended_classification] =
      (byTopic[r.topic][r.recommended_classification] || 0) + 1;
  }

  const samples = {
    needs_explanation: recommendations
      .filter((r) => r.recommended_classification === 'needs_explanation')
      .slice(0, 8)
      .map((r) => ({
        id: r.question_id,
        topic: r.topic,
        priority: r.priority,
        format: r.suggested_format,
        rationale: r.rationale,
      })),
    image_is_enough: recommendations
      .filter((r) => r.recommended_classification === 'image_is_enough')
      .slice(0, 8)
      .map((r) => ({
        id: r.question_id,
        topic: r.topic,
        priority: r.priority,
        format: r.suggested_format,
        rationale: r.rationale,
      })),
    review_later: recommendations
      .filter((r) => r.recommended_classification === 'review_later')
      .slice(0, 8)
      .map((r) => ({
        id: r.question_id,
        topic: r.topic,
        priority: r.priority,
        format: r.suggested_format,
        rationale: r.rationale,
      })),
  };

  const bundled = {
    generated_at: new Date().toISOString(),
    classifier_version: CLASSIFIER_VERSION,
    expected_count: DVSA_V2_EXPECTED_COUNT,
    unique_ids: unique.size,
    dvsa_approved: false,
    note: 'Pedagogical recommendations only. Not DVSA-approved. Contains no official question text.',
    totals: {
      classification: byClass,
      priority: byPriority,
      format: byFormat,
    },
    by_topic: byTopic,
    recommendations,
  };

  mkdirSync(path.dirname(bundledPath), { recursive: true });
  writeFileSync(bundledPath, JSON.stringify(bundled, null, 2) + '\n', 'utf8');

  mkdirSync(path.dirname(reportPath), { recursive: true });
  writeFileSync(
    reportPath,
    JSON.stringify(
      {
        ...bundled,
        samples,
        source: 'local-data/dvsa/staging/questions.v2.json',
        licensed_stems_included: false,
        live_database_written: false,
      },
      null,
      2
    ) + '\n',
    'utf8'
  );

  console.log(
    JSON.stringify(
      {
        unique_ids: unique.size,
        totals: bundled.totals,
        bundled: bundledPath,
        report: reportPath,
      },
      null,
      2
    )
  );
}

main();
