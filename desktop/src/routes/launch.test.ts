import { describe, expect, it } from "bun:test";
import { cmdQuote, appleScriptQuote } from "./launch";

describe("cmdQuote", () => {
  it("leaves arg without whitespace or metachars untouched", () => {
    expect(cmdQuote("claude")).toBe("claude");
    expect(cmdQuote("--append-system-prompt-file")).toBe("--append-system-prompt-file");
    expect(cmdQuote("C:\\Users\\aniru\\teams\\01-executive.md")).toBe(
      "C:\\Users\\aniru\\teams\\01-executive.md"
    );
  });

  // REGRESSION: the v0.2 launch handler joined args with a bare space, so an
  // astack root with a space (e.g. "Anirudhs org") split mid-arg and `cmd /k`
  // saw the path as two separate words. Every Windows launch from the default
  // workspace silently broke. cmdQuote must wrap any arg with whitespace.
  it("[regression] wraps a Windows path with a space in double quotes", () => {
    const path = "C:\\Users\\aniru\\Anirudhs org\\teams\\01-executive.md";
    expect(cmdQuote(path)).toBe(`"${path}"`);
  });

  it("escapes embedded double quotes by doubling them (cmd convention)", () => {
    expect(cmdQuote('he said "hi"')).toBe('"he said ""hi"""');
  });

  it("quotes args containing cmd metachars (& | < > ^) even without spaces", () => {
    expect(cmdQuote("a&b")).toBe('"a&b"');
    expect(cmdQuote("a|b")).toBe('"a|b"');
    expect(cmdQuote("a^b")).toBe('"a^b"');
  });
});

describe("appleScriptQuote", () => {
  it("wraps a plain path in double quotes", () => {
    expect(appleScriptQuote("/Users/aniru/work")).toBe('"/Users/aniru/work"');
  });

  it("escapes backslashes before quotes (order matters — backslash first)", () => {
    expect(appleScriptQuote('a\\b"c')).toBe('"a\\\\b\\"c"');
  });
});
