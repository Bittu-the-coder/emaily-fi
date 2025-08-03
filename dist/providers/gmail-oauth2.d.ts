import { EmailProvider } from "./base";
import { User, MessageInput, SendResult } from "../types";
export declare class GmailOAuth2Provider extends EmailProvider {
    private transporter;
    private oauth2Client;
    initialize(): Promise<void>;
    private getAccessToken;
    validateConfig(): void;
    sendEmail(user: User, message: MessageInput): Promise<SendResult>;
    private refreshAccessTokenIfNeeded;
    private refreshAccessToken;
    private isAuthError;
    /**
     * Helper method to generate OAuth2 authorization URL
     * Use this to get the authorization code needed for the refresh token
     */
    static generateAuthUrl(clientId: string, clientSecret: string, redirectUri?: string): string;
    /**
     * Helper method to exchange authorization code for refresh token
     * Use this once to get the refresh token from the authorization code
     */
    static getRefreshToken(clientId: string, clientSecret: string, authorizationCode: string, redirectUri?: string): Promise<string>;
}
