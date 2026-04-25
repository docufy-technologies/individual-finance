import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/unit/**/*.spec.ts"],
    exclude: [
      "node_modules",
      "tests/e2e",
      "tests/unit/refresh-token.service.spec.ts",
    ],
    hookTimeout: 30000,
    setupFiles: ["tests/vitest-setup.ts"],
  },
  resolve: {
    alias: {
      "@": "/home/ratul/CodeBase/individual-finance",
    },
  },
});
