"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GmailOAuth2Provider = void 0;
const googleapis_1 = require("googleapis");
const nodemailer_1 = __importDefault(require("nodemailer"));
const base_1 = require("./base");
class GmailOAuth2Provider extends base_1.EmailProvider {
    async initialize() {
        this.validateConfig();
        // Initialize OAuth2 client
        this.oauth2Client = new googleapis_1.google.auth.OAuth2(this.config.gmailOAuth2?.clientId, this.config.gmailOAuth2?.clientSecret, this.config.gmailOAuth2?.redirectUri || "urn:ietf:wg:oauth:2.0:oob");
        // Set credentials
        this.oauth2Client.setCredentials({
            refresh_token: this.config.gmailOAuth2?.refreshToken,
        });
        // Get access token
        const accessToken = await this.getAccessToken();
        // Create transporter with OAuth2
        this.transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: this.config.gmailOAuth2?.emailUser || this.config.emailUser,
                clientId: this.config.gmailOAuth2?.clientId,
                clientSecret: this.config.gmailOAuth2?.clientSecret,
                refreshToken: this.config.gmailOAuth2?.refreshToken,
                accessToken: accessToken,
            },
        });
    }
    async getAccessToken() {
        try {
            const { credentials } = await this.oauth2Client.refreshAccessToken();
            return credentials.access_token;
        }
        catch (error) {
            throw new Error(`Failed to get access token: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    validateConfig() {
        if (!this.config.gmailOAuth2) {
            throw new Error("Gmail OAuth2 configuration is required");
        }
        const { clientId, clientSecret, refreshToken } = this.config.gmailOAuth2;
        if (!clientId) {
            throw new Error("Gmail OAuth2 clientId is required");
        }
        if (!clientSecret) {
            throw new Error("Gmail OAuth2 clientSecret is required");
        }
        if (!refreshToken) {
            throw new Error("Gmail OAuth2 refreshToken is required");
        }
        const emailUser = this.config.gmailOAuth2.emailUser || this.config.emailUser;
        if (!emailUser) {
            throw new Error("Email user is required (either gmailOAuth2.emailUser or emailUser)");
        }
    }
    async sendEmail(user, message) {
        try {
            // Refresh access token before sending if needed
            await this.refreshAccessTokenIfNeeded();
            // Determine the from address
            const fromAddress = this.config.emailFrom ||
                this.config.gmailOAuth2?.emailUser ||
                this.config.emailUser;
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
            // If it's an authentication error, try to refresh the token and retry once
            if (this.isAuthError(error)) {
                try {
                    await this.refreshAccessToken();
                    const info = await this.transporter.sendMail({
                        from: this.config.emailFrom ||
                            this.config.gmailOAuth2?.emailUser ||
                            this.config.emailUser,
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
                    });
                    return {
                        success: true,
                        messageId: info.messageId,
                        recipient: user.email,
                    };
                }
                catch (retryError) {
                    return {
                        success: false,
                        error: retryError instanceof Error
                            ? retryError.message
                            : "Unknown error after retry",
                        recipient: user.email,
                    };
                }
            }
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
                recipient: user.email,
            };
        }
    }
    async refreshAccessTokenIfNeeded() {
        try {
            // Check if the current access token is still valid
            const tokenInfo = await this.oauth2Client.getTokenInfo(this.oauth2Client.credentials.access_token);
            // If token expires in less than 5 minutes, refresh it
            const expiryDate = new Date(tokenInfo.expiry_date || 0);
            const now = new Date();
            const timeDiff = expiryDate.getTime() - now.getTime();
            const minutesUntilExpiry = timeDiff / (1000 * 60);
            if (minutesUntilExpiry < 5) {
                await this.refreshAccessToken();
            }
        }
        catch (error) {
            // If we can't check the token info, just try to refresh
            await this.refreshAccessToken();
        }
    }
    async refreshAccessToken() {
        const accessToken = await this.getAccessToken();
        // Update the transporter with the new access token
        this.transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: this.config.gmailOAuth2?.emailUser || this.config.emailUser,
                clientId: this.config.gmailOAuth2?.clientId,
                clientSecret: this.config.gmailOAuth2?.clientSecret,
                refreshToken: this.config.gmailOAuth2?.refreshToken,
                accessToken: accessToken,
            },
        });
    }
    isAuthError(error) {
        if (!error)
            return false;
        const errorMessage = error.message?.toLowerCase() || "";
        const errorCode = error.code;
        return (errorMessage.includes("invalid_grant") ||
            errorMessage.includes("unauthorized") ||
            errorMessage.includes("authentication") ||
            errorCode === "EAUTH" ||
            errorCode === 401);
    }
    /**
     * Helper method to generate OAuth2 authorization URL
     * Use this to get the authorization code needed for the refresh token
     */
    static generateAuthUrl(clientId, clientSecret, redirectUri) {
        const oauth2Client = new googleapis_1.google.auth.OAuth2(clientId, clientSecret, redirectUri || "urn:ietf:wg:oauth:2.0:oob");
        const scopes = ["https://mail.google.com/"];
        return oauth2Client.generateAuthUrl({
            access_type: "offline",
            scope: scopes,
            prompt: "consent",
        });
    }
    /**
     * Helper method to exchange authorization code for refresh token
     * Use this once to get the refresh token from the authorization code
     */
    static async getRefreshToken(clientId, clientSecret, authorizationCode, redirectUri) {
        const oauth2Client = new googleapis_1.google.auth.OAuth2(clientId, clientSecret, redirectUri || "urn:ietf:wg:oauth:2.0:oob");
        const { tokens } = await oauth2Client.getToken(authorizationCode);
        if (!tokens.refresh_token) {
            throw new Error("No refresh token received. Make sure to include 'access_type: offline' and 'prompt: consent' in your auth URL.");
        }
        return tokens.refresh_token;
    }
}
exports.GmailOAuth2Provider = GmailOAuth2Provider;
