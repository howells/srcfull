import { beforeAll, afterAll } from 'vitest';

beforeAll(() => {
  // Set up test environment variables
  process.env.SCRAPINGBEE_API_KEY = process.env.SCRAPINGBEE_API_KEY || 'test-key';
});

afterAll(() => {
  // Clean up
});
