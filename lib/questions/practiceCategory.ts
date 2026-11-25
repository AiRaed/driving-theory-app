/**
 * Practice Mode categories. Names and order match the Practice topic list.
 * Position follows the published bank order: sort_order, then question id.
 */

import { toTitleCaseLabel } from '../utils';

/** Same sequence Practice uses for its topic grid. */
export const PRACTICE_TOPIC_ORDER = [
  'alertness',
  'attitude',
  'hazard-awareness',
  'documents',
  'motorway-driving',
  'road-signs',
  'incidents',
  'other-vehicles',
  'rules-of-the-road',
  'safety-margins',
  'safety-vehicle',
  'vehicle-handling',
  'vehicle-loading',
  'vulnerable-road-users',
] as const;

export interface PracticeQuestionOrder {
  id: string;
  topic: string;
  sort_order: number | null | undefined;
}

export interface PracticeCategoryPlacement {
  questionId: string;
  categoryId: string;
  categoryName: string;
  /** 1-based position inside the Practice category. Null when order is not fixed. */
  position: number | null;
  total: number;
}

export function practiceCategoryName(topicId: string | null | undefined): string {
  return toTitleCaseLabel(topicId);
}

/** Categories present in the bank, in the same order Practice shows them. */
export function practiceCategoryIds(topicIds: Iterable<string>): string[] {
  const present = new Set(topicIds);
  const ordered = PRACTICE_TOPIC_ORDER.filter((id) => present.has(id));
  const extras = Array.from(present).filter(
    (id) => !(PRACTICE_TOPIC_ORDER as readonly string[]).includes(id)
  );
  return [...ordered, ...extras];
}

export function practiceCategoryOptions(
  topicIds: Iterable<string>
): Array<{ id: string; name: string }> {
  return practiceCategoryIds(topicIds).map((id) => ({
    id,
    name: practiceCategoryName(id),
  }));
}

function orderIsFixed(rows: PracticeQuestionOrder[]): boolean {
  return rows.length > 0 && rows.every((row) => Number.isFinite(row.sort_order));
}

/**
 * Placement of each question inside its Practice category.
 * Questions are ordered by sort_order, then id — the same order the published
 * bank uses before Practice filters to one category.
 */
export function practiceCategoryPlacements(
  questions: readonly PracticeQuestionOrder[]
): Map<string, PracticeCategoryPlacement> {
  const byTopic = new Map<string, PracticeQuestionOrder[]>();
  for (const question of questions) {
    const topic = String(question.topic || '').trim();
    if (!question.id || !topic) continue;
    const group = byTopic.get(topic) || [];
    group.push(question);
    byTopic.set(topic, group);
  }

  const placements = new Map<string, PracticeCategoryPlacement>();
  for (const [topic, rows] of Array.from(byTopic.entries())) {
    const fixed = orderIsFixed(rows);
    const ordered = fixed
      ? [...rows].sort((a, b) => {
          const order = Number(a.sort_order) - Number(b.sort_order);
          if (order !== 0) return order;
          return a.id.localeCompare(b.id);
        })
      : rows;
    ordered.forEach((row: PracticeQuestionOrder, index: number) => {
      placements.set(row.id, {
        questionId: row.id,
        categoryId: topic,
        categoryName: practiceCategoryName(topic),
        position: fixed ? index + 1 : null,
        total: ordered.length,
      });
    });
  }
  return placements;
}
