import { Module } from "@nestjs/common";
import { ExamplesController } from "./examples.controller.js";
import { ExamplesService } from "./examples.service.js";
import { ExamplesServiceContract } from "./contracts/examples-service.contract.js";

@Module({
  controllers: [ExamplesController],
  providers: [
    { provide: ExamplesServiceContract, useClass: ExamplesService },
  ],
})
export class ExamplesModule {}
