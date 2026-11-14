import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin/auth';
import { createServiceClient } from '@/lib/admin/supabaseAdmin';
import { isContentProductionNotMigratedError } from '@/lib/content-production/errors';
import { assertNoOfficialMutation, loadQuestionContexts } from '@/lib/content-production/questionContext';
import { getContentProductionRepository } from '@/lib/content-production/store';
import type { ProductionFormat, ProductionStatus } from '@/lib/content-production/types';
import { contentProductionBackend } from '@/lib/content-production/backend';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> } | { params: { id: string } };

async function resolveId(ctx: Ctx): Promise<string> {
  const p = await Promise.resolve(ctx.params);
  return p.id;
}

function fail(e: unknown) {
  const status = isContentProductionNotMigratedError(e) ? 503 : 400;
  return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status });
}

export async function GET(_request: NextRequest, ctx: Ctx) {
  try {
    const user = await requireAdminApi();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const id = await resolveId(ctx);
    const repo = await getContentProductionRepository();
    const task = await repo.getTask(id);
    if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const translations = await repo.listTranslations(id);
    const assets = await repo.assetsForTask(id);
    let questions: unknown[] = [];
    if (contentProductionBackend() === 'supabase' || process.env.CONTENT_PRODUCTION_USE_SUPABASE === 'true') {
      try {
        const admin = createServiceClient();
        questions = await loadQuestionContexts(admin as never, task.question_ids);
      } catch {
        questions = [];
      }
    }
    return NextResponse.json({
      ok: true,
      task,
      translations,
      assets,
      questions,
      official_locked: true,
      publishes_cards: false,
    });
  } catch (e) {
    return fail(e);
  }
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  try {
    const user = await requireAdminApi();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const id = await resolveId(ctx);
    const body = (await request.json()) as Record<string, unknown>;
    assertNoOfficialMutation(body);
    const repo = await getContentProductionRepository();

    if (Array.isArray(body.link_question_ids) && body.link_question_ids.length) {
      const task = await repo.linkQuestions(id, body.link_question_ids.map(String));
      return NextResponse.json({ ok: true, task });
    }
    if (Array.isArray(body.unlink_question_ids) && body.unlink_question_ids.length) {
      const task = await repo.unlinkQuestions(id, body.unlink_question_ids.map(String));
      return NextResponse.json({ ok: true, task });
    }

    const task = await repo.patchTask(id, {
      status: body.status as ProductionStatus | undefined,
      format: body.format as ProductionFormat | undefined,
      explanation_en_draft:
        body.explanation_en_draft === undefined ? undefined : String(body.explanation_en_draft),
      notes: body.notes === undefined ? undefined : String(body.notes),
      media_status: body.media_status as ProductionStatus | undefined,
      updated_by: user.id,
    });
    return NextResponse.json({ ok: true, task, published_cards: false });
  } catch (e) {
    return fail(e);
  }
}
