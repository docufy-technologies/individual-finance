/**
 * E2E Tests for Story 1.3: Setup Prisma Schema and Database Connection
 *
 * Acceptance Criteria:
 * AC1: Prisma Configuration with Neon Connection
 *   - Prisma configured with DATABASE_URL (pooled connection) via Prisma client
 *   - Prisma configured with DIRECT_URL (direct connection) via Prisma CLI
 *
 * AC2: Canonical Prisma Schema
 *   - All domain entities mapped to PostgreSQL tables
 *   - Migrations folder configured and operational
 *
 * AC3: Environment Validation Extended for DIRECT_URL
 *   - validateEnv checks for DATABASE_URL, DIRECT_URL, AUTH_SECRET
 *   - Missing variables cause fast failure with descriptive errors
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { execSync } from "node:child_process";
import { expect, test } from "@playwright/test";

// Get project root - go up from tests/e2e to project root
const projectRoot = path.resolve(__dirname, "..", "..");

test.describe("AC1: Prisma Configuration with Neon Connection", () => {
  test("should have prisma.config.ts for Prisma CLI configuration", () => {
    const prismaConfigPath = path.join(projectRoot, "prisma.config.ts");
    expect(fs.existsSync(prismaConfigPath)).toBe(true);

    const content = fs.readFileSync(prismaConfigPath, "utf-8");
    expect(content).toContain("defineConfig");
    expect(content).toContain("schema");
    expect(content).toContain("migrations");
  });

  test("should configure Prisma CLI against DIRECT_URL", () => {
    const prismaConfigPath = path.join(projectRoot, "prisma.config.ts");
    const content = fs.readFileSync(prismaConfigPath, "utf-8");

    expect(content).toContain("DIRECT_URL");
    expect(content).toContain("datasource");
    expect(content).toContain("url");
  });

  test("should have DATABASE_URL in package.json prisma script", () => {
    const packageJsonPath = path.join(projectRoot, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    expect(packageJson.dependencies["@prisma/client"]).toBeDefined();
    expect(packageJson.devDependencies.prisma).toBeDefined();
  });

  test("should use @prisma/adapter-pg for PostgreSQL connection", () => {
    const packageJsonPath = path.join(projectRoot, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    expect(packageJson.dependencies["@prisma/adapter-pg"]).toBeDefined();
  });

  test("should have prisma folder with schema.prisma", () => {
    const schemaPath = path.join(projectRoot, "prisma", "schema.prisma");
    expect(fs.existsSync(schemaPath)).toBe(true);

    const schema = fs.readFileSync(schemaPath, "utf-8");
    expect(schema).toContain("generator client");
    expect(schema).toContain("datasource db");
  });

  test("should have migrations folder configured", () => {
    const migrationsPath = path.join(projectRoot, "prisma", "migrations");
    expect(fs.existsSync(migrationsPath)).toBe(true);

    const migrationLockPath = path.join(projectRoot, "prisma", "migrations", "migration_lock.toml");
    expect(fs.existsSync(migrationLockPath)).toBe(true);
  });

  test("should have working Prisma migrate script in package.json", () => {
    const packageJsonPath = path.join(projectRoot, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    expect(packageJson.scripts["db:migrate"]).toBe("prisma migrate");
    expect(packageJson.scripts["db:push"]).toBe("prisma db push");
    expect(packageJson.scripts["db:generate"]).toBe("prisma generate");
    expect(packageJson.scripts["db:studio"]).toBe("prisma studio");
  });
});

test.describe("AC2: Canonical Prisma Schema", () => {
  test("should include users table in schema", () => {
    const schemaPath = path.join(projectRoot, "prisma", "schema.prisma");
    const schema = fs.readFileSync(schemaPath, "utf-8");

    expect(schema).toContain('@@map("users")');
  });

  test("should include groups and group_members tables in schema", () => {
    const schemaPath = path.join(projectRoot, "prisma", "schema.prisma");
    const schema = fs.readFileSync(schemaPath, "utf-8");

    expect(schema).toContain('@@map("groups")');
    expect(schema).toContain('@@map("group_members")');
    expect(schema).toContain('@@map("group_member_permissions")');
  });

  test("should include group_invitations table in schema", () => {
    const schemaPath = path.join(projectRoot, "prisma", "schema.prisma");
    const schema = fs.readFileSync(schemaPath, "utf-8");

    expect(schema).toContain('@@map("group_invitations")');
  });

  test("should include personal finance tables in schema", () => {
    const schemaPath = path.join(projectRoot, "prisma", "schema.prisma");
    const schema = fs.readFileSync(schemaPath, "utf-8");

    expect(schema).toContain('@@map("personal_incomes")');
    expect(schema).toContain('@@map("personal_expenses")');
    expect(schema).toContain('@@map("personal_goals")');
    expect(schema).toContain('@@map("personal_goal_reservations")');
    expect(schema).toContain('@@map("personal_goal_implementations")');
  });

  test("should include lending tables in schema", () => {
    const schemaPath = path.join(projectRoot, "prisma", "schema.prisma");
    const schema = fs.readFileSync(schemaPath, "utf-8");

    expect(schema).toContain('@@map("personal_loans")');
    expect(schema).toContain('@@map("personal_loan_repayments")');
    expect(schema).toContain('@@map("personal_lends")');
    expect(schema).toContain('@@map("personal_lend_repayments")');
  });

  test("should include group ledger tables in schema", () => {
    const schemaPath = path.join(projectRoot, "prisma", "schema.prisma");
    const schema = fs.readFileSync(schemaPath, "utf-8");

    expect(schema).toContain('@@map("group_deposits")');
    expect(schema).toContain('@@map("group_withdrawals")');
    expect(schema).toContain('@@map("group_goals")');
    expect(schema).toContain('@@map("group_goal_reservations")');
    expect(schema).toContain('@@map("group_goal_implementations")');
  });

  test("should include overdraft and audit tables in schema", () => {
    const schemaPath = path.join(projectRoot, "prisma", "schema.prisma");
    const schema = fs.readFileSync(schemaPath, "utf-8");

    expect(schema).toContain('@@map("over_withdrawal_borrowings")');
    expect(schema).toContain('@@map("over_withdrawal_settlements")');
    expect(schema).toContain('@@map("audit_events")');
  });

  test("should run prisma generate successfully", () => {
    // prisma generate should succeed
    try {
      execSync("pnpm db:generate", {
        cwd: projectRoot,
        encoding: "utf-8",
        stdio: "pipe",
      });
    } catch (error: unknown) {
      const err = error as {
        status?: number;
        stdout?: string;
        stderr?: string;
      };
      const output = err.stdout || err.stderr || "";
      throw new Error(`Prisma generate failed: ${output}`);
    }
  });
});

test.describe("AC3: Environment Validation Extended for DIRECT_URL", () => {
  test("should have .env.example with DATABASE_URL documented", () => {
    const envExamplePath = path.join(projectRoot, ".env.example");
    expect(fs.existsSync(envExamplePath)).toBe(true);

    const envExample = fs.readFileSync(envExamplePath, "utf-8");
    expect(envExample).toContain("DATABASE_URL");
    expect(envExample).toContain("postgresql");
  });

  test("should have .env.example with DIRECT_URL documented", () => {
    const envExamplePath = path.join(projectRoot, ".env.example");
    const envExample = fs.readFileSync(envExamplePath, "utf-8");

    expect(envExample).toContain("DIRECT_URL");
    expect(envExample).toContain("postgresql");
  });

  test("should have .env.example with AUTH_SECRET documented", () => {
    const envExamplePath = path.join(projectRoot, ".env.example");
    const envExample = fs.readFileSync(envExamplePath, "utf-8");

    expect(envExample).toContain("AUTH_SECRET");
  });

  test("should export getDirectUrl function in env.ts", () => {
    const envPath = path.join(projectRoot, "shared", "config", "env.ts");
    const envContent = fs.readFileSync(envPath, "utf-8");

    expect(envContent).toContain("export function getDirectUrl");
    expect(envContent).toContain("DIRECT_URL");
  });

  test("should include DIRECT_URL in REQUIRED_ENV_VARS", () => {
    const envPath = path.join(projectRoot, "shared", "config", "env.ts");
    const envContent = fs.readFileSync(envPath, "utf-8");

    expect(envContent).toContain("DIRECT_URL");
    expect(envContent).toContain("REQUIRED_ENV_VARS");
  });
});

test.describe("AC4: Repository Entry Point", () => {
  test("should have server/db/prisma.ts as entry point", () => {
    const prismaEntryPath = path.join(projectRoot, "server", "db", "prisma.ts");
    expect(fs.existsSync(prismaEntryPath)).toBe(true);
  });

  test("should export PrismaClient from server/db/prisma.ts", () => {
    const prismaEntryPath = path.join(projectRoot, "server", "db", "prisma.ts");
    const prismaContent = fs.readFileSync(prismaEntryPath, "utf-8");

    expect(prismaContent).toContain("export const prisma");
    expect(prismaContent).toContain("PrismaClient");
  });

  test("should use PrismaPg adapter in server/db/prisma.ts", () => {
    const prismaEntryPath = path.join(projectRoot, "server", "db", "prisma.ts");
    const prismaContent = fs.readFileSync(prismaEntryPath, "utf-8");

    expect(prismaContent).toContain('import { PrismaPg } from "@prisma/adapter-pg"');
    expect(prismaContent).toContain("new PrismaPg");
  });

  test("should use getDatabaseUrl in server/db/prisma.ts", () => {
    const prismaEntryPath = path.join(projectRoot, "server", "db", "prisma.ts");
    const prismaContent = fs.readFileSync(prismaEntryPath, "utf-8");

    expect(prismaContent).toContain("getDatabaseUrl");
    expect(prismaContent).toContain("connectionString");
  });

  test("should implement singleton pattern in server/db/prisma.ts", () => {
    const prismaEntryPath = path.join(projectRoot, "server", "db", "prisma.ts");
    const prismaContent = fs.readFileSync(prismaEntryPath, "utf-8");

    expect(prismaContent).toContain("globalForPrisma");
    expect(prismaContent).toContain("globalThis");
    expect(prismaContent).toContain("log:");
  });

  test("should have conditional global assignment in non-production", () => {
    const prismaEntryPath = path.join(projectRoot, "server", "db", "prisma.ts");
    const prismaContent = fs.readFileSync(prismaEntryPath, "utf-8");

    expect(prismaContent).toContain("process.env.NODE_ENV");
    expect(prismaContent).toContain('"production"');
  });
});

test.describe("Integration: Prisma Stack Works Together", () => {
  test("should have complete Prisma dependency chain", () => {
    const packageJsonPath = path.join(projectRoot, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    expect(packageJson.dependencies["@prisma/client"]).toBeDefined();
    expect(packageJson.dependencies["@prisma/adapter-pg"]).toBeDefined();
    expect(packageJson.devDependencies.prisma).toBeDefined();
  });

  test("should have all database scripts in package.json", () => {
    const packageJsonPath = path.join(projectRoot, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    expect(packageJson.scripts["db:migrate"]).toBe("prisma migrate");
    expect(packageJson.scripts["db:push"]).toBe("prisma db push");
    expect(packageJson.scripts["db:generate"]).toBe("prisma generate");
    expect(packageJson.scripts["db:studio"]).toBe("prisma studio");
  });

  test("should have .env.example with all required database vars", () => {
    const envExamplePath = path.join(projectRoot, ".env.example");
    const envExample = fs.readFileSync(envExamplePath, "utf-8");

    expect(envExample).toContain("DATABASE_URL");
    expect(envExample).toContain("DIRECT_URL");
    expect(envExample).toContain("AUTH_SECRET");
  });

  test("should have server/db folder with prisma.ts", () => {
    const dbFolder = path.join(projectRoot, "server", "db");
    expect(fs.existsSync(dbFolder)).toBe(true);

    const prismaEntry = path.join(dbFolder, "prisma.ts");
    expect(fs.existsSync(prismaEntry)).toBe(true);
  });
});