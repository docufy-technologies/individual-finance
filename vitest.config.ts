import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.spec.ts"],
    exclude: ["node_modules", "tests/e2e"],
    hookTimeout: 30000,
  },
});
