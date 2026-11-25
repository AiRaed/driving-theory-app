import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin/auth';
import { EXPLANATION_OVERRIDE_VALUES, type ExplanationOverride } from '@/lib/learning-cards/types';
import { getLearningCardsRepository } from '@/lib/learning-cards/store';
import { isLearningCardsNotMigratedError } from '@/lib/learning-cards/errors';
import { loadHintDraft, PROVISIONAL_HINT_LABEL } from '@/lib/learning-cards/hintDraftStore';
import { hintPresentationLabel } from '@/lib/learning-cards/hints';
import { practiceCategoryName, practiceCategoryPlacements } from '@/lib/questions/practiceCategory';
import { loadPublishedPracticeOrder } from '@/lib/questions/practiceCategoryOrder';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> } | { params: { id: string } };

async function resolveId(ctx: Ctx): Promise<string> {
  const p = await Promise.resolve(ctx.params);
  return p.id;
}

function fail(e: unknown) {
  const status = isLearningCardsNotMigratedError(e) ? 503 : 500;
  return NextResponse.json(
    { error: e instanceof Error ? e.message : 'Failed', live_database_written: false },
    { status }
  );
}

export async function GET(_request: NextRequest, ctx: Ctx) {
  const user = await requireAdminApi();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const repo = await getLearningCardsRepository({ mode: 'admin' });
    const id = await resolveId(ctx);
    const rec = await repo.getRecommendation(id);
    if (!rec) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const draft = loadHintDraft(id);
    const order = await loadPublishedPracticeOrder();
    const place = order ? practiceCategoryPlacements(order).get(id) || null : null;
    return NextResponse.json({
      recommendation: rec,
      practice_category: place || {
        questionId: id,
        categoryId: rec.topic,
        categoryName: practiceCategoryName(rec.topic),
        position: null,
        total: 0,
      },
      suggested_hint: draft
        ? {
            english: draft.english,
            presentation: draft.presentation,
            presentation_label: hintPresentationLabel(draft.suggested_format),
            linked_question_ids: draft.linked_question_ids,
            review_status: draft.review_status,
            provisional: draft.provisional === true,
            review_label: draft.provisional ? draft.review_label || PROVISIONAL_HINT_LABEL : null,
            published: false,
            dvsa_approved: false,
          }
        : null,
      dvsa_approved: false,
      backend: repo.backend,
    });
  } catch (e) {
    return fail(e);
  }
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const user = await requireAdminApi();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const repo = await getLearningCardsRepository({ mode: 'admin' });
    const id = await resolveId(ctx);
    const body = await request.json();
    const rawOverride = body.admin_override as unknown;
    let admin_override: ExplanationOverride | null | undefined;
    if (rawOverride === undefined) {
      admin_override = undefined;
    } else if (rawOverride === '' || rawOverride === 'clear' || rawOverride === null) {
      admin_override = null;
    } else {
      admin_override = rawOverride as ExplanationOverride;
    }
    if (admin_override != null && !EXPLANATION_OVERRIDE_VALUES.includes(admin_override)) {
      return NextResponse.json({ error: 'Invalid override' }, { status: 400 });
    }
    const rec = await repo.saveOverride(id, {
      admin_override,
      override_note: body.override_note,
      card_unnecessary: body.card_unnecessary,
      updated_by: user.id,
    });
    return NextResponse.json({
      recommendation: rec,
      dvsa_approved: false,
      backend: repo.backend,
      live_database_written: repo.backend === 'supabase',
    });
  } catch (e) {
    return fail(e);
  }
}
