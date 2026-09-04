/** Dev-only account diagnostics gate (no secrets). */
export function isAccountDiagnosticsEnabled(
  env: NodeJS.ProcessEnv | Record<string, string | undefined> = process.env
): boolean {
  if (env.NODE_ENV !== 'production') {
    return true;
  }
  return env.NEXT_PUBLIC_ENABLE_ACCOUNT_DIAGNOSTICS === 'true';
}
