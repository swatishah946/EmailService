import assert from 'assert';
import { CircuitBreaker } from '../src/features/circuitbreaker.js';

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const runTest = async () => {
  const breaker = new CircuitBreaker(3, 1000); // 3 failures, 1 sec cooldown

  // ➤ Step 1: 3 Failures
  breaker.recordFailure();
  breaker.recordFailure();
  breaker.recordFailure();

  assert.strictEqual(breaker.state, 'OPEN', 'Circuit should be OPEN after 3 failures');
  assert.strictEqual(breaker.canRequest(), false, 'Should not allow requests when OPEN');

  console.log('⛔ Circuit breaker OPEN after 3 failures');

  // ➤ Step 2: Wait for cooldown
  await sleep(1100);

  assert.strictEqual(breaker.canRequest(), true, 'Should allow request after cooldown');
  assert.strictEqual(breaker.state, 'HALF-OPEN', 'State should be HALF-OPEN after cooldown');

  // ➤ Step 3: On success, it should close again
  breaker.recordSuccess();

  assert.strictEqual(breaker.state, 'CLOSED', 'Should reset to CLOSED after success');
  assert.strictEqual(breaker.canRequest(), true, 'Should allow requests in CLOSED state');

  console.log('✅ Circuit breaker logic test passed.');
};

runTest();
