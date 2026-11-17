import { NextRequest, NextResponse } from 'next/server';
import { readLocalKeywordImage } from '@/lib/keyword-cards/localMedia';

export const dynamic = 'force-dynamic';

/** Serves one still image saved with the local Keyword Card store. */
export async function GET(request: NextRequest) {
  const params = new URL(request.url).searchParams;
  const image = readLocalKeywordImage(params.get('card') || '', params.get('file') || '');
  if (!image) return new NextResponse('Not found', { status: 404 });
  return new NextResponse(new Uint8Array(image.bytes), {
    headers: {
      'Content-Type': image.contentType,
      'Cache-Control': 'private, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
