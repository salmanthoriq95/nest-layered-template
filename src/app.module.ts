import { Module } from "@nestjs/common";
import type { DynamicModule } from "@nestjs/common";
import { ClockContract } from "./common/clock.contract.js";
import type { ApiSettings } from "./config/settings.js";
import { HealthController } from "./http/health.controller.js";
import { AuthModule } from "./modules/auth/auth.module.js";
import { ExamplesModule } from "./modules/examples/examples.module.js";

@Module({})
export class AppModule {
  static register(settings: ApiSettings, clock: ClockContract): DynamicModule {
    return {
      module: AppModule,
      imports: [AuthModule.register(settings, clock), ExamplesModule],
      controllers: [HealthController],
    };
  }
}
