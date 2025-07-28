# Migration Guide

## Upgrading from Previous Versions

### Version 0.x to 1.x

#### Configuration Changes

**Old Format (Deprecated but still supported):**

```typescript
const notifier = new EmailNotifier({
  senderEmail: "user@gmail.com",
  senderPassword: "app-password",
});
```

**New Format (Recommended):**

```typescript
const notifier = new EmailNotifier({
  emailUser: "user@gmail.com",
  emailPass: "app-password",
});
```

#### Environment Variable Changes

**Old Variables (Still supported):**

```bash
SENDER_EMAIL=user@gmail.com
SENDER_PASSWORD=app-password
```

**New Variables (Recommended):**

```bash
EMAIL_USER=user@gmail.com
EMAIL_PASS=app-password
```

#### Breaking Changes

1. **TypeScript Types**: Some internal types have been renamed for clarity
2. **Error Handling**: Error messages are now more descriptive
3. **Validation**: Stricter input validation using Zod schemas

#### Migration Steps

1. **Update Dependencies**

   ```bash
   npm install emaily-fi@latest
   ```

2. **Update Configuration**

   ```typescript
   // Before
   const config = {
     senderEmail: process.env.SENDER_EMAIL,
     senderPassword: process.env.SENDER_PASSWORD,
   };

   // After (recommended)
   import { createValidatedConfigFromEnv } from "emaily-fi";
   const config = createValidatedConfigFromEnv();
   ```

3. **Update Environment Variables**

   ```bash
   # Add new variables (old ones still work)
   EMAIL_USER=$SENDER_EMAIL
   EMAIL_PASS=$SENDER_PASSWORD
   ```

4. **Update Error Handling**
   ```typescript
   // Check for new error properties
   if (!result.success) {
     console.error(`Failed: ${result.error}`);
     // result.error now contains more detailed information
   }
   ```

## Migrating from Other Email Libraries

### From Nodemailer

**Nodemailer:**

```typescript
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: "user@gmail.com",
    pass: "app-password",
  },
});

await transporter.sendMail({
  from: "user@gmail.com",
  to: "recipient@example.com",
  subject: "Hello",
  text: "Hello world",
});
```

**Email-Notify:**

```typescript
import { EmailNotifier } from "emaily-fi";

const notifier = new EmailNotifier({
  emailUser: "user@gmail.com",
  emailPass: "app-password",
});

await notifier.initialize();
await notifier.sendToOne(
  { name: "Recipient", email: "recipient@example.com" },
  { subject: "Hello", body: "Hello world" }
);
```

### From EmailJS

**EmailJS:**

```typescript
import emailjs from "emailjs-com";

emailjs.send("service_id", "template_id", {
  to_email: "recipient@example.com",
  message: "Hello world",
});
```

**Email-Notify:**

```typescript
import { EmailNotifier } from "emaily-fi";

const notifier = new EmailNotifier({
  emailUser: "user@gmail.com",
  emailPass: "app-password",
});

await notifier.sendToOne(
  { name: "Recipient", email: "recipient@example.com" },
  { subject: "Hello", body: "Hello world" }
);
```

### From SendGrid SDK

**SendGrid:**

```typescript
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: "recipient@example.com",
  from: "sender@example.com",
  subject: "Hello",
  text: "Hello world",
});
```

**Email-Notify (when SendGrid provider is available):**

```typescript
import { EmailNotifier } from "emaily-fi";

const notifier = new EmailNotifier({
  provider: "sendgrid", // Coming soon
  apiKey: process.env.SENDGRID_API_KEY,
  emailFrom: "sender@example.com",
});

await notifier.sendToOne(
  { name: "Recipient", email: "recipient@example.com" },
  { subject: "Hello", body: "Hello world" }
);
```

## Common Migration Issues

### 1. Authentication Errors

**Issue**: Existing Gmail credentials don't work

**Solution**:

- Ensure 2FA is enabled
- Generate new App Password
- Use the new 16-character password

### 2. Rate Limiting

**Issue**: Emails being rejected after migration

**Solution**:

```typescript
const notifier = new EmailNotifier({
  emailUser: "user@gmail.com",
  emailPass: "app-password",
  rateLimit: {
    maxPerSecond: 1,
    maxPerMinute: 50,
  },
});
```

### 3. Async/Await

**Issue**: Callback-based code needs updating

**Solution**:

```typescript
// Before (callback style)
sendEmail(options, (error, result) => {
  if (error) {
    console.error(error);
  } else {
    console.log("Email sent");
  }
});

// After (async/await)
try {
  const result = await notifier.sendToOne(user, message);
  if (result.success) {
    console.log("Email sent");
  } else {
    console.error(result.error);
  }
} catch (error) {
  console.error(error);
}
```

### 4. Batch Processing

**Issue**: Need to migrate bulk email code

**Solution**:

```typescript
// Before (manual loop)
for (const user of users) {
  await sendEmail(user);
}

// After (built-in batch processing)
const result = await notifier.sendToAll(users, message);
console.log(`Sent: ${result.totalSent}, Failed: ${result.totalFailed}`);
```

## Testing Migration

### Unit Tests

```typescript
import { EmailNotifier } from "emaily-fi";

describe("Email Migration", () => {
  it("should work with new configuration", async () => {
    const notifier = new EmailNotifier({
      emailUser: "test@gmail.com",
      emailPass: "test-password",
    });

    // Test your migration
    expect(notifier).toBeDefined();
  });

  it("should maintain backward compatibility", async () => {
    const notifier = new EmailNotifier({
      senderEmail: "test@gmail.com",
      senderPassword: "test-password",
    });

    expect(notifier).toBeDefined();
  });
});
```

### Integration Tests

```typescript
describe("Email Integration", () => {
  it("should send emails successfully", async () => {
    const notifier = new EmailNotifier(testConfig);
    await notifier.initialize();

    const result = await notifier.sendToOne(testUser, testMessage);
    expect(result.success).toBe(true);
  });
});
```

## Best Practices for Migration

1. **Gradual Migration**: Migrate one feature at a time
2. **Environment Parity**: Test in staging environment first
3. **Rollback Plan**: Keep old implementation until migration is verified
4. **Monitor**: Watch for errors and performance issues
5. **Documentation**: Update internal documentation

## Support During Migration

If you encounter issues during migration:

1. Check the [Troubleshooting Guide](./TROUBLESHOOTING.md)
2. Review [Examples](./EXAMPLES.md) for common patterns
3. Open an issue on GitHub with migration details
4. Join our community discussions

## Post-Migration Optimization

After successful migration, consider:

1. **Enable Queue System**: For better performance

   ```typescript
   const config = {
     // ... existing config
     enableQueue: true,
   };
   ```

2. **Add Monitoring**: Track email delivery

   ```typescript
   const config = {
     // ... existing config
     logger: (message, level) => {
       // Your monitoring system
       logger.log(level, message);
     },
   };
   ```

3. **Optimize Rate Limits**: Based on your provider
   ```typescript
   const config = {
     // ... existing config
     rateLimit: {
       maxPerSecond: 2, // Increase if provider allows
       maxPerMinute: 100,
       maxPerHour: 1000,
     },
   };
   ```
