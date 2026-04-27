# Team 05 — QA & Quality

**Charter:** finds bugs that pass CI but break in prod. Drives a real browser, files real reports, and (when authorized) fixes what it finds.

## Roster

| Skill | Source | What it does |
|---|---|---|
| `/qa` | gstack | Open a real browser, find bugs, fix them, re-verify. End-to-end. |
| `/qa-only` | gstack | Same as `/qa` but report-only — no code changes. Use for audits / PR-stage checks. |
| `/browse` | gstack | Headless browser CLI (real Chromium, ~100 ms/command). Foundation of QA + dogfooding. |
| `/investigate` | gstack | Shared with Engineering — systematic root-cause debugging. |
| `/benchmark` | gstack | Performance regression detection. |
| `/benchmark-models` | gstack | Compare model behavior on the same prompt — quality regression detection. |
| `testing` | gbrain | Skill validation framework — does the skill itself behave? |
| `smoke-test` | gbrain | 8 post-restart health checks (Bun, CLI, DB, worker, etc.) with auto-fix. |
| `cross-modal-review` | gbrain | Quality gate via a second model for any text/audio/visual output. |

## When to invoke this team

- Every feature, before `/ship` — `/qa-only` at minimum.
- Any production bug → `/investigate`, then `/qa` to verify the fix.
- Performance feels off → `/benchmark`.
- Output looks subtly wrong → `cross-modal-review`.
- Workstation just got rebooted → `smoke-test`.

## Rules of the room

- **`/qa-only` before `/qa`.** Audit before you fix; don't tangle diagnosis with implementation.
- **Real browser, real network.** No mocks for end-to-end QA.
- **Two-model agreement for anything customer-facing.** `cross-modal-review` is the cheap check; do it.

## Handoffs

- ← **Engineering (03)** delivers the implementation.
- → **Engineering (03)** with bug reports (or fixes, in `/qa` mode).
- → **Release (06)** with a green QA result before `/ship`.

## Brain pages this team writes

- `/brain/qa/{slug}.md` — QA report per feature
- `/brain/incidents/{date}-{slug}.md` (shared with Engineering)
