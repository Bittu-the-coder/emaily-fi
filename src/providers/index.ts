import { EmailProvider } from "./base";
import { GmailProvider } from "./gmail";
import { GmailOAuth2Provider } from "./gmail-oauth2";
import { SendGridProvider } from "./sendgrid";
import { Config } from "../types";

export class ProviderFactory {
  static createProvider(config: Config): EmailProvider {
    switch (config.provider) {
      case "gmail":
        return new GmailProvider(config);
      case "gmail-oauth2":
        return new GmailOAuth2Provider(config);
      case "sendgrid":
        return new SendGridProvider(config);
      case "mailgun":
        throw new Error("Mailgun provider not yet implemented");
      default:
        return new GmailProvider(config);
    }
  }
}

export { EmailProvider, GmailProvider, GmailOAuth2Provider, SendGridProvider };
