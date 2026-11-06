export abstract class ClockContract {
  abstract epochMs(): number;
  abstract monotonicMs(): number;
}
