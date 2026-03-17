-- ============================================================
-- Donnect — Supabase Schema
-- Run this once in the Supabase SQL Editor (supabase.com → your project → SQL Editor)
-- ============================================================

-- 1. User profiles (extends Supabase auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  name text not null,
  role text not null default 'staff' check (role in ('admin', 'staff')),
  created_at timestamptz not null default now()
);

-- Auto-create a profile row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'staff')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Donors
create table if not exists donors (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  date_of_birth date not null,
  gender text not null check (gender in ('male', 'female', 'other')),
  blood_type text not null check (blood_type in ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
  phone text not null,
  email text not null,
  address text not null,
  emergency_contact_name text not null,
  emergency_contact_phone text not null,
  emergency_contact_relationship text not null,
  donation_center text not null,
  created_at date not null default current_date
);

-- 3. Donations
create table if not exists donations (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid not null references donors(id) on delete cascade,
  donor_name text not null,
  date date not null,
  type text not null check (type in ('whole_blood', 'plasma', 'platelets')),
  volume integer not null,
  center text not null,
  collected_by text not null,
  blood_type text not null
);

-- 4. Test Results
create table if not exists test_results (
  id uuid primary key default gen_random_uuid(),
  donation_id uuid not null references donations(id) on delete cascade,
  donor_id uuid not null references donors(id) on delete cascade,
  donor_name text not null,
  date date not null,
  hiv text not null default 'pending' check (hiv in ('pass', 'fail', 'pending')),
  hepatitis_b text not null default 'pending' check (hepatitis_b in ('pass', 'fail', 'pending')),
  hepatitis_c text not null default 'pending' check (hepatitis_c in ('pass', 'fail', 'pending')),
  syphilis text not null default 'pending' check (syphilis in ('pass', 'fail', 'pending')),
  blood_typing_confirmation text not null default 'pending' check (blood_typing_confirmation in ('pass', 'fail', 'pending')),
  hemoglobin numeric
);

-- 5. Medical Notes
create table if not exists medical_notes (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid not null references donors(id) on delete cascade,
  author text not null,
  date date not null default current_date,
  content text not null
);

-- ============================================================
-- Row Level Security (RLS)
-- All authenticated users can read/write all records.
-- You can tighten this per-center later.
-- ============================================================

alter table profiles enable row level security;
alter table donors enable row level security;
alter table donations enable row level security;
alter table test_results enable row level security;
alter table medical_notes enable row level security;

-- Profiles: users can only read/update their own profile
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Donors: all authenticated users can read/insert/update; only admins can delete
create policy "Authenticated users can read donors" on donors for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert donors" on donors for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update donors" on donors for update using (auth.role() = 'authenticated');
create policy "Admins can delete donors" on donors for delete using (
  (select role from profiles where id = auth.uid()) = 'admin'
);

-- Donations
create policy "Authenticated users can read donations" on donations for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert donations" on donations for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update donations" on donations for update using (auth.role() = 'authenticated');
create policy "Admins can delete donations" on donations for delete using (
  (select role from profiles where id = auth.uid()) = 'admin'
);

-- Test Results
create policy "Authenticated users can read test_results" on test_results for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert test_results" on test_results for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update test_results" on test_results for update using (auth.role() = 'authenticated');
create policy "Admins can delete test_results" on test_results for delete using (
  (select role from profiles where id = auth.uid()) = 'admin'
);

-- Medical Notes
create policy "Authenticated users can read medical_notes" on medical_notes for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert medical_notes" on medical_notes for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update medical_notes" on medical_notes for update using (auth.role() = 'authenticated');
create policy "Admins can delete medical_notes" on medical_notes for delete using (
  (select role from profiles where id = auth.uid()) = 'admin'
);
