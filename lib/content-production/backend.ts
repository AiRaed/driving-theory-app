import { isProductionRuntime } from '../learning-cards/backend';

export type ContentProductionBackend = 'local' | 'supabase';

export function contentProductionBackend(): ContentProductionBackend {
  if (process.env.CONTENT_PRODUCTION_USE_SUPABASE === 'true') return 'supabase';
  if (process.env.LEARNING_CARDS_USE_SUPABASE === 'true') return 'supabase';
  if (isProductionRuntime()) {
    if (process.env.CONTENT_PRODUCTION_ALLOW_LOCAL === 'true') return 'local';
    return 'supabase';
  }
  return 'local';
}

export function productionForbidsLocalContentJson(): boolean {
  return isProductionRuntime() && process.env.CONTENT_PRODUCTION_ALLOW_LOCAL !== 'true';
}
