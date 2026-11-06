create table public.pet_chat_threads (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 title text not null check (char_length(title) between 1 and 120),
 messages jsonb not null default '[]'::jsonb check (jsonb_typeof(messages)='array' and jsonb_array_length(messages)<=120 and octet_length(messages::text)<=250000),
 revision integer not null default 1 check (revision>0),
 updated_at timestamptz not null default now(),
 created_at timestamptz not null default now()
);
create index pet_chat_threads_owner_updated on public.pet_chat_threads(user_id, updated_at desc);
alter table public.pet_chat_threads enable row level security;
revoke all on public.pet_chat_threads from anon;
grant select,insert,update,delete on public.pet_chat_threads to authenticated;
create policy pet_chat_select on public.pet_chat_threads for select to authenticated using ((select auth.uid())=user_id);
create policy pet_chat_insert on public.pet_chat_threads for insert to authenticated with check ((select auth.uid())=user_id);
create policy pet_chat_update on public.pet_chat_threads for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy pet_chat_delete on public.pet_chat_threads for delete to authenticated using ((select auth.uid())=user_id);
