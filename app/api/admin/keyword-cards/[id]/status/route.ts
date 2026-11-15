import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin/auth';
import { keywordCardsError } from '@/lib/keyword-cards/http';
import { getKeywordCardsRepository } from '@/lib/keyword-cards/store';
import { LEARNING_CARD_STATUSES, type LearningCardStatus } from '@/lib/learning-cards/types';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> } | { params: { id: string } };

export async function POST(request: NextRequest, ctx: Ctx) {
  const user = await requireAdminApi();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const params = await Promise.resolve(ctx.params);
    const body = await request.json();
    const status = String(body.status || '') as LearningCardStatus;
    if (!LEARNING_CARD_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Unknown status' }, { status: 400 });
    }
    const repo = await getKeywordCardsRepository({ mode: 'admin' });
    const keyword = await repo.setStatus(params.id, status, user.id);
    return NextResponse.json({ keyword, backend: repo.backend });
  } catch (error) {
    return keywordCardsError(error);
  }
}
