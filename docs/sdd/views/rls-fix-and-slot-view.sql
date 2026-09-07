-- Run in Supabase Dashboard -> SQL Editor -> New query -> Run.

-- ============================================================
-- 1. SECURITY FIX — profiles RLS (prevents self role escalation,
--    lets admins read/update pending masters). REQUIRED.
-- ============================================================
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- Role of the calling user. Referenced at the TOP LEVEL of the policy
-- expression because Postgres cannot resolve new/old inside subqueries.
create or replace function public.my_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select using (
    id = auth.uid()
    or role = 'master' and master_status = 'active'
    or public.is_admin()
  );

drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_update_admin" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid())
  with check (
    id = auth.uid()
    and role = public.my_role()
  );

create policy "profiles_update_admin" on public.profiles
  for update using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- 2. PUBLIC AVAILABILITY VIEW — guests must see which slots are
--    taken, without booking details. REQUIRED for booking.
-- ============================================================
create or replace view public.public_confirmed_slots as
  select master_id, start_at, end_at
  from public.bookings
  where status = 'confirmed';

grant select on public.public_confirmed_slots to anon, authenticated;