import PQueue from "p-queue";
import {
  User,
  MessageInput,
  Config,
  SendResult,
  BatchSendResult,
  UserSchema,
  MessageInputSchema,
  ConfigSchema,
  ValidatedUser,
  ValidatedMessageInput,
  ValidatedConfig,
} from "./types";
import { ProviderFactory, EmailProvider } from "./providers";
import { RateLimiter, shuffleArray, createRetryWrapper } from "./utils";

export class EmailNotifier {
  private provider: EmailProvider;
  private rateLimiter?: RateLimiter;
  private queue?: PQueue;
  private config: ValidatedConfig;
  private sendWithRetry?: (
    user: User,
    message: MessageInput
  ) => Promise<SendResult>;

  constructor(config: Config) {
    // Validate and transform configuration
    const validatedConfig = ConfigSchema.parse(config);
    this.config = validatedConfig;

    // Initialize provider
    this.provider = ProviderFactory.createProvider(this.config);

    // Setup rate limiting
    if (this.config.rateLimit) {
      const { maxPerSecond = 1 } = this.config.rateLimit;
      this.rateLimiter = new RateLimiter(maxPerSecond, maxPerSecond / 1000);
    }

    // Setup queue if enabled
    if (this.config.enableQueue) {
      this.queue = new PQueue({
        concurrency: this.config.rateLimit?.maxPerSecond || 1,
        interval: 1000,
        intervalCap: this.config.rateLimit?.maxPerSecond || 1,
      });
    }

    // Setup retry wrapper
    if (this.config.retryOptions) {
      this.sendWithRetry = createRetryWrapper(
        this.sendSingleEmail.bind(this),
        this.config.retryOptions.maxRetries,
        this.config.retryOptions.retryDelay
      );
    }
  }

  async initialize(): Promise<void> {
    await this.provider.initialize();
    this.log("EmailNotifier initialized successfully", "info");
  }

  async sendToAll(
    users: User[],
    message: MessageInput
  ): Promise<BatchSendResult> {
    this.validateInputs(users, message);

    this.log(`Sending email to ${users.length} recipients`, "info");

    const results: SendResult[] = [];
    const sendPromises = users.map((user) => this.executeSend(user, message));

    const sendResults = await Promise.allSettled(sendPromises);

    for (const result of sendResults) {
      if (result.status === "fulfilled") {
        results.push(result.value);
      } else {
        results.push({
          success: false,
          error: result.reason?.message || "Unknown error",
          recipient: "unknown",
        });
      }
    }

    const totalSent = results.filter((r) => r.success).length;
    const totalFailed = results.filter((r) => !r.success).length;

    this.log(
      `Batch send completed: ${totalSent} sent, ${totalFailed} failed`,
      "info"
    );

    return {
      results,
      totalSent,
      totalFailed,
    };
  }

  async sendToOne(user: User, message: MessageInput): Promise<SendResult> {
    this.validateInputs([user], message);

    this.log(`Sending email to ${user.email}`, "info");

    return await this.executeSend(user, message);
  }

  async sendRandom(
    users: User[],
    message: MessageInput,
    count = 1
  ): Promise<BatchSendResult> {
    this.validateInputs(users, message);

    if (count > users.length) {
      throw new Error(
        `Cannot send to ${count} users when only ${users.length} are provided`
      );
    }

    const shuffled = shuffleArray(users);
    const selected = shuffled.slice(0, count);

    this.log(
      `Sending email to ${count} random recipients from ${users.length} total`,
      "info"
    );

    return await this.sendToAll(selected, message);
  }

  async sendFiltered(
    users: User[],
    message: MessageInput,
    filter: (user: User) => boolean
  ): Promise<BatchSendResult> {
    this.validateInputs(users, message);

    const filteredUsers = users.filter(filter);

    this.log(
      `Sending email to ${filteredUsers.length} filtered recipients from ${users.length} total`,
      "info"
    );

    return await this.sendToAll(filteredUsers, message);
  }

  private async executeSend(
    user: User,
    message: MessageInput
  ): Promise<SendResult> {
    const sendFunction = this.sendWithRetry || this.sendSingleEmail.bind(this);

    if (this.queue) {
      const result = await this.queue.add(async (): Promise<SendResult> => {
        return await sendFunction(user, message);
      });
      return result as SendResult;
    } else if (this.rateLimiter) {
      await this.rateLimiter.acquire();
      return await sendFunction(user, message);
    } else {
      return await sendFunction(user, message);
    }
  }

  private async sendSingleEmail(
    user: User,
    message: MessageInput
  ): Promise<SendResult> {
    try {
      const result = await this.provider.sendEmail(user, message);

      if (result.success) {
        this.log(`Email sent successfully to ${user.email}`, "info");
      } else {
        this.log(
          `Failed to send email to ${user.email}: ${result.error}`,
          "error"
        );
      }

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.log(
        `Error sending email to ${user.email}: ${errorMessage}`,
        "error"
      );

      return {
        success: false,
        error: errorMessage,
        recipient: user.email,
      };
    }
  }

  private validateInputs(users: User[], message: MessageInput): void {
    // Validate users
    users.forEach((user, index) => {
      try {
        UserSchema.parse(user);
      } catch (error) {
        throw new Error(`Invalid user at index ${index}: ${error}`);
      }
    });

    // Validate message
    try {
      MessageInputSchema.parse(message);
    } catch (error) {
      throw new Error(`Invalid message: ${error}`);
    }
  }

  private log(message: string, level: "info" | "warn" | "error"): void {
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
  pauseQueue(): void {
    if (this.queue) {
      this.queue.pause();
      this.log("Queue paused", "info");
    }
  }

  resumeQueue(): void {
    if (this.queue) {
      this.queue.start();
      this.log("Queue resumed", "info");
    }
  }
}
