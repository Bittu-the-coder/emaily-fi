# Email-Notify

A powerful, backend-focused npm package for sending email notifications with support for Gmail SMTP, rate limiting, retry mechanisms, and extensible providers.

## Features

- ✅ **Multiple Send Modes**: Send to all users, single user, random subset, or filtered users
- ✅ **Provider Support**: Gmail SMTP (with extensible architecture for future providers)
- ✅ **Rate Limiting**: Built-in rate limiting to respect email provider limits
- ✅ **Retry Mechanisms**: Automatic retries with exponential backoff
- ✅ **Queue System**: Optional async queue for high-volume dispatches
- ✅ **Input Validation**: Structured validation using Zod
- ✅ **TypeScript**: Full TypeScript support with type safety
- ✅ **Rich Messages**: Support for HTML, CC/BCC, and attachments
- ✅ **Logging**: Custom logging support for monitoring
- ✅ **Comprehensive Testing**: Complete test suite with mocked environments

## Installation

```bash
npm install email-notify
```

## Quick Start

```typescript
import { EmailNotifier } from "email-notify";

const notifier = new EmailNotifier({
  senderEmail: "your-email@gmail.com",
  senderPassword: "your-app-password", // Use App Password for Gmail
  rateLimit: {
    maxPerSecond: 1,
  },
  retryOptions: {
    maxRetries: 3,
    retryDelay: 1000,
  },
});

await notifier.initialize();

const users = [
  { name: "Alice", email: "alice@example.com" },
  { name: "Bob", email: "bob@example.com" },
];

const message = {
  subject: "Hello!",
  body: "This is a test message.",
  html: "<h1>Hello!</h1><p>This is a test message.</p>",
};

// Send to all users
const result = await notifier.sendToAll(users, message);
console.log(`Sent: ${result.totalSent}, Failed: ${result.totalFailed}`);
```

## Configuration

### Basic Configuration

```typescript
interface Config {
  senderEmail: string; // Your Gmail address
  senderPassword: string; // Gmail App Password
  provider?: "gmail"; // Email provider (gmail only for now)
  rateLimit?: RateLimitConfig; // Rate limiting options
  retryOptions?: RetryConfig; // Retry configuration
  enableQueue?: boolean; // Enable async queue
  logger?: LoggerFunction; // Custom logging function
}
```

### Rate Limiting

```typescript
const config = {
  // ... other config
  rateLimit: {
    maxPerSecond: 1, // Max 1 email per second
    maxPerMinute: 50, // Max 50 emails per minute
    maxPerHour: 500, // Max 500 emails per hour
  },
};
```

### Retry Configuration

```typescript
const config = {
  // ... other config
  retryOptions: {
    maxRetries: 3, // Retry up to 3 times
    retryDelay: 1000, // Initial delay of 1 second (exponential backoff)
  },
};
```

### Queue System

```typescript
const config = {
  // ... other config
  enableQueue: true, // Enable async processing queue
  rateLimit: {
    maxPerSecond: 2, // Queue will respect rate limits
  },
};
```

## Usage Examples

### Send to Single User

```typescript
const result = await notifier.sendToOne(
  { name: "Alice", email: "alice@example.com" },
  {
    subject: "Personal Message",
    body: "Hello Alice!",
    html: "<h1>Hello Alice!</h1>",
  }
);

if (result.success) {
  console.log(`Email sent successfully: ${result.messageId}`);
} else {
  console.error(`Failed to send: ${result.error}`);
}
```

### Send to Random Users

```typescript
// Send to 3 random users from the list
const result = await notifier.sendRandom(users, message, 3);
console.log(`Randomly sent to ${result.totalSent} users`);
```

### Send to Filtered Users

```typescript
// Send only to users whose names start with 'A'
const result = await notifier.sendFiltered(users, message, (user) =>
  user.name.startsWith("A")
);
```

### Rich Messages with Attachments

```typescript
const richMessage = {
  subject: "Report Attached",
  body: "Please find the report attached.",
  html: "<h1>Monthly Report</h1><p>Please find the report attached.</p>",
  cc: ["supervisor@company.com"],
  bcc: ["archive@company.com"],
  attachments: [
    {
      filename: "report.pdf",
      content: fs.readFileSync("./report.pdf"),
      contentType: "application/pdf",
    },
  ],
};

await notifier.sendToOne(user, richMessage);
```

### Custom Logging

```typescript
const notifier = new EmailNotifier({
  // ... other config
  logger: (message, level) => {
    console.log(
      `[${level.toUpperCase()}] ${new Date().toISOString()}: ${message}`
    );
  },
});
```

### Queue Management

```typescript
// When queue is enabled
const stats = notifier.getQueueStats();
console.log(`Queue size: ${stats?.size}, Pending: ${stats?.pending}`);

// Pause/resume queue
notifier.pauseQueue();
notifier.resumeQueue();
```

## Environment Variables

You can use environment variables for sensitive configuration:

```bash
# .env file
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=your-app-password
```

```typescript
import "dotenv/config";

const notifier = new EmailNotifier({
  senderEmail: process.env.SENDER_EMAIL!,
  senderPassword: process.env.SENDER_PASSWORD!,
  // ... other config
});
```

## Gmail Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Use the generated App Password as `senderPassword`

## Error Handling

The package provides detailed error information:

```typescript
const result = await notifier.sendToAll(users, message);

result.results.forEach((res, index) => {
  if (!res.success) {
    console.error(`Failed to send to ${res.recipient}: ${res.error}`);
  }
});
```

## Testing

The package includes comprehensive tests:

```bash
npm test                # Run tests
npm run test:watch     # Run tests in watch mode
```

## Development

```bash
npm run build          # Build TypeScript
npm run lint           # Run ESLint
npm run dev            # Run in development mode
```

## Future Enhancements

- [ ] SendGrid provider support
- [ ] Mailgun provider support
- [ ] Template system
- [ ] Email tracking
- [ ] Webhook support
- [ ] Advanced filtering options

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details.

## Security

- Never commit credentials to version control
- Use environment variables for sensitive data
- Use App Passwords instead of account passwords
- Regularly rotate credentials

## Support

For issues and questions, please open an issue on GitHub.
