import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { validatePublicUrlForServer } from "../src/url-validator";
import { validateImageUrl } from "../src/validator";

describe("validateImageUrl", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("rejects private hosts before making a network request", async () => {
    const fetchMock = vi.mocked(fetch);

    const result = await validateImageUrl("http://127.0.0.1/private.jpg");

    expect(result).toEqual({ valid: false });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("falls back to a ranged GET when HEAD is unsupported", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(
        new Response(null, {
          headers: {
            "content-type": "text/plain",
          },
          status: 405,
        }),
      )
      .mockResolvedValueOnce(
        new Response(null, {
          headers: {
            "content-range": "bytes 0-0/2048",
            "content-type": "image/jpeg",
          },
          status: 206,
        }),
      );

    const result = await validateImageUrl("https://cdn.example.com/photo.jpg");

    expect(result).toEqual({
      contentType: "image/jpeg",
      size: 2048,
      valid: true,
    });
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://cdn.example.com/photo.jpg",
      expect.objectContaining({
        headers: expect.objectContaining({
          Range: "bytes=0-0",
        }),
        method: "GET",
      }),
    );
  });

  it("retries transient HEAD failures before giving up", async () => {
    const fetchMock = vi.mocked(fetch);
    const onDebug = vi.fn();

    fetchMock
      .mockResolvedValueOnce(
        new Response(null, {
          headers: {
            "content-type": "text/plain",
          },
          status: 503,
        }),
      )
      .mockResolvedValueOnce(
        new Response(null, {
          headers: {
            "content-length": "4096",
            "content-type": "image/jpeg",
          },
          status: 200,
        }),
      );

    const result = await validateImageUrl("https://cdn.example.com/photo.jpg", {
      onDebug,
      retryDelayMs: 0,
    });

    expect(result).toEqual({
      contentType: "image/jpeg",
      size: 4096,
      valid: true,
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(onDebug).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 503,
        type: "validate:retry",
      }),
    );
  });
});

describe("validatePublicUrlForServer", () => {
  it("rejects public hostnames that resolve to private IP addresses", async () => {
    const result = await validatePublicUrlForServer("https://example.com/image.jpg", {
      resolveHostname: async () => ["10.0.0.5"],
    });

    expect(result).toEqual({
      error: "Hostname resolves to a private IP address",
      valid: false,
    });
  });

  it("accepts public hostnames that resolve to public IP addresses", async () => {
    const result = await validatePublicUrlForServer("https://example.com/image.jpg", {
      resolveHostname: async () => ["93.184.216.34"],
    });

    expect(result.valid).toBe(true);
    expect(result.url?.href).toBe("https://example.com/image.jpg");
  });
});
