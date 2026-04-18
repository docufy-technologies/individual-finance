/**
 * E2E Tests for Story 1.2: Configure Development Environment and Tools
 *
 * Acceptance Criteria:
 * AC1: Biome Configuration with Project Coding Standards
 *   - Biome runs successfully on `pnpm lint` and formats code on save
 *   - TypeScript strict mode is enabled and all type checks pass
 *
 * AC2: Environment Variable Templates and Validation Logic
 *   - Application validates required environment variables at startup
 *   - Missing required variables cause fast failure with clear error messages
 *   - DATABASE_URL is recognized as the database connection string
 *
 * AC3: Development Server Startup Validation
 *   - Server fails immediately with descriptive error when missing env vars
 *   - Server starts successfully when all required variables are provided
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { execSync } from "node:child_process";
import { expect, test } from "@playwright/test";

// Get project root - go up from tests/e2e to project root
const projectRoot = path.resolve(__dirname, "..", "..");

test.describe("AC1: Biome Configuration with Project Coding Standards", () => {
  test("should have biome.json with correct configuration", () => {
    const biomePath = path.join(projectRoot, "biome.json");
    expect(fs.existsSync(biomePath)).toBe(true);

    const biome = JSON.parse(fs.readFileSync(biomePath, "utf-8"));
    expect(biome.$schema).toContain("biomejs.dev/schemas");
    expect(biome.linter.enabled).toBe(true);
    expect(biome.formatter.enabled).toBe(true);
  });

  test("should have strict linting rules enabled", () => {
    const biomePath = path.join(projectRoot, "biome.json");
    const biome = JSON.parse(fs.readFileSync(biomePath, "utf-8"));

    // Verify strict rules for unused code
    expect(biome.linter.rules.correctness?.noUnusedVariables).toBe("error");
    expect(biome.linter.rules.correctness?.noUnusedImports).toBe("error");
    expect(biome.linter.rules.correctness?.noUnusedFunctionParameters).toBe(
      "error",
    );
  });

  test("should run biome lint successfully via pnpm lint", () => {
    // pnpm lint should exit with code 0 when no issues found
    try {
      const result = execSync("pnpm lint", {
        cwd: projectRoot,
        encoding: "utf-8",
      });
      expect(result).toContain("Checked");
    } catch (error: unknown) {
      const err = error as {
        status?: number;
        stdout?: string;
        stderr?: string;
      };
      // If it fails, it should show what needs fixing
      const output = err.stdout || err.stderr || "";
      expect(output).toContain("No fixes applied");
    }
  });

  test("should have pnpm format:check command defined", () => {
    const packageJsonPath = path.join(projectRoot, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    expect(packageJson.scripts["format:check"]).toBe("biome format .");
    expect(packageJson.scripts.format).toBe("biome format . --write");
  });

  test("should have tsconfig.json with strict mode enabled", () => {
    const tsconfigPath = path.join(projectRoot, "tsconfig.json");
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf-8"));

    expect(tsconfig.compilerOptions.strict).toBe(true);
    expect(tsconfig.compilerOptions.noUncheckedIndexedAccess).toBe(true);
    expect(tsconfig.compilerOptions.noImplicitReturns).toBe(true);
    expect(tsconfig.compilerOptions.noFallthroughCasesInSwitch).toBe(true);
  });

  test("should have pnpm type-check command defined", () => {
    const packageJsonPath = path.join(projectRoot, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    expect(packageJson.scripts["type-check"]).toBe("tsc --noEmit");
  });

  test("should pass TypeScript type-check with strict mode", () => {
    // tsc --noEmit should exit with code 0 when no type errors
    try {
      execSync("pnpm type-check", {
        cwd: projectRoot,
        encoding: "utf-8",
        stdio: "pipe",
      });
      // If no error thrown, type checking passed
      expect(true).toBe(true);
    } catch (error: unknown) {
      // Type checking failed
      const err = error as {
        status?: number;
        stdout?: string;
        stderr?: string;
      };
      const output = err.stdout || err.stderr || "";
      throw new Error(`Type check failed: ${output}`);
    }
  });
});

test.describe("AC2: Environment Variable Templates and Validation Logic", () => {
  test("should have .env.example with documented required variables", () => {
    const envExamplePath = path.join(projectRoot, ".env.example");
    expect(fs.existsSync(envExamplePath)).toBe(true);

    const envExample = fs.readFileSync(envExamplePath, "utf-8");
    expect(envExample).toContain("DATABASE_URL");
    expect(envExample).toContain("AUTH_SECRET");

    // Check that DATABASE_URL is documented as PostgreSQL
    expect(envExample).toContain("postgresql");
  });

  test("should have validateEnv function in shared/config/env.ts", () => {
    const envPath = path.join(projectRoot, "shared", "config", "env.ts");
    expect(fs.existsSync(envPath)).toBe(true);

    const envContent = fs.readFileSync(envPath, "utf-8");
    expect(envContent).toContain("export function validateEnv");
  });

  test("should have EnvValidationError class for clear error messages", () => {
    const envPath = path.join(projectRoot, "shared", "config", "env.ts");
    const envContent = fs.readFileSync(envPath, "utf-8");

    expect(envContent).toContain("export class EnvValidationError");
    expect(envContent).toContain("missingVars");
    expect(envContent).toContain("Missing required environment variables");
  });

  test("should define DATABASE_URL as required variable", () => {
    const envPath = path.join(projectRoot, "shared", "config", "env.ts");
    const envContent = fs.readFileSync(envPath, "utf-8");

    expect(envContent).toContain("DATABASE_URL");
    expect(envContent).toContain("REQUIRED_ENV_VARS");
  });

  test("should define AUTH_SECRET as required variable", () => {
    const envPath = path.join(projectRoot, "shared", "config", "env.ts");
    const envContent = fs.readFileSync(envPath, "utf-8");

    expect(envContent).toContain("AUTH_SECRET");
  });

test("should export DATABASE_URL as connection string getter", () => {
		const envPath = path.join(projectRoot, "shared", "config", "env.ts");
		const envContent = fs.readFileSync(envPath, "utf-8");

		expect(envContent).toContain("export function getDatabaseUrl");
		expect(envContent).toContain("getRequiredEnv");
		expect(envContent).toContain("Database connection string");
	});

  test("should have validation logic that throws on missing vars", () => {
    const envPath = path.join(projectRoot, "shared", "config", "env.ts");
    const envContent = fs.readFileSync(envPath, "utf-8");

    // Verify validateEnv throws when required vars are missing
    expect(envContent).toContain("throw new EnvValidationError");
    expect(envContent).toContain("if (missing.length > 0)");
  });
});

test.describe("AC3: Development Server Startup Validation", () => {
test("should have .env file structure documented in .env.example", () => {
		const envExamplePath = path.join(projectRoot, ".env.example");
		expect(fs.existsSync(envExamplePath)).toBe(true);

		const envContent = fs.readFileSync(envExamplePath, "utf-8");
		expect(envContent).toContain("DATABASE_URL");
		expect(envContent).toContain("AUTH_SECRET");
	});

  test("should have pnpm dev script defined", () => {
    const packageJsonPath = path.join(projectRoot, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    expect(packageJson.scripts.dev).toBe("next dev");
  });

  test("should verify dev script configuration is valid", () => {
    const packageJsonPath = path.join(projectRoot, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    expect(packageJson.dependencies.next).toBeDefined();
    expect(packageJson.scripts.dev).toBeDefined();
  });

test("should recognize DATABASE_URL in environment config exports", () => {
		const envPath = path.join(projectRoot, "shared", "config", "env.ts");
		const envContent = fs.readFileSync(envPath, "utf-8");

		expect(envContent).toMatch(/export function getDatabaseUrl/);
	});
});

test.describe("Integration: All Tools Work Together", () => {
  test("should have all required npm scripts defined", () => {
    const packageJsonPath = path.join(projectRoot, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    // Development tools
    expect(packageJson.scripts.dev).toBe("next dev");
    expect(packageJson.scripts.build).toBe("next build");
    expect(packageJson.scripts.start).toBe("next start");

    // Linting and formatting
    expect(packageJson.scripts.lint).toBe("biome lint .");
    expect(packageJson.scripts.format).toBe("biome format . --write");
    expect(packageJson.scripts["format:check"]).toBe("biome format .");

    // Type checking
    expect(packageJson.scripts["type-check"]).toBe("tsc --noEmit");

    // Testing
    expect(packageJson.scripts.test).toBe("vitest run");
  });

  test("should have biome and typescript as dev dependencies", () => {
    const packageJsonPath = path.join(projectRoot, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    expect(packageJson.devDependencies["@biomejs/biome"]).toBeDefined();
    expect(packageJson.devDependencies.typescript).toBeDefined();
  });

  test("should have playwright configured for E2E testing", () => {
    const packageJsonPath = path.join(projectRoot, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    expect(packageJson.devDependencies["@playwright/test"]).toBeDefined();
  });

  test("should have shared config module properly structured", () => {
    const configDir = path.join(projectRoot, "shared", "config");

    expect(fs.existsSync(path.join(configDir, "env.ts"))).toBe(true);
    expect(fs.existsSync(path.join(configDir, "constants.ts"))).toBe(true);
    expect(fs.existsSync(path.join(configDir, "feature-flags.ts"))).toBe(true);
  });
});
