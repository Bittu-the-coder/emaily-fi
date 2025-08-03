"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendGridProvider = exports.GmailOAuth2Provider = exports.GmailProvider = exports.EmailProvider = exports.ProviderFactory = void 0;
const base_1 = require("./base");
Object.defineProperty(exports, "EmailProvider", { enumerable: true, get: function () { return base_1.EmailProvider; } });
const gmail_1 = require("./gmail");
Object.defineProperty(exports, "GmailProvider", { enumerable: true, get: function () { return gmail_1.GmailProvider; } });
const gmail_oauth2_1 = require("./gmail-oauth2");
Object.defineProperty(exports, "GmailOAuth2Provider", { enumerable: true, get: function () { return gmail_oauth2_1.GmailOAuth2Provider; } });
const sendgrid_1 = require("./sendgrid");
Object.defineProperty(exports, "SendGridProvider", { enumerable: true, get: function () { return sendgrid_1.SendGridProvider; } });
class ProviderFactory {
    static createProvider(config) {
        switch (config.provider) {
            case "gmail":
                return new gmail_1.GmailProvider(config);
            case "gmail-oauth2":
                return new gmail_oauth2_1.GmailOAuth2Provider(config);
            case "sendgrid":
                return new sendgrid_1.SendGridProvider(config);
            case "mailgun":
                throw new Error("Mailgun provider not yet implemented");
            default:
                return new gmail_1.GmailProvider(config);
        }
    }
}
exports.ProviderFactory = ProviderFactory;
