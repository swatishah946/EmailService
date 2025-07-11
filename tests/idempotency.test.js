import assert from 'assert';
import { isDuplicate, saveResponse, getResponse } from '../src/features/idempotency.js';

const runTest = () => {
  const key = 'email-001';
  const mockResponse = { provider: 'A', message: 'Mock Email Sent' };

  // ➤ 1. Should NOT be a duplicate before saving
  assert.strictEqual(isDuplicate(key), false, 'Should not detect duplicate before saving');

  // ➤ 2. Save response
  saveResponse(key, mockResponse);

  // ➤ 3. Should be a duplicate now
  assert.strictEqual(isDuplicate(key), true, 'Should detect duplicate after saving');

  // ➤ 4. Retrieved response should match
  assert.deepStrictEqual(getResponse(key), mockResponse, 'Saved and fetched response should match');

  console.log('✅ Idempotency logic test passed.');
};

runTest();
