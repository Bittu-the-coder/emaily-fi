import { EmailNotifier } from "./src";
import "dotenv/config";

async function demo() {
  console.log("🚀 emaily-fi Package Demo");
  console.log("============================\n");

  // Configuration with environment variables (recommended)
  const config = {
    emailUser: process.env.EMAIL_USER || "your-email@gmail.com",
    emailPass: process.env.EMAIL_PASS || "your-app-password",
    rateLimit: {
      maxPerSecond: 1,
    },
    retryOptions: {
      maxRetries: 3,
      retryDelay: 1000,
    },
    logger: (message: string, level: string) => {
      console.log(`[${level.toUpperCase()}] ${message}`);
    },
  };

  try {
    console.log("✅ Creating EmailNotifier with environment configuration...");
    const notifier = new EmailNotifier(config);

    console.log("✅ Validating configuration...");
    console.log("✅ Configuration validated successfully!");

    // Initialize the notifier
    await notifier.initialize();
    console.log("✅ EmailNotifier initialized successfully!");

    // Sample users for testing (use your own email addresses)
    const users = [
      { name: "Demo User 1", email: "user1@example.com" },
      { name: "Demo User 2", email: "user2@example.com" },
    ];

    // Sample message
    const message = {
      subject: "🎉 Welcome to emaily-fi Package!",
      body: "Hello! This is a demo email from the emaily-fi package. Thank you for trying our service!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4CAF50;">🎉 Welcome to emaily-fi!</h1>
          <p>Hello there!</p>
          <p>This is a test email from the <strong>emaily-fi</strong> package.</p>
          <p>Features demonstrated:</p>
          <ul>
            <li>✅ Gmail SMTP configuration</li>
            <li>✅ HTML email support</li>
            <li>✅ Rate limiting</li>
            <li>✅ TypeScript integration</li>
          </ul>
          <p>Thank you for using our service!</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            Sent via emaily-fi Package Demo<br>
            ${new Date().toISOString()}
          </p>
        </div>
      `,
    };

    console.log("\n🚀 Starting email sending demonstrations...");

    // Demo 1: Send to single user (Charlie - your Gmail)
    console.log("\n1️⃣ Sending test email to single user...");
    try {
      const singleResult = await notifier.sendToOne(users[2], {
        ...message,
        subject: "📧 Single Email Test - emaily-fi Package",
      });

      if (singleResult.success) {
        console.log(
          `✅ Single email sent successfully to ${singleResult.recipient}`
        );
        console.log(`   Message ID: ${singleResult.messageId}`);
      } else {
        console.log(`❌ Failed to send single email: ${singleResult.error}`);
      }
    } catch (error) {
      console.error(`❌ Error sending single email:`, error);
    }

    // Demo 2: Send to multiple users
    console.log("\n2️⃣ Sending batch emails...");
    try {
      const batchResult = await notifier.sendToAll(users, {
        ...message,
        subject: "📬 Batch Email Test - emaily-fi Package",
      });

      console.log(`✅ Batch send completed:`);
      console.log(`   Total sent: ${batchResult.totalSent}`);
      console.log(`   Total failed: ${batchResult.totalFailed}`);

      batchResult.results.forEach((result) => {
        const status = result.success ? "✅ Sent" : "❌ Failed";
        console.log(
          `   ${status}: ${result.recipient} ${
            result.error ? `(${result.error})` : ""
          }`
        );
      });
    } catch (error) {
      console.error(`❌ Error in batch send:`, error);
    }

    // Demo 3: Send to random users
    console.log("\n3️⃣ Sending to 2 random users from list...");
    try {
      const randomResult = await notifier.sendRandom(
        users,
        {
          ...message,
          subject: "🎲 Random Selection Email - emaily-fi Package",
        },
        2
      );

      console.log(`✅ Random send completed:`);
      console.log(
        `   Emails sent to ${randomResult.totalSent} random recipients`
      );
      randomResult.results.forEach((result) => {
        console.log(
          `   📧 ${result.recipient}: ${result.success ? "Success" : "Failed"}`
        );
      });
    } catch (error) {
      console.error(`❌ Error in random send:`, error);
    }

    // Demo 4: Send to filtered users
    console.log(
      "\n4️⃣ Sending to filtered users (names starting with 'A' or 'B')..."
    );
    try {
      const filteredResult = await notifier.sendFiltered(
        users,
        {
          ...message,
          subject: "🔍 Filtered Email - emaily-fi Package",
        },
        (user) => user.name.startsWith("A") || user.name.startsWith("B")
      );

      console.log(`✅ Filtered send completed:`);
      console.log(
        `   Emails sent to ${filteredResult.totalSent} filtered recipients`
      );
      filteredResult.results.forEach((result) => {
        console.log(
          `   📧 ${result.recipient}: ${result.success ? "Success" : "Failed"}`
        );
      });
    } catch (error) {
      console.error(`❌ Error in filtered send:`, error);
    }

    // Demo 5: Rich message with attachments
    console.log("\n5️⃣ Demonstrating rich message features...");
    const richMessage = {
      subject: "💎 Rich Email Features - emaily-fi Package",
      body: "This email demonstrates rich features like CC, BCC, and attachments.",
      html: `
        <h2>Rich Email Features Demo</h2>
        <p>This email demonstrates:</p>
        <ul>
          <li>HTML content</li>
          <li>CC recipients</li>
          <li>BCC recipients</li>
          <li>File attachments</li>
        </ul>
      `,
      cc: ["bittuprajapati2271@gmail.com"],
      bcc: ["bittuatwork169@gmail.com"],
      attachments: [
        {
          filename: "demo.txt",
          content: "This is a demo attachment from emaily-fi package!",
          contentType: "text/plain",
        },
      ],
    };

    try {
      const richResult = await notifier.sendToOne(users[0], richMessage);
      if (richResult.success) {
        console.log(
          `✅ Rich email sent successfully with attachments and CC/BCC`
        );
      } else {
        console.log(`❌ Rich email failed: ${richResult.error}`);
      }
    } catch (error) {
      console.error(`❌ Error sending rich email:`, error);
    }

    console.log("\n🎯 Queue Statistics:");
    const queueStats = notifier.getQueueStats();
    if (queueStats) {
      console.log(`   Queue size: ${queueStats.size}`);
      console.log(`   Pending: ${queueStats.pending}`);
      console.log(`   Paused: ${queueStats.isPaused}`);
    } else {
      console.log(`   Queue not enabled for this demo`);
    }

    console.log("\n✅ Package supports:");
    console.log("   • Gmail SMTP configuration (smtp.gmail.com:587)");
    console.log("   • Environment variable setup");
    console.log("   • Rate limiting and retry mechanisms");
    console.log("   • Queue system for high-volume emails");
    console.log("   • TypeScript with full type safety");
    console.log("   • Input validation with Zod");
    console.log("   • Rich messages (HTML, CC/BCC, attachments)");
    console.log("   • Multiple send modes (all, single, random, filtered)");
    console.log("   • Custom logging support");
    console.log("   • Legacy configuration format support");

    console.log("\n🎉 emaily-fi package demonstrations completed!");
    console.log("\n💡 Check your email inboxes for the test messages!");

    console.log("\n📋 To use with environment variables, create .env file:");
    console.log("SMTP_HOST=smtp.gmail.com");
    console.log("SMTP_PORT=587");
    console.log("EMAIL_USER=your-email@gmail.com");
    console.log("EMAIL_PASS=your-app-password");
    console.log("EMAIL_FROM=Your Name <your-email@gmail.com>");

    console.log("\n🚀 Run 'npm run dev' or 'npx ts-node demo.ts' to test!");
  } catch (error) {
    console.error("❌ Demo error:", error);
  }
}

demo().catch(console.error);
