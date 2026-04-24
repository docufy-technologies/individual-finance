import * as fs from "node:fs";
import * as path from "node:path";

import { describe, expect, it, vi } from "vitest";

const projectRoot = path.resolve(__dirname, "../..");

describe("Prisma workflow wiring", () => {
  it("should expose Prisma through pnpm scripts", () => {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(projectRoot, "package.json"), "utf-8"),
    );

    expect(packageJson.scripts.prisma).toBe("prisma");
    expect(packageJson.dependencies["@prisma/client"]).toBeDefined();
    expect(packageJson.devDependencies.prisma).toBeDefined();
  });

  it("should document pooled and direct database URLs", () => {
    const envExample = fs.readFileSync(path.join(projectRoot, ".env.example"), "utf-8");

    expect(envExample).toContain("DATABASE_URL");
    expect(envExample).toContain("DIRECT_URL");
  });

  it("should configure Prisma CLI against DIRECT_URL", async () => {
    vi.stubEnv("DIRECT_URL", "postgresql://localhost:5432/direct-db");

    const { default: config } = await import("../../prisma.config");

    expect(config.schema).toBe("prisma/schema.prisma");
    expect(config.migrations?.path).toBe("prisma/migrations");
    expect(config.datasource?.url).toBe("postgresql://localhost:5432/direct-db");
  });
});

describe("Canonical schema coverage", () => {
  it("should include every required mapped table", () => {
    const schema = fs.readFileSync(path.join(projectRoot, "prisma", "schema.prisma"), "utf-8");

    const requiredTables = [
      "users",
      "refresh_tokens",
      "groups",
      "group_members",
      "group_member_permissions",
      "group_invitations",
      "personal_incomes",
      "personal_expenses",
      "personal_goals",
      "personal_goal_reservations",
      "personal_goal_implementations",
      "personal_loans",
      "personal_loan_repayments",
      "personal_lends",
      "personal_lend_repayments",
      "group_deposits",
      "group_withdrawals",
      "group_goals",
      "group_goal_reservations",
      "group_goal_implementations",
      "over_withdrawal_borrowings",
      "over_withdrawal_settlements",
      "audit_events",
    ];

    for (const table of requiredTables) {
      expect(schema).toContain(`@@map("${table}")`);
    }
  });

  it("should expose a server-only Prisma singleton entry point", () => {
    const prismaEntry = fs.readFileSync(
      path.join(projectRoot, "server", "db", "prisma.ts"),
      "utf-8",
    );

    expect(prismaEntry).toContain("PrismaPg");
    expect(prismaEntry).toContain("getDatabaseUrl");
    expect(prismaEntry).toContain("globalForPrisma");
  });
});
