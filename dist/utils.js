"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = void 0;
exports.sleep = sleep;
exports.shuffleArray = shuffleArray;
exports.createRetryWrapper = createRetryWrapper;
class RateLimiter {
    constructor(maxTokens, refillRate) {
        this.maxTokens = maxTokens;
        this.tokens = maxTokens;
        this.refillRate = refillRate;
        this.lastRefill = Date.now();
    }
    async acquire() {
        return new Promise((resolve) => {
            const now = Date.now();
            const timePassed = now - this.lastRefill;
            this.tokens = Math.min(this.maxTokens, this.tokens + timePassed * this.refillRate);
            this.lastRefill = now;
            if (this.tokens >= 1) {
                this.tokens -= 1;
                resolve();
            }
            else {
                const waitTime = (1 - this.tokens) / this.refillRate;
                setTimeout(() => {
                    this.tokens = 0;
                    resolve();
                }, waitTime);
            }
        });
    }
}
exports.RateLimiter = RateLimiter;
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
function createRetryWrapper(fn, maxRetries = 3, delay = 1000) {
    return async (...args) => {
        let lastError;
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return await fn(...args);
            }
            catch (error) {
                lastError = error;
                if (attempt === maxRetries) {
                    throw lastError;
                }
                const waitTime = delay * Math.pow(2, attempt); // Exponential backoff
                await sleep(waitTime);
            }
        }
        throw lastError;
    };
}
