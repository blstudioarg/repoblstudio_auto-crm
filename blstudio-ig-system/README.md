# blstudio-ig-system

Sistema de producción y publicación de contenido para Instagram (@blstudioarg2026) de BLStudio. Convierte la estrategia de contenido en posts reales de forma semi-automatizada: **Claude genera el copy → un generador arma el visual con la identidad de marca → Juan aprueba → n8n publica vía Meta Graph API**.

La fuente de verdad estratégica es el **PROJECT BRIEF** en la bóveda de Obsidian (`BLStudio — Bóveda/`). Esta carpeta es la implementación técnica.

## Estructura

```
blstudio-ig-system/
├── docs/            ← arquitectura, design system, estrategia, guía Meta, pipeline de render
├── design/          ← brand tokens + nota de templates
├── content/         ← prompts, calendario mensual, queue de 12 posts (copy)
├── automation/
│   ├── render/      ← generador de visuales (HTML Studio) + render a PNG  ← NUEVO
│   ├── nanobanana/  ← imágenes IA hero (Nano Banana Pro / Gemini)
│   ├── meta/        ← config de Meta Graph API
│   └── n8n/         ← workflows de publicación (imagen, carrusel, reel, trigger)
└── assets/
    ├── historias/<post_id>/   ← index.html + cover.png + png/slide-NN.png
    ├── carruseles/<post_id>/  ← idem
    ├── reels/<post_id>/       ← idem (cover + storyboard de texto)
    └── images/<post_id>-<role>.b64  ← fotos IA embebibles (cover/cta)
```

## Flujo de producción (Carrusel Studio)

1. El copy de cada post vive en `content/queue/<post_id>.json` (caption, slide_texts, hashtags, visual_brief).
2. `automation/render/build.py` lee la queue y genera un **HTML autodescargable** por post con la identidad de marca (negro #0a0a0a + lima #a8ff3e, Space Grotesk / Inter / IBM Plex Mono, fuentes embebidas → funciona offline). Tres layouts: Historia/Reel 1080×1920, Carrusel 1080×1350.
3. `automation/render/render.py` rasteriza cada slide a **PNG** (HTML → WeasyPrint → PDF → PyMuPDF), sin necesidad de navegador.
4. `automation/nanobanana/gen_images.py` genera las **fotos IA hero** (portadas y cierres) con Nano Banana Pro y las deja en `assets/images/` como `.b64`; al volver a correr build+render, quedan embebidas.
5. Juan revisa caption + slides y aprueba (`status: approved`).
6. n8n publica en el horario del calendario (`content/calendar/julio-2026.json`).

Detalle completo en `docs/render-pipeline.md`.

## Cómo regenerar todo

```bash
# 1) (opcional) imágenes IA hero — requiere la API key de Nano Banana Pro (Gemini)
NANOBANANA_API_KEY=tu_key python3 automation/nanobanana/gen_images.py

# 2) armar los HTML de los 12 posts
python3 automation/render/build.py

# 3) renderizar todos los slides a PNG
python3 automation/render/render.py
```

Para un solo post: pasar el `post_id`, ej. `python3 automation/render/build.py 2026-07-vie-sem3`.

## Estado de las fases

| Fase | Qué | Estado |
|---|---|---|
| 0 | Setup Meta + n8n | ⏳ Manual (tuyo) — requiere cuentas/tokens |
| 1 | Estructura + design system | ✅ Hecha |
| 2 | Visuales de marca | ✅ Reemplazado Canva por **Carrusel Studio** (HTML→PNG), generador propio |
| 3 | Primer post end-to-end | ✅ Carrusel mié-sem1 con fotos IA |
| 4 | Workflows n8n (imagen, carrusel, reel, trigger) | ✅ Hechos |
| 5 | Batch del mes | ✅ **12 posts**: copy + HTML + 68 PNG renderizados |
| 6 | Imágenes IA (Nano Banana Pro) | ◐ Pipeline listo; mié-sem1 con foto. Resto: correr `gen_images.py` con la API key |
| 7 | Trigger automático | ✅ Template `workflow-weekly-trigger.json` |

## Lo único que falta para 100%

- **Fotos IA en las 11 portadas restantes:** correr `gen_images.py` con `NANOBANANA_API_KEY` y volver a build+render (1 comando, todo cableado).
- **Publicación real:** cargar tokens de Meta + activar n8n (Fase 0, pasos que dependen de tus cuentas).
