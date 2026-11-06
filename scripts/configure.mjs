import { writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { StringDecoder } from "node:string_decoder";
import bcrypt from "bcrypt";

function readPassword() {
  if (!process.stdin.isTTY) throw new Error("An interactive terminal is required");
  process.stdout.write("Swagger password (hidden): ");
  return new Promise((done, reject) => {
    const decoder = new StringDecoder("utf8");
    const characters = [];
    process.stdin.setRawMode(true);
    process.stdin.resume();
    const finish = (cancelled) => {
      process.stdin.off("data", input);
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write("\n");
      if (cancelled) reject(new Error("Configuration cancelled"));
      else done(characters.join(""));
    };
    const input = (buffer) => {
      for (const character of decoder.write(buffer)) {
        if (character === "\r" || character === "\n") { finish(false); return; }
        if (character === "\u0003" || character === "\u0004") { finish(true); return; }
        if (character === "\u007f" || character === "\b") characters.pop();
        else characters.push(character);
      }
    };
    process.stdin.on("data", input);
  });
}

try {
  const prompt = createInterface({ input: process.stdin, output: process.stdout });
  const username = await prompt.question("Swagger username (letters, digits, dot, underscore, hyphen): ");
  prompt.close();
  const password = await readPassword();
  if (
    !/^[A-Za-z0-9._-]{1,64}$/.test(username) ||
    Buffer.byteLength(username) > 64 ||
    !password || Buffer.byteLength(password) > 72
  ) throw new Error("Invalid documentation credentials");
  const hash = await bcrypt.hash(password, 12);
  const content = [
    "NODE_ENV=development",
    "JWT_SIGNING_KEY=" + randomBytes(32).toString("hex"),
    "JWT_ACCESS_TTL_SECONDS=900",
    "AUTH_REFRESH_TTL_SECONDS=604800",
    "LOG_WORKER_TOKEN=" + randomBytes(32).toString("hex"),
    "SWAGGER_ENABLED=true",
    "SWAGGER_USERNAME=" + username,
    "SWAGGER_PASSWORD_HASH=" + hash,
    "",
  ].join("\n");
  await writeFile(new URL("../.env", import.meta.url), content, {
    mode: 0o600, flag: "wx",
  });
  process.stdout.write("Created .env without printing credentials. Existing files are never overwritten.\n");
} catch {
  process.stderr.write("Configuration was cancelled, invalid, or .env already exists.\n");
  process.exitCode = 1;
}
