/**
 * Environment validation tests
 *
 * Tests for environment variable validation logic.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  validateEnv,
  EnvValidationError,
  getRequiredEnv,
  getOptionalEnv,
  getDatabaseUrl,
  getAuthSecret,
  NODE_ENV,
  LOG_LEVEL,
} from "../../shared/config/env";

describe("getDatabaseUrl", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return value when DATABASE_URL is set", () => {
    vi.stubEnv("DATABASE_URL", "postgresql://localhost:5432/db");

    expect(getDatabaseUrl()).toBe("postgresql://localhost:5432/db");
  });

  it("should throw when DATABASE_URL is not set", () => {
    vi.stubEnv("DATABASE_URL", "");

    expect(() => getDatabaseUrl()).toThrow();
  });
});

describe("getAuthSecret", () => {
  it("should return value when AUTH_SECRET is set", () => {
    vi.stubEnv("AUTH_SECRET", "test-secret");

    expect(getAuthSecret()).toBe("test-secret");
  });

  it("should throw when AUTH_SECRET is not set", () => {
    vi.stubEnv("AUTH_SECRET", "");

    expect(() => getAuthSecret()).toThrow();
  });
});

describe("validateEnv", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should pass when all required env vars are present", () => {
    vi.stubEnv("DATABASE_URL", "postgresql://localhost:5432/db");
    vi.stubEnv("AUTH_SECRET", "test-secret");

    expect(() => validateEnv()).not.toThrow();
  });

  it("should throw EnvValidationError when DATABASE_URL is missing", () => {
    vi.stubEnv("DATABASE_URL", "");
    vi.stubEnv("AUTH_SECRET", "test-secret");

    expect(() => validateEnv()).toThrow(EnvValidationError);
  });

  it("should throw EnvValidationError when AUTH_SECRET is missing", () => {
    vi.stubEnv("DATABASE_URL", "postgresql://localhost:5432/db");
    vi.stubEnv("AUTH_SECRET", "");

    expect(() => validateEnv()).toThrow(EnvValidationError);
  });

  it("should throw EnvValidationError when both are missing", () => {
    vi.stubEnv("DATABASE_URL", "");
    vi.stubEnv("AUTH_SECRET", "");

    expect(() => validateEnv()).toThrow(EnvValidationError);
  });
});

describe("getRequiredEnv", () => {
  it("should return value when env var is set", () => {
    vi.stubEnv("DATABASE_URL", "postgresql://localhost:5432/db");

    expect(getRequiredEnv("DATABASE_URL")).toBe(
      "postgresql://localhost:5432/db",
    );
  });

  it("should throw when env var is not set", () => {
    vi.stubEnv("DATABASE_URL", "");

    expect(() => getRequiredEnv("DATABASE_URL")).toThrow();
  });
});

describe("getOptionalEnv", () => {
  it("should return value when env var is set", () => {
    vi.stubEnv("NODE_ENV", "production");

    expect(getOptionalEnv("NODE_ENV", "development")).toBe("production");
  });

  it("should return default when env var is not set", () => {
    vi.stubEnv("NODE_ENV", "");

    expect(getOptionalEnv("NODE_ENV", "development")).toBe("development");
  });
});

describe("exported getters", () => {
  beforeEach(() => {
    vi.stubEnv("DATABASE_URL", "postgresql://localhost:5432/db");
    vi.stubEnv("AUTH_SECRET", "test-secret");
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("LOG_LEVEL", "debug");
  });

  it("should export getDatabaseUrl function", () => {
    expect(getDatabaseUrl()).toBe("postgresql://localhost:5432/db");
  });

  it("should export getAuthSecret function", () => {
    expect(getAuthSecret()).toBe("test-secret");
  });

  it("should export NODE_ENV", () => {
    expect(NODE_ENV).toBe("test");
  });

  it("should export LOG_LEVEL", () => {
    expect(LOG_LEVEL).toBe("debug");
  });
});
