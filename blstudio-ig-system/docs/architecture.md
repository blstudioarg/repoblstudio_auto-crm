# Arquitectura técnica del flujo

## Visión general

Sistema semi-automatizado de 3 etapas: **generación (Claude) → aprobación (Juan) → publicación (n8n + Meta Graph API)**. El artefacto que conecta todo es el JSON del post.

```
┌──────────────── PRODUCCIÓN (semanal) ────────────────┐
│  Claude genera copy → JSON en content/queue/         │
│       ↓                                              │
│  Claude rellena template Canva (via MCP)             │
│       ↓                                              │
│  [opcional] NanoBanana genera imagen IA              │
│       ↓                                              │
│  Export PNG/JPG → URL pública                        │
│       ↓                                              │
│  Juan revisa y aprueba (status: approved)            │
│       ↓                                              │
│  n8n publica en el horario del calendario            │
│       ↓                                              │
│  Meta Graph API → @blstudioarg2026 ✅             │
└──────────────────────────────────────────────────────┘
```

## El JSON del post (contrato entre etapas)

Cada post vive como un JSON con el schema definido en el PROJECT BRIEF (sección 7). Campos clave: `image_url` (URL pública para Meta), `caption`, `status` y `format`. n8n lee este JSON para publicar.

**Status lifecycle:** `draft` → `generated` → `approved` → `scheduled` → `published`.

## Publicación en Instagram (Meta Graph API)

Instagram Content Publishing API, flujo de 2 pasos por formato:

- **Imagen única:** `POST /{ig_user_id}/media` (image_url + caption) → `creation_id` → `POST /{ig_user_id}/media_publish` (creation_id).
- **Carrusel:** un container hijo por imagen (`is_carousel_item=true`) → container padre (`media_type=CAROUSEL`, `children=ids`) → publish.
- **Reel:** `POST /{ig_user_id}/media` (`media_type=REELS`, `video_url`) → esperar `status_code=FINISHED` → publish.

Detalle y troubleshooting en `meta-api-guide.md`. Workflows en `../automation/n8n/`.

## Requisitos que impone Meta

- `image_url` / `video_url` deben ser **URLs públicas** accesibles por los servidores de Meta.
- Cuenta de Instagram **Business** conectada a una Página de Facebook vía Meta Business Manager.
- Token **long-lived** (~60 días). Renovar antes de que venza.
- Rate limit: ~25 publicaciones por cuenta cada 24 hs.

## Roadmap de automatización

- **Hoy (Fase 4-5):** trigger manual en n8n, una corrida por batch semanal.
- **Fase 7:** Schedule Trigger (domingos 20:00) lee la queue, notifica a Juan, y publica en los horarios del calendario; escribe el `status` de vuelta a Supabase (dashboard/CRM).
