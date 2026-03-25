import { createClient } from '@/lib/supabase/client';

type EventData = Record<string, unknown> | null | undefined;

/**
 * Client-side insert into user_events. Swallows all errors (no UI impact).
 */
export async function trackEvent(eventName: string, eventData?: EventData): Promise<void> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from('user_events').insert({
      event_name: eventName,
      event_data: eventData === undefined ? null : eventData,
      user_id: user?.id ?? null,
    });
    if (error) return;
  } catch {
    // silent
  }
}
