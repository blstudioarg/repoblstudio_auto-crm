# BLStudio — Plan de desarrollo: sistema IG automatizado
> Plan técnico completo para ejecutar con Claude. No hacer nada todavía — este documento es la hoja de ruta. Ejecutar fase por fase, en orden.
> Última actualización: junio 2026.

---

## Qué vamos a construir

Un sistema que tome la [[BLStudio — Plan estratégico gastronomía|estrategia de contenido]] y la convierta en publicaciones reales en @blstudioarg2026 de forma semi-automatizada:

```
Claude (copy + brief visual)
        ↓
Canva MCP (genera el creativo desde template de BLStudio)
        ↓
n8n (orquesta el flujo completo)
        ↓
Meta Graph API → autopublica en @blstudioarg2026
```

**Semi-automatizado** significa: Claude genera, Juan revisa y aprueba, n8n publica. No es un bot ciego — es un sistema que elimina el 80% del trabajo manual y deja solo la decisión humana final.

---

## Prerequisitos (antes de arrancar cualquier fase)

### 1. Cuenta de Meta Business Manager
**Qué hacer:**
1. Ir a business.facebook.com y crear la cuenta de Business Manager
2. Conectar la cuenta de Instagram @blstudioarg2026 como "Instagram Business Account"
3. Crear una App en developers.facebook.com
4. Obtener el **Instagram Graph API Access Token** (long-lived token)
5. Obtener el **Instagram Business Account ID**

**Guardar en un lugar seguro:**
- `INSTAGRAM_ACCESS_TOKEN=...`
- `INSTAGRAM_ACCOUNT_ID=...`

**Por qué es paso 1:** sin esto, nada autopublica. Es el único paso que no puede hacer Claude solo.

### 2. Cuenta de Canva Pro
- Necesaria para acceder a la API de Canva y el MCP
- Crear los templates de BLStudio una sola vez (Claude los usa después)
- **Conectar el MCP de Canva en Cowork** (aparece en el registro como "Canva — Search, create, autofill, and export Canva designs")

### 3. n8n instalado
- Opción A (recomendada para empezar): **n8n Cloud** (plan free o starter) en n8n.io
- Opción B: self-hosted en un VPS (más control, más técnico)
- Crear cuenta y tener el acceso listo

---

## Fase 1 — Templates de Canva con identidad BLStudio

**Objetivo:** tener un template por formato de contenido, listo para que Claude lo rellene con el copy de cada post.

**Cuándo arrancar esta fase:** cuando tengás Canva Pro y el MCP conectado en Cowork.

**Prompt para Claude:**
```
Tengo el MCP de Canva conectado. Necesito crear los siguientes templates 
para @blstudioarg2026 con esta identidad visual:
- Fondo negro (#0a0a0a)
- Acento verde lima (#a8ff3e)
- Tipografía bold blanca
- Formato Historia (1080x1920px)
- Formato Carrusel (1080x1080px, hasta 5 slides)
- Formato Reel thumbnail (1080x1920px)

Un template por pilar:
- P1 SEO/Google
- P2 Organización
- P3 Fidelización  
- P4 Errores comunes
- P5 Casos reales

Crear los templates en Canva y darme los IDs de cada uno.
```

**Output esperado de esta fase:**
- 5 templates en Canva con los IDs guardados
- Un archivo `canva-templates.json` con los IDs mapeados a cada pilar

---

## Fase 2 — Generación de copy con Claude

**Objetivo:** Claude genera el copy completo de cada post: caption, texto de la imagen, hashtags, y un brief para la imagen.

**Cuándo arrancar:** después de tener los templates de Canva listos.

**El prompt maestro de generación de copy:**
```
Contexto: Soy BLStudio (@blstudioarg2026). Hacemos sistemas digitales 
completos (landing + catálogo + gestión + SEO) para gastronomía argentina. 
Pricing: USD 150 setup + USD 35/mes.

Clientes actuales: Tcocina (150 burgers domingo), Doña Clara (cerrado $2M ARS), 
Parrilla Vieja Estación (en curso). SEO: #1 en búsquedas locales.

Tono: aliado directo, sin chamuyo técnico, argentino, de igual a igual.
Nunca "diseño web", siempre "sistema" o "solución". Nunca "stack", siempre "pedidos/clientes/plata".

Generar el copy para el post del [FECHA]:
- Pilar: [P1/P2/P3/P4/P5]
- Tema: [TEMA]
- Formato: [Historia/Carrusel/Reel]

Output en JSON:
{
  "caption": "...(texto del pie del post, hasta 2200 chars, con CTA al final)",
  "slide_texts": ["texto slide 1", "texto slide 2", ...],
  "hashtags": ["#...", "..."],
  "visual_brief": "descripción de qué mostrar en la imagen para la IA generativa",
  "canva_template_id": "..."
}
```

**Hacer esto post por post, o en batch para toda la semana.**

---

## Fase 3 — Relleno automático de Canva via MCP

**Objetivo:** con el copy generado, Claude rellena el template de Canva con el texto y exporta la imagen final.

**Cuándo arrancar:** cuando tengás el copy del post listo (Fase 2) y los templates (Fase 1).

**Prompt para Claude:**
```
Tengo este JSON de copy para el post de [FECHA]:
[pegar el JSON de la Fase 2]

Usando el MCP de Canva:
1. Abrir el template con ID [canva_template_id]
2. Rellenar los campos de texto con los slide_texts
3. Exportar como PNG (1080x1080 o 1080x1920 según el formato)
4. Darme la URL de descarga del archivo exportado
```

**Output esperado:** URL del archivo PNG/JPG listo para publicar o subir a n8n.

---

## Fase 4 — Generación de imagen IA para el visual (opcional pero poderoso)

**Objetivo:** en vez de solo texto sobre fondo negro, generar una imagen IA real para el hero del post. Higgsfield ya está conectado en Cowork.

**Cuándo usar:** para los posts de Casos Reales (Pilar 5) y Reels, donde una imagen impacta más que solo texto.

**Prompt para Claude:**
```
Usando Higgsfield (herramienta generate_image disponible en esta sesión):

Generar una imagen para el post de [TEMA].
Brief visual: [visual_brief del JSON de Fase 2]

Estilo: fotografía gastronómica argentina, luz dramática, colores cálidos, 
alta calidad, realista. NO diseño gráfico genérico.

Usar la imagen generada como hero del template de Canva.
```

---

## Fase 5 — Flujo n8n: de archivo a Instagram

**Objetivo:** n8n toma la imagen exportada de Canva (o generada por IA) y la publica en Instagram via Meta Graph API.

**Cuándo arrancar:** cuando tengás n8n funcionando y los tokens de Meta Business.

### El workflow de n8n (paso a paso)

**Trigger:** manual (Juan lo corre cuando aprueba el post) o programado (hora de publicación del calendario).

**Nodos del workflow:**

```
[Trigger: Schedule / Manual]
        ↓
[HTTP Request: descargar imagen de Canva URL]
        ↓
[HTTP Request: POST a Meta Graph API — subir imagen]
        url: https://graph.facebook.com/v18.0/{INSTAGRAM_ACCOUNT_ID}/media
        body: {
          image_url: "...",
          caption: "...",
          access_token: "..."
        }
        → responde: { "id": "creation_id" }
        ↓
[Wait: 30 segundos (procesamiento de Meta)]
        ↓
[HTTP Request: POST a Meta Graph API — publicar]
        url: https://graph.facebook.com/v18.0/{INSTAGRAM_ACCOUNT_ID}/media_publish
        body: {
          creation_id: "...",
          access_token: "..."
        }
        ↓
[Notificación: WhatsApp o email confirmando que se publicó]
```

**Prompt para Claude (cuando llegue el momento):**
```
Necesito armar este workflow en n8n. Tengo:
- n8n Cloud corriendo en [URL]
- INSTAGRAM_ACCESS_TOKEN: [token]
- INSTAGRAM_ACCOUNT_ID: [id]
- Imagen ya exportada en: [URL de Canva]
- Caption: [texto]

Crear el workflow completo en n8n para:
1. Subir la imagen a Meta Graph API como "media container"
2. Esperar 30 segundos
3. Publicar el container
4. Notificarme que se publicó

Darme el JSON del workflow para importar en n8n.
```

---

## Fase 6 — Workflow de Reels con IA (nivel avanzado)

**Objetivo:** para los Reels, generar un video corto con un avatar IA (tipo UGC) usando HeyGen o Higgsfield, en lugar de solo imagen estática.

**Cuándo arrancar:** cuando los posts estáticos ya estén funcionando solos (Fases 1-5).

**Stack para Reels:**
- **HeyGen** (externo, plan pago): avatar IA que habla a cámara en español argentino
- **Higgsfield** (ya conectado en Cowork): video generativo con personajes y movimiento

**El flujo para un Reel:**
```
Claude genera el script del Reel (30-60 seg)
        ↓
HeyGen o Higgsfield genera el video con avatar IA
        ↓
Canva MCP agrega el branding (logo, colores, subtítulos)
        ↓
n8n sube el video a Meta Graph API (mismo flujo pero con video_url)
        ↓
Autopublica como Reel en @blstudioarg2026
```

**Prompt para Claude (Reel con Higgsfield):**
```
Usando Higgsfield (herramienta generate_video disponible en esta sesión):

Generar un Reel de 30 segundos para @blstudioarg2026.
Tema: [TEMA]
Script: [SCRIPT generado]

Personaje: dueño de hamburguesería, 30-40 años, argentino, ambiente de local gastronómico.
Estilo: UGC natural, como si lo grabara él mismo, no producción corporativa.
Audio: español rioplatense.
```

---

## Fase 7 — Sistema de aprobación (el loop completo)

**Objetivo:** el flujo completo con revisión humana antes de publicar.

**El loop ideal:**

```
[Domingo a la noche]
Claude genera el copy de los 3 posts de la semana siguiente
        ↓
Claude rellena los templates de Canva
        ↓
Claude exporta las 3 imágenes
        ↓
Juan recibe las 3 imágenes + captions para revisar (por WhatsApp o email)
        ↓
Juan aprueba (responde "ok" o pide ajuste)
        ↓
n8n publica cada uno a la hora programada del calendario
```

**Prompt para Claude (generación batch semanal):**
```
Generar el contenido de la semana [N] del calendario de julio:
- Lunes [fecha]: Pilar [X] — [tema]
- Miércoles [fecha]: Pilar [X] — [tema]
- Viernes [fecha]: Pilar [X] — [tema]

Para cada uno:
1. Generar el JSON de copy completo
2. Rellenar el template de Canva correspondiente
3. Exportar la imagen
4. Mostrarme los 3 posts para revisar antes de programar en n8n
```

---

## Orden de ejecución recomendado

| Paso | Qué hacer | Herramienta | Prerequisito |
|---|---|---|---|
| 0 | Configurar Meta Business Manager + tokens | Manual (vos) | Cuenta IG business |
| 1 | Conectar MCP de Canva en Cowork | Manual (vos) | Canva Pro |
| 2 | Crear templates de BLStudio en Canva | Claude + Canva MCP | MCP conectado |
| 3 | Generar copy del primer post | Claude | — |
| 4 | Rellenar template y exportar imagen | Claude + Canva MCP | Templates listos |
| 5 | Publicar manualmente el primer post para testear | Manual (vos) | Imagen lista |
| 6 | Armar flujo n8n para autopublicar | Claude + n8n | Meta tokens + n8n |
| 7 | Generar batch de la primera semana | Claude | Todo lo anterior |
| 8 | Activar n8n para publicación automática | Activar en n8n | Flujo testeado |
| 9 | Agregar generación de imágenes IA | Claude + Higgsfield | Posts estáticos funcionando |
| 10 | Agregar Reels con video IA | Claude + Higgsfield/HeyGen | Flujo completo |

---

## Archivos a crear durante el desarrollo

```
boveda_obsidean/
  BLStudio — Plan estratégico gastronomía.md   ✅ hecho
  BLStudio — Plan de desarrollo sistema IG.md   ✅ este archivo

Cowork_claude/
  blstudio-ig/
    canva-templates.json     ← IDs de templates (Fase 1)
    content-queue/           ← JSONs de copy generados (Fase 2)
      2026-07-lun-sem1.json
      2026-07-mie-sem1.json
      ...
    exports/                 ← Imágenes exportadas de Canva (Fase 3)
    n8n-workflows/           ← JSONs para importar en n8n (Fase 5)
      publish-image.json
      publish-reel.json
```

---

## Métricas a trackear (en el dashboard)

Una vez que el sistema esté andando, medir:
- Posts publicados vs planificados (tasa de ejecución)
- Followers ganados por semana
- Alcance por pilar (qué pilar rinde más)
- DMs recibidos desde contenido (conversiones al funnel)
- Qué formato convierte más (Historia / Carrusel / Reel)

---

## Notas técnicas importantes

### Meta Graph API — límites a tener en cuenta
- Máximo **25 posts por día** en Instagram via API
- Los Reels via API requieren que el video esté en una URL pública accesible
- El token long-lived dura **60 días** — hay que renovarlo o automatizar la renovación
- Para videos: hay que esperar a que Meta procese el container antes de publicar (puede tardar 1-5 min)

### Canva API — consideraciones
- La API de Canva permite rellenar campos de texto y exportar, pero no crear templates desde cero programáticamente — los templates hay que crearlos una vez manualmente en el editor de Canva
- El MCP de Canva en Cowork hace todo esto disponible para Claude directamente

### n8n — consejo de arquitectura
- Usar **variables de entorno** en n8n para los tokens (nunca hardcodear)
- Separar el workflow de "generar contenido" del de "publicar" — son dos flujos distintos
- Agregar un nodo de **error handling** para que si falla la publicación, notifique en lugar de quedar silencioso

---

## Conexiones (bóveda)

[[BLStudio — Plan estratégico gastronomía]] · [[09 - Estrategia IG]] · [[06 - BLStudio Marca]] · [[05 - Banco de ideas]]
