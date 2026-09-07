-- ============================================================
-- Handwerker Booking Pro — Supabase Schema (PostgreSQL)
-- Paste into: Supabase Dashboard -> SQL Editor -> New query -> Run
-- ============================================================

-- Roles (enum)
create type public.app_role as enum ('customer', 'master', 'admin');

-- Master approval status
create type public.master_status as enum ('pending', 'active', 'rejected', 'deactivated');

-- Booking status
create type public.booking_status as enum ('pending', 'confirmed', 'declined', 'cancelled');

-- ============================================================
-- PROFILES (one row per auth user, holds role + master data)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role app_role not null default 'customer',
  master_status master_status,
  full_name text,
  phone text,
  bio text,
  -- master geo / profile fields
  trade text,                 -- category: e.g. 'Elektriker', 'Klempner'
  city text,
  plz text,
  latitude double precision,
  longitude double precision,
  photo_url text,
  is_i18n_en boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_profiles_trade on public.profiles (trade);
create index idx_profiles_role on public.profiles (role);
create index idx_profiles_master_status on public.profiles (master_status);

-- ============================================================
-- PORTFOLIO IMAGES (master photos, stored in Supabase Storage)
-- ============================================================
create table public.portfolio_images (
  id uuid primary key default gen_random_uuid(),
  master_id uuid not null references public.profiles (id) on delete cascade,
  image_url text not null,
  sort_order int default 0,
  created_at timestamptz not null default now()
);

create index idx_portfolio_master on public.portfolio_images (master_id);

-- ============================================================
-- SERVICES (offered by a master)
-- ============================================================
create table public.services (
  id uuid primary key default gen_random_uuid(),
  master_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  description text,
  price numeric(10,2) not null default 0,
  duration_minutes int not null,
  created_at timestamptz not null default now()
);

create index idx_services_master on public.services (master_id);
create index idx_services_name on public.services (name);

-- ============================================================
-- WORKING HOURS (fixed weekly availability per master)
--   day_of_week: 0=Sunday ... 6=Saturday
-- ============================================================
create table public.working_hours (
  id uuid primary key default gen_random_uuid(),
  master_id uuid not null references public.profiles (id) on delete cascade,
  day_of_week int not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  constraint chk_working_hours_range check (end_time > start_time)
);

create index idx_working_hours_master on public.working_hours (master_id);

-- ============================================================
-- BLOCKED TIMES (explicit master-unavailable periods)
-- ============================================================
create table public.blocked_times (
  id uuid primary key default gen_random_uuid(),
  master_id uuid not null references public.profiles (id) on delete cascade,
  start_at timestamptz not null,
  end_at timestamptz not null,
  reason text,
  constraint chk_blocked_range check (end_at > start_at)
);

create index idx_blocked_master on public.blocked_times (master_id);

-- ============================================================
-- BOOKINGS
-- Slot can be booked by ONE approved booking at a time.
-- Uniqueness enforced on (master_id, start_at) for confirmed bookings
-- (both confirmed + pending share slot lifecycle; pending does NOT block).
-- We enforce uniqueness via an exclusion-ish partial unique index.
-- ============================================================
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  master_id uuid not null references public.profiles (id) on delete cascade,
  customer_id uuid not null references auth.users (id) on delete cascade,
  service_id uuid references public.services (id) on delete set null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  status booking_status not null default 'pending',
  customer_phone text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_bookings_master on public.bookings (master_id, start_at);
create index idx_bookings_customer on public.bookings (customer_id);

-- Prevent double-booking a confirmed slot for same master at same start time.
create unique index uq_confirmed_slot on public.bookings (master_id, start_at)
  where status = 'confirmed';

-- ============================================================
-- geofence: reference points for Kassel and Göttingen
-- ============================================================
create table public.region_centers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  latitude double precision not null,
  longitude double precision not null,
  max_radius_km double precision not null default 50
);

insert into public.region_centers (name, latitude, longitude, max_radius_km) values
  ('Kassel', 51.3127, 9.4797, 50),
  ('Göttingen', 51.5413, 9.9157, 50);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.portfolio_images enable row level security;
alter table public.services enable row level security;
alter table public.working_hours enable row level security;
alter table public.blocked_times enable row level security;
alter table public.bookings enable row level security;
alter table public.region_centers enable row level security;

-- ---------- PROFILES ----------
-- Anyone (incl. anon for public browsing) can read active masters and own profile.
create policy "profiles_select" on public.profiles
  for select using (
    id = auth.uid()
    or role = 'master' and master_status = 'active'
    or role = 'admin'
  );

-- User inserts own profile row.
create policy "profiles_insert_own" on public.profiles
  for insert with check (id = auth.uid());

-- User updates own profile; admin updates any.
create policy "profiles_update_own" on public.profiles
  for update using (
    id = auth.uid() or role = 'admin'
  );

-- ---------- PORTFOLIO IMAGES ----------
create policy "portfolio_select" on public.portfolio_images
  for select using (true);

create policy "portfolio_insert_own" on public.portfolio_images
  for insert with check (
    master_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "portfolio_update_own" on public.portfolio_images
  for update using (
    master_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "portfolio_delete_own" on public.portfolio_images
  for delete using (
    master_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ---------- SERVICES ----------
-- Public can read services of active masters.
create policy "services_select" on public.services
  for select using (
    exists (select 1 from public.profiles m
            where m.id = services.master_id
              and (m.role = 'master' and m.master_status = 'active'))
  );

create policy "services_insert_own" on public.services
  for insert with check (
    master_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "services_update_own" on public.services
  for update using (
    master_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "services_delete_own" on public.services
  for delete using (
    master_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ---------- WORKING HOURS ----------
create policy "working_hours_select" on public.working_hours
  for select using (true);

create policy "working_hours_insert_own" on public.working_hours
  for insert with check (
    master_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "working_hours_update_own" on public.working_hours
  for update using (
    master_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "working_hours_delete_own" on public.working_hours
  for delete using (
    master_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ---------- BLOCKED TIMES ----------
create policy "blocked_times_select" on public.blocked_times
  for select using (true);

create policy "blocked_times_insert_own" on public.blocked_times
  for insert with check (
    master_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "blocked_times_delete_own" on public.blocked_times
  for delete using (
    master_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ---------- BOOKINGS ----------
-- Masters see bookings where they are the master; customers see own; admins see all.
create policy "bookings_select" on public.bookings
  for select using (
    customer_id = auth.uid()
    or master_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Customer creates a booking for themselves.
create policy "bookings_insert" on public.bookings
  for insert with check (customer_id = auth.uid());

-- Master updates booking status (confirm/decline); customer cancels their own.
create policy "bookings_update" on public.bookings
  for update using (
    master_id = auth.uid() or customer_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ---------- REGION CENTERS ----------
create policy "region_centers_select" on public.region_centers
  for select using (true);

-- ============================================================
-- AUTO-PROFILE TRIGGER
-- Creates a profiles row whenever a new auth user signs up.
-- role and full_name are read from the JWT user_metadata.
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, master_status)
  values (
    new.id,
    coalesce((new.raw_user_meta_data->>'role'), 'customer')::public.app_role,
    new.raw_user_meta_data->>'full_name',
    case
      when (new.raw_user_meta_data->>'role') = 'master' then 'pending'::public.master_status
      else null::public.master_status
    end
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
