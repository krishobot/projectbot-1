import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { packIdFromPermalink } from "@/lib/purchases";

// Gumroad pings this endpoint after every sale. We:
//   1. Verify the request via a static token in the URL (?token=…).
//   2. Parse the form-encoded body Gumroad sends.
//   3. Upsert a row into `purchases` keyed by Gumroad's sale_id (idempotent).
//   4. Return 200 — Gumroad treats anything else as a delivery failure and
//      retries with backoff.
//
// Set up:
//   - Generate a random secret (e.g. `openssl rand -hex 32`).
//   - Add it to Vercel env as GUMROAD_WEBHOOK_TOKEN.
//   - In Gumroad → Settings → Advanced → Ping URL, paste:
//       https://<your-domain>/api/gumroad-webhook?token=<secret>
export async function POST(req: NextRequest) {
  const expected = process.env.GUMROAD_WEBHOOK_TOKEN;
  if (!expected) {
    console.error("[gumroad-webhook] GUMROAD_WEBHOOK_TOKEN not set");
    return NextResponse.json({ ok: false, reason: "not configured" }, { status: 503 });
  }
  const token = req.nextUrl.searchParams.get("token");
  if (token !== expected) {
    return NextResponse.json({ ok: false, reason: "bad token" }, { status: 401 });
  }

  // Gumroad sends application/x-www-form-urlencoded.
  const body = await req.formData();
  const email = String(body.get("email") ?? "").trim().toLowerCase();
  const saleId = String(body.get("sale_id") ?? "").trim();
  const permalink = String(body.get("permalink") ?? "").trim();
  const productName = String(body.get("product_name") ?? "").trim();
  const test = body.get("test") === "true";

  if (!email || !saleId) {
    return NextResponse.json(
      { ok: false, reason: "missing email or sale_id" },
      { status: 400 },
    );
  }

  const admin = await getSupabaseAdmin();
  if (!admin) {
    console.error("[gumroad-webhook] supabase admin not configured");
    return NextResponse.json({ ok: false, reason: "db unavailable" }, { status: 503 });
  }

  const packId = packIdFromPermalink(permalink) || productName || "unknown";

  // Capture the full payload for debugging — Gumroad sends a lot of useful
  // fields (price, currency, country, refunded flag, etc.) we may want later.
  const payload: Record<string, string> = {};
  for (const [k, v] of body.entries()) payload[k] = String(v);

  const { error } = await admin
    .from("purchases")
    .upsert(
      {
        sale_id: saleId,
        email,
        pack_id: packId,
        gumroad_payload: payload,
      },
      { onConflict: "sale_id" },
    );

  if (error) {
    console.error("[gumroad-webhook] upsert failed:", error.message);
    return NextResponse.json({ ok: false, reason: error.message }, { status: 500 });
  }

  console.log(`[gumroad-webhook] recorded sale ${saleId} for ${email} (${packId})${test ? " [test]" : ""}`);
  return NextResponse.json({ ok: true });
}

// Some Gumroad accounts ping with GET when validating the URL during setup.
// Respond friendly so the "Save" step succeeds.
export async function GET(req: NextRequest) {
  const expected = process.env.GUMROAD_WEBHOOK_TOKEN;
  const token = req.nextUrl.searchParams.get("token");
  if (!expected || token !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true, ready: true });
}
