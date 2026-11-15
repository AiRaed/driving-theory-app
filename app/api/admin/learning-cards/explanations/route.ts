import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin/auth';
import { getLearningCardsRepository } from '@/lib/learning-cards/store';
import { isLearningCardsNotMigratedError } from '@/lib/learning-cards/errors';
import { isCompleteExplanationHint, isLearnerVisibleExplanationHint } from '@/lib/learning-cards/hints';
import type { ExplanationFormat } from '@/lib/learning-cards/types';

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
    const reusable = searchParams.get('reusable') === '1';
    if (reusable) {
      const cards = await repo.listReusableExplanationHints();
      return NextResponse.json({ cards, backend: repo.backend });
    }
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
        body.status,
        user.id
      );
      return NextResponse.json({ card, backend: repo.backend });
    }
    if (body.action === 'disable') {
      const card = await repo.disableExplanationCard(
        String(body.question_id || ''),
        String(body.language || 'en'),
        user.id
      );
      return NextResponse.json({
        card,
        disabled: true,
        learner_visible: false,
        backend: repo.backend,
      });
    }
    if (body.action === 'remove') {
      const card = await repo.removeExplanationCard(
        String(body.question_id || ''),
        String(body.language || 'en'),
        user.id
      );
      return NextResponse.json({
        card,
        removed: true,
        learner_visible: false,
        backend: repo.backend,
      });
    }
    if (body.action === 'reuse') {
      const sourceId = String(body.from_question_id || '');
      const targetId = String(body.question_id || '');
      if (!sourceId || !targetId) {
        return NextResponse.json({ error: 'from_question_id and question_id required' }, { status: 400 });
      }
      const sources = await repo.listReusableExplanationHints();
      const source =
        sources.find((c) => c.question_id === sourceId && c.language === 'en') ||
        sources.find((c) => c.question_id === sourceId);
      if (!source) {
        return NextResponse.json({ error: 'Reusable hint not found' }, { status: 404 });
      }
      const card = await repo.upsertExplanationCard({
        question_id: targetId,
        language: 'en',
        explanation: source.explanation,
        format: source.format,
        image_url: source.image_url,
        image_alt: source.image_alt,
        video_url: source.video_url,
        notes: 'Reused educational hint. Not DVSA-approved.',
        created_by: user.id,
        activate: isCompleteExplanationHint(source),
      });
      return NextResponse.json({
        card,
        backend: repo.backend,
        published: isLearnerVisibleExplanationHint(card),
        dvsa_approved: false,
      });
    }
    if (!body.question_id) {
      return NextResponse.json({ error: 'question_id required' }, { status: 400 });
    }
    const explanation = String(body.explanation || '');
    const activate = body.activate === true;
    if (activate && !isCompleteExplanationHint({ explanation })) {
      return NextResponse.json(
        { error: 'A complete English explanation is required before the hint can appear in Practice.' },
        { status: 400 }
      );
    }
    const card = await repo.upsertExplanationCard({
      question_id: body.question_id,
      language: body.language || 'en',
      explanation,
      format: (body.format as ExplanationFormat) || 'text',
      image_url: body.image_url,
      image_alt: body.image_alt,
      video_url: body.video_url,
      notes: body.notes || 'Not DVSA-approved.',
      created_by: user.id,
      activate,
    });
    const visible = isLearnerVisibleExplanationHint(card);
    return NextResponse.json({
      card,
      backend: repo.backend,
      published: visible,
      learner_visible: visible,
      dvsa_approved: false,
    });
  } catch (e) {
    return fail(e);
  }
}
