import { compile, failed, runTests } from "./workflow.mjs";

const scope = process.argv[2] ?? "all";
if (!["all", "unit", "e2e"].includes(scope)) {
  failed(new Error("Unknown test scope"));
} else {
  await (async () => {
    await compile(scope);
    await runTests(scope);
  })().catch(failed);
}
