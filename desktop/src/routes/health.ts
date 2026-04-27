import type { Ctx } from "../index";
import { execFileSync } from "node:child_process";

const VERSION = "0.1.0";
const isWindows = process.platform === "win32";

export async function handleHealth(ctx: Ctx) {
  let gbrainOk = false;
  let gbrainVersion: string | null = null;
  try {
    const out = execFileSync(isWindows ? "gbrain.cmd" : "gbrain", ["--version"], {
      encoding: "utf8",
      timeout: 4000,
    });
    gbrainOk = true;
    gbrainVersion = out.trim();
  } catch {
    /* not installed */
  }

  return {
    ok: true,
    name: "astack-desktop",
    version: VERSION,
    platform: process.platform,
    arch: process.arch,
    astackRoot: ctx.astackRoot,
    gbrain: { available: gbrainOk, version: gbrainVersion },
  };
}
