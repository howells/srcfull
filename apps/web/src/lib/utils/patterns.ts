import fs from "node:fs";
import path from "node:path";

export type Pattern = {
  domain: string;
  pattern?: string;
  stripParams?: string[];
  stripSuffixes?: string[];
  extractSource?: {
    pattern: string;
    replacement: string;
  };
  sourceTransform?: string;
  preservePath?: string;
  confidence: "high" | "medium" | "low";
  examples?: string[];
  description?: string;
};

export type Patterns = Record<string, Pattern>;

let cachedPatterns: Patterns | null = null;

export function loadPatterns(): Patterns {
  if (cachedPatterns) {
    return cachedPatterns;
  }

  try {
    const patternsPath = path.join(process.cwd(), "../../data/patterns.json");
    const data = fs.readFileSync(patternsPath, "utf-8");
    cachedPatterns = JSON.parse(data) as Patterns;
    console.log("Loaded patterns from:", patternsPath);
    return cachedPatterns;
  } catch (error) {
    console.error("Failed to load patterns:", error);
    // Return empty patterns instead of crashing
    cachedPatterns = {};
    return cachedPatterns;
  }
}

export function savePatterns(patterns: Patterns): void {
  try {
    const patternsPath = path.join(process.cwd(), "../../data/patterns.json");
    fs.writeFileSync(patternsPath, JSON.stringify(patterns, null, 2));
    cachedPatterns = patterns;
    console.log("Saved patterns to:", patternsPath);
  } catch (error) {
    console.error("Failed to save patterns:", error);
    // Don't crash if we can't save patterns
  }
}
