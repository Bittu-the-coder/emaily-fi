# Contributing to Email-Notify

We welcome contributions to emaily-fi! This document provides guidelines for contributing to the project.

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Git
- TypeScript knowledge

### Development Setup

1. **Fork and Clone**

   ```bash
   git clone https://github.com/yourusername/emaily-fi.git
   cd emaily-fi
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set up Environment**

   ```bash
   cp .env.example .env
   # Edit .env with your test credentials
   ```

4. **Run Tests**

   ```bash
   npm test
   ```

5. **Build Project**
   ```bash
   npm run build
   ```

## Development Workflow

### Branch Structure

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/feature-name` - Feature development
- `fix/bug-description` - Bug fixes
- `docs/improvement` - Documentation updates

### Workflow Steps

1. **Create Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**

   - Write code following our style guide
   - Add tests for new functionality
   - Update documentation

3. **Run Quality Checks**

   ```bash
   npm run lint        # ESLint
   npm test           # Jest tests
   npm run build      # TypeScript compilation
   ```

4. **Commit Changes**

   ```bash
   git add .
   git commit -m "feat: add new email provider support"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   # Create pull request on GitHub
   ```

## Code Standards

### TypeScript Guidelines

```typescript
// Use explicit types
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
}

// Use proper error handling
async function sendEmail(): Promise<SendResult> {
  try {
    // Implementation
    return { success: true, messageId: "123" };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Document public APIs
/**
 * Sends an email to a single recipient
 * @param user - The recipient user object
 * @param message - The message to send
 * @returns Promise resolving to send result
 */
async function sendToOne(
  user: User,
  message: MessageInput
): Promise<SendResult> {
  // Implementation
}
```

### Testing Standards

```typescript
// Unit tests for all public methods
describe("EmailNotifier", () => {
  beforeEach(() => {
    // Setup test environment
  });

  it("should send email successfully", async () => {
    // Arrange
    const user = { name: "Test", email: "test@example.com" };
    const message = { subject: "Test", body: "Test message" };

    // Act
    const result = await notifier.sendToOne(user, message);

    // Assert
    expect(result.success).toBe(true);
    expect(result.messageId).toBeDefined();
  });

  it("should handle errors gracefully", async () => {
    // Test error scenarios
  });
});

// Integration tests for complex workflows
describe("Email Integration", () => {
  it("should handle batch sending with rate limits", async () => {
    // Integration test
  });
});
```

### Documentation Standards

- Use JSDoc for all public APIs
- Include examples in documentation
- Update README for new features
- Add entries to CHANGELOG.md

## Contributing Areas

### 🎯 High Priority

- **New Email Providers**: SendGrid, Mailgun, SES
- **Template System**: Email template support
- **Performance**: Optimization and benchmarks
- **Testing**: Increase test coverage

### 📚 Documentation

- **Examples**: Real-world usage examples
- **Tutorials**: Step-by-step guides
- **API Docs**: Complete API documentation
- **Troubleshooting**: Common issues and solutions

### 🐛 Bug Fixes

- Check [GitHub Issues](https://github.com/yourusername/emaily-fi/issues)
- Look for `good-first-issue` label
- Reproduce bug before fixing
- Add regression tests

### ✨ Features

- **Queue Improvements**: Better queue management
- **Monitoring**: Built-in metrics and monitoring
- **Security**: Enhanced security features
- **Developer Experience**: Better debugging tools

## Adding New Email Providers

### Provider Structure

```typescript
// src/providers/new-provider.ts
import { EmailProvider } from "./base";
import { User, MessageInput, SendResult, Config } from "../types";

export class NewProvider extends EmailProvider {
  private client: any;

  async initialize(): Promise<void> {
    this.validateConfig();
    // Initialize provider client
  }

  validateConfig(): void {
    // Validate provider-specific config
    if (!this.config.apiKey) {
      throw new Error("API key required for NewProvider");
    }
  }

  async sendEmail(user: User, message: MessageInput): Promise<SendResult> {
    try {
      // Implement sending logic
      const result = await this.client.send({
        to: user.email,
        subject: message.subject,
        body: message.body,
      });

      return {
        success: true,
        messageId: result.id,
        recipient: user.email,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        recipient: user.email,
      };
    }
  }
}
```

### Provider Registration

```typescript
// src/providers/index.ts
export class ProviderFactory {
  static createProvider(config: Config): EmailProvider {
    switch (config.provider) {
      case "gmail":
        return new GmailProvider(config);
      case "sendgrid":
        return new SendGridProvider(config);
      case "new-provider":
        return new NewProvider(config);
      default:
        return new GmailProvider(config);
    }
  }
}
```

### Provider Tests

```typescript
// tests/providers/new-provider.test.ts
describe("NewProvider", () => {
  it("should send emails successfully", async () => {
    // Test implementation
  });

  it("should handle API errors", async () => {
    // Test error handling
  });

  it("should validate configuration", () => {
    // Test config validation
  });
});
```

## Testing Guidelines

### Test Structure

```
tests/
├── unit/              # Unit tests
│   ├── mailer.test.ts
│   ├── utils.test.ts
│   └── providers/
├── integration/       # Integration tests
│   ├── email-flow.test.ts
│   └── queue.test.ts
└── fixtures/          # Test data
    ├── users.json
    └── messages.json
```

### Test Environment

```typescript
// tests/setup.ts
import { EmailNotifier } from "../src";

export function createTestNotifier(overrides = {}) {
  return new EmailNotifier({
    emailUser: "test@example.com",
    emailPass: "test-password",
    logger: () => {}, // Silent logging
    ...overrides,
  });
}

export const testUsers = [
  { name: "Test User 1", email: "test1@example.com" },
  { name: "Test User 2", email: "test2@example.com" },
];

export const testMessage = {
  subject: "Test Subject",
  body: "Test message body",
};
```

### Mocking Guidelines

```typescript
// Mock external dependencies
jest.mock("nodemailer", () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn().mockResolvedValue({
      messageId: "test-message-id",
    }),
  })),
}));

// Use dependency injection for testability
class EmailNotifier {
  constructor(
    private config: Config,
    private providerFactory: ProviderFactory = new ProviderFactory()
  ) {
    // Constructor implementation
  }
}
```

## Documentation Guidelines

### README Updates

- Keep examples up-to-date
- Include new features in feature list
- Update installation instructions if needed
- Add links to new documentation

### API Documentation

````typescript
/**
 * Sends emails to a filtered subset of users
 *
 * @param users - Array of users to filter from
 * @param message - Message to send
 * @param filter - Function to filter users
 * @returns Promise resolving to batch send results
 *
 * @example
 * ```typescript
 * // Send to premium users only
 * const result = await notifier.sendFiltered(
 *   users,
 *   message,
 *   user => user.subscription === 'premium'
 * );
 * ```
 */
async sendFiltered(
  users: User[],
  message: MessageInput,
  filter: (user: User) => boolean
): Promise<BatchSendResult>
````

### Code Examples

- Include complete, runnable examples
- Show both success and error cases
- Demonstrate best practices
- Include TypeScript types

## Pull Request Process

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests pass
```

### Review Process

1. **Automated Checks**

   - CI/CD pipeline runs
   - All tests pass
   - Linting passes
   - Build succeeds

2. **Code Review**

   - At least one maintainer approval
   - Address all feedback
   - Update documentation if needed

3. **Merge**
   - Squash and merge preferred
   - Clear commit message
   - Update CHANGELOG.md

## Release Process

### Version Bumping

```bash
npm version patch   # Bug fixes
npm version minor   # New features
npm version major   # Breaking changes
```

### Changelog

```markdown
## [1.1.0] - 2024-01-15

### Added

- SendGrid provider support
- Template system
- Enhanced logging

### Changed

- Improved error messages
- Updated dependencies

### Fixed

- Rate limiting edge cases
- Memory leak in queue system
```

## Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help newcomers learn
- Focus on technical merit

### Communication

- Use GitHub Issues for bugs and features
- Use Discussions for questions and ideas
- Be clear and concise in communication
- Provide reproducible examples for bugs

## Getting Help

### For Contributors

- Join our Discord/Slack community
- Check existing issues and PRs
- Read the documentation thoroughly
- Ask questions in discussions

### For Maintainers

- Review PRs promptly
- Provide constructive feedback
- Help onboard new contributors
- Maintain project standards

## Recognition

Contributors will be recognized in:

- README contributors section
- Release notes
- Project documentation
- Community highlights

Thank you for contributing to emaily-fi! 🚀
