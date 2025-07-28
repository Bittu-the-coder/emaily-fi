import { User, MessageInput, SendResult, Config } from "../types";

export abstract class EmailProvider {
  protected config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  abstract initialize(): Promise<void>;
  abstract sendEmail(user: User, message: MessageInput): Promise<SendResult>;
  abstract validateConfig(): void;
}
