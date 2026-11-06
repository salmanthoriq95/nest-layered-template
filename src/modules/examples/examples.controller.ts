import { Controller, Get, Inject } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Public, RequirePermissions, SuperadminOnly } from "../auth/access-policy.js";
import { ExamplesServiceContract } from "./contracts/examples-service.contract.js";
import { EXAMPLES_READ } from "./examples.permissions.js";

@ApiTags("Access examples")
@Controller("examples")
export class ExamplesController {
  constructor(
    @Inject(ExamplesServiceContract)
    private readonly examples: ExamplesServiceContract,
  ) {}

  @Public()
  @Get("public")
  publicAccess(): Readonly<{ access: "granted" }> {
    return this.examples.accessResult();
  }

  @RequirePermissions(EXAMPLES_READ)
  @ApiBearerAuth()
  @Get("admin")
  adminAccess(): Readonly<{ access: "granted" }> {
    return this.examples.accessResult();
  }

  @SuperadminOnly()
  @ApiBearerAuth()
  @Get("superadmin")
  superadminAccess(): Readonly<{ access: "granted" }> {
    return this.examples.accessResult();
  }
}
