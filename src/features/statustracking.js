
const statusMap = new Map();

/**
 * {string} key - The idempotency key (or request ID)
 *  {string} status - The status to set
 */

// Set the current status for an idempotency key.

export function setStatus(key, status) {
  statusMap.set(key, status);
}


 // Get the current status of an email send attempt.

export function getStatus(key) {
  return statusMap.get(key) || null;
}
