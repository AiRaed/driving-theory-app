import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin/auth';
import { loadBundledRecommendations } from '@/lib/learning-cards/recommendations';
import { isContentProductionNotMigratedError } from '@/lib/content-production/errors';
import { getContentProductionRepository } from '@/lib/content-production/store';
import type { ProductionFilters, ProductionFormat } from '@/lib/content-production/types';
import { assertNoOfficialMutation } from '@/lib/content-production/questionContext';

export const dynamic = 'force-dynamic';

function fail(e: unknown) {
  const status = isContentProductionNotMigratedError(e) ? 503 : 500;
  return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status });
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAdminApi();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const repo = await getContentProductionRepository();
    const { searchParams } = new URL(request.url);
    const filters: ProductionFilters = {
      topic: searchParams.get('topic') || '',
      format: searchParams.get('format') || '',
      priority: searchParams.get('priority') || '',
      status: searchParams.get('status') || '',
      coverage: (searchParams.get('coverage') as ProductionFilters['coverage']) || '',
    };
    const tasks = await repo.listTasks(filters);
    const totals = await repo.totals();
    return NextResponse.json({
      ok: true,
      backend: repo.backend,
      dvsa_approved: false,
      publishes_cards: false,
      totals,
      tasks,
    });
  } catch (e) {
    return fail(e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdminApi();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = (await request.json()) as Record<string, unknown>;
    assertNoOfficialMutation(body);
    const repo = await getContentProductionRepository();

    if (body.action === 'preview' || body.dry_run === true) {
      const recs = loadBundledRecommendations();
      const preview = await repo.previewSeed(recs);
      return NextResponse.json(preview);
    }

    if (body.action === 'seed') {
      const recs = loadBundledRecommendations();
      const preview = await repo.previewSeed(recs);
      if (!preview.ok) {
        return NextResponse.json({ ...preview, wrote: false }, { status: 422 });
      }
      const result = await repo.seedFromRecommendations(recs, { created_by: user.id });
      return NextResponse.json({
        ok: true,
        published: false,
        generated_explanations: false,
        wrote: true,
        created: result.created,
        skipped: result.skipped,
        tasks: result.created,
        questions_covered: preview.questions_covered,
        group_count: preview.group_count,
        missing_ids: preview.missing_ids,
        incomplete_stems: preview.incomplete_stems,
        mismatched_versions: preview.mismatched_versions,
        duplicate_coverage_count: preview.duplicate_coverage_count,
        would_skip_duplicate_coverage: preview.would_skip_duplicate_coverage,
        source: preview.source,
      });
    }

    const task = await repo.createManualTask({
      title: String(body.title || '').trim() || 'Untitled production task',
      topic: String(body.topic || '').trim() || 'rules-of-the-road',
      format: (String(body.format || 'text') as ProductionFormat) || 'text',
      priority: (body.priority as 'high' | 'medium' | 'low') || 'medium',
      question_ids: Array.isArray(body.question_ids)
        ? body.question_ids.map((id) => String(id))
        : String(body.question_ids || '')
            .split(',')
            .map((id) => id.trim())
            .filter(Boolean),
      notes: String(body.notes || ''),
      created_by: user.id,
    });
    return NextResponse.json({ ok: true, task, published: false });
  } catch (e) {
    return fail(e);
  }
}
