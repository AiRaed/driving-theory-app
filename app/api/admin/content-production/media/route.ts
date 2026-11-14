import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin/auth';
import { isContentProductionNotMigratedError } from '@/lib/content-production/errors';
import { getContentProductionRepository } from '@/lib/content-production/store';
import type { MediaKind, ProductionStatus } from '@/lib/content-production/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await requireAdminApi();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const repo = await getContentProductionRepository();
    const assets = await repo.listAssets();
    return NextResponse.json({ ok: true, assets, backend: repo.backend });
  } catch (e) {
    const status = isContentProductionNotMigratedError(e) ? 503 : 500;
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdminApi();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = (await request.json()) as {
      kind?: MediaKind;
      title?: string;
      language?: string | null;
      public_url?: string;
      storage_path?: string;
      mime_type?: string;
      notes?: string;
      task_id?: string;
      role?: 'visual' | 'voiceover';
      asset_id?: string;
      status?: ProductionStatus;
    };
    const repo = await getContentProductionRepository();

    if (body.asset_id && body.status) {
      const asset = await repo.patchAsset(body.asset_id, { status: body.status });
      return NextResponse.json({ ok: true, asset, published_cards: false });
    }

    if (body.asset_id && body.task_id) {
      const link = await repo.attachAsset(
        body.task_id,
        body.asset_id,
        body.kind === 'voiceover' ? 'voiceover' : body.role || 'visual'
      );
      return NextResponse.json({ ok: true, link });
    }

    const asset = await repo.createAsset({
      kind: (body.kind || 'image') as MediaKind,
      title: String(body.title || 'Untitled asset'),
      language: body.language ?? null,
      public_url: body.public_url || '',
      storage_path: body.storage_path || '',
      mime_type: body.mime_type || '',
      notes: body.notes || '',
    });
    if (body.task_id) {
      await repo.attachAsset(
        body.task_id,
        asset.id,
        asset.kind === 'voiceover' ? 'voiceover' : 'visual'
      );
    }
    return NextResponse.json({ ok: true, asset, published_cards: false });
  } catch (e) {
    const status = isContentProductionNotMigratedError(e) ? 503 : 400;
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status });
  }
}
