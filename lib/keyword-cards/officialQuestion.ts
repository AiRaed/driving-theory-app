import { createServiceClient } from '@/lib/admin/supabaseAdmin';

/** Reads questions.id only. Does not select or write official wording. */
export async function officialQuestionExists(questionId: string): Promise<boolean> {
  const admin = createServiceClient();
  const { data, error } = await admin
    .from('questions')
    .select('id')
    .eq('id', questionId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return Boolean(data?.id);
}
