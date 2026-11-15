import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin/auth';
import { isKeywordCardsNotMigratedError } from '@/lib/keyword-cards/errors';
import { keywordCardsError } from '@/lib/keyword-cards/http';
import {
  assertKeywordDraftImportConfirmation,
  KeywordDraftImportRejectedError,
  loadOfficialQuestionIds,
  loadReviewedKeywordDraft,
  previewKeywordDraftImport,
} from '@/lib/keyword-cards/importDrafts';
import { getKeywordCardsRepository } from '@/lib/keyword-cards/store';

export const dynamic = 'force-dynamic';

function rejected(error: KeywordDraftImportRejectedError) {
  return NextResponse.json(
    {
      ok: false,
      error: error.message,
      errors: error.errors,
      published: false,
      live_database_written: false,
    },
    { status: 400 }
  );
}

export async function POST(request: NextRequest) {
  const user = await requireAdminApi();
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized', published: false, live_database_written: false },
      { status: 401 }
    );
  }

  let body: { action?: unknown; confirm?: unknown } | null = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }
  if (!body || (body.action !== 'preview' && body.action !== 'commit')) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Malformed import request',
        published: false,
        live_database_written: false,
      },
      { status: 400 }
    );
  }

  let draft;
  let officialQuestionIds: Set<string>;
  try {
    draft = loadReviewedKeywordDraft();
    officialQuestionIds = loadOfficialQuestionIds();
  } catch (error) {
    if (error instanceof KeywordDraftImportRejectedError) return rejected(error);
    return keywordCardsError(error);
  }

  const filePreview = previewKeywordDraftImport(draft, officialQuestionIds);
  if (!filePreview.ok) {
    return NextResponse.json(
      { ...filePreview, database: 'unread', live_database_written: false },
      { status: 400 }
    );
  }

  if (body.action === 'preview') {
    try {
      const repo = await getKeywordCardsRepository({ mode: 'admin' });
      const existing = await repo.list();
      const preview = previewKeywordDraftImport(draft, officialQuestionIds, existing);
      return NextResponse.json({
        ...preview,
        database: repo.backend,
        migration_required: null,
        live_database_written: false,
      });
    } catch (error) {
      if (isKeywordCardsNotMigratedError(error)) {
        return NextResponse.json(
          {
            ...filePreview,
            database: 'not_migrated',
            migration_required: '0011_keyword_cards.sql',
            live_database_written: false,
            error: error.message,
          },
          { status: 503 }
        );
      }
      return keywordCardsError(error);
    }
  }

  try {
    assertKeywordDraftImportConfirmation(body.confirm);
  } catch (error) {
    if (error instanceof KeywordDraftImportRejectedError) return rejected(error);
    return keywordCardsError(error);
  }

  try {
    const repo = await getKeywordCardsRepository({ mode: 'admin' });
    const result = await repo.importDrafts(draft, officialQuestionIds, user.id);
    return NextResponse.json({
      ...result,
      database: repo.backend,
      live_database_written: repo.backend === 'supabase',
      published: false,
    });
  } catch (error) {
    if (error instanceof KeywordDraftImportRejectedError) return rejected(error);
    if (isKeywordCardsNotMigratedError(error)) {
      return NextResponse.json(
        {
          error: error.message,
          database: 'not_migrated',
          migration_required: '0011_keyword_cards.sql',
          published: false,
          live_database_written: false,
        },
        { status: 503 }
      );
    }
    return keywordCardsError(error);
  }
}
