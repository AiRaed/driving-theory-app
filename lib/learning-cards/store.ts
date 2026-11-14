import { learningCardsBackend, productionForbidsLocalJson } from './backend';
import { createLocalLearningCardsRepository } from './localRepository';
import { createSupabaseLearningCardsRepository } from './supabaseStore';
import type { LearningCardsRepository } from './repository';
import { createServiceClient } from '@/lib/admin/supabaseAdmin';
import { createClient as createUserClient } from '@/lib/supabase/server';

export async function getLearningCardsRepository(opts?: {
  mode?: 'admin' | 'learner';
}): Promise<LearningCardsRepository> {
  const backend = learningCardsBackend();
  if (backend === 'local') {
    if (productionForbidsLocalJson()) {
      throw new Error('Production must not use local-data/learning-cards JSON.');
    }
    return createLocalLearningCardsRepository();
  }
  const mode = opts?.mode || 'admin';
  const client =
    mode === 'admin' ? createServiceClient() : await createUserClient();
  return createSupabaseLearningCardsRepository(client as never, {
    learnerEmptyOnMissing: mode === 'learner',
  });
}
