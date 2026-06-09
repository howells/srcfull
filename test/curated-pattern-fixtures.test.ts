import { describe, expect, it } from "vitest";
import { applyCuratedPattern, matchCuratedPattern } from "../src/pattern-matcher";
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

describe("curated pattern fixtures", () => {
  it.each(curatedFixtures)("$name", ({ input, expected, pattern }) => {
    expect(applyCuratedPattern(input, pattern)).toBe(expected);
  });

  it.each(curatedFixtures.filter((fixture) => fixture.pattern !== "generic"))(
    "$name is matched by automatic detection",
    ({ input, expected }) => {
      expect(matchCuratedPattern(input)).toBe(expected);
    },
  );
});
