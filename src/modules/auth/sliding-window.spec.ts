import { test } from "node:test";
import assert from "node:assert/strict";
import { FakeClock } from "../../../test/helpers/fake-clock.js";
import { SlidingWindow } from "./sliding-window.js";
import { canonicalIp } from "../../http/boundary.js";

test("sliding window reserves synchronously and rejected calls do not extend it", () => {
  const time = new FakeClock();
  const limiter = new SlidingWindow(time);
  const input = { scope: "login", clientIp: "127.0.0.1", maximum: 2, windowMs: 1000 };
  assert.equal(limiter.admit(input).allowed, true);
  time.advance(100);
  assert.equal(limiter.admit(input).allowed, true);
  time.advance(100);
  assert.deepEqual(limiter.admit(input), { allowed: false, retryAfter: 1 });
  assert.equal(limiter.admit({ ...input, scope: "refresh" }).allowed, true);
  time.advance(800);
  assert.equal(limiter.admit(input).allowed, true);
  time.epoch -= 500000;
  assert.equal(limiter.admit(input).allowed, false);
});

test("equivalent forwarded address representations share one identity", () => {
  assert.equal(canonicalIp("::ffff:127.0.0.1"), canonicalIp("127.0.0.1"));
  assert.equal(canonicalIp("2001:0db8:0:0:0:0:0:1"), canonicalIp("2001:db8::1"));
});
