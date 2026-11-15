import { NextRequest, NextResponse } from 'next/server';
import { getKeywordCardsRepository } from '@/lib/keyword-cards/store';

export const dynamic = 'force-dynamic';

/** Published keyword cards for Practice. Does not read official answers. */
export async function GET(request: NextRequest) {
  const questionId = (new URL(request.url).searchParams.get('question_id') || '').trim();
  if (!questionId) {
    return NextResponse.json({ error: 'question_id required' }, { status: 400 });
  }
  try {
    const repo = await getKeywordCardsRepository({ mode: 'learner' });
    const keywords = await repo.listPublishedForQuestion(questionId);
    return NextResponse.json({ keywords, dvsa_approved: false, backend: repo.backend });
  } catch (error) {
    console.error(
      '[keyword-cards/for-question]',
      error instanceof Error ? error.message : error
    );
    return NextResponse.json({ keywords: [], dvsa_approved: false, unavailable: true });
  }
}
