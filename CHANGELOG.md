# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2025-07-28

### Fixed

- 📚 Updated all documentation to use correct package name "emaily-fi"
- 🔗 Fixed GitHub repository URLs in all documentation files
- ✅ Updated placeholder text with actual repository information
- 📧 Corrected support email formatting in README

## [1.0.0] - 2024-01-28

### Added

- 🎉 Initial release of emaily-fi package
- ✅ Gmail SMTP provider support
- ✅ Multiple send modes (all, single, random, filtered)
- ✅ Smart rate limiting with per-second, per-minute, and per-hour controls
- ✅ Automatic retry mechanism with exponential backoff
- ✅ Optional async queue system for high-volume sends
- ✅ Comprehensive input validation using Zod
- ✅ Full TypeScript support with complete type definitions
- ✅ Rich message support (HTML, CC/BCC, attachments)
- ✅ Environment variable configuration support
- ✅ Custom logging integration
- ✅ Comprehensive test suite
- 📚 Complete documentation with API reference, examples, and troubleshooting guide

### Features

#### Core Functionality

- `EmailNotifier` class with full email sending capabilities
- Support for single user, bulk, random, and filtered sending
- Gmail SMTP integration with App Password support
- Extensible provider architecture for future email services

#### Rate Limiting & Reliability

- Token bucket rate limiting algorithm
- Configurable limits per second, minute, and hour
- Automatic retry with exponential backoff
- Comprehensive error handling and reporting

#### Queue System

- Optional async queue for non-blocking operations
- Configurable concurrency and processing rates
- Queue statistics and management (pause/resume)
- Memory-efficient processing for large batches

#### Developer Experience

- Full TypeScript support with strict typing
- Environment variable configuration helpers
- Custom logging interface for monitoring
- Detailed error messages and debugging information

#### Message Features

- Plain text and HTML email support
- CC and BCC recipient support
- File attachment support with multiple formats
- Custom headers and reply-to configuration

### Configuration

#### Modern Configuration Format

```typescript
{
  emailUser: string;      // Gmail email address
  emailPass: string;      // Gmail App Password
  emailFrom?: string;     // Display name format
  smtpHost?: string;      // SMTP host (default: smtp.gmail.com)
  smtpPort?: number;      // SMTP port (default: 587)
  provider?: string;      // Email provider (gmail)
  rateLimit?: object;     // Rate limiting configuration
  retryOptions?: object;  // Retry configuration
  enableQueue?: boolean;  // Enable queue system
  logger?: function;      // Custom logging function
}
```

#### Environment Variable Support

- `EMAIL_USER` - Gmail email address
- `EMAIL_PASS` - Gmail App Password
- `EMAIL_FROM` - Display name and email format
- `SMTP_HOST` - SMTP host override
- `SMTP_PORT` - SMTP port override
- `MAX_EMAILS_PER_SECOND` - Rate limit per second
- `MAX_EMAILS_PER_MINUTE` - Rate limit per minute
- `MAX_EMAILS_PER_HOUR` - Rate limit per hour
- `MAX_RETRIES` - Maximum retry attempts
- `RETRY_DELAY` - Initial retry delay in milliseconds
- `ENABLE_QUEUE` - Enable queue system

#### Legacy Support

- Backward compatibility with `senderEmail` and `senderPassword`
- Automatic migration from legacy to modern configuration
- Deprecation warnings for old configuration format

### Documentation

#### Complete Documentation Suite

- **README.md** - Comprehensive overview and quick start guide
- **API.md** - Complete API reference with examples
- **CONFIGURATION.md** - Detailed configuration guide
- **EXAMPLES.md** - Real-world usage examples and patterns
- **TROUBLESHOOTING.md** - Common issues and solutions
- **MIGRATION.md** - Migration guide from other email libraries
- **CONTRIBUTING.md** - Contributing guidelines and development setup

#### Code Examples

- Basic email sending examples
- Batch processing examples
- Rate limiting and queue management
- Error handling patterns
- Environment-based configuration
- Integration with popular frameworks
- Testing and mocking examples

### Testing

#### Comprehensive Test Suite

- Unit tests for all core functionality
- Integration tests for email flows
- Mock implementations for testing
- Test utilities and helpers
- Coverage reporting and quality gates

#### Quality Assurance

- ESLint configuration with TypeScript support
- Prettier code formatting
- Jest testing framework
- TypeScript strict mode compilation
- Automated CI/CD pipeline

### Performance

#### Optimizations

- Memory-efficient user processing
- Non-blocking async operations
- Configurable concurrency limits
- Streaming support for large datasets
- Optimized rate limiting algorithm

#### Monitoring

- Queue statistics and metrics
- Send/failure tracking
- Performance logging
- Debug mode support
- Custom monitoring integration

### Security

#### Security Features

- Environment variable configuration
- No credential storage in code
- Gmail App Password support
- Input validation and sanitization
- Secure SMTP connection (TLS)

#### Best Practices

- Security documentation and guides
- Credential rotation recommendations
- Production deployment guidelines
- Error handling without data leakage

## [Unreleased]

### Planned Features

#### Additional Providers

- [ ] SendGrid provider support
- [ ] Mailgun provider support
- [ ] Amazon SES provider support
- [ ] Custom SMTP provider support

#### Template System

- [ ] HTML template engine integration
- [ ] Template variable substitution
- [ ] Template inheritance and layouts
- [ ] Dynamic content generation

#### Enhanced Features

- [ ] Email tracking and analytics
- [ ] Webhook support for delivery events
- [ ] Advanced filtering and segmentation
- [ ] Scheduled email sending
- [ ] Email preview and testing tools

#### Performance Improvements

- [ ] Connection pooling for SMTP
- [ ] Batch processing optimizations
- [ ] Caching and memoization
- [ ] Performance benchmarking tools

#### Developer Experience

- [ ] CLI tool for testing and management
- [ ] VS Code extension with snippets
- [ ] GraphQL integration examples
- [ ] More framework integration guides

---

## Version History

### Release Schedule

- **Major versions** (1.x.x): Breaking changes, major new features
- **Minor versions** (x.1.x): New features, improvements
- **Patch versions** (x.x.1): Bug fixes, security updates

### Support Policy

- **Current version**: Full support with new features and bug fixes
- **Previous major version**: Security updates and critical bug fixes
- **Older versions**: Community support only

### Migration Policy

- Breaking changes will be clearly documented
- Migration guides provided for major version updates
- Deprecation warnings for features being removed
- Backward compatibility maintained when possible

---

## Links

- [GitHub Repository](https://github.com/Bittu-the-coder/emaily-fi)
- [npm Package](https://www.npmjs.com/package/emaily-fi)
- [Documentation](./docs/)
- [Issues](https://github.com/Bittu-the-coder/emaily-fi/issues)
- [Discussions](https://github.com/Bittu-the-coder/emaily-fi/discussions)
