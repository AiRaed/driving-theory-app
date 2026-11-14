import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin/auth';
import { isContentProductionNotMigratedError } from '@/lib/content-production/errors';
import { getContentProductionRepository } from '@/lib/content-production/store';
import type { ProductionFilters } from '@/lib/content-production/types';

export const dynamic = 'force-dynamic';

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
    const task = await repo.next(filters);
    return NextResponse.json({ ok: true, task, backend: repo.backend });
  } catch (e) {
    const status = isContentProductionNotMigratedError(e) ? 503 : 500;
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status });
  }
}
