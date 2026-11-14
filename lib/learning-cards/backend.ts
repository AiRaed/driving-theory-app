/**
 * Learning Cards backend selection (Phase 5C).
 *
 * Production never reads gitignored local-data JSON.
 * Supabase is used when LEARNING_CARDS_USE_SUPABASE=true, or in production
 * (unless LEARNING_CARDS_ALLOW_LOCAL=true for an emergency local debug).
 *
 * This module does not connect to Supabase by itself.
 */

export type LearningCardsBackend = 'local' | 'supabase';

export function isProductionRuntime(): boolean {
  return process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
}

export function learningCardsBackend(): LearningCardsBackend {
  if (process.env.LEARNING_CARDS_USE_SUPABASE === 'true') return 'supabase';
  if (isProductionRuntime()) {
    if (process.env.LEARNING_CARDS_ALLOW_LOCAL === 'true') return 'local';
    return 'supabase';
  }
  return 'local';
}

export function productionForbidsLocalJson(): boolean {
  return isProductionRuntime() && process.env.LEARNING_CARDS_ALLOW_LOCAL !== 'true';
}
