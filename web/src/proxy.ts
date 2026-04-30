import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { hasPurchase } from "@/lib/purchases";

// Routes that require an authenticated AND paid user. Everything else
// (marketing, /login, /packs, /setup/mcp, /auth/*, /api/*) stays public.
const PROTECTED_PREFIXES = ["/app", "/teams", "/manual"];

// Cookie that caches paid status so we don't hit the DB on every page render.
// Source of truth lives in Supabase `purchases` table; this cookie is just a
// 24-hour cache, refreshed each time we confirm a purchase.
const PAID_COOKIE = "astack-paid";
const PAID_COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

function setPaidCookie(res: NextResponse, isHttps: boolean) {
  res.cookies.set(PAID_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps,
    path: "/",
    maxAge: PAID_COOKIE_MAX_AGE,
  });
}

/**
 * Refreshes the Supabase session cookie on every matched request, and gates
 * protected routes behind:
 *   1. An authenticated Supabase user, AND
 *   2. A purchase row in the `purchases` table for that user's email
 *      (cached in the `astack-paid` cookie for 24h to avoid DB hits on
 *      every page navigation).
 *
 * The `?purchased=<id>` redirect from Gumroad's thank-you page is a
 * fast-path: if a buyer arrives at /app?purchased=<id> we trust the
 * URL param and immediately set the cache cookie, then the webhook
 * lands the row asynchronously.
 *
 * Skipped entirely in single-user local mode (when Supabase env vars are
 * not set). Next.js 16 renamed this convention from `middleware` to `proxy`.
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

  let user: { email?: string | null } | null = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (err) {
    console.warn("[proxy] supabase auth refresh failed, continuing without refresh:", err);
  }

  const nextUrl = req.nextUrl;
  if (!nextUrl) return res; // test stubs may omit nextUrl; safe pass-through.

  const pathname = nextUrl.pathname;
  const purchased = nextUrl.searchParams.get("purchased");
  const protectedRoute = isProtected(pathname);
  const isHttps = nextUrl.protocol === "https:";

  if (!protectedRoute) return res;

  if (!user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname + nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // Fast-path 1: post-Gumroad redirect — trust the URL param, set cache.
  if (purchased) {
    setPaidCookie(res, isHttps);
    return res;
  }

  // Fast-path 2: the cache cookie is still valid.
  const cachedPaid = req.cookies.get(PAID_COOKIE)?.value === "1";
  if (cachedPaid) return res;

  // Source-of-truth check — DB lookup by email. Failure (no service-role
  // key, network error) returns false, which is treated like "not paid"
  // and bounces to the paywall. That's the safe default, not a regression.
  const email = user.email ?? "";
  const paid = await hasPurchase(email);
  if (paid) {
    setPaidCookie(res, isHttps);
    return res;
  }

  const packsUrl = new URL("/packs", req.url);
  packsUrl.searchParams.set("paywall", "1");
  return NextResponse.redirect(packsUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
