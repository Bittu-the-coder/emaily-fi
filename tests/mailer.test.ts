import { EmailNotifier } from "../src/mailer";
import { Config, User, MessageInput } from "../src/types";
import { GmailProvider } from "../src/providers/gmail";

// Mock nodemailer
jest.mock("nodemailer", () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn(() =>
      Promise.resolve({
        messageId: "test-message-id",
        response: "250 Message queued",
      })
    ),
  })),
}));

// Mock p-queue
jest.mock("p-queue", () => {
  return jest.fn().mockImplementation(() => ({
    add: jest.fn((fn) => fn()),
    size: 0,
    pending: 0,
    isPaused: false,
    pause: jest.fn(),
    start: jest.fn(),
  }));
});

const config: Config = {
  // Using new Gmail SMTP format
  smtpHost: "smtp.gmail.com",
  smtpPort: 587,
  emailUser: "test@gmail.com",
  emailPass: "fakepassword",
  emailFrom: "Test Sender <test@gmail.com>",
  enableQueue: false,
  rateLimit: {
    maxPerSecond: 2,
  },
  retryOptions: {
    maxRetries: 3,
    retryDelay: 1000,
  },
};

const users: User[] = [
  { name: "Alice", email: "test@gmail.com" },
  { name: "Bob", email: "test2@gmail.com" },
  { name: "Charlie", email: "test3@mmmut.ac.in" },
];

const message: MessageInput = {
  subject: "Hello!",
  body: "This is a test message.",
  html: "<p>This is a test message.</p>",
  cc: ["cc@example.com"],
  bcc: ["bcc@example.com"],
};

describe("EmailNotifier", () => {
  let notifier: EmailNotifier;

  beforeEach(async () => {
    notifier = new EmailNotifier(config);
    await notifier.initialize();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Initialization", () => {
    it("should initialize with valid config", () => {
      expect(notifier).toBeDefined();
    });

    it("should initialize with legacy config format", () => {
      const legacyConfig: Config = {
        senderEmail: "test@gmail.com",
        senderPassword: "fakepassword",
      };
      const legacyNotifier = new EmailNotifier(legacyConfig);
      expect(legacyNotifier).toBeDefined();
    });

    it("should throw error with invalid config", () => {
      const invalidConfig = { emailUser: "invalid-email" } as Config;
      expect(() => new EmailNotifier(invalidConfig)).toThrow();
    });
  });

  describe("sendToOne", () => {
    it("should send email to single user", async () => {
      const result = await notifier.sendToOne(users[0], message);

      expect(result.success).toBe(true);
      expect(result.recipient).toBe(users[0].email);
      expect(result.messageId).toBe("test-message-id");
    });

    it("should handle invalid user data", async () => {
      const invalidUser = { name: "", email: "invalid-email" } as User;

      await expect(notifier.sendToOne(invalidUser, message)).rejects.toThrow();
    });

    it("should handle invalid message data", async () => {
      const invalidMessage = { subject: "", body: "" } as MessageInput;

      await expect(
        notifier.sendToOne(users[0], invalidMessage)
      ).rejects.toThrow();
    });
  });

  describe("sendToAll", () => {
    it("should send email to all users", async () => {
      const result = await notifier.sendToAll(users, message);

      expect(result.totalSent).toBe(3);
      expect(result.totalFailed).toBe(0);
      expect(result.results).toHaveLength(3);

      result.results.forEach((res, index) => {
        expect(res.success).toBe(true);
        expect(res.recipient).toBe(users[index].email);
      });
    });

    it("should handle mixed success/failure results", async () => {
      // Reset all mocks first
      jest.clearAllMocks();

      // Create a specific mock for this test
      const mockTransporter = {
        sendMail: jest
          .fn()
          .mockResolvedValueOnce({ messageId: "test-1" })
          .mockRejectedValueOnce(new Error("Send failed"))
          .mockResolvedValueOnce({ messageId: "test-3" }),
      };

      // Mock nodemailer.createTransport to return our specific mock
      const nodemailer = require("nodemailer");
      nodemailer.createTransport.mockReturnValueOnce(mockTransporter);

      // Create a fresh notifier instance for this test
      const testNotifier = new EmailNotifier(config);
      await testNotifier.initialize();

      const result = await testNotifier.sendToAll(users, message);

      expect(result.totalSent).toBe(2);
      expect(result.totalFailed).toBe(1);
    });
  });

  describe("sendRandom", () => {
    it("should send to specified number of random users", async () => {
      const result = await notifier.sendRandom(users, message, 2);

      expect(result.totalSent).toBe(2);
      expect(result.results).toHaveLength(2);
    });

    it("should throw error if count exceeds user list", async () => {
      await expect(notifier.sendRandom(users, message, 5)).rejects.toThrow();
    });

    it("should default to 1 user when count not specified", async () => {
      const result = await notifier.sendRandom(users, message);

      expect(result.totalSent).toBe(1);
      expect(result.results).toHaveLength(1);
    });
  });

  describe("sendFiltered", () => {
    it("should send to filtered users only", async () => {
      const filter = (user: User) => user.name.startsWith("A");
      const result = await notifier.sendFiltered(users, message, filter);

      expect(result.totalSent).toBe(1);
      expect(result.results[0].recipient).toBe("test@gmail.com"); // Alice's email
    });

    it("should handle no matching users", async () => {
      const filter = (user: User) => user.name.startsWith("Z");
      const result = await notifier.sendFiltered(users, message, filter);

      expect(result.totalSent).toBe(0);
      expect(result.results).toHaveLength(0);
    });
  });

  describe("Queue functionality", () => {
    it("should handle queue operations when enabled", async () => {
      const queueConfig = { ...config, enableQueue: true };
      const queueNotifier = new EmailNotifier(queueConfig);
      await queueNotifier.initialize();

      const stats = queueNotifier.getQueueStats();
      expect(stats).not.toBeNull();

      queueNotifier.pauseQueue();
      queueNotifier.resumeQueue();
    });

    it("should return null queue stats when queue disabled", () => {
      const stats = notifier.getQueueStats();
      expect(stats).toBeNull();
    });
  });

  describe("Message validation", () => {
    it("should validate message with attachments", async () => {
      const messageWithAttachment: MessageInput = {
        ...message,
        attachments: [
          {
            filename: "test.txt",
            content: "test content",
            contentType: "text/plain",
          },
        ],
      };

      const result = await notifier.sendToOne(users[0], messageWithAttachment);
      expect(result.success).toBe(true);
    });

    it("should validate HTML messages", async () => {
      const htmlMessage: MessageInput = {
        subject: "HTML Test",
        body: "Plain text",
        html: "<h1>HTML Content</h1>",
      };

      const result = await notifier.sendToOne(users[0], htmlMessage);
      expect(result.success).toBe(true);
    });
  });

  describe("Logging functionality", () => {
    it("should call custom logger when provided", async () => {
      const mockLogger = jest.fn();
      const loggerConfig = { ...config, logger: mockLogger };
      const loggerNotifier = new EmailNotifier(loggerConfig);

      await loggerNotifier.initialize();
      expect(mockLogger).toHaveBeenCalledWith(
        "EmailNotifier initialized successfully",
        "info"
      );
    });
  });
});
