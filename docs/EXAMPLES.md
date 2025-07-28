# Real-World Examples

This guide provides comprehensive examples for common use cases of the `emaily-fi` package.

## Quick Start Examples

### Basic Setup

```typescript
import { EmailNotifier } from "emaily-fi";

const notifier = new EmailNotifier({
  emailUser: "your-email@gmail.com",
  emailPass: "your-app-password",
  rateLimit: { maxPerSecond: 1 },
});

await notifier.initialize();

// Send a simple welcome email
const result = await notifier.sendToOne(
  { name: "John Doe", email: "john@example.com" },
  {
    subject: "Welcome!",
    body: "Thanks for joining our service.",
    html: "<h1>Welcome!</h1><p>Thanks for joining our service.</p>",
  }
);

console.log(result.success ? "✅ Email sent!" : `❌ Failed: ${result.error}`);
```

### Environment-Based Configuration

```typescript
// .env file
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
MAX_EMAILS_PER_SECOND=2
MAX_EMAILS_PER_MINUTE=100
ENABLE_QUEUE=true

// main.ts
import { EmailNotifier, createValidatedConfigFromEnv } from "emaily-fi";

const notifier = new EmailNotifier(createValidatedConfigFromEnv());
await notifier.initialize();
```

## Business Use Cases

### User Onboarding System

```typescript
import { EmailNotifier } from "emaily-fi";
import fs from "fs";

class OnboardingService {
  private notifier: EmailNotifier;

  constructor() {
    this.notifier = new EmailNotifier({
      emailUser: process.env.EMAIL_USER!,
      emailPass: process.env.EMAIL_PASS!,
      emailFrom: "Your Company <noreply@yourcompany.com>",
      rateLimit: { maxPerSecond: 2, maxPerMinute: 100 },
      retryOptions: { maxRetries: 3, retryDelay: 2000 },
      enableQueue: true,
      logger: (msg, level) => console.log(`[${level.toUpperCase()}] ${msg}`),
    });
  }

  async sendWelcomeEmail(user: { name: string; email: string; plan: string }) {
    const welcomeTemplate =
      user.plan === "premium"
        ? this.getPremiumWelcomeTemplate(user)
        : this.getStandardWelcomeTemplate(user);

    return await this.notifier.sendToOne(user, {
      subject: `Welcome to ${
        user.plan === "premium" ? "Premium" : "Standard"
      } Plan!`,
      body: welcomeTemplate.text,
      html: welcomeTemplate.html,
      attachments:
        user.plan === "premium"
          ? [
              {
                filename: "premium-guide.pdf",
                content: fs.readFileSync("./templates/premium-guide.pdf"),
                contentType: "application/pdf",
              },
            ]
          : undefined,
    });
  }

  async sendOnboardingSequence(users: User[]) {
    const emails = [
      { delay: 0, template: "welcome" },
      { delay: 24 * 60 * 60 * 1000, template: "getting-started" }, // 1 day
      { delay: 7 * 24 * 60 * 60 * 1000, template: "tips-tricks" }, // 7 days
    ];

    for (const email of emails) {
      setTimeout(async () => {
        await this.notifier.sendToAll(users, this.getTemplate(email.template));
      }, email.delay);
    }
  }

  private getPremiumWelcomeTemplate(user: { name: string }) {
    return {
      text: `Hi ${user.name}, welcome to our Premium plan!`,
      html: `<h1>Welcome ${user.name}!</h1><p>Enjoy premium features!</p>`,
    };
  }

  private getStandardWelcomeTemplate(user: { name: string }) {
    return {
      text: `Hi ${user.name}, welcome to our service!`,
      html: `<h1>Welcome ${user.name}!</h1><p>Let's get started!</p>`,
    };
  }
}
```

### Newsletter System

```typescript
class NewsletterService {
  private notifier: EmailNotifier;

  constructor() {
    this.notifier = new EmailNotifier({
      emailUser: process.env.EMAIL_USER!,
      emailPass: process.env.EMAIL_PASS!,
      enableQueue: true,
      rateLimit: {
        maxPerSecond: 1,
        maxPerMinute: 50,
        maxPerHour: 500,
      },
      logger: this.createLogger(),
    });
  }

  async sendNewsletter(subscribers: User[], newsletter: Newsletter) {
    // Send to premium subscribers first
    const premiumUsers = subscribers.filter((user) => user.isPremium);
    const regularUsers = subscribers.filter((user) => !user.isPremium);

    console.log(`📧 Sending newsletter to ${subscribers.length} subscribers`);

    // Send premium newsletter with additional content
    const premiumResult = await this.notifier.sendToAll(premiumUsers, {
      subject: `[PREMIUM] ${newsletter.subject}`,
      body: newsletter.content + "\n\n" + newsletter.premiumContent,
      html: newsletter.htmlContent + newsletter.premiumHtmlContent,
      attachments: newsletter.premiumAttachments,
    });

    // Send regular newsletter
    const regularResult = await this.notifier.sendToAll(regularUsers, {
      subject: newsletter.subject,
      body: newsletter.content,
      html: newsletter.htmlContent,
    });

    return {
      premium: premiumResult,
      regular: regularResult,
      total: {
        sent: premiumResult.totalSent + regularResult.totalSent,
        failed: premiumResult.totalFailed + regularResult.totalFailed,
      },
    };
  }

  async sendABTestNewsletter(
    subscribers: User[],
    newsletterA: Newsletter,
    newsletterB: Newsletter
  ) {
    const halfSize = Math.floor(subscribers.length / 2);

    const groupA = subscribers.slice(0, halfSize);
    const groupB = subscribers.slice(halfSize);

    console.log(
      `🧪 A/B Testing: Group A (${groupA.length}) vs Group B (${groupB.length})`
    );

    const [resultA, resultB] = await Promise.all([
      this.notifier.sendToAll(groupA, newsletterA),
      this.notifier.sendToAll(groupB, newsletterB),
    ]);

    return {
      groupA: resultA,
      groupB: resultB,
      summary: {
        totalSent: resultA.totalSent + resultB.totalSent,
        totalFailed: resultA.totalFailed + resultB.totalFailed,
      },
    };
  }

  private createLogger() {
    return (message: string, level: string) => {
      const timestamp = new Date().toISOString();
      console.log(`[${level.toUpperCase()}] ${timestamp}: ${message}`);
    };
  }
}

interface Newsletter {
  subject: string;
  content: string;
  htmlContent: string;
  premiumContent?: string;
  premiumHtmlContent?: string;
  premiumAttachments?: Attachment[];
}
```

### E-commerce Order Notifications

```typescript
class OrderNotificationService {
  private notifier: EmailNotifier;

  constructor() {
    this.notifier = new EmailNotifier({
      emailUser: process.env.EMAIL_USER!,
      emailPass: process.env.EMAIL_PASS!,
      emailFrom: "Your Store <orders@yourstore.com>",
      rateLimit: { maxPerSecond: 3 }, // Higher rate for time-sensitive emails
      retryOptions: { maxRetries: 5, retryDelay: 1000 },
    });
  }

  async sendOrderConfirmation(order: Order, customer: User) {
    const invoice = await this.generateInvoice(order);

    return await this.notifier.sendToOne(customer, {
      subject: `Order Confirmation #${order.id}`,
      body: this.getOrderConfirmationText(order, customer),
      html: this.getOrderConfirmationHTML(order, customer),
      attachments: [
        {
          filename: `invoice-${order.id}.pdf`,
          content: invoice,
          contentType: "application/pdf",
        },
      ],
    });
  }

  async sendShippingNotification(
    order: Order,
    customer: User,
    trackingInfo: TrackingInfo
  ) {
    return await this.notifier.sendToOne(customer, {
      subject: `Your order #${order.id} has shipped!`,
      body: `
        Hi ${customer.name},

        Great news! Your order #${order.id} has been shipped.
        
        Tracking Number: ${trackingInfo.trackingNumber}
        Carrier: ${trackingInfo.carrier}
        Estimated Delivery: ${trackingInfo.estimatedDelivery}
        
        Track your package: ${trackingInfo.trackingUrl}
        
        Thanks for your order!
      `,
      html: this.getShippingNotificationHTML(order, customer, trackingInfo),
    });
  }

  async sendAbandonedCartReminder(cartItems: CartItem[], customer: User) {
    return await this.notifier.sendToOne(customer, {
      subject: "You left something in your cart!",
      body: this.getAbandonedCartText(cartItems, customer),
      html: this.getAbandonedCartHTML(cartItems, customer),
    });
  }

  private async generateInvoice(order: Order): Promise<Buffer> {
    // Generate PDF invoice logic here
    return Buffer.from("PDF content");
  }

  private getOrderConfirmationText(order: Order, customer: User): string {
    return `
      Hi ${customer.name},

      Thank you for your order! Here are the details:

      Order #: ${order.id}
      Date: ${order.date}
      Total: $${order.total}

      Items:
      ${order.items
        .map((item) => `- ${item.name} x${item.quantity} - $${item.price}`)
        .join("\n")}

      We'll send you another email when your order ships.
    `;
  }

  private getOrderConfirmationHTML(order: Order, customer: User): string {
    return `
      <div style="font-family: Arial, sans-serif;">
        <h1>Order Confirmation</h1>
        <p>Hi ${customer.name},</p>
        <p>Thank you for your order!</p>
        
        <div style="border: 1px solid #ddd; padding: 20px; margin: 20px 0;">
          <h2>Order Details</h2>
          <p><strong>Order #:</strong> ${order.id}</p>
          <p><strong>Date:</strong> ${order.date}</p>
          <p><strong>Total:</strong> $${order.total}</p>
          
          <h3>Items:</h3>
          <ul>
            ${order.items
              .map(
                (item) => `
              <li>${item.name} x${item.quantity} - $${item.price}</li>
            `
              )
              .join("")}
          </ul>
        </div>
        
        <p>We'll send you another email when your order ships.</p>
      </div>
    `;
  }
}

interface Order {
  id: string;
  date: string;
  total: number;
  items: CartItem[];
}

interface CartItem {
  name: string;
  quantity: number;
  price: number;
}

interface TrackingInfo {
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
  trackingUrl: string;
}
```

## Integration Examples

### Express.js API Integration

```typescript
import express from "express";
import { EmailNotifier, createValidatedConfigFromEnv } from "emaily-fi";
import rateLimit from "express-rate-limit";

const app = express();
const notifier = new EmailNotifier(createValidatedConfigFromEnv());

app.use(express.json());

// Rate limiting for email endpoints
const emailRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many email requests from this IP",
});

// Initialize email service
app.listen(3000, async () => {
  await notifier.initialize();
  console.log("✅ Server started with email service ready");
});

// Send notification to multiple users
app.post("/api/notifications/broadcast", emailRateLimit, async (req, res) => {
  try {
    const { users, message } = req.body;

    if (!users || !Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ error: "Users array is required" });
    }

    const result = await notifier.sendToAll(users, message);

    res.json({
      success: true,
      totalSent: result.totalSent,
      totalFailed: result.totalFailed,
      details: result.results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Send notification to single user
app.post("/api/notifications/single", emailRateLimit, async (req, res) => {
  try {
    const { user, message } = req.body;

    const result = await notifier.sendToOne(user, message);

    if (result.success) {
      res.json({
        success: true,
        messageId: result.messageId,
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Send A/B test emails
app.post("/api/notifications/ab-test", emailRateLimit, async (req, res) => {
  try {
    const { users, messageA, messageB, testPercentage = 50 } = req.body;

    const testSize = Math.floor((users.length * testPercentage) / 100);

    const result = await notifier.sendRandom(users, messageA, testSize);

    res.json({
      success: true,
      testGroup: {
        size: testSize,
        sent: result.totalSent,
        failed: result.totalFailed,
      },
      message: `A/B test sent to ${testPercentage}% of users`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get queue statistics
app.get("/api/notifications/queue-stats", (req, res) => {
  const stats = notifier.getQueueStats();

  if (stats) {
    res.json({
      enabled: true,
      ...stats,
    });
  } else {
    res.json({
      enabled: false,
      message: "Queue is not enabled",
    });
  }
});

// Queue management endpoints
app.post("/api/notifications/queue/pause", (req, res) => {
  notifier.pauseQueue();
  res.json({ success: true, message: "Queue paused" });
});

app.post("/api/notifications/queue/resume", (req, res) => {
  notifier.resumeQueue();
  res.json({ success: true, message: "Queue resumed" });
});
```

### Database Integration with Prisma

```typescript
import { PrismaClient } from "@prisma/client";
import { EmailNotifier } from "emaily-fi";

const prisma = new PrismaClient();

class DatabaseEmailService {
  private notifier: EmailNotifier;

  constructor() {
    this.notifier = new EmailNotifier({
      emailUser: process.env.EMAIL_USER!,
      emailPass: process.env.EMAIL_PASS!,
      enableQueue: true,
      rateLimit: { maxPerSecond: 2, maxPerMinute: 100 },
      logger: (msg, level) => console.log(`[EMAIL-${level}] ${msg}`),
    });
  }

  async initialize() {
    await this.notifier.initialize();
  }

  // Send welcome email to new users
  async sendWelcomeEmailToNewUsers() {
    const newUsers = await prisma.user.findMany({
      where: {
        welcomeEmailSent: false,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    });

    if (newUsers.length === 0) {
      console.log("No new users to send welcome emails to");
      return;
    }

    const emailUsers = newUsers.map((user) => ({
      name: user.name,
      email: user.email,
    }));

    const result = await this.notifier.sendToAll(emailUsers, {
      subject: "Welcome to our platform!",
      body: "Thank you for joining us. Get started with our quick tutorial.",
      html: `
        <h1>Welcome!</h1>
        <p>Thank you for joining us.</p>
        <a href="${process.env.FRONTEND_URL}/tutorial">Get Started</a>
      `,
    });

    // Mark emails as sent
    await prisma.user.updateMany({
      where: {
        id: { in: newUsers.map((u) => u.id) },
      },
      data: {
        welcomeEmailSent: true,
      },
    });

    console.log(
      `✅ Welcome emails sent: ${result.totalSent}/${newUsers.length}`
    );
    return result;
  }

  // Send digest emails to active users
  async sendWeeklyDigest() {
    const activeUsers = await prisma.user.findMany({
      where: {
        emailPreferences: {
          weeklyDigest: true,
        },
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Active in last 30 days
        },
      },
      include: {
        posts: {
          where: {
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last week
            },
          },
          take: 5,
        },
      },
    });

    const emailPromises = activeUsers.map((user) =>
      this.notifier.sendToOne(
        { name: user.name, email: user.email },
        {
          subject: "Your weekly digest",
          body: this.generateDigestText(user),
          html: this.generateDigestHTML(user),
        }
      )
    );

    const results = await Promise.allSettled(emailPromises);
    const successful = results.filter((r) => r.status === "fulfilled").length;

    console.log(
      `📊 Weekly digest sent to ${successful}/${activeUsers.length} users`
    );
  }

  // Send targeted promotions based on user behavior
  async sendTargetedPromotions() {
    // Users who haven't made a purchase recently
    const inactiveCustomers = await prisma.user.findMany({
      where: {
        orders: {
          none: {
            createdAt: {
              gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days
            },
          },
        },
        createdAt: {
          lte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Older than 7 days
        },
      },
      include: {
        orders: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    // Send win-back campaign
    const winBackResult = await this.notifier.sendFiltered(
      inactiveCustomers.map((u) => ({ name: u.name, email: u.email })),
      {
        subject: "We miss you! Here's 20% off your next order",
        body: "Come back and save 20% with code COMEBACK20",
        html: this.getWinBackEmailHTML(),
      },
      (user) => {
        // Only send to users who had at least one order
        const dbUser = inactiveCustomers.find((u) => u.email === user.email);
        return dbUser && dbUser.orders.length > 0;
      }
    );

    console.log(`🎯 Win-back emails sent: ${winBackResult.totalSent}`);
    return winBackResult;
  }

  private generateDigestText(user: any): string {
    return `
      Hi ${user.name},

      Here's your weekly digest:

      Your recent posts:
      ${user.posts.map((post: any) => `- ${post.title}`).join("\n")}

      Thanks for being part of our community!
    `;
  }

  private generateDigestHTML(user: any): string {
    return `
      <div style="font-family: Arial, sans-serif;">
        <h1>Weekly Digest</h1>
        <p>Hi ${user.name},</p>
        
        <h2>Your Recent Posts</h2>
        <ul>
          ${user.posts.map((post: any) => `<li>${post.title}</li>`).join("")}
        </ul>
        
        <p>Thanks for being part of our community!</p>
      </div>
    `;
  }

  private getWinBackEmailHTML(): string {
    return `
      <div style="font-family: Arial, sans-serif; text-align: center;">
        <h1>We Miss You!</h1>
        <p>It's been a while since your last order.</p>
        <div style="background: #f0f0f0; padding: 20px; margin: 20px;">
          <h2>Save 20% on your next order!</h2>
          <p>Use code: <strong>COMEBACK20</strong></p>
        </div>
        <a href="${process.env.FRONTEND_URL}/shop" 
           style="background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px;">
          Shop Now
        </a>
      </div>
    `;
  }
}

// Usage
const emailService = new DatabaseEmailService();

// Run as scheduled jobs
setInterval(async () => {
  await emailService.sendWelcomeEmailToNewUsers();
}, 30 * 60 * 1000); // Every 30 minutes

// Weekly digest (run every Sunday)
setInterval(async () => {
  const now = new Date();
  if (now.getDay() === 0) {
    // Sunday
    await emailService.sendWeeklyDigest();
  }
}, 24 * 60 * 60 * 1000); // Daily check
```

## Advanced Use Cases

### Multi-Tenant SaaS Platform

```typescript
class MultiTenantEmailService {
  private notifiers: Map<string, EmailNotifier> = new Map();

  async getNotifierForTenant(tenantId: string): Promise<EmailNotifier> {
    if (!this.notifiers.has(tenantId)) {
      const tenantConfig = await this.getTenantEmailConfig(tenantId);

      const notifier = new EmailNotifier({
        emailUser: tenantConfig.emailUser,
        emailPass: tenantConfig.emailPass,
        emailFrom: tenantConfig.fromAddress,
        rateLimit: tenantConfig.rateLimit,
        enableQueue: true,
        logger: (msg, level) => console.log(`[${tenantId}] ${msg}`),
      });

      await notifier.initialize();
      this.notifiers.set(tenantId, notifier);
    }

    return this.notifiers.get(tenantId)!;
  }

  async sendTenantNotification(
    tenantId: string,
    users: User[],
    message: MessageInput
  ) {
    const notifier = await this.getNotifierForTenant(tenantId);

    // Add tenant branding to the message
    const brandedMessage = await this.addTenantBranding(tenantId, message);

    return await notifier.sendToAll(users, brandedMessage);
  }

  private async getTenantEmailConfig(tenantId: string) {
    // Fetch tenant-specific email configuration from database
    return {
      emailUser: `noreply@${tenantId}.yoursaas.com`,
      emailPass: process.env[`EMAIL_PASS_${tenantId.toUpperCase()}`],
      fromAddress: `${tenantId} Team <noreply@${tenantId}.yoursaas.com>`,
      rateLimit: { maxPerSecond: 2, maxPerMinute: 100 },
    };
  }

  private async addTenantBranding(tenantId: string, message: MessageInput) {
    const branding = await this.getTenantBranding(tenantId);

    return {
      ...message,
      html: `
        ${branding.headerHTML}
        ${message.html || message.body}
        ${branding.footerHTML}
      `,
    };
  }

  private async getTenantBranding(tenantId: string) {
    // Return tenant-specific branding
    return {
      headerHTML: `<div style="background: #f8f9fa; padding: 20px;"><h1>${tenantId}</h1></div>`,
      footerHTML: `<div style="background: #f8f9fa; padding: 10px; text-align: center;">© ${tenantId}</div>`,
    };
  }
}
```

### Event-Driven Email System

```typescript
import { EventEmitter } from "events";

class EventDrivenEmailService extends EventEmitter {
  private notifier: EmailNotifier;
  private emailTemplates: Map<string, EmailTemplate> = new Map();

  constructor() {
    super();
    this.notifier = new EmailNotifier({
      emailUser: process.env.EMAIL_USER!,
      emailPass: process.env.EMAIL_PASS!,
      enableQueue: true,
      rateLimit: { maxPerSecond: 3, maxPerMinute: 150 },
    });

    this.setupEventHandlers();
    this.loadEmailTemplates();
  }

  private setupEventHandlers() {
    this.on("user.registered", this.handleUserRegistered.bind(this));
    this.on("order.completed", this.handleOrderCompleted.bind(this));
    this.on("payment.failed", this.handlePaymentFailed.bind(this));
    this.on(
      "subscription.expiring",
      this.handleSubscriptionExpiring.bind(this)
    );
  }

  private async handleUserRegistered(userData: { user: User; metadata?: any }) {
    const template = this.emailTemplates.get("user-welcome");
    if (!template) return;

    await this.notifier.sendToOne(userData.user, {
      subject: template.subject,
      body: this.renderTemplate(template.bodyTemplate, userData),
      html: this.renderTemplate(template.htmlTemplate, userData),
    });
  }

  private async handleOrderCompleted(orderData: { user: User; order: Order }) {
    const template = this.emailTemplates.get("order-confirmation");
    if (!template) return;

    await this.notifier.sendToOne(orderData.user, {
      subject: this.renderTemplate(template.subject, orderData),
      body: this.renderTemplate(template.bodyTemplate, orderData),
      html: this.renderTemplate(template.htmlTemplate, orderData),
    });
  }

  private async handlePaymentFailed(paymentData: {
    user: User;
    amount: number;
    reason: string;
  }) {
    const template = this.emailTemplates.get("payment-failed");
    if (!template) return;

    await this.notifier.sendToOne(paymentData.user, {
      subject: template.subject,
      body: this.renderTemplate(template.bodyTemplate, paymentData),
      html: this.renderTemplate(template.htmlTemplate, paymentData),
    });
  }

  private async handleSubscriptionExpiring(subscriptionData: {
    user: User;
    expiryDate: Date;
  }) {
    const template = this.emailTemplates.get("subscription-expiring");
    if (!template) return;

    await this.notifier.sendToOne(subscriptionData.user, {
      subject: template.subject,
      body: this.renderTemplate(template.bodyTemplate, subscriptionData),
      html: this.renderTemplate(template.htmlTemplate, subscriptionData),
    });
  }

  private loadEmailTemplates() {
    this.emailTemplates.set("user-welcome", {
      subject: "Welcome to our platform!",
      bodyTemplate: "Hi {{user.name}}, welcome to our platform!",
      htmlTemplate:
        "<h1>Welcome {{user.name}}!</h1><p>Thanks for joining us.</p>",
    });

    this.emailTemplates.set("order-confirmation", {
      subject: "Order #{{order.id}} confirmed",
      bodyTemplate:
        "Your order #{{order.id}} for ${{order.total}} has been confirmed.",
      htmlTemplate:
        "<h1>Order Confirmed!</h1><p>Order #{{order.id}} - ${{order.total}}</p>",
    });

    // Add more templates...
  }

  private renderTemplate(template: string, data: any): string {
    return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
      const value = this.getNestedValue(data, path.trim());
      return value !== undefined ? String(value) : match;
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  }
}

interface EmailTemplate {
  subject: string;
  bodyTemplate: string;
  htmlTemplate: string;
}

// Usage
const emailService = new EventDrivenEmailService();

// Trigger events from your application
emailService.emit("user.registered", {
  user: { name: "John Doe", email: "john@example.com" },
  metadata: { referrer: "google" },
});

emailService.emit("order.completed", {
  user: { name: "Jane Doe", email: "jane@example.com" },
  order: { id: "ORD-123", total: 99.99 },
});
```

## Testing Examples

### Unit Testing with Jest

```typescript
import { EmailNotifier } from "emaily-fi";
import { jest } from "@jest/globals";

describe("EmailNotifier", () => {
  let notifier: EmailNotifier;
  let mockSendMail: jest.Mock;

  beforeEach(() => {
    // Create test notifier with mock configuration
    notifier = new EmailNotifier({
      emailUser: "test@example.com",
      emailPass: "test-password",
      logger: jest.fn(), // Mock logger
    });

    // Mock the underlying email sending
    mockSendMail = jest.fn().mockResolvedValue({
      messageId: "test-message-id",
    });

    // Mock the provider's sendEmail method
    jest
      .spyOn(notifier as any, "sendSingleEmail")
      .mockImplementation(async (user, message) => ({
        success: true,
        messageId: "test-message-id",
        recipient: user.email,
      }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("sendToOne", () => {
    it("should send email to single user successfully", async () => {
      const user = { name: "Test User", email: "test@example.com" };
      const message = { subject: "Test", body: "Test message" };

      const result = await notifier.sendToOne(user, message);

      expect(result.success).toBe(true);
      expect(result.messageId).toBe("test-message-id");
      expect(result.recipient).toBe(user.email);
    });

    it("should handle invalid email address", () => {
      const user = { name: "Test User", email: "invalid-email" };
      const message = { subject: "Test", body: "Test message" };

      expect(() => notifier.sendToOne(user, message)).rejects.toThrow();
    });
  });

  describe("sendToAll", () => {
    it("should send emails to all users", async () => {
      const users = [
        { name: "User 1", email: "user1@example.com" },
        { name: "User 2", email: "user2@example.com" },
      ];
      const message = { subject: "Test", body: "Test message" };

      const result = await notifier.sendToAll(users, message);

      expect(result.totalSent).toBe(2);
      expect(result.totalFailed).toBe(0);
      expect(result.results).toHaveLength(2);
      expect(result.results.every((r) => r.success)).toBe(true);
    });
  });

  describe("sendFiltered", () => {
    it("should send emails only to filtered users", async () => {
      const users = [
        { name: "Premium User", email: "premium@example.com", isPremium: true },
        {
          name: "Regular User",
          email: "regular@example.com",
          isPremium: false,
        },
      ];
      const message = {
        subject: "Premium Newsletter",
        body: "Premium content",
      };

      const result = await notifier.sendFiltered(
        users,
        message,
        (user: any) => user.isPremium
      );

      expect(result.totalSent).toBe(1);
      expect(result.results[0].recipient).toBe("premium@example.com");
    });
  });
});

// Integration test example
describe("EmailNotifier Integration", () => {
  let notifier: EmailNotifier;

  beforeAll(async () => {
    // Use real configuration for integration tests
    notifier = new EmailNotifier({
      emailUser: process.env.TEST_EMAIL_USER!,
      emailPass: process.env.TEST_EMAIL_PASS!,
      logger: (msg, level) => console.log(`[TEST-${level}] ${msg}`),
    });

    await notifier.initialize();
  });

  it("should send real email in test environment", async () => {
    if (!process.env.RUN_INTEGRATION_TESTS) {
      return; // Skip integration tests unless explicitly enabled
    }

    const result = await notifier.sendToOne(
      { name: "Integration Test", email: process.env.TEST_RECIPIENT_EMAIL! },
      {
        subject: "Integration Test Email",
        body: "This is a test email from integration tests.",
        html: "<h1>Integration Test</h1><p>This is a test email.</p>",
      }
    );

    expect(result.success).toBe(true);
    expect(result.messageId).toBeDefined();
  });
});
```

### Mock Service for Development

```typescript
export class MockEmailNotifier {
  private sentEmails: Array<{
    recipient: string;
    subject: string;
    timestamp: Date;
  }> = [];

  async initialize() {
    console.log("📧 Mock Email Service initialized");
  }

  async sendToOne(user: User, message: MessageInput) {
    this.logEmail(user, message);
    this.sentEmails.push({
      recipient: user.email,
      subject: message.subject,
      timestamp: new Date(),
    });

    return {
      success: true,
      messageId: `mock-${Date.now()}`,
      recipient: user.email,
    };
  }

  async sendToAll(users: User[], message: MessageInput) {
    const results = users.map((user) => {
      this.logEmail(user, message);
      this.sentEmails.push({
        recipient: user.email,
        subject: message.subject,
        timestamp: new Date(),
      });

      return {
        success: true,
        messageId: `mock-${Date.now()}-${user.email}`,
        recipient: user.email,
      };
    });

    return {
      results,
      totalSent: results.length,
      totalFailed: 0,
    };
  }

  getSentEmails() {
    return this.sentEmails;
  }

  clearSentEmails() {
    this.sentEmails = [];
  }

  private logEmail(user: User, message: MessageInput) {
    console.log(`
      📧 MOCK EMAIL SENT
      To: ${user.name} <${user.email}>
      Subject: ${message.subject}
      Body: ${message.body.substring(0, 100)}${
      message.body.length > 100 ? "..." : ""
    }
      ─────────────────────
    `);
  }
}

// Factory function for environment-based service creation
export function createEmailService(): EmailNotifier | MockEmailNotifier {
  if (
    process.env.NODE_ENV === "test" ||
    process.env.USE_MOCK_EMAIL === "true"
  ) {
    return new MockEmailNotifier() as any;
  }

  return new EmailNotifier({
    emailUser: process.env.EMAIL_USER!,
    emailPass: process.env.EMAIL_PASS!,
    enableQueue: process.env.NODE_ENV === "production",
    rateLimit: {
      maxPerSecond: Number(process.env.MAX_EMAILS_PER_SECOND) || 1,
      maxPerMinute: Number(process.env.MAX_EMAILS_PER_MINUTE) || 50,
    },
  });
}
```

These examples demonstrate real-world usage patterns for the `emaily-fi` package across different scenarios, from simple notifications to complex multi-tenant systems. Each example includes error handling, proper configuration, and follows best practices for production use.
