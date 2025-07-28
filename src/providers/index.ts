import { EmailProvider } from "./base";
import { GmailProvider } from "./gmail";
import { Config } from "../types";

export class ProviderFactory {
  static createProvider(config: Config): EmailProvider {
    switch (config.provider) {
      case "gmail":
        return new GmailProvider(config);
      case "sendgrid":
        throw new Error("SendGrid provider not yet implemented");
      case "mailgun":
        throw new Error("Mailgun provider not yet implemented");
      default:
        return new GmailProvider(config);
    }
  }
}

export { EmailProvider, GmailProvider };
