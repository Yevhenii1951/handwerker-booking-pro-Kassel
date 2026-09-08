-- ============================================================
-- AUTO-PROFILE TRIGGER (run this in Supabase SQL Editor)
-- Creates a profiles row whenever a new auth user signs up.
-- role and full_name are read from the JWT user_metadata.
-- ============================================================

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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();