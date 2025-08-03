import React from "react";
import { Link } from "react-router-dom";
import {
  Download,
  Settings,
  Code,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import CodeBlock from "../components/CodeBlock";

const GettingStarted = () => {
  const steps = [
    {
      icon: Download,
      title: "Installation",
      description: "Install emaily-fi via npm or yarn",
      completed: true,
    },
    {
      icon: Settings,
      title: "Configuration",
      description: "Set up your email provider and credentials",
      completed: false,
    },
    {
      icon: Code,
      title: "First Email",
      description: "Send your first email notification",
      completed: false,
    },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Getting Started
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Get up and running with emaily-fi in just a few minutes. This guide
          will walk you through installation, configuration, and sending your
          first email.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-card border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Quick Setup Guide
        </h2>

        <div className="space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex items-start space-x-4">
                <div
                  className={`
                  w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                  ${
                    step.completed
                      ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                      : "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500"
                  }
                `}
                >
                  {step.completed ? (
                    <CheckCircle size={20} />
                  ) : (
                    <Icon size={20} />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1: Installation */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Step 1: Installation
        </h2>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Install emaily-fi using your preferred package manager:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                npm
              </h4>
              <CodeBlock language="bash">npm install emaily-fi</CodeBlock>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                yarn
              </h4>
              <CodeBlock language="bash">yarn add emaily-fi</CodeBlock>
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Configuration */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Step 2: Configuration
        </h2>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Set up your email provider. We'll start with Gmail SMTP as it's the
            most common:
          </p>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                1. Enable 2-Factor Authentication
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Go to your Google Account settings and enable 2-Factor
                Authentication if you haven't already.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                2. Generate App Password
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Visit{" "}
                <a
                  href="https://myaccount.google.com/apppasswords"
                  className="text-white hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google App Passwords
                </a>{" "}
                and generate a new app password for "Mail".
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                3. Environment Variables (Recommended)
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                Create a{" "}
                <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">
                  .env
                </code>{" "}
                file in your project root:
              </p>
              <CodeBlock language="bash">
                {`EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_FROM="Your Company <your-email@gmail.com>"
MAX_EMAILS_PER_SECOND=1
MAX_EMAILS_PER_MINUTE=50`}
              </CodeBlock>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: First Email */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Step 3: Send Your First Email
        </h2>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Now let's send your first email notification:
          </p>

          <CodeBlock language="typescript">
            {`import { EmailNotifier, createValidatedConfigFromEnv } from "emaily-fi";

// Load configuration from environment variables
const notifier = new EmailNotifier(createValidatedConfigFromEnv());

// Initialize the email service
await notifier.initialize();

// Send a welcome email
const result = await notifier.sendToOne(
  { 
    name: "John Doe", 
    email: "john@example.com" 
  },
  {
    subject: "Welcome to Our Service!",
    html: \`
      <h1>Welcome!</h1>
      <p>Thank you for joining our service. We're excited to have you!</p>
      <p>If you have any questions, feel free to reach out.</p>
    \`,
  }
);

if (result.success) {
  console.log("Welcome email sent successfully!");
  console.log("Message ID:", result.messageId);
} else {
  console.error("Failed to send email:", result.error);
}`}
          </CodeBlock>
        </div>
      </div>

      {/* Alternative Setup */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Alternative: Direct Configuration
        </h2>

        <div className="bg-gray-800 rounded-xl p-6 border">
          <p className="text-yellow-800 dark:text-yellow-200 mb-4">
            <strong> Security Note:</strong> For production applications, always
            use environment variables. This direct configuration approach is
            only recommended for development and testing.
          </p>

          <CodeBlock language="typescript">
            {`import { EmailNotifier } from "emaily-fi";

// Direct configuration (not recommended for production)
const notifier = new EmailNotifier({
  emailUser: "your-email@gmail.com",
  emailPass: "your-app-password",
  rateLimit: {
    maxPerSecond: 1,
    maxPerMinute: 50,
  },
  retryOptions: {
    maxRetries: 3,
    retryDelay: 1000,
  },
  enableQueue: true,
});

await notifier.initialize();`}
          </CodeBlock>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-gray-800 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Congratulations!
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          You've successfully set up emaily-fi and sent your first email. Here's
          what you can explore next:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/configuration"
            className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all"
          >
            <Settings className="text-white mr-3" size={20} />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Advanced Configuration
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Rate limiting, retry logic, and more
              </p>
            </div>
            <ArrowRight className="ml-auto text-gray-400" size={16} />
          </Link>

          <Link
            to="/examples"
            className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all"
          >
            <Code className="text-white mr-3" size={20} />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Real-World Examples
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Practical implementation patterns
              </p>
            </div>
            <ArrowRight className="ml-auto text-gray-400" size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GettingStarted;
