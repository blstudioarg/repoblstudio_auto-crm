# BLStudio — PROJECT BRIEF
**Proyecto:** Sistema de contenido IG automatizado para vertical gastronomía  
**Versión:** 1.0  
**Fecha:** junio 2026  
**Owner:** bigligas / BLStudio  
**Status:** 🟡 En planificación

---

## 1. Resumen ejecutivo

BLStudio necesita un sistema de producción y publicación de contenido para Instagram que sea profesional, escalable y casi autónomo. El objetivo de negocio detrás del contenido es **conseguir los primeros 10 clientes con mensualidad** (USD 35/mes cada uno = USD 350 MRR).

Este brief define **qué se construye**, **cómo se construye**, **con qué herramientas**, **en qué orden** y **cómo se sabe que está terminado**. Es el documento raíz del proyecto. Todo lo demás (código, assets, workflows) referencia este brief.

---

## 2. Problema que resuelve

| Situación actual | Situación deseada |
|---|---|
| El contenido depende de inspiración y tiempo de Juan | El sistema genera contenido cuando se le pide |
| Cada post se crea desde cero | Cada post usa templates con la identidad BLStudio |
| La publicación es manual | n8n publica automáticamente en el horario programado |
| No hay tracking de qué funciona | Métricas por pilar y formato disponibles |
| El funnel de ventas no está sistematizado | CRM con pipeline Scout→Cerrado activo |

---

## 3. Goals y KPIs

### Goal primario
> **10 clientes con mensualidad activa antes de fin de 2026**  
> Métrica: MRR = USD 350

### Goals secundarios
| Goal | KPI | Meta |
|---|---|---|
| Presencia en IG constante | Posts publicados / mes | 30 (1/día) |
| Audiencia creciente | Followers ganados / mes | ≥ 100 |
| Funnel activo | Prospectos en pipeline | ≥ 10 en todo momento |
| Conversión de contenido | DMs recibidos desde posts | ≥ 5/mes |
| Eficiencia de producción | Tiempo de producción por post | < 30 min |

---

## 4. Alcance del proyecto

### Dentro del scope
- Sistema de generación de copy con Claude (5 pilares de contenido)
- Templates visuales en Canva con identidad BLStudio
- Generación de imágenes IA con **NanoBanana** para posts premium (imágenes estáticas)
- Flujo de exportación y aprobación (Claude → Juan → n8n)
- Autopublicación en Instagram via Meta Graph API con n8n
- Dashboard de control (ya construido en Cowork)
- CRM de prospectos (integrado en dashboard)

### Fuera del scope (por ahora)
- Reels con avatar IA (HeyGen) — Fase futura
- Gestión de comentarios / DMs automática
- Analytics avanzado (futura integración con Meta Business Suite)
- Contenido para otras plataformas (TikTok, LinkedIn)

---

## 5. Stack técnico

| Herramienta | Rol | Estado |
|---|---|---|
| **Claude (Cowork)** | Generación de copy, coordinación del flujo, relleno de templates | ✅ Disponible |
| **Canva Pro + MCP** | Templates visuales, exportación de imágenes | 🔴 Pendiente conectar |
| **NanoBanana Pro** | Generación de imágenes IA para posts premium ($23.9/mes, ~150 img/mes) | 🔴 Pendiente integrar via API |
| **Higgsfield** | Generación de video IA para Reels (Fase futura, créditos por video) | ✅ Conectado en Cowork |
| **n8n** | Orquestación: toma la imagen + caption y publica | 🔴 Pendiente configurar |
| **Meta Graph API** | Publicación en @blstudioarg2026 | 🔴 Pendiente (necesita Meta Business Manager) |
| **Obsidian (bóveda)** | Documentación y planificación del proyecto | ✅ En uso |
| **Cowork Dashboard** | Control de contenido, CRM, métricas | ✅ Construido |

### Diagrama de flujo del sistema

```
┌─────────────────────────────────────────────────────────┐
│                    PRODUCCIÓN (semanal)                  │
│                                                          │
│  Claude genera copy (JSON)                               │
│       ↓                                                  │
│  Claude rellena template Canva via MCP                   │
│       ↓                                                  │
│  [opcional] NanoBanana genera imagen IA del visual       │
│       ↓                                                  │
│  Canva exporta PNG/JPG → URL pública                     │
│       ↓                                                  │
│  Juan revisa y aprueba (pasa el OK)                      │
│       ↓                                                  │
│  n8n programado en el horario del calendario             │
│       ↓                                                  │
│  Meta Graph API → Publicado en @blstudioarg2026 ✅    │
└─────────────────────────────────────────────────────────┘
```

---

## 6. Identidad visual (Design System tokens)

Estos valores son los únicos que se usan en todos los assets. Claude y Canva los aplican siempre iguales.

```json
{
  "brand": {
    "name": "BLStudio",
    "handle": "@blstudioarg2026",
    "tagline": "tu negocio, primero en Google"
  },
  "colors": {
    "background": "#0a0a0a",
    "accent": "#a8ff3e",
    "text_primary": "#ffffff",
    "text_secondary": "#888888",
    "text_muted": "#444444"
  },
  "typography": {
    "primary": "Inter / system bold",
    "weight_headline": 900,
    "weight_body": 400,
    "style": "minimal, bold, impactante"
  },
  "tone": "aliado directo · sin chamuyo técnico · argentino · de igual a igual",
  "avoid": ["diseño web", "stack", "framework", "solución tecnológica", "gurú"],
  "use_instead": ["sistema", "pedidos", "clientes", "plata", "que funciona"]
}
```

---

## 7. Content system

### Los 5 pilares y su calendario

| Pilar | Tema | Días asignados |
|---|---|---|
| P1 — SEO/Google | Visibilidad, Google Business, reseñas | Lun semanas 1 y 3 |
| P2 — Organización | WhatsApp vs sistema, cocina en tiempo real | Lun semanas 2 y 4 |
| P3 — Fidelización | Figuritas, puntos, el cliente que vuelve | Vie semanas 2 y 4 |
| P4 — Errores comunes | Situaciones donde el dueño se reconoce | Mié semanas 1 y 3 |
| P5 — Casos reales | Tcocina, Doña Clara, capturas SEO | Vie semanas 1 y 3 |

### Formatos por día

| Día | Formato | Dimensiones | Template |
|---|---|---|---|
| Lunes | Historia | 1080 × 1920 px | `template-historia-[pilar].canva` |
| Miércoles | Carrusel (3-5 slides) | 1080 × 1080 px | `template-carrusel-[pilar].canva` |
| Viernes | Reel thumbnail | 1080 × 1920 px | `template-reel-[pilar].canva` |

### Schema de un post (el JSON estándar)

Cada post generado por Claude sigue este schema. Es el contrato entre la Fase de generación (Claude) y la Fase de publicación (n8n).

```json
{
  "post_id": "2026-07-lun-sem1",
  "date": "2026-07-30",
  "time": "10:00",
  "pillar": 1,
  "topic": "Si no aparecés en Google, no existís",
  "format": "Historia",
  "canva_template_id": "...",
  "caption": "...",
  "slide_texts": ["Texto slide 1", "Texto slide 2", "..."],
  "hashtags": ["#gastronomia", "#hamburgueseria", "..."],
  "visual_brief": "Descripción de qué mostrar en la imagen",
  "image_url": "",
  "status": "draft",
  "approved": false,
  "published_at": null
}
```

**Status lifecycle:** `draft` → `generated` → `approved` → `scheduled` → `published`

---

## 8. Arquitectura de carpetas del proyecto

Esta es la estructura que tiene que existir en `Cowork_claude/blstudio-ig-system/` al terminar el desarrollo.

```
blstudio-ig-system/
│
├── README.md                        ← entrada al proyecto, cómo ejecutar cada fase
├── .env.example                     ← variables de entorno necesarias (sin valores reales)
│
├── docs/                            ← toda la documentación
│   ├── brief.md                     ← este archivo (fuente de verdad)
│   ├── architecture.md              ← diagrama técnico detallado del flujo
│   ├── design-system.md             ← tokens, guía visual, ejemplos
│   ├── content-strategy.md          ← los 5 pilares, ejemplos de copy, tono
│   └── meta-api-guide.md            ← instrucciones para configurar Meta Business
│
├── design/
│   ├── brand/
│   │   ├── logo-blstudio.svg        ← logo oficial en SVG
│   │   ├── color-palette.png        ← paleta visual de referencia
│   │   └── tokens.json              ← design tokens (colores, tipografía)
│   └── templates/
│       ├── template-ids.json        ← IDs de todos los templates en Canva
│       ├── historia-p1-seo.canva    ← referencia (el original vive en Canva)
│       ├── historia-p2-org.canva
│       ├── historia-p3-fid.canva
│       ├── historia-p4-err.canva
│       ├── historia-p5-casos.canva
│       ├── carrusel-p1-seo.canva
│       ├── carrusel-p2-org.canva
│       ├── carrusel-p3-fid.canva
│       ├── carrusel-p4-err.canva
│       ├── carrusel-p5-casos.canva
│       └── reel-thumbnail.canva
│
├── content/
│   ├── prompts/
│   │   ├── master-copy-prompt.md    ← el prompt maestro para generar copy con Claude
│   │   ├── image-gen-prompt.md      ← el prompt para NanoBanana
│   │   └── reel-script-prompt.md    ← el prompt para scripts de Reels
│   ├── calendar/
│   │   └── julio-2026.json          ← el calendario mensual con los 12 posts
│   └── queue/                       ← posts generados esperando aprobación
│       ├── 2026-07-lun-sem1.json
│       ├── 2026-07-mie-sem1.json
│       ├── 2026-07-vie-sem1.json
│       └── ...
│
├── assets/
│   ├── images/                      ← imágenes exportadas de Canva / generadas por IA
│   │   └── 2026-07-lun-sem1.png
│   └── videos/                      ← Reels generados (Fase futura)
│
└── automation/
    ├── n8n/
    │   ├── workflow-publish-image.json   ← importar en n8n para publicar posts estáticos
    │   ├── workflow-publish-reel.json    ← importar en n8n para Reels (Fase futura)
    │   └── workflow-weekly-trigger.json  ← trigger semanal de generación de contenido
    ├── canva/
    │   └── template-ids.json            ← mismo que design/templates/ (symlink)
    └── meta/
        └── config.example.json          ← estructura del config (sin tokens reales)
```

---

## 9. Roadmap de desarrollo

### Fase 0 — Setup de infraestructura
**Prerequisito de todo lo demás. Manual, sin Claude.**

- [ ] Crear cuenta Meta Business Manager
- [ ] Conectar @blstudioarg2026 como Instagram Business Account
- [ ] Crear App en developers.facebook.com
- [ ] Obtener `INSTAGRAM_ACCESS_TOKEN` (long-lived, válido 60 días)
- [ ] Obtener `INSTAGRAM_ACCOUNT_ID`
- [ ] Crear cuenta n8n Cloud (n8n.io)
- [ ] Activar Canva Pro y conectar el MCP de Canva en Cowork
- [ ] Crear la carpeta `blstudio-ig-system/` en Cowork_claude

**Definition of done:** tenés los 2 tokens de Meta guardados + n8n corriendo + Canva MCP activo en Cowork.

---

### Fase 1 — Estructura del proyecto y design system
**Con Claude. Estimado: 1 sesión de 30 min.**

- [ ] Crear todos los archivos de `docs/` con su contenido
- [ ] Crear `design/brand/tokens.json` con los valores del design system
- [ ] Crear `.env.example` con las variables requeridas
- [ ] Crear `README.md` con instrucciones de uso
- [ ] Crear `content/calendar/julio-2026.json` con los 12 posts estructurados

**Prompt para esta fase:**
```
Tengo la carpeta blstudio-ig-system/ creada en Cowork_claude.
Siguiendo el PROJECT BRIEF de la bóveda, crear toda la estructura 
de archivos de las Fases 0 y 1: docs/, design/brand/, .env.example, 
README.md y content/calendar/julio-2026.json.
```

**Definition of done:** `ls` de la carpeta muestra la estructura completa con todos los archivos de Fase 0 y 1.

---

### Fase 2 — Templates de Canva
**Con Claude + Canva MCP. Estimado: 1 sesión de 45 min.**

- [ ] Crear los 10 templates en Canva (5 pilares × 2 formatos: Historia + Carrusel)
- [ ] Registrar todos los IDs en `design/templates/template-ids.json`
- [ ] Verificar que cada template tenga los placeholders de texto correctos

**Prompt para esta fase:**
```
Usando el MCP de Canva conectado, crear los templates de BLStudio.
Design system: docs/design-system.md
Crear: historia + carrusel para cada uno de los 5 pilares (10 templates total).
Registrar los IDs en design/templates/template-ids.json.
```

**Definition of done:** `template-ids.json` tiene 10 entradas con IDs válidos de Canva.

---

### Fase 3 — Generación del primer post end-to-end
**Con Claude. Estimado: 1 sesión de 20 min.**

- [ ] Generar el JSON de copy del primer post (lun sem 1)
- [ ] Rellenar el template de Canva con el copy via MCP
- [ ] Exportar la imagen
- [ ] Guardar el JSON en `content/queue/2026-07-lun-sem1.json`
- [ ] Guardar la imagen en `assets/images/2026-07-lun-sem1.png`
- [ ] **Publicar manualmente** en Instagram para testear que la imagen y el caption funcionan

**Prompt para esta fase:**
```
Generar el primer post del calendario julio-2026.json (lun-sem1).
1. Generar copy completo en schema JSON estándar
2. Rellenar template de Canva y exportar
3. Guardar archivos en las carpetas correctas
4. Mostrarme el caption y la imagen para aprobar antes de publicar
```

**Definition of done:** post publicado manualmente en @blstudioarg2026 con la imagen de Canva y el caption generado.

---

### Fase 4 — Workflow n8n de autopublicación
**Con Claude + n8n. Estimado: 1 sesión de 45 min.**

- [ ] Crear el workflow `workflow-publish-image.json` en n8n
- [ ] Configurar las variables de entorno (tokens de Meta) en n8n
- [ ] Testear el workflow con el segundo post del calendario
- [ ] Verificar que publica correctamente en Instagram
- [ ] Exportar el workflow JSON y guardarlo en `automation/n8n/`

**Prompt para esta fase:**
```
Tengo n8n Cloud en [URL] con los tokens de Meta configurados.
Crear el workflow de autopublicación para posts estáticos:
1. Trigger: manual (por ahora) 
2. Leer el JSON del post desde content/queue/
3. Subir imagen a Meta Graph API como media container
4. Esperar procesamiento
5. Publicar el container
6. Actualizar el status del post a "published"
Darme el JSON del workflow para importar en n8n.
```

**Definition of done:** el workflow publica un post en Instagram sin intervención manual más allá de apretar "run" en n8n.

---

### Fase 5 — Batch semanal y aprobación
**Con Claude. Estimado: 30 min cada semana.**

- [ ] Definir el proceso semanal de producción
- [ ] Crear prompt de generación batch (3 posts en una sesión)
- [ ] Testear el flujo completo: generación → exportación → revisión → publicación

**Proceso semanal (domingo a la noche):**
```
1. Abrir Cowork, nueva sesión
2. Prompt: "Generar los 3 posts de la semana [N] del calendario julio-2026.json"
3. Claude genera los 3 JSONs + exporta las 3 imágenes
4. Juan revisa cada imagen y caption → aprueba o pide ajuste
5. Activar los 3 nodos de n8n con los horarios del calendario
6. Los posts se publican solos en el horario programado
```

**Definition of done:** primera semana completa publicada via este proceso.

---

### Fase 6 — Imágenes IA con NanoBanana (posts premium)
**Con Claude + NanoBanana API. Estimado: 1 sesión de 30 min.**

**Por qué NanoBanana sobre Higgsfield para imágenes:**
- NanoBanana Pro: $23.9/mes → ~150 imágenes/mes → $0.16/imagen
- Higgsfield: enfocado en video, créditos se agotan rápido con imágenes
- Para 12 posts/mes con imagen IA, NanoBanana cuesta < $2/mes vía API

**Dos modos de uso:**
- **Modo manual (arranque):** generar en nanobanana.io, descargar, subir a `assets/images/`
- **Modo API (automatizado):** Claude llama a la API de NanoBanana con el prompt, descarga la imagen y la pasa al template de Canva

- [ ] Definir qué posts usan imagen IA vs template Canva (Pilar 5 = siempre IA)
- [ ] Crear `content/prompts/image-gen-prompt.md` con el prompt base gastronómico
- [ ] Generar la primera imagen en NanoBanana y combinarla con el template de Canva
- [ ] Decidir si integrar via API o mantener el paso manual de descarga

**Prompt base NanoBanana para gastronomía argentina:**
```
[visual_brief del post]. Fotografía gastronómica argentina, 
luz dramática, colores cálidos, alta calidad, realista. 
Fondo oscuro. NO diseño gráfico genérico.
```

**Definition of done:** el post de Pilar 5 (Casos reales) tiene imagen NanoBanana integrada en el template de Canva y publicada en IG.

---

### Fase 7 — Trigger automático semanal (full autopilot)
**Con Claude + n8n. Estimado: 1 sesión de 30 min.**

- [ ] Crear el workflow `workflow-weekly-trigger.json` en n8n
- [ ] El trigger corre todos los domingos a las 20:00
- [ ] Lee el calendario de la semana siguiente
- [ ] Genera los posts via webhook a Claude (o los lee de la queue ya preparada)
- [ ] Notifica a Juan para revisión (WhatsApp o email)
- [ ] Espera aprobación antes de programar

**Definition of done:** el sistema corre solo los domingos y Juan solo revisa y aprueba.

---

## 10. Variables de entorno requeridas

Guardar en `.env` (nunca commitear):

```bash
# Meta / Instagram
INSTAGRAM_ACCESS_TOKEN=
INSTAGRAM_ACCOUNT_ID=
META_APP_ID=
META_APP_SECRET=

# Canva
CANVA_API_KEY=

# n8n (si se usa webhook)
N8N_WEBHOOK_URL=
N8N_API_KEY=
```

---

## 11. Definition of Done — criterios de éxito del proyecto completo

El sistema está terminado cuando:

1. ✅ Los 12 posts de julio están publicados en @blstudioarg2026
2. ✅ Cada post tardó < 30 min de trabajo activo de Juan
3. ✅ El workflow de n8n publica sin errores en el horario programado
4. ✅ Al menos 1 DM recibido desde contenido en el mes
5. ✅ El pipeline de CRM tiene ≥ 5 prospectos activos
6. ✅ Al menos 1 cliente nuevo cerrado en el primer mes de contenido activo

---

## 12. Riesgos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Token de Meta expira (60 días) | Alta | Alto | Automatizar renovación en n8n o recordatorio mensual |
| Canva API cambia pricing/límites | Media | Medio | Tener backup manual de templates exportados |
| Post rechazado por Meta (contenido) | Baja | Bajo | Revisar guidelines de Meta antes de publicar |
| n8n Cloud tiene downtime | Baja | Medio | Backup: publicación manual desde el JSON generado |
| El contenido no convierte | Media | Alto | Medir DMs por pilar, ajustar los de menor conversión |

---

## 13. Sesiones de trabajo con Claude — guía de uso

### Cómo arrancar cada sesión
```
Contexto: soy bigligas, BLStudio. Estamos ejecutando el sistema de contenido IG 
para @blstudioarg2026. El PROJECT BRIEF está en:
boveda_obsidean/BLStudio — PROJECT BRIEF.md

Hoy vamos a trabajar en la Fase [N]: [descripción].
```

### Una sesión = una fase
No mezclar fases en la misma sesión. Cada sesión arranca, termina una fase, y termina.

### El JSON del post es el artefacto central
Siempre que Claude genere un post, tiene que terminar con el JSON completo guardado en `content/queue/`. Ese JSON es lo que n8n lee para publicar.

---

## Conexiones (bóveda)

[[BLStudio — Plan estratégico gastronomía]] · [[BLStudio — Plan de desarrollo sistema IG automatizado]] · [[09 - Estrategia IG]] · [[06 - BLStudio Marca]] · [[07 - Modelo de negocio]]
