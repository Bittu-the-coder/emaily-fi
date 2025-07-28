import { EmailProvider } from "./base";
import { GmailProvider } from "./gmail";
import { Config } from "../types";
export declare class ProviderFactory {
    static createProvider(config: Config): EmailProvider;
}
export { EmailProvider, GmailProvider };
