/**
 * In-memory / serializable content production store.
 * Used by tests and the gitignored local JSON backend. Production uses Supabase.
 */

import { randomUUID } from 'node:crypto';
import type { ExplanationRecommendation } from '../learning-cards/types';
import type { QuestionHint } from './concepts';
import { compareTasks, filterTasks, nextTask, queueTotals } from './queue';
import { buildSeedPlan } from './seedPlan';
import {
  type MediaAsset,
  type MediaKind,
  type ProductionFilters,
  type ProductionFormat,
  type ProductionStatus,
  type ProductionTask,
  type ProductionTranslation,
  type TaskMediaLink,
  type TranslationReviewStatus,
  canAdvanceProductionStatus,
  canUpgradeFormat,
  isProductionStatus,
} from './types';

export interface ContentProductionState {
  tasks: ProductionTask[];
  translations: ProductionTranslation[];
  assets: MediaAsset[];
  links: TaskMediaLink[];
}

function nowIso(): string {
  return new Date().toISOString();
}

function empty(): ContentProductionState {
  return { tasks: [], translations: [], assets: [], links: [] };
}

function refreshCoverage(task: ProductionTask): ProductionTask {
  const ids = Array.from(new Set(task.question_ids)).sort();
  return { ...task, question_ids: ids, coverage: ids.length, updated_at: nowIso() };
}

function markStale(state: ContentProductionState, taskId: string, revision: number): void {
  for (const row of state.translations) {
    if (row.task_id === taskId) {
      row.stale = row.english_revision < revision;
    }
  }
}

export function createMemoryProductionStore(initial?: ContentProductionState) {
  const state: ContentProductionState = initial
    ? {
        tasks: [...initial.tasks],
        translations: [...initial.translations],
        assets: [...initial.assets],
        links: [...initial.links],
      }
    : empty();

  function getTask(id: string): ProductionTask | null {
    return state.tasks.find((t) => t.id === id) || null;
  }

  function snapshot(): ContentProductionState {
    return {
      tasks: state.tasks.map((t) => ({ ...t, question_ids: [...t.question_ids] })),
      translations: state.translations.map((t) => ({ ...t })),
      assets: state.assets.map((a) => ({ ...a })),
      links: state.links.map((l) => ({ ...l })),
    };
  }

  function previewSeed(
    recs: ExplanationRecommendation[],
    opts?: {
      hints?: Record<string, QuestionHint>;
      officialRows?: Array<Record<string, unknown>>;
      requireOfficialStems?: boolean;
    }
  ) {
    return buildSeedPlan({
      recs,
      hints: opts?.hints || {},
      officialRows: opts?.officialRows,
      existingTasks: state.tasks,
      requireOfficialStems: opts?.requireOfficialStems,
    });
  }

  function seedFromRecommendations(
    recs: ExplanationRecommendation[],
    opts?: {
      created_by?: string | null;
      hints?: Record<string, QuestionHint>;
      officialRows?: Array<Record<string, unknown>>;
      requireOfficialStems?: boolean;
    }
  ): { created: number; skipped: number; tasks: ProductionTask[]; plan: ReturnType<typeof previewSeed> } {
    const plan = previewSeed(recs, opts);
    if (!plan.ok) {
      throw new Error(plan.error || 'Seed refused');
    }
    let created = 0;
    for (const group of plan.create_groups) {
      const stamp = nowIso();
      state.tasks.push({
        id: randomUUID(),
        concept_key: group.concept_key,
        title: group.title,
        topic: group.topic,
        suggested_format: group.suggested_format,
        format: group.suggested_format,
        priority: group.priority,
        classification: group.classification,
        rationale: group.rationale,
        status: 'not_started',
        explanation_en_draft: '',
        english_revision: 1,
        notes: '',
        source: 'recommendation_group',
        question_ids: [...group.question_ids],
        coverage: group.question_ids.length,
        created_at: stamp,
        updated_at: stamp,
        created_by: opts?.created_by || null,
        media_status: 'not_started',
      });
      created += 1;
    }
    const skipped = plan.would_skip_existing_key + plan.would_skip_duplicate_coverage;
    return { created, skipped, tasks: listTasks(), plan };
  }

  function listTasks(filters: ProductionFilters = {}): ProductionTask[] {
    return filterTasks(state.tasks, filters).sort(compareTasks);
  }

  function createManualTask(input: {
    title: string;
    topic: string;
    format: ProductionFormat;
    priority?: ProductionTask['priority'];
    question_ids?: string[];
    notes?: string;
    created_by?: string | null;
  }): ProductionTask {
    const stamp = nowIso();
    const ids = Array.from(new Set(input.question_ids || [])).sort();
    const concept_key = `manual::${input.topic}::${randomUUID().slice(0, 8)}`;
    const task: ProductionTask = {
      id: randomUUID(),
      concept_key,
      title: input.title,
      topic: input.topic,
      suggested_format: input.format,
      format: input.format,
      priority: input.priority || 'medium',
      classification: 'needs_explanation',
      rationale: 'Manually created production task.',
      status: 'not_started',
      explanation_en_draft: '',
      english_revision: 1,
      notes: input.notes || '',
      source: 'manual',
      question_ids: ids,
      coverage: ids.length,
      created_at: stamp,
      updated_at: stamp,
      created_by: input.created_by || null,
      media_status: 'not_started',
    };
    state.tasks.push(task);
    return task;
  }

  function patchTask(
    id: string,
    patch: Partial<{
      status: ProductionStatus;
      format: ProductionFormat;
      explanation_en_draft: string;
      notes: string;
      media_status: ProductionStatus;
      updated_by: string | null;
    }>
  ): ProductionTask {
    const task = getTask(id);
    if (!task) throw new Error('Task not found');
    if (patch.status && !canAdvanceProductionStatus(task.status, patch.status)) {
      throw new Error(`Cannot change status ${task.status} → ${patch.status}`);
    }
    if (patch.format && !canUpgradeFormat(task.format, patch.format)) {
      throw new Error(`Cannot change format ${task.format} → ${patch.format}`);
    }
    if (patch.media_status && !isProductionStatus(patch.media_status)) {
      throw new Error('Invalid media status');
    }
    const next: ProductionTask = {
      ...task,
      updated_at: nowIso(),
    };
    if (patch.status !== undefined) next.status = patch.status;
    if (patch.format !== undefined) next.format = patch.format;
    if (patch.explanation_en_draft !== undefined) next.explanation_en_draft = patch.explanation_en_draft;
    if (patch.notes !== undefined) next.notes = patch.notes;
    if (patch.media_status !== undefined) next.media_status = patch.media_status;
    if (patch.updated_by !== undefined) next.updated_by = patch.updated_by;
    if (
      patch.explanation_en_draft !== undefined &&
      patch.explanation_en_draft !== task.explanation_en_draft
    ) {
      next.english_revision = task.english_revision + 1;
      markStale(state, id, next.english_revision);
    }
    const idx = state.tasks.findIndex((t) => t.id === id);
    state.tasks[idx] = next;
    return next;
  }

  function linkQuestions(id: string, questionIds: string[]): ProductionTask {
    const task = getTask(id);
    if (!task) throw new Error('Task not found');
    const next = refreshCoverage({
      ...task,
      question_ids: [...task.question_ids, ...questionIds],
    });
    const idx = state.tasks.findIndex((t) => t.id === id);
    state.tasks[idx] = next;
    return next;
  }

  function unlinkQuestions(id: string, questionIds: string[]): ProductionTask {
    const task = getTask(id);
    if (!task) throw new Error('Task not found');
    const drop = new Set(questionIds);
    const next = refreshCoverage({
      ...task,
      question_ids: task.question_ids.filter((qid) => !drop.has(qid)),
    });
    const idx = state.tasks.findIndex((t) => t.id === id);
    state.tasks[idx] = next;
    return next;
  }

  function upsertTranslation(input: {
    task_id: string;
    language: string;
    body?: string;
    review_status?: TranslationReviewStatus;
  }): ProductionTranslation {
    const task = getTask(input.task_id);
    if (!task) throw new Error('Task not found');
    const existing = state.translations.find(
      (t) => t.task_id === input.task_id && t.language === input.language
    );
    if (existing) {
      if (input.body !== undefined) {
        existing.body = input.body;
        existing.english_revision = task.english_revision;
        existing.stale = false;
      }
      if (input.review_status) existing.review_status = input.review_status;
      existing.updated_at = nowIso();
      return { ...existing };
    }
    const row: ProductionTranslation = {
      id: randomUUID(),
      task_id: input.task_id,
      language: input.language,
      body: input.body || '',
      review_status: input.review_status || 'not_started',
      english_revision: task.english_revision,
      stale: false,
      updated_at: nowIso(),
    };
    state.translations.push(row);
    return { ...row };
  }

  function listTranslations(taskId: string): ProductionTranslation[] {
    const task = getTask(taskId);
    const revision = task?.english_revision || 1;
    return state.translations
      .filter((t) => t.task_id === taskId)
      .map((t) => ({ ...t, stale: t.english_revision < revision }));
  }

  function createAsset(input: {
    kind: MediaKind;
    title: string;
    language?: string | null;
    storage_path?: string;
    public_url?: string;
    mime_type?: string;
    notes?: string;
    status?: ProductionStatus;
  }): MediaAsset {
    const stamp = nowIso();
    const shared = input.kind !== 'voiceover';
    const asset: MediaAsset = {
      id: randomUUID(),
      kind: input.kind,
      language: input.kind === 'voiceover' ? input.language || 'en' : null,
      title: input.title,
      storage_path: input.storage_path || '',
      public_url: input.public_url || '',
      mime_type: input.mime_type || '',
      status: input.status || 'not_started',
      notes: input.notes || '',
      shared_visual: shared,
      created_at: stamp,
      updated_at: stamp,
    };
    state.assets.push(asset);
    return { ...asset };
  }

  function patchAsset(
    id: string,
    patch: Partial<Pick<MediaAsset, 'status' | 'title' | 'public_url' | 'storage_path' | 'notes' | 'mime_type'>>
  ): MediaAsset {
    const asset = state.assets.find((a) => a.id === id);
    if (!asset) throw new Error('Asset not found');
    if (patch.status && !canAdvanceProductionStatus(asset.status, patch.status)) {
      throw new Error(`Cannot change media status ${asset.status} → ${patch.status}`);
    }
    Object.assign(asset, patch, { updated_at: nowIso() });
    return { ...asset };
  }

  function attachAsset(taskId: string, assetId: string, role: 'visual' | 'voiceover' = 'visual'): TaskMediaLink {
    if (!getTask(taskId)) throw new Error('Task not found');
    if (!state.assets.find((a) => a.id === assetId)) throw new Error('Asset not found');
    const existing = state.links.find((l) => l.task_id === taskId && l.asset_id === assetId);
    if (existing) return { ...existing };
    const link = { task_id: taskId, asset_id: assetId, role };
    state.links.push(link);
    return { ...link };
  }

  function assetsForTask(taskId: string): MediaAsset[] {
    const ids = new Set(state.links.filter((l) => l.task_id === taskId).map((l) => l.asset_id));
    return state.assets.filter((a) => ids.has(a.id)).map((a) => ({ ...a }));
  }

  return {
    snapshot,
    previewSeed,
    seedFromRecommendations,
    listTasks,
    getTask,
    createManualTask,
    patchTask,
    linkQuestions,
    unlinkQuestions,
    upsertTranslation,
    listTranslations,
    createAsset,
    patchAsset,
    attachAsset,
    assetsForTask,
    listAssets: () => state.assets.map((a) => ({ ...a })),
    next: (filters?: ProductionFilters) => nextTask(state.tasks, filters),
    totals: () => queueTotals(state.tasks),
  };
}

export type MemoryProductionStore = ReturnType<typeof createMemoryProductionStore>;
