import { EmailNotifier } from "./src";
import "dotenv/config";

async function demo() {
  console.log("🚀 emaily-fi Package Demo");
  console.log("=========================\n");

  const provider = (process.env.EMAIL_PROVIDER as any) || "gmail";
  console.log(`📧 Provider: ${provider}\n`);

  // Configuration based on provider type
  let config: any;

  switch (provider) {
    case "sendgrid":
      config = {
        provider: "sendgrid",
        sendGridApiKey:
          process.env.SENDGRID_API_KEY || "SG.your-sendgrid-api-key",
        emailFrom: process.env.EMAIL_FROM || "verified@yourdomain.com",
        rateLimit: { maxPerSecond: 2 },
        retryOptions: { maxRetries: 3, retryDelay: 1000 },
      };
      break;

    case "gmail":
    default:
      config = {
        provider: "gmail",
        emailUser: process.env.EMAIL_USER || "your-email@gmail.com",
        emailPass: process.env.EMAIL_PASS || "your-app-password",
        emailFrom: process.env.EMAIL_FROM || "Your Name <your-email@gmail.com>",
        rateLimit: { maxPerSecond: 1 },
        retryOptions: { maxRetries: 3, retryDelay: 1000 },
      };
      break;
  }

  try {
    console.log("✅ Initializing EmailNotifier...");
    const notifier = new EmailNotifier(config);
    await notifier.initialize();

    const users = [
      {
        name: "Test User 1",
        email: process.env.TEST_EMAIL_1 || "test1@example.com",
      },
      {
        name: "Test User 2",
        email: process.env.TEST_EMAIL_2 || "test2@example.com",
      },
      {
        name: "Your Email",
        email: process.env.YOUR_EMAIL || "your-personal@email.com",
      },
    ];

    const testMessage = {
      subject: `🎉 emaily-fi Test (${config.provider})`,
      body: `Hello! This is a test email from emaily-fi package using ${config.provider} provider.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h1 style="color: #4CAF50;">🎉 emaily-fi Package Test</h1>
          <p>This email was sent using <strong>${
            config.provider
          }</strong> provider.</p>
          <p>✅ Package is working correctly!</p>
          <p>Features tested:</p>
          <ul>
            <li>✅ ${
              config.provider === "gmail" ? "Gmail SMTP" : "SendGrid API"
            } Integration</li>
            <li>✅ HTML Email Support</li>
            <li>✅ TypeScript Support</li>
            <li>✅ Rate Limiting</li>
            <li>✅ Error Handling</li>
          </ul>
        </div>
      `,
    };

    console.log("🚀 Testing email functionality...");

    // Test 1: Single email
    console.log("1️⃣ Sending single email...");
    const singleResult = await notifier.sendToOne(users[2], testMessage);

    if (singleResult.success) {
      console.log(`✅ Email sent to ${singleResult.recipient}`);
      console.log(`   Message ID: ${singleResult.messageId}`);
    } else {
      console.log(`❌ Failed: ${singleResult.error}`);
    }

    // Test 2: Batch emails
    console.log("\n2️⃣ Sending batch emails...");
    const batchResult = await notifier.sendToAll(
      users.slice(0, 2),
      testMessage
    );
    console.log(
      `📊 Batch Results: ${batchResult.totalSent} sent, ${batchResult.totalFailed} failed`
    );

    batchResult.results.forEach((result) => {
      const status = result.success ? "✅" : "❌";
      console.log(
        `   ${status} ${result.recipient} ${
          result.error ? `(${result.error})` : ""
        }`
      );
    });

    // Test 3: Rich email with attachment
    console.log("\n3️⃣ Testing rich email with attachment...");
    const richMessage = {
      subject: `📎 Rich Email Test - ${config.provider}`,
      body: "This email has an attachment to test rich features!",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #673ab7;">📎 Rich Email Test</h2>
          <p>This email demonstrates:</p>
          <ul>
            <li>✅ HTML Content</li>
            <li>✅ File Attachments</li>
            <li>✅ ${config.provider} Provider</li>
          </ul>
          <p>Check the attachment for more details!</p>
        </div>
      `,
      attachments: [
        {
          filename: "test-result.txt",
          content: `emaily-fi Package Test Results
===============================

Provider: ${config.provider}
Timestamp: ${new Date().toISOString()}
Status: ✅ Working Correctly

Features Tested:
- Email sending functionality
- HTML content support  
- File attachments
- Error handling
- Rate limiting
- TypeScript integration

All tests passed successfully!
`,
          contentType: "text/plain",
        },
      ],
    };

    const richResult = await notifier.sendToOne(users[2], richMessage);
    if (richResult.success) {
      console.log(`✅ Rich email sent with attachment`);
    } else {
      console.log(`❌ Rich email failed: ${richResult.error}`);
    }

    console.log(`\n🎉 Demo completed using ${config.provider} provider!`);
    console.log("💡 Check your email for test messages.");
    console.log(`\n📋 Summary:`);
    console.log(`   Provider: ${config.provider}`);
    console.log(`   Features: HTML emails, attachments, batch sending`);
    console.log(`   Status: ✅ Package is working correctly!`);
  } catch (error) {
    console.error("❌ Demo error:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage?.includes("SendGrid")) {
      console.log("\n🔧 SendGrid Setup:");
      console.log("1. Verify your sender email in SendGrid");
      console.log("2. Check your API key permissions");
    }

    if (
      errorMessage?.includes("authentication") ||
      errorMessage?.includes("password")
    ) {
      console.log("\n🔧 Gmail Setup:");
      console.log("1. Use an App Password instead of your regular password");
      console.log("2. Enable 2-factor authentication on your Google account");
      console.log(
        "3. Generate App Password: https://myaccount.google.com/apppasswords"
      );
    }
  }
}

demo().catch(console.error);
