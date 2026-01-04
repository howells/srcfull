// apps/web/src/lib/validator.test.ts
import { describe, it, expect, vi } from 'vitest';
import { validateImageUrl, type ValidationResult } from './validator';

describe('validateImageUrl', () => {
  it('returns valid for image content-type with size', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({
        'content-type': 'image/jpeg',
        'content-length': '50000',
      }),
    });

    const result = await validateImageUrl('https://example.com/image.jpg');

    expect(result.valid).toBe(true);
    expect(result.contentType).toBe('image/jpeg');
    expect(result.size).toBe(50000);
  });

  it('returns invalid for non-image content-type', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({
        'content-type': 'text/html',
      }),
    });

    const result = await validateImageUrl('https://example.com/page.html');

    expect(result.valid).toBe(false);
  });

  it('returns invalid for failed requests', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });

    const result = await validateImageUrl('https://example.com/404.jpg');

    expect(result.valid).toBe(false);
  });
});
