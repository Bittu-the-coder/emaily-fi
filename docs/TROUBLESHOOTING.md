# Troubleshooting Guide

## Common Issues and Solutions

### Authentication Issues

#### Gmail App Password Not Working

**Problem:** Authentication fails with "Invalid credentials" error.

**Solutions:**

1. **Verify 2FA is enabled:**

   ```bash
   # Check Google Account Security settings
   # 2-Step Verification must be enabled to generate App Passwords
   ```

2. **Generate new App Password:**

   - Go to Google Account → Security → 2-Step Verification
   - Select "App passwords" → Generate new password
   - Use the 16-character password (without spaces)

3. **Check configuration:**
   ```typescript
   // Ensure correct format
   const config = {
     emailUser: "your-email@gmail.com", // Full email address
     emailPass: "abcd efgh ijkl mnop", // 16-character app password
   };
   ```

#### Less Secure Apps Error

**Problem:** "Please log in via your web browser" error.

**Solution:** Use App Passwords instead of account password:

```typescript
// Don't use account password
emailPass: "your-account-password"; // ❌

// Use App Password
emailPass: "your-app-password"; // ✅
```

### Rate Limiting Issues

#### Emails Being Rejected

**Problem:** Provider returns rate limit errors.

**Solutions:**

1. **Reduce rate limits:**

   ```typescript
   const config = {
     rateLimit: {
       maxPerSecond: 0.5, // Send every 2 seconds
       maxPerMinute: 25, // Conservative limit
       maxPerHour: 250,
     },
   };
   ```

2. **Enable queue system:**

   ```typescript
   const config = {
     enableQueue: true,
     rateLimit: { maxPerSecond: 1 },
   };
   ```

3. **Monitor queue stats:**
   ```typescript
   const stats = notifier.getQueueStats();
   console.log(`Queue size: ${stats?.size}`);
   ```

#### Queue Not Processing

**Problem:** Emails stuck in queue.

**Solutions:**

1. **Check queue status:**

   ```typescript
   const stats = notifier.getQueueStats();
   if (stats?.isPaused) {
     notifier.resumeQueue();
   }
   ```

2. **Verify rate limits:**
   ```typescript
   // Ensure rate limits allow processing
   const config = {
     rateLimit: {
       maxPerSecond: 1, // Must be > 0
     },
   };
   ```

### Network and Connectivity

#### Connection Timeout

**Problem:** SMTP connection times out.

**Solutions:**

1. **Check SMTP settings:**

   ```typescript
   const config = {
     smtpHost: "smtp.gmail.com",
     smtpPort: 587, // Try 465 for SSL
     // or custom settings for other providers
   };
   ```

2. **Verify firewall/proxy:**

   - Ensure outbound SMTP ports (587, 465) are open
   - Check corporate firewall settings
   - Test connection outside corporate network

3. **Add retry configuration:**
   ```typescript
   const config = {
     retryOptions: {
       maxRetries: 5,
       retryDelay: 2000,
     },
   };
   ```

#### DNS Resolution Issues

**Problem:** Cannot resolve SMTP host.

**Solutions:**

1. **Test DNS resolution:**

   ```bash
   nslookup smtp.gmail.com
   ```

2. **Use IP address (temporary):**
   ```typescript
   const config = {
     smtpHost: "74.125.200.108", // Gmail SMTP IP
   };
   ```

### Validation Errors

#### Invalid Email Format

**Problem:** Email validation fails.

**Solutions:**

1. **Check email format:**

   ```typescript
   // Valid formats
   const validUsers = [
     { name: "John", email: "john@example.com" },
     { name: "Jane", email: "jane.doe@company.co.uk" },
   ];

   // Invalid formats
   const invalidUsers = [
     { name: "Bad", email: "not-an-email" }, // ❌
     { name: "Empty", email: "" }, // ❌
     { name: "Spaces", email: "test @email.com" }, // ❌
   ];
   ```

2. **Sanitize user data:**
   ```typescript
   function sanitizeUser(user) {
     return {
       name: user.name?.trim() || "Unknown",
       email: user.email?.trim()?.toLowerCase(),
     };
   }
   ```

#### Message Validation Errors

**Problem:** Message content validation fails.

**Solutions:**

1. **Ensure required fields:**

   ```typescript
   const message = {
     subject: "Required subject", // Must be non-empty
     body: "Required body text", // Must be non-empty
   };
   ```

2. **Validate attachments:**
   ```typescript
   const message = {
     subject: "With attachment",
     body: "See attached file",
     attachments: [
       {
         filename: "document.pdf", // Required
         content: fileBuffer, // Required
         contentType: "application/pdf", // Optional but recommended
       },
     ],
   };
   ```

### Provider-Specific Issues

#### Gmail Quota Exceeded

**Problem:** "Daily sending quota exceeded" error.

**Solutions:**

1. **Check Gmail limits:**

   - Free Gmail: 500 emails/day
   - Google Workspace: Higher limits based on plan

2. **Implement quota tracking:**

   ```typescript
   class QuotaTracker {
     private dailyCount = 0;
     private lastReset = new Date().toDateString();

     canSend() {
       const today = new Date().toDateString();
       if (today !== this.lastReset) {
         this.dailyCount = 0;
         this.lastReset = today;
       }
       return this.dailyCount < 500; // Adjust based on your limit
     }

     recordSent() {
       this.dailyCount++;
     }
   }
   ```

#### Message Size Limits

**Problem:** "Message too large" error.

**Solutions:**

1. **Check attachment sizes:**

   ```typescript
   // Gmail limit: 25MB total
   function checkMessageSize(message) {
     let totalSize = Buffer.byteLength(message.body, "utf8");

     message.attachments?.forEach((att) => {
       totalSize += Buffer.isBuffer(att.content)
         ? att.content.length
         : Buffer.byteLength(att.content, "utf8");
     });

     if (totalSize > 25 * 1024 * 1024) {
       // 25MB
       throw new Error("Message exceeds size limit");
     }
   }
   ```

2. **Use cloud storage for large files:**
   ```typescript
   const message = {
     subject: "Large File Available",
     body: "Download your file from: https://example.com/download/file123",
     // Instead of large attachment
   };
   ```

### Environment and Deployment

#### Environment Variables Not Loading

**Problem:** Configuration missing in production.

**Solutions:**

1. **Verify environment setup:**

   ```bash
   # Check if variables are set
   echo $EMAIL_USER
   echo $EMAIL_PASS
   ```

2. **Add validation:**

   ```typescript
   import { validateEnvConfig } from "emaily-fi";

   try {
     validateEnvConfig();
   } catch (error) {
     console.error("Missing env vars:", error.message);
     process.exit(1);
   }
   ```

3. **Use dotenv in development:**
   ```typescript
   if (process.env.NODE_ENV !== "production") {
     require("dotenv").config();
   }
   ```

#### Docker Container Issues

**Problem:** Email service fails in Docker.

**Solutions:**

1. **Pass environment variables:**

   ```dockerfile
   # Dockerfile
   ENV EMAIL_USER=""
   ENV EMAIL_PASS=""
   ```

   ```bash
   # docker run
   docker run -e EMAIL_USER=user@gmail.com -e EMAIL_PASS=password app
   ```

2. **Check network connectivity:**
   ```bash
   # Test SMTP connectivity from container
   docker exec container-name nslookup smtp.gmail.com
   ```

### Performance Issues

#### Slow Email Sending

**Problem:** Emails take too long to send.

**Solutions:**

1. **Enable queue system:**

   ```typescript
   const config = {
     enableQueue: true,
     rateLimit: {
       maxPerSecond: 2, // Increase if provider allows
     },
   };
   ```

2. **Increase concurrency:**

   ```typescript
   import PQueue from "p-queue";

   // Custom queue with higher concurrency
   const queue = new PQueue({
     concurrency: 5, // Process 5 emails simultaneously
     interval: 1000, // Per second
     intervalCap: 5, // Respect rate limits
   });
   ```

#### Memory Usage Issues

**Problem:** High memory usage with large user lists.

**Solutions:**

1. **Process in batches:**

   ```typescript
   async function sendInBatches(users, message, batchSize = 100) {
     for (let i = 0; i < users.length; i += batchSize) {
       const batch = users.slice(i, i + batchSize);
       await notifier.sendToAll(batch, message);

       // Optional: add delay between batches
       await new Promise((resolve) => setTimeout(resolve, 1000));
     }
   }
   ```

2. **Use streaming for large datasets:**

   ```typescript
   // Stream users from database
   const userStream = UserModel.find().cursor();

   for (
     let user = await userStream.next();
     user;
     user = await userStream.next()
   ) {
     await notifier.sendToOne({ name: user.name, email: user.email }, message);
   }
   ```

## Debugging

### Enable Debug Logging

```typescript
const notifier = new EmailNotifier({
  // ... other config
  logger: (message, level) => {
    const timestamp = new Date().toISOString();
    console.log(`[${level.toUpperCase()}] ${timestamp}: ${message}`);
  },
});
```

### Test Email Configuration

```typescript
async function testEmailConfig() {
  try {
    const notifier = new EmailNotifier(config);
    await notifier.initialize();

    const testResult = await notifier.sendToOne(
      { name: "Test", email: "your-test-email@gmail.com" },
      { subject: "Test Email", body: "This is a test." }
    );

    console.log(
      testResult.success ? "✅ Email test passed" : "❌ Email test failed"
    );
    return testResult;
  } catch (error) {
    console.error("❌ Configuration test failed:", error.message);
    throw error;
  }
}
```

### Monitor Email Status

```typescript
function monitorEmailSending(notifier) {
  let sentCount = 0;
  let failedCount = 0;

  const originalSend = notifier.sendToOne.bind(notifier);
  notifier.sendToOne = async (user, message) => {
    const result = await originalSend(user, message);

    if (result.success) {
      sentCount++;
      console.log(`✅ Sent ${sentCount} emails`);
    } else {
      failedCount++;
      console.log(`❌ Failed ${failedCount} emails`);
    }

    return result;
  };
}
```

## Getting Help

If you're still experiencing issues:

1. **Check the GitHub Issues:** Look for similar problems and solutions
2. **Enable verbose logging:** Add detailed logging to identify the issue
3. **Test with minimal configuration:** Strip down to basic config to isolate the problem
4. **Verify provider status:** Check Gmail/provider status pages for outages
5. **Contact support:** Create a detailed issue with logs and configuration (remove sensitive data)

### Creating a Good Bug Report

```typescript
// Include this information in bug reports:
const debugInfo = {
  packageVersion: "1.0.0",
  nodeVersion: process.version,
  platform: process.platform,
  config: {
    provider: config.provider,
    hasRateLimit: !!config.rateLimit,
    hasQueue: !!config.enableQueue,
    hasRetry: !!config.retryOptions,
  },
  error: {
    message: error.message,
    stack: error.stack,
  },
};

console.log("Debug Info:", JSON.stringify(debugInfo, null, 2));
```
