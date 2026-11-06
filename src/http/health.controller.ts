import { Controller, Get } from "@nestjs/common";
import { Public } from "../modules/auth/access-policy.js";

@Controller()
export class HealthController {
  @Public()
  @Get("health")
  health(): { status: "ok" } {
    return { status: "ok" };
  }
}
