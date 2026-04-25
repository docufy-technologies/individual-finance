/**
 * E2E Tests for Story 1.4: Setup oRPC API Foundation
 *
 * These tests verify:
 * 1. oRPC route handles requests at /rpc endpoint
 * 2. Health check procedure returns OK
 * 3. Protected procedure rejects unauthenticated requests
 * 4. Protected procedure allows authenticated requests
 * 5. Error responses include proper error codes
 * 6. HTTP POST method works
 */

import { expect, test } from "@playwright/test";

// Base URL should already be configured in playwright.config.ts
const BASE_URL = "http://localhost:3000";
const RPC_URL = `${BASE_URL}/rpc`;

test.describe("oRPC API Foundation", () => {
  test.describe("AC1: oRPC Route Setup", () => {
    test("should return 200 for health endpoint with POST", async ({
      request,
    }) => {
      const response = await request.post(`${RPC_URL}/health`);

      expect(response.status()).toBe(200);
    });

    test("should return 404 for non-existent procedure", async ({
      request,
    }) => {
      const response = await request.post(`${RPC_URL}/nonExistent`);

      expect(response.status()).toBe(404);
    });

    test("should return 405 for GET method (not allowed)", async ({ request }) => {
      // oRPC v1 only supports POST by default
      const response = await request.get(`${RPC_URL}/health`);

      expect(response.status()).toBe(405);
    });
  });

  test.describe("AC2: Middleware Chain Configuration", () => {
    test("should reject unauthenticated request to protected procedure", async ({
      request,
    }) => {
      const response = await request.post(`${RPC_URL}/testProtected`);

      expect(response.status()).toBe(401);
    });

    test("should return UNAUTHORIZED error code for protected procedure without auth", async ({
      request,
    }) => {
      const response = await request.post(`${RPC_URL}/testProtected`);
      const body = await response.json();

      // Response is wrapped in a "json" property by oRPC
      expect(body.json?.code).toBe("UNAUTHORIZED");
    });

    test("should return authentication required message", async ({ request }) => {
      const response = await request.post(`${RPC_URL}/testProtected`);
      const body = await response.json();

      expect(body.json?.message).toBe("Authentication required");
    });

    test("should allow authenticated request to protected procedure", async ({
      request,
    }) => {
      const response = await request.post(`${RPC_URL}/testProtected`, {
        headers: {
          Authorization: "Bearer test-token",
        },
      });

      // Should NOT return 401
      expect(response.status()).not.toBe(401);
    });
  });

  test.describe("AC3: API Verification", () => {
    test("should return valid health response structure", async ({ request }) => {
      const response = await request.post(`${RPC_URL}/health`);
      const body = await response.json();

      // Response is wrapped in "json" property
      expect(body.json?.status).toBe("ok");
      expect(body.json?.timestamp).toBeDefined();
      expect(new Date(body.json?.timestamp).getTime()).toBeGreaterThan(0);
    });

    test("should return JSON content type", async ({ request }) => {
      const response = await request.post(`${RPC_URL}/health`);

      const contentType = response.headers()["content-type"];
      expect(contentType).toContain("application/json");
    });

    test("should handle request with body data", async ({ request }) => {
      const response = await request.post(`${RPC_URL}/health`, {
        data: {
          test: "data",
        },
      });

      expect(response.status()).toBe(200);
    });
  });

  test.describe("Error Contract Format", () => {
    test("should return error with code field", async ({ request }) => {
      const response = await request.post(`${RPC_URL}/testProtected`);
      const body = await response.json();

      expect(body.json?.code).toBeDefined();
      expect(typeof body.json?.code).toBe("string");
    });

    test("should return error with message field", async ({ request }) => {
      const response = await request.post(`${RPC_URL}/testProtected`);
      const body = await response.json();

      expect(body.json?.message).toBeDefined();
      expect(typeof body.json?.message).toBe("string");
    });

    test("should return 401 status for unauthorized", async ({ request }) => {
      const response = await request.post(`${RPC_URL}/testProtected`);
      const body = await response.json();

      expect(body.json?.status).toBe(401);
    });
  });
});