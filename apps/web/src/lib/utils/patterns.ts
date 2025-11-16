import fs from 'fs';
import path from 'path';

export interface Pattern {
  domain: string;
  pattern?: string;
  stripParams?: string[];
  stripSuffixes?: string[];
  sourceTransform?: string;
  preservePath?: string;
  confidence: 'high' | 'medium' | 'low';
  examples?: string[];
  description?: string;
}

export type Patterns = Record<string, Pattern>;

let cachedPatterns: Patterns | null = null;

export function loadPatterns(): Patterns {
  if (cachedPatterns) {
    return cachedPatterns;
  }

  const patternsPath = path.join(process.cwd(), '../../data/patterns.json');
  const data = fs.readFileSync(patternsPath, 'utf-8');
  cachedPatterns = JSON.parse(data) as Patterns;
  return cachedPatterns;
}

export function savePatterns(patterns: Patterns): void {
  const patternsPath = path.join(process.cwd(), '../../data/patterns.json');
  fs.writeFileSync(patternsPath, JSON.stringify(patterns, null, 2));
  cachedPatterns = patterns;
}
