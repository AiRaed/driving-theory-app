import assert from 'node:assert/strict';
import {
  FREE_QUESTION_LIMIT,
  decideAccess,
  failClosedAccessState,
  isPaidAccessLevel,
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

run('free + 0 used => access allowed', () => {
  const d = decideAccess(false, 0);
  assert.equal(d.canAccessContent, true);
  assert.equal(d.showPaywall, false);
  assert.equal(d.inFreeTrial, true);
});

run('free + 14 used => access allowed', () => {
  const d = decideAccess(false, 14);
  assert.equal(d.canAccessContent, true);
  assert.equal(d.showPaywall, false);
});

run('free + 15 used => locked', () => {
  const d = decideAccess(false, 15);
  assert.equal(d.canAccessContent, false);
  assert.equal(d.showPaywall, true);
});

run('free + >15 used => locked', () => {
  const d = decideAccess(false, 20);
  assert.equal(d.canAccessContent, false);
  assert.equal(d.showPaywall, true);
});

run('paid + any count => access allowed', () => {
  for (const used of [0, 14, 15, 100]) {
    const d = decideAccess(true, used);
    assert.equal(d.paid, true);
    assert.equal(d.canAccessContent, true);
    assert.equal(d.showPaywall, false);
  }
});

run('status fetch error => NOT paid / fail closed', () => {
  const closedFromUnknown = failClosedAccessState(0, false);
  assert.equal(closedFromUnknown.paid, false);
  assert.equal(closedFromUnknown.freeUsed, FREE_QUESTION_LIMIT);

  const closedFromPrior = failClosedAccessState(7, true);
  assert.equal(closedFromPrior.paid, false);
  assert.equal(closedFromPrior.freeUsed, 7);

  const closedFromExhausted = failClosedAccessState(18, true);
  assert.equal(closedFromExhausted.paid, false);
  assert.equal(closedFromExhausted.freeUsed, 18);
});

run('isPaidAccessLevel only true for paid', () => {
  assert.equal(isPaidAccessLevel('paid'), true);
  assert.equal(isPaidAccessLevel('free'), false);
  assert.equal(isPaidAccessLevel(undefined), false);
  assert.equal(isPaidAccessLevel(null), false);
});

console.log('All entitlement tests passed.');
