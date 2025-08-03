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
    smtpHost?: string;
    smtpPort?: number;
    emailUser?: string;
    emailPass?: string;
    emailFrom?: string;
    sendGridApiKey?: string;
    mailgunApiKey?: string;
    mailgunDomain?: string;
    senderEmail?: string;
    senderPassword?: string;
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
export declare const UserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
}, {
    name: string;
    email: string;
}>;
export declare const AttachmentSchema: z.ZodObject<{
    filename: z.ZodString;
    content: z.ZodUnion<[z.ZodString, z.ZodType<Buffer<ArrayBufferLike>, z.ZodTypeDef, Buffer<ArrayBufferLike>>]>;
    contentType: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    filename: string;
    content: string | Buffer<ArrayBufferLike>;
    contentType?: string | undefined;
}, {
    filename: string;
    content: string | Buffer<ArrayBufferLike>;
    contentType?: string | undefined;
}>;
export declare const MessageInputSchema: z.ZodObject<{
    subject: z.ZodString;
    body: z.ZodString;
    html: z.ZodOptional<z.ZodString>;
    cc: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    bcc: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    attachments: z.ZodOptional<z.ZodArray<z.ZodObject<{
        filename: z.ZodString;
        content: z.ZodUnion<[z.ZodString, z.ZodType<Buffer<ArrayBufferLike>, z.ZodTypeDef, Buffer<ArrayBufferLike>>]>;
        contentType: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        filename: string;
        content: string | Buffer<ArrayBufferLike>;
        contentType?: string | undefined;
    }, {
        filename: string;
        content: string | Buffer<ArrayBufferLike>;
        contentType?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    subject: string;
    body: string;
    html?: string | undefined;
    cc?: string[] | undefined;
    bcc?: string[] | undefined;
    attachments?: {
        filename: string;
        content: string | Buffer<ArrayBufferLike>;
        contentType?: string | undefined;
    }[] | undefined;
}, {
    subject: string;
    body: string;
    html?: string | undefined;
    cc?: string[] | undefined;
    bcc?: string[] | undefined;
    attachments?: {
        filename: string;
        content: string | Buffer<ArrayBufferLike>;
        contentType?: string | undefined;
    }[] | undefined;
}>;
export declare const ConfigSchema: z.ZodEffects<z.ZodEffects<z.ZodObject<{
    smtpHost: z.ZodDefault<z.ZodString>;
    smtpPort: z.ZodDefault<z.ZodNumber>;
    emailUser: z.ZodOptional<z.ZodString>;
    emailPass: z.ZodOptional<z.ZodString>;
    emailFrom: z.ZodOptional<z.ZodString>;
    sendGridApiKey: z.ZodOptional<z.ZodString>;
    mailgunApiKey: z.ZodOptional<z.ZodString>;
    mailgunDomain: z.ZodOptional<z.ZodString>;
    senderEmail: z.ZodOptional<z.ZodString>;
    senderPassword: z.ZodOptional<z.ZodString>;
    provider: z.ZodDefault<z.ZodEnum<["gmail", "sendgrid", "mailgun"]>>;
    rateLimit: z.ZodOptional<z.ZodObject<{
        maxPerSecond: z.ZodOptional<z.ZodNumber>;
        maxPerMinute: z.ZodOptional<z.ZodNumber>;
        maxPerHour: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        maxPerSecond?: number | undefined;
        maxPerMinute?: number | undefined;
        maxPerHour?: number | undefined;
    }, {
        maxPerSecond?: number | undefined;
        maxPerMinute?: number | undefined;
        maxPerHour?: number | undefined;
    }>>;
    retryOptions: z.ZodOptional<z.ZodObject<{
        maxRetries: z.ZodDefault<z.ZodNumber>;
        retryDelay: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        maxRetries: number;
        retryDelay: number;
    }, {
        maxRetries?: number | undefined;
        retryDelay?: number | undefined;
    }>>;
    enableQueue: z.ZodDefault<z.ZodBoolean>;
    logger: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    smtpHost: string;
    smtpPort: number;
    provider: "gmail" | "sendgrid" | "mailgun";
    enableQueue: boolean;
    emailUser?: string | undefined;
    emailPass?: string | undefined;
    emailFrom?: string | undefined;
    sendGridApiKey?: string | undefined;
    mailgunApiKey?: string | undefined;
    mailgunDomain?: string | undefined;
    senderEmail?: string | undefined;
    senderPassword?: string | undefined;
    rateLimit?: {
        maxPerSecond?: number | undefined;
        maxPerMinute?: number | undefined;
        maxPerHour?: number | undefined;
    } | undefined;
    retryOptions?: {
        maxRetries: number;
        retryDelay: number;
    } | undefined;
    logger?: ((...args: unknown[]) => unknown) | undefined;
}, {
    smtpHost?: string | undefined;
    smtpPort?: number | undefined;
    emailUser?: string | undefined;
    emailPass?: string | undefined;
    emailFrom?: string | undefined;
    sendGridApiKey?: string | undefined;
    mailgunApiKey?: string | undefined;
    mailgunDomain?: string | undefined;
    senderEmail?: string | undefined;
    senderPassword?: string | undefined;
    provider?: "gmail" | "sendgrid" | "mailgun" | undefined;
    rateLimit?: {
        maxPerSecond?: number | undefined;
        maxPerMinute?: number | undefined;
        maxPerHour?: number | undefined;
    } | undefined;
    retryOptions?: {
        maxRetries?: number | undefined;
        retryDelay?: number | undefined;
    } | undefined;
    enableQueue?: boolean | undefined;
    logger?: ((...args: unknown[]) => unknown) | undefined;
}>, {
    smtpHost: string;
    smtpPort: number;
    provider: "gmail" | "sendgrid" | "mailgun";
    enableQueue: boolean;
    emailUser?: string | undefined;
    emailPass?: string | undefined;
    emailFrom?: string | undefined;
    sendGridApiKey?: string | undefined;
    mailgunApiKey?: string | undefined;
    mailgunDomain?: string | undefined;
    senderEmail?: string | undefined;
    senderPassword?: string | undefined;
    rateLimit?: {
        maxPerSecond?: number | undefined;
        maxPerMinute?: number | undefined;
        maxPerHour?: number | undefined;
    } | undefined;
    retryOptions?: {
        maxRetries: number;
        retryDelay: number;
    } | undefined;
    logger?: ((...args: unknown[]) => unknown) | undefined;
}, {
    smtpHost?: string | undefined;
    smtpPort?: number | undefined;
    emailUser?: string | undefined;
    emailPass?: string | undefined;
    emailFrom?: string | undefined;
    sendGridApiKey?: string | undefined;
    mailgunApiKey?: string | undefined;
    mailgunDomain?: string | undefined;
    senderEmail?: string | undefined;
    senderPassword?: string | undefined;
    provider?: "gmail" | "sendgrid" | "mailgun" | undefined;
    rateLimit?: {
        maxPerSecond?: number | undefined;
        maxPerMinute?: number | undefined;
        maxPerHour?: number | undefined;
    } | undefined;
    retryOptions?: {
        maxRetries?: number | undefined;
        retryDelay?: number | undefined;
    } | undefined;
    enableQueue?: boolean | undefined;
    logger?: ((...args: unknown[]) => unknown) | undefined;
}>, {
    smtpHost: string;
    smtpPort: number;
    provider: "gmail" | "sendgrid" | "mailgun";
    enableQueue: boolean;
    emailUser?: string | undefined;
    emailPass?: string | undefined;
    emailFrom?: string | undefined;
    sendGridApiKey?: string | undefined;
    mailgunApiKey?: string | undefined;
    mailgunDomain?: string | undefined;
    senderEmail?: string | undefined;
    senderPassword?: string | undefined;
    rateLimit?: {
        maxPerSecond?: number | undefined;
        maxPerMinute?: number | undefined;
        maxPerHour?: number | undefined;
    } | undefined;
    retryOptions?: {
        maxRetries: number;
        retryDelay: number;
    } | undefined;
    logger?: ((...args: unknown[]) => unknown) | undefined;
}, {
    smtpHost?: string | undefined;
    smtpPort?: number | undefined;
    emailUser?: string | undefined;
    emailPass?: string | undefined;
    emailFrom?: string | undefined;
    sendGridApiKey?: string | undefined;
    mailgunApiKey?: string | undefined;
    mailgunDomain?: string | undefined;
    senderEmail?: string | undefined;
    senderPassword?: string | undefined;
    provider?: "gmail" | "sendgrid" | "mailgun" | undefined;
    rateLimit?: {
        maxPerSecond?: number | undefined;
        maxPerMinute?: number | undefined;
        maxPerHour?: number | undefined;
    } | undefined;
    retryOptions?: {
        maxRetries?: number | undefined;
        retryDelay?: number | undefined;
    } | undefined;
    enableQueue?: boolean | undefined;
    logger?: ((...args: unknown[]) => unknown) | undefined;
}>;
export type ValidatedUser = z.infer<typeof UserSchema>;
export type ValidatedMessageInput = z.infer<typeof MessageInputSchema>;
export type ValidatedConfig = z.infer<typeof ConfigSchema>;
