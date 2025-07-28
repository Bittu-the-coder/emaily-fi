# API Reference

## EmailNotifier Class

The main class for sending email notifications with rate limiting, retry mechanisms, and queue support.

### Constructor

```typescript
new EmailNotifier(config: Config)
```

Creates a new EmailNotifier instance with the provided configuration.

**Parameters:**

- `config` - Configuration object (see [Configuration Types](#config))

**Throws:**

- `ZodError` - If configuration validation fails
- `Error` - If neither new format (emailUser/emailPass) nor legacy format (senderEmail/senderPassword) credentials are provided

**Example:**

```typescript
const notifier = new EmailNotifier({
  emailUser: "your-email@gmail.com",
  emailPass: "your-app-password",
  rateLimit: { maxPerSecond: 1 },
  retryOptions: { maxRetries: 3, retryDelay: 1000 },
});
```

### Methods

#### `initialize(): Promise<void>`

Initializes the email provider and validates the configuration. Must be called before sending emails.

**Returns:** Promise that resolves when initialization is complete

**Throws:**

- `Error` - If configuration is invalid
- `Error` - If provider initialization fails (e.g., SMTP connection issues)

**Example:**

```typescript
try {
  await notifier.initialize();
  console.log("Email notifier ready!");
} catch (error) {
  console.error("Initialization failed:", error.message);
}
```

#### `sendToAll(users: User[], message: MessageInput): Promise<BatchSendResult>`

Sends an email to all specified users with concurrent processing.

**Parameters:**

- `users` - Array of user objects
- `message` - Message configuration

**Returns:** Promise resolving to batch send results

**Throws:**

- `Error` - If users array is empty or invalid
- `ZodError` - If message validation fails

**Example:**

```typescript
const users = [
  { name: "Alice", email: "alice@example.com" },
  { name: "Bob", email: "bob@example.com" },
];

const result = await notifier.sendToAll(users, {
  subject: "Newsletter",
  body: "Check out our latest updates!",
  html: "<h1>Newsletter</h1><p>Check out our latest updates!</p>",
});

console.log(`✅ Sent: ${result.totalSent}, ❌ Failed: ${result.totalFailed}`);
```

#### `sendToOne(user: User, message: MessageInput): Promise<SendResult>`

Sends an email to a single user.

**Parameters:**

- `user` - User object containing name and email
- `message` - Message configuration

**Returns:** Promise resolving to send result

**Throws:**

- `ZodError` - If user or message validation fails

**Example:**

```typescript
const result = await notifier.sendToOne(
  { name: "Alice", email: "alice@example.com" },
  {
    subject: "Welcome",
    body: "Welcome to our service!",
    attachments: [
      {
        filename: "welcome.pdf",
        content: fs.readFileSync("./welcome.pdf"),
        contentType: "application/pdf",
      },
    ],
  }
);

if (result.success) {
  console.log(`Email sent! Message ID: ${result.messageId}`);
} else {
  console.error(`Send failed: ${result.error}`);
}
```

#### `sendRandom(users: User[], message: MessageInput, count?: number): Promise<BatchSendResult>`

Sends an email to a random subset of users. Useful for A/B testing or gradual rollouts.

**Parameters:**

- `users` - Array of user objects
- `message` - Message configuration
- `count` - Number of random users to send to (default: 1)

**Returns:** Promise resolving to batch send results

**Throws:**

- `Error` - If count is larger than users array length
- `ZodError` - If message validation fails

**Example:**

```typescript
// Send to 25% of users for A/B testing
const sampleSize = Math.floor(users.length * 0.25);
const result = await notifier.sendRandom(users, message, sampleSize);

console.log(`A/B test sent to ${result.totalSent} users`);
```

#### `sendFiltered(users: User[], message: MessageInput, filter: (user: User) => boolean): Promise<BatchSendResult>`

Sends an email to users that match the filter criteria.

**Parameters:**

- `users` - Array of user objects
- `message` - Message configuration
- `filter` - Function that returns true for users who should receive the email

**Returns:** Promise resolving to batch send results

**Throws:**

- `Error` - If filter function throws an error
- `ZodError` - If message validation fails

**Example:**

```typescript
// Send only to premium users
const result = await notifier.sendFiltered(
  users,
  message,
  (user) => user.isPremium === true
);

// Send only to users from specific domain
const companyResult = await notifier.sendFiltered(users, message, (user) =>
  user.email.endsWith("@company.com")
);

// Send to users who joined in the last week
const recentUsers = await notifier.sendFiltered(users, message, (user) => {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return user.createdAt > weekAgo;
});
```

#### `getQueueStats(): QueueStats | null`

Returns queue statistics if queue is enabled, null otherwise.

**Returns:** Queue statistics object or null if queue is disabled

**Example:**

```typescript
const stats = notifier.getQueueStats();
if (stats) {
  console.log(`Queue: ${stats.size} waiting, ${stats.pending} processing`);
  console.log(`Status: ${stats.isPaused ? "Paused" : "Active"}`);
} else {
  console.log("Queue is not enabled");
}
```

#### `pauseQueue(): void`

Pauses the email queue if enabled. No new emails will be processed until resumed.

**Example:**

```typescript
notifier.pauseQueue();
console.log("Email queue paused for maintenance");
```

#### `resumeQueue(): void`

Resumes the email queue if it was paused.

**Example:**

```typescript
notifier.resumeQueue();
console.log("Email queue resumed");
```

## Types

### User

Represents an email recipient.

```typescript
interface User {
  name: string; // Display name
  email: string; // Valid email address
}
```

**Validation Rules:**

- `name`: Required, non-empty string
- `email`: Must be valid email format

### MessageInput

Email message configuration with support for rich content.

```typescript
interface MessageInput {
  subject: string; // Email subject line
  body: string; // Plain text body
  html?: string; // HTML body (optional)
  cc?: string[]; // CC recipients (optional)
  bcc?: string[]; // BCC recipients (optional)
  attachments?: Attachment[]; // File attachments (optional)
}
```

**Validation Rules:**

- `subject`: Required, non-empty string
- `body`: Required, non-empty string
- `cc`, `bcc`: Arrays of valid email addresses
- `attachments`: Array of valid attachment objects

### Attachment

File attachment configuration.

```typescript
interface Attachment {
  filename: string; // Name of the file
  content: string | Buffer; // File content as string or Buffer
  contentType?: string; // MIME type (optional, auto-detected if not provided)
}
```

**Example:**

```typescript
const attachments: Attachment[] = [
  {
    filename: "report.pdf",
    content: fs.readFileSync("./report.pdf"),
    contentType: "application/pdf",
  },
  {
    filename: "data.csv",
    content: "Name,Email\nJohn,john@example.com",
    contentType: "text/csv",
  },
];
```

### Config

Main configuration interface with support for both modern and legacy formats.

```typescript
interface Config {
  // SMTP Configuration (Modern Format)
  smtpHost?: string; // SMTP host (default: "smtp.gmail.com")
  smtpPort?: number; // SMTP port (default: 587)
  emailUser?: string; // Gmail email address
  emailPass?: string; // Gmail App Password
  emailFrom?: string; // Display format: "Name <email@gmail.com>"

  // Legacy Support (Deprecated but Functional)
  senderEmail?: string; // Maps to emailUser
  senderPassword?: string; // Maps to emailPass

  // Provider Configuration
  provider?: "gmail" | "sendgrid" | "mailgun"; // Email provider (default: "gmail")

  // Rate Limiting
  rateLimit?: RateLimitConfig;

  // Retry Configuration
  retryOptions?: RetryConfig;

  // Queue System
  enableQueue?: boolean; // Enable async processing (default: false)

  // Logging
  logger?: LoggerFunction; // Custom logging function
}
```

**Configuration Requirements:**

- Either (`emailUser` + `emailPass`) OR (`senderEmail` + `senderPassword`) must be provided
- All other fields are optional with sensible defaults

### RateLimitConfig

Rate limiting configuration to respect provider limits.

```typescript
interface RateLimitConfig {
  maxPerSecond?: number; // Maximum emails per second
  maxPerMinute?: number; // Maximum emails per minute
  maxPerHour?: number; // Maximum emails per hour
}
```

**Recommended Gmail Limits:**

```typescript
rateLimit: {
  maxPerSecond: 1,      // Conservative rate
  maxPerMinute: 50,     // Well within Gmail limits
  maxPerHour: 500       // Safe daily rate
}
```

### RetryConfig

Automatic retry configuration with exponential backoff.

```typescript
interface RetryConfig {
  maxRetries?: number; // Maximum retry attempts (default: 3)
  retryDelay?: number; // Initial delay in milliseconds (default: 1000)
}
```

**Retry Behavior:**

- 1st retry: `retryDelay` ms
- 2nd retry: `retryDelay * 2` ms
- 3rd retry: `retryDelay * 4` ms
- etc.

### SendResult

Result of a single email send operation.

```typescript
interface SendResult {
  success: boolean; // Whether send was successful
  messageId?: string; // Provider's message ID (if successful)
  error?: string; // Error message (if failed)
  recipient: string; // Email address of recipient
}
```

### BatchSendResult

Result of a batch send operation (sendToAll, sendRandom, sendFiltered).

```typescript
interface BatchSendResult {
  results: SendResult[]; // Individual results for each recipient
  totalSent: number; // Count of successful sends
  totalFailed: number; // Count of failed sends
}
```

**Usage Example:**

```typescript
const batchResult = await notifier.sendToAll(users, message);

// Log summary
console.log(`Batch complete: ${batchResult.totalSent}/${users.length} sent`);

// Handle failures
const failures = batchResult.results.filter((r) => !r.success);
failures.forEach((failure) => {
  console.error(`Failed to send to ${failure.recipient}: ${failure.error}`);
});
```

### QueueStats

Statistics for the email queue system.

```typescript
interface QueueStats {
  size: number; // Number of queued items waiting
  pending: number; // Number of currently processing items
  isPaused: boolean; // Whether queue is paused
}
```

### LoggerFunction

Custom logging function interface.

```typescript
type LoggerFunction = (
  message: string,
  level: "info" | "warn" | "error"
) => void;
```

**Example Implementation:**

```typescript
const logger: LoggerFunction = (message, level) => {
  const timestamp = new Date().toISOString();
  const prefix = level.toUpperCase().padEnd(5);
  console.log(`[${prefix}] ${timestamp}: ${message}`);
};
```

## Error Handling

### Configuration Errors

```typescript
try {
  const notifier = new EmailNotifier(config);
  await notifier.initialize();
} catch (error) {
  if (error.name === "ZodError") {
    console.error("Configuration validation failed:", error.issues);
  } else {
    console.error("Configuration error:", error.message);
  }
}
```

### Send Operation Errors

```typescript
const result = await notifier.sendToOne(user, message);
if (!result.success) {
  console.error(`Send failed: ${result.error}`);

  // Handle specific error types
  if (result.error?.includes("authentication")) {
    console.error("Check your Gmail App Password");
  } else if (result.error?.includes("rate limit")) {
    console.error("Rate limit exceeded, try reducing send rate");
  }
}
```

### Common Error Types

| Error Type         | Description        | Common Causes                    |
| ------------------ | ------------------ | -------------------------------- |
| **Validation**     | Invalid input data | Malformed email, missing fields  |
| **Authentication** | Login failure      | Wrong credentials, 2FA issues    |
| **Rate Limiting**  | Too many requests  | Exceeded provider limits         |
| **Network**        | Connection issues  | Internet problems, SMTP downtime |
| **Provider**       | Service errors     | Gmail API issues, quota exceeded |

## Utility Functions

### Environment Configuration

```typescript
import {
  createValidatedConfigFromEnv,
  createConfigFromEnv,
  validateEnvConfig,
} from "emaily-fi";

// Load and validate configuration from environment
const config = createValidatedConfigFromEnv();
const notifier = new EmailNotifier(config);

// Just load config (no validation)
const rawConfig = createConfigFromEnv();

// Only validate environment (no config creation)
validateEnvConfig(); // Throws if required vars missing
```

### Validation Schemas

Export Zod schemas for custom validation:

```typescript
import { UserSchema, MessageInputSchema, ConfigSchema } from "emaily-fi";

// Validate user input before sending
try {
  const validUser = UserSchema.parse(userInput);
  const validMessage = MessageInputSchema.parse(messageInput);

  const result = await notifier.sendToOne(validUser, validMessage);
} catch (error) {
  console.error("Validation failed:", error.issues);
}
```

## Advanced Usage Patterns

### Conditional Sending

```typescript
// Send different messages based on user properties
const sendPersonalizedEmail = async (user: User) => {
  const message = user.isPremium ? premiumMessage : standardMessage;
  return await notifier.sendToOne(user, message);
};
```

### Batch Processing with Error Recovery

```typescript
const sendWithRetryFallback = async (users: User[], message: MessageInput) => {
  const result = await notifier.sendToAll(users, message);

  // Retry failed sends individually
  const failures = result.results.filter((r) => !r.success);
  const retryResults = await Promise.all(
    failures.map((failure) => {
      const user = users.find((u) => u.email === failure.recipient);
      return notifier.sendToOne(user, message);
    })
  );

  return {
    ...result,
    retryResults,
  };
};
```

### Queue Monitoring

```typescript
const monitorQueue = () => {
  const stats = notifier.getQueueStats();
  if (stats) {
    console.log(
      `Queue Status: ${stats.size} queued, ${stats.pending} processing`
    );

    if (stats.size > 100) {
      console.warn("Queue backlog detected, consider scaling");
    }
  }
};

// Monitor every 30 seconds
setInterval(monitorQueue, 30000);
```
