export abstract class PasswordVerifierContract {
  abstract verify(
    input: Readonly<{ password: string; passwordHash: string }>,
  ): Promise<boolean>;
}
