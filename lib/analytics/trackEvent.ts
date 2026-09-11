type EventData = Record<string, unknown> | null | undefined;

import { getClientRuntimePlatform } from '@/lib/analytics/platform';

/**
 * Fire-and-forget first-party analytics via /api/analytics/track.
 * Always attaches Capacitor runtime platform (ios|android|web).
 * Swallows all errors (no UI impact).
 */
export async function trackEvent(eventName: string, eventData?: EventData): Promise<void> {
  try {
    const base =
      eventData === undefined || eventData === null
        ? {}
        : { ...(eventData as Record<string, unknown>) };

    // Client-reported runtime platform; server never invents from userAgent.
    if (base.platform === undefined) {
      base.platform = getClientRuntimePlatform();
    }

    void fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: eventName,
        metadata: base,
      }),
      keepalive: true,
    }).catch(() => {
      // silent
    });
  } catch {
    // silent
  }
}
