import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/supabase/auth';
import { getLearningCardsRepository } from '@/lib/learning-cards/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const repo = await getLearningCardsRepository({ mode: 'learner' });
    const library = await repo.listSavedForUser(user.id);
    return NextResponse.json({
      ...library,
      backend: repo.backend,
      user_id: user.id,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  try {
    const repo = await getLearningCardsRepository({ mode: 'learner' });
    const result = await repo.toggleSavedCard({
      user_id: user.id,
      card_kind: body.card_kind,
      keyword_card_id: body.keyword_card_id,
      explanation_card_id: body.explanation_card_id,
    });
    return NextResponse.json({ ...result, backend: repo.backend, user_id: user.id });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed' },
      { status: 400 }
    );
  }
}
