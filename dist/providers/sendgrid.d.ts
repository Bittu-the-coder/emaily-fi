import { EmailProvider } from "./base";
import { User, MessageInput, SendResult, Config } from "../types";
export declare class SendGridProvider extends EmailProvider {
    private apiKey;
    constructor(config: Config);
    initialize(): Promise<void>;
    validateConfig(): void;
    sendEmail(user: User, message: MessageInput): Promise<SendResult>;
}
