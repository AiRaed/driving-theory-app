import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/supabase/auth';
import { isKeywordCardsNotMigratedError } from '@/lib/keyword-cards/errors';
import { keywordCardsError } from '@/lib/keyword-cards/http';
import { getKeywordCardsRepository } from '@/lib/keyword-cards/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const repo = await getKeywordCardsRepository({ mode: 'learner' });
    const keywords = await repo.listSaved(user.id);
    return NextResponse.json({ keywords, backend: repo.backend, user_id: user.id });
  } catch (error) {
    if (isKeywordCardsNotMigratedError(error)) {
      return NextResponse.json({ keywords: [], migration_required: true });
    }
    return keywordCardsError(error);
  }
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    const keywordId = String(body.keyword_id || '').trim();
    if (!keywordId) {
      return NextResponse.json({ error: 'keyword_id is required' }, { status: 400 });
    }
    const repo = await getKeywordCardsRepository({ mode: 'learner' });
    const result = await repo.toggleSave(user.id, keywordId);
    return NextResponse.json({ ...result, backend: repo.backend, user_id: user.id });
  } catch (error) {
    return keywordCardsError(error);
  }
}
