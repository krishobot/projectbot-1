import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Refreshes the Supabase session cookie on every request that matches the
 * `matcher` below. Skipped entirely in single-user local mode (when
 * Supabase env vars are not set). Next.js 16 renamed this convention from
 * `middleware` to `proxy`.
 */
export async function proxy(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return NextResponse.next();

  const res = NextResponse.next({ request: req });
  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (toSet) => {
        for (const { name, value, options } of toSet) {
          res.cookies.set(name, value, options);
        }
      },
    },
  });

  // Refresh session cookie if it's about to expire. If Supabase is unreachable,
  // log and pass through — an auth-service outage must not block every page.
  try {
    await supabase.auth.getUser();
  } catch (err) {
    console.warn("[proxy] supabase auth refresh failed, continuing without refresh:", err);
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
