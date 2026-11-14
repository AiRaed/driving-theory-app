/**
 * Post-cutover V2 publish gate.
 *
 * First-time publish of unpublished V2 rows still requires DVSA_V2_ALLOW_PUBLISH.
 * Updates to rows that are already published (explanations, translations, media)
 * must succeed so admin CMS can operate without republishing the licensed stem.
 */

export function isV2FirstPublishBlocked(
  existing: { status?: string | null; content_version?: string | null },
  nextStatus: string,
  env: NodeJS.ProcessEnv | Record<string, string | undefined> = process.env
): boolean {
  if (nextStatus !== 'published') return false;
  if (existing.content_version !== 'v2') return false;
  if (existing.status === 'published') return false;
  return env.DVSA_V2_ALLOW_PUBLISH !== 'true';
}
