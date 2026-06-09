import { describe, expect, it } from "vitest";
import { applyCuratedPattern } from "../src/pattern-matcher";
import fixtures from "./fixtures/curated-patterns.json";

interface CuratedPatternFixture {
  pattern: string;
  name: string;
  input: string;
  expected: string;
  sourceUrl: string;
  evidenceUrl: string;
}

const curatedFixtures = fixtures as CuratedPatternFixture[];
const RUN_LIVE_TESTS = process.env.SRCFULL_LIVE_TESTS === "1";

async function requestOk(url: string): Promise<boolean> {
  for (const method of ["HEAD", "GET"] as const) {
    const response = await fetch(url, {
      headers: method === "GET" ? { Range: "bytes=0-0" } : undefined,
      method,
      redirect: "follow",
    });

    if (response.ok) {
      return true;
    }
  }

  return false;
}

describe.skipIf(!RUN_LIVE_TESTS)("live curated pattern fixtures", () => {
  it.each(curatedFixtures)(
    "$name remains reachable and resolves to the researched source",
    async ({ input, expected, pattern }) => {
      expect(applyCuratedPattern(input, pattern)).toBe(expected);
      await expect(requestOk(input)).resolves.toBe(true);
      await expect(requestOk(expected)).resolves.toBe(true);
    },
    30_000,
  );
});
