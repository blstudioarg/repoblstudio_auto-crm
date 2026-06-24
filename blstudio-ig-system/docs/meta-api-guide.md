# Guía Meta Business + Instagram Graph API

Pasos para dejar lista la publicación automática. Es la **Fase 0** del proyecto (manual, sin Claude).

## 1. Cuenta y conexión

1. Tener una **Página de Facebook** del negocio.
2. Convertir @blstudioarg2026 en **Instagram Business Account** y vincularla a esa Página.
3. Crear/usar un **Meta Business Manager** que administre ambas.

## 2. App de desarrollador

1. En developers.facebook.com → *Create App* → tipo *Business*.
2. Agregar el producto **Instagram Graph API**.
3. Permisos necesarios: `instagram_basic`, `instagram_content_publish`, `pages_show_list`, `pages_read_engagement`.
4. Mientras la app esté en modo desarrollo, agregar tu usuario como tester.

## 3. Tokens e IDs

Necesitás dos valores para n8n:

- **`INSTAGRAM_ACCESS_TOKEN`** — token long-lived (~60 días). Se obtiene intercambiando un token de usuario corto por uno largo (`GET /oauth/access_token?grant_type=fb_exchange_token&...`).
- **`INSTAGRAM_ACCOUNT_ID`** — el IG User ID (no el @handle). Se obtiene con `GET /{page-id}?fields=instagram_business_account`.

> ⚠️ El token vence cada ~60 días. Agendá un recordatorio mensual o automatizá el refresh. Es el riesgo operativo #1 del sistema.

## 4. Flujo de publicación (lo que hacen los workflows)

### Imagen única
```
POST /{ig_user_id}/media        image_url, caption, access_token   → creation_id
POST /{ig_user_id}/media_publish creation_id, access_token          → media_id
```

### Carrusel (2-10 imágenes)
```
POST /{ig_user_id}/media   image_url, is_carousel_item=true, access_token   (x cada imagen) → child_ids
POST /{ig_user_id}/media   media_type=CAROUSEL, children=<ids>, caption      → creation_id
POST /{ig_user_id}/media_publish creation_id                                  → media_id
```

### Reel
```
POST /{ig_user_id}/media   media_type=REELS, video_url, caption   → creation_id
GET  /{creation_id}?fields=status_code   (esperar FINISHED)
POST /{ig_user_id}/media_publish creation_id                       → media_id
```

## 5. Límites y errores comunes

- **URL pública obligatoria:** `image_url`/`video_url` deben ser accesibles por Meta. URLs locales o privadas fallan.
- **Rate limit:** ~25 publicaciones por cuenta cada 24 hs.
- **Reels tardan en procesar:** hay que esperar `status_code=FINISHED` antes de publicar (puede ser 1-5 min).
- **Error `(#10) permission`:** falta `instagram_content_publish` o la cuenta no es Business.
- **Token vencido:** error 190 → renovar el long-lived token.

## 6. Versión de la API

Los workflows usan `v21.0`. Si tu app usa otra versión, actualizá las URLs en los nodos HTTP de `../automation/n8n/`.
