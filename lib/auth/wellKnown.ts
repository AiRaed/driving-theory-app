export const APPLE_APP_SITE_ASSOCIATION = {
  applinks: {
    apps: [] as string[],
    details: [
      {
        appID: 'TCMMF3VCZ9.io.lingotheory.mobile',
        paths: ['/auth/*'],
        appIDs: ['TCMMF3VCZ9.io.lingotheory.mobile'],
        components: [{ '/': '/auth/*' }],
      },
    ],
  },
};

export const ANDROID_PACKAGE_NAME = 'io.lingotheory.mobile';

/** Normalize a Play Console SHA-256 fingerprint into colon-separated hex. */
export function normalizeSha256Fingerprint(value: string): string {
  const hex = value.replace(/[^a-fA-F0-9]/g, '').toUpperCase();
  if (hex.length !== 64) {
    return value.trim().toUpperCase();
  }
  return hex.replace(/(.{2})(?=.)/g, '$1:');
}
