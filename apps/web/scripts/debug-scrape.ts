import { extractImageElementsEnhanced } from "../src/lib/tools/extract-image-elements";
import { executeScrapeWebpage } from "../src/lib/tools/scrape-webpage";

async function main() {
  const url = process.argv[2] || "https://www.themodernhouse.com/sales-list/";

  console.log(`\n=== Scraping: ${url} ===\n`);

  // Step 1: Scrape the page
  console.log("1. Fetching HTML via ScrapingBee...");
  const scrapeResult = await executeScrapeWebpage(url);

  if (!scrapeResult.success) {
    console.error("Scrape failed:", scrapeResult.error);
    process.exit(1);
  }

  const html = scrapeResult.data!;
  console.log(`   HTML length: ${html.length} characters`);
  console.log(
    `   Used stealth proxy: ${scrapeResult.metadata?.usedStealthProxy}`
  );

  // Step 2: Extract images
  console.log("\n2. Extracting images...");
  const sourceDomain = new URL(url).hostname.replace(/^www\./, "");

  const extractResult = await extractImageElementsEnhanced(html, {
    includeRaw: true,
    sourceDomain,
    sortBySize: false, // Skip HEAD requests for speed
  });

  if (!extractResult.success) {
    console.error("Extract failed:", extractResult.error);
    process.exit(1);
  }

  const images = extractResult.data!;
  console.log(`   Found ${images.length} image candidates`);

  // Step 3: Show first few images
  console.log("\n3. First 10 images:");
  for (const img of images.slice(0, 10)) {
    console.log(`   [${img.source}] ${img.url.substring(0, 100)}...`);
  }

  // Step 4: Check HTML for image patterns
  console.log("\n4. HTML diagnostics:");
  const imgTagCount = (html.match(/<img/gi) || []).length;
  const pictureTagCount = (html.match(/<picture/gi) || []).length;
  const bgImageCount = (html.match(/background-image/gi) || []).length;
  console.log(`   <img> tags: ${imgTagCount}`);
  console.log(`   <picture> tags: ${pictureTagCount}`);
  console.log(`   background-image styles: ${bgImageCount}`);

  // Show a snippet of HTML around images
  const imgIndex = html.indexOf("<img");
  if (imgIndex > -1) {
    console.log("\n   First <img> context:");
    console.log(`   ${html.substring(imgIndex, imgIndex + 300)}...`);
  }
}

main().catch(console.error);
