type EventData = Record<string, unknown> | null | undefined;

/**
 * Fire-and-forget first-party analytics via /api/analytics/track.
 * Swallows all errors (no UI impact).
 */
export async function trackEvent(eventName: string, eventData?: EventData): Promise<void> {
  try {
    const metadata =
      eventData === undefined || eventData === null
        ? undefined
        : (eventData as Record<string, unknown>);

    void fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: eventName,
        ...(metadata !== undefined ? { metadata } : {}),
      }),
      keepalive: true,
    }).catch(() => {
      // silent
    });
  } catch {
    // silent
  }
}
