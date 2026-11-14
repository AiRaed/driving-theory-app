import type { ExplanationRecommendation } from '../learning-cards/types';
import { createServiceClient } from '@/lib/admin/supabaseAdmin';
import { contentProductionBackend, productionForbidsLocalContentJson } from './backend';
import { createLocalContentProductionStore } from './localStore';
import { createSupabaseContentProductionStore } from './supabaseStore';
import type { MemoryProductionStore } from './memoryStore';
import { loadOfficialQuestionRows } from './officialHints';
import { publicSeedPreview, type SeedPlan } from './seedPlan';
import type {
  MediaAsset,
  ProductionFilters,
  ProductionFormat,
  ProductionStatus,
  ProductionTask,
  ProductionTranslation,
  TaskMediaLink,
  TranslationReviewStatus,
} from './types';

export interface ContentProductionRepository {
  backend: 'local' | 'supabase';
  listTasks(filters?: ProductionFilters): Promise<ProductionTask[]>;
  getTask(id: string): Promise<ProductionTask | null>;
  next(filters?: ProductionFilters): Promise<ProductionTask | null>;
  totals(): Promise<ReturnType<MemoryProductionStore['totals']>>;
  previewSeed(
    recs: ExplanationRecommendation[]
  ): Promise<ReturnType<typeof publicSeedPreview> & { plan?: SeedPlan }>;
  seedFromRecommendations(
    recs: ExplanationRecommendation[],
    opts?: { created_by?: string | null }
  ): Promise<{ created: number; skipped: number; tasks: ProductionTask[]; plan?: SeedPlan }>;
  createManualTask(input: {
    title: string;
    topic: string;
    format: ProductionFormat;
    priority?: ProductionTask['priority'];
    question_ids?: string[];
    notes?: string;
    created_by?: string | null;
  }): Promise<ProductionTask>;
  patchTask(
    id: string,
    patch: Partial<{
      status: ProductionStatus;
      format: ProductionFormat;
      explanation_en_draft: string;
      notes: string;
      media_status: ProductionStatus;
      updated_by: string | null;
    }>
  ): Promise<ProductionTask>;
  linkQuestions(id: string, questionIds: string[]): Promise<ProductionTask>;
  unlinkQuestions(id: string, questionIds: string[]): Promise<ProductionTask>;
  upsertTranslation(input: {
    task_id: string;
    language: string;
    body?: string;
    review_status?: TranslationReviewStatus;
  }): Promise<ProductionTranslation>;
  listTranslations(taskId: string): Promise<ProductionTranslation[]>;
  createAsset(input: Parameters<MemoryProductionStore['createAsset']>[0]): Promise<MediaAsset>;
  patchAsset(
    id: string,
    patch: Parameters<MemoryProductionStore['patchAsset']>[1]
  ): Promise<MediaAsset>;
  attachAsset(taskId: string, assetId: string, role?: 'visual' | 'voiceover'): Promise<TaskMediaLink>;
  assetsForTask(taskId: string): Promise<MediaAsset[]>;
  listAssets(): Promise<MediaAsset[]>;
}

function wrapLocal(
  local: ReturnType<typeof createLocalContentProductionStore>
): ContentProductionRepository {
  return {
    backend: 'local',
    async listTasks(filters) {
      return local.listTasks(filters);
    },
    async getTask(id) {
      return local.getTask(id);
    },
    async next(filters) {
      return local.next(filters);
    },
    async totals() {
      return local.totals();
    },
    async previewSeed(recs) {
      const officialRows = await resolveOfficialRowsForSeed();
      const plan = local.previewSeed(recs, { officialRows, requireOfficialStems: true });
      return { ...publicSeedPreview({ ...plan, source: 'supabase_official' }), plan };
    },
    async seedFromRecommendations(recs, opts) {
      const officialRows = await resolveOfficialRowsForSeed();
      return local.seedFromRecommendations(recs, {
        ...opts,
        officialRows,
        requireOfficialStems: true,
      });
    },
    async createManualTask(input) {
      return local.createManualTask(input);
    },
    async patchTask(id, patch) {
      return local.patchTask(id, patch);
    },
    async linkQuestions(id, ids) {
      return local.linkQuestions(id, ids);
    },
    async unlinkQuestions(id, ids) {
      return local.unlinkQuestions(id, ids);
    },
    async upsertTranslation(input) {
      return local.upsertTranslation(input);
    },
    async listTranslations(taskId) {
      return local.listTranslations(taskId);
    },
    async createAsset(input) {
      return local.createAsset(input);
    },
    async patchAsset(id, patch) {
      return local.patchAsset(id, patch);
    },
    async attachAsset(taskId, assetId, role) {
      return local.attachAsset(taskId, assetId, role);
    },
    async assetsForTask(taskId) {
      return local.assetsForTask(taskId);
    },
    async listAssets() {
      return local.listAssets();
    },
  };
}

async function resolveOfficialRowsForSeed(): Promise<Array<Record<string, unknown>>> {
  const client = createServiceClient();
  return loadOfficialQuestionRows(client as never);
}

export async function getContentProductionRepository(): Promise<ContentProductionRepository> {
  const backend = contentProductionBackend();
  if (backend === 'local') {
    if (productionForbidsLocalContentJson()) {
      throw new Error('Production must not use local-data/content-production JSON.');
    }
    return wrapLocal(createLocalContentProductionStore());
  }
  const client = createServiceClient();
  return (await createSupabaseContentProductionStore(client as never)) as ContentProductionRepository;
}
