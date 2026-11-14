import {
  type ProductionFilters,
  type ProductionTask,
  type QueueTotals,
  classificationRank,
  isUnfinished,
  priorityRank,
} from './types';

export function compareTasks(a: ProductionTask, b: ProductionTask): number {
  const classDiff = classificationRank(a.classification) - classificationRank(b.classification);
  if (classDiff !== 0) return classDiff;
  const priDiff = priorityRank(a.priority) - priorityRank(b.priority);
  if (priDiff !== 0) return priDiff;
  const covDiff = b.coverage - a.coverage;
  if (covDiff !== 0) return covDiff;
  return a.concept_key.localeCompare(b.concept_key);
}

export function filterTasks(tasks: ProductionTask[], filters: ProductionFilters = {}): ProductionTask[] {
  return tasks.filter((task) => {
    if (filters.topic && task.topic !== filters.topic) return false;
    if (filters.format && task.format !== filters.format) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.status && task.status !== filters.status) return false;
    if (filters.coverage === 'single' && task.coverage !== 1) return false;
    if (filters.coverage === 'multi' && task.coverage < 2) return false;
    return true;
  });
}

export function nextTask(
  tasks: ProductionTask[],
  filters: ProductionFilters = {}
): ProductionTask | null {
  const unfinished = filterTasks(tasks, filters)
    .filter((task) => isUnfinished(task.status))
    .sort(compareTasks);
  return unfinished[0] || null;
}

export function queueTotals(tasks: ProductionTask[]): QueueTotals {
  const by_status: Record<string, number> = {};
  const by_format: Record<string, number> = {};
  const by_priority: Record<string, number> = {};
  const by_topic: Record<string, number> = {};
  const ids = new Set<string>();
  let unfinished = 0;
  for (const task of tasks) {
    by_status[task.status] = (by_status[task.status] || 0) + 1;
    by_format[task.format] = (by_format[task.format] || 0) + 1;
    by_priority[task.priority] = (by_priority[task.priority] || 0) + 1;
    by_topic[task.topic] = (by_topic[task.topic] || 0) + 1;
    for (const id of task.question_ids) ids.add(id);
    if (isUnfinished(task.status)) unfinished += 1;
  }
  return {
    tasks: tasks.length,
    questions_covered: ids.size,
    by_status,
    by_format,
    by_priority,
    by_topic,
    unfinished,
  };
}
