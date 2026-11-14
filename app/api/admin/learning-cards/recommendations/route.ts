import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin/auth';
import { getLearningCardsRepository } from '@/lib/learning-cards/store';
import { isLearningCardsNotMigratedError } from '@/lib/learning-cards/errors';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAdminApi();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const repo = await getLearningCardsRepository({ mode: 'admin' });
    const { searchParams } = new URL(request.url);
    const listed = await repo.listRecommendations({
      classification: searchParams.get('classification') || '',
      topic: searchParams.get('topic') || '',
      priority: searchParams.get('priority') || '',
      card_status: searchParams.get('card_status') || '',
    });

    return NextResponse.json({
      ok: true,
      backend: repo.backend,
      dvsa_approved: false,
      totals: listed.totals,
      recommendations: listed.rows,
    });
  } catch (e) {
    const status = isLearningCardsNotMigratedError(e) ? 503 : 500;
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed' },
      { status }
    );
  }
}
