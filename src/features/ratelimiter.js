

const timestamps = [];

export function LimitCheck(limit = 10, windowMs = 60000) {
  const now = Date.now();

  // Remove timestamps older than 1 minute
  while (timestamps.length > 0 && now - timestamps[0] > windowMs) {
    timestamps.shift();
  }

  if (timestamps.length < limit) {
    timestamps.push(now);
    return true;
  }

  return false;
}
