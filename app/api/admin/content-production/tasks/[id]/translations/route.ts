import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin/auth';
import { isContentProductionNotMigratedError } from '@/lib/content-production/errors';
import { getContentProductionRepository } from '@/lib/content-production/store';
import type { TranslationReviewStatus } from '@/lib/content-production/types';
import { PRODUCTION_LANGUAGES } from '@/lib/content-production/types';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> } | { params: { id: string } };

export async function GET(_request: NextRequest, ctx: Ctx) {
  try {
    const user = await requireAdminApi();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const id = (await Promise.resolve(ctx.params)).id;
    const repo = await getContentProductionRepository();
    const translations = await repo.listTranslations(id);
    return NextResponse.json({ ok: true, translations, languages: PRODUCTION_LANGUAGES });
  } catch (e) {
    const status = isContentProductionNotMigratedError(e) ? 503 : 500;
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status });
  }
}

export async function POST(request: NextRequest, ctx: Ctx) {
  try {
    const user = await requireAdminApi();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const id = (await Promise.resolve(ctx.params)).id;
    const body = (await request.json()) as {
      language?: string;
      body?: string;
      review_status?: TranslationReviewStatus;
    };
    const language = String(body.language || '').trim().toLowerCase();
    if (!language) return NextResponse.json({ error: 'language is required' }, { status: 400 });
    const repo = await getContentProductionRepository();
    const row = await repo.upsertTranslation({
      task_id: id,
      language,
      body: body.body,
      review_status: body.review_status,
    });
    return NextResponse.json({ ok: true, translation: row, published: false });
  } catch (e) {
    const status = isContentProductionNotMigratedError(e) ? 503 : 400;
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status });
  }
}
