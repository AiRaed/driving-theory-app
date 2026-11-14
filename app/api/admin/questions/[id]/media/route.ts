/**
 * Replace / version question media without editing application code.
 * Requires migration 0008 (question_media_revisions + answer_*_image_url).
 * Preserves original_ref on prior revisions for rollback.
 */
import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin/auth';
import { createServiceClient } from '@/lib/admin/supabaseAdmin';
import type { QuestionRow } from '@/lib/questions/types';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> } | { params: { id: string } };

const SLOTS = new Set(['stem', 'answer_1', 'answer_2', 'answer_3', 'answer_4']);
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BYTES = 4 * 1024 * 1024;

async function resolveId(ctx: Ctx): Promise<string> {
  const p = await Promise.resolve(ctx.params);
  return p.id;
}

function columnForSlot(slot: string): keyof QuestionRow | 'image_url' {
  if (slot === 'stem') return 'image_url';
  return `${slot}_image_url` as keyof QuestionRow;
}

export async function GET(_request: NextRequest, ctx: Ctx) {
  try {
    const user = await requireAdminApi();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const id = await resolveId(ctx);
    const admin = createServiceClient();
    const { data, error } = await admin
      .from('question_media_revisions')
      .select('*')
      .eq('question_id', id)
      .order('slot', { ascending: true })
      .order('version', { ascending: false });
    if (error) {
      return NextResponse.json(
        {
          error: error.message,
          hint: 'Apply migration 0008 before using media revision history.',
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ revisions: data || [] });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: NextRequest, ctx: Ctx) {
  try {
    const user = await requireAdminApi();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const id = await resolveId(ctx);
    const form = await request.formData();
    const slot = String(form.get('slot') || '');
    const notes = String(form.get('notes') || '');
    const reviewStatus = String(form.get('review_status') || 'unreviewed');
    const file = form.get('file');
    const rollbackToVersion = form.get('rollback_to_version');

    if (!SLOTS.has(slot)) {
      return NextResponse.json(
        { error: 'slot must be stem | answer_1 | answer_2 | answer_3 | answer_4' },
        { status: 400 }
      );
    }
    if (!['unreviewed', 'needs_fix', 'reviewed'].includes(reviewStatus)) {
      return NextResponse.json({ error: 'Invalid review_status' }, { status: 400 });
    }

    const admin = createServiceClient();
    const { data: question, error: qErr } = await admin
      .from('questions')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (qErr) return NextResponse.json({ error: qErr.message }, { status: 500 });
    if (!question) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const { data: existingRevs, error: revErr } = await admin
      .from('question_media_revisions')
      .select('*')
      .eq('question_id', id)
      .eq('slot', slot)
      .order('version', { ascending: false });
    if (revErr) {
      return NextResponse.json(
        {
          error: revErr.message,
          hint: 'Apply migration 0008 before replacing media.',
        },
        { status: 500 }
      );
    }

    const nextVersion =
      existingRevs && existingRevs.length > 0
        ? Math.max(...existingRevs.map((r: { version: number }) => r.version)) + 1
        : 1;

    let publicUrl: string | null = null;
    let storagePath: string | null = null;
    let mimeType: string | null = null;
    let byteSize: number | null = null;
    let originalRef: string | null =
      (question.media_original_refs && question.media_original_refs[slot]) ||
      existingRevs?.[0]?.original_ref ||
      null;

    if (rollbackToVersion != null && String(rollbackToVersion).trim() !== '') {
      const targetVersion = Number(rollbackToVersion);
      const target = (existingRevs || []).find(
        (r: { version: number }) => r.version === targetVersion
      );
      if (!target?.public_url) {
        return NextResponse.json({ error: 'Rollback target not found' }, { status: 404 });
      }
      publicUrl = target.public_url;
      storagePath = target.storage_path;
      mimeType = target.mime_type;
      byteSize = target.byte_size;
      originalRef = target.original_ref;
    } else {
      if (!(file instanceof File)) {
        return NextResponse.json({ error: 'file is required (or rollback_to_version)' }, { status: 400 });
      }
      if (!ALLOWED.has(file.type)) {
        return NextResponse.json({ error: 'Only JPG, PNG, or WebP allowed' }, { status: 400 });
      }
      if (file.size > MAX_BYTES) {
        return NextResponse.json({ error: 'File must be under 4MB' }, { status: 400 });
      }
      const ext =
        file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
      storagePath = `dvsa-v2/${id}/${slot}/v${nextVersion}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      const { error: uploadError } = await admin.storage
        .from('question-images')
        .upload(storagePath, buffer, { contentType: file.type, upsert: false });
      if (uploadError) {
        return NextResponse.json({ error: uploadError.message }, { status: 500 });
      }
      const { data: pub } = admin.storage.from('question-images').getPublicUrl(storagePath);
      publicUrl = pub.publicUrl;
      mimeType = file.type;
      byteSize = file.size;
    }

    await admin
      .from('question_media_revisions')
      .update({ is_current: false })
      .eq('question_id', id)
      .eq('slot', slot)
      .eq('is_current', true);

    const { data: revision, error: insertErr } = await admin
      .from('question_media_revisions')
      .insert({
        question_id: id,
        slot,
        version: nextVersion,
        is_current: true,
        original_ref: originalRef,
        storage_path: storagePath,
        public_url: publicUrl,
        mime_type: mimeType,
        byte_size: byteSize,
        review_status: reviewStatus,
        notes:
          notes ||
          (rollbackToVersion
            ? `Rollback to version ${rollbackToVersion}`
            : 'Admin media replacement'),
        created_by: user.id,
      })
      .select('*')
      .single();

    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    const col = columnForSlot(slot);
    const questionPatch: Record<string, unknown> = {
      [col]: publicUrl,
      updated_by: user.id,
    };
    if (question.media_review_status === 'reviewed' && reviewStatus !== 'reviewed') {
      questionPatch.media_review_status = reviewStatus;
    } else if (
      !question.media_review_status ||
      question.media_review_status === 'not_applicable' ||
      question.media_review_status === 'unreviewed'
    ) {
      questionPatch.media_review_status = reviewStatus === 'reviewed' ? 'reviewed' : reviewStatus;
    }

    const { data: updated, error: upErr } = await admin
      .from('questions')
      .update(questionPatch)
      .eq('id', id)
      .select('*')
      .single();
    if (upErr) {
      return NextResponse.json({ error: upErr.message }, { status: 500 });
    }

    return NextResponse.json({ question: updated, revision });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
