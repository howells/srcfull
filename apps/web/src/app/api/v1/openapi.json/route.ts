import { NextResponse } from "next/server";

const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "Beeline API",
    description: "Resolve image URLs to their highest-quality source versions",
    version: "1.0.0",
    contact: {
      name: "Beeline Support",
    },
  },
  servers: [
    {
      url: "https://beeline.dev/api/v1",
      description: "Production",
    },
  ],
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    "/transform": {
      post: {
        summary: "Transform URL",
        description:
          "Resolve an image URL to its highest-quality source version without scraping",
        operationId: "transformUrl",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/TransformRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Successful transformation",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/TransformResponse",
                },
              },
            },
          },
          "400": {
            description: "Invalid URL",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "401": {
            description: "Unauthorized - Invalid or missing API key",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "429": {
            description: "Rate limited",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/scrape": {
      post: {
        summary: "Scrape Page Images",
        description:
          "Scrape a webpage and extract all images with their resolved high-quality URLs",
        operationId: "scrapePage",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ScrapeRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Successful scrape",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ScrapeResponse",
                },
              },
            },
          },
          "400": {
            description: "Invalid URL",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "401": {
            description: "Unauthorized - Invalid or missing API key",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "429": {
            description: "Rate limited",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "502": {
            description: "Failed to scrape page",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        description: "API key in Bearer format: `Bearer sk_live_...`",
      },
    },
    schemas: {
      TransformRequest: {
        type: "object",
        required: ["url"],
        properties: {
          url: {
            type: "string",
            format: "uri",
            description: "The image URL to transform",
            example: "https://example.com/image.jpg?w=200",
          },
        },
      },
      TransformResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          original: {
            type: "string",
            description: "The original URL provided",
          },
          resolved: {
            type: "string",
            description: "The resolved high-quality URL",
          },
          method: {
            type: "string",
            enum: ["pattern", "probe", "passthrough"],
            description: "How the URL was resolved",
          },
          confidence: {
            type: "number",
            nullable: true,
            description: "Confidence score (0-1) for pattern matches",
          },
          sizeIncrease: {
            type: "number",
            nullable: true,
            description:
              "Estimated size increase multiplier (e.g., 4.0 means 4x larger)",
          },
          durationMs: {
            type: "integer",
            description: "Processing time in milliseconds",
          },
        },
      },
      ScrapeRequest: {
        type: "object",
        required: ["url"],
        properties: {
          url: {
            type: "string",
            format: "uri",
            description: "The webpage URL to scrape",
            example: "https://example.com/product-page",
          },
        },
      },
      ScrapeResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          url: {
            type: "string",
            description: "The URL that was scraped",
          },
          images: {
            type: "array",
            items: {
              $ref: "#/components/schemas/ImageResult",
            },
          },
          scraper: {
            type: "string",
            enum: ["b", "fc"],
            description: "Which scraper was used (b=primary, fc=fallback)",
          },
          durationMs: {
            type: "integer",
            description: "Total processing time in milliseconds",
          },
        },
      },
      ImageResult: {
        type: "object",
        properties: {
          original: {
            type: "string",
            description: "Original image URL from the page",
          },
          resolved: {
            type: "string",
            description: "Resolved high-quality URL",
          },
          alt: {
            type: "string",
            nullable: true,
            description: "Alt text from the image element",
          },
          method: {
            type: "string",
            enum: ["pattern", "probe", "passthrough"],
          },
          confidence: {
            type: "number",
            nullable: true,
          },
          sizeIncrease: {
            type: "number",
            nullable: true,
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: false,
          },
          error: {
            type: "object",
            properties: {
              code: {
                type: "string",
                enum: [
                  "UNAUTHORIZED",
                  "PAYMENT_REQUIRED",
                  "INVALID_URL",
                  "RATE_LIMITED",
                  "SCRAPE_FAILED",
                  "TRANSFORM_FAILED",
                ],
              },
              message: {
                type: "string",
              },
            },
          },
        },
      },
    },
  },
};

export async function GET() {
  return NextResponse.json(openApiSpec, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}
