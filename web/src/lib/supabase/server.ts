import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client. Reads/writes auth cookies via Next's cookies() API.
 *
 * Returns null if Supabase env vars aren't configured — the rest of the app
 * should treat that as "auth disabled, single-user local mode."
 */
export async function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;

  const cookieStore = await cookies();

  return createServerClient(url, anon, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          for (const { name, value, options } of toSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components can't mutate cookies — fine, the middleware refreshes them.
        }
      },
    },
  });
}

/**
 * Returns the current authenticated user, or null. Safe to call from Server
 * Components — never throws. Returns null in single-user local mode (no env vars).
 */
export async function getCurrentUser() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}
