# Audit Report: srcfull Package

**Date:** 2026-04-04
**Reviewers:** manual audit adapted from `/arc:audit`
**Scope:** full package
**Project Type:** TypeScript library + CLI
**Project Stage:** development

> Severity ratings are calibrated for the **development** stage.

## Executive Summary

The package was already small and testable, which made the real issues obvious: extraction logic was too optimistic about page markup, image validation was less strict than page validation, and the package toolchain still had leftover repo-level assumptions. Those are the kinds of flaws that make a library feel unreliable in production-like usage even when unit tests exist.

This audit fixed the substantive problems during the audit itself. `scrapePage()` now resolves relative and lazy-loaded image sources correctly, image validation blocks private hosts and survives `HEAD`-hostile CDNs, the CLI is more usable, the package now has persistent file-backed stores plus configurable default fetchers, and the package lint/build/test loop is fully green. The published `exports` map is also now truthful: provider/store subpaths are emitted by the build and verified through self-import. No critical or high-severity findings remain.

- **Critical:** 0 issues
- **High:** 0 issues
- **Medium:** 0 issues
- **Low:** 2 issues

## Must Fix

None remaining.

## Should Consider

None remaining.

## Worth Noting

### Add real-world fixture coverage
**File:** `test/`
**Flagged by:** audit
**Description:** Current tests now cover the major logic branches, but they still use synthetic HTML snippets. A small corpus of saved real-world pages would protect against regressions in lazy-loading, meta tags, and markup variations better than synthetic tests alone.
**Recommendation:** Add a few representative HTML fixtures from commerce/editorial pages and assert the top extracted candidates.

### Consider retry/backoff hooks for flaky hosts
**File:** `src/validator.ts`
**Flagged by:** audit
**Description:** Validation is now safe and more resilient, but it still makes a single best-effort attempt per URL. For long-running crawls, some hosts will intermittently fail on `HEAD` and `GET` even when the image is valid.
**Recommendation:** If this package becomes part of a larger crawl pipeline, add optional retry/backoff controls or an injectable fetch policy.

## Low Priority / Suggestions

### Extraction hardening completed during audit
**File:** `src/extract.ts:70`
**Flagged by:** audit
**Description:** The package previously missed relative, lazy-loaded, and social/meta image URLs. This was a functional gap, not a cosmetic one.
**Recommendation:** Keep the new normalization path covered as new candidate sources are added.

### Tooling cleanup completed during audit
**File:** `biome.json:1`
**Flagged by:** audit
**Description:** Linting was still wired to an unavailable monorepo preset. The package now has a self-contained Biome config and a passing lint script.
**Recommendation:** Keep package-local tooling configs self-contained as the repo continues to slim down.

---

## Task Clusters

> Findings grouped by what would be worked on together. Completed items are marked accordingly.

### 1. Image extraction hardening `[completed]`

**Why:** Real pages frequently use relative paths, lazy-loading attributes, and social metadata. Missing those paths makes extraction look unreliable.

| # | Severity | File | Issue | Flagged by |
|---|----------|------|-------|------------|
| 1 | Medium | `src/extract.ts:70` | Normalize relative and protocol-relative candidates | audit |
| 2 | Medium | `src/extract.ts:188` | Support lazy-loaded image attributes and `img srcset` | audit |
| 3 | Medium | `src/extract.ts:245` | Capture meta/link image sources | audit |
| 4 | Medium | `src/scrape.ts:75` | Pass page URL as extraction base | audit |

**Suggested approach:** Completed. Keep extending candidate discovery through the same normalization path rather than adding one-off parsing branches.

### 2. Network safety and validator resilience `[completed]`

**Why:** Image validation should not be less safe than page scraping, and it should not fail on common CDN behavior.

| # | Severity | File | Issue | Flagged by |
|---|----------|------|-------|------------|
| 1 | High | `src/validator.ts:53` | Block private-host image validation to avoid SSRF-style probing | audit |
| 2 | Medium | `src/validator.ts:31` | Fall back from `HEAD` to ranged `GET` for metadata-resistant hosts | audit |
| 3 | Low | `test/validator.test.ts:14` | Add regression coverage for both behaviors | audit |

**Suggested approach:** Completed. Keep network policy centralized in validator code so downstream callers do not have to remember security rules.

### 3. Package ergonomics and toolchain hygiene `[completed]`

**Why:** A package should be operable and self-checking without inheriting broken repo-era assumptions.

| # | Severity | File | Issue | Flagged by |
|---|----------|------|-------|------------|
| 1 | Medium | `src/cli.ts:7` | Add proper help/version/errors and useful scrape flags | audit |
| 2 | Medium | `README.md:13` | Document real extraction capabilities and CLI usage | audit |
| 3 | Medium | `biome.json:1` | Replace broken inherited Biome preset with package-local config | audit |
| 4 | High | `package.json:9` | Declared subpath exports were not emitted by the build | audit |

**Suggested approach:** Completed. Treat the package as standalone from this point forward; avoid references to removed app/tooling layers and keep `exports` aligned with emitted build artifacts.

### 4. Persistence and fetcher resilience `[completed]`

**Why:** A package like this gets much more useful once it can retain learned behavior across runs and expose safe controls over network fetching.

| # | Severity | File | Issue | Flagged by |
|---|----------|------|-------|------------|
| 1 | Medium | `src/stores/file.ts:1` | Add persistent file-backed cache and pattern storage | audit |
| 2 | Medium | `src/scrape.ts:25` | Add configurable built-in HTML fetcher with timeout/content-type guardrails | audit |
| 3 | Medium | `src/providers/firecrawl.ts:1` | Validate provider inputs and reject unsafe/private targets | audit |
| 4 | Medium | `src/providers/scrapingbee.ts:1` | Add provider-side URL/API-key validation and request timeout wrapping | audit |

**Suggested approach:** Completed. Keep the package’s network policy explicit and keep persistence adapters composable rather than coupling them to the core resolver.

---

<details>
<summary>Dismissed findings (0 items)</summary>

No dismissed findings.

</details>

---

## Next Steps

1. Add a small fixture corpus of real HTML pages to strengthen extraction regression coverage.
2. Add optional retry/backoff controls around validation and probing if crawl volume or host flakiness increases.
3. Consider a small ranking/custom-scoring hook so consumers can prioritize candidates beyond file size alone.
