/**
 * Temporary content maintenance mode.
 * Controlled only by CONTENT_MAINTENANCE_MODE=true|false (server env).
 * Does not alter profiles, purchases, or question data.
 */

export const CONTENT_MAINTENANCE_MESSAGE =
  'LingoTheory practice content is temporarily unavailable while we update and improve the learning content. Existing accounts and purchases remain safe. Please check back soon.';

export const CONTENT_MAINTENANCE_API_MESSAGE =
  'Practice content is temporarily unavailable.';

export function isContentMaintenanceMode(
  env: NodeJS.ProcessEnv | Record<string, string | undefined> = process.env
): boolean {
  const raw = (env.CONTENT_MAINTENANCE_MODE || '').trim().toLowerCase();
  return raw === 'true' || raw === '1' || raw === 'yes' || raw === 'on';
}

export function contentMaintenanceJsonBody() {
  return {
    error: 'content_maintenance',
    message: CONTENT_MAINTENANCE_API_MESSAGE,
  };
}
