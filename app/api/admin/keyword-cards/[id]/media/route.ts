/**
 * Optional image for one Keyword Card.
 * Reuses the question-images bucket. Does not change official questions.
 * Keyword Cards do not support video.
 */
import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin/auth';
import { createServiceClient } from '@/lib/admin/supabaseAdmin';
import { keywordImageExtension, keywordImageUploadError } from '@/lib/keyword-cards/imageFile';
import { keywordCardsError } from '@/lib/keyword-cards/http';
import { removeLocalKeywordImage, saveLocalKeywordImage } from '@/lib/keyword-cards/localMedia';
import { keywordImageIsReferencedByAnother } from '@/lib/keyword-cards/rules';
import { getKeywordCardsRepository } from '@/lib/keyword-cards/store';
import { learningCardsBackend } from '@/lib/learning-cards/backend';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> } | { params: { id: string } };

async function resolveId(ctx: Ctx): Promise<string> {
  const params = await Promise.resolve(ctx.params);
  return params.id;
}

async function removeOwnedImage(storagePath: string | null | undefined) {
  if (!storagePath) return;
  if (storagePath.startsWith('local/')) {
    removeLocalKeywordImage(storagePath);
    return;
  }
  if (!storagePath.startsWith('keyword-cards/')) return;
  try {
    const admin = createServiceClient();
    await admin.storage.from('question-images').remove([storagePath]);
  } catch {
    // The card row is the source of truth. A leftover object can be cleaned later.
  }
}

export async function POST(request: NextRequest, ctx: Ctx) {
  const user = await requireAdminApi();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const id = await resolveId(ctx);
    const form = await request.formData();
    const file = form.get('file');
    const alt = String(form.get('image_alt') || 'Keyword image');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'file is required' }, { status: 400 });
    }
    if (file.type.startsWith('video/')) {
      return NextResponse.json({ error: 'Keyword cards do not support video' }, { status: 400 });
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    const checked = keywordImageUploadError({
      type: file.type,
      name: file.name,
      size: file.size,
      bytes,
    });
    if (!checked.kind) {
      return NextResponse.json({ error: checked.error }, { status: 400 });
    }

    const repo = await getKeywordCardsRepository({ mode: 'admin' });
    const existing = (await repo.list()).keywords.find((row) => row.id === id);
    if (!existing) {
      return NextResponse.json({ error: 'Keyword card not found' }, { status: 404 });
    }

    if (learningCardsBackend() !== 'supabase') {
      const saved = saveLocalKeywordImage(id, bytes, keywordImageExtension(checked.kind));
      const keyword = await repo.setImage(
        id,
        {
          image_url: saved.image_url,
          image_alt: alt,
          image_storage_path: saved.image_storage_path,
        },
        user.id
      );
      const afterUpload = await repo.list();
      const previousPath = existing.image_storage_path || '';
      if (
        !keywordImageIsReferencedByAnother(afterUpload.keywords, id, {
          image_url: existing.image_url,
          image_storage_path: previousPath,
        })
      ) {
        await removeOwnedImage(previousPath);
      }
      return NextResponse.json({
        keyword,
        image_url: saved.image_url,
        official_question_unchanged: true,
        backend: 'local',
      });
    }

    const storagePath = `keyword-cards/${id}/${Date.now()}.${keywordImageExtension(checked.kind)}`;
    const admin = createServiceClient();
    const { error: uploadError } = await admin.storage
      .from('question-images')
      .upload(storagePath, Buffer.from(bytes), { contentType: checked.kind, upsert: false });
    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }
    const { data: pub } = admin.storage.from('question-images').getPublicUrl(storagePath);
    const keyword = await repo.setImage(
      id,
      { image_url: pub.publicUrl, image_alt: alt, image_storage_path: storagePath },
      user.id
    );
    const afterUpload = await repo.list();
    const previousPath = existing.image_storage_path || '';
    if (
      (previousPath.startsWith('keyword-cards/') || previousPath.startsWith('local/')) &&
      !keywordImageIsReferencedByAnother(afterUpload.keywords, id, {
        image_url: existing.image_url,
        image_storage_path: previousPath,
      })
    ) {
      await removeOwnedImage(previousPath);
    }
    return NextResponse.json({
      keyword,
      image_url: pub.publicUrl,
      official_question_unchanged: true,
    });
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
    if (!existing) {
      return NextResponse.json({ error: 'Keyword card not found' }, { status: 404 });
    }
    const previousPath = existing.image_storage_path || '';
    const keyword = await repo.setImage(
      id,
      { image_url: null, image_alt: null, image_storage_path: null },
      user.id
    );
    const afterClear = await repo.list();
    if (
      (previousPath.startsWith('keyword-cards/') || previousPath.startsWith('local/')) &&
      !keywordImageIsReferencedByAnother(afterClear.keywords, id, {
        image_url: existing.image_url,
        image_storage_path: previousPath,
      })
    ) {
      await removeOwnedImage(previousPath);
    }
    return NextResponse.json({ keyword, official_question_unchanged: true });
  } catch (error) {
    return keywordCardsError(error);
  }
}
