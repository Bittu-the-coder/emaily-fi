import React, { useState } from "react";
import {
  Lightbulb,
  Rocket,
  Users,
  ShoppingCart,
  Bell,
  Code,
} from "lucide-react";
import CodeBlock from "../components/CodeBlock";

const Examples = () => {
  const [activeExample, setActiveExample] = useState("newsletter");

  const examples = [
    { id: "newsletter", name: "Newsletter System", icon: Users },
    { id: "ecommerce", name: "E-commerce Notifications", icon: ShoppingCart },
    { id: "user-auth", name: "User Authentication", icon: Bell },
    { id: "express", name: "Express.js Integration", icon: Code },
    { id: "testing", name: "Testing & Development", icon: Rocket },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center space-x-3 bg-primary bg-opacity-10 px-4 py-2 rounded-full">
          <Lightbulb className="text-white" size={20} />
          <span className="text-white font-medium">Real-World Examples</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
          Example Applications
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Learn from real-world examples and implementation patterns. Copy,
          paste, and customize these code samples for your own projects.
        </p>
      </div>

      {/* Example Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {examples.map((example) => {
          const Icon = example.icon;
          return (
            <button
              key={example.id}
              onClick={() => setActiveExample(example.id)}
              className={`flex flex-col items-center space-y-2 p-4 rounded-lg text-sm font-medium transition-colors ${
                activeExample === example.id
                  ? "bg-primary text-white shadow-button"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <Icon size={20} />
              <span className="text-center">{example.name}</span>
            </button>
          );
        })}
      </div>

      {/* Newsletter System Example */}
      {activeExample === "newsletter" && (
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Newsletter System
          </h2>

          <div className="space-y-6">
            {/* Complete Newsletter Service */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Complete Newsletter Service
              </h3>

              <CodeBlock language="typescript">
                {`import { EmailNotifier, createValidatedConfigFromEnv } from "emaily-fi";

class NewsletterService {
  private notifier: EmailNotifier;

  constructor() {
    this.notifier = new EmailNotifier(createValidatedConfigFromEnv({
      enableQueue: true,
      rateLimit: { 
        maxPerSecond: 1, 
        maxPerMinute: 50,
        maxPerHour: 1000 
      },
      logger: (msg, level) => console.log(\`[Newsletter] [\${level}] \${msg}\`),
    }));
  }

  async initialize() {
    await this.notifier.initialize();
    console.log("Newsletter service initialized");
  }

  async sendWeeklyNewsletter(subscribers: User[], content: NewsletterContent) {
    const message = {
      subject: \`Weekly Newsletter - \${content.title}\`,
      body: this.generatePlainTextNewsletter(content),
      html: this.generateHTMLNewsletter(content),
    };

    console.log(\`Sending newsletter to \${subscribers.length} subscribers...\`);
    
    const result = await this.notifier.sendToAll(subscribers, message);
    
    console.log(\`Newsletter sent! Success: \${result.totalSent}, Failed: \${result.totalFailed}\`);
    
    // Log failed sends for retry
    const failures = result.results.filter(r => !r.success);
    if (failures.length > 0) {
      console.error("Failed recipients:", failures.map(f => f.recipient));
    }
    
    return result;
  }

  async sendTargetedCampaign(
    subscribers: User[], 
    campaign: Campaign, 
    targetFilter: (user: User) => boolean
  ) {
    const message = {
      subject: campaign.subject,
      html: campaign.htmlContent,
      body: campaign.textContent,
    };

    return await this.notifier.sendFiltered(subscribers, message, targetFilter);
  }

  async sendABTest(subscribers: User[], campaignA: Campaign, campaignB: Campaign) {
    const testSize = Math.min(100, Math.floor(subscribers.length * 0.1)); // 10% or max 100
    
    // Send campaign A to random subset
    const resultA = await this.notifier.sendRandom(subscribers, {
      subject: \`[A] \${campaignA.subject}\`,
      html: campaignA.htmlContent,
    }, testSize);

    // Send campaign B to different random subset
    const resultB = await this.notifier.sendRandom(subscribers, {
      subject: \`[B] \${campaignB.subject}\`,
      html: campaignB.htmlContent,
    }, testSize);

    return { campaignA: resultA, campaignB: resultB };
  }

  private generateHTMLNewsletter(content: NewsletterContent): string {
    return \`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>\${content.title}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
          .header { background: #ef8354; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .article { margin-bottom: 30px; }
          .footer { background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>\${content.title}</h1>
          <p>\${content.subtitle}</p>
        </div>
        <div class="content">
          \${content.articles.map(article => \`
            <div class="article">
              <h2>\${article.title}</h2>
              <p>\${article.summary}</p>
              <a href="\${article.url}">Read more →</a>
            </div>
          \`).join('')}
        </div>
        <div class="footer">
          <p>© 2024 Your Company. All rights reserved.</p>
          <p><a href="{{unsubscribe_url}}">Unsubscribe</a></p>
        </div>
      </body>
      </html>
    \`;
  }

  private generatePlainTextNewsletter(content: NewsletterContent): string {
    return \`
\${content.title}
\${content.subtitle}

\${content.articles.map(article => \`
\${article.title}
\${article.summary}
Read more: \${article.url}
\`).join('\\n---\\n')}

© 2024 Your Company. All rights reserved.
Unsubscribe: {{unsubscribe_url}}
    \`.trim();
  }
}

// Types
interface User {
  name: string;
  email: string;
  subscription?: string;
  preferences?: string[];
  joinedAt?: string;
}

interface NewsletterContent {
  title: string;
  subtitle: string;
  articles: Article[];
}

interface Article {
  title: string;
  summary: string;
  url: string;
}

interface Campaign {
  subject: string;
  htmlContent: string;
  textContent: string;
}`}
              </CodeBlock>
            </div>

            {/* Usage Example */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Usage Example
              </h3>

              <CodeBlock language="typescript">
                {`// Usage example
async function main() {
  const newsletter = new NewsletterService();
  await newsletter.initialize();

  const subscribers = [
    { name: "Alice", email: "alice@example.com", subscription: "premium" },
    { name: "Bob", email: "bob@example.com", subscription: "free" },
    { name: "Charlie", email: "charlie@example.com", subscription: "premium" },
  ];

  const weeklyContent = {
    title: "Weekly Tech Update",
    subtitle: "Your dose of the latest tech news",
    articles: [
      {
        title: "New JavaScript Features",
        summary: "Discover the latest ECMAScript proposals...",
        url: "https://example.com/js-features",
      },
      {
        title: "React 19 Released",
        summary: "Major updates to the React ecosystem...",
        url: "https://example.com/react-19",
      },
    ],
  };

  // Send weekly newsletter
  await newsletter.sendWeeklyNewsletter(subscribers, weeklyContent);

  // Send to premium users only
  await newsletter.sendTargetedCampaign(
    subscribers,
    {
      subject: "Premium Feature Update",
      htmlContent: "<h1>Exclusive premium features now available!</h1>",
      textContent: "Exclusive premium features now available!",
    },
    user => user.subscription === "premium"
  );
}

main().catch(console.error);`}
              </CodeBlock>
            </div>
          </div>
        </div>
      )}

      {/* E-commerce Example */}
      {activeExample === "ecommerce" && (
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            E-commerce Notifications
          </h2>

          <div className="space-y-6">
            {/* Order Service */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Order Notification Service
              </h3>

              <CodeBlock language="typescript">
                {`import { EmailNotifier } from "emaily-fi";

class OrderNotificationService {
  private notifier: EmailNotifier;

  constructor() {
    this.notifier = new EmailNotifier({
      emailUser: process.env.EMAIL_USER!,
      emailPass: process.env.EMAIL_PASS!,
      emailFrom: "Your Store <noreply@yourstore.com>",
      rateLimit: { maxPerSecond: 2, maxPerMinute: 100 },
      retryOptions: { maxRetries: 3, retryDelay: 2000 },
    });
  }

  async initialize() {
    await this.notifier.initialize();
  }

  async sendOrderConfirmation(customer: Customer, order: Order) {
    const invoice = await this.generateInvoice(order);
    
    const message = {
      subject: \`Order Confirmation #\${order.id}\`,
      body: this.getOrderConfirmationText(customer, order),
      html: this.getOrderConfirmationHTML(customer, order),
      attachments: [
        {
          filename: \`invoice-\${order.id}.pdf\`,
          content: invoice,
          contentType: "application/pdf",
        },
      ],
    };

    const result = await this.notifier.sendToOne(customer, message);
    
    if (result.success) {
      console.log(\`Order confirmation sent to \${customer.email}\`);
      await this.logEmailSent("order_confirmation", customer.email, order.id);
    } else {
      console.error(\`Failed to send confirmation: \${result.error}\`);
      await this.scheduleRetry("order_confirmation", customer, order);
    }

    return result;
  }

  async sendShippingNotification(customer: Customer, order: Order, tracking: TrackingInfo) {
    const message = {
      subject: \`Your order #\${order.id} has shipped!\`,
      html: \`
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h1>Your Order Has Shipped! 📦</h1>
          
          <p>Hi \${customer.name},</p>
          
          <p>Great news! Your order #\${order.id} has been shipped and is on its way to you.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Tracking Information</h3>
            <p><strong>Carrier:</strong> \${tracking.carrier}</p>
            <p><strong>Tracking Number:</strong> \${tracking.trackingNumber}</p>
            <p><strong>Estimated Delivery:</strong> \${tracking.estimatedDelivery}</p>
            <a href="\${tracking.trackingUrl}" style="background: #ef8354; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Track Your Package
            </a>
          </div>

          <h3>Order Items</h3>
          <ul>
            \${order.items.map(item => \`
              <li>\${item.name} (Qty: \${item.quantity}) - $\${item.price}</li>
            \`).join('')}
          </ul>

          <p><strong>Total: $\${order.total}</strong></p>
          
          <p>Thank you for your business!</p>
        </div>
      \`,
    };

    return await this.notifier.sendToOne(customer, message);
  }

  async sendAbandonedCartReminder(customer: Customer, cart: Cart) {
    // Wait 24 hours after cart abandonment
    setTimeout(async () => {
      const message = {
        subject: "Don't forget your items! 🛒",
        html: \`
          <div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h1>You left something behind!</h1>
            
            <p>Hi \${customer.name},</p>
            
            <p>We noticed you left some great items in your cart. Complete your purchase now!</p>
            
            <div style="border: 1px solid #ddd; padding: 20px; margin: 20px 0;">
              \${cart.items.map(item => \`
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span>\${item.name}</span>
                  <span>$\${item.price}</span>
                </div>
              \`).join('')}
              <hr>
              <div style="display: flex; justify-content: space-between; font-weight: bold;">
                <span>Total:</span>
                <span>$\${cart.total}</span>
              </div>
            </div>
            
            <a href="\${cart.checkoutUrl}" style="background: #ef8354; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Complete Your Purchase
            </a>
            
            <p>Hurry! These items are in high demand.</p>
          </div>
        \`,
      };

      await this.notifier.sendToOne(customer, message);
    }, 24 * 60 * 60 * 1000); // 24 hours
  }

  async sendLowStockAlert(admins: Customer[], product: Product) {
    const message = {
      subject: \`⚠️ Low Stock Alert: \${product.name}\`,
      html: \`
        <div style="font-family: Arial, sans-serif;">
          <h1 style="color: #dc3545;">Low Stock Alert</h1>
          
          <p><strong>Product:</strong> \${product.name}</p>
          <p><strong>SKU:</strong> \${product.sku}</p>
          <p><strong>Current Stock:</strong> \${product.stock} units</p>
          <p><strong>Reorder Level:</strong> \${product.reorderLevel} units</p>
          
          <a href="\${product.adminUrl}" style="background: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Manage Product
          </a>
        </div>
      \`,
    };

    return await this.notifier.sendToAll(admins, message);
  }

  private getOrderConfirmationHTML(customer: Customer, order: Order): string {
    return \`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
          .header { background: #ef8354; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .order-item { border-bottom: 1px solid #eee; padding: 10px 0; }
          .total { font-weight: bold; font-size: 18px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Order Confirmed!</h1>
          <p>Order #\${order.id}</p>
        </div>
        <div class="content">
          <p>Hi \${customer.name},</p>
          <p>Thank you for your order! We're processing it now.</p>
          
          <h3>Order Details</h3>
          \${order.items.map(item => \`
            <div class="order-item">
              <strong>\${item.name}</strong><br>
              Quantity: \${item.quantity} × $\${item.price} = $\${item.quantity * item.price}
            </div>
          \`).join('')}
          
          <div class="total">
            Total: $\${order.total}
          </div>
          
          <p>We'll send you another email when your order ships.</p>
        </div>
      </body>
      </html>
    \`;
  }

  private async generateInvoice(order: Order): Promise<Buffer> {
    // Implementation would generate PDF invoice
    // This is just a placeholder
    return Buffer.from("PDF Invoice Content");
  }

  private async logEmailSent(type: string, email: string, orderId: string) {
    // Log to database or analytics service
    console.log(\`Email logged: \${type} sent to \${email} for order \${orderId}\`);
  }

  private async scheduleRetry(type: string, customer: Customer, order: Order) {
    // Schedule retry logic
    console.log(\`Scheduling retry for \${type} to \${customer.email}\`);
  }
}

// Types
interface Customer {
  name: string;
  email: string;
  id: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  createdAt: Date;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface TrackingInfo {
  carrier: string;
  trackingNumber: string;
  trackingUrl: string;
  estimatedDelivery: string;
}

interface Cart {
  items: CartItem[];
  total: number;
  checkoutUrl: string;
}

interface CartItem {
  name: string;
  price: number;
}

interface Product {
  name: string;
  sku: string;
  stock: number;
  reorderLevel: number;
  adminUrl: string;
}`}
              </CodeBlock>
            </div>
          </div>
        </div>
      )}

      {/* User Authentication Example */}
      {activeExample === "user-auth" && (
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            User Authentication Emails
          </h2>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Authentication Service
              </h3>

              <CodeBlock language="typescript">
                {`import { EmailNotifier } from "emaily-fi";
import crypto from "crypto";

class AuthEmailService {
  private notifier: EmailNotifier;
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.notifier = new EmailNotifier({
      emailUser: process.env.EMAIL_USER!,
      emailPass: process.env.EMAIL_PASS!,
      emailFrom: "Your App <noreply@yourapp.com>",
      rateLimit: { maxPerSecond: 3, maxPerMinute: 100 },
    });
  }

  async initialize() {
    await this.notifier.initialize();
  }

  async sendWelcomeEmail(user: User) {
    const message = {
      subject: \`Welcome to \${process.env.APP_NAME}! 🎉\`,
      html: \`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ef8354, #f4a261); color: white; padding: 40px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to Our Platform!</h1>
            <p style="margin: 10px 0 0; font-size: 16px;">We're excited to have you on board</p>
          </div>
          
          <div style="padding: 30px 20px;">
            <p>Hi \${user.name},</p>
            
            <p>Welcome to our community! Your account has been successfully created.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Getting Started</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Complete your profile</li>
                <li>Explore our features</li>
                <li>Join our community forums</li>
                <li>Check out our tutorials</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="\${this.baseUrl}/dashboard" 
                 style="background: #ef8354; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Get Started
              </a>
            </div>
            
            <p>If you have any questions, feel free to reply to this email or contact our support team.</p>
            
            <p>Best regards,<br>The Team</p>
          </div>
        </div>
      \`,
    };

    return await this.notifier.sendToOne(user, message);
  }

  async sendEmailVerification(user: User, token: string) {
    const verificationUrl = \`\${this.baseUrl}/verify-email?token=\${token}\`;
    
    const message = {
      subject: "Please verify your email address",
      html: \`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Verify Your Email Address</h1>
          
          <p>Hi \${user.name},</p>
          
          <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="\${verificationUrl}" 
               style="background: #ef8354; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">\${verificationUrl}</p>
          
          <p><strong>This link will expire in 24 hours.</strong></p>
          
          <p>If you didn't create an account, you can safely ignore this email.</p>
        </div>
      \`,
    };

    return await this.notifier.sendToOne(user, message);
  }

  async sendPasswordReset(user: User, resetToken: string) {
    const resetUrl = \`\${this.baseUrl}/reset-password?token=\${resetToken}\`;
    
    const message = {
      subject: "Reset your password",
      html: \`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Reset Your Password</h1>
          
          <p>Hi \${user.name},</p>
          
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="\${resetUrl}" 
               style="background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">\${resetUrl}</p>
          
          <p><strong>This link will expire in 1 hour.</strong></p>
          
          <p>If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.</p>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <strong>Security Tip:</strong> Never share your password or reset links with anyone.
          </div>
        </div>
      \`,
    };

    return await this.notifier.sendToOne(user, message);
  }

  async sendPasswordChangeConfirmation(user: User) {
    const message = {
      subject: "Your password has been changed",
      html: \`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Password Changed Successfully</h1>
          
          <p>Hi \${user.name},</p>
          
          <p>This is to confirm that your account password has been changed successfully.</p>
          
          <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <strong>✅ Password Changed:</strong> \${new Date().toLocaleString()}
          </div>
          
          <p>If you didn't make this change, please contact our support team immediately:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:support@yourapp.com" 
               style="background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Contact Support
            </a>
          </div>
          
          <p>For your security, we recommend:</p>
          <ul>
            <li>Using a strong, unique password</li>
            <li>Enabling two-factor authentication</li>
            <li>Regularly reviewing your account activity</li>
          </ul>
        </div>
      \`,
    };

    return await this.notifier.sendToOne(user, message);
  }

  async sendLoginAlert(user: User, loginInfo: LoginInfo) {
    const message = {
      subject: "New login to your account",
      html: \`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>New Login Detected</h1>
          
          <p>Hi \${user.name},</p>
          
          <p>We detected a new login to your account:</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Time:</strong> \${loginInfo.timestamp}</p>
            <p><strong>IP Address:</strong> \${loginInfo.ipAddress}</p>
            <p><strong>Location:</strong> \${loginInfo.location}</p>
            <p><strong>Device:</strong> \${loginInfo.userAgent}</p>
          </div>
          
          <p>If this was you, no action is needed.</p>
          
          <p>If you don't recognize this login, please secure your account immediately:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="\${this.baseUrl}/security" 
               style="background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Secure My Account
            </a>
          </div>
        </div>
      \`,
    };

    return await this.notifier.sendToOne(user, message);
  }

  generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}

// Types
interface User {
  name: string;
  email: string;
  id: string;
}

interface LoginInfo {
  timestamp: string;
  ipAddress: string;
  location: string;
  userAgent: string;
}`}
              </CodeBlock>
            </div>
          </div>
        </div>
      )}

      {/* Express.js Integration Example */}
      {activeExample === "express" && (
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Express.js Integration
          </h2>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Express Server with Email Integration
              </h3>

              <CodeBlock language="typescript">
                {`import express from "express";
import { EmailNotifier, createValidatedConfigFromEnv } from "emaily-fi";
import rateLimit from "express-rate-limit";

const app = express();
app.use(express.json());

// Initialize email service
const emailService = new EmailNotifier(createValidatedConfigFromEnv());
await emailService.initialize();

// Rate limiting for email endpoints
const emailRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 email requests per windowMs
  message: "Too many email requests, please try again later.",
});

// Contact form endpoint
app.post("/api/contact", emailRateLimit, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate input
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        error: "All fields are required" 
      });
    }

    // Send email to admin
    const adminResult = await emailService.sendToOne(
      { name: "Admin", email: "admin@yoursite.com" },
      {
        subject: \`Contact Form: \${subject}\`,
        html: \`
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> \${name} (\${email})</p>
          <p><strong>Subject:</strong> \${subject}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
            \${message.replace(/\\n/g, '<br>')}
          </div>
          <p><em>Sent at: \${new Date().toISOString()}</em></p>
        \`,
        replyTo: email,
      }
    );

    // Send confirmation to user
    const userResult = await emailService.sendToOne(
      { name, email },
      {
        subject: "Thank you for contacting us",
        html: \`
          <h2>Thank you for your message!</h2>
          <p>Hi \${name},</p>
          <p>We've received your message and will get back to you soon.</p>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Your message:</strong></p>
            <p>\${message.replace(/\\n/g, '<br>')}</p>
          </div>
          <p>Best regards,<br>Our Team</p>
        \`,
      }
    );

    if (adminResult.success && userResult.success) {
      res.json({ 
        success: true, 
        message: "Message sent successfully" 
      });
    } else {
      throw new Error("Failed to send one or more emails");
    }
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ 
      error: "Failed to send message" 
    });
  }
});

// Newsletter subscription endpoint
app.post("/api/newsletter/subscribe", emailRateLimit, async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Save to database (pseudo-code)
    // await db.subscribers.create({ email, name, subscribedAt: new Date() });

    // Send welcome email
    const result = await emailService.sendToOne(
      { name: name || "Subscriber", email },
      {
        subject: "Welcome to our newsletter! 📧",
        html: \`
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Welcome to Our Newsletter!</h1>
            <p>Hi \${name || 'there'},</p>
            <p>Thank you for subscribing to our newsletter. You'll receive our latest updates, news, and exclusive content.</p>
            <div style="background: #ef8354; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h2>🎉 You're All Set!</h2>
              <p>Get ready for amazing content delivered to your inbox.</p>
            </div>
            <p>You can unsubscribe at any time by clicking the unsubscribe link in our emails.</p>
          </div>
        \`,
      }
    );

    if (result.success) {
      res.json({ 
        success: true, 
        message: "Successfully subscribed to newsletter" 
      });
    } else {
      throw new Error("Failed to send welcome email");
    }
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    res.status(500).json({ 
      error: "Failed to subscribe to newsletter" 
    });
  }
});

// Admin endpoint to send bulk emails
app.post("/api/admin/send-newsletter", 
  authenticateAdmin, // Your admin authentication middleware
  async (req, res) => {
    try {
      const { subject, content, recipients } = req.body;

      // Get subscribers from database
      const subscribers = recipients || await getNewsletterSubscribers();

      const result = await emailService.sendToAll(subscribers, {
        subject,
        html: content,
      });

      res.json({
        success: true,
        totalSent: result.totalSent,
        totalFailed: result.totalFailed,
        details: result.results,
      });
    } catch (error) {
      console.error("Bulk email error:", error);
      res.status(500).json({ 
        error: "Failed to send newsletter" 
      });
    }
  }
);

// Get email queue status
app.get("/api/admin/email-status", authenticateAdmin, (req, res) => {
  const stats = emailService.getQueueStats();
  res.json({
    queueSize: stats?.size || 0,
    pending: stats?.pending || 0,
    isPaused: emailService.isQueuePaused?.() || false,
  });
});

// Webhook endpoint for email status updates (if using external provider)
app.post("/api/webhooks/email-status", async (req, res) => {
  try {
    const { messageId, status, email } = req.body;
    
    // Log email status to database
    console.log(\`Email \${messageId} to \${email}: \${status}\`);
    
    // Update analytics or trigger follow-up actions
    if (status === "delivered") {
      // Email delivered successfully
    } else if (status === "bounced") {
      // Handle bounced email
      await handleBouncedEmail(email);
    }
    
    res.status(200).send("OK");
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).send("Error");
  }
});

// Middleware functions
function authenticateAdmin(req: any, res: any, next: any) {
  // Your admin authentication logic
  const token = req.headers.authorization;
  if (!token || !isValidAdminToken(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

async function getNewsletterSubscribers() {
  // Fetch from your database
  return [
    { name: "John", email: "john@example.com" },
    { name: "Jane", email: "jane@example.com" },
  ];
}

async function handleBouncedEmail(email: string) {
  // Remove from mailing list or mark as bounced
  console.log(\`Handling bounced email: \${email}\`);
}

function isValidAdminToken(token: string): boolean {
  // Your token validation logic
  return token === "your-admin-token";
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`}
              </CodeBlock>
            </div>
          </div>
        </div>
      )}

      {/* Testing Example */}
      {activeExample === "testing" && (
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Testing & Development
          </h2>

          <div className="space-y-6">
            {/* Mock Service */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Mock Email Service for Testing
              </h3>

              <CodeBlock language="typescript">
                {`import { EmailNotifier } from "emaily-fi";

// Mock email service for testing
class MockEmailService {
  private emailNotifier?: EmailNotifier;
  private sentEmails: MockEmail[] = [];
  private shouldFail: boolean = false;

  constructor(useRealEmail: boolean = false) {
    if (useRealEmail) {
      this.emailNotifier = new EmailNotifier({
        emailUser: process.env.EMAIL_USER!,
        emailPass: process.env.EMAIL_PASS!,
        logger: this.logger.bind(this),
      });
    }
  }

  async initialize() {
    if (this.emailNotifier) {
      await this.emailNotifier.initialize();
    }
  }

  async sendToOne(user: any, message: any) {
    if (this.emailNotifier) {
      // Use real email service
      return await this.emailNotifier.sendToOne(user, message);
    }

    // Mock implementation
    const mockEmail: MockEmail = {
      to: user.email,
      toName: user.name,
      subject: message.subject,
      body: message.body,
      html: message.html,
      sentAt: new Date(),
      success: !this.shouldFail,
    };

    this.sentEmails.push(mockEmail);

    console.log(\`📧 [MOCK] Email sent to \${user.email}: \${message.subject}\`);

    return {
      success: !this.shouldFail,
      messageId: \`mock-\${Date.now()}\`,
      error: this.shouldFail ? "Mock failure" : undefined,
      recipient: user.email,
      timestamp: new Date(),
    };
  }

  async sendToAll(users: any[], message: any) {
    const results = [];
    let totalSent = 0;
    let totalFailed = 0;

    for (const user of users) {
      const result = await this.sendToOne(user, message);
      results.push(result);
      
      if (result.success) {
        totalSent++;
      } else {
        totalFailed++;
      }
    }

    return {
      totalSent,
      totalFailed,
      results,
      duration: 100, // Mock duration
    };
  }

  // Test utilities
  getSentEmails(): MockEmail[] {
    return [...this.sentEmails];
  }

  getLastEmail(): MockEmail | undefined {
    return this.sentEmails[this.sentEmails.length - 1];
  }

  getEmailsTo(email: string): MockEmail[] {
    return this.sentEmails.filter(e => e.to === email);
  }

  clearSentEmails(): void {
    this.sentEmails = [];
  }

  setFailMode(shouldFail: boolean): void {
    this.shouldFail = shouldFail;
  }

  getEmailCount(): number {
    return this.sentEmails.length;
  }

  private logger(message: string, level: string) {
    console.log(\`[MockEmail] [\${level}] \${message}\`);
  }
}

interface MockEmail {
  to: string;
  toName: string;
  subject: string;
  body?: string;
  html?: string;
  sentAt: Date;
  success: boolean;
}

// Test utilities
export function createEmailServiceForEnv(): MockEmailService | EmailNotifier {
  if (process.env.NODE_ENV === "test") {
    return new MockEmailService(false);
  } else if (process.env.NODE_ENV === "development") {
    return new MockEmailService(true); // Use real emails in dev
  } else {
    return new EmailNotifier({
      emailUser: process.env.EMAIL_USER!,
      emailPass: process.env.EMAIL_PASS!,
      enableQueue: true,
      rateLimit: {
        maxPerSecond: Number(process.env.MAX_EMAILS_PER_SECOND) || 1,
        maxPerMinute: Number(process.env.MAX_EMAILS_PER_MINUTE) || 50,
      },
    });
  }
}`}
              </CodeBlock>
            </div>

            {/* Jest Tests */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Jest Testing Examples
              </h3>

              <CodeBlock language="typescript">
                {`import { MockEmailService } from "./MockEmailService";

describe("Email Service Tests", () => {
  let emailService: MockEmailService;

  beforeEach(() => {
    emailService = new MockEmailService();
    emailService.clearSentEmails();
  });

  describe("Single Email Sending", () => {
    it("should send email to single user", async () => {
      const user = { name: "Test User", email: "test@example.com" };
      const message = { 
        subject: "Test Email", 
        body: "This is a test" 
      };

      const result = await emailService.sendToOne(user, message);

      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
      expect(result.recipient).toBe(user.email);
      
      const sentEmails = emailService.getSentEmails();
      expect(sentEmails).toHaveLength(1);
      expect(sentEmails[0].to).toBe(user.email);
      expect(sentEmails[0].subject).toBe(message.subject);
    });

    it("should handle email sending failure", async () => {
      emailService.setFailMode(true);
      
      const user = { name: "Test User", email: "test@example.com" };
      const message = { subject: "Test Email", body: "This is a test" };

      const result = await emailService.sendToOne(user, message);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("Bulk Email Sending", () => {
    it("should send emails to multiple users", async () => {
      const users = [
        { name: "User 1", email: "user1@example.com" },
        { name: "User 2", email: "user2@example.com" },
        { name: "User 3", email: "user3@example.com" },
      ];
      const message = { subject: "Bulk Test", body: "Bulk message" };

      const result = await emailService.sendToAll(users, message);

      expect(result.totalSent).toBe(3);
      expect(result.totalFailed).toBe(0);
      expect(result.results).toHaveLength(3);
      
      const sentEmails = emailService.getSentEmails();
      expect(sentEmails).toHaveLength(3);
    });

    it("should handle partial failures in bulk sending", async () => {
      // Simulate intermittent failures
      let callCount = 0;
      const originalSendToOne = emailService.sendToOne;
      emailService.sendToOne = async (user, message) => {
        callCount++;
        emailService.setFailMode(callCount === 2); // Fail second email
        return originalSendToOne.call(emailService, user, message);
      };

      const users = [
        { name: "User 1", email: "user1@example.com" },
        { name: "User 2", email: "user2@example.com" },
        { name: "User 3", email: "user3@example.com" },
      ];
      const message = { subject: "Test", body: "Test" };

      const result = await emailService.sendToAll(users, message);

      expect(result.totalSent).toBe(2);
      expect(result.totalFailed).toBe(1);
      expect(result.results.filter(r => !r.success)).toHaveLength(1);
    });
  });

  describe("Email Content Validation", () => {
    it("should correctly format email content", async () => {
      const user = { name: "John Doe", email: "john@example.com" };
      const message = {
        subject: "Welcome!",
        body: "Plain text content",
        html: "<h1>HTML content</h1>",
      };

      await emailService.sendToOne(user, message);

      const lastEmail = emailService.getLastEmail();
      expect(lastEmail?.subject).toBe("Welcome!");
      expect(lastEmail?.body).toBe("Plain text content");
      expect(lastEmail?.html).toBe("<h1>HTML content</h1>");
      expect(lastEmail?.toName).toBe("John Doe");
    });
  });

  describe("Test Utilities", () => {
    it("should track emails sent to specific recipients", async () => {
      const users = [
        { name: "Alice", email: "alice@example.com" },
        { name: "Bob", email: "bob@example.com" },
        { name: "Alice", email: "alice@example.com" }, // Duplicate
      ];

      for (const user of users) {
        await emailService.sendToOne(user, { 
          subject: "Test", 
          body: "Test" 
        });
      }

      const aliceEmails = emailService.getEmailsTo("alice@example.com");
      const bobEmails = emailService.getEmailsTo("bob@example.com");

      expect(aliceEmails).toHaveLength(2);
      expect(bobEmails).toHaveLength(1);
      expect(emailService.getEmailCount()).toBe(3);
    });

    it("should clear sent emails", async () => {
      await emailService.sendToOne(
        { name: "Test", email: "test@example.com" },
        { subject: "Test", body: "Test" }
      );

      expect(emailService.getEmailCount()).toBe(1);

      emailService.clearSentEmails();

      expect(emailService.getEmailCount()).toBe(0);
      expect(emailService.getSentEmails()).toHaveLength(0);
    });
  });
});

// Integration test example
describe("Email Service Integration", () => {
  let emailService: EmailNotifier;

  beforeAll(async () => {
    if (process.env.RUN_INTEGRATION_TESTS === "true") {
      emailService = new EmailNotifier({
        emailUser: process.env.TEST_EMAIL_USER!,
        emailPass: process.env.TEST_EMAIL_PASS!,
        logger: (msg) => console.log(\`[TEST] \${msg}\`),
      });
      await emailService.initialize();
    }
  });

  it("should send real email in integration test", async () => {
    if (process.env.RUN_INTEGRATION_TESTS !== "true") {
      console.log("Skipping integration test");
      return;
    }

    const result = await emailService.sendToOne(
      { 
        name: "Integration Test", 
        email: process.env.TEST_RECIPIENT_EMAIL! 
      },
      {
        subject: "Integration Test Email",
        body: "This is an integration test email",
        html: "<p>This is an <strong>integration test</strong> email</p>",
      }
    );

    expect(result.success).toBe(true);
    expect(result.messageId).toBeDefined();
  }, 30000); // 30 second timeout for real email sending
});`}
              </CodeBlock>
            </div>

            {/* Environment Configuration */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Environment-Based Configuration
              </h3>

              <CodeBlock language="bash">
                {`# .env.test
NODE_ENV=test
# No email credentials needed for mocked tests

# .env.development  
NODE_ENV=development
EMAIL_USER=dev@yourcompany.com
EMAIL_PASS=dev-app-password
MAX_EMAILS_PER_SECOND=1

# .env.integration
NODE_ENV=integration
RUN_INTEGRATION_TESTS=true
TEST_EMAIL_USER=test@yourcompany.com
TEST_EMAIL_PASS=test-app-password
TEST_RECIPIENT_EMAIL=test-recipient@yourcompany.com

# .env.production
NODE_ENV=production
EMAIL_USER=noreply@yourcompany.com
EMAIL_PASS=production-app-password
MAX_EMAILS_PER_SECOND=3
MAX_EMAILS_PER_MINUTE=150
ENABLE_QUEUE=true`}
              </CodeBlock>
            </div>
          </div>
        </div>
      )}

      {/* Best Practices */}
      <div className="bg-primary bg-opacity-5 dark:bg-primary dark:bg-opacity-10 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          💡 Best Practices
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              🔒 Security
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
              <li>• Use environment variables for credentials</li>
              <li>• Implement rate limiting on email endpoints</li>
              <li>• Validate and sanitize all input</li>
              <li>• Use app passwords instead of regular passwords</li>
            </ul>

            <h3 className="font-semibold text-gray-900 dark:text-white">
              ⚡ Performance
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
              <li>• Enable queue for bulk operations</li>
              <li>• Set appropriate rate limits</li>
              <li>• Use connection pooling</li>
              <li>• Monitor email sending metrics</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              🧪 Testing
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
              <li>• Use mock services in tests</li>
              <li>• Test both success and failure scenarios</li>
              <li>• Validate email content and formatting</li>
              <li>• Use separate test email accounts</li>
            </ul>

            <h3 className="font-semibold text-gray-900 dark:text-white">
              📊 Monitoring
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
              <li>• Log all email attempts and results</li>
              <li>• Track bounce rates and failures</li>
              <li>• Monitor queue performance</li>
              <li>• Set up alerts for high failure rates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Examples;
