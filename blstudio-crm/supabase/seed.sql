-- ============================================================
-- BLStudio CRM — Seed inicial
-- Correr DESPUÉS de schema.sql (Supabase → SQL Editor → Run)
-- Carga datos conocidos: prospectos, clientes y estado del stack.
-- (El seed de los 30 posts de julio se genera aparte desde la
--  narrativa: "BLStudio — Narrativa IG julio 2026.md")
-- ============================================================

-- ---------- PROSPECTS ----------
insert into prospects (name, city, rubro, stage, ig_handle, notes) values
  ('Tcocina',        'Argentina', 'Gastronomía', 'closed',    null, 'Cliente cerrado. Migrado a clients.'),
  ('Doña Clara',     'Argentina', 'Gastronomía', 'closed',    null, 'Cliente cerrado. Migrado a clients.'),
  ('Parrilla Vieja', 'Argentina', 'Gastronomía', 'discovery', null, 'En etapa de discovery.'),
  ('La Ventera',     'Argentina', 'Gastronomía', 'forge',     null, 'En etapa de forge (preparación de demo).');

-- ---------- CLIENTS ----------
-- Vinculados a sus prospectos cerrados
insert into clients (prospect_id, name, city, rubro, mrr, setup_fee, currency, status, health_score)
select id, 'Tcocina', 'Argentina', 'Gastronomía', 35, 150, 'USD', 'active', 100
from prospects where name = 'Tcocina' limit 1;

insert into clients (prospect_id, name, city, rubro, mrr, setup_fee, currency, status, health_score)
select id, 'Doña Clara', 'Argentina', 'Gastronomía', 35, 150, 'USD', 'active', 100
from prospects where name = 'Doña Clara' limit 1;

-- ---------- SYSTEM STATUS (7 herramientas del stack) ----------
insert into system_status (tool, connected, plan, notes) values
  ('canva_mcp',   false, null, 'Reemplazado por HTML (Carrusel Studio).'),
  ('nanobanana',  true,  null, 'Generación de imágenes IA. Integrada y probada.'),
  ('n8n',         false, null, 'Workflows de publicación listos. Requiere instancia + tokens.'),
  ('meta_api',    false, null, 'Meta Graph API. Requiere cuenta business + tokens.'),
  ('higgsfield',  false, null, 'Video IA. Disponible, sin integrar.'),
  ('remotion',    false, null, 'Render programático de video. Sin integrar.'),
  ('supabase',    false, null, 'CRM backend. Pendiente de crear proyecto.');

-- Fin del seed.
