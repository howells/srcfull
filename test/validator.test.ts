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
          status: 405,
          headers: {
            "content-type": "text/plain",
          },
        }),
      )
      .mockResolvedValueOnce(
        new Response(null, {
          status: 206,
          headers: {
            "content-type": "image/jpeg",
            "content-range": "bytes 0-0/2048",
          },
        }),
      );

    const result = await validateImageUrl("https://cdn.example.com/photo.jpg");

    expect(result).toEqual({
      valid: true,
      contentType: "image/jpeg",
      size: 2048,
    });
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://cdn.example.com/photo.jpg",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          Range: "bytes=0-0",
        }),
      }),
    );
  });

  it("retries transient HEAD failures before giving up", async () => {
    const fetchMock = vi.mocked(fetch);
    const onDebug = vi.fn();

    fetchMock
      .mockResolvedValueOnce(
        new Response(null, {
          status: 503,
          headers: {
            "content-type": "text/plain",
          },
        }),
      )
      .mockResolvedValueOnce(
        new Response(null, {
          status: 200,
          headers: {
            "content-type": "image/jpeg",
            "content-length": "4096",
          },
        }),
      );

    const result = await validateImageUrl("https://cdn.example.com/photo.jpg", {
      onDebug,
      retryDelayMs: 0,
    });

    expect(result).toEqual({
      valid: true,
      contentType: "image/jpeg",
      size: 4096,
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(onDebug).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "validate:retry",
        status: 503,
      }),
    );
  });
});

describe("validatePublicUrlForServer", () => {
  it("rejects public hostnames that resolve to private IP addresses", async () => {
    const result = await validatePublicUrlForServer(
      "https://example.com/image.jpg",
      {
        resolveHostname: async () => ["10.0.0.5"],
      },
    );

    expect(result).toEqual({
      valid: false,
      error: "Hostname resolves to a private IP address",
    });
  });

  it("accepts public hostnames that resolve to public IP addresses", async () => {
    const result = await validatePublicUrlForServer(
      "https://example.com/image.jpg",
      {
        resolveHostname: async () => ["93.184.216.34"],
      },
    );

    expect(result.valid).toBe(true);
    expect(result.url?.href).toBe("https://example.com/image.jpg");
  });
});
