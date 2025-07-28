"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfigFromEnv = createConfigFromEnv;
exports.validateEnvConfig = validateEnvConfig;
exports.createValidatedConfigFromEnv = createValidatedConfigFromEnv;
require("dotenv/config");
/**
 * Creates a configuration object from environment variables
 * Supports the standard Gmail SMTP environment variable format
 */
function createConfigFromEnv() {
    return {
        // Primary Gmail SMTP configuration
        smtpHost: process.env.SMTP_HOST || "smtp.gmail.com",
        smtpPort: parseInt(process.env.SMTP_PORT || "587"),
        emailUser: process.env.EMAIL_USER,
        emailPass: process.env.EMAIL_PASS,
        emailFrom: process.env.EMAIL_FROM,
        // Rate limiting from environment
        rateLimit: {
            maxPerSecond: process.env.MAX_EMAILS_PER_SECOND
                ? parseInt(process.env.MAX_EMAILS_PER_SECOND)
                : undefined,
            maxPerMinute: process.env.MAX_EMAILS_PER_MINUTE
                ? parseInt(process.env.MAX_EMAILS_PER_MINUTE)
                : undefined,
            maxPerHour: process.env.MAX_EMAILS_PER_HOUR
                ? parseInt(process.env.MAX_EMAILS_PER_HOUR)
                : undefined,
        },
        // Retry configuration from environment
        retryOptions: {
            maxRetries: process.env.MAX_RETRIES
                ? parseInt(process.env.MAX_RETRIES)
                : 3,
            retryDelay: process.env.RETRY_DELAY
                ? parseInt(process.env.RETRY_DELAY)
                : 1000,
        },
        // Queue configuration
        enableQueue: process.env.ENABLE_QUEUE === "true",
    };
}
/**
 * Validates that required environment variables are set
 */
function validateEnvConfig() {
    const required = ["EMAIL_USER", "EMAIL_PASS"];
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
    }
}
/**
 * Creates a complete configuration with validation
 */
function createValidatedConfigFromEnv() {
    validateEnvConfig();
    return createConfigFromEnv();
}
