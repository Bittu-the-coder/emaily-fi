import { Config } from "./types";
import "dotenv/config";
/**
 * Creates a configuration object from environment variables
 * Supports the standard Gmail SMTP environment variable format
 */
export declare function createConfigFromEnv(): Config;
/**
 * Validates that required environment variables are set
 */
export declare function validateEnvConfig(): void;
/**
 * Creates a complete configuration with validation
 */
export declare function createValidatedConfigFromEnv(): Config;
