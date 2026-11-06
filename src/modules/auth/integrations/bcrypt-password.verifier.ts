import bcrypt from "bcrypt";
import { PasswordVerifierContract } from "../contracts/password-verifier.contract.js";

export class BcryptPasswordVerifier implements PasswordVerifierContract {
  verify(input: {
    password: string;
    passwordHash: string;
  }): Promise<boolean> {
    if (
      !input.password ||
      Buffer.byteLength(input.password, "utf8") > 72
    ) {
      return Promise.resolve(false);
    }
    return bcrypt.compare(input.password, input.passwordHash);
  }
}
