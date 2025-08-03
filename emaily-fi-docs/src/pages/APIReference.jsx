import React, { useState } from "react";
import {
  Code,
  BookOpen,
  Zap,
  Database,
  Settings,
  AlertCircle,
} from "lucide-react";
import CodeBlock from "../components/CodeBlock";

const APIReference = () => {
  const [activeSection, setActiveSection] = useState("emailnotifier");

  const apiSections = [
    { id: "emailnotifier", name: "EmailNotifier", icon: Code },
    { id: "send-methods", name: "Send Methods", icon: Zap },
    { id: "types", name: "Types & Interfaces", icon: Database },
    { id: "utilities", name: "Utility Functions", icon: Settings },
    { id: "errors", name: "Error Handling", icon: AlertCircle },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center space-x-3 bg-primary bg-opacity-10 px-4 py-2 rounded-full">
          <BookOpen className="text-white" size={20} />
          <span className="text-white font-medium">API Reference</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white">
          API Documentation
        </h1>

        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Complete reference for all emaily-fi classes, methods, and types.
          Everything you need to integrate email notifications into your
          application.
        </p>
      </div>

      {/* API Navigation */}
      <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
        {apiSections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? "bg-gray-700 text-white shadow-sm"
                  : "text-gray-400 hover:hover:text-gray-200"
              }`}
            >
              <Icon size={16} />
              <span>{section.name}</span>
            </button>
          );
        })}
      </div>

      {/* EmailNotifier Section */}
      {activeSection === "emailnotifier" && (
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-white">EmailNotifier Class</h2>

          {/* Constructor */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">
              Constructor
            </h3>

            <CodeBlock language="typescript">
              {`class EmailNotifier {
  constructor(config: Config)
}

interface Config {
  // Common Settings
  emailUser: string;
  emailFrom?: string;
  
  // Provider Selection
  provider?: "gmail" | "gmail-oauth2" | "sendgrid";
  
  // Gmail SMTP (Traditional)
  emailPass?: string;
  
  // Gmail OAuth2
  gmailOAuth2?: {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
  };
  
  // SendGrid
  sendGridApiKey?: string;
  
  // SMTP Configuration (Optional)
  smtpHost?: string;
  smtpPort?: number;
  smtpSecure?: boolean;
  
  // Advanced Options
  rateLimit?: RateLimit;
  retryOptions?: RetryOptions;
  enableQueue?: boolean;
  logger?: (message: string, level: LogLevel) => void;
}

interface RateLimit {
  maxPerSecond?: number;
  maxPerMinute?: number;
  maxPerHour?: number;
}

interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
}`}
            </CodeBlock>

            <div className="mt-4 p-4 bg-gray-700 border border-gray-600 rounded-lg">
              <h4 className="font-semibold text-white mb-3">
                Configuration Examples
              </h4>

              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-200 mb-2">
                    Gmail OAuth2 (Recommended)
                  </h5>
                  <CodeBlock language="typescript">
                    {`const notifier = new EmailNotifier({
  provider: "gmail-oauth2",
  emailUser: "your-email@gmail.com",
  emailFrom: "Your Name <your-email@gmail.com>",
  gmailOAuth2: {
    clientId: process.env.GMAIL_OAUTH2_CLIENT_ID!,
    clientSecret: process.env.GMAIL_OAUTH2_CLIENT_SECRET!,
    refreshToken: process.env.GMAIL_OAUTH2_REFRESH_TOKEN!,
  },
  rateLimit: { maxPerSecond: 5, maxPerMinute: 100 },
});`}
                  </CodeBlock>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-200 mb-2">
                    SendGrid
                  </h5>
                  <CodeBlock language="typescript">
                    {`const notifier = new EmailNotifier({
  provider: "sendgrid",
  sendGridApiKey: process.env.SENDGRID_API_KEY!,
  emailFrom: "verified-sender@yourdomain.com",
  rateLimit: { maxPerSecond: 10, maxPerMinute: 600 },
});`}
                  </CodeBlock>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-200 mb-2">
                    Gmail SMTP (Traditional)
                  </h5>
                  <CodeBlock language="typescript">
                    {`const notifier = new EmailNotifier({
  provider: "gmail", // or omit for default
  emailUser: "your-email@gmail.com",
  emailPass: process.env.GMAIL_APP_PASSWORD!,
  emailFrom: "Your Name <your-email@gmail.com>",
  rateLimit: { maxPerSecond: 1, maxPerMinute: 50 },
});`}
                  </CodeBlock>
                </div>
              </div>
            </div>
          </div>

          {/* Initialize Method */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">
              initialize()
            </h3>

            <p className="text-gray-300 mb-4">
              Initializes the email service and establishes SMTP connection.
            </p>

            <CodeBlock language="typescript">
              {`async initialize(): Promise<void>`}
            </CodeBlock>

            <div className="mt-4 p-4 bg-yellow-900  border border-yellow-800 rounded-lg">
              <h4 className="font-semibold text-yellow-200 mb-2">Important</h4>
              <p className="text-yellow-300">
                Must be called before sending any emails. This method verifies
                the connection and configuration.
              </p>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold text-white mb-2">Example</h4>
              <CodeBlock language="typescript">
                {`const notifier = new EmailNotifier(config);
await notifier.initialize();

// Now ready to send emails
const result = await notifier.sendToOne(user, message);`}
              </CodeBlock>
            </div>
          </div>
        </div>
      )}

      {/* Send Methods Section */}
      {activeSection === "send-methods" && (
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-white">Send Methods</h2>

          {/* sendToOne */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">
              sendToOne()
            </h3>

            <p className="text-gray-300 mb-4">
              Sends an email to a single recipient.
            </p>

            <CodeBlock language="typescript">
              {`async sendToOne(
  user: User,
  message: MessageInput
): Promise<SendResult>`}
            </CodeBlock>

            <div className="mt-4">
              <h4 className="font-semibold text-white mb-2">Parameters</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <code className="text-white">user</code> - Recipient user
                  object with name and email
                </li>
                <li>
                  <code className="text-white">message</code> - Message content
                  with subject, body, and optional HTML
                </li>
              </ul>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold text-white mb-2">Example</h4>
              <CodeBlock language="typescript">
                {`const result = await notifier.sendToOne(
  { name: "Alice", email: "alice@example.com" },
  {
    subject: "Welcome!",
    body: "Thank you for joining us.",
    html: "<h1>Welcome!</h1><p>Thank you for joining us.</p>",
  }
);

if (result.success) {
  console.log("Email sent successfully!", result.messageId);
} else {
  console.error("Failed to send:", result.error);
}`}
              </CodeBlock>
            </div>
          </div>

          {/* sendToAll */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">
              sendToAll()
            </h3>

            <p className="text-gray-300 mb-4">
              Sends the same email to multiple recipients with rate limiting and
              retry logic.
            </p>

            <CodeBlock language="typescript">
              {`async sendToAll(
  users: User[],
  message: MessageInput
): Promise<BatchSendResult>`}
            </CodeBlock>

            <div className="mt-4">
              <h4 className="font-semibold text-white mb-2">Example</h4>
              <CodeBlock language="typescript">
                {`const users = [
  { name: "Alice", email: "alice@example.com" },
  { name: "Bob", email: "bob@example.com" },
  { name: "Charlie", email: "charlie@example.com" },
];

const result = await notifier.sendToAll(users, {
  subject: "Newsletter",
  body: "Check out our latest updates!",
});

console.log(\`Sent: \${result.totalSent}, Failed: \${result.totalFailed}\`);

// Check individual results
result.results.forEach((r) => {
  if (!r.success) {
    console.error(\`Failed to send to \${r.recipient}: \${r.error}\`);
  }
});`}
              </CodeBlock>
            </div>
          </div>

          {/* sendRandom */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">
              sendRandom()
            </h3>

            <p className="text-gray-300 mb-4">
              Sends emails to a random subset of users. Perfect for A/B testing
              and sampling.
            </p>

            <CodeBlock language="typescript">
              {`async sendRandom(
  users: User[],
  message: MessageInput,
  count: number
): Promise<BatchSendResult>`}
            </CodeBlock>

            <div className="mt-4">
              <h4 className="font-semibold text-white mb-2">Example</h4>
              <CodeBlock language="typescript">
                {`// Send to 10 random users for A/B testing
const result = await notifier.sendRandom(allUsers, testMessage, 10);

console.log(\`Test email sent to \${result.totalSent} random users\`);`}
              </CodeBlock>
            </div>
          </div>

          {/* sendFiltered */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">
              sendFiltered()
            </h3>

            <p className="text-gray-300 mb-4">
              Sends emails to users that match a custom filter function. Great
              for targeted campaigns.
            </p>

            <CodeBlock language="typescript">
              {`async sendFiltered(
  users: User[],
  message: MessageInput,
  filter: (user: User) => boolean
): Promise<BatchSendResult>`}
            </CodeBlock>

            <div className="mt-4">
              <h4 className="font-semibold text-white mb-2">Examples</h4>
              <CodeBlock language="typescript">
                {`// Send to premium users only
const premiumResult = await notifier.sendFiltered(
  users,
  message,
  user => user.subscription === 'premium'
);

// Send to users who joined recently
const recentResult = await notifier.sendFiltered(
  users,
  message,
  user => {
    const joinDate = new Date(user.joinedAt);
    const daysAgo = (Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysAgo <= 30;
  }
);`}
              </CodeBlock>
            </div>
          </div>
        </div>
      )}

      {/* Types Section */}
      {activeSection === "types" && (
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-white">Types & Interfaces</h2>

          {/* User Interface */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">
              User Interface
            </h3>

            <CodeBlock language="typescript">
              {`interface User {
  name: string;
  email: string;
  [key: string]: any; // Additional user properties
}

// Examples
const user: User = {
  name: "John Doe",
  email: "john@example.com",
  id: 123,
  subscription: "premium",
  joinedAt: "2024-01-15",
};`}
            </CodeBlock>
          </div>

          {/* MessageInput Interface */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">
              MessageInput Interface
            </h3>

            <CodeBlock language="typescript">
              {`interface MessageInput {
  subject: string;
  body?: string;           // Plain text content
  html?: string;           // HTML content
  cc?: string[];           // CC recipients
  bcc?: string[];          // BCC recipients
  replyTo?: string;        // Reply-to address
  attachments?: Attachment[];
}

interface Attachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
  encoding?: string;
}`}
            </CodeBlock>

            <div className="mt-4">
              <h4 className="font-semibold text-white mb-2">Example</h4>
              <CodeBlock language="typescript">
                {`const message: MessageInput = {
  subject: "Order Confirmation",
  body: "Your order has been confirmed.",
  html: "<h1>Order Confirmed</h1><p>Thank you for your purchase.</p>",
  cc: ["manager@company.com"],
  attachments: [
    {
      filename: "invoice.pdf",
      content: pdfBuffer,
      contentType: "application/pdf",
    },
  ],
};`}
              </CodeBlock>
            </div>
          </div>

          {/* SendResult Interface */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">
              SendResult Interface
            </h3>

            <CodeBlock language="typescript">
              {`interface SendResult {
  success: boolean;
  messageId?: string;      // Provider message ID
  error?: string;          // Error message if failed
  recipient?: string;      // Email address
  timestamp: Date;         // When the send was attempted
}

interface BatchSendResult {
  totalSent: number;
  totalFailed: number;
  results: SendResult[];
  duration: number;        // Total time in milliseconds
}`}
            </CodeBlock>
          </div>

          {/* Config Interface */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">
              Config Interface
            </h3>

            <CodeBlock language="typescript">
              {`interface Config {
  // Provider Settings
  provider?: "gmail" | "gmail-oauth" | "sendgrid";
  emailUser: string;
  emailPass?: string;
  emailFrom?: string;
  
  // OAuth Settings (for gmail-oauth)
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
  accessToken?: string;
  
  // SendGrid Settings
  sendGridApiKey?: string;
  
  // SMTP Settings
  smtpHost?: string;
  smtpPort?: number;
  smtpSecure?: boolean;
  
  // Rate Limiting
  rateLimit?: RateLimit;
  
  // Retry Configuration
  retryOptions?: RetryOptions;
  
  // Performance
  enableQueue?: boolean;
  
  // Logging
  logger?: (message: string, level: LogLevel) => void;
}

interface RateLimit {
  maxPerSecond?: number;
  maxPerMinute?: number;
  maxPerHour?: number;
}

interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
}

type LogLevel = "debug" | "info" | "warn" | "error";`}
            </CodeBlock>
          </div>
        </div>
      )}

      {/* Utilities Section */}
      {activeSection === "utilities" && (
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-white">Utility Functions</h2>

          {/* Gmail OAuth2 Helpers */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">
              Gmail OAuth2 Helper Methods
            </h3>

            <p className="text-gray-300 mb-4">
              Static methods for setting up Gmail OAuth2 authentication:
            </p>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  generateAuthUrl()
                </h4>
                <p className="text-gray-300 mb-3">
                  Generate an authorization URL for OAuth2 setup.
                </p>
                <CodeBlock language="typescript">
                  {`import { GmailOAuth2Provider } from "emaily-fi";

// Generate authorization URL
const authUrl = GmailOAuth2Provider.generateAuthUrl(
  clientId: string,
  clientSecret: string
): string

// Example usage
const authUrl = GmailOAuth2Provider.generateAuthUrl(
  "your-client-id.apps.googleusercontent.com",
  "your-client-secret"
);

console.log("Visit this URL to authorize:", authUrl);
// User visits URL, grants permission, receives authorization code`}
                </CodeBlock>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  getRefreshToken()
                </h4>
                <p className="text-gray-300 mb-3">
                  Exchange authorization code for a refresh token.
                </p>
                <CodeBlock language="typescript">
                  {`// Exchange authorization code for refresh token
const refreshToken = await GmailOAuth2Provider.getRefreshToken(
  clientId: string,
  clientSecret: string,
  authorizationCode: string
): Promise<string>

// Example usage
const refreshToken = await GmailOAuth2Provider.getRefreshToken(
  "your-client-id.apps.googleusercontent.com",
  "your-client-secret",
  "AUTHORIZATION_CODE_FROM_USER_CONSENT"
);

console.log("Save this refresh token:", refreshToken);
// Store this token securely - use it in your application config`}
                </CodeBlock>
              </div>

              <div className="p-4 bg-green-900  border border-green-800 rounded-lg">
                <h4 className="font-semibold text-green-200 mb-2">
                  💡 Complete OAuth2 Setup Flow
                </h4>
                <CodeBlock language="typescript">
                  {`// Step 1: Generate authorization URL
const authUrl = GmailOAuth2Provider.generateAuthUrl(clientId, clientSecret);
console.log("1. Visit:", authUrl);

// Step 2: User authorizes and you get authorization code
// (This happens in the browser)

// Step 3: Exchange code for refresh token
const refreshToken = await GmailOAuth2Provider.getRefreshToken(
  clientId,
  clientSecret,
  authorizationCode
);

// Step 4: Use in your application
const notifier = new EmailNotifier({
  provider: "gmail-oauth2",
  emailUser: "your-email@gmail.com",
  gmailOAuth2: { clientId, clientSecret, refreshToken },
});`}
                </CodeBlock>
              </div>
            </div>
          </div>

          {/* Environment Configuration */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">
              Environment Configuration
            </h3>

            <CodeBlock language="typescript">
              {`import {
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
validateEnvConfig(); // Throws if required vars missing`}
            </CodeBlock>
          </div>

          {/* Validation Schemas */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">
              Validation Schemas
            </h3>

            <p className="text-gray-300 mb-4">
              Export Zod schemas for custom validation:
            </p>

            <CodeBlock language="typescript">
              {`import { UserSchema, MessageInputSchema, ConfigSchema } from "emaily-fi";

// Validate user input before sending
try {
  const validUser = UserSchema.parse(userInput);
  const validMessage = MessageInputSchema.parse(messageInput);

  const result = await notifier.sendToOne(validUser, validMessage);
} catch (error) {
  console.error("Validation failed:", error.issues);
}`}
            </CodeBlock>
          </div>

          {/* Queue Management */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">
              Queue Management
            </h3>

            <CodeBlock language="typescript">
              {`// Get queue statistics
const stats = notifier.getQueueStats();
console.log(\`Queue: \${stats?.size} pending, \${stats?.pending} processing\`);

// Pause queue processing
notifier.pauseQueue();

// Resume queue processing
notifier.resumeQueue();

// Check if queue is paused
const isPaused = notifier.isQueuePaused();`}
            </CodeBlock>
          </div>
        </div>
      )}

      {/* Error Handling Section */}
      {activeSection === "errors" && (
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-white">Error Handling</h2>

          {/* Error Types */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">
              Common Error Types
            </h3>

            <div className="space-y-4">
              <div className="p-4 bg-red-900  border border-red-800 rounded-lg">
                <h4 className="font-semibold text-red-200 mb-2">
                  Authentication Errors
                </h4>
                <ul className="text-red-300 text-sm space-y-1">
                  <li>• Invalid email credentials</li>
                  <li>• App password not configured</li>
                  <li>• OAuth token expired</li>
                </ul>
              </div>

              <div className="p-4 bg-orange-900  border border-orange-800 rounded-lg">
                <h4 className="font-semibold text-orange-200 mb-2">
                  Rate Limit Errors
                </h4>
                <ul className="text-orange-300 text-sm space-y-1">
                  <li>• Too many emails sent per second/minute</li>
                  <li>• Provider temporary blocks</li>
                  <li>• Daily sending quota exceeded</li>
                </ul>
              </div>

              <div className="p-4 bg-yellow-900  border border-yellow-800 rounded-lg">
                <h4 className="font-semibold text-yellow-200 mb-2">
                  Validation Errors
                </h4>
                <ul className="text-yellow-300 text-sm space-y-1">
                  <li>• Invalid email addresses</li>
                  <li>• Missing required fields</li>
                  <li>• Invalid attachment formats</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Error Handling Patterns */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">
              Error Handling Patterns
            </h3>

            <CodeBlock language="typescript">
              {`// Single email error handling
try {
  const result = await notifier.sendToOne(user, message);
  
  if (result.success) {
    console.log("Email sent:", result.messageId);
  } else {
    console.error("Send failed:", result.error);
    
    // Handle specific error types
    if (result.error?.includes("authentication")) {
      // Handle auth errors
      await refreshCredentials();
    } else if (result.error?.includes("rate limit")) {
      // Handle rate limit
      await delay(60000); // Wait 1 minute
    }
  }
} catch (error) {
  console.error("💥 Unexpected error:", error.message);
}

// Batch sending error handling
const batchResult = await notifier.sendToAll(users, message);

console.log(\`Success rate: \${batchResult.totalSent}/\${users.length}\`);

// Process individual failures
const failures = batchResult.results.filter(r => !r.success);
failures.forEach(failure => {
  console.error(\`Failed to send to \${failure.recipient}: \${failure.error}\`);
  
  // Retry logic for specific failures
  if (failure.error?.includes("temporary")) {
    retryQueue.push({ user: failure.recipient, message });
  }
});`}
            </CodeBlock>
          </div>

          {/* Custom Error Logging */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">
              Custom Error Logging
            </h3>

            <CodeBlock language="typescript">
              {`const notifier = new EmailNotifier({
  // ... config
  logger: (message, level) => {
    const timestamp = new Date().toISOString();
    
    if (level === "error") {
      // Send to error monitoring service
      errorTracker.capture(message, { level, timestamp });
      
      // Log to file
      fs.appendFileSync("email-errors.log", \`\${timestamp} [ERROR] \${message}\\n\`);
    }
    
    console.log(\`[\${timestamp}] [\${level.toUpperCase()}] \${message}\`);
  },
});`}
            </CodeBlock>
          </div>
        </div>
      )}

      {/* Quick Reference */}
      <div className="bg-gray-800 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Quick Reference</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-white">Essential Methods</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <code className="text-white">new EmailNotifier(config)</code> -
                Create instance
              </li>
              <li>
                <code className="text-white">await notifier.initialize()</code>{" "}
                - Initialize service
              </li>
              <li>
                <code className="text-white">sendToOne(user, message)</code> -
                Single email
              </li>
              <li>
                <code className="text-white">sendToAll(users, message)</code> -
                Bulk emails
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-white">Key Imports</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <code className="text-white">{`import { EmailNotifier } from "emaily-fi"`}</code>
              </li>
              <li>
                <code className="text-white">{`import { createValidatedConfigFromEnv } from "emaily-fi"`}</code>
              </li>
              <li>
                <code className="text-white">{`import type { User, MessageInput } from "emaily-fi"`}</code>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIReference;
