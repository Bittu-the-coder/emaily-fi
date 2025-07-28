"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GmailProvider = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const base_1 = require("./base");
class GmailProvider extends base_1.EmailProvider {
    async initialize() {
        this.validateConfig();
        // Get credentials (prefer new format, fallback to legacy)
        const emailUser = this.config.emailUser || this.config.senderEmail;
        const emailPass = this.config.emailPass || this.config.senderPassword;
        const smtpHost = this.config.smtpHost || "smtp.gmail.com";
        const smtpPort = this.config.smtpPort || 587;
        this.transporter = nodemailer_1.default.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: false, // true for 465, false for other ports
            auth: {
                user: emailUser,
                pass: emailPass,
            },
        });
    }
    validateConfig() {
        const hasNewFormat = this.config.emailUser && this.config.emailPass;
        const hasLegacyFormat = this.config.senderEmail && this.config.senderPassword;
        if (!hasNewFormat && !hasLegacyFormat) {
            throw new Error("Gmail provider requires either (emailUser + emailPass) or (senderEmail + senderPassword)");
        }
    }
    async sendEmail(user, message) {
        try {
            // Determine the from address
            const fromAddress = this.config.emailFrom ||
                this.config.emailUser ||
                this.config.senderEmail;
            const mailOptions = {
                from: fromAddress,
                to: user.email,
                subject: message.subject,
                text: message.body,
                html: message.html,
                cc: message.cc,
                bcc: message.bcc,
                attachments: message.attachments?.map((att) => ({
                    filename: att.filename,
                    content: att.content,
                    contentType: att.contentType,
                })),
            };
            const info = await this.transporter.sendMail(mailOptions);
            return {
                success: true,
                messageId: info.messageId,
                recipient: user.email,
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
                recipient: user.email,
            };
        }
    }
}
exports.GmailProvider = GmailProvider;
