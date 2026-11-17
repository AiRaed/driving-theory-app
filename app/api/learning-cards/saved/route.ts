import { NextRequest, NextResponse } from 'next/server';
import { chooseExplanationArabic } from '@/lib/i18n/arabic/preview';
import { getCurrentUser } from '@/lib/supabase/auth';
import { getLearningCardsRepository } from '@/lib/learning-cards/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const repo = await getLearningCardsRepository({ mode: 'learner' });
    const library = await repo.listSavedForUser(user.id);
    const explanations = await Promise.all(
      library.explanations.map(async (card) => {
        if (card.language === 'ar') return card;
        const published = await repo.getPublishedForQuestion(card.question_id, 'ar');
        const arabic = chooseExplanationArabic({
          publishedArabic: published.explanation?.explanation,
          publishedLanguage: published.explanation?.language,
          fallback: published.explanation_fallback === true,
          questionId: card.question_id,
        });
        if (!arabic.explanation_ar) return card;
        return { ...card, ...arabic };
      })
    );
    return NextResponse.json({
      ...library,
      explanations,
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
