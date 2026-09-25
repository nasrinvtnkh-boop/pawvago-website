create table if not exists public.pets(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id) on delete cascade,name text not null,species text not null,breed text,weight_kg numeric,created_at timestamptz default now());
alter table public.pets enable row level security;
create policy "Users read own pets" on public.pets for select using(auth.uid()=user_id);
create policy "Users insert own pets" on public.pets for insert with check(auth.uid()=user_id);
create policy "Users update own pets" on public.pets for update using(auth.uid()=user_id);
create policy "Users delete own pets" on public.pets for delete using(auth.uid()=user_id);
