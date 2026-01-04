// apps/web/src/lib/patterns-repo.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { findPatternByDomain, savePattern, incrementSuccess } from './patterns-repo';

// Mock the sql module
vi.mock('./db', () => ({
  sql: vi.fn(),
}));

describe('patterns-repo', () => {
  describe('findPatternByDomain', () => {
    it('returns patterns sorted by confidence', async () => {
      const { sql } = await import('./db');
      const mockPatterns = [
        { id: 1, domain: 'example.com', confidence: 0.9 },
        { id: 2, domain: 'example.com', confidence: 0.7 },
      ];
      vi.mocked(sql).mockResolvedValueOnce(mockPatterns as any);

      const result = await findPatternByDomain('example.com');

      expect(result).toEqual(mockPatterns);
    });
  });
});
