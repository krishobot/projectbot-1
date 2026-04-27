"use client";

import { createBrowserClient } from "@supabase/ssr";

let _client: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Singleton Supabase browser client. Returns null if env vars aren't configured.
 * Components should fall back to single-user local mode in that case.
 */
export function getSupabaseBrowserClient() {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  _client = createBrowserClient(url, anon);
  return _client;
}
