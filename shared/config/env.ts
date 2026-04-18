/**
 * Environment variable validation and configuration
 *
 * Validates required environment variables at startup with fail-fast behavior.
 * Missing required variables cause immediate failure with descriptive error messages.
 */

const REQUIRED_ENV_VARS = ["DATABASE_URL", "AUTH_SECRET"] as const;

type RequiredEnvVar = (typeof REQUIRED_ENV_VARS)[number];

/**
 * Validation error with list of missing environment variables
 */
export class EnvValidationError extends Error {
  readonly missingVars: readonly string[];
  readonly code = "ENV_VALIDATION_ERROR";

  constructor(missingVars: readonly string[]) {
    super(`Missing required environment variables: ${missingVars.join(", ")}`);
    this.name = "EnvValidationError";
    this.missingVars = missingVars;
    Error.captureStackTrace(this, EnvValidationError);
  }
}

/**
 * Validates all required environment variables
 * @throws EnvValidationError if any required variables are missing
 */
export function validateEnv(): void {
  const missing: string[] = [];

  for (const varName of REQUIRED_ENV_VARS) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    throw new EnvValidationError(missing);
  }
}

/**
 * Gets a required environment variable
 * @param name - The environment variable name
 * @returns The value of the environment variable
 * @throws Error if the variable is not set
 */
export function getRequiredEnv(name: RequiredEnvVar): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Required environment variable ${name} is not set`);
  }
  return value;
}

/**
 * Gets an optional environment variable with a default value
 * @param name - The environment variable name
 * @param defaultValue - The default value if the variable is not set
 * @returns The value of the environment variable or the default
 */
export function getOptionalEnv(name: string, defaultValue: string): string {
  const value = process.env[name];
  return value && value.trim() !== "" ? value : defaultValue;
}

/**
 * Database connection string (PostgreSQL)
 * @throws Error if DATABASE_URL is not set
 */
export function getDatabaseUrl(): string {
  return getRequiredEnv("DATABASE_URL");
}

export { getDatabaseUrl as DATABASE_URL };

/**
 * Auth.js secret for JWT session signing
 * @throws Error if AUTH_SECRET is not set
 */
export function getAuthSecret(): string {
  return getRequiredEnv("AUTH_SECRET");
}

export { getAuthSecret as AUTH_SECRET };

/**
 * Node environment (development, staging, production)
 * Defaults to "development"
 */
export const NODE_ENV = getOptionalEnv("NODE_ENV", "development");

/**
 * Logging level
 * Defaults to "info"
 */
export const LOG_LEVEL = getOptionalEnv("LOG_LEVEL", "debug");

/**
 * Check if running in production
 */
export const isProduction = NODE_ENV === "production";

/**
 * Check if running in development
 */
export const isDevelopment = NODE_ENV === "development";
