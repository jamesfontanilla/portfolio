create extension if not exists pgcrypto;

create table if not exists public.admin_allowlist (
  email text primary key check (email = lower(email)),
  created_at timestamptz not null default now()
);

insert into public.admin_allowlist (email)
values ('jamesfontanilla.dev@proton.me')
on conflict (email) do nothing;

alter table public.admin_allowlist enable row level security;

drop policy if exists "Admins can read their own allowlist row" on public.admin_allowlist;
create policy "Admins can read their own allowlist row"
  on public.admin_allowlist for select to authenticated
  using (email = lower((select auth.jwt() ->> 'email')));

create table if not exists public.content_entries (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('settings', 'project', 'certification', 'event', 'blog')),
  slug text,
  title text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  featured boolean not null default false,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists content_entries_kind_slug_unique
  on public.content_entries (kind, slug);

create index if not exists content_entries_status_kind_updated_idx
  on public.content_entries (status, kind, updated_at desc);

alter table public.content_entries enable row level security;

drop policy if exists "Public can read published content" on public.content_entries;
create policy "Public can read published content"
  on public.content_entries for select to anon, authenticated
  using (status = 'published');

drop policy if exists "Admins can read all content" on public.content_entries;
create policy "Admins can read all content"
  on public.content_entries for select to authenticated
  using (exists (
    select 1 from public.admin_allowlist
    where email = lower((select auth.jwt() ->> 'email'))
  ));

drop policy if exists "Admins can insert content" on public.content_entries;
create policy "Admins can insert content"
  on public.content_entries for insert to authenticated
  with check (exists (
    select 1 from public.admin_allowlist
    where email = lower((select auth.jwt() ->> 'email'))
  ));

drop policy if exists "Admins can update content" on public.content_entries;
create policy "Admins can update content"
  on public.content_entries for update to authenticated
  using (exists (
    select 1 from public.admin_allowlist
    where email = lower((select auth.jwt() ->> 'email'))
  ))
  with check (exists (
    select 1 from public.admin_allowlist
    where email = lower((select auth.jwt() ->> 'email'))
  ));

drop policy if exists "Admins can delete content" on public.content_entries;
create policy "Admins can delete content"
  on public.content_entries for delete to authenticated
  using (exists (
    select 1 from public.admin_allowlist
    where email = lower((select auth.jwt() ->> 'email'))
  ));

create or replace function public.set_content_entries_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists content_entries_updated_at on public.content_entries;
create trigger content_entries_updated_at
before update on public.content_entries
for each row execute function public.set_content_entries_updated_at();
