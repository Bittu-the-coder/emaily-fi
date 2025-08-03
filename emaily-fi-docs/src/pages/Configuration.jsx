import React, { useState } from "react";
import {
  Settings,
  Shield,
  Clock,
  Database,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import CodeBlock from "../components/CodeBlock";

const Configuration = () => {
  const [activeTab, setActiveTab] = useState("basic");

  const configTabs = [
    { id: "basic", name: "Basic Setup", icon: Settings },
    { id: "providers", name: "Email Providers", icon: Shield },
    { id: "advanced", name: "Advanced Options", icon: Database },
    { id: "environment", name: "Environment Variables", icon: AlertTriangle },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center space-x-3 bg-primary bg-opacity-10 px-4 py-2 rounded-full">
          <Settings className="text-white" size={20} />
          <span className="text-white font-medium">Configuration Guide</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
          Configure emaily-fi
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Comprehensive configuration options for production-ready email
          notifications. Choose from multiple providers and customize every
          aspect of your email system.
        </p>
      </div>

      {/* Configuration Tabs */}
      <div className="space-y-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            {configTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-white"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Basic Setup Tab */}
        {activeTab === "basic" && (
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Basic Configuration
              </h2>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Start Configuration
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  The simplest way to get started with Gmail SMTP:
                </p>

                <CodeBlock language="typescript">
                  {`import { EmailNotifier } from "emaily-fi";

const notifier = new EmailNotifier({
  emailUser: "your-email@gmail.com",
  emailPass: "your-app-password", // Gmail App Password
  rateLimit: { 
    maxPerSecond: 1,
    maxPerMinute: 50 
  },
});

await notifier.initialize();`}
                </CodeBlock>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle
                    className="text-yellow-600 dark:text-yellow-400 mt-0.5"
                    size={20}
                  />
                  <div>
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                      Gmail App Password Required
                    </h4>
                    <p className="text-yellow-700 dark:text-yellow-300">
                      You need to enable 2-Factor Authentication on your Gmail
                      account and generate an App Password. Regular Gmail
                      passwords won't work for security reasons.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email Providers Tab */}
        {activeTab === "providers" && (
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Email Providers
              </h2>

              {/* Gmail OAuth */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <CheckCircle className="text-green-600" size={18} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Gmail OAuth2 (Recommended)
                  </h3>
                  <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-sm rounded-full">
                    Most Secure
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  No app passwords needed! Users authenticate securely through
                  Google OAuth.
                </p>

                <CodeBlock language="typescript">
                  {`const notifier = new EmailNotifier({
  provider: "gmail-oauth2",
  emailUser: "your-email@gmail.com",
  emailFrom: "Your Name <your-email@gmail.com>",
  gmailOAuth2: {
    clientId: "your-google-client-id.apps.googleusercontent.com",
    clientSecret: "your-google-client-secret",
    refreshToken: "your-refresh-token",
  },
});`}
                </CodeBlock>

                {/* OAuth2 Setup Steps */}
                <div className="mt-6 p-4 bg-gray-800 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">
                    OAuth2 Setup Guide
                  </h4>

                  <div className="space-y-4 text-sm">
                    <div>
                      <h5 className="font-medium text-blue-800 dark:text-blue-300">
                        1. Create Google Cloud Project
                      </h5>
                      <p className="text-blue-700 dark:text-blue-300">
                        • Go to{" "}
                        <a
                          href="https://console.cloud.google.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          Google Cloud Console
                        </a>
                        <br />
                        • Create a new project or select existing
                        <br />• Enable Gmail API (APIs & Services → Library →
                        Search "Gmail API" → Enable)
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium text-blue-800 dark:text-blue-300">
                        2. Create OAuth2 Credentials
                      </h5>
                      <p className="text-blue-700 dark:text-blue-300">
                        • Go to APIs & Services → Credentials
                        <br />
                        • Click "Create Credentials" → "OAuth client ID"
                        <br />
                        • Choose "Desktop application"
                        <br />• Download the JSON file and extract clientId and
                        clientSecret
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium text-blue-800 dark:text-blue-300">
                        3. Generate Refresh Token
                      </h5>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded border mt-2">
                        <CodeBlock language="typescript">
                          {`import { GmailOAuth2Provider } from "emaily-fi";

// Generate authorization URL
const authUrl = GmailOAuth2Provider.generateAuthUrl(clientId, clientSecret);
console.log("Visit:", authUrl);

// After user authorization, exchange code for refresh token
const refreshToken = await GmailOAuth2Provider.getRefreshToken(
  clientId,
  clientSecret,
  authorizationCode
);`}
                        </CodeBlock>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-blue-800 dark:text-blue-300">
                        4. Environment Variables
                      </h5>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded border mt-2">
                        <CodeBlock language="bash">
                          {`GMAIL_OAUTH2_CLIENT_ID=your-client-id.apps.googleusercontent.com
GMAIL_OAUTH2_CLIENT_SECRET=your-client-secret
GMAIL_OAUTH2_REFRESH_TOKEN=your-refresh-token
EMAIL_USER=your-email@gmail.com
EMAIL_FROM=Your Name <your-email@gmail.com>`}
                        </CodeBlock>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SendGrid */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <Shield className="text-blue-600" size={18} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    SendGrid
                  </h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm rounded-full">
                    Professional
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Reliable, scalable email delivery service with advanced
                  analytics.
                </p>

                <CodeBlock language="typescript">
                  {`const notifier = new EmailNotifier({
  provider: "sendgrid",
  sendGridApiKey: "SG.your-sendgrid-api-key",
  emailFrom: "verified-sender@yourdomain.com", // Must be verified in SendGrid
});`}
                </CodeBlock>
              </div>

              {/* Gmail SMTP */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                    <Settings className="text-orange-600" size={18} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Gmail SMTP (Traditional)
                  </h3>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 text-sm rounded-full">
                    App Password Required
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Classic SMTP authentication with Gmail App Passwords.
                </p>

                <CodeBlock language="typescript">
                  {`const notifier = new EmailNotifier({
  provider: "gmail", // or omit for default
  emailUser: "your-email@gmail.com",
  emailPass: "your-16-char-app-password",
  emailFrom: "Your Name <your-email@gmail.com>",
});`}
                </CodeBlock>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Options Tab */}
        {activeTab === "advanced" && (
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Advanced Configuration
              </h2>

              {/* Complete Configuration */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Complete Configuration Options
                </h3>

                <CodeBlock language="typescript">
                  {`const notifier = new EmailNotifier({
  // SMTP Settings (Required)
  emailUser: "your-email@gmail.com",
  emailPass: "your-app-password",

  // Optional SMTP Settings
  emailFrom: "Your Company <your-email@gmail.com>",
  smtpHost: "smtp.gmail.com",
  smtpPort: 587,
  smtpSecure: false,

  // Rate Limiting
  rateLimit: {
    maxPerSecond: 1,     // Max emails per second
    maxPerMinute: 50,    // Max emails per minute
    maxPerHour: 500,     // Max emails per hour
  },

  // Reliability & Retry
  retryOptions: {
    maxRetries: 3,       // Number of retry attempts
    retryDelay: 1000,    // Initial delay between retries (ms)
  },

  // Performance
  enableQueue: true,     // Use async queue for bulk sends

  // Monitoring & Debugging
  logger: (message, level) => {
    console.log(\`[\${level.toUpperCase()}] \${message}\`);
  },
});`}
                </CodeBlock>
              </div>

              {/* Rate Limiting */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 mb-4">
                  <Clock className="text-white" size={20} />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Rate Limiting Configuration
                  </h3>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Prevent provider blocks and ensure reliable delivery with
                  smart rate limiting:
                </p>

                <CodeBlock language="typescript">
                  {`// Conservative settings (recommended for new accounts)
rateLimit: {
  maxPerSecond: 1,
  maxPerMinute: 50,
  maxPerHour: 500,
}

// Aggressive settings (for established accounts)
rateLimit: {
  maxPerSecond: 3,
  maxPerMinute: 150,
  maxPerHour: 2000,
}

// Custom provider limits
rateLimit: {
  maxPerSecond: 10,    // SendGrid allows higher rates
  maxPerMinute: 300,
  maxPerHour: 10000,
}`}
                </CodeBlock>
              </div>

              {/* Queue System */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 mb-4">
                  <Database className="text-white" size={20} />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Queue System
                  </h3>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Enable the queue system for high-volume email sending:
                </p>

                <CodeBlock language="typescript">
                  {`// Enable queue for bulk operations
const notifier = new EmailNotifier({
  // ... other config
  enableQueue: true,
});

// Monitor queue status
const stats = notifier.getQueueStats();
console.log(\`Queue: \${stats?.size} pending, \${stats?.pending} processing\`);

// Control queue
notifier.pauseQueue();  // Pause processing
notifier.resumeQueue(); // Resume processing`}
                </CodeBlock>
              </div>
            </div>
          </div>
        )}

        {/* Environment Variables Tab */}
        {activeTab === "environment" && (
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Environment Variables
              </h2>

              <div className="bg-green-50 dark:bg-green-900 dark:bg-opacity-20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle
                    className="text-green-600 dark:text-green-400 mt-0.5"
                    size={20}
                  />
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                      Recommended for Production
                    </h4>
                    <p className="text-green-700 dark:text-green-300">
                      Using environment variables keeps your credentials secure
                      and makes deployment easier.
                    </p>
                  </div>
                </div>
              </div>

              {/* .env file */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Environment Variables (.env file)
                </h3>

                <CodeBlock language="bash">
                  {`# Required
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Optional
EMAIL_FROM="Your Company <your-email@gmail.com>"
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
MAX_EMAILS_PER_SECOND=1
MAX_EMAILS_PER_MINUTE=50
MAX_EMAILS_PER_HOUR=500
MAX_RETRIES=3
RETRY_DELAY=1000
ENABLE_QUEUE=true`}
                </CodeBlock>
              </div>

              {/* Using env config */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Using Environment Configuration
                </h3>

                <CodeBlock language="typescript">
                  {`import { EmailNotifier, createValidatedConfigFromEnv } from "emaily-fi";

// Automatically load and validate environment variables
const notifier = new EmailNotifier(createValidatedConfigFromEnv());

// Alternative: Manual environment loading
const notifier = new EmailNotifier({
  emailUser: process.env.EMAIL_USER!,
  emailPass: process.env.EMAIL_PASS!,
  emailFrom: process.env.EMAIL_FROM,
  rateLimit: {
    maxPerSecond: Number(process.env.MAX_EMAILS_PER_SECOND) || 1,
    maxPerMinute: Number(process.env.MAX_EMAILS_PER_MINUTE) || 50,
  },
  enableQueue: process.env.ENABLE_QUEUE === "true",
});`}
                </CodeBlock>
              </div>

              {/* Different environments */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Environment-Specific Configuration
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Development
                    </h4>
                    <CodeBlock language="bash">
                      {`# .env.development
EMAIL_USER=dev@yourcompany.com
EMAIL_PASS=dev-app-password
MAX_EMAILS_PER_SECOND=1
ENABLE_QUEUE=false
LOG_LEVEL=debug`}
                    </CodeBlock>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Production
                    </h4>
                    <CodeBlock language="bash">
                      {`# .env.production
EMAIL_USER=noreply@yourcompany.com
EMAIL_PASS=secure-app-password
MAX_EMAILS_PER_SECOND=3
MAX_EMAILS_PER_MINUTE=150
ENABLE_QUEUE=true
LOG_LEVEL=info`}
                    </CodeBlock>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Configuration Best Practices */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Configuration Best Practices
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Security
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Never commit credentials to version control</li>
              <li>• Use environment variables for sensitive data</li>
              <li>• Rotate app passwords regularly</li>
              <li>• Enable 2FA on all email accounts</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Performance
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Enable queue for bulk operations</li>
              <li>• Set appropriate rate limits</li>
              <li>• Use connection pooling</li>
              <li>• Monitor send metrics</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Reliability
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Configure retry mechanisms</li>
              <li>• Set up error logging</li>
              <li>• Test with small batches first</li>
              <li>• Have backup providers ready</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Monitoring
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Implement custom logging</li>
              <li>• Track success/failure rates</li>
              <li>• Monitor queue performance</li>
              <li>• Set up alerts for failures</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuration;
