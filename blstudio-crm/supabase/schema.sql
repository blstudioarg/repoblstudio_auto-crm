-- ============================================================
-- BLStudio CRM — Schema de base de datos (Supabase Postgres)
-- Pegar completo en: Supabase Dashboard → SQL Editor → Run
-- Fase 0 del brief "BLStudio — Panel de gestión CRM"
-- ============================================================

-- Extensiones (gen_random_uuid ya viene con pgcrypto en Supabase)
create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- Helper: trigger para mantener updated_at automáticamente
-- ------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================================
-- TABLA: posts  (calendario de contenido IG)
-- ============================================================
create table if not exists posts (
  id                uuid primary key default gen_random_uuid(),
  date              date not null,
  dia_narrativo     integer not null,              -- 1 al 30
  semana            integer not null,              -- 1 al 4
  arc               text not null,                 -- problema|realidad|solucion|prueba
  topic             text not null,
  format            text not null,                 -- Historia|Carrusel|Reel
  pilar             integer,                       -- 1 al 5
  hook              text,
  caption           text,
  slide_texts       jsonb,                         -- ["slide1", "slide2", ...]
  hashtags          jsonb,
  visual_brief      text,
  canva_template_id text,
  image_url         text,
  video_url         text,
  status            text not null default 'draft', -- draft|copy_ready|image_ready|approved|scheduled|published
  approved_by       uuid references auth.users,
  approved_at       timestamptz,
  published_at      timestamptz,
  ig_post_id        text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists posts_date_idx   on posts (date);
create index if not exists posts_status_idx on posts (status);

create trigger posts_set_updated_at
  before update on posts
  for each row execute function set_updated_at();

-- ============================================================
-- TABLA: prospects  (pipeline CRM Scout → Cerrado)
-- ============================================================
create table if not exists prospects (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  city        text not null default 'Argentina',
  rubro       text,
  stage       text not null default 'scout',   -- scout|forge|reach|discovery|closed
  notes       text,
  ig_handle   text,
  phone       text,
  email       text,
  demo_url    text,
  last_contact date,
  assigned_to uuid references auth.users,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists prospects_stage_idx on prospects (stage);

create trigger prospects_set_updated_at
  before update on prospects
  for each row execute function set_updated_at();

-- ============================================================
-- TABLA: clients  (clientes activos con salud y renovación)
-- ============================================================
create table if not exists clients (
  id           uuid primary key default gen_random_uuid(),
  prospect_id  uuid references prospects,
  name         text not null,
  city         text,
  rubro        text,
  domain       text,
  setup_fee    numeric default 150,
  mrr          numeric default 35,
  currency     text default 'USD',
  start_date   date,
  renewal_date date,
  health_score integer default 100,        -- 0 a 100
  status       text not null default 'active', -- active|paused|churned
  ig_handle    text,
  notes        text,
  last_contact date,
  tech_stack   jsonb,                       -- { "laravel": true, "supabase": true }
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists clients_status_idx on clients (status);

create trigger clients_set_updated_at
  before update on clients
  for each row execute function set_updated_at();

-- ============================================================
-- TABLA: campaigns  (Meta Ads CBO tracker)
-- ============================================================
create table if not exists campaigns (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  type             text default 'CBO',      -- CBO|ABO|Retargeting
  objective        text,                    -- conversions|reach|traffic
  budget_daily     numeric,
  budget_total     numeric,
  start_date       date,
  end_date         date,
  status           text not null default 'draft', -- draft|active|paused|completed
  spent            numeric default 0,
  reach            integer default 0,
  impressions      integer default 0,
  clicks           integer default 0,
  dms              integer default 0,
  leads            integer default 0,
  cpl              numeric,
  meta_campaign_id text,
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists campaigns_status_idx on campaigns (status);

create trigger campaigns_set_updated_at
  before update on campaigns
  for each row execute function set_updated_at();

-- ============================================================
-- TABLA: next_actions  (cockpit / to-dos compartidos)
-- ============================================================
create table if not exists next_actions (
  id          uuid primary key default gen_random_uuid(),
  text        text not null,
  tag         text not null default 'later',  -- urgent|soon|later
  done        boolean not null default false,
  assigned_to uuid references auth.users,
  due_date    date,
  done_at     timestamptz,
  created_by  uuid references auth.users,
  created_at  timestamptz not null default now()
);

create index if not exists next_actions_done_idx on next_actions (done);

-- ============================================================
-- TABLA: system_status  (estado del stack tecnológico)
-- ============================================================
create table if not exists system_status (
  id         uuid primary key default gen_random_uuid(),
  tool       text not null,   -- canva_mcp|nanobanana|n8n|meta_api|higgsfield|remotion
  connected  boolean not null default false,
  plan       text,
  cost_month numeric,
  expires_at date,
  notes      text,
  updated_at timestamptz not null default now()
);

create trigger system_status_set_updated_at
  before update on system_status
  for each row execute function set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- Solo 2 socios → acceso total para cualquier usuario autenticado
-- ============================================================
alter table posts         enable row level security;
alter table prospects     enable row level security;
alter table clients       enable row level security;
alter table campaigns     enable row level security;
alter table next_actions  enable row level security;
alter table system_status enable row level security;

create policy "authenticated_full_access" on posts
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated_full_access" on prospects
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated_full_access" on clients
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated_full_access" on campaigns
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated_full_access" on next_actions
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated_full_access" on system_status
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================================
-- REALTIME: agregar tablas a la publicación de Supabase
-- ============================================================
alter publication supabase_realtime add table posts;
alter publication supabase_realtime add table prospects;
alter publication supabase_realtime add table clients;
alter publication supabase_realtime add table campaigns;
alter publication supabase_realtime add table next_actions;
alter publication supabase_realtime add table system_status;

-- Fin del schema.
