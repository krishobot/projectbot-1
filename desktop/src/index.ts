#!/usr/bin/env bun
/**
 * astack desktop companion
 *
 * Local daemon at 127.0.0.1:7331. Bridges the SaaS web console to the user's
 * machine: brain access via gbrain CLI, terminal launching, MCP auto-wiring.
 *
 * Security: bound to localhost, bearer-token auth, every state-changing
 * endpoint backs up before write.
 */
import { serve } from "bun";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { randomBytes } from "node:crypto";
import { handleHealth } from "./routes/health";
import { handleBrainStats } from "./routes/brain";
import { handleTeams } from "./routes/teams";
import { handleLaunch } from "./routes/launch";
import { handleMcpAutoWire, handleMcpStatus } from "./routes/mcp";

const PORT = Number(process.env.ASTACK_DESKTOP_PORT ?? 7331);
const ASTACK_ROOT = process.env.ASTACK_ROOT ?? path.resolve(import.meta.dir, "..", "..");

const TOKEN_DIR =
  process.platform === "win32"
    ? path.join(process.env.APPDATA ?? path.join(os.homedir(), "AppData", "Roaming"), "astack")
    : path.join(os.homedir(), ".config", "astack");
const TOKEN_FILE = path.join(TOKEN_DIR, "desktop-token");

function ensureToken(): string {
  if (fs.existsSync(TOKEN_FILE)) return fs.readFileSync(TOKEN_FILE, "utf8").trim();
  fs.mkdirSync(TOKEN_DIR, { recursive: true });
  const token = randomBytes(32).toString("hex");
  fs.writeFileSync(TOKEN_FILE, token, { mode: 0o600 });
  return token;
}

const TOKEN = ensureToken();

export type Ctx = {
  astackRoot: string;
  token: string;
};

const ctx: Ctx = { astackRoot: ASTACK_ROOT, token: TOKEN };

function corsHeaders(origin: string | null): Record<string, string> {
  // Allow the SaaS web console on localhost during dev; production console
  // origin should be added via ASTACK_ALLOWED_ORIGINS env var (comma-separated).
  const allowed = new Set([
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    ...(process.env.ASTACK_ALLOWED_ORIGINS ?? "").split(",").map((s) => s.trim()).filter(Boolean),
  ]);
  if (origin && allowed.has(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Max-Age": "600",
    };
  }
  return {};
}

function unauthorized(origin: string | null) {
  return new Response(JSON.stringify({ error: "unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

function checkAuth(req: Request): boolean {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  return auth.slice(7) === ctx.token;
}

const server = serve({
  port: PORT,
  hostname: "127.0.0.1",
  async fetch(req) {
    const url = new URL(req.url);
    const origin = req.headers.get("origin");

    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    // Health is public so the console can detect "is the desktop daemon running?"
    if (url.pathname === "/health") {
      const res = await handleHealth(ctx);
      return jsonResponse(res, origin);
    }

    if (!checkAuth(req)) return unauthorized(origin);

    try {
      if (url.pathname === "/brain/stats" && req.method === "GET") {
        return jsonResponse(await handleBrainStats(ctx), origin);
      }
      if (url.pathname === "/teams" && req.method === "GET") {
        return jsonResponse(await handleTeams(ctx), origin);
      }
      if (url.pathname === "/launch" && req.method === "POST") {
        return jsonResponse(await handleLaunch(ctx, await req.json()), origin);
      }
      if (url.pathname === "/mcp/status" && req.method === "GET") {
        return jsonResponse(await handleMcpStatus(ctx), origin);
      }
      if (url.pathname === "/mcp/auto-wire" && req.method === "POST") {
        return jsonResponse(await handleMcpAutoWire(ctx, await req.json()), origin);
      }
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders(origin) } }
      );
    }

    return new Response(JSON.stringify({ error: "not_found" }), {
      status: 404,
      headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
    });
  },
});

function jsonResponse(body: unknown, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

console.log(`astack desktop companion listening on http://127.0.0.1:${server.port}`);
console.log(`astack root: ${ASTACK_ROOT}`);
console.log(`token file: ${TOKEN_FILE}`);
