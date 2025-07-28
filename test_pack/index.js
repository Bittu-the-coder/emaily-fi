/* eslint-disable no-undef */
require('dotenv').config();
const { EmailNotifier } = require("emaily-fi");

// Configuration using environment variables
const config = {
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  rateLimit: { maxPerSecond: 1 },
  logger: (msg, level) => console.log(`[${level}] ${msg}`)
};

console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS);

async function testEmailNotify() {
  try {
    const notifier = new EmailNotifier(config);
    await notifier.initialize();
    console.log("✅ Email notifier initialized successfully");
    const testUser = {
      name: "Test Recipient",
      email: process.env.EMAIL_USER
    };
    const testMessage = {
      subject: "Test Email from emaily-fi",
      body: "This is a test email sent using the emaily-fi package.",
      html: "<h1>Test Email</h1><p>This is a <strong>test email</strong> sent using the emaily-fi package.</p>"
    };
    const singleResult = await notifier.sendToOne(testUser, testMessage);
    if (singleResult.success) {
      console.log("Single email sent successfully");
    } else {
      console.log(`Failed to send single email: ${singleResult.error}`);
    }

    console.log("All tests completed!");
  } catch (error) {
    console.error("Error during email tests:", error);
  }
}

// Run the tests
testEmailNotify();