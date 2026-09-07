-- Run in Supabase Dashboard -> SQL Editor -> New query -> Run.
-- Creates the public Storage bucket for master portfolio photos and locks
-- it down: owners can upload/delete under their own folder, anyone can
-- view. Also ensures the portfolio_images table + row-level policies exist
-- (idempotent; safe to re-run).

-- 0. TABLE + ROW-LEVEL POLICIES (if not yet created by schema.sql)
create table if not exists public.portfolio_images (
  id uuid primary key default gen_random_uuid(),
  master_id uuid not null references public.profiles (id) on delete cascade,
  image_url text not null,
  sort_order int default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_portfolio_master
  on public.portfolio_images (master_id);
alter table public.portfolio_images enable row level security;

drop policy if exists "portfolio_select" on public.portfolio_images;
create policy "portfolio_select" on public.portfolio_images
  for select using (true);

drop policy if exists "portfolio_insert_own" on public.portfolio_images;
create policy "portfolio_insert_own" on public.portfolio_images
  for insert with check (
    master_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role::text = 'admin')
  );

drop policy if exists "portfolio_delete_own" on public.portfolio_images;
create policy "portfolio_delete_own" on public.portfolio_images
  for delete using (
    master_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role::text = 'admin')
  );

-- 1. PUBLIC BUCKET
insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

-- 2. READ: anyone can view objects (bucket is public)
drop policy if exists "portfolio_images_select_all" on storage.objects;
create policy "portfolio_images_select_all" on storage.objects
  for select using (bucket_id = 'portfolio-images');

-- 3. UPLOAD: only the owner may write into their own folder
drop policy if exists "portfolio_images_insert_own" on storage.objects;
create policy "portfolio_images_insert_own" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'portfolio-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- 4. DELETE: only the owner may delete from their own folder
drop policy if exists "portfolio_images_delete_own" on storage.objects;
create policy "portfolio_images_delete_own" on storage.objects
  for delete to authenticated using (
    bucket_id = 'portfolio-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );