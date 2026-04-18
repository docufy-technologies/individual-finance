/**
 * Project Scaffold Verification Tests
 * Story: 1-1-initialize-nextjs-project-scaffold
 *
 * These tests verify the Next.js project is properly scaffolded with:
 * - TypeScript, Tailwind, Biome, App Router
 * - shadcn/ui components
 * - Calm Trust Blue design tokens
 */
import * as fs from "node:fs";
import * as path from "node:path";

import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(__dirname, "..");

describe("Project Scaffold Structure", () => {
  it("should have required configuration files", () => {
    const requiredFiles = [
      "package.json",
      "tsconfig.json",
      "next.config.ts",
      "biome.json",
      "components.json",
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(projectRoot, file);
      const exists = fs.existsSync(filePath);
      expect(exists, `Required file ${file} should exist`).toBe(true);
    }
  });

  it("should have Next.js with App Router", () => {
    const packageJsonContent = fs.readFileSync(
      path.join(projectRoot, "package.json"),
      "utf-8",
    );
    const packageJson = JSON.parse(packageJsonContent);
    expect(packageJson.dependencies.next).toBeDefined();
  });

  it("should have TypeScript configured", () => {
    const tsconfigContent = fs.readFileSync(
      path.join(projectRoot, "tsconfig.json"),
      "utf-8",
    );
    const tsconfig = JSON.parse(tsconfigContent);
    expect(tsconfig.compilerOptions).toBeDefined();
    expect(tsconfig.compilerOptions.paths).toHaveProperty("@/*");
  });

  it("should have Biome configured with correct schema version", () => {
    const biomeContent = fs.readFileSync(
      path.join(projectRoot, "biome.json"),
      "utf-8",
    );
    const biome = JSON.parse(biomeContent);
    const hasSchema = biome.$schema?.includes("2.2.0");
    expect(hasSchema).toBe(true);
  });
});

describe("Directory Structure", () => {
  it("should have app/ directory at root level", () => {
    const appDir = path.join(projectRoot, "app");
    expect(fs.existsSync(appDir)).toBe(true);
    expect(fs.statSync(appDir).isDirectory()).toBe(true);
  });

  it("should have components/ui/ directory for shadcn", () => {
    const componentsDir = path.join(projectRoot, "components", "ui");
    expect(fs.existsSync(componentsDir)).toBe(true);
  });

  it("should have required directories per architecture", () => {
    const requiredDirs = [
      "features",
      "entities",
      "shared",
      "server",
      "prisma",
      "lib",
    ];
    for (const dir of requiredDirs) {
      const dirPath = path.join(projectRoot, dir);
      const exists = fs.existsSync(dirPath);
      expect(exists, `Required directory ${dir} should exist`).toBe(true);
    }
  });

  it("should NOT have src/ directory (root-level structure)", () => {
    const srcDir = path.join(projectRoot, "src");
    expect(fs.existsSync(srcDir)).toBe(false);
  });
});

describe("shadcn/ui Components", () => {
  it("should have button component installed", () => {
    const buttonPath = path.join(projectRoot, "components", "ui", "button.tsx");
    expect(fs.existsSync(buttonPath)).toBe(true);
  });

  it("should have shadcn configuration", () => {
    const componentsJsonContent = fs.readFileSync(
      path.join(projectRoot, "components.json"),
      "utf-8",
    );
    const componentsJson = JSON.parse(componentsJsonContent);
    expect(componentsJson.tailwind).toBeDefined();
    expect(componentsJson.tailwind.css).toBe("app/globals.css");
  });

  it("should have lib/utils.ts for shadcn", () => {
    const utilsPath = path.join(projectRoot, "lib", "utils.ts");
    expect(fs.existsSync(utilsPath)).toBe(true);
  });
});

describe("Calm Trust Blue Theme", () => {
  it("should have design tokens in globals.css", () => {
    const globalsCss = fs.readFileSync(
      path.join(projectRoot, "app", "globals.css"),
      "utf-8",
    );
    // Primary color: #2563EB represented as oklch(0.55 0.22 257.3)
    expect(globalsCss).toContain("0.55 0.22 257.3");
  });

  it("should have secondary color configured", () => {
    const globalsCss = fs.readFileSync(
      path.join(projectRoot, "app", "globals.css"),
      "utf-8",
    );
    // Secondary color: #60A5FA represented as oklch(0.75 0.16 257.3)
    expect(globalsCss).toContain("0.75 0.16 257.3");
  });

  it("should have accent color configured", () => {
    const globalsCss = fs.readFileSync(
      path.join(projectRoot, "app", "globals.css"),
      "utf-8",
    );
    // Accent color: #14B8A6 represented as oklch(0.7 0.18 180)
    expect(globalsCss).toContain("0.7 0.18 180");
  });
});

describe("App Router Pages", () => {
  it("should have app/layout.tsx", () => {
    const layoutPath = path.join(projectRoot, "app", "layout.tsx");
    expect(fs.existsSync(layoutPath)).toBe(true);
  });

  it("should have app/page.tsx", () => {
    const pagePath = path.join(projectRoot, "app", "page.tsx");
    expect(fs.existsSync(pagePath)).toBe(true);
  });

  it("should have app/globals.css", () => {
    const globalsPath = path.join(projectRoot, "app", "globals.css");
    expect(fs.existsSync(globalsPath)).toBe(true);
  });
});
