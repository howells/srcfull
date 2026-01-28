import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "PAYMENT_REQUIRED"
  | "INVALID_URL"
  | "INVALID_REQUEST"
  | "RATE_LIMITED"
  | "SCRAPE_FAILED"
  | "TRANSFORM_FAILED"
  | "NOT_FOUND"
  | "INTERNAL_ERROR";

type ErrorResponse = {
  success: false;
  error: {
    code: ApiErrorCode;
    message: string;
  };
};

const STATUS_CODES: Record<ApiErrorCode, number> = {
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  INVALID_URL: 400,
  INVALID_REQUEST: 400,
  RATE_LIMITED: 429,
  SCRAPE_FAILED: 502,
  TRANSFORM_FAILED: 500,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

const DEFAULT_MESSAGES: Record<ApiErrorCode, string> = {
  UNAUTHORIZED: "Invalid or missing API key",
  PAYMENT_REQUIRED: "Subscription required",
  INVALID_URL: "The provided URL is not valid",
  INVALID_REQUEST: "Invalid request body",
  RATE_LIMITED: "Too many requests",
  SCRAPE_FAILED: "Failed to scrape page",
  TRANSFORM_FAILED: "Failed to transform URL",
  NOT_FOUND: "Resource not found",
  INTERNAL_ERROR: "An unexpected error occurred",
};

/**
 * Create a standardized error response
 */
export function apiError(
  code: ApiErrorCode,
  message?: string,
  headers?: HeadersInit
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message: message ?? DEFAULT_MESSAGES[code],
      },
    },
    {
      status: STATUS_CODES[code],
      headers,
    }
  );
}

/**
 * Create a standardized success response
 */
export function apiSuccess<T extends Record<string, unknown>>(
  data: T,
  headers?: HeadersInit
): NextResponse<{ success: true } & T> {
  return NextResponse.json(
    { success: true, ...data },
    { status: 200, headers }
  );
}
