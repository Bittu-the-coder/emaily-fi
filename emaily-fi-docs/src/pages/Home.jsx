import React from "react";
import { Link } from "react-router-dom";
import { Rocket, Package, Shield, Zap, Code, Users } from "lucide-react";
import CodeBlock from "../components/CodeBlock";

const Home = () => {
  const features = [
    {
      icon: Package,
      title: "Production Ready",
      description:
        "Battle-tested with comprehensive error handling and retry logic for enterprise applications.",
    },
    {
      icon: Zap,
      title: "High Performance",
      description:
        "Async queue system capable of handling thousands of emails with smart rate limiting.",
    },
    {
      icon: Shield,
      title: "Enterprise Grade",
      description:
        "Advanced security features, rate limiting, and retry mechanisms built-in.",
    },
    {
      icon: Code,
      title: "Developer Friendly",
      description:
        "Full TypeScript support, intuitive API, and comprehensive documentation.",
    },
    {
      icon: Users,
      title: "Multiple Send Modes",
      description:
        "Send to all, single user, random subset, or filtered users with flexible targeting.",
    },
    {
      icon: Rocket,
      title: "Easy Setup",
      description:
        "Get started in minutes with Gmail SMTP, Gmail OAuth2, or SendGrid providers.",
    },
  ];

  const quickStartCode = `import { EmailNotifier } from "emaily-fi";

// Option 1: Gmail SMTP (requires app password)
const notifier = new EmailNotifier({
  emailUser: "your-email@gmail.com",
  emailPass: "your-app-password",
  rateLimit: { maxPerSecond: 1 },
});

// Option 2: Gmail OAuth2 (recommended for production)
const notifier = new EmailNotifier({
  provider: "gmail-oauth2",
  emailUser: "your-email@gmail.com",
  gmailOAuth2: {
    clientId: "your-google-client-id.apps.googleusercontent.com",
    clientSecret: "your-google-client-secret",
    refreshToken: "your-refresh-token",
  },
});

await notifier.initialize();

// Send your first email
const result = await notifier.sendToOne(
  { name: "Alice", email: "alice@example.com" },
  {
    subject: "Welcome!",
    html: "<h1>Welcome!</h1><p>Thanks for joining us.</p>",
  }
);

console.log(result.success ? "✅ Sent!" : \`❌ Failed: \${result.error}\`);`;

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center space-x-3 bg-primary bg-opacity-10 px-4 py-2 rounded-full">
          <Package className="text-white" size={20} />
          <span className="text-white font-medium">emaily-fi v1.0.2</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
          Production-Ready Email
          <br />
          <span className="text-white">Notifications</span>
        </h1>

        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          A powerful TypeScript package for sending email notifications with
          enterprise-grade features including Gmail SMTP, Gmail OAuth2, SendGrid
          support, rate limiting, retry mechanisms, and queue system.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/getting-started"
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors shadow-button"
          >
            <Rocket size={20} className="mr-2" />
            Get Started
          </Link>

          <a
            href="https://github.com/bittu-the-coder/emaily-fi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 border-2 border-gray-600 text-gray-300 font-medium rounded-lg hover:border-primary hover:text-white transition-colors"
          >
            View on GitHub
          </a>
        </div>
      </div>

      {/* Quick Start */}
      <div className="bg-gray-800 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Quick Start</h2>

        <div className="grid grid-cols-1  gap-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Install via npm
            </h3>
            <CodeBlock language="bash">npm install emaily-fi</CodeBlock>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Basic Usage
            </h3>
            <CodeBlock language="typescript">{quickStartCode}</CodeBlock>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Why Choose emaily-fi?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-gray-800 p-6 rounded-xl shadow-card border border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-800 rounded-xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-white mb-2">1.0.2</div>
            <div className="text-gray-300">Latest Version</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">100%</div>
            <div className="text-gray-300">TypeScript</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">MIT</div>
            <div className="text-gray-300">Open Source</div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-6 bg-gray-800 rounded-xl p-12">
        <h2 className="text-3xl font-bold text-white">
          Ready to Get Started?
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Join developers who trust emaily-fi for their email notification
          needs. Get up and running in just a few minutes.
        </p>
        <Link
          to="/installation"
          className="inline-flex items-center px-8 py-4 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors shadow-button text-lg"
        >
          Start Building
          <Rocket size={20} className="ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default Home;
