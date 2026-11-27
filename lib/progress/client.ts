import type { ProgressSummary } from './types';

export interface ProgressResponse {
  summary: ProgressSummary;
  saveError?: string;
}

async function readJson(response: Response): Promise<ProgressResponse | null> {
  return response.json().catch(() => null);
}

export async function fetchLearnerProgress(): Promise<
  { ok: true; summary: ProgressSummary } | { ok: false }
> {
  try {
    const response = await fetch('/api/progress', { method: 'GET', cache: 'no-store' });
    const body = await readJson(response);
    if (!response.ok || !body?.summary) return { ok: false };
    return { ok: true, summary: body.summary };
  } catch {
    return { ok: false };
  }
}

export async function submitLearnerAnswer(
  questionId: string,
  selectedAnswer: number,
  clientAttemptId: string
): Promise<{ ok: true; summary: ProgressSummary } | { ok: false }> {
  const payload = JSON.stringify({
    question_id: questionId,
    selected_answer: selectedAnswer,
    client_attempt_id: clientAttemptId,
  });

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch('/api/progress/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
      });
      const body = await readJson(response);
      if (response.ok && body?.summary) return { ok: true, summary: body.summary };
      if (response.status < 500) return { ok: false };
    } catch {
      if (attempt === 1) return { ok: false };
    }
  }
  return { ok: false };
}
