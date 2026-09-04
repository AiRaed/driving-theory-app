import assert from 'node:assert/strict';
import {
  FREE_QUESTION_LIMIT,
  decidePracticeAccess,
  decidePracticePageGate,
  decideMockAccess,
  failClosedAccessState,
  isPaidAccessLevel,
  clientStateAfterLogout,
  clientStateFromServer,
  decideAccountSwitchEntitlement,
  sameAccountFreeUsageAcrossDevices,
} from './entitlement';

function run(name: string, fn: () => void) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

// Practice page gate (A–E)
run('A. unconfirmed => retry, not paywall, not practice', () => {
  const gate = decidePracticePageGate({
    loading: false,
    paid: false,
    freeQuestionsUsed: 0,
    statusConfirmed: false,
  });
  assert.equal(gate, 'retry');
  const access = decidePracticeAccess({
    paid: false,
    freeQuestionsUsed: 0,
    statusConfirmed: false,
  });
  assert.equal(access.allow, false);
  assert.equal(access.showPaywall, false);
});

run('B. confirmed free used=0 => practice', () => {
  assert.equal(
    decidePracticePageGate({
      loading: false,
      paid: false,
      freeQuestionsUsed: 0,
      statusConfirmed: true,
    }),
    'practice'
  );
});

run('C. confirmed free used=14 => practice', () => {
  assert.equal(
    decidePracticePageGate({
      loading: false,
      paid: false,
      freeQuestionsUsed: 14,
      statusConfirmed: true,
    }),
    'practice'
  );
});

run('D. confirmed free used=15 => paywall', () => {
  assert.equal(
    decidePracticePageGate({
      loading: false,
      paid: false,
      freeQuestionsUsed: 15,
      statusConfirmed: true,
    }),
    'paywall'
  );
});

run('E. confirmed paid => practice', () => {
  assert.equal(
    decidePracticePageGate({
      loading: false,
      paid: true,
      freeQuestionsUsed: 999,
      statusConfirmed: true,
    }),
    'practice'
  );
});

run('loading => loading gate', () => {
  assert.equal(
    decidePracticePageGate({
      loading: true,
      paid: false,
      freeQuestionsUsed: 0,
      statusConfirmed: false,
    }),
    'loading'
  );
});

// PRACTICE access contract
run('1. free used=0 => Practice allowed', () => {
  const d = decidePracticeAccess({
    paid: false,
    freeQuestionsUsed: 0,
    statusConfirmed: true,
  });
  assert.equal(d.allow, true);
  assert.equal(d.showPaywall, false);
});

run('2. free used=14 => Practice allowed', () => {
  const d = decidePracticeAccess({
    paid: false,
    freeQuestionsUsed: 14,
    statusConfirmed: true,
  });
  assert.equal(d.allow, true);
  assert.equal(d.showPaywall, false);
});

run('3. free used=15 => Practice locked', () => {
  const d = decidePracticeAccess({
    paid: false,
    freeQuestionsUsed: 15,
    statusConfirmed: true,
  });
  assert.equal(d.allow, false);
  assert.equal(d.showPaywall, true);
});

run('4. free used=16 => Practice locked', () => {
  const d = decidePracticeAccess({
    paid: false,
    freeQuestionsUsed: 16,
    statusConfirmed: true,
  });
  assert.equal(d.allow, false);
  assert.equal(d.showPaywall, true);
});

run('5. paid used=999 => Practice allowed', () => {
  const d = decidePracticeAccess({
    paid: true,
    freeQuestionsUsed: 999,
    statusConfirmed: true,
  });
  assert.equal(d.allow, true);
  assert.equal(d.showPaywall, false);
});

// MOCK TEST — paid only; free counter never unlocks Mock
run('6. free used=0 => Mock locked', () => {
  const d = decideMockAccess({ paid: false, statusConfirmed: true });
  assert.equal(d.allow, false);
  assert.equal(d.showPaywall, true);
});

run('7. free used=14 => Mock locked (counter ignored)', () => {
  const d = decideMockAccess({ paid: false, statusConfirmed: true });
  assert.equal(d.allow, false);
  assert.equal(d.showPaywall, true);
});

run('8. free used=15 => Mock locked', () => {
  const d = decideMockAccess({ paid: false, statusConfirmed: true });
  assert.equal(d.allow, false);
  assert.equal(d.showPaywall, true);
});

run('9. paid => Mock allowed', () => {
  const d = decideMockAccess({ paid: true, statusConfirmed: true });
  assert.equal(d.allow, true);
  assert.equal(d.showPaywall, false);
});

// SECURITY / STATE
run('10. unknown entitlement => Practice+Mock not granted', () => {
  const practice = decidePracticeAccess({
    paid: false,
    freeQuestionsUsed: 0,
    statusConfirmed: false,
  });
  const mock = decideMockAccess({ paid: false, statusConfirmed: false });
  assert.equal(practice.allow, false);
  assert.equal(practice.showPaywall, false);
  assert.equal(mock.allow, false);
  assert.equal(mock.showPaywall, false);

  const practiceStale = decidePracticeAccess({
    paid: true,
    freeQuestionsUsed: 0,
    statusConfirmed: false,
  });
  const mockStale = decideMockAccess({ paid: true, statusConfirmed: false });
  assert.equal(practiceStale.allow, false);
  assert.equal(mockStale.allow, false);
});

run('11. Account A paid logout -> Account B free', () => {
  const afterLogout = clientStateAfterLogout();
  assert.equal(afterLogout.paid, false);
  assert.equal(afterLogout.freeQuestionsUsed, 0);
  assert.equal(afterLogout.statusConfirmed, false);

  const accountB = clientStateFromServer({ paid: false, freeQuestionsUsed: 3 });
  const practiceB = decidePracticeAccess({
    paid: accountB.paid,
    freeQuestionsUsed: accountB.freeQuestionsUsed,
    statusConfirmed: accountB.statusConfirmed,
  });
  const mockB = decideMockAccess({
    paid: accountB.paid,
    statusConfirmed: accountB.statusConfirmed,
  });
  assert.equal(practiceB.allow, true);
  assert.equal(mockB.allow, false);
  assert.equal(mockB.showPaywall, true);
});

run('12. Same paid account on any platform => Full Access', () => {
  const accountA = clientStateFromServer({ paid: true, freeQuestionsUsed: 0 });
  const practice = decidePracticeAccess({
    paid: accountA.paid,
    freeQuestionsUsed: accountA.freeQuestionsUsed,
    statusConfirmed: true,
  });
  const mock = decideMockAccess({ paid: accountA.paid, statusConfirmed: true });
  assert.equal(practice.allow, true);
  assert.equal(mock.allow, true);
});

run('13. Different free account on same device => stays free', () => {
  const accountB = clientStateFromServer({ paid: false, freeQuestionsUsed: 0 });
  const practice = decidePracticeAccess({
    paid: accountB.paid,
    freeQuestionsUsed: accountB.freeQuestionsUsed,
    statusConfirmed: true,
  });
  const mock = decideMockAccess({
    paid: accountB.paid,
    statusConfirmed: true,
  });
  assert.equal(practice.allow, true);
  assert.equal(practice.inFreeTrial, true);
  assert.equal(mock.allow, false);
});

run('fail-closed never resets freeUsed to 0 / never paid', () => {
  const closedUnknown = failClosedAccessState(0, false);
  assert.equal(closedUnknown.paid, false);

  const closedPrior = failClosedAccessState(7, true);
  assert.equal(closedPrior.paid, false);
  assert.equal(closedPrior.freeUsed, 7);
  assert.notEqual(closedPrior.freeUsed, 0);
});

run('isPaidAccessLevel only true for paid', () => {
  assert.equal(isPaidAccessLevel('paid'), true);
  assert.equal(isPaidAccessLevel('free'), false);
  assert.equal(isPaidAccessLevel(undefined), false);
  assert.equal(FREE_QUESTION_LIMIT, 15);
});

// Account-centric isolation / cross-device
run('14. New account: free, used=0', () => {
  const s = clientStateFromServer({ paid: false, freeQuestionsUsed: 0 });
  assert.equal(s.paid, false);
  assert.equal(s.freeQuestionsUsed, 0);
  assert.equal(
    decidePracticeAccess({ ...s, statusConfirmed: true }).allow,
    true
  );
});

run('15. Cross-device same account shares free usage count', () => {
  const r = sameAccountFreeUsageAcrossDevices(10, 10, 10);
  assert.equal(r.consistent, true);
  assert.equal(r.used, 10);
  assert.equal(
    decidePracticeAccess({
      paid: false,
      freeQuestionsUsed: r.used,
      statusConfirmed: true,
    }).allow,
    true
  );
});

run('16. Cached paid from A cannot grant B after switch', () => {
  const switched = decideAccountSwitchEntitlement({
    priorCachedPaid: true,
    priorCachedFreeUsed: 0,
    nextServerPaid: false,
    nextServerFreeUsed: 2,
  });
  assert.equal(switched.paid, false);
  assert.equal(switched.freeQuestionsUsed, 2);
  assert.equal(switched.practiceAllow, true);
  assert.equal(switched.mockAllow, false);
});

run('17. API failure fail-closed does not invent fresh free allowance', () => {
  const closed = failClosedAccessState(10, true);
  assert.equal(closed.paid, false);
  assert.equal(closed.freeUsed, 10);
  const practice = decidePracticeAccess({
    paid: closed.paid,
    freeQuestionsUsed: closed.freeUsed,
    statusConfirmed: false,
  });
  assert.equal(practice.allow, false);
  assert.equal(practice.showPaywall, false);
});

run('18. Account A used=10 on another platform still used=10', () => {
  const web = clientStateFromServer({ paid: false, freeQuestionsUsed: 10 });
  const android = clientStateFromServer({
    paid: false,
    freeQuestionsUsed: web.freeQuestionsUsed,
  });
  assert.equal(android.freeQuestionsUsed, 10);
  assert.equal(
    decidePracticeAccess({
      paid: false,
      freeQuestionsUsed: android.freeQuestionsUsed,
      statusConfirmed: true,
    }).inFreeTrial,
    true
  );
});

run('19. Same-device A paid then B free remain isolated', () => {
  const a = decideAccountSwitchEntitlement({
    priorCachedPaid: false,
    priorCachedFreeUsed: 0,
    nextServerPaid: true,
    nextServerFreeUsed: 0,
  });
  assert.equal(a.paid, true);
  assert.equal(a.mockAllow, true);

  const b = decideAccountSwitchEntitlement({
    priorCachedPaid: a.paid,
    priorCachedFreeUsed: a.freeQuestionsUsed,
    nextServerPaid: false,
    nextServerFreeUsed: 2,
  });
  assert.equal(b.paid, false);
  assert.equal(b.freeQuestionsUsed, 2);
  assert.equal(b.mockAllow, false);
});

console.log('All entitlement tests passed.');
