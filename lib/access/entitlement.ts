/**
 * Shared LingoTheory entitlement contract (Web + Android + iOS).
 *
 * Source of truth: Supabase profiles.access_level + profiles.free_questions_used
 * belonging to the authenticated LingoTheory USER ACCOUNT — never the device,
 * Apple ID, Google Play account, or local storage.
 */

export const FREE_QUESTION_LIMIT = 15;

export type PracticeAccessDecision = {
  paid: boolean;
  freeQuestionsUsed: number;
  statusConfirmed: boolean;
  /** Practice content may be used */
  allow: boolean;
  /** Show Full Access paywall over Practice */
  showPaywall: boolean;
  inFreeTrial: boolean;
};

export type MockAccessDecision = {
  paid: boolean;
  statusConfirmed: boolean;
  /** Mock Test may be started / used */
  allow: boolean;
  /** Show Full Access paywall over Mock Test */
  showPaywall: boolean;
};

function normalizeUsed(freeQuestionsUsed: number): number {
  return Number.isFinite(freeQuestionsUsed)
    ? Math.max(0, Math.floor(freeQuestionsUsed))
    : 0;
}

/**
 * Practice access.
 *
 * paid=true → allow
 * paid=false + confirmed + used < 15 → allow (free trial)
 * paid=false + confirmed + used >= 15 → paywall
 * status unconfirmed → do NOT grant Practice
 */
export function decidePracticeAccess(input: {
  paid: boolean;
  freeQuestionsUsed: number;
  statusConfirmed: boolean;
}): PracticeAccessDecision {
  const paid = input.paid === true;
  const statusConfirmed = input.statusConfirmed === true;
  const freeQuestionsUsed = normalizeUsed(input.freeQuestionsUsed);

  if (!statusConfirmed) {
    return {
      paid: false,
      freeQuestionsUsed,
      statusConfirmed: false,
      allow: false,
      showPaywall: false,
      inFreeTrial: false,
    };
  }

  if (paid) {
    return {
      paid: true,
      freeQuestionsUsed,
      statusConfirmed: true,
      allow: true,
      showPaywall: false,
      inFreeTrial: false,
    };
  }

  const inFreeTrial = freeQuestionsUsed < FREE_QUESTION_LIMIT;
  return {
    paid: false,
    freeQuestionsUsed,
    statusConfirmed: true,
    allow: inFreeTrial,
    showPaywall: !inFreeTrial,
    inFreeTrial,
  };
}

/**
 * Mock Test is PAID ONLY. free_questions_used never grants Mock access.
 *
 * paid=true + confirmed → allow
 * otherwise → locked (paywall when confirmed unpaid; blocked while unconfirmed)
 */
export function decideMockAccess(input: {
  paid: boolean;
  statusConfirmed: boolean;
}): MockAccessDecision {
  const paid = input.paid === true;
  const statusConfirmed = input.statusConfirmed === true;

  if (!statusConfirmed) {
    return {
      paid: false,
      statusConfirmed: false,
      allow: false,
      showPaywall: false,
    };
  }

  if (paid) {
    return {
      paid: true,
      statusConfirmed: true,
      allow: true,
      showPaywall: false,
    };
  }

  return {
    paid: false,
    statusConfirmed: true,
    allow: false,
    showPaywall: true,
  };
}

/**
 * Practice page UI gate — unconfirmed status is NOT a paywall.
 *
 * loading        → spinner
 * unconfirmed    → neutral retry (no PaywallOverlay, no Practice)
 * confirmed paid / free trial → Practice
 * confirmed free exhausted    → PaywallOverlay
 */
export type PracticePageGate = 'loading' | 'retry' | 'practice' | 'paywall';

export function decidePracticePageGate(input: {
  loading: boolean;
  paid: boolean;
  freeQuestionsUsed: number;
  statusConfirmed: boolean;
}): PracticePageGate {
  if (input.loading) {
    return 'loading';
  }

  if (!input.statusConfirmed) {
    return 'retry';
  }

  const access = decidePracticeAccess({
    paid: input.paid,
    freeQuestionsUsed: input.freeQuestionsUsed,
    statusConfirmed: true,
  });

  if (access.showPaywall) {
    return 'paywall';
  }

  return 'practice';
}

/**
 * @deprecated Use decidePracticeAccess. Kept for transitional call sites.
 */
export function decideAccess(
  paid: boolean,
  freeQuestionsUsed: number,
  statusConfirmed: boolean = true
): PracticeAccessDecision {
  return decidePracticeAccess({ paid, freeQuestionsUsed, statusConfirmed });
}

/**
 * Fail-closed client values when /api/access/status cannot be confirmed.
 * Never assumes paid. Never resets free usage to 0.
 */
export function failClosedAccessState(
  previousFreeUsed: number,
  hadConfirmedStatus: boolean = false
): {
  paid: false;
  freeUsed: number;
} {
  const used = normalizeUsed(previousFreeUsed);
  return {
    paid: false,
    freeUsed: hadConfirmedStatus ? used : used,
  };
}

export function isPaidAccessLevel(
  accessLevel: string | null | undefined
): boolean {
  return accessLevel === 'paid';
}

/**
 * Pure helpers for account-switch regression tests (no I/O).
 */
export function clientStateAfterLogout(): {
  paid: false;
  freeQuestionsUsed: 0;
  statusConfirmed: false;
} {
  return { paid: false, freeQuestionsUsed: 0, statusConfirmed: false };
}

export function clientStateFromServer(input: {
  paid: boolean;
  freeQuestionsUsed: number;
}): {
  paid: boolean;
  freeQuestionsUsed: number;
  statusConfirmed: true;
} {
  return {
    paid: input.paid === true,
    freeQuestionsUsed: normalizeUsed(input.freeQuestionsUsed),
    statusConfirmed: true,
  };
}
