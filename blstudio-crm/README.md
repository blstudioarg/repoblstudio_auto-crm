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
| 1 | Laravel API base | ⏳ Pendiente |
| 2 | React + Auth + Cockpit | ⏳ Pendiente |
| 3-7 | Contenido, CRM, Clientes, Campañas, n8n | ⏳ Pendiente |

## Design tokens

Fondo `#0a0a0a` · acento `#a8ff3e` · texto blanco.
