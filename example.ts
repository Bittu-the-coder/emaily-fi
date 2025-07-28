/**
 * emaily-fi Example
 *
 * This example demonstrates the basic usage of the emaily-fi package
 * for sending emails with Gmail SMTP.
 */

import { EmailNotifier } from "./src";
import { createValidatedConfigFromEnv } from "./src/env-config";
import "dotenv/config";

async function main() {
  try {
    // Method 1: Using environment variables (recommended)
    console.log("� Initializing EmailNotifier with environment config...");

    const notifier = new EmailNotifier({
      ...createValidatedConfigFromEnv(),
      logger: (message, level) => {
        console.log(
          `[${level.toUpperCase()}] ${new Date().toISOString()}: ${message}`
        );
      },
    });

    await notifier.initialize();
    console.log("✅ EmailNotifier initialized successfully!");

    // Sample users
    const users = [
      { name: "Alice Johnson", email: "alice@example.com" },
      { name: "Bob Smith", email: "bob@example.com" },
      { name: "Charlie Brown", email: "charlie@example.com" },
    ];

    // Sample message
    const message = {
      subject: "Welcome to emaily-fi! 🎉",
      body: `Hello!\n\nWelcome to our email notification service. This is a test message sent using the emaily-fi package.\n\nBest regards,\nThe emaily-fi Team`,
      html: `
        <h1>Welcome to emaily-fi! 🎉</h1>
        <p>Hello!</p>
        <p>Welcome to our email notification service. This is a test message sent using the emaily-fi package.</p>
        <p>Best regards,<br><strong>The emaily-fi Team</strong></p>
      `,
    };

    // Example 1: Send to single user
    console.log("\n📧 Example 1: Sending to single user...");
    const singleResult = await notifier.sendToOne(users[0], {
      ...message,
      subject: "Personal Welcome Message",
    });

    if (singleResult.success) {
      console.log(
        `✅ Email sent to ${users[0].email} (ID: ${singleResult.messageId})`
      );
    } else {
      console.error(
        `❌ Failed to send to ${users[0].email}: ${singleResult.error}`
      );
    }

    // Example 2: Send to all users
    console.log("\n📧 Example 2: Sending to all users...");
    const batchResult = await notifier.sendToAll(users, message);

    console.log(
      `📊 Batch send results: ✅ Sent: ${batchResult.totalSent}, ❌ Failed: ${batchResult.totalFailed}`
    );

    console.log("\n🎉 Examples completed successfully!");
  } catch (error) {
    console.error("\n💥 Error occurred:", error);

    if (
      error instanceof Error &&
      error.message.includes("Missing required environment variables")
    ) {
      console.log("\n💡 Setup Instructions:");
      console.log("1. Create a .env file in your project root");
      console.log("2. Add the following variables:");
      console.log("   EMAIL_USER=your-email@gmail.com");
      console.log("   EMAIL_PASS=your-app-password");
      console.log(
        "3. Enable 2FA on your Gmail account and generate an App Password"
      );
    }

    process.exit(1);
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
  main().catch(console.error);
}

// Export functions for testing
export { main, runEmailCampaign };
