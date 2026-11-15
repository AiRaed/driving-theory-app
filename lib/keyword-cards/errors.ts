export class KeywordCardsNotMigratedError extends Error {
  readonly code = 'KEYWORD_CARDS_NOT_MIGRATED';
  constructor(message = 'Keyword Cards tables are not migrated yet (0011 unapplied).') {
    super(message);
    this.name = 'KeywordCardsNotMigratedError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function isKeywordCardsNotMigratedError(
  error: unknown
): error is KeywordCardsNotMigratedError {
  return (
    error instanceof KeywordCardsNotMigratedError ||
    (typeof error === 'object' &&
      error !== null &&
      ((error as { name?: string }).name === 'KeywordCardsNotMigratedError' ||
        (error as { code?: string }).code === 'KEYWORD_CARDS_NOT_MIGRATED'))
  );
}

export function isMissingKeywordCardsTable(
  error: { message?: string; code?: string; details?: string } | null | undefined
): boolean {
  if (!error) return false;
  const code = String(error.code || '');
  if (code === 'PGRST205' || code === '42P01' || code === 'PGRST204') return true;
  const msg = `${error.message || ''} ${error.details || ''}`.toLowerCase();
  return (
    msg.includes('schema cache') ||
    msg.includes('does not exist') ||
    msg.includes('could not find the table')
  );
}
