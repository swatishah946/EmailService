
/**
 * Retries an async function with exponential backoff.
 * Parametrs-
 * {Function} func - The async function to retry.
 *  {number} retries - Number of attempts before failing.
 *  {number} delay - Initial delay in ms (will double each retry).
 */

export async function retryWithExponentialBackoff(func,retries=3,delay=1000){
for(let attempts=0;attempts<retries;attempts++){
    try {
      return await fn();
    } catch (err) {
      if (attempts === retries - 1) {
        throw err;
      }
      const backoff = delay * 2 ** attempts;
      console.warn(`Retry ${attempts + 1} failed. Retrying in ${backoff}ms...`);
      await new Promise(res => setTimeout(res, backoff));
    }
}

}
