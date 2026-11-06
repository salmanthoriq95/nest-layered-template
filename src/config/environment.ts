import { ConfigModule } from "@nestjs/config";
import {
  parseApiSettings,
  parseWorkerSettings,
} from "./settings.js";
import type { ProcessRole } from "./settings.js";

export async function loadEnvironment(role: ProcessRole): Promise<void> {
  // Expansion must remain disabled: bcrypt's dollar signs are literal data.
  await ConfigModule.forRoot({
    isGlobal: true,
    expandVariables: false,
    ignoreEnvFile: process.env.NODE_ENV === "test",
    validate: (environment: Record<string, unknown>) => {
      if (role === "api") parseApiSettings(environment);
      else parseWorkerSettings(environment);
      return environment;
    },
  });
}
