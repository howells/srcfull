// apps/web/src/lib/patterns-repo.test.ts
import { describe, expect, it, vi } from "vitest";
import { findPatternByDomain } from "./patterns-repo";

// Mock the db client
vi.mock("@/db/client", () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    onConflictDoUpdate: vi.fn().mockReturnThis(),
    returning: vi.fn(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
  },
}));

describe("patterns-repo", () => {
  describe("findPatternByDomain", () => {
    it("returns patterns sorted by confidence", async () => {
      const { db } = await import("@/db/client");
      const mockPatterns = [
        { id: 1, domain: "example.com", confidence: 0.9 },
        { id: 2, domain: "example.com", confidence: 0.7 },
      ];
      vi.mocked(
        db
          .select()
          .from(null as any)
          .where(null as any).orderBy
      ).mockResolvedValueOnce(mockPatterns as any);

      const result = await findPatternByDomain("example.com");

      expect(result).toEqual(mockPatterns);
    });
  });
});
