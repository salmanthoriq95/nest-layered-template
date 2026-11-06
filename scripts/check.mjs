import { build } from "./build.mjs";
import { failed, runNode } from "./workflow.mjs";

await (async () => {
  await runNode("node_modules/eslint/bin/eslint.js", ["src", "test", "scripts"]);
  await runNode("node_modules/prettier/bin/prettier.cjs", [
    "--check", "src", "test", "scripts", "*.json", "*.mjs", "*.yaml",
  ]);
  await build();
})().catch(failed);
