import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const DESKTOP_PORT = process.env.ASTACK_DESKTOP_PORT ?? "7331";
const DESKTOP_HOST = process.env.ASTACK_DESKTOP_HOST ?? "127.0.0.1";
const BASE_URL = `http://${DESKTOP_HOST}:${DESKTOP_PORT}`;

const TOKEN_FILE =
  process.platform === "win32"
    ? path.join(process.env.APPDATA ?? path.join(os.homedir(), "AppData", "Roaming"), "astack", "desktop-token")
    : path.join(os.homedir(), ".config", "astack", "desktop-token");

function readToken(): string | null {
  try {
    return fs.readFileSync(TOKEN_FILE, "utf8").trim();
  } catch {
    return null;
  }
}

// On Vercel (or any hosted environment), the desktop daemon at 127.0.0.1:7331
// is unreachable — it lives on the user's local machine, not the server. Skip
// the fetch entirely instead of paying ~50ms per render for guaranteed-failed
// TCP attempts. Detect via process.env.VERCEL or an explicit ASTACK_HOSTED=1.
const IS_HOSTED = !!(process.env.VERCEL || process.env.ASTACK_HOSTED === "1");

async function call<T = unknown>(method: "GET" | "POST", pathPart: string, body?: unknown): Promise<T> {
  if (IS_HOSTED) {
    throw new Error(`desktop daemon unavailable in hosted mode (${pathPart})`);
  }
  const token = readToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token && pathPart !== "/health") headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${pathPart}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`desktop ${method} ${pathPart} → ${res.status}`);
  return res.json() as Promise<T>;
}

export type DesktopHealth = {
  ok: boolean;
  name: string;
  version: string;
  platform: string;
  arch: string;
  astackRoot: string;
  tbrain: { available: boolean; version: string | null };
};

export type McpClientStatus = { configFound: boolean; tbrainWired: boolean; path: string };
export type McpStatus = {
  ok: boolean;
  clients: { "claude-desktop": McpClientStatus; "claude-code": McpClientStatus };
};

export async function getDesktopHealth(): Promise<DesktopHealth | null> {
  try {
    return await call<DesktopHealth>("GET", "/health");
  } catch {
    return null;
  }
}

export async function getMcpStatus(): Promise<McpStatus | null> {
  try {
    return await call<McpStatus>("GET", "/mcp/status");
  } catch {
    return null;
  }
}

export async function autoWireMcp(client: "claude-desktop" | "claude-code"): Promise<{ ok: boolean; path?: string; error?: string }> {
  try {
    return await call("POST", "/mcp/auto-wire", { client, server: "tbrain" });
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function launchTeam(teamId: string, client: "claude" | "antigravity" = "claude"): Promise<{ ok: boolean; teamName?: string; error?: string }> {
  try {
    return await call("POST", "/launch", { teamId, client });
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
