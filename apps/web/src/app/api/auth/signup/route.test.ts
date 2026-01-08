import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/db/client", () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(async () => [
            { id: "user_123", email: "test@example.com" },
          ]),
        })),
      })),
    })),
  },
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue({
    set: vi.fn(),
  }),
}));

describe("POST /api/auth/signup", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_POLAR_PRO_PRODUCT_ID = "";
  });

  it("is disabled (Polar checkout required)", async () => {
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(410);
    expect(data.code).toBe("SIGNUP_DISABLED");
  });

  it("includes checkoutUrl when product id exists", async () => {
    process.env.NEXT_PUBLIC_POLAR_PRO_PRODUCT_ID =
      "00000000-0000-0000-0000-000000000000";

    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(410);
    expect(data.checkoutUrl).toBe(
      "/api/checkout?products=00000000-0000-0000-0000-000000000000"
    );
  });
});
