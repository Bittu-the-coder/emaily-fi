import { User, MessageInput, Config, SendResult, BatchSendResult } from "./types";
export declare class EmailNotifier {
    private provider;
    private rateLimiter?;
    private queue?;
    private config;
    private sendWithRetry?;
    constructor(config: Config);
    initialize(): Promise<void>;
    sendToAll(users: User[], message: MessageInput): Promise<BatchSendResult>;
    sendToOne(user: User, message: MessageInput): Promise<SendResult>;
    sendRandom(users: User[], message: MessageInput, count?: number): Promise<BatchSendResult>;
    sendFiltered(users: User[], message: MessageInput, filter: (user: User) => boolean): Promise<BatchSendResult>;
    private executeSend;
    private sendSingleEmail;
    private validateInputs;
    private log;
    getQueueStats(): {
        size: number;
        pending: number;
        isPaused: boolean;
    } | null;
    pauseQueue(): void;
    resumeQueue(): void;
}
