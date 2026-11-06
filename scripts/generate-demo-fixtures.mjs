import { readFile, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import bcrypt from "bcrypt";

const path = fileURLToPath(new URL("../src/modules/auth/persistence/demo-accounts.fixture.ts", import.meta.url));
const previous = await readFile(path, "utf8");
if (!previous.includes("PENDING_APPROVED_GENERATION")) {
  process.stdout.write("Public demo fixtures already exist; nothing changed.\n");
} else {
  const accounts = [];
  for (const username of ["superadmin", "admin"]) {
    accounts.push({
      userId: randomUUID(),
      username,
      passwordHash: await bcrypt.hash("dev123", 12),
      role: username,
      grants: username === "admin" ? ["examples:read"] : [],
    });
  }
  const marker = previous.indexOf("// Generate once");
  if (marker < 0) throw new Error("Fixture template is not recognized");
  const types = previous.slice(0, marker);
  await writeFile(path,
    types +
    "// Public demo credentials. Edit grants here; no startup regeneration.\n" +
    "export const DEMO_ACCOUNTS: readonly DemoAccount[] = " +
    JSON.stringify(accounts, null, 2) + ";\n",
  );
  process.stdout.write("Generated two public demo fixtures. Export this file to the repository.\n");
}
