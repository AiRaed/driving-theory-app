import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin/auth';
import { createServiceClient } from '@/lib/admin/supabaseAdmin';
import { writeQuestionWithFallback } from '@/lib/questions/repository';
import {
  TOPIC_META,
  formToDbPayload,
  questionNeedsReview,
  validateQuestionForm,
  type QuestionFormData,
  type QuestionRow,
  type QuestionStatus,
} from '@/lib/questions/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAdminApi();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const admin = createServiceClient();
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();
    const topic = searchParams.get('topic') || '';
    const status = searchParams.get('status') || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(100, Math.max(10, parseInt(searchParams.get('pageSize') || '50', 10)));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const needsReviewFilter = status === 'needs_review';

    let query = admin
      .from('questions')
      .select('*', { count: 'exact' })
      .order('updated_at', { ascending: false });

    if (topic) query = query.eq('topic_id', topic);
    if (!needsReviewFilter && status && ['draft', 'published', 'archived'].includes(status)) {
      query = query.eq('status', status as QuestionStatus);
    }
    if (q) {
      query = query.or(
        `question_en.ilike.%${q}%,question_ar.ilike.%${q}%,question_ur.ilike.%${q}%,id.ilike.%${q}%`
      );
    }

    if (needsReviewFilter) {
      // Computed filter — load matching set then paginate in memory (~742 rows).
      const { data, error } = await query;
      if (error) {
        console.error('[admin/questions] list', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      const filtered = ((data || []) as QuestionRow[]).filter(questionNeedsReview);
      const pageSlice = filtered.slice(from, to + 1);
      return NextResponse.json({
        questions: pageSlice,
        total: filtered.length,
        page,
        pageSize,
        topics: TOPIC_META,
      });
    }

    query = query.range(from, to);
    const { data, error, count } = await query;
    if (error) {
      console.error('[admin/questions] list', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      questions: data || [],
      total: count || 0,
      page,
      pageSize,
      topics: TOPIC_META,
    });
  } catch (err) {
    console.error('[admin/questions] GET', err);
    return NextResponse.json({ error: 'Unauthorized or server error' }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdminApi();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = (await request.json()) as QuestionFormData;
    if (!body.translations) body.translations = {};
    const validation = validateQuestionForm(body);
    if (validation) {
      return NextResponse.json({ error: validation }, { status: 400 });
    }

    const admin = createServiceClient();
    const id =
      body.id?.trim() ||
      `${body.topic_id.slice(0, 2).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    const payload = {
      ...formToDbPayload(body),
      id,
      created_by: user.id,
      updated_by: user.id,
    };

    const { data, error } = await writeQuestionWithFallback(admin, payload, { type: 'insert' });
    if (error) {
      console.error('[admin/questions] create', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ question: data });
  } catch (err) {
    console.error('[admin/questions] POST', err);
    return NextResponse.json({ error: 'Unauthorized or server error' }, { status: 401 });
  }
}
