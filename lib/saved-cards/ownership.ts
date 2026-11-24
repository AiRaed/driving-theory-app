/**
 * Saved-card ownership.
 * The session user is the only owner. A user id in the request body is never
 * proof of ownership. Database policies still require user_id = auth.uid().
 */

export class SavedCardOwnerError extends Error {
  readonly status = 403;

  constructor() {
    super('Saved cards belong to the signed-in user.');
    this.name = 'SavedCardOwnerError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function savedCardOwner(
  sessionUserId: string | null | undefined,
  body?: object | null
): string {
  const owner = String(sessionUserId || '').trim();
  if (!owner) throw new SavedCardOwnerError();
  if (body && Object.prototype.hasOwnProperty.call(body, 'user_id')) {
    const claimed = String((body as { user_id?: unknown }).user_id ?? '').trim();
    if (claimed && claimed !== owner) throw new SavedCardOwnerError();
  }
  return owner;
}

export function rowsOwnedBy<T extends { user_id: string }>(rows: readonly T[], ownerId: string): T[] {
  return rows.filter((row) => row.user_id === ownerId);
}
