# BLStudio

Este repo agrupa 3 subsistemas independientes de BLStudio. Cada uno tiene su propio README con el detalle — esto es solo el punto de entrada.

| Carpeta | Qué es | Empezar por |
|---|---|---|
| [`blstudio_plan/`](blstudio_plan/BLStudio%20%E2%80%94%20B%C3%B3veda/00%20%E2%80%94%20Empezar%20ac%C3%A1.md) | Vault de Obsidian: estrategia, modelo de negocio, brief del CRM, plan de contenido | `BLStudio — Bóveda/00 — Empezar acá.md` |
| [`blstudio-ig-system/`](blstudio-ig-system/README.md) | Motor de contenido IG: generación de imágenes, render, publicación vía n8n, voz de marca | `blstudio-ig-system/README.md` |
| [`blstudio-crm/`](blstudio-crm/README.md) | Panel de gestión (CRM): Laravel API + React + Supabase | `blstudio-crm/README.md` |

Ver [`MAPA-DEL-PROYECTO.md`](MAPA-DEL-PROYECTO.md) para el detalle de qué contiene cada carpeta, qué se limpió y por qué.

## Cómo se relacionan

`blstudio_plan/` es la fuente de verdad de la estrategia y la voz de marca. `blstudio-ig-system/` ejecuta esa estrategia en Instagram (genera y publica contenido). `blstudio-crm/` es el panel donde los 2 socios gestionan todo el ciclo (contenido → ventas → clientes → campañas) — incluye un autopilot semanal que lee la voz de marca de `blstudio-ig-system/content/prompts/` y escribe directamente en la tabla `posts` que el panel muestra.
