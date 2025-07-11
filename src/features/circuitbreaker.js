
export class CircuitBreaker {
  constructor(failureThreshold = 3, cooldownTime = 10000) {
    this.failureCount = 0;
    this.failureThreshold = failureThreshold;
    this.cooldownTime = cooldownTime;
    this.state = 'CLOSED';
    this.lastFailureTime = null;
  }

  canRequest() {
    if (this.state === 'OPEN') {
      const now = Date.now();
      if (now - this.lastFailureTime > this.cooldownTime) {
        this.state = 'HALF-OPEN';
        return true;
      }
      return false;
    }
    return true;
  }

  recordSuccess() {
    this.state = 'CLOSED';
    this.failureCount = 0;
  }

  recordFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }
}
