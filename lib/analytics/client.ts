/**
 * Client analytics helpers — fire-and-forget, never block UI.
 */
import { trackEvent } from '@/lib/analytics/trackEvent';
import type { AnalyticsMode } from '@/lib/analytics/types';

export { trackEvent };

function postJson(url: string, body: unknown) {
  void fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {});
}

export function getOrCreateClientSessionId(key: string): string {
  if (typeof window === 'undefined') return key;
  try {
    const existing = sessionStorage.getItem(key);
    if (existing) return existing;
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(key, id);
    return id;
  } catch {
    return `${key}-${Date.now()}`;
  }
}

export function clearClientSessionId(key: string) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function trackAttempt(payload: {
  question_id: string;
  topic?: string | null;
  answer_selected?: string | null;
  correct_answer?: string | null;
  is_correct: boolean;
  mode: AnalyticsMode;
  language?: string | null;
  session_id: string;
}) {
  postJson('/api/analytics/attempt', payload);
}

export function trackSessionStart(payload: {
  mode: AnalyticsMode;
  language?: string | null;
  client_session_id: string;
}) {
  postJson('/api/analytics/session', { action: 'start', ...payload });
}

export function trackSessionComplete(payload: {
  mode: AnalyticsMode;
  client_session_id: string;
  questions_attempted?: number;
  correct_answers?: number;
  score?: number | null;
}) {
  postJson('/api/analytics/session', { action: 'complete', ...payload });
}

/** Map TranslationLang ('off'|'ar'|'ur'|'ro') to analytics language label. */
export function analyticsLanguage(lang: string | null | undefined): string {
  if (lang === 'ar') return 'ar';
  if (lang === 'ur') return 'ur';
  if (lang === 'ro') return 'ro';
  return 'en';
}
