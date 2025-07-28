"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailNotifier = void 0;
const p_queue_1 = __importDefault(require("p-queue"));
const types_1 = require("./types");
const providers_1 = require("./providers");
const utils_1 = require("./utils");
class EmailNotifier {
    constructor(config) {
        // Validate and transform configuration
        const validatedConfig = types_1.ConfigSchema.parse(config);
        this.config = validatedConfig;
        // Initialize provider
        this.provider = providers_1.ProviderFactory.createProvider(this.config);
        // Setup rate limiting
        if (this.config.rateLimit) {
            const { maxPerSecond = 1 } = this.config.rateLimit;
            this.rateLimiter = new utils_1.RateLimiter(maxPerSecond, maxPerSecond / 1000);
        }
        // Setup queue if enabled
        if (this.config.enableQueue) {
            this.queue = new p_queue_1.default({
                concurrency: this.config.rateLimit?.maxPerSecond || 1,
                interval: 1000,
                intervalCap: this.config.rateLimit?.maxPerSecond || 1,
            });
        }
        // Setup retry wrapper
        if (this.config.retryOptions) {
            this.sendWithRetry = (0, utils_1.createRetryWrapper)(this.sendSingleEmail.bind(this), this.config.retryOptions.maxRetries, this.config.retryOptions.retryDelay);
        }
    }
    async initialize() {
        await this.provider.initialize();
        this.log("EmailNotifier initialized successfully", "info");
    }
    async sendToAll(users, message) {
        this.validateInputs(users, message);
        this.log(`Sending email to ${users.length} recipients`, "info");
        const results = [];
        const sendPromises = users.map((user) => this.executeSend(user, message));
        const sendResults = await Promise.allSettled(sendPromises);
        for (const result of sendResults) {
            if (result.status === "fulfilled") {
                results.push(result.value);
            }
            else {
                results.push({
                    success: false,
                    error: result.reason?.message || "Unknown error",
                    recipient: "unknown",
                });
            }
        }
        const totalSent = results.filter((r) => r.success).length;
        const totalFailed = results.filter((r) => !r.success).length;
        this.log(`Batch send completed: ${totalSent} sent, ${totalFailed} failed`, "info");
        return {
            results,
            totalSent,
            totalFailed,
        };
    }
    async sendToOne(user, message) {
        this.validateInputs([user], message);
        this.log(`Sending email to ${user.email}`, "info");
        return await this.executeSend(user, message);
    }
    async sendRandom(users, message, count = 1) {
        this.validateInputs(users, message);
        if (count > users.length) {
            throw new Error(`Cannot send to ${count} users when only ${users.length} are provided`);
        }
        const shuffled = (0, utils_1.shuffleArray)(users);
        const selected = shuffled.slice(0, count);
        this.log(`Sending email to ${count} random recipients from ${users.length} total`, "info");
        return await this.sendToAll(selected, message);
    }
    async sendFiltered(users, message, filter) {
        this.validateInputs(users, message);
        const filteredUsers = users.filter(filter);
        this.log(`Sending email to ${filteredUsers.length} filtered recipients from ${users.length} total`, "info");
        return await this.sendToAll(filteredUsers, message);
    }
    async executeSend(user, message) {
        const sendFunction = this.sendWithRetry || this.sendSingleEmail.bind(this);
        if (this.queue) {
            const result = await this.queue.add(async () => {
                return await sendFunction(user, message);
            });
            return result;
        }
        else if (this.rateLimiter) {
            await this.rateLimiter.acquire();
            return await sendFunction(user, message);
        }
        else {
            return await sendFunction(user, message);
        }
    }
    async sendSingleEmail(user, message) {
        try {
            const result = await this.provider.sendEmail(user, message);
            if (result.success) {
                this.log(`Email sent successfully to ${user.email}`, "info");
            }
            else {
                this.log(`Failed to send email to ${user.email}: ${result.error}`, "error");
            }
            return result;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            this.log(`Error sending email to ${user.email}: ${errorMessage}`, "error");
            return {
                success: false,
                error: errorMessage,
                recipient: user.email,
            };
        }
    }
    validateInputs(users, message) {
        // Validate users
        users.forEach((user, index) => {
            try {
                types_1.UserSchema.parse(user);
            }
            catch (error) {
                throw new Error(`Invalid user at index ${index}: ${error}`);
            }
        });
        // Validate message
        try {
            types_1.MessageInputSchema.parse(message);
        }
        catch (error) {
            throw new Error(`Invalid message: ${error}`);
        }
    }
    log(message, level) {
        if (this.config.logger) {
            this.config.logger(message, level);
        }
    }
    // Utility method to get queue stats if queue is enabled
    getQueueStats() {
        if (this.queue) {
            return {
                size: this.queue.size,
                pending: this.queue.pending,
                isPaused: this.queue.isPaused,
            };
        }
        return null;
    }
    // Method to pause/resume queue
    pauseQueue() {
        if (this.queue) {
            this.queue.pause();
            this.log("Queue paused", "info");
        }
    }
    resumeQueue() {
        if (this.queue) {
            this.queue.start();
            this.log("Queue resumed", "info");
        }
    }
}
exports.EmailNotifier = EmailNotifier;
