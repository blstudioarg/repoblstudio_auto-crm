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

## Próximo (Fase 7)

Reemplazar el nodo *Datos del post* por una lectura automática de la queue/dashboard, agregar un trigger semanal (domingos 20:00) y escribir el `status: published` de vuelta a Supabase.
