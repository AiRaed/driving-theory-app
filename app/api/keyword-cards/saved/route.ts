import { NextRequest, NextResponse } from 'next/server';
import { applyDevelopmentKeywordArabic } from '@/lib/i18n/arabic/preview';
import { getCurrentUser } from '@/lib/supabase/auth';
import { isKeywordCardsNotMigratedError } from '@/lib/keyword-cards/errors';
import { keywordCardsError } from '@/lib/keyword-cards/http';
import { getKeywordCardsRepository } from '@/lib/keyword-cards/store';
import { savedCardOwner, SavedCardOwnerError } from '@/lib/saved-cards/ownership';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const owner = savedCardOwner(user.id);
    const repo = await getKeywordCardsRepository({ mode: 'learner' });
    const keywords = (await repo.listSaved(owner)).map((card) =>
      applyDevelopmentKeywordArabic(card)
    );
    return NextResponse.json({ keywords, backend: repo.backend, user_id: user.id });
  } catch (error) {
    if (isKeywordCardsNotMigratedError(error)) {
      return NextResponse.json({ keywords: [], migration_required: true });
    }
    if (error instanceof SavedCardOwnerError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: error.status });
    }
    return keywordCardsError(error);
  }
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    const owner = savedCardOwner(user.id, body);
    const keywordId = String(body.keyword_id || '').trim();
    if (!keywordId) {
      return NextResponse.json({ error: 'keyword_id is required' }, { status: 400 });
    }
    const repo = await getKeywordCardsRepository({ mode: 'learner' });
    const result = await repo.toggleSave(owner, keywordId);
    return NextResponse.json({ ...result, backend: repo.backend, user_id: user.id });
  } catch (error) {
    if (error instanceof SavedCardOwnerError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: error.status });
    }
    return keywordCardsError(error);
  }
}
