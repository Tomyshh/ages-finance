import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node22",
  platform: "node",
  clean: true,
  sourcemap: true,
  // Bundle the workspace packages so the Render artifact is self-contained.
  noExternal: [/@agec\//],
});
