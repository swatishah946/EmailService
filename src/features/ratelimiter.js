const timestamps=[];
/*
parameters-
 * {number} limit - Max allowed requests in time window
 * {number} interval - Time window in ms (default 1 min)
 * return {boolean} - True if allowed, false if rate limit exceeded
*/

export async function LimitCheck(limit=7,interval=60000) {
    const currenttime=Date.now();
    let windowstart=currenttime-interval;

    // Remove  older timestamps
  while (timestamps.length && timestamps[0] < windowstart) {
    timestamps.shift();
  }

  if (timestamps.length >= limit) {
    return false; //limit exceeded
  }

  // Record current request timestamp
  timestamps.push(currenttime);
  return true;

}