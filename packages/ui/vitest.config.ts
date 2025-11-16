import { sharedConfig } from "@materia/vitest-config";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    ...sharedConfig.test,
  },
});
