import { EmailProvider } from "./base";
import { GmailProvider } from "./gmail";
import { GmailOAuth2Provider } from "./gmail-oauth2";
import { SendGridProvider } from "./sendgrid";
import { Config } from "../types";
export declare class ProviderFactory {
    static createProvider(config: Config): EmailProvider;
}
export { EmailProvider, GmailProvider, GmailOAuth2Provider, SendGridProvider };
