import { NextRequest, NextResponse } from 'next/server';
import { getLearningCardsRepository } from '@/lib/learning-cards/store';

export const dynamic = 'force-dynamic';

/** Published cards only. Practice may call this. Mock Test must not. */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const questionId = (searchParams.get('question_id') || '').trim();
  const language = (searchParams.get('language') || 'en').trim().toLowerCase();
  if (!questionId) {
    return NextResponse.json({ error: 'question_id required' }, { status: 400 });
  }
  try {
    const repo = await getLearningCardsRepository({ mode: 'learner' });
    const payload = await repo.getPublishedForQuestion(questionId, language);
    return NextResponse.json({
      ...payload,
      backend: repo.backend,
      dvsa_approved: false,
    });
  } catch {
    return NextResponse.json({
      question_id: questionId,
      language,
      keywords: [],
      terms: [],
      explanation: null,
      dvsa_approved: false,
      backend: 'unavailable',
    });
  }
}
