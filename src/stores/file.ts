import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type {
  FileCacheOptions,
  FilePatternStoreOptions,
  LearnedPattern,
  PatternStore,
  ResolutionCache,
} from "../types";

type CacheEntry = {
  resolvedUrl: string;
  patternId?: string | number;
  updatedAt: number;
};

type CacheFileState = {
  entries: Record<string, CacheEntry>;
};

type PatternFileState = {
  patterns: LearnedPattern[];
};

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const content = await readFile(filePath, "utf8");
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile(filePath: string, value: unknown): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export function createFileCache(options: FileCacheOptions): ResolutionCache {
  const filePath = options.filePath;
  const maxEntries = Math.max(1, Math.floor(options.maxEntries ?? 1_000));
  const maxAgeMs =
    options.maxAgeMs === undefined
      ? undefined
      : Math.max(0, Math.floor(options.maxAgeMs));
  const statePromise = readJsonFile<CacheFileState>(filePath, { entries: {} });
  let pending = Promise.resolve();

  async function readState(): Promise<CacheFileState> {
    await pending;
    return statePromise;
  }

  function queueWrite(mutator: (state: CacheFileState) => void): Promise<void> {
    pending = pending.then(async () => {
      const state = await statePromise;
      mutator(state);
      await writeJsonFile(filePath, state);
    });

    return pending;
  }

  return {
    async get(originalUrl) {
      const state = await readState();
      const entry = state.entries[originalUrl];
      if (!entry) {
        return null;
      }

      if (maxAgeMs !== undefined && Date.now() - entry.updatedAt > maxAgeMs) {
        delete state.entries[originalUrl];
        await queueWrite(() => undefined);
        return null;
      }

      return entry.resolvedUrl;
    },
    async set(originalUrl, resolvedUrl, patternId) {
      await queueWrite((state) => {
        state.entries[originalUrl] = {
          resolvedUrl,
          patternId,
          updatedAt: Date.now(),
        };

        const entries = Object.entries(state.entries);
        if (entries.length <= maxEntries) {
          return;
        }

        entries
          .sort((left, right) => left[1].updatedAt - right[1].updatedAt)
          .slice(0, entries.length - maxEntries)
          .forEach(([key]) => {
            delete state.entries[key];
          });
      });
    },
  };
}

export function createFilePatternStore(
  options: FilePatternStoreOptions,
): PatternStore {
  const filePath = options.filePath;
  const statePromise = readJsonFile<PatternFileState>(filePath, {
    patterns: [],
  });
  let pending = Promise.resolve();

  async function readState(): Promise<PatternFileState> {
    await pending;
    return statePromise;
  }

  function queueWrite<T>(mutator: (state: PatternFileState) => T): Promise<T> {
    const task = pending.then(async () => {
      const state = await statePromise;
      const result = mutator(state);
      await writeJsonFile(filePath, state);
      return result;
    });

    pending = task.then(
      () => undefined,
      () => undefined,
    );

    return task;
  }

  return {
    async findByDomain(domain) {
      const state = await readState();
      return state.patterns
        .filter((pattern) => pattern.domain === domain)
        .sort((left, right) => right.confidence - left.confidence);
    },
    async save(domain, matchRegex, transform) {
      return queueWrite((state) => {
        const existing = state.patterns.find(
          (pattern) =>
            pattern.domain === domain && pattern.matchRegex === matchRegex,
        );

        if (existing) {
          existing.transform = transform;
          existing.confidence = Math.min(existing.confidence + 0.1, 0.99);
          return existing;
        }

        const numericIds = state.patterns
          .map((pattern) =>
            typeof pattern.id === "number" ? pattern.id : Number.NaN,
          )
          .filter((value) => Number.isFinite(value));
        const created: LearnedPattern = {
          id: numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1,
          domain,
          matchRegex,
          transform,
          confidence: 0.5,
        };
        state.patterns.push(created);
        return created;
      });
    },
    async incrementSuccess(patternId) {
      await queueWrite((state) => {
        const pattern = state.patterns.find((entry) => entry.id === patternId);
        if (pattern) {
          pattern.confidence = Math.min(pattern.confidence + 0.1, 0.99);
        }
      });
    },
    async incrementFailure(patternId) {
      await queueWrite((state) => {
        const pattern = state.patterns.find((entry) => entry.id === patternId);
        if (pattern) {
          pattern.confidence = Math.max(pattern.confidence - 0.2, 0);
        }
      });
    },
  };
}
