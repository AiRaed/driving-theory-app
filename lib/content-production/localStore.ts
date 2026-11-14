/**
 * Local-only content production persist (next-dev). Gitignored via /local-data/.
 * Production must never read this file.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { productionForbidsLocalContentJson } from './backend';
import { createMemoryProductionStore, type ContentProductionState } from './memoryStore';

export const LOCAL_CONTENT_PRODUCTION_DIR = path.join(
  process.cwd(),
  'local-data',
  'content-production'
);
export const LOCAL_CONTENT_PRODUCTION_STORE = path.join(
  LOCAL_CONTENT_PRODUCTION_DIR,
  'store.json'
);

function emptyState(): ContentProductionState {
  return { tasks: [], translations: [], assets: [], links: [] };
}

export function readLocalContentProduction(): ContentProductionState {
  if (productionForbidsLocalContentJson()) {
    throw new Error('Production must not use local-data/content-production JSON.');
  }
  if (!existsSync(LOCAL_CONTENT_PRODUCTION_STORE)) return emptyState();
  try {
    const raw = JSON.parse(readFileSync(LOCAL_CONTENT_PRODUCTION_STORE, 'utf8'));
    return {
      tasks: raw.tasks || [],
      translations: raw.translations || [],
      assets: raw.assets || [],
      links: raw.links || [],
    };
  } catch {
    return emptyState();
  }
}

export function writeLocalContentProduction(state: ContentProductionState): void {
  if (productionForbidsLocalContentJson()) {
    throw new Error('Production must not use local-data/content-production JSON.');
  }
  mkdirSync(LOCAL_CONTENT_PRODUCTION_DIR, { recursive: true });
  writeFileSync(LOCAL_CONTENT_PRODUCTION_STORE, JSON.stringify(state, null, 2), 'utf8');
}

export function createLocalContentProductionStore() {
  const store = createMemoryProductionStore(readLocalContentProduction());
  const persist = <T>(result: T): T => {
    writeLocalContentProduction(store.snapshot());
    return result;
  };
  return {
    backend: 'local' as const,
    listTasks: store.listTasks,
    getTask: store.getTask,
    next: store.next,
    totals: store.totals,
    listAssets: store.listAssets,
    assetsForTask: store.assetsForTask,
    listTranslations: store.listTranslations,
    previewSeed: store.previewSeed,
    seedFromRecommendations: (...args: Parameters<typeof store.seedFromRecommendations>) =>
      persist(store.seedFromRecommendations(...args)),
    createManualTask: (...args: Parameters<typeof store.createManualTask>) =>
      persist(store.createManualTask(...args)),
    patchTask: (...args: Parameters<typeof store.patchTask>) => persist(store.patchTask(...args)),
    linkQuestions: (...args: Parameters<typeof store.linkQuestions>) =>
      persist(store.linkQuestions(...args)),
    unlinkQuestions: (...args: Parameters<typeof store.unlinkQuestions>) =>
      persist(store.unlinkQuestions(...args)),
    upsertTranslation: (...args: Parameters<typeof store.upsertTranslation>) =>
      persist(store.upsertTranslation(...args)),
    createAsset: (...args: Parameters<typeof store.createAsset>) => persist(store.createAsset(...args)),
    patchAsset: (...args: Parameters<typeof store.patchAsset>) => persist(store.patchAsset(...args)),
    attachAsset: (...args: Parameters<typeof store.attachAsset>) => persist(store.attachAsset(...args)),
  };
}
