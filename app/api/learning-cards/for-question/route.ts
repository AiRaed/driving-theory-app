import { NextRequest, NextResponse } from 'next/server';
import { chooseExplanationArabic } from '@/lib/i18n/arabic/preview';
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
    if (language !== 'ar') {
      return NextResponse.json({
        ...payload,
        backend: repo.backend,
        dvsa_approved: false,
      });
    }
    const english = await repo.getPublishedForQuestion(questionId, 'en');
    const arabic = chooseExplanationArabic({
      publishedArabic: payload.explanation?.explanation,
      publishedLanguage: payload.explanation?.language,
      fallback: payload.explanation_fallback === true,
      questionId,
    });
    const hasEnglish = Boolean(String(english.explanation?.explanation || '').trim());
    const attachArabic = hasEnglish || arabic.arabic_review === 'approved';
    return NextResponse.json({
      ...english,
      explanation_ar: attachArabic ? arabic.explanation_ar : null,
      arabic_review: attachArabic ? arabic.arabic_review : null,
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
