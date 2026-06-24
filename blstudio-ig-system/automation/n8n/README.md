# Fase 4 — Workflow n8n de autopublicación

Publica un post estático (imagen + caption) en **@blstudioarg2026** usando la Instagram Content Publishing API (Meta Graph API). Trigger manual para el MVP; en Fase 7 se automatiza.

## Qué hace el workflow

```
Trigger manual
   ↓
Datos del post   (image_url + caption del post aprobado)
   ↓
Crear media container   (POST .../{ig_user_id}/media)
   ↓
Esperar procesamiento   (8 s)
   ↓
Publicar container   (POST .../{ig_user_id}/media_publish)
   ↓
Resultado (published)   (post_id + ig_media_id + status)
```

## Prerequisitos (Fase 0)

- Cuenta **Meta Business Manager** con @blstudioarg2026 conectada como Instagram Business Account.
- App creada en developers.facebook.com con permisos `instagram_basic`, `instagram_content_publish`, `pages_read_engagement`.
- **`INSTAGRAM_ACCESS_TOKEN`** (long-lived, ~60 días) y **`INSTAGRAM_ACCOUNT_ID`**.
- Cuenta de **n8n** (Cloud o self-hosted).

## Setup en n8n

1. **Importar:** n8n → *Workflows* → *Import from File* → elegí `workflow-publish-image.json`.
2. **Cargar variables de entorno** (Settings → Variables, o variables de entorno del server):
   - `INSTAGRAM_ACCESS_TOKEN`
   - `INSTAGRAM_ACCOUNT_ID`
3. **Verificar la versión de Graph API:** el workflow usa `v21.0`. Si tu app usa otra, editá las URLs de los dos nodos HTTP.

## Cómo testear

1. Subí la imagen del post a una **URL pública** (export de Canva, o un hosting). Meta exige `image_url` accesible públicamente — no sirve un archivo local.
2. Abrí el nodo **Datos del post** y completá:
   - `image_url` → la URL pública de la imagen
   - `caption` → el texto + hashtags
   - `post_id` → el id del post (ej. `2026-07-lun-sem1`)
3. Apretá **Execute workflow**.
4. Si todo sale bien, el último nodo devuelve `status: published` y el `ig_media_id`. Revisá el feed de @blstudioarg2026.

## Notas y límites

- **Solo imagen estática** (1 foto). Para carrusel o reel se arma un workflow aparte (carrusel = varios containers `is_carousel_item` + un container padre; reel = `media_type=REELS` con `video_url`).
- **Rate limit de Meta:** ~25 publicaciones por cuenta cada 24 hs. Irrelevante para 12 posts/mes.
- **Token:** el long-lived vence cada ~60 días. Agendá la renovación (recordatorio mensual o nodo de refresh).
- **Definition of done (Fase 4):** el workflow publica un post en IG sin intervención manual más allá de apretar *Execute* en n8n.

## Fase 7 — Integración con el CRM (BLStudio CRM / Laravel API)

Los 3 workflows de publicación (`workflow-publish-image.json`, `workflow-publish-carousel.json`, `workflow-publish-reel.json`) ahora terminan con un nodo **"Escribir status en CRM"** que llama al webhook de la Laravel API (`blstudio-crm/blstudio-crm-api`) para marcar el post como `published` en Supabase. Esto reemplaza la actualización manual — al publicar en IG, el calendario del panel se actualiza solo (vía Supabase Realtime, sin recargar).

### Variables de entorno requeridas en n8n

Configurar en *Settings → Variables* (n8n Cloud) o como env vars del proceso (self-hosted):

| Variable | Valor |
|---|---|
| `BLSTUDIO_API_URL` | URL de la Laravel API, ej. `https://api.tudominio.com` (sin slash final) |
| `BLSTUDIO_WEBHOOK_SECRET` | Debe ser **igual** al `SUPABASE_SECRET` (service_role key) configurado en el `.env` de `blstudio-crm-api` |

### Endpoints que usan estos workflows

```
POST {BLSTUDIO_API_URL}/api/webhooks/post-published
  Headers: X-Webhook-Secret: {BLSTUDIO_WEBHOOK_SECRET}
  Body:    { post_id, ig_post_id, published_at }
  Efecto:  posts.status = 'published' en Supabase

POST {BLSTUDIO_API_URL}/api/webhooks/campaign-metrics
  Headers: X-Webhook-Secret: {BLSTUDIO_WEBHOOK_SECRET}
  Body:    { campaign_id, spent, reach, impressions, clicks, dms, leads, cpl }
  Efecto:  actualiza la fila correspondiente en campaigns
```

Ambos endpoints viven fuera del middleware de JWT de usuario (no expira, apto para automatización desatendida) y validan el secreto con `hash_equals` contra `SUPABASE_SECRET`.

### Nuevo workflow: métricas de campaña

`workflow-update-campaign-metrics.json` — corre todos los días a las 07:00, trae `spend/reach/impressions/clicks/actions` de la **Meta Insights API** para una campaña, mapea `leads`/`dms`/`cpl` desde el array `actions`, y escribe el resultado en el CRM vía el webhook de arriba.

**Setup:**
1. Importar el workflow en n8n.
2. En el nodo **"Campaña a sincronizar"**: completar `campaign_id` (UUID de la tabla `campaigns` en Supabase) y `meta_campaign_id` (ID de la campaña en Meta Ads Manager).
3. Si hay más de una campaña activa, duplicar la rama desde ese nodo o reemplazarlo por una lectura de `GET /api/campaigns?status=active` (requiere JWT de usuario — usar una service account o token de larga duración).

### Autopilot semanal (`workflow-weekly-trigger.json`)

Decisiones de producto ya tomadas (2026-06-24): generación de contenido **con IA (Claude)**, **sin notificación** externa por ahora, **aprobación manual** desde el panel (ya implementada en Cockpit/Contenido). El workflow:

```
Domingos 20:00
   ↓
Leer último post          (GET Supabase REST: max dia_narrativo/semana/arc)
   ↓
Calcular próxima semana   (Code: rota arco cada 4 semanas, asigna Lun=Historia/Mié=Carrusel/Vie=Reel + pilar)
   ↓
Generar copy con Claude   (POST api.anthropic.com/v1/messages, voz de marca de master-copy-prompt.md)
   ↓
Armar posts completos     (Code: combina la respuesta de Claude con los campos estructurales)
   ↓
Insertar en Supabase      (POST Supabase REST → tabla posts, status='copy_ready')
```

Los 3 posts quedan en `copy_ready` y aparecen solos en Cockpit ("Esperando tu aprobación") y en el calendario de Contenido — se aprueban a mano, sin tocar n8n.

**Variables de entorno adicionales para este workflow:**

| Variable | Valor |
|---|---|
| `ANTHROPIC_API_KEY` | API key de Anthropic (console.anthropic.com) |
| `ANTHROPIC_MODEL` | Opcional. Default `claude-sonnet-4-6` — ajustar al modelo vigente |
| `SUPABASE_URL` | Mismo valor que en `blstudio-crm-api/.env` |
| `SUPABASE_SECRET` | Mismo valor (service_role key) — el insert bypassa RLS |

**Antes de dejarlo en automático:** correr el workflow una vez manual (*Execute workflow*) y revisar que el copy generado suene a la marca. Si no convence, ajustar el `systemPrompt` dentro del nodo "Calcular próxima semana" (Code) antes de confiar en el cron semanal.

**Prerequisito:** la tabla `posts` debe tener al menos una fila (el seed de la narrativa de julio 2026) para que "Leer último post" tenga de dónde continuar la numeración.
