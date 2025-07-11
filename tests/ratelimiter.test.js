import assert from 'assert';
import { LimitCheck } from '../src/features/ratelimiter.js';

const runTest = () => {
  let passed = 0;
  let blocked = 0;

  for (let i = 1; i <= 12; i++) {
    const allowed = LimitCheck();
    if (allowed) {
      passed++;
    } else {
      blocked++;
      console.log(`⛔ Request ${i} blocked by rate limiter`);
    }
  }

  assert.strictEqual(passed, 10, 'Only 10 requests should pass');
  assert.strictEqual(blocked, 2, 'Remaining requests should be blocked');

  console.log('✅ Rate limiter logic test passed.');
};

runTest();
