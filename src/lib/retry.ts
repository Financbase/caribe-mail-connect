export interface RetryOptions {
  retries?: number;
  minDelayMs?: number;
  maxDelayMs?: number;
  jitter?: boolean;
  shouldRetry?: (error: unknown, attempt: number) => boolean;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function computeBackoffDelay(attempt: number, min: number, max: number, jitter: boolean): number {
  const exp = Math.min(max, min * Math.pow(2, attempt));
  if (!jitter) return exp;
  const rand = Math.random() * exp;
  return Math.min(max, min + rand);
}

export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const {
    retries = 3,
    minDelayMs = 300,
    maxDelayMs = 2000,
    jitter = true,
    shouldRetry = () => true,
  } = options;

  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const willRetry = attempt < retries && shouldRetry(error, attempt);
      if (!willRetry) break;
      const delay = computeBackoffDelay(attempt, minDelayMs, maxDelayMs, jitter);
      await sleep(delay);
    }
  }
  throw lastError;
}


