import assert from 'node:assert/strict';
import {
  ACCOUNT_LOCAL_KEYS,
  ACCOUNT_SESSION_KEYS,
  accountScopedKey,
} from './clientAccountStorage';
import { isAccountDiagnosticsEnabled } from './diagnosticsEnabled';

function run(name: string, fn: () => void) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

run('accountScopedKey isolates Account A vs B', () => {
  const a = accountScopedKey('user-a', ACCOUNT_LOCAL_KEYS.practiceLastIndex);
  const b = accountScopedKey('user-b', ACCOUNT_LOCAL_KEYS.practiceLastIndex);
  assert.notEqual(a, b);
  assert.ok(a.includes('user-a'));
  assert.ok(b.includes('user-b'));
  assert.ok(!a.includes('user-b'));
});

run('mock session keys isolate Account A vs B', () => {
  const a = accountScopedKey('aaa', ACCOUNT_LOCAL_KEYS.mockSession);
  const b = accountScopedKey('bbb', ACCOUNT_LOCAL_KEYS.mockSession);
  assert.notEqual(a, b);
});

run('legacy unscoped keys are distinct from scoped keys', () => {
  const scoped = accountScopedKey('u1', ACCOUNT_LOCAL_KEYS.practiceLastIndex);
  assert.notEqual(scoped, ACCOUNT_LOCAL_KEYS.practiceLastIndex);
  assert.notEqual(scoped, ACCOUNT_LOCAL_KEYS.mockSession);
});

run('analytics session key constants exist', () => {
  assert.equal(ACCOUNT_SESSION_KEYS.practiceAnalytics, 'lt_practice_analytics_session');
  assert.equal(ACCOUNT_SESSION_KEYS.mockAnalytics, 'lt_mock_analytics_session');
});

run('diagnostics enabled outside production by default', () => {
  assert.equal(
    isAccountDiagnosticsEnabled({ NODE_ENV: 'development' }),
    true
  );
  assert.equal(
    isAccountDiagnosticsEnabled({ NODE_ENV: 'production' }),
    false
  );
  assert.equal(
    isAccountDiagnosticsEnabled({
      NODE_ENV: 'production',
      NEXT_PUBLIC_ENABLE_ACCOUNT_DIAGNOSTICS: 'true',
    }),
    true
  );
});

console.log('All account storage tests passed.');
