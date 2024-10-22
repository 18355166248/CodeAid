import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  // If entries is not provided, will be automatically inferred from package.json
  entries: ["scripts/package.ts"],
  clean: true,
  // Change outDir, default is 'dist'
  outDir: "bin",
  // Generates .d.ts declaration file
  declaration: true,
  rollup: {
    // emitCJS: true, // 不支持cjs 因为 chalk这种第三方依赖的版本只支持esm
    // cjsBridge: true,
    esbuild: {
      // minify: true,
    },
  },
});
