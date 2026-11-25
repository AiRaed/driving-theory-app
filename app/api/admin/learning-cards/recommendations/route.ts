import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin/auth';
import { getLearningCardsRepository } from '@/lib/learning-cards/store';
import { isLearningCardsNotMigratedError } from '@/lib/learning-cards/errors';
import { loadHintDraftsByQuestion } from '@/lib/learning-cards/hintDraftStore';
import {
  practiceCategoryOptions,
  practiceCategoryPlacements,
  type PracticeCategoryPlacement,
} from '@/lib/questions/practiceCategory';
import { loadPublishedPracticeOrder } from '@/lib/questions/practiceCategoryOrder';

function placementFor(
  placements: Map<string, PracticeCategoryPlacement> | null,
  questionId: string,
  topic: string
): PracticeCategoryPlacement {
  const found = placements?.get(questionId);
  if (found) return found;
  return {
    questionId,
    categoryId: topic,
    categoryName: topic ? practiceCategoryOptions([topic])[0]?.name || topic : '',
    position: null,
    total: 0,
  };
}

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

    const drafts = loadHintDraftsByQuestion();
    const order = await loadPublishedPracticeOrder();
    const placements = order ? practiceCategoryPlacements(order) : null;
    const categorySource = order
      ? order.map((question) => question.topic)
      : (await repo.listRecommendations({})).rows.map((row) => row.topic);
    return NextResponse.json({
      ok: true,
      backend: repo.backend,
      dvsa_approved: false,
      totals: listed.totals,
      categories: practiceCategoryOptions(categorySource),
      recommendations: listed.rows.map((row) => {
        const draft = drafts.get(row.question_id);
        const place = placementFor(placements, row.question_id, row.topic);
        return {
          ...row,
          draft_review: draft?.review_status || null,
          draft_label: draft?.review_label || null,
          category_id: place.categoryId,
          category_name: place.categoryName,
          position: place.position,
          category_total: place.total,
        };
      }),
    });
  } catch (e) {
    const status = isLearningCardsNotMigratedError(e) ? 503 : 500;
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed' },
      { status }
    );
  }
}
