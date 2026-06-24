# BLStudio CRM

Panel de gestión web de BLStudio. Centraliza todo el ciclo: **contenido → ventas → clientes → campañas**, accesible desde cualquier dispositivo, colaborativo para dos socios, con login.

Brief completo: `../blstudio_plan/BLStudio — Panel de gestión CRM.md`

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite + Tailwind v4 (`blstudio-crm-web/`) |
| Backend | Laravel 12 API (`blstudio-crm-api/`) |
| DB + Auth + Realtime | Supabase Postgres |
| Hosting | Vercel (web) · Railway (api) |

## Estructura del repo

```
blstudio-crm/
├── supabase/
│   ├── schema.sql   ← tablas + RLS + índices + triggers + realtime
│   └── seed.sql     ← prospectos, clientes y estado del stack
├── blstudio-crm-api/   (Laravel — Fase 1, pendiente)
└── blstudio-crm-web/   (React — Fase 2, pendiente)
```

## Fase 0 — Infraestructura (manual)

1. Crear proyecto en [Supabase](https://supabase.com) → copiar `URL`, `anon key`, `service_role key`, `JWT secret`.
2. **SQL Editor → Run** → pegar `supabase/schema.sql` (crea las 6 tablas con RLS y realtime).
3. **SQL Editor → Run** → pegar `supabase/seed.sql` (datos iniciales conocidos).
4. **Authentication → Users** → crear los 2 usuarios socios. En *User metadata*: `{ "name": "Juan", "role": "admin" }`.
5. Crear repos en GitHub y conectar el frontend a Vercel.

**DoD:** Supabase corriendo con las 6 tablas pobladas, 2 usuarios creados, realtime activo.

## Estado de fases

| Fase | Qué | Estado |
|---|---|---|
| 0 | Infraestructura Supabase | ◐ `schema.sql` + `seed.sql` listos para correr |
| 1 | Laravel API base | ✅ Scaffoldeada — 23 endpoints, JWT middleware, modelos, CORS |
| 2-6 | React + Auth + Cockpit + Contenido + CRM + Clientes/Campañas/Sistema | ✅ Implementadas (modo demo + Supabase live) |
| 7 | n8n integration | ✅ Webhooks (`post-published`, `campaign-metrics`) + 5 workflows. Autopilot semanal genera contenido con Claude y lo deja en `copy_ready` para aprobación manual |

### Fase 1 — Laravel API (`blstudio-crm-api/`)

Implementado: middleware `SupabaseAuth` (valida JWT HS256 con `SUPABASE_JWT_SECRET`), 6 modelos Eloquent (UUID, espejo del schema), controllers + 23 rutas en `routes/api.php`, webhook `post-published` (auth por `X-Webhook-Secret` = service_role), CORS restringido a `FRONTEND_URL`.

**Prerequisitos para correr contra Supabase:**
1. Habilitar las extensiones PHP `pdo_pgsql` y `pgsql` en `php.ini` (hoy faltan).
2. Copiar `.env.example` → `.env` y completar credenciales Supabase (`DB_*`, `SUPABASE_*`).
3. `php artisan serve` → API en `http://127.0.0.1:8000`.

Verificado sin DB: rutas registran (`php artisan route:list`), `GET /api/dashboard` sin token → **401**, token inválido → **401**, token válido pasa el middleware (falla recién en la conexión Postgres), webhook sin secret → **401**.

### Fases 2-6 — React SPA (`blstudio-crm-web/`)

Ya implementadas (no estaban reflejadas en este README): Login, Cockpit, Contenido (calendario por semana + arco narrativo), CRM (kanban Scout→Cerrado), Clientes (health score, MRR/ARR), Campañas (Meta Ads), **Sistema** (stack tools — completada en esta sesión, faltaba el archivo y rompía el import en `App.jsx`/`Layout.jsx`).

**Arquitectura real:** el frontend habla con Supabase directamente vía `@supabase/supabase-js` (`src/lib/data.jsx`, `src/lib/supabase.js`) para CRUD + Realtime — no pasa por la Laravel API para datos. La Laravel API queda para el webhook de n8n (`/api/webhooks/post-published`) y como capa adicional si se decide centralizar lógica de negocio más adelante.

**Modo demo:** sin `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` en `.env`, la app corre con datos de `src/data/demo.js` (espejo del `seed.sql`) — se puede ver el panel funcionando sin tener Supabase configurado.

Verificado: `npm install` + `npm run dev` levanta Vite en <1s, `index.html` y todos los módulos (`App.jsx`, `Sistema.jsx`) transforman sin errores.

```bash
cd blstudio-crm-web
npm install
npm run dev   # http://localhost:5173 — modo demo si no hay .env
```

### Fase 7 — n8n (`blstudio-ig-system/automation/n8n/`)

Agregado en esta sesión: endpoint `POST /api/webhooks/campaign-metrics` (mismo patrón de auth que `post-published`, vía `X-Webhook-Secret` comparado con `SUPABASE_SECRET`). Los 3 workflows de publicación (imagen/carrusel/reel) ahora terminan escribiendo el `status: published` de vuelta al CRM, y hay un workflow nuevo (`workflow-update-campaign-metrics.json`) que sincroniza métricas de Meta Insights API diariamente.

**Autopilot semanal** (`workflow-weekly-trigger.json`, reescrito por completo): domingos 20:00 lee el último post de Supabase, calcula la semana siguiente (arco/pilar rotando cada 4 semanas según `docs/content-strategy.md`), genera el copy de 3 posts con la API de Claude usando la voz de marca de `content/prompts/master-copy-prompt.md`, y los inserta en Supabase como `copy_ready`. Decisiones de producto del usuario: generación con IA sí, notificación externa no (por ahora), aprobación manual desde el panel. Lógica de fechas/rotación y de merge con la respuesta de Claude verificada con `node` ejecutando los Code nodes con datos simulados.

Detalle completo en `blstudio-ig-system/automation/n8n/README.md`.

## Design tokens

Fondo `#0a0a0a` · acento `#a8ff3e` · texto blanco.

## Backlog post-v1

Ideas de mejora opcionales (Baúl de Ganchos, Métricas de posts, Calendario con detalle lateral, Rastreador de Competencia, CM multiplataforma, Tendencias) están documentadas como backlog en el brief → sección *"Ideas de mejora (backlog post-v1)"*. No entran en v1 ni cambian el stack.
