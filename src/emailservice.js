import { retryWithExponentialBackoff } from './features/retry.js';
import { isDuplicate, saveResponse, getResponse } from './features/idempotency.js';
import { LimitCheck } from './features/ratelimiter.js';
import { setStatus, getStatus } from './features/statustracking.js';
import { logInfo, logError } from './features/logger.js';
import { CircuitBreaker } from './features/circuitbreaker.js';
import { enqueue } from './features/queue.js';

class ProviderA {
  async send(email) {
    if (Math.random() < 0.4) throw new Error('ProviderA failed');
    return { provider: 'A', message: 'Email sent successfully via Provider A' };
  }
}

class ProviderB {
  async send(email) {
    if (Math.random() < 0.3) throw new Error('ProviderB failed');
    return { provider: 'B', message: 'Email sent successfully via Provider B' };
  }
}

export  class EmailService {
  constructor() {
    this.providerA = new ProviderA();
    this.providerB = new ProviderB();
    this.circuitBreakerA = new CircuitBreaker();
    this.circuitBreakerB = new CircuitBreaker();
  }

  getStatus(key) {
    return getStatus(key) || 'UNKNOWN';
  }

  async sendEmail({ to, subject, body, idempotencyKey }) {
    const email = { to, subject, body };

    // 1. Idempotency check
    if (isDuplicate(idempotencyKey)) {
      logInfo(`Duplicate detected for ${idempotencyKey}`);
      return getResponse(idempotencyKey);
    }

    // 2. Rate limit check
    if (!LimitCheck()) {
      logError('Rate limit exceeded');
      throw new Error('Rate limit exceeded. Try again later.');
    }

    // 3. Mark as pending
    setStatus(idempotencyKey, 'PENDING');

    let result;

    // 4. Try Provider A (if not tripped)
    if (this.circuitBreakerA.canRequest()) {
      setStatus(idempotencyKey, 'RETRYING_PROVIDER_A');
      logInfo('Attempting Provider A...');
      try {
        result = await retryWithExponentialBackoff(() => this.providerA.send(email));
        this.circuitBreakerA.recordSuccess();
        setStatus(idempotencyKey, 'SENT');
        saveResponse(idempotencyKey, result);
        logInfo('Email sent via Provider A');
        return result;
      } catch (err) {
        this.circuitBreakerA.recordFailure();
        logError(`Provider A failed: ${err.message}`);
      }
    }

    // 5. Fallback to Provider B
    if (this.circuitBreakerB.canRequest()) {
      setStatus(idempotencyKey, 'RETRYING_PROVIDER_B');
      logInfo('Falling back to Provider B...');
      try {
        result = await retryWithExponentialBackoff(() => this.providerB.send(email));
        this.circuitBreakerB.recordSuccess();
        setStatus(idempotencyKey, 'SENT');
        saveResponse(idempotencyKey, result);
        logInfo('Email sent via Provider B');
        return result;
      } catch (err) {
        this.circuitBreakerB.recordFailure();
        setStatus(idempotencyKey, 'FAILED');
        logError(`Provider B failed: ${err.message}`);
        throw new Error('Both providers failed');
      }
    }

    // 6. If both circuits are open
    setStatus(idempotencyKey, 'FAILED');
    logError('Both providers unavailable due to circuit breaker');
    throw new Error('All providers unavailable. Please try later.');
  }
}


export function enqueueEmailJob(emailData) {
  enqueue(async () => {
    const emailService = new EmailService(); 
    try {
      await emailService.sendEmail(emailData);
    } catch (err) {
      logError(`Email send failed in queue: ${err.message}`);
    }
  });
}
