"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendGridProvider = void 0;
const base_1 = require("./base");
const buffer_1 = require("buffer");
const https_1 = __importDefault(require("https"));
class SendGridProvider extends base_1.EmailProvider {
    constructor(config) {
        super(config);
        this.apiKey = config.sendGridApiKey;
    }
    async initialize() {
        this.validateConfig();
    }
    validateConfig() {
        if (!this.config.sendGridApiKey) {
            throw new Error("SendGrid provider requires sendGridApiKey");
        }
        if (!this.config.emailFrom) {
            throw new Error("SendGrid provider requires emailFrom (verified sender email)");
        }
    }
    async sendEmail(user, message) {
        try {
            const sendGridMail = {
                personalizations: [
                    {
                        to: [{ email: user.email }],
                        cc: message.cc?.map((email) => ({ email })),
                        bcc: message.bcc?.map((email) => ({ email })),
                    },
                ],
                from: { email: this.config.emailFrom },
                subject: message.subject,
                content: [
                    { type: "text/plain", value: message.body },
                    ...(message.html ? [{ type: "text/html", value: message.html }] : []),
                ],
                attachments: message.attachments?.map((att) => ({
                    filename: att.filename,
                    content: buffer_1.Buffer.isBuffer(att.content)
                        ? att.content.toString("base64")
                        : buffer_1.Buffer.from(att.content).toString("base64"),
                    type: att.contentType || "application/octet-stream",
                    disposition: "attachment",
                })),
            };
            const postData = JSON.stringify(sendGridMail);
            return new Promise((resolve) => {
                const options = {
                    hostname: "api.sendgrid.com",
                    port: 443,
                    path: "/v3/mail/send",
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        "Content-Type": "application/json",
                        "Content-Length": buffer_1.Buffer.byteLength(postData),
                    },
                };
                const req = https_1.default.request(options, (res) => {
                    let data = "";
                    res.on("data", (chunk) => {
                        data += chunk;
                    });
                    res.on("end", () => {
                        if (res.statusCode &&
                            res.statusCode >= 200 &&
                            res.statusCode < 300) {
                            resolve({
                                success: true,
                                messageId: res.headers["x-message-id"] || "unknown",
                                recipient: user.email,
                            });
                        }
                        else {
                            resolve({
                                success: false,
                                error: `SendGrid API error: ${res.statusCode} - ${data}`,
                                recipient: user.email,
                            });
                        }
                    });
                });
                req.on("error", (error) => {
                    resolve({
                        success: false,
                        error: error.message,
                        recipient: user.email,
                    });
                });
                req.write(postData);
                req.end();
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : "Failed to send email via SendGrid";
            return {
                success: false,
                error: errorMessage,
                recipient: user.email,
            };
        }
    }
}
exports.SendGridProvider = SendGridProvider;
