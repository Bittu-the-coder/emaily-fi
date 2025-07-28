# Configuration Guide

## Overview

The `emaily-fi` package offers flexible configuration options to suit different deployment environments and use cases. This guide covers all available configuration options and best practices.

## Configuration Methods

### 1. Direct Configuration

Pass configuration directly to the EmailNotifier constructor:

```typescript
import { EmailNotifier } from "emaily-fi";

const notifier = new EmailNotifier({
  emailUser: "your-email@gmail.com",
  emailPass: "your-app-password",
  provider: "gmail",
  rateLimit: {
    maxPerSecond: 1,
    maxPerMinute: 50,
  },
});
```

### 2. Environment Variables

Use environment variables for sensitive configuration:

```typescript
import { EmailNotifier, createValidatedConfigFromEnv } from "emaily-fi";

// Load configuration from environment variables
const config = createValidatedConfigFromEnv();
const notifier = new EmailNotifier(config);
```

**Required Environment Variables:**

- `EMAIL_USER` - Your Gmail email address
- `EMAIL_PASS` - Your Gmail App Password

**Optional Environment Variables:**

- `EMAIL_FROM` - Display name and email format
- `SMTP_HOST` - SMTP host (default: smtp.gmail.com)
- `SMTP_PORT` - SMTP port (default: 587)
- `MAX_EMAILS_PER_SECOND` - Rate limit per second
- `MAX_EMAILS_PER_MINUTE` - Rate limit per minute
- `MAX_EMAILS_PER_HOUR` - Rate limit per hour
- `MAX_RETRIES` - Maximum retry attempts
- `RETRY_DELAY` - Initial retry delay in milliseconds
- `ENABLE_QUEUE` - Enable queue system (true/false)

### 3. Environment File (.env)

Create a `.env` file in your project root:

```env
# Gmail SMTP Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM="Your Company <your-email@gmail.com>"

# Rate Limiting
MAX_EMAILS_PER_SECOND=1
MAX_EMAILS_PER_MINUTE=50
MAX_EMAILS_PER_HOUR=500

# Retry Configuration
MAX_RETRIES=3
RETRY_DELAY=1000

# Queue System
ENABLE_QUEUE=true
```

Then load it in your application:

```typescript
import "dotenv/config";
import { EmailNotifier, createValidatedConfigFromEnv } from "emaily-fi";

const notifier = new EmailNotifier(createValidatedConfigFromEnv());
```

## Configuration Options

### SMTP Settings

#### Gmail Configuration (Recommended)

```typescript
{
  smtpHost: "smtp.gmail.com",    // Gmail SMTP host
  smtpPort: 587,                 // Gmail SMTP port
  emailUser: "user@gmail.com",   // Your Gmail address
  emailPass: "app-password",     // Gmail App Password
  emailFrom: "Name <user@gmail.com>" // Optional display format
}
```

**Setting up Gmail App Password:**

1. Enable 2-Factor Authentication on your Google account
2. Go to Google Account settings → Security → 2-Step Verification
3. Generate an App Password for "Mail"
4. Use this 16-character password as `emailPass`

#### Custom SMTP Configuration

```typescript
{
  smtpHost: "mail.yourprovider.com",
  smtpPort: 465,  // or 587
  emailUser: "user@yourprovider.com",
  emailPass: "your-password"
}
```

### Rate Limiting

Configure rate limits to respect provider restrictions:

```typescript
{
  rateLimit: {
    maxPerSecond: 1,    // Max 1 email per second
    maxPerMinute: 50,   // Max 50 emails per minute
    maxPerHour: 500     // Max 500 emails per hour
  }
}
```

**Provider-Specific Recommendations:**

- **Gmail**: 1/second, 50/minute, 500/hour (conservative)
- **SendGrid**: Higher limits based on your plan
- **Mailgun**: Higher limits based on your plan

### Retry Configuration

Configure automatic retries with exponential backoff:

```typescript
{
  retryOptions: {
    maxRetries: 3,      // Retry up to 3 times
    retryDelay: 1000    // Start with 1 second delay
  }
}
```

The retry delay uses exponential backoff:

- 1st retry: 1000ms
- 2nd retry: 2000ms
- 3rd retry: 4000ms

### Queue System

Enable async processing for high-volume sends:

```typescript
{
  enableQueue: true,
  rateLimit: {
    maxPerSecond: 2  // Queue will respect rate limits
  }
}
```

**Queue Benefits:**

- Non-blocking email sends
- Automatic rate limit enforcement
- Better error handling for batch operations
- Memory-efficient processing

### Logging

Add custom logging for monitoring:

```typescript
{
  logger: (message: string, level: "info" | "warn" | "error") => {
    console.log(
      `[${level.toUpperCase()}] ${new Date().toISOString()}: ${message}`
    );
  };
}
```

**Integration Examples:**

```typescript
// Winston Logger
import winston from 'winston';
const logger = winston.createLogger({...});

const config = {
  logger: (message, level) => logger.log(level, message)
};

// Pino Logger
import pino from 'pino';
const logger = pino();

const config = {
  logger: (message, level) => logger[level](message)
};
```

## Configuration Validation

The package validates configuration at initialization:

```typescript
try {
  const notifier = new EmailNotifier(config);
  await notifier.initialize();
} catch (error) {
  console.error("Configuration error:", error.message);
}
```

**Common Validation Errors:**

- Missing required email credentials
- Invalid email format
- Invalid rate limit values
- Invalid retry configuration

## Legacy Configuration Support

The package supports legacy configuration format for backward compatibility:

```typescript
// Legacy format (deprecated but supported)
{
  senderEmail: "user@gmail.com",
  senderPassword: "app-password"
}

// New format (recommended)
{
  emailUser: "user@gmail.com",
  emailPass: "app-password"
}
```

## Production Recommendations

### Security

- Use environment variables for credentials
- Never commit credentials to version control
- Use App Passwords instead of account passwords
- Rotate credentials regularly

### Performance

- Enable queue system for batch operations
- Set appropriate rate limits
- Monitor queue statistics
- Use retry mechanisms for reliability

### Monitoring

- Implement custom logging
- Track send success/failure rates
- Monitor rate limit compliance
- Set up alerts for failures

### Example Production Configuration

```typescript
import { EmailNotifier, createValidatedConfigFromEnv } from "emaily-fi";

// Load from environment with fallbacks
const notifier = new EmailNotifier({
  ...createValidatedConfigFromEnv(),
  enableQueue: true,
  rateLimit: {
    maxPerSecond: 1,
    maxPerMinute: 50,
    maxPerHour: 500,
  },
  retryOptions: {
    maxRetries: 3,
    retryDelay: 1000,
  },
  logger: (message, level) => {
    // Your production logging system
    productionLogger.log(level, message);
  },
});

await notifier.initialize();
```
