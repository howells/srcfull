import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  createFileCache,
  createFilePatternStore,
  extractImageCandidatesFromHtml,
  resolveImageUrl,
  scrapePage,
} from "../dist/index.js";

const DEMO_DIR = new URL("../docs/demo/", import.meta.url);
const OUTPUT_FILE = new URL("../docs/demo/index.html", import.meta.url);
const BASE_URL = "https://catalog.example.com/products/lounge-chair";

const SAMPLE_HTML = `
<article class="product-page">
  <meta property="og:image" content="/social/lounge-chair-share.jpg" />
  <img src="/assets/logo.png" width="240" height="80" alt="Brand logo" />
  <img
    data-src="/images/lounge-chair.jpg?w=640"
    data-srcset="/images/lounge-chair.jpg?w=640 1x, /images/lounge-chair.jpg?w=1600 2x"
    width="1600"
    height="1200"
    alt="Lounge chair in walnut"
  />
  <picture>
    <source srcset="/images/lounge-chair-detail.avif 1200w, /images/lounge-chair-detail.jpg 1600w" />
  </picture>
  <div style="background-image: url('/images/lounge-chair-room.jpg?w=900#hero')"></div>
</article>
`.trim();

const SIZE_LOOKUP = new Map([
  [`${BASE_URL}`, 0],
  ["https://catalog.example.com/assets/logo.png", 8_000],
  ["https://catalog.example.com/images/lounge-chair.jpg?w=640", 190_000],
  ["https://catalog.example.com/images/lounge-chair.jpg?w=1600", 940_000],
  ["https://catalog.example.com/images/lounge-chair-detail.avif", 710_000],
  ["https://catalog.example.com/images/lounge-chair-detail.jpg", 880_000],
  ["https://catalog.example.com/images/lounge-chair-room.jpg?w=900", 620_000],
  ["https://catalog.example.com/social/lounge-chair-share.jpg", 240_000],
  ["https://cdn.catalog.example.com/original/lounge-chair.jpg", 1_480_000],
  ["https://cdn.catalog.example.com/original/lounge-chair-room.jpg", 1_120_000],
]);

function createValidateStub() {
  return async (url) => {
    if (url.includes("logo")) {
      return {
        valid: true,
        size: SIZE_LOOKUP.get(url) ?? 8_000,
        contentType: "image/png",
      };
    }

    if (SIZE_LOOKUP.has(url)) {
      return {
        valid: true,
        size: SIZE_LOOKUP.get(url),
        contentType: url.endsWith(".avif") ? "image/avif" : "image/jpeg",
      };
    }

    return {
      valid: true,
      size: 120_000,
      contentType: "image/jpeg",
    };
  };
}

// ── Rendering helpers ────────────────────────────────────────────────

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function json(value) {
  return esc(JSON.stringify(value, null, 2));
}

function shortUrl(url) {
  try {
    const u = new URL(url);
    return u.pathname + u.search;
  } catch {
    return url;
  }
}

function renderCandidateRows(candidates) {
  return candidates
    .map((c) => {
      const isLogo = c.url.includes("logo");
      const dims = c.width && c.height ? `${c.width}\u00d7${c.height}` : "";
      return `<tr${isLogo ? ' class="filtered"' : ""}>
        <td><code>${esc(shortUrl(c.url))}</code></td>
        <td><span class="badge badge-${esc(c.source)}">${esc(c.source)}</span></td>
        <td class="dim">${dims || "\u2014"}</td>
        <td class="dim">${c.alt ? esc(c.alt) : "\u2014"}</td>
      </tr>`;
    })
    .join("\n");
}

function renderImageRows(images) {
  return images
    .map((img) => {
      const changed = img.original !== img.resolved;
      return `<tr>
        <td><code>${esc(shortUrl(img.original))}</code></td>
        <td>${changed ? `<code>${esc(shortUrl(img.resolved))}</code>` : '<span class="dim">unchanged</span>'}</td>
        <td><span class="badge badge-${esc(img.method)}">${esc(img.method)}</span></td>
        <td class="mono">${img.sizeIncrease ? esc(img.sizeIncrease) : "\u2014"}</td>
      </tr>`;
    })
    .join("\n");
}

// ── Main template ────────────────────────────────────────────────────

function renderHtml({
  candidates,
  resolvedOnce,
  resolvedTwice,
  scrapeResult,
  cacheSnapshot,
  patternSnapshot,
}) {
  const stats = scrapeResult.stats;
  const cacheEntryCount =
    cacheSnapshot?.entries && typeof cacheSnapshot.entries === "object"
      ? Object.keys(cacheSnapshot.entries).length
      : 0;
  const patternCount = Array.isArray(patternSnapshot?.patterns)
    ? patternSnapshot.patterns.length
    : 0;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>srcfull \u2014 demo</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; }

    :root {
      color-scheme: dark;
      --bg: #111114;
      --surface: #19191e;
      --border: #27272e;
      --border-2: #323238;
      --text: #a1a1aa;
      --bright: #fafafa;
      --dim: #52525b;
      --accent: #e8a44a;
      --green: #4ade80;
      --green-bg: rgba(74,222,128,0.08);
      --blue: #60a5fa;
      --blue-bg: rgba(96,165,250,0.08);
      --purple: #a78bfa;
      --purple-bg: rgba(167,139,250,0.08);
      --orange: #fb923c;
      --orange-bg: rgba(251,146,60,0.08);
      --red: #f87171;
      --mono: "SF Mono", "Fira Code", Menlo, Consolas, monospace;
      --sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      --radius: 8px;
    }

    body {
      font-family: var(--sans);
      font-size: 15px;
      line-height: 1.6;
      color: var(--text);
      background: var(--bg);
      -webkit-font-smoothing: antialiased;
    }

    main {
      max-width: 920px;
      margin: 0 auto;
      padding: 48px 24px 96px;
    }

    /* ── Header ── */
    .header {
      display: flex;
      align-items: baseline;
      gap: 10px;
      margin-bottom: 56px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
    }
    .header-name {
      font-family: var(--mono);
      font-size: 15px;
      font-weight: 600;
      color: var(--bright);
    }
    .header-ver {
      font-family: var(--mono);
      font-size: 12px;
      color: var(--dim);
    }
    .header-tag {
      margin-left: auto;
      font-size: 12px;
      color: var(--dim);
    }

    /* ── Hero ── */
    .hero { margin-bottom: 56px; }
    .hero h1 {
      font-size: 36px;
      font-weight: 700;
      line-height: 1.15;
      letter-spacing: -0.025em;
      color: var(--bright);
      margin-bottom: 12px;
    }
    .hero-sub {
      font-size: 16px;
      color: var(--text);
      max-width: 54ch;
      line-height: 1.65;
      margin-bottom: 24px;
    }
    .install {
      display: inline-flex;
      gap: 8px;
      padding: 10px 16px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      font-family: var(--mono);
      font-size: 13px;
      color: var(--bright);
    }
    .install .prompt { color: var(--dim); user-select: none; }

    /* ── Stats strip ── */
    .stats {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 28px;
      flex-wrap: wrap;
    }
    .stat-box {
      padding: 14px 18px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      text-align: center;
      min-width: 84px;
    }
    .stat-val {
      font-family: var(--mono);
      font-size: 24px;
      font-weight: 700;
      color: var(--bright);
      line-height: 1;
    }
    .stat-lbl {
      margin-top: 4px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--dim);
    }
    .stat-arrow { color: var(--dim); font-size: 16px; padding: 0 2px; }
    .stat-time {
      margin-left: auto;
      font-family: var(--mono);
      font-size: 13px;
      color: var(--dim);
      padding: 0 4px;
    }

    /* ── Step sections ── */
    .step { margin-top: 56px; padding-top: 40px; border-top: 1px solid var(--border); }
    .step-head { display: flex; gap: 14px; margin-bottom: 24px; }
    .step-num {
      flex: 0 0 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      border: 1px solid var(--border-2);
      font-family: var(--mono);
      font-size: 13px;
      font-weight: 600;
      color: var(--dim);
      margin-top: 2px;
    }
    .step-head h2 {
      font-size: 20px;
      font-weight: 600;
      color: var(--bright);
      letter-spacing: -0.01em;
      margin-bottom: 4px;
    }
    .step-head p { color: var(--text); font-size: 14px; }

    /* ── Panels ── */
    .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; align-items: start; }
    .panel {
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
    }
    .panel-lbl {
      padding: 8px 14px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--dim);
      background: var(--surface);
      border-bottom: 1px solid var(--border);
    }
    pre {
      margin: 0;
      padding: 14px;
      overflow: auto;
      max-height: 360px;
      background: #0e0e12;
      font-family: var(--mono);
      font-size: 12px;
      line-height: 1.7;
      color: var(--text);
    }
    code { font-family: var(--mono); font-size: 12px; }

    /* ── Tables ── */
    table { width: 100%; border-collapse: collapse; }
    th {
      text-align: left;
      padding: 7px 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--dim);
      background: var(--surface);
      border-bottom: 1px solid var(--border);
    }
    td {
      padding: 6px 12px;
      border-bottom: 1px solid var(--border);
      font-size: 13px;
      vertical-align: top;
      line-height: 1.5;
    }
    td code { word-break: break-all; }
    tr:last-child td { border-bottom: none; }
    .dim { color: var(--dim); }
    .mono { font-family: var(--mono); }
    .filtered td { opacity: 0.35; }
    .filtered td code { text-decoration: line-through; }

    /* ── Badges ── */
    .badge {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.02em;
    }
    .badge-img { background: var(--blue-bg); color: var(--blue); }
    .badge-picture { background: var(--purple-bg); color: var(--purple); }
    .badge-background { background: var(--orange-bg); color: var(--orange); }
    .badge-raw { background: rgba(113,113,122,0.12); color: var(--dim); }
    .badge-learned { background: var(--green-bg); color: var(--green); }
    .badge-cached { background: var(--blue-bg); color: var(--blue); }
    .badge-fallback { background: rgba(113,113,122,0.12); color: var(--dim); }

    /* ── Resolve visual ── */
    .resolve-vis {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      margin-bottom: 12px;
      overflow-x: auto;
    }
    .resolve-url {
      font-family: var(--mono);
      font-size: 12.5px;
      padding: 6px 10px;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 6px;
      white-space: nowrap;
    }
    .resolve-url.is-input { color: var(--text); }
    .resolve-url.is-output { color: var(--green); }
    .resolve-arr { color: var(--accent); font-size: 18px; flex-shrink: 0; }
    .resolve-tags { display: flex; gap: 8px; align-items: center; margin-left: auto; flex-shrink: 0; }
    .size-up { font-family: var(--mono); font-size: 12px; font-weight: 600; color: var(--green); }

    /* ── Details / expandable ── */
    details {
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
    }
    details + details { margin-top: 8px; }
    summary {
      padding: 8px 14px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--dim);
      background: var(--surface);
      cursor: pointer;
      user-select: none;
    }
    summary::-webkit-details-marker { display: none; }
    summary::marker { display: none; content: ""; }
    summary::before { content: "\\25B8\\00a0"; }
    details[open] > summary::before { content: "\\25BE\\00a0"; }

    /* ── CLI section ── */
    .cli { margin-top: 48px; padding-top: 40px; border-top: 1px solid var(--border); }
    .cli h2 { font-size: 18px; font-weight: 600; color: var(--bright); margin-bottom: 12px; }
    .cli-cmds { display: grid; gap: 6px; }
    .cli-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
    }
    .cli-lbl {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--dim);
      min-width: 56px;
    }
    .cli-row code { font-size: 13px; color: var(--bright); }

    /* ── Footer ── */
    .foot {
      margin-top: 56px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
      font-size: 12px;
      color: var(--dim);
    }

    /* ── Responsive ── */
    @media (max-width: 640px) {
      main { padding: 24px 16px 64px; }
      .hero h1 { font-size: 26px; }
      .cols { grid-template-columns: 1fr; }
      .stats { flex-direction: column; align-items: stretch; }
      .stat-arrow { display: none; }
      .stat-time { margin-left: 0; text-align: center; }
      .resolve-vis { flex-direction: column; align-items: stretch; }
      .resolve-tags { margin-left: 0; }
    }
  </style>
</head>
<body>
  <main>
    <div class="header">
      <span class="header-name">srcfull</span>
      <span class="header-ver">v2.0.0</span>
      <span class="header-tag">generated from real output</span>
    </div>

    <section class="hero">
      <h1>Extract and resolve web images</h1>
      <p class="hero-sub">
        Give it a URL or raw HTML. srcfull finds every image candidate, upgrades
        CDN-transformed URLs to their highest-quality originals, filters noise like
        logos and icons, and returns a ranked result set. This page was generated
        from real library calls at build time.
      </p>
      <div class="install">
        <span class="prompt">$</span> npm install srcfull
      </div>
      <div class="stats">
        <div class="stat-box">
          <div class="stat-val">${stats.found}</div>
          <div class="stat-lbl">found</div>
        </div>
        <span class="stat-arrow">\u2192</span>
        <div class="stat-box">
          <div class="stat-val">${stats.resolved}</div>
          <div class="stat-lbl">resolved</div>
        </div>
        <span class="stat-arrow">\u2192</span>
        <div class="stat-box">
          <div class="stat-val">${stats.returned}</div>
          <div class="stat-lbl">returned</div>
        </div>
        <span class="stat-time">${stats.durationMs}ms</span>
      </div>
    </section>

    <!-- ── Step 1: Extract ── -->
    <section class="step">
      <div class="step-head">
        <span class="step-num">1</span>
        <div>
          <h2>Extract</h2>
          <p>Parse image candidates from HTML \u2014 img, srcset, picture, CSS backgrounds, and meta tags.</p>
        </div>
      </div>
      <div class="panel" style="margin-bottom: 12px">
        <div class="panel-lbl">${candidates.length} candidates extracted</div>
        <table>
          <thead><tr><th>URL</th><th>Source</th><th>Size</th><th>Alt</th></tr></thead>
          <tbody>${renderCandidateRows(candidates)}</tbody>
        </table>
      </div>
      <details>
        <summary>Input HTML fixture</summary>
        <pre><code>${esc(SAMPLE_HTML)}</code></pre>
      </details>
    </section>

    <!-- ── Step 2: Resolve ── -->
    <section class="step">
      <div class="step-head">
        <span class="step-num">2</span>
        <div>
          <h2>Resolve</h2>
          <p>Upgrade CDN-transformed URLs to full-size originals using learned patterns.</p>
        </div>
      </div>
      <div class="resolve-vis">
        <div class="resolve-url is-input">${esc(shortUrl(resolvedOnce.original))}</div>
        <span class="resolve-arr">\u2192</span>
        <div class="resolve-url is-output">${esc(shortUrl(resolvedOnce.resolved))}</div>
        <div class="resolve-tags">
          <span class="badge badge-learned">${esc(resolvedOnce.method)}</span>
          ${resolvedOnce.sizeIncrease ? `<span class="size-up">${esc(resolvedOnce.sizeIncrease)}</span>` : ""}
        </div>
      </div>
      <div class="cols">
        <div class="panel">
          <div class="panel-lbl">Cold pass</div>
          <pre><code>${json(resolvedOnce)}</code></pre>
        </div>
        <div class="panel">
          <div class="panel-lbl">Cached pass</div>
          <pre><code>${json(resolvedTwice)}</code></pre>
        </div>
      </div>
    </section>

    <!-- ── Step 3: Scrape ── -->
    <section class="step">
      <div class="step-head">
        <span class="step-num">3</span>
        <div>
          <h2>Scrape</h2>
          <p>Full pipeline in one call \u2014 fetch, extract, filter, resolve, rank, return.</p>
        </div>
      </div>
      <div class="panel" style="margin-bottom: 12px">
        <div class="panel-lbl">${scrapeResult.images.length} images returned \u2014 logo filtered, duplicates removed</div>
        <table>
          <thead><tr><th>Original</th><th>Resolved</th><th>Method</th><th>Gain</th></tr></thead>
          <tbody>${renderImageRows(scrapeResult.images)}</tbody>
        </table>
      </div>
      <details>
        <summary>Full scrapePage() response</summary>
        <pre><code>${json(scrapeResult)}</code></pre>
      </details>
    </section>

    <!-- ── Step 4: Stores ── -->
    <section class="step">
      <div class="step-head">
        <span class="step-num">4</span>
        <div>
          <h2>Persistent stores</h2>
          <p>Cache resolved URLs and learned patterns to disk for repeat runs.</p>
        </div>
      </div>
      <div class="cols">
        <details open>
          <summary>Cache \u00b7 ${cacheEntryCount} entries</summary>
          <pre><code>${json(cacheSnapshot)}</code></pre>
        </details>
        <details open>
          <summary>Patterns \u00b7 ${patternCount} learned</summary>
          <pre><code>${json(patternSnapshot)}</code></pre>
        </details>
      </div>
    </section>

    <!-- ── CLI ── -->
    <section class="cli">
      <h2>CLI</h2>
      <div class="cli-cmds">
        <div class="cli-row">
          <span class="cli-lbl">Resolve</span>
          <code>srcfull resolve 'https://cdn.example.com/photo.jpg?w=300'</code>
        </div>
        <div class="cli-row">
          <span class="cli-lbl">Scrape</span>
          <code>srcfull scrape 'https://example.com/listing' --max-images=12</code>
        </div>
        <div class="cli-row">
          <span class="cli-lbl">Version</span>
          <code>srcfull --version</code>
        </div>
      </div>
    </section>

    <div class="foot">
      All data on this page was generated from real <code>srcfull</code> calls at build time.
      Rebuild with <code>pnpm demo:build</code>
    </div>
  </main>
</body>
</html>`;
}

// ── Build pipeline (unchanged) ───────────────────────────────────────

async function main() {
  const tempDir = await mkdtemp(join(tmpdir(), "srcfull-demo-"));
  const cacheFile = join(tempDir, "cache.json");
  const patternFile = join(tempDir, "patterns.json");

  const cache = createFileCache({ filePath: cacheFile, maxEntries: 12 });
  const patternStore = createFilePatternStore({ filePath: patternFile });
  const validate = createValidateStub();
  const candidates = extractImageCandidatesFromHtml(SAMPLE_HTML, BASE_URL);

  await patternStore.save(
    "catalog.example.com",
    "^https://catalog\\.example\\.com/images/(.+)\\.jpg\\?w=\\d+$",
    "https://cdn.catalog.example.com/original/$1.jpg",
  );
  await patternStore.save(
    "catalog.example.com",
    "^https://catalog\\.example\\.com/images/(.+)-room\\.jpg\\?w=\\d+$",
    "https://cdn.catalog.example.com/original/$1-room.jpg",
  );

  const demoUrl = "https://catalog.example.com/images/lounge-chair.jpg?w=640";
  const resolvedOnce = await resolveImageUrl(demoUrl, {
    cache,
    patternStore,
    validate,
  });
  const resolvedTwice = await resolveImageUrl(demoUrl, {
    cache,
    patternStore,
    validate,
  });

  const scrapeResult = await scrapePage(BASE_URL, {
    maxImages: 4,
    fetchHtml: async () => ({
      html: SAMPLE_HTML,
      metadata: {
        source: "demo-fixture",
      },
    }),
    validate,
    resolve: (imageUrl) =>
      resolveImageUrl(imageUrl, {
        cache,
        patternStore,
        validate,
      }),
  });

  const cacheSnapshot = JSON.parse(await readFile(cacheFile, "utf8"));
  const patternSnapshot = JSON.parse(await readFile(patternFile, "utf8"));

  const html = renderHtml({
    candidates,
    resolvedOnce,
    resolvedTwice,
    scrapeResult,
    cacheSnapshot,
    patternSnapshot,
  });

  await mkdir(DEMO_DIR, { recursive: true });
  await writeFile(OUTPUT_FILE, html, "utf8");
  await rm(tempDir, { recursive: true, force: true });

  process.stdout.write("Generated docs/demo/index.html\n");
}

await main();
