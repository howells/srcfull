import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock Clerk
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

// Mock session
vi.mock("@/lib/session", () => ({
  requireSession: vi.fn(),
}));

// Mock DB
vi.mock("@/db/client", () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn(),
  },
}));

// Mock api-keys
vi.mock("@/lib/api-keys", () => ({
  generateApiKey: vi.fn(() => "sk_live_testkey123456789"),
  getKeyPrefix: vi.fn(() => "sk_live_test"),
  hashApiKey: vi.fn(async () => "hashed_key"),
}));

describe("API Keys Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  describe("GET /api/keys", () => {
    it("returns 401 when not authenticated", async () => {
      const { requireSession } = await import("@/lib/session");
      vi.mocked(requireSession).mockRejectedValue(new Error("Unauthorized"));

      const { GET } = await import("./route");
      const response = await GET();

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.code).toBe("UNAUTHORIZED");
    });

    it("returns user API keys when authenticated", async () => {
      const { requireSession } = await import("@/lib/session");
      const { db } = await import("@/db/client");

      const mockUser = { id: "user_123", plan: "pro" };
      const mockKeys = [
        { id: "key_1", name: "Production", keyPrefix: "sk_live_abc1", createdAt: new Date(), lastUsedAt: null },
        { id: "key_2", name: "Development", keyPrefix: "sk_live_def2", createdAt: new Date(), lastUsedAt: new Date() },
      ];

      vi.mocked(requireSession).mockResolvedValue(mockUser as any);
      vi.mocked(db.select().from(null as any).where).mockResolvedValue(mockKeys);

      const { GET } = await import("./route");
      const response = await GET();

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.keys).toHaveLength(2);
      expect(data.keys[0].name).toBe("Production");
    });
  });

  describe("POST /api/keys", () => {
    it("returns 401 when not authenticated", async () => {
      const { requireSession } = await import("@/lib/session");
      vi.mocked(requireSession).mockRejectedValue(new Error("Unauthorized"));

      const { POST } = await import("./route");
      const request = new Request("http://localhost/api/keys", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      expect(response.status).toBe(401);
    });

    it("returns 402 when user is not on pro plan", async () => {
      const { auth } = await import("@clerk/nextjs/server");
      const { requireSession } = await import("@/lib/session");

      const freeUser = { id: "user_123", plan: "free" };
      vi.mocked(requireSession).mockResolvedValue(freeUser as any);
      vi.mocked(auth).mockResolvedValue({ has: () => false } as any);

      const { POST } = await import("./route");
      const request = new Request("http://localhost/api/keys", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      expect(response.status).toBe(402);
      const data = await response.json();
      expect(data.code).toBe("PAYMENT_REQUIRED");
    });

    it("creates API key for pro user", async () => {
      const { auth } = await import("@clerk/nextjs/server");
      const { requireSession } = await import("@/lib/session");
      const { db } = await import("@/db/client");

      const proUser = { id: "user_123", plan: "pro" };
      const createdKey = {
        id: "key_new",
        name: "My Key",
        keyPrefix: "sk_live_test",
        createdAt: new Date(),
      };

      vi.mocked(requireSession).mockResolvedValue(proUser as any);
      vi.mocked(auth).mockResolvedValue({ has: () => true } as any);
      vi.mocked(db.insert(null as any).values(null as any).returning).mockResolvedValue([createdKey]);

      const { POST } = await import("./route");
      const request = new Request("http://localhost/api/keys", {
        method: "POST",
        body: JSON.stringify({ name: "My Key" }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.key).toBe("sk_live_testkey123456789");
      expect(data.name).toBe("My Key");
    });

    it("allows key creation when Clerk has() returns true even if DB plan is free", async () => {
      const { auth } = await import("@clerk/nextjs/server");
      const { requireSession } = await import("@/lib/session");
      const { db } = await import("@/db/client");

      // User has free plan in DB but Clerk billing says they have pro
      const user = { id: "user_123", plan: "free" };
      const createdKey = {
        id: "key_new",
        name: "Default",
        keyPrefix: "sk_live_test",
        createdAt: new Date(),
      };

      vi.mocked(requireSession).mockResolvedValue(user as any);
      vi.mocked(auth).mockResolvedValue({
        has: ({ feature }: { feature: string }) => feature === "pro",
      } as any);
      vi.mocked(db.insert(null as any).values(null as any).returning).mockResolvedValue([createdKey]);

      const { POST } = await import("./route");
      const request = new Request("http://localhost/api/keys", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it("returns 400 for invalid name", async () => {
      const { auth } = await import("@clerk/nextjs/server");
      const { requireSession } = await import("@/lib/session");

      const proUser = { id: "user_123", plan: "pro" };
      vi.mocked(requireSession).mockResolvedValue(proUser as any);
      vi.mocked(auth).mockResolvedValue({ has: () => true } as any);

      const { POST } = await import("./route");
      const request = new Request("http://localhost/api/keys", {
        method: "POST",
        body: JSON.stringify({ name: "" }), // Empty name should fail
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.code).toBe("INVALID_NAME");
    });
  });
});
