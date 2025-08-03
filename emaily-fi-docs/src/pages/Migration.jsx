import React, { useState } from "react";
import {
  ArrowRight,
  Package,
  AlertTriangle,
  CheckCircle,
  Code,
} from "lucide-react";
import CodeBlock from "../components/CodeBlock";

const Migration = () => {
  const [activeTab, setActiveTab] = useState("nodemailer");

  const migrationGuides = [
    { id: "nodemailer", name: "Nodemailer", icon: Package },
    { id: "sendgrid", name: "SendGrid SDK", icon: Package },
    { id: "mailgun", name: "Mailgun", icon: Package },
    { id: "ses", name: "AWS SES", icon: Package },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center space-x-3 bg-primary bg-opacity-10 px-4 py-2 rounded-full">
          <ArrowRight className="text-white" size={20} />
          <span className="text-white font-medium">Migration Guide</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Migrate to emaily-fi
        </h1>

        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Step-by-step guides to migrate from other email libraries to
          emaily-fi. Minimize downtime and leverage improved features with our
          migration tools.
        </p>
      </div>

      {/* Migration Benefits */}
      <div className="bg-gray-800 border border-green-800 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-green-200 mb-4">
          Why Migrate to emaily-fi?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-start space-x-3">
            <CheckCircle className="text-green-400 mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-green-200">Simplified API</h3>
              <p className="text-green-300 text-sm">
                Intuitive methods for common email patterns
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <CheckCircle className="text-green-400 mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-green-200">
                Built-in Rate Limiting
              </h3>
              <p className="text-green-300 text-sm">
                Prevent provider blocks automatically
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <CheckCircle className="text-green-400 mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-green-200">TypeScript First</h3>
              <p className="text-green-300 text-sm">
                Complete type safety and IntelliSense
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <CheckCircle className="text-green-400 mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-green-200">Queue System</h3>
              <p className="text-green-300 text-sm">
                Handle bulk operations efficiently
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <CheckCircle className="text-green-400 mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-green-200">Retry Logic</h3>
              <p className="text-green-300 text-sm">
                Automatic retries with exponential backoff
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <CheckCircle className="text-green-400 mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-green-200">
                Multiple Providers
              </h3>
              <p className="text-green-300 text-sm">
                Gmail, SendGrid, and more with unified API
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Migration Tabs */}
      <div className="space-y-8">
        <div className="border-b border-gray-700">
          <nav className="flex space-x-8">
            {migrationGuides.map((guide) => {
              const Icon = guide.icon;
              return (
                <button
                  key={guide.id}
                  onClick={() => setActiveTab(guide.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === guide.id
                      ? "border-primary text-white"
                      : "border-transparent text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <Icon size={18} />
                  <span>{guide.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Nodemailer Migration */}
        {activeTab === "nodemailer" && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white">
              Migrating from Nodemailer
            </h2>

            <div className="space-y-6">
              {/* Before and After */}
              <div className="grid grid-cols-1 gap-6">
                {/* Before */}
                <div className="bg-gray-800 border border-red-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-red-200 mb-4">
                    Before (Nodemailer)
                  </h3>

                  <CodeBlock language="typescript">
                    {`import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send single email
async function sendEmail(to: string, subject: string, html: string) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email failed:', error);
    return { success: false, error: error.message };
  }
}

// Send to multiple recipients (manual loop)
async function sendBulkEmails(recipients: string[], subject: string, html: string) {
  const results = [];
  for (const recipient of recipients) {
    // Manual rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const result = await sendEmail(recipient, subject, html);
    results.push(result);
  }
  return results;
}`}
                  </CodeBlock>
                </div>

                {/* After */}
                <div className="bg-gray-800 border border-green-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-green-200 mb-4">
                    After (emaily-fi)
                  </h3>
                  <CodeBlock language="typescript">
                    {`import { EmailNotifier, createValidatedConfigFromEnv } from 'emaily-fi';
// Initialize with built-in features
const notifier = new EmailNotifier(createValidatedConfigFromEnv({
  rateLimit: { maxPerSecond: 1 },
  retryOptions: { maxRetries: 3 },
  enableQueue: true,
}));

await notifier.initialize();

// Send single email
const result = await notifier.sendToOne(
  { name: 'John', email: 'john@example.com' },
  {
    subject: 'Welcome!',
    html: '<h1>Welcome to our service!</h1>',
  }
);

// Send to multiple recipients (built-in bulk sending)
const users = [
  { name: 'Alice', email: 'alice@example.com' },
  { name: 'Bob', email: 'bob@example.com' },
];

const bulkResult = await notifier.sendToAll(users, {
  subject: 'Newsletter',
  html: '<h1>Monthly Update</h1>',
});

console.log(\`Sent: \${bulkResult.totalSent}, Failed: \${bulkResult.totalFailed}\`);`}
                  </CodeBlock>
                </div>
              </div>

              {/* Step-by-step Migration */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Step-by-Step Migration
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">
                        Install emaily-fi
                      </h4>
                      <CodeBlock language="bash">
                        npm install emaily-fi
                      </CodeBlock>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">
                        Replace Nodemailer imports
                      </h4>
                      <CodeBlock language="typescript">
                        {`// Remove
// import nodemailer from 'nodemailer';

// Add
import { EmailNotifier } from 'emaily-fi';`}
                      </CodeBlock>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">
                        Update configuration
                      </h4>
                      <CodeBlock language="typescript">
                        {`// Replace transporter creation
const notifier = new EmailNotifier({
  emailUser: process.env.EMAIL_USER!,
  emailPass: process.env.EMAIL_PASS!,
  emailFrom: process.env.EMAIL_FROM,
  rateLimit: { maxPerSecond: 1 },
});

await notifier.initialize();`}
                      </CodeBlock>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">
                        Update email sending code
                      </h4>
                      <CodeBlock language="typescript">
                        {`// Replace Nodemailer sendMail calls
const result = await notifier.sendToOne(
  { name: 'User Name', email: 'user@example.com' },
  {
    subject: 'Your Subject',
    html: '<p>Your HTML content</p>',
    // cc, bcc, attachments also supported
  }
);`}
                      </CodeBlock>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                      5
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">
                        Remove manual rate limiting and error handling
                      </h4>
                      <p className="text-gray-300 text-sm mb-2">
                        emaily-fi handles these automatically!
                      </p>
                      <CodeBlock language="typescript">
                        {`// Remove manual timeouts and try-catch blocks
// emaily-fi handles rate limiting and retries automatically

// Just use the simple API
const bulkResult = await notifier.sendToAll(users, message);`}
                      </CodeBlock>
                    </div>
                  </div>
                </div>
              </div>

              {/* Migration Helper */}
              <div className="bg-gray-800 border border-blue-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-blue-200 mb-4">
                  🔧 Migration Helper Function
                </h3>
                <p className="text-blue-300 mb-4">
                  Use this wrapper to gradually migrate your codebase:
                </p>

                <CodeBlock language="typescript">
                  {`// migration-helper.ts
import { EmailNotifier } from 'emaily-fi';

class NodemailerCompatWrapper {
  private notifier: EmailNotifier;

  constructor(config: any) {
    this.notifier = new EmailNotifier({
      emailUser: config.auth.user,
      emailPass: config.auth.pass,
      smtpHost: config.host || 'smtp.gmail.com',
      smtpPort: config.port || 587,
      smtpSecure: config.secure || false,
    });
  }

  async initialize() {
    await this.notifier.initialize();
  }

  // Nodemailer-compatible interface
  async sendMail(options: any) {
    const result = await this.notifier.sendToOne(
      { 
        name: options.to.split('@')[0], // Extract name from email
        email: options.to 
      },
      {
        subject: options.subject,
        body: options.text,
        html: options.html,
        cc: options.cc,
        bcc: options.bcc,
        attachments: options.attachments,
      }
    );

    if (result.success) {
      return { messageId: result.messageId };
    } else {
      throw new Error(result.error);
    }
  }
}

// Usage: Replace nodemailer.createTransporter with this
export function createTransporter(config: any) {
  return new NodemailerCompatWrapper(config);
}`}
                </CodeBlock>
              </div>
            </div>
          </div>
        )}

        {/* SendGrid Migration */}
        {activeTab === "sendgrid" && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white">
              Migrating from SendGrid SDK
            </h2>

            <div className="space-y-6">
              {/* Before and After */}
              <div className="grid grid-cols-1 gap-6">
                {/* Before */}
                <div className="bg-gray-800 border border-red-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-red-200 mb-4">
                    Before (SendGrid SDK)
                  </h3>

                  <CodeBlock language="typescript">
                    {`import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

// Send single email
async function sendEmail(to: string, subject: string, html: string) {
  const msg = {
    to,
    from: 'sender@example.com',
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error('SendGrid error:', error);
    return { success: false, error };
  }
}

// Send to multiple recipients
async function sendBulkEmails(recipients: string[], subject: string, html: string) {
  const messages = recipients.map(to => ({
    to,
    from: 'sender@example.com',
    subject,
    html,
  }));

  try {
    await sgMail.send(messages);
    return { success: true };
  } catch (error) {
    console.error('Bulk send error:', error);
    return { success: false, error };
  }
}`}
                  </CodeBlock>
                </div>

                {/* After */}
                <div className="bg-gray-800 border border-green-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-green-200 mb-4">
                    After (emaily-fi with SendGrid)
                  </h3>

                  <CodeBlock language="typescript">
                    {`import { EmailNotifier } from 'emaily-fi';

// Initialize with SendGrid provider
const notifier = new EmailNotifier({
  provider: 'sendgrid',
  sendGridApiKey: process.env.SENDGRID_API_KEY!,
  emailFrom: 'sender@example.com',
  rateLimit: { maxPerSecond: 10 }, // SendGrid allows higher rates
  retryOptions: { maxRetries: 3 },
});

await notifier.initialize();

// Send single email
const result = await notifier.sendToOne(
  { name: 'John', email: 'john@example.com' },
  {
    subject: 'Welcome!',
    html: '<h1>Welcome!</h1>',
  }
);

// Send to multiple recipients with built-in error handling
const users = [
  { name: 'Alice', email: 'alice@example.com' },
  { name: 'Bob', email: 'bob@example.com' },
];

const bulkResult = await notifier.sendToAll(users, {
  subject: 'Newsletter',
  html: '<h1>Monthly Update</h1>',
});

// Detailed results with individual success/failure info
console.log(\`Success: \${bulkResult.totalSent}, Failed: \${bulkResult.totalFailed}\`);
bulkResult.results.forEach(r => {
  if (!r.success) console.error(\`Failed: \${r.recipient} - \${r.error}\`);
});`}
                  </CodeBlock>
                </div>
              </div>

              {/* Migration Steps */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4">
                  SendGrid Migration Steps
                </h3>

                <div className="space-y-4">
                  <div className="p-4 bg-yellow-900  border border-yellow-800 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="text-yellow-600" size={16} />
                      <span className="font-semibold text-yellow-200">
                        Keep Your SendGrid Account
                      </span>
                    </div>
                    <p className="text-yellow-300 text-sm">
                      You can continue using SendGrid as the provider -
                      emaily-fi just provides a better interface!
                    </p>
                  </div>

                  <ol className="space-y-4">
                    <li className="flex items-start space-x-3">
                      <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-white">
                          Update dependencies
                        </p>
                        <CodeBlock language="bash">
                          {`npm uninstall @sendgrid/mail
npm install emaily-fi`}
                        </CodeBlock>
                      </div>
                    </li>

                    <li className="flex items-start space-x-3">
                      <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-white">
                          Replace imports and initialization
                        </p>
                        <CodeBlock language="typescript">
                          {`// Remove
// import sgMail from '@sendgrid/mail';
// sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

// Add
import { EmailNotifier } from 'emaily-fi';

const notifier = new EmailNotifier({
  provider: 'sendgrid',
  sendGridApiKey: process.env.SENDGRID_API_KEY!,
  emailFrom: 'your-verified-sender@example.com',
});

await notifier.initialize();`}
                        </CodeBlock>
                      </div>
                    </li>

                    <li className="flex items-start space-x-3">
                      <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-white">
                          Update email sending calls
                        </p>
                        <CodeBlock language="typescript">
                          {`// Replace sgMail.send() calls
const result = await notifier.sendToOne(
  { name: 'Recipient Name', email: 'recipient@example.com' },
  {
    subject: 'Your Subject',
    html: '<p>Your HTML content</p>',
    // cc, bcc, attachments supported
  }
);`}
                        </CodeBlock>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mailgun Migration */}
        {activeTab === "mailgun" && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white">
              Migrating from Mailgun
            </h2>

            <div className="bg-opacity-20 border border-yellow-800 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="text-yellow-400 mt-0.5" size={20} />
                <div>
                  <h3 className="font-semibold text-yellow-200 mb-2">
                    Mailgun Provider Coming Soon
                  </h3>
                  <p className="text-yellow-300 mb-4">
                    Native Mailgun support is planned for v1.2.0. For now, you
                    can:
                  </p>
                  <ul className="space-y-2 text-yellow-300">
                    <li>• Migrate to Gmail SMTP (easier setup)</li>
                    <li>• Use SendGrid as an alternative</li>
                    <li>
                      • Continue with Mailgun using our SMTP configuration
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SMTP Configuration for Mailgun */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">
                Use Mailgun via SMTP (Interim Solution)
              </h3>

              <CodeBlock language="typescript">
                {`import { EmailNotifier } from 'emaily-fi';

// Configure emaily-fi to use Mailgun's SMTP
const notifier = new EmailNotifier({
  emailUser: 'postmaster@your-domain.mailgun.org', // Your Mailgun SMTP username
  emailPass: 'your-mailgun-smtp-password',           // Your Mailgun SMTP password
  emailFrom: 'noreply@your-domain.com',
  smtpHost: 'smtp.mailgun.org',
  smtpPort: 587,
  smtpSecure: false,
  rateLimit: { 
    maxPerSecond: 5,    // Mailgun allows higher rates
    maxPerMinute: 300 
  },
});

await notifier.initialize();

// Same simple API
const result = await notifier.sendToOne(
  { name: 'User', email: 'user@example.com' },
  {
    subject: 'Welcome!',
    html: '<h1>Welcome to our service!</h1>',
  }
);`}
              </CodeBlock>
            </div>
          </div>
        )}

        {/* AWS SES Migration */}
        {activeTab === "ses" && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white">
              Migrating from AWS SES
            </h2>

            <div className="bg-opacity-20 border border-yellow-800 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="text-yellow-400 mt-0.5" size={20} />
                <div>
                  <h3 className="font-semibold text-yellow-200 mb-2">
                    AWS SES Provider Coming Soon
                  </h3>
                  <p className="text-yellow-300 mb-4">
                    Native AWS SES support is planned for v1.2.0. For now, you
                    can use SES via SMTP:
                  </p>
                </div>
              </div>
            </div>

            {/* SES SMTP Configuration */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">
                Use AWS SES via SMTP
              </h3>

              <CodeBlock language="typescript">
                {`import { EmailNotifier } from 'emaily-fi';

// Configure emaily-fi to use AWS SES SMTP
const notifier = new EmailNotifier({
  emailUser: 'your-ses-smtp-username',     // Your SES SMTP credentials
  emailPass: 'your-ses-smtp-password',     // Your SES SMTP password
  emailFrom: 'verified@your-domain.com',   // Must be verified in SES
  smtpHost: 'email-smtp.us-east-1.amazonaws.com', // Your SES region
  smtpPort: 587,
  smtpSecure: false,
  rateLimit: { 
    maxPerSecond: 14,   // SES default sending rate
    maxPerMinute: 200   // Adjust based on your SES limits
  },
});

await notifier.initialize();

// Use the same simple API
const result = await notifier.sendToOne(
  { name: 'Customer', email: 'customer@example.com' },
  {
    subject: 'Order Confirmation',
    html: '<h1>Your order has been confirmed!</h1>',
  }
);`}
              </CodeBlock>

              <div className="mt-4 p-4 bg-gray-800 border border-blue-800 rounded-lg">
                <h4 className="font-semibold text-blue-200 mb-2">
                  SES SMTP Regions
                </h4>
                <CodeBlock language="typescript">
                  {`// Common SES SMTP endpoints by region
const sesEndpoints = {
  'us-east-1': 'email-smtp.us-east-1.amazonaws.com',
  'us-west-2': 'email-smtp.us-west-2.amazonaws.com',
  'eu-west-1': 'email-smtp.eu-west-1.amazonaws.com',
  'ap-southeast-1': 'email-smtp.ap-southeast-1.amazonaws.com',
  // ... use your SES region
};`}
                </CodeBlock>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* General Migration Tips */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white">
          General Migration Tips
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <Code className="text-white" size={20} />
              <h3 className="text-lg font-semibold text-white">
                Code Migration
              </h3>
            </div>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Start with a single email endpoint</li>
              <li>• Use migration helper functions</li>
              <li>• Test thoroughly in development</li>
              <li>• Migrate gradually, one service at a time</li>
              <li>• Keep old code until migration is complete</li>
            </ul>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="text-green-500" size={20} />
              <h3 className="text-lg font-semibold text-white">Testing</h3>
            </div>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Use test email addresses</li>
              <li>• Verify all email types work</li>
              <li>• Test rate limiting behavior</li>
              <li>• Check error handling</li>
              <li>• Validate HTML rendering</li>
            </ul>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="text-yellow-500" size={20} />
              <h3 className="text-lg font-semibold text-white">
                Common Gotchas
              </h3>
            </div>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Update environment variables</li>
              <li>• Verify sender addresses are configured</li>
              <li>• Check rate limit configurations</li>
              <li>• Update error handling logic</li>
              <li>• Test attachment handling</li>
            </ul>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <Package className="text-blue-500" size={20} />
              <h3 className="text-lg font-semibold text-white">Deployment</h3>
            </div>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Deploy to staging first</li>
              <li>• Monitor email delivery rates</li>
              <li>• Have rollback plan ready</li>
              <li>• Update monitoring and alerts</li>
              <li>• Document the changes</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Get Help */}
      <div className="bg-gray-800 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-4">
          Need Help with Migration?
        </h2>
        <p className="text-gray-300 mb-6">
          Our community and maintainers are here to help with your migration.
          Don't hesitate to reach out!
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="https://github.com/bittu-the-coder/emaily-fi/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 border-2 border-gray-600 text-gray-300 font-medium rounded-lg hover:border-primary hover:text-white transition-colors"
          >
            Report Migration Issues
          </a>
        </div>
      </div>
    </div>
  );
};

export default Migration;
