/**
 * Still images for Keyword Cards when the app is using the local store.
 * Files stay beside that store. This module does not call Supabase.
 */

import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { keywordCardsStorePath } from './localStore';

const CARD_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const FILE_NAME = /^[0-9]+\.(png|jpg|webp)$/;

export function keywordCardsMediaDir(): string {
  return path.join(path.dirname(keywordCardsStorePath()), 'images');
}

export function localKeywordImagePublicPath(cardId: string, fileName: string): string {
  return `/api/keyword-cards/media/local?card=${encodeURIComponent(cardId)}&file=${encodeURIComponent(fileName)}`;
}

export function saveLocalKeywordImage(
  cardId: string,
  bytes: Uint8Array,
  extension: string
): { fileName: string; image_url: string; image_storage_path: string } {
  if (!CARD_ID.test(cardId)) throw new Error('Keyword card not found');
  const fileName = `${Date.now()}.${extension}`;
  if (!FILE_NAME.test(fileName)) throw new Error('Only JPG, PNG, or WebP allowed');
  const directory = path.join(keywordCardsMediaDir(), cardId);
  mkdirSync(directory, { recursive: true });
  writeFileSync(path.join(directory, fileName), bytes);
  return {
    fileName,
    image_url: localKeywordImagePublicPath(cardId, fileName),
    image_storage_path: `local/${cardId}/${fileName}`,
  };
}

export function resolveLocalKeywordImage(
  cardId: string,
  fileName: string
): { absolutePath: string; contentType: string } | null {
  if (!CARD_ID.test(cardId) || !FILE_NAME.test(fileName)) return null;
  const root = path.resolve(keywordCardsMediaDir());
  const absolutePath = path.resolve(root, cardId, fileName);
  if (absolutePath !== path.join(root, cardId, fileName)) return null;
  if (!existsSync(absolutePath)) return null;
  const contentType = fileName.endsWith('.png')
    ? 'image/png'
    : fileName.endsWith('.webp')
      ? 'image/webp'
      : 'image/jpeg';
  return { absolutePath, contentType };
}

export function readLocalKeywordImage(cardId: string, fileName: string): {
  bytes: Buffer;
  contentType: string;
} | null {
  const resolved = resolveLocalKeywordImage(cardId, fileName);
  if (!resolved) return null;
  return { bytes: readFileSync(resolved.absolutePath), contentType: resolved.contentType };
}

export function removeLocalKeywordImage(storagePath: string | null | undefined): void {
  if (!storagePath || !storagePath.startsWith('local/')) return;
  const [, cardId, fileName] = storagePath.split('/');
  const resolved = resolveLocalKeywordImage(cardId || '', fileName || '');
  if (!resolved) return;
  try {
    unlinkSync(resolved.absolutePath);
  } catch {
    // The card row is the source of truth. A leftover file can be cleaned later.
  }
}
