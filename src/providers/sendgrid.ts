import { EmailProvider } from "./base";
import { User, MessageInput, SendResult, Config } from "../types";
import { Buffer } from "buffer";
import https from "https";

export class SendGridProvider extends EmailProvider {
  private apiKey: string;

  constructor(config: Config) {
    super(config);
    this.apiKey = config.sendGridApiKey!;
  }

  async initialize(): Promise<void> {
    this.validateConfig();
  }

  validateConfig(): void {
    if (!this.config.sendGridApiKey) {
      throw new Error("SendGrid provider requires sendGridApiKey");
    }
    if (!this.config.emailFrom) {
      throw new Error(
        "SendGrid provider requires emailFrom (verified sender email)"
      );
    }
  }

  async sendEmail(user: User, message: MessageInput): Promise<SendResult> {
    try {
      const sendGridMail = {
        personalizations: [
          {
            to: [{ email: user.email }],
            cc: message.cc?.map((email) => ({ email })),
            bcc: message.bcc?.map((email) => ({ email })),
          },
        ],
        from: { email: this.config.emailFrom! },
        subject: message.subject,
        content: [
          { type: "text/plain", value: message.body },
          ...(message.html ? [{ type: "text/html", value: message.html }] : []),
        ],
        attachments: message.attachments?.map((att) => ({
          filename: att.filename,
          content: Buffer.isBuffer(att.content)
            ? att.content.toString("base64")
            : Buffer.from(att.content).toString("base64"),
          type: att.contentType || "application/octet-stream",
          disposition: "attachment",
        })),
      };

      const postData = JSON.stringify(sendGridMail);

      return new Promise((resolve) => {
        const options = {
          hostname: "api.sendgrid.com",
          port: 443,
          path: "/v3/mail/send",
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(postData),
          },
        };

        const req = https.request(options, (res) => {
          let data = "";
          res.on("data", (chunk) => {
            data += chunk;
          });

          res.on("end", () => {
            if (
              res.statusCode &&
              res.statusCode >= 200 &&
              res.statusCode < 300
            ) {
              resolve({
                success: true,
                messageId: (res.headers["x-message-id"] as string) || "unknown",
                recipient: user.email,
              });
            } else {
              resolve({
                success: false,
                error: `SendGrid API error: ${res.statusCode} - ${data}`,
                recipient: user.email,
              });
            }
          });
        });

        req.on("error", (error) => {
          resolve({
            success: false,
            error: error.message,
            recipient: user.email,
          });
        });

        req.write(postData);
        req.end();
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send email via SendGrid";
      return {
        success: false,
        error: errorMessage,
        recipient: user.email,
      };
    }
  }
}
