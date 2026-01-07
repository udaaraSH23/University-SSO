import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    include: ["**/*.test.ts"],
    testTimeout: 30000, // Longer timeout for DB operations
    fileParallelism: false, // Avoid race conditions on the single SQLite DB
  },
  resolve: {
    alias: {
      "@repo/database": path.resolve(__dirname, "../database/src"),
      "@repo/logger": path.resolve(__dirname, "../logger/src"),
    },
  },
});
