import { NextResponse, type NextRequest } from "next/server";
import { getPack } from "@/lib/packs";
import { getCurrentUser } from "@/lib/supabase/server";

// Auth-gated Gumroad redirect. Any "Buy" CTA sends users here:
//   - signed-out → /login?next=/buy/<id>
//   - signed-in  → that pack's Gumroad checkout (302 out)
// After Gumroad payment, the post-purchase URL should be configured in
// Gumroad to redirect to /app?purchased=<id>, which fires the celebration
// modal and sets the `astack-paid` cookie via the proxy.
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const pack = getPack(id);
  if (!pack || !pack.gumroadUrl) {
    return NextResponse.redirect(new URL("/packs", req.url));
  }

  const user = await getCurrentUser();
  if (!user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", `/buy/${id}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(pack.gumroadUrl);
}
