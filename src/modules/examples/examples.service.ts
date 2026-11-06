import { ExamplesServiceContract } from "./contracts/examples-service.contract.js";

export class ExamplesService implements ExamplesServiceContract {
  accessResult(): Readonly<{ access: "granted" }> {
    return { access: "granted" };
  }
}
