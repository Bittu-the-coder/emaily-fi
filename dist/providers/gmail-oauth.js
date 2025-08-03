"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GmailOAuthProvider = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const base_1 = require("./base");
class GmailOAuthProvider extends base_1.EmailProvider {
    async initialize() {
        this.validateConfig();
        const emailUser = this.config.emailUser;
        const clientId = this.config.clientId;
        const clientSecret = this.config.clientSecret;
        const refreshToken = this.config.refreshToken;
        const accessToken = this.config.accessToken;
        this.transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: emailUser,
                clientId: clientId,
                clientSecret: clientSecret,
                refreshToken: refreshToken,
                accessToken: accessToken,
            },
        });
    }
    validateConfig() {
        if (!this.config.emailUser) {
            throw new Error("Gmail OAuth provider requires emailUser (Gmail email address)");
        }
        if (!this.config.clientId) {
            throw new Error("Gmail OAuth provider requires clientId (Google OAuth2 Client ID)");
        }
        if (!this.config.clientSecret) {
            throw new Error("Gmail OAuth provider requires clientSecret (Google OAuth2 Client Secret)");
        }
        if (!this.config.refreshToken) {
            throw new Error("Gmail OAuth provider requires refreshToken (OAuth2 Refresh Token)");
        }
    }
    async sendEmail(user, message) {
        try {
            const fromAddress = this.config.emailFrom || this.config.emailUser;
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
            const errorMessage = error instanceof Error
                ? error.message
                : "Failed to send email via Gmail OAuth";
            return {
                success: false,
                error: errorMessage,
                recipient: user.email,
            };
        }
    }
}
exports.GmailOAuthProvider = GmailOAuthProvider;
