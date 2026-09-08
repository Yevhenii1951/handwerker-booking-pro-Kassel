-- MIGRATION: Freeze slots on pending (not just confirmed)
-- Run this in Supabase SQL Editor to update the view.
-- After this, pending bookings also block the slot for other customers.

create or replace view public.public_confirmed_slots as
  select master_id, start_at, end_at
  from public.bookings
  where status in ('pending', 'confirmed');

-- Also update the trigger to include trade/plz/city/lat/lon for new masters.
-- (Only run if you haven't already applied trigger_profile.sql)

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (
    id, role, full_name, master_status,
    trade, plz, city, latitude, longitude
  )
  values (
    new.id,
    coalesce((new.raw_user_meta_data->>'role'), 'customer')::public.app_role,
    new.raw_user_meta_data->>'full_name',
    case
      when (new.raw_user_meta_data->>'role') = 'master' then 'pending'::public.master_status
      else null::public.master_status
    end,
    (new.raw_user_meta_data->>'trade'),
    (new.raw_user_meta_data->>'plz'),
    (new.raw_user_meta_data->>'city'),
    case
      when (new.raw_user_meta_data->>'latitude') is not null
      then (new.raw_user_meta_data->>'latitude')::double precision
      else null
    end,
    case
      when (new.raw_user_meta_data->>'longitude') is not null
      then (new.raw_user_meta_data->>'longitude')::double precision
      else null
    end
  );
  return new;
end;
$$;
