import type { Ctx } from "../index";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

type Client = "claude-desktop" | "claude-code";
type AutoWireInput = { client: Client; server?: string };

const isWindows = process.platform === "win32";
const isMac = process.platform === "darwin";

function configPath(client: Client): string {
  if (client === "claude-code") {
    return path.join(os.homedir(), ".claude", "settings.json");
  }
  // claude-desktop
  if (isWindows) {
    return path.join(process.env.APPDATA ?? path.join(os.homedir(), "AppData", "Roaming"), "Claude", "claude_desktop_config.json");
  }
  if (isMac) {
    return path.join(os.homedir(), "Library", "Application Support", "Claude", "claude_desktop_config.json");
  }
  return path.join(os.homedir(), ".config", "Claude", "claude_desktop_config.json");
}

const TBRAIN_ENTRY = { command: "tbrain", args: ["mcp"] };

export async function handleMcpStatus(_ctx: Ctx) {
  const out: Record<Client, { configFound: boolean; tbrainWired: boolean; path: string }> = {
    "claude-desktop": probe("claude-desktop"),
    "claude-code": probe("claude-code"),
  };
  return { ok: true, clients: out };
}

function probe(client: Client) {
  const p = configPath(client);
  if (!fs.existsSync(p)) return { configFound: false, tbrainWired: false, path: p };
  try {
    const raw = fs.readFileSync(p, "utf8");
    const cfg = JSON.parse(raw);
    const wired = !!cfg?.mcpServers?.tbrain;
    return { configFound: true, tbrainWired: wired, path: p };
  } catch {
    return { configFound: true, tbrainWired: false, path: p };
  }
}

export async function handleMcpAutoWire(_ctx: Ctx, input: AutoWireInput) {
  const client = input?.client;
  if (client !== "claude-desktop" && client !== "claude-code") {
    return { ok: false, error: "client must be 'claude-desktop' or 'claude-code'" };
  }
  const serverName = input.server ?? "tbrain";
  const p = configPath(client);

  let cfg: { mcpServers?: Record<string, unknown> } = {};
  if (fs.existsSync(p)) {
    try {
      cfg = JSON.parse(fs.readFileSync(p, "utf8"));
    } catch (err) {
      return { ok: false, error: `existing config is not valid JSON at ${p}: ${err instanceof Error ? err.message : err}` };
    }
    // Backup before any write
    const backup = `${p}.astack-backup-${Date.now()}`;
    fs.copyFileSync(p, backup);
  } else {
    fs.mkdirSync(path.dirname(p), { recursive: true });
  }

  cfg.mcpServers = { ...(cfg.mcpServers ?? {}), [serverName]: TBRAIN_ENTRY };
  fs.writeFileSync(p, JSON.stringify(cfg, null, 2) + "\n", { encoding: "utf8" });
  return { ok: true, path: p, server: serverName, action: "wrote" };
}
