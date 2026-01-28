/**
 * Simple concurrency limiter (p-limit style) without external dependencies.
 * Limits the number of concurrent async operations.
 */

type QueueItem<T> = {
  fn: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
};

export function createLimiter(concurrency: number) {
  let active = 0;
  const queue: QueueItem<unknown>[] = [];

  async function run<T>(item: QueueItem<T>) {
    active++;
    try {
      const result = await item.fn();
      item.resolve(result);
    } catch (error) {
      item.reject(error);
    } finally {
      active--;
      processQueue();
    }
  }

  function processQueue() {
    while (active < concurrency && queue.length > 0) {
      const item = queue.shift();
      if (item) {
        run(item);
      }
    }
  }

  return function limit<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const item: QueueItem<T> = { fn, resolve, reject };
      queue.push(item as QueueItem<unknown>);
      processQueue();
    });
  };
}

// Global limiter for outbound HTTP requests (probing, validation)
export const httpLimiter = createLimiter(5);
