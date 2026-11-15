import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin/auth';
import { learningCardsBackend } from '@/lib/learning-cards/backend';
import { keywordCardsError } from '@/lib/keyword-cards/http';
import { loadOfficialQuestionIds } from '@/lib/keyword-cards/importDrafts';
import { officialQuestionExists } from '@/lib/keyword-cards/officialQuestion';
import { isOfficialQuestionId, normalizeOfficialQuestionId } from '@/lib/keyword-cards/questionId';
import { getKeywordCardsRepository } from '@/lib/keyword-cards/store';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> } | { params: { id: string } };

async function resolveId(ctx: Ctx): Promise<string> {
  const params = await Promise.resolve(ctx.params);
  return params.id;
}

export async function POST(request: NextRequest, ctx: Ctx) {
  const user = await requireAdminApi();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const keywordId = await resolveId(ctx);
    const body = await request.json();
    const questionId = normalizeOfficialQuestionId(body.question_id || '');
    if (!isOfficialQuestionId(questionId)) {
      return NextResponse.json({ error: 'Official question id is not valid' }, { status: 400 });
    }
    if (learningCardsBackend() === 'local') {
      let known: Set<string>;
      try {
        known = loadOfficialQuestionIds();
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Official question bank could not be read';
        return NextResponse.json({ error: message }, { status: 503 });
      }
      if (!known.has(questionId)) {
        return NextResponse.json({ error: 'Official question was not found' }, { status: 404 });
      }
    } else {
      const exists = await officialQuestionExists(questionId);
      if (!exists) {
        return NextResponse.json({ error: 'Official question was not found' }, { status: 404 });
      }
    }
    const repo = await getKeywordCardsRepository({ mode: 'admin' });
    const link = await repo.link(keywordId, questionId, user.id);
    return NextResponse.json({ link, backend: repo.backend });
  } catch (error) {
    return keywordCardsError(error);
  }
}

export async function DELETE(request: NextRequest, ctx: Ctx) {
  const user = await requireAdminApi();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const keywordId = await resolveId(ctx);
    const questionId = normalizeOfficialQuestionId(
      new URL(request.url).searchParams.get('question_id') || ''
    );
    if (!questionId) {
      return NextResponse.json({ error: 'Official question is required' }, { status: 400 });
    }
    const repo = await getKeywordCardsRepository({ mode: 'admin' });
    await repo.unlink(keywordId, questionId);
    return NextResponse.json({ unlinked: true, backend: repo.backend });
  } catch (error) {
    return keywordCardsError(error);
  }
}
