import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin/auth';
import { createServiceClient } from '@/lib/admin/supabaseAdmin';
import { writeQuestionWithFallback } from '@/lib/questions/repository';
import { formToDbPayload, validateQuestionForm, type QuestionFormData } from '@/lib/questions/types';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> } | { params: { id: string } };

async function resolveId(ctx: Ctx): Promise<string> {
  const p = await Promise.resolve(ctx.params);
  return p.id;
}

export async function GET(_request: NextRequest, ctx: Ctx) {
  try {
    const user = await requireAdminApi();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const id = await resolveId(ctx);
    const admin = createServiceClient();
    const { data, error } = await admin.from('questions').select('*').eq('id', id).maybeSingle();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ question: data });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  try {
    const user = await requireAdminApi();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const id = await resolveId(ctx);
    const body = (await request.json()) as QuestionFormData;
    if (!body.translations) body.translations = {};
    const validation = validateQuestionForm(body);
    if (validation) {
      return NextResponse.json({ error: validation }, { status: 400 });
    }

    const admin = createServiceClient();
    const payload = {
      ...formToDbPayload(body),
      updated_by: user.id,
    };

    const { data, error } = await writeQuestionWithFallback(admin, payload, {
      type: 'update',
      id,
    });

    if (error) {
      console.error('[admin/questions] update', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ question: data });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(request: NextRequest, ctx: Ctx) {
  try {
    const user = await requireAdminApi();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const id = await resolveId(ctx);
    const { searchParams } = new URL(request.url);
    const hard = searchParams.get('hard') === '1';
    const admin = createServiceClient();

    if (hard) {
      const { error } = await admin.from('questions').delete().eq('id', id);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ ok: true, deleted: true });
    }

    const { data, error } = await admin
      .from('questions')
      .update({ status: 'archived', updated_by: user.id })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ question: data, archived: true });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
