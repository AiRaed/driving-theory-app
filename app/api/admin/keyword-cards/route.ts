import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin/auth';
import { keywordCardsError } from '@/lib/keyword-cards/http';
import { getKeywordCardsRepository } from '@/lib/keyword-cards/store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const user = await requireAdminApi();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  try {
    const repo = await getKeywordCardsRepository({ mode: 'admin' });
    const catalog = await repo.list({
      q: searchParams.get('q') || '',
      status: searchParams.get('status') || '',
    });
    return NextResponse.json({ ...catalog, backend: repo.backend });
  } catch (error) {
    return keywordCardsError(error);
  }
}

export async function POST(request: NextRequest) {
  const user = await requireAdminApi();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    const repo = await getKeywordCardsRepository({ mode: 'admin' });
    const keyword = await repo.create(
      {
        term_en: body.term_en,
        explanation_en: body.explanation_en,
        translation_ar: body.translation_ar,
        explanation_ar: body.explanation_ar,
        image_url: body.image_url,
        image_alt: body.image_alt,
        notes: body.notes,
      },
      user.id
    );
    return NextResponse.json({
      keyword,
      backend: repo.backend,
      published: false,
    });
  } catch (error) {
    return keywordCardsError(error);
  }
}
