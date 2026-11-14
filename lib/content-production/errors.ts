export class ContentProductionNotMigratedError extends Error {
  readonly code = 'CONTENT_PRODUCTION_NOT_MIGRATED';
  constructor(message = 'Content production tables are not migrated yet (0010 unapplied).') {
    super(message);
    this.name = 'ContentProductionNotMigratedError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function isContentProductionNotMigratedError(
  error: unknown
): error is ContentProductionNotMigratedError {
  return (
    error instanceof ContentProductionNotMigratedError ||
    (typeof error === 'object' &&
      error !== null &&
      ((error as { name?: string }).name === 'ContentProductionNotMigratedError' ||
        (error as { code?: string }).code === 'CONTENT_PRODUCTION_NOT_MIGRATED'))
  );
}

export function isMissingContentProductionTable(
  error: { message?: string; code?: string; details?: string } | null | undefined
): boolean {
  if (!error) return false;
  const code = String(error.code || '');
  const msg = `${error.message || ''} ${error.details || ''}`.toLowerCase();
  if (code === 'PGRST205' || code === '42P01' || code === 'PGRST204') return true;
  return (
    msg.includes('schema cache') ||
    msg.includes('does not exist') ||
    msg.includes('could not find the table') ||
    /content_production_tasks|content_media_assets|content_production_translations/.test(msg)
  );
}
