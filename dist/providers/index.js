"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GmailProvider = exports.EmailProvider = exports.ProviderFactory = void 0;
const base_1 = require("./base");
Object.defineProperty(exports, "EmailProvider", { enumerable: true, get: function () { return base_1.EmailProvider; } });
const gmail_1 = require("./gmail");
Object.defineProperty(exports, "GmailProvider", { enumerable: true, get: function () { return gmail_1.GmailProvider; } });
class ProviderFactory {
    static createProvider(config) {
        switch (config.provider) {
            case "gmail":
                return new gmail_1.GmailProvider(config);
            case "sendgrid":
                throw new Error("SendGrid provider not yet implemented");
            case "mailgun":
                throw new Error("Mailgun provider not yet implemented");
            default:
                return new gmail_1.GmailProvider(config);
        }
    }
}
exports.ProviderFactory = ProviderFactory;
