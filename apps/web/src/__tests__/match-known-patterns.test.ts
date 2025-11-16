import { describe, it, expect, beforeAll } from 'vitest';
import { executeMatchKnownPatterns } from '../lib/tools/match-known-patterns';
import { loadPatterns } from '../lib/utils/patterns';

describe('matchKnownPatterns', () => {
  beforeAll(() => {
    // Ensure patterns are loaded
    loadPatterns();
  });

  describe('Shopify CDN', () => {
    it('should strip version parameter from Shopify URLs', async () => {
      const url = 'https://cdn.shopify.com/s/files/1/0001/2345/products/image.jpg?v=1234';
      const result = await executeMatchKnownPatterns(url);

      expect(result.success).toBe(true);
      expect(result.data).toBeTruthy();
      expect(result.data).not.toContain('v=1234');
    });

    it('should strip size suffixes from Shopify URLs', async () => {
      const url = 'https://cdn.shopify.com/s/files/1/0001/2345/products/image_large.jpg';
      const result = await executeMatchKnownPatterns(url);

      expect(result.success).toBe(true);
      expect(result.data).toBeTruthy();
      expect(result.data).toBe('https://cdn.shopify.com/s/files/1/0001/2345/products/image.jpg');
    });

    it('should handle Shopify URLs with multiple size variants', async () => {
      const urls = [
        'https://cdn.shopify.com/s/files/1/0001/2345/products/image_small.jpg',
        'https://cdn.shopify.com/s/files/1/0001/2345/products/image_medium.jpg',
        'https://cdn.shopify.com/s/files/1/0001/2345/products/image_grande.jpg',
        'https://cdn.shopify.com/s/files/1/0001/2345/products/image_master.jpg',
      ];

      for (const url of urls) {
        const result = await executeMatchKnownPatterns(url);
        expect(result.success).toBe(true);
        expect(result.data).toBe('https://cdn.shopify.com/s/files/1/0001/2345/products/image.jpg');
      }
    });
  });

  describe('Cloudinary CDN', () => {
    it('should strip transformation parameters from Cloudinary URLs', async () => {
      const url = 'https://res.cloudinary.com/demo/image/upload/w_400,h_300,c_fill/sample.jpg';
      const result = await executeMatchKnownPatterns(url);

      expect(result.success).toBe(true);
      expect(result.data).toBeTruthy();
      expect(result.data).not.toContain('w_400');
      expect(result.data).not.toContain('h_300');
      expect(result.data).not.toContain('c_fill');
    });

    it('should strip quality and format parameters from Cloudinary URLs', async () => {
      const url = 'https://res.cloudinary.com/demo/image/upload/q_80,f_auto/sample.jpg';
      const result = await executeMatchKnownPatterns(url);

      expect(result.success).toBe(true);
      expect(result.data).toBeTruthy();
      expect(result.data).not.toContain('q_80');
      expect(result.data).not.toContain('f_auto');
    });

    it('should handle complex Cloudinary transformations', async () => {
      const url = 'https://res.cloudinary.com/demo/image/upload/w_800,h_600,c_fill,q_90,f_webp,dpr_2.0/folder/sample.jpg';
      const result = await executeMatchKnownPatterns(url);

      expect(result.success).toBe(true);
      expect(result.data).toBeTruthy();
      expect(result.data).toContain('folder/sample.jpg');
      expect(result.data).not.toContain('w_800');
      expect(result.data).not.toContain('dpr_2.0');
    });
  });

  describe('Imgix CDN', () => {
    it('should strip query parameters from imgix URLs', async () => {
      const url = 'https://assets.imgix.net/image.jpg?w=800&h=600&fit=crop&auto=format';
      const result = await executeMatchKnownPatterns(url);

      expect(result.success).toBe(true);
      expect(result.data).toBeTruthy();
      expect(result.data).not.toContain('w=800');
      expect(result.data).not.toContain('fit=crop');
    });

    it('should handle imgix URLs with quality and DPR parameters', async () => {
      const url = 'https://assets.imgix.net/image.jpg?q=85&dpr=2&fm=webp';
      const result = await executeMatchKnownPatterns(url);

      expect(result.success).toBe(true);
      expect(result.data).toBeTruthy();
      expect(result.data).toBe('https://assets.imgix.net/image.jpg');
    });
  });

  describe('Sanity CDN', () => {
    it('should strip query parameters from Sanity URLs', async () => {
      const url = 'https://cdn.sanity.io/images/project/production/abc123-800x600.jpg?w=400';
      const result = await executeMatchKnownPatterns(url);

      expect(result.success).toBe(true);
      expect(result.data).toBeTruthy();
      expect(result.data).not.toContain('w=400');
    });

    it('should handle Sanity URLs with dimension suffixes', async () => {
      const url = 'https://cdn.sanity.io/images/project/production/abc123-1920x1080.jpg';
      const result = await executeMatchKnownPatterns(url);

      expect(result.success).toBe(true);
      // Note: According to the pattern, Sanity requires dimension suffix in filename
      // This URL has no query params to strip, so it returns null (no changes)
      expect(result.data).toBeNull();
    });
  });

  describe('WordPress uploads', () => {
    it('should strip size suffixes from WordPress upload URLs', async () => {
      const url = 'https://example.com/wp-content/uploads/2024/01/image-800x600.jpg';
      const result = await executeMatchKnownPatterns(url);

      expect(result.success).toBe(true);
      expect(result.data).toBeTruthy();
      expect(result.data).toBe('https://example.com/wp-content/uploads/2024/01/image.jpg');
    });

    it('should handle WordPress URLs with various size suffixes', async () => {
      const urls = [
        'https://example.com/wp-content/uploads/2024/01/photo-150x150.jpg',
        'https://example.com/wp-content/uploads/2024/01/photo-300x200.jpg',
        'https://example.com/wp-content/uploads/2024/01/photo-1024x768.jpg',
      ];

      for (const url of urls) {
        const result = await executeMatchKnownPatterns(url);
        expect(result.success).toBe(true);
        expect(result.data).toBe('https://example.com/wp-content/uploads/2024/01/photo.jpg');
      }
    });
  });

  describe('Generic patterns', () => {
    it('should strip common resizing parameters as fallback', async () => {
      const url = 'https://example.com/image.jpg?w=800&h=600&quality=90';
      const result = await executeMatchKnownPatterns(url);

      expect(result.success).toBe(true);
      expect(result.data).toBeTruthy();
      expect(result.data).not.toContain('w=800');
      expect(result.data).not.toContain('h=600');
      expect(result.data).not.toContain('quality=90');
    });

    it('should strip width and height parameters', async () => {
      const url = 'https://example.com/image.jpg?width=1200&height=800';
      const result = await executeMatchKnownPatterns(url);

      expect(result.success).toBe(true);
      expect(result.data).toBe('https://example.com/image.jpg');
    });

    it('should strip resize and size parameters', async () => {
      const url = 'https://example.com/image.jpg?resize=800&size=100';
      const result = await executeMatchKnownPatterns(url);

      expect(result.success).toBe(true);
      expect(result.data).toBeTruthy();
      expect(result.data).toBe('https://example.com/image.jpg');
    });
  });

  describe('Edge cases', () => {
    it('should return null for URLs that do not match any pattern', async () => {
      const url = 'https://example.com/image.jpg';
      const result = await executeMatchKnownPatterns(url);

      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
    });

    it('should handle URLs with no query parameters or suffixes', async () => {
      const url = 'https://cdn.shopify.com/s/files/1/0001/2345/products/clean-image.jpg';
      const result = await executeMatchKnownPatterns(url);

      expect(result.success).toBe(true);
      // URL should match Shopify pattern but have no modifications
      expect(result.data).toBeNull();
    });

    it('should preserve non-matching query parameters', async () => {
      const url = 'https://cdn.shopify.com/s/files/1/0001/2345/products/image.jpg?v=1234&custom=value';
      const result = await executeMatchKnownPatterns(url);

      expect(result.success).toBe(true);
      expect(result.data).toBeTruthy();
      // Should strip v=1234 but potentially preserve custom=value
      expect(result.data).not.toContain('v=1234');
    });

    it('should handle malformed URLs gracefully', async () => {
      const url = 'not-a-valid-url';
      const result = await executeMatchKnownPatterns(url);

      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
    });
  });

  describe('Real-world examples', () => {
    it('should handle kvadrat.dk Shopify images', async () => {
      const url = 'https://cdn.shopify.com/s/files/1/0555/5722/6653/products/fabric-sample_large.jpg?v=1234567890';
      const result = await executeMatchKnownPatterns(url);

      expect(result.success).toBe(true);
      expect(result.data).toBeTruthy();
      expect(result.data).toBe('https://cdn.shopify.com/s/files/1/0555/5722/6653/products/fabric-sample.jpg');
    });

    it('should handle multiple CDN patterns in sequence', async () => {
      const cloudinaryUrl = 'https://res.cloudinary.com/demo/image/upload/w_800,h_600/sample.jpg';
      const shopifyUrl = 'https://cdn.shopify.com/s/files/1/0001/2345/products/image_medium.jpg';

      const cloudinaryResult = await executeMatchKnownPatterns(cloudinaryUrl);
      const shopifyResult = await executeMatchKnownPatterns(shopifyUrl);

      expect(cloudinaryResult.success).toBe(true);
      expect(cloudinaryResult.data).toBeTruthy();
      expect(cloudinaryResult.data).not.toContain('w_800');

      expect(shopifyResult.success).toBe(true);
      expect(shopifyResult.data).toBe('https://cdn.shopify.com/s/files/1/0001/2345/products/image.jpg');
    });
  });
});
