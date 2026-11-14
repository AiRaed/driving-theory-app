import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin/auth';
import { createServiceClient } from '@/lib/admin/supabaseAdmin';
import { assertSingleDraftRequest, generateGroundedEnglishDraft } from '@/lib/content-production/draft';
import { isContentProductionNotMigratedError } from '@/lib/content-production/errors';
import { loadQuestionContexts } from '@/lib/content-production/questionContext';
import { getContentProductionRepository } from '@/lib/content-production/store';
import type { QuestionContext } from '@/lib/content-production/types';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> } | { params: { id: string } };

export async function POST(request: NextRequest, ctx: Ctx) {
  try {
    const user = await requireAdminApi();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const p = await Promise.resolve(ctx.params);
    const id = p.id;
    const body = (await request.json()) as {
      question_id?: string;
      question_ids?: string[];
      batch?: boolean;
      apply?: boolean;
      question?: QuestionContext;
    };
    assertSingleDraftRequest(body);
    const repo = await getContentProductionRepository();
    const task = await repo.getTask(id);
    if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const questionId = String(body.question_id || task.question_ids[0] || '');
    if (!questionId) {
      return NextResponse.json({ error: 'A linked question is required for a grounded draft.' }, { status: 400 });
    }

    let question = body.question;
    if (!question) {
      try {
        const admin = createServiceClient();
        const rows = await loadQuestionContexts(admin as never, [questionId]);
        question = rows[0];
      } catch {
        question = undefined;
      }
    }
    if (!question) {
      return NextResponse.json(
        {
          error:
            'Official question context is required. Pass a grounded question snapshot in local mode, or use Supabase questions.',
        },
        { status: 400 }
      );
    }
    const grounded = generateGroundedEnglishDraft(question);
    if (!grounded.ok) {
      return NextResponse.json(
        { error: 'Official explanation_en is empty; refusing to invent a road rule.' },
        { status: 400 }
      );
    }

    let taskOut = task;
    if (body.apply === true) {
      taskOut = await repo.patchTask(id, {
        explanation_en_draft: grounded.draft,
        updated_by: user.id,
      });
    }

    return NextResponse.json({
      ok: true,
      source: grounded.source,
      invented: false,
      applied: body.apply === true,
      published: false,
      question_id: questionId,
      draft: grounded.draft,
      task: taskOut,
      official: {
        question_en: question.question_en,
        explanation_en: question.explanation_en,
        correct_answer: question.correct_answer,
        locked: true,
      },
    });
  } catch (e) {
    const status = isContentProductionNotMigratedError(e) ? 503 : 400;
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status });
  }
}
