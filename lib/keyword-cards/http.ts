import { NextResponse } from 'next/server';
import { isKeywordCardsNotMigratedError } from './errors';
import { KeywordDraftImportRejectedError } from './importDrafts';

export function keywordCardsError(error: unknown) {
  const message = error instanceof Error ? error.message : 'Failed';
  let status = 500;
  if (isKeywordCardsNotMigratedError(error)) status = 503;
  else if (error instanceof KeywordDraftImportRejectedError) status = 400;
  else if (/not found/i.test(message)) status = 404;
  else if (
    /required|already exists|already linked|already saved|Cannot move|Only published|do not support video|Official question|too long|Unpublish|unpublished/i.test(
      message
    )
  ) {
    status = 400;
  }
  return NextResponse.json(
    { error: message, live_database_written: false },
    { status }
  );
}
