-- Table de persistance des jobs "Mail Delivery Clôture".
-- À exécuter dans Supabase (SQL editor) si vous activez la persistance.
create table if not exists public.delivery_jobs (
  id uuid primary key,
  company_id text,
  company_name text,
  fiscal_year_label text not null,
  period_start date not null,
  period_end date not null,
  recipient text not null,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'sent', 'error')),
  error text,
  zip_bytes bigint,
  download_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  sent_at timestamptz
);

create index if not exists delivery_jobs_created_at_idx
  on public.delivery_jobs (created_at desc);

create index if not exists delivery_jobs_company_id_idx
  on public.delivery_jobs (company_id);

-- Migration pour une table existante :
alter table public.delivery_jobs add column if not exists company_id text;
alter table public.delivery_jobs add column if not exists company_name text;

-- Accès réservé au service role (clé serveur). RLS activé, aucune policy publique.
alter table public.delivery_jobs enable row level security;
