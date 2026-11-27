/**
 * A retry session is a snapshot of question ids. Later answers update progress,
 * but they must not add or remove ids, or Previous and Next lose their place.
 */
export function buildRetrySession(
  topicQuestionIds: readonly string[],
  incorrectIds: readonly string[]
): string[] {
  const incorrect = new Set(incorrectIds);
  return topicQuestionIds.filter((id) => incorrect.has(id));
}

export function tallyRetrySession(
  questionIds: readonly string[],
  outcomes: Readonly<Record<string, boolean>>
): { reviewed: number; corrected: number } {
  let corrected = 0;
  for (const id of questionIds) {
    if (outcomes[id] === true) corrected += 1;
  }
  return { reviewed: questionIds.length, corrected };
}
