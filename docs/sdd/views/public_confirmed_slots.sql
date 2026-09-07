-- Run in Supabase Dashboard -> SQL Editor -> New query -> Run.
-- Exposes only confirmed (busy) intervals publicly so guests can see
-- available slots, without leaking who booked. Required for FR-6 (booking).

create or replace view public.public_confirmed_slots as
  select master_id, start_at, end_at
  from public.bookings
  where status = 'confirmed';

grant select on public.public_confirmed_slots to anon, authenticated;