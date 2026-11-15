/**
 * Existing images an admin can attach to a Keyword Card.
 * Reads image URLs only. Does not change official question rows.
 */
import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin/auth';
import { createServiceClient } from '@/lib/admin/supabaseAdmin';
import { getKeywordCardsRepository } from '@/lib/keyword-cards/store';

export const dynamic = 'force-dynamic';

const QUESTION_IMAGE_COLUMNS = [
  'image_url',
  'answer_1_image_url',
  'answer_2_image_url',
  'answer_3_image_url',
  'answer_4_image_url',
] as const;

export async function GET() {
  const user = await requireAdminApi();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const images = new Map<string, string>();
  try {
    const repo = await getKeywordCardsRepository({ mode: 'admin' });
    const { keywords } = await repo.list();
    for (const keyword of keywords) {
      if (keyword.image_url) images.set(keyword.image_url, keyword.image_alt || keyword.term_en);
    }
  } catch {
    // The library can still list question images when the keyword tables are unapplied.
  }

  try {
    const admin = createServiceClient();
    const { data } = await admin
      .from('questions')
      .select(
        'image_url, image_alt, answer_1_image_url, answer_2_image_url, answer_3_image_url, answer_4_image_url'
      )
      .limit(800);
    for (const row of data || []) {
      const label = String(row.image_alt || 'Question image');
      for (const column of QUESTION_IMAGE_COLUMNS) {
        const url = row[column];
        if (typeof url === 'string' && url) images.set(url, label);
      }
    }
    const { data: objects } = await admin.storage.from('question-images').list('uploads', {
      limit: 100,
    });
    for (const object of objects || []) {
      if (!object.name || object.name.endsWith('/')) continue;
      const storagePath = `uploads/${object.name}`;
      const { data: pub } = admin.storage.from('question-images').getPublicUrl(storagePath);
      if (pub.publicUrl) images.set(pub.publicUrl, object.name);
    }
  } catch {
    // Storage or question reads are optional. Text-only cards do not need them.
  }

  return NextResponse.json({
    images: Array.from(images, ([url, label]) => ({ url, label })).slice(0, 200),
  });
}
