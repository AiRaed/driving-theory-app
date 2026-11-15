/**
 * Keyword Card uploads accept one still image: JPG, PNG, or WebP.
 * The declared type is checked against the file bytes so a renamed video is rejected.
 */

export type KeywordImageKind = 'image/jpeg' | 'image/png' | 'image/webp';

const MAX_KEYWORD_IMAGE_BYTES = 4 * 1024 * 1024;

export function keywordImageExtension(kind: KeywordImageKind): string {
  if (kind === 'image/png') return 'png';
  if (kind === 'image/webp') return 'webp';
  return 'jpg';
}

export function normalizeKeywordImageType(type: string, name = ''): KeywordImageKind | null {
  const declared = String(type || '').trim().toLowerCase();
  if (declared === 'image/jpeg' || declared === 'image/jpg' || declared === 'image/pjpeg') {
    return 'image/jpeg';
  }
  if (declared === 'image/png') return 'image/png';
  if (declared === 'image/webp') return 'image/webp';
  if (declared && declared !== 'application/octet-stream') return null;
  const extension = String(name || '').toLowerCase().split('.').pop() || '';
  if (extension === 'jpg' || extension === 'jpeg') return 'image/jpeg';
  if (extension === 'png') return 'image/png';
  if (extension === 'webp') return 'image/webp';
  return null;
}

export function keywordImageBytesMatch(kind: KeywordImageKind, bytes: Uint8Array): boolean {
  if (kind === 'image/png') {
    return (
      bytes.length >= 8 &&
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47
    );
  }
  if (kind === 'image/jpeg') {
    return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  return (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  );
}

export function keywordImageUploadError(input: {
  type: string;
  name?: string;
  size: number;
  bytes: Uint8Array;
}): { error: string; kind: KeywordImageKind | null } {
  const name = String(input.name || '');
  if (String(input.type || '').toLowerCase().startsWith('video/') || /\.(mp4|webm|mov|m4v)$/i.test(name)) {
    return { error: 'Keyword cards do not support video', kind: null };
  }
  if (!input.size || input.bytes.length === 0) {
    return { error: 'Image file is empty', kind: null };
  }
  if (input.size > MAX_KEYWORD_IMAGE_BYTES || input.bytes.length > MAX_KEYWORD_IMAGE_BYTES) {
    return { error: 'File must be under 4MB', kind: null };
  }
  const kind = normalizeKeywordImageType(input.type, name);
  if (!kind) return { error: 'Only JPG, PNG, or WebP allowed', kind: null };
  if (!keywordImageBytesMatch(kind, input.bytes)) {
    return { error: 'File content is not a JPG, PNG, or WebP image', kind: null };
  }
  return { error: '', kind };
}
