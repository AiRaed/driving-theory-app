/**
 * Admin-triggered content-production seed plan.
 *
 * Groups 758 recommendations with official stems. Preview never writes.
 * Production never falls back to 71-group coarse grouping.
 */

import type { ExplanationRecommendation } from '../learning-cards/types';
import { groupRecommendations } from './concepts';
import type { QuestionHint } from './conceptFamilies';
import { inspectOfficialHints, inspectOfficialQuestionRows } from './officialHints';
import type { ConceptGroup, ProductionTask } from './types';

export const COARSE_GROUP_COUNT = 71;
export const EXPECTED_REFINED_GROUP_COUNT = 307;
export const EXPECTED_RECOMMENDATION_COUNT = 758;

export interface DuplicateCoverageRow {
  question_id: string;
  existing_concept_key: string;
  existing_task_id: string;
  new_concept_key: string;
}

export interface SeedPlan {
  ok: boolean;
  wrote: false;
  error: string | null;
  group_count: number;
  expected_refined_group_count: number;
  coarse_group_count: number;
  coarse_grouping: boolean;
  recommendation_count: number;
  questions_covered: number;
  missing_ids: string[];
  incomplete_stems: string[];
  mismatched_versions: string[];
  duplicate_coverage: DuplicateCoverageRow[];
  would_create: number;
  would_skip_existing_key: number;
  would_skip_duplicate_coverage: number;
  create_groups: ConceptGroup[];
  source: 'supabase_official' | 'explicit_hints';
}

function coveredIndex(existingTasks: ProductionTask[]): Map<string, { concept_key: string; task_id: string }> {
  const map = new Map<string, { concept_key: string; task_id: string }>();
  for (const task of existingTasks) {
    for (const qid of task.question_ids) {
      if (!map.has(qid)) {
        map.set(qid, { concept_key: task.concept_key, task_id: task.id });
      }
    }
  }
  return map;
}

export function buildSeedPlan(input: {
  recs: ExplanationRecommendation[];
  hints: Record<string, QuestionHint>;
  officialRows?: Array<Record<string, unknown>>;
  existingTasks?: ProductionTask[];
  requireOfficialStems?: boolean;
  source?: SeedPlan['source'];
}): SeedPlan {
  const recs = input.recs;
  const ids = recs.map((r) => r.question_id);
  const audited = input.officialRows
    ? inspectOfficialQuestionRows(ids, input.officialRows)
    : {
        ...inspectOfficialHints(ids, input.hints),
        mismatched_versions: [] as string[],
        hints: input.hints,
      };
  const missing_ids = audited.missing_ids;
  const incomplete_stems = audited.incomplete_stems;
  const mismatched_versions = audited.mismatched_versions;
  const hints = audited.hints;
  const requireOfficial = input.requireOfficialStems === true;
  const officialComplete =
    missing_ids.length === 0 && incomplete_stems.length === 0 && mismatched_versions.length === 0;
  const base = {
    wrote: false as const,
    expected_refined_group_count: EXPECTED_REFINED_GROUP_COUNT,
    coarse_group_count: COARSE_GROUP_COUNT,
    recommendation_count: recs.length,
    missing_ids,
    incomplete_stems,
    mismatched_versions,
    source: input.source || 'explicit_hints',
  };

  if (requireOfficial && !officialComplete) {
    const versionError = mismatched_versions.length
      ? 'Official questions are missing content_version=v2. Production seed refuses V1 substitution.'
      : 'Official V2 question stems are missing or incomplete. Production seed refuses coarse grouping.';
    return {
      ...base,
      ok: false,
      error: versionError,
      group_count: 0,
      coarse_grouping: true,
      questions_covered: 0,
      duplicate_coverage: [],
      would_create: 0,
      would_skip_existing_key: 0,
      would_skip_duplicate_coverage: 0,
      create_groups: [],
    };
  }

  const groups = groupRecommendations(recs, officialComplete ? hints : {});
  const covered = new Set(groups.flatMap((g) => g.question_ids));
  const fullBank = recs.length >= EXPECTED_RECOMMENDATION_COUNT;
  const coarse_grouping = fullBank && groups.length <= COARSE_GROUP_COUNT;
  if (
    requireOfficial &&
    fullBank &&
    (groups.length !== EXPECTED_REFINED_GROUP_COUNT || covered.size !== EXPECTED_RECOMMENDATION_COUNT)
  ) {
    return {
      ...base,
      ok: false,
      error: `Refined grouping required (exactly ${EXPECTED_REFINED_GROUP_COUNT} groups covering ${EXPECTED_RECOMMENDATION_COUNT} IDs). Got ${groups.length} groups covering ${covered.size} IDs.`,
      group_count: groups.length,
      coarse_grouping: groups.length <= COARSE_GROUP_COUNT,
      questions_covered: covered.size,
      duplicate_coverage: [],
      would_create: 0,
      would_skip_existing_key: 0,
      would_skip_duplicate_coverage: 0,
      create_groups: [],
    };
  }
  if (requireOfficial && coarse_grouping) {
    return {
      ...base,
      ok: false,
      error: `Refined grouping required (${EXPECTED_REFINED_GROUP_COUNT} groups). Coarse grouping (${groups.length}) is not allowed in production seed.`,
      group_count: groups.length,
      coarse_grouping: true,
      questions_covered: covered.size,
      duplicate_coverage: [],
      would_create: 0,
      would_skip_existing_key: 0,
      would_skip_duplicate_coverage: 0,
      create_groups: [],
    };
  }

  const existing = input.existingTasks || [];
  const existingKeys = new Set(existing.map((t) => t.concept_key));
  const coveredBy = coveredIndex(existing);
  const duplicate_coverage: DuplicateCoverageRow[] = [];
  const create_groups: ConceptGroup[] = [];
  let would_skip_existing_key = 0;
  let would_skip_duplicate_coverage = 0;

  for (const group of groups) {
    if (existingKeys.has(group.concept_key)) {
      would_skip_existing_key += 1;
      continue;
    }
    const overlaps = group.question_ids
      .map((qid) => {
        const hit = coveredBy.get(qid);
        if (!hit) return null;
        return {
          question_id: qid,
          existing_concept_key: hit.concept_key,
          existing_task_id: hit.task_id,
          new_concept_key: group.concept_key,
        };
      })
      .filter((row): row is DuplicateCoverageRow => row !== null);
    if (overlaps.length) {
      would_skip_duplicate_coverage += 1;
      duplicate_coverage.push(...overlaps);
      continue;
    }
    create_groups.push(group);
  }

  return {
    ...base,
    ok: true,
    error: null,
    group_count: groups.length,
    coarse_grouping: false,
    questions_covered: covered.size,
    duplicate_coverage,
    would_create: create_groups.length,
    would_skip_existing_key,
    would_skip_duplicate_coverage,
    create_groups,
  };
}

export function publicSeedPreview(plan: SeedPlan) {
  return {
    ok: plan.ok,
    wrote: false,
    dry_run: true,
    error: plan.error,
    group_count: plan.group_count,
    expected_refined_group_count: plan.expected_refined_group_count,
    coarse_group_count: plan.coarse_group_count,
    coarse_grouping: plan.coarse_grouping,
    recommendation_count: plan.recommendation_count,
    questions_covered: plan.questions_covered,
    missing_ids: plan.missing_ids,
    incomplete_stems: plan.incomplete_stems,
    mismatched_versions: plan.mismatched_versions,
    duplicate_coverage_count: plan.duplicate_coverage.length,
    duplicate_coverage: plan.duplicate_coverage.slice(0, 40),
    would_create: plan.would_create,
    would_skip_existing_key: plan.would_skip_existing_key,
    would_skip_duplicate_coverage: plan.would_skip_duplicate_coverage,
    source: plan.source,
    generated_explanations: false,
    published: false,
  };
}
