import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin/auth';
import { createServiceClient } from '@/lib/admin/supabaseAdmin';
import { keywordCardsError } from '@/lib/keyword-cards/http';
import { removeLocalKeywordImage } from '@/lib/keyword-cards/localMedia';
import { keywordImageIsReferencedByAnother } from '@/lib/keyword-cards/rules';
import { getKeywordCardsRepository } from '@/lib/keyword-cards/store';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> } | { params: { id: string } };

async function resolveId(ctx: Ctx): Promise<string> {
  const params = await Promise.resolve(ctx.params);
  return params.id;
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const user = await requireAdminApi();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const id = await resolveId(ctx);
    const body = await request.json();
    const repo = await getKeywordCardsRepository({ mode: 'admin' });
    const existing = (await repo.list()).keywords.find((row) => row.id === id);
    const keyword = await repo.update(
      id,
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
    const previousPath = existing?.image_storage_path || '';
    if (
      (previousPath.startsWith('local/') || previousPath.startsWith('keyword-cards/')) &&
      existing?.image_url !== keyword.image_url
    ) {
      const remaining = await repo.list();
      const shared = keywordImageIsReferencedByAnother(remaining.keywords, id, {
        image_url: existing?.image_url,
        image_storage_path: previousPath,
      });
      if (!shared && previousPath.startsWith('local/')) {
        removeLocalKeywordImage(previousPath);
      }
      if (!shared && previousPath.startsWith('keyword-cards/')) {
        try {
          const admin = createServiceClient();
          await admin.storage.from('question-images').remove([previousPath]);
        } catch {
          // The card row no longer points at this object.
        }
      }
    }
    return NextResponse.json({ keyword, backend: repo.backend });
  } catch (error) {
    return keywordCardsError(error);
  }
}

export async function DELETE(_request: NextRequest, ctx: Ctx) {
  const user = await requireAdminApi();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const id = await resolveId(ctx);
    const repo = await getKeywordCardsRepository({ mode: 'admin' });
    const existing = (await repo.list()).keywords.find((row) => row.id === id);
    await repo.remove(id);
    const previousPath = existing?.image_storage_path || '';
    if (previousPath.startsWith('local/') || previousPath.startsWith('keyword-cards/')) {
      const remaining = await repo.list();
      const shared = keywordImageIsReferencedByAnother(remaining.keywords, id, {
        image_url: existing?.image_url,
        image_storage_path: previousPath,
      });
      if (!shared && previousPath.startsWith('local/')) {
        removeLocalKeywordImage(previousPath);
      }
      if (!shared && previousPath.startsWith('keyword-cards/')) {
        try {
          const admin = createServiceClient();
          await admin.storage.from('question-images').remove([previousPath]);
        } catch {
          // The keyword row is already gone. A leftover object can be cleaned later.
        }
      }
    }
    return NextResponse.json({ deleted: true, backend: repo.backend });
  } catch (error) {
    return keywordCardsError(error);
  }
}
