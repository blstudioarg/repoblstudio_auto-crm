# BLStudio — Panel de gestión CRM
> Sistema web completo de gestión para BLStudio. Accesible desde cualquier dispositivo, colaborativo para dos usuarios, con autenticación por login. Cubre todo el ciclo: contenido → ventas → clientes → campañas.
> Stack: Laravel 12 API · React SPA · Supabase (Postgres + Auth + Realtime) · Vercel
> Dominio propio · Última actualización: junio 2026

---

## Executive summary

BLStudio necesita un panel centralizado para gestionar su operación completa desde un solo lugar: el calendario de 30 posts diarios con su pipeline de producción, el CRM de ventas hacia los primeros 10 clientes, los clientes activos con salud y renovaciones, las campañas de Meta Ads CBO, y el estado del stack tecnológico del sistema IG automatizado. Dos usuarios (socios) acceden con login desde cualquier dispositivo y ven los mismos datos en tiempo real gracias a Supabase Realtime.

**Este no es un MVP simple — es la herramienta que va a correr BLStudio día a día.**

---

## El problema que resuelve

| Problema actual | Solución |
|---|---|
| Dashboard de Cowork solo funciona en una PC (localStorage) | Supabase como fuente de verdad compartida |
| Estado de posts y CRM no sincroniza entre socios | Realtime: cambio visible al instante para ambos |
| n8n publica pero no actualiza ningún registro | n8n escribe a Supabase al autopublicar |
| No hay visibilidad del estado de clientes activos | Tab Clientes con health score y fechas de renovación |
| Campañas de Meta Ads gestionadas fuera del sistema | Tab Campañas integrado con KPIs |
| Sin login → sin acceso desde cualquier lado | Auth con Supabase, dominio propio |

---

## Goals y KPIs del sistema

| Métrica | Target |
|---|---|
| Usuarios concurrentes | 2 (socios) |
| Tiempo de carga inicial | < 2 segundos |
| Posts del calendario actualizados automáticamente por n8n | 100% |
| Uptime | > 99% (Vercel + Supabase) |
| Tiempo hasta v1 funcional | 2 semanas de desarrollo |

---

## Stack técnico

| Capa | Tecnología | Por qué |
|---|---|---|
| Frontend | React 18 + Vite + Tailwind v4 | Stack ya conocido (Doña Clara) |
| Backend API | Laravel 12 | Stack ya conocido (Tcocina) |
| Base de datos | Supabase Postgres | Ya usado, gratis en free tier |
| Auth | Supabase Auth (JWT) | Login sin código custom, JWT validado por Laravel |
| Realtime | Supabase Realtime | Sync entre socios sin websockets custom |
| Hosting frontend | Vercel | Deploy automático desde GitHub, dominio propio gratis |
| Hosting backend | Railway o Laravel Forge | Laravel API en producción |
| Dominio | Propio de BLStudio | HTTPS incluido |
| Automatización | n8n | Escribe a Supabase al autopublicar en IG |

---

## Arquitectura del sistema

```
┌─────────────────────────────────────────────────────┐
│                  USUARIO (browser)                   │
│            React SPA — dominio.com                   │
└──────────────────────┬──────────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
         ▼             ▼             ▼
  Laravel 12 API  Supabase Auth  Supabase Realtime
  (REST endpoints) (JWT tokens)  (websockets live)
         │             │
         └──────┬───────┘
                ▼
         Supabase Postgres
         (fuente de verdad)
                ▲
                │
              n8n
    (escribe al autopublicar)
```

**Flujo de auth:**
1. Usuario hace login en React → Supabase Auth retorna JWT
2. React incluye JWT en cada request al header `Authorization: Bearer {token}`
3. Laravel valida el JWT contra el secret de Supabase (middleware)
4. Si válido → procesa el request · Si no → 401

**Flujo de Realtime:**
- React suscribe a los canales de Supabase directamente (no pasa por Laravel)
- Cuando n8n o el otro socio cambia un registro → Supabase notifica → React actualiza el estado sin recargar

---

## Design system

```json
{
  "colors": {
    "background": "#0a0a0a",
    "accent": "#a8ff3e",
    "white": "#ffffff",
    "surface": "#111111",
    "border": "#1e1e1e",
    "muted": "#555555"
  },
  "typography": {
    "font": "Inter, system-ui, sans-serif",
    "heading": "font-black tracking-tight",
    "body": "font-normal text-sm"
  },
  "radius": "8px",
  "spacing": "base 4px"
}
```

---

## Schema de base de datos (Supabase Postgres)

### `users`
Manejada por Supabase Auth. No crear tabla custom — usar `auth.users`.

```sql
-- Extender con metadata de rol
-- Se guarda en user_metadata de Supabase Auth:
-- { "name": "Juan", "role": "admin" }
```

### `posts`
```sql
create table posts (
  id            uuid primary key default gen_random_uuid(),
  date          date not null,
  dia_narrativo integer not null,              -- 1 al 30
  semana        integer not null,              -- 1 al 4
  arc           text not null,                 -- problema|realidad|solucion|prueba
  topic         text not null,
  format        text not null,                 -- Historia|Carrusel|Reel
  pilar         integer,                       -- 1 al 5
  hook          text,
  caption       text,
  slide_texts   jsonb,                         -- ["slide1", "slide2", ...]
  hashtags      jsonb,
  visual_brief  text,
  canva_template_id text,
  image_url     text,
  video_url     text,
  status        text default 'draft',          -- draft|copy_ready|image_ready|approved|scheduled|published
  approved_by   uuid references auth.users,
  approved_at   timestamptz,
  published_at  timestamptz,
  ig_post_id    text,                          -- ID del post en Instagram
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
```

### `prospects`
```sql
create table prospects (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  city       text not null default 'Argentina',
  rubro      text,
  stage      text default 'scout',   -- scout|forge|reach|discovery|closed
  notes      text,
  ig_handle  text,
  phone      text,
  email      text,
  demo_url   text,
  last_contact date,
  assigned_to uuid references auth.users,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### `clients`
```sql
create table clients (
  id             uuid primary key default gen_random_uuid(),
  prospect_id    uuid references prospects,
  name           text not null,
  city           text,
  rubro          text,
  domain         text,
  setup_fee      numeric default 150,
  mrr            numeric default 35,
  currency       text default 'USD',
  start_date     date,
  renewal_date   date,
  health_score   integer default 100,       -- 0 a 100
  status         text default 'active',     -- active|paused|churned
  ig_handle      text,
  notes          text,
  last_contact   date,
  tech_stack     jsonb,                     -- { "laravel": true, "supabase": true, ... }
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);
```

### `campaigns`
```sql
create table campaigns (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  type           text default 'CBO',         -- CBO|ABO|Retargeting
  objective      text,                        -- conversions|reach|traffic
  budget_daily   numeric,
  budget_total   numeric,
  start_date     date,
  end_date       date,
  status         text default 'draft',        -- draft|active|paused|completed
  spent          numeric default 0,
  reach          integer default 0,
  impressions    integer default 0,
  clicks         integer default 0,
  dms            integer default 0,
  leads          integer default 0,
  cpl            numeric,
  meta_campaign_id text,
  notes          text,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);
```

### `next_actions`
```sql
create table next_actions (
  id          uuid primary key default gen_random_uuid(),
  text        text not null,
  tag         text default 'later',   -- urgent|soon|later
  done        boolean default false,
  assigned_to uuid references auth.users,
  due_date    date,
  done_at     timestamptz,
  created_by  uuid references auth.users,
  created_at  timestamptz default now()
);
```

### `system_status`
```sql
create table system_status (
  id          uuid primary key default gen_random_uuid(),
  tool        text not null,          -- canva_mcp|nanobanana|n8n|meta_api|higgsfield|remotion
  connected   boolean default false,
  plan        text,
  cost_month  numeric,
  expires_at  date,
  notes       text,
  updated_at  timestamptz default now()
);
```

---

## Políticas RLS (Row Level Security)

```sql
-- Todos los usuarios autenticados pueden leer y escribir todo
-- (solo 2 socios — no necesitamos granularidad por ahora)
alter table posts enable row level security;
alter table prospects enable row level security;
alter table clients enable row level security;
alter table campaigns enable row level security;
alter table next_actions enable row level security;
alter table system_status enable row level security;

create policy "authenticated_full_access" on posts
  for all using (auth.role() = 'authenticated');
-- Repetir para cada tabla
```

---

## API Routes — Laravel

### Auth middleware
```
api.php → Route::middleware('supabase.auth')->group(function () { ... })
```

Crear middleware `SupabaseAuth` que valida el JWT con la clave pública de Supabase.

### Endpoints

```
GET    /api/posts                    → listar posts (filtrar por mes, status, arc)
GET    /api/posts/{id}               → detalle de un post
PUT    /api/posts/{id}               → actualizar post (status, copy, urls)
PUT    /api/posts/{id}/approve       → aprobar post (guarda approved_by + timestamp)

GET    /api/prospects                → listar prospectos (filtrar por stage)
POST   /api/prospects                → crear prospecto
PUT    /api/prospects/{id}           → actualizar
DELETE /api/prospects/{id}           → eliminar

GET    /api/clients                  → listar clientes activos
POST   /api/clients                  → crear cliente (desde prospecto cerrado)
PUT    /api/clients/{id}             → actualizar health, notas, contacto
PUT    /api/clients/{id}/health      → actualizar health_score

GET    /api/campaigns                → listar campañas
POST   /api/campaigns                → crear campaña
PUT    /api/campaigns/{id}           → actualizar métricas y estado
PUT    /api/campaigns/{id}/metrics   → actualizar spent/reach/dms (desde n8n)

GET    /api/next-actions             → listar acciones pendientes
POST   /api/next-actions             → crear acción
PUT    /api/next-actions/{id}/done   → marcar como hecha

GET    /api/system-status            → estado de todas las herramientas
PUT    /api/system-status/{id}       → actualizar herramienta

GET    /api/dashboard                → stats agregados para el cockpit
                                       (MRR, posts publicados, pipeline count, etc.)
```

### Webhook para n8n
```
POST   /api/webhooks/post-published  → n8n llama esto al publicar en IG
                                       Body: { post_id, ig_post_id, published_at }
                                       Acción: actualiza posts.status = 'published'
```

---

## Estructura de archivos

### Backend (Laravel 12)
```
blstudio-crm-api/
├── .env.example
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── PostController.php
│   │   │   ├── ProspectController.php
│   │   │   ├── ClientController.php
│   │   │   ├── CampaignController.php
│   │   │   ├── NextActionController.php
│   │   │   ├── SystemStatusController.php
│   │   │   ├── DashboardController.php
│   │   │   └── WebhookController.php
│   │   └── Middleware/
│   │       └── SupabaseAuth.php
│   └── Models/
│       ├── Post.php
│       ├── Prospect.php
│       ├── Client.php
│       ├── Campaign.php
│       ├── NextAction.php
│       └── SystemStatus.php
├── routes/
│   └── api.php
└── database/
    └── migrations/          ← opcional si usás Supabase directamente
```

### Frontend (React + Vite)
```
blstudio-crm-web/
├── .env.example
├── index.html
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── lib/
│   │   ├── supabase.js          ← cliente Supabase (auth + realtime)
│   │   └── api.js               ← cliente para llamar a Laravel API
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── usePosts.js
│   │   ├── useProspects.js
│   │   ├── useClients.js
│   │   ├── useCampaigns.js
│   │   └── useRealtime.js       ← suscripción a canales de Supabase
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Cockpit.jsx          ← briefing diario
│   │   ├── Contenido.jsx        ← calendario + pipeline de producción
│   │   ├── CRM.jsx              ← kanban Scout→Cerrado
│   │   ├── Clientes.jsx         ← clientes activos
│   │   ├── Campanas.jsx         ← Meta Ads tracker
│   │   └── Sistema.jsx          ← estado del stack
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx
│   │   │   └── Header.jsx
│   │   ├── posts/
│   │   │   ├── PostCard.jsx
│   │   │   ├── PostStatusBadge.jsx
│   │   │   └── PostApproveModal.jsx
│   │   ├── crm/
│   │   │   ├── KanbanBoard.jsx
│   │   │   ├── ProspectCard.jsx
│   │   │   └── ProspectModal.jsx
│   │   ├── clients/
│   │   │   ├── ClientCard.jsx
│   │   │   └── HealthScore.jsx
│   │   ├── campaigns/
│   │   │   └── CampaignRow.jsx
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── Badge.jsx
│   │       ├── Modal.jsx
│   │       ├── ProgressBar.jsx
│   │       └── StatCard.jsx
│   └── styles/
│       └── globals.css
```

---

## Variables de entorno

### Backend `.env.example`
```env
APP_NAME="BLStudio CRM API"
APP_ENV=production
APP_KEY=
APP_URL=https://api.tudominio.com

DB_CONNECTION=pgsql
DB_HOST=db.xxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=

SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_KEY=          # anon key
SUPABASE_SECRET=       # service_role key
SUPABASE_JWT_SECRET=   # JWT secret (para validar tokens de Supabase Auth)

FRONTEND_URL=https://tudominio.com
```

### Frontend `.env.example`
```env
VITE_API_URL=https://api.tudominio.com
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=
```

---

## Fases de desarrollo

### Fase 0 — Infraestructura (1-2 días)
**Manual — no hace Claude:**
- [ ] Crear proyecto en Supabase → copiar credenciales
- [ ] Crear tablas con el schema SQL de este brief
- [ ] Activar RLS con las políticas definidas
- [ ] Crear dos usuarios en Supabase Auth (vos + socio)
- [ ] Crear repo en GitHub (o dos repos: api + web)
- [ ] Conectar repo frontend a Vercel → dominio propio
- [ ] Elegir hosting para Laravel API (Railway recomendado para arrancar)

**DoD:** Supabase corriendo con tablas, dos usuarios creados, dominio apuntando a Vercel.

---

### Fase 1 — Laravel API base (2-3 días)

**Prompt para Claude:**
```
Tengo un proyecto Laravel 12 nuevo. Necesito:

1. Middleware SupabaseAuth que valide el JWT de Supabase Auth
   - JWT secret: {SUPABASE_JWT_SECRET}
   - Usar firebase/php-jwt o lcobucci/jwt
   - Si el token es inválido → responder 401

2. Modelos Eloquent para estas tablas de Supabase Postgres:
   posts, prospects, clients, campaigns, next_actions, system_status
   (todas con UUID como primary key)

3. Resource Controllers para cada modelo con estos endpoints:
   [pegar la lista de endpoints de este brief]

4. Webhook POST /api/webhooks/post-published
   Body: { post_id, ig_post_id, published_at }
   Actualizar post status a 'published'

5. GET /api/dashboard → retornar:
   { mrr_actual, mrr_target: 350, clients_count, posts_published_month,
     pipeline_count, next_actions_pending }

Config de CORS para aceptar requests desde el dominio del frontend.
```

**DoD:** todos los endpoints responden correctamente con JWT válido, 401 sin token.

---

### Fase 2 — React SPA + Auth (2-3 días)

**Prompt para Claude:**
```
Tengo un proyecto React 18 + Vite + Tailwind v4.
Supabase configurado con: VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.

Design system: fondo #0a0a0a, acento #a8ff3e, texto blanco.

Necesito:

1. src/lib/supabase.js → cliente de Supabase
2. src/lib/api.js → axios o fetch configurado con base URL de Laravel y token JWT en headers
3. useAuth hook → maneja sesión de Supabase Auth, expone { user, signIn, signOut, loading }
4. Página Login.jsx → email + password, llama a supabase.auth.signInWithPassword
5. App.jsx con React Router:
   - /login → Login.jsx (público)
   - /* → Layout con Sidebar (protegido, redirige a /login si no hay sesión)
6. Sidebar.jsx con navegación: Cockpit / Contenido / CRM / Clientes / Campañas / Sistema
7. Header.jsx con nombre del usuario logueado + botón logout
```

**DoD:** login funciona, sesión persiste al recargar, sidebar navega entre páginas.

---

### Fase 3 — Cockpit (1-2 días)

**Prompt para Claude:**
```
Implementar la página Cockpit.jsx del panel BLStudio.

Consume GET /api/dashboard del backend.

Mostrar:
1. Banner de objetivo: X/10 clientes · MRR USD X/350 con barra de progreso
2. Post de hoy: el post del calendario con date = today()
   - Status actual con badge de color
   - Botón "Aprobar" si status = 'image_ready'
   - Botón "Ver post" si published
3. Próximos 3 días de contenido (mini cards)
4. Acciones pendientes (next_actions donde done = false, ordenadas por tag)
5. Alertas del sistema:
   - Si expires_at de Meta API < 15 días → alerta roja
   - Si hay posts sin imagen para mañana → alerta amarilla

Design: fondo negro, tarjetas oscuras, acento verde lima.
```

**DoD:** cockpit muestra datos reales del día, alertas funcionan.

---

### Fase 4 — Contenido (2-3 días)

**Prompt para Claude:**
```
Implementar Contenido.jsx — el pipeline de producción del calendario.

Datos: GET /api/posts?month=2026-07

Mostrar:
1. Header con 4 cards de arco narrativo y % completado por semana
2. Vista por semana (4 secciones)
3. Cada post como card con:
   - Día, fecha, tema, formato
   - Badge de status con colores:
     draft=gris / copy_ready=azul / image_ready=amarillo / approved=morado / published=verde
   - Click → modal de detalle/edición
4. Modal PostApproveModal con:
   - Copy del post (caption, slide_texts)
   - Preview de image_url si existe
   - Botones: Aprobar / Rechazar / Editar copy
   - Al aprobar → PUT /api/posts/{id}/approve
5. Realtime: suscribir al canal 'posts' de Supabase → actualizar sin recargar cuando n8n publica

Filtros rápidos: Todos / Pendientes / Aprobados / Publicados
```

**DoD:** calendario completo visible, aprobación funciona, realtime actualiza al publicar.

---

### Fase 5 — CRM (1-2 días)

**Prompt para Claude:**
```
Implementar CRM.jsx — kanban de prospectos.

Datos: GET /api/prospects

Mostrar:
1. 5 columnas: Scout / Forge / Reach / Discovery / Cerrado
2. Cards arrastrables entre columnas (drag & drop con @dnd-kit/core)
3. Al soltar en otra columna → PUT /api/prospects/{id} con nuevo stage
4. Click en card → modal de edición completo
5. Botón "Nuevo prospecto" con modal de creación
6. Badge de rubro con fondo negro y texto verde lima
7. Realtime: suscribir a canal 'prospects'

En Cerrado: link para "Convertir a cliente" → abre modal ClientModal
y crea registro en tabla clients
```

**DoD:** kanban funciona, drag & drop actualiza stage en DB, realtime sync.

---

### Fase 6 — Clientes, Campañas, Sistema (2 días)

**Prompt para Claude:**
```
Implementar las 3 páginas restantes del panel:

CLIENTES (Clientes.jsx):
- Grid de cards por cliente activo
- Cada card: nombre, ciudad, rubro, MRR, health score (0-100 con barra de color),
  fecha de renovación (alerta si < 30 días), último contacto
- Click → modal con historial y edición de notas
- Totales en header: MRR total, clientes activos, promedio health score

CAMPAÑAS (Campanas.jsx):
- Tabla de campañas Meta Ads con: nombre, tipo, presupuesto diario,
  gastado, alcance, DMs, CPL, status
- Botón "Nueva campaña CBO" con modal de creación
- Fila expandible con detalle de ad sets
- Edición inline de métricas (spent, dms, reach)

SISTEMA (Sistema.jsx):
- Grid de herramientas del stack:
  Canva MCP / NanoBanana / Higgsfield / Remotion / n8n / Meta Graph API / Supabase
- Cada herramienta: nombre, connected (verde/rojo), plan, costo/mes, vencimiento
- Alerta visual si expires_at < 15 días
- Botón "Editar" para actualizar estado manualmente
```

**DoD:** las tres páginas muestran y editan datos correctamente.

---

### Fase 7 — n8n integration (1 día)

**Prompt para Claude:**
```
Necesito integrar n8n con el sistema:

1. Configurar el nodo HTTP Request de n8n para que al publicar en Instagram
   llame a POST https://api.tudominio.com/api/webhooks/post-published
   con headers: { Authorization: Bearer {SERVICE_ROLE_KEY} }
   y body: { post_id: "...", ig_post_id: "...", published_at: "..." }

2. Nodo adicional en n8n para actualizar métricas de campaña:
   PUT /api/campaigns/{id}/metrics con { spent, reach, impressions }
   (correr diariamente con datos de Meta Insights API)

3. Verificar que el webhook de Laravel actualiza correctamente el status del post
   y que Supabase Realtime propaga el cambio al frontend
```

**DoD:** publicación en IG actualiza automáticamente el calendario en el panel.

---

## Realtime — canales de Supabase

```javascript
// En useRealtime.js
import { supabase } from './supabase'

export function usePosts(onUpdate) {
  supabase
    .channel('posts-changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'posts' },
      onUpdate
    )
    .subscribe()
}

export function useProspects(onUpdate) {
  supabase
    .channel('prospects-changes')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'prospects' },
      onUpdate
    )
    .subscribe()
}
```

---

## Seeding inicial de datos

Al arrancar el sistema, poblar con:

**posts:** los 30 posts de julio 2026 del hilo narrativo (del MD `BLStudio — Narrativa IG julio 2026.md`)

**prospects:** los 4 actuales (Tcocina→closed, Doña Clara→closed, Parrilla Vieja→discovery, La Ventera→forge)

**clients:** Tcocina y Doña Clara como clientes activos con MRR USD 35 cada uno

**system_status:** las 7 herramientas con su estado actual

**Prompt para Claude (seeding):**
```
Tengo la base de datos de Supabase lista con las tablas del brief.
Necesito un script de seed en Laravel (database/seeders/) para poblar:
- 30 posts con los datos del hilo narrativo de julio 2026
- 4 prospectos iniciales
- 2 clientes activos
- Estado inicial de 7 herramientas del stack

[Pegar datos del MD de narrativa]
```

---

## Guía de sesión con Claude

**Al arrancar cada fase, pegar este contexto:**
```
Proyecto: BLStudio CRM — panel de gestión web
Brief completo: boveda_obsidean/BLStudio — Panel de gestión CRM.md
Stack: Laravel 12 API + React 18 + Vite + Tailwind v4 + Supabase
Design: fondo #0a0a0a, acento #a8ff3e, texto blanco

Estado actual:
- Fase [X] completada ✅
- Trabajando en: Fase [Y]
- URLs: API en [url] / Frontend en [url]
- Supabase project: [project_id]
```

---

## Roadmap visual

```
Semana 1
  Día 1-2: Fase 0 — Infraestructura (manual)
  Día 3-5: Fase 1 — Laravel API

Semana 2
  Día 6-8: Fase 2 — React + Auth + Fase 3 — Cockpit
  Día 9-11: Fase 4 — Contenido + Fase 5 — CRM

Semana 3
  Día 12-13: Fase 6 — Clientes + Campañas + Sistema
  Día 14: Fase 7 — n8n integration + testing final
```

---

## Riesgo y mitigación

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| JWT validation en Laravel compleja | Media | Usar lcobucci/jwt — bien documentado con Supabase |
| CORS entre frontend y API | Alta | Configurar `config/cors.php` desde el día 1 |
| Supabase Realtime no propaga cambios de Laravel | Media | Laravel escribe via Eloquent a Postgres → Realtime detecta igual |
| Drag & drop en kanban | Media | @dnd-kit es el estándar actual, bien mantenido |
| Railway corta el plan free | Baja | Mover a Forge o VPS en caso necesario |

---

## Ideas de mejora (backlog post-v1)

> Estas ideas vienen de un carrusel de referencia (@ramiro.cubria — "tablero de contenido para creadores" con Claude Code). **NO entran en v1** y **no modifican el stack**: el panel sigue siendo Laravel 12 API + React 18/Vite/Tailwind v4 + Supabase. Los prompts del carrusel que mencionan Next.js/shadcn se adaptan a React/Vite. Son mejoras para el tab **Contenido** (motor de contenido de la propia marca BLStudio), a evaluar una vez que v1 esté funcionando.

### Cherry-picks de bajo costo (candidatos a v1.1)

| Idea | Qué aporta | Dónde encaja | Costo |
|---|---|---|---|
| **Baúl de Ganchos** | Biblioteca de ganchos reusables: cada gancho guardado queda como plantilla, buscable por nicho, tipo de gancho y vistas. Botón "usar este" precarga `posts.hook`. | Nueva tabla `hooks` (`text`, `tipo`, `nicho`, `fuente`, `vistas`, `plantilla`). Sub-vista en tab Contenido. | Bajo |
| **Métricas de posts** | Vistas IG, guardados, seguidores nuevos, DMs con minigráfico a 7/30/90 días. Marca "bombazo" al reel que duplica la mediana de 30 días; top 5 con el porqué. | Extender `posts` (o tabla `post_metrics`) con `views/saves/followers/dms`. Cards en Cockpit o sub-tab en Contenido. | Bajo-medio |
| **Calendario con detalle lateral** | Click en un casillero del calendario → panel lateral con el guión completo (fecha, hora, plataforma, gancho, copy). | Mejora de UX sobre `Contenido.jsx` + `PostApproveModal.jsx` ya planeados. Casi cubierto por el brief. | Muy bajo |

### Backlog pesado (requiere automatización/scraping — post-v1)

| Idea | Qué aporta | Dónde encaja | Costo |
|---|---|---|---|
| **Rastreador de Competencia** | Domingos AM levanta los 5 reels más vistos de N cuentas; transcribe audio y extrae gancho + texto en pantalla. Botón "guardar al Baúl". | Workflow n8n + transcripción. Tabla `competitor_reels`. Depende del Baúl de Ganchos. | Alto |
| **Community Manager multiplataforma** | Un clic publica el reel en IG + TikTok + YT Shorts con descripción autogenerada (gancho + ángulo + CTA). | Extender la publicación n8n (hoy el brief solo cubre IG). **Scope creep — diferir.** | Alto |
| **Tendencias** | Revisa ~12 fuentes IA/día (blogs Anthropic/OpenAI, listas de X, nicho), etiqueta cada item (potencial de gancho / explicativo / ignorar) y manda resumen por Slack 7 AM. | Agente/automatización independiente del CRM. Tabla `trends`. | Alto |

---

## Conexiones (bóveda)

[[BLStudio — Plan estratégico gastronomía]] · [[BLStudio — PROJECT BRIEF]] · [[BLStudio — Plan de desarrollo sistema IG automatizado]] · [[BLStudio — Narrativa IG julio 2026]]
