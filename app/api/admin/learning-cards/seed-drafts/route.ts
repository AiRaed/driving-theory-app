import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin/auth';
import { getLearningCardsRepository } from '@/lib/learning-cards/store';
import { isLearningCardsNotMigratedError } from '@/lib/learning-cards/errors';

export const dynamic = 'force-dynamic';

export async function POST() {
  const user = await requireAdminApi();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const repo = await getLearningCardsRepository({ mode: 'admin' });
    const result = await repo.seedDrafts(user.id);
    return NextResponse.json({
      ...result,
      backend: repo.backend,
      live_database_written: repo.backend === 'supabase' && result.skipped !== true,
      published: false,
      dvsa_approved: false,
    });
  } catch (e) {
    const status = isLearningCardsNotMigratedError(e) ? 503 : 500;
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed', published: false },
      { status }
    );
  }
}
