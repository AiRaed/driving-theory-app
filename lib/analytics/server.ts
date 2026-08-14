import { createServiceClient } from '@/lib/admin/supabaseAdmin';
import type {
  AnalyticsEventName,
  AnalyticsMetadata,
  AttemptPayload,
  SessionCompletePayload,
  SessionStartPayload,
  UserLearningStatsRow,
} from '@/lib/analytics/types';

function admin() {
  return createServiceClient();
}

function logAnalyticsError(scope: string, error: unknown) {
  console.error(`[analytics:${scope}]`, error);
}

/** Ensure a stats row exists; sync free_questions_used from profiles. */
export async function ensureStats(userId: string): Promise<UserLearningStatsRow | null> {
  const sb = admin();

  const { data: existing, error: readErr } = await sb
    .from('user_learning_stats')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (readErr) {
    logAnalyticsError('ensureStats.read', readErr);
    throw readErr;
  }

  const { data: profile } = await sb
    .from('profiles')
    .select('free_questions_used, access_level')
    .eq('id', userId)
    .maybeSingle();

  const freeUsed = profile?.free_questions_used ?? 0;
  const hasPurchased = profile?.access_level === 'paid';

  if (existing) {
    const patch: Record<string, unknown> = {};
    if (typeof freeUsed === 'number' && freeUsed !== existing.free_questions_used) {
      patch.free_questions_used = freeUsed;
      if (freeUsed >= 15) patch.free_limit_reached = true;
    }
    if (hasPurchased && !existing.has_purchased) {
      patch.has_purchased = true;
    }
    if (Object.keys(patch).length > 0) {
      const { data: updated, error: updErr } = await sb
        .from('user_learning_stats')
        .update(patch)
        .eq('user_id', userId)
        .select('*')
        .single();
      if (updErr) {
        logAnalyticsError('ensureStats.sync', updErr);
        return existing as UserLearningStatsRow;
      }
      return updated as UserLearningStatsRow;
    }
    return existing as UserLearningStatsRow;
  }

  const { data: inserted, error: insErr } = await sb
    .from('user_learning_stats')
    .insert({
      user_id: userId,
      free_questions_used: freeUsed,
      free_limit_reached: freeUsed >= 15,
      has_purchased: hasPurchased,
    })
    .select('*')
    .single();

  if (insErr) {
    // Race: another request created the row
    const { data: raced } = await sb
      .from('user_learning_stats')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (raced) return raced as UserLearningStatsRow;
    logAnalyticsError('ensureStats.insert', insErr);
    throw insErr;
  }

  return inserted as UserLearningStatsRow;
}

export async function touchActivity(userId: string): Promise<void> {
  try {
    const stats = await ensureStats(userId);
    if (!stats) return;
    const sb = admin();
    const now = new Date().toISOString();
    const patch: Record<string, unknown> = { last_activity_at: now };
    if (!stats.first_activity_at) {
      patch.first_activity_at = now;
    }
    const { error } = await sb.from('user_learning_stats').update(patch).eq('user_id', userId);
    if (error) logAnalyticsError('touchActivity', error);
  } catch (e) {
    logAnalyticsError('touchActivity', e);
  }
}

export async function recordProductEvent(
  userId: string | null,
  eventName: AnalyticsEventName | string,
  metadata?: AnalyticsMetadata
): Promise<void> {
  try {
    const sb = admin();
    const { error } = await sb.from('product_events').insert({
      user_id: userId,
      event_name: eventName,
      metadata: metadata ?? {},
    });
    if (error) logAnalyticsError('recordProductEvent', error);
  } catch (e) {
    logAnalyticsError('recordProductEvent', e);
  }
}

async function incrementStats(
  userId: string,
  deltas: Partial<Record<keyof UserLearningStatsRow, number | boolean | string | null>>
): Promise<void> {
  const sb = admin();
  const stats = await ensureStats(userId);
  if (!stats) return;

  const statsRec = stats as unknown as Record<string, unknown>;
  const patch: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(deltas)) {
    if (typeof value === 'number' && typeof statsRec[key] === 'number') {
      // Clamp counters at 0 when applying negative deltas (e.g. mock answer change)
      patch[key] = Math.max(0, (statsRec[key] as number) + value);
    } else if (value !== undefined) {
      patch[key] = value;
    }
  }

  const now = new Date().toISOString();
  patch.last_activity_at = now;
  if (!stats.first_activity_at) patch.first_activity_at = now;

  const { error } = await sb.from('user_learning_stats').update(patch).eq('user_id', userId);
  if (error) {
    logAnalyticsError('incrementStats', error);
    throw error;
  }
}

export async function recordQuestionAttempt(payload: AttemptPayload): Promise<void> {
  const {
    userId,
    questionId,
    topic,
    answerSelected,
    correctAnswer,
    isCorrect,
    mode,
    language,
    sessionId,
  } = payload;

  if (!userId || !questionId || !sessionId) {
    throw new Error('Missing required attempt fields');
  }

  const sb = admin();
  await ensureStats(userId);

  const { data: existing, error: findErr } = await sb
    .from('question_attempts')
    .select('*')
    .eq('user_id', userId)
    .eq('question_id', questionId)
    .eq('session_id', sessionId)
    .maybeSingle();

  if (findErr) {
    logAnalyticsError('recordQuestionAttempt.find', findErr);
    throw findErr;
  }

  if (!existing) {
    // First ever attempt for this question_id by this user? (check before insert)
    const { count: priorCount, error: countErr } = await sb
      .from('question_attempts')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('question_id', questionId);

    if (countErr) logAnalyticsError('recordQuestionAttempt.uniqueCount', countErr);
    const isFirstForQuestion = (priorCount ?? 0) === 0;

    const { error: insErr } = await sb.from('question_attempts').insert({
      user_id: userId,
      question_id: questionId,
      topic: topic ?? null,
      answer_selected: answerSelected ?? null,
      correct_answer: correctAnswer ?? null,
      is_correct: isCorrect,
      mode,
      language: language ?? null,
      session_id: sessionId,
    });

    if (insErr) {
      logAnalyticsError('recordQuestionAttempt.insert', insErr);
      throw insErr;
    }

    await incrementStats(userId, {
      questions_attempted: 1,
      unique_questions_attempted: isFirstForQuestion ? 1 : 0,
      correct_answers: isCorrect ? 1 : 0,
      incorrect_answers: isCorrect ? 0 : 1,
      ...(language ? { last_language_used: language } : {}),
    });
  } else {
    // Update existing attempt (e.g. mock answer change) — adjust correct/incorrect deltas
    const wasCorrect = !!existing.is_correct;
    const nowCorrect = !!isCorrect;

    const { error: updErr } = await sb
      .from('question_attempts')
      .update({
        topic: topic ?? existing.topic,
        answer_selected: answerSelected ?? existing.answer_selected,
        correct_answer: correctAnswer ?? existing.correct_answer,
        is_correct: isCorrect,
        language: language ?? existing.language,
      })
      .eq('id', existing.id);

    if (updErr) {
      logAnalyticsError('recordQuestionAttempt.update', updErr);
      throw updErr;
    }

    if (wasCorrect !== nowCorrect) {
      await incrementStats(userId, {
        correct_answers: nowCorrect ? 1 : -1,
        incorrect_answers: nowCorrect ? -1 : 1,
        ...(language ? { last_language_used: language } : {}),
      });
    } else {
      await touchActivity(userId);
      if (language) {
        const { error } = await sb
          .from('user_learning_stats')
          .update({ last_language_used: language })
          .eq('user_id', userId);
        if (error) logAnalyticsError('recordQuestionAttempt.lang', error);
      }
    }
  }

  // Sync free usage from profile
  try {
    await ensureStats(userId);
  } catch (e) {
    logAnalyticsError('recordQuestionAttempt.syncFree', e);
  }

  await recordProductEvent(userId, 'question_answered', {
    question_id: questionId,
    topic: topic ?? null,
    is_correct: isCorrect,
    mode,
    language: language ?? null,
    session_id: sessionId,
  });
}

export async function startLearningSession(payload: SessionStartPayload): Promise<void> {
  const { userId, mode, language, clientSessionId } = payload;
  if (!userId || !mode) throw new Error('Missing required session start fields');

  const sb = admin();
  await ensureStats(userId);

  let existing: { id: string; is_completed: boolean } | null = null;

  if (clientSessionId) {
    const { data, error } = await sb
      .from('learning_sessions')
      .select('id, is_completed')
      .eq('user_id', userId)
      .eq('client_session_id', clientSessionId)
      .maybeSingle();
    if (error) {
      logAnalyticsError('startLearningSession.find', error);
      throw error;
    }
    existing = data;
  }

  if (existing) {
    // Idempotent: do not re-increment counters or re-fire start events
    await touchActivity(userId);
    return;
  }

  const { error: insErr } = await sb.from('learning_sessions').insert({
    user_id: userId,
    mode,
    language: language ?? null,
    client_session_id: clientSessionId ?? null,
  });

  if (insErr) {
    // Unique race on client_session_id — treat as already started
    const code = (insErr as { code?: string }).code;
    if (clientSessionId && (code === '23505' || /duplicate|unique/i.test(String(insErr.message || '')))) {
      await touchActivity(userId);
      return;
    }
    logAnalyticsError('startLearningSession.insert', insErr);
    throw insErr;
  }

  if (mode === 'practice') {
    await incrementStats(userId, {
      practice_sessions: 1,
      ...(language ? { last_language_used: language } : {}),
    });
    await recordProductEvent(userId, 'practice_started', {
      client_session_id: clientSessionId ?? null,
      language: language ?? null,
    });
  } else {
    await incrementStats(userId, {
      mock_tests_started: 1,
      ...(language ? { last_language_used: language } : {}),
    });
    await recordProductEvent(userId, 'mock_test_started', {
      client_session_id: clientSessionId ?? null,
      language: language ?? null,
    });
  }
}

export async function completeLearningSession(payload: SessionCompletePayload): Promise<void> {
  const { userId, clientSessionId, questionsAttempted, correctAnswers, score } = payload;
  if (!userId || !clientSessionId) throw new Error('Missing required session complete fields');

  const sb = admin();
  await ensureStats(userId);

  const { data: session, error: findErr } = await sb
    .from('learning_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('client_session_id', clientSessionId)
    .maybeSingle();

  if (findErr) {
    logAnalyticsError('completeLearningSession.find', findErr);
    throw findErr;
  }

  if (!session) {
    throw new Error('Learning session not found');
  }

  const alreadyCompleted = !!session.is_completed;
  const now = new Date().toISOString();

  const { error: updErr } = await sb
    .from('learning_sessions')
    .update({
      is_completed: true,
      completed_at: session.completed_at ?? now,
      questions_attempted: questionsAttempted ?? session.questions_attempted,
      correct_answers: correctAnswers ?? session.correct_answers,
      score: score ?? session.score,
    })
    .eq('id', session.id);

  if (updErr) {
    logAnalyticsError('completeLearningSession.update', updErr);
    throw updErr;
  }

  if (alreadyCompleted) {
    await touchActivity(userId);
    return;
  }

  if (session.mode === 'mock') {
    const stats = await ensureStats(userId);
    const scoreVal = typeof score === 'number' ? score : null;
    const best =
      scoreVal == null
        ? stats?.best_mock_score ?? null
        : Math.max(stats?.best_mock_score ?? 0, scoreVal);

    await incrementStats(userId, {
      mock_tests_completed: 1,
    });

    const patch: Record<string, unknown> = {};
    if (scoreVal != null) {
      patch.latest_mock_score = scoreVal;
      patch.best_mock_score = best;
    }
    if (Object.keys(patch).length > 0) {
      const { error } = await sb.from('user_learning_stats').update(patch).eq('user_id', userId);
      if (error) logAnalyticsError('completeLearningSession.scores', error);
    }

    await recordProductEvent(userId, 'mock_test_completed', {
      client_session_id: clientSessionId,
      questions_attempted: questionsAttempted ?? session.questions_attempted,
      correct_answers: correctAnswers ?? session.correct_answers,
      score: scoreVal,
    });
  } else {
    await touchActivity(userId);
  }
}

export async function applyProductEventSideEffects(
  userId: string,
  eventName: string,
  metadata?: AnalyticsMetadata
): Promise<void> {
  try {
    await ensureStats(userId);
    const sb = admin();

    switch (eventName) {
      case 'free_limit_reached': {
        const { error } = await sb
          .from('user_learning_stats')
          .update({ free_limit_reached: true })
          .eq('user_id', userId);
        if (error) logAnalyticsError('sideEffects.free_limit', error);
        await touchActivity(userId);
        break;
      }
      case 'paywall_viewed': {
        await incrementStats(userId, { paywall_seen_count: 1 });
        break;
      }
      case 'checkout_clicked': {
        await incrementStats(userId, { checkout_clicked_count: 1 });
        break;
      }
      case 'language_changed': {
        const lang =
          (typeof metadata?.language === 'string' && metadata.language) ||
          (typeof metadata?.lang === 'string' && metadata.lang) ||
          null;
        if (lang) {
          const { error } = await sb
            .from('user_learning_stats')
            .update({
              last_language_used: lang,
              preferred_language: lang,
            })
            .eq('user_id', userId);
          if (error) logAnalyticsError('sideEffects.language', error);
        }
        await touchActivity(userId);
        break;
      }
      case 'login':
      case 'signup_completed': {
        await touchActivity(userId);
        break;
      }
      case 'payment_success': {
        // Intentionally do NOT set has_purchased here (client-callable track route).
        await touchActivity(userId);
        break;
      }
      default:
        await touchActivity(userId);
        break;
    }
  } catch (e) {
    logAnalyticsError('applyProductEventSideEffects', e);
  }
}

/** Server-only: mark purchase after verified payment. Safe to call multiple times. */
export async function markPaymentSuccess(userId: string): Promise<void> {
  try {
    await ensureStats(userId);
    const sb = admin();
    const { error } = await sb
      .from('user_learning_stats')
      .update({ has_purchased: true })
      .eq('user_id', userId);
    if (error) logAnalyticsError('markPaymentSuccess.update', error);

    await recordProductEvent(userId, 'payment_success', { verified: true });
    await touchActivity(userId);
  } catch (e) {
    logAnalyticsError('markPaymentSuccess', e);
    throw e;
  }
}
