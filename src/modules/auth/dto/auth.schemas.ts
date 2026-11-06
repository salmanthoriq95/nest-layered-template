import { z } from "zod";

const credential = (maximum: number) =>
  z.string().min(1).refine(
    (value) => Buffer.byteLength(value, "utf8") <= maximum,
  );

export const loginSchema = z.strictObject({
  username: credential(64),
  password: credential(72),
});

export const refreshSchema = z.strictObject({
  refreshToken: z.string().min(1).max(512).regex(/^[\x00-\x7f]+$/),
});
