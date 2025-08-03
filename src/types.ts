import { z } from "zod";
import { Buffer } from "buffer";

export interface User {
  name: string;
  email: string;
}

export interface Attachment {
  filename: string;
  content: string | Buffer;
  contentType?: string;
}

export interface MessageInput {
  subject: string;
  body: string;
  html?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: Attachment[];
}

export interface Config {
  // Gmail SMTP Configuration
  smtpHost?: string; // Default: smtp.gmail.com
  smtpPort?: number; // Default: 587
  emailUser?: string; // Gmail email address
  emailPass?: string; // Gmail App Password
  emailFrom?: string; // Display name and email format: "Name <email@gmail.com>"

  // SendGrid Configuration
  sendGridApiKey?: string; // SendGrid API Key

  // Mailgun Configuration (future implementation)
  mailgunApiKey?: string; // Mailgun API Key
  mailgunDomain?: string; // Mailgun Domain

  // Legacy support (deprecated)
  senderEmail?: string; // Will map to emailUser if provided
  senderPassword?: string; // Will map to emailPass if provided

  provider?: "gmail" | "sendgrid" | "mailgun";
  rateLimit?: {
    maxPerSecond?: number;
    maxPerMinute?: number;
    maxPerHour?: number;
  };
  retryOptions?: {
    maxRetries?: number;
    retryDelay?: number;
  };
  enableQueue?: boolean;
  logger?: (_message: string, _level: "info" | "warn" | "error") => void;
}

export interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  recipient: string;
}

export interface BatchSendResult {
  results: SendResult[];
  totalSent: number;
  totalFailed: number;
}

// Zod schemas for validation
export const UserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
});

export const AttachmentSchema = z.object({
  filename: z.string().min(1, "Filename is required"),
  content: z.union([z.string(), z.instanceof(Buffer)]),
  contentType: z.string().optional(),
});

export const MessageInputSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Body is required"),
  html: z.string().optional(),
  cc: z.array(z.string().email()).optional(),
  bcc: z.array(z.string().email()).optional(),
  attachments: z.array(AttachmentSchema).optional(),
});

export const ConfigSchema = z
  .object({
    // Gmail SMTP Configuration
    smtpHost: z.string().default("smtp.gmail.com"),
    smtpPort: z.number().positive().default(587),
    emailUser: z.string().email("Invalid email user").optional(),
    emailPass: z.string().min(1, "Email password is required").optional(),
    emailFrom: z.string().optional(),

    // SendGrid Configuration
    sendGridApiKey: z.string().optional(),

    // Mailgun Configuration (future implementation)
    mailgunApiKey: z.string().optional(),
    mailgunDomain: z.string().optional(),

    // Legacy support (deprecated but still functional)
    senderEmail: z.string().email("Invalid sender email").optional(),
    senderPassword: z.string().min(1, "Sender password is required").optional(),

    provider: z.enum(["gmail", "sendgrid", "mailgun"]).default("gmail"),
    rateLimit: z
      .object({
        maxPerSecond: z.number().positive().optional(),
        maxPerMinute: z.number().positive().optional(),
        maxPerHour: z.number().positive().optional(),
      })
      .optional(),
    retryOptions: z
      .object({
        maxRetries: z.number().min(0).default(3),
        retryDelay: z.number().positive().default(1000),
      })
      .optional(),
    enableQueue: z.boolean().default(false),
    logger: z.function().optional(),
  })
  .refine(
    (data) => {
      // Validate based on provider type
      switch (data.provider) {
        case "gmail": {
          // Either new format (emailUser + emailPass) or legacy format (senderEmail + senderPassword) must be provided
          const hasNewFormat = data.emailUser && data.emailPass;
          const hasLegacyFormat = data.senderEmail && data.senderPassword;
          return hasNewFormat || hasLegacyFormat;
        }

        case "sendgrid": {
          // SendGrid requires API key and emailFrom
          return data.sendGridApiKey && data.emailFrom;
        }

        case "mailgun": {
          // Mailgun not implemented yet
          return false;
        }

        default:
          return false;
      }
    },
    {
      message: "Invalid configuration for the selected provider",
    }
  )
  .transform((data) => {
    // Transform legacy format to new format for internal consistency
    if (!data.emailUser && data.senderEmail) {
      data.emailUser = data.senderEmail;
    }
    if (!data.emailPass && data.senderPassword) {
      data.emailPass = data.senderPassword;
    }
    return data;
  });

export type ValidatedUser = z.infer<typeof UserSchema>;
export type ValidatedMessageInput = z.infer<typeof MessageInputSchema>;
export type ValidatedConfig = z.infer<typeof ConfigSchema>;
