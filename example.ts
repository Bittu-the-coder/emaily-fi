import { EmailNotifier } from "./src";
import { createValidatedConfigFromEnv } from "./src/env-config";
import "dotenv/config";

async function example() {
  // Option 1: Configuration from environment variables (recommended)
  try {
    console.log("🔧 Creating configuration from environment variables...");
    const envConfig = createValidatedConfigFromEnv();
    const notifier = new EmailNotifier({
      ...envConfig,
      logger: (message, level) => {
        console.log(
          `[${level.toUpperCase()}] ${new Date().toISOString()}: ${message}`
        );
      },
    });

    await runEmailCampaign(notifier);
  } catch (error) {
    console.log(
      "⚠️  Environment variables not configured, using manual config..."
    );

    // Option 2: Manual configuration (fallback)
    const manualNotifier = new EmailNotifier({
      // Gmail SMTP Configuration (preferred format)
      smtpHost: "smtp.gmail.com",
      smtpPort: 587,
      emailUser: "your-email@gmail.com",
      emailPass: "your-app-password",
      emailFrom: "Your Company <your-email@gmail.com>",

      // Or use legacy format (still supported)
      // senderEmail: 'your-email@gmail.com',
      // senderPassword: 'your-app-password',

      rateLimit: {
        maxPerSecond: 1,
      },
      retryOptions: {
        maxRetries: 3,
        retryDelay: 1000,
      },
      logger: (message, level) => {
        console.log(
          `[${level.toUpperCase()}] ${new Date().toISOString()}: ${message}`
        );
      },
    });

    await runEmailCampaign(manualNotifier);
  }
}

async function runEmailCampaign(notifier: EmailNotifier) {
  // Initialize
  await notifier.initialize();

  // Sample users
  const users = [
    { name: "Alice Johnson", email: "alice@example.com" },
    { name: "Bob Smith", email: "bob@example.com" },
    { name: "Charlie Brown", email: "charlie@example.com" },
  ];

  // Sample message
  const message = {
    subject: "Welcome to Our Service!",
    body: "Thank you for joining us. We are excited to have you on board!",
    html: `
      <h1>Welcome to Our Service!</h1>
      <p>Thank you for joining us. We are excited to have you on board!</p>
      <p>Best regards,<br>The Team</p>
    `,
  };

  try {
    console.log("Starting email campaign...");

    // Example 1: Send to all users
    console.log("\n1. Sending to all users...");
    const allResult = await notifier.sendToAll(users, message);
    console.log(
      `✅ Sent to all: ${allResult.totalSent} success, ${allResult.totalFailed} failed`
    );

    // Example 2: Send to one user
    console.log("\n2. Sending to single user...");
    const oneResult = await notifier.sendToOne(users[0], {
      ...message,
      subject: "Personal Welcome Message",
    });
    console.log(`✅ Single send: ${oneResult.success ? "Success" : "Failed"}`);

    // Example 3: Send to random users
    console.log("\n3. Sending to 2 random users...");
    const randomResult = await notifier.sendRandom(
      users,
      {
        ...message,
        subject: "Random Selection Notice",
      },
      2
    );
    console.log(`✅ Random send: ${randomResult.totalSent} sent`);

    // Example 4: Send to filtered users
    console.log(
      "\n4. Sending to filtered users (names starting with A or B)..."
    );
    const filteredResult = await notifier.sendFiltered(
      users,
      {
        ...message,
        subject: "Filtered Message",
      },
      (user) => user.name.startsWith("A") || user.name.startsWith("B")
    );
    console.log(`✅ Filtered send: ${filteredResult.totalSent} sent`);

    console.log("\n🎉 Email campaign completed successfully!");
  } catch (error) {
    console.error("❌ Error during email campaign:", error);
  }
}

// Run example if this file is executed directly
if (require.main === module) {
  example().catch(console.error);
}

export { example };
