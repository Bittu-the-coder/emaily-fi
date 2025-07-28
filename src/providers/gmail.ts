import nodemailer from "nodemailer";
import { EmailProvider } from "./base";
import { User, MessageInput, SendResult, Config } from "../types";

export class GmailProvider extends EmailProvider {
  private transporter: any;

  async initialize(): Promise<void> {
    this.validateConfig();

    // Get credentials (prefer new format, fallback to legacy)
    const emailUser = this.config.emailUser || this.config.senderEmail;
    const emailPass = this.config.emailPass || this.config.senderPassword;
    const smtpHost = this.config.smtpHost || "smtp.gmail.com";
    const smtpPort = this.config.smtpPort || 587;

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false, // true for 465, false for other ports
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
  }

  validateConfig(): void {
    const hasNewFormat = this.config.emailUser && this.config.emailPass;
    const hasLegacyFormat =
      this.config.senderEmail && this.config.senderPassword;

    if (!hasNewFormat && !hasLegacyFormat) {
      throw new Error(
        "Gmail provider requires either (emailUser + emailPass) or (senderEmail + senderPassword)"
      );
    }
  }

  async sendEmail(user: User, message: MessageInput): Promise<SendResult> {
    try {
      // Determine the from address
      const fromAddress =
        this.config.emailFrom ||
        this.config.emailUser ||
        this.config.senderEmail;

      const mailOptions = {
        from: fromAddress,
        to: user.email,
        subject: message.subject,
        text: message.body,
        html: message.html,
        cc: message.cc,
        bcc: message.bcc,
        attachments: message.attachments?.map((att) => ({
          filename: att.filename,
          content: att.content,
          contentType: att.contentType,
        })),
      };

      const info = await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        messageId: info.messageId,
        recipient: user.email,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        recipient: user.email,
      };
    }
  }
}
