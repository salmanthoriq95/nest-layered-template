import {
  Body, Controller, HttpCode, Inject, Post, Req,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { unauthenticated } from "../../application/application-error.js";
import type { HttpRequest } from "../../http/request-state.js";
import { ZodValidationPipe } from "../../http/validation.js";
import { Authenticated, Public } from "./access-policy.js";
import { AuthenticationServiceContract } from "./contracts/authentication-service.contract.js";
import type { LoginInput, RefreshInput } from "./contracts/auth.types.js";
import { loginSchema, refreshSchema } from "./dto/auth.schemas.js";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(
    @Inject(AuthenticationServiceContract)
    private readonly authentication: AuthenticationServiceContract,
  ) {}

  @Public()
  @Post("login")
  @HttpCode(200)
  @ApiBody({
    schema: {
      type: "object",
      additionalProperties: false,
      required: ["username", "password"],
      properties: {
        username: { type: "string", description: "At most 64 UTF-8 bytes" },
        password: { type: "string", format: "password", description: "At most 72 UTF-8 bytes" },
      },
    },
  })
  login(
    @Body(new ZodValidationPipe(loginSchema)) input: LoginInput,
  ) {
    return this.authentication.login(input);
  }

  @Public()
  @Post("refresh")
  @HttpCode(200)
  @ApiBody({
    schema: {
      type: "object",
      additionalProperties: false,
      required: ["refreshToken"],
      properties: { refreshToken: { type: "string", maxLength: 512 } },
    },
  })
  refresh(
    @Body(new ZodValidationPipe(refreshSchema)) input: RefreshInput,
  ) {
    return this.authentication.refresh(input);
  }

  @Authenticated()
  @ApiBearerAuth()
  @Post("logout")
  @HttpCode(200)
  logout(@Req() request: HttpRequest): { loggedOut: true } {
    if (!request.identity) throw unauthenticated();
    this.authentication.logout(request.identity);
    return { loggedOut: true };
  }
}
