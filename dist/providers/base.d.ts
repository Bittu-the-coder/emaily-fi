import { User, MessageInput, SendResult, Config } from "../types";
export declare abstract class EmailProvider {
    protected config: Config;
    constructor(config: Config);
    abstract initialize(): Promise<void>;
    abstract sendEmail(user: User, message: MessageInput): Promise<SendResult>;
    abstract validateConfig(): void;
}
