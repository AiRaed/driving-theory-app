import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import type { ExplanationRecommendation } from './types';

const BUNDLED = path.join(process.cwd(), 'data', 'explanation-recommendations.json');

let cache: ExplanationRecommendation[] | null = null;

/** Committed classifier output (758 IDs). Not the gitignored local store. */
export function loadBundledRecommendations(): ExplanationRecommendation[] {
  if (cache) return cache;
  if (!existsSync(BUNDLED)) return [];
  const raw = JSON.parse(readFileSync(BUNDLED, 'utf8'));
  const rows = Array.isArray(raw?.recommendations) ? raw.recommendations : raw;
  cache = (rows as ExplanationRecommendation[]).map((r) => ({
    ...r,
    dvsa_approved: false,
  }));
  return cache;
}

export function countBy<T extends object>(rows: T[], key: keyof T) {
  const out: Record<string, number> = {};
  for (const row of rows) {
    const k = String(row[key] || '');
    out[k] = (out[k] || 0) + 1;
  }
  return out;
}
