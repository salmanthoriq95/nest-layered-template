export abstract class ExamplesServiceContract {
  abstract accessResult(): Readonly<{ access: "granted" }>;
}
