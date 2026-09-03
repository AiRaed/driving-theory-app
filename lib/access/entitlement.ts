/**
 * Shared entitlement contract for Web + Android + iOS.
 * Server profiles.* remains authoritative; this module only interprets confirmed values.
 */

export const FREE_QUESTION_LIMIT = 15;

export type AccessDecision = {
  /** True only when profiles.access_level === 'paid' was confirmed */
  paid: boolean;
  /** From profiles.free_questions_used (confirmed) */
  freeQuestionsUsed: number;
  /** Practice / full content allowed */
  canAccessContent: boolean;
  /** Show Full Access paywall for free users at/over limit */
  showPaywall: boolean;
  /** Free trial still available */
  inFreeTrial: boolean;
};

/**
 * Interpret confirmed server entitlement values.
 * Never call this with guessed/default values from a failed fetch.
 */
export function decideAccess(
  paid: boolean,
  freeQuestionsUsed: number
): AccessDecision {
  const used = Number.isFinite(freeQuestionsUsed)
    ? Math.max(0, Math.floor(freeQuestionsUsed))
    : 0;
  const isPaid = paid === true;

  if (isPaid) {
    return {
      paid: true,
      freeQuestionsUsed: used,
      canAccessContent: true,
      showPaywall: false,
      inFreeTrial: false,
    };
  }

  const inFreeTrial = used < FREE_QUESTION_LIMIT;
  return {
    paid: false,
    freeQuestionsUsed: used,
    canAccessContent: inFreeTrial,
    showPaywall: !inFreeTrial,
    inFreeTrial,
  };
}

/**
 * Fail-closed client state when access status cannot be confirmed.
 * Never assumes paid. Never resets free usage to 0 (that would unlock practice).
 * If status was never confirmed, lock the free trial.
 * If status was previously confirmed, preserve the last known freeUsed.
 */
export function failClosedAccessState(
  previousFreeUsed: number,
  hadConfirmedStatus: boolean = false
): {
  paid: false;
  freeUsed: number;
} {
  const used = Number.isFinite(previousFreeUsed)
    ? Math.max(0, Math.floor(previousFreeUsed))
    : 0;

  if (hadConfirmedStatus) {
    return {
      paid: false,
      freeUsed: used,
    };
  }

  return {
    paid: false,
    freeUsed: FREE_QUESTION_LIMIT,
  };
}

export function isPaidAccessLevel(
  accessLevel: string | null | undefined
): boolean {
  return accessLevel === 'paid';
}
