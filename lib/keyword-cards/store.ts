import { learningCardsBackend, productionForbidsLocalJson } from '../learning-cards/backend';
import { createServiceClient } from '@/lib/admin/supabaseAdmin';
import { createClient as createUserClient } from '@/lib/supabase/server';
import { createLocalKeywordCardsRepository } from './localRepository';
import type { KeywordCardsRepository } from './repository';
import { createSupabaseKeywordCardsRepository } from './supabaseStore';

export async function getKeywordCardsRepository(opts?: {
  mode?: 'admin' | 'learner';
}): Promise<KeywordCardsRepository> {
  const backend = learningCardsBackend();
  if (backend === 'local') {
    if (productionForbidsLocalJson()) {
      throw new Error('Production must not use local keyword-card JSON.');
    }
    return createLocalKeywordCardsRepository();
  }
  const mode = opts?.mode || 'admin';
  const client = mode === 'admin' ? createServiceClient() : await createUserClient();
  return createSupabaseKeywordCardsRepository(client as never, {
    learnerEmptyOnMissing: mode === 'learner',
  });
}
