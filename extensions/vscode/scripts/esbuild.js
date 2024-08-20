const esbuild = require("esbuild");
const chalk = require("chalk");

const flags = process.argv.slice(2);
const log = console.log;

const esbuildOptions = {
  entryPoints: ["src/extension.ts"],
  outfile: "out/extension.js",
  bundle: true,
  external: ["vscode", "esbuild"],
  platform: "node",
  format: "cjs",
  sourcemap: flags.includes("--sourcemap"),
};

(async () => {
  if (flags.includes("--watch")) {
    let ctx = await esbuild.context(esbuildOptions);

    await ctx.watch();

    log(chalk.yellow("watching..."));
  } else {
    await esbuild.build(esbuildOptions);
  }
})();
