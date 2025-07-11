import assert from 'assert';
import {EmailService}from '../src/emailservice.js';
import { getStatus } from '../src/features/statustracking.js';

const runTest = async () => {
  const emailService = new EmailService();

  const emailData = {
    to: 'test@example.com',
    subject: 'Test Subject',
    body: 'Hello from unit test',
    idempotencyKey: 'email-unique-001',
  };

  // First attempt should try Provider A and possibly B
  try {
    const response = await emailService.sendEmail(emailData);
    assert.ok(response.message.includes('Email sent successfully'), 'Email should be sent via one of the providers');
    console.log(`✅ EmailService test passed with: ${response.provider}`);
  } catch (err) {
    console.error('❌ EmailService test failed:', err.message);
  }

  // Second attempt should return saved response due to idempotency
  const cachedResponse = await emailService.sendEmail(emailData);
  assert.ok(cachedResponse, 'Cached response should exist');
  assert.strictEqual(getStatus(emailData.idempotencyKey), 'SENT', 'Status should be SENT for duplicate request');
  console.log('✅ Idempotency check passed on second attempt');
};

runTest();
