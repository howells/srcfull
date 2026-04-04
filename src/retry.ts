export class RetryableStatusError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "RetryableStatusError";
    this.status = status;
  }
}

export function shouldRetryStatus(status: number): boolean {
  return status === 408 || status === 429 || status >= 500;
}

export function isRetryableRequestError(error: unknown): boolean {
  return (
    error instanceof RetryableStatusError ||
    (error instanceof Error &&
      (error.name === "AbortError" || error.name === "TypeError"))
  );
}

export function sleep(delayMs: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}
