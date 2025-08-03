# emaily-fi

A powerful, production-ready TypeScript package for sending email notifications with enterprise-grade features including Gmail SMTP, Gmail OAuth2, SendGrid support, rate limiting, retry mechanisms, queue system, and extensible provider architecture.

[![npm version](https://badge.fury.io/js/emaily-fi.svg)](https://badge.fury.io/js/emaily-fi)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Documentation](https://img.shields.io/badge/Docs-Available-brightgreen.svg)](https://emaily-fi.vercel.app/)

## 📚 Documentation

🔗 **[Complete Documentation & Setup Guide](https://emaily-fi.vercel.app/)**

Visit our comprehensive documentation website for:

- 🚀 Quick Start Guide
- ⚙️ Configuration Options
- 📖 API Reference
- 💡 Examples & Tutorials
- 🔧 Gmail OAuth2 Setup
- 🛠️ Troubleshooting

## 🌟 Why emaily-fi?

**emaily-fi** is designed for developers who need a reliable, scalable email solution without the complexity. Whether you're building a startup MVP or an enterprise application, this package provides the tools you need for professional email delivery.

### ✨ Key Features

- **🚀 Multiple Email Providers** - Gmail SMTP, Gmail OAuth2, SendGrid
- **🛡️ Enterprise Grade** - Rate limiting, retry mechanisms, and security best practices
- **⚡ High Performance** - Async queue system for handling thousands of emails
- **🔧 Developer Friendly** - Full TypeScript support, intuitive API
- **📈 Scalable** - From single emails to bulk campaigns
- **🎯 Flexible** - Multiple send modes for different use cases

## 📦 Installation

```bash
npm install emaily-fi
```

## 🚀 Quick Start

```typescript
import { EmailNotifier } from "emaily-fi";

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

// Option 3: SendGrid
const notifier = new EmailNotifier({
  provider: "sendgrid",
  sendGridApiKey: "SG.your-sendgrid-api-key",
  emailFrom: "verified-sender@yourdomain.com",
});

await notifier.initialize();

// Send email
const result = await notifier.sendToOne(
  { name: "Alice", email: "alice@example.com" },
  {
    subject: "Welcome!",
    body: "Thank you for joining us.",
    html: "<h1>Welcome!</h1><p>Thank you for joining us.</p>",
  }
);
```

## 📋 Supported Providers

| Provider         | Security  | Setup Difficulty | Recommended For                    |
| ---------------- | --------- | ---------------- | ---------------------------------- |
| **Gmail OAuth2** | 🔒 High   | Medium           | Production apps, web applications  |
| **Gmail SMTP**   | 🔒 Medium | Easy             | Development, personal projects     |
| **SendGrid**     | 🔒 High   | Easy             | High-volume, professional services |

## 🔗 Links

- **📚 [Documentation](https://emaily-fi.vercel.app/)** - Complete setup and API reference
- **📦 [NPM Package](https://www.npmjs.com/package/emaily-fi)** - Install and version info
- **🐛 [GitHub Issues](https://github.com/Bittu-the-coder/emaily-fi/issues)** - Bug reports and feature requests
- **💬 [GitHub Discussions](https://github.com/Bittu-the-coder/emaily-fi/discussions)** - Community support

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## 📝 License

MIT © [Bittu-the-coder](https://github.com/Bittu-the-coder)

---

<div align="center">

**📚 [Visit Documentation](https://emaily-fi.vercel.app/) for complete setup instructions and examples**

</div>
