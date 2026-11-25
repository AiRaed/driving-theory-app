/**
 * Read-only published question order for Practice category placement.
 * Selects id, topic and sort position only. Does not update questions.
 */

import { createServiceClient } from '@/lib/admin/supabaseAdmin';
import type { PracticeQuestionOrder } from './practiceCategory';

export async function loadPublishedPracticeOrder(): Promise<PracticeQuestionOrder[] | null> {
  try {
    const admin = createServiceClient();
    const { data, error } = await admin
      .from('questions')
      .select('id, topic_id, sort_order')
      .eq('status', 'published')
      .order('topic_id', { ascending: true })
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true });
    if (error || !Array.isArray(data)) return null;
    return data.map((row) => ({
      id: String((row as { id?: string }).id || ''),
      topic: String((row as { topic_id?: string }).topic_id || ''),
      sort_order: (row as { sort_order?: number | null }).sort_order,
    }));
  } catch {
    return null;
  }
}
