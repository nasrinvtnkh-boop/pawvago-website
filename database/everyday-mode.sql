-- PawVago Everyday Mode: per-user pet care reminders and preferred veterinarian contacts.
-- User data stays private under RLS. No location data stored.
create table if not exists public.pet_care_reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pet_id uuid not null references public.pets(id) on delete cascade,
  category text not null check (category in ('vaccination','document','medication','appointment','grooming','other')),
  title text not null check (char_length(title) between 1 and 140),
  due_date date not null,
  notes text check (char_length(notes) <= 1200),
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists pet_care_reminders_user_due_idx on public.pet_care_reminders(user_id,due_date);
create index if not exists pet_care_reminders_pet_idx on public.pet_care_reminders(pet_id);
alter table public.pet_care_reminders enable row level security;
drop policy if exists "paw_care_select_own" on public.pet_care_reminders;
create policy "paw_care_select_own" on public.pet_care_reminders for select to authenticated
using ((select auth.uid()) = user_id and exists (select 1 from public.pets p where p.id=pet_id and p.user_id=(select auth.uid())));
drop policy if exists "paw_care_insert_own" on public.pet_care_reminders;
create policy "paw_care_insert_own" on public.pet_care_reminders for insert to authenticated
with check ((select auth.uid()) = user_id and exists (select 1 from public.pets p where p.id=pet_id and p.user_id=(select auth.uid())));
drop policy if exists "paw_care_update_own" on public.pet_care_reminders;
create policy "paw_care_update_own" on public.pet_care_reminders for update to authenticated
using ((select auth.uid()) = user_id and exists (select 1 from public.pets p where p.id=pet_id and p.user_id=(select auth.uid())))
with check ((select auth.uid()) = user_id and exists (select 1 from public.pets p where p.id=pet_id and p.user_id=(select auth.uid())));
drop policy if exists "paw_care_delete_own" on public.pet_care_reminders;
create policy "paw_care_delete_own" on public.pet_care_reminders for delete to authenticated
using ((select auth.uid()) = user_id);

create table if not exists public.pet_vet_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pet_id uuid not null references public.pets(id) on delete cascade,
  clinic_name text not null check (char_length(clinic_name) between 1 and 180),
  contact_name text check (char_length(contact_name) <= 180),
  phone text check (char_length(phone) <= 50),
  address text check (char_length(address) <= 300),
  website text check (char_length(website) <= 300),
  notes text check (char_length(notes) <= 1200),
  created_at timestamptz not null default now()
);
create index if not exists pet_vet_contacts_user_pet_idx on public.pet_vet_contacts(user_id,pet_id);
alter table public.pet_vet_contacts enable row level security;
drop policy if exists "paw_vets_select_own" on public.pet_vet_contacts;
create policy "paw_vets_select_own" on public.pet_vet_contacts for select to authenticated
using ((select auth.uid()) = user_id and exists (select 1 from public.pets p where p.id=pet_id and p.user_id=(select auth.uid())));
drop policy if exists "paw_vets_insert_own" on public.pet_vet_contacts;
create policy "paw_vets_insert_own" on public.pet_vet_contacts for insert to authenticated
with check ((select auth.uid()) = user_id and exists (select 1 from public.pets p where p.id=pet_id and p.user_id=(select auth.uid())));
drop policy if exists "paw_vets_update_own" on public.pet_vet_contacts;
create policy "paw_vets_update_own" on public.pet_vet_contacts for update to authenticated
using ((select auth.uid()) = user_id and exists (select 1 from public.pets p where p.id=pet_id and p.user_id=(select auth.uid())))
with check ((select auth.uid()) = user_id and exists (select 1 from public.pets p where p.id=pet_id and p.user_id=(select auth.uid())));
drop policy if exists "paw_vets_delete_own" on public.pet_vet_contacts;
create policy "paw_vets_delete_own" on public.pet_vet_contacts for delete to authenticated
using ((select auth.uid()) = user_id);

-- Data API access only for authenticated users; never anonymous public inserts/reads.
revoke all on public.pet_care_reminders, public.pet_vet_contacts from anon;
grant select, insert, update, delete on public.pet_care_reminders, public.pet_vet_contacts to authenticated;
