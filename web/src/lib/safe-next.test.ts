import { describe, expect, it } from "bun:test";
import { safeNext } from "./safe-next";

describe("safeNext", () => {
  it("returns / for null/undefined/empty", () => {
    expect(safeNext(null)).toBe("/");
    expect(safeNext(undefined)).toBe("/");
    expect(safeNext("")).toBe("/");
  });

  it("passes through same-origin relative paths", () => {
    expect(safeNext("/app")).toBe("/app");
    expect(safeNext("/teams/engineering")).toBe("/teams/engineering");
    expect(safeNext("/app?tab=brain")).toBe("/app?tab=brain");
  });

  // REGRESSION (CSO 2026-04-30 finding #1): the v0.5 callback redirected to
  // `new URL(next, url.origin)` with no validation, so `next=https://evil.com`
  // resolved to evil.com and turned the OAuth callback into a phishing redirect.
  it("[regression] rejects absolute URLs", () => {
    expect(safeNext("https://attacker.com")).toBe("/");
    expect(safeNext("http://attacker.com/phish")).toBe("/");
    expect(safeNext("javascript:alert(1)")).toBe("/");
  });

  it("[regression] rejects protocol-relative URLs", () => {
    expect(safeNext("//attacker.com")).toBe("/");
    expect(safeNext("//attacker.com/phish")).toBe("/");
  });

  it("[regression] rejects backslash-prefixed URLs (browser quirks)", () => {
    expect(safeNext("/\\attacker.com")).toBe("/");
  });
});
