const queue = [];

export function enqueue(job) {
  queue.push(job);
  processQueue(); 
}

let isProcessing = false;

async function processQueue() {
  if (isProcessing) return;

  isProcessing = true;

  while (queue.length > 0) {
    const job = queue.shift();
    try {
      await job(); 
    } catch (err) {
      console.error(`[Queue Error] ${err.message}`);
    }
  }

  isProcessing = false;
}