import { NextResponse } from 'next/server';
import { ANDROID_PACKAGE_NAME, normalizeSha256Fingerprint } from '@/lib/auth/wellKnown';

export const dynamic = 'force-dynamic';

/**
 * Digital Asset Links for Android App Links.
 * PLAY_APP_SIGNING_SHA256 must be the Play App Signing key fingerprint, not a debug key.
 */
export function GET() {
  const raw = process.env.PLAY_APP_SIGNING_SHA256?.trim();
  if (!raw) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const body = [
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: ANDROID_PACKAGE_NAME,
        sha256_cert_fingerprints: [normalizeSha256Fingerprint(raw)],
      },
    },
  ];

  return NextResponse.json(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
