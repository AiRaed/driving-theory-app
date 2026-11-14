import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin/auth';
import { getLearningCardsRepository } from '@/lib/learning-cards/store';
import { isLearningCardsNotMigratedError } from '@/lib/learning-cards/errors';
import type { LearningCardStatus } from '@/lib/learning-cards/types';

export const dynamic = 'force-dynamic';

function fail(e: unknown) {
  const status = isLearningCardsNotMigratedError(e) ? 503 : 500;
  return NextResponse.json(
    { error: e instanceof Error ? e.message : 'Failed', live_database_written: false },
    { status }
  );
}

export async function GET() {
  const user = await requireAdminApi();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const repo = await getLearningCardsRepository({ mode: 'admin' });
    const catalog = await repo.listKeywordCatalog();
    return NextResponse.json({
      terms: catalog.terms,
      cards: catalog.cards,
      links: catalog.links,
      backend: repo.backend,
    });
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
        'keyword',
        body.id,
        body.status as LearningCardStatus,
        user.id
      );
      return NextResponse.json({ card, backend: repo.backend });
    }
    if (body.action === 'link') {
      const link = await repo.linkKeywordToQuestion(
        body.term_key,
        body.question_id,
        body.source_field || null
      );
      return NextResponse.json({ link, backend: repo.backend });
    }
    const card = await repo.upsertKeywordCard({
      term_en: body.term_en,
      language: body.language || 'en',
      definition: body.definition || '',
      translation: body.translation,
      image_url: body.image_url,
      image_alt: body.image_alt,
      video_url: body.video_url,
      notes: body.notes,
      created_by: user.id,
    });
    if (body.question_id) {
      await repo.linkKeywordToQuestion(card.term_key, body.question_id, body.source_field || 'stem');
    }
    return NextResponse.json({
      card,
      backend: repo.backend,
      published: false,
    });
  } catch (e) {
    return fail(e);
  }
}
