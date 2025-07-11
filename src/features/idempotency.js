
// In-memory store to track idempotent email sends
const store = new Map();


 // Check if an idempotency key already exists.
 
export function isDuplicate(key) {
  return store.has(key);
}


 // Save a successful response for the given key.
 
export function saveResponse(key, response) {
  store.set(key, response);
}


 // Retrieve the saved response for a key.

export function getResponse(key) {
  return store.get(key);
}
