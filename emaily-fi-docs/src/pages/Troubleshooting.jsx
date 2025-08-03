import React, { useState } from "react";
import {
  AlertTriangle,
  Search,
  CheckCircle,
  XCircle,
  Info,
  HelpCircle,
} from "lucide-react";
import CodeBlock from "../components/CodeBlock";

const Troubleshooting = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Issues" },
    { id: "auth", name: "Authentication" },
    { id: "rate-limit", name: "Rate Limiting" },
    { id: "sending", name: "Email Sending" },
    { id: "config", name: "Configuration" },
    { id: "performance", name: "Performance" },
  ];

  const troubleshootingItems = [
    {
      id: "auth-invalid-credentials",
      category: "auth",
      title: "Invalid login: Application-specific password required",
      severity: "error",
      description: "Gmail rejects authentication with regular password",
      symptoms: [
        "Authentication failed",
        "Invalid login",
        "535 5.7.3 Authentication unsuccessful",
      ],
      solutions: [
        {
          title: "Enable 2-Factor Authentication",
          description: "Gmail requires 2FA to use app passwords",
          code: `1. Go to Google Account settings
2. Security → 2-Step Verification
3. Enable 2FA with phone or authenticator app`,
        },
        {
          title: "Generate App Password",
          description: "Create a specific password for emaily-fi",
          code: `1. Google Account → Security → App passwords
2. Select "Mail" and "Other (custom name)"
3. Name it "emaily-fi" or your app name
4. Copy the 16-character password
5. Use this password in EMAIL_PASS`,
        },
        {
          title: "Update Environment Variables",
          code: `# .env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop  # 16-character app password (spaces optional)`,
        },
      ],
    },
    {
      id: "rate-limit-blocked",
      category: "rate-limit",
      title: "Gmail temporary block / Rate limit exceeded",
      severity: "warning",
      description:
        "Gmail temporarily blocks your account for sending too many emails",
      symptoms: [
        "Temporary block",
        "Rate limit exceeded",
        "Too many emails sent",
      ],
      solutions: [
        {
          title: "Reduce Rate Limits",
          description: "Lower your sending rate to avoid blocks",
          code: `const notifier = new EmailNotifier({
  // ... other config
  rateLimit: {
    maxPerSecond: 1,     // Conservative: 1 email per second
    maxPerMinute: 30,    // Reduce from default 50
    maxPerHour: 300,     // Reduce from default 500
  },
});`,
        },
        {
          title: "Wait Before Retrying",
          description: "Gmail blocks usually last 24-48 hours",
          code: `// Wait 24-48 hours before sending again
// Monitor your Google Account for security alerts
// Consider using SendGrid for higher volume`,
        },
        {
          title: "Use Multiple Accounts",
          description: "Distribute load across multiple Gmail accounts",
          code: `// Rotate between multiple email accounts
const accounts = [
  { user: 'account1@gmail.com', pass: 'app-password-1' },
  { user: 'account2@gmail.com', pass: 'app-password-2' },
];

// Use different accounts for different types of emails`,
        },
      ],
    },
    {
      id: "emails-not-sending",
      category: "sending",
      title: "Emails not being sent / No error messages",
      severity: "error",
      description: "Emails appear to queue but never actually send",
      symptoms: ["No emails received", "Queue appears stuck", "No error logs"],
      solutions: [
        {
          title: "Check Initialization",
          description: "Ensure you call initialize() before sending",
          code: `const notifier = new EmailNotifier(config);

// REQUIRED: Must initialize before sending
await notifier.initialize();

// Now you can send emails
const result = await notifier.sendToOne(user, message);`,
        },
        {
          title: "Enable Logging",
          description: "Add custom logger to see what's happening",
          code: `const notifier = new EmailNotifier({
  // ... other config
  logger: (message, level) => {
    console.log(\`[\${level.toUpperCase()}] \${message}\`);
    
    // Optional: Write to file
    if (level === 'error') {
      fs.appendFileSync('email-errors.log', \`\${new Date().toISOString()} \${message}\\n\`);
    }
  },
});`,
        },
        {
          title: "Check Return Values",
          description: "Always check the result object",
          code: `const result = await notifier.sendToOne(user, message);

console.log('Send result:', result);

if (result.success) {
  console.log('✅ Email sent:', result.messageId);
} else {
  console.error('❌ Send failed:', result.error);
  // Handle the error appropriately
}`,
        },
      ],
    },
    {
      id: "queue-performance",
      category: "performance",
      title: "Slow email sending / Queue processing issues",
      severity: "warning",
      description: "Emails take too long to send or queue appears stuck",
      symptoms: ["Slow sending", "Queue backlog", "Timeouts"],
      solutions: [
        {
          title: "Optimize Rate Limits",
          description: "Balance speed with provider limits",
          code: `// For Gmail (conservative)
rateLimit: {
  maxPerSecond: 1,
  maxPerMinute: 50,
}

// For SendGrid (more aggressive)
rateLimit: {
  maxPerSecond: 10,
  maxPerMinute: 300,
}`,
        },
        {
          title: "Enable Queue for Bulk Operations",
          description: "Use queue system for better performance",
          code: `const notifier = new EmailNotifier({
  // ... other config
  enableQueue: true,  // Enable for bulk sending
});

// Monitor queue status
const stats = notifier.getQueueStats();
console.log(\`Queue: \${stats?.size} pending, \${stats?.pending} processing\`);`,
        },
        {
          title: "Reduce Retry Attempts",
          description: "Avoid excessive retries for failed emails",
          code: `const notifier = new EmailNotifier({
  // ... other config
  retryOptions: {
    maxRetries: 2,      // Reduce from default 3
    retryDelay: 1000,   // 1 second delay
  },
});`,
        },
      ],
    },
    {
      id: "typescript-errors",
      category: "config",
      title: "TypeScript compilation errors",
      severity: "error",
      description: "Type errors when using emaily-fi in TypeScript projects",
      symptoms: [
        "Type 'any' is not assignable",
        "Module not found",
        "Property does not exist",
      ],
      solutions: [
        {
          title: "Update tsconfig.json",
          description: "Ensure compatible TypeScript configuration",
          code: `{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"],
    "module": "commonjs",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "skipLibCheck": true
  }
}`,
        },
        {
          title: "Use Correct Import Syntax",
          description: "Import types and classes correctly",
          code: `// ✅ Correct imports
import { EmailNotifier, createValidatedConfigFromEnv } from 'emaily-fi';
import type { User, MessageInput, SendResult } from 'emaily-fi';

// ❌ Incorrect imports
import EmailNotifier from 'emaily-fi'; // Wrong default import
import * as emaily from 'emaily-fi';   // Avoid namespace import`,
        },
        {
          title: "Type Your Variables",
          description: "Properly type your user and message objects",
          code: `import type { User, MessageInput } from 'emaily-fi';

const user: User = {
  name: 'John Doe',
  email: 'john@example.com',
};

const message: MessageInput = {
  subject: 'Welcome!',
  html: '<h1>Welcome!</h1>',
};`,
        },
      ],
    },
    {
      id: "html-not-rendering",
      category: "sending",
      title: "HTML emails not rendering properly",
      severity: "warning",
      description: "Emails display as plain text or HTML is broken",
      symptoms: [
        "HTML shows as code",
        "Styling not applied",
        "Images not loading",
      ],
      solutions: [
        {
          title: "Use Both HTML and Plain Text",
          description: "Always provide fallback text content",
          code: `const message = {
  subject: 'Welcome!',
  body: 'Welcome to our service! Visit us at: https://example.com',  // Plain text fallback
  html: \`
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h1 style="color: #ef8354;">Welcome!</h1>
        <p>Welcome to our service!</p>
        <a href="https://example.com" style="background: #ef8354; color: white; padding: 10px 20px; text-decoration: none;">
          Visit Us
        </a>
      </body>
    </html>
  \`,
};`,
        },
        {
          title: "Use Inline CSS",
          description: "Many email clients don't support external CSS",
          code: `// ✅ Good: Inline styles
<div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
  <h2 style="color: #333; margin: 0 0 10px;">Title</h2>
  <p style="color: #666; line-height: 1.5;">Content</p>
</div>

// ❌ Bad: External CSS or classes
<div class="container">  <!-- Won't work in most email clients -->
  <h2>Title</h2>
</div>`,
        },
        {
          title: "Test Across Email Clients",
          description: "Different clients render HTML differently",
          code: `// Test your emails in:
// - Gmail (web, mobile app)
// - Outlook (desktop, web)
// - Apple Mail
// - Yahoo Mail
// - Mobile clients (iOS Mail, Android Gmail)

// Use tools like:
// - Litmus (paid)
// - Email on Acid (paid)
// - Can I Email (free reference)`,
        },
      ],
    },
    {
      id: "environment-variables",
      category: "config",
      title: "Environment variables not loading",
      severity: "error",
      description: "Configuration fails to load from .env file",
      symptoms: [
        "Config validation failed",
        "Required variables missing",
        "Cannot read property of undefined",
      ],
      solutions: [
        {
          title: "Install and Configure dotenv",
          description: "Ensure dotenv is properly set up",
          code: `// Install dotenv
npm install dotenv

// Load at the top of your main file
require('dotenv').config();
// or for ES modules:
import 'dotenv/config';

// Then use emaily-fi
import { EmailNotifier, createValidatedConfigFromEnv } from 'emaily-fi';`,
        },
        {
          title: "Check .env File Location",
          description: "Ensure .env is in the correct location",
          code: `# .env file should be in your project root
# Same directory as package.json

your-project/
├── package.json
├── .env              ← Here
├── src/
│   └── index.js
└── node_modules/`,
        },
        {
          title: "Verify Environment Variable Names",
          description: "Use exact variable names expected by emaily-fi",
          code: `# .env - Required variables
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Optional variables
EMAIL_FROM="Your Company <your-email@gmail.com>"
MAX_EMAILS_PER_SECOND=1
MAX_EMAILS_PER_MINUTE=50
ENABLE_QUEUE=true`,
        },
      ],
    },
  ];

  const filteredItems = troubleshootingItems.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      searchTerm === "" ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.symptoms.some((symptom) =>
        symptom.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "error":
        return <XCircle className="text-red-500" size={20} />;
      case "warning":
        return <AlertTriangle className="text-yellow-500" size={20} />;
      case "info":
        return <Info className="text-blue-500" size={20} />;
      default:
        return <HelpCircle className="text-gray-500" size={20} />;
    }
  };

  const getSeverityBg = (severity) => {
    switch (severity) {
      case "error":
        return "bg-gray-900 border-red-800";
      case "warning":
        return "bg-gray-900  border-gray-800";
      case "info":
        return "bg-blue-900 border-blue-800";
      default:
        return "bg-gray-800 border-gray-700";
    }
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center space-x-3 bg-primary bg-opacity-10 px-4 py-2 rounded-full">
          <AlertTriangle className="text-white" size={20} />
          <span className="text-white font-medium">Troubleshooting Guide</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Troubleshooting
        </h1>

        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Common issues and solutions for emaily-fi. Find quick fixes for
          authentication, rate limiting, configuration, and performance
          problems.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search troubleshooting guides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? "bg-primary text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-gray-400">
        Found {filteredItems.length} troubleshooting guide
        {filteredItems.length !== 1 ? "s" : ""}
        {searchTerm && ` for "${searchTerm}"`}
      </div>

      {/* Troubleshooting Items */}
      <div className="space-y-8">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Search className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-white mb-2">
              No results found
            </h3>
            <p className="text-gray-400">
              Try different search terms or browse all categories
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`border rounded-xl p-6 ${getSeverityBg(
                item.severity
              )}`}
            >
              {/* Header */}
              <div className="flex items-start space-x-3 mb-4">
                {getSeverityIcon(item.severity)}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 mt-1">{item.description}</p>
                </div>
              </div>

              {/* Symptoms */}
              <div className="mb-6">
                <h4 className="font-semibold text-white mb-2">🔍 Symptoms</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {item.symptoms.map((symptom, index) => (
                    <li key={index} className="text-gray-300">
                      {symptom}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Solutions */}
              <div className="space-y-6">
                <h4 className="font-semibold text-white">Solutions</h4>

                {item.solutions.map((solution, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <h5 className="font-medium text-white">
                        {solution.title}
                      </h5>
                    </div>

                    {solution.description && (
                      <p className="text-gray-300 ml-8">
                        {solution.description}
                      </p>
                    )}

                    {solution.code && (
                      <div className="ml-8">
                        <CodeBlock
                          language={
                            solution.code.includes("npm") ||
                            solution.code.includes("#")
                              ? "bash"
                              : "typescript"
                          }
                        >
                          {solution.code}
                        </CodeBlock>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Diagnostic */}
      <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">
          🔧 Quick Diagnostic
        </h2>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Run this diagnostic script to check your setup:
          </h3>

          <CodeBlock language="typescript">
            {`// diagnostic.js - Run this to check your emaily-fi setup
import { EmailNotifier, createValidatedConfigFromEnv } from 'emaily-fi';

async function runDiagnostic() {
  console.log('🔍 Running emaily-fi diagnostic...');
  
  // 1. Check environment variables
  console.log('\\n1. Environment Variables:');
  const requiredVars = ['EMAIL_USER', 'EMAIL_PASS'];
  const optionalVars = ['EMAIL_FROM', 'MAX_EMAILS_PER_SECOND', 'ENABLE_QUEUE'];
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    console.log(\`   \${varName}: \${value ? '✅ Set' : '❌ Missing'}\`);
  });
  
  optionalVars.forEach(varName => {
    const value = process.env[varName];
    console.log(\`   \${varName}: \${value ? \`✅ \${value}\` : '⚠️  Not set (using default)'}\`);
  });

  // 2. Test configuration loading
  console.log('\\n2. Configuration Loading:');
  try {
    const config = createValidatedConfigFromEnv();
    console.log('   ✅ Configuration loaded successfully');
    console.log(\`   📧 Email User: \${config.emailUser}\`);
    console.log(\`   🔒 Password: \${config.emailPass ? 'Set (hidden)' : 'Missing'}\`);
  } catch (error) {
    console.log(\`   ❌ Configuration failed: \${error.message}\`);
    return;
  }

  // 3. Test initialization
  console.log('\\n3. Service Initialization:');
  try {
    const notifier = new EmailNotifier(createValidatedConfigFromEnv({
      logger: (msg, level) => console.log(\`   [LOG] [\${level}] \${msg}\`),
    }));
    
    await notifier.initialize();
    console.log('   ✅ Service initialized successfully');
    
    // 4. Test basic functionality (dry run)
    console.log('\\n4. Basic Functionality Test:');
    console.log('   ℹ️  Skipping actual email send (dry run)');
    console.log('   ✅ All systems appear operational');
    
  } catch (error) {
    console.log(\`   ❌ Initialization failed: \${error.message}\`);
    
    // Common error suggestions
    if (error.message.includes('authentication')) {
      console.log('\\n💡 Suggestions:');
      console.log('   - Check your Gmail app password');
      console.log('   - Ensure 2FA is enabled on your Google account');
      console.log('   - Verify EMAIL_USER and EMAIL_PASS are correct');
    }
  }
  
  console.log('\\n🏁 Diagnostic complete!');
}

// Run the diagnostic
runDiagnostic().catch(console.error);`}
          </CodeBlock>

          <div className="mt-4 p-4 bg-gray-800 border border-blue-800 rounded-lg">
            <h4 className="font-semibold text-blue-200 mb-2">
              How to run the diagnostic:
            </h4>
            <CodeBlock language="bash">
              {`# Save the code above as diagnostic.js
# Then run:
node diagnostic.js

# Or with ts-node:
npx ts-node diagnostic.ts`}
            </CodeBlock>
          </div>
        </div>
      </div>

      {/* Get More Help */}
      <div className="bg-gray-800 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-4">Still Need Help?</h2>
        <p className="text-gray-300 mb-6">
          If you couldn't find a solution here, our community and maintainers
          are ready to help.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="https://github.com/bittu-the-coder/emaily-fi/discussions"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-primary transition-colors"
          >
            <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center mr-3">
              <HelpCircle className="text-blue-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-white">GitHub Discussions</h3>
              <p className="text-sm text-gray-300">
                Ask questions and get community help
              </p>
            </div>
          </a>

          <a
            href="https://github.com/bittu-the-coder/emaily-fi/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-primary transition-colors"
          >
            <div className="w-10 h-10 bg-red-900 rounded-lg flex items-center justify-center mr-3">
              <AlertTriangle className="text-red-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-white">Report a Bug</h3>
              <p className="text-sm text-gray-300">
                Found a bug? Let us know on GitHub
              </p>
            </div>
          </a>
        </div>

        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h3 className="font-semibold text-yellow-200 mb-2">
            💡 When asking for help, please include:
          </h3>
          <ul className="space-y-1 text-yellow-300 text-sm">
            <li>• Your emaily-fi version (check package.json)</li>
            <li>
              • Node.js version (run{" "}
              <code className="bg-gray-800 px-1 rounded">node --version</code>)
            </li>
            <li>• Complete error messages (not just "it doesn't work")</li>
            <li>• Your configuration (remove sensitive data)</li>
            <li>• Code that reproduces the issue</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Troubleshooting;
