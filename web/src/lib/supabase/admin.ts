import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. Bypasses RLS — use ONLY on the server, never
 * import this into a client component or anything that could be sent to the
 * browser. Returns null if the service-role key isn't configured.
 *
 * The proxy and the Gumroad webhook handler use this to read/write the
 * `purchases` table without needing per-user RLS policies.
 *
 * Lazy-loads `@supabase/supabase-js` (via dynamic import) so the proxy
 * regression test doesn't have to mock supabase-js's module initialisation.
 */
let _admin: SupabaseClient | null = null;

export async function getSupabaseAdmin(): Promise<SupabaseClient | null> {
  if (_admin) return _admin;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  const { createClient } = await import("@supabase/supabase-js");
  _admin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _admin;
}
