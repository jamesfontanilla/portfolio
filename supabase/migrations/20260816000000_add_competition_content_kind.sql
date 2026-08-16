alter table public.content_entries
  drop constraint if exists content_entries_kind_check;

alter table public.content_entries
  add constraint content_entries_kind_check
  check (kind in ('settings', 'project', 'competition', 'certification', 'event', 'blog'));
