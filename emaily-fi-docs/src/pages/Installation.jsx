import React from "react";
import { Package, Download, CheckCircle, Terminal } from "lucide-react";
import CodeBlock from "../components/CodeBlock";

const Installation = () => {
  const installMethods = [
    {
      name: "npm",
      command: "npm install emaily-fi",
      description: "Most common package manager for Node.js projects",
    },
    {
      name: "yarn",
      command: "yarn add emaily-fi",
      description: "Fast, reliable, and secure dependency management",
    },
    {
      name: "pnpm",
      command: "pnpm add emaily-fi",
      description: "Efficient package manager with disk space optimization",
    },
    {
      name: "bun",
      command: "bun add emaily-fi",
      description: "Ultra-fast JavaScript runtime and package manager",
    },
  ];

  const requirements = [
    {
      name: "Node.js",
      version: "≥ 16.0.0",
      status: "required",
      description: "Runtime environment for server-side JavaScript",
    },
    {
      name: "TypeScript",
      version: "≥ 4.5.0",
      status: "recommended",
      description: "For full type safety and IntelliSense support",
    },
    {
      name: "Gmail Account",
      version: "with 2FA",
      status: "required",
      description: "For SMTP authentication and app passwords",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center space-x-3 bg-primary bg-opacity-10 px-4 py-2 rounded-full">
          <Download className="text-white" size={20} />
          <span className="text-white font-medium">Installation Guide</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
          Install emaily-fi
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Get started with emaily-fi in seconds. Choose your preferred package
          manager and follow our step-by-step installation guide.
        </p>
      </div>

      {/* System Requirements */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          System Requirements
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {requirements.map((req, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle
                    className={`${
                      req.status === "required"
                        ? "text-green-500"
                        : "text-blue-500"
                    }`}
                    size={20}
                  />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {req.name}
                  </h3>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    req.status === "required"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  }`}
                >
                  {req.status}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                {req.description}
              </p>
              <p className="font-mono text-sm text-gray-500 dark:text-gray-400">
                {req.version}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Installation Methods */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Choose Your Package Manager
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {installMethods.map((method, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary transition-colors"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                  <Terminal className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {method.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {method.description}
                  </p>
                </div>
              </div>
              <CodeBlock language="bash">{method.command}</CodeBlock>
            </div>
          ))}
        </div>
      </div>

      {/* Verification */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Verify Installation
        </h2>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            After installation, verify that emaily-fi is properly installed by
            creating a simple test file:
          </p>

          <CodeBlock language="typescript">
            {`// test-install.js
import { EmailNotifier } from "emaily-fi";

console.log("emaily-fi successfully installed!");
console.log("Version:", require("emaily-fi/package.json").version);

// Basic type checking (TypeScript)
const notifier = new EmailNotifier({
  emailUser: "test@example.com",
  emailPass: "password",
});

console.log(" Installation verified!");`}
          </CodeBlock>

          <div className="mt-4 p-4 bg-green-900 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="text-green-600" size={16} />
              <span className="text-green-800 dark:text-green-200 font-medium">
                Run the test:
              </span>
            </div>
            <CodeBlock language="bash" className="mt-2">
              node test-install.js
            </CodeBlock>
          </div>
        </div>
      </div>

      {/* Development Dependencies */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Development Dependencies
        </h2>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            For TypeScript projects, you might want to install additional type
            definitions:
          </p>

          <CodeBlock language="bash">
            {`# TypeScript (if not already installed)
npm install -D typescript

# Node.js type definitions
npm install -D @types/node

# For email testing and mocking
npm install -D @types/nodemailer jest`}
          </CodeBlock>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-gray-800 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Installation Complete!
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Great! You've successfully installed emaily-fi. Now you're ready to
          configure your email settings and send your first notification.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="/getting-started"
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors shadow-button"
          >
            <Package size={20} className="mr-2" />
            Getting Started Guide
          </a>
          <a
            href="/configuration"
            className="inline-flex items-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:border-primary hover:text-white transition-colors"
          >
            Configuration Options
          </a>
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Troubleshooting
        </h2>

        <div className="space-y-4">
          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <summary className="px-6 py-4 font-medium text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              Installation fails with permission errors
            </summary>
            <div className="px-6 pb-4 text-gray-600 dark:text-gray-300">
              <p className="mb-2">
                Try using sudo (Linux/Mac) or run as administrator (Windows):
              </p>
              <CodeBlock language="bash">sudo npm install emaily-fi</CodeBlock>
              <p className="mt-2">Or use npx to avoid global permissions:</p>
              <CodeBlock language="bash">
                npx create-react-app my-app && cd my-app && npm install
                emaily-fi
              </CodeBlock>
            </div>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <summary className="px-6 py-4 font-medium text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              Module not found after installation
            </summary>
            <div className="px-6 pb-4 text-gray-600 dark:text-gray-300">
              <p className="mb-2">Ensure you're importing correctly:</p>
              <CodeBlock language="typescript">
                {`//  Correct
import { EmailNotifier } from "emaily-fi";

//  Incorrect
import EmailNotifier from "emaily-fi";`}
              </CodeBlock>
            </div>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <summary className="px-6 py-4 font-medium text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              TypeScript compilation errors
            </summary>
            <div className="px-6 pb-4 text-gray-600 dark:text-gray-300">
              <p className="mb-2">Make sure your tsconfig.json includes:</p>
              <CodeBlock language="json">
                {`{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"],
    "module": "commonjs",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}`}
              </CodeBlock>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default Installation;
