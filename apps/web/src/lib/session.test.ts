import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock Clerk
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
}));

// Mock DB
vi.mock("@/db/client", () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
  },
}));

describe("session", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  describe("getSession", () => {
    it("returns null when not authenticated", async () => {
      const { auth } = await import("@clerk/nextjs/server");
      vi.mocked(auth).mockResolvedValue({ userId: null } as any);

      const { getSession } = await import("./session");
      const result = await getSession();

      expect(result).toBeNull();
    });

    it("returns existing user when found by clerkUserId", async () => {
      const { auth } = await import("@clerk/nextjs/server");
      const { db } = await import("@/db/client");

      const mockUser = {
        id: "user_123",
        clerkUserId: "clerk_123",
        email: "test@example.com",
        name: "Test User",
        plan: "pro",
        createdAt: new Date(),
      };

      vi.mocked(auth).mockResolvedValue({ userId: "clerk_123" } as any);
      vi.mocked(db.select().from(null as any).where(null as any).limit).mockResolvedValue([mockUser]);

      const { getSession } = await import("./session");
      const result = await getSession();

      expect(result).toEqual(mockUser);
    });

    it("auto-links existing user by email on first Clerk sign-in", async () => {
      const { auth, currentUser } = await import("@clerk/nextjs/server");
      const { db } = await import("@/db/client");

      const existingUser = {
        id: "user_123",
        clerkUserId: null,
        email: "existing@example.com",
        name: "Existing User",
        plan: "free",
        createdAt: new Date(),
      };

      const updatedUser = { ...existingUser, clerkUserId: "clerk_new" };

      vi.mocked(auth).mockResolvedValue({ userId: "clerk_new" } as any);
      vi.mocked(currentUser).mockResolvedValue({
        emailAddresses: [{ emailAddress: "existing@example.com" }],
        firstName: "Existing",
        lastName: "User",
      } as any);

      // First query: no user by clerkUserId
      // Second query: user found by email
      let queryCount = 0;
      vi.mocked(db.select().from(null as any).where(null as any).limit).mockImplementation(async () => {
        queryCount++;
        if (queryCount === 1) return []; // No user by clerkUserId
        return [existingUser]; // User found by email
      });

      vi.mocked(db.update(null as any).set(null as any).where(null as any).returning).mockResolvedValue([updatedUser]);

      const { getSession } = await import("./session");
      const result = await getSession();

      expect(result).toEqual(updatedUser);
      expect(result?.clerkUserId).toBe("clerk_new");
    });

    it("creates new user when no existing user found", async () => {
      const { auth, currentUser } = await import("@clerk/nextjs/server");
      const { db } = await import("@/db/client");

      const newUser = {
        id: "user_new",
        clerkUserId: "clerk_new",
        email: "new@example.com",
        name: "New User",
        plan: "free",
        createdAt: new Date(),
      };

      vi.mocked(auth).mockResolvedValue({ userId: "clerk_new" } as any);
      vi.mocked(currentUser).mockResolvedValue({
        emailAddresses: [{ emailAddress: "new@example.com" }],
        firstName: "New",
        lastName: "User",
      } as any);

      // Both queries return empty
      vi.mocked(db.select().from(null as any).where(null as any).limit).mockResolvedValue([]);
      vi.mocked(db.insert(null as any).values(null as any).returning).mockResolvedValue([newUser]);

      const { getSession } = await import("./session");
      const result = await getSession();

      expect(result).toEqual(newUser);
      expect(result?.email).toBe("new@example.com");
    });

    it("returns null when Clerk user has no email", async () => {
      const { auth, currentUser } = await import("@clerk/nextjs/server");
      const { db } = await import("@/db/client");

      vi.mocked(auth).mockResolvedValue({ userId: "clerk_123" } as any);
      vi.mocked(currentUser).mockResolvedValue({
        emailAddresses: [],
      } as any);

      vi.mocked(db.select().from(null as any).where(null as any).limit).mockResolvedValue([]);

      const { getSession } = await import("./session");
      const result = await getSession();

      expect(result).toBeNull();
    });
  });

  describe("requireSession", () => {
    it("throws when not authenticated", async () => {
      const { auth } = await import("@clerk/nextjs/server");
      vi.mocked(auth).mockResolvedValue({ userId: null } as any);

      const { requireSession } = await import("./session");

      await expect(requireSession()).rejects.toThrow("Unauthorized");
    });

    it("returns user when authenticated", async () => {
      const { auth } = await import("@clerk/nextjs/server");
      const { db } = await import("@/db/client");

      const mockUser = {
        id: "user_123",
        clerkUserId: "clerk_123",
        email: "test@example.com",
        name: "Test User",
        plan: "pro",
        createdAt: new Date(),
      };

      vi.mocked(auth).mockResolvedValue({ userId: "clerk_123" } as any);
      vi.mocked(db.select().from(null as any).where(null as any).limit).mockResolvedValue([mockUser]);

      const { requireSession } = await import("./session");
      const result = await requireSession();

      expect(result).toEqual(mockUser);
    });
  });
});
