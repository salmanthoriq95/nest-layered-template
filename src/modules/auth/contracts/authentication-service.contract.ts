import type {
  LoginInput,
  RefreshInput,
  SessionIdentity,
  TokenResult,
} from "./auth.types.js";

export abstract class AuthenticationServiceContract {
  abstract login(input: LoginInput): Promise<TokenResult>;
  abstract refresh(input: RefreshInput): Promise<TokenResult>;
  abstract logout(input: SessionIdentity): void;
}
