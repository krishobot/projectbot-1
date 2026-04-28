import { describe, expect, it, beforeEach, afterEach, mock } from "bun:test";

// REGRESSION: v0.2 proxy.ts called `await supabase.auth.getUser()` with no
// try/catch. If Supabase is unreachable (DNS, outage, network error), every
// page-matching request hangs on that await and the whole console blocks —
// even for users who never sign in. This test confirms the proxy now passes
// through cleanly when the auth call rejects.

const ORIG_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ORIG_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

describe("proxy — supabase outage handling", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://fake.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "fake-anon-key";
  });

  afterEach(() => {
    if (ORIG_URL === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = ORIG_URL;
    if (ORIG_KEY === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = ORIG_KEY;
  });

  it("[regression] returns the response when supabase.auth.getUser() rejects", async () => {
    mock.module("@supabase/ssr", () => ({
      createServerClient: () => ({
        auth: {
          getUser: () => Promise.reject(new Error("network unreachable")),
        },
      }),
    }));

    const sentinel = { __sentinel: "next" };
    mock.module("next/server", () => ({
      NextResponse: {
        next: () => sentinel,
      },
    }));

    const { proxy } = await import("./proxy");
    const fakeReq = {
      cookies: { getAll: () => [] },
    } as unknown as Parameters<typeof proxy>[0];

    const out = await proxy(fakeReq);
    expect(out).toBe(sentinel);
  });
});
