-- Lead requests submitted from the public website.
-- Access is restricted to the service role used by Edge Functions.
-- RLS is enabled with no public policies, so the anon/auth keys cannot
-- read or write this table directly from the browser.

create extension if not exists "pgcrypto";

create table if not exists public.lead_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  location text,
  comment text,
  reason text,
  product text,
  status text not null default 'new',
  source_url text,
  user_agent text
);

create index if not exists lead_requests_created_at_idx
  on public.lead_requests (created_at desc);

create index if not exists lead_requests_status_idx
  on public.lead_requests (status);

alter table public.lead_requests
  add constraint lead_requests_status_check
  check (status in ('new', 'in_progress', 'done', 'spam'));

-- Lock the table down. Edge Functions use the service role key, which
-- bypasses RLS, so no explicit policies are required for them.
alter table public.lead_requests enable row level security;
