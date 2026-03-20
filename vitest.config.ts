import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./client/src/test-setup.ts", "./tests/setup.ts"],
    include: ["client/src/**/*.test.ts", "client/src/**/*.test.tsx", "tests/**/*.test.ts"],
  },
});
