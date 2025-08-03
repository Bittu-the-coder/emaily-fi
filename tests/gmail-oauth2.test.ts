import { GmailOAuth2Provider } from "../src/providers/gmail-oauth2";
import { Config } from "../src/types";

describe("GmailOAuth2Provider", () => {
  const mockConfig: Config = {
    provider: "gmail-oauth2",
    emailUser: "test@gmail.com",
    emailFrom: "Test User <test@gmail.com>",
    gmailOAuth2: {
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
      refreshToken: "test-refresh-token",
    },
  };

  let provider: GmailOAuth2Provider;

  beforeEach(() => {
    provider = new GmailOAuth2Provider(mockConfig);
  });

  describe("validateConfig", () => {
    it("should pass validation with valid config", () => {
      expect(() => provider.validateConfig()).not.toThrow();
    });

    it("should throw error when gmailOAuth2 config is missing", () => {
      const invalidConfig = { ...mockConfig };
      delete invalidConfig.gmailOAuth2;
      const invalidProvider = new GmailOAuth2Provider(invalidConfig);

      expect(() => invalidProvider.validateConfig()).toThrow(
        "Gmail OAuth2 configuration is required"
      );
    });

    it("should throw error when clientId is missing", () => {
      const invalidConfig = {
        ...mockConfig,
        gmailOAuth2: {
          ...mockConfig.gmailOAuth2!,
          clientId: "",
        },
      };
      const invalidProvider = new GmailOAuth2Provider(invalidConfig);

      expect(() => invalidProvider.validateConfig()).toThrow(
        "Gmail OAuth2 clientId is required"
      );
    });

    it("should throw error when clientSecret is missing", () => {
      const invalidConfig = {
        ...mockConfig,
        gmailOAuth2: {
          ...mockConfig.gmailOAuth2!,
          clientSecret: "",
        },
      };
      const invalidProvider = new GmailOAuth2Provider(invalidConfig);

      expect(() => invalidProvider.validateConfig()).toThrow(
        "Gmail OAuth2 clientSecret is required"
      );
    });

    it("should throw error when refreshToken is missing", () => {
      const invalidConfig = {
        ...mockConfig,
        gmailOAuth2: {
          ...mockConfig.gmailOAuth2!,
          refreshToken: "",
        },
      };
      const invalidProvider = new GmailOAuth2Provider(invalidConfig);

      expect(() => invalidProvider.validateConfig()).toThrow(
        "Gmail OAuth2 refreshToken is required"
      );
    });

    it("should throw error when email user is missing", () => {
      const invalidConfig = {
        ...mockConfig,
        emailUser: undefined,
        gmailOAuth2: {
          ...mockConfig.gmailOAuth2!,
          emailUser: undefined,
        },
      };
      const invalidProvider = new GmailOAuth2Provider(invalidConfig);

      expect(() => invalidProvider.validateConfig()).toThrow(
        "Email user is required (either gmailOAuth2.emailUser or emailUser)"
      );
    });
  });

  describe("static helper methods", () => {
    it("should generate auth URL", () => {
      const authUrl = GmailOAuth2Provider.generateAuthUrl(
        "client-id",
        "client-secret"
      );

      expect(authUrl).toContain("https://accounts.google.com/o/oauth2/v2/auth");
      expect(authUrl).toContain("client_id=client-id");
      expect(authUrl).toContain("access_type=offline");
      expect(authUrl).toContain("prompt=consent");
    });

    it("should generate auth URL with custom redirect URI", () => {
      const redirectUri = "http://localhost:3000/callback";
      const authUrl = GmailOAuth2Provider.generateAuthUrl(
        "client-id",
        "client-secret",
        redirectUri
      );

      expect(authUrl).toContain(
        `redirect_uri=${encodeURIComponent(redirectUri)}`
      );
    });
  });
});
