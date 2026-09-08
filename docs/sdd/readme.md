# SDD — working notes

📄 docs/sdd/spec.md — specification

- 3 roles (customer, master, admin)
- Master is inactive until approved by an admin
- Geo: Kassel + Göttingen, ≤50 km (haversine)
- Master defines fixed working hours → automatic slot generation
- Booking = request, master confirms
- No payments (MVP), DE + EN, email notifications
- 12 functional requirements + acceptance criteria
- 📄 docs/sdd/schema.sql — Supabase DB schema
  Tables: profiles, portfolio_images, services, working_hours, blocked_times, bookings, region_centers
  Key decisions:
  - No double-booking: partial unique index uq_confirmed_slot (master_id, start_at) WHERE status='confirmed'
  - RLS on all tables: only active masters are public; own profile/orders — owner; master edits own services; admin — everything
  - region_centers with Kassel and Göttingen coordinates (50 km radius)

✅ Base project infrastructure

| File | Purpose |
| --- | --- |
| src/lib/supabase/client.ts | Browser Supabase client |
| src/lib/supabase/server.ts | Server client (for Server Components) |
| src/lib/supabase/middleware.ts | Session refresh in middleware |
| src/middleware.ts | Root middleware (global session) |
| src/lib/geo.ts | Haversine calc + zone check (Kassel/Göttingen, ≤50 km) |
| src/lib/slots.ts | Slot generation + overlap checks |
| src/types/database.ts | All DB types (Profile, Service, Booking, WorkingHours…) |
| src/lib/utils.ts | cn() via clsx + tailwind-merge |

✅ app/ structure (route groups)

```
src/app/
├── (marketing)/ # Public site
│   └── page.tsx # Landing
├── (auth)/      # login, register
├── dashboard/   # master/, customer/ (layout + role router)
├── legal/       # impressum, datenschutz
├── api/auth/callback/ # Supabase auth callback
├── layout.tsx   # DE by default, toaster
```

✅ Checks

- tsc --noEmit — clean ✅
- npm run lint — clean ✅
- next build — successful ✅
  Build shows middleware automatically runs as Proxy (new Next 16.3 feature); the codemod warning is not critical for dev.
- 📌 Your 2 steps

1. Run SQL: Supabase → SQL Editor → paste docs/sdd/schema.sql → Run
2. Then copy docs/sdd/spec.md — don't forget, but the code is already built around it.

---

Great. Implement T1 Auth. First review what's needed: auth page files, middleware protection, typed roles.

Check current state: callback is empty, what's on dashboard:

→Read web/src/app/(marketing)/page.tsx
→Read web/src/components/ui/form.tsx

form.tsx is not installed. Needed for forms. But first I'll make auth without complex forms — simple client components with useState. Create:

1. Auth helper functions
2. login/register pages
3. Dashboard protected layout
4. DB trigger for auto-creating profile on signup

Start with helpers:

Now registration. Create a page with a simple form (no React Hook Form — useState + zod validation is enough):

Now the login page + form:

Now a DB trigger is needed to auto-create the profile on signup + a redirect from /dashboard to the role-specific page. I'll also add the trigger to the schema SQL. Create the trigger SQL first and give it to the user later. But so it works right away — create the trigger now via code + a /dashboard redirect page:

Now dashboard layouts. Create a simple protected layout with logout:

Now placeholder pages for master and customer dashboards:

Now create the SQL trigger for auto-creating the profile on signup. Critical — without it the profile is not created. Add it to schema.sql and hand it to you separately:

Add the trigger to the end of schema.sql:

Now a separate trigger file — so you can apply only it (the main schema already ran):

# Wrote docs/sdd/trigger_profile.sql

Now add a redirect page from callback (for email confirmation):

# Wrote web/src/app/api/auth/callback/route.ts

Now check types and build. The dashboard also requires email confirmation — better to enable "Email confirmations" in Supabase. Check build:

✅ T1 Auth — done

Created:

| File | What it does |
| --- | --- |
| src/lib/auth.ts | getCurrentUser, getCurrentProfile, requireUser, requireProfile, requireRole |
| (auth)/register/ | Page + registration form with role select (Kunde/Handwerker) |
| (auth)/login/ | Page + login form |
| dashboard/ | Protected layout + Abmelden button + role router |
| dashboard/master/ | Stub (shows "pending" while master is on moderation) |
| dashboard/customer/ | Stub |
| api/auth/callback/ | Email confirmation handling |
| docs/sdd/trigger_profile.sql | SQL trigger — creates profile on signup |

Fixed:

- Route group (dashboard) → dashboard/ folder (removed the / path conflict)
- middleware.ts → proxy.ts (new Next 16.3 convention)
- utils.ts → clean cn() (clsx + tailwind-merge), doesn't touch shadcn

Checks:

- ✅ tsc --noEmit — clean
- ✅ npm run lint — clean
- ✅ next build — successful, routes: /, /login, /register, /dashboard\*, /api/auth/callback

📌 Your step — run the trigger

Open docs/sdd/trigger_profile.sql → paste in Supabase SQL Editor → Run.
Critical: without it, no profiles row is created on signup and you bounce back to /login.
Then — browser test

1. npm run dev → open localhost:3000/register
2. Register as Kunde → you should land in /dashboard/customer
3. Register as Handwerker → lands in /dashboard/master with "Antrag in Prüfung"

Tell me when you've run the trigger — and how the test went. Then we move on to T2 (geo check for masters).

Done — commit and push completed.

Summary

- Commit: feat: SDD spec, Supabase schema, and auth foundation (50 files)
- Branch: main, tracks origin/main
- On GitHub: https://github.com/Yevhenii1951/handwerker-booking-pro-Kassel
- Security: .env.local (with your Supabase keys) is git-ignored and never entered the repo. ✅
- Next step — run trigger_profile.sql in Supabase SQL Editor (already created at docs/sdd/trigger_profile.sql), then test registration. Tell me how it goes.

✅ Everything works. Test users deleted.

| Scenario | Result |
| --- | --- |
| Master, role master | profile created, master_status: pending ✅ |
| Customer, role customer | profile created, master_status: null ✅ |

The bug was in the type: CASE ... THEN 'pending' returned text, but was inserted into the enum column master_status. The explicit cast 'pending'::public.master_status fixed it.

What's next

Now registration in your app (npm run dev → /register) should work as expected.
Fix is recorded in docs/sdd/trigger_profile.sql and docs/sdd/schema.sql. Commit and push? And we move to T2 — geo check for masters (master profile details with coordinates/region)?

=================================================================================================

✅ T2 done and pushed (31e8729).

What was done

| File | Purpose |
| --- | --- |
| src/lib/geocode.ts | Geocoding PLZ → coordinates via Nominatim (OpenStreetMap, no key) |
| src/lib/geo.ts + regionFromCenters() | Nearest zone detection (Kassel/Göttingen) |
| src/lib/trades.ts | List of Gewerke for selection |
| dashboard/master/onboarding/ | Page + form + server action with 50 km zone check |
| dashboard/master/page.tsx | Redirect to onboarding until profile is complete |
| vitest + tests | 13 tests: haversine, zone, geocoder (fallbacks, errors) |

How it works

1. Master registers → /dashboard/master → redirect to onboarding
2. Fills in Gewerk, PLZ, Ort, phone → Submit
3. Server geocodes PLZ → checks isWithinAnyRegion (50 km from Kassel or Göttingen)
4. In zone → profile saved + coordinates, status stays pending (waits for admin)
5. Out of zone → error «liegt außerhalb unseres Servicegebiets», data is not saved

Checks: tsc ✅ · lint ✅ · test 13/13 ✅ · build ✅

Your step (when the limit resets)
Register a master → fill in onboarding (e.g. PLZ 34117 Kassel). Enter a far-away PLZ (e.g. 10115 Berlin) — you'll see the rejection.
Check it — and we move to T3: master profile (CRUD, services, working hours → slot generation).