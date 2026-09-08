-- MIGRATION: notifications table + helpers
-- Run this in Supabase SQL Editor.

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  body text,
  link text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user_read
  on public.notifications (user_id, read);
create index if not exists idx_notifications_user_created
  on public.notifications (user_id, created_at desc);

alter table public.notifications enable row level security;

-- Users can read only their own notifications.
create policy "read own notifications" on public.notifications
  for select using (user_id = auth.uid());

-- Users can mark their own notifications as read.
create policy "update own notifications" on public.notifications
  for update using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Inserts go through a SECURITY DEFINER helper so a master/client can
-- create a notification for the *other* party (cross-user). RLS would
-- otherwise block inserting a row whose user_id is not the caller.
create or replace function public.create_notification(
  p_user_id uuid,
  p_title text,
  p_body text default null,
  p_link text default null
)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.notifications (user_id, title, body, link)
  values (p_user_id, p_title, p_body, p_link);
end;
$$;

grant execute on function public.create_notification to authenticated;
