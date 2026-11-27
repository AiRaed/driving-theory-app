import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use service role key to delete user (server-side only)
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      return NextResponse.json(
        { error: 'Service role key not configured' },
        { status: 500 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const adminClient = createAdminClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Practice progress follows the account. Cascade from auth.users is the
    // guarantee; these deletes cover the same rows if the user is removed next.
    const progressDelete = await adminClient
      .from('learner_question_progress')
      .delete()
      .eq('user_id', user.id);
    const historyDelete = await adminClient
      .from('learner_attempt_history')
      .delete()
      .eq('user_id', user.id);
    if (progressDelete.error) {
      console.error('Error deleting learning progress:', progressDelete.error);
    }
    if (historyDelete.error) {
      console.error('Error deleting attempt history:', historyDelete.error);
    }

    // Delete user using admin client
    const { error } = await adminClient.auth.admin.deleteUser(user.id);

    if (error) {
      console.error('Error deleting user:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to delete account' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

