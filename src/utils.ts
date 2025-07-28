export class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private maxTokens: number;
  private refillRate: number; // tokens per millisecond

  constructor(maxTokens: number, refillRate: number) {
    this.maxTokens = maxTokens;
    this.tokens = maxTokens;
    this.refillRate = refillRate;
    this.lastRefill = Date.now();
  }

  async acquire(): Promise<void> {
    return new Promise((resolve) => {
      const now = Date.now();
      const timePassed = now - this.lastRefill;
      this.tokens = Math.min(
        this.maxTokens,
        this.tokens + timePassed * this.refillRate
      );
      this.lastRefill = now;

      if (this.tokens >= 1) {
        this.tokens -= 1;
        resolve();
      } else {
        const waitTime = (1 - this.tokens) / this.refillRate;
        setTimeout(() => {
          this.tokens = 0;
          resolve();
        }, waitTime);
      }
    });
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function createRetryWrapper<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  maxRetries: number = 3,
  delay: number = 1000
) {
  return async (...args: T): Promise<R> => {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error as Error;

        if (attempt === maxRetries) {
          throw lastError;
        }

        const waitTime = delay * Math.pow(2, attempt); // Exponential backoff
        await sleep(waitTime);
      }
    }

    throw lastError!;
  };
}
