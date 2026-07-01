-- Anonymous page view analytics from the public website.
-- Access is restricted to the service role used by Edge Functions.

create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  path text not null,
  referrer text,
  visitor_id uuid not null,
  user_agent text,
  country text,
  city text
);

create index if not exists page_views_created_at_idx
  on public.page_views (created_at desc);

create index if not exists page_views_path_idx
  on public.page_views (path);

create index if not exists page_views_visitor_id_idx
  on public.page_views (visitor_id);

alter table public.page_views enable row level security;
