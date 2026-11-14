/**
 * Group 758 explanation recommendations into reusable learning concepts.
 *
 * One image/diagram/video should cover many related DVSA IDs. Grouping uses
 * official stem + explanation keywords when available, then classifier
 * rationale as a fallback. It never invents explanations and never writes
 * to the question bank.
 */

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import type { ExplanationRecommendation } from '../learning-cards/types';
import {
  type QuestionHint,
  familyFromText,
  humanTopic,
  isCrossTopicFamily,
} from './conceptFamilies';
import {
  type ConceptGroup,
  type ProductionFormat,
  type ProductionPriority,
  classificationRank,
  priorityRank,
} from './types';

export type { QuestionHint } from './conceptFamilies';
export { familyFromText, humanTopic } from './conceptFamilies';

/** Local audit/tests only. Production seed must load stems from live Supabase. */
export function loadLocalQuestionHints(): Record<string, QuestionHint> {
  try {
    const file = path.join(process.cwd(), 'local-data', 'dvsa', 'staging', 'questions.v2.json');
    if (!existsSync(file)) return {};
    const bank = JSON.parse(readFileSync(file, 'utf8')) as {
      questions?: Array<{
        id: string;
        promptEn?: string;
        explanationEn?: string;
        options?: Array<{ en?: string; correct?: boolean }>;
      }>;
    };
    const out: Record<string, QuestionHint> = {};
    for (const q of bank.questions || []) {
      if (!q?.id) continue;
      out[q.id] = {
        promptEn: q.promptEn || '',
        explanationEn: q.explanationEn || '',
        correctOptionEn: (q.options || []).find((opt) => opt.correct)?.en || '',
      };
    }
    return out;
  } catch {
    return {};
  }
}

export function conceptFromRecommendation(
  rec: ExplanationRecommendation,
  hint?: QuestionHint | null
): {
  slug: string;
  title: string;
  concept_key: string;
  cross_topic: boolean;
} {
  const family = familyFromText(rec, hint);
  const format = rec.suggested_format;
  const cross = isCrossTopicFamily(family.slug);
  const concept_key = cross ? `${family.slug}::${format}` : `${family.slug}::${format}`;
  return {
    slug: family.slug,
    title: family.title,
    concept_key,
    cross_topic: cross,
  };
}

export function groupRecommendations(
  recs: ExplanationRecommendation[],
  hints: Record<string, QuestionHint> = {}
): ConceptGroup[] {
  const map = new Map<
    string,
    ConceptGroup & { topicCounts: Record<string, number> }
  >();
  for (const rec of recs) {
    const hint = hints[rec.question_id];
    const { slug, title, concept_key } = conceptFromRecommendation(rec, hint);
    const existing = map.get(concept_key);
    if (!existing) {
      map.set(concept_key, {
        concept_key,
        slug,
        title,
        topic: rec.topic,
        suggested_format: rec.suggested_format as ProductionFormat,
        classification: rec.recommended_classification,
        priority: rec.priority as ProductionPriority,
        rationale: rec.rationale,
        question_ids: [rec.question_id],
        topicCounts: { [rec.topic]: 1 },
      });
      continue;
    }
    if (!existing.question_ids.includes(rec.question_id)) {
      existing.question_ids.push(rec.question_id);
    }
    existing.topicCounts[rec.topic] = (existing.topicCounts[rec.topic] || 0) + 1;
    if (priorityRank(rec.priority) < priorityRank(existing.priority)) {
      existing.priority = rec.priority as ProductionPriority;
    }
    if (classificationRank(rec.recommended_classification) < classificationRank(existing.classification)) {
      existing.classification = rec.recommended_classification;
    }
  }
  const groups = Array.from(map.values()).map((group) => {
    const majority = Object.entries(group.topicCounts).sort((a, b) => b[1] - a[1])[0];
    const { topicCounts: _counts, ...rest } = group;
    void _counts;
    return {
      ...rest,
      topic: majority?.[0] || rest.topic,
    };
  });
  groups.forEach((group) => {
    group.question_ids.sort();
  });
  return groups.sort(compareConceptGroups);
}

export function compareConceptGroups(a: ConceptGroup, b: ConceptGroup): number {
  const classDiff = classificationRank(a.classification) - classificationRank(b.classification);
  if (classDiff !== 0) return classDiff;
  const priDiff = priorityRank(a.priority) - priorityRank(b.priority);
  if (priDiff !== 0) return priDiff;
  const covDiff = b.question_ids.length - a.question_ids.length;
  if (covDiff !== 0) return covDiff;
  return a.concept_key.localeCompare(b.concept_key);
}
