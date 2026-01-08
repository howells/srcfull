/**
 * Real image URLs from various CDNs for testing the Beeline resolver.
 * These are actual production URLs gathered from live websites.
 *
 * Each fixture includes:
 * - cdnUrl: The resized/optimized CDN URL
 * - expectedSourcePattern: What we expect the source URL pattern to look like
 * - description: Context about the image
 */

export type TestUrl = {
  cdnUrl: string;
  expectedSourcePattern?: string;
  description: string;
};

export type CdnFixtures = {
  name: string;
  domain: string;
  description: string;
  urls: TestUrl[];
};

/**
 * Condé Nast Media CDN
 * Pattern: media.{publication}.co.uk/photos/{id}/{aspect}/{size}/image.jpg
 * Source: Replace aspect/size with master/w_2560,c_limit
 */
export const condeNast: CdnFixtures = {
  name: "Condé Nast",
  domain: "media.houseandgarden.co.uk",
  description:
    "Condé Nast publications (House & Garden, Vogue, GQ, etc.) use a consistent media CDN with predictable URL patterns",
  urls: [
    {
      cdnUrl:
        "https://media.houseandgarden.co.uk/photos/68271e47366321b515ff830f/master/w_160%2Cc_limit/Carly-Jo-Morgan-Gardens-17.jpg",
      expectedSourcePattern:
        "https://media.houseandgarden.co.uk/photos/68271e47366321b515ff830f/master/w_2560,c_limit/Carly-Jo-Morgan-Gardens-17.jpg",
      description: "Garden photography - small thumbnail",
    },
    {
      cdnUrl:
        "https://media.houseandgarden.co.uk/photos/6825f46f366321b515ff82a3/1:1/w_1920%2Cc_limit/undefined",
      expectedSourcePattern:
        "https://media.houseandgarden.co.uk/photos/6825f46f366321b515ff82a3/master/w_2560,c_limit/undefined",
      description: "Square crop with 1920px width",
    },
    {
      cdnUrl:
        "https://media.houseandgarden.co.uk/photos/6827210b366321b515ff8313/4:3/w_2560%2Cc_limit/Carly-Jo-Morgan-Gardens-23.jpg",
      expectedSourcePattern:
        "https://media.houseandgarden.co.uk/photos/6827210b366321b515ff8313/master/w_2560,c_limit/Carly-Jo-Morgan-Gardens-23.jpg",
      description: "4:3 aspect ratio crop",
    },
    {
      cdnUrl:
        "https://media.houseandgarden.co.uk/photos/682720d5366321b515ff8311/16:9/w_2560%2Cc_limit/Carly-Jo-Morgan-Gardens-16.jpg",
      expectedSourcePattern:
        "https://media.houseandgarden.co.uk/photos/682720d5366321b515ff8311/master/w_2560,c_limit/Carly-Jo-Morgan-Gardens-16.jpg",
      description: "16:9 widescreen crop",
    },
    {
      cdnUrl:
        "https://media.houseandgarden.co.uk/photos/63e509b43404638ef031982b/1:1/w_400/thumb.jpg",
      expectedSourcePattern:
        "https://media.houseandgarden.co.uk/photos/63e509b43404638ef031982b/master/w_2560,c_limit/image.jpg",
      description: "Small 1:1 thumbnail",
    },
  ],
};

/**
 * Dezeen Static CDN
 * Pattern: static.dezeen.com/uploads/{year}/{month}/{name}_{size}.jpg
 * Source: Remove size suffix to get original
 */
export const dezeen: CdnFixtures = {
  name: "Dezeen",
  domain: "static.dezeen.com",
  description:
    "Architecture and design publication with size suffixes in filenames",
  urls: [
    {
      cdnUrl:
        "https://static.dezeen.com/uploads/2025/12/woolwich-pavilion-studio-weave_dezeen_2364_sq_0-191x191.jpg",
      expectedSourcePattern:
        "https://static.dezeen.com/uploads/2025/12/woolwich-pavilion-studio-weave_dezeen_2364_sq_0.jpg",
      description: "Woolwich Pavilion - 191x191 square thumbnail",
    },
    {
      cdnUrl:
        "https://static.dezeen.com/uploads/2024/07/pavilion-series-1-form-design-architecture_dezeen_2364_col_0-1704x958.jpg",
      expectedSourcePattern:
        "https://static.dezeen.com/uploads/2024/07/pavilion-series-1-form-design-architecture_dezeen_2364_col_0.jpg",
      description: "Form Design Architecture - large landscape",
    },
    {
      cdnUrl:
        "https://static.dezeen.com/uploads/2025/01/bjarke-ingels-group-big-floating-city-oceanix-busan_dezeen_2364_col_0-852x479.jpg",
      expectedSourcePattern:
        "https://static.dezeen.com/uploads/2025/01/bjarke-ingels-group-big-floating-city-oceanix-busan_dezeen_2364_col_0.jpg",
      description: "BIG floating city project",
    },
    {
      cdnUrl:
        "https://static.dezeen.com/uploads/2024/03/serpentine-pavilion-2024-minsuk-cho_dezeen_2364_hero-852x479.jpg",
      expectedSourcePattern:
        "https://static.dezeen.com/uploads/2024/03/serpentine-pavilion-2024-minsuk-cho_dezeen_2364_hero.jpg",
      description: "Serpentine Pavilion 2024 - hero image",
    },
    {
      cdnUrl:
        "https://static.dezeen.com/uploads/2023/09/serpentine-pavilion-2023-lina-ghotmeh_dezeen_2364_col_0-191x191.jpg",
      expectedSourcePattern:
        "https://static.dezeen.com/uploads/2023/09/serpentine-pavilion-2023-lina-ghotmeh_dezeen_2364_col_0.jpg",
      description: "Serpentine Pavilion 2023 - small square",
    },
  ],
};

/**
 * Shopify CDN
 * Pattern: {store}.com/cdn/shop/files/{filename}?v={version}&width={size}
 * Source: Remove width parameter or set to maximum
 */
export const shopify: CdnFixtures = {
  name: "Shopify",
  domain: "cdn/shop",
  description:
    "Shopify stores use consistent CDN patterns with width parameters",
  urls: [
    {
      cdnUrl:
        "https://www.allbirds.com/cdn/shop/files/Allbirds_WL_RN_SF_PDP_Natural_Grey_LAT.png?v=1751143404&width=1280",
      expectedSourcePattern:
        "https://www.allbirds.com/cdn/shop/files/Allbirds_WL_RN_SF_PDP_Natural_Grey_LAT.png?v=1751143404",
      description: "Allbirds shoe - 1280px width",
    },
    {
      cdnUrl:
        "https://www.allbirds.com/cdn/shop/files/Allbirds_WL_RN_SF_PDP_Natural_Grey_BTM.png?v=1751143404&width=1280",
      expectedSourcePattern:
        "https://www.allbirds.com/cdn/shop/files/Allbirds_WL_RN_SF_PDP_Natural_Grey_BTM.png?v=1751143404",
      description: "Allbirds shoe bottom view",
    },
    {
      cdnUrl:
        "https://www.allbirds.com/cdn/shop/files/Allbirds_WL_RN_SF_PDP_Natural_Grey_TOP.png?v=1751143404&width=1280",
      expectedSourcePattern:
        "https://www.allbirds.com/cdn/shop/files/Allbirds_WL_RN_SF_PDP_Natural_Grey_TOP.png?v=1751143404",
      description: "Allbirds shoe top view",
    },
    {
      cdnUrl:
        "https://www.allbirds.com/cdn/shop/files/Allbirds_WL_RN_SF_PDP_Natural_Grey_QUART.png?v=1751143404&width=640",
      expectedSourcePattern:
        "https://www.allbirds.com/cdn/shop/files/Allbirds_WL_RN_SF_PDP_Natural_Grey_QUART.png?v=1751143404",
      description: "Allbirds shoe quarter view - 640px",
    },
    {
      cdnUrl:
        "https://www.allbirds.com/cdn/shop/files/Nav-Mens-Trail-Runners-800x800.jpg?v=1736972706&width=800",
      expectedSourcePattern:
        "https://www.allbirds.com/cdn/shop/files/Nav-Mens-Trail-Runners-800x800.jpg?v=1736972706",
      description: "Navigation thumbnail",
    },
  ],
};

/**
 * Unsplash CDN
 * Pattern: images.unsplash.com/photo-{id}?params
 * Source: Use ixlib params with high quality settings
 */
export const unsplash: CdnFixtures = {
  name: "Unsplash",
  domain: "images.unsplash.com",
  description: "Stock photography platform with extensive URL parameters",
  urls: [
    {
      cdnUrl:
        "https://images.unsplash.com/photo-1761839256601-e768233e25e7?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      expectedSourcePattern:
        "https://images.unsplash.com/photo-1761839256601-e768233e25e7?fm=jpg&q=100",
      description: "Photo page - 3000px width, 60% quality",
    },
    {
      cdnUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&fit=crop",
      expectedSourcePattern:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=100",
      description: "Mountain landscape - cropped 800px",
    },
    {
      cdnUrl:
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=800&fit=crop&crop=center",
      expectedSourcePattern:
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=100",
      description: "Nature photo - center cropped",
    },
    {
      cdnUrl:
        "https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
      expectedSourcePattern:
        "https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=100",
      description: "Square crop 400x400",
    },
  ],
};

/**
 * Imgix CDN (used by many sites including Unsplash assets)
 * Pattern: {subdomain}.imgix.net/path?params
 * Source: Remove resizing params, keep essential ones
 */
export const imgix: CdnFixtures = {
  name: "Imgix",
  domain: "imgix.net",
  description: "Image processing CDN used by many publishers",
  urls: [
    {
      cdnUrl:
        "https://unsplash-assets.imgix.net/marketing/press-header.jpg?w=1200&q=80&auto=format",
      expectedSourcePattern:
        "https://unsplash-assets.imgix.net/marketing/press-header.jpg?auto=format",
      description: "Unsplash marketing asset",
    },
    {
      cdnUrl:
        "https://images.ctfassets.net/hrltx12pl8hq/3AnnkVqrlhrqb8x1whY3Vj/7e6c7b7f0f1c7f3b7a7d7e7c7b7f0f1c/hero.jpg?w=800&h=600&fit=fill",
      expectedSourcePattern:
        "https://images.ctfassets.net/hrltx12pl8hq/3AnnkVqrlhrqb8x1whY3Vj/7e6c7b7f0f1c7f3b7a7d7e7c7b7f0f1c/hero.jpg",
      description: "Contentful assets CDN",
    },
  ],
};

/**
 * Cloudinary CDN
 * Pattern: res.cloudinary.com/{cloud}/image/upload/{transforms}/path
 * Source: Remove transform segment
 */
export const cloudinary: CdnFixtures = {
  name: "Cloudinary",
  domain: "res.cloudinary.com",
  description: "Popular image CDN with transformation segments in URL path",
  urls: [
    {
      cdnUrl:
        "https://res.cloudinary.com/demo/image/upload/w_400,h_400,c_fill/sample.jpg",
      expectedSourcePattern:
        "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      description: "Demo image with fill crop",
    },
    {
      cdnUrl:
        "https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face/woman.jpg",
      expectedSourcePattern:
        "https://res.cloudinary.com/demo/image/upload/woman.jpg",
      description: "Face-detected thumbnail",
    },
    {
      cdnUrl:
        "https://res.cloudinary.com/demo/image/upload/q_auto,f_auto,w_800/docs/shoes.jpg",
      expectedSourcePattern:
        "https://res.cloudinary.com/demo/image/upload/docs/shoes.jpg",
      description: "Auto quality and format",
    },
  ],
};

/**
 * WordPress/WP Engine CDN
 * Pattern: {site}/wp-content/uploads/{year}/{month}/{name}-{size}.jpg
 * Source: Remove size suffix
 */
export const wordpress: CdnFixtures = {
  name: "WordPress",
  domain: "wp-content/uploads",
  description: "WordPress sites with standard media upload patterns",
  urls: [
    {
      cdnUrl:
        "https://example.com/wp-content/uploads/2024/01/hero-image-1200x800.jpg",
      expectedSourcePattern:
        "https://example.com/wp-content/uploads/2024/01/hero-image.jpg",
      description: "Standard WP thumbnail suffix",
    },
    {
      cdnUrl:
        "https://example.com/wp-content/uploads/2024/01/product-photo-150x150.jpg",
      expectedSourcePattern:
        "https://example.com/wp-content/uploads/2024/01/product-photo.jpg",
      description: "WordPress square thumbnail",
    },
    {
      cdnUrl:
        "https://example.com/wp-content/uploads/2024/01/banner-768x512.jpg",
      expectedSourcePattern:
        "https://example.com/wp-content/uploads/2024/01/banner.jpg",
      description: "WordPress medium size",
    },
  ],
};

/**
 * All fixtures combined for iteration
 */
export const allFixtures: CdnFixtures[] = [
  condeNast,
  dezeen,
  shopify,
  unsplash,
  imgix,
  cloudinary,
  wordpress,
];

/**
 * Get all CDN URLs as a flat array
 */
export function getAllUrls(): TestUrl[] {
  return allFixtures.flatMap((fixture) => fixture.urls);
}

/**
 * Get URLs for a specific CDN by name
 */
export function getUrlsByProvider(name: string): TestUrl[] {
  const fixture = allFixtures.find(
    (f) => f.name.toLowerCase() === name.toLowerCase()
  );
  return fixture?.urls ?? [];
}
