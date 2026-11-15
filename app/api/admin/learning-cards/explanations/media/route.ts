/**
 * Optional image upload for an explanation hint.
 * Reuses the existing question-images bucket. Does not change official questions.
 */
import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin/auth';
import { createServiceClient } from '@/lib/admin/supabaseAdmin';
import { getLearningCardsRepository } from '@/lib/learning-cards/store';
import { isCompleteExplanationHint } from '@/lib/learning-cards/hints';

export const dynamic = 'force-dynamic';

const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const VIDEO_TYPES = new Set(['video/mp4', 'video/webm']);
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const MAX_VIDEO_BYTES = 30 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const user = await requireAdminApi();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const form = await request.formData();
  const questionId = String(form.get('question_id') || '').trim();
  const kind = String(form.get('kind') || 'image') === 'video' ? 'video' : 'image';
  const file = form.get('file');
  const alt = String(form.get('image_alt') || 'Explanation hint image');
  const allowed = kind === 'video' ? VIDEO_TYPES : IMAGE_TYPES;
  const maxBytes = kind === 'video' ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (!questionId) {
    return NextResponse.json({ error: 'question_id required' }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'file is required' }, { status: 400 });
  }
  if (!allowed.has(file.type)) {
    return NextResponse.json(
      { error: kind === 'video' ? 'Only MP4 or WebM allowed' : 'Only JPG, PNG, or WebP allowed' },
      { status: 400 }
    );
  }
  if (file.size > maxBytes) {
    return NextResponse.json(
      { error: kind === 'video' ? 'Video must be under 30MB' : 'File must be under 4MB' },
      { status: 400 }
    );
  }

  const repo = await getLearningCardsRepository({ mode: 'admin' });
  const existing =
    (await repo.listExplanationCards(questionId)).find((c) => c.language === 'en') || null;
  const card = await repo.upsertExplanationCard({
    question_id: questionId,
    language: 'en',
    explanation: existing?.explanation || '',
    format: existing?.format || 'text',
    image_url: existing?.image_url,
    image_alt: alt,
    video_url: existing?.video_url,
    notes: existing?.notes || 'Not DVSA-approved.',
    created_by: user.id,
    activate: isCompleteExplanationHint(existing || { explanation: '' }),
  });

  const ext =
    file.type === 'image/png'
      ? 'png'
      : file.type === 'image/webp'
        ? 'webp'
        : file.type === 'video/webm'
          ? 'webm'
          : kind === 'video'
            ? 'mp4'
            : 'jpg';
  const storagePath = `learning-cards/${questionId}/hint-${kind}-${Date.now()}.${ext}`;
  const admin = createServiceClient();
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await admin.storage
    .from('question-images')
    .upload(storagePath, buffer, { contentType: file.type, upsert: true });
  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }
  const { data: pub } = admin.storage.from('question-images').getPublicUrl(storagePath);
  const publicUrl = pub.publicUrl;

  const saved = await repo.upsertExplanationCard({
    question_id: questionId,
    language: 'en',
    explanation: card.explanation,
    format: card.format,
    image_url: kind === 'image' ? publicUrl : card.image_url,
    image_alt: kind === 'image' ? alt : card.image_alt,
    video_url: kind === 'video' ? publicUrl : card.video_url,
    notes: card.notes,
    created_by: user.id,
    activate: isCompleteExplanationHint(card),
  });

  try {
    await admin.from('learning_card_media_revisions').insert({
      explanation_card_id: saved.id,
      card_kind: 'explanation',
      slot: kind,
      version: 1,
      public_url: publicUrl,
      storage_path: storagePath,
      mime_type: file.type,
      byte_size: file.size,
      created_by: user.id,
    });
  } catch {
    // Revisions are optional; the hint image_url is the learner source of truth.
  }

  return NextResponse.json({
    card: saved,
    image_url: kind === 'image' ? publicUrl : card.image_url,
    video_url: kind === 'video' ? publicUrl : card.video_url,
    official_question_unchanged: true,
  });
}
