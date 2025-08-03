"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigSchema = exports.GmailOAuth2ConfigSchema = exports.MessageInputSchema = exports.AttachmentSchema = exports.UserSchema = void 0;
const zod_1 = require("zod");
const buffer_1 = require("buffer");
// Zod schemas for validation
exports.UserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Invalid email format"),
});
exports.AttachmentSchema = zod_1.z.object({
    filename: zod_1.z.string().min(1, "Filename is required"),
    content: zod_1.z.union([zod_1.z.string(), zod_1.z.instanceof(buffer_1.Buffer)]),
    contentType: zod_1.z.string().optional(),
});
exports.MessageInputSchema = zod_1.z.object({
    subject: zod_1.z.string().min(1, "Subject is required"),
    body: zod_1.z.string().min(1, "Body is required"),
    html: zod_1.z.string().optional(),
    cc: zod_1.z.array(zod_1.z.string().email()).optional(),
    bcc: zod_1.z.array(zod_1.z.string().email()).optional(),
    attachments: zod_1.z.array(exports.AttachmentSchema).optional(),
});
exports.GmailOAuth2ConfigSchema = zod_1.z.object({
    clientId: zod_1.z.string().min(1, "Gmail OAuth2 clientId is required"),
    clientSecret: zod_1.z.string().min(1, "Gmail OAuth2 clientSecret is required"),
    refreshToken: zod_1.z.string().min(1, "Gmail OAuth2 refreshToken is required"),
    emailUser: zod_1.z.string().email("Invalid Gmail OAuth2 email user").optional(),
    redirectUri: zod_1.z.string().optional(),
});
exports.ConfigSchema = zod_1.z
    .object({
    // Gmail SMTP Configuration
    smtpHost: zod_1.z.string().default("smtp.gmail.com"),
    smtpPort: zod_1.z.number().positive().default(587),
    emailUser: zod_1.z.string().email("Invalid email user").optional(),
    emailPass: zod_1.z.string().min(1, "Email password is required").optional(),
    emailFrom: zod_1.z.string().optional(),
    // Gmail OAuth2 Configuration
    gmailOAuth2: exports.GmailOAuth2ConfigSchema.optional(),
    // SendGrid Configuration
    sendGridApiKey: zod_1.z.string().optional(),
    // Mailgun Configuration (future implementation)
    mailgunApiKey: zod_1.z.string().optional(),
    mailgunDomain: zod_1.z.string().optional(),
    // Legacy support (deprecated but still functional)
    senderEmail: zod_1.z.string().email("Invalid sender email").optional(),
    senderPassword: zod_1.z.string().min(1, "Sender password is required").optional(),
    provider: zod_1.z
        .enum(["gmail", "gmail-oauth2", "sendgrid", "mailgun"])
        .default("gmail"),
    rateLimit: zod_1.z
        .object({
        maxPerSecond: zod_1.z.number().positive().optional(),
        maxPerMinute: zod_1.z.number().positive().optional(),
        maxPerHour: zod_1.z.number().positive().optional(),
    })
        .optional(),
    retryOptions: zod_1.z
        .object({
        maxRetries: zod_1.z.number().min(0).default(3),
        retryDelay: zod_1.z.number().positive().default(1000),
    })
        .optional(),
    enableQueue: zod_1.z.boolean().default(false),
    logger: zod_1.z.function().optional(),
})
    .refine((data) => {
    // Validate based on provider type
    switch (data.provider) {
        case "gmail": {
            // Either new format (emailUser + emailPass) or legacy format (senderEmail + senderPassword) must be provided
            const hasNewFormat = data.emailUser && data.emailPass;
            const hasLegacyFormat = data.senderEmail && data.senderPassword;
            return hasNewFormat || hasLegacyFormat;
        }
        case "gmail-oauth2": {
            // Gmail OAuth2 requires OAuth2 configuration
            if (!data.gmailOAuth2)
                return false;
            const { clientId, clientSecret, refreshToken } = data.gmailOAuth2;
            const hasEmailUser = data.gmailOAuth2.emailUser || data.emailUser;
            return clientId && clientSecret && refreshToken && hasEmailUser;
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
}, {
    message: "Invalid configuration for the selected provider",
})
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
