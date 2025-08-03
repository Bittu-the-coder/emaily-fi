import { EmailProvider } from "./base";
import { User, MessageInput, SendResult } from "../types";
export declare class GmailOAuthProvider extends EmailProvider {
    private transporter;
    initialize(): Promise<void>;
    validateConfig(): void;
    sendEmail(user: User, message: MessageInput): Promise<SendResult>;
}
