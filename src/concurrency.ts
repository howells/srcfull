interface QueueItem<T> {
  fn: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
}

export function createLimiter(concurrency: number) {
  const safeConcurrency = Math.max(1, Math.floor(concurrency) || 1);
  let active = 0;
  const queue: QueueItem<unknown>[] = [];

  async function run<T>(item: QueueItem<T>) {
    active += 1;
    try {
      item.resolve(await item.fn());
    } catch (error) {
      item.reject(error);
    } finally {
      active -= 1;
      drain();
    }
  }

  function drain() {
    while (active < safeConcurrency && queue.length > 0) {
      const item = queue.shift();
      if (item) {
        void run(item);
      }
    }
  }

  return function limit<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      queue.push({ fn, reject, resolve } as QueueItem<unknown>);
      drain();
    });
  };
}

export const httpLimiter = createLimiter(5);
