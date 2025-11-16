import { describe, it, expect, vi, beforeEach } from 'vitest';
import { executeScrapeWebpage } from '../lib/tools/scrape-webpage';
import { executeExtractImageElements } from '../lib/tools/extract-image-elements';
import { executeMatchKnownPatterns } from '../lib/tools/match-known-patterns';

// Create wrapper objects with execute methods for compatibility with tests
const scrapeWebpage = { execute: (params: { url: string }) => executeScrapeWebpage(params.url) };
const extractImageElements = { execute: (params: { html: string }) => executeExtractImageElements(params.html) };
const matchKnownPatterns = { execute: (params: { url: string }) => executeMatchKnownPatterns(params.url) };

// Mock ScrapingBee client
vi.mock('scrapingbee', () => {
  return {
    ScrapingBeeClient: class MockScrapingBeeClient {
      async get({ url }: { url: string }) {
        // Return mock HTML based on the URL
        if (url.includes('kvadrat.dk/en/products/curtains/5539-air-line')) {
          return {
            data: Buffer.from(`
              <html>
                <head><title>Air Line - Kvadrat</title></head>
                <body>
                  <div class="product-gallery">
                    <img
                      src="https://kvadrat-imageresizer.azureedge.net/iri/7C7B7A66-66B4-4D48-90380C3A56519248?cachebust=0&width=250&height=250&format=jpg&scale=both&mode=crop&quality=85"
                      srcset="https://kvadrat-imageresizer.azureedge.net/iri/7C7B7A66-66B4-4D48-90380C3A56519248?cachebust=0&width=250&height=250&format=jpg&scale=both&mode=crop&quality=85 250w,
                              https://kvadrat-imageresizer.azureedge.net/iri/7C7B7A66-66B4-4D48-90380C3A56519248?cachebust=0&width=500&height=500&format=jpg&scale=both&mode=crop&quality=85 500w,
                              https://kvadrat-imageresizer.azureedge.net/iri/7C7B7A66-66B4-4D48-90380C3A56519248?cachebust=0&width=1500&height=1500&format=jpg&scale=both&mode=crop&quality=85 1500w"
                      alt=""
                      width="900"
                      height="900"
                    />
                    <img
                      src="https://kvadrat-imageresizer.azureedge.net/iri/47CF8F45-60F6-445E-BE15211C41109A7A?width=250&height=250&format=jpg&scale=both&mode=crop&quality=85"
                      srcset="https://kvadrat-imageresizer.azureedge.net/iri/47CF8F45-60F6-445E-BE15211C41109A7A?width=250&height=250&format=jpg&scale=both&mode=crop&quality=85 250w,
                              https://kvadrat-imageresizer.azureedge.net/iri/47CF8F45-60F6-445E-BE15211C41109A7A?width=500&height=500&format=jpg&scale=both&mode=crop&quality=85 500w,
                              https://kvadrat-imageresizer.azureedge.net/iri/47CF8F45-60F6-445E-BE15211C41109A7A?width=1500&height=1500&format=jpg&scale=both&mode=crop&quality=85 1500w"
                      alt="Air Line"
                      width="900"
                      height="900"
                    />
                    <img
                      src="https://kvadrat-imageresizer.azureedge.net/iri/190B0909-661E-4A19-8DF24ACAE309071F?cachebust=0&width=250&height=250&format=jpg&scale=both&mode=crop&quality=85"
                      srcset="https://kvadrat-imageresizer.azureedge.net/iri/190B0909-661E-4A19-8DF24ACAE309071F?cachebust=0&width=250&height=250&format=jpg&scale=both&mode=crop&quality=85 250w,
                              https://kvadrat-imageresizer.azureedge.net/iri/190B0909-661E-4A19-8DF24ACAE309071F?cachebust=0&width=500&height=500&format=jpg&scale=both&mode=crop&quality=85 500w,
                              https://kvadrat-imageresizer.azureedge.net/iri/190B0909-661E-4A19-8DF24ACAE309071F?cachebust=0&width=1500&height=1500&format=jpg&scale=both&mode=crop&quality=85 1500w"
                      alt=""
                      width="900"
                      height="900"
                    />
                  </div>
                </body>
              </html>
            `),
          };
        }

        if (url.includes('kvadrat.dk')) {
          return {
            data: Buffer.from(`
              <html>
                <head><title>Kvadrat Fabric</title></head>
                <body>
                  <div class="product">
                    <img
                      src="https://cdn.shopify.com/s/files/1/0555/5722/6653/products/fabric-texture_large.jpg?v=1234567890"
                      srcset="https://cdn.shopify.com/s/files/1/0555/5722/6653/products/fabric-texture_small.jpg 300w,
                              https://cdn.shopify.com/s/files/1/0555/5722/6653/products/fabric-texture_medium.jpg 600w,
                              https://cdn.shopify.com/s/files/1/0555/5722/6653/products/fabric-texture_large.jpg 1200w"
                      alt="Fabric Texture"
                      width="1200"
                      height="800"
                    />
                    <img src="https://cdn.shopify.com/s/files/1/0555/5722/6653/products/fabric-detail_grande.jpg?v=9876543210" alt="Detail view" />
                  </div>
                  <div class="gallery" style="background-image: url('https://cdn.shopify.com/s/files/1/0555/5722/6653/files/banner_master.jpg')"></div>
                </body>
              </html>
            `),
          };
        }

        if (url.includes('cloudinary-demo.com')) {
          return {
            data: Buffer.from(`
              <html>
                <body>
                  <img src="https://res.cloudinary.com/demo/image/upload/w_800,h_600,c_fill,q_90/sample-product.jpg" alt="Product" />
                  <img src="https://res.cloudinary.com/demo/image/upload/w_400,h_300,c_thumb,f_auto/thumbnail.jpg" alt="Thumbnail" />
                  <picture>
                    <source srcset="https://res.cloudinary.com/demo/image/upload/w_1200,h_800,c_scale/hero.jpg" />
                    <img src="https://res.cloudinary.com/demo/image/upload/w_600,h_400,c_scale/hero.jpg" alt="Hero" />
                  </picture>
                </body>
              </html>
            `),
          };
        }

        if (url.includes('wordpress-site.com')) {
          return {
            data: Buffer.from(`
              <html>
                <body>
                  <img src="https://wordpress-site.com/wp-content/uploads/2024/01/post-image-800x600.jpg" alt="Post" />
                  <img src="https://wordpress-site.com/wp-content/uploads/2024/01/featured-1024x768.jpg" alt="Featured" />
                </body>
              </html>
            `),
          };
        }

        if (url.includes('imgix-demo.net')) {
          return {
            data: Buffer.from(`
              <html>
                <body>
                  <img src="https://assets.imgix.net/photos/sample.jpg?w=800&h=600&fit=crop&auto=format&q=85" alt="Sample" />
                </body>
              </html>
            `),
          };
        }

        if (url.includes('empty-page.com')) {
          return {
            data: Buffer.from(''),
          };
        }

        if (url.includes('error-page.com')) {
          throw new Error('Failed to fetch page');
        }

        // Default response
        return {
          data: Buffer.from(`
            <html>
              <body>
                <img src="https://example.com/image.jpg?w=800&h=600" alt="Generic image" />
              </body>
            </html>
          `),
        };
      }
    },
  };
});

describe('Scraping Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Full scraping workflow', () => {
    it('should scrape, extract, and clean Shopify images from kvadrat.dk', async () => {
      const url = 'https://kvadrat.dk/products/test';

      // Step 1: Scrape the webpage
      const scrapeResult = await scrapeWebpage.execute({ url });
      expect(scrapeResult.success).toBe(true);
      expect(scrapeResult.data).toBeTruthy();

      // Step 2: Extract images from HTML
      const extractResult = await extractImageElements.execute({ html: scrapeResult.data! });
      expect(extractResult.success).toBe(true);
      expect(extractResult.data).toBeTruthy();
      expect(extractResult.data!.length).toBeGreaterThan(0);

      // Should find multiple images
      const imgTags = extractResult.data!.filter(img => img.source === 'img');
      const bgImages = extractResult.data!.filter(img => img.source === 'background');
      expect(imgTags.length).toBeGreaterThanOrEqual(2);
      expect(bgImages.length).toBeGreaterThanOrEqual(1);

      // Step 3: Clean URLs using pattern matching
      const firstImage = extractResult.data![0];
      const cleanResult = await matchKnownPatterns.execute({ url: firstImage.url });
      expect(cleanResult.success).toBe(true);
      expect(cleanResult.data).toBeTruthy();

      // Verify the cleaned URL doesn't have size suffix or version parameter
      expect(cleanResult.data).not.toContain('_large');
      expect(cleanResult.data).not.toContain('v=1234567890');
      expect(cleanResult.data).toContain('fabric-texture.jpg');
    });

    it('should handle Cloudinary images correctly', async () => {
      const url = 'https://cloudinary-demo.com/products';

      const scrapeResult = await scrapeWebpage.execute({ url });
      expect(scrapeResult.success).toBe(true);

      const extractResult = await extractImageElements.execute({ html: scrapeResult.data! });
      expect(extractResult.success).toBe(true);
      expect(extractResult.data!.length).toBeGreaterThan(0);

      // Find the product image
      const productImage = extractResult.data!.find(img =>
        img.url.includes('sample-product.jpg')
      );
      expect(productImage).toBeTruthy();

      // Clean the URL
      const cleanResult = await matchKnownPatterns.execute({ url: productImage!.url });
      expect(cleanResult.success).toBe(true);
      expect(cleanResult.data).toBeTruthy();
      expect(cleanResult.data).not.toContain('w_800');
      expect(cleanResult.data).not.toContain('h_600');
      expect(cleanResult.data).not.toContain('c_fill');
      expect(cleanResult.data).not.toContain('q_90');
    });

    it('should handle WordPress upload images correctly', async () => {
      const url = 'https://wordpress-site.com/blog/post';

      const scrapeResult = await scrapeWebpage.execute({ url });
      expect(scrapeResult.success).toBe(true);

      const extractResult = await extractImageElements.execute({ html: scrapeResult.data! });
      expect(extractResult.success).toBe(true);
      expect(extractResult.data!.length).toBe(2);

      // Clean both WordPress images
      for (const image of extractResult.data!) {
        const cleanResult = await matchKnownPatterns.execute({ url: image.url });
        expect(cleanResult.success).toBe(true);
        expect(cleanResult.data).toBeTruthy();

        // Verify size suffix is removed
        expect(cleanResult.data).not.toContain('-800x600');
        expect(cleanResult.data).not.toContain('-1024x768');
      }
    });

    it('should handle imgix URLs correctly', async () => {
      const url = 'https://imgix-demo.net/gallery';

      const scrapeResult = await scrapeWebpage.execute({ url });
      expect(scrapeResult.success).toBe(true);

      const extractResult = await extractImageElements.execute({ html: scrapeResult.data! });
      expect(extractResult.success).toBe(true);
      expect(extractResult.data!.length).toBe(1);

      const cleanResult = await matchKnownPatterns.execute({ url: extractResult.data![0].url });
      expect(cleanResult.success).toBe(true);
      expect(cleanResult.data).toBe('https://assets.imgix.net/photos/sample.jpg');
    });
  });

  describe('Error handling', () => {
    it('should handle empty page responses', async () => {
      const url = 'https://empty-page.com';

      const scrapeResult = await scrapeWebpage.execute({ url });
      expect(scrapeResult.success).toBe(false);
      expect(scrapeResult.error).toContain('empty response');
    });

    it('should handle scraping errors gracefully', async () => {
      const url = 'https://error-page.com';

      const scrapeResult = await scrapeWebpage.execute({ url });
      expect(scrapeResult.success).toBe(false);
      expect(scrapeResult.error).toBeTruthy();
      expect(scrapeResult.error).toContain('Failed to scrape');
    });

    it('should handle HTML with no images', async () => {
      const scrapeResult = await scrapeWebpage.execute({ url: 'https://example.com' });
      expect(scrapeResult.success).toBe(true);

      const html = `
        <html>
          <body>
            <h1>No images here</h1>
          </body>
        </html>
      `;

      const extractResult = await extractImageElements.execute({ html });
      expect(extractResult.success).toBe(true);
      expect(extractResult.data).toHaveLength(0);
    });
  });

  describe('Multiple CDN patterns', () => {
    it('should correctly identify and clean different CDN patterns', async () => {
      const urls = [
        {
          url: 'https://cdn.shopify.com/s/files/1/0001/2345/products/image_large.jpg',
          expected: 'https://cdn.shopify.com/s/files/1/0001/2345/products/image.jpg',
          cdn: 'Shopify',
        },
        {
          url: 'https://res.cloudinary.com/demo/image/upload/w_800,h_600/sample.jpg',
          expected: 'sample.jpg', // Should contain at least the filename
          cdn: 'Cloudinary',
        },
        {
          url: 'https://assets.imgix.net/image.jpg?w=800&h=600',
          expected: 'https://assets.imgix.net/image.jpg',
          cdn: 'imgix',
        },
        {
          url: 'https://example.com/wp-content/uploads/2024/01/image-300x200.jpg',
          expected: 'https://example.com/wp-content/uploads/2024/01/image.jpg',
          cdn: 'WordPress',
        },
      ];

      for (const { url, expected, cdn } of urls) {
        const result = await matchKnownPatterns.execute({ url });
        expect(result.success).toBe(true);
        expect(result.data).toBeTruthy();
        expect(result.data).toContain(expected);
      }
    });
  });

  describe('Real-world scenarios', () => {
    it('should extract srcset and clean all variants', async () => {
      const url = 'https://kvadrat.dk/products/test';

      const scrapeResult = await scrapeWebpage.execute({ url });
      const extractResult = await extractImageElements.execute({ html: scrapeResult.data! });

      const imageWithSrcset = extractResult.data!.find(img => img.srcset && img.srcset.length > 0);
      expect(imageWithSrcset).toBeTruthy();
      expect(imageWithSrcset!.srcset).toBeDefined();

      // Clean all srcset URLs
      if (imageWithSrcset!.srcset) {
        for (const srcsetUrl of imageWithSrcset!.srcset) {
          const cleanResult = await matchKnownPatterns.execute({ url: srcsetUrl });
          expect(cleanResult.success).toBe(true);

          if (cleanResult.data) {
            // Each variant should clean to the same base URL
            expect(cleanResult.data).toContain('fabric-texture.jpg');
            expect(cleanResult.data).not.toMatch(/_small|_medium|_large/);
          }
        }
      }
    });

    it('should preserve image metadata during extraction', async () => {
      const url = 'https://kvadrat.dk/products/test';

      const scrapeResult = await scrapeWebpage.execute({ url });
      const extractResult = await extractImageElements.execute({ html: scrapeResult.data! });

      const imageWithMetadata = extractResult.data!.find(img => img.width && img.height);
      expect(imageWithMetadata).toBeTruthy();
      expect(imageWithMetadata!.width).toBe(1200);
      expect(imageWithMetadata!.height).toBe(800);
      expect(imageWithMetadata!.alt).toBeTruthy();
    });

    it('should extract 3 main images from Kvadrat Air Line curtains product page', async () => {
      const url = 'https://www.kvadrat.dk/en/products/curtains/5539-air-line';

      const scrapeResult = await scrapeWebpage.execute({ url });
      expect(scrapeResult.success).toBe(true);
      expect(scrapeResult.data).toBeTruthy();

      const extractResult = await extractImageElements.execute({ html: scrapeResult.data! });
      expect(extractResult.success).toBe(true);
      expect(extractResult.data).toBeTruthy();

      const mainImages = extractResult.data!.filter(img => img.source === 'img');
      expect(mainImages.length).toBe(3);

      expect(mainImages[0].url).toContain('kvadrat-imageresizer.azureedge.net');
      expect(mainImages[0].url).toContain('7C7B7A66-66B4-4D48-90380C3A56519248');
      expect(mainImages[0].width).toBe(900);
      expect(mainImages[0].height).toBe(900);

      expect(mainImages[1].url).toContain('kvadrat-imageresizer.azureedge.net');
      expect(mainImages[1].url).toContain('47CF8F45-60F6-445E-BE15211C41109A7A');
      expect(mainImages[1].alt).toBe('Air Line');
      expect(mainImages[1].width).toBe(900);
      expect(mainImages[1].height).toBe(900);

      expect(mainImages[2].url).toContain('kvadrat-imageresizer.azureedge.net');
      expect(mainImages[2].url).toContain('190B0909-661E-4A19-8DF24ACAE309071F');
      expect(mainImages[2].width).toBe(900);
      expect(mainImages[2].height).toBe(900);

      for (const image of mainImages) {
        expect(image.srcset).toBeDefined();
        expect(image.srcset!.length).toBeGreaterThan(0);
      }
    });
  });
});
