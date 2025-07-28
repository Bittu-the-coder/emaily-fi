export declare class RateLimiter {
    private tokens;
    private lastRefill;
    private maxTokens;
    private refillRate;
    constructor(maxTokens: number, refillRate: number);
    acquire(): Promise<void>;
}
export declare function sleep(ms: number): Promise<void>;
export declare function shuffleArray<T>(array: T[]): T[];
export declare function createRetryWrapper<T extends any[], R>(fn: (...args: T) => Promise<R>, maxRetries?: number, delay?: number): (...args: T) => Promise<R>;
