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

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
          API Documentation
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Complete reference for all emaily-fi classes, methods, and types.
          Everything you need to integrate email notifications into your
          application.
        </p>
      </div>

      {/* API Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {apiSections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? "bg-white dark:bg-gray-700 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            EmailNotifier Class
          </h2>

          {/* Constructor */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Constructor
            </h3>

            <CodeBlock language="typescript">
              {`class EmailNotifier {
  constructor(config: Config)
}

interface Config {
  // Required
  emailUser: string;
  emailPass: string;
  
  // Optional
  provider?: "gmail" | "gmail-oauth" | "sendgrid";
  emailFrom?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpSecure?: boolean;
  rateLimit?: RateLimit;
  retryOptions?: RetryOptions;
  enableQueue?: boolean;
  logger?: (message: string, level: LogLevel) => void;
}`}
            </CodeBlock>

            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Example
              </h4>
              <CodeBlock language="typescript">
                {`import { EmailNotifier } from "emaily-fi";

const notifier = new EmailNotifier({
  emailUser: "your-email@gmail.com",
  emailPass: "your-app-password",
  rateLimit: { maxPerSecond: 1 },
  enableQueue: true,
});`}
              </CodeBlock>
            </div>
          </div>

          {/* Initialize Method */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              initialize()
            </h3>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Initializes the email service and establishes SMTP connection.
            </p>

            <CodeBlock language="typescript">
              {`async initialize(): Promise<void>`}
            </CodeBlock>

            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                Important
              </h4>
              <p className="text-yellow-700 dark:text-yellow-300">
                Must be called before sending any emails. This method verifies
                the connection and configuration.
              </p>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Example
              </h4>
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Send Methods
          </h2>

          {/* sendToOne */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              sendToOne()
            </h3>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Sends an email to a single recipient.
            </p>

            <CodeBlock language="typescript">
              {`async sendToOne(
  user: User,
  message: MessageInput
): Promise<SendResult>`}
            </CodeBlock>

            <div className="mt-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Parameters
              </h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
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
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Example
              </h4>
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
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              sendToAll()
            </h3>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
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
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Example
              </h4>
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
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              sendRandom()
            </h3>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
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
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Example
              </h4>
              <CodeBlock language="typescript">
                {`// Send to 10 random users for A/B testing
const result = await notifier.sendRandom(allUsers, testMessage, 10);

console.log(\`Test email sent to \${result.totalSent} random users\`);`}
              </CodeBlock>
            </div>
          </div>

          {/* sendFiltered */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              sendFiltered()
            </h3>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
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
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Examples
              </h4>
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Types & Interfaces
          </h2>

          {/* User Interface */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
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
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
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
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Example
              </h4>
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
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
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
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Utility Functions
          </h2>

          {/* Environment Configuration */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
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
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Validation Schemas
            </h3>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
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
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Error Handling
          </h2>

          {/* Error Types */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Common Error Types
            </h3>

            <div className="space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-900 dark:bg-opacity-20 border border-red-200 dark:border-red-800 rounded-lg">
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                  Authentication Errors
                </h4>
                <ul className="text-red-700 dark:text-red-300 text-sm space-y-1">
                  <li>• Invalid email credentials</li>
                  <li>• App password not configured</li>
                  <li>• OAuth token expired</li>
                </ul>
              </div>

              <div className="p-4 bg-orange-50 dark:bg-orange-900 dark:bg-opacity-20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                  Rate Limit Errors
                </h4>
                <ul className="text-orange-700 dark:text-orange-300 text-sm space-y-1">
                  <li>• Too many emails sent per second/minute</li>
                  <li>• Provider temporary blocks</li>
                  <li>• Daily sending quota exceeded</li>
                </ul>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  Validation Errors
                </h4>
                <ul className="text-yellow-700 dark:text-yellow-300 text-sm space-y-1">
                  <li>• Invalid email addresses</li>
                  <li>• Missing required fields</li>
                  <li>• Invalid attachment formats</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Error Handling Patterns */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Error Handling Patterns
            </h3>

            <CodeBlock language="typescript">
              {`// Single email error handling
try {
  const result = await notifier.sendToOne(user, message);
  
  if (result.success) {
    console.log("✅ Email sent:", result.messageId);
  } else {
    console.error("❌ Send failed:", result.error);
    
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
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
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
      <div className="bg-primary bg-opacity-5 dark:bg-primary dark:bg-opacity-10 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Quick Reference
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Essential Methods
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
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
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Key Imports
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
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
