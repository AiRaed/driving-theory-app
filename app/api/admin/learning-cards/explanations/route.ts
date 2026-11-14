import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin/auth';
import { getLearningCardsRepository } from '@/lib/learning-cards/store';
import { isLearningCardsNotMigratedError } from '@/lib/learning-cards/errors';
import type { ExplanationFormat, LearningCardStatus } from '@/lib/learning-cards/types';

export const dynamic = 'force-dynamic';

function fail(e: unknown) {
  const status = isLearningCardsNotMigratedError(e) ? 503 : 500;
  return NextResponse.json(
    { error: e instanceof Error ? e.message : 'Failed', live_database_written: false },
    { status }
  );
}

export async function GET(request: NextRequest) {
  const user = await requireAdminApi();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const repo = await getLearningCardsRepository({ mode: 'admin' });
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('question_id') || '';
    const cards = await repo.listExplanationCards(questionId || undefined);
    return NextResponse.json({ cards, backend: repo.backend });
  } catch (e) {
    return fail(e);
  }
}

export async function POST(request: NextRequest) {
  const user = await requireAdminApi();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const repo = await getLearningCardsRepository({ mode: 'admin' });
    const body = await request.json();
    if (body.action === 'status') {
      const card = await repo.setCardStatus(
        'explanation',
        body.id,
        body.status as LearningCardStatus,
        user.id
      );
      return NextResponse.json({ card, backend: repo.backend });
    }
    if (!body.question_id) {
      return NextResponse.json({ error: 'question_id required' }, { status: 400 });
    }
    const card = await repo.upsertExplanationCard({
      question_id: body.question_id,
      language: body.language || 'en',
      explanation: body.explanation || '',
      format: (body.format as ExplanationFormat) || 'text',
      image_url: body.image_url,
      image_alt: body.image_alt,
      video_url: body.video_url,
      notes: body.notes || 'Not DVSA-approved.',
      created_by: user.id,
    });
    return NextResponse.json({
      card,
      backend: repo.backend,
      published: false,
      dvsa_approved: false,
    });
  } catch (e) {
    return fail(e);
  }
}
