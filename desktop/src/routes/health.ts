import type { Ctx } from "../index";
import { execFileSync } from "node:child_process";

const VERSION = "0.1.0";
const isWindows = process.platform === "win32";

export async function handleHealth(ctx: Ctx) {
  let tbrainOk = false;
  let tbrainVersion: string | null = null;
  // Try the astack-branded `tbrain` wrapper first; fall back to `gbrain`
  // for installs that haven't put the wrapper on PATH yet.
  for (const bin of isWindows ? ["tbrain.cmd", "gbrain.cmd"] : ["tbrain", "gbrain"]) {
    try {
      const out = execFileSync(bin, ["--version"], { encoding: "utf8", timeout: 4000 });
      tbrainOk = true;
      tbrainVersion = out.trim();
      break;
    } catch {
      /* try next */
    }
  }

  return {
    ok: true,
    name: "astack-desktop",
    version: VERSION,
    platform: process.platform,
    arch: process.arch,
    astackRoot: ctx.astackRoot,
    tbrain: { available: tbrainOk, version: tbrainVersion },
  };
}
