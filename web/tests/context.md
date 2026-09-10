# Test Context — handwerker-booking-pro-Kassel

## Stack
- Next.js 16.3.4 (App Router) + React 19, TypeScript 5
- Supabase: auth (email/password) + Postgres + Storage (portfolio images)
- zod validation, server actions in `src/app/*/actions.ts`
- i18n: German (`de`) / English (`en`), `lang` cookie

## Commands
- install: `npm install` (in `web/`)
- dev: `npm run dev`
- build: `npm run build`
- lint: `npm run lint` (eslint)
- typecheck: `npx tsc --noEmit` (no script yet)
- unit tests: `npm run test` (vitest, include `src/**/*.test.ts`)
- check: `npm run check` = lint + `tsc --noEmit` + vitest (added, step 01 done)

## Database
- Remote Supabase Postgres (production). Schema: profiles (role customer|master|admin), bookings, services, working_hours, portfolio images in Storage bucket `portfolio-images`, notifications via `create_notification` RPC.
- Pending + confirmed bookings freeze slots (migration `002_freeze_pending_slots.sql` NOT yet applied to production).
- Test DB: NOT configured. Must use a dedicated Supabase project (or local Postgres) — never production.

## Three main user actions
1. Customer books a master's handwerker (search → contact page → time slot → booking confirm/cancel).
2. Master manages their services, schedule (working hours), portfolio and bookings (set status).
3. Admin manages master accounts and roles.

## Must not break (top features to protect with tests)
- Region gate: masters searchable only ≤50 km around Kassel/Göttingen (`geo.ts`, `master-filter.ts`).
- Slot availability + booking creation: no double-booking, correct times in Berlin timezone (`slots.ts`, `booking.ts`, `actions.ts`).
- Data ownership: customer sees only own bookings; master sees only own bookings/services/portfolio; foreign data never returned or mutated.
- Role separation: `requireRole(["customer","master","admin"])` enforced server-side on every dashboard.
- Auth flow: login → callback redirect is safe (no open redirect), session refresh works.
- Notification flow from `create_notification` RPC.

## Testing route (recommended order)
Run these in the order listed; adapt if admin validation or RLS turns out to require the migrations first:

1. **01 one-command** — add `check` = lint + tsc --noEmit + vitest run. Fastest win, then wire into agent rules.
2. **02 agent-rules** — add rule to `web/AGENTS.md` (task not done until `check` passes and output shown).
3. **03 db-fuse** — create dedicated test Supabase project; tests must never target production (guard: `SUPABASE_TEST_URL` required).
4. **04 logic-tests** — extend existing unit tests to boundaries/rejects: `todayBerlin()`, error paths in geo/slots/booking, master-filter edge cases.
5. **05 app-responses** — highest value: ownership + role + auth-callback safety. Requires testability refactor: extract core booking/ownership rules into pure functions (booking.ts, actions helpers) so they are testable without the server.
6. **06 browser-test** — one E2E (Playwright): customer searches a master → books a slot → booking appears in customer dashboard.
7. **07 browser-mcp** — already configured for the agent (Playwright MCP present globally).
8. **08 ci-checks** — GitHub Actions on push/PR + branch protection on `main`.

If only one step is possible: **05 app-responses**.