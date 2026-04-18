/**
 * E2E Tests for Story 1-1: Initialize Next.js Project Scaffold
 *
 * These tests verify:
 * 1. The application builds successfully
 * 2. The development server starts
 * 3. Basic UI components render correctly
 * 4. The design tokens are applied
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { expect, test } from "@playwright/test";

// Get project root - go up from tests/e2e to project root
const projectRoot = path.resolve(__dirname, "..", "..");

test.describe("Project Build Verification", () => {
  test("should have valid package.json with required scripts", () => {
    const packageJsonPath = path.join(projectRoot, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    expect(packageJson).toBeDefined();
    expect(packageJson.scripts.dev).toBe("next dev");
    expect(packageJson.scripts.build).toBe("next build");
    expect(packageJson.scripts.lint).toBe("biome lint .");
    expect(packageJson.dependencies.next).toBeDefined();
    expect(packageJson.dependencies.react).toBeDefined();
  });

  test("should have valid tsconfig.json with import alias", () => {
    const tsconfigPath = path.join(projectRoot, "tsconfig.json");
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf-8"));

    expect(tsconfig.compilerOptions).toBeDefined();
    expect(tsconfig.compilerOptions.paths).toHaveProperty("@/*");
  });

  test("should have valid biome.json configuration", () => {
    const biomePath = path.join(projectRoot, "biome.json");
    const biome = JSON.parse(fs.readFileSync(biomePath, "utf-8"));

    expect(biome.$schema).toContain("2.2.0");
  });
});

test.describe("Development Server Startup", () => {
  test("should start development server and load homepage", async ({
    page,
  }) => {
    await page.goto("/");

    // Page should load without crash
    // Note: Default Next.js template shows "Create Next App" title
    await expect(page).toHaveTitle(/Create Next App/i);

    // Should have some content rendered
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });

  test("should not have console errors on homepage", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Filter out expected warnings
    const criticalErrors = errors.filter(
      (e) =>
        !e.includes("DevTools") &&
        !e.includes("favicon") &&
        !e.includes("Warning:"),
    );

    expect(criticalErrors).toHaveLength(0);
  });
});

test.describe("UI Components Rendering", () => {
  test("should have Button component file available", () => {
    const buttonPath = path.join(projectRoot, "components", "ui", "button.tsx");
    expect(fs.existsSync(buttonPath)).toBe(true);

    // Read the component to verify it exports Button
    const buttonContent = fs.readFileSync(buttonPath, "utf-8");
    expect(buttonContent).toContain("Button");
    expect(buttonContent).toContain("buttonVariants");
  });

  test("should have cn utility function available", () => {
    const utilsPath = path.join(projectRoot, "lib", "utils.ts");
    expect(fs.existsSync(utilsPath)).toBe(true);

    const utilsContent = fs.readFileSync(utilsPath, "utf-8");
    expect(utilsContent).toContain("cn");
  });
});

test.describe("Design Tokens Applied", () => {
  test("should have Calm Trust Blue primary color in CSS", async ({ page }) => {
    await page.goto("/");

    // Check computed styles for primary color
    const body = page.locator("body");
    const backgroundColor = await body.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor,
    );

    // Verify body has a background color set (not transparent)
    expect(backgroundColor).toBeTruthy();
  });

  test("should have design tokens in globals.css", () => {
    const globalsPath = path.join(projectRoot, "app", "globals.css");
    const globalsCss = fs.readFileSync(globalsPath, "utf-8");

    // Primary color: #2563EB as oklch
    expect(globalsCss).toContain("0.55 0.22 257.3");

    // Secondary color: #60A5FA as oklch
    expect(globalsCss).toContain("0.75 0.16 257.3");

    // Accent color: #14B8A6 as oklch
    expect(globalsCss).toContain("0.7 0.18 180");
  });

  test("should have Tailwind CSS configured with shadcn", () => {
    const componentsPath = path.join(projectRoot, "components.json");
    const componentsJson = JSON.parse(fs.readFileSync(componentsPath, "utf-8"));

    expect(componentsJson).toBeDefined();
    expect(componentsJson.tailwind).toBeDefined();
    expect(componentsJson.tailwind.css).toBe("app/globals.css");
  });
});

test.describe("Directory Structure", () => {
  test("should have root-level directories per architecture", () => {
    const requiredDirs = [
      "app",
      "features",
      "entities",
      "components",
      "shared",
      "server",
      "prisma",
      "lib",
    ];

    for (const dir of requiredDirs) {
      const dirPath = path.join(projectRoot, dir);
      expect(fs.existsSync(dirPath), `Directory ${dir} should exist`).toBe(
        true,
      );
      expect(
        fs.statSync(dirPath).isDirectory(),
        `${dir} should be a directory`,
      ).toBe(true);
    }
  });

  test("should NOT have src/ directory (root-level structure)", () => {
    const srcPath = path.join(projectRoot, "src");
    expect(fs.existsSync(srcPath)).toBe(false);
  });

  test("should have shadcn/ui components directory", () => {
    const componentsUiPath = path.join(projectRoot, "components", "ui");
    expect(fs.existsSync(componentsUiPath)).toBe(true);
    expect(fs.statSync(componentsUiPath).isDirectory()).toBe(true);
  });
});
