
import assert from 'assert';
import { retryWithExponentialBackoff } from '../src/features/retry.js';

let attempt = 0;

const mockFailTwice = async () => {
  attempt++;
  if (attempt < 3) {
    throw new Error("Failing...");
  }
  return "Success";
};

const runTest = async () => {
  const result = await retryWithExponentialBackoff(mockFailTwice, 3, 100); // retries = 3
  assert.strictEqual(result, "Success");
  console.log("✅ Retry logic test passed.");
};

runTest().catch(err => {
  console.error("❌ Retry logic test failed:", err);
});
