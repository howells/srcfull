import { describe, expect, it } from "vitest";
import { generateApiKey, hashApiKey, verifyApiKey } from "./api-keys";

const API_KEY_FORMAT_REGEX = /^sk_live_[a-zA-Z0-9_-]{32}$/;

describe("api-keys", () => {
  it("generates key with correct format", () => {
    const key = generateApiKey();
    // base64url encoding uses a-z, A-Z, 0-9, - and _
    expect(key).toMatch(API_KEY_FORMAT_REGEX);
  });

  it("generates unique keys", () => {
    const key1 = generateApiKey();
    const key2 = generateApiKey();
    expect(key1).not.toBe(key2);
  });

  it("hashes and verifies key correctly", async () => {
    const key = generateApiKey();
    const hash = await hashApiKey(key);

    expect(hash).not.toBe(key);
    expect(await verifyApiKey(key, hash)).toBe(true);
    expect(await verifyApiKey("wrong_key", hash)).toBe(false);
  });

  it("extracts prefix correctly", () => {
    const key = "sk_live_abcdefghijklmnopqrstuvwxyz123456";
    expect(key.substring(0, 12)).toBe("sk_live_abcd");
  });
});
