/**
 * Supabase-backed content production store (Phase 5D).
 * Admin/service role only. Never publishes learning cards. Never writes questions.
 */

import { ContentProductionNotMigratedError, isMissingContentProductionTable } from './errors';
import { createMemoryProductionStore, type MemoryProductionStore } from './memoryStore';
import {
  loadOfficialQuestionRows,
  type OfficialQuestionsClient,
} from './officialHints';
import { publicSeedPreview } from './seedPlan';
import type { MediaAsset, ProductionTask, ProductionTranslation, TaskMediaLink } from './types';

type QueryError = { message?: string; code?: string; details?: string };

export type ContentProductionSupabaseClient = {
  from: (table: string) => {
    select: (cols?: string) => PromiseLike<{ data: unknown; error: QueryError | null }> & {
      eq: (col: string, val: unknown) => PromiseLike<{ data: unknown; error: QueryError | null }> & {
        maybeSingle?: () => PromiseLike<{ data: unknown; error: QueryError | null }>;
        eq?: (col: string, val: unknown) => PromiseLike<{ data: unknown; error: QueryError | null }>;
      };
      in?: (col: string, val: string[]) => PromiseLike<{ data: unknown; error: QueryError | null }>;
      order?: (col: string) => PromiseLike<{ data: unknown; error: QueryError | null }>;
    };
    insert: (row: unknown) => PromiseLike<{ data: unknown; error: QueryError | null }> & {
      select?: (cols?: string) => PromiseLike<{ data: unknown; error: QueryError | null }>;
    };
    update: (row: unknown) => {
      eq: (col: string, val: unknown) => PromiseLike<{ data: unknown; error: QueryError | null }>;
    };
    upsert: (
      row: unknown,
      opts?: { onConflict?: string }
    ) => PromiseLike<{ data: unknown; error: QueryError | null }>;
    delete: () => {
      eq: (col: string, val: unknown) => {
        eq: (col: string, val: unknown) => PromiseLike<{ error: QueryError | null }>;
      } & PromiseLike<{ error: QueryError | null }>;
    };
  };
};

function throwIfMissing(error: QueryError | null): void {
  if (!error) return;
  if (isMissingContentProductionTable(error)) {
    throw new ContentProductionNotMigratedError(error.message);
  }
  throw new Error(error.message || 'Content production query failed');
}

function taskFromRow(
  row: Record<string, unknown>,
  questionIds: string[]
): ProductionTask {
  const ids = questionIds.slice().sort();
  return {
    id: String(row.id),
    concept_key: String(row.concept_key || ''),
    title: String(row.title || ''),
    topic: String(row.topic || ''),
    suggested_format: (row.suggested_format as ProductionTask['suggested_format']) || 'text',
    format: (row.format as ProductionTask['format']) || 'text',
    priority: (row.priority as ProductionTask['priority']) || 'medium',
    classification: String(row.classification || ''),
    rationale: String(row.rationale || ''),
    status: (row.status as ProductionTask['status']) || 'not_started',
    explanation_en_draft: String(row.explanation_en_draft || ''),
    english_revision: Number(row.english_revision || 1),
    notes: String(row.notes || ''),
    source: row.source === 'manual' ? 'manual' : 'recommendation_group',
    question_ids: ids,
    coverage: ids.length,
    created_at: String(row.created_at || ''),
    updated_at: String(row.updated_at || ''),
    created_by: (row.created_by as string | null) ?? null,
    updated_by: (row.updated_by as string | null) ?? null,
    media_status: (row.media_status as ProductionTask['media_status']) || 'not_started',
  };
}

async function loadState(client: ContentProductionSupabaseClient): Promise<{
  tasks: ProductionTask[];
  translations: ProductionTranslation[];
  assets: MediaAsset[];
  links: TaskMediaLink[];
}> {
  const tasksRes = (await client.from('content_production_tasks').select('*')) as {
    data: Record<string, unknown>[] | null;
    error: QueryError | null;
  };
  throwIfMissing(tasksRes.error);
  const linksRes = (await client.from('content_production_task_questions').select('*')) as {
    data: Array<{ task_id: string; question_id: string }> | null;
    error: QueryError | null;
  };
  throwIfMissing(linksRes.error);
  const trRes = (await client.from('content_production_translations').select('*')) as {
    data: Record<string, unknown>[] | null;
    error: QueryError | null;
  };
  throwIfMissing(trRes.error);
  const assetsRes = (await client.from('content_media_assets').select('*')) as {
    data: Record<string, unknown>[] | null;
    error: QueryError | null;
  };
  throwIfMissing(assetsRes.error);
  const mediaLinksRes = (await client.from('content_production_task_media').select('*')) as {
    data: TaskMediaLink[] | null;
    error: QueryError | null;
  };
  throwIfMissing(mediaLinksRes.error);

  const byTask: Record<string, string[]> = {};
  for (const row of linksRes.data || []) {
    byTask[row.task_id] = byTask[row.task_id] || [];
    byTask[row.task_id].push(row.question_id);
  }
  const tasks = (tasksRes.data || []).map((row) => taskFromRow(row, byTask[String(row.id)] || []));
  const translations: ProductionTranslation[] = (trRes.data || []).map((row) => ({
    id: String(row.id),
    task_id: String(row.task_id),
    language: String(row.language),
    body: String(row.body || ''),
    review_status: (row.review_status as ProductionTranslation['review_status']) || 'not_started',
    english_revision: Number(row.english_revision || 1),
    stale: Boolean(row.stale),
    updated_at: String(row.updated_at || ''),
  }));
  const assets: MediaAsset[] = (assetsRes.data || []).map((row) => ({
    id: String(row.id),
    kind: row.kind as MediaAsset['kind'],
    language: (row.language as string | null) ?? null,
    title: String(row.title || ''),
    storage_path: String(row.storage_path || ''),
    public_url: String(row.public_url || ''),
    mime_type: String(row.mime_type || ''),
    status: (row.status as MediaAsset['status']) || 'not_started',
    notes: String(row.notes || ''),
    shared_visual: row.shared_visual !== false && row.kind !== 'voiceover',
    created_at: String(row.created_at || ''),
    updated_at: String(row.updated_at || ''),
  }));
  return {
    tasks,
    translations,
    assets,
    links: mediaLinksRes.data || [],
  };
}

async function persistTask(
  client: ContentProductionSupabaseClient,
  before: ProductionTask | null,
  after: ProductionTask
): Promise<void> {
  const row = {
    id: after.id,
    concept_key: after.concept_key,
    title: after.title,
    topic: after.topic,
    suggested_format: after.suggested_format,
    format: after.format,
    priority: after.priority,
    classification: after.classification,
    rationale: after.rationale,
    status: after.status,
    explanation_en_draft: after.explanation_en_draft,
    english_revision: after.english_revision,
    notes: after.notes,
    source: after.source,
    media_status: after.media_status,
    created_at: after.created_at,
    updated_at: after.updated_at,
    created_by: after.created_by || null,
    updated_by: after.updated_by || null,
  };
  const { error } = await client
    .from('content_production_tasks')
    .upsert(row, { onConflict: 'id' });
  throwIfMissing(error);

  const beforeIds = new Set(before?.question_ids || []);
  const afterIds = new Set(after.question_ids);
  for (const qid of after.question_ids) {
    if (beforeIds.has(qid)) continue;
    const ins = await client.from('content_production_task_questions').insert({
      task_id: after.id,
      question_id: qid,
    });
    throwIfMissing(ins.error);
  }
  const removedIds = Array.from(beforeIds).filter((qid) => !afterIds.has(qid));
  for (const qid of removedIds) {
    const del = await client
      .from('content_production_task_questions')
      .delete()
      .eq('task_id', after.id)
      .eq('question_id', qid);
    throwIfMissing(del.error);
  }
}

export async function createSupabaseContentProductionStore(client: ContentProductionSupabaseClient) {
  const loaded = await loadState(client);
  const mem = createMemoryProductionStore(loaded);

  async function persistQuestionsAndTask(before: ProductionTask | null, after: ProductionTask) {
    await persistTask(client, before, after);
  }

  return {
    backend: 'supabase' as const,
    async listTasks(filters?: Parameters<MemoryProductionStore['listTasks']>[0]) {
      return mem.listTasks(filters);
    },
    async getTask(id: string) {
      return mem.getTask(id);
    },
    async next(filters?: Parameters<MemoryProductionStore['next']>[0]) {
      return mem.next(filters);
    },
    async totals() {
      return mem.totals();
    },
    async listAssets() {
      return mem.listAssets();
    },
    async assetsForTask(taskId: string) {
      return mem.assetsForTask(taskId);
    },
    async listTranslations(taskId: string) {
      return mem.listTranslations(taskId);
    },
    async previewSeed(
      recs: Parameters<MemoryProductionStore['previewSeed']>[0],
      opts?: Parameters<MemoryProductionStore['previewSeed']>[1]
    ) {
      const officialRows =
        opts?.officialRows ||
        (await loadOfficialQuestionRows(client as unknown as OfficialQuestionsClient));
      const plan = mem.previewSeed(recs, {
        ...opts,
        officialRows,
        requireOfficialStems: opts?.requireOfficialStems !== false,
      });
      return { ...publicSeedPreview({ ...plan, source: 'supabase_official' }), plan };
    },
    async seedFromRecommendations(
      recs: Parameters<MemoryProductionStore['seedFromRecommendations']>[0],
      opts?: Parameters<MemoryProductionStore['seedFromRecommendations']>[1]
    ) {
      const officialRows =
        opts?.officialRows ||
        (await loadOfficialQuestionRows(client as unknown as OfficialQuestionsClient));
      const beforeIds = new Set(mem.listTasks().map((t) => t.id));
      const result = mem.seedFromRecommendations(recs, {
        ...opts,
        officialRows,
        requireOfficialStems: opts?.requireOfficialStems !== false,
      });
      for (const task of result.tasks) {
        if (beforeIds.has(task.id)) continue;
        await persistQuestionsAndTask(null, task);
      }
      return result;
    },
    async createManualTask(input: Parameters<MemoryProductionStore['createManualTask']>[0]) {
      const task = mem.createManualTask(input);
      await persistQuestionsAndTask(null, task);
      return task;
    },
    async patchTask(
      id: string,
      patch: Parameters<MemoryProductionStore['patchTask']>[1]
    ) {
      const before = mem.getTask(id);
      const after = mem.patchTask(id, patch);
      await persistQuestionsAndTask(before, after);
      if (before && after.english_revision !== before.english_revision) {
        for (const tr of mem.listTranslations(id)) {
          const { error } = await client
            .from('content_production_translations')
            .update({ stale: tr.stale, english_revision: tr.english_revision, updated_at: after.updated_at })
            .eq('id', tr.id);
          throwIfMissing(error);
        }
      }
      return after;
    },
    async linkQuestions(id: string, ids: string[]) {
      const before = mem.getTask(id);
      const after = mem.linkQuestions(id, ids);
      await persistQuestionsAndTask(before, after);
      return after;
    },
    async unlinkQuestions(id: string, ids: string[]) {
      const before = mem.getTask(id);
      const after = mem.unlinkQuestions(id, ids);
      await persistQuestionsAndTask(before, after);
      return after;
    },
    async upsertTranslation(input: Parameters<MemoryProductionStore['upsertTranslation']>[0]) {
      const row = mem.upsertTranslation(input);
      const { error } = await client.from('content_production_translations').upsert(
        {
          id: row.id,
          task_id: row.task_id,
          language: row.language,
          body: row.body,
          review_status: row.review_status,
          english_revision: row.english_revision,
          stale: row.stale,
          updated_at: row.updated_at,
        },
        { onConflict: 'id' }
      );
      throwIfMissing(error);
      return row;
    },
    async createAsset(input: Parameters<MemoryProductionStore['createAsset']>[0]) {
      const asset = mem.createAsset(input);
      const { error } = await client.from('content_media_assets').upsert(
        {
          id: asset.id,
          kind: asset.kind,
          language: asset.language,
          title: asset.title,
          storage_path: asset.storage_path,
          public_url: asset.public_url,
          mime_type: asset.mime_type,
          status: asset.status,
          notes: asset.notes,
          shared_visual: asset.shared_visual,
          created_at: asset.created_at,
          updated_at: asset.updated_at,
        },
        { onConflict: 'id' }
      );
      throwIfMissing(error);
      return asset;
    },
    async patchAsset(
      id: string,
      patch: Parameters<MemoryProductionStore['patchAsset']>[1]
    ) {
      const asset = mem.patchAsset(id, patch);
      const { error } = await client
        .from('content_media_assets')
        .update({
          status: asset.status,
          title: asset.title,
          public_url: asset.public_url,
          storage_path: asset.storage_path,
          notes: asset.notes,
          mime_type: asset.mime_type,
          updated_at: asset.updated_at,
        })
        .eq('id', id);
      throwIfMissing(error);
      return asset;
    },
    async attachAsset(
      taskId: string,
      assetId: string,
      role?: Parameters<MemoryProductionStore['attachAsset']>[2]
    ) {
      const link = mem.attachAsset(taskId, assetId, role);
      const { error } = await client.from('content_production_task_media').upsert(
        { task_id: link.task_id, asset_id: link.asset_id, role: link.role },
        { onConflict: 'task_id,asset_id' }
      );
      throwIfMissing(error);
      return link;
    },
  };
}
