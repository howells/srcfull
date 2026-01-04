import { describe, it, expect } from 'vitest';
import { matchCuratedPattern, applyPattern } from './pattern-matcher';

describe('matchCuratedPattern', () => {
  it('matches Condé Nast URLs and transforms to high-quality', () => {
    const url = 'https://media.houseandgarden.co.uk/photos/63e509b43404638ef031982b/1:1/w_400/thumb.jpg';
    const result = matchCuratedPattern(url);

    expect(result).toBe('https://media.houseandgarden.co.uk/photos/63e509b43404638ef031982b/master/w_2560,c_limit/image.jpg');
  });

  it('returns null for unknown URLs', () => {
    const url = 'https://unknown-cdn.com/image.jpg';
    const result = matchCuratedPattern(url);

    expect(result).toBeNull();
  });
});

describe('applyPattern', () => {
  it('applies regex pattern with replacement', () => {
    const url = 'https://example.com/photos/abc123/small/image.jpg';
    const pattern = {
      match_regex: '^(https://example.com/photos/[^/]+)/small/(.+)$',
      transform: '$1/large/$2',
    };

    const result = applyPattern(url, pattern);

    expect(result).toBe('https://example.com/photos/abc123/large/image.jpg');
  });
});
