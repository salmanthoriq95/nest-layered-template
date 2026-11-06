import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { compile, failed, runTests } from "./workflow.mjs";

export async function build() {
  await compile();
  await runTests();
}

if (resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) {
  await build().catch(failed);
}
