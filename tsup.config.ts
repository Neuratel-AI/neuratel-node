import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  shims: true,
  clean: true,
  splitting: false,
  sourcemap: true,
  target: "es2020",
  outDir: "dist",
});
