// apps/web/src/lib/resolver.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolve, type ResolveResult } from './resolver';

vi.mock('./cache-repo', () => ({
  getCached: vi.fn(),
  setCache: vi.fn(),
}));

vi.mock('./patterns-repo', () => ({
  findPatternByDomain: vi.fn(),
  savePattern: vi.fn(),
  incrementSuccess: vi.fn(),
}));

vi.mock('./pattern-matcher', () => ({
  matchCuratedPattern: vi.fn(),
  applyPattern: vi.fn(),
}));

vi.mock('./prober', () => ({
  probeForSource: vi.fn(),
}));

vi.mock('./validator', () => ({
  validateImageUrl: vi.fn(),
}));

describe('resolve', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns cached result if available', async () => {
    const { getCached } = await import('./cache-repo');
    vi.mocked(getCached).mockResolvedValue('https://cached.com/image.jpg');

    const result = await resolve('https://original.com/image.jpg');

    expect(result.resolved).toBe('https://cached.com/image.jpg');
    expect(result.method).toBe('cached');
  });

  it('uses curated pattern if matched', async () => {
    const { getCached } = await import('./cache-repo');
    const { matchCuratedPattern } = await import('./pattern-matcher');
    const { validateImageUrl } = await import('./validator');

    vi.mocked(getCached).mockResolvedValue(null);
    vi.mocked(matchCuratedPattern).mockReturnValue('https://source.com/image.jpg');
    vi.mocked(validateImageUrl).mockResolvedValue({ valid: true, size: 100000 });

    const result = await resolve('https://cdn.com/image.jpg');

    expect(result.resolved).toBe('https://source.com/image.jpg');
    expect(result.method).toBe('pattern');
  });

  it('uses learned pattern if curated pattern not found', async () => {
    const { getCached } = await import('./cache-repo');
    const { matchCuratedPattern, applyPattern } = await import('./pattern-matcher');
    const { validateImageUrl } = await import('./validator');
    const { findPatternByDomain, incrementSuccess } = await import('./patterns-repo');

    vi.mocked(getCached).mockResolvedValue(null);
    vi.mocked(matchCuratedPattern).mockReturnValue(null);
    vi.mocked(validateImageUrl).mockResolvedValue({ valid: true, size: 200000 });
    vi.mocked(findPatternByDomain).mockResolvedValue([
      {
        id: 1,
        domain: 'example.com',
        match_regex: '^https://example\\.com/(.+)$',
        transform: 'https://source.example.com/$1',
        confidence: 0.8,
        successes: 10,
        failures: 2,
        created_at: new Date(),
        last_used_at: new Date(),
      },
    ]);
    vi.mocked(applyPattern).mockReturnValue('https://source.example.com/image.jpg');

    const result = await resolve('https://example.com/image.jpg');

    expect(result.resolved).toBe('https://source.example.com/image.jpg');
    expect(result.method).toBe('learned');
    expect(result.confidence).toBe(0.8);
    expect(incrementSuccess).toHaveBeenCalledWith(1);
  });

  it('probes for source if no patterns match', async () => {
    const { getCached } = await import('./cache-repo');
    const { matchCuratedPattern } = await import('./pattern-matcher');
    const { validateImageUrl } = await import('./validator');
    const { findPatternByDomain } = await import('./patterns-repo');
    const { probeForSource } = await import('./prober');

    vi.mocked(getCached).mockResolvedValue(null);
    vi.mocked(matchCuratedPattern).mockReturnValue(null);
    vi.mocked(validateImageUrl).mockResolvedValue({ valid: true, size: 50000 });
    vi.mocked(findPatternByDomain).mockResolvedValue([]);
    vi.mocked(probeForSource).mockResolvedValue({
      url: 'https://probed.com/image.jpg',
      size: 150000,
      method: 'probed',
    });

    const result = await resolve('https://cdn.com/image.jpg');

    expect(result.resolved).toBe('https://probed.com/image.jpg');
    expect(result.method).toBe('probed');
  });

  it('returns original URL as fallback when nothing works', async () => {
    const { getCached } = await import('./cache-repo');
    const { matchCuratedPattern } = await import('./pattern-matcher');
    const { validateImageUrl } = await import('./validator');
    const { findPatternByDomain } = await import('./patterns-repo');
    const { probeForSource } = await import('./prober');

    vi.mocked(getCached).mockResolvedValue(null);
    vi.mocked(matchCuratedPattern).mockReturnValue(null);
    vi.mocked(validateImageUrl).mockResolvedValue({ valid: true, size: 50000 });
    vi.mocked(findPatternByDomain).mockResolvedValue([]);
    vi.mocked(probeForSource).mockResolvedValue(null);

    const result = await resolve('https://original.com/image.jpg');

    expect(result.resolved).toBe('https://original.com/image.jpg');
    expect(result.method).toBe('fallback');
  });

  it('calculates size increase correctly', async () => {
    const { getCached } = await import('./cache-repo');
    const { matchCuratedPattern } = await import('./pattern-matcher');
    const { validateImageUrl } = await import('./validator');

    vi.mocked(getCached).mockResolvedValue(null);
    vi.mocked(matchCuratedPattern).mockReturnValue('https://source.com/image.jpg');
    vi.mocked(validateImageUrl)
      .mockResolvedValueOnce({ valid: true, size: 50000 }) // original
      .mockResolvedValueOnce({ valid: true, size: 200000 }); // resolved

    const result = await resolve('https://cdn.com/image.jpg');

    expect(result.sizeIncrease).toBe('4.0x');
  });

  it('continues when cache is unavailable', async () => {
    const { getCached } = await import('./cache-repo');
    const { matchCuratedPattern } = await import('./pattern-matcher');
    const { validateImageUrl } = await import('./validator');

    vi.mocked(getCached).mockRejectedValue(new Error('DB unavailable'));
    vi.mocked(matchCuratedPattern).mockReturnValue('https://source.com/image.jpg');
    vi.mocked(validateImageUrl).mockResolvedValue({ valid: true, size: 100000 });

    const result = await resolve('https://cdn.com/image.jpg');

    expect(result.resolved).toBe('https://source.com/image.jpg');
    expect(result.method).toBe('pattern');
  });

  it('continues when database pattern lookup fails', async () => {
    const { getCached } = await import('./cache-repo');
    const { matchCuratedPattern } = await import('./pattern-matcher');
    const { validateImageUrl } = await import('./validator');
    const { findPatternByDomain } = await import('./patterns-repo');
    const { probeForSource } = await import('./prober');

    vi.mocked(getCached).mockResolvedValue(null);
    vi.mocked(matchCuratedPattern).mockReturnValue(null);
    vi.mocked(validateImageUrl).mockResolvedValue({ valid: true, size: 50000 });
    vi.mocked(findPatternByDomain).mockRejectedValue(new Error('DB unavailable'));
    vi.mocked(probeForSource).mockResolvedValue({
      url: 'https://probed.com/image.jpg',
      size: 150000,
      method: 'probed',
    });

    const result = await resolve('https://cdn.com/image.jpg');

    expect(result.resolved).toBe('https://probed.com/image.jpg');
    expect(result.method).toBe('probed');
  });

  it('caches successful pattern results', async () => {
    const { getCached, setCache } = await import('./cache-repo');
    const { matchCuratedPattern } = await import('./pattern-matcher');
    const { validateImageUrl } = await import('./validator');

    vi.mocked(getCached).mockResolvedValue(null);
    vi.mocked(matchCuratedPattern).mockReturnValue('https://source.com/image.jpg');
    vi.mocked(validateImageUrl).mockResolvedValue({ valid: true, size: 100000 });

    await resolve('https://cdn.com/image.jpg');

    expect(setCache).toHaveBeenCalledWith(
      'https://cdn.com/image.jpg',
      'https://source.com/image.jpg',
      undefined
    );
  });

  it('skips curated pattern if validation fails', async () => {
    const { getCached } = await import('./cache-repo');
    const { matchCuratedPattern } = await import('./pattern-matcher');
    const { validateImageUrl } = await import('./validator');
    const { findPatternByDomain } = await import('./patterns-repo');
    const { probeForSource } = await import('./prober');

    vi.mocked(getCached).mockResolvedValue(null);
    vi.mocked(matchCuratedPattern).mockReturnValue('https://invalid.com/image.jpg');
    vi.mocked(validateImageUrl)
      .mockResolvedValueOnce({ valid: true, size: 50000 }) // original
      .mockResolvedValueOnce({ valid: false }); // curated pattern result
    vi.mocked(findPatternByDomain).mockResolvedValue([]);
    vi.mocked(probeForSource).mockResolvedValue(null);

    const result = await resolve('https://cdn.com/image.jpg');

    expect(result.method).toBe('fallback');
  });
});
